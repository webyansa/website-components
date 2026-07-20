/* Portal shell: sidebar injection, active state, modals, tabs, sidebar toggle */
(function () {
  'use strict';

  const NAV = [
    { key: 'dashboard',    label: 'لوحة التحكم',    icon: 'fa-gauge-high',           href: 'index.html' },
    { key: 'profile',      label: 'ملف الجمعية',     icon: 'fa-building-user',        href: 'profile.html' },
    { key: 'requests',     label: 'طلباتي',          icon: 'fa-file-lines',           href: 'requests.html',     badge: '4' },
    { key: 'projects',     label: 'مشاريعي',         icon: 'fa-diagram-project',      href: 'projects.html' },
    { key: 'tickets',      label: 'تذاكر الدعم',     icon: 'fa-headset',              href: 'tickets.html',      badge: '2' },
    { key: 'messages',     label: 'المحادثات',        icon: 'fa-comments',             href: 'messages.html' },
    { key: 'meetings',     label: 'الاجتماعات',       icon: 'fa-calendar-check',       href: 'meetings.html' },
    { key: 'subscription', label: 'الاشتراك',         icon: 'fa-crown',                href: 'subscription.html' },
    { key: 'settings',     label: 'الإعدادات',        icon: 'fa-gear',                 href: 'settings.html' },
  ];

  function buildSidebar(activeKey) {
    const items = NAV.map(n => `
      <a href="${n.href}" class="psidebar-item ${n.key === activeKey ? 'is-active' : ''}">
        <i class="fa-solid ${n.icon}"></i>
        <span>${n.label}</span>
        ${n.badge ? `<span class="pbadge pbadge-primary">${n.badge}</span>` : ''}
      </a>`).join('');

    return `
      <aside class="psidebar" id="psidebar">
        <div class="psidebar-brand">
          <div class="plogo">ت</div>
          <div>
            <h4>بوابة الجمعية</h4>
            <small>منصة تمكين</small>
          </div>
        </div>
        <nav class="psidebar-nav">
          <div class="psidebar-group-label">الرئيسية</div>
          ${items}
        </nav>
        <div class="psidebar-footer">
          <a href="../login.html" class="psidebar-item">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
            <span>تسجيل الخروج</span>
          </a>
        </div>
      </aside>
      <div class="psidebar-backdrop" id="psidebarBackdrop"></div>`;
  }

  function buildTopbar(title, subtitle) {
    return `
      <header class="ptopbar">
        <button class="psidebar-toggle" id="psidebarToggle" aria-label="القائمة">
          <i class="fa-solid fa-bars"></i>
        </button>
        <div class="ptopbar-title">
          ${title || ''}
          ${subtitle ? `<small>${subtitle}</small>` : ''}
        </div>
        <div class="ptopbar-actions">
          <button class="ptopbar-icon-btn" title="بحث"><i class="fa-solid fa-magnifying-glass"></i></button>
          <button class="ptopbar-icon-btn" title="الإشعارات"><i class="fa-solid fa-bell"></i><span class="pdot"></span></button>
          <button class="ptopbar-icon-btn" title="الرسائل"><i class="fa-solid fa-envelope"></i></button>
          <button class="ptopbar-icon-btn" title="المساعدة"><i class="fa-solid fa-circle-question"></i></button>
          <div class="ptopbar-user">
            <div class="pavatar">ج</div>
            <div class="puser-info">
              <span class="puser-name">جمعية العطاء الخيرية</span>
              <span class="puser-role">حساب مُوثّق</span>
            </div>
          </div>
        </div>
      </header>`;
  }

  function initShell() {
    const shell = document.querySelector('[data-portal-shell]');
    if (!shell) return;
    const page = shell.dataset.page || 'dashboard';
    const title = shell.dataset.title || '';
    const subtitle = shell.dataset.subtitle || '';

    const content = shell.innerHTML;
    shell.innerHTML = `
      ${buildSidebar(page)}
      <main class="pmain">
        ${buildTopbar(title, subtitle)}
        <div class="pcontent">${content}</div>
      </main>`;
    shell.classList.add('pshell');

    const sidebar = document.getElementById('psidebar');
    const backdrop = document.getElementById('psidebarBackdrop');
    const toggle = document.getElementById('psidebarToggle');
    if (toggle) toggle.addEventListener('click', () => {
      sidebar.classList.toggle('is-open');
      backdrop.classList.toggle('is-open');
    });
    if (backdrop) backdrop.addEventListener('click', () => {
      sidebar.classList.remove('is-open');
      backdrop.classList.remove('is-open');
    });
  }

  /* Modals */
  function initModals() {
    document.querySelectorAll('[data-modal-open]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-modal-open');
        const m = document.getElementById(id);
        if (m) m.classList.add('is-open');
      });
    });
    document.querySelectorAll('.pmodal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.hasAttribute('data-modal-close')) {
          overlay.classList.remove('is-open');
        }
      });
    });
  }

  /* Tabs */
  function initTabs() {
    document.querySelectorAll('[data-tabs]').forEach(group => {
      const tabs = group.querySelectorAll('.ptab');
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const target = tab.dataset.tab;
          tabs.forEach(t => t.classList.toggle('is-active', t === tab));
          const scope = group.dataset.tabs;
          document.querySelectorAll(`[data-tab-scope="${scope}"] .ptab-panel`).forEach(p => {
            p.classList.toggle('is-active', p.dataset.panel === target);
          });
        });
      });
    });
  }

  /* Stepper (used on register page) */
  window.PortalStepper = function (rootSelector) {
    const root = document.querySelector(rootSelector);
    if (!root) return null;
    const steps = root.querySelectorAll('.pstep');
    const panels = root.querySelectorAll('[data-step-panel]');
    let current = 0;

    function render() {
      steps.forEach((s, i) => {
        s.classList.toggle('is-active', i === current);
        s.classList.toggle('is-done', i < current);
      });
      panels.forEach((p, i) => p.style.display = i === current ? '' : 'none');
    }
    root.querySelectorAll('[data-step-next]').forEach(b => b.addEventListener('click', () => {
      if (current < steps.length - 1) { current++; render(); window.scrollTo({top:0,behavior:'smooth'}); }
    }));
    root.querySelectorAll('[data-step-prev]').forEach(b => b.addEventListener('click', () => {
      if (current > 0) { current--; render(); }
    }));
    render();
  };

  document.addEventListener('DOMContentLoaded', () => {
    initShell();
    initModals();
    initTabs();
  });
})();
