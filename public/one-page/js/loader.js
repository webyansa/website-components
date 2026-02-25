/**
 * One-Page Template — Page Loader & Transition Controller
 */
(function() {
    'use strict';

    // Add loading state
    document.body.classList.add('is-loading');

    function hideLoader() {
        document.body.classList.remove('is-loading');
        document.body.classList.add('is-loaded');
    }

    // DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(hideLoader, 700);
        });
    } else {
        setTimeout(hideLoader, 700);
    }

    // Backup
    window.addEventListener('load', function() {
        setTimeout(hideLoader, 900);
    });

    // bfcache
    window.addEventListener('pageshow', function(e) {
        if (e.persisted) hideLoader();
    });

    // Hard fallback
    setTimeout(hideLoader, 3000);

    // --- Page Transition for language switch ---
    document.addEventListener('DOMContentLoaded', function() {
        var transition = document.querySelector('.page-transition');
        if (!transition) return;

        // Intercept language switch links
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
