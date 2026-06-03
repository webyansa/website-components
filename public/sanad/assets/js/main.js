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
    // ابحث عن جميع عناصر [data-total] داخل أقرب لوحة أو البطاقة الجانبية
    const scope = row.closest('[data-dpanel]') || row.closest('[data-donation-card]') || row.parentElement;
    const totals = scope ? scope.querySelectorAll('[data-total]') : [];
    const setTotal = (v) => { const t = (Number(v)||0).toLocaleString('ar-SA'); totals.forEach(el => el.textContent = t); };
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

/* =============================================
   مسارات التبرع المتقدمة — donation paths v2
   ============================================= */
(function(){
  'use strict';
  const card = document.querySelector('[data-donation-card]');
  if (!card) return;

  const oppName = card.getAttribute('data-opportunity') || 'فرصة تبرع';
  const state = {
    type: 'once',          // once | recurring | gift
    method: 'card',        // card | mada | applepay | transfer
    freq: 'monthly',
    methodLabels: { card:'بطاقة بنكية', mada:'مدى', applepay:'Apple Pay', transfer:'تحويل بنكي' },
    freqLabels: { daily:'يومي', weekly:'أسبوعي', monthly:'شهري', yearly:'سنوي' },
    freqLabelsReceipt: { daily:'يوميًا', weekly:'أسبوعيًا', monthly:'شهريًا', yearly:'سنويًا' },
    durLabels: { open:'مفتوحة', '3m':'3 أشهر', '6m':'6 أشهر', '12m':'سنة كاملة' },
    typeLabels: { once:'تبرع مرة واحدة', recurring:'تبرع دوري', gift:'إهداء تبرع' }
  };

  /* تبويبات مسارات التبرع */
  const tabs = card.querySelectorAll('[data-dtab]');
  const panels = card.querySelectorAll('[data-dpanel]');
  tabs.forEach(t => t.addEventListener('click', () => {
    state.type = t.getAttribute('data-dtab');
    tabs.forEach(x => x.classList.toggle('active', x === t));
    panels.forEach(p => p.classList.toggle('active', p.getAttribute('data-dpanel') === state.type));
  }));

  /* segmented control: تكرار التبرع الدوري */
  const seg = card.querySelector('[data-seg="freq"]');
  if (seg){
    const opts = seg.querySelectorAll('.s-seg-opt');
    opts.forEach(o => o.addEventListener('click', () => {
      opts.forEach(x => x.classList.toggle('active', x === o));
      state.freq = o.getAttribute('data-value');
      updateRecurringSummary();
    }));
  }

  const rdStart = card.querySelector('[data-rd-start]');
  const rdDur = card.querySelector('[data-rd-duration]');
  const sumFreq = card.querySelector('[data-rd-sum-freq]');
  const sumDate = card.querySelector('[data-rd-sum-date]');
  const sumDur = card.querySelector('[data-rd-sum-dur]');
  function updateRecurringSummary(){
    if (sumFreq) sumFreq.textContent = state.freqLabels[state.freq];
    if (sumDate) sumDate.textContent = rdStart && rdStart.value ? new Date(rdStart.value).toLocaleDateString('ar-SA') : 'تاريخ اليوم';
    if (sumDur) sumDur.textContent = state.durLabels[rdDur ? rdDur.value : 'open'];
  }
  rdStart?.addEventListener('change', updateRecurringSummary);
  rdDur?.addEventListener('change', updateRecurringSummary);
  // set today as default
  if (rdStart && !rdStart.value){ const t = new Date(); rdStart.value = t.toISOString().slice(0,10); }
  updateRecurringSummary();

  /* معاينة بطاقة الإهداء */
  const gpTo = card.querySelector('[data-gp-to]');
  const gpFrom = card.querySelector('[data-gp-from]');
  const gpMsg = card.querySelector('[data-gp-msg]');
  const gpAmt = card.querySelector('[data-gp-amount]');
  const gpAmtRow = card.querySelector('[data-gp-amount-row]');
  const giftTo = card.querySelector('[data-gift-to-name]');
  const giftFrom = card.querySelector('[data-gift-from-name]');
  const giftMsg = card.querySelector('[data-gift-msg]');
  const giftShowAmt = card.querySelector('[data-gift-show-amount]');
  const giftSchedule = card.querySelector('[data-gift-schedule]');
  const giftScheduleBox = card.querySelector('.s-gift-schedule');

  function updateGiftPreview(){
    if (gpTo) gpTo.textContent = (giftTo?.value || '').trim() || '—';
    if (gpFrom) gpFrom.textContent = (giftFrom?.value || '').trim() || '—';
    if (gpMsg) gpMsg.textContent = (giftMsg?.value || '').trim() || 'تقبّل الله منكم صالح الأعمال';
    if (gpAmtRow) gpAmtRow.style.display = (giftShowAmt && !giftShowAmt.checked) ? 'none' : '';
  }
  [giftTo, giftFrom, giftMsg, giftShowAmt].forEach(el => el && el.addEventListener('input', updateGiftPreview));
  giftShowAmt?.addEventListener('change', updateGiftPreview);
  giftSchedule?.addEventListener('change', () => { if (giftScheduleBox) giftScheduleBox.style.display = giftSchedule.checked ? 'grid' : 'none'; });

  /* مزامنة المبلغ في معاينة الإهداء (مرتبط بـ data-total النشط داخل لوحة الإهداء) */
  const giftPanel = card.querySelector('[data-dpanel="gift"]');
  if (giftPanel){
    const obs = new MutationObserver(() => {
      const t = giftPanel.querySelector('[data-total]');
      if (t && gpAmt) gpAmt.textContent = t.textContent;
    });
    giftPanel.querySelectorAll('[data-total]').forEach(t => obs.observe(t, { childList:true, subtree:true, characterData:true }));
    // initial
    const t0 = giftPanel.querySelector('[data-total]');
    if (t0 && gpAmt) gpAmt.textContent = t0.textContent;
  }

  /* تبرع كفاعل خير لكل مسار — يضبط حالة المودال */
  function activeAnonChecked(){
    const map = { once:'[data-anon-once]', recurring:'[data-anon-recurring]', gift:'[data-anon-gift]' };
    const el = card.querySelector(map[state.type]);
    return !!(el && el.checked);
  }

  /* المبلغ النشط من اللوحة الحالية */
  function activeAmount(){
    const panel = card.querySelector(`[data-dpanel="${state.type}"]`);
    const t = panel?.querySelector('[data-total]');
    return t ? (t.textContent || '0').trim() : '0';
  }

  /* فتح المودالات */
  const openModal = (id) => { const m = document.getElementById(id); if (m){ m.classList.add('open'); document.body.style.overflow='hidden'; }};
  const closeModal = (m) => { m.classList.remove('open'); if(!document.querySelector('.s-modal-overlay.open')) document.body.style.overflow=''; };

  /* أزرار إطلاق الدفع — توجيه حسب طريقة الدفع */
  card.querySelectorAll('[data-pay-launch]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      state.type = btn.getAttribute('data-pay-launch');
      state.method = btn.getAttribute('data-pay-method') || 'card';
      const donorAnon = document.querySelector('#mDonor [data-anon]');
      if (donorAnon){
        donorAnon.checked = activeAnonChecked();
        donorAnon.dispatchEvent(new Event('change'));
      }
      // تحويل بنكي → افتح مودال التحويل مباشرة، بقية الطرق → بيانات المتبرع
      if (state.method === 'transfer'){
        // اضبط المبلغ في حقل التحويل من المسار النشط
        const trAmt = document.querySelector('[data-tr-amount]');
        if (trAmt && !trAmt.value){ trAmt.value = (activeAmount() || '').replace(/[^\d.]/g,''); }
        openModal('mTransfer');
      } else {
        openModal('mDonor');
      }
    });
  });

  /* فتح مودال الإهداء من الأزرار */
  document.querySelectorAll('[data-open-gift]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      state.type = 'gift';
      state.method = 'card';
      if (typeof window.__sanadGiftInit === 'function') window.__sanadGiftInit();
      openModal('mGift');
    });
  });

  /* جسر — تغيير طريقة الدفع من مودال الإهداء */
  document.addEventListener('sanad:set-method', (e) => {
    if (e.detail && e.detail.method) state.method = e.detail.method;
  });

  /* تحديث ملخص الدفع قبل فتح مودال الدفع */
  const goPay = document.querySelector('[data-go-pay]');
  if (goPay){
    goPay.addEventListener('click', () => {
      const ps = {
        type: document.querySelector('[data-ps-type]'),
        freqRow: document.querySelector('[data-ps-freq-row]'),
        freq: document.querySelector('[data-ps-freq]'),
        giftRow: document.querySelector('[data-ps-gift-row]'),
        giftTo: document.querySelector('[data-ps-gift-to]'),
        method: document.querySelector('[data-ps-method]'),
        amount: document.querySelector('[data-ps-amount]'),
      };
      if (ps.type) ps.type.textContent = state.typeLabels[state.type];
      if (ps.method) ps.method.textContent = state.methodLabels[state.method];
      if (ps.amount) ps.amount.textContent = activeAmount();
      if (ps.freqRow) ps.freqRow.style.display = state.type === 'recurring' ? '' : 'none';
      if (ps.freq) ps.freq.textContent = state.freqLabels[state.freq];
      if (ps.giftRow) ps.giftRow.style.display = state.type === 'gift' ? '' : 'none';
      if (ps.giftTo) ps.giftTo.textContent = (giftTo?.value || '').trim() || '—';
    }, true); // capture قبل المعالج القديم الذي يفتح mPay
  }

  /* تحديث سند التبرع بحسب نوع التبرع — يعمل بعد المعالج الأساسي */
  const finishBtn = document.querySelector('[data-finish-pay]');
  if (finishBtn){
    finishBtn.addEventListener('click', () => {
      // اسم الفرصة / طريقة الدفع / نوع التبرع
      const setT = (sel, val) => { const el = document.querySelector(sel); if (el) el.textContent = val; };
      setT('[data-r-type]', state.typeLabels[state.type]);
      setT('[data-r-method]', state.methodLabels[state.method]);
      setT('[data-r-opp]', oppName);
      setT('[data-r-amount]', activeAmount());

      // عند فاعل خير: تأكد أن الاسم يظهر "فاعل خير"
      if (activeAnonChecked()){
        setT('[data-r-name]', 'فاعل خير');
        setT('[data-r-phone]', '—');
      }

      // كتلة التبرع الدوري
      const rdBlock = document.querySelector('[data-r-recurring-block]');
      if (rdBlock){
        if (state.type === 'recurring'){
          rdBlock.style.display = '';
          setT('[data-r-rd-freq]', state.freqLabelsReceipt[state.freq]);
          setT('[data-r-rd-start]', rdStart && rdStart.value ? new Date(rdStart.value).toLocaleDateString('ar-SA') : new Date().toLocaleDateString('ar-SA'));
          setT('[data-r-rd-dur]', state.durLabels[rdDur ? rdDur.value : 'open']);
          setT('[data-r-rd-no]', 'RD-2026-' + String(Math.floor(1000 + Math.random()*9000)));
        } else { rdBlock.style.display = 'none'; }
      }

      // كتلة الإهداء
      const gBlock = document.querySelector('[data-r-gift-block]');
      if (gBlock){
        if (state.type === 'gift'){
          const gs = window.__sanadGift || {};
          gBlock.style.display = '';
          setT('[data-r-gift-to]', (gs.recipients && gs.recipients.length) ? gs.recipients.map(r => r.name || '—').join(' • ') : '—');
          setT('[data-r-gift-from]', (gs.anon ? 'فاعل خير' : (gs.fromName || '—')));
          setT('[data-r-gift-msg]', gs.msg || '—');
          setT('[data-r-gift-show]', gs.showAmount ? 'نعم' : 'لا');
          const dateRow = document.querySelector('[data-r-gift-date-row]');
          if (dateRow){
            if (gs.schedule){
              dateRow.style.display = '';
              setT('[data-r-gift-date]', (gs.date ? new Date(gs.date).toLocaleDateString('ar-SA') : '—') + (gs.time ? ' • ' + gs.time : ''));
            } else { dateRow.style.display = 'none'; }
          }
          // اظهر الإجمالي الكلي عند تعدد المستلمين
          if (gs.recipients && gs.recipients.length > 1 && gs.perAmount){
            setT('[data-r-amount]', String(gs.perAmount * gs.recipients.length));
          }
        } else { gBlock.style.display = 'none'; }
      }
    });
  }

  /* مشاركة السند */
  document.querySelectorAll('[data-share-receipt]').forEach(b => b.addEventListener('click', () => {
    const txt = 'سند تبرع — جمعية سَنَد';
    if (navigator.share){ navigator.share({ title: txt, text: txt, url: location.href }).catch(()=>{}); }
    else { navigator.clipboard?.writeText(location.href); b.innerHTML = '<i class="fas fa-check"></i> تم نسخ الرابط'; }
  }));
})();

