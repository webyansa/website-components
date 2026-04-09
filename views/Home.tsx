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

// Templates data structure
type Template = {
  id: string;
  name: string;
  description: string;
  previewPath: string;
  folderPath: string;
  thumbnail: string;
  features: string[];
  pages: number;
  isNew?: boolean;
};

const templates: Template[] = [
  {
    id: "one-page",
    name: "قالب صفحة واحدة — الجمعيات",
    description: "قالب احترافي لصفحة واحدة يعرض جميع أقسام الجمعية بشكل انسيابي — يدعم العربية والإنجليزية والوضع الداكن",
    previewPath: "one-page/index.html",
    folderPath: "one-page",
    thumbnail: "images/main-logo.svg",
    features: ["صفحة واحدة", "عربي + إنجليزي", "وضع داكن", "10 أقسام"],
    pages: 2,
    isNew: true,
  },
  {
    id: "theme-1",
    name: "قالب الجمعية الأول",
    description: "قالب احترافي متكامل للجمعيات الخيرية والمنظمات غير الربحية يدعم العربية RTL بتصميم عصري",
    previewPath: "theme-1/index.html",
    folderPath: "theme-1",
    thumbnail: "theme-1/assets/img/logo.svg",
    features: ["7 صفحات رئيسية", "5 بوسترات جاهزة", "تصميم متجاوب", "دعم RTL"],
    pages: 12,
    isNew: true,
  },
  {
    id: "webyan",
    name: "موقع ويبيان",
    description: "قالب موقع ويبيان الرسمي — صفحة اشتراكات احترافية مع بوابة دفع وتجربة مستخدم سلسة",
    previewPath: "webyan/checkout.html",
    folderPath: "webyan",
    thumbnail: "images/raneen/webyan-logo.svg",
    features: ["صفحة اشتراك", "بوابة دفع", "تصميم احترافي", "متجاوب"],
    pages: 1,
    isNew: true,
  },
];

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
      { name: "من نحن", path: "webyan-about.html", date: "2025-02-03", cssFiles: ["css/styles.css"], isNew: true, isImportant: true },
      { name: "قسم الأنشطة", path: "activities-section.html", date: "2024-03-10", cssFiles: ["css/style.css"] },
      { name: "قسم الفروع", path: "branches-section.html", date: "2024-02-20", cssFiles: ["css/style.css"] },
      { name: "تفاصيل الفرع", path: "branch-details.html", date: "2024-02-22", cssFiles: ["css/style.css"] },
      { name: "قسم العلامات التجارية", path: "brands-section.html", date: "2024-04-05", cssFiles: ["css/style.css"] },
      { name: "تفاصيل العلامة التجارية", path: "brand-details.html", date: "2024-04-06", cssFiles: ["css/style.css"] },
      { name: "قسم المجلس", path: "council-section.html", date: "2024-05-12", cssFiles: ["css/style.css"] },
      { name: "نبذة عن المجلس", path: "council-about.html", date: "2024-12-26", cssFiles: ["css/council-about.css"], isNew: true, isImportant: true },
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
      { name: "خدمات جدارة", path: "jadarah-services.html", date: "2024-12-25", cssFiles: ["css/jadarah-services.css"], isNew: true, isImportant: true },
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
  {
    title: "صفحات موقع رنين",
    icon: "🤝",
    pages: [
      { name: "الصفحة الرئيسية لرنين", path: "raneen-index.html", date: "2024-12-27", cssFiles: ["css/raneen-style.css"], isNew: true, isImportant: true },
      { name: "فريق عمل رنين", path: "raneen-team.html", date: "2024-12-27", cssFiles: ["css/raneen-team.css"], isNew: true, isImportant: true },
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

  // Extract image URLs from HTML content
  const extractImageUrls = (html: string): string[] => {
    const images: string[] = [];
    
    // Match src attributes in img tags
    const imgSrcRegex = /<img[^>]+src=["']([^"']+)["']/gi;
    let match;
    while ((match = imgSrcRegex.exec(html)) !== null) {
      if (match[1] && !match[1].startsWith('http') && !match[1].startsWith('data:')) {
        images.push(match[1]);
      }
    }
    
    // Match background-image in inline styles
    const bgImageRegex = /background-image:\s*url\(["']?([^"')]+)["']?\)/gi;
    while ((match = bgImageRegex.exec(html)) !== null) {
      if (match[1] && !match[1].startsWith('http') && !match[1].startsWith('data:')) {
        images.push(match[1]);
      }
    }
    
    // Match url() in style attributes
    const urlRegex = /url\(["']?([^"')]+\.(?:png|jpg|jpeg|gif|svg|webp))["']?\)/gi;
    while ((match = urlRegex.exec(html)) !== null) {
      if (match[1] && !match[1].startsWith('http') && !match[1].startsWith('data:')) {
        images.push(match[1]);
      }
    }
    
    // Remove duplicates and normalize paths
    return [...new Set(images.map(img => img.replace(/^\.?\//, '')))];
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDownloading(true);

    try {
      const zip = new JSZip();
      const htmlResponse = await fetch(href);
      const htmlContent = await htmlResponse.text();
      zip.file(page.path, htmlContent);

      // Download CSS files
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

      // Extract and download images from HTML
      const imageUrls = extractImageUrls(htmlContent);
      if (imageUrls.length > 0) {
        const imagesFolder = zip.folder("images");
        for (const imageUrl of imageUrls) {
          try {
            const imagePath = imageUrl.startsWith('images/') ? imageUrl : `images/${imageUrl.split('/').pop()}`;
            const fetchUrl = toHref(imageUrl);
            const imageResponse = await fetch(fetchUrl);
            if (imageResponse.ok) {
              const imageBlob = await imageResponse.blob();
              const fileName = imageUrl.split("/").pop() || imageUrl;
              imagesFolder?.file(fileName, imageBlob);
            }
          } catch (err) {
            console.warn(`Could not fetch image ${imageUrl}:`, err);
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

// Template Card Component
const TemplateCard = ({ template }: { template: Template }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const previewHref = `${import.meta.env.BASE_URL}${template.previewPath}`;
  const thumbnailHref = `${import.meta.env.BASE_URL}${template.thumbnail}`;

  const handleDownloadTemplate = async () => {
    setIsDownloading(true);
    try {
      const zip = new JSZip();
      const basePath = template.folderPath;
      
      // Template files to download
      let templateFiles: string[] = [];
      
      if (template.id === "one-page") {
        templateFiles = [
          "index.html", "en.html",
          "css/one-page.css", "css/one-page-ltr.css", "css/loader.css",
          "js/loader.js",
          "favicon.svg",
          "images/main-logo.svg",
          "images/raneen/hero-image.jpg",
          "images/raneen/project-1-main.jpg", "images/raneen/project-2-main.jpg",
          "images/raneen/project-3-main.jpg", "images/raneen/project-4-main.jpg",
          "images/raneen/project-5-main.jpg",
          "images/raneen/jadarah-logo.png", "images/raneen/jazeel-logo.png",
          "images/raneen/webyan-logo.svg",
          "images/jadarah-logo.jpg", "images/cooperative-logo.svg", "images/deem-logo.jpg",
          "images/team/member-1.jpg", "images/team/member-2.jpg", "images/team/member-3.jpg",
          "images/team/member-4.jpg", "images/team/member-5.jpg", "images/team/member-6.jpg",
          "images/team/member-7.jpg",
        ];
      } else {
        templateFiles = [
          "index.html", "about.html", "projects.html", "services.html",
          "governance.html", "join.html", "contact.html",
          "css/main.css", "css/components.css", "css/pages.css", "css/rtl.css",
          "js/main.js", "js/components.js",
          "assets/img/logo.svg", "assets/icons/favicon.svg",
          "posters/poster-1-impact.html", "posters/poster-2-project.html",
          "posters/poster-3-governance.html", "posters/poster-4-volunteer.html",
          "posters/poster-5-partners.html",
        ];
      }

      for (const file of templateFiles) {
        try {
          const response = await fetch(`${import.meta.env.BASE_URL}${basePath}/${file}`);
          if (response.ok) {
            const isImage = /\.(jpg|jpeg|png|gif|svg|webp|ico)$/i.test(file);
            if (isImage && !file.endsWith('.svg')) {
              const blob = await response.blob();
              zip.file(file, blob);
            } else {
              const content = await response.text();
              zip.file(file, content);
            }
          }
        } catch (err) {
          console.warn(`Could not fetch ${file}:`, err);
        }
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${template.id}.zip`);
    } catch (err) {
      console.error("Download failed:", err);
      alert("حدث خطأ أثناء التحميل");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="col-12 col-md-6 col-lg-4">
      <div
        className="card h-100 border-0 overflow-hidden position-relative"
        style={{
          borderRadius: "16px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          transition: "all 0.3s ease",
          background: "#fff",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-8px)";
          e.currentTarget.style.boxShadow = "0 12px 40px rgba(13, 148, 136, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.08)";
        }}
      >
        {/* Template Preview Image */}
        <div
          style={{
            height: "180px",
            background: "linear-gradient(135deg, #0d9488 0%, #24c2ec 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <img
            src={thumbnailHref}
            alt={template.name}
            style={{
              height: "80px",
              width: "auto",
              filter: "brightness(0) invert(1)",
              opacity: 0.9,
            }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          {template.isNew && (
            <span
              className="badge position-absolute"
              style={{
                top: "12px",
                left: "12px",
                background: "#22c55e",
                color: "#fff",
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "0.7rem",
                fontWeight: 600,
              }}
            >
              جديد ✨
            </span>
          )}
        </div>

        <div className="card-body p-4">
          {/* Template Name */}
          <h5
            className="card-title mb-2"
            style={{
              color: "#1e293b",
              fontWeight: 700,
              fontSize: "1.1rem",
            }}
          >
            {template.name}
          </h5>

          {/* Description */}
          <p
            style={{
              color: "#64748b",
              fontSize: "0.85rem",
              lineHeight: 1.6,
              marginBottom: "1rem",
            }}
          >
            {template.description}
          </p>

          {/* Features Tags */}
          <div className="d-flex flex-wrap gap-2 mb-3">
            {template.features.map((feature, idx) => (
              <span
                key={idx}
                style={{
                  background: "#f0fdfa",
                  color: "#0d9488",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  border: "1px solid #99f6e4",
                }}
              >
                {feature}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div
            className="d-flex align-items-center gap-3 mb-3 pb-3"
            style={{ borderBottom: "1px solid #e2e8f0" }}
          >
            <span
              className="d-flex align-items-center gap-1"
              style={{ color: "#64748b", fontSize: "0.8rem" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5z"/>
              </svg>
              {template.pages} صفحة
            </span>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-2">
            <a
              href={previewHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn flex-grow-1 d-flex align-items-center justify-content-center gap-2"
              style={{
                background: "linear-gradient(135deg, #0d9488 0%, #24c2ec 100%)",
                color: "#fff",
                borderRadius: "10px",
                fontSize: "0.85rem",
                padding: "10px 16px",
                border: "none",
                fontWeight: 600,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
              </svg>
              معاينة القالب
            </a>
            <button
              onClick={handleDownloadTemplate}
              disabled={isDownloading}
              className="btn d-flex align-items-center justify-content-center gap-2"
              style={{
                background: "#f0fdfa",
                color: "#0d9488",
                borderRadius: "10px",
                fontSize: "0.85rem",
                padding: "10px 16px",
                border: "1px solid #99f6e4",
                fontWeight: 600,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#0d9488";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#f0fdfa";
                e.currentTarget.style.color = "#0d9488";
              }}
            >
              {isDownloading ? (
                <span className="spinner-border spinner-border-sm" role="status" style={{ width: "14px", height: "14px" }} />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                </svg>
              )}
              تحميل
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
      {/* Professional Hero Section - Webyan Cyan Colors */}
      <header
        style={{
          background: "linear-gradient(135deg, #0d9488 0%, #24c2ec 50%, #38bdf8 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle Pattern Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                              radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.08) 0%, transparent 50%)`,
            pointerEvents: "none",
          }}
        />
        
        <div className="container position-relative" style={{ padding: "2.5rem 1rem" }}>
          {/* Top Bar with Logo */}
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center gap-2">
              <img
                src={webyanLogo}
                alt="شعار ويبيان"
                style={{ 
                  height: "36px", 
                  width: "auto",
                  filter: "brightness(0) invert(1)",
                }}
              />
            </div>
            <div 
              className="d-flex align-items-center gap-2"
              style={{
                background: "rgba(255,255,255,0.1)",
                padding: "6px 12px",
                borderRadius: "20px",
                backdropFilter: "blur(10px)",
              }}
            >
              <span style={{ 
                width: "8px", 
                height: "8px", 
                background: "#22c55e", 
                borderRadius: "50%",
                boxShadow: "0 0 8px #22c55e",
              }} />
              <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.75rem" }}>
                {totalPages} صفحة متاحة
              </span>
            </div>
          </div>

          {/* Main Content */}
          <div className="text-center" style={{ maxWidth: "600px", margin: "0 auto" }}>
            <h1 
              style={{ 
                color: "#fff",
                fontSize: "1.75rem",
                fontWeight: 700,
                marginBottom: "0.5rem",
                letterSpacing: "-0.5px",
              }}
            >
              مكتبة مكونات الويب
            </h1>
            <p style={{ 
              color: "rgba(255,255,255,0.6)", 
              fontSize: "0.9rem",
              marginBottom: "1.5rem",
              lineHeight: 1.6,
            }}>
              اكتشف وحمّل صفحات جاهزة للاستخدام في مشاريعك
            </p>

            {/* Search Box */}
            <div
              style={{
                background: "rgba(255,255,255,0.95)",
                borderRadius: "12px",
                padding: "4px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              }}
            >
              <div className="position-relative">
                <span
                  className="position-absolute d-flex align-items-center justify-content-center"
                  style={{
                    right: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                  </svg>
                </span>
                <input
                  type="search"
                  className="form-control border-0"
                  placeholder="اكتب اسم الصفحة أو المسار..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    background: "transparent",
                    padding: "12px 16px",
                    paddingRight: "44px",
                    fontSize: "0.95rem",
                    color: "#1e293b",
                  }}
                />
              </div>
            </div>
            {searchQuery && (
              <div 
                className="text-center mt-3" 
                style={{ 
                  fontSize: "0.8rem", 
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                تم العثور على <strong style={{ color: "#60a5fa" }}>{filteredCount}</strong> صفحة
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Templates Section */}
      <section className="py-5" style={{ background: "#f0fdfa" }}>
        <div className="container">
          {/* Section Header */}
          <div className="text-center mb-5">
            <span
              style={{
                background: "linear-gradient(135deg, #0d9488 0%, #24c2ec 100%)",
                color: "#fff",
                padding: "6px 16px",
                borderRadius: "20px",
                fontSize: "0.8rem",
                fontWeight: 600,
                display: "inline-block",
                marginBottom: "1rem",
              }}
            >
              🎨 قوالب جاهزة
            </span>
            <h2
              style={{
                color: "#1e293b",
                fontSize: "1.75rem",
                fontWeight: 700,
                marginBottom: "0.5rem",
              }}
            >
              قوالب الجمعيات
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.95rem", maxWidth: "500px", margin: "0 auto" }}>
              قوالب احترافية متكاملة للجمعيات والمنظمات غير الربحية جاهزة للتخصيص والاستخدام
            </p>
          </div>

          {/* Templates Grid */}
          <div className="row g-4 justify-content-center">
            {templates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>

          {/* Link to Webyan Templates Page */}
          <div className="text-center mt-5">
            <a
              href={`${import.meta.env.BASE_URL}webyan-templates.html`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn d-inline-flex align-items-center gap-2"
              style={{
                background: "linear-gradient(135deg, #1a73a7 0%, #24c2ec 100%)",
                color: "#fff",
                padding: "14px 32px",
                borderRadius: "14px",
                fontSize: "1rem",
                fontWeight: 700,
                border: "none",
                textDecoration: "none",
                boxShadow: "0 8px 25px rgba(26, 115, 167, 0.25)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 12px 35px rgba(26, 115, 167, 0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(26, 115, 167, 0.25)";
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <rect x="1" y="1" width="14" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="1" y1="5" x2="15" y2="5" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="5" y1="5" x2="5" y2="15" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              استعرض جميع قوالب ويبيان
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

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
                <div 
                  className="d-flex align-items-center gap-3 mb-3 pb-2"
                  style={{
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.1rem",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                  >
                    {category.icon}
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <h2 
                      className="mb-0" 
                      style={{ 
                        color: "#1e293b",
                        fontSize: "1rem",
                        fontWeight: 600,
                        letterSpacing: "-0.3px",
                      }}
                    >
                      {category.title}
                    </h2>
                    <span
                      style={{
                        background: "#f1f5f9",
                        color: "#64748b",
                        padding: "3px 10px",
                        borderRadius: "20px",
                        fontSize: "0.7rem",
                        fontWeight: 500,
                      }}
                    >
                      {category.pages.length} صفحة
                    </span>
                  </div>
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
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          marginTop: "3rem",
        }}
      >
        <div className="container py-4 text-center">
          <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
            <img
              src={webyanLogo}
              alt="ويبيان"
              style={{ 
                height: "28px",
                filter: "brightness(0) invert(1)",
              }}
            />
          </div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", marginBottom: 0 }}>
            © {new Date().getFullYear()} ويبيان - جميع الحقوق محفوظة
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
