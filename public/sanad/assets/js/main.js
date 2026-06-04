/* قالب سند — السكربت الرئيسي */
(function () {
  "use strict";

  /* قائمة الجوال */
  const menuBtn = document.querySelector("[data-mobile-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const mobileOverlay = document.querySelector("[data-mobile-overlay]");
  const mobileClose = document.querySelector("[data-mobile-close]");
  const open = () => {
    mobileMenu?.classList.add("open");
    mobileOverlay?.classList.add("open");
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    mobileMenu?.classList.remove("open");
    mobileOverlay?.classList.remove("open");
    document.body.style.overflow = "";
  };
  menuBtn?.addEventListener("click", open);
  mobileClose?.addEventListener("click", close);
  mobileOverlay?.addEventListener("click", close);
  document.querySelectorAll("[data-mobile-menu] a").forEach((a) => a.addEventListener("click", close));

  /* الهيدر + زر العودة */
  const header = document.querySelector(".s-header");
  const toTop = document.querySelector(".s-to-top");
  const onScroll = () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 20);
    if (toTop) toTop.classList.toggle("show", window.scrollY > 500);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ظهور الأقسام */
  const ro = new IntersectionObserver(
    (es) => {
      es.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          ro.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 },
  );
  document.querySelectorAll(".reveal").forEach((el) => ro.observe(el));

  /* عداد الأرقام */
  const co = new IntersectionObserver(
    (es) => {
      es.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.getAttribute("data-counter"));
        const suffix = el.getAttribute("data-suffix") || "";
        const duration = 1800;
        const start = performance.now();
        const step = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = target * eased;
          const locale = el.getAttribute("data-locale") === "en" ? "en-US" : "ar-SA";
          const formatted = target % 1 === 0 ? Math.floor(val).toLocaleString(locale) : val.toFixed(1);
          el.textContent = formatted + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        co.unobserve(el);
      });
    },
    { threshold: 0.4 },
  );
  document.querySelectorAll("[data-counter]").forEach((c) => co.observe(c));

  /* أشرطة التقدم */
  const bo = new IntersectionObserver(
    (es) => {
      es.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const v = entry.target.getAttribute("data-progress");
        entry.target.style.width = v + "%";
        bo.unobserve(entry.target);
      });
    },
    { threshold: 0.4 },
  );
  document.querySelectorAll("[data-progress]").forEach((b) => bo.observe(b));

  /* سنة الفوتر */
  const y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();

  /* فلاتر المشاريع */
  const projGrid = document.querySelector("[data-projects-grid]");
  if (projGrid) {
    const state = { field: "all", status: "all", group: "all", q: "" };
    const items = Array.from(projGrid.querySelectorAll("[data-project]"));
    const apply = () => {
      const q = state.q.trim();
      items.forEach((el) => {
        const f = el.getAttribute("data-field") || "";
        const s = el.getAttribute("data-status") || "";
        const g = el.getAttribute("data-group") || "";
        const t = (el.getAttribute("data-title") || "").toLowerCase();
        const ok =
          (state.field === "all" || f.split(",").includes(state.field)) &&
          (state.status === "all" || s === state.status) &&
          (state.group === "all" || g.split(",").includes(state.group)) &&
          (!q || t.indexOf(q.toLowerCase()) !== -1);
        el.classList.toggle("is-hidden", !ok);
      });
      const empty = document.querySelector("[data-projects-empty]");
      if (empty)
        empty.classList.toggle(
          "is-hidden",
          items.some((i) => !i.classList.contains("is-hidden")),
        );
    };
    document.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-filter");
        const val = btn.getAttribute("data-value");
        state[key] = val;
        document.querySelectorAll(`[data-filter="${key}"]`).forEach((b) => b.classList.toggle("active", b === btn));
        apply();
      });
    });
    const search = document.querySelector("[data-projects-search]");
    if (search)
      search.addEventListener("input", (e) => {
        state.q = e.target.value;
        apply();
      });
  }
})();

/* =============================================
   بوابة التبرع — donation portal
   ============================================= */
(function () {
  "use strict";

  /* فلترة فئات التبرع */
  const dgrid = document.querySelector("[data-donations-grid]");
  if (dgrid) {
    const items = Array.from(dgrid.querySelectorAll("[data-donation]"));
    const filterCat = (cat) => {
      items.forEach((el) => {
        const cats = (el.getAttribute("data-cat") || "").split(",");
        el.classList.toggle("is-hidden", cat !== "all" && !cats.includes(cat));
      });
      const empty = document.querySelector("[data-donations-empty]");
      if (empty)
        empty.classList.toggle(
          "is-hidden",
          items.some((i) => !i.classList.contains("is-hidden")),
        );
    };
    document.querySelectorAll("[data-dfilter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-dfilter]").forEach((b) => b.classList.toggle("active", b === btn));
        filterCat(btn.getAttribute("data-dfilter"));
      });
    });
  }

  /* اختيار المبلغ داخل البطاقات والصفحة الجانبية */
  document.querySelectorAll("[data-amt-row]").forEach((row) => {
    const chips = row.querySelectorAll(".s-amt");
    const custom = row.querySelector(".s-amt-custom");
    // ابحث عن جميع عناصر [data-total] داخل أقرب لوحة أو البطاقة الجانبية
    const scope = row.closest("[data-dpanel]") || row.closest("[data-donation-card]") || row.parentElement;
    const totals = scope ? scope.querySelectorAll("[data-total]") : [];
    const setTotal = (v) => {
      const t = (Number(v) || 0).toLocaleString("ar-SA");
      totals.forEach((el) => (el.textContent = t));
    };
    chips.forEach((c) =>
      c.addEventListener("click", () => {
        chips.forEach((x) => x.classList.remove("active"));
        c.classList.add("active");
        if (custom) custom.value = "";
        setTotal(c.getAttribute("data-value"));
      }),
    );
    if (custom)
      custom.addEventListener("input", (e) => {
        chips.forEach((x) => x.classList.remove("active"));
        setTotal(e.target.value);
      });
  });

  /* خيارات الكفالة */
  document.querySelectorAll("[data-kafala]").forEach((grp) => {
    const opts = grp.querySelectorAll(".o");
    const costEl = grp.parentElement.querySelector("[data-kafala-cost]");
    opts.forEach((o) =>
      o.addEventListener("click", () => {
        opts.forEach((x) => x.classList.remove("active"));
        o.classList.add("active");
        if (costEl) costEl.textContent = o.getAttribute("data-cost");
      }),
    );
  });

  /* أشرطة التقدم في الهيرو */
  document.querySelectorAll("[data-dprog]").forEach((bar) => {
    const v = bar.getAttribute("data-dprog");
    setTimeout(() => (bar.style.width = v + "%"), 200);
  });

  /* Modals (donor info, privacy, payment, receipt) */
  const openModal = (id) => {
    const m = document.getElementById(id);
    if (m) {
      m.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  };
  const closeModal = (m) => {
    m.classList.remove("open");
    if (!document.querySelector(".s-modal-overlay.open")) document.body.style.overflow = "";
  };
  document.querySelectorAll("[data-open-modal]").forEach((b) =>
    b.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(b.getAttribute("data-open-modal"));
    }),
  );
  document.querySelectorAll(".s-modal-overlay").forEach((o) => {
    o.addEventListener("click", (e) => {
      if (e.target === o) closeModal(o);
    });
    o.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", () => closeModal(o)));
  });

  /* تبرع كفاعل خير → إخفاء الاسم والجوال */
  const anonBox = document.querySelector("[data-anon]");
  if (anonBox) {
    const nameF = document.querySelector("[data-donor-name]");
    const phoneF = document.querySelector("[data-donor-phone]");
    const submitBtn = document.querySelector("[data-donor-submit]");
    const notice = document.querySelector("[data-anon-notice]");
    anonBox.addEventListener("change", () => {
      const on = anonBox.checked;
      if (nameF) nameF.style.display = on ? "none" : "";
      if (phoneF) phoneF.style.display = on ? "none" : "";
      if (notice) notice.style.display = on ? "" : "none";
      if (submitBtn)
        submitBtn.innerHTML = on
          ? '<i class="fas fa-mask"></i> متابعة كفاعل خير'
          : '<i class="fas fa-arrow-left"></i> متابعة للدفع';
    });
  }

  /* الانتقال من بيانات المتبرع إلى الدفع */
  const goPay = document.querySelector("[data-go-pay]");
  if (goPay)
    goPay.addEventListener("click", (e) => {
      e.preventDefault();
      closeModal(document.getElementById("mDonor"));
      openModal("mPay");
    });

  /* إتمام الدفع → سند التبرع */
  const finishPay = document.querySelector("[data-finish-pay]");
  if (finishPay)
    finishPay.addEventListener("click", (e) => {
      e.preventDefault();
      // populate receipt with chosen data
      const anon = document.querySelector("[data-anon]")?.checked;
      const nm = document.querySelector("[data-donor-name] input")?.value;
      const ph = document.querySelector("[data-donor-phone] input")?.value;
      const amt = document.querySelector("[data-total]")?.textContent || "300";
      const rName = document.querySelector("[data-r-name]");
      const rPhone = document.querySelector("[data-r-phone]");
      const rAmt = document.querySelector("[data-r-amount]");
      const rDate = document.querySelector("[data-r-date]");
      const rNo = document.querySelector("[data-r-no]");
      if (rName) rName.textContent = anon ? "فاعل خير" : nm || "فاعل خير";
      if (rPhone) rPhone.textContent = anon ? "—" : ph || "—";
      if (rAmt) rAmt.textContent = amt;
      if (rDate) rDate.textContent = new Date().toLocaleDateString("ar-SA");
      if (rNo) rNo.textContent = "SANAD-2026-" + String(Math.floor(1000 + Math.random() * 9000));
      closeModal(document.getElementById("mPay"));
      openModal("mReceipt");
    });

  /* طباعة سند التبرع */
  document.querySelectorAll("[data-print-receipt]").forEach((b) => b.addEventListener("click", () => window.print()));
})();

/* =============================================
   مسارات التبرع المتقدمة — donation paths v2
   ============================================= */
