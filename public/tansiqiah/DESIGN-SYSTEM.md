# نظام تصميم قالب سَنَد

توثيق مختصر لنظام التصميم الموحّد. الكلاسات الجديدة (`btn`, `sanad-card`, `sanad-modal` …)
هي الواجهة الرسمية للنظام. الكلاسات القديمة (`s-btn`, `sxq-*`, …) ما زالت تعمل لكنها مهيّأة للاستبدال التدريجي.

> الملف المرجعي: `assets/css/style.css` — قسم *"نظام التصميم الموحّد (Unified Layer)"* في الأسفل.

---

## 1. الألوان (Design Tokens)

كل الألوان متاحة كمتغيرات CSS. عدّل من مكان واحد (`:root`) لتغيير هوية القالب بالكامل.

| المتغير | الاستخدام |
|---|---|
| `--color-primary` | الكحلي الرئيسي (الهيدر، عناوين البطاقات) |
| `--color-primary-dark` | الكحلي الداكن (Hover) |
| `--color-primary-soft` | كحلي متوسط (تدرجات الرأس) |
| `--color-secondary` | الأخضر الرئيسي (أزرار الإجراء، التركيز) |
| `--color-secondary-dark` | الأخضر الداكن (Hover) |
| `--color-secondary-soft` | خلفية خضراء ناعمة |
| `--color-accent` | الذهبي للحالات الخاصة (إهداء، عضوية) |
| `--color-bg` | خلفية الموقع العاجية |
| `--color-surface` | خلفية البطاقات (أبيض) |
| `--color-surface-soft` | خلفية الأقسام الناعمة |
| `--color-border` | حدود ناعمة |
| `--color-text` | لون النص الأساسي |
| `--color-text-muted` | نص ثانوي |
| `--color-success` / `--color-warning` / `--color-danger` | حالات |

**قاعدة التباين:** ممنوع كحلي على كحلي، أو أخضر داكن على خلفية خضراء.
كل بطاقة داخل Modal يجب أن تكون بخلفية فاتحة (`--color-surface`) ونص داكن.

---

## 2. الأزرار

```html
<button class="btn btn-primary"> تبرع الآن </button>      <!-- إجراء أساسي -->
<button class="btn btn-secondary"> عرض التفاصيل </button> <!-- مساند -->
<button class="btn btn-outline"> العودة </button>         <!-- خطي -->
<button class="btn btn-accent"> إهدِ الآن </button>       <!-- حالات خاصة -->
<button class="btn btn-danger"> إلغاء الطلب </button>     <!-- خطر، استخدم بحذر -->
<button class="btn btn-ghost"> رابط ناعم </button>
```

أحجام: `btn-sm`, `btn-lg`, عرض كامل: `btn-block`.
كل الأزرار ترث نفس الارتفاع، نفس Radius، نفس Hover (`translateY(-2px)`)، ونفس حالة `:disabled`.

---

## 3. البطاقات

```html
<article class="sanad-card is-hover">
  <div class="sanad-card-meta"><span class="sanad-badge sanad-badge-secondary">خدمة</span></div>
  <h3 class="sanad-card-title">عنوان البطاقة</h3>
  <p class="sanad-card-text">وصف مختصر…</p>
</article>
```

أنواع: `sanad-card`, `sanad-card-soft`, `sanad-card-featured`, `sanad-card-dark`.
أضف `is-hover` لتفعيل ارتفاع البطاقة عند المرور.

---

## 4. النماذج

```html
<div class="form-group">
  <label class="form-label">الاسم الكامل <span class="req">*</span></label>
  <input class="sanad-input" type="text" required>
  <small class="form-hint">كما هو في الهوية</small>
</div>

<div class="form-group">
  <label class="form-label">المدينة</label>
  <select class="form-select"><option>الرياض</option></select>
</div>

<label class="form-check"><input type="checkbox"> أوافق على الشروط</label>

<div class="form-actions">
  <button class="btn btn-outline">السابق</button>
  <button class="btn btn-primary">التالي</button>
</div>
```

- ارتفاع موحّد، حدود واحدة، Focus بإطار أخضر ناعم.
- استخدم `is-invalid` لإظهار الخطأ + `<div class="form-error">`.

