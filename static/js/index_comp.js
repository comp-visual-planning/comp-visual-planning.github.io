/* ===========================
 * Compositional Eval Sections
 * One task = one section; each section has two slides (IND / OOD).
 * Uses materials/evals/index.json built offline by the Python script.
 * =========================== */

(function () {
  // --- Task meta (start/goal counts and IND pairs)
  const ENV_META = {
    cube: {
      starts: 4, goals: 4,
      indist: [[0, 0], [1, 2], [2, 1], [3, 3]],
      title: 'Cube',
      footer: {
        title: 'Qualitative Illustration — Cube Scene',
        text: `16 tasks in total: 4 in-distribution (IND) with demonstrations and 12 out-of-distribution (OOD) without demonstrations.
We compose 5 factors (models) to solve these tasks.
Motor skill: fine-grained, contact-rich manipulation.
Sequential reasoning: first rearrange, then stack to reach different goal configurations.`
      }
    },

    drawer: {
      starts: 4, goals: 4,
      indist: [[0, 0], [1, 2], [2, 1], [3, 3]],
      title: 'Drawer',
      footer: {
        title: 'Qualitative Illustration — Drawer Scene',
        text: `16 tasks in total: 4 IND with demonstrations and 12 OOD without demonstrations.
    We compose 5 factors (models).
    Motor skill: precise, contact-rich interaction with the drawer handle and accurate drawing.
    Sequential reasoning: acquire the pen first, avoid collisions with drawer, then draw the target patterns for different goals.`
      }
    },

    puzzle: {
      starts: 8, goals: 8,
      indist: [[0, 0], [1, 6], [2, 5], [3, 4], [4, 3], [5, 2], [6, 1], [7, 7]],
      title: 'Puzzle',
      footer: {
        title: 'Qualitative Illustration — Puzzle Scene',
        text: `64 tasks in total: 8 IND with demonstrations and 56 OOD without demonstrations.
We compose 6 factors (models).
Motor skill: precise, contact-rich grasp/placement of puzzle pieces.
Sequential reasoning: rearrange and then assemble into the target configuration, choosing different assembly orders based on the start and goal.`
      }
    },

    tool_use: {
      starts: 2, goals: 2,
      indist: [[0, 0], [1, 1]],
      title: 'Tool-Use',
      footer: {
        title: 'Qualitative Illustration — Tool-Use Scene',
        text: `4 tasks in total: 2 IND with demonstrations and 2 OOD without demonstrations.
We compose 3 factors (models).
Motor skill: accurate, contact-rich manipulation of the tool and tool-object interaction.
Sequential reasoning: arrange objects, obtain the tool first, then use it to achieve different goals.`
      }
    },
  };

  let INDEX = null; // loaded from materials/evals/index.json

  const pairKey = (s, g) => `${s}_${g}`;
  const isInd = (env, s, g) => ENV_META[env].indist.some(([a, b]) => a === s && b === g);
  function buildFooter(env) {
    const meta = ENV_META[env] || {};
    const f = meta.footer || {};

    // 如果你用了 footerHTML，就优先渲染整段 HTML
    if (meta.footerHTML) {
      return `<div class="section-footer">${meta.footerHTML}</div>`;
    }

    // 否则用 title + text（提供默认回退，避免漏配）
    const title = f.title || `Qualitative Illustration — ${meta.title || env}`;
    const text = f.text || `${meta.starts || '?'} starts × ${meta.goals || '?'} goals → ${(meta.starts && meta.goals) ? (meta.starts * meta.goals) : '?'
      } tasks.`;

    return `
    <div class="section-footer">
      <b>${title}</b>
      <span> ${text}</span>
    </div>
  `;
  }
  // ---------- DOM builders ----------
  function buildSectionHTML(env) {
    const human = ENV_META[env].title;
    return `
    <section class="section" id="sec-${env}">
      <div class="container is-max-desktop">
        <div class="columns is-centered">
          <div class="column is-full-width">
            <h2 class="title is-4">Qualitative Results in ${human} Scene</h2>

            <section class="hero is-light is-small" style="margin:0; padding:0;">
              <div class="container is-max-desktop" style="margin:0; padding:0;">
                <div class="hero-body" style="margin:0; padding:10px 0;">

                  <div class="container is-max-desktop" style="overflow:hidden; margin:0;">
                    <div id="splide-${env}" class="splide">
                      <div class="splide__track">
                        <ul class="splide__list">

                          <li class="splide__slide">
                            <div class="container bg-3">
                              <div style="display:flex; justify-content:center;">
                                <span class="tag is-info is-light is-medium">In-Distribution Evaluation</span>
                                <span class="tag is-medium" style="background:transparent; border:none; box-shadow:none; padding:0;">
                                  <i>(Flip right to Out-of-Distribution.)</i>
                                </span>
                              </div>
                              ${buildControls(env, 'ind')}
                              ${buildTwoRows(env, 'ind')}
                            </div>
                          </li>

                          <li class="splide__slide">
                            <div class="container bg-3">
                              <div style="display:flex; justify-content:center;">
                                <span class="tag is-warning is-light is-medium">Out-of-Distribution Evaluation</span>
                                <span class="tag is-light is-medium" style="background:transparent; border:none; box-shadow:none; padding:0;">
                                  <i>(Flip left to In-Distribution.)</i>
                                </span>
                              </div>
                              ${buildControls(env, 'ood')}
                              ${buildTwoRows(env, 'ood')}
                            </div>
                          </li>

                        </ul>
                      </div>
                    </div>
                  </div> <!-- /.container (overflow hidden) -->

                </div> <!-- /.hero-body -->
              </div> <!-- /.container (hero wrapper) -->
            </section> <!-- /.hero -->
         ${buildFooter(env)}
          </div> <!-- /.column -->
       
        </div> <!-- /.columns -->
      </div> <!-- /.container -->
    </section>`;
  }
  function buildControls(env, page) {
    const containerId = `div_${env}_${page}`;
    return `
    <div class="row centered-caption">

      <span class="ctrl">
        <span>Start:</span>
        <span class="select is-small">
          <select id="${env}-start-${page}"></select>
        </span>
      </span>

      <span class="ctrl">
        <span>Goal:</span>
        <span class="select is-small">
          <select id="${env}-goal-${page}"></select>
        </span>
      </span>

      <span class="ctrl">
        <span>Episode:</span>
        <span class="select is-small">
          <select id="${env}-ep-${page}"></select>
        </span>
      </span>

      <span class="tag ${page === 'ind' ? 'is-info' : 'is-warning'} is-light" id="${env}-badge-${page}">
        ${page === 'ind' ? 'IND' : 'OOD'}
      </span>

      <span class="replay_lb_suc" id="btn_cal_replay_${containerId}" video_section="${containerId}">
        <img src="static/replay.png" />
        <span>replay</span>
      </span>

    </div>`;
  }

  function buildTwoRows(env, page) {
    const containerId = `div_${env}_${page}`;
    return `
    <div class="container is-max-desktop" style="overflow:hidden;margin:0" id="${containerId}">

      <!-- Row 1 -->
      <div class="row3">
        <div class="row3__header--left">Start Image</div>
        <div class="row3__header--right">Synthesized Video</div>
        <div class="cell cell--left">
          <img class="media" id="${env}-start-img-${page}" alt="start image"/>
        </div>

        <div class="cell cell--v1">
          <video class="media" id="${env}-sv-dc-${page}" playsinline autoplay muted preload="metadata"></video>
          <p class="splide_kuka_low_margin_caption">DiffCollage</p>
        </div>

        <div class="cell cell--v2">
          <video class="media" id="${env}-sv-ours-${page}" playsinline autoplay muted preload="metadata"></video>
          <p class="splide_kuka_low_margin_caption">Ours</p>
        </div>
      </div>

      <!-- Row 2 -->
      <div class="row3">
        <div class="row3__header--left">Goal Image</div>
        <div class="row3__header--right">Policy Rollout</div>
        <div class="cell cell--left">
          <img class="media" id="${env}-goal-img-${page}" alt="goal image"/>
        </div>

        <div class="cell cell--v1">
          <video class="media" id="${env}-pr-dc-${page}" playsinline autoplay muted preload="metadata"></video>
          <p class="splide_kuka_low_margin_caption">DiffCollage</p>
        </div>

        <div class="cell cell--v2">
          <video class="media" id="${env}-pr-ours-${page}" playsinline autoplay muted preload="metadata"></video>
          <p class="splide_kuka_low_margin_caption">Ours</p>
        </div>
      </div>

      

    </div>`;
  }


  // ---------- Wiring ----------
  function mountSection(env) {
    const root = document.getElementById('evals-container');
    root.insertAdjacentHTML('beforeend', buildSectionHTML(env));
    // Mount Splide for this env
    const splide = new Splide(`#splide-${env}`, {
      type: 'slide',
      perPage: 1,
      perMove: 1,
      padding: '0rem',
      lazyLoad: 'nearby',
      focus: 0,
      pagination: true,
      breakpoints: { 640: { arrows: false } }
    });

    splide.on('active', (Slide) => {
      const page = (Slide.index === 0) ? 'ind' : 'ood';
      restartSVPR(`div_${env}_${page}`);
    });

    splide.mount();
    wireVideoLifecycleForSplide(splide, document.getElementById(`splide-${env}`));

    // Hook selects for both pages
    setupSelectors(env, 'ind');
    setupSelectors(env, 'ood');
    setupSVThenPROnView(`div_${env}_ind`, 0.75);
    setupSVThenPROnView(`div_${env}_ood`, 0.75);
  }

  // Helper: is this (s,g) allowed under the current split?
  function isAllowedPair(env, s, g, wantInd) {
    const ind = isInd(env, s, g);
    return wantInd ? ind : !ind;
  }

  function setupSelectors(env, page) {
    const meta = ENV_META[env];
    const wantInd = (page === 'ind');

    const sSel = document.getElementById(`${env}-start-${page}`);
    const gSel = document.getElementById(`${env}-goal-${page}`);
    const eSel = document.getElementById(`${env}-ep-${page}`);
    const badge = document.getElementById(`${env}-badge-${page}`);

    // --- CONFIG: set to true if you also want to hide starts that have no valid goals
    const FILTER_STARTS = true;

    // Utility: fill a <select> with options from an array of values
    const fillSelect = (sel, values, labelFmt = (v) => String(v)) => {
      sel.innerHTML = '';
      values.forEach(v => {
        const o = document.createElement('option');
        o.value = v;
        o.text = labelFmt(v);
        sel.appendChild(o);
      });
    };

    // Compute valid starts (those with at least one valid goal under the split)
    const validStarts = [];
    for (let s = 0; s < meta.starts; s++) {
      let ok = false;
      for (let g = 0; g < meta.goals; g++) {
        if (isAllowedPair(env, s, g, wantInd)) { ok = true; break; }
      }
      if (!FILTER_STARTS || ok) validStarts.push(s);
    }

    // If nothing is valid (shouldn't happen), fall back to all starts
    if (validStarts.length === 0) {
      for (let s = 0; s < meta.starts; s++) validStarts.push(s);
    }

    // Fill starts (optionally filtered)
    fillSelect(sSel, validStarts, (v) => `start ${v}`);

    // Function to rebuild goals given the selected start, keeping ONLY allowed pairs
    const rebuildGoals = () => {
      const s = Number(sSel.value);
      const allowedGoals = [];
      for (let g = 0; g < meta.goals; g++) {
        if (isAllowedPair(env, s, g, wantInd)) allowedGoals.push(g);
      }

      // If somehow empty, show all as a fallback, but typically this won't happen
      const list = (allowedGoals.length > 0) ? allowedGoals : Array.from({ length: meta.goals }, (_, i) => i);

      // Refill goal select with only allowed ones
      const prev = Number(gSel.value);
      fillSelect(gSel, list, (v) => `goal ${v}`);
      // Preserve previous selection if still valid; otherwise pick first
      if (list.includes(prev)) gSel.value = String(prev);
    };

    // Choose a default pair matching the split
    let chosen = null;
    outer:
    for (const s of validStarts) {
      for (let g = 0; g < meta.goals; g++) {
        if (isAllowedPair(env, s, g, wantInd)) { chosen = [s, g]; break outer; }
      }
    }
    // If we found one, set it first before rebuilding goals
    if (chosen) {
      sSel.value = String(chosen[0]);
    }

    // Now build goals list strictly (NO disabled options)
    rebuildGoals();
    if (chosen) {
      // set default goal after it exists in the DOM
      gSel.value = String(chosen[1]);
    }

    // Hook changes
    sSel.onchange = () => { rebuildGoals(); loadEpisodeList(env, page); };
    gSel.onchange = () => loadEpisodeList(env, page);
    eSel.onchange = () => loadMedia(env, page);

    // Badge + initial load
    badge.textContent = wantInd ? 'IND' : 'OOD';
    badge.className = wantInd ? 'tag is-info is-light' : 'tag is-warning is-light';
    loadEpisodeList(env, page);
  }

  function loadEpisodeList(env, page) {
    const sSel = document.getElementById(`${env}-start-${page}`);
    const gSel = document.getElementById(`${env}-goal-${page}`);
    const eSel = document.getElementById(`${env}-ep-${page}`);
    const s = Number(sSel.value), g = Number(gSel.value);
    const pair = INDEX?.[env]?.pairs?.[pairKey(s, g)];
    eSel.innerHTML = '';

    // Show positions 0..5 based on sorted episodes; clamp to available count
    const n = Math.min(6, pair?.episodes?.length || 0);
    for (let i = 0; i < n; i++) {
      const o = document.createElement('option'); o.value = i; o.text = `episode ${i}`; eSel.appendChild(o);
    }
    if (n > 0) { eSel.value = 0; loadMedia(env, page); }
    else { clearMedia(env, page); }
  }

  function clearMedia(env, page) {
    ['sv-dc', 'sv-ours', 'pr-dc', 'pr-ours'].forEach(k => {
      const v = document.getElementById(`${env}-${k}-${page}`); v?.removeAttribute('src'); v?.load?.();
    });
    document.getElementById(`${env}-start-img-${page}`)?.removeAttribute('src');
    document.getElementById(`${env}-goal-img-${page}`)?.removeAttribute('src');
  }

  function loadMedia(env, page) {
    const s = Number(document.getElementById(`${env}-start-${page}`).value);
    const g = Number(document.getElementById(`${env}-goal-${page}`).value);
    const ep = Number(document.getElementById(`${env}-ep-${page}`).value);
    const rec = INDEX?.[env]?.pairs?.[pairKey(s, g)]?.episodes?.[ep];
    if (!rec) { clearMedia(env, page); return; }

    document.getElementById(`${env}-start-img-${page}`).src = rec.start_img || '';
    document.getElementById(`${env}-goal-img-${page}`).src = rec.goal_img || '';

    const setVid = (id, src) => {
      const v = document.getElementById(id);
      if (!v) return;
      if (src) v.dataset.src = src; else delete v.dataset.src;

      const isActiveSlide = !!v.closest('.splide__slide.is-active');
      const needSwap = !!v.src && v.currentSrc !== src;

      if (needSwap) _dehydrateVideo(v);
      if (isActiveSlide && src) _hydrateVideo(v);
    };

    setVid(`${env}-sv-dc-${page}`, rec.sv?.diffcollage || '');
    setVid(`${env}-sv-ours-${page}`, rec.sv?.ours || '');
    setVid(`${env}-pr-dc-${page}`, rec.pr?.diffcollage || '');
    setVid(`${env}-pr-ours-${page}`, rec.pr?.ours || '');

    restartSVPR(`div_${env}_${page}`);
  }



  // ---------- Boot ----------
  document.addEventListener('DOMContentLoaded', async () => {
    // Load the offline-built index
    try {
      const resp = await fetch('materials/evals/index.json', { cache: 'no-store' });
      INDEX = await resp.json();
    } catch (e) {
      console.error('[eval] failed to load index.json', e);
      INDEX = {};
    }

    // Render sections for all tasks
    const order = ['cube', 'drawer', 'puzzle', 'tool_use'];
    order.forEach(mountSection);
  });
})();



