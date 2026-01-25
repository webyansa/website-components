/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                       قالب الجمعية 1 - Components JS
 *                  مكونات التفاعل: موبايل منيو، مودال، تابس، أكورديون
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initModals();
    initTabs();
    initAccordions();
    initAboutTabs();
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MOBILE MENU
 * Hamburger menu toggle with overlay
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initMobileMenu() {
    const toggle = document.querySelector('.navbar-toggle');
    const mobileMenu = document.querySelector('.navbar-mobile');
    const closeBtn = document.querySelector('.navbar-mobile-close');
    const overlay = document.querySelector('.mobile-overlay');
    const mobileLinks = document.querySelectorAll('.navbar-mobile-link');

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
        mobileMenu.classList.add('open');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus trap
        const firstFocusable = mobileMenu.querySelector('button, a');
        if (firstFocusable) firstFocusable.focus();
    }

    function closeMobileMenu() {
        toggle.classList.remove('active');
        mobileMenu.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
        toggle.focus();
    }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MODALS
 * Project detail modals and generic modal functionality
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
            const openModal = document.querySelector('.modal.open');
            if (openModal) closeModal(openModal.id);
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
    const firstFocusable = modal.querySelector('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) firstFocusable.focus();

    // Announce to screen readers
    modal.setAttribute('aria-hidden', 'false');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    const backdrop = document.querySelector(`[data-modal-backdrop="${modalId}"]`);
    
    if (!modal) return;

    if (backdrop) backdrop.classList.remove('open');
    modal.classList.remove('open');
    document.body.style.overflow = '';

    modal.setAttribute('aria-hidden', 'true');

    // Return focus to trigger
    const trigger = document.querySelector(`[data-modal="${modalId}"]`);
    if (trigger) trigger.focus();
}

// Global function to open/close modals from anywhere
window.openModal = openModal;
window.closeModal = closeModal;

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TABS
 * Generic tab component functionality
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
                
                // Update triggers
                triggers.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });
                trigger.classList.add('active');
                trigger.setAttribute('aria-selected', 'true');

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
            });

            // Keyboard navigation
            trigger.addEventListener('keydown', (e) => {
                const triggersArray = Array.from(triggers);
                const currentIndex = triggersArray.indexOf(trigger);
                let newIndex;

                switch (e.key) {
                    case 'ArrowRight':
                        newIndex = currentIndex > 0 ? currentIndex - 1 : triggersArray.length - 1;
                        triggersArray[newIndex].focus();
                        break;
                    case 'ArrowLeft':
                        newIndex = currentIndex < triggersArray.length - 1 ? currentIndex + 1 : 0;
                        triggersArray[newIndex].focus();
                        break;
                    case 'Home':
                        triggersArray[0].focus();
                        break;
                    case 'End':
                        triggersArray[triggersArray.length - 1].focus();
                        break;
                }
            });
        });
    });
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
 * Simple tab switching for about section
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

            // Update content
            aboutContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === target) {
                    content.classList.add('active');
                }
            });
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

// Initialize join tabs
document.addEventListener('DOMContentLoaded', initJoinTabs);

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

            // Filter files
            fileCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (category === 'all' || cardCategory === category) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', initSidebarNav);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SCROLL TO TOP BUTTON
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initScrollToTop() {
    const button = document.querySelector('.scroll-to-top');
    if (!button) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    });

    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

document.addEventListener('DOMContentLoaded', initScrollToTop);
