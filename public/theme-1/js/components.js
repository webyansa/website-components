/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                     PREMIUM ASSOCIATION TEMPLATE
 *                     Components JavaScript Module
 * 
 *  Interactive Components:
 *  - Mobile navigation with smooth transitions
 *  - Modal dialogs with focus trap
 *  - Tabs with keyboard navigation
 *  - Accordions with animation
 *  - Scroll to top button
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initModals();
    initTabs();
    initAccordions();
    initAboutTabs();
    initJoinTabs();
    initSidebarNav();
    initScrollToTop();
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MOBILE MENU
 * Premium mobile navigation with smooth animations
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initMobileMenu() {
    const toggle = document.querySelector('.navbar-toggle');
    const mobileMenu = document.querySelector('.navbar-mobile');
    const closeBtn = document.querySelector('.navbar-mobile-close');
    const overlay = document.querySelector('.mobile-overlay');
    const mobileLinks = document.querySelectorAll('.navbar-mobile-link');
    const body = document.body;

    if (!toggle || !mobileMenu) return;

    // Toggle menu
    toggle.addEventListener('click', () => {
        openMobileMenu();
    });

    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeMobileMenu();
        });
    }

    // Overlay click
    if (overlay) {
        overlay.addEventListener('click', () => {
            closeMobileMenu();
        });
    }

    // Close on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
            closeMobileMenu();
        }
    });

    function openMobileMenu() {
        toggle.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
        mobileMenu.classList.add('open');
        if (overlay) overlay.classList.add('active');
        body.style.overflow = 'hidden';
        
        // Focus trap - focus first focusable element
        const firstFocusable = mobileMenu.querySelector('button, a');
        if (firstFocusable) {
            setTimeout(() => firstFocusable.focus(), 100);
        }
    }

    function closeMobileMenu() {
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
        body.style.overflow = '';
        toggle.focus();
    }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MODALS
 * Accessible modal dialogs with focus management
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = trigger.getAttribute('data-modal');
            openModal(modalId);
        });
    });

    // Close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if (modal) closeModal(modal.id);
        });
    });

    // Backdrop click
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', () => {
            const modalId = backdrop.getAttribute('data-modal-backdrop');
            if (modalId) closeModal(modalId);
        });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModalElement = document.querySelector('.modal.open');
            if (openModalElement) closeModal(openModalElement.id);
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    const backdrop = document.querySelector(`[data-modal-backdrop="${modalId}"]`);
    
    if (!modal) return;

    if (backdrop) backdrop.classList.add('open');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Focus first focusable element
    const focusableElements = modal.querySelectorAll(
        'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
        setTimeout(() => focusableElements[0].focus(), 100);
    }

    // Update ARIA
    modal.setAttribute('aria-hidden', 'false');
    if (backdrop) backdrop.setAttribute('aria-hidden', 'false');

    // Focus trap
    modal.addEventListener('keydown', trapFocus);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    const backdrop = document.querySelector(`[data-modal-backdrop="${modalId}"]`);
    
    if (!modal) return;

    if (backdrop) backdrop.classList.remove('open');
    modal.classList.remove('open');
    document.body.style.overflow = '';

    // Update ARIA
    modal.setAttribute('aria-hidden', 'true');
    if (backdrop) backdrop.setAttribute('aria-hidden', 'true');

    // Return focus to trigger
    const trigger = document.querySelector(`[data-modal="${modalId}"]`);
    if (trigger) trigger.focus();

    // Remove focus trap
    modal.removeEventListener('keydown', trapFocus);
}

function trapFocus(e) {
    if (e.key !== 'Tab') return;

    const modal = e.currentTarget;
    const focusableElements = modal.querySelectorAll(
        'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
        if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        }
    } else {
        if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
}

// Global functions
window.openModal = openModal;
window.closeModal = closeModal;

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TABS
 * Accessible tabs with keyboard navigation
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initTabs() {
    const tabGroups = document.querySelectorAll('.tabs');
    
    tabGroups.forEach(group => {
        const triggers = group.querySelectorAll('.tab-trigger');
        const contents = group.querySelectorAll('.tab-content');

        triggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const tabId = trigger.getAttribute('data-tab');
                activateTab(group, trigger, tabId);
            });

            // Keyboard navigation
            trigger.addEventListener('keydown', (e) => {
                handleTabKeyboard(e, triggers);
            });
        });
    });
}

function activateTab(group, trigger, tabId) {
    const triggers = group.querySelectorAll('.tab-trigger');
    const contents = group.querySelectorAll('.tab-content');

    // Update triggers
    triggers.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
        t.setAttribute('tabindex', '-1');
    });
    trigger.classList.add('active');
    trigger.setAttribute('aria-selected', 'true');
    trigger.setAttribute('tabindex', '0');

    // Update contents
    contents.forEach(content => {
        content.classList.remove('active');
        content.setAttribute('aria-hidden', 'true');
    });

    const activeContent = group.querySelector(`#${tabId}`);
    if (activeContent) {
        activeContent.classList.add('active');
        activeContent.setAttribute('aria-hidden', 'false');
    }
}

