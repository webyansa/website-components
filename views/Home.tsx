import { useMemo, useState } from "react";
import webyanLogo from "@/assets/webyan-logo.svg";
import JSZip from "jszip";
import { saveAs } from "file-saver";

type PageLink = {
  name: string;
  path: string;
  date: string;
  cssFiles?: string[];
  isNew?: boolean;
  isImportant?: boolean;
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
      { name: "الصفحة الرئيسية", path: "home.html", date: "2024-01-15", cssFiles: ["css/style.css"] },
      { name: "الصفحة الرئيسية الجديدة", path: "home-new.html", date: "2024-12-20", cssFiles: ["css/styles.css"], isNew: true, isImportant: true },
    ],
  },
  {
    title: "الأقسام والمحتوى",
    icon: "📋",
    pages: [
      { name: "قسم الأنشطة", path: "activities-section.html", date: "2024-03-10", cssFiles: ["css/style.css"] },
      { name: "قسم الفروع", path: "branches-section.html", date: "2024-02-20", cssFiles: ["css/style.css"] },
      { name: "تفاصيل الفرع", path: "branch-details.html", date: "2024-02-22", cssFiles: ["css/style.css"] },
      { name: "قسم العلامات التجارية", path: "brands-section.html", date: "2024-04-05", cssFiles: ["css/style.css"] },
      { name: "تفاصيل العلامة التجارية", path: "brand-details.html", date: "2024-04-06", cssFiles: ["css/style.css"] },
      { name: "قسم المجلس", path: "council-section.html", date: "2024-05-12", cssFiles: ["css/style.css"] },
      { name: "إحصائيات المجلس", path: "council-statistics.html", date: "2024-05-15", cssFiles: ["css/council-statistics.css"], isImportant: true },
      { name: "قسم العضوية", path: "membership-section.html", date: "2024-06-01", cssFiles: ["css/style.css"] },
      { name: "قسم الأدوار", path: "roles-section.html", date: "2024-06-10", cssFiles: ["css/style.css"] },
      { name: "قسم الخدمات", path: "services-section.html", date: "2024-07-01", cssFiles: ["css/style.css"] },
      { name: "قسم الإحصائيات", path: "statistics-section.html", date: "2024-07-15", cssFiles: ["css/style.css"] },
      { name: "الخريطة التفاعلية", path: "interactive-map.html", date: "2024-12-01", cssFiles: ["css/style.css"], isNew: true },
    ],
  },
  {
    title: "المشاريع والفعاليات",
    icon: "📁",
    pages: [
      { name: "قسم المشاريع", path: "projects-section.html", date: "2024-03-01", cssFiles: ["css/style.css"] },
      { name: "تفاصيل المشروع", path: "project-details.html", date: "2024-03-05", cssFiles: ["css/style.css"] },
      { name: "تفاصيل المشروع v2", path: "project-details-v2.html", date: "2024-11-20", cssFiles: ["css/project-details-v2.css"], isNew: true },
      { name: "تفاصيل المشروع الصغير", path: "mini-project-details.html", date: "2024-08-10", cssFiles: ["css/mini-project-details.css"] },
      { name: "الفعاليات", path: "events.html", date: "2024-04-01", cssFiles: ["css/events-page.css"], isImportant: true },
      { name: "تفاصيل الفعالية", path: "event-details.html", date: "2024-04-02", cssFiles: ["css/event-details.css"] },
      { name: "بطل جدارة", path: "jadarah-hero.html", date: "2024-09-15", cssFiles: ["css/jadarah-hero-styles.css"], isImportant: true },
    ],
  },
  {
    title: "التبرعات والتطوع",
    icon: "❤️",
    pages: [
      { name: "بوابة التبرعات", path: "donations-gate.html", date: "2024-05-01", cssFiles: ["css/donations.css"], isImportant: true },
      { name: "تفاصيل تبرع المشروع", path: "project-donation-details.html", date: "2024-05-05", cssFiles: ["css/project-donation-details.css"] },
      { name: "فرص التطوير", path: "development-opportunities.html", date: "2024-06-20", cssFiles: ["css/development-opportunities.css"] },
      { name: "الميسرون", path: "facilitators.html", date: "2024-07-10", cssFiles: ["css/facilitators-styles.css"] },
    ],
  },
  {
    title: "المتجر والدفع",
    icon: "🛒",
    pages: [
      { name: "الصفحة الرئيسية للمتجر", path: "store-home.html", date: "2024-08-01", cssFiles: ["css/store.css"], isImportant: true },
      { name: "متجر الجمعية", path: "association-store.html", date: "2024-08-05", cssFiles: ["css/style-store.css"] },
      { name: "سلة التسوق", path: "cart.html", date: "2024-08-10", cssFiles: ["css/style-cart.css"] },
      { name: "الدفع", path: "payment.html", date: "2024-08-15", cssFiles: ["css/payment.css"] },
      { name: "نجاح الدفع", path: "payment-success.html", date: "2024-08-16", cssFiles: ["css/payment-success.css"] },
    ],
  },
  {
    title: "الخدمات والتوظيف",
    icon: "💼",
    pages: [
      { name: "حجز المواعيد", path: "appointment-booking.html", date: "2024-09-01", cssFiles: ["css/style.css"] },
      { name: "الوظائف", path: "careers.html", date: "2024-09-10", cssFiles: ["css/careers.css"], isNew: true },
    ],
  },
  {
    title: "قوالب البريد الإلكتروني",
    icon: "📧",
    pages: [
      { name: "قالب البريد الإلكتروني", path: "email-template.html", date: "2024-01-20", cssFiles: ["css/email-template-styles.css"] },
      { name: "تفعيل الحساب", path: "account-activation-email-template.html", date: "2024-01-21", cssFiles: ["css/email-template-styles.css"] },
      { name: "رد الاتصال", path: "contact-reply-email-template.html", date: "2024-01-22", cssFiles: ["css/email-template-styles.css"] },
      { name: "تسجيل الفعالية", path: "event-registration-email-template.html", date: "2024-01-23", cssFiles: ["css/email-template-styles.css"] },
      { name: "طلب الوظيفة", path: "job-application-email-template.html", date: "2024-01-24", cssFiles: ["css/email-template-styles.css"] },
      { name: "رمز OTP", path: "otp-email-template.html", date: "2024-01-25", cssFiles: ["css/email-template-styles.css"] },
      { name: "تغيير كلمة المرور", path: "password-changed-email-template.html", date: "2024-01-26", cssFiles: ["css/email-template-styles.css"] },
      { name: "إعادة تعيين كلمة المرور", path: "password-reset-email-template.html", date: "2024-01-27", cssFiles: ["css/email-template-styles.css"] },
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

// Modern calm color palette
const theme = {
  primary: "#3b82f6",
  primaryLight: "#eff6ff",
  text: "#1f2937",
  textMuted: "#6b7280",
  border: "#e5e7eb",
  cardBg: "#ffffff",
  pageBg: "#f9fafb",
  success: "#10b981",
  warning: "#f59e0b",
};

const PageCard = ({ page }: { page: PageLink }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const href = toHref(page.path);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDownloading(true);

    try {
      const zip = new JSZip();
      const htmlResponse = await fetch(href);
      const htmlContent = await htmlResponse.text();
      zip.file(page.path, htmlContent);

      if (page.cssFiles && page.cssFiles.length > 0) {
        const cssFolder = zip.folder("css");
        for (const cssFile of page.cssFiles) {
          try {
            const cssResponse = await fetch(toHref(cssFile));
            const cssContent = await cssResponse.text();
            const fileName = cssFile.split("/").pop() || cssFile;
            cssFolder?.file(fileName, cssContent);
          } catch (err) {
            console.warn(`Could not fetch ${cssFile}:`, err);
          }
        }
      }

      const content = await zip.generateAsync({ type: "blob" });
      const fileName = page.path.replace(".html", "") + ".zip";
      saveAs(content, fileName);
    } catch (err) {
      console.error("Download failed:", err);
      alert("حدث خطأ أثناء التحميل");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="col-12 col-sm-6 col-lg-4 col-xl-3">
      <div
        className="card h-100 border position-relative"
        style={{
          transition: "all 0.2s ease",
          background: theme.cardBg,
          borderRadius: "10px",
          borderColor: theme.border,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.08)";
          e.currentTarget.style.borderColor = theme.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.borderColor = theme.border;
        }}
      >
        {/* Badges */}
        {(page.isNew || page.isImportant) && (
          <div className="position-absolute d-flex gap-1" style={{ top: "10px", left: "10px" }}>
            {page.isNew && (
              <span
                className="badge"
                style={{
                  background: theme.success,
                  fontSize: "0.65rem",
                  padding: "3px 7px",
                  borderRadius: "4px",
                  fontWeight: 500,
                }}
              >
                جديد
              </span>
            )}
            {page.isImportant && (
              <span
                className="badge"
                style={{
                  background: theme.warning,
                  fontSize: "0.65rem",
                  padding: "3px 7px",
                  borderRadius: "4px",
                  fontWeight: 500,
                }}
              >
                مهم
              </span>
            )}
          </div>
        )}

        <div className="card-body p-3 d-flex flex-column">
          {/* Title */}
          <h6 
            className="card-title fw-semibold mb-2" 
            style={{ 
              fontSize: "0.9rem", 
              color: theme.text,
              lineHeight: 1.4,
            }}
          >
            {page.name}
          </h6>

          {/* Path */}
          <div
            className="mb-2"
            style={{
              background: theme.pageBg,
              padding: "4px 8px",
              borderRadius: "4px",
              display: "inline-block",
              border: `1px solid ${theme.border}`,
            }}
          >
            <code style={{ fontSize: "0.7rem", color: theme.textMuted }}>
              {page.path}
            </code>
          </div>

          {/* Meta Info */}
          <div className="d-flex align-items-center gap-3 mb-3" style={{ fontSize: "0.7rem", color: theme.textMuted }}>
            <span className="d-flex align-items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="currentColor" viewBox="0 0 16 16">
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
              </svg>
              {formatDate(page.date)}
            </span>
            {page.cssFiles && page.cssFiles.length > 0 && (
              <span className="d-flex align-items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5z"/>
                </svg>
                {page.cssFiles.length} CSS
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-2 mt-auto">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1"
              style={{
                background: theme.primary,
                color: "#fff",
                borderRadius: "6px",
                fontSize: "0.75rem",
                padding: "6px 10px",
                transition: "all 0.2s",
                border: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                <path d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
              </svg>
              معاينة
            </a>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="btn btn-sm d-flex align-items-center justify-content-center"
              style={{
                background: theme.primaryLight,
                color: theme.primary,
                borderRadius: "6px",
                fontSize: "0.75rem",
                padding: "6px 10px",
                border: `1px solid ${theme.primary}20`,
                transition: "all 0.2s",
                minWidth: "38px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = theme.primary;
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = theme.primaryLight;
                e.currentTarget.style.color = theme.primary;
              }}
            >
              {isDownloading ? (
                <span className="spinner-border spinner-border-sm" role="status" style={{ width: "12px", height: "12px" }} />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
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
    <div dir="rtl" className="min-vh-100" style={{ background: theme.pageBg }}>
      {/* Compact Hero with Search */}
      <header
        style={{
          background: "#fff",
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <div className="container py-4">
          {/* Logo & Title Row */}
          <div className="d-flex align-items-center justify-content-center gap-3 mb-4">
            <img
              src={webyanLogo}
              alt="شعار ويبيان"
              style={{ height: "40px", width: "auto" }}
            />
            <div className="text-center">
              <h1 className="h5 fw-bold mb-0" style={{ color: theme.text }}>
                مكونات صفحات مواقع
              </h1>
              <p className="mb-0" style={{ color: theme.textMuted, fontSize: "0.8rem" }}>
                {totalPages} صفحة جاهزة للاستخدام
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-5">
              <p className="text-center mb-2" style={{ color: theme.textMuted, fontSize: "0.85rem" }}>
                ابحث عن الصفحة التي تريدها
              </p>
              <div
                className="position-relative"
                style={{
                  background: theme.pageBg,
                  borderRadius: "8px",
                  border: `1px solid ${theme.border}`,
                }}
              >
                <span
                  className="position-absolute d-flex align-items-center justify-content-center"
                  style={{
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: theme.textMuted,
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                  </svg>
                </span>
                <input
                  type="search"
                  className="form-control border-0"
                  placeholder="اكتب اسم الصفحة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    background: "transparent",
                    padding: "10px 14px",
                    paddingRight: "40px",
                    fontSize: "0.9rem",
                  }}
                />
              </div>
              {searchQuery && (
                <div className="text-center mt-2" style={{ fontSize: "0.8rem", color: theme.textMuted }}>
                  تم العثور على <strong style={{ color: theme.primary }}>{filteredCount}</strong> صفحة
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-4">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-5">
            <div style={{ fontSize: "3rem", marginBottom: "0.5rem", opacity: 0.5 }}>🔍</div>
            <h3 style={{ color: theme.textMuted, fontSize: "1.1rem" }}>لا توجد نتائج</h3>
            <p style={{ color: theme.textMuted, fontSize: "0.85rem" }}>جرب البحث بكلمات مختلفة</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {filteredCategories.map((category) => (
              <section key={category.title}>
                {/* Category Header */}
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span style={{ fontSize: "1.2rem" }}>{category.icon}</span>
                  <h2 className="h6 fw-semibold mb-0" style={{ color: theme.text }}>
                    {category.title}
                  </h2>
                  <span
                    style={{
                      background: theme.primaryLight,
                      color: theme.primary,
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "0.7rem",
                      fontWeight: 500,
                    }}
                  >
                    {category.pages.length}
                  </span>
                </div>

                {/* Pages Grid */}
                <div className="row g-3">
                  {category.pages.map((page) => (
                    <PageCard key={page.path} page={page} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          background: "#fff",
          borderTop: `1px solid ${theme.border}`,
          marginTop: "2rem",
        }}
      >
        <div className="container py-3 text-center">
          <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
            <img
              src={webyanLogo}
              alt="ويبيان"
              style={{ height: "24px" }}
            />
          </div>
          <p style={{ color: theme.textMuted, fontSize: "0.75rem", marginBottom: 0 }}>
            © {new Date().getFullYear()} ويبيان - جميع الحقوق محفوظة
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
