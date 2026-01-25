
# خطة تحويل قالب الجمعية إلى Premium Edition

## الوضع الحالي

القالب يحتوي على:
- بنية CSS قوية مع Design Tokens (main.css: 1077 سطر)
- مكونات متعددة (components.css: 1999 سطر)
- صفحات متنوعة (pages.css: 3582 سطر)
- 8 ملفات SVG Placeholder موجودة في assets/svg/
- نظام JavaScript جيد للتفاعلات الأساسية

## نطاق التحسينات (7 محاور رئيسية)

---

## المحور 1: توحيد Page Hero للصفحات الداخلية

### الملفات المتأثرة:
- `css/pages.css` (إضافة أنماط جديدة)
- جميع الصفحات الداخلية (14+ صفحة)

### التغييرات:

**1.1 تصميم Page Hero الجديد:**

```text
+------------------------------------------------------------------+
|  [Pattern SVG خلفية]                                              |
|  [صورة/تدرج خلفية مع Wave Shape]                                  |
|                                                                   |
|  [شارة نوع الصفحة]  مثال: "الحوكمة" / "المشاريع"                  |
|                                                                   |
|  الرئيسية / عن الجمعية / استراتيجيتنا  ← Breadcrumb               |
|                                                                   |
|  ═══ عنوان الصفحة ═══                                             |
|  وصف مختصر للصفحة                                                 |
|                                                                   |
|  [مشاركة] [طباعة] [تنزيل]  ← شريط الإجراءات                       |
|                                                                   |
|  ∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿ Wave Shape                                  |
+------------------------------------------------------------------+
```

**1.2 CSS الجديد (يضاف إلى pages.css):**

```css
/* Premium Page Hero - Unified Internal Pages */
.page-hero-premium {
    position: relative;
    padding: var(--space-40) 0 var(--space-24);
    min-height: 380px;
    background: linear-gradient(135deg, var(--secondary-800) 0%, var(--secondary-700) 100%);
    overflow: hidden;
}

/* Background Image Layer */
.page-hero-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
}

.page-hero-bg img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.15;
}

/* Pattern Overlay */
.page-hero-pattern {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,..."); /* Dot Pattern */
    opacity: 0.08;
    z-index: 1;
}

/* Wave Shape Bottom */
.page-hero-wave {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    z-index: 3;
}

/* Content */
.page-hero-content {
    position: relative;
    z-index: 10;
    text-align: center;
}

/* Page Type Badge/Chip */
.page-hero-chip {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-4);
    background: rgba(var(--primary-rgb), 0.2);
    border: 1px solid rgba(var(--primary-rgb), 0.4);
    border-radius: var(--radius-full);
    color: var(--primary-300);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    margin-bottom: var(--space-4);
    backdrop-filter: blur(8px);
}

/* Actions Bar */
.page-hero-actions {
    display: flex;
    justify-content: center;
    gap: var(--space-3);
    margin-top: var(--space-6);
}

.page-hero-action {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-4);
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: var(--radius-lg);
    color: rgba(255,255,255,0.8);
    font-size: var(--font-size-sm);
    cursor: pointer;
    transition: all var(--duration-200) var(--ease-out);
}

.page-hero-action:hover {
    background: rgba(255,255,255,0.2);
    color: var(--text-inverse);
}
```

**1.3 HTML Template للاستخدام في كل صفحة داخلية:**

