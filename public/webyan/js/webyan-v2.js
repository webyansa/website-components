/* Webyan V2 — Shared scripts */
(function () {
  // Header scroll
  var header = document.getElementById('siteHeader');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 10);
    });
  }

  // Mobile drawer
  var toggle = document.getElementById('mobileToggle');
  var drawer = document.getElementById('mobileDrawer');
  var overlay = document.getElementById('mobileOverlay');
  var closeBtn = document.getElementById('drawerClose');
  function openD() { drawer.classList.add('open'); overlay.classList.add('open'); }
  function closeD() { drawer.classList.remove('open'); overlay.classList.remove('open'); }
  if (toggle && drawer) {
    toggle.addEventListener('click', openD);
    closeBtn && closeBtn.addEventListener('click', closeD);
    overlay && overlay.addEventListener('click', closeD);
    drawer.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeD); });
  }

  // Reveal
  var ro = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('visible'); ro.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { ro.observe(el); });

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(function (b) {
    b.addEventListener('click', function () {
      var item = b.parentElement;
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (x) { x.classList.remove('open'); });
      if (!wasOpen) item.classList.add('open');
    });
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (href.length > 1) {
        var t = document.querySelector(href);
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      }
    });
  });

  // Pricing toggle (visual only)
  document.querySelectorAll('.pricing-toggle button').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.pricing-toggle button').forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      var period = b.dataset.period;
      document.querySelectorAll('.price-amount .num').forEach(function (n) {
        var m = n.dataset.monthly, y = n.dataset.yearly;
        if (period === 'yearly' && y) n.textContent = y;
        else if (m) n.textContent = m;
      });
      document.querySelectorAll('.price-period').forEach(function (p) {
        p.textContent = period === 'yearly' ? 'سنوياً • وفّر شهرين' : 'شهرياً';
      });
    });
  });

  // Blog tabs (visual filter)
  document.querySelectorAll('.blog-tab').forEach(function (t) {
    t.addEventListener('click', function () {
      document.querySelectorAll('.blog-tab').forEach(function (x) { x.classList.remove('active'); });
      t.classList.add('active');
      var cat = t.dataset.cat;
      document.querySelectorAll('.blog-card').forEach(function (c) {
        if (cat === 'all' || c.dataset.cat === cat) c.style.display = '';
        else c.style.display = 'none';
      });
    });
  });
})();

/* Hero Carousel — smooth cross-fade auto-rotate */
(function () {
  var carousel = document.getElementById('heroCarousel');
  if (!carousel) return;
  var slides = carousel.querySelectorAll('.hero2-slide');
  var dots = carousel.querySelectorAll('.hero2-dots .dot');
  if (!slides.length) return;
  var idx = 0, timer = null, isAnimating = false;

  function go(i) {
    if (isAnimating || i === idx) return;
    isAnimating = true;
    var next = (i + slides.length) % slides.length;
    slides.forEach(function (s, k) { s.classList.toggle('is-active', k === next); });
    dots.forEach(function (d, k) { d.classList.toggle('is-active', k === next); });
    idx = next;
    setTimeout(function () { isAnimating = false; }, 750);
  }
  function nextSlide() { go(idx + 1); }
  function start() { stop(); timer = setInterval(nextSlide, 5500); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  dots.forEach(function (d) {
    d.addEventListener('click', function () {
      go(parseInt(d.dataset.go, 10) || 0);
      start();
    });
  });
  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);
  start();
})();
