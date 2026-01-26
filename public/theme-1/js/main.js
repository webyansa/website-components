/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                     PREMIUM ASSOCIATION TEMPLATE
 *                       Main JavaScript Module
 * 
 *  Features:
 *  - Smooth scroll reveals with IntersectionObserver
 *  - Animated counters with easing
 *  - Project filtering and search
 *  - Form validation with feedback
 *  - Toast notifications
 *  - Parallax effects
 *  - Performance optimized
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    initNavbarScroll();
    initScrollReveal();
    initCounters();
    initProjectFilters();
    initSearch();
    initFormValidation();
    initParallax();
    initLazyLoad();
    initScrollCue();
    setCurrentYear();
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * NAVBAR SCROLL EFFECT
 * Premium sticky navbar with glass morphism on scroll
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScrollY = 0;
    let ticking = false;

    function updateNavbar() {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }, { passive: true });
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SCROLL REVEAL ANIMATIONS
 * Elegant fade-in animations on scroll using IntersectionObserver
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initScrollReveal() {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
            el.classList.add('revealed');
        });
        return;
    }

    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (revealElements.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add stagger delay based on element index within parent
                const siblings = entry.target.parentElement?.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale') || [];
                const siblingIndex = Array.from(siblings).indexOf(entry.target);
                const delay = siblingIndex * 100;
                
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);
                
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ANIMATED COUNTERS
 * Smooth counting animation with easing function
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (counters.length === 0) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (prefersReducedMotion) {
                    // Show final value immediately
                    const target = parseInt(entry.target.getAttribute('data-counter'), 10);
                    const suffix = entry.target.getAttribute('data-suffix') || '';
                    const prefix = entry.target.getAttribute('data-prefix') || '';
                    entry.target.textContent = prefix + formatNumber(target) + suffix;
                } else {
                    animateCounter(entry.target);
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-counter'), 10);
    const duration = 2500;
    const suffix = element.getAttribute('data-suffix') || '';
    const prefix = element.getAttribute('data-prefix') || '';
    
    let startTime = null;

    function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function update(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutExpo(progress);
        const current = Math.floor(easedProgress * target);

        element.textContent = prefix + formatNumber(current) + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = prefix + formatNumber(target) + suffix;
        }
    }

    requestAnimationFrame(update);
}

function formatNumber(num) {
    return num.toLocaleString('ar-SA');
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PROJECT FILTERS
 * Animated filtering with smooth transitions
 * ═══════════════════════════════════════════════════════════════════════════ 
 */
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    const projectCards = document.querySelectorAll('[data-status]');

    if (filterButtons.length === 0 || projectCards.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');

            // Update active button with smooth transition
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter projects with stagger animation
            let visibleIndex = 0;
            
            projectCards.forEach((card, index) => {
                const status = card.getAttribute('data-status');
                const shouldShow = filter === 'all' || status === filter;

                if (shouldShow) {
                    card.style.transitionDelay = `${visibleIndex * 50}ms`;
                    card.style.display = '';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    requestAnimationFrame(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    });
                    
                    visibleIndex++;
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SEARCH FUNCTIONALITY
 * Real-time search with debouncing
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initSearch() {
    const searchInput = document.querySelector('[data-search]');
    if (!searchInput) return;

    const targetSelector = searchInput.getAttribute('data-search');
    const items = document.querySelectorAll(targetSelector);

    let debounceTimer;

    searchInput.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        
        debounceTimer = setTimeout(() => {
            const query = this.value.trim().toLowerCase();

            items.forEach(item => {
                const searchableElements = item.querySelectorAll('[data-searchable]');
                let text = '';
                
                searchableElements.forEach(el => {
                    text += ' ' + el.textContent.toLowerCase();
                });

                const match = text.includes(query) || query === '';

                if (match) {
                    item.style.display = '';
                    item.style.opacity = '1';
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 200);
                }
            });
        }, 150);
    });
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FORM VALIDATION
 * Premium validation with real-time feedback
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initFormValidation() {
    const forms = document.querySelectorAll('[data-validate]');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                showToast('success', 'تم الإرسال بنجاح', 'سيتم التواصل معك قريباً');
                this.reset();
                clearValidation(this);
            }
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateField(this);
                }
            });
        });
    });
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let message = '';

    // Required check
    if (field.hasAttribute('required') && value === '') {
        isValid = false;
        message = 'هذا الحقل مطلوب';
    }

    // Email validation
    if (type === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            message = 'يرجى إدخال بريد إلكتروني صحيح';
        }
    }

    // Phone validation (Saudi format)
    if (type === 'tel' && value !== '') {
        const phoneRegex = /^(05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            isValid = false;
            message = 'يرجى إدخال رقم جوال صحيح';
        }
    }

    // Min length
    const minLength = field.getAttribute('minlength');
    if (minLength && value.length < parseInt(minLength, 10)) {
        isValid = false;
        message = `يجب أن يكون الحقل ${minLength} أحرف على الأقل`;
    }

    // Update UI
    const feedback = field.parentElement.querySelector('.form-feedback');
    
    if (isValid) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        if (feedback) {
            feedback.classList.remove('invalid');
            feedback.classList.add('valid');
            feedback.textContent = '';
        }
    } else {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
        if (feedback) {
            feedback.classList.remove('valid');
            feedback.classList.add('invalid');
            feedback.textContent = message;
        }
    }

    return isValid;
}

