type QuickLink = {
  name: string;
  path: string; // path relative to BASE_URL
};

const htmlPages: QuickLink[] = [
  { name: "الصفحة الرئيسية", path: "home.html" },
  { name: "الصفحة الرئيسية الجديدة", path: "home-new.html" },
  { name: "قسم الأنشطة", path: "activities-section.html" },
  { name: "حجز المواعيد", path: "appointment-booking.html" },
  { name: "متجر الجمعية", path: "association-store.html" },
  { name: "تفاصيل الفرع", path: "branch-details.html" },
  { name: "قسم الفروع", path: "branches-section.html" },
  { name: "تفاصيل العلامة التجارية", path: "brand-details.html" },
  { name: "قسم العلامات التجارية", path: "brands-section.html" },
  { name: "الوظائف", path: "careers.html" },
  { name: "سلة التسوق", path: "cart.html" },
  { name: "قسم المجلس", path: "council-section.html" },
  { name: "إحصائيات المجلس", path: "council-statistics.html" },
  { name: "فرص التطوير", path: "development-opportunities.html" },
  { name: "بوابة التبرعات", path: "donations-gate.html" },
  { name: "تفاصيل الفعالية", path: "event-details.html" },
  { name: "الفعاليات", path: "events.html" },
  { name: "الميسرون", path: "facilitators.html" },
  { name: "الخريطة التفاعلية", path: "interactive-map.html" },
  { name: "بطل جدارة", path: "jadarah-hero.html" },
  { name: "قسم العضوية", path: "membership-section.html" },
  { name: "تفاصيل المشروع الصغير", path: "mini-project-details.html" },
  { name: "الدفع", path: "payment.html" },
  { name: "نجاح الدفع", path: "payment-success.html" },
  { name: "تفاصيل المشروع", path: "project-details.html" },
  { name: "تفاصيل المشروع v2", path: "project-details-v2.html" },
  { name: "تفاصيل تبرع المشروع", path: "project-donation-details.html" },
  { name: "قسم المشاريع", path: "projects-section.html" },
  { name: "قسم الأدوار", path: "roles-section.html" },
  { name: "قسم الخدمات", path: "services-section.html" },
  { name: "قسم الإحصائيات", path: "statistics-section.html" },
  { name: "الصفحة الرئيسية للمتجر", path: "store-home.html" },
];

const emailTemplates: QuickLink[] = [
  { name: "قالب البريد الإلكتروني", path: "email-template.html" },
  { name: "تفعيل الحساب", path: "account-activation-email-template.html" },
  { name: "رد الاتصال", path: "contact-reply-email-template.html" },
  { name: "تسجيل الفعالية", path: "event-registration-email-template.html" },
  { name: "طلب الوظيفة", path: "job-application-email-template.html" },
  { name: "رمز OTP", path: "otp-email-template.html" },
  { name: "تغيير كلمة المرور", path: "password-changed-email-template.html" },
  { name: "إعادة تعيين كلمة المرور", path: "password-reset-email-template.html" },
];

const toHref = (path: string) => `${import.meta.env.BASE_URL}${path}`;

const Home = () => {
  return (
    <div dir="rtl" className="min-vh-100 bg-light">
      <header className="py-5 border-bottom bg-white">
        <div className="container">
          <h1 className="h3 fw-bold mb-2">روابط صفحات المشروع (HTML)</h1>
          <p className="text-muted mb-0">
            افتح صفحات مجلد public بسرعة (متوافق مع GitHub Pages).
          </p>
        </div>
      </header>

      <main className="container py-4">
        <section className="mb-5">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2 className="h5 fw-bold mb-0">الصفحات ({htmlPages.length})</h2>
            <span className="badge text-bg-primary">public/*.html</span>
          </div>
          <div className="row g-3">
            {htmlPages.map((page) => (
              <div key={page.path} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                <a
                  href={toHref(page.path)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none"
                >
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <div className="fw-semibold text-dark">{page.name}</div>
                      <div className="small text-muted mt-1">/{page.path}</div>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2 className="h5 fw-bold mb-0">قوالب البريد ({emailTemplates.length})</h2>
            <span className="badge text-bg-secondary">public/*template*.html</span>
          </div>
          <div className="row g-3">
            {emailTemplates.map((tpl) => (
              <div key={tpl.path} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                <a
                  href={toHref(tpl.path)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none"
                >
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <div className="fw-semibold text-dark">{tpl.name}</div>
                      <div className="small text-muted mt-1">/{tpl.path}</div>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="py-4 text-center text-muted small border-top bg-white">
        © 2024 جميع الحقوق محفوظة
      </footer>
    </div>
  );
};

export default Home;
