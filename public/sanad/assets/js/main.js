/* قالب سند — السكربت الرئيسي */
(function () {
  'use strict';

  /* قائمة الجوال */
  const menuBtn = document.querySelector('[data-mobile-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const mobileOverlay = document.querySelector('[data-mobile-overlay]');
  const mobileClose = document.querySelector('[data-mobile-close]');
  const open = () => { mobileMenu?.classList.add('open'); mobileOverlay?.classList.add('open'); document.body.style.overflow='hidden'; };
  const close = () => { mobileMenu?.classList.remove('open'); mobileOverlay?.classList.remove('open'); document.body.style.overflow=''; };
  menuBtn?.addEventListener('click', open);
  mobileClose?.addEventListener('click', close);
  mobileOverlay?.addEventListener('click', close);
  document.querySelectorAll('[data-mobile-menu] a').forEach(a => a.addEventListener('click', close));

  /* الهيدر + زر العودة */
  const header = document.querySelector('.s-header');
  const toTop = document.querySelector('.s-to-top');
  const onScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
    if (toTop) toTop.classList.toggle('show', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop?.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

  /* ظهور الأقسام */
  const ro = new IntersectionObserver((es) => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); ro.unobserve(e.target); } });
  }, { threshold: 0.10 });
  document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

  /* عداد الأرقام */
  const co = new IntersectionObserver((es) => {
    es.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.getAttribute('data-counter'));
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1800;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = target * eased;
        const formatted = (target % 1 === 0) ? Math.floor(val).toLocaleString('ar-SA') : val.toFixed(1);
        el.textContent = formatted + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      co.unobserve(el);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-counter]').forEach(c => co.observe(c));

  /* أشرطة التقدم */
  const bo = new IntersectionObserver((es) => {
    es.forEach(entry => {
      if (!entry.isIntersecting) return;
      const v = entry.target.getAttribute('data-progress');
      entry.target.style.width = v + '%';
      bo.unobserve(entry.target);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-progress]').forEach(b => bo.observe(b));

  /* سنة الفوتر */
  const y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();

  /* فلاتر المشاريع */
  const projGrid = document.querySelector('[data-projects-grid]');
  if (projGrid) {
    const state = { field: 'all', status: 'all', group: 'all', q: '' };
    const items = Array.from(projGrid.querySelectorAll('[data-project]'));
    const apply = () => {
      const q = state.q.trim();
      items.forEach(el => {
        const f = el.getAttribute('data-field') || '';
        const s = el.getAttribute('data-status') || '';
        const g = el.getAttribute('data-group') || '';
        const t = (el.getAttribute('data-title') || '').toLowerCase();
        const ok =
          (state.field === 'all' || f.split(',').includes(state.field)) &&
          (state.status === 'all' || s === state.status) &&
          (state.group === 'all' || g.split(',').includes(state.group)) &&
          (!q || t.indexOf(q.toLowerCase()) !== -1);
        el.classList.toggle('is-hidden', !ok);
      });
      const empty = document.querySelector('[data-projects-empty]');
      if (empty) empty.classList.toggle('is-hidden', items.some(i => !i.classList.contains('is-hidden')));
    };
    document.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-filter');
        const val = btn.getAttribute('data-value');
        state[key] = val;
        document.querySelectorAll(`[data-filter="${key}"]`).forEach(b => b.classList.toggle('active', b === btn));
        apply();
      });
    });
    const search = document.querySelector('[data-projects-search]');
    if (search) search.addEventListener('input', e => { state.q = e.target.value; apply(); });
  }
})();
