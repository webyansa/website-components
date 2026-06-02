/* =============================================
   قالب سند - السكربت الرئيسي
   ============================================= */
(function () {
  'use strict';

  /* ---- قائمة الجوال ---- */
  const menuBtn = document.querySelector('[data-mobile-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const mobileClose = document.querySelector('[data-mobile-close]');
  const openMenu = () => mobileMenu && mobileMenu.classList.add('open');
  const closeMenu = () => mobileMenu && mobileMenu.classList.remove('open');
  menuBtn && menuBtn.addEventListener('click', openMenu);
  mobileClose && mobileClose.addEventListener('click', closeMenu);
  document.querySelectorAll('[data-mobile-menu] a').forEach(a => a.addEventListener('click', closeMenu));

  /* ---- هيدر ثابت بظل عند التمرير ---- */
  const header = document.querySelector('.sanad-header');
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 30) header.classList.add('scrolled'); else header.classList.remove('scrolled');
    const top = document.querySelector('.sanad-to-top');
    if (top) { if (window.scrollY > 400) top.classList.add('show'); else top.classList.remove('show'); }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- زر العودة للأعلى ---- */
  const toTop = document.querySelector('.sanad-to-top');
  toTop && toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---- ظهور الأقسام عند التمرير ---- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ---- عداد الأرقام ---- */
  const counters = document.querySelectorAll('[data-counter]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.getAttribute('data-counter'));
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1600;
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
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(c => counterObserver.observe(c));

  /* ---- أشرطة التقدم ---- */
  const bars = document.querySelectorAll('[data-progress]');
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const v = entry.target.getAttribute('data-progress');
      entry.target.style.width = v + '%';
      barObserver.unobserve(entry.target);
    });
  }, { threshold: 0.4 });
  bars.forEach(b => barObserver.observe(b));

  /* ---- سنة الفوتر ---- */
  const y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();
