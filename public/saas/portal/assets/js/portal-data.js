/* Mock data used by portal pages for demo purposes */
window.PortalData = {
  requests: [
    { id: 'REQ-2401', type: 'طلب منحة تشغيلية', date: '2026-07-14', status: 'review',   updated: 'قبل ساعتين' },
    { id: 'REQ-2398', type: 'استشارة حوكمة',    date: '2026-07-10', status: 'active',   updated: 'أمس' },
    { id: 'REQ-2391', type: 'برنامج تدريبي',    date: '2026-07-05', status: 'done',     updated: 'قبل 3 أيام' },
    { id: 'REQ-2384', type: 'طلب شراكة',        date: '2026-06-28', status: 'rejected', updated: 'قبل أسبوع' },
    { id: 'REQ-2377', type: 'طلب موارد',        date: '2026-06-22', status: 'new',      updated: 'قبل أسبوعين' },
    { id: 'REQ-2365', type: 'استشارة مالية',    date: '2026-06-15', status: 'done',     updated: 'قبل شهر' },
  ],
  projects: [
    { id: 'PRJ-121', name: 'تأهيل الأسر المنتجة', stage: 'التنفيذ',   progress: 68, start: '2026-04-01', end: '2026-12-31', status: 'active' },
    { id: 'PRJ-118', name: 'إفطار صائم 1447',    stage: 'الإغلاق',   progress: 100, start: '2026-02-01', end: '2026-04-30', status: 'done' },
    { id: 'PRJ-115', name: 'تمكين قيادي',        stage: 'التخطيط',   progress: 22, start: '2026-07-15', end: '2027-01-15', status: 'new' },
    { id: 'PRJ-112', name: 'حاضنة المشاريع الصغيرة', stage: 'التنفيذ', progress: 45, start: '2026-05-01', end: '2026-11-30', status: 'active' },
  ],
  tickets: [
    { id: 'TCK-882', subject: 'استفسار عن تجديد الاشتراك', priority: 'medium', status: 'open',   reply: 'قبل 15 دقيقة' },
    { id: 'TCK-879', subject: 'مشكلة في رفع الوثائق',      priority: 'high',   status: 'open',   reply: 'قبل ساعة' },
    { id: 'TCK-874', subject: 'طلب تعديل بيانات الممثل',   priority: 'low',    status: 'closed', reply: 'أمس' },
  ],
  meetings: [
    { title: 'اجتماع مراجعة الحوكمة',   date: '2026-07-22 10:00', with: 'فريق الاستشارات', mode: 'أونلاين' },
    { title: 'ورشة تطوير المشاريع',    date: '2026-07-25 13:00', with: 'مركز التدريب',    mode: 'حضوري' },
    { title: 'لقاء المتابعة الشهري',   date: '2026-08-01 09:30', with: 'مسؤول الحساب',   mode: 'أونلاين' },
  ],
  invoices: [
    { id: 'INV-2026-014', date: '2026-06-01', amount: '2,400 ر.س', status: 'done' },
    { id: 'INV-2026-013', date: '2026-05-01', amount: '2,400 ر.س', status: 'done' },
    { id: 'INV-2026-012', date: '2026-04-01', amount: '2,400 ر.س', status: 'done' },
  ],
};

/* Small renderer helpers */
window.PortalRender = {
  statusBadge(status) {
    const map = {
      new: 'pbadge-new جديد',
      review: 'pbadge-review قيد المراجعة',
      active: 'pbadge-active نشط',
      done: 'pbadge-done مكتمل',
      rejected: 'pbadge-rejected مرفوض',
      late: 'pbadge-late متأخر',
      open: 'pbadge-open مفتوح',
      closed: 'pbadge-closed مغلق',
    };
    const [cls, ...label] = (map[status] || 'pbadge-plain ' + status).split(' ');
    return `<span class="pbadge ${cls}">${label.join(' ')}</span>`;
  },
  priorityBadge(p) {
    const m = { high: ['pbadge-rejected','عالية'], medium: ['pbadge-review','متوسطة'], low: ['pbadge-closed','منخفضة'] };
    const [cls, label] = m[p] || ['pbadge-plain', p];
    return `<span class="pbadge ${cls}">${label}</span>`;
  }
};
