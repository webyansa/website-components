/* Webyan Preloader — robust hide with multiple triggers + 2.5s fallback */
(function () {
  if (document.body) document.body.classList.add('wy-preload-lock');

  function hide() {
    var p = document.getElementById('wyPreloader');
    if (!p || p.classList.contains('is-hidden')) return;
    p.classList.add('is-hidden');
    if (document.body) document.body.classList.remove('wy-preload-lock');
    setTimeout(function () { if (p && p.parentNode) p.parentNode.removeChild(p); }, 700);
  }

  // If page already fully loaded (cached), hide soon
  if (document.readyState === 'complete') {
    setTimeout(hide, 400);
  } else {
    window.addEventListener('load', function () { setTimeout(hide, 400); });
    document.addEventListener('DOMContentLoaded', function () { setTimeout(hide, 1200); });
  }

  // Hard fallback
  setTimeout(hide, 2500);
})();
