
# خطة تحسين قالب الجمعية 1 (theme-1) - Premium Edition

## ملخص الوضع الحالي

بعد المراجعة الشاملة، وجدت أن **معظم الملفات موجودة** لكن هناك **مشاكل تكامل** تحتاج إصلاح:

### ما هو موجود فعلاً:
- 13 صفحة جديدة (strategy, founders, board, etc.) 
- ملفات اللودر (css/loader.css + js/loader.js)
- 8 SVG Placeholders في assets/svg/
- 4 صفحات المركز الإعلامي في media/
- Navbar مع Dropdowns في الصفحات الفرعية

### المشاكل المكتشفة:
1. **الصفحة الرئيسية (index.html)**: لا تستخدم Navbar المحدث مع Dropdowns
2. **الصفحة الرئيسية**: لا تستورد loader.css ولا تحتوي على Page Loader
3. **CSS للمكونات الجديدة**: pages.css يفتقر لأنماط الصفحات الجديدة (org-chart, gallery-masonry, news-editorial, article-layout, founders-grid, committees-grid, etc.)

---

## المهام المرتبة (10 مهام)

### المهمة 1: تحديث الصفحة الرئيسية - إضافة اللودر
**الملف:** `public/theme-1/index.html`
**التغييرات:**
- إضافة `<link rel="stylesheet" href="css/loader.css">` في الـ head
- إضافة HTML الخاص باللودر بعد فتح `<body>`:
```html
<div class="page-loader" id="page-loader">
    <div class="loader-content">
        <img src="assets/img/logo.svg" alt="جاري التحميل..." class="loader-logo">
        <div class="loader-spinner"></div>
        <div class="loader-progress"><div class="loader-progress-bar"></div></div>
    </div>
</div>
```
- إضافة `<script src="js/loader.js"></script>` قبل السكربتات الأخرى

---

### المهمة 2: تحديث الصفحة الرئيسية - Navbar مع Dropdowns
**الملف:** `public/theme-1/index.html`
**التغييرات:**
- استبدال الـ Navbar الحالي (سطر 40-66) بالـ Navbar المحدث الذي يحتوي:
  - Dropdown "عن الجمعية" مع 9 روابط
  - Dropdown "المركز الإعلامي" مع 3 روابط
- تحديث Mobile Menu (سطر 68-107) بإضافة Mobile Dropdowns

---

### المهمة 3: إضافة أنماط CSS للـ Navbar Dropdowns
**الملف:** `public/theme-1/css/components.css`
**إضافة بعد سطر 275:**
```css
/* Navbar Dropdown */
.navbar-dropdown { position: relative; }
.navbar-dropdown-toggle { display: flex; align-items: center; gap: 0.5rem; }
.navbar-dropdown-icon { font-size: 0.7rem; transition: transform 0.3s; }
.navbar-dropdown:hover .navbar-dropdown-icon { transform: rotate(180deg); }
.navbar-dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    min-width: 220px;
    background: var(--bg-primary);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-xl);
    padding: 0.5rem;
    opacity: 0;
    visibility: hidden;
    transform: translateY(10px);
    transition: all 0.3s;
    z-index: 100;
}
.navbar-dropdown:hover .navbar-dropdown-menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}
/* Mobile Dropdowns */
.mobile-dropdown-toggle { width: 100%; justify-content: space-between; }
.mobile-dropdown-menu { display: none; padding-right: 2rem; }
.mobile-dropdown.open .mobile-dropdown-menu { display: block; }
.mobile-dropdown.open .mobile-dropdown-icon { transform: rotate(180deg); }
```

---

