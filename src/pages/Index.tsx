const Index = () => {
  return (
    <>
      {/* شريط التنقل */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#">الشعار</a>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a className="nav-link active" href="#home">الرئيسية</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#services">خدماتنا</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#about">من نحن</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact">اتصل بنا</a>
              </li>
            </ul>
            <a href="#contact" className="btn btn-light btn-custom">ابدأ الآن</a>
          </div>
        </div>
      </nav>

      {/* قسم البطل */}
      <section id="home" className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 animate-fadeInUp">
              <h1>مرحباً بك في موقعنا</h1>
              <p className="lead mb-4">
                نقدم لك أفضل الحلول والخدمات المتميزة التي تلبي احتياجاتك وتساعدك على النجاح
              </p>
              <div className="d-flex gap-3">
                <a href="#services" className="btn btn-light btn-custom btn-lg">اكتشف المزيد</a>
                <a href="#contact" className="btn btn-outline-light btn-custom btn-lg">تواصل معنا</a>
              </div>
            </div>
            <div className="col-lg-6 text-center mt-5 mt-lg-0">
              <img 
                src="https://via.placeholder.com/500x400?text=صورة+توضيحية" 
                alt="صورة توضيحية" 
                className="img-fluid rounded-3 shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* قسم الخدمات */}
      <section id="services" className="section-padding bg-light">
        <div className="container">
          <div className="text-center">
            <h2 className="section-title">خدماتنا</h2>
            <p className="section-subtitle">نقدم مجموعة متنوعة من الخدمات المتميزة</p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card custom-card h-100 p-4 text-center">
                <div className="card-body">
                  <div className="display-4 text-primary mb-3">🚀</div>
                  <h5 className="card-title fw-bold">خدمة سريعة</h5>
                  <p className="card-text text-muted">
                    نقدم خدمات سريعة وفعالة تلبي احتياجاتك في أسرع وقت ممكن
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card custom-card h-100 p-4 text-center">
                <div className="card-body">
                  <div className="display-4 text-primary mb-3">💡</div>
                  <h5 className="card-title fw-bold">حلول إبداعية</h5>
                  <p className="card-text text-muted">
                    نبتكر حلولاً إبداعية ومميزة تناسب متطلباتك الخاصة
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card custom-card h-100 p-4 text-center">
                <div className="card-body">
                  <div className="display-4 text-primary mb-3">🛡️</div>
                  <h5 className="card-title fw-bold">دعم متواصل</h5>
                  <p className="card-text text-muted">
                    فريق دعم متاح على مدار الساعة لمساعدتك في أي وقت
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* قسم من نحن */}
      <section id="about" className="section-padding">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <img 
                src="https://via.placeholder.com/500x350?text=من+نحن" 
                alt="من نحن" 
                className="img-fluid rounded-3 shadow"
              />
            </div>
            <div className="col-lg-6">
              <h2 className="section-title">من نحن</h2>
              <p className="text-muted mb-4">
                نحن فريق من المحترفين المتخصصين في تقديم أفضل الحلول والخدمات. 
                نسعى دائماً لتحقيق رضا عملائنا من خلال الجودة العالية والابتكار المستمر.
              </p>
              <ul className="list-unstyled">
                <li className="mb-2">✅ خبرة تزيد عن 10 سنوات</li>
                <li className="mb-2">✅ فريق عمل محترف</li>
                <li className="mb-2">✅ أكثر من 500 مشروع منجز</li>
                <li className="mb-2">✅ عملاء راضون حول العالم</li>
              </ul>
              <a href="#contact" className="btn btn-primary btn-custom mt-3">تعرف علينا أكثر</a>
            </div>
          </div>
        </div>
      </section>

      {/* قسم التواصل */}
      <section id="contact" className="section-padding bg-light">
        <div className="container">
          <div className="text-center">
            <h2 className="section-title">تواصل معنا</h2>
            <p className="section-subtitle">نحن هنا للإجابة على جميع استفساراتك</p>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card custom-card p-4">
                <div className="card-body">
                  <form>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">الاسم الكامل</label>
                        <input type="text" className="form-control form-control-lg" placeholder="أدخل اسمك" />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">البريد الإلكتروني</label>
                        <input type="email" className="form-control form-control-lg" placeholder="example@email.com" />
                      </div>
                      <div className="col-12">
                        <label className="form-label">الموضوع</label>
                        <input type="text" className="form-control form-control-lg" placeholder="موضوع الرسالة" />
                      </div>
                      <div className="col-12">
                        <label className="form-label">الرسالة</label>
                        <textarea className="form-control" rows={5} placeholder="اكتب رسالتك هنا..."></textarea>
                      </div>
                      <div className="col-12 text-center">
                        <button type="submit" className="btn btn-primary btn-custom btn-lg px-5">
                          إرسال الرسالة
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* الفوتر */}
      <footer className="footer text-center">
        <div className="container">
          <p className="mb-0">© 2024 جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </>
  );
};

export default Index;
