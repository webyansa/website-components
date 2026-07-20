# قالب مجالس

قالب مؤسسي مشتق من **قالب سند**، مخصص لمواقع **المجالس واللجان** (المجالس التخصصية، اللجان التنسيقية، المجالس الاستشارية والقطاعية).

## مبادئ الاشتقاق

- نفس بنية الملفات والمجلدات الموجودة في `public/sanad/`.
- نفس أسماء الكلاسات الأساسية في CSS و HTML (`s-header`, `s-section`, `s-hero`, `btn`, `btn-primary`, `s-dcard`, `s-footer`, …).
- التغيير الأساسي بين القالبَين يتم من خلال **قيم متغيرات الألوان** في `assets/css/style.css` وفي بلوك `tailwind.config` المضمن داخل كل صفحة.
- ملفات JavaScript مشتركة مع قالب سند (`assets/js/main.js`, `assets/js/sanad-skeleton.js`)، ولم تُغيّر أسماء الدوال أو الكلاسات.

## ما تم حذفه من قالب سند

أي محتوى مرتبط بالتبرعات أو المتجر أو الدفع، بما في ذلك الصفحات التالية:

- `donations.html`, `donation-details.html`, `donation-receipt.html`
- `store.html`, `cart.html`, `checkout.html`, `order-success.html`
- `product-physical-details.html`, `product-digital-details.html`, `service-product-details.html`, `course-product-details.html`
- جميع صفحات المستفيد `beneficiary-*.html`
- صفحات تسجيل الدخول `customer-login.html`, `donor-login.html`, `register.html`
- `news.html` و `news-details.html` و `service-details.html` (مدمجة في المركز الإعلامي والخدمات)

كذلك أُزيلت من الهيدر والفوتر والشريط العائم جميع الأزرار والنوافذ المرتبطة بالتبرع أو المتجر، واستُبدلت بدعوات للعمل مناسبة للمجالس (تواصل معنا، طلب خدمة، طلب عضوية).

## الصفحات المتاحة

`index.html`, `about.html`, `founding.html`, `strategy.html`, `board.html`, `executive-management.html`, `organization-structure.html`, `registration-certificate.html`, `branches.html`, `committees.html`, `membership.html`, `services.html`, `service-tracking.html`, `contact.html`, `projects.html`, `project-details.html`, `governance.html`, `media-center.html`, `article-details.html`, `events.html`, `event-details.html`, `event-details-online.html`, `careers.html`, `privacy.html`, `terms.html`.

## لوحة الألوان

- كحلي مؤسسي داكن: `#152a5e`
- أزرق مؤسسي للتأكيد (يحلّ محل الأخضر في سند): `#1a6aa3`
- ذهبي خفيف: `#b08530`
- خلفية فاتحة رسمية: `#f6f7fb`
- بطاقات بيضاء وعاجية للحياد المؤسسي.

التعديل يتم عبر القيم فقط، أما أسماء المتغيرات (`--s-navy`, `--s-emerald`, `--color-primary`, …) فبقيت كما هي للحفاظ على التوافق مع كلاسات Tailwind المضمنة (`text-sanad-navy`, `bg-sanad-emerald`, …).

## ملاحظات تشغيلية

- لا توجد روابط مكسورة في الهيدر أو الفوتر؛ تم استبدال كل الروابط المحذوفة بصفحات بديلة موجودة.
- JavaScript عام في `main.js` يتحقق من وجود العناصر قبل التشغيل، لذلك لا تظهر أخطاء Console بسبب حذف عناصر التبرعات أو المتجر.
- جميع النصوص الظاهرة باللغة العربية، والتصميم RTL بالكامل، وبدون استخدام Bootstrap أو أي إطار JavaScript خارجي.
