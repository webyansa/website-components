
# خطة تحسين الصفحة الرئيسية - Premium Light Theme 100%

## الوضع الحالي

### المشاكل المكتشفة:
1. **Hero Section يستخدم خلفية داكنة** - السطر 545-550 في `main.css`:
   ```css
   .hero { background: linear-gradient(135deg, #1A1F36 0%, #0F172A 100%); }
   .hero-premium { background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%); }
   ```
   هذا يتعارض مع متطلب Light Theme 100%

2. **Footer يستخدم خلفية سوداء** - السطر 1552:
   ```css
   .footer { background: #0F172A; }
   ```

3. **قسم About تقليدي** - لا يحتوي على تصميم Split Layout مع صور متداخلة

4. **عدم وجود صور Placeholders للـ About** - المطلوب `about-1.jpg` و `about-2.jpg`

5. **الألوان الحالية مختلفة عن المطلوبة**:
   - المطلوب: `--primary: #0F766E`
   - الحالي: `--primary: #0D9488`

---

## نطاق التحسينات

### المحور 1: تصحيح نظام الألوان

**التغييرات في `main.css` (`:root`):**

| المتغير الحالي | القيمة المطلوبة |
|---------------|-----------------|
| `--bg` | `#F7F8FA` |
| `--surface` | `#FFFFFF` |
| `--text` | `#0F172A` |
| `--muted` | `#64748B` |
| `--border` | `#E5E7EB` |
| `--primary` | `#0F766E` |
| `--primary-soft` | `#E6F4F2` |
| `--accent` | `#2563EB` |
| `--accent-soft` | `#EFF6FF` |
| `--shadow` | `0 14px 40px rgba(2, 6, 23, 0.08)` |

**حذف:**
- `--gold` و `--gold-soft` (غير مطلوبين)
- أي إشارة لتدرجات داكنة

---

### المحور 2: إعادة تصميم Hero Section (Light Theme)

**الهيكل الجديد:**

```text
┌───────────────────────────────────────────────────────────────────────┐
│  [صورة سلايدر 1/2/3 - Ken Burns خفيف]                                │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │  [Overlay فاتح: gradient أبيض 30%]                              │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│       منذ 2009                                                        │
│       ══════════════════════                                          │
│       نبني مجتمعاً                                                    │
│       أكثر استدامة                                                    │
│       ══════════════════════                                          │
│       نعمل بمنهجية علمية وشفافية كاملة...                            │
│                                                                       │
│       [استكشف مشاريعنا] [تعرف علينا]                                  │
│                                                                       │
│       ╔════════════╗  ╔════════════╗  ╔════════════╗                 │
│       ║   50,000   ║  ║    120     ║  ║     15     ║                 │
│       ║   مستفيد   ║  ║   مشروع    ║  ║  سنة خبرة  ║                 │
│       ╚════════════╝  ╚════════════╝  ╚════════════╝                 │
│                                                                       │
│          [●] [○] [○]      ← →     01/03                              │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

**التغييرات التقنية:**

1. **Overlay فاتح بدلاً من داكن:**
```css
.hero-overlay {
    background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.85) 0%,
        rgba(247, 248, 250, 0.7) 50%,
        rgba(255, 255, 255, 0.6) 100%
    );
}
```

2. **نصوص داكنة على خلفية فاتحة:**
```css
.hero-title { color: var(--text); }
.hero-subtitle { color: var(--text-secondary); }
.hero-eyebrow { color: var(--primary); background: var(--primary-soft); }
```

3. **KPIs بخلفية زجاجية فاتحة:**
```css
.hero-kpis {
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid var(--border);
    backdrop-filter: blur(20px);
}
```

4. **Controls فاتحة:**
```css
.hero-controls {
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid var(--border);
}
.hero-nav { background: var(--surface); color: var(--text); }
```

---

### المحور 3: إعادة تصميم قسم "نبذة عن الجمعية"

**التصميم الجديد - Split Layout:**

```text
┌───────────────────────────────────────────────────────────────────────┐
│                                                                       │
│  ┌─────────────────────────────┐  ┌─────────────────────────────────┐│
│  │                             │  │  ┌─────────────────────────────┐││
│  │  نبذة عن الجمعية            │  │  │                             │││
│  │                             │  │  │  [صورة كبيرة - about-1]     │││
│  │  جمعية أهلية تعمل على       │  │  │  ┌───────────────┐          │││
│  │  تصميم وتنفيذ مبادرات       │  │  │  │ مبادرات ميدانية │ Badge   │││
│  │  تنموية تخدم المجتمع       │  │  │  └───────────────┘          │││
│  │  بفاعلية وشفافية.          │  │  └─────────────────────────────┘││
│  │                             │  │         ┌───────────────────────┐│
│  │  نركّز على تحويل الاحتياج   │  │         │                       ││
│  │  إلى برامج قابلة للقياس... │  │         │ [صورة صغيرة - about-2] ││
│  │                             │  │         │ ┌───────────────┐     ││
│  │  ┌──────────────────────┐   │  │         │ │حوكمة وشفافية │     ││
│  │  │ الرؤية               │   │  │         │ └───────────────┘     ││
│  │  │ مجتمع مزدهر تُقاس    │   │  │         └───────────────────────┘│
│  │  │ فيه التنمية بالأثر   │   │  └─────────────────────────────────┘│
│  │  └──────────────────────┘   │                                      │
│  │  ┌──────────────────────┐   │                                      │
│  │  │ الرسالة              │   │                                      │
│  │  │ تمكين المجتمع عبر    │   │                                      │
│  │  │ مبادرات تنموية منهجية│   │                                      │
│  │  └──────────────────────┘   │                                      │
│  │                             │                                      │
│  │  [تعرف على المزيد →]        │                                      │
│  │                             │                                      │
│  └─────────────────────────────┘                                      │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

