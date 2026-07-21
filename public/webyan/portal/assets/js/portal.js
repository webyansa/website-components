/* Portal shell: sidebar injection, active state, modals, tabs, sidebar toggle */
(function () {
  'use strict';

  const NAV = [
    { key: 'dashboard',    label: 'لوحة التحكم',     icon: 'fa-gauge-high',       href: 'index.html' },
    { key: 'profile',      label: 'بيانات الجمعية',  icon: 'fa-building-user',    href: 'profile.html' },
    { key: 'subscriptions',label: 'اشتراكاتي',       icon: 'fa-crown',            href: 'subscriptions.html' },
    { key: 'projects',     label: 'مشاريعي',         icon: 'fa-diagram-project',  href: 'projects.html' },
    { key: 'invoices',     label: 'الفواتير',        icon: 'fa-file-invoice',     href: 'invoices.html',  badge: '1' },
    { key: 'services',     label: 'طلبات الخدمات',   icon: 'fa-hand-holding-heart',href: 'services.html' },
    { key: 'tickets',      label: 'تذاكر الدعم',     icon: 'fa-headset',          href: 'tickets.html',   badge: '2' },
    { key: 'messages',     label: 'الرسائل',          icon: 'fa-envelope',         href: 'messages.html',  badge: '3' },
    { key: 'settings',     label: 'الإعدادات',        icon: 'fa-gear',             href: 'settings.html' },
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
          <div class="plogo">و</div>
          <div>
            <h4>بوابة العملاء</h4>
            <small>منصة ويبيان</small>
          </div>
        </div>
        <nav class="psidebar-nav">${items}</nav>
        <div class="psidebar-footer">
          <a href="../index.html" class="psidebar-item">
            <i class="fa-solid fa-globe"></i>
            <span>العودة للموقع</span>
          </a>
          <a href="../login-portal.html" class="psidebar-item" style="color:var(--p-danger);">
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
          <a href="../index.html" class="pbtn pbtn-ghost pbtn-sm" title="العودة إلى موقع ويبيان" style="gap:6px;">
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
            <span class="ptopbar-site-label">الموقع الرئيسي</span>
          </a>
          <button class="ptopbar-icon-btn" title="الإشعارات"><i class="fa-solid fa-bell"></i><span class="pdot"></span></button>
          <a href="messages.html" class="ptopbar-icon-btn" title="الرسائل"><i class="fa-solid fa-envelope"></i></a>
          <div class="ptopbar-user">
            <div class="pavatar">ع</div>
            <div class="puser-info">
              <span class="puser-name">علي الشيخ</span>
              <span class="puser-role">جمعية افتراضية</span>
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
        if (e.target === overlay || e.target.hasAttribute('data-modal-close') ||
            e.target.closest('[data-modal-close]')) {
          overlay.classList.remove('is-open');
        }
      });
    });
  }

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

  document.addEventListener('DOMContentLoaded', () => {
    initShell();
    initModals();
    initTabs();
  });
})();
