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

  $("#year").textContent = new Date().getFullYear();
  buildTree();
  render();
})();