```html
<section class="page-hero-premium">
    <div class="page-hero-bg">
        <img src="assets/svg/placeholder-cover.svg" alt="">
    </div>
    <div class="page-hero-pattern"></div>
    
    <div class="container">
        <div class="page-hero-content">
            <span class="page-hero-chip">
                <i class="fas fa-chess"></i>
                الاستراتيجية
            </span>
            
            <nav class="breadcrumb breadcrumb-light">
                <a href="index.html">الرئيسية</a>
                <span class="breadcrumb-sep"><i class="fas fa-chevron-left"></i></span>
                <span>استراتيجيتنا</span>
            </nav>
            
            <h1 class="page-hero-title">استراتيجيتنا</h1>
            <p class="page-hero-subtitle">خارطة طريقنا نحو تحقيق الأثر المستدام</p>
            
            <div class="page-hero-actions">
                <button class="page-hero-action" onclick="shareCurrentPage()">
                    <i class="fas fa-share-alt"></i> مشاركة
                </button>
                <button class="page-hero-action" onclick="window.print()">
                    <i class="fas fa-print"></i> طباعة
                </button>
            </div>
        </div>
    </div>
    
    <svg class="page-hero-wave" viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path fill="#fff" d="M0,30 C360,80 1080,-20 1440,30 L1440,60 L0,60 Z"/>
    </svg>
</section>
```

---

## المحور 2: تطوير صفحات التفاصيل إلى Premium

### 2.1 صفحة project-details.html

**التحسينات:**
- Hero Cover بتأثير Parallax خفيف
- شريط Badges (حالة المشروع، المنطقة، التصنيف)
- KPI Strip معاد تصميمه بأيقونات متحركة
- Impact Stories Section جديد
- قائمة وثائق محسنة مع أيقونات ملونة

```text
+------------------------------------------------------------------+
| [HERO COVER - Full Width with Parallax]                          |
|                                                                   |
|  ┌─────────┐ ┌─────────┐ ┌─────────┐                             |
|  │ قيد     │ │ الرياض  │ │ تمكين   │ ← Badges                    |
|  │ التنفيذ │ │         │ │ الشباب  │                             |
|  └─────────┘ └─────────┘ └─────────┘                             |
+------------------------------------------------------------------+
|                                                                   |
|  ╔════════╗  ╔════════╗  ╔════════╗  ╔════════╗                  |
|  ║  500   ║  ║  20    ║  ║  150   ║  ║  85%   ║  ← KPI Strip     |
|  ║ مستفيد ║  ║ دورة   ║  ║ فرصة   ║  ║ توظيف ║                   |
|  ╚════════╝  ╚════════╝  ╚════════╝  ╚════════╝                  |
|                                                                   |
|  [نظرة عامة] [الأثر] [الجدول الزمني] [الشركاء] [التقارير]        |
|  ═══════════════════════════════════════════════════════════════  |
|                                                                   |
|  ┌─ Impact Stories ─────────────────────────────────────────────┐ |
|  │ قصص نجاح حقيقية من المستفيدين مع صور وشهادات               │ |
|  └──────────────────────────────────────────────────────────────┘ |
+------------------------------------------------------------------+
```

### 2.2 صفحة media/news-details.html

**التحسينات:**
- تخطيط Editorial (عمود محتوى رئيسي + Sidebar)
- Meta Bar محسن (تاريخ، تصنيف، وقت القراءة، المشاهدات)
- Quote Block مميز
- معرض صور داخل المقال
- Related Items محسن

```text
+------------------------------------------------------------------+
| [ARTICLE HERO - Panoramic Cover Image]                           |
+------------------------------------------------------------------+
|                                                                   |
|  ┌──────────────────────────────┐  ┌───────────────────────────┐ |
|  │                              │  │  📅 تاريخ النشر          │ |
|  │   Main Content Column        │  │  📂 التصنيف              │ |
|  │                              │  │  ⏱ وقت القراءة           │ |
|  │   ┌────────────────────────┐ │  │                           │ |
|  │   │   Quote Block         │ │  │  ┌─────────────────────┐ │ |
|  │   │   مع تصميم مميز        │ │  │  │ أخبار ذات صلة     │ │ |
|  │   └────────────────────────┘ │  │  │ ──────────────────  │ │ |
|  │                              │  │  │ [خبر 1]            │ │ |
|  │   [معرض صور المقال]         │  │  │ [خبر 2]            │ │ |
|  │                              │  │  │ [خبر 3]            │ │ |
|  │                              │  │  └─────────────────────┘ │ |
|  └──────────────────────────────┘  └───────────────────────────┘ |
+------------------------------------------------------------------+
```

---

