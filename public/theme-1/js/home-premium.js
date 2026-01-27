/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                     ULTRA PREMIUM HOME PAGE - JavaScript
 *         Ultra Hero Slider + Content Animation + Smooth Interactions
 * ═══════════════════════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', function() {
    initUltraHeroSlider();
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
 * ULTRA HERO SLIDER
 * Fullscreen with per-slide content animations + vertical progress
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initUltraHeroSlider() {
    const heroSection = document.querySelector('.hero-ultra');
    const sliderWrapper = document.querySelector('.hero-slider-ultra');
    
    // Fallback to legacy slider if ultra doesn't exist
    if (!heroSection || !sliderWrapper) {
        initPremiumHeroSlider();
        return;
    }
    
    const slides = sliderWrapper.querySelectorAll('.hero-slide-ultra');
    const progressDots = document.querySelectorAll('.progress-dot');
    const progressLineFill = document.querySelector('.progress-line-fill');
    const prevBtn = heroSection.querySelector('.hero-nav-prev');
    const nextBtn = heroSection.querySelector('.hero-nav-next');
    const counterCurrent = heroSection.querySelector('.progress-counter .counter-current');
    const prevNumber = heroSection.querySelector('.prev-number');
    const nextNumber = heroSection.querySelector('.next-number');
    
    if (slides.length === 0) return;
    
    let currentIndex = 0;
    let autoplayInterval = null;
    let isPaused = false;
    const slideDuration = 7000; // 7 seconds per slide
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    /**
     * Update all counters and navigation numbers
     */
    function updateCounters(index) {
        const current = index + 1;
        const prev = index === 0 ? slides.length : index;
        const next = index === slides.length - 1 ? 1 : index + 2;
        
        if (counterCurrent) {
            counterCurrent.textContent = String(current).padStart(2, '0');
        }
        if (prevNumber) {
            prevNumber.textContent = String(prev).padStart(2, '0');
        }
        if (nextNumber) {
            nextNumber.textContent = String(next).padStart(2, '0');
        }
    }
    
    /**
     * Update progress dots
     */
    function updateProgressDots(index) {
        progressDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
    
    /**
     * Reset progress line animation
     */
    function resetProgressLine() {
        if (!progressLineFill) return;
        
        // Reset animation
        progressLineFill.style.animation = 'none';
        progressLineFill.offsetHeight; // Trigger reflow
        progressLineFill.style.animation = `progressVertical ${slideDuration}ms linear forwards`;
    }
    
    /**
     * Go to specific slide with content animation
     */
    function goToSlide(index, resetProgress = true) {
        // Bounds check
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        // Remove active from current slide
        slides[currentIndex].classList.remove('active');
        
        // Activate new slide
        currentIndex = index;
        slides[currentIndex].classList.add('active');
        
        // Update all UI elements
        updateCounters(currentIndex);
        updateProgressDots(currentIndex);
        
        // Reset progress and autoplay
        if (!prefersReducedMotion && !isPaused && resetProgress) {
            resetProgressLine();
            resetAutoplay();
        }
    }
    
    /**
     * Next slide
     */
    function nextSlide() {
        goToSlide(currentIndex + 1);
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
        if (progressLineFill) {
            progressLineFill.style.animationPlayState = 'paused';
        }
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
        if (progressLineFill) {
            progressLineFill.style.animationPlayState = 'running';
        }
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
    
    // Progress dots click navigation
    progressDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });
    
    // Pause on hover (desktop)
    heroSection.addEventListener('mouseenter', pauseSlider);
    heroSection.addEventListener('mouseleave', resumeSlider);
    
    // Touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    sliderWrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        pauseSlider();
    }, { passive: true });
    
    sliderWrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        setTimeout(resumeSlider, 300);
    }, { passive: true });
    
    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        const threshold = 50;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                prevSlide(); // Swipe left = prev in RTL
            } else {
                nextSlide(); // Swipe right = next in RTL
            }
        }
    }
    
    // Keyboard navigation
    heroSection.setAttribute('tabindex', '0');
    heroSection.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            prevSlide(); // RTL
        } else if (e.key === 'ArrowLeft') {
            nextSlide(); // RTL
        } else if (e.key === 'Escape') {
            if (isPaused) resumeSlider();
            else pauseSlider();
        }
    });
    
    // Initialize first slide
    updateCounters(0);
    updateProgressDots(0);
    
    // Start autoplay if motion is allowed
    if (!prefersReducedMotion) {
        resetProgressLine();
        resetAutoplay();
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
 * LEGACY PREMIUM HERO SLIDER (Fallback)
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
    const slideDuration = 6000;
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    function updateCounter(index) {
        if (counterCurrent) {
            counterCurrent.textContent = String(index + 1).padStart(2, '0');
        }
    }
    
    function goToSlide(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        slides[currentIndex].classList.remove('active');
        progressItems.forEach((item, i) => {
            item.classList.remove('active', 'completed');
            if (i < index) item.classList.add('completed');
        });
        
        currentIndex = index;
        slides[currentIndex].classList.add('active');
        if (progressItems[currentIndex]) progressItems[currentIndex].classList.add('active');
        updateCounter(currentIndex);
        
        if (!prefersReducedMotion) resetAutoplay();
    }
    
    function resetAutoplay() {
        if (autoplayInterval) clearInterval(autoplayInterval);
        autoplayInterval = setInterval(() => goToSlide(currentIndex + 1), slideDuration);
    }
    
    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    
    progressItems.forEach((item, index) => {
        item.addEventListener('click', () => goToSlide(index));
    });
    
    updateCounter(0);
    if (progressItems[0]) progressItems[0].classList.add('active');
    if (!prefersReducedMotion) resetAutoplay();
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SMOOTH SCROLL - For scroll down button
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initSmoothScroll() {
    // Support both new and old scroll buttons
    const scrollBtns = document.querySelectorAll('.hero-scroll-ultra, .hero-scroll-btn');
    
    scrollBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = btn.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.getBoundingClientRect().top + window.pageYOffset;
                const navbarHeight = 80;
                
                window.scrollTo({
                    top: offsetTop - navbarHeight,
                    behavior: 'smooth'
                });
            }
        });
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
