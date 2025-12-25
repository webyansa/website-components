import { useMemo, useState } from "react";
import webyanLogo from "@/assets/webyan-logo.svg";

type PageLink = {
  name: string;
  path: string;
};

type Category = {
  title: string;
  icon: string;
  pages: PageLink[];
};

const categories: Category[] = [
  {
    title: "الصفحات الرئيسية",
    icon: "🏠",
    pages: [
      { name: "الصفحة الرئيسية", path: "home.html" },
      { name: "الصفحة الرئيسية الجديدة", path: "home-new.html" },
    ],
  },
  {
    title: "الأقسام والمحتوى",
    icon: "📋",
    pages: [
      { name: "قسم الأنشطة", path: "activities-section.html" },
      { name: "قسم الفروع", path: "branches-section.html" },
      { name: "تفاصيل الفرع", path: "branch-details.html" },
      { name: "قسم العلامات التجارية", path: "brands-section.html" },
      { name: "تفاصيل العلامة التجارية", path: "brand-details.html" },
      { name: "قسم المجلس", path: "council-section.html" },
      { name: "إحصائيات المجلس", path: "council-statistics.html" },
      { name: "قسم العضوية", path: "membership-section.html" },
      { name: "قسم الأدوار", path: "roles-section.html" },
      { name: "قسم الخدمات", path: "services-section.html" },
      { name: "قسم الإحصائيات", path: "statistics-section.html" },
      { name: "الخريطة التفاعلية", path: "interactive-map.html" },
    ],
  },
  {
    title: "المشاريع والفعاليات",
    icon: "📁",
    pages: [
      { name: "قسم المشاريع", path: "projects-section.html" },
      { name: "تفاصيل المشروع", path: "project-details.html" },
      { name: "تفاصيل المشروع v2", path: "project-details-v2.html" },
      { name: "تفاصيل المشروع الصغير", path: "mini-project-details.html" },
      { name: "الفعاليات", path: "events.html" },
      { name: "تفاصيل الفعالية", path: "event-details.html" },
      { name: "بطل جدارة", path: "jadarah-hero.html" },
    ],
  },
  {
    title: "التبرعات والتطوع",
    icon: "❤️",
    pages: [
      { name: "بوابة التبرعات", path: "donations-gate.html" },
      { name: "تفاصيل تبرع المشروع", path: "project-donation-details.html" },
      { name: "فرص التطوير", path: "development-opportunities.html" },
      { name: "الميسرون", path: "facilitators.html" },
    ],
  },
  {
    title: "المتجر والدفع",
    icon: "🛒",
    pages: [
      { name: "الصفحة الرئيسية للمتجر", path: "store-home.html" },
      { name: "متجر الجمعية", path: "association-store.html" },
      { name: "سلة التسوق", path: "cart.html" },
      { name: "الدفع", path: "payment.html" },
      { name: "نجاح الدفع", path: "payment-success.html" },
    ],
  },
  {
    title: "الخدمات والتوظيف",
    icon: "💼",
    pages: [
      { name: "حجز المواعيد", path: "appointment-booking.html" },
      { name: "الوظائف", path: "careers.html" },
    ],
  },
  {
    title: "قوالب البريد الإلكتروني",
    icon: "📧",
    pages: [
      { name: "قالب البريد الإلكتروني", path: "email-template.html" },
      { name: "تفعيل الحساب", path: "account-activation-email-template.html" },
      { name: "رد الاتصال", path: "contact-reply-email-template.html" },
      { name: "تسجيل الفعالية", path: "event-registration-email-template.html" },
      { name: "طلب الوظيفة", path: "job-application-email-template.html" },
      { name: "رمز OTP", path: "otp-email-template.html" },
      { name: "تغيير كلمة المرور", path: "password-changed-email-template.html" },
      { name: "إعادة تعيين كلمة المرور", path: "password-reset-email-template.html" },
    ],
  },
];

const toHref = (path: string) => `${import.meta.env.BASE_URL}${path}`;

