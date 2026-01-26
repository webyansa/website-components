
# خطة تحسين الصفحة الرئيسية - Premium Light Theme

## الرؤية
صفحة رئيسية هادئة، راقية، مستوحاة من Apple/Google/Microsoft بـ Light Theme نظيف (95% فاتح)، مع سلايدر Hero سينمائي وأقسام حديثة غير تقليدية.

---

## 1. هيكل الملفات المُحدّث

```text
public/theme-1/
├── index.html                    (تحديث كامل)
├── css/
│   └── main.css                  (ملف CSS الوحيد - ~900 سطر)
├── js/
│   └── main.js                   (ملف JS الوحيد - ~350 سطر)
└── assets/
    ├── img/
    │   ├── logo.svg
    │   ├── hero/                 (مجلد جديد)
    │   │   ├── hero-1.jpg        (placeholder SVG مؤقتاً)
    │   │   ├── hero-2.jpg
    │   │   ├── hero-3.jpg
    │   │   ├── hero-4.jpg
    │   │   ├── hero-5.jpg
    │   │   └── hero-6.jpg
    │   └── placeholders/         (مجلد جديد)
    │       ├── project-1.jpg
    │       ├── team-1.jpg
    │       └── partner-logo.svg
    └── svg/
        ├── placeholder-hero-1.svg ... placeholder-hero-6.svg (جديد)
        ├── placeholder-field-*.svg (6 أيقونات مجالات)
        ├── placeholder-team-*.svg  (صور الفريق)
        └── (الموجود حالياً)
```

---

## 2. نظام الألوان - Light Theme (إلزامي)

داخل `:root` في main.css:

```css
:root {
    /* Backgrounds - Light Theme 95% */
    --bg: #F7F8FA;
    --surface: #FFFFFF;
    --surface-alt: #F1F3F5;
    
    /* Text - Not Pure Black */
    --text: #0F172A;
    --text-secondary: #475569;
    --muted: #64748B;
    
    /* Borders */
    --border: #E5E7EB;
    --border-light: #F3F4F6;
    
    /* Primary Accent - Calm Teal */
    --primary: #0F766E;
    --primary-soft: #E6F4F2;
    --primary-rgb: 15, 118, 110;
    
    /* Secondary Accent */
    --accent: #2563EB;
    --accent-soft: #EFF6FF;
    
    /* Shadows - Ultra Soft */
    --shadow-sm: 0 1px 3px rgba(2, 6, 23, 0.04);
    --shadow-md: 0 4px 12px rgba(2, 6, 23, 0.06);
    --shadow-lg: 0 14px 40px rgba(2, 6, 23, 0.08);
    
    /* Radius */
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --radius-xl: 24px;
    --radius-full: 9999px;
}
```

---

## 3. Design System - الأزرار (3 أنواع فقط)

### btn-primary
- خلفية: `--primary` مع gradient خفيف
- Hover: gradient shift + lift بسيط
- سهم داخلي يتحرك على hover

### btn-secondary
- Outline فقط (border: 1.5px solid --border)
- Hover: يمتلئ من اليمين لليسار (RTL)

### btn-ghost
- نص + أيقونة بدون خلفية
- Hover: لون primary

```css
.btn-primary {
    background: linear-gradient(135deg, var(--primary) 0%, #0d6560 100%);
    color: #fff;
    padding: 14px 28px;
    border-radius: var(--radius-full);
    font-weight: 500;
    transition: all 0.3s ease;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(15, 118, 110, 0.25);
}

.btn-primary .btn-arrow {
    transition: transform 0.2s ease;
}

.btn-primary:hover .btn-arrow {
    transform: translateX(-4px);
}
```

---

## 4. Hero Section - سلايدر سينمائي