**البنية HTML الجديدة:**

```html
<section id="about" class="section about-section">
    <div class="container">
        <div class="about-grid reveal">
            <!-- Content Column -->
            <div class="about-content">
                <span class="section-eyebrow">من نحن</span>
                <h2 class="section-title">نبذة عن الجمعية</h2>
                <p class="about-text">
                    جمعية أهلية تعمل على تصميم وتنفيذ مبادرات تنموية تخدم المجتمع بفاعلية وشفافية.
                    نركّز على تحويل الاحتياج إلى برامج قابلة للقياس،
                    وبناء شراكات فعّالة،
                    وتوثيق النتائج بما يعزز الثقة ويضمن استدامة الأثر.
                </p>
                
                <div class="about-cards">
                    <div class="about-card">
                        <h4 class="about-card-title">الرؤية</h4>
                        <p class="about-card-text">مجتمع مزدهر تُقاس فيه التنمية بالأثر.</p>
                    </div>
                    <div class="about-card">
                        <h4 class="about-card-title">الرسالة</h4>
                        <p class="about-card-text">تمكين المجتمع عبر مبادرات تنموية منهجية وشراكات فاعلة وشفافية تعكس النتائج.</p>
                    </div>
                </div>
                
                <a href="about.html" class="btn btn-ghost">
                    <span>تعرف على المزيد</span>
                    <svg>...</svg>
                </a>
            </div>
            
            <!-- Images Column -->
            <div class="about-images">
                <div class="about-image-main">
                    <img src="assets/img/placeholders/about-1.jpg" alt="مبادرات ميدانية">
                    <span class="about-badge">مبادرات ميدانية</span>
                </div>
                <div class="about-image-secondary">
                    <img src="assets/img/placeholders/about-2.jpg" alt="حوكمة وشفافية">
                    <span class="about-badge">حوكمة وشفافية</span>
                </div>
            </div>
        </div>
    </div>
</section>
```

**CSS الجديد:**

```css
.about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-3xl);
    align-items: center;
}

.about-images {
    position: relative;
    height: 500px;
}

.about-image-main {
    position: absolute;
    top: 0;
    right: 0;
    width: 85%;
    border-radius: var(--radius-xl);
    overflow: hidden;
    box-shadow: var(--shadow-lg);
}

.about-image-secondary {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 55%;
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-md);
    border: 4px solid var(--surface);
}

.about-badge {
    position: absolute;
    bottom: 16px;
    right: 16px;
    background: rgba(255,255,255,0.9);
    backdrop-filter: blur(10px);
    padding: 8px 16px;
    border-radius: var(--radius-full);
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--primary);
}

.about-cards {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
    margin: var(--space-2xl) 0;
}

.about-card {
    background: var(--bg);
    padding: var(--space-xl);
    border-radius: var(--radius-lg);
    border-right: 4px solid var(--primary);
}
```

---

### المحور 4: تحسين Footer (Light Theme)

**تحويل Footer إلى Light:**

```css
.footer {
    background: var(--bg);
    color: var(--text);
    border-top: 1px solid var(--border);
}

.footer-desc { color: var(--muted); }
.footer-column h4 { color: var(--text); }
.footer-links a { color: var(--text-secondary); }
.social-link { background: var(--surface); border: 1px solid var(--border); color: var(--text); }
.footer-copyright { color: var(--muted); }
```

---

### المحور 5: إنشاء SVG Placeholders جديدة

**ملفات جديدة مطلوبة:**