(function () {
  "use strict";
  const card = document.querySelector("[data-donation-card]");
  if (!card) return;

  const oppName = card.getAttribute("data-opportunity") || "فرصة تبرع";
  const state = {
    type: "once", // once | recurring | gift
    method: "card", // card | mada | applepay | transfer
    freq: "monthly",
    methodLabels: { card: "بطاقة بنكية", mada: "مدى", applepay: "Apple Pay", transfer: "تحويل بنكي" },
    freqLabels: { daily: "يومي", weekly: "أسبوعي", monthly: "شهري", yearly: "سنوي" },
    freqLabelsReceipt: { daily: "يوميًا", weekly: "أسبوعيًا", monthly: "شهريًا", yearly: "سنويًا" },
    durLabels: { open: "مفتوحة", "3m": "3 أشهر", "6m": "6 أشهر", "12m": "سنة كاملة" },
    typeLabels: { once: "تبرع مرة واحدة", recurring: "تبرع دوري", gift: "إهداء تبرع" },
  };

  /* تبويبات مسارات التبرع */
  const tabs = card.querySelectorAll("[data-dtab]");
  const panels = card.querySelectorAll("[data-dpanel]");
  tabs.forEach((t) =>
    t.addEventListener("click", () => {
      state.type = t.getAttribute("data-dtab");
      tabs.forEach((x) => x.classList.toggle("active", x === t));
      panels.forEach((p) => p.classList.toggle("active", p.getAttribute("data-dpanel") === state.type));
    }),
  );

  /* segmented control: تكرار التبرع الدوري */
  const seg = card.querySelector('[data-seg="freq"]');
  if (seg) {
    const opts = seg.querySelectorAll(".s-seg-opt");
    opts.forEach((o) =>
      o.addEventListener("click", () => {
        opts.forEach((x) => x.classList.toggle("active", x === o));
        state.freq = o.getAttribute("data-value");
        updateRecurringSummary();
      }),
    );
  }

  const rdStart = card.querySelector("[data-rd-start]");
  const rdDur = card.querySelector("[data-rd-duration]");
  const sumFreq = card.querySelector("[data-rd-sum-freq]");
  const sumDate = card.querySelector("[data-rd-sum-date]");
  const sumDur = card.querySelector("[data-rd-sum-dur]");
  function updateRecurringSummary() {
    if (sumFreq) sumFreq.textContent = state.freqLabels[state.freq];
    if (sumDate)
      sumDate.textContent =
        rdStart && rdStart.value ? new Date(rdStart.value).toLocaleDateString("ar-SA") : "تاريخ اليوم";
    if (sumDur) sumDur.textContent = state.durLabels[rdDur ? rdDur.value : "open"];
  }
  rdStart?.addEventListener("change", updateRecurringSummary);
  rdDur?.addEventListener("change", updateRecurringSummary);
  // set today as default
  if (rdStart && !rdStart.value) {
    const t = new Date();
    rdStart.value = t.toISOString().slice(0, 10);
  }
  updateRecurringSummary();

  /* معاينة بطاقة الإهداء */
  const gpTo = card.querySelector("[data-gp-to]");
  const gpFrom = card.querySelector("[data-gp-from]");
  const gpMsg = card.querySelector("[data-gp-msg]");
  const gpAmt = card.querySelector("[data-gp-amount]");
  const gpAmtRow = card.querySelector("[data-gp-amount-row]");
  const giftTo = card.querySelector("[data-gift-to-name]");
  const giftFrom = card.querySelector("[data-gift-from-name]");
  const giftMsg = card.querySelector("[data-gift-msg]");
  const giftShowAmt = card.querySelector("[data-gift-show-amount]");
  const giftSchedule = card.querySelector("[data-gift-schedule]");
  const giftScheduleBox = card.querySelector(".s-gift-schedule");

  function updateGiftPreview() {
    if (gpTo) gpTo.textContent = (giftTo?.value || "").trim() || "—";
    if (gpFrom) gpFrom.textContent = (giftFrom?.value || "").trim() || "—";
    if (gpMsg) gpMsg.textContent = (giftMsg?.value || "").trim() || "تقبّل الله منكم صالح الأعمال";
    if (gpAmtRow) gpAmtRow.style.display = giftShowAmt && !giftShowAmt.checked ? "none" : "";
  }
  [giftTo, giftFrom, giftMsg, giftShowAmt].forEach((el) => el && el.addEventListener("input", updateGiftPreview));
  giftShowAmt?.addEventListener("change", updateGiftPreview);
  giftSchedule?.addEventListener("change", () => {
    if (giftScheduleBox) giftScheduleBox.style.display = giftSchedule.checked ? "grid" : "none";
  });

  /* مزامنة المبلغ في معاينة الإهداء (مرتبط بـ data-total النشط داخل لوحة الإهداء) */
  const giftPanel = card.querySelector('[data-dpanel="gift"]');
  if (giftPanel) {
    const obs = new MutationObserver(() => {
      const t = giftPanel.querySelector("[data-total]");
      if (t && gpAmt) gpAmt.textContent = t.textContent;
    });
    giftPanel
      .querySelectorAll("[data-total]")
      .forEach((t) => obs.observe(t, { childList: true, subtree: true, characterData: true }));
    // initial
    const t0 = giftPanel.querySelector("[data-total]");
    if (t0 && gpAmt) gpAmt.textContent = t0.textContent;
  }

  /* تبرع كفاعل خير لكل مسار — يضبط حالة المودال */
  function activeAnonChecked() {
    const map = { once: "[data-anon-once]", recurring: "[data-anon-recurring]", gift: "[data-anon-gift]" };
    const el = card.querySelector(map[state.type]);
    return !!(el && el.checked);
  }

  /* المبلغ النشط من اللوحة الحالية */
  function activeAmount() {
    const panel = card.querySelector(`[data-dpanel="${state.type}"]`);
    const t = panel?.querySelector("[data-total]");
    return t ? (t.textContent || "0").trim() : "0";
  }

  /* فتح المودالات */
  const openModal = (id) => {
    const m = document.getElementById(id);
    if (m) {
      m.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  };
  const closeModal = (m) => {
    m.classList.remove("open");
    if (!document.querySelector(".s-modal-overlay.open")) document.body.style.overflow = "";
  };

  /* أزرار إطلاق الدفع — توجيه حسب طريقة الدفع */
  card.querySelectorAll("[data-pay-launch]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      state.type = btn.getAttribute("data-pay-launch");
      state.method = btn.getAttribute("data-pay-method") || "card";
      const donorAnon = document.querySelector("#mDonor [data-anon]");
      if (donorAnon) {
        donorAnon.checked = activeAnonChecked();
        donorAnon.dispatchEvent(new Event("change"));
      }
      // تحويل بنكي → افتح مودال التحويل مباشرة، بقية الطرق → بيانات المتبرع
      if (state.method === "transfer") {
        // اضبط المبلغ في حقل التحويل من المسار النشط
        const trAmt = document.querySelector("[data-tr-amount]");
        if (trAmt && !trAmt.value) {
          trAmt.value = (activeAmount() || "").replace(/[^\d.]/g, "");
        }
        openModal("mTransfer");
      } else {
        openModal("mDonor");
      }
    });
  });

  /* فتح مودال الإهداء من الأزرار */
  document.querySelectorAll("[data-open-gift]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      state.type = "gift";
      state.method = "card";
      if (typeof window.__sanadGiftInit === "function") window.__sanadGiftInit();
      openModal("mGift");
    });
  });

  /* جسر — تغيير طريقة الدفع من مودال الإهداء */
  document.addEventListener("sanad:set-method", (e) => {
    if (e.detail && e.detail.method) state.method = e.detail.method;
  });

  /* تحديث ملخص الدفع قبل فتح مودال الدفع */
  const goPay = document.querySelector("[data-go-pay]");
  if (goPay) {
    goPay.addEventListener(
      "click",
      () => {
        const ps = {
          type: document.querySelector("[data-ps-type]"),
          freqRow: document.querySelector("[data-ps-freq-row]"),
          freq: document.querySelector("[data-ps-freq]"),
          giftRow: document.querySelector("[data-ps-gift-row]"),
          giftTo: document.querySelector("[data-ps-gift-to]"),
          method: document.querySelector("[data-ps-method]"),
          amount: document.querySelector("[data-ps-amount]"),
        };
        if (ps.type) ps.type.textContent = state.typeLabels[state.type];
        if (ps.method) ps.method.textContent = state.methodLabels[state.method];
        if (ps.amount) ps.amount.textContent = activeAmount();
        if (ps.freqRow) ps.freqRow.style.display = state.type === "recurring" ? "" : "none";
        if (ps.freq) ps.freq.textContent = state.freqLabels[state.freq];
        if (ps.giftRow) ps.giftRow.style.display = state.type === "gift" ? "" : "none";
        if (ps.giftTo) ps.giftTo.textContent = (giftTo?.value || "").trim() || "—";
      },
      true,
    ); // capture قبل المعالج القديم الذي يفتح mPay
  }

  /* تحديث سند التبرع بحسب نوع التبرع — يعمل بعد المعالج الأساسي */
  const finishBtn = document.querySelector("[data-finish-pay]");
  if (finishBtn) {
    finishBtn.addEventListener("click", () => {
      // اسم الفرصة / طريقة الدفع / نوع التبرع
      const setT = (sel, val) => {
        const el = document.querySelector(sel);
        if (el) el.textContent = val;
      };
      setT("[data-r-type]", state.typeLabels[state.type]);
      setT("[data-r-method]", state.methodLabels[state.method]);
      setT("[data-r-opp]", oppName);
      setT("[data-r-amount]", activeAmount());

      // عند فاعل خير: تأكد أن الاسم يظهر "فاعل خير"
      if (activeAnonChecked()) {
        setT("[data-r-name]", "فاعل خير");
        setT("[data-r-phone]", "—");
      }

      // كتلة التبرع الدوري
      const rdBlock = document.querySelector("[data-r-recurring-block]");
      if (rdBlock) {
        if (state.type === "recurring") {
          rdBlock.style.display = "";
          setT("[data-r-rd-freq]", state.freqLabelsReceipt[state.freq]);
          setT(
            "[data-r-rd-start]",
            rdStart && rdStart.value
              ? new Date(rdStart.value).toLocaleDateString("ar-SA")
              : new Date().toLocaleDateString("ar-SA"),
          );
          setT("[data-r-rd-dur]", state.durLabels[rdDur ? rdDur.value : "open"]);
          setT("[data-r-rd-no]", "RD-2026-" + String(Math.floor(1000 + Math.random() * 9000)));
        } else {
          rdBlock.style.display = "none";
        }
      }

      // كتلة الإهداء
      const gBlock = document.querySelector("[data-r-gift-block]");
      if (gBlock) {
        if (state.type === "gift") {
          const gs = window.__sanadGift || {};
          gBlock.style.display = "";
          setT(
            "[data-r-gift-to]",
            gs.recipients && gs.recipients.length ? gs.recipients.map((r) => r.name || "—").join(" • ") : "—",
          );
          setT("[data-r-gift-from]", gs.anon ? "فاعل خير" : gs.fromName || "—");
          setT("[data-r-gift-msg]", gs.msg || "—");
          setT("[data-r-gift-show]", gs.showAmount ? "نعم" : "لا");
          const dateRow = document.querySelector("[data-r-gift-date-row]");
          if (dateRow) {
            if (gs.schedule) {
              dateRow.style.display = "";
              setT(
                "[data-r-gift-date]",
                (gs.date ? new Date(gs.date).toLocaleDateString("ar-SA") : "—") + (gs.time ? " • " + gs.time : ""),
              );
            } else {
              dateRow.style.display = "none";
            }
          }
          // اظهر الإجمالي الكلي عند تعدد المستلمين
          if (gs.recipients && gs.recipients.length > 1 && gs.perAmount) {
            setT("[data-r-amount]", String(gs.perAmount * gs.recipients.length));
          }
        } else {
          gBlock.style.display = "none";
        }
      }
    });
  }

  /* مشاركة السند */
  document.querySelectorAll("[data-share-receipt]").forEach((b) =>
    b.addEventListener("click", () => {
      const txt = "سند تبرع — جمعية سَنَد";
      if (navigator.share) {
        navigator.share({ title: txt, text: txt, url: location.href }).catch(() => {});
      } else {
        navigator.clipboard?.writeText(location.href);
        b.innerHTML = '<i class="fas fa-check"></i> تم نسخ الرابط';
      }
    }),
  );
})();

