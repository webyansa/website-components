
# بوابة الجمعية — قالب SaaS

بوابة مستقلة داخل `public/saas/portal/` + صفحتَي دخول وإنشاء حساب داخل `public/saas/` نفسه، بنظام تصميم موحد قائم على Tailwind (CDN) + Flowbite (CDN)، بدون كسر القالب الحالي.

## 1. هيكل الملفات

```text
public/saas/
├── login.html                     ← تسجيل الدخول (خارج البوابة)
├── register-association.html      ← إنشاء حساب جمعية (متعدد الخطوات)
└── portal/
    ├── README.md                  (موجود)
    ├── index.html                 ← لوحة التحكم
    ├── profile.html               ← ملف الجمعية
    ├── requests.html              ← طلباتي
    ├── request-details.html
    ├── projects.html              ← مشاريعي
    ├── project-details.html
    ├── tickets.html               ← تذاكر الدعم
    ├── ticket-details.html
    ├── messages.html              ← المحادثات
    ├── meetings.html              ← الاجتماعات
    ├── subscription.html          ← الاشتراك
    ├── settings.html              ← الإعدادات
    ├── assets/
    │   ├── css/
    │   │   └── portal.css         ← نظام تصميم البوابة (وحيد)
    │   ├── js/
    │   │   ├── portal.js          ← Sidebar/Topbar/Modals/Tabs
    │   │   └── portal-data.js     ← بيانات وهمية للجداول
    │   └── img/                   ← أيقونات/شعارات خاصة بالبوابة
    └── partials/
        └── layout-notes.md        ← توثيق مكونات التخطيط
```

قاعدة صارمة: كل CSS/JS داخل `portal/assets/` لا يُحمَّل خارج البوابة، وصفحات القالب الحالية لا تُعدَّل.

## 2. صفحتا الدخول (خارج البوابة)

**`login.html`** — تقسيم بصري Split:
- يمين (60%): بطاقة نموذج زجاجية بظل ناعم — شعار + عنوان + حقل بريد/جوال + كلمة مرور + تذكّرني + نسيت كلمة المرور + زر دخول + رابط "إنشاء حساب جمعية".
- يسار (40%): لوحة عرض بصرية بتدرّج Navy→Indigo مع شبكة نقاط، ومصغّر Dashboard SVG + 3 مميزات للمنصة.
- متجاوبة: على الجوال تختفي اللوحة اليسرى ويظهر شعار مصغّر.

**`register-association.html`** — Stepper 3 خطوات:
1. بيانات الجمعية (الاسم، النوع، رقم الترخيص، المدينة)
2. بيانات الممثل (الاسم، البريد، الجوال)
3. بيانات الدخول (كلمة المرور + تأكيد + شروط)
- مؤشّر خطوات علوي مع حالات مكتمل/نشط/قادم.
- أزرار "السابق/التالي/إنشاء الحساب".
- Modal الشروط والأحكام (Flowbite modal).

## 3. نظام التصميم — `portal.css`

**Tokens (CSS variables):**
```css
--p-primary:#4F46E5; --p-primary-600:#4338CA;
--p-secondary:#06B6D4; --p-navy:#172554;
--p-bg:#F8FAFC; --p-surface:#FFFFFF;
--p-border:#E2E8F0; --p-text:#0F172A; --p-muted:#64748B;
--p-success:#10B981; --p-warning:#F59E0B;
--p-danger:#EF4444;  --p-info:#0EA5E9;
--p-radius:14px; --p-shadow:0 1px 2px rgba(15,23,42,.04),0 8px 24px -12px rgba(15,23,42,.08);
```

**Component classes (كلاسات موحّدة، لا تكرار):**
- أزرار: `.pbtn` + `.pbtn-primary/secondary/ghost/outline/danger/text`, أحجام `.pbtn-sm/.pbtn-lg`, حالة `.is-loading`, `[disabled]`.
- بطاقات: `.pcard`, `.pcard-header`, `.pcard-body`, `.pcard-footer`, متغيرات `.pcard-stat`, `.pcard-empty`, `.pcard-feature`.
- نماذج: `.pfield`, `.plabel`, `.pinput`, `.pselect`, `.ptextarea`, `.pcheck`, `.pradio`, `.ptoggle`, `.pfile`, حالات `.is-invalid/.is-valid`, `.pfield-hint`, `.pfield-error`. focus ring موحّد (indigo 2px).
- جداول: `.ptable` + `.ptable-wrap`, `.ptable-toolbar`, `.ptable-empty`, `.ppagination`.
- شارات الحالة: `.pbadge` + `.pbadge-new/review/active/done/rejected/late/open/closed`.
- Modals: `.pmodal-overlay`, `.pmodal`, `.pmodal-header/body/footer`, `.pmodal-close`, أحجام `sm/lg`.
- تنقّل: `.psidebar`, `.psidebar-item` (+ `.is-active`), `.ptopbar`, `.ppage-header`, `.pbreadcrumb`.
- Utilities: `.pmuted`, `.pdivider`, `.pchip`, `.pkbd`.

