import { useMemo, useState } from "react";
import webyanLogo from "@/assets/webyan-logo.svg";

type PageLink = {
  name: string;
  path: string;
  date: string;
  isNew?: boolean;
  isImportant?: boolean;
};

type Category = {
  title: string;
  icon: string;
  color: string;
  pages: PageLink[];
};

const categories: Category[] = [
  {
    title: "الصفحات الرئيسية",
    icon: "🏠",
    color: "#0d6efd",
    pages: [
      { name: "الصفحة الرئيسية", path: "home.html", date: "2024-01-15" },
      { name: "الصفحة الرئيسية الجديدة", path: "home-new.html", date: "2024-12-20", isNew: true, isImportant: true },
    ],
  },
  {
    title: "الأقسام والمحتوى",
    icon: "📋",
    color: "#198754",
    pages: [
      { name: "قسم الأنشطة", path: "activities-section.html", date: "2024-03-10" },
      { name: "قسم الفروع", path: "branches-section.html", date: "2024-02-20" },
      { name: "تفاصيل الفرع", path: "branch-details.html", date: "2024-02-22" },
      { name: "قسم العلامات التجارية", path: "brands-section.html", date: "2024-04-05" },
      { name: "تفاصيل العلامة التجارية", path: "brand-details.html", date: "2024-04-06" },
      { name: "قسم المجلس", path: "council-section.html", date: "2024-05-12" },
      { name: "إحصائيات المجلس", path: "council-statistics.html", date: "2024-05-15", isImportant: true },
      { name: "قسم العضوية", path: "membership-section.html", date: "2024-06-01" },
      { name: "قسم الأدوار", path: "roles-section.html", date: "2024-06-10" },
      { name: "قسم الخدمات", path: "services-section.html", date: "2024-07-01" },
      { name: "قسم الإحصائيات", path: "statistics-section.html", date: "2024-07-15" },
      { name: "الخريطة التفاعلية", path: "interactive-map.html", date: "2024-12-01", isNew: true },
    ],
  },
  {
    title: "المشاريع والفعاليات",
    icon: "📁",
    color: "#6f42c1",
    pages: [
      { name: "قسم المشاريع", path: "projects-section.html", date: "2024-03-01" },
      { name: "تفاصيل المشروع", path: "project-details.html", date: "2024-03-05" },
      { name: "تفاصيل المشروع v2", path: "project-details-v2.html", date: "2024-11-20", isNew: true },
      { name: "تفاصيل المشروع الصغير", path: "mini-project-details.html", date: "2024-08-10" },
      { name: "الفعاليات", path: "events.html", date: "2024-04-01", isImportant: true },
      { name: "تفاصيل الفعالية", path: "event-details.html", date: "2024-04-02" },
      { name: "بطل جدارة", path: "jadarah-hero.html", date: "2024-09-15", isImportant: true },
    ],
  },
  {
    title: "التبرعات والتطوع",
    icon: "❤️",
    color: "#dc3545",
    pages: [
      { name: "بوابة التبرعات", path: "donations-gate.html", date: "2024-05-01", isImportant: true },
      { name: "تفاصيل تبرع المشروع", path: "project-donation-details.html", date: "2024-05-05" },
      { name: "فرص التطوير", path: "development-opportunities.html", date: "2024-06-20" },
      { name: "الميسرون", path: "facilitators.html", date: "2024-07-10" },
    ],
  },
  {
    title: "المتجر والدفع",
    icon: "🛒",
    color: "#fd7e14",
    pages: [
      { name: "الصفحة الرئيسية للمتجر", path: "store-home.html", date: "2024-08-01", isImportant: true },
      { name: "متجر الجمعية", path: "association-store.html", date: "2024-08-05" },
      { name: "سلة التسوق", path: "cart.html", date: "2024-08-10" },
      { name: "الدفع", path: "payment.html", date: "2024-08-15" },
      { name: "نجاح الدفع", path: "payment-success.html", date: "2024-08-16" },
    ],
  },
  {
    title: "الخدمات والتوظيف",
    icon: "💼",
    color: "#0dcaf0",
    pages: [
      { name: "حجز المواعيد", path: "appointment-booking.html", date: "2024-09-01" },
      { name: "الوظائف", path: "careers.html", date: "2024-09-10", isNew: true },
    ],
  },
  {
    title: "قوالب البريد الإلكتروني",
    icon: "📧",
    color: "#6c757d",
    pages: [
      { name: "قالب البريد الإلكتروني", path: "email-template.html", date: "2024-01-20" },
      { name: "تفعيل الحساب", path: "account-activation-email-template.html", date: "2024-01-21" },
      { name: "رد الاتصال", path: "contact-reply-email-template.html", date: "2024-01-22" },
      { name: "تسجيل الفعالية", path: "event-registration-email-template.html", date: "2024-01-23" },
      { name: "طلب الوظيفة", path: "job-application-email-template.html", date: "2024-01-24" },
      { name: "رمز OTP", path: "otp-email-template.html", date: "2024-01-25" },
      { name: "تغيير كلمة المرور", path: "password-changed-email-template.html", date: "2024-01-26" },
      { name: "إعادة تعيين كلمة المرور", path: "password-reset-email-template.html", date: "2024-01-27" },
    ],
  },
];

