/* قالب سند — السكربت الرئيسي */
(function () {
  'use strict';

  /* قائمة الجوال */
  const menuBtn = document.querySelector('[data-mobile-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const mobileOverlay = document.querySelector('[data-mobile-overlay]');
  const mobileClose = document.querySelector('[data-mobile-close]');
  const open = () => { mobileMenu?.classList.add('open'); mobileOverlay?.classList.add('open'); document.body.style.overflow='hidden'; };
  const close = () => { mobileMenu?.classList.remove('open'); mobileOverlay?.classList.remove('open'); document.body.style.overflow=''; };
  menuBtn?.addEventListener('click', open);
  mobileClose?.addEventListener('click', close);
  mobileOverlay?.addEventListener('click', close);
  document.querySelectorAll('[data-mobile-menu] a').forEach(a => a.addEventListener('click', close));

  /* الهيدر + زر العودة */
  const header = document.querySelector('.s-header');
  const toTop = document.querySelector('.s-to-top');
  const onScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
    if (toTop) toTop.classList.toggle('show', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop?.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

  /* ظهور الأقسام */
  const ro = new IntersectionObserver((es) => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); ro.unobserve(e.target); } });
  }, { threshold: 0.10 });
  document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

  /* عداد الأرقام */
  const co = new IntersectionObserver((es) => {
    es.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.getAttribute('data-counter'));
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1800;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = target * eased;
        const formatted = (target % 1 === 0) ? Math.floor(val).toLocaleString('ar-SA') : val.toFixed(1);
        el.textContent = formatted + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      co.unobserve(el);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-counter]').forEach(c => co.observe(c));

  /* أشرطة التقدم */
  const bo = new IntersectionObserver((es) => {
    es.forEach(entry => {
      if (!entry.isIntersecting) return;
      const v = entry.target.getAttribute('data-progress');
      entry.target.style.width = v + '%';
      bo.unobserve(entry.target);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-progress]').forEach(b => bo.observe(b));

  /* سنة الفوتر */
  const y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();

  /* فلاتر المشاريع */
  const projGrid = document.querySelector('[data-projects-grid]');
  if (projGrid) {
    const state = { field: 'all', status: 'all', group: 'all', q: '' };
    const items = Array.from(projGrid.querySelectorAll('[data-project]'));
    const apply = () => {
      const q = state.q.trim();
      items.forEach(el => {
        const f = el.getAttribute('data-field') || '';
        const s = el.getAttribute('data-status') || '';
        const g = el.getAttribute('data-group') || '';
        const t = (el.getAttribute('data-title') || '').toLowerCase();
        const ok =
          (state.field === 'all' || f.split(',').includes(state.field)) &&
          (state.status === 'all' || s === state.status) &&
          (state.group === 'all' || g.split(',').includes(state.group)) &&
          (!q || t.indexOf(q.toLowerCase()) !== -1);
        el.classList.toggle('is-hidden', !ok);
      });
      const empty = document.querySelector('[data-projects-empty]');
      if (empty) empty.classList.toggle('is-hidden', items.some(i => !i.classList.contains('is-hidden')));
    };
    document.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-filter');
        const val = btn.getAttribute('data-value');
        state[key] = val;
        document.querySelectorAll(`[data-filter="${key}"]`).forEach(b => b.classList.toggle('active', b === btn));
        apply();
      });
    });
    const search = document.querySelector('[data-projects-search]');
    if (search) search.addEventListener('input', e => { state.q = e.target.value; apply(); });
  }
})();

/* =============================================
   بوابة التبرع — donation portal
   ============================================= */