### المهمة 4: إضافة أنماط CSS للصفحات الجديدة - الجزء 1
**الملف:** `public/theme-1/css/pages.css`
**إضافة بعد السطر الأخير:**
```css
/* Strategy Page VMP Cards */
.strategy-vmp-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
.strategy-vmp-card { text-align: center; padding: 2rem; background: var(--bg-primary); border-radius: 1.5rem; border: 1px solid var(--border-light); }
.strategy-vmp-card.featured { border-color: var(--primary); box-shadow: var(--shadow-primary); }
.strategy-vmp-icon { width: 80px; height: 80px; margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--primary), var(--primary-600)); border-radius: 1rem; font-size: 2rem; color: white; }

/* Strategy Goals */
.strategy-goals-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
.strategy-goal-card { display: flex; gap: 1.5rem; padding: 2rem; background: var(--bg-primary); border-radius: 1.5rem; border: 1px solid var(--border-light); }
.strategy-goal-number { font-size: 3rem; font-weight: 900; color: var(--primary); opacity: 0.3; }
.strategy-goal-kpis { display: flex; gap: 1.5rem; margin-top: 1rem; }
.strategy-kpi { text-align: center; }
.strategy-kpi-value { font-size: 1.5rem; font-weight: 800; color: var(--primary); }
.strategy-kpi-label { font-size: 0.875rem; color: var(--text-secondary); }

/* Founders Grid */
.founders-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
.founder-card { background: var(--bg-primary); border-radius: 1.5rem; overflow: hidden; border: 1px solid var(--border-light); }
.founder-img-wrapper { position: relative; aspect-ratio: 1; }
.founder-img { width: 100%; height: 100%; object-fit: cover; }
.founder-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7), transparent); display: flex; align-items: flex-end; padding: 1rem; }
.founder-badge { background: var(--primary); color: white; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.75rem; }
.founder-content { padding: 1.5rem; }
.founder-name { font-size: 1.125rem; font-weight: 700; color: var(--text-primary); }
.founder-role { font-size: 0.875rem; color: var(--primary); margin-bottom: 0.5rem; }
.founder-bio { font-size: 0.875rem; color: var(--text-secondary); }
```

---

### المهمة 5: إضافة أنماط CSS للصفحات الجديدة - الجزء 2
**الملف:** `public/theme-1/css/pages.css`
**إضافة بعد المهمة 4:**
```css
/* Board Page */
.board-chairman { margin-bottom: 3rem; }
.chairman-card { display: flex; gap: 2rem; padding: 2rem; background: linear-gradient(135deg, var(--primary-50), var(--bg-secondary)); border-radius: 1.5rem; }
.board-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
.board-card { text-align: center; padding: 1.5rem; background: var(--bg-primary); border-radius: 1.5rem; border: 1px solid var(--border-light); }
.board-img-wrapper { width: 120px; height: 120px; margin: 0 auto 1rem; border-radius: 50%; overflow: hidden; }
.board-img { width: 100%; height: 100%; object-fit: cover; }
.board-role-badge { display: inline-block; padding: 0.25rem 0.75rem; background: var(--primary); color: white; border-radius: 1rem; font-size: 0.75rem; margin-bottom: 0.5rem; }
.board-role-badge.secondary { background: var(--secondary); }
.board-name { font-size: 1rem; font-weight: 700; color: var(--text-primary); }
.board-bio { font-size: 0.875rem; color: var(--text-secondary); }

/* Responsibilities Grid */
.responsibilities-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
.responsibility-card { text-align: center; padding: 2rem; background: var(--bg-primary); border-radius: 1.5rem; }
.responsibility-icon { width: 60px; height: 60px; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--primary), var(--primary-600)); border-radius: 1rem; font-size: 1.5rem; color: white; }

/* Org Chart */
.org-chart { display: flex; flex-direction: column; align-items: center; gap: 0; padding: 3rem; background: var(--bg-secondary); border-radius: 2rem; }
.org-level { display: flex; justify-content: center; gap: 1.5rem; }
.org-connector { width: 2px; height: 30px; background: var(--border-default); }
.org-connector-split { width: 80%; height: 2px; background: var(--border-default); position: relative; }
.org-node { text-align: center; padding: 1rem 2rem; background: var(--bg-primary); border-radius: 1rem; border: 2px solid var(--border-light); min-width: 150px; }
.org-node-primary { border-color: var(--primary); background: linear-gradient(135deg, var(--primary), var(--primary-600)); color: white; }
.org-node-secondary { border-color: var(--primary); }
.org-node-icon { font-size: 1.5rem; margin-bottom: 0.5rem; }
.org-level-4 { flex-wrap: wrap; }

/* Committees Grid */
.committees-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
.committee-card { padding: 1.5rem; background: var(--bg-primary); border-radius: 1.5rem; border: 1px solid var(--border-light); }
.committee-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.committee-icon { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--primary), var(--primary-600)); border-radius: 0.75rem; font-size: 1.25rem; color: white; }
.committee-status { padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.75rem; font-weight: 600; }
.committee-status.active { background: var(--success-light); color: var(--success); }
.committee-title { font-size: 1.125rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem; }
.committee-desc { font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1rem; }
.committee-meta { display: flex; gap: 1rem; font-size: 0.75rem; color: var(--text-muted); }
```

---

