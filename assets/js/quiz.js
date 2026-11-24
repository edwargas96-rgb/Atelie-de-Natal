/* Teste opcional "O Ateliê é pra você?" — 8 perguntas, XP, análise e resultado.
   Honesto: depoimentos e imagens são os mesmos que já estão na página. O link final é copiado do botão de compra (#buy) na hora do clique. */
(function () {
  var REDUZ = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var IMG = { s1: "assets/img/sessao-1.webp", s2: "assets/img/sessao-2.webp", s3: "assets/img/sessao-3.webp", s4: "assets/img/sessao-4.webp", mk: "assets/img/mockup-produto.webp",
    b1: "assets/img/bonus-1.webp", b2: "assets/img/bonus-2.webp", b3: "assets/img/bonus-3.webp", b4: "assets/img/bonus-4.webp" };
  var LEG = { s1: "Cartões e presentes personalizados", s2: "Enfeites e detalhes para a árvore", s3: "Decorações para a casa e a ceia", s4: "Atividades e lembranças em família", mk: "Ateliê de Natal · 250 moldes + 5 bônus" };
  // depoimentos reais da página (prints em assets/prova). av = recorte da foto redonda no print: [largura, altura, centroX, centroY, diâmetro]
  var DEP = {
    marcelo: { intro: "Você não é a única. Veja o que diz o Marcelo:", nome: "Marcelo", cidade: "SP", img: "assets/prova/5.webp", av: [414, 517, 54, 22, 38], frase: "Tô adorando! As explicações são bem claras e tá ficando lindo." },
    marcos: { intro: "Você não é a única. Veja o que dizem Marcos e Júlia:", nome: "Marcos e Júlia", cidade: "RJ", img: "assets/prova/4.webp", av: [319, 517, 46, 22, 36], frase: "Ficou muito gostoso de fazer e as explicações são super fáceis de seguir." },
    renata: { intro: "Você não é a única. Veja o que dizem Renata e Carlos:", nome: "Renata e Carlos", cidade: "RJ", img: "assets/prova/3.webp", av: [320, 517, 48, 22, 36], frase: "Ainda estamos montando, mas já tá ficando do jeitinho que imaginamos." },
    ana: { intro: "Você não é a única. Veja o que diz a Ana Lúcia:", nome: "Ana Lúcia", cidade: "", img: "assets/prova/1.webp", av: [470, 517, 50, 22, 40], frase: "Aqui eu e meu netinho já começamos a montar a decoração para a nossa mesa da ceia de Natal!" }
  };
  // fb: tipo de conteúdo depois da resposta (dep = depoimento, img = imagem do produto, ben = benefícios)
  var Q = [
    { k: "exp", q: "Você já bordou alguma vez?", fb: "dep", dep: "marcelo", a: [
      ["🙈", "Nunca, mas sempre tive vontade", 3, "nunca"], ["🪡", "Já tentei uma ou duas vezes", 2, "tentei"], ["😍", "Já bordo e adoro", 3, "bordo"], ["🤷", "Não, e acho que não levo jeito", 1, "jeito"]] },
    { k: "medo", q: "Qual é o seu maior medo ao começar a bordar?", fb: "img", a: [
      ["😟", "Não conseguir e ficar feio", 2, "feio"], ["🧵", "Gastar com material", 2, "material"], ["🔒", "Comprar online e não receber", 1, "seguranca"], ["⏰", "Não ter tempo de terminar", 1, "tempo"]] },
    { k: "molde", q: "O que acontece quando você tenta seguir um molde?", fb: "dep", dep: "marcos", a: [
      ["😵", "Me perco no meio do desenho", 2, "perco"], ["🤔", "Não sei por onde começar", 2, "comeco"], ["🙂", "Consigo, só demoro um pouco", 3, "consigo"]] },
    { k: "parou", q: "Por que você parou da última vez?", fb: "ben", a: [
      ["😔", "Ficou difícil demais", 2, "dificil"], ["💸", "O material ficou caro", 2, "caro"], ["⏳", "Faltou tempo", 2, "tempo"], ["✨", "Nunca parei, quero novidades", 3, "novidade"]] },
    { k: "tempo", q: "Quanto tempo você tem por dia?", fb: "dep", dep: "renata", a: [
      ["☕", "Uns 10 minutinhos", 2, "10 min por dia"], ["🕯️", "Meia hora", 3, "30 min por dia"], ["🌙", "Uma hora ou mais", 3, "1 h ou mais por dia"], ["📅", "Só no fim de semana", 1, "Fins de semana"]] },
    { k: "obj", q: "Para que você quer bordar?", fb: "img", a: [
      ["🎁", "Para presentear quem eu amo", 3, "presente"], ["💰", "Para ter uma renda extra", 3, "renda"], ["🧘", "Para relaxar, uma terapia", 3, "relaxar"], ["🎄", "Para decorar minha casa", 3, "decorar"]] },
    { k: "nivel", q: "Qual é o seu nível hoje?", fb: "dep", dep: "ana", a: [
      ["🌱", "Iniciante total", 2, "Iniciante"], ["🪡", "Sei o básico", 2, "Básico"], ["🏅", "Já bordo bem", 3, "Avançada"]] },
    { k: "natal", q: "Quão importante é para você começar ainda neste Natal?", fb: "ben", a: [
      ["🎄", "Muito! Quero a casa pronta", 3, "muito"], ["🙂", "Seria ótimo", 2, "otimo"], ["🤷", "Tanto faz", 1, "tantofaz"]] }
  ];
  var FB_IMG = {
    feio: ["🔓 Olha o que dá pra fazer seguindo os pontinhos", "s1", "É só furar e seguir os pontinhos do molde."],
    material: ["🔓 Feito só com papel, agulha e linha", "s2", "Sem tecido e sem bastidor."],
    seguranca: ["🔓 O kit chega direto no seu e-mail", "mk", "Pagamento seguro e garantia de 7 dias."],
    tempo: ["🔓 Pequenos projetos, um de cada vez", "s4", "Você borda no seu ritmo, sem pressa."],
    presente: ["🔓 Presentes feitos com as suas mãos", "s1", "Cartões e etiquetas que ninguém esquece."],
    renda: ["🔓 Peças lindas, feitas por você", "s2", "Cartões, enfeites e decorações para este Natal."],
    relaxar: ["🔓 Seu momento de calma, ponto por ponto", "s4", "Um passatempo gostoso, longe do celular."],
    decorar: ["🔓 Sua casa toda decorada à mão", "s3", "Da árvore à mesa da ceia."]
  };
  var FB_BEN = {
    dificil: ["✅ Aqui é passo a passo, até pra quem nunca bordou", ["Moldes com pontinhos para furar e seguir", "Guia Primeiros Pontos de presente", "Garantia de 7 dias"]],
    caro: ["✅ Material simples: papel, agulha e linha", ["250 moldes para imprimir em casa", "Pagamento único, sem mensalidade", "Acesso imediato por e-mail"]],
    tempo: ["✅ Você borda no seu ritmo, um molde de cada vez", ["Cartões, etiquetas e enfeites pequenos", "Acesso imediato por e-mail", "Garantia de 7 dias"]],
    novidade: ["✅ São 250 moldes novos para este Natal", ["250 moldes em 4 categorias", "+ 5 bônus de presente", "Pagamento único"]],
    muito: ["✅ Dá tempo: o acesso chega na hora", ["Acesso imediato por e-mail", "PDF para imprimir em casa", "250 moldes + 5 bônus"]],
    otimo: ["✅ Comece hoje, sem pressa", ["Acesso imediato por e-mail", "Pagamento único", "Garantia de 7 dias"]],
    tantofaz: ["✅ Os moldes ficam com você", ["PDF para imprimir quando quiser", "Pagamento único", "Garantia de 7 dias"]]
  };
  var PERFIL = { presente: "Bordadeira presenteira", renda: "Bordadeira empreendedora", relaxar: "Bordadeira zen", decorar: "Decoradora de Natal" };
  var OBJ = { feio: "Os moldes têm pontinhos para seguir, e o guia Primeiros Pontos ensina do zero", material: "Só papel, agulha e linha: sem tecido e sem bastidor", seguranca: "Pagamento seguro e garantia de 7 dias", tempo: "Projetos pequenos que cabem na sua rotina" };
  var NIVEL = { Iniciante: "Perfeito para iniciante: é só seguir os pontinhos", "Básico": "Você já sabe o básico: vai voar com os 250 moldes", "Avançada": "Para quem já borda: 250 moldes novos para criar" };

  var el, body, xpEl, ans, xp, i, timers = [], rafs = [];
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function later(f, ms) { timers.push(setTimeout(f, ms)); }
  function frame(f) { rafs.push(requestAnimationFrame(f)); }
  function stopAll() { timers.forEach(clearTimeout); rafs.forEach(cancelAnimationFrame); timers = []; rafs = []; }
  function t(n, p) { if (window.AtelieTrack) AtelieTrack.track(n, p || {}, true); }
  function img(k, cls, extra) { return '<img loading="lazy" decoding="async" src="' + IMG[k] + '" alt="' + esc(LEG[k] || "Ateliê de Natal") + '"' + (cls ? ' class="' + cls + '"' : "") + (extra || "") + ">"; }

  function top() {
    var seg = ""; for (var k = 0; k < Q.length; k++) seg += '<i class="' + (k < i ? "ok" : k === i ? "cur" : "") + '"></i>';
    return '<div class="qx-top"><span class="qx-xp">⭐ ' + xp + ' XP</span><div class="qx-seg">' + seg + "</div></div>";
  }
  function pulo() { xpEl = el.querySelector(".qx-xp"); if (!xpEl) return; xpEl.textContent = "⭐ " + xp + " XP"; xpEl.classList.remove("pulo"); void xpEl.offsetWidth; xpEl.classList.add("pulo"); }

  function pergunta() {
    var q = Q[i];
    body.innerHTML = top() + '<p class="qx-n">Pergunta ' + (i + 1) + " de " + Q.length + "</p><h3>" + esc(q.q) + '</h3><div class="qx-area"><div class="qx-opts">' +
      q.a.map(function (o, n) { return '<button type="button" data-n="' + n + '"><span>' + o[0] + "</span>" + esc(o[1]) + "</button>"; }).join("") + "</div></div>";
    el.querySelector(".qx-card").scrollTop = 0;
    [].forEach.call(body.querySelectorAll(".qx-opts button"), function (b) { b.onclick = function () { responder(+b.dataset.n, b); }; });
  }

  function responder(n, b) {
    var q = Q[i], o = q.a[n], box = b.parentNode;
    if (box.classList.contains("lock")) return;
    box.classList.add("lock"); b.classList.add("sel");
    ans[q.k] = { v: o[3], txt: o[1], pts: o[2] }; xp += o[2] * 10;
    t("QuizResposta", { pergunta: q.k, resposta: o[3] });
    pulo();
    later(function () { feedback(q, o); }, REDUZ ? 150 : 420);
  }

  function feedback(q, o) {
    var h = '<div class="qx-fb"><p class="qx-gain">+' + o[2] * 10 + " XP · Resposta " + (i + 1) + " de " + Q.length + "!</p>", livre = true;
    if (q.fb === "dep") {
      var d = DEP[q.dep], a = d.av, W = a[0], H = a[1], cx = a[2], cy = a[3], D = a[4];
      var st = "background-image:url(" + d.img + ");background-size:" + (W / D * 100).toFixed(1) + "% auto;background-position:" + ((cx - D / 2) / (W - D) * 100).toFixed(2) + "% " + ((cy - D / 2) / (H - D) * 100).toFixed(2) + "%";
      h += '<p class="qx-intro">' + esc(d.intro) + '</p><div class="qx-dep"><div class="qx-av" role="img" aria-label="Foto de ' + esc(d.nome) + '" style="' + st + '"></div><p class="qx-nome">' + esc(d.nome) +
        (d.cidade ? " <small>· " + esc(d.cidade) + "</small>" : "") + '</p><p class="qx-st" aria-label="5 estrelas">⭐⭐⭐⭐⭐</p><blockquote>“' + esc(d.frase) + "”</blockquote></div>";
      livre = false;
    } else if (q.fb === "img") {
      var f = FB_IMG[o[3]];
      h += '<p class="qx-t">' + esc(f[0]) + '</p><div class="qx-img">' + img(f[1]) + '</div><p class="qx-leg">' + esc(LEG[f[1]]) + (f[1] === "mk" ? "" : " · um dos temas dos 250 moldes") + '</p><p class="qx-ben">' + esc(f[2]) + "</p>";
    } else {
      var bn = FB_BEN[o[3]];
      h += '<p class="qx-t">' + esc(bn[0]) + '</p><ul class="qx-list">' + bn[1].map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
    }
    var ult = i === Q.length - 1;
    h += '<button type="button" class="btn btn-primary qx-next"' + (livre ? "" : " disabled") + '><span class="qx-fill"></span><b>' + (livre ? (ult ? "Ver meu resultado →" : "Próxima pergunta →") : "Lendo… 0%") + "</b></button></div>";
    i++; // a barra já mostra esta pergunta como respondida
    body.querySelector(".qx-seg").outerHTML = top().match(/<div class="qx-seg">.*<\/div>/)[0];
    var area = body.querySelector(".qx-area"); area.innerHTML = h;
    var btn = area.querySelector(".qx-next"), lbl = btn.querySelector("b"), fill = btn.querySelector(".qx-fill");
    btn.onclick = function () { if (btn.disabled) return; i < Q.length ? pergunta() : analise(); };
    if (!livre) {
      var t0 = performance.now(), DUR = 5000;
      (function tick(now) {
        var p = Math.min(1, (now - t0) / DUR); fill.style.width = p * 100 + "%"; lbl.textContent = "Lendo… " + Math.floor(p * 100) + "%";
        if (p < 1) frame(tick); else { btn.disabled = false; fill.style.width = "0"; lbl.textContent = ult ? "Ver meu resultado →" : "Próxima pergunta →"; btn.classList.add("pronto"); }
      })(t0);
    }
  }

  function anel(cls, pct) { var r = 42, c = 2 * Math.PI * r; return '<div class="qx-ring ' + cls + '"><svg viewBox="0 0 100 100"><circle class="bg" cx="50" cy="50" r="' + r + '"/><circle class="fg" cx="50" cy="50" r="' + r + '" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + c.toFixed(1) + '"/></svg><b>0%</b></div>'; }
  function encher(ring, ate, dur, fim) {
    var fg = ring.querySelector(".fg"), b = ring.querySelector("b"), c = 2 * Math.PI * 42, t0 = performance.now();
    (function tick(now) { var p = REDUZ ? 1 : Math.min(1, (now - t0) / dur), v = ate * p; fg.style.strokeDashoffset = c * (1 - v / 100); b.textContent = Math.round(v) + "%"; if (p < 1) frame(tick); else if (fim) fim(); })(t0);
  }

  function analise() {
    t("QuizConcluido", { perfil: ans.obj.v, objecao: ans.medo.v, xp: xp });
    var etapas = ["Analisando suas respostas", "Cruzando seu perfil com os moldes", "Montando seu caminho", "Calculando quanto você combina com o Ateliê de Natal"];
    var pilha = ["s1", "s2", "s3", "s4", "mk"], rot = [-8, 6, -4, 9, -2];
    body.innerHTML = top() + '<div class="qx-ana"><h3>Analisando suas respostas…</h3><div class="qx-stack">' +
      pilha.map(function (k, n) { return img(k, "", ' style="--r:' + rot[n] + 'deg"'); }).join("") + "</div>" + anel("", 0) +
      '<ul class="qx-steps">' + etapas.map(function (s) { return "<li><i></i>" + esc(s) + "</li>"; }).join("") + "</ul></div>";
    el.querySelector(".qx-card").scrollTop = 0;
    var DUR = 5600, ims = body.querySelectorAll(".qx-stack img"), lis = body.querySelectorAll(".qx-steps li");
    [].forEach.call(ims, function (im, n) { later(function () { im.classList.add("on"); }, 200 + n * (DUR - 800) / ims.length); });
    [].forEach.call(lis, function (li, n) { var a = n * DUR / 4; later(function () { li.classList.add("and"); }, a); later(function () { li.classList.remove("and"); li.classList.add("ok"); li.querySelector("i").textContent = "✓"; }, a + DUR / 4 - 150); });
    encher(body.querySelector(".qx-ring"), 100, DUR);
    later(resultado, DUR + 350);
  }

  function resultado() {
    var min = Q.length * 10, max = 0; Q.forEach(function (q) { max += Math.max.apply(null, q.a.map(function (o) { return o[2]; })) * 10; });
    var minP = 0; Q.forEach(function (q) { minP += Math.min.apply(null, q.a.map(function (o) { return o[2]; })) * 10; });
    var pct = Math.round(93 + 6 * Math.max(0, Math.min(1, (xp - minP) / (max - minP || 1))));
    var perfil = PERFIL[ans.obj.v] || "Bordadeira de Natal";
    var motivos = [NIVEL[ans.nivel.v] || "Moldes do fácil ao avançado", "Cabe na sua rotina: " + ans.tempo.v.toLowerCase(), OBJ[ans.medo.v], "Pagamento único e garantia de 7 dias"];
    var locked = document.documentElement.classList.contains("gift-pending");
    var micro = (document.querySelector("#oferta .fine") || {}).textContent || "Pagamento único · Acesso imediato · Garantia de 7 dias";
    var grade = ["s1", "s2", "s3", "s4", "b1", "b2", "b3", "b4"];
    body.innerHTML = top() + '<div class="qx-res"><span class="qx-selo">🏆 Conquista desbloqueada: ' + esc(perfil) + "</span>" + anel("qx-big", 0) + '<p class="qx-comb">combina com você</p>' +
      '<p class="qx-tit">O Ateliê de Natal é para você!</p><div class="qx-placar"><div><b>' + xp + '</b><small>XP total</small></div><div><b>8/8</b><small>respostas</small></div><div><b>' + esc(ans.nivel.v) + "</b><small>seu nível</small></div></div>" +
      '<div class="qx-grade">' + grade.map(function (k) { return img(k); }).join("") + '</div><p class="qx-mais">…e os 250 moldes + 5 bônus esperando por você</p>' +
      '<div class="qx-chips"><span>' + esc(ans.obj.txt.replace(/^Para /, "")) + "</span><span>" + esc(ans.tempo.v) + "</span></div>" +
      '<ul class="qx-list">' + motivos.map(function (m) { return "<li>" + esc(m) + "</li>"; }).join("") + "</ul>" +
      '<a class="btn btn-primary btn-xl qx-go" href="#oferta">' + (locked ? "🎁 Revelar meu preço de Natal" : "Quero começar agora") + "</a>" +
      '<p class="qx-micro">' + esc(micro.trim()) + '</p><p class="qx-nota">Resultado orientativo de acordo com as suas respostas.</p></div>';
    el.querySelector(".qx-card").scrollTop = 0;
    encher(body.querySelector(".qx-big"), pct, 1600);
    confete();
    body.querySelector(".qx-go").onclick = function (e) {
      var buy = document.getElementById("buy"), go = this;
      if (document.documentElement.classList.contains("gift-pending") || !buy || buy.dataset.kind === "gift") {
        e.preventDefault(); t("QuizRevelar"); fechar(); var tr = document.getElementById("arvore"); if (tr) tr.scrollIntoView({ behavior: REDUZ ? "auto" : "smooth" }); return;
      }
      go.href = buy.href; if (buy.target) go.target = buy.target; // mesmo link (com UTMs) dos botões da página
      t("QuizCheckout");
      if (window.AtelieTrack) AtelieTrack.track("InitiateCheckout", { value: (window.ATELIE_CONFIG || {}).promoPrice, currency: "BRL", content_name: "Ateliê de Natal", num_items: 1 });
      fechar();
    };
  }

  function confete() {
    if (REDUZ) return;
    var card = el.querySelector(".qx-card"), cv = document.createElement("canvas"); cv.className = "qx-conf"; card.appendChild(cv);
    var w = cv.width = card.clientWidth, h = cv.height = card.clientHeight, cx = cv.getContext("2d"), cores = ["#B3282D", "#1F4D3A", "#D9A441", "#2b6a50", "#fff"];
    var ps = []; for (var k = 0; k < 110; k++) ps.push({ x: w / 2 + (Math.random() - .5) * 60, y: 120, vx: (Math.random() - .5) * 9, vy: -Math.random() * 9 - 3, s: 4 + Math.random() * 5, c: cores[k % 5], r: Math.random() * 6 });
    var t0 = performance.now();
    (function tick(now) {
      var el2 = now - t0; cx.clearRect(0, 0, w, h);
      ps.forEach(function (p) { p.x += p.vx; p.y += p.vy; p.vy += .28; p.r += .2; cx.save(); cx.translate(p.x, p.y + card.scrollTop * 0); cx.rotate(p.r); cx.fillStyle = p.c; cx.globalAlpha = Math.max(0, 1 - el2 / 2500); cx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); cx.restore(); });
      if (el2 < 2500) frame(tick); else cv.remove();
    })(t0);
  }

  function abrir(e) {
    if (e) e.preventDefault();
    if (!el) {
      el = document.createElement("div"); el.className = "qx"; el.hidden = true;
      el.innerHTML = '<div class="qx-card" role="dialog" aria-modal="true" aria-label="Teste: o Ateliê de Natal é para você?"><button type="button" class="qx-x" aria-label="Fechar">×</button><div class="qx-body"></div></div>';
      document.body.appendChild(el); body = el.querySelector(".qx-body");
      el.querySelector(".qx-x").onclick = fechar;
      el.addEventListener("click", function (ev) { if (ev.target === el) fechar(); });
    }
    stopAll(); ans = {}; xp = 0; i = 0;
    el.hidden = false; document.documentElement.style.overflow = document.body.style.overflow = "hidden";
    t("QuizInicio"); pergunta();
    el.querySelector(".qx-x").focus({ preventScroll: true });
  }
  function fechar() {
    if (!el || el.hidden) return;
    stopAll(); el.hidden = true; document.documentElement.style.overflow = document.body.style.overflow = "";
    var cv = el.querySelector(".qx-conf"); if (cv) cv.remove();
  }
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") fechar(); });

  // gatilho: uma linha logo abaixo do botão principal de compra
  var buy = document.getElementById("buy");
  if (buy) {
    var a = document.createElement("button"); a.type = "button"; a.className = "qx-trigger"; a.id = "quiz-link";
    a.innerHTML = "Ainda não tem certeza? <u>Descubra se o Ateliê de Natal é para você</u> 🎯";
    a.addEventListener("click", abrir);
    buy.insertAdjacentElement("afterend", a);
  }
})();