## المحور 3: نظام Modal موحد لـ 4 أنواع محتوى

### الملفات الجديدة:
- `css/modal-system.css` (أو إضافة إلى components.css)
- `js/media-center.js` (ملف JavaScript جديد)

### 3.1 هيكل Content Cards في news.html:

```html
<!-- مقال يفتح صفحة تفاصيل -->
<article class="content-card" data-type="article" data-id="123">
    <img src="..." class="content-card-img">
    <div class="content-card-body">
        <span class="content-type-badge article"><i class="fas fa-newspaper"></i> مقال</span>
        <h3>عنوان المقال</h3>
    </div>
</article>

<!-- فيديو يفتح Modal -->
<article class="content-card" data-type="video" 
         data-video-url="https://www.youtube.com/embed/VIDEO_ID">
    <div class="content-card-img">
        <img src="...">
        <div class="play-icon"><i class="fas fa-play"></i></div>
    </div>
    <span class="content-type-badge video"><i class="fas fa-video"></i> فيديو</span>
</article>

<!-- معرض صور يفتح Modal Slider -->
<article class="content-card" data-type="gallery" 
         data-gallery='["img1.jpg","img2.jpg","img3.jpg"]'>
    <div class="content-card-img gallery-preview">
        <img src="...">
        <span class="gallery-count"><i class="fas fa-images"></i> 12 صورة</span>
    </div>
    <span class="content-type-badge gallery"><i class="fas fa-images"></i> معرض</span>
</article>

<!-- مستند يفتح Modal مع iframe -->
<article class="content-card" data-type="document" 
         data-doc-url="https://drive.google.com/file/d/FILE_ID/preview"
         data-download-url="https://drive.google.com/uc?export=download&id=FILE_ID">
    <div class="content-card-img doc-preview">
        <i class="fas fa-file-pdf fa-3x"></i>
    </div>
    <span class="content-type-badge document"><i class="fas fa-file-alt"></i> مستند</span>
</article>
```

### 3.2 Modal System الموحد:

```html
<!-- Universal Modal -->
<div class="modal-backdrop" id="media-modal-backdrop"></div>
<div class="modal media-modal" id="media-modal">
    <button class="modal-close"><i class="fas fa-times"></i></button>
    
    <!-- Video Content -->
    <div class="modal-video-content" hidden>
        <div class="video-wrapper">
            <iframe id="video-iframe" src="" allowfullscreen></iframe>
        </div>
    </div>
    
    <!-- Gallery Content -->
    <div class="modal-gallery-content" hidden>
        <div class="gallery-slider">
            <div class="gallery-slides"></div>
            <button class="gallery-nav prev"><i class="fas fa-chevron-right"></i></button>
            <button class="gallery-nav next"><i class="fas fa-chevron-left"></i></button>
            <div class="gallery-dots"></div>
            <div class="gallery-counter">1 / 12</div>
        </div>
    </div>
    
    <!-- Document Content -->
    <div class="modal-document-content" hidden>
        <div class="doc-preview-wrapper">
            <iframe id="doc-iframe" src=""></iframe>
        </div>
        <div class="doc-actions">
            <a href="#" class="btn btn-primary" id="doc-open-new" target="_blank">
                <i class="fas fa-external-link-alt"></i> فتح في تبويب جديد
            </a>
            <a href="#" class="btn btn-outline" id="doc-download" download>
                <i class="fas fa-download"></i> تحميل
            </a>
        </div>
    </div>
</div>
```

### 3.3 JavaScript (media-center.js):

```javascript
// Initialize Media Center
function initMediaCenter() {
    const contentCards = document.querySelectorAll('.content-card[data-type]');
    
    contentCards.forEach(card => {
        card.addEventListener('click', () => handleContentClick(card));
    });
}

function handleContentClick(card) {
    const type = card.dataset.type;
    
    switch(type) {
        case 'article':
            window.location.href = `news-details.html?id=${card.dataset.id}`;
            break;
        case 'video':
            openVideoModal(card.dataset.videoUrl);
            break;
        case 'gallery':
            openGalleryModal(JSON.parse(card.dataset.gallery));
            break;
        case 'document':
            openDocumentModal(card.dataset.docUrl, card.dataset.downloadUrl);
            break;
    }
}

// Gallery Slider مع Autoplay و Pause on Hover
function openGalleryModal(images) {
    // ... slider logic with prev/next/dots/autoplay
}
```

