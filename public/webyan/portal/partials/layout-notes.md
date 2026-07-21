# بوابة الجمعية — Portal

بوابة داخلية مستقلة تخدم الجمعيات المشتركة في منصة تمكين (قالب SaaS).

## الهيكل

```
portal/
├── index.html              لوحة التحكم
├── profile.html            ملف الجمعية
├── requests.html           طلباتي
├── request-details.html    تفاصيل الطلب
├── projects.html           مشاريعي
├── project-details.html    تفاصيل المشروع
├── tickets.html            تذاكر الدعم
├── ticket-details.html     تفاصيل التذكرة
├── messages.html           المحادثات
├── meetings.html           الاجتماعات
├── subscription.html       الاشتراك
├── settings.html           الإعدادات
├── assets/
│   ├── css/portal.css      نظام تصميم موحد للبوابة (المصدر الوحيد)
│   ├── js/portal.js        Shell/Sidebar/Topbar/Modals/Tabs/Stepper
│   └── js/portal-data.js   بيانات وهمية للعرض
└── partials/layout-notes.md
```

صفحتا الدخول (`login.html` و `register-association.html`) موجودتان مباشرة داخل `public/saas/` لأنهما قبل الدخول للبوابة.

## نظام التصميم (portal.css)

- كل الألوان والظلال ونصف الأقطار عبر متغيرات CSS في `:root`.
- مكوّنات موحّدة بالبادئة `p`: `.pbtn`, `.pcard`, `.pinput`, `.pselect`, `.ptable`, `.pbadge`, `.pmodal`, `.psidebar`, `.ptopbar`, `.ptabs`, `.pprogress`, `.ptimeline`, ...
- **قاعدة صارمة**: كل صفحة تستخدم هذه الكلاسات فقط. ممنوع إعادة تعريف ألوان/ظلال/أنماط أزرار داخل الصفحة.

## Shell التلقائي

كل صفحة داخلية تلفّ محتواها بـ:
```html
<div data-portal-shell data-page="requests" data-title="طلباتي" data-subtitle="...">
  ... محتوى الصفحة ...
</div>
```
يقوم `portal.js` تلقائياً بحقن Sidebar وTopbar وتفعيل العنصر النشط.
