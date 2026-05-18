/* =========================================================
   RAED — Interactive JS
   ========================================================= */
(function () {
  'use strict';

  // ---------- NAV scroll state ----------
  const nav = document.getElementById('raedNav');
  const backTop = document.getElementById('backTop');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
    backTop.classList.toggle('show', window.scrollY > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Mobile drawer ----------
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

  backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ---------- Smooth anchor ----------
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.scrollY - 70;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  // ---------- Cursor orb ----------
  const orb = document.getElementById('cursorOrb');
  if (orb && window.matchMedia('(hover:hover)').matches) {
    let mx = 0, my = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    const loop = () => {
      cx += (mx - cx) * 0.55;
      cy += (my - cy) * 0.55;
      orb.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.querySelectorAll('a, button, [data-tilt]').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // ---------- Hero parallax + light ----------
  const hero = document.querySelector('.hero');
  const heroLight = document.getElementById('heroLight');
  const compass = document.getElementById('compass');
  const chips = compass ? compass.querySelectorAll('.chip') : [];
  if (hero) {
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const cxr = (x / r.width - 0.5), cyr = (y / r.height - 0.5);
      if (heroLight) heroLight.style.transform = `translate(${x - 300}px, ${y - 300}px)`;
      chips.forEach(ch => {
        const d = parseFloat(ch.dataset.depth || 0.05);
        ch.style.transform = `translate3d(${-cxr * d * 600}px, ${-cyr * d * 600}px, 0)`;
      });
      if (compass) compass.style.transform = `perspective(1000px) rotateY(${cxr * 6}deg) rotateX(${-cyr * 6}deg)`;
    });
    hero.addEventListener('mouseleave', () => {
      chips.forEach(ch => ch.style.transform = '');
      if (compass) compass.style.transform = '';
    });
  }

  // ---------- Reveal on scroll ----------
  const reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((ents) => {
      ents.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  // ---------- Counter ----------
  const counters = document.querySelectorAll('[data-counter]');
  const animateCounter = el => {
    const target = parseInt(el.dataset.counter, 10);
    const dur = 1800;
    const start = performance.now();
    const step = now => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('ar-EG');
      if (p < 1) requestAnimationFrame(step); else el.textContent = target.toLocaleString('ar-EG');
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver((ents) => {
      ents.forEach(en => { if (en.isIntersecting) { animateCounter(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.5 });
    counters.forEach(c => cio.observe(c));
  } else counters.forEach(animateCounter);

  // ---------- Tilt cards ----------
  if (window.matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        const rx = ((y / r.height) - 0.5) * -6;
        const ry = ((x / r.width) - 0.5) * 6;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
        card.style.setProperty('--mx', x + 'px');
        card.style.setProperty('--my', y + 'px');
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  // ---------- Glow button cursor light ----------
  document.querySelectorAll('.btn-glow').forEach(b => {
    b.addEventListener('mousemove', e => {
      const r = b.getBoundingClientRect();
      b.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      b.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  // ---------- Journey guided story ----------
  const stage = document.getElementById('journeyStage');
  const stepsEl = document.getElementById('jrSteps');
  const visual = document.getElementById('jrVisual');
  const bar = document.getElementById('jrBar');
  if (stage && stepsEl && visual) {
    const steps = stepsEl.querySelectorAll('li');
    const scenes = visual.querySelectorAll('.jr-scene');
    const total = steps.length;

    const setStage = (i) => {
      steps.forEach((s, idx) => s.classList.toggle('active', idx === i));
      scenes.forEach((s, idx) => s.classList.toggle('show', idx === i));
      if (bar) bar.style.width = `${((i + 1) / total) * 100}%`;
    };
    setStage(0);

    // Hover / click step to update the visual without creating broken scroll gaps
    steps.forEach((li, idx) => {
      li.addEventListener('mouseenter', () => setStage(idx));
      li.addEventListener('focusin', () => setStage(idx));
      li.addEventListener('click', () => setStage(idx));
    });
  }

  // ---------- GSAP hero text reveal ----------
  if (window.gsap) {
    gsap.from('.hero-title .line', { y: 80, opacity: 0, stagger: .12, duration: 1, ease: 'power3.out', delay: .2 });
    gsap.from('.hero-badge', { y: 20, opacity: 0, duration: .8, ease: 'power3.out' });
    gsap.from('.hero-lead', { y: 30, opacity: 0, duration: .9, delay: .6, ease: 'power3.out' });
    gsap.from('.hero-actions > *', { y: 20, opacity: 0, stagger: .1, duration: .7, delay: .8, ease: 'power3.out', clearProps: 'all' });
    gsap.from('.chip', { scale: .6, opacity: 0, stagger: .08, duration: .8, delay: .6, ease: 'back.out(1.6)' });
  }

  // ---------- Year ----------
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

/* Page loader hide */
(function(){
  function hide(){
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-loaded');
  }
  var MIN = 1600, start = Date.now();
  function schedule(extra){
    var wait = Math.max(0, MIN - (Date.now() - start)) + (extra||0);
    setTimeout(hide, wait);
  }
  if (document.readyState === 'complete') schedule(150);
  else window.addEventListener('load', function(){ schedule(200); });
  setTimeout(hide, 4500); // safety
  window.addEventListener('pageshow', function(e){ if (e.persisted) setTimeout(hide, 600); });
})();
