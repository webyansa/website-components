/* Webyan — Theme (Light/Dark) Toggle */
(function () {
  var STORAGE_KEY = 'webyan-theme';
  var root = document.documentElement;

  function getInitial() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {}
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
    document.querySelectorAll('.btn-theme').forEach(function (b) {
      b.setAttribute('aria-label', theme === 'dark' ? 'الوضع الفاتح / Light mode' : 'الوضع الداكن / Dark mode');
    });
  }

  // Apply ASAP to avoid flash
  apply(getInitial());

  function toggle() {
    apply(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.btn-theme');
    if (btn) { e.preventDefault(); toggle(); }
  });
})();
