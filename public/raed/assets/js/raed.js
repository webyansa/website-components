/* ============================================
   رائد - Landing Page JS
   ============================================ */
(function () {
  'use strict';

  // ---- Navbar scroll state ----
  const nav = document.getElementById('raedNav');
  const onScroll = () => {
    if (window.scrollY > 30) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');

    const backTop = document.getElementById('backTop');
    if (window.scrollY > 500) backTop.classList.add('show');
    else backTop.classList.remove('show');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Mobile drawer ----
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('mobileOverlay');
  const openBtn = document.getElementById('navToggle');
  const closeBtn = document.getElementById('drawerClose');
  const toggleDrawer = (open) => {
    drawer.classList.toggle('open', open);
    overlay.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  openBtn?.addEventListener('click', () => toggleDrawer(true));
  closeBtn?.addEventListener('click', () => toggleDrawer(false));
  overlay?.addEventListener('click', () => toggleDrawer(false));
  drawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleDrawer(false)));

  // ---- Back to top ----
  document.getElementById('backTop')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---- Smooth scroll for anchor links (in addition to CSS smooth-scroll) ----
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  // ---- Reveal on scroll ----
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(ent => {
        if (ent.isIntersecting) {
          ent.target.classList.add('visible');
          io.unobserve(ent.target);
        }
      });
    }, { threshold: 0.14 });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  // ---- Counter animation ----
  const counters = document.querySelectorAll('[data-counter]');
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.counter, 10);
    const duration = 1800;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('ar-EG');
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString('ar-EG');
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(ent => {
        if (ent.isIntersecting) {
          animateCounter(ent.target);
          cio.unobserve(ent.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cio.observe(c));
  } else {
    counters.forEach(animateCounter);
  }

  // ---- Year in footer ----
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