### المهمة 6: إضافة أنماط CSS للصفحات الجديدة - الجزء 3
**الملف:** `public/theme-1/css/pages.css`
**إضافة بعد المهمة 5:**
```css
/* Page Hero (Sub-pages) */
.page-hero { position: relative; padding: 140px 0 60px; min-height: 300px; display: flex; align-items: flex-end; }
.page-hero-bg { position: absolute; inset: 0; }
.page-hero-img { width: 100%; height: 100%; object-fit: cover; }
.page-hero-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(var(--secondary-rgb), 0.95), rgba(var(--secondary-rgb), 0.8)); }
.page-hero-title { font-size: 2.5rem; font-weight: 800; color: white; margin-bottom: 0.5rem; }
.page-hero-subtitle { font-size: 1.125rem; color: rgba(255,255,255,0.8); }

/* Document Overview */
.document-overview { display: grid; grid-template-columns: 300px 1fr; gap: 3rem; align-items: center; }
.document-preview { position: relative; }
.document-preview img { width: 100%; border-radius: 1rem; box-shadow: var(--shadow-xl); }
.document-badge { position: absolute; top: 1rem; right: 1rem; display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: var(--success); color: white; border-radius: 1rem; font-size: 0.875rem; font-weight: 600; }
.document-meta { display: flex; gap: 2rem; margin: 1.5rem 0; }
.document-meta-item { display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary); }

/* Document Sections */
.document-sections { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
.document-section-card { padding: 1.5rem; background: var(--bg-primary); border-radius: 1rem; border: 1px solid var(--border-light); }
.document-section-number { font-size: 2rem; font-weight: 900; color: var(--primary); opacity: 0.3; margin-bottom: 0.5rem; }

/* Team Page */
.team-leadership { display: flex; justify-content: center; margin-bottom: 3rem; }
.leadership-card { max-width: 500px; text-align: center; padding: 2rem; background: linear-gradient(135deg, var(--primary-50), var(--bg-secondary)); border-radius: 1.5rem; }
.team-stats { display: flex; justify-content: center; gap: 4rem; padding: 3rem; background: var(--bg-secondary); border-radius: 2rem; }
.team-stat { text-align: center; }
.team-stat-value { font-size: 2.5rem; font-weight: 800; color: var(--primary); }
.team-stat-label { font-size: 0.875rem; color: var(--text-secondary); }

/* CTA Section */
.bg-primary-gradient { background: linear-gradient(135deg, var(--primary), var(--primary-600)); }
.cta-content { padding: 3rem 0; }
.text-inverse { color: white !important; }
.text-center { text-align: center; }
.btn-outline-white { background: transparent; color: white; border: 2px solid rgba(255,255,255,0.5); }
.btn-outline-white:hover { background: white; color: var(--primary); }
```

---