/* =============================================
   مودال الإهداء + التحويل البنكي + النسخ + الرفع — v3
   ============================================= */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* فتح/إغلاق عام (نسخة محلية للاعتمادية) */
  const openModal = (id) => {
    const m = document.getElementById(id);
    if (m) {
      m.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  };
  const closeModal = (m) => {
    m.classList.remove("open");
    if (!document.querySelector(".s-modal-overlay.open")) document.body.style.overflow = "";
  };

  /* ====== أزرار النسخ ====== */
  $$("[data-copy]").forEach((btn) =>
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const val = btn.getAttribute("data-copy") || "";
      try {
        await navigator.clipboard.writeText(val);
      } catch (_) {}
      const old = btn.innerHTML;
      btn.classList.add("copied");
      btn.innerHTML = '<i class="fas fa-check"></i>';
      setTimeout(() => {
        btn.classList.remove("copied");
        btn.innerHTML = old;
      }, 1400);
    }),
  );

  /* ====== مودال التحويل البنكي ====== */
  const trFile = $("[data-tr-file]");
  const trFname = $("[data-tr-fname]");
  if (trFile) {
    trFile.addEventListener("change", () => {
      const f = trFile.files && trFile.files[0];
      if (f && trFname) {
        trFname.style.display = "";
        trFname.innerHTML = '<i class="fas fa-file-circle-check"></i> ' + f.name;
      }
    });
  }
  // تاريخ افتراضي = اليوم
  const trDate = $("[data-tr-date]");
  if (trDate && !trDate.value) {
    trDate.value = new Date().toISOString().slice(0, 10);
  }

  const finishTransfer = $("[data-finish-transfer]");
  if (finishTransfer) {
    finishTransfer.addEventListener("click", (e) => {
      e.preventDefault();
      const amt = ($("[data-tr-amount]")?.value || "0").trim() || "0";
      const name = ($("[data-tr-name]")?.value || "").trim();
      const phone = ($("[data-tr-phone]")?.value || "").trim();
      const anon = $("[data-tr-anon]")?.checked;
      const setT = (sel, val) => {
        const el = document.querySelector(sel);
        if (el) el.textContent = val;
      };
      // الفرصة + المعرفات الأساسية
      const card = $("[data-donation-card]");
      const oppName = card?.getAttribute("data-opportunity") || "فرصة تبرع";
      setT("[data-r-no]", "SANAD-TR-2026-" + String(Math.floor(1000 + Math.random() * 9000)));
      setT("[data-r-date]", new Date().toLocaleDateString("ar-SA"));
      setT("[data-r-type]", "تبرع بتحويل بنكي");
      setT("[data-r-name]", anon ? "فاعل خير" : name || "فاعل خير");
      setT("[data-r-phone]", anon ? "—" : phone || "—");
      setT("[data-r-opp]", oppName);
      setT("[data-r-method]", "تحويل بنكي");
      setT("[data-r-amount]", Number(amt).toLocaleString("ar-SA"));
      // إخفاء كتل خاصة بالإهداء/الدوري
      const rd = $("[data-r-recurring-block]");
      if (rd) rd.style.display = "none";
      const gb = $("[data-r-gift-block]");
      if (gb) gb.style.display = "none";
      closeModal($("#mTransfer"));
      openModal("mReceipt");
    });
  }

  /* ====== مودال الإهداء ====== */
  const giftModal = $("#mGift");
  if (!giftModal) return;

  const recipBox = $("[data-gift-recipients]", giftModal);
  const addBtn = $("[data-gift-add]", giftModal);
  const fromName = $("[data-gm-from-name]", giftModal);
  const fromPhone = $("[data-gm-from-phone]", giftModal);
  const msgEl = $("[data-gm-msg]", giftModal);
  const showAmtEl = $("[data-gm-show-amount]", giftModal);
  const scheduleEl = $("[data-gm-schedule]", giftModal);
  const scheduleBox = $("[data-gm-schedule-box]", giftModal);
  const dateEl = $("[data-gm-date]", giftModal);
  const timeEl = $("[data-gm-time]", giftModal);
  const anonEl = $("[data-gm-anon]", giftModal);
  const amtRow = $("[data-gm-amt-row]", giftModal);
  const totalEl = $("[data-gm-total]", giftModal);
  const countEl = $("[data-gm-count]", giftModal);
  const grandEl = $("[data-gm-grand]", giftModal);
  const pvTo = $("[data-gm-pv-to]", giftModal);
  const pvFrom = $("[data-gm-pv-from]", giftModal);
  const pvMsg = $("[data-gm-pv-msg]", giftModal);
  const pvAmt = $("[data-gm-pv-amount]", giftModal);
  const pvAmtRow = $("[data-gm-pv-amount-row]", giftModal);
  const continueBtn = $("[data-gm-continue]", giftModal);

  let payMethod = "card";
  $$("[data-gm-pay]", giftModal).forEach((b) =>
    b.addEventListener("click", () => {
      $$("[data-gm-pay]", giftModal).forEach((x) => {
        x.classList.toggle("primary", x === b);
        x.classList.toggle("active", x === b);
      });
      payMethod = b.getAttribute("data-gm-pay");
    }),
  );

  function recipientTpl(idx) {
    const div = document.createElement("div");
    div.className = "s-recip";
    div.innerHTML = `
      <span class="s-recip-index">${idx}</span>
      <div class="s-field"><label>اسم المُهدى إليه</label><input type="text" class="s-input" data-r-name placeholder="الاسم" /></div>
      <div class="s-field"><label>رقم الجوال</label><input type="tel" class="s-input" data-r-phone placeholder="05XXXXXXXX" /></div>
      <button type="button" class="s-recip-del" title="حذف"><i class="fas fa-trash"></i></button>
    `;
    div.querySelector(".s-recip-del").addEventListener("click", () => {
      if (recipBox.children.length <= 1) return;
      div.remove();
      reindex();
      updatePreview();
    });
    div.querySelectorAll("input").forEach((i) => i.addEventListener("input", updatePreview));
    return div;
  }
  function reindex() {
    Array.from(recipBox.children).forEach((c, i) => {
      const s = c.querySelector(".s-recip-index");
      if (s) s.textContent = i + 1;
    });
  }
  function addRecipient() {
    recipBox.appendChild(recipientTpl(recipBox.children.length + 1));
    updatePreview();
  }
  addBtn?.addEventListener("click", addRecipient);

  function getRecipients() {
    return Array.from(recipBox.querySelectorAll(".s-recip")).map((r) => ({
      name: (r.querySelector("[data-r-name]")?.value || "").trim(),
      phone: (r.querySelector("[data-r-phone]")?.value || "").trim(),
    }));
  }
  function currentAmount() {
    const a = amtRow?.querySelector(".s-amt.active");
    const c = amtRow?.querySelector(".s-amt-custom");
    if (c && c.value) return Number(c.value) || 0;
    if (a) return Number(a.getAttribute("data-value")) || 0;
    return 0;
  }
  function updatePreview() {
    const recips = getRecipients();
    const per = currentAmount();
    const count = Math.max(1, recips.length);
    if (totalEl) totalEl.textContent = per.toLocaleString("ar-SA");
    if (countEl) countEl.textContent = count;
    if (grandEl) grandEl.textContent = (per * count).toLocaleString("ar-SA");
    if (pvTo) pvTo.textContent = recips[0]?.name || "—";
    if (pvFrom) pvFrom.textContent = (anonEl?.checked ? "فاعل خير" : (fromName?.value || "").trim()) || "—";
    if (pvMsg) pvMsg.textContent = (msgEl?.value || "").trim() || "تقبّل الله منكم صالح الأعمال";
    if (pvAmt) pvAmt.textContent = per.toLocaleString("ar-SA");
    if (pvAmtRow) pvAmtRow.style.display = showAmtEl && !showAmtEl.checked ? "none" : "";
  }

  // ربط تحديثات
  [fromName, fromPhone, msgEl, showAmtEl, anonEl].forEach((el) => el && el.addEventListener("input", updatePreview));
  showAmtEl?.addEventListener("change", updatePreview);
  anonEl?.addEventListener("change", updatePreview);
  scheduleEl?.addEventListener("change", () => {
    if (scheduleBox) scheduleBox.style.display = scheduleEl.checked ? "grid" : "none";
  });
  // chips amount
  amtRow?.querySelectorAll(".s-amt").forEach((c) => c.addEventListener("click", () => setTimeout(updatePreview, 0)));
  amtRow?.querySelector(".s-amt-custom")?.addEventListener("input", updatePreview);

  // Initialize (also exposed)
  window.__sanadGiftInit = function () {
    if (recipBox && recipBox.children.length === 0) addRecipient();
    updatePreview();
  };
  window.__sanadGiftInit();

  /* متابعة الإهداء — يخزّن الحالة ثم يفتح بقية المسار */
  continueBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    const recips = getRecipients().filter((r) => r.name || r.phone);
    if (!recips.length) {
      // اطلب اسم واحد على الأقل
      const first = recipBox.querySelector("[data-r-name]");
      if (first) {
        first.focus();
        first.style.borderColor = "#b3261e";
        setTimeout(() => (first.style.borderColor = ""), 1600);
      }
      return;
    }
    const per = currentAmount() || 0;
    window.__sanadGift = {
      recipients: recips,
      fromName: (fromName?.value || "").trim(),
      fromPhone: (fromPhone?.value || "").trim(),
      msg: (msgEl?.value || "").trim() || "تقبّل الله منكم صالح الأعمال",
      showAmount: !!showAmtEl?.checked,
      schedule: !!scheduleEl?.checked,
      date: dateEl?.value || "",
      time: timeEl?.value || "",
      anon: !!anonEl?.checked,
      perAmount: per,
      totalAmount: per * recips.length,
      method: payMethod,
    };
    // وفّر متغير الحالة العام
    window.__sanadDonation = window.__sanadDonation || {};
    window.__sanadDonation.type = "gift";
    window.__sanadDonation.method = payMethod;
    document.dispatchEvent(new CustomEvent("sanad:set-method", { detail: { method: payMethod } }));

    closeModal(giftModal);

    if (payMethod === "transfer") {
      // املأ المبلغ ثم افتح مودال التحويل
      const trAmt = $("[data-tr-amount]");
      if (trAmt) trAmt.value = window.__sanadGift.totalAmount;
      const trName = $("[data-tr-name]");
      if (trName && !trName.value) trName.value = window.__sanadGift.fromName;
      const trPhone = $("[data-tr-phone]");
      if (trPhone && !trPhone.value) trPhone.value = window.__sanadGift.fromPhone;
      openModal("mTransfer");
    } else {
      // بطاقة بنكية → مودال المتبرع → الدفع → السند
      const donorAnon = document.querySelector("#mDonor [data-anon]");
      if (donorAnon) {
        donorAnon.checked = window.__sanadGift.anon;
        donorAnon.dispatchEvent(new Event("change"));
      }
      // اضبط حقول المتبرع باسم المُهدي
      const dn = document.querySelector("#mDonor [data-donor-name] input");
      const dp = document.querySelector("#mDonor [data-donor-phone] input");
      if (dn && !dn.value) dn.value = window.__sanadGift.fromName;
      if (dp && !dp.value) dp.value = window.__sanadGift.fromPhone;
      openModal("mDonor");
    }
  });
})();

