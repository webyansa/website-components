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

  /* سلايدر خلفية الهيرو السينمائي — صور + نصوص + نقاط + عداد */
  const heroSlider = document.querySelector("[data-hero-slider]");
  if (heroSlider) {
    const slides = heroSlider.querySelectorAll(".s-hero-slide");
    const texts = document.querySelectorAll("[data-hero-text] .s-hero-slide-text");
    const dots = document.querySelectorAll("[data-hero-go]");
    const counter = document.querySelector("[data-hero-counter]");
    let idx = 0, timer = null;
    const pad = (n) => String(n).padStart(2, "0");
    const go = (n) => {
      idx = (n + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle("is-active", i === idx));
      texts.forEach((t, i) => t.classList.toggle("is-active", i === idx));
      dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
      if (counter) counter.textContent = `${pad(idx + 1)} / ${pad(slides.length)}`;
    };
    const start = () => { stop(); timer = setInterval(() => go(idx + 1), 6000); };
    const stop = () => { if (timer) clearInterval(timer); };
    dots.forEach((d) => d.addEventListener("click", () => { go(parseInt(d.dataset.heroGo, 10)); start(); }));
    if (slides.length > 1) start();
  }

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
      const txt = "سند تبرع — جمعية إسكان";
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
        name: fd.get("name") || "عميل إسكان",
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
      if (g.tagName === "SELECT") {
        g.addEventListener("change", () => {
          state[key] = g.value;
          apply();
        });
      } else {
        g.querySelectorAll(".chip").forEach((b) => {
          b.addEventListener("click", () => {
            g.querySelectorAll(".chip").forEach((x) => x.classList.remove("active"));
            b.classList.add("active");
            state[key] = b.dataset.v;
            apply();
          });
        });
      }
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
          if (g.tagName === "SELECT") {
            g.value = "all";
          } else {
            g.querySelectorAll(".chip").forEach((b, i) => b.classList.toggle("active", i === 0));
          }
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
          <div class="sx-lang-dd" data-lang-dd>
            <button class="sx-lang-trigger" type="button" aria-haspopup="listbox" aria-expanded="false">
              <i class="fas fa-globe"></i>
              <span class="sx-lang-current">العربية</span>
              <i class="fas fa-chevron-down sx-lang-caret"></i>
            </button>
            <ul class="sx-lang-menu" role="listbox">
              <li><button type="button" data-lang="ar" class="active" role="option" aria-selected="true">العربية</button></li>
              <li><button type="button" data-lang="en" role="option" aria-selected="false">English</button></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="sx-main">
      <a href="index.html" class="sx-logo">
        <div class="sx-mark">إ</div>
        <div>
          <div class="sx-name">جمعية إسكان</div>
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
        <div class="sx-login-wrap" data-drop>
          <button type="button" class="sx-login-btn">
            <i class="fas fa-user-circle"></i> تسجيل الدخول <i class="fas fa-chevron-down" style="font-size:.65rem;margin-inline-start:.15rem"></i>
          </button>
          <div class="sx-login-menu" role="menu">
            <div class="sx-lhead">اختر بوابة الدخول المناسبة لك</div>
            <a href="#" data-auth-open="login"><i class="fas fa-user-tie"></i> دخول العملاء والمتبرعين</a>
            <a href="beneficiary-login.html"><i class="fas fa-user-shield"></i> دخول المستفيدين</a>
            <div class="sx-lreg">
              <a href="beneficiary-register.html" style="color:var(--s-emerald-deep)"><i class="fas fa-user-plus"></i> إنشاء حساب مستفيد</a>
              <a href="#" data-auth-open="register"><i class="fas fa-user-plus"></i> إنشاء حساب عميل / متبرع</a>
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
      <div class="sx-logo"><div class="sx-mark">إ</div><div><div class="sx-name">جمعية إسكان</div></div></div>
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
      <button type="button" data-auth-open="login"><i class="fas fa-user-circle"></i> تسجيل الدخول</button>
      <button type="button" data-auth-open="register"><i class="fas fa-user-plus"></i> إنشاء حساب جديد</button>

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

  <!-- ============ نافذة المصادقة الموحّدة ============ -->
  <div class="sa-auth" data-auth-root aria-hidden="true">
    <div class="sa-auth-overlay" data-auth-close></div>
    <div class="sa-auth-dialog" role="dialog" aria-modal="true" aria-labelledby="saAuthTitle">
      <button class="sa-auth-x" type="button" data-auth-close aria-label="إغلاق"><i class="fas fa-times"></i></button>

      <!-- شريط الهوية -->
      <div class="sa-auth-brand">
        <div class="sa-auth-mark">س</div>
        <div>
          <div class="sa-auth-name" id="saAuthTitle">جمعية إسكان</div>
          <div class="sa-auth-tag" data-auth-subtitle>بوابة موحدة لجميع حسابات الجمعية</div>
        </div>
      </div>

      <!-- مؤشر الخطوات -->
      <div class="sa-auth-steps" data-auth-steps>
        <span class="dot active" data-step-dot="1"></span>
        <span class="ln"></span>
        <span class="dot" data-step-dot="2"></span>
        <span class="ln"></span>
        <span class="dot" data-step-dot="3"></span>
      </div>

      <div class="sa-auth-body">

        <!-- ====== شاشة 1: تسجيل الدخول (المعرّف) ====== -->
        <section class="sa-view" data-auth-view="login">
          <h3 class="sa-h">مرحبًا بعودتك 👋</h3>
          <p class="sa-sub">سجّل دخولك إلى حسابك في جمعية إسكان بكل سهولة عبر البريد أو رقم الجوال.</p>

          <form class="sa-form" data-auth-form="login" novalidate>
            <label class="sa-field">
              <span class="sa-lbl">البريد الإلكتروني أو رقم الجوال</span>
              <div class="sa-input-wrap">
                <i class="fas fa-user sa-input-ic"></i>
                <input type="text" name="identifier" autocomplete="username" required
                  placeholder="example@mail.com  أو  5XXXXXXXX" />
              </div>
              <small class="sa-hint" data-id-hint>يمكنك استخدام البريد الإلكتروني أو رقم جوالك المسجل لدينا</small>
            </label>

            <div class="sa-links">
              <a href="#" data-auth-go="forgot"><i class="fas fa-key"></i> نسيت اسم المستخدم؟</a>
            </div>

            <button type="submit" class="sa-btn sa-btn-primary">
              <span>متابعة</span> <i class="fas fa-arrow-left"></i>
            </button>
          </form>

          <div class="sa-divider"><span>أو</span></div>

          <div class="sa-switch">
            <span>ليس لديك حساب في جمعية إسكان؟</span>
            <button type="button" class="sa-btn sa-btn-switch sa-btn-switch--accent" data-auth-go="register">
              <i class="fas fa-user-plus"></i> إنشاء حساب جديد
            </button>
          </div>
        </section>

        <!-- ====== شاشة 2: اختيار طريقة التحقق ====== -->
        <section class="sa-view" data-auth-view="method" hidden>
          <h3 class="sa-h">التحقّق بخطوتين</h3>
          <p class="sa-sub">لحماية حسابك سنرسل رمز تحقق إلى:</p>

          <div class="sa-methods">
            <button type="button" class="sa-method" data-auth-method="email">
              <div class="ic"><i class="fas fa-envelope"></i></div>
              <div class="tx">
                <strong>البريد الإلكتروني</strong>
                <span data-auth-email-mask>—</span>
              </div>
              <i class="fas fa-circle-check tick"></i>
            </button>
            <button type="button" class="sa-method" data-auth-method="phone">
              <div class="ic"><i class="fas fa-mobile-screen"></i></div>
              <div class="tx">
                <strong>رقم الجوال</strong>
                <span data-auth-phone-mask>—</span>
              </div>
              <i class="fas fa-circle-check tick"></i>
            </button>
          </div>

          <div class="sa-row">
            <button type="button" class="sa-btn sa-btn-ghost" data-auth-go="login"><i class="fas fa-arrow-right"></i> رجوع</button>
            <button type="button" class="sa-btn sa-btn-primary" data-auth-send-otp>
              <span>إرسال رمز التحقق</span> <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </section>

        <!-- ====== شاشة 3: إدخال رمز OTP ====== -->
        <section class="sa-view" data-auth-view="otp" hidden>
          <h3 class="sa-h">أدخل رمز التحقق</h3>
          <p class="sa-sub">تم إرسال رمز مكوّن من 6 أرقام إلى <strong data-auth-target>—</strong></p>

          <div class="sa-otp" data-auth-otp dir="ltr">
            <input type="text" inputmode="numeric" maxlength="1" />
            <input type="text" inputmode="numeric" maxlength="1" />
            <input type="text" inputmode="numeric" maxlength="1" />
            <input type="text" inputmode="numeric" maxlength="1" />
            <input type="text" inputmode="numeric" maxlength="1" />
            <input type="text" inputmode="numeric" maxlength="1" />
          </div>

          <div class="sa-otp-meta">
            <button type="button" class="sa-link" data-auth-go="method"><i class="fas fa-right-left"></i> تغيير طريقة التحقق</button>
            <button type="button" class="sa-link" data-auth-resend><i class="fas fa-rotate"></i> إعادة الإرسال <span data-auth-timer></span></button>
          </div>

          <div class="sa-row">
            <button type="button" class="sa-btn sa-btn-ghost" data-auth-go="method"><i class="fas fa-arrow-right"></i> رجوع</button>
            <button type="button" class="sa-btn sa-btn-primary" data-auth-verify>
              <span>تحقّق ودخول</span> <i class="fas fa-shield-halved"></i>
            </button>
          </div>
        </section>

        <!-- ====== شاشة: نسيت اسم المستخدم ====== -->
        <section class="sa-view" data-auth-view="forgot" hidden>
          <h3 class="sa-h">استرجاع اسم المستخدم</h3>
          <p class="sa-sub">أدخل رقم هويتك أو إقامتك وسنرسل لك بيانات الدخول على البريد/الجوال المسجّل.</p>
          <form class="sa-form" data-auth-form="forgot" novalidate>
            <label class="sa-field">
              <span class="sa-lbl">رقم الهوية أو الإقامة</span>
              <div class="sa-input-wrap">
                <i class="fas fa-id-card sa-input-ic"></i>
                <input type="text" inputmode="numeric" maxlength="10" placeholder="١٠ أرقام" required />
              </div>
            </label>
            <div class="sa-row">
              <button type="button" class="sa-btn sa-btn-ghost" data-auth-go="login"><i class="fas fa-arrow-right"></i> رجوع</button>
              <button type="submit" class="sa-btn sa-btn-primary"><span>إرسال البيانات</span> <i class="fas fa-paper-plane"></i></button>
            </div>
          </form>
        </section>

        <!-- ====== شاشة: إنشاء حساب جديد ====== -->
        <section class="sa-view" data-auth-view="register" hidden>
          <h3 class="sa-h">انضم إلى عائلة إسكان</h3>
          <p class="sa-sub">حساب واحد يفتح لك جميع خدمات الجمعية: التبرع، المتجر، طلب الخدمات والمزيد.</p>

          <form class="sa-form" data-auth-form="register" novalidate>
            <label class="sa-field">
              <span class="sa-lbl">الاسم الكامل</span>
              <div class="sa-input-wrap"><i class="fas fa-user sa-input-ic"></i>
                <input type="text" name="name" maxlength="80" required placeholder="اكتب اسمك الثلاثي" />
              </div>
            </label>
            <label class="sa-field">
              <span class="sa-lbl">رقم الجوال</span>
              <div class="sa-input-wrap sa-phone"><span class="sa-phone-cc">+966</span>
                <input type="tel" name="phone" maxlength="9" pattern="5[0-9]{8}" required placeholder="5XXXXXXXX" />
              </div>
            </label>
            <label class="sa-field">
              <span class="sa-lbl">البريد الإلكتروني</span>
              <div class="sa-input-wrap"><i class="fas fa-envelope sa-input-ic"></i>
                <input type="email" name="email" maxlength="120" required placeholder="example@mail.com" />
              </div>
            </label>

            <label class="sa-check">
              <input type="checkbox" name="agree" data-auth-agree required />
              <span>
                أوافق على
                <button type="button" class="sa-link sa-link-inline" data-auth-go="terms">الشروط والأحكام وسياسة الخصوصية</button>
                الخاصة بجمعية إسكان.
              </span>
            </label>

            <button type="submit" class="sa-btn sa-btn-primary">
              <span>إنشاء الحساب</span> <i class="fas fa-user-check"></i>
            </button>
          </form>

          <div class="sa-switch">
            <span>لديك حساب بالفعل في جمعية إسكان؟</span>
            <button type="button" class="sa-btn sa-btn-switch" data-auth-go="login">
              <i class="fas fa-right-to-bracket"></i> تسجيل الدخول
            </button>
          </div>
        </section>

        <!-- ====== شاشة: الشروط والأحكام ====== -->
        <section class="sa-view sa-view-terms" data-auth-view="terms" hidden>
          <h3 class="sa-h">الشروط والأحكام</h3>
          <p class="sa-sub">يرجى قراءة الشروط بعناية قبل الموافقة عليها.</p>
          <div class="sa-terms-box">
            <h4>1. التعريفات</h4>
            <p>"الجمعية" تشير إلى جمعية إسكان للخدمات الاجتماعية والرعاية، و"المستخدم" يشير إلى أي شخص يقوم بإنشاء حساب أو استخدام خدمات الجمعية.</p>
            <h4>2. استخدام الحساب</h4>
            <p>يلتزم المستخدم بتقديم بيانات صحيحة وكاملة، والحفاظ على سرية بيانات الدخول، وتحمّل مسؤولية أي نشاط يتم من خلال حسابه.</p>
            <h4>3. الخصوصية وحماية البيانات</h4>
            <p>تلتزم الجمعية بحماية بياناتك الشخصية وفق نظام حماية البيانات الشخصية في المملكة العربية السعودية، ولن تتم مشاركتها مع أي طرف ثالث دون موافقتك إلا وفق ما يقتضيه النظام.</p>
            <h4>4. التبرعات والمدفوعات</h4>
            <p>جميع التبرعات والمدفوعات تتم عبر بوابات دفع آمنة، وتُصدر إيصالات إلكترونية معتمدة. لا يحق استرداد التبرعات بعد إتمامها إلا وفق سياسة الاسترداد المعتمدة.</p>
            <h4>5. التعديلات</h4>
            <p>تحتفظ الجمعية بحق تعديل هذه الشروط في أي وقت، وسيتم إشعار المستخدمين بالتعديلات الجوهرية عبر البريد أو الجوال.</p>
            <h4>6. القانون المُطبَّق</h4>
            <p>تخضع هذه الشروط لأنظمة المملكة العربية السعودية، وتختص محاكم الرياض بالنظر في أي نزاع ينشأ عنها.</p>
          </div>
          <div class="sa-row">
            <button type="button" class="sa-btn sa-btn-ghost" data-auth-go="register"><i class="fas fa-arrow-right"></i> رجوع</button>
            <button type="button" class="sa-btn sa-btn-primary" data-auth-accept-terms>
              <span>أوافق على الشروط</span> <i class="fas fa-check"></i>
            </button>
          </div>
        </section>

        <!-- ====== شاشة النجاح ====== -->
        <section class="sa-view sa-view-success" data-auth-view="success" hidden>
          <div class="sa-success-anim"><i class="fas fa-circle-check"></i></div>
          <h3 class="sa-h" data-auth-success-title>تم تسجيل دخولك بنجاح</h3>
          <p class="sa-sub" data-auth-success-sub>مرحبًا بك في بوابة جمعية إسكان. سيتم تحويلك للوحة حسابك خلال لحظات.</p>
          <button type="button" class="sa-btn sa-btn-primary" data-auth-close><span>متابعة</span> <i class="fas fa-arrow-left"></i></button>
        </section>

      </div>
    </div>
  </div>
  `;


  const footerHTML = `
  <footer class="sx-footer" id="sx-footer">
    <div class="sx-fmain">
      <div class="sx-fbrand">
        <div class="sx-fname">
          <div class="sx-mark">إ</div>
          <div><div class="nm">جمعية إسكان</div><div class="tg">للخدمات الاجتماعية والرعاية</div></div>
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
        <h4>روابط تهمك</h4>
        <ul>
          <li><a href="governance.html"><i class="fas fa-angle-left"></i> الحوكمة</a></li>
          <li><a href="terms.html"><i class="fas fa-angle-left"></i> الشروط والأحكام</a></li>
          <li><a href="privacy.html"><i class="fas fa-angle-left"></i> سياسة الخصوصية</a></li>
          <li><a href="careers.html"><i class="fas fa-angle-left"></i> الوظائف والتطوع</a></li>
          <li><a href="contact.html"><i class="fas fa-angle-left"></i> تواصل معنا</a></li>
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
          <div class="sx-lic-mark">
            <img src="assets/images/License/ncnps-mark.svg" alt="المركز الوطني لتنمية القطاع غير الربحي" />
          </div>
          <div class="sx-lic-info">
            <div class="sx-lic-title">الجمعية مصرحة من المركز الوطني لتنمية القطاع غير الربحي</div>
            <p class="sx-lic-desc">تعمل الجمعية وفق ترخيص رسمي صادر من المركز الوطني لتنمية القطاع غير الربحي، مع إتاحة شهادات الترخيص للعرض والتحميل.</p>
            <div class="sx-lic-meta">
              <span><i class="fas fa-hashtag"></i> رقم الترخيص: <b>0000</b></span>
              <span><i class="fas fa-circle-check"></i> الحالة: <b>ساري</b></span>
              <span><i class="fas fa-hand-holding-heart"></i> جمع التبرعات: <b>متاح</b></span>
              <span><i class="fas fa-rotate"></i> آخر تحديث: <b>هذا الشهر</b></span>
            </div>
          </div>
        </div>
        <div class="sx-lic-actions">
          <button type="button" class="sx-lic-btn sx-lic-btn-primary" data-sx-cert-open data-cert="association">
            <i class="fas fa-certificate"></i> عرض شهادة ترخيص الجمعية
          </button>
          <button type="button" class="sx-lic-btn sx-lic-btn-outline" data-sx-cert-open data-cert="fundraising">
            <i class="fas fa-hand-holding-dollar"></i> عرض ترخيص جمع التبرعات
          </button>
        </div>
      </div>
    </div>

    <div class="sx-fbottom">
      <div class="sx-fbcont">
        <div>© جميع الحقوق محفوظة لجمعية إسكان <span data-year>2026</span></div>
        <div>بواسطة <a href="https://webyan.sa" target="_blank" rel="noopener" class="sx-by">ويبيان</a></div>
      </div>
    </div>
  </footer>

  <!-- نافذة عرض الترخيص -->
  <div class="sx-mod-overlay sx-cert-overlay" data-sx-cert-overlay>
    <div class="sx-mod sx-cert-mod" role="dialog" aria-modal="true" aria-labelledby="sx-cert-title">
      <div class="sx-mod-head sx-cert-head">
        <div class="sx-cert-head-l">
          <img src="assets/images/License/ncnps-logo.svg" alt="المركز الوطني" class="sx-cert-logo" />
          <h3 id="sx-cert-title" data-sx-cert-title>شهادة ترخيص الجمعية</h3>
        </div>
        <button class="sx-dclose" data-sx-cert-close aria-label="إغلاق"><i class="fas fa-times"></i></button>
      </div>
      <div class="sx-mod-body sx-cert-body">
        <div class="sx-cert-meta">
          <div class="sx-cmrow"><span>اسم الجمعية</span><b>جمعية إسكان للخدمات الاجتماعية والرعاية</b></div>
          <div class="sx-cmrow"><span data-sx-cert-numlabel>رقم الترخيص</span><b data-sx-cert-num>0000</b></div>
          <div class="sx-cmrow"><span>الجهة المشرفة</span><b>المركز الوطني لتنمية القطاع غير الربحي</b></div>
          <div class="sx-cmrow"><span>حالة الترخيص</span><b class="sx-cm-ok"><i class="fas fa-circle-check"></i> ساري</b></div>
          <div class="sx-cmrow" data-sx-cert-scope-row hidden><span>نطاق الترخيص</span><b data-sx-cert-scope>—</b></div>
          <div class="sx-cmrow"><span>تاريخ الإصدار</span><b>1445 هـ</b></div>
        </div>
        <div class="sx-cert-frame">
          <img data-sx-cert-img src="assets/images/License/association-license-certificate.jpg" alt="صورة الترخيص" />
        </div>
      </div>
      <div class="sx-mod-actions">
        <button type="button" class="s-btn s-btn-outline" data-sx-cert-share><i class="fas fa-share-nodes"></i> مشاركة</button>
        <a class="s-btn s-btn-outline" data-sx-cert-download href="assets/images/License/association-license-certificate.jpg" download><i class="fas fa-download"></i> تحميل الترخيص</a>
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

    // تسجيل الدخول / إنشاء حساب — نافذة موحّدة
    initSanadAuthModal();

    // إغلاق القوائم عند الضغط خارجها
    document.addEventListener("click", () => {
      document.querySelectorAll("[data-drop].open").forEach((o) => o.classList.remove("open"));
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document.querySelectorAll("[data-drop].open").forEach((o) => o.classList.remove("open"));
        document.querySelector("[data-auth-root].open") && closeSanadAuthModal();
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

    // قائمة اللغة المنسدلة
    document.querySelectorAll("[data-lang-dd]").forEach((dd) => {
      const trigger = dd.querySelector(".sx-lang-trigger");
      const current = dd.querySelector(".sx-lang-current");
      trigger?.addEventListener("click", (e) => {
        e.stopPropagation();
        dd.classList.toggle("open");
        trigger.setAttribute("aria-expanded", dd.classList.contains("open"));
      });
      dd.querySelectorAll(".sx-lang-menu button").forEach((b) => {
        b.addEventListener("click", (e) => {
          e.stopPropagation();
          const lang = b.getAttribute("data-lang");
          dd.querySelectorAll(".sx-lang-menu button").forEach((x) => {
            x.classList.toggle("active", x === b);
            x.setAttribute("aria-selected", x === b ? "true" : "false");
          });
          if (current) current.textContent = b.textContent.trim();
          dd.classList.remove("open");
          trigger.setAttribute("aria-expanded", "false");
          if (lang === "en") sxToast("النسخة الإنجليزية قيد الإعداد");
        });
      });
    });
    document.addEventListener("click", (e) => {
      document.querySelectorAll("[data-lang-dd].open").forEach((dd) => {
        if (!dd.contains(e.target)) {
          dd.classList.remove("open");
          dd.querySelector(".sx-lang-trigger")?.setAttribute("aria-expanded", "false");
        }
      });
    });
    // توافق قديم
    document.querySelectorAll('[data-lang-toggle]').forEach((b) => {
      b.addEventListener("click", (e) => {
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
    const CERT_DATA = {
      association: {
        title: "شهادة ترخيص الجمعية",
        numLabel: "رقم الترخيص",
        num: "0000",
        scope: "",
        img: "assets/images/License/association-license-certificate.jpg",
        file: "assets/images/License/association-license-certificate.jpg",
        shareTitle: "شهادة ترخيص جمعية إسكان",
      },
      fundraising: {
        title: "ترخيص جمع التبرعات",
        numLabel: "رقم ترخيص جمع التبرعات",
        num: "0000",
        scope: "جمع التبرعات عبر القنوات المعتمدة",
        img: "assets/images/License/fundraising-license-certificate.jpg",
        file: "assets/images/License/fundraising-license-certificate.jpg",
        shareTitle: "ترخيص جمع التبرعات — جمعية إسكان",
      },
    };
    let currentCert = "association";
    function applyCert(key) {
      const d = CERT_DATA[key] || CERT_DATA.association;
      currentCert = key;
      const q = (s) => document.querySelector(s);
      q("[data-sx-cert-title]") && (q("[data-sx-cert-title]").textContent = d.title);
      q("[data-sx-cert-numlabel]") && (q("[data-sx-cert-numlabel]").textContent = d.numLabel);
      q("[data-sx-cert-num]") && (q("[data-sx-cert-num]").textContent = d.num);
      const sRow = q("[data-sx-cert-scope-row]");
      if (sRow) {
        if (d.scope) { sRow.hidden = false; q("[data-sx-cert-scope]").textContent = d.scope; }
        else { sRow.hidden = true; }
      }
      const img = q("[data-sx-cert-img]"); if (img) img.src = d.img;
      const dl = q("[data-sx-cert-download]"); if (dl) dl.href = d.file;
    }
    document.querySelectorAll("[data-sx-cert-open]").forEach((b) =>
      b.addEventListener("click", () => { applyCert(b.dataset.cert || "association"); openCert(); })
    );
    document.querySelectorAll("[data-sx-cert-close]").forEach((b) => b.addEventListener("click", closeCert));
    cert?.addEventListener("click", (e) => { if (e.target === cert) closeCert(); });
    document.querySelector("[data-sx-cert-share]")?.addEventListener("click", () => {
      const url = location.origin + location.pathname;
      const d = CERT_DATA[currentCert];
      if (navigator.share) navigator.share({ title: d.shareTitle, url }).catch(() => {});
      else if (navigator.clipboard) { navigator.clipboard.writeText(url); sxToast("تم نسخ رابط الترخيص"); }
      else sxToast("تم نسخ رابط الترخيص");
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

  // ============ نافذة المصادقة الموحّدة ============
  let _saAuthState = { identifier: "", method: "email", email: "", phone: "", timer: 0, _tid: null };

  function openSanadAuthModal(view) {
    const root = document.querySelector("[data-auth-root]");
    if (!root) return;
    root.classList.add("open");
    root.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    showSanadAuthView(view || "login");
  }
  function closeSanadAuthModal() {
    const root = document.querySelector("[data-auth-root]");
    if (!root) return;
    root.classList.remove("open");
    root.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (_saAuthState._tid) { clearInterval(_saAuthState._tid); _saAuthState._tid = null; }
  }
  function showSanadAuthView(name) {
    const root = document.querySelector("[data-auth-root]");
    if (!root) return;
    root.querySelectorAll("[data-auth-view]").forEach((v) => {
      v.hidden = v.getAttribute("data-auth-view") !== name;
    });
    // ترقيم الخطوات
    const stepMap = { login: 1, forgot: 1, register: 1, terms: 1, method: 2, otp: 3, success: 3 };
    const step = stepMap[name] || 1;
    root.querySelectorAll("[data-step-dot]").forEach((d) => {
      d.classList.toggle("active", Number(d.getAttribute("data-step-dot")) <= step);
    });
    const stepsBar = root.querySelector("[data-auth-steps]");
    if (stepsBar) stepsBar.style.display = (name === "register" || name === "forgot" || name === "terms" || name === "success") ? "none" : "";
    // عناوين فرعية
    const sub = root.querySelector("[data-auth-subtitle]");
    const subs = {
      login: "بوابة موحدة لجميع حسابات الجمعية",
      method: "اختر طريقة استلام رمز التحقق",
      otp: "أدخل الرمز المرسل إليك",
      register: "خطوات بسيطة لإنشاء حسابك",
      terms: "اطلع على الشروط قبل المتابعة",
      forgot: "سنساعدك في استرجاع بيانات الدخول",
      success: "تمت العملية بنجاح",
    };
    if (sub) sub.textContent = subs[name] || subs.login;
    // تركيز
    setTimeout(() => {
      const f = root.querySelector(`[data-auth-view="${name}"] input, [data-auth-view="${name}"] button`);
      f && f.focus({ preventScroll: true });
    }, 60);
  }

  function _saIsEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function _saIsPhone(v) { return /^5\d{8}$/.test(v.replace(/\D/g, "")); }
  function _saMaskEmail(e) {
    if (!e || !e.includes("@")) return "—";
    const [u, d] = e.split("@");
    return (u.slice(0, 2) + "•••" + u.slice(-1)) + "@" + d;
  }
  function _saMaskPhone(p) {
    const d = String(p || "").replace(/\D/g, "");
    if (d.length < 9) return "—";
    return "+966 " + d.slice(0, 2) + " ••• " + d.slice(-2);
  }
  function _saStartTimer() {
    const root = document.querySelector("[data-auth-root]");
    const lbl = root?.querySelector("[data-auth-timer]");
    const btn = root?.querySelector("[data-auth-resend]");
    if (!lbl || !btn) return;
    if (_saAuthState._tid) clearInterval(_saAuthState._tid);
    _saAuthState.timer = 45;
    btn.disabled = true; btn.classList.add("is-disabled");
    const tick = () => {
      lbl.textContent = _saAuthState.timer > 0 ? `(${_saAuthState.timer}ث)` : "";
      if (_saAuthState.timer <= 0) {
        clearInterval(_saAuthState._tid); _saAuthState._tid = null;
        btn.disabled = false; btn.classList.remove("is-disabled");
      }
      _saAuthState.timer--;
    };
    tick();
    _saAuthState._tid = setInterval(tick, 1000);
  }

  function initSanadAuthModal() {
    // فتح من أي زر
    document.addEventListener("click", (e) => {
      const opener = e.target.closest("[data-auth-open]");
      if (opener) {
        e.preventDefault();
        openSanadAuthModal(opener.getAttribute("data-auth-open"));
      }
      const closer = e.target.closest("[data-auth-close]");
      if (closer) { e.preventDefault(); closeSanadAuthModal(); }
      const navL = e.target.closest("[data-auth-go]");
      if (navL) { e.preventDefault(); showSanadAuthView(navL.getAttribute("data-auth-go")); }
    });

    const root = document.querySelector("[data-auth-root]");
    if (!root) return;

    // نموذج الدخول
    const loginForm = root.querySelector('[data-auth-form="login"]');
    loginForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = (loginForm.identifier.value || "").trim();
      const hint = root.querySelector("[data-id-hint]");
      const wrap = loginForm.querySelector(".sa-input-wrap");
      const isEm = _saIsEmail(v), isPh = _saIsPhone(v);
      if (!isEm && !isPh) {
        wrap?.classList.add("err");
        hint.textContent = "صيغة غير صحيحة. أدخل بريدًا إلكترونيًا أو رقم جوال سعودي يبدأ بـ 5";
        hint.classList.add("err");
        return;
      }
      wrap?.classList.remove("err"); hint.classList.remove("err");
      hint.textContent = "يمكنك استخدام البريد الإلكتروني أو رقم جوالك المسجل لدينا";
      _saAuthState.identifier = v;
      // لمحاكاة بيانات الحساب
      _saAuthState.email = isEm ? v : "user@sanad.org.sa";
      _saAuthState.phone = isPh ? v.replace(/\D/g, "") : "5XXXXXX12";
      _saAuthState.method = isEm ? "email" : "phone";
      root.querySelector("[data-auth-email-mask]").textContent = _saMaskEmail(_saAuthState.email);
      root.querySelector("[data-auth-phone-mask]").textContent = _saMaskPhone(_saAuthState.phone);
      _saSelectMethod(_saAuthState.method);
      showSanadAuthView("method");
    });

    // اختيار طريقة التحقق
    function _saSelectMethod(m) {
      _saAuthState.method = m;
      root.querySelectorAll("[data-auth-method]").forEach((b) => {
        b.classList.toggle("active", b.getAttribute("data-auth-method") === m);
      });
    }
    root.querySelectorAll("[data-auth-method]").forEach((b) => {
      b.addEventListener("click", () => _saSelectMethod(b.getAttribute("data-auth-method")));
    });

    // إرسال OTP
    root.querySelector("[data-auth-send-otp]")?.addEventListener("click", () => {
      const target = _saAuthState.method === "email"
        ? _saMaskEmail(_saAuthState.email)
        : _saMaskPhone(_saAuthState.phone);
      root.querySelector("[data-auth-target]").textContent = target;
      root.querySelectorAll("[data-auth-otp] input").forEach((i) => (i.value = ""));
      showSanadAuthView("otp");
      _saStartTimer();
    });
    root.querySelector("[data-auth-resend]")?.addEventListener("click", () => {
      if (_saAuthState.timer > 0) return;
      _saStartTimer();
    });

    // OTP — انتقال تلقائي
    const otps = root.querySelectorAll("[data-auth-otp] input");
    otps.forEach((inp, i) => {
      inp.addEventListener("input", () => {
        inp.value = inp.value.replace(/\D/g, "").slice(0, 1);
        if (inp.value && otps[i + 1]) otps[i + 1].focus();
      });
      inp.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !inp.value && otps[i - 1]) otps[i - 1].focus();
      });
      inp.addEventListener("paste", (e) => {
        const t = (e.clipboardData?.getData("text") || "").replace(/\D/g, "").slice(0, otps.length);
        if (!t) return;
        e.preventDefault();
        [...t].forEach((c, k) => { if (otps[k]) otps[k].value = c; });
        otps[Math.min(t.length, otps.length) - 1]?.focus();
      });
    });
    root.querySelector("[data-auth-verify]")?.addEventListener("click", () => {
      const code = [...otps].map((i) => i.value).join("");
      if (code.length < 6) {
        otps.forEach((i) => i.classList.add("err"));
        setTimeout(() => otps.forEach((i) => i.classList.remove("err")), 1200);
        return;
      }
      root.querySelector("[data-auth-success-title]").textContent = "تم تسجيل دخولك بنجاح";
      root.querySelector("[data-auth-success-sub]").textContent = "مرحبًا بك في بوابة جمعية إسكان. يمكنك الآن متابعة طلباتك وإدارة حسابك.";
      showSanadAuthView("success");
    });

    // نموذج إنشاء الحساب
    const regForm = root.querySelector('[data-auth-form="register"]');
    regForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const agree = regForm.querySelector("[data-auth-agree]");
      if (!agree.checked) {
        agree.closest(".sa-check")?.classList.add("err");
        setTimeout(() => agree.closest(".sa-check")?.classList.remove("err"), 1200);
        return;
      }
      if (!regForm.checkValidity()) { regForm.reportValidity(); return; }
      _saAuthState.email = regForm.email.value.trim();
      _saAuthState.phone = regForm.phone.value.trim();
      root.querySelector("[data-auth-success-title]").textContent = "تم إنشاء حسابك بنجاح 🎉";
      root.querySelector("[data-auth-success-sub]").textContent = "أهلاً بك في عائلة إسكان! سجّل دخولك الآن لتتمكن من استخدام كافة الخدمات.";
      showSanadAuthView("success");
    });

    // قبول الشروط (من شاشة الشروط) — يحدّد التشيك بوكس ويرجع لإنشاء الحساب
    root.querySelector("[data-auth-accept-terms]")?.addEventListener("click", () => {
      const cb = root.querySelector("[data-auth-agree]");
      if (cb) { cb.checked = true; cb.closest(".sa-check")?.classList.remove("err"); }
      showSanadAuthView("register");
    });
  }
})();


