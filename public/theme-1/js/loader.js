/**
 * Premium Association Template - Page Loader
 * Simple & Reliable Implementation
 */

(function() {
    'use strict';

    // Hide loader immediately when DOM is ready
    function hideLoader() {
        const loader = document.getElementById('page-loader');
        if (loader && !loader.classList.contains('loaded')) {
            loader.classList.add('loaded');
            // Remove from DOM after fade
            setTimeout(function() {
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            }, 400);
        }
    }

    // Multiple fallback triggers to ensure loader hides
    
    // 1. DOM Content Loaded (fastest)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(hideLoader, 300);
        });
    } else {
        // DOM already loaded
        setTimeout(hideLoader, 300);
    }

    // 2. Window load (backup)
    window.addEventListener('load', hideLoader);

    // 3. Hard fallback - always hide after 2 seconds max
    setTimeout(hideLoader, 2000);

})();
