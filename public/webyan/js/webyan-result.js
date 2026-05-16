/* Webyan – Subscription/Payment Result page renderer
   Usage: <body data-result-state="success|pending|failed"> + script tag.
*/
(function () {
  'use strict';
  const D = window.WebyanDocs;
  const { mock, fmtSAR, pill, copyToClipboard, LABELS } = D;

  const STATES = {
    success: {
      icon: 'success',
      title: 'تم استلام دفعتكم بنجاح',
      text: 'شكرًا لاشتراككم في منصة ويبيان. تم تسجيل عملية الدفع بنجاح، وسيبدأ فريق ويبيان إجراءات مراجعة البيانات وتجهيز البيئة الفنية للمنصة. يمكنكم تحميل الفاتورة وسند القبض من هذه الصفحة، وسيتم إشعاركم فور اكتمال تفعيل الاشتراك.',
      paymentStatus: 'paid',
      invoiceStatus: 'paid',
      subscriptionStatus: 'pending_setup',
      setupStatus: 'pending',
      paymentMethod: 'moyasar',
      activeStep: 4,
      doneSteps: [0, 1, 2, 3]
    },
    pending: {
      icon: 'pending',
      title: 'تم إنشاء طلب الاشتراك',
      text: 'تم إصدار فاتورة اشتراك بانتظار السداد. يرجى تحويل المبلغ إلى الحساب البنكي الموضح أدناه، ثم رفع إيصال التحويل ليتم التحقق من العملية وتفعيل الاشتراك.',
      paymentStatus: 'pending',
      invoiceStatus: 'pending_payment',
      subscriptionStatus: 'pending_review',
      setupStatus: 'not_started',
      paymentMethod: 'bank_transfer',
      activeStep: 3,
      doneSteps: [0, 1, 2]
    },
    failed: {
      icon: 'failed',
      title: 'لم تكتمل عملية الدفع',
      text: 'لم نتمكن من تأكيد عملية الدفع. يمكنكم إعادة المحاولة باستخدام وسيلة دفع أخرى، أو اختيار التحويل البنكي لإكمال الاشتراك.',
      paymentStatus: 'failed',
      invoiceStatus: 'pending_payment',
      subscriptionStatus: 'pending_payment',
      setupStatus: 'not_started',
      paymentMethod: 'moyasar',
      activeStep: 2,
      doneSteps: [0, 1]
    }
  };

  const STEP_LABELS = ['اختيار الباقة', 'بيانات الاشتراك', 'الدفع', 'التحقق', 'التجهيز الفني', 'التفعيل'];

  function iconSvg(kind) {
    if (kind === 'success') return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
    if (kind === 'pending') return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
  }

  function renderStepper(active, done) {
    const items = STEP_LABELS.map((lab, i) => {
      const cls = done.includes(i) ? 'done' : (i === active ? 'active' : '');
      const inner = done.includes(i)
        ? '✓'
        : (i + 1);
      return `<div class="step ${cls}"><div class="dot">${inner}</div><div class="lab">${lab}</div></div>`;
    }).join('');
    return `<div class="doc-stepper"><div class="steps">${items}</div></div>`;
  }

  function row(k, v) { return `<div class="row"><span class="k">${k}</span><span class="v">${v}</span></div>`; }

  function renderHero(s) {
    return `<div class="result-hero">
      <div class="result-hero-top">
        <div class="result-icon ${s.icon}">${iconSvg(s.icon)}</div>
        <div>
          <h1>${s.title}</h1>
          <p>${s.text}</p>
        </div>
      </div>
      <div class="result-meta">
        <div class="item"><span class="lab">رقم الطلب</span><span class="val">${mock.subscription.orderNo}</span></div>
        <div class="item"><span class="lab">رقم الفاتورة</span><span class="val">${mock.invoice.no}</span></div>
        <div class="item"><span class="lab">حالة الدفع</span><span class="val">${pill(s.paymentStatus, 'paymentStatus')}</span></div>
        <div class="item"><span class="lab">حالة الاشتراك</span><span class="val">${pill(s.subscriptionStatus, 'subscriptionStatus')}</span></div>
        <div class="item"><span class="lab">حالة التجهيز الفني</span><span class="val">${pill(s.setupStatus, 'technicalSetupStatus')}</span></div>
        <div class="item"><span class="lab">طريقة الدفع</span><span class="val">${LABELS.paymentMethod[s.paymentMethod]}</span></div>
      </div>
    </div>`;
  }

  function renderCustomerCard() {
    const c = mock.customer;
    return `<div class="doc-card"><div class="doc-card-head"><h3>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      بيانات العميل</h3></div>
      <div class="doc-card-body"><div class="dlist">
        ${row('اسم الجهة', c.entity)}
        ${row('اسم المسؤول', c.contact)}
        ${row('البريد الإلكتروني', c.email)}
        ${row('رقم الجوال', c.phone)}
        ${row('الرقم الضريبي', c.vat)}
        ${row('تاريخ إنشاء الطلب', mock.invoice.issueDate)}
      </div></div></div>`;
  }

  function renderSubCard(s) {
    const sub = mock.subscription;
    return `<div class="doc-card"><div class="doc-card-head"><h3>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      بيانات الاشتراك</h3></div>
      <div class="doc-card-body"><div class="dlist">
        ${row('اسم الباقة', sub.plan)}
        ${row('مدة الاشتراك', sub.duration)}
        ${row('تاريخ بداية الاشتراك', s.paymentStatus === 'paid' ? mock.invoice.issueDate : '— بعد التفعيل —')}
        ${row('تاريخ نهاية الاشتراك', s.paymentStatus === 'paid' ? '12 شهرًا من تاريخ التفعيل' : '—')}
        ${row('حالة الاشتراك', pill(s.subscriptionStatus, 'subscriptionStatus'))}
        ${row('حالة التجهيز الفني', pill(s.setupStatus, 'technicalSetupStatus'))}
        ${row('رقم الطلب', sub.orderNo)}
        ${row('رقم الفاتورة', mock.invoice.no)}
      </div></div></div>`;
  }

  function renderInvoiceSummary() {
    const inv = mock.invoice;
    const rows = inv.items.map(it => `<tr>
      <td><div class="item-title">${it.title}</div><div class="item-desc">${it.desc}</div></td>
      <td class="num">${it.qty}</td>
      <td class="num">${fmtSAR(it.price)}</td>
      <td class="num">${it.discount ? fmtSAR(it.discount) : '—'}</td>
      <td class="num">${fmtSAR(it.tax)}</td>
      <td class="num"><b>${fmtSAR(it.total)}</b></td>
    </tr>`).join('');
    return `<div class="doc-card"><div class="doc-card-head"><h3>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      ملخص الفاتورة</h3>
      <a href="invoice.html" class="doc-btn outline" style="padding:6px 14px;font-size:.82rem;">عرض الفاتورة الكاملة ←</a>
      </div>
      <div class="doc-card-body" style="padding:0;">
        <table class="inv-table">
          <thead><tr><th>البند / الوصف</th><th class="num">الكمية</th><th class="num">السعر</th><th class="num">الخصم</th><th class="num">الضريبة</th><th class="num">الإجمالي</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <div style="padding:0 22px 22px;">
          <div class="totals"><div class="totals-box">
            <div class="row"><span>الإجمالي قبل الضريبة</span><span class="v">${fmtSAR(inv.subtotal)}</span></div>
            <div class="row"><span>الخصم</span><span class="v">- ${fmtSAR(inv.discount)}</span></div>
            <div class="row"><span>ضريبة القيمة المضافة (${inv.vatRate}%)</span><span class="v">${fmtSAR(inv.vat)}</span></div>
            <div class="row grand"><span>الإجمالي شامل الضريبة</span><span class="v">${fmtSAR(inv.grand)}</span></div>
            <div class="row"><span>المدفوع</span><span class="v">${fmtSAR(inv.paid)}</span></div>
            <div class="row"><span>المتبقي</span><span class="v">${fmtSAR(inv.due)}</span></div>
          </div></div>
        </div>
      </div></div>`;
  }

  function renderPaymentBlock() {
    const p = mock.payment;
    return `<div class="doc-card"><div class="doc-card-head"><h3>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
      بيانات الدفع</h3></div>
      <div class="doc-card-body"><div class="dlist">
        ${row('طريقة الدفع', LABELS.paymentMethod[p.method])}
        ${row('بوابة الدفع', p.gateway)}
        ${row('رقم العملية', p.txnNo)}
        ${row('تاريخ العملية', p.txnDate)}
        ${row('حالة العملية', pill('paid', 'paymentStatus'))}
        ${row('آخر 4 أرقام من البطاقة', '**** ' + p.cardLast4)}
        ${row('مرجع الدفع', p.reference)}
      </div></div></div>`;
  }

  function renderBankBlock() {
    const b = mock.bankAccount;
    return `<div class="doc-card"><div class="doc-card-head"><h3>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/></svg>
      بيانات التحويل البنكي</h3></div>
      <div class="doc-card-body">
        <div class="bank-card">
          <h4>${b.bank}</h4>
          <div class="bank-grid">
            <div class="it"><div class="lab">اسم المستفيد</div><div class="val">${b.holder}</div></div>
            <div class="it"><div class="lab">المبلغ المطلوب</div><div class="val">${fmtSAR(mock.invoice.grand)}</div></div>
            <div class="it"><div class="lab">رقم الحساب</div><div class="val">${b.account}</div></div>
            <div class="it"><div class="lab">رقم الفاتورة</div><div class="val">${mock.invoice.no}</div></div>
            <div class="it iban">
              <div class="lab">رقم الآيبان (IBAN)</div>
              <div class="val">${b.iban}
                <button class="copy-btn" data-copy="${b.iban.replace(/\s/g,'')}">نسخ</button>
              </div>
            </div>
          </div>
        </div>
        <label class="upload-box" style="margin-top:16px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <div class="t">رفع إيصال التحويل البنكي</div>
          <div class="s">PDF / JPG / PNG — الحد الأقصى 5MB</div>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onchange="this.parentElement.querySelector('.t').textContent='✓ ' + this.files[0].name">
        </label>
        <div class="doc-alert warn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <div><strong>تنبيه:</strong> سيتم تفعيل الاشتراك وإصدار سند القبض بعد اعتماد التحويل من الإدارة المالية.</div>
        </div>
      </div></div>`;
  }

  function renderNextSteps(s) {
    const items = [
      { t: 'مراجعة البيانات', d: 'مراجعة بيانات الجهة والباقة' },
      { t: 'تجهيز البيئة الفنية', d: 'استضافة، دومين، نسخة الموقع' },
      { t: 'تفعيل الاشتراك', d: 'إرسال بيانات الدخول وبدء فترة الاشتراك' }
    ];
    const doneIdx = s.paymentStatus === 'paid' ? 1 : 0;
    return `<div class="doc-card compact"><div class="doc-card-head"><h3>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
      الخطوات التالية</h3></div>
      <div class="doc-card-body"><div class="next-steps compact">
        ${items.map((it, i) => `<div class="next-step ${i < doneIdx ? 'done' : ''}">
          <div class="ns-num">${i < doneIdx ? '✓' : (i + 1)}</div>
          <div class="ns-body"><div class="ns-t">${it.t}</div><div class="ns-d">${it.d}</div></div>
        </div>`).join('')}
      </div></div></div>`;
  }

  function renderActions(s) {
    if (s.icon === 'success') {
      return `<div class="doc-actions-bar">
        <a href="invoice.html" target="_blank" class="doc-btn primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          الفاتورة الضريبية
        </a>
        <a href="invoice-simple.html" target="_blank" class="doc-btn outline">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          فاتورة الاشتراك
        </a>
        <a href="receipt.html" target="_blank" class="doc-btn cyan">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          سند القبض
        </a>
        <a href="contact.html" class="doc-btn ghost">التواصل مع الدعم</a>
      </div>`;
    }
    if (s.icon === 'pending') {
      return `<div class="doc-actions-bar">
        <a href="invoice.html" target="_blank" class="doc-btn primary">تحميل الفاتورة</a>
        <button class="doc-btn cyan" onclick="document.querySelector('.upload-box input').click()">رفع إيصال التحويل</button>
        <button class="doc-btn outline" data-copy="${mock.bankAccount.iban.replace(/\s/g,'')}">نسخ الآيبان</button>
        <a href="contact.html" class="doc-btn ghost">التواصل مع الدعم</a>
      </div>`;
    }
    return `<div class="doc-actions-bar">
      <a href="checkout.html" class="doc-btn primary">إعادة محاولة الدفع</a>
      <a href="checkout.html?method=bank" class="doc-btn cyan">اختيار التحويل البنكي</a>
      <a href="contact.html" class="doc-btn ghost">التواصل مع الدعم</a>
    </div>`;
  }

  function render() {
    const stateKey = document.body.dataset.resultState || 'success';
    const s = STATES[stateKey];
    const root = document.getElementById('resultRoot');
    let html = renderHero(s);
    html += renderStepper(s.activeStep, s.doneSteps);
    html += `<div class="doc-grid">
      <div class="col-6">${renderCustomerCard()}</div>
      <div class="col-6">${renderSubCard(s)}</div>
      <div class="col-12">${renderInvoiceSummary()}</div>`;
    if (s.paymentMethod === 'bank_transfer' && s.icon === 'pending') {
      html += `<div class="col-12">${renderBankBlock()}</div>`;
    }
    html += `<div class="col-12">${renderNextSteps(s)}</div>`;
    html += `<div class="col-12">${renderActions(s)}</div>`;
    html += `</div>`;
    root.innerHTML = html;

    // wire copy buttons
    root.querySelectorAll('[data-copy]').forEach(btn => {
      btn.addEventListener('click', () => copyToClipboard(btn.dataset.copy, btn));
    });
  }

  document.addEventListener('DOMContentLoaded', render);
})();
