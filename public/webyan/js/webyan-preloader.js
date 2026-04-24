/* Webyan Preloader — hardened hide logic for cached, fast and back-forward loads */
(function () {
  var root = document.documentElement;
  var body = document.body;
  var hideTimer = null;
  var cleanupTimer = null;

  if (body) body.classList.add('wy-preload-lock');

  function unlockScroll() {
    if (document.body) document.body.classList.remove('wy-preload-lock');
    if (root) root.classList.remove('wy-preload-lock');
  }

  function getPreloader() {
    return document.getElementById('wyPreloader');
  }

  function hide(reason) {
    var p = getPreloader();
    console.log('[Webyan Preloader] hide called:', reason || 'direct');

    if (!p) {
      unlockScroll();
      return;
    }

    if (hideTimer) clearTimeout(hideTimer);
    if (cleanupTimer) clearTimeout(cleanupTimer);

    p.classList.add('is-hidden');
    p.setAttribute('hidden', 'hidden');
    p.setAttribute('aria-hidden', 'true');
    unlockScroll();

    cleanupTimer = setTimeout(function () {
      var current = getPreloader();
      if (current && current.parentNode) current.parentNode.removeChild(current);
    }, 650);
  }

  function scheduleHide(reason, delay) {
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(function () {
      hide(reason);
    }, delay || 0);
  }

  function handleReadyState() {
    if (document.readyState === 'interactive') {
      scheduleHide('readyState-interactive', 700);
    }
    if (document.readyState === 'complete') {
      scheduleHide('readyState-complete', 180);
    }
  }

  handleReadyState();

  document.addEventListener('readystatechange', handleReadyState);

  document.addEventListener('DOMContentLoaded', function () {
    scheduleHide('dom-content-loaded', 800);
  }, { once: true });

  window.addEventListener('load', function () {
    scheduleHide('window-load', 220);
  }, { once: true });

  window.addEventListener('pageshow', function (event) {
    var navEntry = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
    var isBackForward = navEntry && navEntry.type === 'back_forward';

    if (event.persisted || isBackForward) {
      hide('pageshow-cache');
      return;
    }

    if (document.readyState === 'complete') {
      scheduleHide('pageshow-complete', 80);
    }
  });

  window.addEventListener('focus', function () {
    if (document.readyState === 'complete') {
      scheduleHide('window-focus-complete', 60);
    }
  });

  setTimeout(function () {
    hide('safety-timeout');
  }, 2200);
})();