/* =============================================
   صفحة الوظائف وفرص التطوع — careers
   ============================================= */
(function () {
  "use strict";
  const grid = document.querySelector("[data-careers-grid]");
  if (!grid) return;

  const items = Array.from(grid.querySelectorAll("[data-career]"));
  const state = { type: "all", mode: "all", time: "all", q: "" };

  const apply = () => {
    const q = state.q.trim().toLowerCase();
    let visible = 0;
    items.forEach((el) => {
      const t = el.getAttribute("data-type") || "";
      const m = el.getAttribute("data-mode") || "";
      const tm = el.getAttribute("data-time") || "";
      const title = (el.getAttribute("data-title") || "").toLowerCase();
      const ok =
        (state.type === "all" || t === state.type) &&
        (state.mode === "all" || m === state.mode) &&
        (state.time === "all" || tm === state.time) &&
        (!q || title.indexOf(q) !== -1);
      el.classList.toggle("is-hidden", !ok);
      if (ok) visible++;
    });
    const empty = document.querySelector("[data-careers-empty]");
    if (empty) empty.classList.toggle("is-hidden", visible > 0);
  };

  document.querySelectorAll("[data-cfilter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const k = btn.getAttribute("data-cfilter");
      const v = btn.getAttribute("data-value");
      state[k] = v;
      document.querySelectorAll(`[data-cfilter="${k}"]`).forEach((b) => b.classList.toggle("active", b === btn));
      apply();
    });
  });
  const search = document.querySelector("[data-careers-search]");
  search?.addEventListener("input", (e) => { state.q = e.target.value; apply(); });

  /* نافذة التفاصيل */
  const detailsModal = document.getElementById("crDetails");
  const detailsBody = document.getElementById("crDetailsBody");
  const detailsTitle = document.getElementById("crDetailsTitle");
  const detailsApply = document.getElementById("crDetailsApply");

  const fillDetails = (el) => {
    const type = el.getAttribute("data-type");
    const data = JSON.parse(el.getAttribute("data-info") || "{}");
    detailsTitle.innerHTML = `<i class="fas ${type === 'job' ? 'fa-briefcase' : 'fa-hands-helping'}"></i> ${data.title}`;
    const rows = [];
    if (type === "job") {
      rows.push(["الإدارة", data.dept], ["مقر العمل", data.location], ["نوع الدوام", data.time], ["آخر موعد للتقديم", data.deadline]);
    } else {
      rows.push(["المجال التطوعي", data.field], ["طريقة المشاركة", data.mode], ["عدد الساعات", data.hours], ["الموقع", data.location], ["تاريخ البداية", data.start], ["المقاعد المتاحة", data.seats]);
    }
    const meta = rows.map(([k, v]) => `<div class="cr-meta-item"><span>${k}</span><strong>${v || "-"}</strong></div>`).join("");
    const sections = [
      ["وصف", data.desc],
      [type === "job" ? "المهام والمسؤوليات" : "المهام التطوعية", data.tasks],
      [type === "job" ? "المؤهلات المطلوبة" : "المتطلبات", data.req],
      [type === "job" ? "المهارات المطلوبة" : "الفئة المناسبة", data.skills],
    ].filter(([, v]) => v && v.length).map(([k, v]) => `<div class="cr-sec"><h5>${k}</h5>${Array.isArray(v) ? `<ul>${v.map(x => `<li>${x}</li>`).join("")}</ul>` : `<p>${v}</p>`}</div>`).join("");

    detailsBody.innerHTML = `<div class="cr-meta-grid">${meta}</div>${sections}`;
    detailsApply.setAttribute("data-apply-type", type);
    detailsApply.setAttribute("data-apply-title", data.title);
  };

  const openModal = (m) => { m?.classList.add("open"); document.body.style.overflow = "hidden"; };
  const closeModal = (m) => { m?.classList.remove("open"); document.body.style.overflow = ""; };

  grid.addEventListener("click", (e) => {
    const card = e.target.closest("[data-career]");
    if (!card) return;
    if (e.target.closest("[data-cr-details]")) {
      fillDetails(card);
      openModal(detailsModal);
    } else if (e.target.closest("[data-cr-apply]")) {
      const data = JSON.parse(card.getAttribute("data-info") || "{}");
      openApply(card.getAttribute("data-type"), data.title);
    }
  });

  document.querySelectorAll("[data-cr-close]").forEach((b) => b.addEventListener("click", () => {
    closeModal(detailsModal);
    closeModal(document.getElementById("crApply"));
    closeModal(document.getElementById("crSuccess"));
  }));
  [detailsModal, document.getElementById("crApply"), document.getElementById("crSuccess")].forEach((m) => {
    m?.addEventListener("click", (e) => { if (e.target === m) closeModal(m); });
  });

  /* المشاركة */
  document.getElementById("crShare")?.addEventListener("click", () => {
    const url = location.href;
    if (navigator.clipboard) navigator.clipboard.writeText(url);
    window.sxToast && sxToast("تم نسخ رابط الفرصة");
  });

  /* نموذج التقديم */
  const applyModal = document.getElementById("crApply");
  const applyTitle = document.getElementById("crApplyTitle");
  const jobFields = document.querySelectorAll("[data-cr-job-field]");
  const volFields = document.querySelectorAll("[data-cr-vol-field]");
  const applyForm = document.getElementById("crApplyForm");
  const applyTypeInput = document.getElementById("crApplyType");
  const applyTargetInput = document.getElementById("crApplyTarget");

  const openApply = (type, title) => {
    applyTypeInput.value = type;
    applyTargetInput.value = title || "";
    applyTitle.innerHTML = `<i class="fas ${type === 'job' ? 'fa-briefcase' : 'fa-hands-helping'}"></i> ${type === "job" ? "التقدم للوظيفة" : "التقدم لفرصة التطوع"}${title ? " — " + title : ""}`;
    jobFields.forEach((f) => f.style.display = type === "job" ? "" : "none");
    volFields.forEach((f) => f.style.display = type === "vol" ? "" : "none");
    jobFields.forEach((f) => f.querySelectorAll("input,select,textarea").forEach((i) => i.required = type === "job" && i.dataset.req === "1"));
    volFields.forEach((f) => f.querySelectorAll("input,select,textarea").forEach((i) => i.required = type === "vol" && i.dataset.req === "1"));
    closeModal(detailsModal);
    openModal(applyModal);
  };

  detailsApply?.addEventListener("click", () => {
    openApply(detailsApply.getAttribute("data-apply-type"), detailsApply.getAttribute("data-apply-title"));
  });

  applyForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const type = applyTypeInput.value;
    const seq = String(Math.floor(Math.random() * 9000) + 1000);
    const ticket = (type === "job" ? "CAR-2026-" : "VOL-2026-") + seq;
    document.getElementById("crTicket").textContent = ticket;
    closeModal(applyModal);
    openModal(document.getElementById("crSuccess"));
    applyForm.reset();
  });
})();

