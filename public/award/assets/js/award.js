/* جائزة الأندية الشبابية - Interactions */
(function () {
  'use strict';

  const header = document.querySelector('.award-header');
  const floating = document.querySelector('.award-floating');
  const hero = document.querySelector('.award-hero');

  // Header on scroll
  const onScroll = () => {
    const y = window.scrollY || 0;
    if (header) header.classList.toggle('is-scrolled', y > 40);
    if (floating && hero) {
      const heroBottom = hero.offsetTop + hero.offsetHeight - 200;
      floating.classList.toggle('is-visible', y > heroBottom);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Smooth scroll for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: 'smooth' });

      // close offcanvas on click (Bootstrap)
      const oc = document.querySelector('.award-offcanvas.show');
      if (oc && window.bootstrap) {
        const inst = window.bootstrap.Offcanvas.getInstance(oc);
        inst && inst.hide();
      }
    });
  });

  // IntersectionObserver reveal
  const reveals = document.querySelectorAll('.award-reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  // Light parallax on hero visual
  const visual = document.querySelector('.award-hero__photo');
  if (visual && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener(
      'scroll',
      () => {
        const y = window.scrollY;
        if (y < 900) visual.style.transform = `rotate(-2deg) translateY(${y * 0.05}px)`;
      },
      { passive: true }
    );
  }
})();
