/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                     PREMIUM HOME PAGE - JavaScript
 *              Premium Hero Slider + Cinematic Motion + Smooth Scroll
 * ═══════════════════════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', function() {
    initPremiumHeroSlider();
    initScrollReveal();
    initCounters();
    initFieldsScroll();
    initProjectsCarousel();
    initTeamSlider();
    initNavbarScroll();
    initMobileMenu();
    initSmoothScroll();
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PREMIUM HERO SLIDER
 * Crossfade with Ken Burns effect + Progress indicators + Light theme
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initPremiumHeroSlider() {
    const heroSection = document.querySelector('.hero-premium');
    const sliderWrapper = document.querySelector('.hero-slider-premium');
    if (!heroSection || !sliderWrapper) return;
    
    const slides = sliderWrapper.querySelectorAll('.hero-slide-premium');
    const progressItems = document.querySelectorAll('.hero-progress-item');
    const prevBtn = heroSection.querySelector('.hero-nav-prev');
    const nextBtn = heroSection.querySelector('.hero-nav-next');
    const counterCurrent = heroSection.querySelector('.counter-current');
    
    if (slides.length === 0) return;
    
    let currentIndex = 0;
    let autoplayInterval = null;
    let isPaused = false;
    const slideDuration = 6000; // 6 seconds per slide
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    /**
     * Update slide counter display
     */
    function updateCounter(index) {
        if (counterCurrent) {
            counterCurrent.textContent = String(index + 1).padStart(2, '0');
        }
    }
    
    /**
     * Go to specific slide
     */
    function goToSlide(index, resetProgress = true) {
        // Bounds check
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        // Remove active from current slide
        slides[currentIndex].classList.remove('active');
        
        // Reset progress bars
        progressItems.forEach((item, i) => {
            item.classList.remove('active', 'completed');
            if (i < index) {
                item.classList.add('completed');
            }
        });
        
        // Activate new slide
        currentIndex = index;
        slides[currentIndex].classList.add('active');
        
        // Activate progress for current
        if (progressItems[currentIndex]) {
            progressItems[currentIndex].classList.add('active');
        }
        
        // Update counter
        updateCounter(currentIndex);
        
        // Reset autoplay timer
        if (!prefersReducedMotion && !isPaused && resetProgress) {
            resetAutoplay();
        }
    }
    
    /**
     * Next slide
     */
    function nextSlide() {
        const next = (currentIndex + 1) % slides.length;
        
        // If cycling back to start, reset all progress
        if (next === 0) {
            progressItems.forEach(item => item.classList.remove('completed'));
        }
        
        goToSlide(next);
    }
    
    /**
     * Previous slide
     */
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }
    
    /**
     * Reset autoplay interval
     */
    function resetAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
        autoplayInterval = setInterval(nextSlide, slideDuration);
    }
    
    /**
     * Pause slider
     */
    function pauseSlider() {
        isPaused = true;
        sliderWrapper.classList.add('paused');
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
    }
    
    /**
     * Resume slider
     */
    function resumeSlider() {
        isPaused = false;
        sliderWrapper.classList.remove('paused');
        if (!prefersReducedMotion) {
            resetAutoplay();
        }
    }
    
    // Navigation button events
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            prevSlide();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            nextSlide();
        });
    }
    
    // Progress bar click navigation
    progressItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            goToSlide(index);
        });
    });
    
    // Pause on hover (desktop)
    heroSection.addEventListener('mouseenter', pauseSlider);
    heroSection.addEventListener('mouseleave', resumeSlider);
    
    // Touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    let isTouching = false;
    
    sliderWrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        isTouching = true;
        pauseSlider();
    }, { passive: true });
    
    sliderWrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        isTouching = false;
        handleSwipe();
        // Resume after a short delay
        setTimeout(resumeSlider, 300);
    }, { passive: true });
    
    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        const threshold = 50;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swipe left = next in RTL
                prevSlide();
            } else {
                // Swipe right = prev in RTL
                nextSlide();
            }
        }
    }
    
    // Keyboard navigation
    heroSection.setAttribute('tabindex', '0');
    heroSection.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            prevSlide(); // RTL: right = previous
        } else if (e.key === 'ArrowLeft') {
            nextSlide(); // RTL: left = next
        } else if (e.key === 'Escape') {
            if (isPaused) resumeSlider();
            else pauseSlider();
        }
    });
    
    // Initialize first slide
    updateCounter(0);
    if (progressItems[0]) {
        progressItems[0].classList.add('active');
    }
    
    // Start autoplay if motion is allowed
    if (!prefersReducedMotion) {
        resetAutoplay();
    } else {
        // For reduced motion: show all progress as complete
        progressItems.forEach(item => item.classList.add('completed'));
    }
    
    // Visibility change: pause when tab is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            pauseSlider();
        } else if (!prefersReducedMotion) {
            resumeSlider();
        }
    });
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SMOOTH SCROLL - For scroll down button
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initSmoothScroll() {
    const scrollBtn = document.querySelector('.hero-scroll-btn');
    if (!scrollBtn) return;
    
    scrollBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = scrollBtn.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.getBoundingClientRect().top + window.pageYOffset;
            const navbarHeight = 80; // Account for fixed navbar
            
            window.scrollTo({
                top: offsetTop - navbarHeight,
                behavior: 'smooth'
            });
        }
    });
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