(function(){
  'use strict';

  /* فلترة فئات التبرع */
  const dgrid = document.querySelector('[data-donations-grid]');
  if (dgrid){
    const items = Array.from(dgrid.querySelectorAll('[data-donation]'));
    const filterCat = (cat) => {
      items.forEach(el => {
        const cats = (el.getAttribute('data-cat') || '').split(',');
        el.classList.toggle('is-hidden', cat !== 'all' && !cats.includes(cat));
      });
      const empty = document.querySelector('[data-donations-empty]');
      if (empty) empty.classList.toggle('is-hidden', items.some(i => !i.classList.contains('is-hidden')));
    };
    document.querySelectorAll('[data-dfilter]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-dfilter]').forEach(b => b.classList.toggle('active', b === btn));
        filterCat(btn.getAttribute('data-dfilter'));
      });
    });
  }

  /* اختيار المبلغ داخل البطاقات والصفحة الجانبية */
  document.querySelectorAll('[data-amt-row]').forEach(row => {
    const chips = row.querySelectorAll('.s-amt');
    const custom = row.querySelector('.s-amt-custom');
    const totalEl = row.parentElement.querySelector('[data-total]');
    const setTotal = (v) => { if (totalEl) totalEl.textContent = (Number(v)||0).toLocaleString('ar-SA'); };
    chips.forEach(c => c.addEventListener('click', () => {
      chips.forEach(x => x.classList.remove('active'));
      c.classList.add('active');
      if (custom) custom.value = '';
      setTotal(c.getAttribute('data-value'));
    }));
    if (custom) custom.addEventListener('input', e => {
      chips.forEach(x => x.classList.remove('active'));
      setTotal(e.target.value);
    });
  });

  /* خيارات الكفالة */
  document.querySelectorAll('[data-kafala]').forEach(grp => {
    const opts = grp.querySelectorAll('.o');
    const costEl = grp.parentElement.querySelector('[data-kafala-cost]');
    opts.forEach(o => o.addEventListener('click', () => {
      opts.forEach(x => x.classList.remove('active'));
      o.classList.add('active');
      if (costEl) costEl.textContent = o.getAttribute('data-cost');
    }));
  });

  /* أشرطة التقدم في الهيرو */
  document.querySelectorAll('[data-dprog]').forEach(bar => {
    const v = bar.getAttribute('data-dprog');
    setTimeout(() => bar.style.width = v + '%', 200);
  });

  /* Modals (donor info, privacy, payment, receipt) */
  const openModal = (id) => { const m = document.getElementById(id); if (m){ m.classList.add('open'); document.body.style.overflow = 'hidden'; }};
  const closeModal = (m) => { m.classList.remove('open'); if(!document.querySelector('.s-modal-overlay.open')) document.body.style.overflow=''; };
  document.querySelectorAll('[data-open-modal]').forEach(b => b.addEventListener('click', e => {
    e.preventDefault(); openModal(b.getAttribute('data-open-modal'));
  }));
  document.querySelectorAll('.s-modal-overlay').forEach(o => {
    o.addEventListener('click', e => { if (e.target === o) closeModal(o); });
    o.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => closeModal(o)));
  });

  /* تبرع كفاعل خير → إخفاء الاسم والجوال */
  const anonBox = document.querySelector('[data-anon]');
  if (anonBox){
    const nameF = document.querySelector('[data-donor-name]');
    const phoneF = document.querySelector('[data-donor-phone]');
    const submitBtn = document.querySelector('[data-donor-submit]');
    const notice = document.querySelector('[data-anon-notice]');
    anonBox.addEventListener('change', () => {
      const on = anonBox.checked;
      if (nameF) nameF.style.display = on ? 'none' : '';
      if (phoneF) phoneF.style.display = on ? 'none' : '';
      if (notice) notice.style.display = on ? '' : 'none';
      if (submitBtn) submitBtn.innerHTML = on ? '<i class="fas fa-mask"></i> متابعة كفاعل خير' : '<i class="fas fa-arrow-left"></i> متابعة للدفع';
    });
  }

  /* الانتقال من بيانات المتبرع إلى الدفع */
  const goPay = document.querySelector('[data-go-pay]');
  if (goPay) goPay.addEventListener('click', e => {
    e.preventDefault();
    closeModal(document.getElementById('mDonor'));
    openModal('mPay');
  });

  /* إتمام الدفع → سند التبرع */
  const finishPay = document.querySelector('[data-finish-pay]');
  if (finishPay) finishPay.addEventListener('click', e => {
    e.preventDefault();
    // populate receipt with chosen data
    const anon = document.querySelector('[data-anon]')?.checked;
    const nm = document.querySelector('[data-donor-name] input')?.value;
    const ph = document.querySelector('[data-donor-phone] input')?.value;
    const amt = document.querySelector('[data-total]')?.textContent || '300';
    const rName = document.querySelector('[data-r-name]');
    const rPhone = document.querySelector('[data-r-phone]');
    const rAmt = document.querySelector('[data-r-amount]');
    const rDate = document.querySelector('[data-r-date]');
    const rNo = document.querySelector('[data-r-no]');
    if (rName) rName.textContent = anon ? 'فاعل خير' : (nm || 'فاعل خير');
    if (rPhone) rPhone.textContent = anon ? '—' : (ph || '—');
    if (rAmt) rAmt.textContent = amt;
    if (rDate) rDate.textContent = new Date().toLocaleDateString('ar-SA');
    if (rNo) rNo.textContent = 'SANAD-2026-' + String(Math.floor(1000 + Math.random()*9000));
    closeModal(document.getElementById('mPay'));
    openModal('mReceipt');
  });

  /* طباعة سند التبرع */
  document.querySelectorAll('[data-print-receipt]').forEach(b => b.addEventListener('click', () => window.print()));
})();