/* ============ STORE (Sanad) ============ */
(function () {
  const LS_KEY = "sanad_cart_v1";
  const ORDER_KEY = "sanad_last_order";
  const fmt = (n) => Number(n).toLocaleString("ar-SA") + " ر.س";
  function read() {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY)) || [];
    } catch (e) {
      return [];
    }
  }
  function write(c) {
    localStorage.setItem(LS_KEY, JSON.stringify(c));
    updateBadges();
  }
  function updateBadges() {
    const c = read();
    const n = c.reduce((s, i) => s + (i.qty || 1), 0);
    document.querySelectorAll("[data-cart-count]").forEach((el) => {
      el.textContent = n;
      el.style.display = n > 0 ? "inline-flex" : "none";
    });
  }
  window.sanadStore = {
    add(item) {
      const c = read();
      const ex = c.find((x) => x.id === item.id);
      if (ex) {
        ex.qty = (ex.qty || 1) + (item.qty || 1);
      } else {
        c.push(Object.assign({ qty: 1 }, item));
      }
      write(c);
      toast("تمت إضافة المنتج للسلة");
    },
    remove(id) {
      write(read().filter((x) => x.id !== id));
      renderCart();
    },
    setQty(id, q) {
      const c = read();
      const it = c.find((x) => x.id === id);
      if (it) {
        it.qty = Math.max(1, parseInt(q) || 1);
      }
      write(c);
      renderCart();
    },
    get() {
      return read();
    },
    clear() {
      localStorage.removeItem(LS_KEY);
      updateBadges();
    },
    saveOrder(o) {
      localStorage.setItem(ORDER_KEY, JSON.stringify(o));
    },
    getOrder() {
      try {
        return JSON.parse(localStorage.getItem(ORDER_KEY));
      } catch (e) {
        return null;
      }
    },
  };
  function toast(msg) {
    let t = document.getElementById("st-toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "st-toast";
      t.style.cssText =
        "position:fixed;bottom:30px;right:30px;background:#0d7a4f;color:#fff;padding:14px 22px;border-radius:14px;font-weight:700;z-index:9999;box-shadow:0 14px 30px rgba(0,0,0,.25);transition:.3s;opacity:0;transform:translateY(10px);";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    requestAnimationFrame(() => {
      t.style.opacity = "1";
      t.style.transform = "translateY(0)";
    });
    clearTimeout(t._h);
    t._h = setTimeout(() => {
      t.style.opacity = "0";
      t.style.transform = "translateY(10px);";
    }, 2200);
  }
  window.sanadToast = toast;

  // Store page filters
  function bindStore() {
    const grid = document.getElementById("st-grid");
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll("[data-st-item]"));
    const search = document.getElementById("st-search");
    const type = document.getElementById("st-type");
    const price = document.getElementById("st-price");
    const status = document.getElementById("st-status");
    const sort = document.getElementById("st-sort");
    const cats = document.querySelectorAll("[data-st-cat]");
    let cat = "all";
    function apply() {
      const q = (search?.value || "").trim();
      const t = type?.value || "all";
      const p = price?.value || "all";
      const s = status?.value || "all";
      const so = sort?.value || "new";
      let visible = cards.filter((c) => {
        const ct = c.dataset.type;
        const pr = parseInt(c.dataset.price || 0);
        const st = c.dataset.status || "";
        if (cat !== "all" && cat !== "featured" && cat !== "new" && cat !== "top" && ct !== cat) return false;
        if (cat === "new" && !st.includes("new")) return false;
        if (cat === "top" && !st.includes("top")) return false;
        if (t !== "all" && ct !== t) return false;
        if (p === "lt100" && !(pr < 100)) return false;
        if (p === "100-300" && !(pr >= 100 && pr <= 300)) return false;
        if (p === "gt300" && !(pr > 300)) return false;
        if (s !== "all" && !st.includes(s)) return false;
        if (q && !c.dataset.name.includes(q)) return false;
        return true;
      });
      cards.forEach((c) => (c.style.display = "none"));
      visible.sort((a, b) => {
        if (so === "priceAsc") return a.dataset.price - b.dataset.price;
        if (so === "priceDesc") return b.dataset.price - a.dataset.price;
        if (so === "top") return (b.dataset.orders || 0) - (a.dataset.orders || 0);
        return 0;
      });
      visible.forEach((c) => (c.style.display = ""));
      const empty = document.getElementById("st-empty");
      if (empty) empty.style.display = visible.length ? "none" : "block";
    }
    cats.forEach((b) =>
      b.addEventListener("click", () => {
        cats.forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
        cat = b.dataset.stCat;
        apply();
      }),
    );
    [search, type, price, status, sort].forEach((el) => el && el.addEventListener("input", apply));
    document.getElementById("st-reset")?.addEventListener("click", () => {
      if (search) search.value = "";
      if (type) type.value = "all";
      if (price) price.value = "all";
      if (status) status.value = "all";
      if (sort) sort.value = "new";
      cats.forEach((x) => x.classList.remove("active"));
      document.querySelector('[data-st-cat="all"]')?.classList.add("active");
      cat = "all";
      apply();
    });
    grid.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-st-add]");
      if (!btn) return;
      const c = btn.closest("[data-st-item]");
      window.sanadStore.add({
        id: c.dataset.id,
        name: c.dataset.name,
        price: +c.dataset.price,
        type: c.dataset.type,
        img: c.dataset.img,
        url: c.dataset.url,
      });
    });
    apply();
  }

  // Product detail buy
  function bindDetail() {
    document.querySelectorAll("[data-st-buy]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const d = btn.dataset;
        const qty = parseInt(document.querySelector("[data-st-qty-input]")?.value || 1);
        window.sanadStore.add({ id: d.id, name: d.name, price: +d.price, type: d.type, img: d.img, url: d.url, qty });
        if (btn.dataset.stBuy === "now") {
          window.location = "cart.html";
        }
      });
    });
    document.querySelectorAll("[data-st-qty]").forEach((q) => {
      const input = q.querySelector("input");
      q.querySelector('[data-q="-"]').addEventListener("click", () => {
        input.value = Math.max(1, (+input.value || 1) - 1);
      });
      q.querySelector('[data-q="+"]').addEventListener("click", () => {
        input.value = (+input.value || 1) + 1;
      });
    });
    document.querySelectorAll("[data-st-thumb]").forEach((t) => {
      t.addEventListener("click", () => {
        const main = document.querySelector("[data-st-main-img]");
        if (main) {
          main.src = t.querySelector("img").src;
        }
        document.querySelectorAll("[data-st-thumb]").forEach((x) => x.classList.remove("active"));
        t.classList.add("active");
      });
    });
  }

  // Cart page
  function renderCart() {
    const list = document.getElementById("st-cart-list");
    if (!list) return;
    const c = read();
    const empty = document.getElementById("st-cart-empty");
    const summary = document.getElementById("st-cart-summary");
    if (!c.length) {
      list.innerHTML = "";
      if (empty) empty.style.display = "block";
      if (summary) summary.style.display = "none";
      return;
    }
    if (empty) empty.style.display = "none";
    if (summary) summary.style.display = "";
    list.innerHTML = c
      .map(
        (i) => `
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
          <div class="text-lg font-extrabold text-sanad-emeraldDeep">${fmt(i.price * i.qty)}</div>
          <div class="text-xs text-sanad-muted">${fmt(i.price)} × ${i.qty}</div>
        </div>
      </div>`,
      )
      .join("");
    const sub = c.reduce((s, i) => s + i.price * i.qty, 0);
    const vat = Math.round(sub * 0.15);
    const total = sub + vat;
    document.getElementById("st-sub") && (document.getElementById("st-sub").textContent = fmt(sub));
    document.getElementById("st-vat") && (document.getElementById("st-vat").textContent = fmt(vat));
    document.getElementById("st-total") && (document.getElementById("st-total").textContent = fmt(total));
  }
  function typeLabel(t) {
    return (
      { physical: "منتج ملموس", digital: "منتج رقمي", service: "خدمة", course: "دورة", impact: "منتج أثر" }[t] || "منتج"
    );
  }
  window.renderCart = renderCart;

  // Checkout
  function bindCheckout() {
    const form = document.getElementById("st-checkout-form");
    if (!form) return;
    const c = read();
    // summary
    const sumBox = document.getElementById("st-co-summary");
    if (sumBox) {
      const sub = c.reduce((s, i) => s + i.price * i.qty, 0);
      const vat = Math.round(sub * 0.15);
      const total = sub + vat;
      sumBox.innerHTML =
        c
          .map(
            (i) =>
              `<div class="flex justify-between text-sm py-2 border-b border-dashed border-sanad-border"><span>${i.name} × ${i.qty}</span><span class="font-bold">${fmt(i.price * i.qty)}</span></div>`,
          )
          .join("") +
        `<div class="flex justify-between text-sm pt-3"><span>المجموع</span><span>${fmt(sub)}</span></div>
         <div class="flex justify-between text-sm py-1"><span>الضريبة (15%)</span><span>${fmt(vat)}</span></div>
         <div class="flex justify-between text-lg font-extrabold text-sanad-emeraldDeep pt-2 border-t border-sanad-border mt-2"><span>الإجمالي</span><span>${fmt(total)}</span></div>`;
    }
    // delivery option depends on types
    const hasPhys = c.some((i) => i.type === "physical" || i.type === "impact");
    const hasDig = c.some((i) => i.type === "digital");
    const hasSrv = c.some((i) => i.type === "service" || i.type === "course");
    document.querySelectorAll("[data-st-deliv]").forEach((opt) => {
      const k = opt.dataset.stDeliv;
      const show =
        k === "ship" || k === "pickup" ? hasPhys : k === "download" ? hasDig : k === "service" ? hasSrv : true;
      opt.style.display = show ? "" : "none";
    });
    // pay options
    document.querySelectorAll(".st-pay-opt").forEach((o) => {
      o.addEventListener("click", () => {
        document.querySelectorAll(".st-pay-opt").forEach((x) => x.classList.remove("active"));
        o.classList.add("active");
        o.querySelector("input").checked = true;
      });
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const order = {
        id: "ORD-2026-" + String(Math.floor(1000 + Math.random() * 9000)),
        name: fd.get("name") || "عميل سَنَد",
        email: fd.get("email") || "",
        phone: fd.get("phone") || "",
        items: c,
        delivery: fd.get("delivery") || "",
        payment: fd.get("payment") || "card",
        sub: c.reduce((s, i) => s + i.price * i.qty, 0),
        date: new Date().toLocaleDateString("ar-SA"),
      };
      order.vat = Math.round(order.sub * 0.15);
      order.total = order.sub + order.vat;
      window.sanadStore.saveOrder(order);
      window.sanadStore.clear();
      window.location = "order-success.html";
    });
  }

  // Success
  function renderSuccess() {
    const root = document.getElementById("st-success");
    if (!root) return;
    const o = window.sanadStore.getOrder();
    if (!o) {
      root.innerHTML = '<div class="text-center py-12 text-sanad-muted">لا يوجد طلب حديث.</div>';
      return;
    }
    document.getElementById("st-ord-id") && (document.getElementById("st-ord-id").textContent = o.id);
    document.getElementById("st-ord-name") && (document.getElementById("st-ord-name").textContent = o.name);
    document.getElementById("st-ord-date") && (document.getElementById("st-ord-date").textContent = o.date);
    document.getElementById("st-ord-total") && (document.getElementById("st-ord-total").textContent = fmt(o.total));
    document.getElementById("st-ord-pay") &&
      (document.getElementById("st-ord-pay").textContent =
        { card: "بطاقة بنكية", mada: "مدى", transfer: "تحويل بنكي" }[o.payment] || "بطاقة");
    const list = document.getElementById("st-ord-items");
    if (list) {
      list.innerHTML = o.items
        .map(
          (i) =>
            `<div class="flex justify-between text-sm py-2 border-b border-dashed border-sanad-border"><span>${i.name} × ${i.qty}</span><span class="font-bold">${fmt(i.price * i.qty)}</span></div>`,
        )
        .join("");
    }
    // type-specific messages
    const hasDig = o.items.some((i) => i.type === "digital");
    const hasPhys = o.items.some((i) => i.type === "physical" || i.type === "impact");
    const hasSrv = o.items.some((i) => i.type === "service");
    const hasCrs = o.items.some((i) => i.type === "course");
    document.getElementById("st-msg-digital") &&
      (document.getElementById("st-msg-digital").style.display = hasDig ? "" : "none");
    document.getElementById("st-msg-physical") &&
      (document.getElementById("st-msg-physical").style.display = hasPhys ? "" : "none");
    document.getElementById("st-msg-service") &&
      (document.getElementById("st-msg-service").style.display = hasSrv ? "" : "none");
    document.getElementById("st-msg-course") &&
      (document.getElementById("st-msg-course").style.display = hasCrs ? "" : "none");
  }

  document.addEventListener("DOMContentLoaded", () => {
    updateBadges();
    bindStore();
    bindDetail();
    renderCart();
    bindCheckout();
    renderSuccess();
  });
})();

