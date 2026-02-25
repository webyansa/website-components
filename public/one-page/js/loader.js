/**
 * One-Page Template — Page Loader & Transition Controller
 */
(function() {
    'use strict';

    function hideLoader() {
        var body = document.body;
        if (!body) return;
        body.classList.remove('is-loading');
        body.classList.add('is-loaded');
    }

    // Wait for DOM
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
