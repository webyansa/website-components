/* Shattr — Interactions */
(function () {
  'use strict';

  // 1) Rotating hero word
  var textRotationInterval = setInterval(function () {
    var el = document.getElementById('shattr-rotating-text-2-2');
    if (!el) return;
    clearInterval(textRotationInterval);
    var words = ['الأفكار', 'المجتمع', 'التحديات', 'الحلول'];
    var i = 0;
    setInterval(function () {
      el.style.opacity = '0';
      setTimeout(function () {
        i = (i + 1) % words.length;
        el.innerText = words[i];
        el.style.opacity = '1';
      }, 300);
    }, 2500);
  }, 300);

  // 2) Smart counter for stats
  var counterInterval = setInterval(function () {
    var counters = document.querySelectorAll('.shattr-counter');
    if (!counters.length) return;
    clearInterval(counterInterval);
    if (!window.IntersectionObserver) {
      counters.forEach(function (c) { c.innerText = c.getAttribute('data-target'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries, o) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var target = parseInt(el.getAttribute('data-target')) || 0;
        var duration = 2000;
        var start = null;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.innerText = Math.floor(eased * target);
          if (p < 1) window.requestAnimationFrame(step);
          else el.innerText = target;
        }
        window.requestAnimationFrame(step);
        o.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { obs.observe(c); });
  }, 300);

  // 3) Flip cards — click to flip on touch / tap
  document.querySelectorAll('.shattr-flip-card').forEach(function (card) {
    card.addEventListener('click', function (e) {
      // Avoid flipping when clicking the "المزيد" link
      if (e.target.closest('a')) return;
      card.classList.toggle('flipped');
    });
  });

  // 4) Reveal on scroll
  var reveals = document.querySelectorAll('.shattr-reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, idx) {
        if (entry.isIntersecting) {
          var el = entry.target;
          setTimeout(function () { el.classList.add('is-in'); }, Math.min(idx * 60, 240));
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }
})();