const toHref = (path: string) => `${import.meta.env.BASE_URL}${path}`;

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const totalPages = useMemo(
    () => categories.reduce((acc, cat) => acc + cat.pages.length, 0),
    []
  );

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;

    const query = searchQuery.toLowerCase();
    return categories
      .map((cat) => ({
        ...cat,
        pages: cat.pages.filter(
          (page) =>
            page.name.toLowerCase().includes(query) ||
            page.path.toLowerCase().includes(query)
        ),
      }))
      .filter((cat) => cat.pages.length > 0);
  }, [searchQuery]);

  const filteredCount = useMemo(
    () => filteredCategories.reduce((acc, cat) => acc + cat.pages.length, 0),
    [filteredCategories]
  );

  return (
    <div dir="rtl" className="min-vh-100" style={{ background: "#f8fafc" }}>
      {/* Header */}
      <header className="bg-white border-bottom shadow-sm">
        <div className="container py-4">
          <div className="d-flex flex-column flex-md-row align-items-center gap-3">
            <img
              src={webyanLogo}
              alt="شعار ويبيان"
              style={{ height: "48px", width: "auto" }}
            />
            <div className="text-center text-md-start flex-grow-1">
              <h1 className="h4 fw-bold mb-1 text-dark">مكونات صفحات مواقع</h1>
              <p className="text-muted mb-0 small">
                مجموعة من الصفحات والمكونات الجاهزة للاستخدام •{" "}
                <strong>{totalPages} صفحة</strong>
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-white border-bottom">
        <div className="container py-3">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-white border-end-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="text-muted"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                  </svg>
                </span>
                <input
                  type="search"
                  className="form-control border-start-0"
                  placeholder="ابحث عن صفحة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {searchQuery && (
                <div className="text-center mt-2 small text-muted">
                  تم العثور على <strong>{filteredCount}</strong> صفحة
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container py-4">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-5">
            <div className="display-1 mb-3">🔍</div>
            <h3 className="text-muted">لا توجد نتائج</h3>
            <p className="text-muted">جرب البحث بكلمات مختلفة</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-5">
            {filteredCategories.map((category) => (
              <section key={category.title}>
                {/* Category Header */}
                <div
                  className="d-flex align-items-center gap-3 mb-3 pb-2 border-bottom"
                  style={{ borderColor: category.color }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center rounded-3"
                    style={{
                      width: "44px",
                      height: "44px",
                      background: category.color,
                      fontSize: "1.25rem",
                    }}
                  >
                    {category.icon}
                  </div>
                  <div className="flex-grow-1">
                    <h2 className="h5 fw-bold mb-0">{category.title}</h2>
                    <small className="text-muted">
                      {category.pages.length} صفحة
                    </small>
                  </div>
                </div>

                {/* Pages Grid */}
                <div className="row g-3">
                  {category.pages.map((page) => {
                    const href = toHref(page.path);

                    return (
                      <div
                        key={page.path}
                        className="col-12 col-sm-6 col-lg-4 col-xl-3"
                      >
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-none d-block h-100"
                        >
                          <div
                            className="card h-100 border-0 shadow-sm position-relative overflow-hidden"
                            style={{
                              transition: "all 0.2s ease",
                              borderRight: `4px solid ${category.color}`,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "translateY(-4px)";
                              e.currentTarget.style.boxShadow =
                                "0 8px 25px rgba(0,0,0,0.15)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow =
                                "0 0.125rem 0.25rem rgba(0,0,0,0.075)";
                            }}
                          >
                            {/* Badges */}
                            <div className="position-absolute top-0 start-0 p-2 d-flex gap-1">
                              {page.isNew && (
                                <span className="badge bg-success">جديد</span>
                              )}
                              {page.isImportant && (
                                <span className="badge bg-warning text-dark">
                                  ⭐ مهم
                                </span>
                              )}
                            </div>

                            <div className="card-body pt-4">
                              <h6 className="card-title fw-semibold text-dark mb-2">
                                {page.name}
                              </h6>
                              <div className="d-flex flex-column gap-1">
                                <code
                                  className="small"
                                  style={{
                                    color: category.color,
                                    background: "#f1f5f9",
                                    padding: "2px 6px",
                                    borderRadius: "4px",
                                    fontSize: "0.7rem",
                                  }}
                                >
                                  {page.path}
                                </code>
                                <small className="text-muted d-flex align-items-center gap-1">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z" />
                                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                                  </svg>
                                  {formatDate(page.date)}
                                </small>
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
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-top py-4 mt-5">
        <div className="container text-center">
          <img
            src={webyanLogo}
            alt="ويبيان"
            style={{ height: "32px", opacity: 0.6 }}
            className="mb-2"
          />
          <p className="small text-muted mb-0">
            © {new Date().getFullYear()} ويبيان - جميع الحقوق محفوظة
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