---

## المحور 4: Hero Slider للصفحة الرئيسية

### الملفات المتأثرة:
- `index.html` (تعديل قسم Hero)
- `css/pages.css` (إضافة أنماط Slider)
- `js/main.js` (إضافة وظائف Slider)

### 4.1 البنية الجديدة للـ Hero:

```html
<section class="hero" aria-label="القسم الرئيسي">
    <!-- Video Background (خلف السلايدر) -->
    <div class="hero-video-wrapper">
        <video class="hero-video" autoplay muted loop playsinline poster="assets/img/hero.jpg">
            <source src="assets/img/hero.webm" type="video/webm">
        </video>
    </div>
    
    <!-- Image Slider -->
    <div class="hero-slider" data-autoplay="true" data-interval="6000">
        <div class="hero-slides">
            <div class="hero-slide active">
                <img src="assets/img/hero/hero-1.jpg" alt="">
            </div>
            <div class="hero-slide">
                <img src="assets/img/hero/hero-2.jpg" alt="">
            </div>
            <!-- ... more slides -->
        </div>
        
        <!-- Controls -->
        <div class="hero-slider-controls">
            <button class="slider-nav prev"><i class="fas fa-chevron-right"></i></button>
            <div class="slider-dots"></div>
            <button class="slider-nav next"><i class="fas fa-chevron-left"></i></button>
        </div>
        
        <!-- Progress Bars -->
        <div class="slider-progress">
            <div class="progress-bar active"></div>
            <div class="progress-bar"></div>
            <!-- ... -->
        </div>
    </div>
    
    <!-- Overlays and Content (كما هي) -->
    <div class="hero-overlay"></div>
    <div class="hero-content">...</div>
</section>
```

### 4.2 CSS للـ Slider:

```css
/* Hero Image Slider */
.hero-slider {
    position: absolute;
    inset: 0;
    z-index: 0;
}

.hero-slides {
    position: relative;
    width: 100%;
    height: 100%;
}

.hero-slide {
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 1.2s ease-in-out;
}

.hero-slide.active {
    opacity: 1;
}

.hero-slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    animation: kenBurns 8s ease-in-out infinite alternate;
}

@keyframes kenBurns {
    0% { transform: scale(1) translateX(0); }
    100% { transform: scale(1.05) translateX(-1%); }
}

/* Pause on Hover */
.hero-slider:hover .hero-slide img {
    animation-play-state: paused;
}

/* Dots */
.slider-dots {
    display: flex;
    gap: var(--space-2);
}

.slider-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(255,255,255,0.4);
    cursor: pointer;
    transition: all var(--duration-300);
}

.slider-dot.active {
    background: var(--primary);
    transform: scale(1.2);
}

/* Respect Reduced Motion */
@media (prefers-reduced-motion: reduce) {
    .hero-slide img {
        animation: none;
    }
    .hero-slider {
        /* Show first image only */
    }
}
```

---

## المحور 5: Micro-interactions الإبداعية

### 5.1 Buttons (إضافة إلى components.css):

```css
/* Button Gradient Shift on Hover */
.btn-primary {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-600) 100%);
    background-size: 200% 200%;
    background-position: 0% 50%;
    transition: all var(--duration-300) var(--ease-out), 
                background-position var(--duration-500) var(--ease-out);
}

.btn-primary:hover {
    background-position: 100% 50%;
}

/* Arrow Slide */
.btn .btn-arrow {
    transition: transform var(--duration-200) var(--ease-out);
}

.btn:hover .btn-arrow {
    transform: translateX(-6px);
}

/* Subtle Ripple Effect */
.btn {
    position: relative;
    overflow: hidden;
}

.btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at var(--ripple-x, 50%) var(--ripple-y, 50%), 
                rgba(255,255,255,0.3) 0%, transparent 60%);
    opacity: 0;
    transition: opacity var(--duration-300);
}

.btn:active::after {
    opacity: 1;
}
```

