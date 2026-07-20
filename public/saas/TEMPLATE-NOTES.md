# قالب SaaS

قالب رقمي مشتق من **قالب مجالس**، مخصص للمنصات الرقمية التي تقدّم خدمات للجمعيات والجهات غير الربحية (فرص المنح، الاستشارات، طلبات الخدمات، البرامج التدريبية، بناء القدرات، الموارد والأدلة، متابعة الطلبات، الشراكات).

## مبادئ الاشتقاق

- نفس بنية الملفات والمجلدات الموجودة في `public/majales/`.
- نفس أسماء الكلاسات الأساسية في CSS و HTML (`s-header`, `s-section`, `s-hero`, `btn`, `btn-primary`, `sx-header`, `sx-footer`, …).
- التغيير الأساسي بين القالبَين يتم من خلال:
  - قيم متغيرات الألوان في `assets/css/style.css` (نفس أسماء المتغيرات: `--s-navy`, `--s-emerald`, `--s-gold`, …).
  - قيم `sanad` في بلوك `tailwind.config` المضمن داخل كل صفحة.
  - محتوى الهيدر والفوتر داخل `assets/js/main.js` (نفس المعرّفات و data-attributes).
- ملفات JavaScript مشتركة مع قالب مجالس (`assets/js/main.js`, `assets/js/sanad-skeleton.js`)، ولم تُغيّر أسماء الدوال أو الكلاسات.

## هوية القالب البصرية

هوية تقنية حديثة تعكس منصة SaaS:

- الأساسي (Navy): `#172554`
- الثانوي (Indigo): `#4F46E5`
- المميّز (Cyan): `#06B6D4`
- الداكن: `#0F172A`
- الخلفية: `#F8FAFC`
- الحدود: `#E2E8F0`
- النص: `#1E293B`

## الصفحات المتاحة

`index.html`, `about.html`, `services.html`, `projects.html` (فرص المنح), `project-details.html`, `events.html` (البرامج والمبادرات), `event-details.html`, `event-details-online.html`, `governance.html` (الموارد), `media-center.html`, `article-details.html`, `membership.html` (الانضمام للمنصة), `service-tracking.html`, `contact.html`, `careers.html`, `branches.html`, `branch-details.html`, `committees.html`, `board.html`, `executive-management.html`, `organization-structure.html`, `founding.html`, `strategy.html`, `registration-certificate.html`, `privacy.html`, `terms.html`.

## مجلد `portal/`

مخصّص لاحقًا لبوابة الجمعية داخل المنصة (Dashboard, Login, طلبات، إشعارات...). لم يُصمَّم في هذه المرحلة، ويحتوي فقط على `README.md` تعريفي.

## معايير التشغيل

- HTML + Tailwind (CDN) + JavaScript فقط، بدون Bootstrap ولا React/Vue/Angular.
- كل النصوص الظاهرة باللغة العربية والتصميم RTL بالكامل.
- لا يحتوي القالب على أي منطق تبرعات/متجر/سلة.
- JavaScript العام في `main.js` يتحقق من وجود العناصر قبل تشغيلها لتفادي أخطاء Console.
