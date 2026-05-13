/* Webyan Admin — Subscription Lifecycle State Machine (Mockup only)
   ================================================================= */
(function () {
  const root = document.querySelector('[data-lifecycle]');
  if (!root) return;

  // ---- Helpers ----
  const $  = (s, r=root) => r.querySelector(s);
  const $$ = (s, r=root) => Array.from(r.querySelectorAll(s));

  function setBadge(el, cls, text) {
    if (!el) return;
    el.className = 'badge ' + cls;
    el.textContent = text;
  }
  function setAllPills(name, cls, text) {
    $$(`[data-pill^="${name}"]`).forEach(el => setBadge(el, cls, text));
  }
  function setStage(stageKey) {
    const order = ['request', 'payment', 'prep', 'deliver', 'activate'];
    const idx = order.indexOf(stageKey);
    $$('.h-step').forEach((el, i) => {
      el.classList.remove('done', 'active');
      if (i < idx) el.classList.add('done');
      else if (i === idx) el.classList.add('active');
    });
    const labels = { request: 'الطلب', payment: 'الدفع', prep: 'التجهيز', deliver: 'التسليم', activate: 'التفعيل' };
    const cur = $('[data-current-stage]'); if (cur) cur.textContent = labels[stageKey];
  }
  function showSection(key) { const s = $(`[data-section="${key}"]`); if (s) s.classList.remove('hidden'); }
  function hideSection(key) { const s = $(`[data-section="${key}"]`); if (s) s.classList.add('hidden'); }
  function setSectionStatus(key, cls, text) {
    const el = $(`[data-section-status="${key}"]`); if (el) setBadge(el, cls, text);
  }
  function tlMark(key, time, desc) {
    const el = $(`[data-tl="${key}"]`); if (!el) return;
    el.classList.add('done');
    const t = el.querySelector('.tl-time'); if (t) t.textContent = time;
    if (desc) { const d = el.querySelector('.tl-desc'); if (d) d.textContent = desc; }
  }
  function nowStr() {
    const d = new Date();
    return `${d.toLocaleDateString('ar-SA-u-nu-latn')} — ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  }
  function setNextAction(label, action) {
    const lbl = $('[data-next-action-label]'); if (lbl) lbl.textContent = label;
    const btn = $('[data-action="" i]') || document.querySelector('[data-current-stage]')?.parentElement?.querySelector('button');
    // Update the dynamic CTA next to KPI by data attr
    const cta = root.querySelector('.detail-head .btn[data-action]');
    if (cta) cta.setAttribute('data-action', action);
  }

  // ---- Scenario reset ----
  function applyScenario(s) {
    // hide downstream sections
    ['prep','deliver','activated'].forEach(hideSection);
    // payment row visible & reset
    const payRow = $('[data-action-row="payment"]'); if (payRow) payRow.classList.remove('hidden');

    // reset timeline future items
    ['confirm','prep','deliver','activate'].forEach(k => {
      const el = $(`[data-tl="${k}"]`); if (!el) return;
      el.classList.remove('done');
      const t = el.querySelector('.tl-time'); if (t) t.textContent = k === 'confirm' ? 'قيد الانتظار' : '—';
    });

    if (s === 'electronic') {
      setAllPills('method', 'badge', 'طريقة الدفع: دفع إلكتروني');
      setAllPills('payment', 'badge b-paid', 'حالة الدفع: مدفوع');
      setAllPills('request', 'badge b-paid', 'حالة الطلب: الدفع مؤكد');
      setSectionStatus('payment', 'badge b-paid', 'مدفوع');
      setStage('prep');
      $('[data-current-stage]').textContent = 'الدفع → التجهيز';
      $('[data-next-action-label]').textContent = 'بدء التجهيز الفني';
      const cta = root.querySelector('.detail-head .btn[data-action]');
      if (cta) { cta.setAttribute('data-action','start-prep'); cta.innerHTML = '<i class="fa-solid fa-screwdriver-wrench"></i> بدء التجهيز'; }
      tlMark('confirm', '13 مايو 2026 — 09:43', 'دفع إلكتروني ناجح عبر بوابة الدفع');
      if (payRow) payRow.classList.add('hidden');
    }
    else if (s === 'postpay') {
      setAllPills('method', 'badge', 'طريقة الدفع: دفع لاحق');
      setAllPills('payment', 'badge', 'حالة الدفع: غير مدفوع');
      setAllPills('request', 'badge b-await', 'حالة الطلب: بانتظار الدفع');
      setSectionStatus('payment', 'badge b-await', 'بانتظار الدفع');
      setStage('payment');
      $('[data-next-action-label]').textContent = 'تسجيل دفع يدوي';
      const cta = root.querySelector('.detail-head .btn[data-action]');
      if (cta) { cta.setAttribute('data-action','confirm-payment'); cta.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> تسجيل دفع'; }
    }
    else { // bank-transfer (default)
      setAllPills('method', 'badge', 'طريقة الدفع: تحويل بنكي');
      setAllPills('payment', 'badge b-verify', 'حالة الدفع: بانتظار التأكيد');
      setAllPills('request', 'badge b-verify', 'حالة الطلب: بانتظار تأكيد الدفع');
      setSectionStatus('payment', 'badge b-verify', 'بانتظار التأكيد');
      setStage('payment');
      $('[data-next-action-label]').textContent = 'التحقق من الدفع';
      const cta = root.querySelector('.detail-head .btn[data-action]');
      if (cta) { cta.setAttribute('data-action','confirm-payment'); cta.innerHTML = '<i class="fa-solid fa-check"></i> قبول الدفع'; }
    }
    root.dataset.lifecycle = s;
  }

  // ---- Action handlers ----
  function confirmPayment() {
    setAllPills('payment', 'badge b-paid', 'حالة الدفع: مدفوع');
    setAllPills('request', 'badge b-paid', 'حالة الطلب: الدفع مؤكد');
    setSectionStatus('payment', 'badge b-paid', 'مدفوع');
    const by = $('[data-confirmed-by]'); if (by) by.textContent = 'عبدالله الزهراني — ' + nowStr();
    tlMark('confirm', nowStr(), 'تم تأكيد الدفع بواسطة عبدالله الزهراني');
    const payRow = $('[data-action-row="payment"]'); if (payRow) payRow.classList.add('hidden');

    // unlock prep
    setStage('prep');
    showSection('prep');
    $('[data-prep-started]').textContent = nowStr();
    $('[data-next-action-label]').textContent = 'بدء التجهيز الفني';
    const cta = root.querySelector('.detail-head .btn[data-action]');
    if (cta) { cta.setAttribute('data-action','scroll-prep'); cta.innerHTML = '<i class="fa-solid fa-arrow-down"></i> الانتقال للتجهيز'; }
    document.querySelector('[data-section="prep"]').scrollIntoView({behavior:'smooth', block:'start'});
    showToast('تم تأكيد الدفع — يمكنك الآن بدء التجهيز الفني');
  }

  function rejectPayment() {
    setAllPills('payment', 'badge b-cancel', 'حالة الدفع: مرفوض');
    setAllPills('request', 'badge b-await', 'حالة الطلب: بانتظار الدفع');
    setSectionStatus('payment', 'badge b-cancel', 'مرفوض');
    showToast('تم رفض الدفع — العميل سيُبلَّغ لإعادة المحاولة');
  }

  function updatePrepCount() {
    const total = $$('[data-step]').length;
    const done = $$('[data-step].done').length;
    const c = $('[data-prep-count]'); if (c) c.textContent = done;
    const moveBtn = root.querySelector('[data-action="move-to-deliver"]');
    if (done === total) {
      moveBtn?.classList.remove('hidden');
      setSectionStatus('prep', 'badge b-paid', 'اكتمل التجهيز · ' + done + '/' + total);
    } else {
      moveBtn?.classList.add('hidden');
      setSectionStatus('prep', 'badge b-prep', 'قيد التجهيز · ' + done + '/' + total);
    }
  }

  function moveToDeliver() {
    tlMark('prep', nowStr(), 'اكتمل التجهيز الفني — ' + $$('[data-step]').length + ' خطوة');
    tlMark('deliver', nowStr(), 'الموقع جاهز وبيانات الدخول مرسلة');
    setStage('deliver');
    showSection('deliver');
    $('[data-next-action-label]').textContent = 'تفعيل الاشتراك';
    const cta = root.querySelector('.detail-head .btn[data-action]');
    if (cta) { cta.setAttribute('data-action','open-activate-modal'); cta.innerHTML = '<i class="fa-solid fa-power-off"></i> تفعيل الاشتراك'; }
    document.querySelector('[data-section="deliver"]').scrollIntoView({behavior:'smooth'});
    showToast('تم النقل إلى مرحلة "جاهز للتسليم"');
  }

  // ---- Activation modal ----
  const modal = document.getElementById('activate-modal');
  function openModal() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('act-start').value = today;
    recalcEndDate();
    modal.classList.add('show');
  }
  function closeModal() { modal.classList.remove('show'); }
  function recalcEndDate() {
    const start = document.getElementById('act-start').value;
    const dur = parseInt(document.getElementById('act-duration').value, 10);
    if (!start) return;
    const d = new Date(start); d.setDate(d.getDate() + dur);
    document.getElementById('act-end').value = d.toISOString().split('T')[0];
  }
  document.getElementById('act-start')?.addEventListener('change', recalcEndDate);
  document.getElementById('act-duration')?.addEventListener('change', recalcEndDate);
  document.querySelectorAll('[data-close-modal]').forEach(b => b.addEventListener('click', closeModal));
  modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  function confirmActivation() {
    if (!document.getElementById('act-confirm').checked) {
      showToast('يجب تأكيد جاهزية الموقع وإرسال بيانات الدخول'); return;
    }
    const start = document.getElementById('act-start').value;
    const end = document.getElementById('act-end').value;
    closeModal();
    setStage('activate');
    $$('.h-step').forEach(s => s.classList.add('done'));
    showSection('activated');
    setAllPills('request', 'badge b-active', 'حالة الطلب: اشتراك مفعّل');
    $('[data-sub-start]').textContent = start;
    $('[data-sub-end]').textContent = end;
    tlMark('activate', nowStr(), 'تم إنشاء الاشتراك الفعلي SUB-2026-0001');
    document.querySelector('[data-section="activated"]').scrollIntoView({behavior:'smooth'});
    showToast('تم إنشاء الاشتراك الفعلي بنجاح برقم SUB-2026-0001');
  }

  // ---- Wire up ----
  root.addEventListener('click', e => {
    const stepEl = e.target.closest('[data-step]');
    if (stepEl) { stepEl.classList.toggle('done'); updatePrepCount(); return; }

    const btn = e.target.closest('[data-action], [data-scenario]');
    if (!btn) return;

    if (btn.dataset.scenario) { applyScenario(btn.dataset.scenario); return; }

    switch (btn.dataset.action) {
      case 'confirm-payment': confirmPayment(); break;
      case 'reject-payment':  rejectPayment(); break;
      case 'verify-payment':  document.querySelector('[data-section="payment"]').scrollIntoView({behavior:'smooth'}); break;
      case 'start-prep':
        setStage('prep'); showSection('prep');
        $('[data-prep-started]').textContent = nowStr();
        document.querySelector('[data-section="prep"]').scrollIntoView({behavior:'smooth'});
        break;
      case 'auto-complete-prep':
        $$('[data-step]').forEach(s => s.classList.add('done')); updatePrepCount(); break;
      case 'move-to-deliver': moveToDeliver(); break;
      case 'open-activate-modal': openModal(); break;
      case 'confirm-activation': confirmActivation(); break;
      case 'scroll-prep':
        document.querySelector('[data-section="prep"]')?.scrollIntoView({behavior:'smooth'}); break;
    }
  });

  function showToast(msg) {
    let t = document.querySelector('.success-toast');
    if (!t) { t = document.createElement('div'); t.className = 'success-toast'; document.body.appendChild(t); }
    t.innerHTML = '<i class="fa-solid fa-circle-check"></i> ' + msg;
    requestAnimationFrame(() => t.classList.add('show'));
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove('show'), 3200);
  }
})();