function handleTabKeyboard(e, triggers) {
    const triggersArray = Array.from(triggers);
    const currentIndex = triggersArray.indexOf(e.target);
    let newIndex;

    switch (e.key) {
        case 'ArrowRight':
            newIndex = currentIndex > 0 ? currentIndex - 1 : triggersArray.length - 1;
            triggersArray[newIndex].focus();
            triggersArray[newIndex].click();
            e.preventDefault();
            break;
        case 'ArrowLeft':
            newIndex = currentIndex < triggersArray.length - 1 ? currentIndex + 1 : 0;
            triggersArray[newIndex].focus();
            triggersArray[newIndex].click();
            e.preventDefault();
            break;
        case 'Home':
            triggersArray[0].focus();
            triggersArray[0].click();
            e.preventDefault();
            break;
        case 'End':
            triggersArray[triggersArray.length - 1].focus();
            triggersArray[triggersArray.length - 1].click();
            e.preventDefault();
            break;
    }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ACCORDIONS
 * Expandable/collapsible content sections
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initAccordions() {
    const accordions = document.querySelectorAll('.accordion');

    accordions.forEach(accordion => {
        const items = accordion.querySelectorAll('.accordion-item');
        const allowMultiple = accordion.hasAttribute('data-multiple');

        items.forEach(item => {
            const trigger = item.querySelector('.accordion-trigger');
            const content = item.querySelector('.accordion-content');

            if (!trigger || !content) return;

            trigger.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');

                // Close others if not multiple
                if (!allowMultiple) {
                    items.forEach(otherItem => {
                        if (otherItem !== item && otherItem.classList.contains('open')) {
                            otherItem.classList.remove('open');
                            otherItem.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
                            otherItem.querySelector('.accordion-content').setAttribute('aria-hidden', 'true');
                        }
                    });
                }

                // Toggle current
                item.classList.toggle('open');
                trigger.setAttribute('aria-expanded', !isOpen);
                content.setAttribute('aria-hidden', isOpen);
            });

            // Keyboard support
            trigger.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    trigger.click();
                }
            });
        });
    });
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ABOUT TABS (Home page - Vision/Mission)
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initAboutTabs() {
    const aboutTabs = document.querySelectorAll('.about-tab');
    const aboutContents = document.querySelectorAll('.about-tab-content');

    if (aboutTabs.length === 0) return;

    aboutTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-about-tab');

            // Update tabs
            aboutTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update content with fade effect
            aboutContents.forEach(content => {
                content.classList.remove('active');
                content.style.opacity = '0';
            });
            
            const targetContent = document.getElementById(target);
            if (targetContent) {
                targetContent.classList.add('active');
                setTimeout(() => {
                    targetContent.style.opacity = '1';
                }, 50);
            }
        });
    });
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * JOIN TABS (Join page - Volunteer/Membership/Donate)
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initJoinTabs() {
    const joinTabs = document.querySelectorAll('.join-tab');
    const joinContents = document.querySelectorAll('.join-form-content');

    if (joinTabs.length === 0) return;

    joinTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-join-tab');

            // Update tabs
            joinTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update content
            joinContents.forEach(content => {
                content.classList.remove('active');
                content.style.display = 'none';
            });

            const activeContent = document.getElementById(target);
            if (activeContent) {
                activeContent.classList.add('active');
                activeContent.style.display = 'block';
            }
        });
    });
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SIDEBAR NAVIGATION (Governance page)
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initSidebarNav() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const fileCards = document.querySelectorAll('.file-card');

    if (sidebarLinks.length === 0) return;

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.getAttribute('data-category');

            // Update active link
            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Filter files with animation
            let visibleIndex = 0;
            
            fileCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                const shouldShow = category === 'all' || cardCategory === category;
                
                if (shouldShow) {
                    card.style.transitionDelay = `${visibleIndex * 50}ms`;
                    card.style.display = '';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    
                    requestAnimationFrame(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    });
                    
                    visibleIndex++;
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 200);
                }
            });
        });
    });
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SCROLL TO TOP BUTTON
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initScrollToTop() {
    const button = document.querySelector('.scroll-to-top');
    if (!button) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                if (window.scrollY > 500) {
                    button.classList.add('visible');
                } else {
                    button.classList.remove('visible');
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LOGO MARQUEE
 * Pause on hover for partner logos
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initLogoMarquee() {
    const marqueeContainers = document.querySelectorAll('.logo-marquee');
    
    marqueeContainers.forEach(container => {
        const track = container.querySelector('.logo-marquee-track');
        if (!track) return;

        container.addEventListener('mouseenter', () => {
            track.style.animationPlayState = 'paused';
        });

        container.addEventListener('mouseleave', () => {
            track.style.animationPlayState = 'running';
        });
    });
}

document.addEventListener('DOMContentLoaded', initLogoMarquee);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * VIDEO BACKGROUND
 * Lazy load and manage video backgrounds
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initVideoBackground() {
    const videos = document.querySelectorAll('.hero-video');
    
    videos.forEach(video => {
        // Play when in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play().catch(() => {
                        // Video autoplay blocked, show poster
                        video.style.display = 'none';
                    });
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.25 });

        observer.observe(video);
    });
}

document.addEventListener('DOMContentLoaded', initVideoBackground);
