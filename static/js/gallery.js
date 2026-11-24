/* Gallery: every evaluation episode of every scene, filtered by scene, task and split.
   The episodes and their index.json live on the per-scene sites (see data-scene-base in gallery.html). */
(function () {
  const { SCENES, isInd, splitChip, episode } = window.CVP;

  const root = document.getElementById('gallery');
  const baseOf = scene => root.dataset.sceneBase.replace('{scene}', scene);
  const $ = id => document.getElementById(id);
  const sceneList = $('scene-list'), matrix = $('matrix'), status = $('status'), pairsEl = $('pairs');
  const viewer = $('viewer'), viewerBody = $('viewer-body'), viewerTitle = $('viewer-title');

  const wanted = new URLSearchParams(location.search).get('scene');
  const state = { scene: SCENES[wanted] ? wanted : Object.keys(SCENES)[0], split: 'all', pair: null, method: 'ours' };
  const data = {};  // scene -> pairs from its index.json, or null if it failed to load

  const keyOf = (s, g) => `${s}_${g}`;
  const count = scene => Object.values(data[scene] || {}).reduce((n, p) => n + p.episodes.length, 0);

  // ----- Tiles load and play only while they are near the viewport
  const near = new Set();
  const play = v => { v.muted = true; const p = v.play(); if (p) p.catch(() => { }); };
  const lazy = new IntersectionObserver(entries => entries.forEach(e => {
    const v = e.target;
    if (e.isIntersecting) {
      near.add(v);
      if (!v.getAttribute('src')) v.src = v.dataset.src;
      if (!viewer.open) play(v);
    } else {
      near.delete(v);
      if (v.getAttribute('src')) { v.pause(); v.removeAttribute('src'); v.load(); }
    }
  }), { rootMargin: '150px 0px' });

  // ----- Sidebar
  function renderScenes() {
    sceneList.innerHTML = Object.keys(SCENES).map(scene => `
      <button type="button" data-scene="${scene}" aria-pressed="${scene === state.scene}">
        <span>${SCENES[scene].title}</span><small>${data[scene] ? count(scene) : ''}</small>
      </button>`).join('');
  }

  function renderMatrix() {
    const n = SCENES[state.scene].n;
    matrix.style.setProperty('--n', n);
    let html = '<span></span>' + Array.from({ length: n }, (_, g) => `<span class="axis">${g}</span>`).join('');
    for (let s = 0; s < n; s++) {
      html += `<span class="axis">${s}</span>`;
      for (let g = 0; g < n; g++) {
        const ind = isInd(state.scene, s, g);
        const dim = state.split !== 'all' && ind !== (state.split === 'ind');
        html += `<button type="button" data-pair="${keyOf(s, g)}" aria-pressed="${state.pair === keyOf(s, g)}"
          class="${ind ? 'is-ind' : ''}${dim ? ' is-dim' : ''}"
          title="start ${s} &rarr; goal ${g} (${ind ? 'IND' : 'OOD'})" aria-label="start ${s}, goal ${g}, ${ind ? 'in' : 'out of'} distribution"></button>`;
      }
    }
    matrix.innerHTML = html;
  }

  const press = (id, attr, value) =>
    $(id).querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset[attr] === value)));

  // ----- Main column: one group of tiles per start-goal pair
  function renderPairs() {
    lazy.disconnect();
    near.clear();
    const pairs = data[state.scene];
    const title = SCENES[state.scene].title;
    if (!pairs) {
      status.textContent = data[state.scene] === null ? `The ${title} episodes could not be loaded.` : 'Loading episodes…';
      pairsEl.innerHTML = '';
      return;
    }
    const n = SCENES[state.scene].n;
    const groups = [];
    for (let s = 0; s < n; s++) for (let g = 0; g < n; g++) {
      const key = keyOf(s, g), ind = isInd(state.scene, s, g);
      if (!pairs[key] || !pairs[key].episodes.length) continue;
      if (state.pair ? state.pair !== key : state.split !== 'all' && ind !== (state.split === 'ind')) continue;
      groups.push({ s, g, key, ind, episodes: pairs[key].episodes });
    }
    const total = groups.reduce((sum, p) => sum + p.episodes.length, 0);
    const method = state.method === 'ours' ? 'our method' : 'DiffCollage';
    status.textContent = `${title}: ${total} episode${total === 1 ? '' : 's'} in ${groups.length} task${groups.length === 1 ? '' : 's'}, rollouts of ${method}.`;

    const base = baseOf(state.scene);
    pairsEl.innerHTML = groups.map(p => `
      <section class="pair">
        <div class="pair-head">
          <span>start ${p.s} &rarr; goal ${p.g}</span> ${splitChip(p.ind)}
          <small>${p.episodes.length} episodes</small>
        </div>
        <div class="pair-grid">
          ${p.episodes.map((rec, i) => `
            <button class="shot" type="button" data-pair="${p.key}" data-i="${i}"
              aria-label="Episode ${i}, start ${p.s}, goal ${p.g}: open the policy rollouts and synthesized videos">
              <span class="tile">
                <video muted loop playsinline preload="none" data-src="${base + rec.pr[state.method]}"></video>
                <span class="tag">episode ${i}</span>
                <span class="tag is-open">Click to open</span>
              </span>
            </button>`).join('')}
        </div>
      </section>`).join('');
    pairsEl.querySelectorAll('video').forEach(v => lazy.observe(v));
  }

  function render() {
    renderScenes();
    renderMatrix();
    press('split', 'split', state.split);
    press('method', 'method', state.method);
    renderPairs();
    // a filter changed while the reader was far down the list: bring the new list into view
    if (status.getBoundingClientRect().top < 0) status.scrollIntoView();
  }

  // ----- Episode viewer
  let open = null;
  function showEpisode(key, i) {
    const [s, g] = key.split('_').map(Number);
    const rec = data[state.scene][key].episodes[i];
    viewerTitle.innerHTML = `${SCENES[state.scene].title} &middot; start ${s} &rarr; goal ${g} ${splitChip(isInd(state.scene, s, g))} episode ${i}`;
    open = episode(rec, baseOf(state.scene));
    viewerBody.replaceChildren(open.el);
    near.forEach(v => v.pause());
    viewer.showModal();
  }
  viewer.addEventListener('close', () => {
    if (open) open.group.destroy();
    open = null;
    viewerBody.replaceChildren();
    near.forEach(play);
  });
  $('viewer-close').addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', e => { if (e.target === viewer) viewer.close(); });  // click on the backdrop

  // ----- Events
  sceneList.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b || b.dataset.scene === state.scene) return;
    Object.assign(state, { scene: b.dataset.scene, split: 'all', pair: null });
    history.replaceState(null, '', `?scene=${state.scene}`);
    render();
  });
  matrix.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    state.pair = state.pair === b.dataset.pair ? null : b.dataset.pair;
    state.split = 'all';
    render();
  });
  $('split').addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    Object.assign(state, { split: b.dataset.split, pair: null });
    render();
  });
  $('method').addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    state.method = b.dataset.method;
    render();
  });
  pairsEl.addEventListener('click', e => {
    const b = e.target.closest('.shot');
    if (b) showEpisode(b.dataset.pair, Number(b.dataset.i));
  });

  // ----- Load the four scene indexes
  render();
  Object.keys(SCENES).forEach(scene => {
    fetch(baseOf(scene) + 'materials/evals/index.json')
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(json => { data[scene] = json[scene].pairs; })
      .catch(() => { data[scene] = null; })
      .then(() => { renderScenes(); if (scene === state.scene) renderPairs(); });
  });
})();