/* ============================================================
   SXQ — Floating Quick Bar + Donate/Gift/Join Modals (v1)
   Self-contained. Does not affect existing modals/donation flows.
   ============================================================ */
(function(){
  if (window.__sxqInit) return; window.__sxqInit = true;
  if (typeof document === "undefined") return;

  const OPPS = [
    { id: "vol-food", type: "vol", title: "متطوع توزيع السلال الغذائية", city: "الرياض", mode: "ميداني" },
    { id: "vol-media", type: "vol", title: "متطوع إعلامي", city: "عن بُعد", mode: "جزئي" },
    { id: "vol-event", type: "vol", title: "متطوع تنظيم فعاليات", city: "جدة", mode: "ميداني" },
    { id: "job-spec",  type: "job", title: "أخصائي خدمات مستفيدين", city: "الرياض", mode: "دوام كامل" },
    { id: "job-coord", type: "job", title: "منسق برامج اجتماعية", city: "الدمام", mode: "دوام كامل" },
  ];

  const CAUSES = [
    "كفالة الأيتام","الصدقة الجارية","السلة الغذائية","دعم علاج","زكاة المال","وقف الرعاية"
  ];

  const fmt = (n) => (Number(n)||0).toLocaleString("en-US") + " ريال";

  /* ---------- Build UI ---------- */
  const root = document.createElement("div");
  root.id = "sxq-root";
  root.innerHTML = `
    <!-- Floating Action Bar (vertical, always visible) -->
    <nav class="sxq-fab" id="sxqFab" aria-label="إجراءات سريعة">
      <ul class="sxq-fab-list">
        <li><button type="button" class="sxq-fab-item" data-sxq-open="donate" data-tip="تبرع سريع" aria-label="تبرع سريع"><i class="fas fa-hand-holding-heart"></i><span class="sxq-fab-label">تبرع سريع</span></button></li>
        <li><button type="button" class="sxq-fab-item" data-sxq-open="gift" data-tip="إهداء التبرع" aria-label="إهداء التبرع"><i class="fas fa-gift"></i><span class="sxq-fab-label">إهداء التبرع</span></button></li>
        <li><a class="sxq-fab-item" href="donations.html" data-tip="بوابة التبرعات" aria-label="بوابة التبرعات"><i class="fas fa-heart"></i><span class="sxq-fab-label">بوابة التبرعات</span></a></li>
        <li><button type="button" class="sxq-fab-item" data-sxq-open="join" data-tip="انضم معنا" aria-label="انضم معنا"><i class="fas fa-users"></i><span class="sxq-fab-label">انضم معنا</span></button></li>
        <li><button type="button" class="sxq-fab-item sxq-fab-item-gold" data-sxq-open="member" data-tip="طلب عضوية" aria-label="طلب عضوية"><i class="fas fa-id-card"></i><span class="sxq-fab-label">طلب عضوية</span></button></li>
        <li><a class="sxq-fab-item" href="beneficiaries.html" data-tip="بوابة المستفيدين" aria-label="بوابة المستفيدين"><i class="fas fa-user-shield"></i><span class="sxq-fab-label">بوابة المستفيدين</span></a></li>
      </ul>
      <button type="button" class="sxq-fab-mobile-toggle" id="sxqFabMobBtn" aria-label="إجراءات سريعة"><i class="fas fa-bolt"></i></button>
    </nav>


    <!-- Donate Modal -->
    <div class="sxq-modal" id="sxqDonate" role="dialog" aria-modal="true" aria-labelledby="sxqDonateTitle">
      <div class="sxq-dialog">
        <div class="sxq-head">
          <h3 id="sxqDonateTitle"><i class="fas fa-bolt"></i> <span data-sxq-htitle>التبرع السريع</span></h3>
          <button class="sxq-close" data-sxq-close aria-label="إغلاق"><i class="fas fa-times"></i></button>
        </div>
        <div class="sxq-body">
          <div class="sxq-steps" data-sxq-steps>
            <div class="sxq-step active" data-step="1"><span class="n">1</span> البيانات</div>
            <div class="sxq-step-sep"></div>
            <div class="sxq-step" data-step="2"><span class="n">2</span> الدفع</div>
            <div class="sxq-step-sep"></div>
            <div class="sxq-step" data-step="3"><span class="n">3</span> التأكيد</div>
          </div>

          <!-- Step 1 -->
          <div class="sxq-panel active" data-panel="1">
            <div class="sxq-field">
              <label>اختر فرصة التبرع</label>
              <select class="sxq-select" data-d-cause>${CAUSES.map(c=>`<option>${c}</option>`).join("")}</select>
            </div>
            <div class="sxq-field">
              <label>رقم الجوال (اختياري)</label>
              <input class="sxq-input" type="tel" inputmode="numeric" placeholder="05xxxxxxxx" data-d-phone>
            </div>
            <div class="sxq-field">
              <label>مبلغ التبرع</label>
              <div class="sxq-amts">
                <button type="button" class="sxq-amt" data-d-amt="50">50 ريال</button>
                <button type="button" class="sxq-amt active" data-d-amt="100">100 ريال</button>
                <button type="button" class="sxq-amt" data-d-amt="300">300 ريال</button>
                <button type="button" class="sxq-amt" data-d-amt="500">500 ريال</button>
              </div>
              <input class="sxq-input" type="number" min="1" placeholder="مبلغ آخر" data-d-other>
            </div>
            <label class="sxq-check"><input type="checkbox" data-d-anon> تبرع كـ "فاعل خير"</label>
            <div class="sxq-sum">
              <div class="sxq-sum-row"><span>فرصة التبرع</span><b data-s-cause>—</b></div>
              <div class="sxq-sum-row"><span>نوع التبرع</span><b>تبرع سريع</b></div>
              <div class="sxq-sum-row total"><span>مبلغ التبرع</span><b data-s-amt>100 ريال</b></div>
            </div>
            <div class="sxq-actions">
              <button class="sxq-btn sxq-btn-primary" data-sxq-next="2">إتمام التبرع <i class="fas fa-arrow-left"></i></button>
            </div>
          </div>

          <!-- Step 2: Payment -->
          <div class="sxq-panel" data-panel="2">
            <div class="sxq-pay-head">
              <div>
                <div class="l">فرصة التبرع</div>
                <div class="v" data-p-cause>—</div>
                <div class="l" style="margin-top:.35rem">طريقة الدفع: بطاقة بنكية</div>
              </div>
              <div style="text-align:end">
                <div class="l">المبلغ الإجمالي</div>
                <div class="amt" data-p-amt>100 <small>ريال</small></div>
              </div>
            </div>
            <div class="sxq-pay-meta">
              <span>بيانات البطاقة</span>
              <span class="brands">
                <span class="brand">مدى</span><span class="brand">VISA</span><span class="brand">MC</span>
              </span>
            </div>
            <div class="sxq-field">
              <label>اسم حامل البطاقة</label>
              <input class="sxq-input" type="text" placeholder="الاسم كما هو على البطاقة" data-p-name>
            </div>
            <div class="sxq-field">
              <label>رقم البطاقة</label>
              <input class="sxq-input" type="text" inputmode="numeric" maxlength="19" placeholder="0000 0000 0000 0000" data-p-num>
            </div>
            <div class="sxq-row2">
              <div class="sxq-field">
                <label>تاريخ الانتهاء</label>
                <input class="sxq-input" type="text" placeholder="شهر / سنة" maxlength="5" data-p-exp>
              </div>
              <div class="sxq-field">
                <label>رمز التحقق</label>
                <input class="sxq-input" type="text" inputmode="numeric" maxlength="4" placeholder="•••" data-p-cvc>
              </div>
            </div>
            <div class="sxq-actions">
              <button class="sxq-btn sxq-btn-ghost" data-sxq-prev="1"><i class="fas fa-arrow-right"></i> رجوع</button>
              <button class="sxq-btn sxq-btn-primary" data-sxq-pay>ادفع <span data-p-pay-amt>100</span> ريال</button>
            </div>
            <div class="sxq-secure"><i class="fas fa-shield-halved"></i> الدفع آمن — بيانات تجريبية للعرض فقط</div>
          </div>

          <!-- Step 3: Success -->
          <div class="sxq-panel" data-panel="3">
            <div class="sxq-success">
              <div class="sxq-success-ic"><i class="fas fa-check"></i></div>
              <h4>تم التبرع بنجاح</h4>
              <p>شكرًا لعطائكم، مساهمتكم تصنع أثرًا يصل إلى مستحقيه.</p>
              <div class="sxq-sum">
                <div class="sxq-sum-row"><span>رقم العملية</span><b data-ok-id>—</b></div>
                <div class="sxq-sum-row"><span>فرصة التبرع</span><b data-ok-cause>—</b></div>
                <div class="sxq-sum-row"><span>المتبرع</span><b data-ok-name>—</b></div>
                <div class="sxq-sum-row"><span>التاريخ</span><b data-ok-date>—</b></div>
                <div class="sxq-sum-row"><span>الحالة</span><b style="color:#0d7a4f">مكتملة</b></div>
                <div class="sxq-sum-row total"><span>المبلغ</span><b data-ok-amt>—</b></div>
              </div>
              <div class="sxq-actions">
                <button class="sxq-btn sxq-btn-ghost" data-sxq-receipt><i class="fas fa-file-invoice"></i> عرض سند التبرع</button>
                <a class="sxq-btn sxq-btn-primary" href="donations.html">بوابة التبرعات</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Gift Modal -->
    <div class="sxq-modal" id="sxqGift" role="dialog" aria-modal="true">
      <div class="sxq-dialog">
        <div class="sxq-head">
          <h3><i class="fas fa-gift"></i> إهداء التبرع</h3>
          <button class="sxq-close" data-sxq-close aria-label="إغلاق"><i class="fas fa-times"></i></button>
        </div>
        <div class="sxq-body">
          <div class="sxq-steps">
            <div class="sxq-step active" data-step="1"><span class="n">1</span> البيانات</div>
            <div class="sxq-step-sep"></div>
            <div class="sxq-step" data-step="2"><span class="n">2</span> الدفع</div>
            <div class="sxq-step-sep"></div>
            <div class="sxq-step" data-step="3"><span class="n">3</span> التأكيد</div>
          </div>

          <div class="sxq-panel active" data-panel="1">
            <div class="sxq-row2">
              <div class="sxq-field"><label>اسم المُهدى إليه</label><input class="sxq-input" data-g-to-name placeholder="مثال: أ. عبدالله"></div>
              <div class="sxq-field"><label>رقم جوال المُهدى إليه</label><input class="sxq-input" type="tel" data-g-to-phone placeholder="05xxxxxxxx"></div>
            </div>
            <div class="sxq-row2">
              <div class="sxq-field"><label>اسم المُهدي</label><input class="sxq-input" data-g-from-name placeholder="اسمك"></div>
              <div class="sxq-field"><label>رقم جوال المُهدي (اختياري)</label><input class="sxq-input" type="tel" data-g-from-phone placeholder="05xxxxxxxx"></div>
            </div>
            <div class="sxq-field">
              <label>رسالة الإهداء</label>
              <textarea class="sxq-textarea" data-g-msg placeholder="تقبّل الله منكم صالح الأعمال"></textarea>
            </div>
            <div class="sxq-row2">
              <div class="sxq-field">
                <label>فرصة الإهداء</label>
                <select class="sxq-select" data-g-cause>${CAUSES.slice(0,4).map(c=>`<option>${c}</option>`).join("")}</select>
              </div>
              <div class="sxq-field">
                <label>مبلغ الإهداء</label>
                <input class="sxq-input" type="number" min="1" placeholder="مبلغ آخر" data-g-other>
              </div>
            </div>
            <div class="sxq-amts">
              <button type="button" class="sxq-amt" data-g-amt="50">50 ريال</button>
              <button type="button" class="sxq-amt active" data-g-amt="100">100 ريال</button>
              <button type="button" class="sxq-amt" data-g-amt="150">150 ريال</button>
              <button type="button" class="sxq-amt" data-g-amt="300">300 ريال</button>
            </div>
            <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:.5rem">
              <label class="sxq-check" style="flex:1"><input type="checkbox" data-g-showamt checked> إظهار المبلغ للمُهدى إليه</label>
              <label class="sxq-check" style="flex:1"><input type="checkbox" data-g-sched> جدولة إرسال الإهداء</label>
            </div>
            <div class="sxq-row2" data-g-sched-box style="display:none">
              <div class="sxq-field"><label>تاريخ الإرسال</label><input class="sxq-input" type="date" data-g-date></div>
              <div class="sxq-field"><label>وقت الإرسال</label><input class="sxq-input" type="time" data-g-time></div>
            </div>

            <div class="sxq-giftpv">
              <div class="lbl">إهداء خير من جمعية إسكان</div>
              <div class="ttl">إلى: <span data-gp-to>—</span></div>
              <div class="msg">"<span data-gp-msg>تقبّل الله منكم صالح الأعمال</span>"</div>
              <div class="pers">من: <span data-gp-from>—</span> · <span data-gp-cause>—</span> <span data-gp-amt-wrap>· <b data-gp-amt>100 ريال</b></span></div>
            </div>

            <div class="sxq-actions">
              <button class="sxq-btn sxq-btn-primary" data-sxq-next="2">إهدِ الآن <i class="fas fa-arrow-left"></i></button>
            </div>
          </div>

          <div class="sxq-panel" data-panel="2">
            <div class="sxq-pay-head">
              <div>
                <div class="l">نوع العملية: إهداء تبرع</div>
                <div class="v" data-gp2-info>—</div>
                <div class="l" style="margin-top:.35rem">طريقة الدفع: بطاقة بنكية</div>
              </div>
              <div style="text-align:end">
                <div class="l">المبلغ الإجمالي</div>
                <div class="amt" data-gp2-amt>100 <small>ريال</small></div>
              </div>
            </div>
            <div class="sxq-pay-meta">
              <span>بيانات البطاقة</span>
              <span class="brands"><span class="brand">مدى</span><span class="brand">VISA</span><span class="brand">MC</span></span>
            </div>
            <div class="sxq-field"><label>اسم حامل البطاقة</label><input class="sxq-input" data-gp2-name></div>
            <div class="sxq-field"><label>رقم البطاقة</label><input class="sxq-input" inputmode="numeric" maxlength="19" placeholder="0000 0000 0000 0000" data-gp2-num></div>
            <div class="sxq-row2">
              <div class="sxq-field"><label>تاريخ الانتهاء</label><input class="sxq-input" placeholder="شهر / سنة" maxlength="5" data-gp2-exp></div>
              <div class="sxq-field"><label>رمز التحقق</label><input class="sxq-input" inputmode="numeric" maxlength="4" placeholder="•••" data-gp2-cvc></div>
            </div>
            <div class="sxq-actions">
              <button class="sxq-btn sxq-btn-ghost" data-sxq-prev="1"><i class="fas fa-arrow-right"></i> رجوع</button>
              <button class="sxq-btn sxq-btn-primary" data-sxq-pay>ادفع <span data-gp2-pay-amt>100</span> ريال</button>
            </div>
            <div class="sxq-secure"><i class="fas fa-shield-halved"></i> الدفع آمن — بيانات تجريبية للعرض فقط</div>
          </div>

          <div class="sxq-panel" data-panel="3">
            <div class="sxq-success">
              <div class="sxq-success-ic"><i class="fas fa-gift"></i></div>
              <h4>تم إهداء التبرع بنجاح</h4>
              <p>تم تسجيل الإهداء بنجاح، وسيتم إرسال بطاقة الإهداء حسب البيانات المدخلة.</p>
              <div class="sxq-sum">
                <div class="sxq-sum-row"><span>رقم العملية</span><b data-gok-id>—</b></div>
                <div class="sxq-sum-row"><span>المُهدى إليه</span><b data-gok-to>—</b></div>
                <div class="sxq-sum-row"><span>المُهدي</span><b data-gok-from>—</b></div>
                <div class="sxq-sum-row"><span>فرصة الإهداء</span><b data-gok-cause>—</b></div>
                <div class="sxq-sum-row"><span>حالة الإرسال</span><b data-gok-status style="color:#0d7a4f">جاهز للإرسال</b></div>
                <div class="sxq-sum-row total"><span>المبلغ</span><b data-gok-amt>—</b></div>
              </div>
              <div class="sxq-actions">
                <button class="sxq-btn sxq-btn-ghost" data-sxq-gift-card><i class="fas fa-image"></i> عرض البطاقة</button>
                <button class="sxq-btn sxq-btn-primary" data-sxq-close-x><i class="fas fa-check"></i> إغلاق</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Join Modal -->
    <div class="sxq-modal sxq-form-modal" id="sxqJoin" role="dialog" aria-modal="true">
      <div class="sxq-dialog">
        <div class="sxq-head">
          <h3><span class="sxq-head-ic"><i class="fas fa-user-plus"></i></span><span>انضم معنا<small>فرص التطوع والتوظيف في جمعية إسكان</small></span></h3>
          <button class="sxq-close" data-sxq-close aria-label="إغلاق"><i class="fas fa-times"></i></button>
        </div>
        <div class="sxq-body">
          <!-- Step 1: choose type -->
          <div class="sxq-panel active" data-panel="1">
            <p style="font-size:.85rem;color:#5b6b85;margin:.1rem 0 .8rem">اختر نوع الانضمام الذي يناسبك:</p>
            <div class="sxq-types">
              <button class="sxq-type" data-j-type="vol"><i class="fas fa-hands-helping"></i><div><b>فرصة تطوع عامة</b><span>سجّل اهتمامك بالتطوع معنا</span></div></button>
              <button class="sxq-type" data-j-type="job"><i class="fas fa-briefcase"></i><div><b>وظيفة عامة</b><span>قدّم سيرتك للانضمام لفريق العمل</span></div></button>
              <button class="sxq-type" data-j-type="opps"><i class="fas fa-list-check"></i><div><b>اختيار من الفرص المتاحة</b><span>تصفح وظائف وفرص تطوع منشورة</span></div></button>
            </div>
            <a class="sxq-careers-link" href="careers.html">عرض جميع الوظائف وفرص التطوع <i class="fas fa-arrow-left"></i></a>
          </div>

          <!-- Step 2a: vol form -->
          <div class="sxq-panel" data-panel="vol">
            <div class="sxq-row2">
              <div class="sxq-field"><label>الاسم الكامل</label><input class="sxq-input" data-jv-name required></div>
              <div class="sxq-field"><label>رقم الجوال</label><input class="sxq-input" type="tel" data-jv-phone required></div>
            </div>
            <div class="sxq-row2">
              <div class="sxq-field"><label>البريد الإلكتروني (اختياري)</label><input class="sxq-input" type="email" data-jv-email></div>
              <div class="sxq-field"><label>المدينة</label><input class="sxq-input" data-jv-city></div>
            </div>
            <div class="sxq-row2">
              <div class="sxq-field"><label>مجال التطوع المفضل</label>
                <select class="sxq-select" data-jv-area><option>توزيع السلال</option><option>دعم إعلامي</option><option>تنظيم فعاليات</option><option>دعم إداري</option></select>
              </div>
              <div class="sxq-field"><label>الأيام المناسبة</label>
                <select class="sxq-select" data-jv-days><option>أيام الأسبوع</option><option>عطلة نهاية الأسبوع</option><option>مرن</option></select>
              </div>
            </div>
            <div class="sxq-field"><label>نبذة مختصرة</label><textarea class="sxq-textarea" data-jv-bio placeholder="عرّفنا بنفسك باختصار"></textarea></div>
            <div class="sxq-actions">
              <button class="sxq-btn sxq-btn-ghost" data-sxq-jback><i class="fas fa-arrow-right"></i> رجوع</button>
              <button class="sxq-btn sxq-btn-primary" data-sxq-jsubmit="vol">إرسال طلب التطوع</button>
            </div>
          </div>

          <!-- Step 2b: job form -->
          <div class="sxq-panel" data-panel="job">
            <div class="sxq-row2">
              <div class="sxq-field"><label>الاسم الكامل</label><input class="sxq-input" data-jj-name required></div>
              <div class="sxq-field"><label>رقم الجوال</label><input class="sxq-input" type="tel" data-jj-phone required></div>
            </div>
            <div class="sxq-row2">
              <div class="sxq-field"><label>البريد الإلكتروني</label><input class="sxq-input" type="email" data-jj-email required></div>
              <div class="sxq-field"><label>المدينة</label><input class="sxq-input" data-jj-city></div>
            </div>
            <div class="sxq-row2">
              <div class="sxq-field"><label>المؤهل العلمي</label>
                <select class="sxq-select" data-jj-edu><option>ثانوي</option><option>دبلوم</option><option>بكالوريوس</option><option>ماجستير</option><option>دكتوراه</option></select>
              </div>
              <div class="sxq-field"><label>سنوات الخبرة</label>
                <select class="sxq-select" data-jj-exp><option>أقل من سنة</option><option>1 - 3 سنوات</option><option>4 - 7 سنوات</option><option>أكثر من 7 سنوات</option></select>
              </div>
            </div>
            <div class="sxq-field"><label>المجال الوظيفي المطلوب</label><input class="sxq-input" data-jj-area placeholder="مثال: إدارة برامج اجتماعية"></div>
            <div class="sxq-field"><label>السيرة الذاتية</label><input class="sxq-input" type="file" data-jj-cv></div>
            <div class="sxq-field"><label>نبذة مختصرة</label><textarea class="sxq-textarea" data-jj-bio></textarea></div>
            <div class="sxq-actions">
              <button class="sxq-btn sxq-btn-ghost" data-sxq-jback><i class="fas fa-arrow-right"></i> رجوع</button>
              <button class="sxq-btn sxq-btn-primary" data-sxq-jsubmit="job">إرسال طلب التوظيف</button>
            </div>
          </div>

          <!-- Step 2c: opportunities -->
          <div class="sxq-panel" data-panel="opps">
            <div class="sxq-opps" data-j-opps-list></div>
            <div class="sxq-actions">
              <button class="sxq-btn sxq-btn-ghost" data-sxq-jback><i class="fas fa-arrow-right"></i> رجوع</button>
            </div>
          </div>

          <!-- Success -->
          <div class="sxq-panel" data-panel="ok">
            <div class="sxq-success">
              <div class="sxq-success-ic"><i class="fas fa-check"></i></div>
              <h4 data-jok-title>تم استلام طلبك بنجاح</h4>
              <p data-jok-msg>سنتواصل معكم في أقرب فرصة.</p>
              <div class="sxq-sum">
                <div class="sxq-sum-row"><span>رقم الطلب</span><b data-jok-id>—</b></div>
                <div class="sxq-sum-row"><span>نوع الطلب</span><b data-jok-type>—</b></div>
              </div>
              <div class="sxq-actions">
                <a class="sxq-btn sxq-btn-ghost" href="careers.html"><i class="fas fa-list"></i> عرض جميع الفرص</a>
                <button class="sxq-btn sxq-btn-primary" data-sxq-close-x>إغلاق</button>
              </div>
            </div>
          </div>
    </div>
        </div>
      </div>

    <!-- Membership Modal -->
    <div class="sxq-modal sxq-form-modal sxq-membership-modal" id="sxqMember" role="dialog" aria-modal="true" aria-labelledby="sxqMemberTitle">
      <div class="sxq-dialog">
        <div class="sxq-head">
          <h3 id="sxqMemberTitle"><span class="sxq-head-ic"><i class="fas fa-id-card"></i></span><span>طلب عضوية الجمعية<small>نموذج موحد لمراجعة طلبات العضوية</small></span></h3>
          <button class="sxq-close" data-sxq-close aria-label="إغلاق"><i class="fas fa-times"></i></button>
        </div>
        <div class="sxq-body">
          <!-- Step 1: Form -->
          <div class="sxq-panel active" data-panel="form">
            <p style="font-size:.88rem;color:#5b6b85;margin:.1rem 0 .9rem;line-height:1.85">
              يمكنك تقديم طلب الانضمام لعضوية الجمعية، وسيتم مراجعة الطلب وفق لائحة الجمعية الأساسية والضوابط المعتمدة.
              <a href="membership.html" style="color:#0d7a4f;font-weight:700;text-decoration:none">الاطلاع على صفحة العضوية <i class="fas fa-arrow-left" style="font-size:.7rem"></i></a>
            </p>

            <div class="sxq-mem-note">
              <i class="fas fa-circle-info"></i>
              <span>قبول طلب العضوية يخضع للائحة الجمعية الأساسية وقرار الجهة المختصة داخل الجمعية، وقد تختلف شروط العضوية أو رسومها حسب نوع العضوية المعتمد.</span>
            </div>

            <div class="sxq-mem-section">بيانات العضوية</div>
            <div class="sxq-row2">
              <div class="sxq-field"><label>نوع العضوية *</label>
                <select class="sxq-select" data-m-type required>
                  <option value="">— اختر —</option>
                  <option>عضو عامل</option>
                  <option>عضو منتسب</option>
                  <option>عضو داعم</option>
                  <option>عضو شرفي</option>
                </select>
              </div>
              <div class="sxq-field"><label>الجنسية</label><input class="sxq-input" data-m-nat placeholder="مثال: سعودي"></div>
            </div>

            <div class="sxq-mem-section">البيانات الشخصية</div>
            <div class="sxq-row2">
              <div class="sxq-field"><label>الاسم الكامل *</label><input class="sxq-input" data-m-name required></div>
              <div class="sxq-field"><label>رقم الهوية / الإقامة *</label><input class="sxq-input" type="tel" inputmode="numeric" maxlength="10" data-m-id required></div>
            </div>
            <div class="sxq-row2">
              <div class="sxq-field"><label>تاريخ الميلاد</label><input class="sxq-input" type="date" data-m-dob></div>
              <div class="sxq-field"><label>رقم الجوال *</label><input class="sxq-input" type="tel" inputmode="numeric" placeholder="05xxxxxxxx" data-m-phone required></div>
            </div>
            <div class="sxq-row2">
              <div class="sxq-field"><label>البريد الإلكتروني</label><input class="sxq-input" type="email" data-m-email placeholder="name@example.com"></div>
              <div class="sxq-field"><label>المدينة</label><input class="sxq-input" data-m-city></div>
            </div>
            <div class="sxq-field"><label>العنوان المختصر</label><input class="sxq-input" data-m-addr placeholder="الحي / الشارع"></div>

            <div class="sxq-mem-section">البيانات المهنية</div>
            <div class="sxq-row2">
              <div class="sxq-field"><label>المؤهل العلمي</label>
                <select class="sxq-select" data-m-edu>
                  <option>ثانوي</option><option>دبلوم</option><option>بكالوريوس</option><option>ماجستير</option><option>دكتوراه</option>
                </select>
              </div>
              <div class="sxq-field"><label>المهنة</label><input class="sxq-input" data-m-job></div>
            </div>
            <div class="sxq-field"><label>جهة العمل</label><input class="sxq-input" data-m-org></div>

            <div class="sxq-mem-section">الاهتمامات والرغبات</div>
            <div class="sxq-field"><label>سبب الرغبة في الانضمام للعضوية *</label>
              <textarea class="sxq-textarea" data-m-reason rows="3" placeholder="اكتب باختصار سبب رغبتك في الانضمام" required></textarea>
            </div>

            <div class="sxq-field"><label>مجالات الاهتمام داخل الجمعية</label>
              <div class="sxq-chips" data-m-interests>
                <label class="sxq-chip"><input type="checkbox" value="البرامج والخدمات"><span>البرامج والخدمات</span></label>
                <label class="sxq-chip"><input type="checkbox" value="الحوكمة"><span>الحوكمة</span></label>
                <label class="sxq-chip"><input type="checkbox" value="التطوع"><span>التطوع</span></label>
                <label class="sxq-chip"><input type="checkbox" value="دعم المستفيدين"><span>دعم المستفيدين</span></label>
                <label class="sxq-chip"><input type="checkbox" value="الشراكات"><span>الشراكات</span></label>
                <label class="sxq-chip"><input type="checkbox" value="الاستدامة المالية"><span>الاستدامة المالية</span></label>
                <label class="sxq-chip"><input type="checkbox" value="الإعلام والتوعية"><span>الإعلام والتوعية</span></label>
              </div>
            </div>

            <div class="sxq-row2">
              <div class="sxq-field"><label>هل سبق لك التعامل مع الجمعية؟</label>
                <select class="sxq-select" data-m-prev><option>لا</option><option>نعم</option></select>
              </div>
              <div class="sxq-field"><label>المشاركة في الجمعية العمومية عند القبول؟</label>
                <select class="sxq-select" data-m-ga><option>نعم</option><option>لا</option></select>
              </div>
            </div>

            <div class="sxq-mem-section">مرفقات (اختياري)</div>
            <div class="sxq-row2">
              <div class="sxq-field"><label>صورة الهوية</label><input class="sxq-input" type="file" data-m-fid></div>
              <div class="sxq-field"><label>السيرة الذاتية</label><input class="sxq-input" type="file" data-m-fcv></div>
            </div>
            <div class="sxq-field"><label>خطاب تعريفي</label><input class="sxq-input" type="file" data-m-fletter></div>

            <div class="sxq-mem-section">الإقرارات</div>
            <div class="sxq-mem-acks">
              <label class="sxq-check"><input type="checkbox" data-m-ack1 required> أقر بصحة البيانات المدخلة.</label>
              <label class="sxq-check"><input type="checkbox" data-m-ack2 required> أوافق على سياسة الخصوصية.</label>
              <label class="sxq-check"><input type="checkbox" data-m-ack3 required> أتعهد بالالتزام بلائحة الجمعية وأنظمتها عند قبول العضوية.</label>
              <label class="sxq-check"><input type="checkbox" data-m-ack4 required> أعلم أن قبول العضوية يخضع لمراجعة الجمعية والضوابط المعتمدة.</label>
            </div>

            <div class="sxq-actions">
              <button class="sxq-btn sxq-btn-ghost" data-sxq-close><i class="fas fa-times"></i> إلغاء</button>
              <button class="sxq-btn sxq-btn-primary" data-sxq-msubmit>إرسال طلب العضوية <i class="fas fa-paper-plane"></i></button>
            </div>
          </div>

          <!-- Step 2: Success -->
          <div class="sxq-panel" data-panel="ok">
            <div class="sxq-success">
              <div class="sxq-success-ic"><i class="fas fa-check"></i></div>
              <h4>تم استلام طلب العضوية بنجاح</h4>
              <p>شكرًا لرغبتكم في الانضمام لعضوية جمعية إسكان. سيتم مراجعة طلبكم وفق لائحة الجمعية، وسيتم إشعاركم بحالة الطلب عبر بيانات التواصل المسجلة.</p>
              <div class="sxq-sum">
                <div class="sxq-sum-row"><span>رقم الطلب</span><b data-mok-id>—</b></div>
                <div class="sxq-sum-row"><span>نوع العضوية</span><b data-mok-type>—</b></div>
                <div class="sxq-sum-row"><span>تاريخ الإرسال</span><b data-mok-date>—</b></div>
                <div class="sxq-sum-row total"><span>الحالة</span><b style="color:#0d7a4f">قيد المراجعة</b></div>
              </div>
              <div class="sxq-actions">
                <button class="sxq-btn sxq-btn-ghost" data-sxq-close-x><i class="fas fa-times"></i> إغلاق</button>
                <button class="sxq-btn sxq-btn-ghost" onclick="window.print()"><i class="fas fa-print"></i> طباعة ملخص الطلب</button>
                <a class="sxq-btn sxq-btn-primary" href="contact.html"><i class="fas fa-headset"></i> تواصل معنا</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Gift Card Mini-Modal -->
    <div class="sxq-modal" id="sxqGiftCard" role="dialog" aria-modal="true">
      <div class="sxq-dialog" style="max-width:440px">
        <div class="sxq-head"><h3><i class="fas fa-image"></i> بطاقة الإهداء</h3><button class="sxq-close" data-sxq-close><i class="fas fa-times"></i></button></div>
        <div class="sxq-body">
          <div class="sxq-giftpv" style="padding:1.4rem 1rem">
            <div class="lbl">جمعية إسكان</div>
            <div class="ttl">إهداء خير إلى <span data-gc-to>—</span></div>
            <div class="msg">"<span data-gc-msg>—</span>"</div>
            <div class="pers">من: <span data-gc-from>—</span></div>
            <div class="pers"><span data-gc-cause>—</span> <span data-gc-amt-wrap>· <b data-gc-amt>—</b></span></div>
            <div style="font-size:.7rem;color:#9a7a2b;margin-top:.6rem">رقم البطاقة: <b data-gc-id>—</b></div>
          </div>
          <div class="sxq-actions">
            <button class="sxq-btn sxq-btn-ghost" onclick="window.print()"><i class="fas fa-print"></i> طباعة</button>
            <button class="sxq-btn sxq-btn-primary" data-sxq-close-x><i class="fas fa-check"></i> تم</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Receipt Mini-Modal -->
    <div class="sxq-modal" id="sxqReceipt" role="dialog" aria-modal="true">
      <div class="sxq-dialog" style="max-width:440px">
        <div class="sxq-head"><h3><i class="fas fa-file-invoice"></i> سند تبرع</h3><button class="sxq-close" data-sxq-close><i class="fas fa-times"></i></button></div>
        <div class="sxq-body">
          <div style="text-align:center;padding:.5rem 0 1rem;border-bottom:1px dashed #dde5ef">
            <div style="width:54px;height:54px;border-radius:14px;background:linear-gradient(135deg,#1d3a6b,#0d7a4f);color:#fff;display:inline-flex;align-items:center;justify-content:center;font-weight:900;font-size:1.3rem">س</div>
            <div style="font-weight:800;color:#0b2545;margin-top:.4rem">جمعية إسكان للخدمات الاجتماعية</div>
            <div style="font-size:.75rem;color:#7a8aa3">سند تبرع رسمي</div>
          </div>
          <div class="sxq-sum" style="margin-top:.6rem">
            <div class="sxq-sum-row"><span>رقم السند</span><b data-r-id>—</b></div>
            <div class="sxq-sum-row"><span>فرصة التبرع</span><b data-r-cause>—</b></div>
            <div class="sxq-sum-row"><span>تاريخ التبرع</span><b data-r-date>—</b></div>
            <div class="sxq-sum-row total"><span>المبلغ</span><b data-r-amt>—</b></div>
          </div>
          <div class="sxq-actions">
            <button class="sxq-btn sxq-btn-ghost" onclick="window.print()"><i class="fas fa-print"></i> طباعة</button>
            <button class="sxq-btn sxq-btn-primary" data-sxq-close-x><i class="fas fa-download"></i> تحميل</button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(root);

  /* ---------- Helpers ---------- */
  const $ = (s, r) => (r||document).querySelector(s);
  const $$ = (s, r) => Array.from((r||document).querySelectorAll(s));

  function openModal(id){
    const m = document.getElementById(id);
    if (!m) return;
    document.querySelectorAll(".sx-mod-overlay.open,.s-modal-overlay.open").forEach((overlay) => overlay.classList.remove("open"));
    $$(".sxq-modal.open").forEach((modal) => { if (modal !== m) modal.classList.remove("open"); });
    m.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeModal(m){
    if (typeof m === "string") m = document.getElementById(m);
    if (!m) return;
    m.classList.remove("open");
    if (!document.querySelector(".sxq-modal.open")) document.body.style.overflow = "";
  }
  function gotoStep(modal, step){
    $$(".sxq-panel", modal).forEach(p => p.classList.toggle("active", p.dataset.panel === String(step)));
    const steps = $$(".sxq-steps [data-step]", modal);
    steps.forEach(s => {
      const n = Number(s.dataset.step);
      s.classList.toggle("active", n === Number(step));
      s.classList.toggle("done", n < Number(step));
    });
  }

  /* ---------- FAB (mobile-only collapse) ---------- */
  const fab = $("#sxqFab"), fabMobBtn = $("#sxqFabMobBtn");
  if (fabMobBtn) {
    fabMobBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      fab.classList.toggle("open");
    });
    document.addEventListener("click", (e) => {
      if (!fab.contains(e.target)) fab.classList.remove("open");
    });
  }

  /* ---------- Open triggers ---------- */
  $$("[data-sxq-open]").forEach(b => b.addEventListener("click", (e) => {
    e.preventDefault();
    fab.classList.remove("open");
    const k = b.dataset.sxqOpen;
    $$(".sxq-modal.open").forEach(closeModal);
    if (k === "donate") { resetDonate(); openModal("sxqDonate"); }
    else if (k === "gift") { resetGift(); openModal("sxqGift"); }
    else if (k === "join") { resetJoin(); openModal("sxqJoin"); }
    else if (k === "member") { resetMember(); openModal("sxqMember"); }
  }));


  /* ---------- Close / backdrop / ESC ---------- */
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-sxq-close],[data-sxq-close-x]");
    if (t) { closeModal(t.closest(".sxq-modal")); return; }
    if (e.target.classList && e.target.classList.contains("sxq-modal")) closeModal(e.target);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") $$(".sxq-modal.open").forEach(closeModal);
  });

  /* ---------- DONATE ---------- */
  const dModal = $("#sxqDonate");
  const dState = { cause: CAUSES[0], amount: 100, anon: false, phone: "" };

  function resetDonate(){
    dState.cause = CAUSES[0]; dState.amount = 100; dState.anon = false; dState.phone = "";
    $("[data-d-cause]", dModal).value = CAUSES[0];
    $("[data-d-phone]", dModal).value = "";
    $("[data-d-other]", dModal).value = "";
    $("[data-d-anon]", dModal).checked = false;
    $$("[data-d-amt]", dModal).forEach(b => b.classList.toggle("active", b.dataset.dAmt === "100"));
    ["[data-p-name]","[data-p-num]","[data-p-exp]","[data-p-cvc]"].forEach(s => { const el=$(s,dModal); if(el) el.value=""; });
    syncDonate();
    gotoStep(dModal, 1);
  }
  function syncDonate(){
    $("[data-s-cause]", dModal).textContent = dState.cause;
    $("[data-s-amt]", dModal).textContent = fmt(dState.amount);
    $("[data-p-cause]", dModal).textContent = dState.cause;
    $("[data-p-amt]", dModal).innerHTML = `${(dState.amount||0).toLocaleString("en-US")} <small>ريال</small>`;
    $("[data-p-pay-amt]", dModal).textContent = (dState.amount||0).toLocaleString("en-US");
  }
  $("[data-d-cause]", dModal).addEventListener("change", e => { dState.cause = e.target.value; syncDonate(); });
  $("[data-d-anon]", dModal).addEventListener("change", e => { dState.anon = e.target.checked; });
  $("[data-d-phone]", dModal).addEventListener("input", e => { dState.phone = e.target.value; });
  $$("[data-d-amt]", dModal).forEach(b => b.addEventListener("click", () => {
    $$("[data-d-amt]", dModal).forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    dState.amount = Number(b.dataset.dAmt);
    $("[data-d-other]", dModal).value = "";
    syncDonate();
  }));
  $("[data-d-other]", dModal).addEventListener("input", e => {
    const v = Number(e.target.value);
    if (v > 0) { dState.amount = v; $$("[data-d-amt]", dModal).forEach(x => x.classList.remove("active")); syncDonate(); }
  });
  $("[data-sxq-next='2']", dModal).addEventListener("click", () => {
    if (!dState.amount || dState.amount < 1) { window.sxToast && sxToast("الرجاء إدخال مبلغ صحيح"); return; }
    gotoStep(dModal, 2);
  });
  $("[data-sxq-prev='1']", dModal).addEventListener("click", () => gotoStep(dModal, 1));
  $("[data-sxq-pay]", dModal).addEventListener("click", () => {
    const name = $("[data-p-name]", dModal).value.trim();
    const num = $("[data-p-num]", dModal).value.replace(/\s/g,"");
    if (!name) { window.sxToast && sxToast("الرجاء إدخال اسم حامل البطاقة"); return; }
    if (num.length < 12) { window.sxToast && sxToast("الرجاء إدخال رقم بطاقة صحيح"); return; }
    const id = "DON-2026-" + String(Math.floor(Math.random()*9000)+1000);
    const date = new Date().toLocaleDateString("ar-SA");
    $("[data-ok-id]", dModal).textContent = id;
    $("[data-ok-cause]", dModal).textContent = dState.cause;
    $("[data-ok-name]", dModal).textContent = dState.anon ? "فاعل خير" : (name || "—");
    $("[data-ok-date]", dModal).textContent = date;
    $("[data-ok-amt]", dModal).textContent = fmt(dState.amount);
    // receipt
    $("[data-r-id]").textContent = id;
    $("[data-r-cause]").textContent = dState.cause;
    $("[data-r-date]").textContent = date;
    $("[data-r-amt]").textContent = fmt(dState.amount);
    gotoStep(dModal, 3);
  });
  $("[data-sxq-receipt]", dModal).addEventListener("click", () => openModal("sxqReceipt"));

  /* Card formatting */
  function bindCard(modal){
    const num = $("[data-p-num],[data-gp2-num]", modal);
    const exp = $("[data-p-exp],[data-gp2-exp]", modal);
    num && num.addEventListener("input", e => {
      let v = e.target.value.replace(/\D/g,"").slice(0,16);
      e.target.value = v.replace(/(.{4})/g,"$1 ").trim();
    });
    exp && exp.addEventListener("input", e => {
      let v = e.target.value.replace(/\D/g,"").slice(0,4);
      if (v.length >= 3) v = v.slice(0,2) + "/" + v.slice(2);
      e.target.value = v;
    });
  }
  bindCard(dModal);

  /* ---------- GIFT ---------- */
  const gModal = $("#sxqGift");
  const gState = { toName:"", toPhone:"", fromName:"", fromPhone:"", msg:"تقبّل الله منكم صالح الأعمال", cause: CAUSES[0], amount:100, showAmt:true, sched:false, date:"", time:"" };

  function resetGift(){
    Object.assign(gState, { toName:"", toPhone:"", fromName:"", fromPhone:"", msg:"تقبّل الله منكم صالح الأعمال", cause: CAUSES[0], amount:100, showAmt:true, sched:false, date:"", time:"" });
    ["[data-g-to-name]","[data-g-to-phone]","[data-g-from-name]","[data-g-from-phone]","[data-g-other]","[data-gp2-name]","[data-gp2-num]","[data-gp2-exp]","[data-gp2-cvc]"].forEach(s => { const el=$(s,gModal); if(el) el.value=""; });
    $("[data-g-msg]", gModal).value = "";
    $("[data-g-cause]", gModal).value = CAUSES[0];
    $("[data-g-showamt]", gModal).checked = true;
    $("[data-g-sched]", gModal).checked = false;
    $("[data-g-sched-box]", gModal).style.display = "none";
    $$("[data-g-amt]", gModal).forEach(b => b.classList.toggle("active", b.dataset.gAmt === "100"));
    syncGift();
    gotoStep(gModal, 1);
  }
  function syncGift(){
    $("[data-gp-to]", gModal).textContent = gState.toName || "—";
    $("[data-gp-from]", gModal).textContent = gState.fromName || "—";
    $("[data-gp-msg]", gModal).textContent = (gState.msg || "تقبّل الله منكم صالح الأعمال");
    $("[data-gp-cause]", gModal).textContent = gState.cause;
    $("[data-gp-amt]", gModal).textContent = fmt(gState.amount);
    $("[data-gp-amt-wrap]", gModal).style.display = gState.showAmt ? "" : "none";
    $("[data-gp2-info]", gModal).textContent = `إلى ${gState.toName||"—"} من ${gState.fromName||"—"} (${gState.cause})`;
    $("[data-gp2-amt]", gModal).innerHTML = `${(gState.amount||0).toLocaleString("en-US")} <small>ريال</small>`;
    $("[data-gp2-pay-amt]", gModal).textContent = (gState.amount||0).toLocaleString("en-US");
  }
  const giftBindings = {
    "[data-g-to-name]":"toName","[data-g-to-phone]":"toPhone",
    "[data-g-from-name]":"fromName","[data-g-from-phone]":"fromPhone",
    "[data-g-msg]":"msg","[data-g-date]":"date","[data-g-time]":"time"
  };
  Object.entries(giftBindings).forEach(([sel, key]) => {
    const el = $(sel, gModal); if (!el) return;
    el.addEventListener("input", e => { gState[key] = e.target.value; syncGift(); });
  });
  $("[data-g-cause]", gModal).addEventListener("change", e => { gState.cause = e.target.value; syncGift(); });
  $("[data-g-showamt]", gModal).addEventListener("change", e => { gState.showAmt = e.target.checked; syncGift(); });
  $("[data-g-sched]", gModal).addEventListener("change", e => {
    gState.sched = e.target.checked;
    $("[data-g-sched-box]", gModal).style.display = gState.sched ? "grid" : "none";
  });
  $$("[data-g-amt]", gModal).forEach(b => b.addEventListener("click", () => {
    $$("[data-g-amt]", gModal).forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    gState.amount = Number(b.dataset.gAmt);
    $("[data-g-other]", gModal).value = "";
    syncGift();
  }));
  $("[data-g-other]", gModal).addEventListener("input", e => {
    const v = Number(e.target.value);
    if (v > 0) { gState.amount = v; $$("[data-g-amt]", gModal).forEach(x => x.classList.remove("active")); syncGift(); }
  });
  $("[data-sxq-next='2']", gModal).addEventListener("click", () => {
    if (!gState.toName || !gState.fromName) { window.sxToast && sxToast("الرجاء إدخال اسم المُهدى إليه والمُهدي"); return; }
    if (!gState.amount || gState.amount < 1) { window.sxToast && sxToast("الرجاء اختيار مبلغ صحيح"); return; }
    gotoStep(gModal, 2);
  });
  $("[data-sxq-prev='1']", gModal).addEventListener("click", () => gotoStep(gModal, 1));
  bindCard(gModal);
  $("[data-sxq-pay]", gModal).addEventListener("click", () => {
    const name = $("[data-gp2-name]", gModal).value.trim();
    const num = $("[data-gp2-num]", gModal).value.replace(/\s/g,"");
    if (!name) { window.sxToast && sxToast("الرجاء إدخال اسم حامل البطاقة"); return; }
    if (num.length < 12) { window.sxToast && sxToast("الرجاء إدخال رقم بطاقة صحيح"); return; }
    const id = "GFT-2026-" + String(Math.floor(Math.random()*9000)+1000);
    $("[data-gok-id]", gModal).textContent = id;
    $("[data-gok-to]", gModal).textContent = gState.toName;
    $("[data-gok-from]", gModal).textContent = gState.fromName;
    $("[data-gok-cause]", gModal).textContent = gState.cause;
    $("[data-gok-amt]", gModal).textContent = fmt(gState.amount);
    $("[data-gok-status]", gModal).textContent = gState.sched ? `مجدول · ${gState.date||""} ${gState.time||""}`.trim() : "جاهز للإرسال";
    // gift card
    $("[data-gc-to]").textContent = gState.toName;
    $("[data-gc-from]").textContent = gState.fromName;
    $("[data-gc-msg]").textContent = gState.msg || "تقبّل الله منكم صالح الأعمال";
    $("[data-gc-cause]").textContent = gState.cause;
    $("[data-gc-amt]").textContent = fmt(gState.amount);
    $("[data-gc-amt-wrap]").style.display = gState.showAmt ? "" : "none";
    $("[data-gc-id]").textContent = id;
    gotoStep(gModal, 3);
  });
  $("[data-sxq-gift-card]", gModal).addEventListener("click", () => openModal("sxqGiftCard"));

  /* ---------- JOIN ---------- */
  const jModal = $("#sxqJoin");
  function resetJoin(){
    gotoStep(jModal, 1);
    $$(".sxq-type", jModal).forEach(t => t.classList.remove("active"));
  }
  function gotoJoinPanel(name){
    $$(".sxq-panel", jModal).forEach(p => p.classList.toggle("active", p.dataset.panel === name));
  }
  $$("[data-j-type]", jModal).forEach(t => t.addEventListener("click", () => {
    const type = t.dataset.jType;
    $$(".sxq-type", jModal).forEach(x => x.classList.remove("active"));
    t.classList.add("active");
    if (type === "opps") {
      const list = $("[data-j-opps-list]", jModal);
      list.innerHTML = OPPS.map(o => `
        <div class="sxq-opp">
          <div class="sxq-opp-info">
            <b>${o.title}</b>
            <div class="meta">
              <span class="badge ${o.type}">${o.type === "vol" ? "تطوع" : "وظيفة"}</span>
              <span class="badge">${o.city}</span>
              <span class="badge">${o.mode}</span>
            </div>
          </div>
          <button class="sxq-opp-pick" data-pick="${o.id}">اختيار</button>
        </div>`).join("");
      $$("[data-pick]", list).forEach(btn => btn.addEventListener("click", () => {
        const o = OPPS.find(x => x.id === btn.dataset.pick);
        gotoJoinPanel(o.type);
      }));
      gotoJoinPanel("opps");
    } else {
      gotoJoinPanel(type);
    }
  }));
  $$("[data-sxq-jback]", jModal).forEach(b => b.addEventListener("click", () => gotoJoinPanel("1")));
  $$("[data-sxq-jsubmit]", jModal).forEach(b => b.addEventListener("click", () => {
    const type = b.dataset.sxqJsubmit;
    let name, phone;
    if (type === "vol") {
      name = $("[data-jv-name]", jModal).value.trim();
      phone = $("[data-jv-phone]", jModal).value.trim();
    } else {
      name = $("[data-jj-name]", jModal).value.trim();
      phone = $("[data-jj-phone]", jModal).value.trim();
    }
    if (!name || !phone) { window.sxToast && sxToast("الرجاء إدخال الاسم ورقم الجوال"); return; }
    const id = (type === "vol" ? "VOL-2026-" : "CAR-2026-") + String(Math.floor(Math.random()*9000)+1000);
    $("[data-jok-title]", jModal).textContent = type === "vol" ? "تم استلام طلب التطوع بنجاح" : "تم استلام طلب التوظيف بنجاح";
    $("[data-jok-msg]", jModal).textContent = "شكرًا لاهتمامكم بالانضمام إلى أسرة إسكان، سنتواصل معكم قريبًا.";
    $("[data-jok-id]", jModal).textContent = id;
    $("[data-jok-type]", jModal).textContent = type === "vol" ? "فرصة تطوع" : "وظيفة";
    gotoJoinPanel("ok");
  }));

  /* ---------- MEMBERSHIP ---------- */
  const mModal = $("#sxqMember");
  let memSeq = 1;
  function resetMember(){
    if (!mModal) return;
    $$(".sxq-panel", mModal).forEach(p => p.classList.toggle("active", p.dataset.panel === "form"));
    $$("input,select,textarea", mModal).forEach(el => {
      if (el.type === "checkbox") el.checked = false;
      else if (el.type !== "file") el.value = el.tagName === "SELECT" ? el.options[0]?.value || "" : "";
      else el.value = "";
    });
  }
  if (mModal) {
    $("[data-sxq-msubmit]", mModal).addEventListener("click", () => {
      const type = $("[data-m-type]", mModal).value.trim();
      const name = $("[data-m-name]", mModal).value.trim();
      const idn  = $("[data-m-id]", mModal).value.trim();
      const phone= $("[data-m-phone]", mModal).value.trim();
      const reason = $("[data-m-reason]", mModal).value.trim();
      const ack1 = $("[data-m-ack1]", mModal).checked;
      const ack2 = $("[data-m-ack2]", mModal).checked;
      const ack3 = $("[data-m-ack3]", mModal).checked;
      const ack4 = $("[data-m-ack4]", mModal).checked;
      if (!type) { window.sxToast && sxToast("الرجاء اختيار نوع العضوية"); return; }
      if (!name || !idn || !phone) { window.sxToast && sxToast("الرجاء استكمال البيانات الأساسية"); return; }
      if (!reason) { window.sxToast && sxToast("الرجاء كتابة سبب الرغبة في الانضمام"); return; }
      if (!(ack1 && ack2 && ack3 && ack4)) { window.sxToast && sxToast("الرجاء الموافقة على جميع الإقرارات"); return; }
      const id = "MEM-2026-" + String(memSeq++).padStart(4, "0");
      const today = new Date().toLocaleDateString("ar-SA-u-nu-latn");
      $("[data-mok-id]", mModal).textContent = id;
      $("[data-mok-type]", mModal).textContent = type;
      $("[data-mok-date]", mModal).textContent = today;
      $$(".sxq-panel", mModal).forEach(p => p.classList.toggle("active", p.dataset.panel === "ok"));
    });
  }

})();

