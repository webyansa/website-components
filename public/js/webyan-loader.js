/**
 * Webyan Platform - Premium Page Loader
 * Decomposed Logo Animation Controller
 */

(function() {
    'use strict';

    // Hide loader and enable page interaction
    function hideLoader() {
        try {
            document.body.classList.remove('is-loading');
            document.body.classList.add('is-loaded');
        } catch (e) {
            // Fallback: try to hide loader element directly
            const loader = document.querySelector('.page-loader');
            if (loader) {
                loader.style.opacity = '0';
                loader.style.visibility = 'hidden';
            }
        }
    }

    // Multiple fallback triggers to ensure loader hides

    // 1. DOM Content Loaded (fastest)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(hideLoader, 600);
        });
    } else {
        // DOM already loaded
        setTimeout(hideLoader, 600);
    }

    // 2. Window load (backup - waits for all resources)
    window.addEventListener('load', function() {
        setTimeout(hideLoader, 800);
    });

    // 3. Handle browser back/forward navigation (bfcache)
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            hideLoader();
        }
    });

    // 4. Hard fallback - always hide after max time even if something breaks
    setTimeout(hideLoader, 3000);

})();
