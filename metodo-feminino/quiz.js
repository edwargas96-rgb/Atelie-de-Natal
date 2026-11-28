(function () {
  var R = window.ROTEIRO, C = window.CONFIG;
  var app = document.getElementById("app");
  var barra = document.getElementById("barra"), fill = document.getElementById("barra-fill");
  var btnVoltar = document.getElementById("voltar");
  var fbBox = document.getElementById("feedback"), fbTxt = document.getElementById("feedback-texto");

  var estado = { i: 0, nome: "", resp: {}, hist: [] };
  var totalPerguntas = R.filter(function (s) { return s.tipo === "unica" || s.tipo === "multipla" || s.tipo === "nome"; }).length;

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function txt(s) {
    var n = esc(estado.nome || "");
    s = s || "";
    if (!n) s = s.replace(/,?\s*\{nome\}[,:]?\s*/g, function (m) { return m.trim().endsWith(":") ? ": " : " "; }).replace(/^\s+/, "");
    s = s.replace(/\{nome\}/g, n);
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  // Ganchos de rastreamento (Pixel do Meta, se estiver instalado)
  function track(ev, dados) {
    try { if (window.fbq) window.fbq("trackCustom", ev, dados || {}); } catch (e) {}
  }

  function slotImagem(s) {
    if (s.foto) return '<div class="foto"><img src="' + s.foto + '" alt="' + esc(s.fotoAlt || "") + '" width="1448" height="1086" fetchpriority="high"></div>';
    if (!s.img) return "";
    return '<div class="img-slot">' + window.Ilustra(s.img) + '<span class="etiqueta">' + esc(s.imgDesc || "IMAGEM") + "</span></div>";
  }

  function progresso() {
    var feitas = 0;
    for (var k = 0; k < estado.i; k++) if (/unica|multipla|nome/.test(R[k].tipo)) feitas++;
    var s = R[estado.i];
    var mostra = s.tipo !== "intro" && s.tipo !== "resultado" && s.tipo !== "carregando";
    barra.hidden = !mostra;
    btnVoltar.hidden = !mostra || estado.hist.length === 0;
    fill.style.width = Math.min(100, Math.round((feitas / totalPerguntas) * 100)) + "%";
  }

  function ir(prox, salvarHist) {
    if (salvarHist !== false) estado.hist.push(estado.i);
    estado.i = prox;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function avancar() { ir(estado.i + 1); }

  function mostrarFeedback(texto, depois) {
    fbTxt.innerHTML = txt(texto);
    fbBox.hidden = false;
    setTimeout(function () { fbBox.hidden = true; depois(); }, 2100);
  }
  function talvezFeedback(s, valor) {
    var t = s.fb;
    if (t && typeof t === "object") t = t[valor];
    if (t && (s.fbSempre || Math.random() < C.chanceFeedback)) mostrarFeedback(t, avancar);
    else avancar();
  }

  btnVoltar.addEventListener("click", function () {
    if (!estado.hist.length) return;
    ir(estado.hist.pop(), false);
  });

  /* ---------- Telas ---------- */
  var telas = {
    intro: function (s) {
      return '<section class="tela capa"><h1>' + s.titulo + "</h1>" + slotImagem(s) +
        (s.bullets ? '<ul class="bullets">' + s.bullets.map(function (b) { return "<li>" + b + "</li>"; }).join("") + "</ul>" : "") +
        '<button class="btn" data-ac="ok">' + s.botao + '</button><p class="nota">' + s.nota + "</p></section>";
    },
    nome: function (s) {
      return '<section class="tela"><h2>' + s.titulo + '</h2><hr class="fio"><input class="campo" id="nome" autocomplete="given-name" maxlength="24" placeholder="' + s.placeholder + '" value="' + esc(estado.nome) + '">' +
        '<button class="btn" data-ac="nome" id="btn-nome"' + (estado.nome ? "" : " disabled") + ">" + s.botao + "</button></section>";
    },
    unica: function (s) {
      var atual = estado.resp[s.chave];
      return '<section class="tela"><h2>' + txt(s.titulo) + "</h2>" + (s.sub ? '<p class="sub">' + s.sub + "</p>" : "") + slotImagem(s) +
        '<div class="opcoes">' + s.opcoes.map(function (o) {
          return '<button class="opcao' + (atual === o.v ? " on" : "") + '" data-ac="unica" data-v="' + o.v + '">' + (o.e ? '<span class="emoji">' + o.e + "</span>" : "") + "<span>" + o.t + '</span><span class="marcador"></span></button>';
        }).join("") + "</div></section>";
    },
    multipla: function (s) {
      var sel = estado.resp[s.chave] || [];
      return '<section class="tela"><h2>' + txt(s.titulo) + "</h2>" + (s.sub ? '<p class="sub">' + s.sub + "</p>" : "") +
        '<div class="opcoes">' + s.opcoes.map(function (o) {
          return '<button class="opcao multi' + (sel.indexOf(o.v) > -1 ? " on" : "") + '" data-ac="multi" data-v="' + o.v + '"><span>' + o.t + '</span><span class="marcador"></span></button>';
        }).join("") + '</div><button class="btn" data-ac="multi-ok"' + (sel.length ? "" : " disabled") + ">Continuar</button></section>";
    },
    info: function (s) {
      return '<section class="tela">' + (s.sobre ? '<p class="sobre">' + s.sobre + "</p>" : "") + "<h2>" + txt(s.titulo) + "</h2>" + slotImagem(s) +
        '<div class="info-card">' + (s.lista ? '<ul class="lista-x">' + s.lista.map(function (l) { return "<li>" + l + "</li>"; }).join("") + "</ul>" : "") +
        (s.texto ? "<p>" + txt(s.texto) + "</p>" : "") + '</div><button class="btn" data-ac="ok">' + s.botao + "</button></section>";
    },
    video: function (s) {
      return '<section class="tela"><p class="sobre">' + s.sobre + "</p><h2>" + txt(s.titulo) + "</h2>" + (s.sub ? '<p class="sub">' + s.sub + "</p>" : "") +
        (s.src ? '<div class="video real"><div class="video-tela"><video src="' + s.src + '" poster="' + (s.poster || "") + '" autoplay muted loop playsinline preload="auto"></video></div></div>' :
        '<div class="video" id="video"><div class="video-tela">' + window.Ilustra(s.anim) +
        '<span class="video-tag">Aula</span><span class="video-rotulo">' + esc(s.rotulo) + '</span><span class="video-barra"></span></div>' +
        '<button class="video-play" data-ac="play" aria-label="Assistir">▶</button></div>') +
        '<button class="btn" data-ac="ok">' + s.botao + "</button></section>";
    },
    depoimentos: function (s) {
      return '<section class="tela"><p class="sobre">' + s.sobre + "</p><h2>" + s.titulo + '</h2><div class="depos">' +
        s.itens.map(function (d) {
          return '<div class="depo"><div class="foto">' + window.Ilustra("busto") + '</div><div><span class="depo-slot">Foto + depoimento</span><div class="estrelas">★★★★★</div><p>“' + d.texto + '”</p><p class="quem">' + d.quem + "</p></div></div>";
        }).join("") + '</div><button class="btn" data-ac="ok">' + s.botao + "</button></section>";
    },
    carregando: function (s) {
      return '<section class="tela carregando"><h2>' + txt(s.titulo) + '</h2><div class="anel"><svg width="120" height="120"><circle cx="60" cy="60" r="52" stroke="#e3d5c6" stroke-width="6" fill="none"/>' +
        '<circle id="arco" cx="60" cy="60" r="52" stroke="#b08d57" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="327" stroke-dashoffset="327"/></svg><span class="pct" id="pct">0%</span></div>' +
        '<ul class="etapas">' + s.etapas.map(function (e) { return "<li>" + e + "</li>"; }).join("") + "</ul></section>";
    },
    resultado: function () { return resultado(); }
  };

  /* ---------- Resultado personalizado ---------- */
  var nomesPeca = { vestido: "o vestido de alça", regata: "a regata", biquini: "o biquíni", blusa: "a blusa de manga curta" };
  var datas = { reveillon: ["Réveillon", 12, 31], carnaval: ["Carnaval", 2, 6] };

  function fmt(d) { return ("0" + d.getDate()).slice(-2) + "/" + ("0" + (d.getMonth() + 1)).slice(-2); }

  function resultado() {
    var r = estado.resp;
    var pontos = ({ "-35": 0, "35": 1, "45": 2, "55": 3 }[r.idade] || 1) + (+r.tentativas || 0) + (r.incomodo === "tudo" ? 1 : 0);
    var nivel = pontos <= 2 ? ["leve", 38] : pontos <= 4 ? ["moderado", 64] : ["profundo", 86];
    var leve = r.ombro && r.ombro !== "nao";

    var plano = [
      "Começar pela Fase 1 (Acordar): 10 minutos por dia" + (leve ? ", na <strong>versão leve</strong> para proteger seu ombro" : ", sem peso") + ".",
      "Entrar com a garrafinha d'água só na Fase 2, quando o músculo já estiver acordado.",
      r.bombada === "nao" ? "Combinações da Fase 3 para desenhar o contorno do braço." : "Movimentos de resistência leve: firmam <strong>sem deixar bombada</strong>.",
      "Seu objetivo: usar " + (nomesPeca[r.peca] || "a roupa que você quiser") + " sem pensar no braço."
    ];

    var hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    var fim = new Date(hoje); fim.setDate(fim.getDate() + 20);
    var dataTxt = "Se começar hoje, seu <strong>Dia 21 cai em " + fmt(fim) + "</strong>.";
    var alvo = datas[r.data];
    if (alvo) {
      var ev = new Date(hoje.getFullYear(), alvo[1] - 1, alvo[2]);
      if (ev < hoje) ev.setFullYear(ev.getFullYear() + 1);
      var folga = Math.round((ev - fim) / 864e5);
      dataTxt += folga >= 0 ? " Isso é <strong>" + folga + " dias antes do " + alvo[0] + "</strong>." : " Comece agora para chegar o mais firme possível no " + alvo[0] + ".";
    }

    var nome = esc(estado.nome);
    return '<section class="tela"><p class="sobre">Seu resultado</p><h2>' + nome + ", o seu tríceps está <em>adormecido</em></h2>" +
      '<p class="sub">Não é só gordura e não é falta de esforço. É um músculo que ninguém te ensinou a acordar.</p>' +
      '<div class="diag"><span class="rotulo">Nível de adormecimento</span><div class="nivel">' + nivel[0].charAt(0).toUpperCase() + nivel[0].slice(1) + '</div>' +
      '<div class="medidor"><span style="width:' + nivel[1] + '%"></span></div><div class="medidor-legenda"><span>Leve</span><span>Moderado</span><span>Profundo</span></div></div>' +
      '<div class="img-slot">' + window.Ilustra("confiante") + '<span class="etiqueta">IMAGEM: mulher 40+ confiante, sem manga, braço firme (antes/depois ilustrativo, sem promessa).</span></div>' +
      '<div class="plano"><h3>Seu plano de 21 dias</h3><ul>' + plano.map(function (p) { return "<li>" + p + "</li>"; }).join("") + "</ul></div>" +
      '<div class="data-alvo">' + dataTxt + "</div>" +
      '<div class="oferta"><p class="sobre">Método Feminino · 21 dias</p><h3>O método de bastidor, adaptado para você</h3><ul>' +
      "<li>21 dias de treino guiado, de 10 a 20 min por dia</li><li>Vídeo-aula animada de cada exercício</li><li>Versão leve de todos os movimentos</li>" +
      "<li>Bônus: Teste do Tchauzinho</li><li>Bônus: Calendário imprimível</li><li>Bônus: Guia Firme sem ficar bombada</li><li>Bônus: Cardápio simples</li></ul>" +
      '<p class="preco-de">De ' + C.precoDe + '</p><p class="preco"><small>R$</small> ' + C.preco + '</p><p class="nota">pagamento único · acesso imediato</p>' +
      '<a class="btn btn-ouro" id="cta" href="' + C.checkout + '">Quero começar hoje</a>' +
      '<p class="garantia"><span class="pendente">Pendente</span> Texto da garantia</p></div>' +
      "</section>";
  }

  /* ---------- Render ---------- */
  function render() {
    var s = R[estado.i];
    app.innerHTML = telas[s.tipo](s);
    progresso();
    track("QuizEtapa", { etapa: estado.i, tipo: s.tipo });

    if (s.tipo === "nome") {
      var inp = document.getElementById("nome"), b = document.getElementById("btn-nome");
      inp.addEventListener("input", function () { b.disabled = !inp.value.trim(); });
      inp.addEventListener("keydown", function (e) { if (e.key === "Enter" && inp.value.trim()) b.click(); });
      setTimeout(function () { inp.focus(); }, 300);
    }
    if (s.tipo === "carregando") carregar(s);
    if (s.tipo === "resultado") {
      track("QuizResultado", estado.resp);
      var cta = document.getElementById("cta");
      cta.addEventListener("click", function () { track("InitiateCheckout"); });
      // repassa UTMs da página para o checkout
      if (location.search && C.checkout.indexOf("http") === 0) cta.href = C.checkout + (C.checkout.indexOf("?") > -1 ? "&" : "?") + location.search.slice(1);
    }
  }

  function carregar(s) {
    var arco = document.getElementById("arco"), pct = document.getElementById("pct");
    var itens = app.querySelectorAll(".etapas li"), t0 = Date.now();
    (function passo() {
      var p = Math.min(1, (Date.now() - t0) / s.duracao);
      var e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      arco.setAttribute("stroke-dashoffset", 327 * (1 - e));
      pct.textContent = Math.round(e * 100) + "%";
      for (var k = 0; k < itens.length; k++) if (e >= (k + 1) / (itens.length + .3)) itens[k].classList.add("ok");
      if (p < 1) requestAnimationFrame(passo); else setTimeout(avancar, 600);
    })();
  }

  app.addEventListener("click", function (ev) {
    var el = ev.target.closest("[data-ac]");
    if (!el) return;
    var s = R[estado.i], ac = el.dataset.ac;
    if (ac === "ok") avancar();
    else if (ac === "nome") { estado.nome = document.getElementById("nome").value.trim().split(" ")[0]; avancar(); }
    else if (ac === "unica") {
      estado.resp[s.chave] = el.dataset.v;
      app.querySelectorAll(".opcao").forEach(function (o) { o.classList.toggle("on", o === el); });
      setTimeout(function () { talvezFeedback(s, el.dataset.v); }, 280);
    }
    else if (ac === "multi") {
      var sel = estado.resp[s.chave] = estado.resp[s.chave] || [], v = el.dataset.v, k = sel.indexOf(v);
      if (k > -1) sel.splice(k, 1); else sel.push(v);
      el.classList.toggle("on");
      app.querySelector('[data-ac="multi-ok"]').disabled = !sel.length;
    }
    else if (ac === "multi-ok") talvezFeedback(s);
    else if (ac === "play") document.getElementById("video").classList.add("tocando");
  });

  render();
})();
