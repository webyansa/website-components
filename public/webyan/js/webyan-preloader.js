/* Webyan Preloader — auto-hide on load with 3s fallback */
(function () {
  'use strict';

  document.body.classList.add('wy-preload-lock');

  function hidePreloader() {
    var pre = document.querySelector('.wy-preloader');
    if (!pre || pre.classList.contains('is-hidden')) return;
    pre.classList.add('is-hidden');
    document.body.classList.remove('wy-preload-lock');
    // Remove from DOM after fade-out completes
    setTimeout(function () {
      if (pre && pre.parentNode) pre.parentNode.removeChild(pre);
    }, 800);
  }

  // Hide shortly after `load` for a smooth feel
  window.addEventListener('load', function () {
    setTimeout(hidePreloader, 500);
  });

  // Safety fallback — never block the page longer than 3s
  setTimeout(hidePreloader, 3000);
})();
