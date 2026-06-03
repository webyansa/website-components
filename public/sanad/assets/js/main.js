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
      // تأكد من وجود مستلم واحد على الأقل
      if (typeof window.__sanadGiftInit === 'function') window.__sanadGiftInit();
      openModal('mGift');
    });
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
          gBlock.style.display = '';
          setT('[data-r-gift-to]', (giftTo?.value || '').trim() || '—');
          setT('[data-r-gift-from]', activeAnonChecked() ? 'فاعل خير' : ((giftFrom?.value || '').trim() || '—'));
          setT('[data-r-gift-msg]', (giftMsg?.value || '').trim() || '—');
          setT('[data-r-gift-show]', giftShowAmt && giftShowAmt.checked ? 'نعم' : 'لا');
          const dateRow = document.querySelector('[data-r-gift-date-row]');
          if (dateRow){
            if (giftSchedule && giftSchedule.checked){
              dateRow.style.display = '';
              const d = card.querySelector('[data-gift-date]')?.value;
              const tm = card.querySelector('[data-gift-time]')?.value;
              setT('[data-r-gift-date]', (d ? new Date(d).toLocaleDateString('ar-SA') : '—') + (tm ? ' • ' + tm : ''));
            } else { dateRow.style.display = 'none'; }
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