### البنية HTML
```html
<section class="hero" aria-label="القسم الرئيسي">
    <!-- Image Slider -->
    <div class="hero-slider" data-autoplay="5000">
        <div class="hero-slides">
            <div class="hero-slide active">
                <img src="assets/svg/placeholder-hero-1.svg" alt="">
            </div>
            <!-- ... 6 slides -->
        </div>
        
        <!-- Overlay (خفيف جداً - ليس أسود) -->
        <div class="hero-overlay"></div>
        
        <!-- Controls -->
        <div class="hero-controls">
            <button class="hero-nav prev"><i class="fas fa-chevron-right"></i></button>
            <div class="hero-dots"></div>
            <button class="hero-nav next"><i class="fas fa-chevron-left"></i></button>
        </div>
        
        <!-- Progress Bars -->
        <div class="hero-progress"></div>
    </div>
    
    <!-- Content -->
    <div class="hero-content">
        <span class="hero-eyebrow">منذ 2009</span>
        <h1 class="hero-title">نبني مجتمعاً أفضل</h1>
        <p class="hero-subtitle">نعمل بمنهجية علمية وشفافية كاملة...</p>
        
        <div class="hero-actions">
            <a href="#" class="btn-primary">
                استكشف مشاريعنا
                <i class="fas fa-arrow-left btn-arrow"></i>
            </a>
            <a href="#" class="btn-secondary">تعرف علينا</a>
        </div>
        
        <!-- Micro KPIs -->
        <div class="hero-kpis">
            <div class="hero-kpi">
                <span class="hero-kpi-value" data-count="50000">0</span>
                <span class="hero-kpi-label">مستفيد</span>
            </div>
            <!-- ... -->
        </div>
    </div>
</section>
```

### CSS للسلايدر
- Crossfade انتقال 900ms
- Ken Burns خفيف (scale 1.02)
- Overlay: `rgba(255,255,255,0.3)` (ليس أسود!)
- Dots + Prev/Next
- Progress bar لكل شريحة

### JavaScript
- Autoplay كل 5 ثواني
- Pause on hover
- احترام `prefers-reduced-motion` (إيقاف Ken Burns)
- Touch/Swipe support

---

## 5. قسم نبذة عن الجمعية

تصميم هادئ بدون صور:
- عنوان قوي على 3 أسطر
- فقرة 3-4 أسطر احترافية
- 3 KPIs كبيرة مع عداد تصاعدي
- زر Ghost "تعرف على الجمعية"

```text
┌─────────────────────────────────────────────────────┐
│                                                     │
│          منهجية علمية.                              │
│          شفافية كاملة.                              │
│          أثر مستدام.                                │
│                                                     │
│   نتبنى نهجاً تنموياً شاملاً يركز على تمكين       │
│   الأفراد والمجتمعات من خلال برامج مدروسة...       │
│                                                     │
│   ╔═══════════╗  ╔═══════════╗  ╔═══════════╗      │
│   ║  50,000   ║  ║    120    ║  ║    15     ║      │
│   ║  مستفيد   ║  ║   مشروع   ║  ║   سنة     ║      │
│   ╚═══════════╝  ╚═══════════╝  ╚═══════════╝      │
│                                                     │
│              [تعرف على الجمعية →]                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 6. قسم مجالات الجمعية (Horizontal Scroll)

عرض أفقي قابل للسحب (6 مجالات):

```text
←  [مجال 1] [مجال 2] [مجال 3] [مجال 4] [مجال 5] [مجال 6]  →
```

كل بطاقة:
- أيقونة SVG كبيرة (64x64)
- عنوان المجال
- وصف سطر واحد
- Hover: lift + border accent subtle

```css
.fields-scroll {
    display: flex;
    gap: 24px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    padding: 20px 0;
}

.field-card {
    flex-shrink: 0;
    width: 280px;
    padding: 32px;
    background: var(--surface);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-light);
    scroll-snap-align: start;
    transition: all 0.3s ease;
}