/* ============= خدمات + تتبع + تواصل ============= */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const openModal = (id) => {
    const m = document.getElementById(id);
    if (m) {
      m.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  };
  const closeModal = (m) => {
    m.classList.remove("open");
    if (!document.querySelector(".s-modal-overlay.open")) document.body.style.overflow = "";
  };
  $$(".s-modal-overlay").forEach((o) => {
    o.addEventListener("click", (e) => {
      if (e.target === o) closeModal(o);
    });
    o.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", () => closeModal(o)));
  });
  document.querySelectorAll("[data-open-modal]").forEach((b) => {
    if (b.__svBound) return;
    b.__svBound = true;
    b.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(b.getAttribute("data-open-modal"));
    });
  });

  /* ===== صفحة الخدمات: فلاتر + تفاصيل + طلب ===== */
  const grid = document.querySelector("[data-srv-grid]");
  if (grid) {
    const cards = $$("[data-srv]", grid);
    const state = { field: "all", audience: "all", channel: "all", q: "" };
    const empty = $("#srvEmpty");
    const apply = () => {
      let visible = 0;
      cards.forEach((c) => {
        const f = c.dataset.field || "";
        const a = c.dataset.audience || "";
        const ch = c.dataset.channel || "";
        const n = (c.dataset.name || "") + " " + (c.dataset.desc || "");
        const ok =
          (state.field === "all" || f === state.field) &&
          (state.audience === "all" || a.split(/\s+/).includes(state.audience)) &&
          (state.channel === "all" || ch.split(/\s+/).includes(state.channel)) &&
          (!state.q || n.toLowerCase().includes(state.q.toLowerCase()));
        c.style.display = ok ? "" : "none";
        if (ok) visible++;
      });
      if (empty) empty.classList.toggle("hidden", visible > 0);
    };
    $$("[data-srv-filter]").forEach((g) => {
      const key = g.dataset.srvFilter;
      g.querySelectorAll(".chip").forEach((b) => {
        b.addEventListener("click", () => {
          g.querySelectorAll(".chip").forEach((x) => x.classList.remove("active"));
          b.classList.add("active");
          state[key] = b.dataset.v;
          apply();
        });
      });
    });
    const search = $("#srvSearch");
    search &&
      search.addEventListener("input", (e) => {
        state.q = e.target.value;
        apply();
      });
    const reset = $("#srvReset");
    reset &&
      reset.addEventListener("click", () => {
        state.field = "all";
        state.audience = "all";
        state.channel = "all";
        state.q = "";
        if (search) search.value = "";
        $$("[data-srv-filter]").forEach((g) => {
          g.querySelectorAll(".chip").forEach((b, i) => b.classList.toggle("active", i === 0));
        });
        apply();
      });

    /* تفاصيل الخدمة */
    const md = {
      t: $("#mdTitle"),
      d: $("#mdDesc"),
      a: $("#mdAudience"),
      c: $("#mdChannel"),
      du: $("#mdDuration"),
      co: $("#mdConditions"),
      dc: $("#mdDocs"),
      st: $("#mdSteps"),
      req: $("#mdRequest"),
    };
    let lastCard = null;
    const fillUL = (ul, str) => {
      ul.innerHTML = str
        .split("|")
        .map((x) => `<li>${x.trim()}</li>`)
        .join("");
    };
    const audienceMap = {
      families: "الأسر",
      orphans: "الأيتام",
      elderly: "كبار السن",
      patients: "المرضى",
      students: "الطلاب",
      volunteers: "المتطوعون",
    };
    const channelMap = { online: "إلكتروني", onsite: "حضوري", branch: "عبر الفرع", phone: "عبر الاتصال" };
    const openDetail = (c) => {
      lastCard = c;
      md.t.textContent = c.dataset.name;
      md.d.textContent = c.dataset.desc;
      md.a.textContent = (c.dataset.audience || "")
        .split(/\s+/)
        .map((x) => audienceMap[x] || x)
        .join(" • ");
      md.c.textContent = (c.dataset.channel || "")
        .split(/\s+/)
        .map((x) => channelMap[x] || x)
        .join(" • ");
      md.du.textContent = c.dataset.duration || "—";
      fillUL(md.co, c.dataset.conditions || "");
      fillUL(md.dc, c.dataset.docs || "");
      fillUL(md.st, c.dataset.steps || "");
      openModal("mSrvDetail");
    };
    cards.forEach((c) => {
      c.querySelector("[data-srv-detail]")?.addEventListener("click", () => openDetail(c));
      c.querySelector("[data-srv-request]")?.addEventListener("click", () => openRequest(c));
    });
    md.req &&
      md.req.addEventListener("click", () => {
        const m = document.getElementById("mSrvDetail");
        closeModal(m);
        if (lastCard) openRequest(lastCard);
      });

    /* نموذج الطلب متعدد الخطوات */
    const rq = {
      form: $("#srvRequestForm"),
      title: $("#rqTitle"),
      srv: $("#rqService"),
      lbl: $("#rqServiceLabel"),
      bar: $("[data-srv-steps-bar]"),
      prev: $("[data-srv-prev]"),
      next: $("[data-srv-next]"),
      sub: $("[data-srv-submit]"),
    };
    let step = 1;
    const maxStep = 5;
    const showStep = (n) => {
      step = Math.max(1, Math.min(maxStep, n));
      $$(".srv-step", rq.form).forEach((s) => s.classList.toggle("hidden", +s.dataset.step !== step));
      $$("li", rq.bar).forEach((li) => {
        const s = +li.dataset.s;
        li.classList.toggle("done", s < step);
        li.classList.toggle("active", s === step);
      });
      rq.prev.disabled = step === 1;
      rq.next.classList.toggle("hidden", step === maxStep);
      rq.sub.classList.toggle("hidden", step !== maxStep);
    };
    const validateStep = () => {
      const cur = $(`.srv-step[data-step="${step}"]`, rq.form);
      const fields = $$("input[required],select[required],textarea[required]", cur);
      for (const f of fields) {
        if (!f.checkValidity()) {
          f.reportValidity();
          return false;
        }
      }
      return true;
    };
    function openRequest(c) {
      rq.title.textContent = c.dataset.name;
      rq.srv.value = c.dataset.name;
      rq.lbl.value = c.dataset.name;
      step = 1;
      showStep(1);
      rq.form.reset();
      rq.srv.value = c.dataset.name;
      rq.lbl.value = c.dataset.name;
      const u = $$(`input[name="urgency"]`, rq.form);
      const p = (c.dataset.priority || "").trim();
      u.forEach((r) => (r.checked = r.value === p));
      openModal("mSrvRequest");
    }
    rq.next &&
      rq.next.addEventListener("click", () => {
        if (validateStep()) showStep(step + 1);
      });
    rq.prev && rq.prev.addEventListener("click", () => showStep(step - 1));
    rq.sub &&
      rq.sub.addEventListener("click", () => {
        if (!validateStep()) return;
        const checks = $$('input[type="checkbox"]', $(`.srv-step[data-step="5"]`, rq.form));
        if (checks.some((c) => !c.checked)) {
          alert("يرجى الموافقة على جميع الإقرارات.");
          return;
        }
        const id = "SRV-2026-" + String(1000 + Math.floor(Math.random() * 8999));
        $("#okId").textContent = id;
        $("#okName").textContent = rq.srv.value;
        $("#okDate").textContent = new Date().toLocaleDateString("ar-SA");
        $("#okTrack").href = "service-tracking.html?id=" + encodeURIComponent(id);
        try {
          sessionStorage.setItem("sanadSrvLast", JSON.stringify({ id, name: rq.srv.value }));
        } catch (e) {}
        closeModal(document.getElementById("mSrvRequest"));
        openModal("mSrvSuccess");
      });
  }

  /* ===== صفحة التتبع ===== */
  const trkForm = $("#trkForm");
  if (trkForm) {
    const showResult = () => {
      const r = $("#trkResult");
      if (!r) return;
      r.classList.remove("hidden");
      const id = $("#trkId").value.trim() || "SRV-2026-0001";
      $("#trkOutId").textContent = id;
      r.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    trkForm.addEventListener("submit", (e) => {
      e.preventDefault();
      showResult();
    });
    /* Auto-show if ?id= present */
    const qs = new URLSearchParams(location.search);
    if (qs.get("id")) {
      $("#trkId").value = qs.get("id");
      showResult();
    }
  }

  /* ===== صفحة التواصل: نموذج بسيط ===== */
  const ctForm = document.getElementById("ctUnified");
  if (ctForm) {
    ctForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!ctForm.checkValidity()) {
        ctForm.reportValidity();
        return;
      }
      const ticket = "CNT-2026-" + String(1 + Math.floor(Math.random() * 9998)).padStart(4, "0");
      const modal = document.getElementById("ctSuccess");
      if (modal) {
        const t = modal.querySelector("[data-ct-ticket]");
        if (t) t.textContent = ticket;
        modal.classList.add("open");
        document.body.style.overflow = "hidden";
      }
      ctForm.reset();
    });

    // اختيار الفرع في قسم الموقع
    const branchInfo = document.querySelector("[data-ct-branch-info]");
    document.querySelectorAll("[data-ct-branches] [data-branch]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-ct-branches] [data-branch]").forEach((x) => x.classList.remove("active"));
        btn.classList.add("active");
        const [city, addr] = btn.dataset.branch.split("|");
        if (branchInfo)
          branchInfo.innerHTML = `<strong>${city.includes("الرياض") ? "المقر الرئيسي - الرياض" : "فرع " + city}</strong><span>${addr}</span>`;
      });
    });
  }
})();

