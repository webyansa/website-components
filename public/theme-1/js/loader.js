/**
 * Premium Association Template - Page Loader
 * Simple & Reliable Implementation
 */

(function() {
    'use strict';

    // Hide loader immediately when DOM is ready
    function hideLoader() {
        try {
            const loader = document.getElementById('page-loader');
            if (!loader || loader.classList.contains('loaded')) return;

            loader.classList.add('loaded');

            // Remove from DOM after fade (keep a tiny delay for CSS transition)
            setTimeout(function() {
                try {
                    if (loader.parentNode) loader.parentNode.removeChild(loader);
                } catch (_) {
                    // no-op
                }
            }, 450);
        } catch (_) {
            // If anything goes wrong, don't block the page.
            const loader = document.getElementById('page-loader');
            if (loader) loader.classList.add('loaded');
        }
    }

    // Multiple fallback triggers to ensure loader hides
    
    // 1. DOM Content Loaded (fastest)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(hideLoader, 60);
        });
    } else {
        // DOM already loaded
        setTimeout(hideLoader, 60);
    }

    // 2. Window load (backup)
    window.addEventListener('load', hideLoader);

    // 2.5. Back/forward cache (Safari/Chrome)
    window.addEventListener('pageshow', hideLoader);

    // 3. Hard fallback - always hide quickly even if something breaks
    setTimeout(hideLoader, 900);

})();