function clearValidation(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.classList.remove('is-valid', 'is-invalid');
    });

    const feedbacks = form.querySelectorAll('.form-feedback');
    feedbacks.forEach(feedback => {
        feedback.textContent = '';
        feedback.classList.remove('valid', 'invalid');
    });
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TOAST NOTIFICATIONS
 * Premium notification system
 * ═══════════════════════════════════════════════════════════════════════════
 */
function showToast(type, title, message) {
    const container = document.querySelector('.toast-container') || createToastContainer();
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas ${icons[type]} toast-icon"></i>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" aria-label="إغلاق">
            <i class="fas fa-times"></i>
        </button>
    `;

    container.appendChild(toast);

    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        removeToast(toast);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        removeToast(toast);
    }, 5000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

function removeToast(toast) {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    setTimeout(() => {
        toast.remove();
    }, 300);
}

// Global function
window.showToast = showToast;

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PARALLAX EFFECTS
 * Subtle parallax for hero elements
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initParallax() {
    // Skip parallax if reduced motion is preferred
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (parallaxElements.length === 0) return;

    let ticking = false;

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;

                parallaxElements.forEach(el => {
                    const speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
                    const offset = scrollY * speed;
                    el.style.transform = `translateY(${offset}px)`;
                });

                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LAZY LOAD IMAGES
 * Performance optimized image loading
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initLazyLoad() {
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.loading = 'lazy';
        });
    } else if ('IntersectionObserver' in window) {
        // Fallback to IntersectionObserver
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SCROLL CUE ANIMATION
 * Animated scroll indicator
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initScrollCue() {
    const scrollCue = document.querySelector('.scroll-cue');
    if (!scrollCue) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            scrollCue.style.opacity = '0';
            scrollCue.style.pointerEvents = 'none';
        } else {
            scrollCue.style.opacity = '1';
            scrollCue.style.pointerEvents = 'auto';
        }
    }, { passive: true });

    scrollCue.addEventListener('click', function() {
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            const nextSection = heroSection.nextElementSibling;
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SMOOTH SCROLL
 * Enhanced smooth scrolling for anchor links
 * ═══════════════════════════════════════════════════════════════════════════
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * UTILITY FUNCTIONS
 * ═══════════════════════════════════════════════════════════════════════════
 */
function setCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * RIPPLE EFFECT FOR BUTTONS
 * Material Design inspired ripple effect
 * ═══════════════════════════════════════════════════════════════════════════
 */
document.addEventListener('click', function(e) {
    const button = e.target.closest('.btn');
    if (!button) return;
    
    // Check for reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
});
