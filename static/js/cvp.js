/* Shared by the project page and the gallery:
   scene metadata, the episode view (start, goal, rollouts, synthesized videos), and synced video playback. */
(function () {
  // Listed in display order. n start states x n goal states per scene;
  // `ind` lists the start-goal pairs seen in training.
  const SCENES = {
    puzzle: { title: 'Puzzle', n: 8, ind: [[0, 0], [1, 6], [2, 5], [3, 4], [4, 3], [5, 2], [6, 1], [7, 7]] },
    drawer: { title: 'Drawer', n: 4, ind: [[0, 0], [1, 2], [2, 1], [3, 3]] },
    cube: { title: 'Cube', n: 4, ind: [[0, 0], [1, 2], [2, 1], [3, 3]] },
    tool_use: { title: 'Tool-Use', n: 2, ind: [[0, 0], [1, 1]] },
  };

  const isInd = (scene, s, g) => SCENES[scene].ind.some(([a, b]) => a === s && b === g);
  const splitChip = ind => `<span class="chip${ind ? '' : ' is-ood'}">${ind ? 'IND' : 'OOD'}</span>`;

  const play = v => { v.muted = true; const p = v.play(); if (p) p.catch(() => { }); };

  /* Plays every visible video under `root` from the same start, pauses them off screen,
     and starts them over together once all have finished. */
  function syncGroup(root) {
    let visible = false, timer = 0;
    const all = () => [...root.querySelectorAll('video')];
    const live = () => all().filter(v => v.getAttribute('src') && !v.closest('[hidden]'));

    function restart() {
      clearTimeout(timer);
      all().forEach(v => v.pause());
      live().forEach(v => { v.currentTime = 0; if (visible) play(v); });
    }

    root.addEventListener('ended', () => {
      if (!live().every(v => v.ended)) return;
      clearTimeout(timer);
      timer = setTimeout(restart, 1500);
    }, true);

    const io = new IntersectionObserver(entries => {
      visible = entries[entries.length - 1].isIntersecting;
      if (!visible) { all().forEach(v => v.pause()); return; }
      if (live().every(v => v.ended)) restart();
      else live().forEach(v => { if (!v.ended) play(v); });
    }, { threshold: 0.15 });
    io.observe(root);

    return {
      restart,
      destroy() { io.disconnect(); clearTimeout(timer); all().forEach(v => v.pause()); },
    };
  }

  const tile = (label, media, ours) =>
    `<figure class="tile">${media}<figcaption class="tag${ours ? ' is-ours' : ''}">${label}</figcaption></figure>`;
  const video = (attr, src, what) =>
    `<video muted playsinline preload="metadata" ${attr}="${src}" aria-label="${what}"></video>`;

  /* One evaluation episode. `rec` is an entry of materials/evals/index.json; `base` prefixes its paths.
     Start image, goal image and the policy rollouts show first; a button reveals the synthesized videos. */
  function episode(rec, base = '') {
    const u = p => base + p;
    const el = document.createElement('div');
    el.innerHTML = `
      <div class="episode">
        <div class="eyebrow">Start and goal</div>
        <div class="eyebrow span-2">Policy rollout</div>
        <div class="episode-side">
          ${tile('Start', `<img src="${u(rec.start_img)}" alt="Start image">`)}
          ${tile('Goal', `<img src="${u(rec.goal_img)}" alt="Goal image">`)}
        </div>
        ${tile('DiffCollage', video('src', u(rec.pr.diffcollage), 'DiffCollage policy rollout'))}
        ${tile('Ours', video('src', u(rec.pr.ours), 'Policy rollout of our method'), true)}
        <div class="episode-more">
          <button class="btn" type="button" aria-expanded="false">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 2.5 11.5 8 5 13.5z"/></svg>
            <span>Show synthesized videos</span>
          </button>
        </div>
      </div>
      <div class="episode episode-plans" hidden>
        <span></span>
        <div class="eyebrow span-2">Synthesized video</div>
        <p class="caption">The video plan each rollout follows, rendered without ray tracing.</p>
        ${tile('DiffCollage', video('data-src', u(rec.sv.diffcollage), 'Video synthesized by DiffCollage'))}
        ${tile('Ours', video('data-src', u(rec.sv.ours), 'Video synthesized by our method'), true)}
      </div>`;

    const group = syncGroup(el);
    const btn = el.querySelector('.episode-more .btn');
    const plans = el.querySelector('.episode-plans');
    btn.addEventListener('click', () => {
      const open = plans.hidden;
      plans.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
      btn.querySelector('span').textContent = open ? 'Hide synthesized videos' : 'Show synthesized videos';
      plans.querySelectorAll('video[data-src]').forEach(v => { v.src = v.dataset.src; v.removeAttribute('data-src'); });
      group.restart();  // plan and rollout start together, so they can be compared
    });

    return { el, group };
  }

  window.CVP = { SCENES, isInd, splitChip, episode, syncGroup };
})();
