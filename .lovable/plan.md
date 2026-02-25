

## خطة تنفيذ نظام ثنائي اللغة (صفحتان منفصلتان + ملف RTL/LTR)

### المفهوم العام

بدلاً من نظام `data-en` الحالي الذي يبدل النصوص ديناميكياً داخل نفس الصفحة، سننشئ نظاماً احترافياً بصفحتين منفصلتين:

```text
public/
├── one-page.html          ← الصفحة العربية (RTL) — الملف الحالي
├── one-page-en.html       ← الصفحة الإنجليزية (LTR) — ملف جديد
├── css/
│   ├── one-page.css       ← الأنماط الأساسية (بدون اتجاه)
│   └── one-page-ltr.css   ← تعديلات LTR فقط (ملف جديد)
```

### الملفات المطلوبة

#### 1. ملف `public/one-page-en.html` (جديد)
- نسخة كاملة من `one-page.html` مع:
  - `<html lang="en" dir="ltr">` بدلاً من `<html lang="ar" dir="rtl">`
  - Bootstrap LTR بدلاً من Bootstrap RTL
  - إضافة `<link>` لملف `one-page-ltr.css` بعد `one-page.css`
  - جميع النصوص مترجمة للإنجليزية
  - خط `Inter` أو `Poppins` بدلاً من `Tajawal`
  - زر اللغة: `AR` يوجه إلى `one-page.html` و `EN` يكون active
  - نفس الصور والأيقونات والهيكل

#### 2. ملف `public/css/one-page-ltr.css` (جديد)
ملف خفيف يحتوي فقط على تعديلات الاتجاه لـ LTR:
- عكس `text-align` من right إلى left
- عكس مواقع العناصر المطلقة (أسهم السلايدر، أيقونات البحث)
- عكس `padding`/`margin` الاتجاهية
- عكس `flex-direction` حيث يلزم
- عكس أيقونات الأسهم (`scaleX(-1)`)
- تعديل الـ hamburger menu (يفتح من اليسار بدل اليمين)
- تعديل timeline dots والخط العمودي
- تعديل ترتيب عناصر الفوتر

#### 3. تعديل `public/one-page.html` (الحالي)
- تحديث زر اللغة: `EN` يوجه إلى `one-page-en.html` بدلاً من تبديل النصوص بـ JS
- إزالة كود JavaScript الخاص بتبديل اللغة (`data-en` swap logic)
- إزالة جميع attributes `data-en` (لم تعد مطلوبة)
- الإبقاء على Dark Mode toggle كما هو (يعمل في كلا الصفحتين)
- حفظ تفضيل اللغة في `localStorage` لتذكرها عند العودة

#### 4. تعديل `public/css/one-page.css` (الحالي)
- التأكد من أن الأنماط الأساسية محايدة الاتجاه قدر الإمكان
- نقل أي أنماط RTL-specific إلى الملف الأساسي (كونه الافتراضي)

### آلية التنقل بين اللغتين

```text
┌──────────────────────────────────┐
│  one-page.html (العربية)         │
│  زر EN → يوجه إلى one-page-en  │
│  localStorage: lang = 'ar'       │
└──────────────────────────────────┘
              ↕
┌──────────────────────────────────┐
│  one-page-en.html (English)      │
│  زر AR → يوجه إلى one-page      │
│  localStorage: lang = 'en'       │
└──────────────────────────────────┘
```

- Dark Mode محفوظ في `localStorage` ويعمل في كلا الصفحتين
- عند فتح الموقع لأول مرة، يتم فحص `localStorage` للغة المحفوظة وتوجيه المستخدم تلقائياً

### محتوى الصفحة الإنجليزية (ترجمة الأقسام)

| القسم | العربي | الإنجليزي |
|-------|--------|-----------|
| Hero | نبني المجتمع معًا | Building Community Together |
| About | عن الجمعية | About Us |
| Values | القيم | Our Values |
| Goals | الأهداف | Our Goals |
| Enablers | الممكنات | Enablers |
| Team | الفريق | Our Team |
| Governance | الحوكمة | Governance |
| Partners | الشركاء | Partners |
| Join Us | انضم معنا | Join Us |
| Contact | اتصل بنا | Contact Us |

### ملاحظات تقنية

- ملف `one-page-ltr.css` سيكون خفيفاً (تقريباً 80-120 سطر) لأنه يحتوي فقط على overrides اتجاهية
- Bootstrap LTR CDN: `bootstrap.min.css` (بدون `.rtl`)
- خط إنجليزي: `Inter` من Google Fonts (حديث ومقروء)
- نفس ملف `one-page.css` مشترك بين الصفحتين — التغيير فقط في ملف LTR الإضافي