### المهمة 7: إضافة أنماط CSS لصفحات المركز الإعلامي
**الملف:** `public/theme-1/css/pages.css`
**إضافة بعد المهمة 6:**
```css
/* News Editorial Layout */
.news-editorial { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; }
.news-featured { position: relative; border-radius: 1.5rem; overflow: hidden; }
.news-featured-img { width: 100%; aspect-ratio: 16/9; object-fit: cover; }
.news-featured-content { padding: 2rem; background: var(--bg-primary); }
.news-sidebar { display: flex; flex-direction: column; gap: 1rem; }
.news-sidebar-item { display: flex; gap: 1rem; padding: 1rem; background: var(--bg-primary); border-radius: 1rem; border: 1px solid var(--border-light); }
.news-sidebar-img { width: 80px; height: 60px; object-fit: cover; border-radius: 0.5rem; flex-shrink: 0; }
.news-sidebar-content { flex: 1; }
.news-sidebar-content h3 { font-size: 0.875rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem; line-height: 1.4; }
.news-date { font-size: 0.75rem; color: var(--text-muted); }
.news-card { background: var(--bg-primary); border-radius: 1.5rem; overflow: hidden; border: 1px solid var(--border-light); }
.news-card-img { width: 100%; aspect-ratio: 16/10; object-fit: cover; }
.news-card-content { padding: 1.5rem; }

/* Pagination */
.pagination { display: flex; justify-content: center; gap: 0.5rem; margin-top: 3rem; }
.pagination-btn, .pagination-num { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: var(--bg-primary); border: 1px solid var(--border-light); border-radius: 0.75rem; color: var(--text-secondary); text-decoration: none; transition: all 0.2s; }
.pagination-num.active, .pagination-btn:hover:not(.disabled), .pagination-num:hover { background: var(--primary); color: white; border-color: var(--primary); }
.pagination-btn.disabled { opacity: 0.5; cursor: not-allowed; }

/* Video Grid */
.videos-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
.video-card { cursor: pointer; background: var(--bg-primary); border-radius: 1.5rem; overflow: hidden; border: 1px solid var(--border-light); transition: all 0.3s; }
.video-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
.video-thumbnail { position: relative; }
.video-thumbnail img { width: 100%; aspect-ratio: 16/9; object-fit: cover; }
.video-play-btn { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 60px; height: 60px; background: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; box-shadow: 0 4px 20px rgba(0,0,0,0.3); transition: transform 0.3s; }
.video-card:hover .video-play-btn { transform: translate(-50%, -50%) scale(1.1); }
.video-duration { position: absolute; bottom: 0.75rem; right: 0.75rem; background: rgba(0,0,0,0.8); color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; }
.video-content { padding: 1rem; }
.video-content h3 { font-size: 1rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem; }
.video-content p { font-size: 0.875rem; color: var(--text-secondary); }
.video-player { aspect-ratio: 16/9; }
.video-player iframe { width: 100%; height: 100%; }

/* Gallery Masonry */
.gallery-filter { display: flex; justify-content: center; gap: 0.5rem; margin-bottom: 2rem; }
.gallery-masonry { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.gallery-item { position: relative; cursor: pointer; border-radius: 1rem; overflow: hidden; aspect-ratio: 1; }
.gallery-item-tall { grid-row: span 2; aspect-ratio: auto; }
.gallery-item-wide { grid-column: span 2; aspect-ratio: 2/1; }
.gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
.gallery-item:hover img { transform: scale(1.05); }
.gallery-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7), transparent); display: flex; flex-direction: column; justify-content: flex-end; padding: 1rem; opacity: 0; transition: opacity 0.3s; }
.gallery-item:hover .gallery-overlay { opacity: 1; }
.gallery-title { color: white; font-weight: 600; margin-bottom: 0.25rem; }

/* Lightbox */
.lightbox { position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.95); display: none; align-items: center; justify-content: center; }
.lightbox.open { display: flex; }
.lightbox-img { max-width: 90%; max-height: 90%; object-fit: contain; }
.lightbox-close { position: absolute; top: 1rem; right: 1rem; width: 48px; height: 48px; background: rgba(255,255,255,0.1); border: none; border-radius: 50%; color: white; font-size: 1.5rem; cursor: pointer; }
.lightbox-nav { position: absolute; bottom: 2rem; display: flex; gap: 1rem; }
.lightbox-prev, .lightbox-next { width: 48px; height: 48px; background: rgba(255,255,255,0.1); border: none; border-radius: 50%; color: white; font-size: 1.25rem; cursor: pointer; }
```

---

