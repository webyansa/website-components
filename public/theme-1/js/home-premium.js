/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                     PREMIUM HOME PAGE - JavaScript
 *                   Cinematic Slider + Reveal + Interactions
 * ═══════════════════════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', function() {
    initCinematicHero();
    initScrollReveal();
    initCounters();
    initFieldsScroll();
    initProjectsCarousel();
    initTeamSlider();
    initNavbarScroll();
    initMobileMenu();
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CINEMATIC HERO SLIDER
 * Crossfade with Ken Burns effect + Progress bars
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initCinematicHero() {
    const slider = document.querySelector('.hero-cinema-slider');
    if (!slider) return;
    
    const slides = slider.querySelectorAll('.hero-cinema-slide');
    const progressBars = slider.querySelectorAll('.hero-progress-bar');
    const dotsContainer = slider.querySelector('.hero-cinema-dots');
    const prevBtn = slider.querySelector('.hero-nav-prev');
    const nextBtn = slider.querySelector('.hero-nav-next');
    
    if (slides.length === 0) return;
    
    let currentIndex = 0;
    let interval = null;
    let isPaused = false;
    const duration = 7000; // 7 seconds per slide
    
    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Create dots
    if (dotsContainer) {
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'hero-cinema-dot' + (index === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `الانتقال للشريحة ${index + 1}`);
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }
    
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.hero-cinema-dot') : [];
    
    function goToSlide(index) {
        // Remove active from current
        slides[currentIndex].classList.remove('active');
        if (progressBars[currentIndex]) {
            progressBars[currentIndex].classList.remove('active', 'completed');
        }
        if (dots[currentIndex]) {
            dots[currentIndex].classList.remove('active');
        }
        
        // Mark previous as completed
        for (let i = 0; i < index; i++) {
            if (progressBars[i]) {
                progressBars[i].classList.add('completed');
                progressBars[i].classList.remove('active');
            }
        }
        
        // Reset future
        for (let i = index; i < slides.length; i++) {
            if (progressBars[i]) {
                progressBars[i].classList.remove('completed');
            }
        }
        
        // Activate new
        currentIndex = index;
        slides[currentIndex].classList.add('active');
        if (progressBars[currentIndex]) {
            progressBars[currentIndex].classList.remove('completed');
            progressBars[currentIndex].classList.add('active');
        }
        if (dots[currentIndex]) {
            dots[currentIndex].classList.add('active');
        }
        
        // Reset autoplay timer
        if (!prefersReducedMotion && !isPaused) {
            resetInterval();
        }
    }
    
    function nextSlide() {
        const next = (currentIndex + 1) % slides.length;
        
        // If we're going back to 0, reset all progress bars
        if (next === 0) {
            progressBars.forEach(bar => bar.classList.remove('completed'));
        }
        
        goToSlide(next);
    }
    
    function prevSlide() {
        const prev = (currentIndex - 1 + slides.length) % slides.length;
        goToSlide(prev);
    }
    
    function resetInterval() {
        if (interval) clearInterval(interval);
        interval = setInterval(nextSlide, duration);
    }
    
    // Navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
        });
    }
    
    // Pause on hover
    slider.addEventListener('mouseenter', () => {
        isPaused = true;
        slider.classList.add('paused');
        if (interval) clearInterval(interval);
    });
    
    slider.addEventListener('mouseleave', () => {
        isPaused = false;
        slider.classList.remove('paused');
        if (!prefersReducedMotion) {
            resetInterval();
        }
    });
    
    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                // Swipe left (next in RTL)
                prevSlide();
            } else {
                // Swipe right (prev in RTL)
                nextSlide();
            }
        }
    }
    
    // Keyboard navigation
    slider.setAttribute('tabindex', '0');
    slider.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            prevSlide(); // RTL
        } else if (e.key === 'ArrowLeft') {
            nextSlide(); // RTL
        }
    });
    
    // Start autoplay if motion is allowed
    if (!prefersReducedMotion) {
        // Activate first progress bar
        if (progressBars[0]) {
            progressBars[0].classList.add('active');
        }
        resetInterval();
    }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SCROLL REVEAL - IntersectionObserver
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initScrollReveal() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // If reduced motion, show everything immediately
    if (prefersReducedMotion) {
        document.querySelectorAll('.ds-reveal, .ds-reveal-stagger, .ds-reveal-scale').forEach(el => {
            el.classList.add('revealed');
        });
        return;
    }
    
    const revealElements = document.querySelectorAll('.ds-reveal, .ds-reveal-stagger, .ds-reveal-scale');
    
    if (revealElements.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    revealElements.forEach(el => observer.observe(el));
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ANIMATED COUNTERS
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length === 0) return;
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'), 10);
                const suffix = el.getAttribute('data-suffix') || '';
                
                if (prefersReducedMotion) {
                    el.textContent = formatNumber(target) + suffix;
                } else {
                    animateCount(el, target, suffix);
                }
                
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCount(element, target, suffix) {
    const duration = 2000;
    let startTime = null;
    
    function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }
    
    function update(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(easeOutExpo(progress) * target);
        
        element.textContent = formatNumber(current) + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = formatNumber(target) + suffix;
        }
    }
    
    requestAnimationFrame(update);
}

