# جائزة الأندية الشبابية — صفحة تعريفية

صفحة مستقلة مصممة للمجلس التخصصي للجمعيات الشبابية، جاهزة للتسليم للمبرمجين لإدماجها في موقع المجلس الحالي.

## المكدس التقني
- **HTML5** + **CSS3**
- **Bootstrap 5 RTL** (عبر CDN)
- **JavaScript خفيف (Vanilla)**
- **Font Awesome 6** (عبر CDN) للأيقونات
- **خط Tajawal** (Google Fonts)

> ⚠️ المشروع **لا يستخدم Tailwind CSS ولا React ولا أي إطار عمل JavaScript**. متوافق تمامًا مع بيئة Bootstrap للمجلس.

## بنية الملفات
```
award/
├── index.html            # الصفحة الرئيسية الكاملة
├── README.md             # هذا الملف
└── assets/
    ├── css/
    │   └── award.css     # نظام التصميم بالكامل
    ├── js/
    │   └── award.js      # التفاعلات (سكرول، ريفيل، هيدر عائم)
    ├── images/           # ضع صور الشباب والأنشطة هنا
    └── icons/            # أيقونات مخصصة (SVG) عند الحاجة
```

## طريقة التشغيل
افتح `index.html` مباشرة في المتصفح، أو انسخ المجلد كاملًا إلى موقع المجلس.

## أماكن التخصيص السريع

| العنصر | المكان |
| --- | --- |
| صور Hero والأقسام | استبدل `https://images.unsplash.com/...` بمسار الصور داخل `assets/images/` |
| رابط "قدّم الآن" | ابحث في `index.html` عن التعليق `<!-- Replace with application form URL -->` |
| رابط "دليل الجائزة" | ابحث عن `<!-- Replace with award guide PDF URL -->` |
| متغيرات الألوان | داخل `assets/css/award.css` تحت `:root` |
| اسم/شعار المجلس | داخل `.award-header__brand` في `index.html` |

## متغيرات الألوان
```css
--award-navy:   #233A77;
--award-blue:   #0B5AA5;
--award-cyan:   #159BC4;
--award-teal:   #008080;
--award-mint:   #64D8C8;
--award-yellow: #FCB705;
--award-coral:  #FD5C3D;
--award-cream:  #FFEDCB;
```

## دمج الصفحة في موقع المجلس
1. انسخ مجلد `award/` كاملًا داخل مجلد الموقع.
2. أضف رابطًا في قائمة الموقع الرئيسية:
   ```html
   <a href="/award/">جائزة الأندية الشبابية</a>
   ```
3. لأن الموقع مبني على Bootstrap 5 أصلًا، لن يحدث أي تعارض. تأكد فقط من عدم تكرار تحميل Bootstrap إن كان محملاً في الطبقة الرئيسية للموقع (يمكن حذف رابط CDN من `<head>` في `index.html`).

## دعم الوصول
- `dir="rtl"` و `lang="ar"` على مستوى `<html>`.
- ترتيب صحيح لعناوين H1/H2/H3.
- Focus states افتراضية محفوظة.
- احترام `prefers-reduced-motion`.
- تباين ألوان مطابق لمعايير WCAG AA.