/* ===================== Beneficiaries Portal ===================== */
(function () {
  // OTP simulate
  document.querySelectorAll("[data-bp-send-otp]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const area =
        btn.parentElement.querySelector("[data-bp-otp-area]") ||
        btn.closest("form,fieldset")?.querySelector("[data-bp-otp-area]");
      if (area) {
        area.classList.remove("hidden");
        area.querySelector("input")?.focus();
      }
      btn.innerHTML = '<i class="fas fa-check"></i> تم إرسال الرمز';
      btn.disabled = true;
      btn.classList.add("opacity-70");
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-rotate"></i> إعادة الإرسال';
        btn.disabled = false;
        btn.classList.remove("opacity-70");
      }, 6000);
    });
  });
  // OTP auto-advance
  document.querySelectorAll(".bp-otp-inputs").forEach((box) => {
    const inputs = [...box.querySelectorAll("input")];
    inputs.forEach((inp, i) => {
      inp.addEventListener("input", () => {
        inp.value = inp.value.replace(/\D/g, "");
        if (inp.value && inputs[i + 1]) inputs[i + 1].focus();
      });
      inp.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !inp.value && inputs[i - 1]) inputs[i - 1].focus();
      });
    });
  });

  // Login fake submit -> dashboard
  const lf = document.getElementById("bpLoginForm");
  if (lf) {
    lf.addEventListener("submit", (e) => {
      e.preventDefault();
      window.location.href = "beneficiary-dashboard.html";
    });
  }

  // Register stepper
  const regForm = document.getElementById("bpRegForm");
  if (regForm) {
    const steps = [...regForm.querySelectorAll(".bp-rs")];
    const pills = [...document.querySelectorAll("#bpRegSteps .bp-step-pill")];
    const prev = regForm.querySelector("[data-bp-prev]");
    const next = regForm.querySelector("[data-bp-next]");
    const submit = regForm.querySelector("[data-bp-submit]");
    let cur = 0;
    const show = (i) => {
      steps.forEach((s, idx) => s.classList.toggle("hidden", idx !== i));
      pills.forEach((p, idx) => {
        p.classList.toggle("active", idx === i);
        p.classList.toggle("complete", idx < i);
      });
      prev.disabled = i === 0;
      next.classList.toggle("hidden", i === steps.length - 1);
      submit.classList.toggle("hidden", i !== steps.length - 1);
      window.scrollTo({ top: regForm.offsetTop - 90, behavior: "smooth" });
    };
    next.addEventListener("click", () => {
      const f = steps[cur];
      const req = f.querySelectorAll("[required]");
      let ok = true;
      req.forEach((r) => {
        if (!r.value || (r.type === "radio" && ![...f.querySelectorAll(`[name="${r.name}"]`)].some((x) => x.checked))) {
          ok = false;
          r.reportValidity?.();
        }
      });
      if (!ok) return;
      if (cur < steps.length - 1) {
        cur++;
        show(cur);
      }
    });
    prev.addEventListener("click", () => {
      if (cur > 0) {
        cur--;
        show(cur);
      }
    });
    regForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!regForm.checkValidity()) {
        regForm.reportValidity();
        return;
      }
      const id = "BEN-2026-" + String(1000 + Math.floor(Math.random() * 8999));
      const idEl = document.getElementById("bpRegId");
      if (idEl) idEl.textContent = id;
      try {
        localStorage.setItem("bp_reg_id", id);
      } catch (_) {}
      document.getElementById("mBpRegSuccess")?.classList.add("open");
    });
    document.getElementById("bpSaveLater")?.addEventListener("click", () => {
      try {
        const d = {};
        regForm.querySelectorAll("input,select,textarea").forEach((el) => {
          if (el.name || el.id) d[el.name || el.id] = el.value;
        });
        localStorage.setItem("bp_reg_draft", JSON.stringify(d));
      } catch (_) {}
      alert("تم حفظ بياناتك مؤقتًا. يمكنك العودة لاحقًا لاستكمال التسجيل.");
    });
  }

  // Products filter
  const pFilter = document.getElementById("bpProdFilter");
  if (pFilter) {
    pFilter.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-fp]");
      if (!b) return;
      pFilter.querySelectorAll("button").forEach((x) => x.classList.toggle("active", x === b));
      const v = b.dataset.fp;
      document.querySelectorAll("#bpProdGrid .bp-prod").forEach((card) => {
        const t = (card.dataset.types || "").split(/\s+/);
        card.style.display = v === "all" || t.includes(v) ? "" : "none";
      });
    });
  }

  // Product details: open request modal
  const openReq = document.getElementById("bpOpenReq");
  if (openReq) {
    openReq.addEventListener("click", () => document.getElementById("mBpReq")?.classList.add("open"));
    document.getElementById("bpReqSubmit")?.addEventListener("click", () => {
      const f = document.getElementById("bpReqForm");
      if (!f.checkValidity()) {
        f.reportValidity();
        return;
      }
      const id = "BEN-REQ-2026-" + String(1000 + Math.floor(Math.random() * 8999));
      try {
        localStorage.setItem("bp_last_req", id);
      } catch (_) {}
      window.location.href = "beneficiary-request-success.html";
    });
  }

  // Payment fake submit
  const payF = document.getElementById("bpPayForm");
  if (payF) {
    payF.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!payF.checkValidity()) {
        payF.reportValidity();
        return;
      }
      window.location.href = "beneficiary-request-success.html";
    });
  }

  // Tracking form
  const trkF = document.getElementById("bpTrkForm");
  if (trkF) {
    trkF.addEventListener("submit", (e) => {
      e.preventDefault();
      window.scrollTo({ top: trkF.offsetTop + 200, behavior: "smooth" });
    });
  }

  // Profile send update
  document.getElementById("bpSendUpdate")?.addEventListener("click", () => {
    alert("تم إرسال طلب تحديث بياناتك إلى فريق الجمعية. سيتم الرد عليك خلال يوم عمل.");
  });
})();

/* =========================================================
   =========== توحيد الهيدر والفوتر (Sanad SX) =============
   ========================================================= */
