/* قالب سند — Skeleton Loading
   هادئ، سريع، ولا يكسر أي تخطيط موجود. */
(function () {
  "use strict";

  try { if (/[?&]no-skeleton\b/.test(location.search)) return; } catch (_) {}

  var DOC = document.documentElement;
  DOC.classList.add("sk-loading");

  var css =
    "html.sk-loading body > *:not(#pageSkeleton){visibility:hidden!important}" +
    "body.no-skeleton #pageSkeleton{display:none!important}" +
    "body.no-skeleton > *{visibility:visible!important}" +
    "#pageSkeleton{position:fixed;inset:0;z-index:99990;background:#f6f7fb;overflow:hidden;opacity:1;transition:opacity .3s ease}" +
    "#pageSkeleton.sk-hide{opacity:0;pointer-events:none}" +
    "#pageSkeleton .sk-wrap{max-width:1180px;margin:0 auto;padding:18px 20px}" +
    "#pageSkeleton .sk-row{display:flex;align-items:center;gap:12px}" +
    "#pageSkeleton .sk-spacer{flex:1}" +
    "#pageSkeleton .sk{background:#E8ECEA;border-radius:10px;position:relative;overflow:hidden}" +
    "#pageSkeleton .sk::after{content:'';position:absolute;inset:0;transform:translateX(-100%);background:linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent);animation:skShimmer 1.4s infinite}" +
    "@keyframes skShimmer{100%{transform:translateX(100%)}}" +
    "#pageSkeleton .sk-logo{width:44px;height:44px;border-radius:12px}" +
    "#pageSkeleton .sk-pill{height:14px;border-radius:999px}" +
    "#pageSkeleton .sk-btn{height:38px;width:108px;border-radius:999px}" +
    "#pageSkeleton .sk-hero{height:clamp(220px,38vw,360px);margin:22px 0;border-radius:18px}" +
    "#pageSkeleton .sk-title{height:22px;width:55%;margin:14px 0 12px;border-radius:8px}" +
    "#pageSkeleton .sk-line{height:12px;margin:8px 0;border-radius:8px}" +
    "#pageSkeleton .sk-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:22px}" +
    "#pageSkeleton .sk-card{height:130px;border-radius:14px}" +
    "@media (max-width:768px){#pageSkeleton .sk-wrap{padding:14px 16px}" +
      "#pageSkeleton .sk-nav-pill{display:none}" +
      "#pageSkeleton .sk-grid{grid-template-columns:repeat(2,1fr);gap:10px}" +
      "#pageSkeleton .sk-card{height:96px}" +
      "#pageSkeleton .sk-hero{height:200px;margin:16px 0}}";

  var style = document.createElement("style");
  style.setAttribute("data-sanad-skeleton", "");
  style.appendChild(document.createTextNode(css));
  (document.head || DOC).appendChild(style);

  var hidden = false;
  var built = false;

  function buildSkeleton() {
    if (hidden || built || !document.body) return false;
    if (document.body.classList.contains("no-skeleton")) { hide(); return true; }
    if (document.getElementById("pageSkeleton")) return;
    built = true;
    var sk = document.createElement("div");
    sk.id = "pageSkeleton";
    sk.setAttribute("aria-hidden", "true");
    sk.innerHTML =
      '<div class="sk-wrap">' +
        '<div class="sk-row">' +
          '<div class="sk sk-logo"></div>' +
          '<div class="sk sk-pill sk-nav-pill" style="width:72px"></div>' +
          '<div class="sk sk-pill sk-nav-pill" style="width:64px"></div>' +
          '<div class="sk sk-pill sk-nav-pill" style="width:88px"></div>' +
          '<div class="sk-spacer"></div>' +
          '<div class="sk sk-btn"></div>' +
        '</div>' +
        '<div class="sk sk-hero"></div>' +
        '<div class="sk sk-title"></div>' +
        '<div class="sk sk-line" style="width:92%"></div>' +
        '<div class="sk sk-line" style="width:86%"></div>' +
        '<div class="sk sk-line" style="width:70%"></div>' +
        '<div class="sk-grid">' +
          '<div class="sk sk-card"></div>' +
          '<div class="sk sk-card"></div>' +
          '<div class="sk sk-card"></div>' +
        '</div>' +
      '</div>';
    document.body.insertBefore(sk, document.body.firstChild);
    return true;
  }

  function hide() {
    if (hidden) return;
    hidden = true;
    DOC.classList.remove("sk-loading");
    var sk = document.getElementById("pageSkeleton");
    if (sk) {
      sk.classList.add("sk-hide");
      setTimeout(function () {
        if (sk.parentNode) sk.parentNode.removeChild(sk);
      }, 320);
    }
  }

  // ابنِ الهيكل فور توفر body فقط، ولا تنتظر DOMContentLoaded أو أي مكتبة خارجية.
  (function waitForBody() {
    if (buildSkeleton()) {
      setTimeout(hide, 220);
      return;
    }
    if (!hidden) setTimeout(waitForBody, 16);
  })();

  // صمام أمان مطلق: يمنع ظهور Skeleton متأخرًا أو بقاؤه عند تأخر أي CDN/خطوط/أيقونات.
  setTimeout(hide, 900);

  window.addEventListener("pageshow", hide);
})();