.field-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
    border-color: rgba(var(--primary-rgb), 0.2);
}
```

---

## 7. قسم المشاريع (Project Index - UN Style)

قائمة رأسية رسمية (3 مشاريع مميزة):

```text
┌─────────────────────────────────────────────────────┐
│ [صورة]  │  التمكين والتدريب                         │
│         │  برنامج تمكين الشباب المهني                │
│         │  برنامج شامل لتأهيل الشباب السعودي...     │
│         │                     [قيد التنفيذ] [→]      │
├─────────────────────────────────────────────────────┤
│ [صورة]  │  الخدمات الإنسانية                         │
│         │  مبادرة إفطار صائم                         │
│         │  توزيع وجبات إفطار على الصائمين...        │
│         │                     [مكتمل] [→]            │
└─────────────────────────────────────────────────────┘

              [عرض جميع المشاريع]
```

---

## 8. قسم الأخبار (Editorial Newsroom)

تخطيط مجلة احترافي:

```text
┌─────────────────────────┬───────────────────────┐
│                         │  10  توقيع اتفاقية   │
│   [صورة خبر رئيسي]      │  مارس شراكة...       │
│                         ├───────────────────────┤
│   15 مارس 2024         │  05  إطلاق مبادرة    │
│   افتتاح المقر الجديد   │  مارس "معاً نبني"    │
│   للجمعية بحضور...      ├───────────────────────┤
│                         │  28  حفل تكريم       │
│                         │  فبراير المتطوعين    │
└─────────────────────────┴───────────────────────┘
```

---

## 9. قسم فريق العمل (Slider أفقي)

سلايدر أفقي للفريق:

```text
←  [عضو 1] [عضو 2] [عضو 3] [عضو 4] [عضو 5]  →
```

كل بطاقة:
- صورة دائرية (placeholder)
- الاسم
- المسمى الوظيفي
- Hover: subtle glow

```css
.team-card {
    text-align: center;
    padding: 24px;
}

.team-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 auto 16px;
    border: 3px solid var(--border-light);
    transition: all 0.3s ease;
}

.team-card:hover .team-avatar {
    border-color: var(--primary);
    box-shadow: 0 0 0 4px var(--primary-soft);
}
```

---

## 10. قسم شركاء النجاح

شبكة شعارات هادئة:

```text
┌─────────────────────────────────────────────────────┐
│                                                     │
│   [logo] [logo] [logo] [logo] [logo] [logo]        │
│                                                     │
│   [logo] [logo] [logo] [logo] [logo] [logo]        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

```css
.partners-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 32px;
    align-items: center;
}

.partner-logo {
    filter: grayscale(100%);
    opacity: 0.5;
    transition: all 0.3s ease;
}

.partner-logo:hover {
    filter: grayscale(0%);
    opacity: 1;
}
```

---

## 11. CTA ختامي + Footer

