const Home = () => {
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
            <a href="#contact" className="btn btn-light">ابدأ الآن</a>
          </div>
        </div>
      </nav>

      {/* قسم البطل */}
      <section id="home" className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1>مرحباً بك في موقعنا</h1>
              <p className="lead mb-4">
                نقدم لك أفضل الحلول والخدمات المتميزة
              </p>
              <a href="#services" className="btn btn-light btn-lg me-2">اكتشف المزيد</a>
              <a href="#contact" className="btn btn-outline-light btn-lg">تواصل معنا</a>
            </div>
          </div>
        </div>
      </section>

      {/* قسم الخدمات */}
      <section id="services" className="section-padding bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">خدماتنا</h2>
            <p className="text-muted">نقدم مجموعة متنوعة من الخدمات</p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 text-center p-4">
                <div className="card-body">
                  <div className="display-4 text-primary mb-3">🚀</div>
                  <h5 className="card-title">خدمة سريعة</h5>
                  <p className="card-text text-muted">نقدم خدمات سريعة وفعالة</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 text-center p-4">
                <div className="card-body">
                  <div className="display-4 text-primary mb-3">💡</div>
                  <h5 className="card-title">حلول إبداعية</h5>
                  <p className="card-text text-muted">نبتكر حلولاً مميزة</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 text-center p-4">
                <div className="card-body">
                  <div className="display-4 text-primary mb-3">🛡️</div>
                  <h5 className="card-title">دعم متواصل</h5>
                  <p className="card-text text-muted">فريق دعم متاح دائماً</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* قسم التواصل */}
      <section id="contact" className="section-padding">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">تواصل معنا</h2>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <form>
                <div className="mb-3">
                  <input type="text" className="form-control" placeholder="الاسم" />
                </div>
                <div className="mb-3">
                  <input type="email" className="form-control" placeholder="البريد الإلكتروني" />
                </div>
                <div className="mb-3">
                  <textarea className="form-control" rows={4} placeholder="رسالتك"></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-100">إرسال</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* الفوتر */}
      <footer className="bg-dark text-white text-center py-4">
        <p className="mb-0">© 2024 جميع الحقوق محفوظة</p>
      </footer>
    </>
  );
};

export default Home;
