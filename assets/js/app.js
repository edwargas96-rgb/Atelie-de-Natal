(function () {
  var C = window.ATELIE_CONFIG;
  var KEY = "atelie_presentes_abertos";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var fmt = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var end = new Date(C.promoEnd).getTime();
  var promoActive = Date.now() < end;
  var opened = [];       // ids de presentes abertos
  var viaOffer = false;  // visitante escolheu "Ver oferta"
  try { opened = JSON.parse(localStorage.getItem(KEY) || "[]"); if (!Array.isArray(opened)) opened = []; } catch (e) { opened = []; }
  try { viaOffer = localStorage.getItem(KEY + "_oferta") === "1"; } catch (e) {}

  function save() { try { localStorage.setItem(KEY, JSON.stringify(opened)); if (viaOffer) localStorage.setItem(KEY + "_oferta", "1"); } catch (e) {} }
  function unlocked() { return promoActive && (opened.length > 0 || viaOffer); }
  function url(u) { return u ? u + (u.indexOf("?") > -1 ? "&" : "?") + location.search.slice(1) : ""; }

  /* ---------- preço / botões ---------- */
  function render() {
    var un = unlocked();
    var price = un ? C.promoPrice : C.fullPrice;
    var buy = $("#buy");
    $("#price").textContent = fmt.format(price);
    $("#price-tag").textContent = un ? "Promoção de Natal" : (promoActive ? "Preço do kit" : "Preço do kit");
    var old = $("#price-old");
    old.hidden = !un; if (un) old.textContent = "De " + fmt.format(C.fullPrice) + " depois do Natal";
    $("#price-note").textContent = un ? "Pagamento único · promoção até " + C.promoEndLabel : "Pagamento único";
    $("#promo-hint").hidden = !(promoActive && !un);
    buy.dataset.kind = un ? "promo" : "full";
    var link = un ? C.checkoutPromoUrl : C.checkoutFullUrl;
    buy.href = link ? url(link) : "#oferta";
    buy.textContent = "Quero o Ateliê de Natal por " + fmt.format(price);
    $("#sticky-price").textContent = fmt.format(price);
    var dis = document.querySelectorAll("[data-full-int]"); for (var i = 0; i < dis.length; i++) dis[i].textContent = C.fullPrice;
    $("#bump-price").textContent = C.bumpPrice ? "+ " + fmt.format(C.bumpPrice) : "";
  }

  if (!promoActive) document.documentElement.classList.add("promo-off");
  else if (end - Date.now() < 2147483000) setTimeout(function () { location.reload(); }, end - Date.now() + 500);

  /* ---------- árvore ---------- */
  var POS = [[20,91],[50,91],[80,91],[35,76],[65,76],[50,61]];
  var COLORS = [["#B3282D","#D9A441"],["#1F4D3A","#B3282D"],["#D9A441","#B3282D"],["#B3282D","#FFF8EC"],["#2b6a50","#D9A441"],["#8f1d22","#D9A441"]];
  function giftSVG(i) {
    var c = COLORS[i % COLORS.length];
    return '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="6" y="22" width="36" height="22" rx="2" fill="' + c[0] + '"/><rect x="21" y="22" width="6" height="22" fill="' + c[1] + '"/>' +
      '<g class="lid"><rect x="4" y="14" width="40" height="9" rx="2" fill="' + c[0] + '"/><rect x="21" y="14" width="6" height="9" fill="' + c[1] + '"/><path d="M24 14c-8-9-14-3-9 0zM24 14c8-9 14-3 9 0z" fill="none" stroke="' + c[1] + '" stroke-width="3" stroke-linecap="round"/></g>' +
      '<g class="spark" fill="#D9A441"><path d="M24 2l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/><circle cx="8" cy="10" r="2"/><circle cx="40" cy="8" r="2"/></g></svg>';
  }
  function showOpened() {
    $("#sample").innerHTML = '<p class="unlocked">Presente aberto! Desconto de Natal liberado.</p>' +
      '<p class="sample-empty">Seu preço de Natal já está na oferta.</p>' +
      '<a class="btn btn-primary" href="#oferta">Ver oferta de Natal</a>';
  }

  function lockOthers() {
    [].forEach.call(document.querySelectorAll(".gift:not(.open)"), function (g) { g.classList.add("locked"); g.setAttribute("aria-disabled", "true"); g.tabIndex = -1; });
  }

  function openGift(i, btn) {
    if (opened.length) return; // um presente por visitante; todos valem o mesmo
    opened.push(i); save();
    btn.classList.add("open", "current");
    btn.setAttribute("aria-label", "Presente " + (i + 1) + " de " + POS.length + ", aberto");
    lockOthers(); showOpened(); render();
    setTimeout(function () { showModal(i); }, reduce ? 0 : 650);
    if (window.AtelieTrack) AtelieTrack.track("PresenteAberto", { numero: i + 1 }, true);
  }

  function buildTree() {
    var host = $("#gifts"); if (!host) return;
    POS.forEach(function (p, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "gift";
      b.style.left = p[0] + "%"; b.style.top = p[1] + "%";
      b.setAttribute("aria-label", "Presente " + (i + 1) + " de " + POS.length + ", fechado. Abrir para liberar o desconto");
      b.innerHTML = giftSVG(i);
      b.addEventListener("click", function () { openGift(i, b); });
      host.appendChild(b);
      if (opened[0] === i) { b.classList.add("open", "current"); b.setAttribute("aria-label", "Presente " + (i + 1) + ", aberto"); }
    });
    if (opened.length && promoActive) { lockOthers(); showOpened(); }
  }

  /* ---------- "Ver oferta": libera a mesma promo sem precisar abrir presente ---------- */
  [].forEach.call(document.querySelectorAll("[data-ver-oferta]"), function (a) {
    a.addEventListener("click", function () {
      if (promoActive && !unlocked()) { viaOffer = true; save(); render(); }
    });
  });

  /* ---------- eventos ---------- */
  $("#buy").addEventListener("click", function (e) {
    var href = this.getAttribute("href");
    if (!href || href === "#oferta") { e.preventDefault(); console.warn("Link de checkout não configurado em assets/js/config.js"); return; }
    var un = this.dataset.kind === "promo";
    if (window.AtelieTrack) AtelieTrack.track("InitiateCheckout", { value: un ? C.promoPrice : C.fullPrice, currency: "BRL", content_name: "Ateliê de Natal", num_items: 1 });
  });

  var vc = false;
  function viewContent() {
    if (vc) return; vc = true;
    if (window.AtelieTrack) AtelieTrack.track("ViewContent", { content_name: "Ateliê de Natal", content_type: "product", value: unlocked() ? C.promoPrice : C.fullPrice, currency: "BRL" });
  }

  /* ---------- barra fixa (celular) ---------- */
  var sticky = $("#sticky"), heroOn = true, offerOn = false, treeOn = false;
  function stickyUpdate() { sticky.hidden = heroOn || offerOn || treeOn; }
  if ("IntersectionObserver" in window) {
    var io = function (sel, cb, th) { var el = $(sel); if (!el) return; new IntersectionObserver(function (en) { cb(en[0].isIntersecting); }, { threshold: th || 0.15 }).observe(el); };
    io("#topo", function (v) { heroOn = v; stickyUpdate(); }, 0.2);
    io("#oferta", function (v) { offerOn = v; stickyUpdate(); if (v) viewContent(); }, 0.25);
    io("#arvore", function (v) { treeOn = v; stickyUpdate(); }, 0.3);
  } else { sticky.hidden = true; viewContent(); }
  $("#sticky-btn").addEventListener("click", function () { if (promoActive && !unlocked()) { var t = $("#arvore"); if (t) { /* leva à árvore para escolher o presente */ this.setAttribute("href", "#arvore"); } } else this.setAttribute("href", "#oferta"); });


  /* ---------- carrossel infinito (automático e com swipe) ---------- */
  function loopCarousel(el) {
    var track = $(".track", el), orig = [].slice.call(track.children), n = orig.length;
    function clones() { var f = document.createDocumentFragment(); orig.forEach(function (s) { var c = s.cloneNode(true); c.setAttribute("aria-hidden", "true"); f.appendChild(c); }); return f; }
    track.insertBefore(clones(), track.firstChild); track.appendChild(clones());
    var setW = 0, stepW = 0, timer = null, paused = false, visible = false, settle, resume;
    var interval = el.classList.contains("car-sess") ? 3200 : 3800;
    function measure() { var k = track.children; setW = k[n].offsetLeft - k[0].offsetLeft; stepW = k[1].offsetLeft - k[0].offsetLeft; }
    function jump(x) { track.style.scrollSnapType = "none"; track.scrollLeft = x; requestAnimationFrame(function () { track.style.scrollSnapType = ""; }); }
    function normalize() { measure(); if (!setW) return; if (track.scrollLeft < setW * 0.5) jump(track.scrollLeft + setW); else if (track.scrollLeft >= setW * 1.5) jump(track.scrollLeft - setW); }
    function start() { measure(); jump(setW); }
    function stop() { clearInterval(timer); timer = null; }
    function play() { stop(); if (reduce || paused || !visible) return; timer = setInterval(function () { track.scrollBy({ left: stepW, behavior: "smooth" }); }, interval); }
    function pause() { paused = true; stop(); clearTimeout(resume); }
    function later() { clearTimeout(resume); resume = setTimeout(function () { paused = false; play(); }, 3500); }
    track.addEventListener("scroll", function () { clearTimeout(settle); settle = setTimeout(normalize, 140); }, { passive: true });
    track.addEventListener("touchstart", pause, { passive: true }); track.addEventListener("touchend", later, { passive: true });
    track.addEventListener("pointerdown", pause); track.addEventListener("pointerup", later);
    el.addEventListener("mouseenter", pause); el.addEventListener("mouseleave", later);
    window.addEventListener("resize", start);
    if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; play(); }, { threshold: 0.3 }).observe(el);
    start(); setTimeout(start, 700); window.addEventListener("load", start);
  }
  [].forEach.call(document.querySelectorAll(".carousel[data-loop]"), loopCarousel);

  /* ---------- barra de promoção: contagem em dias para a data fixa ---------- */
  function countdown() {
    var el = $("#pb-count"); if (!el || !promoActive) return;
    var ms = end - Date.now(), d = Math.ceil(ms / 86400000);
    el.textContent = ms < 86400000 ? "último dia" : "faltam " + d + " dias";
  }
  countdown(); setInterval(countdown, 600000);

  /* ---------- neve ---------- */
  (function snow() {
    var box = $("#snow"); if (!box || reduce) return;
    var count = window.innerWidth < 600 ? 22 : 40;
    for (var i = 0; i < count; i++) {
      var f = document.createElement("i"), s = 3 + Math.random() * 5;
      f.className = "flake"; f.style.width = f.style.height = s + "px"; f.style.left = Math.random() * 100 + "%";
      f.style.opacity = 0.55 + Math.random() * 0.45;
      f.style.setProperty("--dx", (Math.random() * 80 - 40) + "px");
      f.style.animationDuration = (9 + Math.random() * 10) + "s"; f.style.animationDelay = (-Math.random() * 18) + "s";
      box.appendChild(f);
    }
  })();

  /* ---------- tela de parabéns ao abrir o presente ---------- */
  var modal = $("#modal"), lastFocus = null;
  function confetti() {
    var c = $("#confetti"), cols = ["#B3282D", "#D9A441", "#1F4D3A", "#fff", "#e8736f"]; c.innerHTML = "";
    if (reduce) return;
    for (var i = 0; i < 42; i++) {
      var p = document.createElement("i"), a = Math.random() * Math.PI * 2, r = 90 + Math.random() * 150;
      p.style.background = cols[i % cols.length];
      p.style.setProperty("--x", Math.cos(a) * r + "px"); p.style.setProperty("--y", (Math.sin(a) * r - 40 + Math.random() * 120) + "px");
      p.style.setProperty("--r", (Math.random() * 720 - 360) + "deg"); p.style.setProperty("--d", (0.75 + Math.random() * 0.4) + "s");
      c.appendChild(p);
    }
  }
  function showModal(i) {
    lastFocus = document.activeElement;
    $("#big-gift").innerHTML = giftSVG(i);
    $("#m-price").textContent = fmt.format(C.promoPrice);
    modal.hidden = false; confetti();
    setTimeout(function () { $("#m-go").focus(); }, 50);
  }
  function closeModal() { modal.hidden = true; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  $("#m-close").addEventListener("click", closeModal);
  $("#m-go").addEventListener("click", function () { modal.hidden = true; });
  modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !modal.hidden) closeModal(); });

  /* ---------- carrosséis ---------- */
  function carousel(el) {
    var track = $(".track", el), slides = track.children, dotsBox = $(".dots", el);
    var prev = $(".prev", el), next = $(".next", el), timer = null, paused = false, visible = false;
    var interval = el.classList.contains("car-sess") ? 6500 : 4200;
    function step() { var s = slides[1] || slides[0]; return s ? (slides[1] ? slides[1].offsetLeft - slides[0].offsetLeft : s.offsetWidth) : 0; }
    function atEnd() { return track.scrollLeft + track.clientWidth >= track.scrollWidth - 4; }
    function go(i) { track.scrollTo({ left: i * step(), behavior: reduce ? "auto" : "smooth" }); }
    function index() { var st = step(); return st ? Math.round(track.scrollLeft / st) : 0; }
    function move(dir) { if (dir > 0 && atEnd()) go(0); else if (dir < 0 && track.scrollLeft <= 4) go(slides.length - 1); else track.scrollBy({ left: dir * step(), behavior: reduce ? "auto" : "smooth" }); }
    function measure() { el.classList.toggle("no-scroll", track.scrollWidth <= track.clientWidth + 4); }
    function dots() {
      dotsBox.innerHTML = "";
      for (var i = 0; i < slides.length; i++) (function (i) {
        var b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-label", "Ir para o item " + (i + 1));
        b.addEventListener("click", function () { go(i); }); dotsBox.appendChild(b);
      })(i);
      mark();
    }
    function mark() { var cur = atEnd() ? slides.length - 1 : index(); [].forEach.call(dotsBox.children, function (b, i) { b.setAttribute("aria-current", i === cur ? "true" : "false"); }); }
    function stop() { clearInterval(timer); timer = null; }
    function play() { stop(); if (reduce || paused || !visible || el.classList.contains("no-scroll")) return; timer = setInterval(function () { move(1); }, interval); }
    var resume;
    function pause() { paused = true; stop(); clearTimeout(resume); }
    function later() { clearTimeout(resume); resume = setTimeout(function () { paused = false; play(); }, 7000); }
    prev.addEventListener("click", function () { move(-1); pause(); later(); });
    next.addEventListener("click", function () { move(1); pause(); later(); });
    el.addEventListener("mouseenter", pause); el.addEventListener("mouseleave", later);
    el.addEventListener("focusin", pause); el.addEventListener("focusout", later);
    track.addEventListener("touchstart", pause, { passive: true }); track.addEventListener("touchend", later, { passive: true });
    track.addEventListener("scroll", mark, { passive: true });
    window.addEventListener("resize", function () { measure(); play(); });
    if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; play(); }, { threshold: 0.3 }).observe(el);
    dots(); measure(); setTimeout(function () { measure(); play(); }, 600);
  }
  [].forEach.call(document.querySelectorAll(".carousel:not([data-loop])"), carousel);

  $("#year").textContent = new Date().getFullYear();
  buildTree();
  render();
})();
