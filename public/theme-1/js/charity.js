/* قالب الجمعية الأول - Charity template scripts */
(function(){
  'use strict';

  // Navbar scroll effect
  const navbar = document.querySelector('.wb-navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // Number counter
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count || '0');
    const duration = 1600;
    const start = performance.now();
    const startVal = 0;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.floor(startVal + (target - startVal) * eased);
      el.textContent = val.toLocaleString('ar-EG');
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString('ar-EG');
    };
    requestAnimationFrame(tick);
  };
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          animateCount(en.target);
          co.unobserve(en.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(c => co.observe(c));
  }

  // Donation amount selection
  document.querySelectorAll('[data-donate-group]').forEach(group => {
    const buttons = group.querySelectorAll('.wb-amount-btn');
    const customInput = group.parentElement.querySelector('[data-donate-custom]');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (customInput && btn.dataset.amount) customInput.value = btn.dataset.amount;
      });
    });
    if (customInput) {
      customInput.addEventListener('input', () => {
        buttons.forEach(b => b.classList.remove('active'));
      });
    }
  });

  // Donation type selection
  document.querySelectorAll('[data-type-group]').forEach(group => {
    const chips = group.querySelectorAll('.wb-type-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
      });
    });
  });

  // Smooth close mobile menu on link click
  document.querySelectorAll('.wb-navbar .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const collapse = document.querySelector('.wb-navbar .navbar-collapse.show');
      if (collapse && window.bootstrap) {
        bootstrap.Collapse.getInstance(collapse)?.hide();
      }
    });
  });

  // Year in footer
  const y = document.getElementById('wb-year');
  if (y) y.textContent = new Date().getFullYear();
})();
