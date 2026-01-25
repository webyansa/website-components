/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                     PREMIUM ASSOCIATION TEMPLATE
 *                         Page Loader Module
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';

    // Create loader HTML
    function createLoader() {
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.id = 'page-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <img src="assets/img/logo.svg" alt="جاري التحميل..." class="loader-logo" onerror="this.style.display='none'">
                <div class="loader-spinner"></div>
                <div class="loader-progress">
                    <div class="loader-progress-bar"></div>
                </div>
                <div class="loader-dots">
                    <span class="loader-dot"></span>
                    <span class="loader-dot"></span>
                    <span class="loader-dot"></span>
                </div>
            </div>
        `;
        return loader;
    }

    // Insert loader at start
    document.addEventListener('DOMContentLoaded', function() {
        const existingLoader = document.getElementById('page-loader');
        if (!existingLoader) {
            document.body.insertBefore(createLoader(), document.body.firstChild);
        }
    });

    // Hide loader when page is fully loaded
    window.addEventListener('load', function() {
        const loader = document.getElementById('page-loader');
        if (loader) {
            // Minimum display time for smooth experience
            setTimeout(function() {
                loader.classList.add('loaded');
                
                // Remove from DOM after transition
                setTimeout(function() {
                    if (loader.parentNode) {
                        loader.parentNode.removeChild(loader);
                    }
                }, 500);
            }, 800);
        }
    });

    // Fallback: Hide loader after 5 seconds max
    setTimeout(function() {
        const loader = document.getElementById('page-loader');
        if (loader && !loader.classList.contains('loaded')) {
            loader.classList.add('loaded');
        }
    }, 5000);

})();