// ==== Auto replay on slide change for #splide-mw-qual (no Splide API needed) ====
(function () {
  function ensurePlay(scope) {
    scope.querySelectorAll('video').forEach(v => {
      try { v.pause(); } catch (_) { }
      try { v.currentTime = 0; } catch (_) { }
      if (v.getAttribute('preload') === 'none') v.load();
      const p = v.play?.();
      if (p && typeof p.catch === 'function') p.catch(() => { });
    });
  }

  function pauseAll(root) {
    root.querySelectorAll('video').forEach(v => { try { v.pause(); } catch (_) { } });
  }

  function syncActive(root) {
    const active = root.querySelector('.splide__slide.is-active');
    if (!active) return;
    pauseAll(root);
    ensurePlay(active);
  }

  document.addEventListener('DOMContentLoaded', function () {
    const root = document.getElementById('splide-mw-qual');
    if (!root) return;

    requestAnimationFrame(() => syncActive(root));

    const mo = new MutationObserver(muts => {
      for (const m of muts) {
        if (m.type === 'attributes' && m.attributeName === 'class') {
          const el = /** @type {Element} */ (m.target);
          if (el.classList && el.classList.contains('splide__slide')) {
            syncActive(root);
            break;
          }
        }
      }
    });
    mo.observe(root, { subtree: true, attributes: true, attributeFilter: ['class'] });

    root.querySelectorAll('.replay[video_section]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('video_section');
        const scope = document.getElementById(id);
        if (scope) { pauseAll(root); ensurePlay(scope); }
      });
    });
  });
})();



