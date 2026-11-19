/* Quiz opcional "O Ateliê é pra você?" — abre por cima da página, 5 perguntas, resultado quebra a objeção marcada. */
(function () {
  var Q = [
    { k: "exp", q: "Você já bordou alguma vez?", a: [["🙈", "Nunca", "nunca"], ["🪡", "Um pouquinho", "pouco"], ["😍", "Adoro bordar", "adoro"]] },
    { k: "obj", q: "O que mais te faz pensar duas vezes?", a: [["🤔", "Acho que não sei bordar", "nao_sei"], ["🧵", "Não tenho material", "material"], ["🔒", "Medo de comprar online", "seguranca"], ["⏰", "Falta de tempo", "tempo"]] },
    { k: "pra", q: "Pra quem você vai bordar?", a: [["💛", "Pra mim, pra relaxar", "eu"], ["🎁", "Pra presentear", "presente"], ["👵", "Com netos e filhos", "familia"], ["💰", "Pra vender", "vender"]] },
    { k: "tempo", q: "Quanto tempo você tem por dia?", a: [["☕", "Uns 10 minutinhos", "10"], ["🕯️", "Meia hora", "30"], ["🌙", "Mais que isso", "mais"]] },
    { k: "canto", q: "O que você quer enfeitar primeiro?", a: [["🎄", "A árvore", "arvore"], ["🍽️", "A mesa da ceia", "mesa"], ["⭐", "O presépio", "presepio"], ["💌", "Cartões", "cartoes"]] }
  ];
  var PERFIL = { eu: ["Bordadeira Zen", "🕯️", "Seu momento de calma, ponto por ponto."], presente: ["Bordadeira Presenteira", "🎁", "Presentes feitos à mão que ninguém esquece."], familia: ["Bordadeira de Família", "👵", "Um novo ritual de Natal com quem você ama."], vender: ["Bordadeira Empreendedora", "💰", "Cartões e enfeites lindos pra vender no fim de ano."] };
  var OBJ = {
    nao_sei: "<b>Não precisa saber bordar.</b> É só seguir os pontinhos do molde, e o guia Primeiros Pontos ensina do zero.",
    material: "<b>Material simples e barato:</b> papel firme, uma agulha e linha. Coisa que você acha em qualquer armarinho.",
    seguranca: "<b>Compra 100% segura</b> e garantia de 7 dias: não gostou, devolvemos todo o seu dinheiro.",
    tempo: "<b>Cabe na sua rotina:</b> tem molde que fica pronto em 10 minutinhos."
  };
  var CANTO = { arvore: "enfeites de árvore e guirlandas", mesa: "marcadores de lugar e cardápios da ceia", presepio: "presépio e cenas do nascimento", cartoes: "cartões, etiquetas e envelopes" };
  var r = {}, i = 0, el;
  function t(n, p) { if (window.AtelieTrack) AtelieTrack.track(n, p || {}, true); }
  function stars() { var s = ""; for (var k = 0; k < Q.length; k++) s += '<i class="' + (k < i ? "on" : "") + '">★</i>'; return '<div class="qz-stars">' + s + "</div>"; }
  function step() {
    if (i >= Q.length) return loading();
    var q = Q[i];
    el.querySelector(".qz-body").innerHTML = stars() + '<p class="qz-n">Pergunta ' + (i + 1) + " de " + Q.length + '</p><h3>' + q.q + '</h3><div class="qz-opts">' +
      q.a.map(function (a) { return '<button type="button" data-v="' + a[2] + '"><span>' + a[0] + "</span>" + a[1] + "</button>"; }).join("") + "</div>";
    [].forEach.call(el.querySelectorAll(".qz-opts button"), function (b) {
      b.onclick = function () { b.classList.add("sel"); r[q.k] = b.dataset.v; t("QuizResposta", { pergunta: q.k, resposta: b.dataset.v }); i++; var f = FB[b.dataset.v]; if (f) { el.querySelector(".qz-opts").insertAdjacentHTML("afterend", '<p class="qz-fb">' + f + "</p>"); setTimeout(step, 1300); } else setTimeout(step, 350); };
    });
  }
  var FB = { nunca: "Perfeito! 78% das nossas alunas também nunca tinham bordado 💛", nao_sei: "Fica tranquila, esse é o medo nº 1… e tem solução 😉", material: "Boa notícia: você vai precisar de bem pouco 🧵", seguranca: "Super normal ter esse cuidado. Já já te mostro 🔒", tempo: "Entendi! Vamos achar moldes rapidinhos pra você ⏰", vender: "Ótimo! Cartão bordado vende muito no fim de ano 💰", familia: "Que lindo! Vai virar tradição na sua casa 👵" };
  function loading() {
    var msgs = ["Analisando suas respostas…", "Traçando seu perfil de bordadeira…", "Vendo se o Ateliê é mesmo pra você…", "Separando os moldes ideais…", "Buscando a melhor oferta pra você…"];
    el.querySelector(".qz-body").innerHTML = '<div class="qz-load"><div class="qz-spin"></div><h3>Só um instante…</h3><div class="qz-bar"><i></i></div><p class="qz-msg"></p><b class="qz-pc">0%</b></div>';
    var bar = el.querySelector(".qz-bar i"), msg = el.querySelector(".qz-msg"), pc = el.querySelector(".qz-pc"), t0 = Date.now(), D = 5500;
    (function tick() { var k = Math.min(1, (Date.now() - t0) / D); bar.style.width = k * 100 + "%"; pc.textContent = Math.round(k * 100) + "%"; msg.textContent = msgs[Math.min(msgs.length - 1, Math.floor(k * msgs.length))]; if (k < 1) requestAnimationFrame(tick); else setTimeout(result, 400); })();
  }
  function result() {
    var p = PERFIL[r.pra] || PERFIL.eu, pct = 90 + Math.floor(Math.random() * 8);
    var buy = document.getElementById("buy");
    t("QuizConcluido", { perfil: r.pra, objecao: r.obj });
    el.querySelector(".qz-body").innerHTML = stars() + '<div class="qz-res"><p class="qz-ok">✅ Perfil encontrado!</p><div class="qz-emo">' + p[1] + '</div><p class="qz-n">Seu perfil</p><h3>' + p[0] + '</h3><p class="qz-pct"><b>' + pct + '%</b> compatível com o Ateliê</p><p>' + p[2] + '</p>' +
      '<ul><li>' + OBJ[r.obj] + '</li><li><b>Comece por:</b> ' + CANTO[r.canto] + ".</li></ul>" +
      '<a class="btn btn-primary btn-xl" href="' + buy.getAttribute("href") + '" id="qz-go">' + buy.textContent + "</a><p class=\"qz-sm\">🎁 Seu preço de Natal ficou reservado</p></div>";
    document.getElementById("qz-go").onclick = function () { t("QuizCheckout"); if (window.AtelieTrack) AtelieTrack.track("InitiateCheckout", { value: (window.ATELIE_CONFIG || {}).promoPrice, currency: "BRL", content_name: "Ateliê de Natal", num_items: 1 }); };
  }
  function open(e) {
    e.preventDefault(); r = {}; i = 0;
    if (!el) {
      el = document.createElement("div"); el.className = "qz"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true");
      el.innerHTML = '<div class="qz-card"><button type="button" class="qz-x" aria-label="Fechar">×</button><div class="qz-body"></div></div>';
      el.querySelector(".qz-x").onclick = function () { el.hidden = true; document.body.style.overflow = ""; };
      document.body.appendChild(el);
    }
    el.hidden = false; document.body.style.overflow = "hidden"; t("QuizInicio"); step();
  }
  var a = document.getElementById("quiz-link"); if (a) a.addEventListener("click", open);
})();
