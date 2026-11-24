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
  var BONUS = {
    pp: { img: "assets/img/bonus-1.webp", nome: "Primeiros Pontos", sub: "Guia dos 6 pontos básicos", n: 1 },
    cx: { img: "assets/img/bonus-2.webp", nome: "Caixinha do Natal", sub: "O guia dos materiais", n: 2 },
    rc: { img: "assets/img/bonus-3.webp", nome: "50 Recadinhos de Natal", sub: "Mensagens prontas para os cartões", n: 3 },
    sn: { img: "assets/img/bonus-4.webp", nome: "Semana do Natal", sub: "Plano de 7 dias", n: 4 },
    bb: { img: "assets/img/bonus-5.webp", nome: "Brinde Bordado", sub: "20 moldes de Ano-Novo", n: 5 }
  };
  // qual bônus aparece em cada resposta (cada bônus aparece no máximo uma vez)
  var BRESP = {
    nunca: ["pp", "Não se preocupe: você ganha um presente especial neste Natal", "Feito para quem está aprendendo a bordar."],
    jeito: ["pp", "Não se preocupe: você ganha um presente especial neste Natal", "Feito para quem acha que não leva jeito: começa do zero."],
    material: ["cx", "Fica tranquila: o material certo vem explicado", "Você sabe exatamente o que comprar, sem gastar à toa."],
    tempo: ["sn", "Presente pra quem tem pouco tempo", "Um plano de 7 dias para o Natal não chegar antes de você."],
    perco: ["pp", "Esse presente é pra você não se perder mais", "Os 6 pontos básicos explicados, um por um."],
    comeco: ["pp", "Não sabe por onde começar? Comece por aqui", "Os 6 pontos básicos explicados, um por um."],
    presente: ["rc", "Um presente para os seus presentes", "Nunca mais fique olhando o cartão em branco."],
    Iniciante: ["pp", "Iniciante? Este presente é seu", "Feito para quem está aprendendo a bordar."],
    "Avançada": ["bb", "Para quem já borda: um presente a mais", "Depois do Natal, continue bordando no Ano-Novo."],
    "10 min por dia": ["sn", "Pouco tempo? Tem um plano pra isso", "Um plano de 7 dias para deixar tudo pronto."],
    "Fins de semana": ["sn", "Pouco tempo? Tem um plano pra isso", "Um plano de 7 dias para deixar tudo pronto."]
  };
  // fala acolhedora para cada resposta ({n} = nome da pessoa)
  var FALA = {
    nunca: "Que bom que você chegou até aqui, {n}! Todo mundo começa do zero, e o primeiro ponto é sempre o mais especial. Aqui você aprende no seu ritmo, sem pressa.",
    tentei: "{n}, já ter tentado é meio caminho andado! Você já sabe como é segurar a agulha. Agora só falta o molde certo pra seguir.",
    bordo: "Que delícia, {n}! Quem ama bordar sabe: cada ponto é um momento só nosso. E o Natal é a época perfeita pra isso.",
    jeito: "{n}, quase todo mundo pensa isso antes de começar. Mas jeito a gente pega fazendo, e no papel os pontinhos mostram o caminho.",
    feio: "Não se preocupe, {n}, você não é a única! No começo o bordado parece assustador, mas com os pontinhos marcados no molde fica difícil errar. E logo vira um hobby gostoso.",
    material: "Super normal, {n}! Ninguém quer gastar com coisa que nem vai usar. A boa notícia: aqui é só papel, agulha e linha.",
    seguranca: "Você está certíssima em ter cuidado, {n}. Por isso o pagamento é seguro, o acesso chega no seu e-mail e você tem 7 dias de garantia.",
    tempo: "Eu te entendo, {n}: a rotina é corrida mesmo. Mas a gente não pode deixar de lado a vontade de viver momentos especiais, ainda mais no Natal.",
    perco: "Isso acontece com muita gente, {n}! Molde confuso desanima qualquer uma. Aqui cada ponto é um furinho marcado: é só ir de um ao outro.",
    comeco: "{n}, não saber por onde começar é o que mais trava. Por isso você vai ter um caminho claro, do primeiro ponto ao último.",
    consigo: "Que ótimo, {n}! Demorar um pouco é normal, é o seu ritmo. O que importa é o carinho em cada ponto.",
    dificil: "{n}, ter parado porque ficou difícil não é culpa sua: faltou um jeito simples de começar. Desta vez você vai do fácil ao mais elaborado, aos poucos.",
    caro: "Faz todo sentido, {n}. Hobby não pode virar dor de cabeça no bolso. Aqui o material é simples e você imprime os moldes em casa.",
    novidade: "Adoro, {n}! Quem não para quer sempre um molde novo pra se inspirar. E aqui são 250 só para este Natal.",
    "10 min por dia": "{n}, 10 minutinhos por dia já é um ótimo começo! Ponto a ponto, o cartão vai ficando pronto sem você nem perceber. Cuidar de você também é prioridade.",
    "30 min por dia": "Meia hora só pra você, {n}? Perfeito! É aquele momento de desligar a cabeça e fazer algo bonito com as próprias mãos.",
    "1 h ou mais por dia": "Que maravilha, {n}! Com esse tempo dá pra caprichar: guirlandas, presépio e a mesa da ceia inteira.",
    "Fins de semana": "Tudo bem, {n}! A vida é corrida, mas o fim de semana pode virar o seu momento especial. Um projetinho por vez já deixa a casa no clima.",
    presente: "Que lindo, {n}! Presente feito à mão tem um valor que nenhuma loja vende: ele leva o seu carinho em cada ponto.",
    renda: "Boa ideia, {n}! Peças feitas à mão têm um charme especial no fim do ano. E você já começa com 250 moldes prontos.",
    relaxar: "Você merece, {n}. Num mundo tão corrido, bordar é parar, respirar e fazer algo bonito só pra você.",
    decorar: "{n}, imagina sua casa toda decorada com peças feitas por você! Cada elogio vai ter um gostinho especial.",
    Iniciante: "Começar do zero é lindo, {n}! Você vai lembrar do seu primeiro bordado pra sempre.",
    "Básico": "{n}, com o básico você já vai longe! Os moldes te levam ao próximo nível sem complicação.",
    "Avançada": "{n}, você vai se divertir! Com a sua experiência, os 250 moldes viram uma festa de criatividade.",
    muito: "Então vamos juntas, {n}! O Natal está chegando, e dá tempo de deixar tudo pronto com as suas mãos.",
    otimo: "Vai ser ótimo mesmo, {n}! Começar neste Natal pode virar uma tradição nova na sua família.",
    tantofaz: "Tudo bem, {n}, sem pressão! Os moldes ficam com você para bordar quando quiser."
  };
  var NOME_Q = { 0: "{n}, você já bordou alguma vez?", 4: "{n}, quanto tempo você tem por dia?", 7: "{n}, quão importante é começar ainda neste Natal?" };
  var nome = "";
  function N(s) { return esc(s.replace(/\{n\}/g, nome || "você")).replace(/^você,\s*/i, ""); }
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
    body.innerHTML = top() + '<p class="qx-n">Pergunta ' + (i + 1) + " de " + Q.length + "</p><h3>" + (nome && NOME_Q[i] ? N(NOME_Q[i]) : esc(q.q)) + '</h3><div class="qx-area"><div class="qx-opts">' +
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
    var h = '<div class="qx-fb"><p class="qx-gain">+' + o[2] * 10 + " XP · Resposta " + (i + 1) + " de " + Q.length + "!</p>" + (FALA[o[3]] ? '<p class="qx-fala">' + N(FALA[o[3]]) + "</p>" : ""), livre = true;
    var bk = BRESP[o[3]], vistos = ans._b || (ans._b = {});
    if (bk && !vistos[bk[0]]) {
      vistos[bk[0]] = 1; var B = BONUS[bk[0]];
      h += '<p class="qx-t">🎁 ' + esc(bk[1]) + '</p><div class="qx-bonus qx-row"><div class="qx-img qx-capa"><img loading="lazy" decoding="async" src="' + B.img + '" alt="Capa do bônus ' + esc(B.nome) + '"></div><div class="qx-txt"><span class="qx-tag">Bônus ' + B.n + ' de 5 · de presente</span><p class="qx-bn">' + esc(B.nome) + "</p><p class=\"qx-leg\">" + esc(B.sub) + '</p><p class="qx-ben">' + esc(bk[2]) + "</p></div></div>";
      t("QuizBonus", { bonus: B.nome });
    } else if (q.fb === "dep") {
      var d = DEP[q.dep], a = d.av, W = a[0], H = a[1], cx = a[2], cy = a[3], D = a[4];
      var st = "background-image:url(" + d.img + ");background-size:" + (W / D * 100).toFixed(1) + "% auto;background-position:" + ((cx - D / 2) / (W - D) * 100).toFixed(2) + "% " + ((cy - D / 2) / (H - D) * 100).toFixed(2) + "%";
      h += '<p class="qx-intro">' + esc(d.intro.replace(/^Você não é a única\. /, "")) + '</p><div class="qx-dep"><div class="qx-av" role="img" aria-label="Foto de ' + esc(d.nome) + '" style="' + st + '"></div><p class="qx-nome">' + esc(d.nome) +
        (d.cidade ? " <small>· " + esc(d.cidade) + "</small>" : "") + '</p><p class="qx-st" aria-label="5 estrelas">⭐⭐⭐⭐⭐</p><blockquote>“' + esc(d.frase) + "”</blockquote></div>";
      livre = false;
    } else if (q.fb === "img") {
      var f = FB_IMG[o[3]];
      h += '<p class="qx-t">' + esc(f[0]) + '</p><div class="qx-row qx-bonus"><div class="qx-img">' + img(f[1]) + '</div><div class="qx-txt"><p class="qx-ben">' + esc(f[2]) + '</p><p class="qx-leg">' + esc(LEG[f[1]]) + (f[1] === "mk" ? "" : " · um dos temas dos 250 moldes") + "</p></div></div>";
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

  function plano() {
    var a = function (k) { return ans[k] ? ans[k].v : ""; }, passos = [];
    var ini = a("nivel") === "Iniciante" || /nunca|jeito/.test(a("exp")) || /perco|comeco/.test(a("molde")) || a("parou") === "dificil";
    if (ini) passos.push(["pp", "Comece pelo <b>Primeiros Pontos</b>: aprenda os 6 pontos básicos antes do primeiro molde."]);
    else if (a("medo") === "material" || a("parou") === "caro") passos.push(["cx", "Comece pela <b>Caixinha do Natal</b>: separe só o material certo, sem gastar à toa."]);
    else passos.push(["", "Comece pelo tema que você mais gosta: são 250 moldes em 4 categorias."]);
    if (passos[0][0] !== "cx") passos.push(["cx", "Confira a <b>Caixinha do Natal</b>: o guia dos materiais para começar."]);
    var ritmo = { "10 min por dia": "10 minutinhos por dia: um cartão ou etiqueta de cada vez.", "30 min por dia": "Meia hora por dia: um molde de cada vez, no seu ritmo.", "1 h ou mais por dia": "Uma hora ou mais: dá para ir das etiquetas às guirlandas e ao presépio.", "Fins de semana": "Nos fins de semana: separe um projeto por sábado ou domingo." };
    passos.push(["", "<b>Seu ritmo:</b> " + esc(ritmo[a("tempo")] || "um molde de cada vez.")]);
    var obj = { presente: ["rc", "<b>Seu objetivo: presentear.</b> Use os <b>50 Recadinhos de Natal</b> nos cartões."], renda: ["", "<b>Seu objetivo: renda extra.</b> Comece pelas peças pequenas: cartões, etiquetas e enfeites."], relaxar: ["", "<b>Seu objetivo: relaxar.</b> Faça do bordado o seu momento, longe do celular."], decorar: ["", "<b>Seu objetivo: decorar.</b> Comece pela árvore e termine na mesa da ceia."] }[a("obj")];
    if (obj) passos.push(obj);
    passos.push(["sn", a("natal") === "muito" ? "Siga a <b>Semana do Natal</b>: o plano de 7 dias para deixar tudo pronto até a ceia." : "Quando quiser, use a <b>Semana do Natal</b>: um plano de 7 dias, sem correria."]);
    var fim = { dificil: "Desta vez é diferente: é só seguir os pontinhos do molde.", tempo: "Sem pressão: um molde de cada vez.", caro: "Material simples: só papel, agulha e linha.", novidade: "Depois do dia 25, continue com o <b>Brinde Bordado</b>: 20 moldes de Ano-Novo." }[a("parou")];
    if (fim) passos.push([a("parou") === "novidade" ? "bb" : "", fim]);
    return '<div class="qx-plano"><p class="qx-pt">📋 ' + (nome ? 'Plano da ' + esc(nome) : 'Seu plano personalizado') + '</p><ol>' + passos.map(function (p) {
      return "<li>" + (p[0] ? '<img loading="lazy" src="' + BONUS[p[0]].img + '" alt="">' : "<span></span>") + "<p>" + p[1] + "</p></li>"; }).join("") + "</ol></div>";
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
      '<p class="qx-tit">' + (nome ? esc(nome) + ', o' : 'O') + ' Ateliê de Natal é para você!</p><div class="qx-placar"><div><b>' + xp + '</b><small>XP total</small></div><div><b>8/8</b><small>respostas</small></div><div><b>' + esc(ans.nivel.v) + "</b><small>seu nível</small></div></div>" +
      '<div class="qx-grade">' + grade.map(function (k) { return img(k); }).join("") + '</div><p class="qx-mais">…e os 250 moldes + 5 bônus esperando por você</p>' +
      '<div class="qx-chips"><span>' + esc(ans.obj.txt.replace(/^Para /, "")) + "</span><span>" + esc(ans.tempo.v) + "</span></div>" +
      plano() +
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

  function telaNome() {
    body.innerHTML = '<div class="qx-nomeb"><div class="qx-emo">🎄</div><p class="qx-n">Teste rápido · 8 perguntas</p><h3>Antes de começar…<br>como posso te chamar?</h3>' +
      '<form class="qx-form"><input type="text" class="qx-in" maxlength="24" autocomplete="given-name" autocapitalize="words" placeholder="Seu primeiro nome" aria-label="Seu primeiro nome">' +
      '<button type="submit" class="btn btn-primary btn-xl qx-start" disabled>Começar meu teste →</button></form><p class="qx-nota">Usamos seu nome só aqui no teste.</p></div>';
    var inp = body.querySelector(".qx-in"), go = body.querySelector(".qx-start");
    inp.oninput = function () { go.disabled = inp.value.trim().length < 2; };
    body.querySelector(".qx-form").onsubmit = function (e) {
      e.preventDefault(); var v = inp.value.trim().split(/\s+/)[0] || ""; if (v.length < 2) return;
      nome = v.charAt(0).toUpperCase() + v.slice(1).toLowerCase(); inp.blur(); pergunta();
    };
    setTimeout(function () { try { inp.focus({ preventScroll: true }); } catch (x) {} }, 250);
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
    stopAll(); ans = {}; xp = 0; i = 0; nome = "";
    el.hidden = false; document.documentElement.style.overflow = document.body.style.overflow = "hidden";
    t("QuizInicio"); telaNome();
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
