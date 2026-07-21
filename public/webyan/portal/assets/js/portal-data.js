/* Mock data — realistic Webyan customer portal */
window.PortalData = {
  user: {
    name: 'علي الشيخ',
    org:  'جمعية افتراضية',
    role: 'المسؤول عن الحساب',
  },

  subscriptions: [
    {
      id: 'SUB-2026-0012',
      plan: 'باقة الاستدامة',
      planType: 'موقع إلكتروني',
      status: 'active',
      start: '2026-06-05',
      end:   '2027-06-04',
      cycle: 'سنوي',
      amount: '2,495 ر.س',
      pay: 'paid',
      domain: 'example.org.sa',
      domainStatus: 'active',
      domainStart: '2026-06-05',
      domainEnd:   '2027-06-04',
    },
    {
      id: 'SUB-2026-0031',
      plan: 'خدمة إضافية — تعبئة محتوى',
      planType: 'خدمة إضافية',
      status: 'in-progress',
      start: '2026-07-10',
      end:   '2026-08-10',
      cycle: 'مرة واحدة',
      amount: '650 ر.س',
      pay: 'awaiting',
      domain: 'example.org.sa',
      domainStatus: 'active',
    },
  ],

  projects: [
    {
      id: 'PRJ-2026-014',
      name: 'تجهيز موقع جمعية افتراضية',
      type: 'موقع إلكتروني',
      sub: 'SUB-2026-0012',
      domain: 'example.org.sa',
      stage: 'جاري تجهيز البيئة التقنية',
      progress: 45,
      created: '2026-06-05',
      updated: 'قبل ساعتين',
      status: 'in-progress',
    },
  ],

  /* 12 canonical stages */
  projectStages: [
    { key: 1,  label: 'تم استلام طلب الاشتراك',        state: 'done',    date: '2026-06-01' },
    { key: 2,  label: 'بانتظار تأكيد الدفع',           state: 'done',    date: '2026-06-01' },
    { key: 3,  label: 'تم تأكيد الدفع',                state: 'done',    date: '2026-06-02' },
    { key: 4,  label: 'مراجعة بيانات الجمعية',         state: 'done',    date: '2026-06-03' },
    { key: 5,  label: 'تجهيز البيئة التقنية',          state: 'current', date: '—' },
    { key: 6,  label: 'ربط الدومين والاستضافة',        state: 'upcoming' },
    { key: 7,  label: 'تجهيز القالب والمحتوى الأساسي', state: 'upcoming' },
    { key: 8,  label: 'مراجعة العميل',                  state: 'upcoming' },
    { key: 9,  label: 'التعديلات النهائية',             state: 'upcoming' },
    { key: 10, label: 'الإطلاق',                        state: 'upcoming' },
    { key: 11, label: 'التسليم والتفعيل',               state: 'upcoming' },
    { key: 12, label: 'نشط',                            state: 'upcoming' },
  ],

  invoices: [
    { id: 'INV-2026-0001', date: '2026-06-01', type: 'اشتراك',    sub: 'SUB-2026-0012', net: '2,169.57 ر.س', vat: '325.43 ر.س', total: '2,495.00 ر.س', pay: 'paid',     method: 'تحويل بنكي', paidOn: '2026-06-02' },
    { id: 'INV-2026-0002', date: '2026-07-10', type: 'خدمة إضافية', sub: 'SUB-2026-0031', net: '565.22 ر.س',   vat: '84.78 ر.س',  total: '650.00 ر.س',   pay: 'awaiting', method: 'تحويل بنكي', paidOn: '—' },
  ],

  services: [
    { id: 'SVC-2026-0001', service: 'تعبئة محتوى الموقع', sub: 'SUB-2026-0012', date: '2026-07-12', priority: 'medium', status: 'in-progress', updated: 'أمس' },
    { id: 'SVC-2026-0002', service: 'إضافة صفحة جديدة',   sub: 'SUB-2026-0012', date: '2026-07-15', priority: 'low',    status: 'new',         updated: 'اليوم' },
  ],

  /* Catalog of requestable services grouped by category */
  serviceCatalog: {
    'المحتوى': [
      { key: 'content-fill',   name: 'تعبئة محتوى الموقع',      icon: 'fa-file-lines' },
      { key: 'add-page',       name: 'إضافة صفحة جديدة',       icon: 'fa-plus' },
      { key: 'add-news',       name: 'إضافة خبر أو مقال',      icon: 'fa-newspaper' },
      { key: 'add-project',    name: 'إضافة مشروع أو مبادرة',   icon: 'fa-lightbulb' },
      { key: 'gov-docs',       name: 'رفع ملفات الحوكمة',      icon: 'fa-shield-halved' },
      { key: 'update-org',     name: 'تحديث بيانات الجمعية',   icon: 'fa-pen' },
    ],
    'التصميم': [
      { key: 'redesign-section', name: 'تعديل تصميم قسم',      icon: 'fa-paintbrush' },
      { key: 'custom-design',    name: 'طلب خدمة مخصصة',       icon: 'fa-sparkles' },
    ],
    'الدومين والاستضافة': [
      { key: 'link-domain',    name: 'ربط دومين',             icon: 'fa-link' },
      { key: 'renew-domain',   name: 'تجديد الدومين',         icon: 'fa-arrows-rotate' },
      { key: 'setup-mail',     name: 'تفعيل بريد رسمي',       icon: 'fa-at' },
      { key: 'setup-sendgrid', name: 'إعداد بريد SendGrid',   icon: 'fa-paper-plane' },
    ],
    'التكاملات': [
      { key: 'ga',       name: 'ربط Google Analytics',    icon: 'fa-chart-line' },
      { key: 'clarity',  name: 'ربط Microsoft Clarity',   icon: 'fa-chart-simple' },
      { key: 'form',     name: 'إضافة نموذج تواصل',       icon: 'fa-envelope-open-text' },
    ],
    'الدعم والتدريب': [
      { key: 'support',  name: 'دعم فني للموقع',          icon: 'fa-headset' },
      { key: 'training', name: 'تدريب على لوحة التحكم',   icon: 'fa-graduation-cap' },
    ],
    'الاشتراك': [
      { key: 'upgrade',  name: 'طلب ترقية الباقة',        icon: 'fa-arrow-up-right-dots' },
    ],
  },

  tickets: [
    { id: 'TCK-2026-0001', subject: 'مشكلة في ربط الدومين', type: 'domain',      sub: 'SUB-2026-0012', priority: 'high',   status: 'in-progress', reply: 'قبل 15 دقيقة' },
    { id: 'TCK-2026-0002', subject: 'استفسار عن الفاتورة',   type: 'billing',     sub: 'SUB-2026-0031', priority: 'medium', status: 'open',        reply: 'قبل ساعة' },
  ],

  messages: [
    { id: 'MSG-014', title: 'تم إصدار فاتورة جديدة',        type: 'invoice',      date: '2026-07-10 09:12', read: false },
    { id: 'MSG-013', title: 'تحديث مرحلة مشروعك',           type: 'project',      date: '2026-07-09 14:30', read: false },
    { id: 'MSG-012', title: 'تنبيه: دومينك ينتهي خلال 30 يوم', type: 'domain',   date: '2026-07-08 08:00', read: false },
    { id: 'MSG-011', title: 'رد فريق الدعم على تذكرتك',      type: 'ticket',       date: '2026-07-05 11:20', read: true },
    { id: 'MSG-010', title: 'رسالة ترحيب من فريق ويبيان',    type: 'general',      date: '2026-06-05 10:00', read: true },
  ],
};

