/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                         قالب الجمعية 1 - Main JS
 *                    المنطق الرئيسي وتفاعلات الصفحات
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    initNavbarScroll();
    initCounters();
    initProjectFilters();
    initSearch();
    initFormValidation();
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * NAVBAR SCROLL EFFECT
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ANIMATED COUNTERS (Stats Section)
 * Using IntersectionObserver for performance
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (counters.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
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
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // ~60fps
    let current = 0;

    const suffix = element.getAttribute('data-suffix') || '';
    const prefix = element.getAttribute('data-prefix') || '';

    const updateCounter = () => {
        current += step;
        if (current < target) {
            element.textContent = prefix + Math.floor(current).toLocaleString('ar-SA') + suffix;
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = prefix + target.toLocaleString('ar-SA') + suffix;
        }
    };

    updateCounter();
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PROJECT FILTERS
 * Filter projects by status (all / in-progress / completed)
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    const projectCards = document.querySelectorAll('[data-status]');

    if (filterButtons.length === 0 || projectCards.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter projects
            projectCards.forEach(card => {
                const status = card.getAttribute('data-status');
                
                if (filter === 'all' || status === filter) {
                    card.style.display = '';
                    card.classList.add('animate-fadeInUp');
                } else {
                    card.style.display = 'none';
                    card.classList.remove('animate-fadeInUp');
                }
            });
        });
    });
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SEARCH FUNCTIONALITY
 * Live search for projects and files
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initSearch() {
    const searchInput = document.querySelector('[data-search]');
    if (!searchInput) return;

    const targetSelector = searchInput.getAttribute('data-search');
    const items = document.querySelectorAll(targetSelector);

    searchInput.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();

        items.forEach(item => {
            const title = item.querySelector('[data-searchable]')?.textContent.toLowerCase() || '';
            const match = title.includes(query);

            if (match || query === '') {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FORM VALIDATION
 * Client-side validation with visual feedback
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initFormValidation() {
    const forms = document.querySelectorAll('[data-validate]');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                // Show success toast
                showToast('success', 'تم الإرسال بنجاح', 'سيتم التواصل معك قريباً');
                this.reset();
                clearValidation(this);
            }
        });

        // Real-time validation on input
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
 * Show success/error/info messages
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
    toast.style.animation = 'fadeIn 0.3s ease reverse forwards';
    setTimeout(() => {
        toast.remove();
    }, 300);
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SMOOTH SCROLL TO SECTIONS
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
 * UTILITY: Arabic Number Formatting
 * ═══════════════════════════════════════════════════════════════════════════
 */
function formatArabicNumber(num) {
    return num.toLocaleString('ar-SA');
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LAZY LOAD IMAGES
 * ═══════════════════════════════════════════════════════════════════════════
 */
if ('IntersectionObserver' in window) {
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
