const MAX_HYDRATE = 16;
const _hydrated = new Set();

function _hydrateVideo(v) {
    if (!v || v.src) return;
    if (_hydrated.size >= MAX_HYDRATE) return;
    const src = v.dataset.src;
    if (!src) return;
    _hydrated.add(v);
    v.src = src;
    v.load();
}

function _dehydrateVideo(v) {
    if (!v || !v.src) return;
    try { v.pause(); } catch (_) { }
    v.removeAttribute('src');
    v.load();
    _hydrated.delete(v);
}

function wireVideoLifecycleForSplide(splide, rootEl) {
    function update() {
        const slides = Array.from(rootEl.querySelectorAll('.splide__slide'));
        const idx = splide.index;
        slides.forEach((li, i) => {
            const vids = li.querySelectorAll('video');
            if (Math.abs(i - idx) <= 1) {
                vids.forEach(_hydrateVideo);
            } else {
                vids.forEach(_dehydrateVideo);
            }
        });
    }

    splide.on('mounted move', update);
    update();

    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            const v = e.target;
            if (e.isIntersecting) _hydrateVideo(v);
            else if (!v.closest('.splide__slide.is-active')) _dehydrateVideo(v);
        });
    }, { threshold: 0.6 });

    rootEl.querySelectorAll('video').forEach(v => io.observe(v));
}



document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('splide-mw-qual');
    if (!root) return; // not on this page

    const splide = new Splide('#splide-mw-qual', {
        type: 'slide',
        perPage: 1,
        perMove: 1,
        padding: '0rem',
        lazyLoad: 'nearby',
        focus: 0,
        pagination: true,
        breakpoints: { 640: { arrows: false } },
    });

    // Ensure DOM is ready, then mount and attach the lifecycle hook
    splide.on('mounted', () => {
        // Hydrate only current/adjacent slides; dehydrate the rest
        wireVideoLifecycleForSplide(splide, root);
    });

    splide.mount();
});