/* Renderers */
window.PortalRender = {
  subStatus(s) {
    const m = {
      'active':      ['pbadge-active', 'نشط'],
      'awaiting-pay':['pbadge-review', 'بانتظار الدفع'],
      'in-progress': ['pbadge-open',   'قيد التجهيز'],
      'expired':     ['pbadge-closed', 'منتهي'],
      'suspended':   ['pbadge-rejected','موقوف'],
      'cancelled':   ['pbadge-closed', 'ملغي'],
    };
    const [cls, label] = m[s] || ['pbadge-plain', s];
    return `<span class="pbadge ${cls}">${label}</span>`;
  },
  payStatus(s) {
    const m = {
      'paid':      ['pbadge-active',  'مدفوعة'],
      'awaiting':  ['pbadge-review',  'بانتظار التحقق'],
      'unpaid':    ['pbadge-rejected','غير مدفوعة'],
      'late':      ['pbadge-late',    'متأخرة'],
      'cancelled': ['pbadge-closed',  'ملغاة'],
      'refunded':  ['pbadge-closed',  'مسترد'],
    };
    const [cls, label] = m[s] || ['pbadge-plain', s];
    return `<span class="pbadge ${cls}">${label}</span>`;
  },
  projStatus(s) {
    const m = {
      'new':         ['pbadge-new',    'جديد'],
      'in-progress': ['pbadge-open',   'قيد التنفيذ'],
      'review':      ['pbadge-review', 'قيد المراجعة'],
      'done':        ['pbadge-done',   'مكتمل'],
      'active':      ['pbadge-active', 'نشط'],
    };
    const [cls, label] = m[s] || ['pbadge-plain', s];
    return `<span class="pbadge ${cls}">${label}</span>`;
  },
  svcStatus(s) {
    const m = {
      'new':         ['pbadge-new',     'جديد'],
      'review':      ['pbadge-review',  'قيد المراجعة'],
      'accepted':    ['pbadge-open',    'مقبول'],
      'in-progress': ['pbadge-open',    'قيد التنفيذ'],
      'waiting':     ['pbadge-review',  'بانتظار ردك'],
      'done':        ['pbadge-done',    'مكتمل'],
      'rejected':    ['pbadge-rejected','مرفوض'],
      'cancelled':   ['pbadge-closed',  'ملغي'],
    };
    const [cls, label] = m[s] || ['pbadge-plain', s];
    return `<span class="pbadge ${cls}">${label}</span>`;
  },
  ticketStatus(s) {
    const m = {
      'open':        ['pbadge-open',    'مفتوحة'],
      'in-progress': ['pbadge-review',  'قيد المعالجة'],
      'waiting':     ['pbadge-review',  'بانتظار ردك'],
      'resolved':    ['pbadge-done',    'تم الحل'],
      'closed':      ['pbadge-closed',  'مغلقة'],
    };
    const [cls, label] = m[s] || ['pbadge-plain', s];
    return `<span class="pbadge ${cls}">${label}</span>`;
  },
  priority(p) {
    const m = {
      'low':    ['pbadge-closed',  'منخفضة'],
      'medium': ['pbadge-review',  'عادية'],
      'high':   ['pbadge-late',    'عالية'],
      'critical':['pbadge-rejected','حرجة'],
    };
    const [cls, label] = m[p] || ['pbadge-plain', p];
    return `<span class="pbadge ${cls}">${label}</span>`;
  },
  daysLeft(endISO) {
    const end = new Date(endISO);
    const diff = Math.ceil((end - new Date()) / 86400000);
    return diff;
  },
};
