const htmlPages = [
  { name: "الصفحة الرئيسية", path: "/home.html" },
  { name: "الصفحة الرئيسية الجديدة", path: "/home-new.html" },
  { name: "قسم الأنشطة", path: "/activities-section.html" },
  { name: "حجز المواعيد", path: "/appointment-booking.html" },
  { name: "متجر الجمعية", path: "/association-store.html" },
  { name: "تفاصيل الفرع", path: "/branch-details.html" },
  { name: "قسم الفروع", path: "/branches-section.html" },
  { name: "تفاصيل العلامة التجارية", path: "/brand-details.html" },
  { name: "قسم العلامات التجارية", path: "/brands-section.html" },
  { name: "الوظائف", path: "/careers.html" },
  { name: "سلة التسوق", path: "/cart.html" },
  { name: "قسم المجلس", path: "/council-section.html" },
  { name: "إحصائيات المجلس", path: "/council-statistics.html" },
  { name: "فرص التطوير", path: "/development-opportunities.html" },
  { name: "بوابة التبرعات", path: "/donations-gate.html" },
  { name: "تفاصيل الفعالية", path: "/event-details.html" },
  { name: "الفعاليات", path: "/events.html" },
  { name: "الميسرون", path: "/facilitators.html" },
  { name: "الخريطة التفاعلية", path: "/interactive-map.html" },
  { name: "بطل جدارة", path: "/jadarah-hero.html" },
  { name: "قسم العضوية", path: "/membership-section.html" },
  { name: "تفاصيل المشروع الصغير", path: "/mini-project-details.html" },
  { name: "الدفع", path: "/payment.html" },
  { name: "نجاح الدفع", path: "/payment-success.html" },
  { name: "تفاصيل المشروع", path: "/project-details.html" },
  { name: "تفاصيل المشروع v2", path: "/project-details-v2.html" },
  { name: "تفاصيل تبرع المشروع", path: "/project-donation-details.html" },
  { name: "قسم المشاريع", path: "/projects-section.html" },
  { name: "قسم الأدوار", path: "/roles-section.html" },
  { name: "قسم الخدمات", path: "/services-section.html" },
  { name: "قسم الإحصائيات", path: "/statistics-section.html" },
  { name: "الصفحة الرئيسية للمتجر", path: "/store-home.html" },
];

const emailTemplates = [
  { name: "قالب البريد الإلكتروني", path: "/email-template.html" },
  { name: "تفعيل الحساب", path: "/account-activation-email-template.html" },
  { name: "رد الاتصال", path: "/contact-reply-email-template.html" },
  { name: "تسجيل الفعالية", path: "/event-registration-email-template.html" },
  { name: "طلب الوظيفة", path: "/job-application-email-template.html" },
  { name: "رمز OTP", path: "/otp-email-template.html" },
  { name: "تغيير كلمة المرور", path: "/password-changed-email-template.html" },
  { name: "إعادة تعيين كلمة المرور", path: "/password-reset-email-template.html" },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            مجلس الجمعيات الأهلية
          </h1>
          <p className="text-slate-400 text-lg">دليل صفحات المشروع</p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-emerald-400 border-b border-slate-700 pb-2">
            الصفحات الرئيسية ({htmlPages.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {htmlPages.map((page) => (
              <a
                key={page.path}
                href={page.path}
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-emerald-500 hover:bg-slate-800 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-white font-medium group-hover:text-emerald-400 transition-colors">
                      {page.name}
                    </span>
                    <p className="text-xs text-slate-500 mt-1 truncate max-w-[150px]">{page.path}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6 text-cyan-400 border-b border-slate-700 pb-2">
            قوالب البريد الإلكتروني ({emailTemplates.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {emailTemplates.map((template) => (
              <a
                key={template.path}
                href={template.path}
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-cyan-500 hover:bg-slate-800 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
                    <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                      {template.name}
                    </span>
                    <p className="text-xs text-slate-500 mt-1 truncate max-w-[150px]">{template.path}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        <footer className="mt-16 text-center text-slate-500 text-sm">
          © 2024 جميع الحقوق محفوظة
        </footer>
      </div>
    </div>
  );
};

export default Home;
