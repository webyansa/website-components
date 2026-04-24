/* Webyan Preloader — hide on load with 3s fallback */
(function () {
  document.body && document.body.classList.add('wy-preload-lock');

  function hide() {
    var p = document.getElementById('wyPreloader');
    if (!p || p.classList.contains('is-hidden')) return;
    p.classList.add('is-hidden');
    document.body.classList.remove('wy-preload-lock');
    setTimeout(function () { if (p && p.parentNode) p.parentNode.removeChild(p); }, 700);
  }

  window.addEventListener('load', function () { setTimeout(hide, 500); });
  setTimeout(hide, 3000);
})();
