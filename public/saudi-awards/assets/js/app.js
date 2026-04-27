/**
 * جوائز السعودية - Saudi Awards
 * Main JavaScript Application
 * Professional & Modern Design
 */

// ==================== STATE MANAGEMENT ====================
let currentPage = 1;
const AWARDS_PER_PAGE = 20;
const HOME_AWARDS_COUNT = 8;
let filteredAwards = [];
let currentFilters = {
    search: '',
    sector: '',
    scope: '',
    cycle: ''
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Format currency value
 */
function formatValue(value) {
    if (!value || value === "غير موضح" || value === "غير واضح") {
        return "غير موضح";
    }
    const num = parseInt(String(value).replace(/,/g, ''));
    if (isNaN(num)) return value;
    return num.toLocaleString('ar-SA') + ' ريال';
}

/**
 * Get sector icon
 */
function getSectorIcon(sector) {
    const icons = {
        'قطاع الثقافة': 'bi-palette2',
        'قطاع التعليم': 'bi-mortarboard',
        'قطاع الاتصالات وتقنية المعلومات': 'bi-cpu',
        'قطاع الصحة': 'bi-heart-pulse',
        'قطاع الأعمال': 'bi-briefcase',
        'قطاع البيئة والمياه والزراعة': 'bi-tree',
        'قطاع الرياضة': 'bi-trophy-fill',
        'قطاع الإعلام': 'bi-broadcast',
        'قطاع الحج والعمرة': 'bi-moon-stars',
        'القطاع الأمني': 'bi-shield-check',
        'قطاع الشؤون الإسلامية': 'bi-book',
        'قطاع التنمية الاجتماعية': 'bi-people',
        'قطاع الطاقة والصناعة': 'bi-lightning-charge',
        'القطاع العدلي': 'bi-bank',
        'قطاع العمل': 'bi-person-workspace'
    };
    return icons[sector] || 'bi-trophy';
}

/**
 * Get unique values from awards data for filters
 */
function getUniqueValues(field) {
    const values = new Set();
    awardsData.forEach(award => {
        if (award[field] && award[field] !== 'غير موضح' && award[field] !== 'غير واضح') {
            values.add(award[field]);
        }
    });
    return Array.from(values).sort();
}

/**
 * Create award card HTML - Modern Professional Design
 */
function createAwardCard(award) {
    const websiteBtn = award.website 
        ? `<a href="${award.website}" class="btn btn-secondary btn-sm" target="_blank" rel="noopener noreferrer">
             <i class="bi bi-box-arrow-up-left"></i>
             الموقع
           </a>`
        : '';
    
    const sectorIcon = getSectorIcon(award.sector);
    
    return `
        <div class="award-card-wrapper">
            <article class="award-card">
                <div class="award-card__header">
                    <div class="award-card__logo">
                        <i class="bi ${sectorIcon}"></i>
                    </div>
                    <div class="award-card__info">
                        <h3 class="award-card__title">${award.name}</h3>
                        <span class="award-card__sector">
                            <i class="bi bi-tag-fill"></i>
                            ${award.sector}
                        </span>
                    </div>
                </div>
                <div class="award-card__body">
                    <div class="award-card__meta">
                        <div class="award-card__meta-item">
                            <i class="bi bi-building"></i>
                            <span>${award.owner}</span>
                        </div>
                    </div>
                    <div class="award-card__badges">
                        <span class="award-card__scope">
                            <i class="bi bi-globe2"></i>
                            ${award.scope}
                        </span>
                        ${award.cycle && award.cycle !== 'غير موضح' ? `
                        <span class="award-card__cycle">
                            <i class="bi bi-arrow-repeat"></i>
                            ${award.cycle}
                        </span>
                        ` : ''}
                    </div>
                </div>
                <div class="award-card__footer">
                    <button class="btn btn-primary btn-sm" onclick="showAwardDetails(${award.id})">
                        <i class="bi bi-info-circle"></i>
                        تفاصيل الجائزة
                    </button>
                    ${websiteBtn}
                </div>
            </article>
        </div>
    `;
}

/**
 * Show award details in modal - Professional Modern Design
 */
function showAwardDetails(awardId) {
    const award = awardsData.find(a => a.id === awardId);
    if (!award) return;
    
    const modal = document.getElementById('awardDetailsModal');
    const content = document.getElementById('awardDetailsContent');
    const visitBtn = document.getElementById('visitAwardSite');
    const modalTitle = document.getElementById('awardDetailsModalLabel');
    const modalIcon = document.getElementById('awardModalIcon');
    const modalBadges = document.getElementById('awardModalBadges');
    
    // Update title and icon
    modalTitle.textContent = award.name;
    const sectorIcon = getSectorIcon(award.sector);
    if (modalIcon) {
        modalIcon.innerHTML = `<i class="bi ${sectorIcon}"></i>`;
    }
    
    // Update badges
    if (modalBadges) {
        modalBadges.innerHTML = `
            <span class="award-modal__badge">
                <i class="bi bi-tag-fill"></i>
                ${award.sector}
            </span>
            <span class="award-modal__badge">
                <i class="bi bi-globe2"></i>
                ${award.scope}
            </span>
            ${award.cycle && award.cycle !== 'غير موضح' ? `
            <span class="award-modal__badge">
                <i class="bi bi-calendar-event"></i>
                ${award.cycle}
            </span>
            ` : ''}
        `;
    }
    
    // Build description section
    let descriptionHtml = '';
    if (award.description) {
        descriptionHtml = `
            <div class="award-modal__description">
                <p class="award-modal__description-text">${award.description}</p>
            </div>
        `;
    }
    
    // Build details grid
    const detailItems = [
        { label: 'الجهة المالكة', value: award.owner, icon: 'bi-building' },
        { label: 'الفئة المستهدفة', value: award.targetAudience, icon: 'bi-people' },
        { label: 'نوع الفئة', value: award.targetType, icon: 'bi-person-badge', full: true },
        { label: 'قيمة الجائزة', value: formatValue(award.value), icon: 'bi-currency-dollar' },
        { label: 'دورة الجائزة', value: award.cycle, icon: 'bi-arrow-repeat' },
        { label: 'طريقة الترشيح', value: award.nominationMethod, icon: 'bi-clipboard-check', full: true }
    ];
    
    let detailsHtml = '<div class="award-modal__details"><div class="award-modal__details-grid">';
    
    detailItems.forEach(item => {
        if (item.value && item.value !== '—' && item.value !== 'غير موضح' && item.value !== 'غير واضح') {
            const fullClass = item.full ? ' award-modal__detail-item--full' : '';
            detailsHtml += `
                <div class="award-modal__detail-item${fullClass}">
                    <div class="award-modal__detail-icon">
                        <i class="bi ${item.icon}"></i>
                    </div>
                    <div class="award-modal__detail-content">
                        <div class="award-modal__detail-label">${item.label}</div>
                        <div class="award-modal__detail-value">${item.value}</div>
                    </div>
                </div>
            `;
        }
    });
    
    detailsHtml += '</div></div>';
    
    content.innerHTML = descriptionHtml + detailsHtml;
    
    // Update visit button
    if (award.website) {
        visitBtn.href = award.website;
        visitBtn.classList.remove('d-none');
    } else {
        visitBtn.classList.add('d-none');
    }
    
    // Show modal
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

/**
 * Filter awards based on all criteria
 */
function filterAwards() {
    filteredAwards = awardsData.filter(award => {
        // Search filter
        const searchMatch = !currentFilters.search || 
            award.name.includes(currentFilters.search) ||
            award.sector.includes(currentFilters.search) ||
            award.owner.includes(currentFilters.search) ||
            award.scope.includes(currentFilters.search) ||
            award.description.includes(currentFilters.search);
        
        // Sector filter
        const sectorMatch = !currentFilters.sector || award.sector.includes(currentFilters.sector);
        
        // Scope filter
        const scopeMatch = !currentFilters.scope || award.scope === currentFilters.scope;
        
        // Cycle filter
        const cycleMatch = !currentFilters.cycle || award.cycle === currentFilters.cycle;
        
        return searchMatch && sectorMatch && scopeMatch && cycleMatch;
    });
    
    return filteredAwards;
}

/**
 * Render awards with pagination
 */
function renderAwards(viewMode = 'grid') {
    const grid = document.getElementById('awardsGrid');
    const noResults = document.getElementById('noResults');
    const resultsCount = document.getElementById('resultsCount');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (!grid) return;
    
    // Update view mode class
    grid.className = viewMode === 'list' ? 'awards-grid awards-grid--list' : 'awards-grid';
    
    // Get filtered awards
    filterAwards();
    
    // Calculate pagination
    const startIndex = 0;
    const endIndex = currentPage * AWARDS_PER_PAGE;
    const awardsToShow = filteredAwards.slice(startIndex, endIndex);
    
    if (filteredAwards.length === 0) {
        grid.innerHTML = '';
        if (noResults) noResults.classList.remove('d-none');
        if (loadMoreBtn) loadMoreBtn.classList.add('d-none');
        if (resultsCount) resultsCount.textContent = '0';
    } else {
        grid.innerHTML = awardsToShow.map(award => createAwardCard(award)).join('');
        if (noResults) noResults.classList.add('d-none');
        if (resultsCount) resultsCount.textContent = filteredAwards.length;
        
        // Show/hide load more button
        if (loadMoreBtn) {
            if (endIndex < filteredAwards.length) {
                loadMoreBtn.classList.remove('d-none');
                loadMoreBtn.innerHTML = `
                    <i class="bi bi-arrow-down-circle"></i>
                    عرض المزيد (${filteredAwards.length - endIndex} جائزة متبقية)
                `;
            } else {
                loadMoreBtn.classList.add('d-none');
            }
        }
    }
}

/**
 * Render featured awards on homepage
 */
function renderFeaturedAwards() {
    const grid = document.getElementById('featuredAwardsGrid');
    if (!grid) return;
    
    // Get first 8 awards for homepage
    const featuredAwards = awardsData.slice(0, HOME_AWARDS_COUNT);
    grid.innerHTML = featuredAwards.map(award => createAwardCard(award)).join('');
}

/**
 * Initialize view toggle
 */
function initViewToggle() {
    const gridBtn = document.getElementById('gridViewBtn');
    const listBtn = document.getElementById('listViewBtn');
    
    if (!gridBtn || !listBtn) return;
    
    let currentView = 'grid';
    
    gridBtn.addEventListener('click', function() {
        currentView = 'grid';
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
        renderAwards('grid');
    });
    
    listBtn.addEventListener('click', function() {
        currentView = 'list';
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
        renderAwards('list');
    });
}

/**
 * Populate filter dropdowns
 */
function populateFilters() {
    // Sector filter
    const sectorFilter = document.getElementById('sectorFilter');
    if (sectorFilter) {
        const sectors = getUniqueValues('sector');
        sectorFilter.innerHTML = '<option value="">جميع القطاعات</option>';
        sectors.forEach(sector => {
            sectorFilter.innerHTML += `<option value="${sector}">${sector}</option>`;
        });
    }
    
    // Scope filter
    const scopeFilter = document.getElementById('scopeFilter');
    if (scopeFilter) {
        const scopes = getUniqueValues('scope');
        scopeFilter.innerHTML = '<option value="">جميع النطاقات</option>';
        scopes.forEach(scope => {
            scopeFilter.innerHTML += `<option value="${scope}">${scope}</option>`;
        });
    }
    
    // Cycle filter
    const cycleFilter = document.getElementById('cycleFilter');
    if (cycleFilter) {
        const cycles = getUniqueValues('cycle');
        cycleFilter.innerHTML = '<option value="">جميع الدورات</option>';
        cycles.forEach(cycle => {
            cycleFilter.innerHTML += `<option value="${cycle}">${cycle}</option>`;
        });
    }
}

/**
 * Initialize awards page
 */
function initAwardsPage() {
    const searchInput = document.getElementById('searchInput');
    const sectorFilter = document.getElementById('sectorFilter');
    const scopeFilter = document.getElementById('scopeFilter');
    const cycleFilter = document.getElementById('cycleFilter');
    const resetBtn = document.getElementById('resetBtn');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (!searchInput) return;
    
    // Populate filter dropdowns
    populateFilters();
    
    // Initialize view toggle
    initViewToggle();
    
    // Check for search query in URL
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get('q');
    const sectorParam = urlParams.get('sector');
    
    if (queryParam) {
        searchInput.value = queryParam;
        currentFilters.search = queryParam;
    }
    
    if (sectorParam && sectorFilter) {
        // Map URL sector to Arabic sector name
        const sectorMap = {
            'culture': 'الثقافة',
            'education': 'التعليم',
            'tech': 'التقنية',
            'health': 'الصحة',
            'business': 'الأعمال',
            'environment': 'البيئة'
        };
        const mappedSector = sectorMap[sectorParam] || '';
        if (mappedSector) {
            // Find the full sector name
            const sectors = getUniqueValues('sector');
            const fullSector = sectors.find(s => s.includes(mappedSector));
            if (fullSector) {
                sectorFilter.value = fullSector;
                currentFilters.sector = fullSector;
            }
        }
    }
    
    // Initial render
    renderAwards();
    
    // Search input event
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentFilters.search = this.value;
            currentPage = 1;
            renderAwards();
        }, 300);
    });
    
    // Sector filter event
    if (sectorFilter) {
        sectorFilter.addEventListener('change', function() {
            currentFilters.sector = this.value;
            currentPage = 1;
            renderAwards();
        });
    }
    
    // Scope filter event
    if (scopeFilter) {
        scopeFilter.addEventListener('change', function() {
            currentFilters.scope = this.value;
            currentPage = 1;
            renderAwards();
        });
    }
    
    // Cycle filter event
    if (cycleFilter) {
        cycleFilter.addEventListener('change', function() {
            currentFilters.cycle = this.value;
            currentPage = 1;
            renderAwards();
        });
    }
    
    // Load more button
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            currentPage++;
            renderAwards();
        });
    }
    
    // Reset button
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            searchInput.value = '';
            if (sectorFilter) sectorFilter.value = '';
            if (scopeFilter) scopeFilter.value = '';
            if (cycleFilter) cycleFilter.value = '';
            currentFilters = { search: '', sector: '', scope: '', cycle: '' };
            currentPage = 1;
            renderAwards();
            // Reset URL
            window.history.replaceState({}, '', window.location.pathname);
        });
    }
}

