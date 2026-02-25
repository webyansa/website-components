/**
 * One-Page Template — Page Loader & Section Reveal Controller
 */
(function() {
    'use strict';

    function hideLoader() {
        var body = document.body;
        if (!body || body.classList.contains('is-loaded')) return;
        body.classList.remove('is-loading');
        body.classList.add('is-loaded');

        // Start section reveals after loader fades
        setTimeout(revealSections, 500);
    }

    // DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(hideLoader, 800);
        });
    } else {
        setTimeout(hideLoader, 800);
    }

    // Backup on full load
    window.addEventListener('load', function() {
        setTimeout(hideLoader, 1000);
    });

    // bfcache
    window.addEventListener('pageshow', function(e) {
        if (e.persisted) hideLoader();
    });

    // Hard fallback
    setTimeout(hideLoader, 3500);

    // --- Section Fade-Up Reveal ---
    function revealSections() {
        var sections = document.querySelectorAll('.op-section-reveal');
        if (!sections.length) return;

        // Use IntersectionObserver for scroll-triggered reveals
        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

            sections.forEach(function(section) {
                observer.observe(section);
            });
        } else {
            // Fallback: reveal all
            sections.forEach(function(s) { s.classList.add('revealed'); });
        }
    }

    // --- Page Transition for language switch ---
    document.addEventListener('DOMContentLoaded', function() {
        var transition = document.querySelector('.page-transition');
        if (!transition) return;

        var langLinks = document.querySelectorAll('.op-lang-switch a.op-lang-btn');
        langLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                var href = this.getAttribute('href');
                transition.classList.add('active');
                setTimeout(function() {
                    window.location.href = href;
                }, 300);
            });
        });
    });
})();
