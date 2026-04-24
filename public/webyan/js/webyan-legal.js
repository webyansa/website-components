// Webyan — Legal pages (TOC scroll-spy + active highlight)
(function () {
  const articles = document.querySelectorAll('.legal-content article[id]');
  const tocLinks = document.querySelectorAll('.legal-toc a[href^="#"]');
  if (!articles.length || !tocLinks.length) return;

  const linkMap = new Map();
  tocLinks.forEach(a => {
    const id = a.getAttribute('href').slice(1);
    linkMap.set(id, a);
  });

  const setActive = (id) => {
    tocLinks.forEach(a => a.classList.remove('active'));
    articles.forEach(a => a.classList.remove('is-active'));
    const link = linkMap.get(id);
    const article = document.getElementById(id);
    if (link) link.classList.add('active');
    if (article) {
      article.classList.add('is-active');
      setTimeout(() => article.classList.remove('is-active'), 1200);
    }
  };

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) {
      const id = visible.target.id;
      tocLinks.forEach(a => a.classList.remove('active'));
      const link = linkMap.get(id);
      if (link) link.classList.add('active');
    }
  }, { rootMargin: '-110px 0px -65% 0px', threshold: [0, .2, .6, 1] });

  articles.forEach(a => observer.observe(a));

  tocLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      setActive(id);
    });
  });
})();
