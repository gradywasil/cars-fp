/* Shared navigation and a local-only record of opened pages.
   Does not inspect or modify notes, verdicts, or saved stops on any fan page. */
(() => {
  'use strict';
  const KEY = 'cars-club.roadbook.v1';
  const IDS = ['cars', 'cars-2', 'cars-3', 'cars-land', 'carsdb'];
  let visited = [];
  let canPersist = true;
  function readRoadbook() {
    try {
      const data = JSON.parse(localStorage.getItem(KEY) || 'null');
      visited = data && data.version === 1 && Array.isArray(data.visited)
        ? [...new Set(data.visited.filter(id => IDS.includes(id)))] : [];
    } catch (_) { canPersist = false; }
  }
  function writeRoadbook() {
    try {
      localStorage.setItem(KEY, JSON.stringify({ version: 1, visited }));
      canPersist = true;
    } catch (_) { canPersist = false; }
  }
  function updateRoadbook() {
    document.querySelectorAll('[data-cc-count]').forEach(el => {
      el.textContent = `${visited.length} of ${IDS.length}`;
    });
    document.querySelectorAll('[data-cc-visited]').forEach(el => {
      el.hidden = !visited.includes(el.dataset.ccVisited);
    });
    document.querySelectorAll('[data-cc-clear]').forEach(el => {
      el.hidden = visited.length === 0;
    });
    document.querySelectorAll('[data-cc-storage-note]').forEach(el => {
      el.textContent = canPersist ? 'Remembered only in this browser.' : 'Storage unavailable; this visit only.';
    });
  }
  readRoadbook();
  const current = document.body.dataset.ccPage;
  if (IDS.includes(current) && !visited.includes(current)) {
    visited.push(current);
    writeRoadbook();
  }
  updateRoadbook();
  document.querySelectorAll('[data-cc-clear]').forEach(button => {
    button.addEventListener('click', () => {
      if (!window.confirm('Clear your five-page visit history? Your saved choices on the individual pages will stay untouched.')) return;
      const old = [...visited];
      try {
        localStorage.removeItem(KEY);
        visited = [];
        canPersist = true;
      } catch (_) {
        visited = old;
        canPersist = false;
        window.dispatchEvent(new CustomEvent('cc:notice', { detail: 'This browser could not clear stored history. Use its site-data settings to remove it.' }));
        updateRoadbook();
        return;
      }
      updateRoadbook();
      document.querySelector('.finder-intro h2')?.focus({ preventScroll: true });
      window.dispatchEvent(new CustomEvent('cc:notice', { detail: 'Roadbook reset. Your notes and saved choices are unchanged.' }));
    });
  });
  window.addEventListener('storage', event => {
    if (event.key === KEY || event.key === null) { readRoadbook(); updateRoadbook(); }
  });
  window.addEventListener('pageshow', event => {
    if (event.persisted) { readRoadbook(); updateRoadbook(); }
  });
  // Physical index.html files work on a local disk; hosted links use clean folders.
  function cleanInternalLinks(root = document) {
    if (location.protocol === 'file:') return;
    root.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(href)) return;
      link.setAttribute('href', href.replace(/(^|\/)index\.html(?=[?#]|$)/, '$1'));
    });
  }
  cleanInternalLinks();
  window.CarsClub = Object.freeze({
    hasVisited: id => visited.includes(id),
    href: id => `${id}/${location.protocol === 'file:' ? 'index.html' : ''}`
  });
  // The site switcher is a native disclosure: usable without JavaScript.
  const switcher = document.querySelector('.cc-switcher');
  if (switcher) {
    document.addEventListener('click', event => {
      if (!switcher.contains(event.target)) switcher.open = false;
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && switcher.open) {
        switcher.open = false;
        switcher.querySelector('summary')?.focus();
      }
    });
  }
})();
