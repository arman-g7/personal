/* ---------------------------------------------------------------
   Light/dark. Three states: follow the system (the default), or an
   explicit light/dark the reader picked here, kept in localStorage.
   Loaded from <head> so the attribute is set before the first paint
   and dark readers never get a flash of cream.
   --------------------------------------------------------------- */

(function () {
  'use strict';

  var STORAGE_KEY = 'theme';

  function stored() {
    try {
      var v = window.localStorage.getItem(STORAGE_KEY);
      return (v === 'light' || v === 'dark') ? v : null;
    } catch (e) {
      return null;                       // blocked storage: follow the system
    }
  }

  function remember(theme) {
    try {
      if (theme) window.localStorage.setItem(STORAGE_KEY, theme);
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch (e) { /* not worth caring about */ }
  }

  function systemPrefersDark() {
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }

  /* What the reader is actually looking at right now. */
  function effective() {
    var choice = stored();
    if (choice) return choice;
    return systemPrefersDark() ? 'dark' : 'light';
  }

  function apply(choice) {
    var root = document.documentElement;
    if (choice) root.setAttribute('data-theme', choice);
    else root.removeAttribute('data-theme');
  }

  /* Runs immediately, before the body exists. */
  apply(stored());

  function label(el) {
    if (!el) return;
    var next = effective() === 'dark' ? 'light' : 'dark';
    var t = window.Site && window.Site.t ? window.Site.t : function (k) { return k; };
    el.textContent = t(next === 'dark' ? 'theme.toDark' : 'theme.toLight');
    el.setAttribute('aria-label', t(next === 'dark' ? 'theme.toDark.label' : 'theme.toLight.label'));
    el.setAttribute('data-theme-next', next);
  }

  function init() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;

    label(btn);

    btn.addEventListener('click', function () {
      var next = effective() === 'dark' ? 'light' : 'dark';
      remember(next);
      apply(next);
      label(btn);
    });

    /* The button names a theme, so it has to be translated too. */
    document.addEventListener('langchange', function () { label(btn); });

    /* If the reader never picked one here, keep following the system. */
    var mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    if (mq && mq.addEventListener) {
      mq.addEventListener('change', function () {
        if (!stored()) label(btn);
      });
    }
  }

  window.Theme = { effective: effective };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
