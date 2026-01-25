/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                     PREMIUM ASSOCIATION TEMPLATE
 *                     Media Center JavaScript Module
 * 
 *  Features:
 *  - Unified Modal System for video/gallery/document
 *  - Hero Image Slider with Ken Burns effect
 *  - Gallery slider with autoplay
 *  - Document preview with Drive integration
 *  - Lightbox for org chart
 *  - Share functionality
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    initHeroSlider();
    initMediaCenter();
    initLightbox();
    initShareButtons();
    initPremiumReveals();
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * HERO IMAGE SLIDER
 * Ken Burns effect with autoplay, dots, and progress bars
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initHeroSlider() {
    const slider = document.querySelector('.hero-slider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.hero-slide');
    const dotsContainer = slider.querySelector('.slider-dots');
    const progressBars = slider.querySelectorAll('.progress-bar');
    const prevBtn = slider.querySelector('.slider-nav.prev');
    const nextBtn = slider.querySelector('.slider-nav.next');
    
    if (slides.length === 0) return;

    let currentIndex = 0;
    let autoplayInterval = null;
    let isPaused = false;
    const autoplayDelay = parseInt(slider.dataset.interval) || 6000;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Create dots if container exists
    if (dotsContainer) {
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'slider-dot' + (index === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `الانتقال إلى الشريحة ${index + 1}`);
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }

    const dots = dotsContainer ? dotsContainer.querySelectorAll('.slider-dot') : [];

    function goToSlide(index) {
        // Remove active state from current
        slides[currentIndex].classList.remove('active');
        if (dots[currentIndex]) dots[currentIndex].classList.remove('active');
        if (progressBars[currentIndex]) {
            progressBars[currentIndex].classList.remove('active');
            progressBars[currentIndex].classList.add('completed');
        }

        // Update index
        currentIndex = index;
        if (currentIndex >= slides.length) currentIndex = 0;
        if (currentIndex < 0) currentIndex = slides.length - 1;

        // Reset completed states for previous slides
        progressBars.forEach((bar, i) => {
            if (i < currentIndex) {
                bar.classList.add('completed');
            } else {
                bar.classList.remove('completed');
            }
        });

        // Add active state to new
        slides[currentIndex].classList.add('active');
        if (dots[currentIndex]) dots[currentIndex].classList.add('active');
        if (progressBars[currentIndex]) {
            progressBars[currentIndex].classList.remove('completed');
            progressBars[currentIndex].classList.add('active');
        }

        // Reset autoplay timer
        if (!prefersReducedMotion) {
            resetAutoplay();
        }
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    function startAutoplay() {
        if (prefersReducedMotion || slider.dataset.autoplay === 'false') return;
        
        autoplayInterval = setInterval(() => {
            if (!isPaused) {
                nextSlide();
            }
        }, autoplayDelay);
    }

    function resetAutoplay() {
        clearInterval(autoplayInterval);
        // Reset current progress bar animation
        if (progressBars[currentIndex]) {
            const bar = progressBars[currentIndex];
            bar.classList.remove('active');
            void bar.offsetWidth; // Force reflow
            bar.classList.add('active');
        }
        startAutoplay();
    }

    // Navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }

    // Pause on hover
    slider.addEventListener('mouseenter', () => {
        isPaused = true;
        slider.classList.add('paused');
    });

    slider.addEventListener('mouseleave', () => {
        isPaused = false;
        slider.classList.remove('paused');
    });

    // Keyboard navigation
    slider.setAttribute('tabindex', '0');
    slider.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') prevSlide();
        if (e.key === 'ArrowLeft') nextSlide();
    });

    // Touch swipe support
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
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide(); // Swipe left = next (RTL)
            } else {
                prevSlide(); // Swipe right = prev (RTL)
            }
        }
    }

    // Initialize first slide
    if (slides[0]) slides[0].classList.add('active');
    if (progressBars[0]) progressBars[0].classList.add('active');

    // Start autoplay
    startAutoplay();
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MEDIA CENTER - Content Cards & Modal System
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initMediaCenter() {
    const contentCards = document.querySelectorAll('.content-card[data-type]');
    
    if (contentCards.length === 0) return;

    // Create modal container if doesn't exist
    createMediaModal();

    contentCards.forEach(card => {
        card.addEventListener('click', () => handleContentClick(card));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleContentClick(card);
            }
        });
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
    });
}

