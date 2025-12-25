import webyanLogo from "@/assets/webyan-logo.svg";

type PageLink = {
  name: string;
  path: string;
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
    color: "from-blue-500 to-blue-600",
    pages: [
      { name: "الصفحة الرئيسية", path: "home.html" },
      { name: "الصفحة الرئيسية الجديدة", path: "home-new.html" },
    ],
  },
  {
    title: "الأقسام والمحتوى",
    icon: "📋",
    color: "from-emerald-500 to-emerald-600",
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
    color: "from-violet-500 to-violet-600",
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
    color: "from-rose-500 to-rose-600",
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
    color: "from-amber-500 to-amber-600",
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
    color: "from-cyan-500 to-cyan-600",
    pages: [
      { name: "حجز المواعيد", path: "appointment-booking.html" },
      { name: "الوظائف", path: "careers.html" },
    ],
  },
  {
    title: "قوالب البريد الإلكتروني",
    icon: "📧",
    color: "from-slate-500 to-slate-600",
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
  const totalPages = categories.reduce((acc, cat) => acc + cat.pages.length, 0);

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-4">
            <img src={webyanLogo} alt="Webyan Logo" className="h-12 w-auto" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
            مكونات صفحات مواقع
          </h1>
          <p className="text-slate-500">
            مجموعة من الصفحات والمكونات الجاهزة للاستخدام في مشاريعك •{" "}
            <span className="font-semibold text-slate-700">{totalPages} صفحة</span>
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-10">
          {categories.map((category) => (
            <section key={category.title}>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white text-lg shadow-md`}
                >
                  {category.icon}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    {category.title}
                  </h2>
                  <span className="text-sm text-slate-400">
                    {category.pages.length} صفحة
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {category.pages.map((page) => (
                  <a
                    key={page.path}
                    href={toHref(page.path)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className="font-medium text-slate-700 group-hover:text-slate-900 mb-1">
                      {page.name}
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      /{page.path}
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <img src={webyanLogo} alt="Webyan" className="h-8 mx-auto mb-2 opacity-60" />
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} ويبيان - جميع الحقوق محفوظة
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