---

## 5. النوافذ المنبثقة (Modals)

```html
<div class="sanad-modal-overlay" id="myModal">
  <div class="sanad-modal">
    <header class="sanad-modal-header">
      <h3><i class="fas fa-heart"></i> عنوان النافذة</h3>
      <button class="sanad-modal-close" data-close>&times;</button>
    </header>
    <div class="sanad-modal-body"> … </div>
    <footer class="sanad-modal-footer">
      <button class="btn btn-outline" data-close>إلغاء</button>
      <button class="btn btn-primary">تأكيد</button>
    </footer>
  </div>
</div>
```

- الخلفية شفافة داكنة + Blur.
- البطاقة الداخلية بيضاء بنص داكن — **لا تستخدم خلفية كحلية داخل Body.**
- الرأس فقط هو ما يحمل التدرج الكحلي/الأخضر.
- مقاسات: `sanad-modal-sm`, `sanad-modal-lg`.

افتح/أغلق:
```js
document.getElementById('myModal').classList.add('is-open');
document.getElementById('myModal').classList.remove('is-open');
```

---

## 6. الشارات

```html
<span class="sanad-badge sanad-badge-primary">موثّق</span>
<span class="sanad-badge sanad-badge-secondary">نشط</span>
<span class="sanad-badge sanad-badge-accent">عاجل</span>
<span class="sanad-badge sanad-badge-success">مكتمل</span>
<span class="sanad-badge sanad-badge-warning">قيد المراجعة</span>
<span class="sanad-badge sanad-badge-danger">منتهي</span>
<span class="sanad-badge sanad-badge-muted">مسودّة</span>
```

---

## 7. الحركات

- العام: `var(--transition)` = `all .25s cubic-bezier(.2,.8,.2,1)`.
- Hover للأزرار/البطاقات: `translateY(-2px/-4px)` + ظل أقوى.
- Modal: `fade + scale`.
- يُحترم `prefers-reduced-motion` تلقائياً.

---

## 8. ملاحظات RTL

- اتجاه الصفحة `<html dir="rtl">`.
- استخدم خصائص منطقية (`padding-inline-start`, `margin-inline-end`) بدل `left/right` عند إضافة CSS جديد.
- الأيقونات السهمية تتعرّض للقلب في RTL — تأكد من معناها.

---

## 9. الأقسام (Sections)

```html
<section class="sanad-section">…</section>
<section class="sanad-section sanad-section-soft">…</section>
<section class="sanad-section sanad-section-dark">…</section>
```

Padding متجاوب: `clamp(3rem, 7vw, 5.5rem)`.

---

## 10. قواعد التباين (إلزامية)

1. نص أبيض ↔ خلفية كحلية/خضراء فقط.
2. نص كحلي ↔ خلفية بيضاء/عاجية/فاتحة فقط.
3. حدود الحقول لا تكون أفتح من `--color-border`.
4. Modal Body دائماً سطح فاتح.
5. أزرار الإجراء الأساسي بأخضر، الكحلي للثانوي.

---

## 11. تعديل الهوية مستقبلاً

كل تغيير في الهوية يبدأ من `:root` في `style.css`.
مثال: لتغيير اللون الأساسي إلى لون جديد:

```css
:root {
  --color-primary: #1a3a5c;        /* فقط هذا السطر */
  --color-secondary: #0a8a55;
}
```

كل الأزرار، البطاقات، النوافذ، والشارات ستتحدّث تلقائيًا.

---

## 12. خريطة الانتقال من القديم → الجديد

| القديم | الجديد |
|---|---|
| `s-btn s-btn-primary` | `btn btn-primary` |
| `s-btn s-btn-navy` | `btn btn-secondary` |
| `s-btn s-btn-outline` | `btn btn-outline` |
| `s-btn s-btn-gold` | `btn btn-accent` |
| `s-modal-overlay` + `s-modal` | `sanad-modal-overlay` + `sanad-modal` |
| `sxq-input` | `sanad-input` |
| `sxq-badge` / `s-tag` | `sanad-badge` |

الترحيل تدريجي — لا تكسر الصفحات الحالية. أي صفحة جديدة يجب أن تستخدم الكلاسات الموحّدة.