// ==================== ADD AWARD FORM ====================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize awards page or homepage
    if (document.getElementById('awardsGrid')) {
        initAwardsPage();
    }
    
    // Initialize featured awards on homepage
    if (document.getElementById('featuredAwardsGrid')) {
        renderFeaturedAwards();
    }
    
    // ===== Add Award Wizard =====
    const awardModalEl = document.getElementById('addAwardModal');
    const awardForm = document.getElementById('addAwardForm');
    const submitBtn = document.getElementById('submitAwardBtn');
    const nextBtn = document.getElementById('wizardNextBtn');
    const prevBtn = document.getElementById('wizardPrevBtn');

    if (awardForm && submitBtn && nextBtn && prevBtn) {
        const stepper = awardModalEl.querySelector('.add-wizard__stepper');
        const panels = awardForm.querySelectorAll('.add-wizard__panel');
        const indicators = awardModalEl.querySelectorAll('[data-step-indicator]');

        const setStep = (n) => {
            panels.forEach(p => p.classList.toggle('is-active', +p.dataset.step === n));
            indicators.forEach(ind => {
                const num = +ind.dataset.stepIndicator;
                ind.classList.toggle('is-active', num === n);
                ind.classList.toggle('is-complete', num < n);
            });
            stepper.classList.toggle('step-2', n === 2);
            prevBtn.disabled = n === 1;
            nextBtn.classList.toggle('d-none', n === 2);
            submitBtn.classList.toggle('d-none', n !== 2);
            const first = panels[n-1].querySelector('input, select, textarea');
            if (first) setTimeout(() => first.focus(), 150);
            const body = awardModalEl.querySelector('.add-modal__body');
            if (body) body.scrollTop = 0;
        };

        const errorMsg = (input) => {
            const v = (input.value || '').trim();
            if (input.required && !v) return 'هذا الحقل مطلوب';
            if (input.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'صيغة البريد غير صحيحة';
            if (input.type === 'url' && v && !/^https?:\/\/.+/i.test(v)) return 'يجب أن يبدأ الرابط بـ http:// أو https://';
            if (input.id === 'subPhone' && v && !/^5[0-9]{8}$/.test(v)) return 'رقم جوال سعودي غير صحيح (يبدأ بـ 5 و9 أرقام)';
            if (input.minLength > 0 && v && v.length < input.minLength) return `الحد الأدنى ${input.minLength} حرفًا`;
            if (input.id === 'awYear' && v) {
                const y = +v; const cy = new Date().getFullYear();
                if (y < 1900 || y > cy) return `أدخل سنة بين 1900 و ${cy}`;
            }
            return '';
        };

        const validateField = (input) => {
            const wrap = input.closest('.form-floating-custom');
            if (!wrap) return true;
            const fb = wrap.querySelector('[data-feedback]');
            const msg = errorMsg(input);
            if (msg) {
                wrap.classList.add('is-invalid');
                wrap.classList.remove('is-valid');
                if (fb) fb.textContent = msg;
                return false;
            }
            wrap.classList.remove('is-invalid');
            if ((input.value || '').trim()) wrap.classList.add('is-valid');
            else wrap.classList.remove('is-valid');
            if (fb) fb.textContent = fb.dataset.hint || '';
            return true;
        };

        awardForm.querySelectorAll('[data-feedback]').forEach(fb => {
            const t = fb.textContent.trim();
            if (t) fb.dataset.hint = t;
        });

        const validateStep = (n) => {
            const panel = panels[n-1];
            const fields = panel.querySelectorAll('input:not([type=checkbox]), select, textarea');
            let ok = true; let firstBad = null;
            fields.forEach(f => {
                if (!validateField(f)) { ok = false; if (!firstBad) firstBad = f; }
            });
            if (n === 1) {
                const consent = document.getElementById('subConsent');
                if (consent && !consent.checked) {
                    ok = false;
                    consent.parentElement.style.color = '#dc3545';
                    if (!firstBad) firstBad = consent;
                } else if (consent) {
                    consent.parentElement.style.color = '';
                }
            }
            if (firstBad) firstBad.focus();
            return ok;
        };

        awardForm.addEventListener('input', e => {
            const t = e.target;
            if (t.matches('input, select, textarea')) {
                const wrap = t.closest('.form-floating-custom');
                if (wrap && wrap.classList.contains('is-invalid')) validateField(t);
            }
        });
        awardForm.addEventListener('blur', e => {
            if (e.target.matches('input:not([type=checkbox]), select, textarea')) validateField(e.target);
        }, true);

        const desc = document.getElementById('awDesc');
        const descCount = document.getElementById('awDescCount');
        if (desc && descCount) {
            desc.addEventListener('input', () => { descCount.textContent = desc.value.length; });
        }
        const phone = document.getElementById('subPhone');
        if (phone) {
            phone.addEventListener('input', () => {
                phone.value = phone.value.replace(/\D/g, '').slice(0, 9);
            });
        }

        nextBtn.addEventListener('click', () => { if (validateStep(1)) setStep(2); });
        prevBtn.addEventListener('click', () => setStep(1));

        submitBtn.addEventListener('click', () => {
            if (!validateStep(2)) return;
            const original = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm ms-2"></span> جاري الإرسال...';
            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(awardModalEl);
                modal.hide();
                awardForm.reset();
                awardForm.querySelectorAll('.is-valid, .is-invalid').forEach(el => el.classList.remove('is-valid','is-invalid'));
                if (descCount) descCount.textContent = '0';
                submitBtn.disabled = false;
                submitBtn.innerHTML = original;
                setStep(1);
                const toast = new bootstrap.Toast(document.getElementById('successToast'));
                toast.show();
            }, 700);
        });

        awardModalEl.addEventListener('shown.bs.modal', () => setStep(1));
    }
    
    // Handle service request form submission
    const submitServiceBtn = document.getElementById('submitServiceBtn');
    if (submitServiceBtn) {
        submitServiceBtn.addEventListener('click', function() {
            const form = document.getElementById('serviceRequestForm');
            
            // Check form validity
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('serviceRequestModal'));
            modal.hide();
            
            // Reset form
            form.reset();
            
            // Show success toast
            const toast = new bootstrap.Toast(document.getElementById('successToast'));
            toast.show();
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