(function () {
  "use strict";
  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  // مجموعات تحديد العنصر النشط
  const groups = {
    home: ["index.html", ""],
    about: [
      "about.html",
      "founding.html",
      "strategy.html",
      "board.html",
      "executive-management.html",
      "organization-structure.html",
      "registration-certificate.html",
      "branches.html",
      "committees.html",
      "membership.html",
    ],
    donations: ["donations.html", "donation-details.html", "donation-receipt.html", "donor-login.html"],
    store: [
      "store.html",
      "product-physical-details.html",
      "product-digital-details.html",
      "service-product-details.html",
      "course-product-details.html",
      "cart.html",
      "checkout.html",
      "order-success.html",
      "customer-login.html",
    ],
    services: ["services.html", "service-details.html", "service-tracking.html"],
    projects: ["projects.html", "project-details.html"],
    governance: ["governance.html"],
    media: ["media-center.html", "news.html", "news-details.html", "article-details.html"],
    events: ["events.html", "event-details.html", "event-details-online.html"],
    contact: ["contact.html"],
    beneficiaries: [
      "beneficiaries.html",
      "beneficiary-login.html",
      "beneficiary-register.html",
      "beneficiary-dashboard.html",
      "beneficiary-profile.html",
      "beneficiary-products.html",
      "beneficiary-product-details.html",
      "beneficiary-payment.html",
      "beneficiary-request-success.html",
      "beneficiary-request-tracking.html",
    ],
  };
  const isActive = (k) => (groups[k]?.includes(page) ? "active" : "");

  // عدّاد سلة المتجر من localStorage (إن وُجد)
  function getCartCount() {
    try {
      const raw = localStorage.getItem("sanad_cart");
      if (!raw) return 0;
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return 0;
      return arr.reduce((s, i) => s + (parseInt(i.qty) || 1), 0);
    } catch (e) {
      return 0;
    }
  }
  function getDonationCount() {
    try {
      const raw = localStorage.getItem("sanad_donation_cart");
      if (!raw) return 0;
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr.length : 0;
    } catch (e) {
      return 0;
    }
  }

  const headerHTML = `
  <header class="sx-header" id="sx-header">
    <div class="sx-topbar">
      <div class="sx-tcont">
        <div class="sx-tlinks">
          
          <a href="service-tracking.html" class="sx-thide"><i class="fas fa-route"></i> تتبع طلب</a>
          <a href="beneficiaries.html" class="sx-thide"><i class="fas fa-user-shield"></i> بوابة المستفيدين</a>
         
        <a href="contact.html"><i class="fas fa-headset"></i> تواصل معنا</a>
        </div>
        <div class="sx-tright">
          <div class="sx-tcontact">
            <a href="tel:920000000" class="sx-thide"><i class="fas fa-phone"></i> 920000000</a>
            <a href="mailto:info@sanad.org.sa" class="sx-thide"><i class="fas fa-envelope"></i> info@sanad.org.sa</a>
          </div>
          <div class="sx-lang">
            <button class="active" data-lang="ar" type="button">العربية</button>
            <span class="sep">|</span>
            <button data-lang="en" type="button">English</button>
          </div>
        </div>
      </div>
    </div>
    <div class="sx-main">
      <a href="index.html" class="sx-logo">
        <div class="sx-mark">س</div>
        <div>
          <div class="sx-name">جمعية سَنَد</div>
          <div class="sx-tag">للخدمات الاجتماعية والرعاية</div>
        </div>
      </a>
      <nav class="sx-nav" aria-label="القائمة الرئيسية">
        <a href="index.html" class="${isActive("home")}">الرئيسية</a>
        <div class="sx-drop" data-drop>
          <button type="button" class="${isActive("about")}">عن الجمعية <i class="fas fa-chevron-down"></i></button>
          <div class="sx-dmenu">
            <a href="about.html"><i class="fas fa-circle-info"></i> من نحن</a>
            <a href="founding.html"><i class="fas fa-flag"></i> النشأة والتأسيس</a>
            <a href="strategy.html"><i class="fas fa-compass"></i> استراتيجيتنا</a>
            <a href="board.html"><i class="fas fa-users-gear"></i> مجلس الإدارة</a>
            <a href="executive-management.html"><i class="fas fa-user-tie"></i> الإدارة التنفيذية</a>
            <a href="organization-structure.html"><i class="fas fa-sitemap"></i> الهيكل التنظيمي</a>
            <a href="registration-certificate.html"><i class="fas fa-certificate"></i> شهادة التسجيل</a>
            <a href="branches.html"><i class="fas fa-location-dot"></i> فروع ومكاتب الجمعية</a>
            <a href="committees.html"><i class="fas fa-people-group"></i> اللجان</a>
            <a href="membership.html"><i class="fas fa-id-card"></i> العضوية</a>
          </div>
        </div>
        <a href="donations.html" class="${isActive("donations")}">بوابة التبرعات</a>
        <a href="store.html" class="${isActive("store")}">متجر الجمعية</a>
        <a href="services.html" class="${isActive("services")}">خدماتنا</a>
        <a href="projects.html" class="${isActive("projects")}">المشاريع</a>
        <a href="governance.html" class="${isActive("governance")}">الحوكمة</a>
        <a href="media-center.html" class="${isActive("media")}">المركز الإعلامي</a>
        <a href="events.html" class="${isActive("events")}">الفعاليات</a>
       
      </nav>
      <div class="sx-actions">
        <button type="button" class="sx-icon-btn" data-sx-donation-cart aria-label="سلة التبرعات" title="سلة التبرعات">
          <i class="fas fa-heart-circle-plus"></i>
          <span class="sx-badge" data-donation-count>${getDonationCount()}</span>
        </button>
        <a href="cart.html" class="sx-icon-btn" aria-label="سلة المتجر" title="سلة المتجر">
          <i class="fas fa-bag-shopping"></i>
          <span class="sx-badge" data-cart-count>${getCartCount()}</span>
        </a>
        <div class="sx-login-wrap" data-login-wrap>
          <button type="button" class="sx-login-btn" data-login-toggle>
            <i class="fas fa-user-circle"></i> تسجيل الدخول
          </button>
          <div class="sx-login-menu">
            <div class="sx-lhead">اختر نوع الحساب</div>
            <a href="beneficiary-login.html"><i class="fas fa-hand-holding-heart"></i> دخول المستفيدين</a>
            <a href="donor-login.html"><i class="fas fa-heart"></i> دخول المتبرعين</a>
            <a href="customer-login.html"><i class="fas fa-bag-shopping"></i> دخول العملاء</a>
            <div class="sx-lreg">
              <a href="beneficiary-register.html"><i class="fas fa-user-plus"></i> إنشاء حساب جديد</a>
            </div>
          </div>
        </div>
        
        <button type="button" class="sx-burger" data-sx-burger aria-label="القائمة"><i class="fas fa-bars"></i></button>
      </div>
    </div>
  </header>

  <!-- قائمة الجوال -->
  <div class="sx-mobile-overlay" data-sx-mobile-overlay></div>
  <aside class="sx-mobile" data-sx-mobile aria-hidden="true">
    <div class="sx-mhead">
      <div class="sx-logo"><div class="sx-mark">س</div><div><div class="sx-name">جمعية سَنَد</div></div></div>
      <button type="button" class="sx-icon-btn" data-sx-mclose aria-label="إغلاق"><i class="fas fa-times"></i></button>
    </div>
    <div class="sx-mbody">
      <a href="index.html"><i class="fas fa-house"></i> الرئيسية</a>
      <button type="button" data-sx-mcollapse="about"><i class="fas fa-circle-info"></i> عن الجمعية <i class="fas fa-chevron-down" style="margin-inline-start:auto;font-size:.7rem"></i></button>
      <div class="sx-mcollapse" data-sx-mcoll="about">
        <a href="about.html">من نحن</a><a href="founding.html">النشأة والتأسيس</a><a href="strategy.html">استراتيجيتنا</a>
        <a href="board.html">مجلس الإدارة</a><a href="executive-management.html">الإدارة التنفيذية</a><a href="organization-structure.html">الهيكل التنظيمي</a>
        <a href="registration-certificate.html">شهادة التسجيل</a><a href="branches.html">الفروع والمكاتب</a>
        <a href="committees.html">اللجان</a><a href="membership.html">العضوية</a>
      </div>
      <a href="donations.html"><i class="fas fa-heart"></i> بوابة التبرعات</a>
      <a href="store.html"><i class="fas fa-store"></i> متجر الجمعية</a>
      <a href="services.html"><i class="fas fa-hand-holding-heart"></i> خدماتنا</a>
      <a href="projects.html"><i class="fas fa-diagram-project"></i> المشاريع والمبادرات</a>
      <a href="governance.html"><i class="fas fa-scale-balanced"></i> الحوكمة</a>
      <a href="media-center.html"><i class="fas fa-newspaper"></i> المركز الإعلامي</a>
      <a href="events.html"><i class="fas fa-calendar-days"></i> الفعاليات</a>
      <a href="contact.html"><i class="fas fa-headset"></i> تواصل معنا</a>

      <div class="sx-msec">حسابي وسلاتي</div>
      <button type="button" data-sx-donation-cart><i class="fas fa-heart-circle-plus"></i> سلة التبرعات <span class="sx-badge" data-donation-count style="position:static;margin-inline-start:auto">${getDonationCount()}</span></button>
      <a href="cart.html"><i class="fas fa-bag-shopping"></i> سلة المتجر <span class="sx-badge" data-cart-count style="position:static;margin-inline-start:auto">${getCartCount()}</span></a>
      <a href="beneficiary-login.html"><i class="fas fa-user-shield"></i> دخول المستفيدين</a>
      <a href="donor-login.html"><i class="fas fa-heart"></i> دخول المتبرعين</a>
      <a href="customer-login.html"><i class="fas fa-bag-shopping"></i> دخول العملاء</a>
      <a href="beneficiary-register.html"><i class="fas fa-user-plus"></i> إنشاء حساب جديد</a>

      <div class="sx-msec">روابط سريعة</div>
      <a href="service-tracking.html"><i class="fas fa-route"></i> تتبع طلب خدمة</a>
      <a href="beneficiaries.html"><i class="fas fa-user-shield"></i> بوابة المستفيدين</a>
      <a href="tel:920000000"><i class="fas fa-phone"></i> 920000000</a>
      <a href="mailto:info@sanad.org.sa"><i class="fas fa-envelope"></i> info@sanad.org.sa</a>
      <button type="button" data-lang-toggle><i class="fas fa-globe"></i> اللغة: العربية / English</button>
    </div>
  </aside>

  <!-- سلة التبرعات (Drawer) -->
  <div class="sx-drawer-overlay" data-sx-dcart-overlay></div>
  <aside class="sx-drawer" data-sx-dcart>
    <div class="sx-dhead">
      <h3><i class="fas fa-heart-circle-plus"></i> سلة التبرعات</h3>
      <button class="sx-dclose" data-sx-dcart-close><i class="fas fa-times"></i></button>
    </div>
    <div class="sx-dbody" data-sx-dcart-body>
      <div class="sx-dempty">
        <i class="fas fa-heart"></i>
        <div>سلة تبرعاتك فارغة حاليًا.</div>
        <div style="font-size:.78rem;margin-top:.4rem">يمكنك تصفّح فرص التبرع وإضافتها هنا.</div>
      </div>
    </div>
    <div class="sx-dfoot">
      <a href="donations.html" class="s-btn s-btn-primary" style="justify-content:center"><i class="fas fa-arrow-left"></i> متابعة التبرع</a>
      <a href="donations.html" class="s-btn s-btn-outline" style="justify-content:center">إتمام التبرع</a>
    </div>
  </aside>
  `;

  const footerHTML = `
  <footer class="sx-footer" id="sx-footer">
    <div class="sx-fmain">
      <div class="sx-fbrand">
        <div class="sx-fname">
          <div class="sx-mark">س</div>
          <div><div class="nm">جمعية سَنَد</div><div class="tg">للخدمات الاجتماعية والرعاية</div></div>
        </div>
        <p>جمعية اجتماعية تعمل على تقديم خدمات الرعاية والدعم والتمكين، عبر برامج مؤسسية تعزز جودة حياة المستفيدين وتدعم الاستدامة المجتمعية ضمن منظومة العمل الخيري السعودي.</p>
        <div class="sx-fsoc">
          <a href="#" aria-label="تويتر"><i class="fab fa-x-twitter"></i></a>
          <a href="#" aria-label="إنستغرام"><i class="fab fa-instagram"></i></a>
          <a href="#" aria-label="يوتيوب"><i class="fab fa-youtube"></i></a>
          <a href="#" aria-label="لينكدإن"><i class="fab fa-linkedin-in"></i></a>
          <a href="#" aria-label="واتساب"><i class="fab fa-whatsapp"></i></a>
        </div>
      </div>
      <div class="sx-fcol">
        <h4>روابط رئيسية</h4>
        <ul>
          <li><a href="index.html"><i class="fas fa-angle-left"></i> الرئيسية</a></li>
          <li><a href="projects.html"><i class="fas fa-angle-left"></i> المشاريع والمبادرات</a></li>
          <li><a href="donations.html"><i class="fas fa-angle-left"></i> بوابة التبرع</a></li>
          <li><a href="store.html"><i class="fas fa-angle-left"></i> متجر الجمعية</a></li>
          <li><a href="beneficiaries.html"><i class="fas fa-angle-left"></i> بوابة المستفيدين</a></li>
          <li><a href="media-center.html"><i class="fas fa-angle-left"></i> المركز الإعلامي</a></li>
        </ul>
      </div>
      <div class="sx-fcol">
        <h4>الحوكمة والشفافية</h4>
        <ul>
          <li><a href="governance.html"><i class="fas fa-angle-left"></i> الحوكمة</a></li>
          <li><a href="governance.html#policies"><i class="fas fa-angle-left"></i> اللوائح والسياسات</a></li>
          <li><a href="governance.html#reports"><i class="fas fa-angle-left"></i> التقارير المالية</a></li>
          <li><a href="board.html"><i class="fas fa-angle-left"></i> مجلس الإدارة</a></li>
          <li><a href="governance.html#assembly"><i class="fas fa-angle-left"></i> الجمعية العمومية</a></li>
          <li><a href="governance.html#minutes"><i class="fas fa-angle-left"></i> محاضر الاجتماعات</a></li>
        </ul>
      </div>
      <div class="sx-fcol">
        <h4>خدمات المستفيدين</h4>
        <ul>
          <li><a href="beneficiary-login.html"><i class="fas fa-angle-left"></i> دخول المستفيدين</a></li>
          <li><a href="beneficiary-register.html"><i class="fas fa-angle-left"></i> انضم كمستفيد</a></li>
          <li><a href="beneficiary-products.html"><i class="fas fa-angle-left"></i> المنتجات والخدمات المتاحة</a></li>
          <li><a href="beneficiary-request-tracking.html"><i class="fas fa-angle-left"></i> تتبع طلب مستفيد</a></li>
          <li><a href="services.html"><i class="fas fa-angle-left"></i> طلب خدمة</a></li>
           <li><a href="contact.html"><i class="fas fa-angle-left"></i> تواصل معنا</a></li>
        </ul>
      </div>
      <div class="sx-fcol">
        <h4>التواصل والنشرة</h4>
        <ul class="sx-fcontact">
          <li><i class="fas fa-phone"></i> 920000000</li>
          <li><i class="fas fa-envelope"></i> info@sanad.org.sa</li>
          <li><i class="fas fa-location-dot"></i> الرياض — حي الملقا — طريق الملك فهد</li>
          <li><i class="fas fa-clock"></i> الأحد - الخميس · 8 ص - 4 م</li>
          <li><i class="fab fa-whatsapp"></i> 0500000000</li>
        </ul>
        <form class="sx-fnews" onsubmit="event.preventDefault();window.sxToast&&sxToast('تم الاشتراك في النشرة بنجاح');this.reset();">
          <div style="font-size:.78rem;color:#a5b3c8;font-weight:700">اشترك في النشرة البريدية</div>
          <input type="email" required placeholder="بريدك الإلكتروني" />
          <button type="submit"><i class="fas fa-paper-plane"></i> اشتراك</button>
        </form>
      </div>
    </div>

    <div class="sx-license">
      <div class="sx-license-card">
        <div class="sx-lic-left">
          <div class="sx-lic-ic"><i class="fas fa-shield-halved"></i></div>
          <div>
            <div class="sx-lic-title">الجمعية مصرحة من المركز الوطني لتنمية القطاع غير الربحي</div>
            <div class="sx-lic-meta">
              <span>رقم الترخيص: <b>0000</b></span>
              <span>الحالة: <b>ساري</b></span>
              <span>آخر تحديث: <b>هذا الشهر</b></span>
            </div>
          </div>
        </div>
        <button type="button" class="sx-lic-btn" data-sx-cert-open><i class="fas fa-certificate"></i> عرض شهادة الترخيص</button>
      </div>
    </div>

    <div class="sx-fbottom">
      <div class="sx-fbcont">
        <div>© جميع الحقوق محفوظة لجمعية سَنَد <span data-year>2026</span> — بواسطة <a href="https://webyan.sa" target="_blank" rel="noopener" class="sx-by">ويبيان</a></div>
        <div>الرياض · المملكة العربية السعودية</div>
      </div>
    </div>
  </footer>

  <!-- نافذة شهادة الترخيص -->
  <div class="sx-mod-overlay" data-sx-cert-overlay>
    <div class="sx-mod" role="dialog" aria-modal="true" aria-label="شهادة الترخيص">
      <div class="sx-mod-head">
        <h3><i class="fas fa-certificate"></i> شهادة الترخيص</h3>
        <button class="sx-dclose" data-sx-cert-close><i class="fas fa-times"></i></button>
      </div>
      <div class="sx-mod-body">
        <div class="sx-cert">
          <div class="sx-cseal"><i class="fas fa-shield-halved"></i></div>
          <h4>جمعية سَنَد للخدمات الاجتماعية والرعاية</h4>
          <div class="sx-csub">المركز الوطني لتنمية القطاع غير الربحي</div>
          <div class="sx-cnum">رقم الترخيص<br><b>0000</b></div>
          <div style="font-size:.78rem;color:#5b6b7d;margin-top:.4rem">تاريخ الإصدار: 1445 هـ — الموافق 2024 م</div>
          <div class="sx-cstatus"><i class="fas fa-circle-check"></i> ساري المفعول</div>
        </div>
      </div>
      <div class="sx-mod-actions">
        <button type="button" class="s-btn s-btn-outline" data-sx-cert-share><i class="fas fa-share-nodes"></i> مشاركة</button>
        <button type="button" class="s-btn s-btn-outline" onclick="window.print()"><i class="fas fa-download"></i> تحميل / طباعة</button>
        <button type="button" class="s-btn s-btn-primary" data-sx-cert-close><i class="fas fa-check"></i> إغلاق</button>
      </div>
    </div>
  </div>

  <div class="sx-toast" id="sx-toast"></div>
  `;

  function inject() {
    // إزالة الشريط العلوي القديم إن وجد
    document.querySelectorAll(".s-topbar").forEach((el) => el.remove());
    // استبدال الهيدر القديم
    const oldHeader = document.querySelector("header.s-header");
    if (oldHeader) {
      oldHeader.insertAdjacentHTML("beforebegin", headerHTML);
      oldHeader.remove();
    } else if (!document.querySelector(".sx-header")) {
      document.body.insertAdjacentHTML("afterbegin", headerHTML);
    }

    // استبدال الفوتر القديم
    const oldFooter = document.querySelector("footer.s-footer");
    if (oldFooter) {
      oldFooter.insertAdjacentHTML("beforebegin", footerHTML);
      oldFooter.remove();
    } else if (!document.querySelector(".sx-footer")) {
      document.body.insertAdjacentHTML("beforeend", footerHTML);
    }
    bind();
  }

  // Toast عام
  window.sxToast = function (msg) {
    const t = document.getElementById("sx-toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(window.__sxT);
    window.__sxT = setTimeout(() => t.classList.remove("show"), 2600);
  };

  function bind() {
    // سنة الفوتر
    document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

    // تمرير الهيدر
    const h = document.getElementById("sx-header");
    if (h) {
      const onSc = () => h.classList.toggle("scrolled", window.scrollY > 12);
      window.addEventListener("scroll", onSc, { passive: true });
      onSc();
    }

    // قائمة "عن الجمعية" المنسدلة
    document.querySelectorAll("[data-drop]").forEach((d) => {
      const btn = d.querySelector("button");
      btn?.addEventListener("click", (e) => {
        e.stopPropagation();
        document.querySelectorAll("[data-drop].open").forEach((o) => {
          if (o !== d) o.classList.remove("open");
        });
        d.classList.toggle("open");
      });
    });

    // تسجيل الدخول
    const lw = document.querySelector("[data-login-wrap]");
    const lt = document.querySelector("[data-login-toggle]");
    lt?.addEventListener("click", (e) => {
      e.stopPropagation();
      lw.classList.toggle("open");
    });

    // إغلاق القوائم عند الضغط خارجها
    document.addEventListener("click", () => {
      document.querySelectorAll("[data-drop].open").forEach((o) => o.classList.remove("open"));
      lw?.classList.remove("open");
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document.querySelectorAll("[data-drop].open").forEach((o) => o.classList.remove("open"));
        lw?.classList.remove("open");
        closeMobile();
        closeDCart();
        closeCert();
      }
    });

    // قائمة الجوال
    const mob = document.querySelector("[data-sx-mobile]");
    const movl = document.querySelector("[data-sx-mobile-overlay]");
    const openMobile = () => {
      mob?.classList.add("open");
      movl?.classList.add("open");
      document.body.style.overflow = "hidden";
    };
    const closeMobile = () => {
      mob?.classList.remove("open");
      movl?.classList.remove("open");
      document.body.style.overflow = "";
    };
    document.querySelector("[data-sx-burger]")?.addEventListener("click", openMobile);
    document.querySelector("[data-sx-mclose]")?.addEventListener("click", closeMobile);
    movl?.addEventListener("click", closeMobile);
    document.querySelectorAll("[data-sx-mobile] a").forEach((a) => a.addEventListener("click", closeMobile));

    // طيّ "عن الجمعية" داخل الجوال
    document.querySelectorAll("[data-sx-mcollapse]").forEach((b) => {
      b.addEventListener("click", () => {
        const k = b.getAttribute("data-sx-mcollapse");
        document.querySelector(`[data-sx-mcoll="${k}"]`)?.classList.toggle("open");
      });
    });

    // اللغة
    document.querySelectorAll('[data-lang="en"], [data-lang-toggle]').forEach((b) => {
      b.addEventListener("click", (e) => {
        if (b.getAttribute("data-lang") === "ar") return;
        e.preventDefault();
        sxToast("النسخة الإنجليزية قيد الإعداد");
      });
    });

    // سلة التبرعات
    const dcart = document.querySelector("[data-sx-dcart]");
    const dovl = document.querySelector("[data-sx-dcart-overlay]");
    const openDCart = () => {
      dcart?.classList.add("open");
      dovl?.classList.add("open");
      document.body.style.overflow = "hidden";
    };
    const closeDCart = () => {
      dcart?.classList.remove("open");
      dovl?.classList.remove("open");
      document.body.style.overflow = "";
    };
    document.querySelectorAll("[data-sx-donation-cart]").forEach((b) => b.addEventListener("click", openDCart));
    document.querySelector("[data-sx-dcart-close]")?.addEventListener("click", closeDCart);
    dovl?.addEventListener("click", closeDCart);

    // شهادة الترخيص
    const cert = document.querySelector("[data-sx-cert-overlay]");
    const openCert = () => {
      cert?.classList.add("open");
      document.body.style.overflow = "hidden";
    };
    const closeCert = () => {
      cert?.classList.remove("open");
      document.body.style.overflow = "";
    };
    document.querySelectorAll("[data-sx-cert-open]").forEach((b) => b.addEventListener("click", openCert));
    document.querySelectorAll("[data-sx-cert-close]").forEach((b) => b.addEventListener("click", closeCert));
    cert?.addEventListener("click", (e) => {
      if (e.target === cert) closeCert();
    });
    document.querySelector("[data-sx-cert-share]")?.addEventListener("click", () => {
      const url = location.origin + location.pathname;
      if (navigator.share) {
        navigator.share({ title: "شهادة ترخيص جمعية سَنَد", url }).catch(() => {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(url);
        sxToast("تم نسخ الرابط");
      }
    });

    // تحديث العدادات
    window.sxUpdateCounts = function () {
      document.querySelectorAll("[data-cart-count]").forEach((el) => (el.textContent = getCartCount()));
      document.querySelectorAll("[data-donation-count]").forEach((el) => (el.textContent = getDonationCount()));
    };
    window.addEventListener("storage", window.sxUpdateCounts);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