1. `assets/img/placeholders/about-1.svg` - مبادرة ميدانية
2. `assets/img/placeholders/about-2.svg` - اجتماع/حوكمة

**تصميم SVG نموذجي:**

```xml
<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0F766E;stop-opacity:0.1"/>
      <stop offset="100%" style="stop-color:#E6F4F2;stop-opacity:1"/>
    </linearGradient>
  </defs>
  
  <rect fill="#F7F8FA" width="600" height="400"/>
  <rect fill="url(#grad)" width="600" height="400"/>
  
  <!-- Icon/Illustration -->
  <g transform="translate(250, 150)">
    <!-- People icons for field activity -->
    <circle cx="50" cy="50" r="30" fill="#0F766E" opacity="0.2"/>
    <circle cx="50" cy="35" r="15" fill="#0F766E" opacity="0.3"/>
  </g>
</svg>
```

---

### المحور 6: تحسينات إضافية

**1. تحسين الأزرار:**
- تأكيد 3 أنواع فقط (Primary, Secondary, Ghost)
- حالات focus/active/disabled واضحة

**2. تحسين Ken Burns:**
- تخفيف scale من 1.08 إلى 1.02
- إيقاف تام عند prefers-reduced-motion

**3. تنظيف الكود:**
- إزالة أي إشارات لألوان داكنة
- توحيد جميع الظلال

---

## ملخص الملفات المتأثرة

| الملف | التغيير |
|-------|---------|
| `css/main.css` | تعديل ~300 سطر (ألوان، Hero، About، Footer) |
| `index.html` | تعديل قسم About بالكامل (~50 سطر) |
| `assets/svg/placeholder-about-1.svg` | ملف جديد |
| `assets/svg/placeholder-about-2.svg` | ملف جديد |

---

## Image Generation Prompts (6 صور)

### النسخة العربية:

1. **مبادرة ميدانية:**
   "صورة واقعية وثائقية لمبادرة ميدانية لجمعية سعودية غير ربحية، متطوعون بملابس محتشمة، بيئة مجتمعية حقيقية، إضاءة طبيعية ناعمة، ألوان هادئة، أسلوب تصوير عالمي للمنظمات غير الحكومية."

2. **اجتماع تخطيطي:**
   "صورة احترافية لاجتماع تخطيطي لجمعية سعودية، قاعة حديثة، ملابس محتشمة، أجهزة لابتوب ووثائق، أسلوب مؤسسي بسيط، إضاءة طبيعية."

3. **ورشة تدريب:**
   "صورة ورشة تدريب لجمعية سعودية غير ربحية، مشاركون متنوعون، أجواء مهنية هادئة، أسلوب تصوير عالمي للمنظمات غير الحكومية."

4. **فريق العمل:**
   "صورة جماعية لفريق جمعية سعودية غير ربحية، احترافية ودافئة، ملابس محتشمة، مكتب حديث، إضاءة ناعمة."

5. **نشاط مجتمعي:**
   "نشاط تفاعلي مجتمعي لجمعية سعودية غير ربحية، بيئة واقعية، تصوير وثائقي يركز على الإنسان."

6. **شراكة:**
   "مشهد توقيع اتفاقية شراكة لجمعية سعودية غير ربحية، بيئة احترافية، أجواء هادئة وموثوقة."

### English Version:

1. **Field Initiative:**
   "Realistic documentary photo of a Saudi nonprofit field initiative, modestly dressed volunteers, authentic community setting, soft natural lighting, calm colors, global NGO editorial style."

2. **Planning Meeting:**
   "Professional Saudi nonprofit planning meeting, modern room, modest attire, laptops and documents, minimal corporate style, natural light."

3. **Training Workshop:**
   "Saudi nonprofit training workshop, diverse participants, calm professional atmosphere, global NGO style photography."

4. **Team Portrait:**
   "Saudi nonprofit team portrait, professional yet warm, modest attire, modern office, soft lighting."

5. **Community Activity:**
   "Community engagement activity by a Saudi nonprofit, realistic environment, human-centered documentary photography."

6. **Partnership:**
   "Saudi nonprofit partnership signing or collaboration scene, professional setting, calm and credible atmosphere."

---

## ترتيب التنفيذ

1. **تحديث نظام الألوان** في `:root` بـ `main.css`
2. **تعديل Hero Section** - Overlay فاتح، نصوص داكنة، controls فاتحة
3. **إنشاء SVG Placeholders** للـ About section
4. **تحديث قسم About** في `index.html` - Split Layout جديد
5. **إضافة CSS الجديد** لـ About section
6. **تحويل Footer** إلى Light Theme
7. **تنظيف الكود** من أي ألوان داكنة متبقية
8. **اختبار Reduced Motion** والتأكد من احترامه