/* =============================================
   مودال الإهداء + التحويل البنكي + النسخ + الرفع — v3
   ============================================= */
(function(){
  'use strict';
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  /* فتح/إغلاق عام (نسخة محلية للاعتمادية) */
  const openModal = (id) => { const m = document.getElementById(id); if (m){ m.classList.add('open'); document.body.style.overflow='hidden'; }};
  const closeModal = (m) => { m.classList.remove('open'); if(!document.querySelector('.s-modal-overlay.open')) document.body.style.overflow=''; };

  /* ====== أزرار النسخ ====== */
  $$('[data-copy]').forEach(btn => btn.addEventListener('click', async (e) => {
    e.preventDefault(); e.stopPropagation();
    const val = btn.getAttribute('data-copy') || '';
    try { await navigator.clipboard.writeText(val); } catch(_){}
    const old = btn.innerHTML;
    btn.classList.add('copied');
    btn.innerHTML = '<i class="fas fa-check"></i>';
    setTimeout(() => { btn.classList.remove('copied'); btn.innerHTML = old; }, 1400);
  }));

  /* ====== مودال التحويل البنكي ====== */
  const trFile = $('[data-tr-file]');
  const trFname = $('[data-tr-fname]');
  if (trFile){
    trFile.addEventListener('change', () => {
      const f = trFile.files && trFile.files[0];
      if (f && trFname){
        trFname.style.display = '';
        trFname.innerHTML = '<i class="fas fa-file-circle-check"></i> ' + f.name;
      }
    });
  }
  // تاريخ افتراضي = اليوم
  const trDate = $('[data-tr-date]');
  if (trDate && !trDate.value){ trDate.value = new Date().toISOString().slice(0,10); }

  const finishTransfer = $('[data-finish-transfer]');
  if (finishTransfer){
    finishTransfer.addEventListener('click', (e) => {
      e.preventDefault();
      const amt = ($('[data-tr-amount]')?.value || '0').trim() || '0';
      const name = ($('[data-tr-name]')?.value || '').trim();
      const phone = ($('[data-tr-phone]')?.value || '').trim();
      const anon = $('[data-tr-anon]')?.checked;
      const setT = (sel, val) => { const el = document.querySelector(sel); if (el) el.textContent = val; };
      // الفرصة + المعرفات الأساسية
      const card = $('[data-donation-card]');
      const oppName = card?.getAttribute('data-opportunity') || 'فرصة تبرع';
      setT('[data-r-no]', 'SANAD-TR-2026-' + String(Math.floor(1000 + Math.random()*9000)));
      setT('[data-r-date]', new Date().toLocaleDateString('ar-SA'));
      setT('[data-r-type]', 'تبرع بتحويل بنكي');
      setT('[data-r-name]', anon ? 'فاعل خير' : (name || 'فاعل خير'));
      setT('[data-r-phone]', anon ? '—' : (phone || '—'));
      setT('[data-r-opp]', oppName);
      setT('[data-r-method]', 'تحويل بنكي');
      setT('[data-r-amount]', Number(amt).toLocaleString('ar-SA'));
      // إخفاء كتل خاصة بالإهداء/الدوري
      const rd = $('[data-r-recurring-block]'); if (rd) rd.style.display = 'none';
      const gb = $('[data-r-gift-block]'); if (gb) gb.style.display = 'none';
      closeModal($('#mTransfer'));
      openModal('mReceipt');
    });
  }

  /* ====== مودال الإهداء ====== */
  const giftModal = $('#mGift');
  if (!giftModal) return;

  const recipBox = $('[data-gift-recipients]', giftModal);
  const addBtn = $('[data-gift-add]', giftModal);
  const fromName = $('[data-gm-from-name]', giftModal);
  const fromPhone = $('[data-gm-from-phone]', giftModal);
  const msgEl = $('[data-gm-msg]', giftModal);
  const showAmtEl = $('[data-gm-show-amount]', giftModal);
  const scheduleEl = $('[data-gm-schedule]', giftModal);
  const scheduleBox = $('[data-gm-schedule-box]', giftModal);
  const dateEl = $('[data-gm-date]', giftModal);
  const timeEl = $('[data-gm-time]', giftModal);
  const anonEl = $('[data-gm-anon]', giftModal);
  const amtRow = $('[data-gm-amt-row]', giftModal);
  const totalEl = $('[data-gm-total]', giftModal);
  const countEl = $('[data-gm-count]', giftModal);
  const grandEl = $('[data-gm-grand]', giftModal);
  const pvTo = $('[data-gm-pv-to]', giftModal);
  const pvFrom = $('[data-gm-pv-from]', giftModal);
  const pvMsg = $('[data-gm-pv-msg]', giftModal);
  const pvAmt = $('[data-gm-pv-amount]', giftModal);
  const pvAmtRow = $('[data-gm-pv-amount-row]', giftModal);
  const continueBtn = $('[data-gm-continue]', giftModal);

  let payMethod = 'card';
  $$('[data-gm-pay]', giftModal).forEach(b => b.addEventListener('click', () => {
    $$('[data-gm-pay]', giftModal).forEach(x => {
      x.classList.toggle('primary', x === b);
      x.classList.toggle('active', x === b);
    });
    payMethod = b.getAttribute('data-gm-pay');
  }));

  function recipientTpl(idx){
    const div = document.createElement('div');
    div.className = 's-recip';
    div.innerHTML = `
      <span class="s-recip-index">${idx}</span>
      <div class="s-field"><label>اسم المُهدى إليه</label><input type="text" class="s-input" data-r-name placeholder="الاسم" /></div>
      <div class="s-field"><label>رقم الجوال</label><input type="tel" class="s-input" data-r-phone placeholder="05XXXXXXXX" /></div>
      <button type="button" class="s-recip-del" title="حذف"><i class="fas fa-trash"></i></button>
    `;
    div.querySelector('.s-recip-del').addEventListener('click', () => {
      if (recipBox.children.length <= 1) return;
      div.remove(); reindex(); updatePreview();
    });
    div.querySelectorAll('input').forEach(i => i.addEventListener('input', updatePreview));
    return div;
  }
  function reindex(){
    Array.from(recipBox.children).forEach((c, i) => {
      const s = c.querySelector('.s-recip-index'); if (s) s.textContent = i + 1;
    });
  }
  function addRecipient(){
    recipBox.appendChild(recipientTpl(recipBox.children.length + 1));
    updatePreview();
  }
  addBtn?.addEventListener('click', addRecipient);

  function getRecipients(){
    return Array.from(recipBox.querySelectorAll('.s-recip')).map(r => ({
      name: (r.querySelector('[data-r-name]')?.value || '').trim(),
      phone: (r.querySelector('[data-r-phone]')?.value || '').trim(),
    }));
  }
  function currentAmount(){
    const a = amtRow?.querySelector('.s-amt.active');
    const c = amtRow?.querySelector('.s-amt-custom');
    if (c && c.value) return Number(c.value) || 0;
    if (a) return Number(a.getAttribute('data-value')) || 0;
    return 0;
  }
  function updatePreview(){
    const recips = getRecipients();
    const per = currentAmount();
    const count = Math.max(1, recips.length);
    if (totalEl) totalEl.textContent = per.toLocaleString('ar-SA');
    if (countEl) countEl.textContent = count;
    if (grandEl) grandEl.textContent = (per * count).toLocaleString('ar-SA');
    if (pvTo) pvTo.textContent = recips[0]?.name || '—';
    if (pvFrom) pvFrom.textContent = (anonEl?.checked ? 'فاعل خير' : (fromName?.value || '').trim()) || '—';
    if (pvMsg) pvMsg.textContent = (msgEl?.value || '').trim() || 'تقبّل الله منكم صالح الأعمال';
    if (pvAmt) pvAmt.textContent = per.toLocaleString('ar-SA');
    if (pvAmtRow) pvAmtRow.style.display = (showAmtEl && !showAmtEl.checked) ? 'none' : '';
  }

  // ربط تحديثات
  [fromName, fromPhone, msgEl, showAmtEl, anonEl].forEach(el => el && el.addEventListener('input', updatePreview));
  showAmtEl?.addEventListener('change', updatePreview);
  anonEl?.addEventListener('change', updatePreview);
  scheduleEl?.addEventListener('change', () => { if (scheduleBox) scheduleBox.style.display = scheduleEl.checked ? 'grid' : 'none'; });
  // chips amount
  amtRow?.querySelectorAll('.s-amt').forEach(c => c.addEventListener('click', () => setTimeout(updatePreview, 0)));
  amtRow?.querySelector('.s-amt-custom')?.addEventListener('input', updatePreview);

  // Initialize (also exposed)
  window.__sanadGiftInit = function(){
    if (recipBox && recipBox.children.length === 0) addRecipient();
    updatePreview();
  };
  window.__sanadGiftInit();

  /* متابعة الإهداء — يخزّن الحالة ثم يفتح بقية المسار */
  continueBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    const recips = getRecipients().filter(r => r.name || r.phone);
    if (!recips.length){
      // اطلب اسم واحد على الأقل
      const first = recipBox.querySelector('[data-r-name]');
      if (first){ first.focus(); first.style.borderColor = '#b3261e'; setTimeout(() => first.style.borderColor = '', 1600); }
      return;
    }
    const per = currentAmount() || 0;
    window.__sanadGift = {
      recipients: recips,
      fromName: (fromName?.value || '').trim(),
      fromPhone: (fromPhone?.value || '').trim(),
      msg: (msgEl?.value || '').trim() || 'تقبّل الله منكم صالح الأعمال',
      showAmount: !!showAmtEl?.checked,
      schedule: !!scheduleEl?.checked,
      date: dateEl?.value || '',
      time: timeEl?.value || '',
      anon: !!anonEl?.checked,
      perAmount: per,
      totalAmount: per * recips.length,
      method: payMethod
    };
    // وفّر متغير الحالة العام
    window.__sanadDonation = window.__sanadDonation || {};
    window.__sanadDonation.type = 'gift';
    window.__sanadDonation.method = payMethod;
    document.dispatchEvent(new CustomEvent('sanad:set-method', { detail: { method: payMethod } }));

    closeModal(giftModal);

    if (payMethod === 'transfer'){
      // املأ المبلغ ثم افتح مودال التحويل
      const trAmt = $('[data-tr-amount]'); if (trAmt) trAmt.value = window.__sanadGift.totalAmount;
      const trName = $('[data-tr-name]'); if (trName && !trName.value) trName.value = window.__sanadGift.fromName;
      const trPhone = $('[data-tr-phone]'); if (trPhone && !trPhone.value) trPhone.value = window.__sanadGift.fromPhone;
      openModal('mTransfer');
    } else {
      // بطاقة بنكية → مودال المتبرع → الدفع → السند
      const donorAnon = document.querySelector('#mDonor [data-anon]');
      if (donorAnon){ donorAnon.checked = window.__sanadGift.anon; donorAnon.dispatchEvent(new Event('change')); }
      // اضبط حقول المتبرع باسم المُهدي
      const dn = document.querySelector('#mDonor [data-donor-name] input');
      const dp = document.querySelector('#mDonor [data-donor-phone] input');
      if (dn && !dn.value) dn.value = window.__sanadGift.fromName;
      if (dp && !dp.value) dp.value = window.__sanadGift.fromPhone;
      openModal('mDonor');
    }
  });
})();