function createMediaModal() {
    if (document.getElementById('media-modal')) return;

    const modalHTML = `
        <div class="media-modal-backdrop" id="media-modal-backdrop"></div>
        <div class="media-modal" id="media-modal" role="dialog" aria-modal="true">
            <button class="media-modal-close" aria-label="إغلاق">
                <i class="fas fa-times"></i>
            </button>
            
            <!-- Video Content -->
            <div class="modal-video-content" id="modal-video-content" hidden>
                <div class="video-wrapper">
                    <iframe id="video-iframe" src="" allowfullscreen></iframe>
                </div>
            </div>
            
            <!-- Gallery Content -->
            <div class="modal-gallery-content" id="modal-gallery-content" hidden>
                <div class="gallery-slider-modal">
                    <div class="gallery-slides-modal" id="gallery-slides"></div>
                    <button class="gallery-nav-modal prev" aria-label="السابق"><i class="fas fa-chevron-right"></i></button>
                    <button class="gallery-nav-modal next" aria-label="التالي"><i class="fas fa-chevron-left"></i></button>
                    <div class="gallery-counter-modal" id="gallery-counter">1 / 1</div>
                    <div class="gallery-dots-modal" id="gallery-dots"></div>
                </div>
            </div>
            
            <!-- Document Content -->
            <div class="modal-document-content" id="modal-document-content" hidden>
                <div class="doc-preview-wrapper">
                    <iframe id="doc-iframe" src=""></iframe>
                </div>
                <div class="doc-actions">
                    <a href="#" class="btn btn-primary" id="doc-open-new" target="_blank">
                        <i class="fas fa-external-link-alt"></i>
                        فتح في تبويب جديد
                    </a>
                    <a href="#" class="btn btn-outline" id="doc-download" target="_blank">
                        <i class="fas fa-download"></i>
                        تحميل
                    </a>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Add event listeners
    const backdrop = document.getElementById('media-modal-backdrop');
    const modal = document.getElementById('media-modal');
    const closeBtn = modal.querySelector('.media-modal-close');

    backdrop.addEventListener('click', closeMediaModal);
    closeBtn.addEventListener('click', closeMediaModal);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeMediaModal();
        }
    });

    // Gallery navigation
    const prevBtn = modal.querySelector('.gallery-nav-modal.prev');
    const nextBtn = modal.querySelector('.gallery-nav-modal.next');
    
    if (prevBtn) prevBtn.addEventListener('click', () => navigateGallery(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => navigateGallery(1));
}

function handleContentClick(card) {
    const type = card.dataset.type;
    
    switch(type) {
        case 'article':
            const articleId = card.dataset.id || '';
            const articleUrl = card.dataset.url || `news-details.html${articleId ? '?id=' + articleId : ''}`;
            window.location.href = articleUrl;
            break;
        case 'video':
            openVideoModal(card.dataset.videoUrl);
            break;
        case 'gallery':
            const images = JSON.parse(card.dataset.gallery || '[]');
            openGalleryModal(images);
            break;
        case 'document':
            openDocumentModal(card.dataset.docUrl, card.dataset.downloadUrl);
            break;
    }
}

function openVideoModal(videoUrl) {
    if (!videoUrl) return;

    const modal = document.getElementById('media-modal');
    const backdrop = document.getElementById('media-modal-backdrop');
    const videoContent = document.getElementById('modal-video-content');
    const iframe = document.getElementById('video-iframe');

    // Hide other content types
    hideAllModalContent();

    // Set video URL with autoplay
    let embedUrl = videoUrl;
    if (videoUrl.includes('youtube.com/watch')) {
        const videoId = new URL(videoUrl).searchParams.get('v');
        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    } else if (videoUrl.includes('youtu.be')) {
        const videoId = videoUrl.split('/').pop();
        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    
    iframe.src = embedUrl;
    videoContent.hidden = false;

    // Open modal
    backdrop.classList.add('open');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

let currentGalleryIndex = 0;
let galleryImages = [];
let galleryAutoplayInterval = null;

function openGalleryModal(images) {
    if (!images || images.length === 0) return;

    galleryImages = images;
    currentGalleryIndex = 0;

    const modal = document.getElementById('media-modal');
    const backdrop = document.getElementById('media-modal-backdrop');
    const galleryContent = document.getElementById('modal-gallery-content');
    const slidesContainer = document.getElementById('gallery-slides');
    const dotsContainer = document.getElementById('gallery-dots');
    const counter = document.getElementById('gallery-counter');

    // Hide other content types
    hideAllModalContent();

    // Clear previous content
    slidesContainer.innerHTML = '';
    dotsContainer.innerHTML = '';

    // Create slides
    images.forEach((src, index) => {
        const slide = document.createElement('div');
        slide.className = 'gallery-slide-modal' + (index === 0 ? ' active' : '');
        slide.innerHTML = `<img src="${src}" alt="صورة ${index + 1}">`;
        slidesContainer.appendChild(slide);

        // Create dot
        const dot = document.createElement('button');
        dot.className = 'gallery-dot-modal' + (index === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToGallerySlide(index));
        dotsContainer.appendChild(dot);
    });

    // Update counter
    counter.textContent = `1 / ${images.length}`;

    galleryContent.hidden = false;

    // Open modal
    backdrop.classList.add('open');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Start autoplay
    startGalleryAutoplay();
}

function goToGallerySlide(index) {
    const slides = document.querySelectorAll('.gallery-slide-modal');
    const dots = document.querySelectorAll('.gallery-dot-modal');
    const counter = document.getElementById('gallery-counter');

    slides[currentGalleryIndex].classList.remove('active');
    dots[currentGalleryIndex].classList.remove('active');

    currentGalleryIndex = index;
    if (currentGalleryIndex >= slides.length) currentGalleryIndex = 0;
    if (currentGalleryIndex < 0) currentGalleryIndex = slides.length - 1;

    slides[currentGalleryIndex].classList.add('active');
    dots[currentGalleryIndex].classList.add('active');
    counter.textContent = `${currentGalleryIndex + 1} / ${slides.length}`;
}

function navigateGallery(direction) {
    goToGallerySlide(currentGalleryIndex + direction);
    // Reset autoplay
    stopGalleryAutoplay();
    startGalleryAutoplay();
}

function startGalleryAutoplay() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    galleryAutoplayInterval = setInterval(() => {
        goToGallerySlide(currentGalleryIndex + 1);
    }, 4000);
}

function stopGalleryAutoplay() {
    clearInterval(galleryAutoplayInterval);
}

function openDocumentModal(docUrl, downloadUrl) {
    if (!docUrl) return;

    const modal = document.getElementById('media-modal');
    const backdrop = document.getElementById('media-modal-backdrop');
    const docContent = document.getElementById('modal-document-content');
    const iframe = document.getElementById('doc-iframe');
    const openNewBtn = document.getElementById('doc-open-new');
    const downloadBtn = document.getElementById('doc-download');

    // Hide other content types
    hideAllModalContent();

    // Set document URL (ensure it's in preview mode for Drive)
    let previewUrl = docUrl;
    if (docUrl.includes('drive.google.com') && !docUrl.includes('/preview')) {
        previewUrl = docUrl.replace('/view', '/preview');
    }

    iframe.src = previewUrl;
    
    // Set button URLs
    if (openNewBtn) {
        openNewBtn.href = docUrl.replace('/preview', '/view');
    }
    if (downloadBtn) {
        downloadBtn.href = downloadUrl || docUrl.replace('/preview', '/view').replace('/view', '/export?format=pdf');
    }

    docContent.hidden = false;

    // Open modal
    backdrop.classList.add('open');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function hideAllModalContent() {
    const contents = ['modal-video-content', 'modal-gallery-content', 'modal-document-content'];
    contents.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.hidden = true;
    });
}

function closeMediaModal() {
    const modal = document.getElementById('media-modal');
    const backdrop = document.getElementById('media-modal-backdrop');
    const videoIframe = document.getElementById('video-iframe');
    const docIframe = document.getElementById('doc-iframe');

    // Stop video/content
    if (videoIframe) videoIframe.src = '';
    if (docIframe) docIframe.src = '';

    // Stop gallery autoplay
    stopGalleryAutoplay();

    // Close modal
    backdrop.classList.remove('open');
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

// Make functions globally available
window.openVideoModal = openVideoModal;
window.openGalleryModal = openGalleryModal;
window.openDocumentModal = openDocumentModal;
window.closeMediaModal = closeMediaModal;

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LIGHTBOX - For Org Chart and Images
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initLightbox() {
    const lightboxTriggers = document.querySelectorAll('[data-lightbox]');
    
    if (lightboxTriggers.length === 0) return;

    // Create lightbox if doesn't exist
    if (!document.getElementById('lightbox')) {
        const lightboxHTML = `
            <div class="lightbox" id="lightbox">
                <button class="lightbox-close" aria-label="إغلاق">
                    <i class="fas fa-times"></i>
                </button>
                <img src="" alt="" class="lightbox-img" id="lightbox-img">
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);

        const lightbox = document.getElementById('lightbox');
        const closeBtn = lightbox.querySelector('.lightbox-close');

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        closeBtn.addEventListener('click', closeLightbox);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('open')) {
                closeLightbox();
            }
        });
    }

    lightboxTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const imgSrc = trigger.dataset.lightbox;
            openLightbox(imgSrc);
        });
    });
}