CTA نظيف:
```text
┌─────────────────────────────────────────────────────┐
│                                                     │
│           كن جزءاً من التغيير                       │
│   انضم إلينا وساهم في بناء مستقبل أفضل لمجتمعنا    │
│                                                     │
│        [انضم معنا]    [تواصل معنا]                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

Footer:
- خلفية داكنة (الاستثناء الوحيد من Light Theme)
- 4 أعمدة: Brand, روابط, دعم, تواصل
- حقوق + رابط ويبيان

---

## 12. Motion & Animations

### Reveals (IntersectionObserver)
```css
.reveal {
    opacity: 0;
    transform: translateY(18px);
    transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal.revealed {
    opacity: 1;
    transform: translateY(0);
}
```

### احترام prefers-reduced-motion
```css
@media (prefers-reduced-motion: reduce) {
    .reveal {
        opacity: 1;
        transform: none;
        transition: none;
    }
    
    .hero-slide img {
        animation: none;
    }
}
```

---

## 13. SVG Placeholders الجديدة

سأنشئ:
- 6 صور Hero (placeholder-hero-1.svg ... 6.svg)
- 6 أيقونات مجالات (field-*.svg)
- 6 صور فريق (team-*.svg)
- شعارات شركاء (partner-logo.svg)

تصميم كل SVG:
- تدرجات هادئة (primary-soft)
- أيقونة مركزية
- pattern نقاط خفيف
- أبعاد مناسبة للاستخدام

---

## 14. Image Prompts (8 صور)

### النسخة العربية:

1. **Hero Slide 1**: مجموعة من المتطوعين السعوديين في نشاط ميداني، ملابس محتشمة، إضاءة طبيعية صباحية، تصوير وثائقي، جودة 4K

2. **Hero Slide 2**: اجتماع مجلس إدارة جمعية سعودية، قاعة اجتماعات حديثة، رجال بثوب أبيض، إضاءة مكتبية ناعمة، تصوير احترافي

3. **Hero Slide 3**: ورشة تدريب للشباب السعودي، قاعة تدريب حديثة، مشاركين متفاعلين، شاشة عرض، إضاءة طبيعية

4. **Hero Slide 4**: توزيع مساعدات غذائية، متطوعون يحملون صناديق، ملابس محتشمة، خلفية مستودع، تصوير وثائقي

5. **Hero Slide 5**: فريق عمل جمعية سعودية في مكتب حديث، تنوع (رجال ونساء محجبات)، بيئة عمل احترافية

6. **Hero Slide 6**: حفل توقيع اتفاقية شراكة، مصافحة رسمية، خلفية شعار جمعية، تصوير رسمي

7. **صورة مشروع**: شباب سعودي في برنامج تدريب مهني، ورشة عمل تقنية، تركيز على التعلم

8. **صورة فعالية**: حفل تكريم متطوعين، مسرح صغير، جوائز، جمهور، إضاءة دافئة

### English Versions:

1. **Hero Slide 1**: Saudi volunteers in outdoor community activity, modest traditional clothing, natural morning light, documentary style, 4K quality

2. **Hero Slide 2**: Saudi nonprofit board meeting, modern meeting room, men in white thobe, soft office lighting, professional photography

3. **Hero Slide 3**: Youth training workshop in Saudi Arabia, modern training hall, engaged participants, presentation screen, natural lighting

4. **Hero Slide 4**: Food aid distribution, volunteers carrying boxes, modest clothing, warehouse background, documentary photography

5. **Hero Slide 5**: Saudi nonprofit team in modern office, diverse group (men and hijabi women), professional work environment

6. **Hero Slide 6**: Partnership agreement signing ceremony, formal handshake, nonprofit logo backdrop, formal photography

7. **Project Image**: Saudi youth in vocational training program, technical workshop, focus on learning, modern equipment

8. **Event Image**: Volunteer appreciation ceremony, small stage, awards, audience, warm lighting

---

## 15. ملخص الملفات

| الملف | الحجم التقريبي | المحتوى |
|-------|---------------|---------|
| `index.html` | ~450 سطر | كل الأقسام مع semantic HTML |
| `css/main.css` | ~900 سطر | Design tokens + Components + Sections |
| `js/main.js` | ~350 سطر | Slider + Reveals + Counters + Navigation |
| SVGs جديدة | 14 ملف | Hero + Fields + Team placeholders |

---

## 16. ترتيب التنفيذ

1. **إنشاء main.css** - Design System + Tokens + Base + Components
2. **إنشاء SVG Placeholders** - Hero + Fields + Team
3. **تحديث index.html** - هيكل كامل مع كل الأقسام
4. **إنشاء main.js** - Slider + Reveals + Interactions
5. **حذف الملفات القديمة** - home-calm.css, home-calm.js (توحيد)

---

## نتيجة متوقعة

صفحة رئيسية:
- Light Theme نظيف (95%)
- سلايدر Hero سينمائي مع 6 صور
- 8 أقسام متكاملة
- Design System موحد
- أداء ممتاز + احترام Accessibility
- جاهزة للصور الحقيقية (استبدال SVGs)
