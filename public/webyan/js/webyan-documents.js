/* Webyan – Documents shared mock data + helpers */
(function (global) {
  'use strict';

  const STATUS_LABELS = {
    paymentStatus: {
      paid: 'مدفوعة', pending: 'بانتظار التحويل', failed: 'فشل الدفع'
    },
    paymentMethod: {
      moyasar: 'بطاقة بنكية – ميسر', bank_transfer: 'تحويل بنكي'
    },
    invoiceStatus: {
      draft: 'مسودة', pending_payment: 'بانتظار السداد',
      paid: 'مدفوعة', cancelled: 'ملغاة', refunded: 'مستردة'
    },
    subscriptionStatus: {
      pending_payment: 'بانتظار الدفع',
      pending_review: 'بانتظار التحقق من الدفع',
      pending_setup: 'قيد التجهيز الفني',
      active: 'مفعلة', expired: 'منتهية', cancelled: 'ملغاة'
    },
    technicalSetupStatus: {
      not_started: 'لم يبدأ', pending: 'بانتظار المعالجة',
      in_progress: 'قيد التجهيز', completed: 'مكتمل'
    }
  };

  const STATUS_PILL_CLASS = {
    paid: 'success', paid_invoice: 'success', completed: 'success', active: 'success',
    pending: 'pending', pending_payment: 'pending', pending_review: 'pending',
    pending_setup: 'info', in_progress: 'info',
    failed: 'failed', cancelled: 'failed',
    not_started: 'muted', draft: 'muted', expired: 'muted'
  };

  // ── Mock dataset ───────────────────────────────────────
  const mock = {
    customer: {
      entity: 'جمعية البر الخيرية',
      contact: 'أ. خالد بن عبدالعزيز السبيعي',
      email: 'finance@albirr.org.sa',
      phone: '+966 55 123 4567',
      vat: '300012345600003',
      address: 'الرياض، حي العليا، شارع التحلية'
    },
    subscription: {
      orderNo: 'WBY-2026-04821',
      subNo: 'SUB-10238',
      plan: 'الباقة الاحترافية',
      duration: '12 شهرًا',
      startDate: '—',
      endDate: '—',
      status: 'pending_setup',
      setupStatus: 'pending'
    },
    invoice: {
      no: 'INV-2026-04821',
      issueDate: new Date().toLocaleDateString('ar-SA-u-nu-latn', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      dueDate: new Date(Date.now() + 7 * 86400000).toLocaleDateString('ar-SA-u-nu-latn', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      status: 'paid',
      items: [
        {
          title: 'اشتراك سنوي - الباقة الاحترافية',
          desc: 'موقع جمعية + بوابة تبرعات + متجر إلكتروني + لوحة تحكم متكاملة',
          qty: 1, price: 9600, discount: 600, tax: 1350, total: 10350
        },
        {
          title: 'ربط النطاق الخاص (Domain Setup)',
          desc: 'إعداد وربط النطاق الخاص بالجمعية مع شهادة SSL',
          qty: 1, price: 300, discount: 0, tax: 45, total: 345
        }
      ],
      subtotal: 9900,
      discount: 600,
      vatRate: 15,
      vat: 1395,
      grand: 10695,
      paid: 10695,
      due: 0
    },
    payment: {
      method: 'moyasar',
      gateway: 'ميسر — Moyasar',
      txnNo: 'mys_3f29a8bd4710ce',
      txnDate: new Date().toLocaleString('ar-SA-u-nu-latn'),
      cardLast4: '4242',
      status: 'paid',
      reference: 'REF-MYS-94781'
    },
    receipt: {
      no: 'RV-2026-04821',
      date: new Date().toLocaleDateString('ar-SA-u-nu-latn', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      status: 'معتمد'
    },
    bankAccount: {
      bank: 'البنك الأهلي السعودي (SNB)',
      holder: 'شركة رنين التنمية لخدمات الأعمال',
      account: '23800000123456',
      iban: 'SA03 8000 0000 6080 1016 7519',
      swift: 'NCBKSAJE'
    },
    issuer: {
      name: 'شركة رنين التنمية لخدمات الأعمال',
      nameEn: 'Raneen Development Company for Business Services',
      cr: '5900123106',
      vat: '312055396200003',
      address: 'الرياض، أبي بن معاذ الأنصاري، الربيع',
      email: 'hala@webyan.sa',
      phone: '+966 53 855 3400',
      website: 'www.webyan.sa'
    }
  };

  function fmtSAR(n) {
    return Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ر.س';
  }

  function pill(value, type) {
    const map = STATUS_LABELS[type] || {};
    const lab = map[value] || value;
    const cls = STATUS_PILL_CLASS[value] || 'muted';
    return `<span class="pill ${cls}">${lab}</span>`;
  }

  // Number to Arabic words (rounded, integer SAR portion)
  function numberToArabicWords(n) {
    const ones = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة',
                  'عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر',
                  'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
    const tens = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
    function below1000(num) {
      let s = '';
      const h = Math.floor(num / 100);
      const r = num % 100;
      const hundreds = ['', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];
      if (h) s += hundreds[h];
      if (r) {
        if (s) s += ' و';
        if (r < 20) s += ones[r];
        else {
          const u = r % 10, t = Math.floor(r / 10);
          if (u) s += ones[u] + ' و' + tens[t];
          else s += tens[t];
        }
      }
      return s;
    }
    if (n === 0) return 'صفر';
    let intPart = Math.floor(n);
    const frac = Math.round((n - intPart) * 100);
    let result = '';
    const thousands = Math.floor(intPart / 1000);
    const rest = intPart % 1000;
    if (thousands) {
      if (thousands === 1) result = 'ألف';
      else if (thousands === 2) result = 'ألفان';
      else if (thousands < 11) result = ones[thousands] + ' آلاف';
      else result = below1000(thousands) + ' ألف';
    }
    if (rest) result += (result ? ' و' : '') + below1000(rest);
    result += ' ريال سعودي';
    if (frac) result += ' و' + below1000(frac) + ' هللة';
    return result + ' فقط لا غير.';
  }

  function copyToClipboard(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = '✓ تم النسخ';
        setTimeout(() => btn.textContent = orig, 1600);
      }
    });
  }

  global.WebyanDocs = {
    mock, fmtSAR, pill, numberToArabicWords, copyToClipboard,
    LABELS: STATUS_LABELS
  };
})(window);