### 5.2 Cards (Lift + Border Glow):

```css
.card, .field-card, .project-card {
    transition: all var(--duration-300) var(--ease-out);
}

.card:hover, .field-card:hover, .project-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.15),
                0 0 0 1px rgba(var(--primary-rgb), 0.1);
}

/* Subtle Border Glow */
.card:hover::before {
    content: '';
    position: absolute;
    inset: -1px;
    background: linear-gradient(135deg, 
        rgba(var(--primary-rgb), 0.3), 
        rgba(var(--primary-rgb), 0.1));
    border-radius: inherit;
    z-index: -1;
    filter: blur(4px);
}
```

### 5.3 Navbar (Enhanced Sticky + Shrink):

```css
.navbar {
    transition: all var(--duration-300) var(--ease-out),
                backdrop-filter var(--duration-300);
}

.navbar.scrolled {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    box-shadow: 0 4px 30px rgba(0,0,0,0.08);
}

.navbar.scrolled .navbar-logo {
    height: 32px; /* Shrink */
}

.navbar.scrolled .navbar-container {
    padding-block: var(--space-2);
}
```

### 5.4 Reveals المحسنة:

```css
/* Fade Up Gentle */
.reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity var(--duration-700) var(--ease-out),
                transform var(--duration-700) var(--ease-out);
}

.reveal.revealed {
    opacity: 1;
    transform: translateY(0);
}

/* Stagger Effect للعناصر المتعددة */
.reveal:nth-child(1) { transition-delay: 0ms; }
.reveal:nth-child(2) { transition-delay: 100ms; }
.reveal:nth-child(3) { transition-delay: 200ms; }
.reveal:nth-child(4) { transition-delay: 300ms; }
```

---

## المحور 6: نظام Placeholders الاحترافي

### 6.1 SVG Placeholders الجديدة:

| الملف | الاستخدام |
|-------|----------|
| `placeholder-hero-1.svg` ... `placeholder-hero-6.svg` | Hero Slider |
| `placeholder-org-chart.svg` | الهيكل التنظيمي |
| `placeholder-person-m.svg` | صور الأشخاص (ذكر) |
| `placeholder-person-f.svg` | صور الأشخاص (أنثى) |
| `placeholder-project-wide.svg` | Covers المشاريع |
| `placeholder-news-wide.svg` | Covers الأخبار |
| `placeholder-gallery-grid.svg` | Preview المعارض |
| `placeholder-video-cover.svg` | أغلفة الفيديو |
| `placeholder-document-pdf.svg` | معاينة المستندات |

### 6.2 تصميم SVG Placeholder نموذجي:

```xml
<svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0fbfae;stop-opacity:0.1" />
      <stop offset="100%" style="stop-color:#53687a;stop-opacity:0.05" />
    </linearGradient>
    <pattern id="dots" patternUnits="userSpaceOnUse" width="20" height="20">
      <circle cx="2" cy="2" r="1" fill="#0fbfae" opacity="0.15"/>
    </pattern>
  </defs>
  
  <rect fill="#f8fafc" width="800" height="400"/>
  <rect fill="url(#grad)" width="800" height="400"/>
  <rect fill="url(#dots)" width="800" height="400"/>
  
  <!-- Icon in Center -->
  <g transform="translate(350, 150)">
    <rect width="100" height="100" rx="20" fill="#0fbfae" opacity="0.12"/>
    <path d="..." stroke="#0fbfae" stroke-width="2" fill="none"/>
  </g>
  
  <!-- Text placeholder lines -->
  <rect x="300" y="280" width="200" height="14" rx="7" fill="#e2e8f0"/>
  <rect x="330" y="305" width="140" height="10" rx="5" fill="#e2e8f0"/>
</svg>
```