/* ============ STORE (Sanad) ============ */
(function(){
  const LS_KEY='sanad_cart_v1';
  const ORDER_KEY='sanad_last_order';
  const fmt=n=>Number(n).toLocaleString('ar-SA')+' ر.س';
  function read(){ try{ return JSON.parse(localStorage.getItem(LS_KEY))||[]; }catch(e){ return [];} }
  function write(c){ localStorage.setItem(LS_KEY, JSON.stringify(c)); updateBadges(); }
  function updateBadges(){
    const c=read(); const n=c.reduce((s,i)=>s+(i.qty||1),0);
    document.querySelectorAll('[data-cart-count]').forEach(el=>{ el.textContent=n; el.style.display=n>0?'inline-flex':'none'; });
  }
  window.sanadStore={
    add(item){
      const c=read();
      const ex=c.find(x=>x.id===item.id);
      if(ex){ ex.qty=(ex.qty||1)+(item.qty||1); } else { c.push(Object.assign({qty:1},item)); }
      write(c);
      toast('تمت إضافة المنتج للسلة');
    },
    remove(id){ write(read().filter(x=>x.id!==id)); renderCart(); },
    setQty(id,q){ const c=read(); const it=c.find(x=>x.id===id); if(it){ it.qty=Math.max(1,parseInt(q)||1); } write(c); renderCart(); },
    get(){ return read(); },
    clear(){ localStorage.removeItem(LS_KEY); updateBadges(); },
    saveOrder(o){ localStorage.setItem(ORDER_KEY, JSON.stringify(o)); },
    getOrder(){ try{ return JSON.parse(localStorage.getItem(ORDER_KEY)); }catch(e){ return null;} }
  };
  function toast(msg){
    let t=document.getElementById('st-toast');
    if(!t){ t=document.createElement('div'); t.id='st-toast'; t.style.cssText='position:fixed;bottom:30px;right:30px;background:#0d7a4f;color:#fff;padding:14px 22px;border-radius:14px;font-weight:700;z-index:9999;box-shadow:0 14px 30px rgba(0,0,0,.25);transition:.3s;opacity:0;transform:translateY(10px);'; document.body.appendChild(t);}
    t.textContent=msg; requestAnimationFrame(()=>{ t.style.opacity='1'; t.style.transform='translateY(0)';});
    clearTimeout(t._h); t._h=setTimeout(()=>{ t.style.opacity='0'; t.style.transform='translateY(10px);'; }, 2200);
  }
  window.sanadToast=toast;

  // Store page filters
  function bindStore(){
    const grid=document.getElementById('st-grid'); if(!grid) return;
    const cards=Array.from(grid.querySelectorAll('[data-st-item]'));
    const search=document.getElementById('st-search');
    const type=document.getElementById('st-type');
    const price=document.getElementById('st-price');
    const status=document.getElementById('st-status');
    const sort=document.getElementById('st-sort');
    const cats=document.querySelectorAll('[data-st-cat]');
    let cat='all';
    function apply(){
      const q=(search?.value||'').trim();
      const t=type?.value||'all';
      const p=price?.value||'all';
      const s=status?.value||'all';
      const so=sort?.value||'new';
      let visible=cards.filter(c=>{
        const ct=c.dataset.type;
        const pr=parseInt(c.dataset.price||0);
        const st=c.dataset.status||'';
        if(cat!=='all' && cat!=='featured' && cat!=='new' && cat!=='top' && ct!==cat) return false;
        if(cat==='new' && !st.includes('new')) return false;
        if(cat==='top' && !st.includes('top')) return false;
        if(t!=='all' && ct!==t) return false;
        if(p==='lt100' && !(pr<100)) return false;
        if(p==='100-300' && !(pr>=100&&pr<=300)) return false;
        if(p==='gt300' && !(pr>300)) return false;
        if(s!=='all' && !st.includes(s)) return false;
        if(q && !c.dataset.name.includes(q)) return false;
        return true;
      });
      cards.forEach(c=>c.style.display='none');
      visible.sort((a,b)=>{
        if(so==='priceAsc') return a.dataset.price-b.dataset.price;
        if(so==='priceDesc') return b.dataset.price-a.dataset.price;
        if(so==='top') return (b.dataset.orders||0)-(a.dataset.orders||0);
        return 0;
      });
      visible.forEach(c=>c.style.display='');
      const empty=document.getElementById('st-empty'); if(empty) empty.style.display=visible.length?'none':'block';
    }
    cats.forEach(b=>b.addEventListener('click',()=>{ cats.forEach(x=>x.classList.remove('active')); b.classList.add('active'); cat=b.dataset.stCat; apply();}));
    [search,type,price,status,sort].forEach(el=>el&&el.addEventListener('input',apply));
    document.getElementById('st-reset')?.addEventListener('click',()=>{ if(search)search.value=''; if(type)type.value='all'; if(price)price.value='all'; if(status)status.value='all'; if(sort)sort.value='new'; cats.forEach(x=>x.classList.remove('active')); document.querySelector('[data-st-cat="all"]')?.classList.add('active'); cat='all'; apply();});
    grid.addEventListener('click',e=>{
      const btn=e.target.closest('[data-st-add]'); if(!btn) return;
      const c=btn.closest('[data-st-item]');
      window.sanadStore.add({ id:c.dataset.id, name:c.dataset.name, price:+c.dataset.price, type:c.dataset.type, img:c.dataset.img, url:c.dataset.url });
    });
    apply();
  }

  // Product detail buy
  function bindDetail(){
    document.querySelectorAll('[data-st-buy]').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const d=btn.dataset;
        const qty=parseInt(document.querySelector('[data-st-qty-input]')?.value||1);
        window.sanadStore.add({ id:d.id, name:d.name, price:+d.price, type:d.type, img:d.img, url:d.url, qty });
        if(btn.dataset.stBuy==='now'){ window.location='cart.html'; }
      });
    });
    document.querySelectorAll('[data-st-qty]').forEach(q=>{
      const input=q.querySelector('input');
      q.querySelector('[data-q="-"]').addEventListener('click',()=>{ input.value=Math.max(1,(+input.value||1)-1); });
      q.querySelector('[data-q="+"]').addEventListener('click',()=>{ input.value=(+input.value||1)+1; });
    });
    document.querySelectorAll('[data-st-thumb]').forEach(t=>{
      t.addEventListener('click',()=>{
        const main=document.querySelector('[data-st-main-img]'); if(main){ main.src=t.querySelector('img').src; }
        document.querySelectorAll('[data-st-thumb]').forEach(x=>x.classList.remove('active'));
        t.classList.add('active');
      });
    });
  }

  // Cart page
  function renderCart(){
    const list=document.getElementById('st-cart-list'); if(!list) return;
    const c=read();
    const empty=document.getElementById('st-cart-empty');
    const summary=document.getElementById('st-cart-summary');
    if(!c.length){ list.innerHTML=''; if(empty) empty.style.display='block'; if(summary) summary.style.display='none'; return; }
    if(empty) empty.style.display='none'; if(summary) summary.style.display='';
    list.innerHTML=c.map(i=>`
      <div class="st-cart-row">
        <div class="ci"><img src="${i.img}" alt=""></div>
        <div>
          <div class="font-extrabold text-sanad-navy">${i.name}</div>
          <div class="text-xs text-sanad-muted mt-1">${typeLabel(i.type)}</div>
          <div class="mt-3 flex items-center gap-3 flex-wrap">
            <div class="st-qty" data-st-qty>
              <button data-q="-" onclick="sanadStore.setQty('${i.id}', (parseInt(this.nextElementSibling.value)-1))">−</button>
              <input value="${i.qty}" onchange="sanadStore.setQty('${i.id}', this.value)">
              <button data-q="+" onclick="sanadStore.setQty('${i.id}', (parseInt(this.previousElementSibling.value)+1))">+</button>
            </div>
            <button class="text-red-600 text-sm font-bold" onclick="sanadStore.remove('${i.id}')"><i class="fas fa-trash"></i> حذف</button>
          </div>
        </div>
        <div class="right text-left">
          <div class="text-lg font-extrabold text-sanad-emeraldDeep">${fmt(i.price*i.qty)}</div>
          <div class="text-xs text-sanad-muted">${fmt(i.price)} × ${i.qty}</div>
        </div>
      </div>`).join('');
    const sub=c.reduce((s,i)=>s+i.price*i.qty,0);
    const vat=Math.round(sub*0.15);
    const total=sub+vat;
    document.getElementById('st-sub') && (document.getElementById('st-sub').textContent=fmt(sub));
    document.getElementById('st-vat') && (document.getElementById('st-vat').textContent=fmt(vat));
    document.getElementById('st-total') && (document.getElementById('st-total').textContent=fmt(total));
  }
  function typeLabel(t){ return {physical:'منتج ملموس',digital:'منتج رقمي',service:'خدمة',course:'دورة',impact:'منتج أثر'}[t]||'منتج';}
  window.renderCart=renderCart;

  // Checkout
  function bindCheckout(){
    const form=document.getElementById('st-checkout-form'); if(!form) return;
    const c=read();
    // summary
    const sumBox=document.getElementById('st-co-summary');
    if(sumBox){
      const sub=c.reduce((s,i)=>s+i.price*i.qty,0);
      const vat=Math.round(sub*0.15); const total=sub+vat;
      sumBox.innerHTML=c.map(i=>`<div class="flex justify-between text-sm py-2 border-b border-dashed border-sanad-border"><span>${i.name} × ${i.qty}</span><span class="font-bold">${fmt(i.price*i.qty)}</span></div>`).join('')+
        `<div class="flex justify-between text-sm pt-3"><span>المجموع</span><span>${fmt(sub)}</span></div>
         <div class="flex justify-between text-sm py-1"><span>الضريبة (15%)</span><span>${fmt(vat)}</span></div>
         <div class="flex justify-between text-lg font-extrabold text-sanad-emeraldDeep pt-2 border-t border-sanad-border mt-2"><span>الإجمالي</span><span>${fmt(total)}</span></div>`;
    }
    // delivery option depends on types
    const hasPhys=c.some(i=>i.type==='physical'||i.type==='impact');
    const hasDig=c.some(i=>i.type==='digital');
    const hasSrv=c.some(i=>i.type==='service'||i.type==='course');
    document.querySelectorAll('[data-st-deliv]').forEach(opt=>{
      const k=opt.dataset.stDeliv;
      const show=(k==='ship'||k==='pickup')?hasPhys: k==='download'?hasDig: k==='service'?hasSrv: true;
      opt.style.display=show?'':'none';
    });
    // pay options
    document.querySelectorAll('.st-pay-opt').forEach(o=>{
      o.addEventListener('click',()=>{
        document.querySelectorAll('.st-pay-opt').forEach(x=>x.classList.remove('active'));
        o.classList.add('active');
        o.querySelector('input').checked=true;
      });
    });
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const fd=new FormData(form);
      const order={
        id:'ORD-2026-'+String(Math.floor(1000+Math.random()*9000)),
        name:fd.get('name')||'عميل سَنَد',
        email:fd.get('email')||'',
        phone:fd.get('phone')||'',
        items:c,
        delivery:fd.get('delivery')||'',
        payment:fd.get('payment')||'card',
        sub:c.reduce((s,i)=>s+i.price*i.qty,0),
        date:new Date().toLocaleDateString('ar-SA')
      };
      order.vat=Math.round(order.sub*.15); order.total=order.sub+order.vat;
      window.sanadStore.saveOrder(order);
      window.sanadStore.clear();
      window.location='order-success.html';
    });
  }

  // Success
  function renderSuccess(){
    const root=document.getElementById('st-success'); if(!root) return;
    const o=window.sanadStore.getOrder();
    if(!o){ root.innerHTML='<div class="text-center py-12 text-sanad-muted">لا يوجد طلب حديث.</div>'; return;}
    document.getElementById('st-ord-id') && (document.getElementById('st-ord-id').textContent=o.id);
    document.getElementById('st-ord-name') && (document.getElementById('st-ord-name').textContent=o.name);
    document.getElementById('st-ord-date') && (document.getElementById('st-ord-date').textContent=o.date);
    document.getElementById('st-ord-total') && (document.getElementById('st-ord-total').textContent=fmt(o.total));
    document.getElementById('st-ord-pay') && (document.getElementById('st-ord-pay').textContent={card:'بطاقة بنكية',mada:'مدى',transfer:'تحويل بنكي'}[o.payment]||'بطاقة');
    const list=document.getElementById('st-ord-items');
    if(list){ list.innerHTML=o.items.map(i=>`<div class="flex justify-between text-sm py-2 border-b border-dashed border-sanad-border"><span>${i.name} × ${i.qty}</span><span class="font-bold">${fmt(i.price*i.qty)}</span></div>`).join('');}
    // type-specific messages
    const hasDig=o.items.some(i=>i.type==='digital');
    const hasPhys=o.items.some(i=>i.type==='physical'||i.type==='impact');
    const hasSrv=o.items.some(i=>i.type==='service');
    const hasCrs=o.items.some(i=>i.type==='course');
    document.getElementById('st-msg-digital')&&(document.getElementById('st-msg-digital').style.display=hasDig?'':'none');
    document.getElementById('st-msg-physical')&&(document.getElementById('st-msg-physical').style.display=hasPhys?'':'none');
    document.getElementById('st-msg-service')&&(document.getElementById('st-msg-service').style.display=hasSrv?'':'none');
    document.getElementById('st-msg-course')&&(document.getElementById('st-msg-course').style.display=hasCrs?'':'none');
  }

  document.addEventListener('DOMContentLoaded',()=>{
    updateBadges();
    bindStore();
    bindDetail();
    renderCart();
    bindCheckout();
    renderSuccess();
  });
})();