### المهمة 8: إضافة أنماط CSS لصفحة تفاصيل المشروع والخبر
**الملف:** `public/theme-1/css/pages.css`
**إضافة بعد المهمة 7:**
```css
/* Project Details Hero */
.project-hero { position: relative; padding: 140px 0 80px; min-height: 400px; display: flex; align-items: flex-end; }
.project-hero-bg { position: absolute; inset: 0; }
.project-hero-img { width: 100%; height: 100%; object-fit: cover; }
.project-hero-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(var(--secondary-rgb), 0.95), rgba(var(--secondary-rgb), 0.7)); }
.project-hero-content { position: relative; z-index: 1; }
.project-hero-title { font-size: 2.5rem; font-weight: 800; color: white; margin: 0.5rem 0; }
.project-hero-subtitle { font-size: 1.125rem; color: rgba(255,255,255,0.8); }

/* Project KPIs */
.project-kpis-section { background: var(--bg-secondary); padding: 0; margin-top: -40px; position: relative; z-index: 10; }
.project-kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; max-width: 900px; margin: 0 auto; transform: translateY(-50%); }
.project-kpi { display: flex; align-items: center; gap: 1rem; padding: 1.5rem; background: var(--bg-primary); border-radius: 1rem; box-shadow: var(--shadow-lg); }
.project-kpi-icon { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--primary), var(--primary-600)); border-radius: 0.75rem; font-size: 1.25rem; color: white; }
.project-kpi-value { font-size: 1.5rem; font-weight: 800; color: var(--text-primary); }
.project-kpi-label { font-size: 0.75rem; color: var(--text-secondary); }

/* Project Detail Layout */
.project-detail-grid { display: grid; grid-template-columns: 1fr 350px; gap: 2rem; }
.project-main-content { min-width: 0; }
.project-sidebar { position: sticky; top: 100px; height: fit-content; }
.sidebar-card { background: var(--bg-primary); border-radius: 1.5rem; padding: 1.5rem; border: 1px solid var(--border-light); margin-bottom: 1.5rem; }
.sidebar-card h3 { font-size: 1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 1rem; }
.project-info-list { list-style: none; }
.project-info-list li { display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--border-light); }
.info-label { display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary); font-size: 0.875rem; }
.info-value { font-weight: 600; color: var(--text-primary); font-size: 0.875rem; }
.project-progress { margin-top: 1.5rem; }
.progress-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.875rem; }
.progress-bar { height: 8px; background: var(--bg-secondary); border-radius: 1rem; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, var(--primary), var(--primary-400)); border-radius: 1rem; }
.cta-card { background: linear-gradient(135deg, var(--primary-50), var(--bg-secondary)); border-color: var(--primary); }

/* Project Tabs */
.project-tabs .tab-content { padding: 1.5rem 0; }
.project-objectives { list-style: none; margin: 1.5rem 0; }
.project-objectives li { display: flex; align-items: flex-start; gap: 0.75rem; padding: 0.5rem 0; }
.project-objectives li i { color: var(--success); margin-top: 0.25rem; }

/* Project Timeline */
.project-timeline { position: relative; padding-right: 2rem; }
.project-timeline::before { content: ''; position: absolute; right: 0; top: 0; bottom: 0; width: 2px; background: var(--border-light); }
.timeline-item { position: relative; padding-bottom: 2rem; padding-right: 2rem; }
.timeline-marker { position: absolute; right: -2rem; top: 0; width: 20px; height: 20px; background: var(--bg-secondary); border: 2px solid var(--border-default); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.625rem; transform: translateX(50%); }
.timeline-item.completed .timeline-marker { background: var(--success); border-color: var(--success); color: white; }
.timeline-item.active .timeline-marker { background: var(--primary); border-color: var(--primary); color: white; animation: pulse 2s infinite; }
.timeline-date { font-size: 0.75rem; color: var(--primary); font-weight: 600; margin-bottom: 0.25rem; }

/* Reports List */
.reports-list { display: flex; flex-direction: column; gap: 0.75rem; }
.report-item { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--bg-secondary); border-radius: 0.75rem; text-decoration: none; transition: all 0.2s; }
.report-item:hover { background: var(--bg-tertiary); }
.report-icon { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: rgba(var(--primary-rgb), 0.1); border-radius: 0.5rem; font-size: 1.25rem; color: var(--primary); }
.report-info { flex: 1; }
.report-info h3 { font-size: 0.875rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.125rem; }
.report-info span { font-size: 0.75rem; color: var(--text-muted); }

/* Article Page */
.article-hero { position: relative; padding: 180px 0 80px; min-height: 450px; }
.article-hero-bg { position: absolute; inset: 0; }
.article-hero-img { width: 100%; height: 100%; object-fit: cover; }
.article-hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.4)); }
.article-hero-title { font-size: 2.25rem; font-weight: 800; color: white; margin: 1rem 0 0.5rem; max-width: 800px; line-height: 1.3; }
.article-meta { display: flex; gap: 1.5rem; color: rgba(255,255,255,0.7); font-size: 0.875rem; }

/* Article Layout */
.article-layout { display: grid; grid-template-columns: 1fr 300px; gap: 3rem; }
.article-content { line-height: 1.8; }
.article-content h2 { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin: 2rem 0 1rem; }
.article-content p { margin-bottom: 1.5rem; color: var(--text-secondary); }
.article-content ul { margin: 1.5rem 0; padding-right: 1.5rem; }
.article-content li { margin-bottom: 0.5rem; color: var(--text-secondary); }
.article-lead { font-size: 1.25rem; color: var(--text-primary) !important; font-weight: 500; }
.article-quote { margin: 2rem 0; padding: 2rem; background: var(--bg-secondary); border-right: 4px solid var(--primary); border-radius: 0 1rem 1rem 0; }
.article-quote p { font-size: 1.25rem; font-style: italic; color: var(--text-primary); margin-bottom: 0.5rem; }
.article-quote cite { font-size: 0.875rem; color: var(--primary); font-style: normal; }
.article-gallery { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 2rem 0; }
.article-gallery img { width: 100%; border-radius: 0.75rem; }
.article-share { display: flex; align-items: center; gap: 1rem; padding-top: 2rem; border-top: 1px solid var(--border-light); margin-top: 2rem; }
.share-btn { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: var(--bg-secondary); border-radius: 50%; color: var(--text-secondary); text-decoration: none; transition: all 0.2s; }
.share-btn:hover { background: var(--primary); color: white; }
.article-sidebar .related-news { display: flex; flex-direction: column; gap: 1rem; }
.related-item { display: flex; gap: 0.75rem; text-decoration: none; }
.related-img { width: 70px; height: 50px; object-fit: cover; border-radius: 0.5rem; flex-shrink: 0; }
.related-content h4 { font-size: 0.875rem; font-weight: 600; color: var(--text-primary); line-height: 1.4; margin-bottom: 0.25rem; }
.related-content span { font-size: 0.75rem; color: var(--text-muted); }
```

