(() => {
  const qs = (s, el = document) => el.querySelector(s);

  const initPreloader = () => {
    const preloader = qs('#preloader');
    if (!preloader) return;

    const prefersReducedMotion =
      window.matchMedia &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    preloader.classList.add('is-playing');

    let hidden = false;
    const hide = () => {
      if (hidden) return;
      hidden = true;
      preloader.classList.add('is-hidden');
    };

    const normalDelay = prefersReducedMotion ? 180 : 1400;
    const fallbackDelay = prefersReducedMotion ? 360 : 3200;

    if (document.readyState === 'complete') {
      window.setTimeout(hide, prefersReducedMotion ? 120 : 900);
      window.setTimeout(hide, fallbackDelay);
      return;
    }

    window.addEventListener('load', () => {
      window.setTimeout(hide, normalDelay);
    });

    window.setTimeout(hide, fallbackDelay);
  };

  initPreloader();
})();
