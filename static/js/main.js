/* Project page: sidebar highlight, tabs, toy example playback, and the evaluation examples. */
(function () {
  const { SCENES, isInd, splitChip, episode, syncGroup } = window.CVP;

  // ----- Equations: KaTeX renders \( inline \) and $$ display $$ math once its scripts have loaded
  document.addEventListener('DOMContentLoaded', () => {
    if (!window.renderMathInElement) return;
    window.renderMathInElement(document.querySelector('main'), {
      delimiters: [{ left: '$$', right: '$$', display: true }, { left: '\\(', right: '\\)', display: false }],
      throwOnError: false,
    });
  });

  // ----- Sidebar: mark the section being read
  const links = [...document.querySelectorAll('.toc a[href^="#"]')];
  const targets = links.map(a => document.getElementById(a.getAttribute('href').slice(1)));
  let ticking = false;
  function spy() {
    ticking = false;
    let current = 0;
    targets.forEach((t, i) => { if (t && t.getBoundingClientRect().top <= 140) current = i; });
    links.forEach((a, i) => a.classList.toggle('is-active', i === current));
  }
  if (links.length) {
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(spy); } }, { passive: true });
    spy();
  }

  // ----- Tabs: buttons with aria-controls pointing at their panels
  function wireTabs(list, onSelect) {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    function select(tab, focus) {
      tabs.forEach(t => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel && panel.dataset.tabPanel !== undefined) panel.hidden = !on;
      });
      if (focus) tab.focus();
      if (onSelect) onSelect(tab);
    }
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', e => {
        const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (step) { e.preventDefault(); select(tabs[(i + step + tabs.length) % tabs.length], true); }
      });
    });
  }

  const benchTabs = document.getElementById('benchmark-tabs');
  if (benchTabs) wireTabs(benchTabs);

  // ----- Toy example: the four videos play in step
  const toy = document.getElementById('toy');
  if (toy) {
    const group = syncGroup(toy);
    document.getElementById('toy-replay').addEventListener('click', group.restart);
  }

  // ----- Evaluations: one in-distribution and one out-of-distribution example per scene
  const view = document.getElementById('eval-view');
  if (!view) return;
  const info = document.getElementById('eval-info');
  const more = document.getElementById('eval-more');
  const splitButtons = [...document.querySelectorAll('#eval-split button')];
  const state = { scene: 'puzzle', split: 'ind' };
  let index = null, current = null;

  function show() {
    if (current) current.group.destroy();
    current = null;
    const pairs = (index && index[state.scene] && index[state.scene].pairs) || {};
    const key = Object.keys(pairs).find(k => {
      const [s, g] = k.split('_').map(Number);
      return isInd(state.scene, s, g) === (state.split === 'ind') && pairs[k].episodes.length;
    });
    const title = SCENES[state.scene].title;
    more.href = `gallery.html?scene=${state.scene}`;
    more.querySelector('span').textContent = `More ${title} episodes in the gallery`;
    if (!key) {
      info.textContent = '';
      view.innerHTML = '<p class="caption">This example could not be loaded.</p>';
      return;
    }
    const [s, g] = key.split('_');
    const rec = pairs[key].episodes[0];
    info.innerHTML = `${splitChip(state.split === 'ind')} start ${s} &rarr; goal ${g}`;
    current = episode(rec);
    view.replaceChildren(current.el);
  }

  wireTabs(document.getElementById('eval-tabs'), tab => { state.scene = tab.dataset.scene; show(); });
  splitButtons.forEach(b => b.addEventListener('click', () => {
    state.split = b.dataset.split;
    splitButtons.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    show();
  }));
  document.getElementById('eval-replay').addEventListener('click', () => current && current.group.restart());

  fetch('materials/evals/index.json')
    .then(r => r.json())
    .then(data => { index = data; })
    .catch(() => { index = {}; })
    .then(show);
})();