---

### المهمة 9: تحديث Mobile Dropdowns في JavaScript
**الملف:** `public/theme-1/js/components.js`
**إضافة في نهاية الملف:**
```javascript
// Mobile Dropdown Toggle
document.querySelectorAll('.mobile-dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', function(e) {
        e.preventDefault();
        const dropdown = this.parentElement;
        dropdown.classList.toggle('open');
    });
});
```

---

### المهمة 10: إضافة Responsive للأنماط الجديدة
**الملف:** `public/theme-1/css/pages.css`
**إضافة في نهاية الملف:**
```css
/* Responsive - New Pages */
@media (max-width: 992px) {
    .strategy-vmp-grid { grid-template-columns: 1fr; }
    .strategy-goals-grid { grid-template-columns: 1fr; }
    .founders-grid { grid-template-columns: repeat(2, 1fr); }
    .board-grid { grid-template-columns: repeat(2, 1fr); }
    .responsibilities-grid { grid-template-columns: repeat(2, 1fr); }
    .committees-grid { grid-template-columns: repeat(2, 1fr); }
    .document-overview { grid-template-columns: 1fr; }
    .document-sections { grid-template-columns: repeat(2, 1fr); }
    .news-editorial { grid-template-columns: 1fr; }
    .videos-grid { grid-template-columns: repeat(2, 1fr); }
    .gallery-masonry { grid-template-columns: repeat(2, 1fr); }
    .project-kpis { grid-template-columns: repeat(2, 1fr); }
    .project-detail-grid { grid-template-columns: 1fr; }
    .article-layout { grid-template-columns: 1fr; }
    .org-level-4 { flex-wrap: wrap; gap: 1rem; }
    .org-node { min-width: 120px; padding: 0.75rem 1rem; }
}

@media (max-width: 576px) {
    .founders-grid { grid-template-columns: 1fr; }
    .board-grid { grid-template-columns: 1fr; }
    .responsibilities-grid { grid-template-columns: 1fr; }
    .committees-grid { grid-template-columns: 1fr; }
    .document-sections { grid-template-columns: 1fr; }
    .videos-grid { grid-template-columns: 1fr; }
    .gallery-masonry { grid-template-columns: 1fr; }
    .gallery-item-tall, .gallery-item-wide { grid-column: auto; grid-row: auto; }
    .project-kpis { grid-template-columns: 1fr; }
    .team-stats { flex-direction: column; gap: 2rem; }
    .chairman-card { flex-direction: column; text-align: center; }
    .page-hero-title { font-size: 2rem; }
    .article-hero-title { font-size: 1.75rem; }
}
```

---

## ملاحظات التنفيذ

### ترتيب التنفيذ المقترح:
1. **مهام CSS أولاً** (المهام 3-8, 10) - لضمان ظهور الأنماط بشكل صحيح
2. **تحديث JavaScript** (المهمة 9)
3. **تحديث الصفحة الرئيسية** (المهام 1-2)

### كيفية استبدال الـ Placeholders:
1. ضع صورك الحقيقية في `assets/img/`
2. استبدل المسارات في HTML من `assets/svg/placeholder-*.svg` إلى `assets/img/your-image.jpg`
3. الـ SVG Placeholders تعمل كـ fallback ممتاز عند عدم توفر صور

### ملاحظة تقنية:
جميع المكونات تستخدم CSS Variables المعرفة في `main.css` لضمان التناسق البصري وسهولة التخصيص.
