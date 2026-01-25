/**
 * Main JavaScript - Premium Light Theme
 * Hero Slider + Scroll Reveals + Counters + Navigation
 * 
 * Features:
 * - Cinematic hero slider with Ken Burns effect
 * - Smooth scroll reveals with IntersectionObserver
 * - Animated counters with easing
 * - Horizontal scroll sections
 * - Performance optimized
 */

(function() {
    'use strict';
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // ==========================================================================
    // Hero Slider
    // ==========================================================================
    
    class HeroSlider {
        constructor(element) {
            this.slider = element;
            this.slides = element.querySelectorAll('.hero-slide');
            this.dotsContainer = element.querySelector('.hero-dots');
            this.prevBtn = element.querySelector('.hero-nav.prev');
            this.nextBtn = element.querySelector('.hero-nav.next');
            this.progressBar = element.querySelector('.hero-progress-bar');
            
            this.currentIndex = 0;
            this.slideCount = this.slides.length;
            this.autoplayInterval = null;
            this.progressInterval = null;
            this.autoplayDuration = parseInt(element.dataset.autoplay) || 5000;
            this.isPaused = false;
            
            if (this.slideCount > 0) {
                this.init();
            }
        }
        
        init() {
            this.createDots();
            this.bindEvents();
            this.startAutoplay();
        }
        
        createDots() {
            if (!this.dotsContainer) return;
            
            this.dotsContainer.innerHTML = '';
            for (let i = 0; i < this.slideCount; i++) {
                const dot = document.createElement('button');
                dot.className = `hero-dot${i === 0 ? ' active' : ''}`;
                dot.setAttribute('aria-label', `انتقل للشريحة ${i + 1}`);
                dot.addEventListener('click', () => this.goToSlide(i));
                this.dotsContainer.appendChild(dot);
            }
            this.dots = this.dotsContainer.querySelectorAll('.hero-dot');
        }
        
        bindEvents() {
            // Navigation buttons
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', () => this.prev());
            }
            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', () => this.next());
            }
            
            // Pause on hover
            this.slider.addEventListener('mouseenter', () => this.pause());
            this.slider.addEventListener('mouseleave', () => this.resume());
            
            // Touch/Swipe support
            let touchStartX = 0;
            let touchEndX = 0;
            
            this.slider.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            this.slider.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe(touchStartX, touchEndX);
            }, { passive: true });
            
            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight') this.prev();
                if (e.key === 'ArrowLeft') this.next();
            });
        }
        
        handleSwipe(startX, endX) {
            const threshold = 50;
            const diff = startX - endX;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.next(); // Swipe left -> next (RTL)
                } else {
                    this.prev(); // Swipe right -> prev (RTL)
                }
            }
        }
        
        goToSlide(index) {
            // Remove active from current slide
            this.slides[this.currentIndex].classList.remove('active');
            if (this.dots && this.dots[this.currentIndex]) {
                this.dots[this.currentIndex].classList.remove('active');
            }
            
            // Update index
            this.currentIndex = index;
            
            // Add active to new slide
            this.slides[this.currentIndex].classList.add('active');
            if (this.dots && this.dots[this.currentIndex]) {
                this.dots[this.currentIndex].classList.add('active');
            }
            
            // Reset progress
            this.resetProgress();
        }
        
        next() {
            const nextIndex = (this.currentIndex + 1) % this.slideCount;
            this.goToSlide(nextIndex);
        }
        
        prev() {
            const prevIndex = (this.currentIndex - 1 + this.slideCount) % this.slideCount;
            this.goToSlide(prevIndex);
        }
        
        startAutoplay() {
            if (prefersReducedMotion) return;
            
            this.autoplayInterval = setInterval(() => {
                if (!this.isPaused) {
                    this.next();
                }
            }, this.autoplayDuration);
            
            this.startProgress();
        }
        
        startProgress() {
            if (!this.progressBar || prefersReducedMotion) return;
            
            let progress = 0;
            const increment = 100 / (this.autoplayDuration / 50);
            
            this.progressInterval = setInterval(() => {
                if (!this.isPaused) {
                    progress += increment;
                    this.progressBar.style.width = `${Math.min(progress, 100)}%`;
                }
            }, 50);
        }
        
        resetProgress() {
            if (!this.progressBar) return;
            
            clearInterval(this.progressInterval);
            this.progressBar.style.width = '0%';
            this.startProgress();
        }
        
        pause() {
            this.isPaused = true;
        }
        
        resume() {
            this.isPaused = false;
        }
        
        destroy() {
            clearInterval(this.autoplayInterval);
            clearInterval(this.progressInterval);
        }
    }
    
    // ==========================================================================
    // Scroll Reveal
    // ==========================================================================
    
    function initScrollReveal() {
        if (prefersReducedMotion) {
            // Make all elements visible immediately
            document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
                el.classList.add('revealed');
            });
            return;
        }
        
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
            observer.observe(el);
        });
    }
    
    // ==========================================================================
    // Counter Animation
    // ==========================================================================
    
    function animateCounter(element, target, duration = 2000) {
        if (prefersReducedMotion) {
            element.textContent = formatNumber(target);
            return;
        }
        
        const startTime = performance.now();
        const startValue = 0;
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(startValue + (target - startValue) * easeOut);
            
            element.textContent = formatNumber(currentValue);
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }
    
    function formatNumber(num) {
        if (num >= 1000) {
            return num.toLocaleString('ar-SA');
        }
        return num.toString();
    }
    
    function initCounters() {
        const counterElements = document.querySelectorAll('[data-count]');
        
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.count, 10);
                    animateCounter(entry.target, target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        counterElements.forEach(el => observer.observe(el));
    }
    
    // ==========================================================================
    // Navigation
    // ==========================================================================
    
    function initNavigation() {
        const navbar = document.querySelector('.navbar');
        const toggle = document.querySelector('.navbar-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        // Scroll effect
        if (navbar) {
            let lastScrollY = window.scrollY;
            
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                
                lastScrollY = window.scrollY;
            }, { passive: true });
        }
        
        // Mobile menu toggle
        if (toggle && mobileMenu) {
            toggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
                toggle.classList.toggle('active');
                document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
            });
            
            // Close menu on link click
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.remove('active');
                    toggle.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
        }
    }
    
    // ==========================================================================
    // Horizontal Scroll
    // ==========================================================================
    
    function initHorizontalScroll() {
        document.querySelectorAll('.fields-scroll-wrapper, .team-scroll-wrapper').forEach(wrapper => {
            const scrollContainer = wrapper.querySelector('.fields-scroll, .team-scroll');
            const prevBtn = wrapper.querySelector('.scroll-nav.prev');
            const nextBtn = wrapper.querySelector('.scroll-nav.next');
            
            if (!scrollContainer) return;
            
            const scrollAmount = 300;
            
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                });
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                });
            }
            
            // Drag to scroll
            let isDown = false;
            let startX;
            let scrollLeft;
            
            scrollContainer.addEventListener('mousedown', (e) => {
                isDown = true;
                scrollContainer.style.cursor = 'grabbing';
                startX = e.pageX - scrollContainer.offsetLeft;
                scrollLeft = scrollContainer.scrollLeft;
            });
            
            scrollContainer.addEventListener('mouseleave', () => {
                isDown = false;
                scrollContainer.style.cursor = 'grab';
            });
            
            scrollContainer.addEventListener('mouseup', () => {
                isDown = false;
                scrollContainer.style.cursor = 'grab';
            });
            
            scrollContainer.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - scrollContainer.offsetLeft;
                const walk = (x - startX) * 2;
                scrollContainer.scrollLeft = scrollLeft - walk;
            });
            
            // Set initial cursor
            scrollContainer.style.cursor = 'grab';
        });
    }
    
    // ==========================================================================
    // Smooth Scroll for Anchor Links
    // ==========================================================================
    
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                    const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: prefersReducedMotion ? 'auto' : 'smooth'
                    });
                }
            });
        });
    }
    
    // ==========================================================================
    // Set Current Year
    // ==========================================================================
    
    function setCurrentYear() {
        const yearElements = document.querySelectorAll('[data-year]');
        const currentYear = new Date().getFullYear();
        yearElements.forEach(el => {
            el.textContent = currentYear;
        });
    }
    
    // ==========================================================================
    // Initialize
    // ==========================================================================
    
    function init() {
        // Hero Slider
        const heroSlider = document.querySelector('.hero-slider');
        if (heroSlider) {
            new HeroSlider(heroSlider);
        }
        
        // Scroll Reveal
        initScrollReveal();
        
        // Counters
        initCounters();
        
        // Navigation
        initNavigation();
        
        // Horizontal Scroll
        initHorizontalScroll();
        
        // Smooth Scroll
        initSmoothScroll();
        
        // Current Year
        setCurrentYear();
    }
    
    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