function openLightbox(src) {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    
    img.src = src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
}

window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SHARE BUTTONS
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initShareButtons() {
    const shareActions = document.querySelectorAll('.page-hero-action[onclick*="share"], [data-share]');
    
    shareActions.forEach(btn => {
        btn.removeAttribute('onclick');
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            shareCurrentPage();
        });
    });
}

function shareCurrentPage() {
    const url = window.location.href;
    const title = document.title;

    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        }).catch(console.log);
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
            if (typeof showToast === 'function') {
                showToast('success', 'تم النسخ', 'تم نسخ الرابط إلى الحافظة');
            } else {
                alert('تم نسخ الرابط');
            }
        });
    }
}

window.shareCurrentPage = shareCurrentPage;

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PREMIUM REVEALS
 * Enhanced scroll reveal animations
 * ═══════════════════════════════════════════════════════════════════════════
 */
function initPremiumReveals() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        document.querySelectorAll('.reveal-premium, .reveal-stagger').forEach(el => {
            el.classList.add('revealed');
        });
        return;
    }

    const revealElements = document.querySelectorAll('.reveal-premium, .reveal-stagger');
    
    if (revealElements.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
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
 * PRINT FUNCTIONALITY
 * ═══════════════════════════════════════════════════════════════════════════
 */
function printPage() {
    window.print();
}

window.printPage = printPage;