const Home = () => {
  const totalPages = useMemo(
    () => categories.reduce((acc, cat) => acc + cat.pages.length, 0),
    []
  );

  const [activePage, setActivePage] = useState<PageLink | null>(
    categories[0]?.pages[0] ?? null
  );
  const [isPreviewLoading, setIsPreviewLoading] = useState(true);

  const activeHref = activePage ? toHref(activePage.path) : "";

  return (
    <div dir="rtl" className="min-vh-100 bg-light">
      <header className="bg-white border-bottom">
        <div className="container py-4">
          <div className="row align-items-center g-3">
            <div className="col-12 col-lg-auto text-center text-lg-start">
              <img
                src={webyanLogo}
                alt="شعار ويبيان"
                className="webyan-logo img-fluid"
              />
            </div>
            <div className="col">
              <h1 className="h3 fw-bold mb-1">مكونات صفحات مواقع</h1>
              <p className="text-muted mb-0">
                مجموعة من الصفحات والمكونات الجاهزة للاستخدام في مشاريعك •{" "}
                <span className="fw-semibold">{totalPages} صفحة</span>
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-4">
        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <div className="alert alert-light border mb-4" role="note">
              مرّر الماوس فوق أي رابط لعرض المعاينة على اليمين، واضغط لفتح الصفحة في
              نافذة جديدة.
            </div>

            <div className="d-flex flex-column gap-4">
              {categories.map((category) => (
                <section key={category.title}>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <span aria-hidden="true">{category.icon}</span>
                      <h2 className="h5 fw-bold mb-0">{category.title}</h2>
                    </div>
                    <span className="badge text-bg-secondary">
                      {category.pages.length} صفحة
                    </span>
                  </div>

                  <div className="row g-3">
                    {category.pages.map((page) => {
                      const href = toHref(page.path);
                      const isActive = activePage?.path === page.path;

                      return (
                        <div
                          key={page.path}
                          className="col-12 col-md-6 col-xl-4"
                          onMouseEnter={() => {
                            setActivePage(page);
                            setIsPreviewLoading(true);
                          }}
                        >
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-decoration-none"
                            onFocus={() => {
                              setActivePage(page);
                              setIsPreviewLoading(true);
                            }}
                            aria-label={`فتح ${page.name}`}
                          >
                            <div
                              className={`card h-100 ${
                                isActive ? "border-primary" : ""
                              }`}
                            >
                              <div className="card-body">
                                <div className="fw-semibold text-dark">
                                  {page.name}
                                </div>
                                <div className="small text-muted mt-1">
                                  /{page.path}
                                </div>
                              </div>
                            </div>
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>

          <aside className="col-12 col-lg-4">
            <div className="position-sticky" style={{ top: "1rem" }}>
              <div className="card">
                <div className="card-header bg-white d-flex align-items-center justify-content-between">
                  <div className="fw-semibold">معاينة مصغّرة</div>
                  {activePage && (
                    <a
                      href={activeHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-primary"
                    >
                      فتح
                    </a>
                  )}
                </div>

                <div className="preview-shell">
                  {!activePage ? (
                    <div className="p-4 text-muted">اختر رابطاً لعرض المعاينة.</div>
                  ) : (
                    <>
                      {isPreviewLoading && (
                        <div className="preview-loading" aria-label="جاري التحميل">
                          <div className="spinner-border text-primary" role="status" />
                        </div>
                      )}
                      <iframe
                        key={activePage.path}
                        src={activeHref}
                        title={`معاينة ${activePage.name}`}
                        className="preview-frame"
                        onLoad={() => setIsPreviewLoading(false)}
                        sandbox="allow-same-origin allow-scripts"
                      />
                    </>
                  )}
                </div>

                <div className="card-footer bg-white text-center small text-muted">
                  المعاينة للتصفّح السريع (قد تختلف قليلاً عن العرض الكامل)
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="py-4 text-center text-muted small border-top bg-white">
        © {new Date().getFullYear()} ويبيان - جميع الحقوق محفوظة
      </footer>
    </div>
  );
};

export default Home;
