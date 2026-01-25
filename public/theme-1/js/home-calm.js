/*
╔══════════════════════════════════════════════════════════════════════════════╗
║                    CALM HOMEPAGE - JavaScript                                ║
║              Subtle Animations & Scroll Reveals                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
*/

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initScrollReveals();
    initCounterAnimation();
    initSmoothScroll();
    initCurrentYear();
    initScrollToTop();
});

/* ═══════════════════════════════════════════════════════════════════════════
   SCROLL REVEAL - IntersectionObserver
   ═══════════════════════════════════════════════════════════════════════════ */
function initScrollReveals() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Show all elements immediately if reduced motion is preferred
        document.querySelectorAll('.calm-reveal, .calm-reveal-stagger').forEach(el => {
            el.classList.add('revealed');
        });
        return;
    }
    
    const revealElements = document.querySelectorAll('.calm-reveal, .calm-reveal-stagger');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // If it's a KPI container, trigger counter animation
                if (entry.target.classList.contains('calm-reveal-stagger')) {
                    const counters = entry.target.querySelectorAll('[data-count]');
                    counters.forEach(counter => animateCounter(counter));
                }
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
}

/* ═══════════════════════════════════════════════════════════════════════════
   COUNTER ANIMATION - Number counting up
   ═══════════════════════════════════════════════════════════════════════════ */
function initCounterAnimation() {
    // Initial counters in hero (if any)
    const heroCounters = document.querySelectorAll('.calm-hero [data-count]');
    heroCounters.forEach(counter => {
        setTimeout(() => animateCounter(counter), 500);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'), 10);
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out cubic
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(startValue + (target - startValue) * easeProgress);
        
        // Format number with commas for large numbers
        element.textContent = formatNumber(currentValue) + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = formatNumber(target) + suffix;
        }
    }
    
    requestAnimationFrame(updateCounter);
}

function formatNumber(num) {
    if (num >= 1000) {
        return num.toLocaleString('ar-SA');
    }
    return num.toString();
}

/* ═══════════════════════════════════════════════════════════════════════════
   SMOOTH SCROLL
   ═══════════════════════════════════════════════════════════════════════════ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* ═══════════════════════════════════════════════════════════════════════════
   CURRENT YEAR
   ═══════════════════════════════════════════════════════════════════════════ */
function initCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCROLL TO TOP
   ═══════════════════════════════════════════════════════════════════════════ */
function initScrollToTop() {
    const scrollBtn = document.querySelector('.scroll-to-top');
    if (!scrollBtn) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    }, { passive: true });
    
    // Scroll to top on click
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ═══════════════════════════════════════════════════════════════════════════
   NAVBAR SCROLL BEHAVIOR
   ═══════════════════════════════════════════════════════════════════════════ */
(function() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let lastScrollY = 0;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Add scrolled class for styling
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    }, { passive: true });
})();
