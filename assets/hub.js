/* The Cars Club. No dependencies, trackers, account system, or backend. */
(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let toastTimer;
  function toast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('visible'), 4500);
  }
  window.addEventListener('cc:notice', event => {
    if (typeof event.detail === 'string') toast(event.detail);
  });
  const menu = $('#mobile-nav');
  const menuButton = $('.menu-toggle');
  function setMenu(open) {
    menu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    $('use', menuButton).setAttribute('href', open ? '#icon-close' : '#icon-menu');
  }
  menuButton.addEventListener('click', () => setMenu(menu.hidden));
  $$('a', menu).forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('click', event => {
    if (!menu.hidden && !event.target.closest('.site-header')) setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) { setMenu(false); menuButton.focus(); }
  });
  window.matchMedia('(min-width:681px)').addEventListener('change', () => setMenu(false));

  // The night preview is explicit and reversible. No flashing or automatic cycle.
  const neonButton = $('#neon-toggle');
  neonButton.addEventListener('click', () => {
    const night = neonButton.getAttribute('aria-pressed') !== 'true';
    neonButton.setAttribute('aria-pressed', String(night));
    neonButton.setAttribute('aria-label', night ? 'Return to the golden-hour preview' : 'Turn on the neon preview');
    $('.land-art').dataset.neon = String(night);
    $('#neon-label').textContent = night ? 'Back to golden hour' : 'Stay for the neon';
    $('#land-clock').textContent = night ? 'NEON HOUR' : 'GOLDEN HOUR';
    $('.land-picture img').alt = night
      ? 'The illustrated roadside town under a starry sky, with glowing turquoise, pink, and orange neon.'
      : 'An illustrated roadside town at golden hour, framed by red desert cliffs.';
  });

  // One optional film still. The dossier design remains if it cannot load.
  $$('[data-optional-photo]').forEach(img => {
    const show = () => {
      if (img.naturalWidth > 0) { img.hidden = false; img.parentElement.classList.add('photo-loaded'); }
    };
    const failed = () => { img.hidden = true; img.parentElement.classList.remove('photo-loaded'); };
    img.addEventListener('load', show);
    img.addEventListener('error', failed);
    if (img.complete) { if (img.naturalWidth) show(); else failed(); }
  });

  const routes = Object.freeze({
    'cars': { number: '01 / 05', kicker: 'CARS / THE SCENIC ROUTE', title: 'Less ego. More road.', copy: 'Take a breath and a detour. A story about being talented enough to keep going, and open enough to keep learning.', cta: 'Take the scenic route' },
    'cars-2': { number: '02 / 05', kicker: 'CARS 2 / THE DEFENSE BUREAU', title: 'Absolute cinema.', copy: 'The bureau has a case to make. Bring your sense of humor, inspect the evidence, and enjoy a film that committed to the bit.', cta: 'Open the defense bureau' },
    'cars-3': { number: '03 / 05', kicker: 'CARS 3 / THE NEXT LAP', title: 'There is more road ahead.', copy: 'For anyone finding a different kind of purpose. A little encouragement to keep growing, share what you know, and enjoy the next chapter.', cta: 'Find your next lap' },
    'cars-land': { number: '04 / 05', kicker: 'CARS LAND / THE HAPPY PLACE', title: 'Happiness. In top gear.', copy: 'Take the turn toward desert skies, a small-town heartbeat, and a very good reason to stay for the neon. Your happy detour starts here.', cta: 'Take a trip to Cars Land' },
    'carsdb': { number: '05 / 05', kicker: 'CARSDB / THE CATALOGUE', title: 'Small cars. Big spreadsheet.', copy: 'For when the love of the films turns into a shelf. A catalogue of 1,455 die-cast vehicles, and a way to keep track of which ones are yours.', cta: 'Open the catalogue' }
  });
  const dialog = $('#route-dialog');
  let returnFocus = null;
  let chosen = null;
  function selectRoute(id) {
    const route = routes[id];
    if (!route) return;
    chosen = id;
    $$('[data-feeling]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.feeling === id)));
    $('#result-kicker').textContent = route.kicker;
    $('#result-number').textContent = route.number;
    $('#result-title').textContent = route.title;
    $('#result-copy').textContent = route.copy;
    $('#result-cta').textContent = route.cta;
    $('#result-link').href = window.CarsClub ? window.CarsClub.href(id) : `${id}/index.html`;
    $('#result-link').dataset.ccRoute = id;
    $('#route-result').hidden = false;
    $('#result-announcement').textContent = `Your next stop: ${route.title} ${route.copy}`;
  }
  function surprise() {
    const ids = Object.keys(routes);
    // Avoid repeating the current suggestion; random, not personal profiling.
    const available = ids.filter(id => id !== chosen);
    const random = window.crypto && window.crypto.getRandomValues
      ? window.crypto.getRandomValues(new Uint32Array(1))[0] / (2 ** 32) : Math.random();
    selectRoute(available[Math.floor(random * available.length)]);
  }
  function openFinder(trigger, random = false) {
    if (typeof dialog.showModal !== 'function') {
      document.getElementById('find-your-route').scrollIntoView({ behavior: motion.matches ? 'instant' : 'smooth' });
      return;
    }
    const mobileTrigger = menu.contains(trigger);
    returnFocus = mobileTrigger ? menuButton : (trigger || document.activeElement);
    setMenu(false);
    if (random) surprise();
    dialog.showModal();
    document.body.classList.add('dialog-open');
    $('.dialog-close', dialog).focus({ preventScroll: true });
  }
  $$('[data-open-finder]').forEach(button => button.addEventListener('click', () => openFinder(button)));
  $$('[data-surprise]').forEach(button => button.addEventListener('click', () => openFinder(button, true)));
  $$('[data-feeling]').forEach(button => button.addEventListener('click', () => selectRoute(button.dataset.feeling)));
  $('#surprise-again').addEventListener('click', surprise);
  $('.dialog-close', dialog).addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    if (returnFocus && returnFocus.isConnected) returnFocus.focus({ preventScroll: true });
  });
  // Credits are usable as both a disclosure and a deep link.
  const credits = $('#credits');
  $$('a[href="#credits"]').forEach(link => link.addEventListener('click', () => { credits.open = true; }));
  if (location.hash === '#credits') credits.open = true;
  window.addEventListener('hashchange', () => { if (location.hash === '#credits') credits.open = true; });

  // Keep the intended headline lines readable even when web fonts are blocked.
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  function fitHeadlines() {
    if (!context) return;
    $$('[data-fit]').forEach(el => {
      el.style.fontSize = '';
      const style = getComputedStyle(el);
      const width = el.clientWidth;
      if (!width || style.display === 'inline') return;
      const size = parseFloat(style.fontSize);
      const text = el.textContent.trim();
      const spacing = parseFloat(style.letterSpacing) || 0;
      context.font = `${style.fontWeight} ${size}px ${style.fontFamily}`;
      const measure = context.measureText(text).width + (text.length - 1) * spacing;
      if (measure > width) el.style.fontSize = `${Math.floor(size * width / measure * .99)}px`;
    });
  }
  fitHeadlines();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitHeadlines);
  let resizeTimer;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(fitHeadlines, 120); }, { passive: true });
})();