**قاعدة:** الصفحات تستخدم هذه الكلاسات + Tailwind للـ layout فقط. ممنوع إعادة تعريف ألوان/ظلال في صفحة مفردة.

## 4. تخطيط البوابة (Shell موحد)

كل صفحة داخلية تستعمل نفس الهيكل:
```text
┌─ ptopbar (H: 64px) ─ عنوان الصفحة | بحث | إشعارات | رسائل | مساعدة | مستخدم ─┐
├─ psidebar (W: 260px, RTL: يمين) ─┬────── content (max-w-7xl, p-6) ─────────┤
│  • لوحة التحكم                    │                                          │
│  • ملف الجمعية                    │   ppage-header (عنوان + وصف + إجراءات)  │
│  • طلباتي                         │                                          │
│  • مشاريعي                        │   محتوى الصفحة                          │
│  • تذاكر الدعم                    │                                          │
│  • المحادثات                      │                                          │
│  • الاجتماعات                     │                                          │
│  • الاشتراك                       │                                          │
│  • الإعدادات                      │                                          │
│  ─── تسجيل الخروج                 │                                          │
└──────────────────────────────────┴──────────────────────────────────────────┘
```
- Sidebar قابل للطيّ على الشاشات المتوسطة، Drawer على الجوال (Flowbite drawer).
- `portal.js` يحقن Sidebar/Topbar عبر `data-portal-shell` + يضبط `is-active` من `data-page`.

## 5. محتوى الصفحات (باختصار)

- **index.html**: ترحيب + 6 stat cards + نشاط أخير (timeline) + إجراءات سريعة + اجتماعات قادمة + بطاقة اشتراك.
- **profile.html**: بطاقة رأس بشعار الجمعية + حالة + tabs (بيانات أساسية/تواصل/ممثل/وثائق) + زر تعديل يفتح modal.
- **requests.html**: 4 stat cards + toolbar (بحث/فلتر حالة/زر طلب جديد) + `ptable` + pagination. `request-details.html` بتخطيط رأس + timeline + مرفقات.
- **projects.html**: تبديل بين grid بطاقات وجدول (tabs). كل بطاقة: اسم/مرحلة/شريط تقدّم/تواريخ. `project-details.html` مبسّط.
- **tickets.html**: زر "فتح تذكرة" (modal) + جدول تذاكر. `ticket-details.html` رأس + سلسلة ردود.
- **messages.html**: تخطيط 3 أعمدة (قائمة/محادثة/معلومات) بارتفاع كامل.
- **meetings.html**: Tabs (قادمة/سابقة) + بطاقات اجتماعات + زر "طلب اجتماع" (modal).
- **subscription.html**: بطاقة باقة حالية + مؤشر مدة + جدول فواتير + بطاقة تنبيهات.
- **settings.html**: Tabs (الحساب/كلمة المرور/الإشعارات/التفضيلات).

## 6. المكتبات

- Tailwind CSS عبر CDN (RTL): `cdn.tailwindcss.com` مع `dir="rtl"` وخط Tajawal (متسق مع القالب).
- Flowbite CDN JS+CSS للـ drawer/modal/dropdown/tabs/tooltip فقط — بدون تعديل الأنماط الأساسية.
- FontAwesome (كما في القالب) للأيقونات.

## 7. جودة وقبول

- بدون console errors، RTL سليم، متجاوب على 320/768/1024/1440.
- لا شكل ثانٍ لأي مكوّن موحّد (زر/جدول/بطاقة/نموذج/modal).
- `portal.css` و`portal.js` هما الملفان الوحيدان (+`portal-data.js` للبيانات).
- لا تعديل على أي ملف خارج `public/saas/portal/` باستثناء `login.html` و`register-association.html` الجديدَين وتحديث `manifest.json` و`TEMPLATE-NOTES.md` لسرد الصفحات الجديدة.

## تفاصيل تقنية موجزة

- Bundle CSS واحد `portal.css` (~600–800 سطر) يحتوي الـ tokens والمكوّنات الموحّدة.
- `portal.js` (~200 سطر): shell injection, active link, sidebar toggle, generic modal open/close، فتح Drawer، فورم steppers للتسجيل.
- `portal-data.js`: JSON بسيط لملء الجداول/الكروت لأغراض العرض.
- روابط الخروج تعود إلى `../login.html`.

هل أبدأ التنفيذ؟