### 6.3 إنشاء مجلد Hero Placeholders:

```
assets/
├── img/
│   └── hero/
│       ├── hero-1.jpg (or use SVG fallback)
│       ├── hero-2.jpg
│       ├── hero-3.jpg
│       ├── hero-4.jpg
│       ├── hero-5.jpg
│       └── hero-6.jpg
└── svg/
    ├── placeholder-hero-1.svg
    ├── placeholder-hero-2.svg
    └── ... (fallbacks)
```

---

## المحور 7: تحديثات خاصة بصفحة org-structure.html

### إضافات:
- صورة مركزية للهيكل التنظيمي (كبيرة وقابلة للتكبير)
- Lightbox لعرض الصورة بحجم كامل
- أيقونة تكبير Hover

```html
<!-- في org-structure.html -->
<div class="org-chart-visual reveal">
    <div class="org-chart-image-wrapper" data-lightbox="assets/img/org-chart-full.jpg">
        <img src="assets/svg/placeholder-org-chart.svg" alt="الهيكل التنظيمي" class="org-chart-img">
        <div class="org-chart-zoom">
            <i class="fas fa-search-plus"></i>
            <span>اضغط للتكبير</span>
        </div>
    </div>
</div>

<!-- Lightbox -->
<div class="lightbox" id="org-lightbox">
    <button class="lightbox-close"><i class="fas fa-times"></i></button>
    <img src="" alt="" class="lightbox-img">
</div>
```

---

## ملخص الملفات المتأثرة

### ملفات CSS:
| الملف | التعديل |
|-------|---------|
| `css/pages.css` | إضافة ~400 سطر (Page Hero Premium, Hero Slider, Improvements) |
| `css/components.css` | إضافة ~200 سطر (Modal System, Micro-interactions) |

### ملفات JavaScript:
| الملف | التعديل |
|-------|---------|
| `js/main.js` | إضافة Hero Slider, Enhanced Reveals |
| `js/components.js` | تحديث Modal System |
| `js/media-center.js` | ملف جديد (~150 سطر) |

### ملفات HTML:
| الملف | التعديل |
|-------|---------|
| `index.html` | إضافة Hero Slider |
| جميع الصفحات الداخلية (14+) | تطبيق Page Hero الجديد |
| `media/news.html` | إضافة Content Cards + Modal |
| `project-details.html` | تحسينات Premium |
| `media/news-details.html` | Editorial Layout |
| `org-structure.html` | Lightbox للهيكل |

### ملفات SVG جديدة:
- 6 ملفات Hero Placeholders
- 4 ملفات Person Placeholders
- 1 ملف Org Chart Placeholder

---

## تعليمات استبدال الصور

**لاستبدال صور Hero Slider:**
1. ضع صورك في `assets/img/hero/` بأسماء `hero-1.jpg` ... `hero-6.jpg`
2. الأبعاد المثالية: 1920x1080 أو أعلى
3. سيتم تطبيق Ken Burns تلقائياً

**لاستبدال Placeholders:**
1. استبدل مسار `assets/svg/placeholder-*.svg` بمسار صورتك
2. أو ضع صورًا حقيقية في `assets/img/` واستخدم مساراتها

**للحفاظ على Fallback:**
```html
<img src="assets/img/my-image.jpg" 
     onerror="this.src='assets/svg/placeholder-cover.svg'"
     alt="وصف الصورة">
```

---

## ترتيب التنفيذ المقترح

1. **المرحلة 1**: إضافة أنماط CSS الجديدة (pages.css + components.css)
2. **المرحلة 2**: إنشاء SVG Placeholders الجديدة
3. **المرحلة 3**: تطبيق Page Hero الموحد على الصفحات الداخلية
4. **المرحلة 4**: Hero Slider في الصفحة الرئيسية
5. **المرحلة 5**: نظام Modal للمركز الإعلامي
6. **المرحلة 6**: تحسينات صفحات التفاصيل
7. **المرحلة 7**: Micro-interactions والتحسينات النهائية
