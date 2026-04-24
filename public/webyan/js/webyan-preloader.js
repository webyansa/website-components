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

  // Minimum on-screen time so the loader animation is visible (not a flash)
  var MIN_DISPLAY_MS = 1400;
  var startTime = Date.now();

  function scheduleHideRespectingMin(reason, extraDelay) {
    var elapsed = Date.now() - startTime;
    var remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);
    var delay = Math.max(remaining, extraDelay || 0);
    scheduleHide(reason, delay);
  }

  function handleReadyState() {
    if (document.readyState === 'interactive') {
      scheduleHideRespectingMin('readyState-interactive', 200);
    }
    if (document.readyState === 'complete') {
      scheduleHideRespectingMin('readyState-complete', 150);
    }
  }

  handleReadyState();

  document.addEventListener('readystatechange', handleReadyState);

  document.addEventListener('DOMContentLoaded', function () {
    scheduleHideRespectingMin('dom-content-loaded', 250);
  }, { once: true });

  window.addEventListener('load', function () {
    scheduleHideRespectingMin('window-load', 200);
  }, { once: true });

  window.addEventListener('pageshow', function (event) {
    var navEntry = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
    var isBackForward = navEntry && navEntry.type === 'back_forward';

    if (event.persisted || isBackForward) {
      // BFCache restore: short delay so the grid animation is briefly visible
      scheduleHide('pageshow-cache', 600);
      return;
    }

    if (document.readyState === 'complete') {
      scheduleHideRespectingMin('pageshow-complete', 150);
    }
  });

  setTimeout(function () {
    hide('safety-timeout');
  }, 3500);
})();
