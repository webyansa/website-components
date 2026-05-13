/* Webyan Admin — Mockup interactions only */
(function () {
  // sidebar toggle (mobile)
  document.addEventListener('click', function (e) {
    if (e.target.closest('.menu-btn')) {
      document.querySelector('.sidebar')?.classList.toggle('open');
      document.querySelector('.sidebar-backdrop')?.classList.toggle('show');
    }
    if (e.target.classList.contains('sidebar-backdrop')) {
      document.querySelector('.sidebar')?.classList.remove('open');
      e.target.classList.remove('show');
    }
  });

  // tabs
  document.querySelectorAll('[data-tabs]').forEach(function (group) {
    group.addEventListener('click', function (e) {
      const tab = e.target.closest('.tab');
      if (!tab) return;
      group.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.target;
      if (target) {
        document.querySelectorAll('[data-tab-panel]').forEach(p => p.style.display = 'none');
        const panel = document.querySelector('[data-tab-panel="' + target + '"]');
        if (panel) panel.style.display = '';
      }
    });
  });

  // mark active nav link based on filename
  const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === file) a.classList.add('active');
  });

  // checklist toggle
  document.querySelectorAll('[data-step-toggle]').forEach(s => {
    s.addEventListener('click', function () {
      this.classList.toggle('done');
    });
  });

  // demo toast for any [data-demo] action
  document.addEventListener('click', function (e) {
    const b = e.target.closest('[data-demo]');
    if (!b) return;
    e.preventDefault();
    showToast(b.getAttribute('data-demo'));
  });

  function showToast(msg) {
    let t = document.getElementById('admin-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'admin-toast';
      t.style.cssText = 'position:fixed;bottom:24px;left:24px;background:#0f1730;color:#fff;padding:12px 18px;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.25);font-size:13.5px;z-index:200;opacity:0;transform:translateY(8px);transition:.25s;font-family:inherit';
      document.body.appendChild(t);
    }
    t.textContent = '✓ ' + msg + ' (نموذج توضيحي)';
    requestAnimationFrame(() => { t.style.opacity = '1'; t.style.transform = 'translateY(0)'; });
    clearTimeout(t._h);
    t._h = setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateY(8px)'; }, 2200);
  }
})();
