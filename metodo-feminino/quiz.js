(function () {
  var R = window.ROTEIRO, C = window.CONFIG;
  var app = document.getElementById("app");
  var barra = document.getElementById("barra"), fill = document.getElementById("barra-fill");
  var btnVoltar = document.getElementById("voltar");
  var fbBox = document.getElementById("feedback"), fbTxt = document.getElementById("feedback-texto");

  var estado = { i: 0, nome: "", resp: {}, hist: [] };
  var totalPerguntas = R.filter(function (s) { return /unica|multipla|nome|numero/.test(s.tipo); }).length;

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
    for (var k = 0; k < estado.i; k++) if (/unica|multipla|nome|numero/.test(R[k].tipo)) feitas++;
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
          var foto = d.foto ? '<img src="' + d.foto + '" alt="' + esc(d.quem) + '" width="64" height="64" loading="lazy">' : window.Ilustra("busto");
          return '<div class="depo"><div class="depo-foto">' + foto + '</div><div><p class="quem"><b>' + d.quem + "</b>" + (d.data ? " · " + d.data : "") + "</p><p>“" + d.texto + "”</p></div></div>";
        }).join("") + '</div><button class="btn" data-ac="ok">' + s.botao + "</button></section>";
    },
    numero: function (s) {
      var v = estado.resp[s.chave] || "";
      return '<section class="tela"><h2>' + txt(s.titulo) + '</h2>' + (s.sub ? '<p class="sub">' + s.sub + "</p>" : '<hr class="fio">') +
        '<div class="campo-num"><input class="campo" id="num" type="number" inputmode="numeric" min="' + s.min + '" max="' + s.max + '" placeholder="' + s.placeholder + '" value="' + v + '"><span>' + s.unidade + "</span></div>" +
        '<button class="btn" data-ac="num-ok" id="btn-num"' + (valido(s, v) ? "" : " disabled") + ">Continuar</button></section>";
    },
    carregando: function (s) {
      var p = s.pausa;
      return '<section class="tela carregando-vsl"><h2 id="vsl-titulo">' + txt(s.titulo) + "</h2>" +
        '<div class="vsl" id="vsl"><video id="vsl-video" src="' + s.video + '" poster="' + s.poster + '" playsinline preload="auto"></video>' +
        '<button class="vsl-som" id="vsl-som" hidden>🔊 Toque para ativar o som</button>' +
        '<div class="vsl-pausa" id="vsl-pausa" hidden><div class="pausa-card">' +
          '<button class="pausa-x" data-ac="vsl-continuar" aria-label="Fechar">✕</button>' +
          '<div class="pausa-icone"><svg viewBox="0 0 40 40" width="40" height="40" fill="none" stroke="#f3dca8" stroke-width="2.2" stroke-linecap="round"><path d="M11 6h18M11 34h18M13 6c0 9 14 10 14 14S13 25 13 34M27 6c0 9-14 10-14 14s14 5 14 14"/><path d="M15 31c2-3 8-3 10 0z" fill="#e8c98d" stroke="none"/></svg></div>' +
          '<p class="pausa-marca">Método Feminino</p><hr class="fio">' +
          '<p class="pausa-titulo">' + p.titulo + '</p><p class="pausa-texto">' + p.texto + "</p>" +
          '<button class="btn btn-vinho" data-ac="vsl-continuar">' + p.botao + "</button>" +
        "</div></div></div>" +
        '<div class="diag-barra"><span id="vsl-fill"></span></div>' +
        '<p class="diag-etapa"><span id="vsl-pct">0%</span> · <span id="vsl-etapa">' + s.etapas[0] + "</span></p>" +
        '<button class="btn btn-ouro vsl-cta" id="vsl-cta" data-ac="ok" hidden>' + s.botao + "</button></section>";
    },
    resultado: function () { return resultado(); }
  };

  /* ---------- Resultado personalizado ---------- */
  var nomesPeca = { vestido: "o vestido de alça", regata: "a regata", biquini: "o biquíni", blusa: "a blusa de manga curta" };
  var datas = { reveillon: ["Réveillon", 12, 31], carnaval: ["Carnaval", 2, 6] };

  function valido(s, v) { v = +v; return v >= s.min && v <= s.max; }

  function imcInfo(r) {
    var a = +r.altura / 100, p = +r.peso;
    if (!a || !p) return null;
    var v = p / (a * a);
    var faixa = v < 18.5 ? ["Abaixo do ideal", "#c9a24b"] : v < 25 ? ["Faixa saudável", "#6f9a62"] : v < 30 ? ["Acima do ideal", "#d08a3c"] : ["Bem acima do ideal", "#c45a5a"];
    var dica = v < 25
      ? "No seu caso, a flacidez vem mais do <strong>músculo dormindo</strong> do que de gordura. O treino tem efeito direto no contorno do braço."
      : "No seu caso, a flacidez é uma soma de <strong>músculo dormindo + gordura</strong>. Por isso o plano combina o treino com o <strong>cardápio simples</strong> (bônus), para um déficit calórico leve.";
    return { v: v, txt: v.toFixed(1).replace(".", ","), faixa: faixa, dica: dica, pos: Math.max(2, Math.min(98, (v - 15) / 25 * 100)) };
  }
  var ROTINA = { sedentaria: "Sedentária", leve: "Leve", moderada: "Moderada", ativa: "Ativa" };
  var SONO = { pouco: "Menos de 6h", medio: "6 a 7h", bom: "8h ou mais" };

  function fmt(d) { return ("0" + d.getDate()).slice(-2) + "/" + ("0" + (d.getMonth() + 1)).slice(-2); }

  function resultado() {
    var r = estado.resp;
    var pontos = ({ "-35": 0, "35": 1, "45": 2, "55": 3 }[r.idade] || 1) + (+r.tentativas || 0) + (r.incomodo === "tudo" ? 1 : 0) +
      ({ sedentaria: 2, leve: 1, moderada: 0, ativa: -1 }[r.rotina] || 0) + (r.sono === "pouco" ? 1 : 0);
    var nivel = pontos <= 2 ? ["leve", 38] : pontos <= 5 ? ["moderado", 64] : ["profundo", 86];
    var imc = imcInfo(r);
    var leve = r.ombro && r.ombro !== "nao";

    var plano = [
      "Começar pela Fase 1 (Acordar): 10 minutos por dia" + (leve ? ", na <strong>versão leve</strong> para proteger seu ombro" : ", sem peso") + ".",
      r.rotina === "sedentaria" || r.rotina === "leve" ? "Como sua rotina é mais parada, a Fase 1 começa com <strong>menos repetições e mais descanso</strong>, e sobe aos poucos." : "Como você já se movimenta, a Fase 1 pode ter <strong>ritmo um pouco mais forte</strong> desde o início.",
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
      (imc ? '<div class="ficha"><h3>Seu diagnóstico técnico</h3>' +
        '<div class="ficha-grade"><div><span>Altura</span><b>' + esc(r.altura) + ' cm</b></div><div><span>Peso</span><b>' + esc(r.peso) + ' kg</b></div>' +
        '<div><span>Rotina</span><b>' + (ROTINA[r.rotina] || "-") + '</b></div><div><span>Sono</span><b>' + (SONO[r.sono] || "-") + "</b></div></div>" +
        '<div class="imc"><div class="imc-topo"><span>Seu IMC</span><b>' + imc.txt + '</b><em style="color:' + imc.faixa[1] + '">' + imc.faixa[0] + "</em></div>" +
        '<div class="imc-escala"><i style="left:' + imc.pos + '%"></i></div><div class="imc-legenda"><span>18,5</span><span>25</span><span>30</span></div></div>' +
        '<p class="ficha-dica">' + imc.dica + '</p><p class="ficha-obs">O IMC é uma referência geral da OMS e não substitui avaliação médica.</p></div>' : "") +
      '<div class="foto"><img src="assets/foto-resultado.webp" alt="Mulher confiante de regata na sala" width="1448" height="1086"></div>' +
      '<div class="plano"><h3>Seu plano de 21 dias</h3><ul>' + plano.map(function (p) { return "<li>" + p + "</li>"; }).join("") + "</ul></div>" +
      '<div class="data-alvo">' + dataTxt + "</div>" +
      '<div class="oferta"><p class="sobre">Método Feminino · 21 dias</p><h3>O método de bastidor, adaptado para você</h3><ul>' +
      "<li>21 dias de treino guiado, de 10 a 20 min por dia</li><li>Vídeo-aula animada de cada exercício</li><li>Versão leve de todos os movimentos</li>" +
      "<li>Bônus: Teste do Tchauzinho</li><li>Bônus: Calendário imprimível</li><li>Bônus: Guia Firme sem ficar bombada</li><li>Bônus: Cardápio simples</li></ul>" +
      '<p class="preco-de">De ' + C.precoDe + '</p><p class="preco"><small>R$</small> ' + C.preco + '</p><p class="nota">pagamento único · acesso imediato</p><p class="vagas-aviso">⏳ Vagas limitadas nesta turma</p>' +
      '<a class="btn btn-ouro" id="cta" href="' + C.checkout + '">Quero minha vaga</a>' +
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
    if (s.tipo === "numero") {
      var n = document.getElementById("num"), bn = document.getElementById("btn-num");
      n.addEventListener("input", function () { bn.disabled = !valido(s, n.value); });
      n.addEventListener("keydown", function (e) { if (e.key === "Enter" && !bn.disabled) bn.click(); });
      setTimeout(function () { n.focus(); }, 300);
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

  /* Carregamento com a micro VSL: o diagnóstico acompanha o tempo do vídeo
     e só termina no segundo "ctaEm", quando aparece o botão. Pausou → pop-up. */
  var vslAtual = null;
  function carregar(s) {
    var v = document.getElementById("vsl-video"), som = document.getElementById("vsl-som");
    var pausa = document.getElementById("vsl-pausa"), cta = document.getElementById("vsl-cta");
    var fill = document.getElementById("vsl-fill"), pct = document.getElementById("vsl-pct"), etapa = document.getElementById("vsl-etapa");
    var titulo = document.getElementById("vsl-titulo");
    var pronto = false, falhou = false, t0 = Date.now();
    vslAtual = v;

    function tempo() { return falhou ? (Date.now() - t0) / 1000 : v.currentTime; }
    (function tick() {
      if (!document.body.contains(v)) return;
      var k = Math.min(1, tempo() / s.ctaEm);
      var e = 1 - Math.pow(1 - k, 1.6);
      fill.style.width = (e * 100) + "%";
      pct.textContent = Math.round(e * 100) + "%";
      etapa.textContent = s.etapas[Math.min(s.etapas.length - 1, Math.floor(k * s.etapas.length))];
      if (k >= 1 && !pronto) {
        pronto = true;
        etapa.textContent = "Diagnóstico concluído ✓";
        titulo.innerHTML = txt("{nome}, seu diagnóstico está pronto!");
        cta.hidden = false;
        track("QuizDiagnosticoPronto");
        setTimeout(function () { cta.scrollIntoView({ behavior: "smooth", block: "center" }); }, 200);
      }
      requestAnimationFrame(tick);
    })();

    v.addEventListener("pause", function () { if (!v.ended && document.body.contains(v)) pausa.hidden = false; });
    v.addEventListener("play", function () { pausa.hidden = true; });
    v.addEventListener("error", function () { falhou = true; });
    v.addEventListener("click", function () {
      if (v.muted) { v.muted = false; som.hidden = true; v.play(); } else v.pause();
    });

    // tenta tocar com som; se o navegador bloquear, toca mudo e mostra o botão de som
    v.muted = false;
    var tentativa = v.play();
    if (tentativa && tentativa.catch) tentativa.catch(function () {
      v.muted = true; som.hidden = false;
      v.play().catch(function () { som.hidden = false; });
    });
    som.addEventListener("click", function () { v.muted = false; som.hidden = true; v.play(); });
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
    else if (ac === "num-ok") { estado.resp[s.chave] = String(Math.round(+document.getElementById("num").value)); talvezFeedback(s); }
    else if (ac === "vsl-continuar" && vslAtual) vslAtual.play();
  });

  render();
})();