function formatNumber(num) {
    return num.toLocaleString('ar-SA');
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FIELDS HORIZONTAL SCROLL - Drag to scroll
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initFieldsScroll() {
    const container = document.querySelector('.fields-scroll-container');
    if (!container) return;
    
    let isDown = false;
    let startX;
    let scrollLeft;
    
    container.addEventListener('mousedown', (e) => {
        isDown = true;
        container.classList.add('dragging');
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    });
    
    container.addEventListener('mouseleave', () => {
        isDown = false;
        container.classList.remove('dragging');
    });
    
    container.addEventListener('mouseup', () => {
        isDown = false;
        container.classList.remove('dragging');
    });
    
    container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
    });
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PROJECTS CAROUSEL
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initProjectsCarousel() {
    const carousel = document.querySelector('.projects-carousel');
    if (!carousel) return;
    
    const track = carousel.querySelector('.projects-carousel-track');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    
    if (!track) return;
    
    const cardWidth = 380 + 24; // card width + gap
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            track.scrollBy({ left: cardWidth, behavior: 'smooth' }); // RTL
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            track.scrollBy({ left: -cardWidth, behavior: 'smooth' }); // RTL
        });
    }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TEAM SLIDER
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initTeamSlider() {
    const slider = document.querySelector('.team-slider');
    if (!slider) return;
    
    const track = slider.querySelector('.team-slider-track');
    const prevBtn = slider.querySelector('.team-prev');
    const nextBtn = slider.querySelector('.team-next');
    
    if (!track) return;
    
    const cardWidth = 280 + 24;
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            track.scrollBy({ left: cardWidth, behavior: 'smooth' });
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        });
    }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * NAVBAR SCROLL EFFECT
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let ticking = false;
    
    function updateNavbar() {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }, { passive: true });
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MOBILE MENU
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initMobileMenu() {
    const toggle = document.querySelector('.navbar-toggle');
    const mobile = document.querySelector('.navbar-mobile');
    const overlay = document.querySelector('.mobile-overlay');
    const closeBtn = document.querySelector('.navbar-mobile-close');
    
    if (!toggle || !mobile) return;
    
    function openMenu() {
        toggle.classList.add('active');
        mobile.classList.add('open');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeMenu() {
        toggle.classList.remove('active');
        mobile.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    toggle.addEventListener('click', () => {
        if (mobile.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMenu);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }
    
    // Mobile dropdowns
    const dropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const parent = toggle.closest('.mobile-dropdown');
            parent.classList.toggle('open');
        });
    });
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * UTILITY: Set current year
 * ═══════════════════════════════════════════════════════════════════════════
 */
document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});
