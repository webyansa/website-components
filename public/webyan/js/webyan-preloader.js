/* Webyan Preloader — robust hide with load + page cache protection */
(function () {
  if (document.body) document.body.classList.add('wy-preload-lock');

  var hideTimer = null;

  function hide(reason) {
    var p = document.getElementById('wyPreloader');
    console.log('[Webyan Preloader] hide called:', reason || 'direct');
    if (!p || p.classList.contains('is-hidden')) {
      if (document.body) document.body.classList.remove('wy-preload-lock');
      return;
    }

    p.classList.add('is-hidden');
    if (document.body) document.body.classList.remove('wy-preload-lock');
    setTimeout(function () {
      if (p && p.parentNode) p.parentNode.removeChild(p);
    }, 700);
  }

  function scheduleHide(reason, delay) {
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(function () {
      hide(reason);
    }, delay || 0);
  }

  if (document.readyState === 'complete') {
    scheduleHide('readyState-complete', 250);
  } else {
    window.addEventListener('load', function () {
      scheduleHide('window-load', 350);
    }, { once: true });

    document.addEventListener('DOMContentLoaded', function () {
      scheduleHide('dom-content-loaded', 900);
    }, { once: true });
  }

  window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
      hide('pageshow-persisted');
      return;
    }

    if (document.readyState === 'complete') {
      scheduleHide('pageshow-complete', 120);
    }
  });

  setTimeout(function () {
    hide('safety-timeout');
  }, 2500);
})();
