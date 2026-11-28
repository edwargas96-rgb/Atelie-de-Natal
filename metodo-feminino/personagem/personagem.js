/* Personagem do Método Feminino — boneca 2D em SVG, articulada e animada em código.
   Coordenadas no quadro 1024x1536 (referência do JSON da personagem).

   Uso:
     var p = Personagem.criar(elemento);
     p.pose("repouso" | "acenar" | "extensao" | "coice" | "comemorar");
     p.expressao("feliz" | "sorrisao" | "piscadinha" | "esforco" | "orgulho");
     p.destacar(true|false);   // brilho no tríceps
*/
(function () {
  var NS = "http://www.w3.org/2000/svg";
  var C = {
    pele: "#E8A066", peleSombra: "#D68A52", peleLuz: "#F0B47E",
    cabelo: "#5A2E22", cabeloLuz: "#74402F",
    top: "#E6939B", topSombra: "#D67F88",
    legging: "#82323F", leggingSombra: "#6E2A35",
    tenis: "#F4E3CF", sola: "#DCC3A3",
    olho: "#3A2118", boca: "#C8505A", vinco: "#C98A5C", bochecha: "#EE8F84",
    destaque: "#E0405E"
  };

  // Pivôs e comprimentos derivados do JSON
  var BR = { // braço direito da personagem (lado esquerdo de quem olha)
    ombro: [388, 433], u: 174, f: 207, base: { u: 122.3, f: 2.1, m: 0 }
  };
  var BL = { // braço esquerdo da personagem (lado direito de quem olha)
    ombro: [631, 433], u: 177, f: 203, base: { u: 56.3, f: 1.0, m: 0 }
  };

  function capsula(L, w1, w2) {
    var a = w1 / 2, b = w2 / 2;
    return "M0," + (-a) + " L" + L + "," + (-b) + " A" + b + "," + b + " 0 0 1 " + L + "," + b +
      " L0," + a + " A" + a + "," + a + " 0 0 1 0," + (-a) + "Z";
  }

  function defs() {
    return '<defs>' +
      grad("gPele", C.peleLuz, C.pele, C.peleSombra) +
      grad("gTop", "#EEA6AD", C.top, C.topSombra) +
      grad("gLeg", "#93404D", C.legging, C.leggingSombra) +
      grad("gCab", C.cabeloLuz, C.cabelo, "#48241A") +
      grad("gTenis", "#FFF6EA", C.tenis, "#E8D2B8") +
      '<radialGradient id="gCinza"><stop offset="0" stop-color="#7d8a99" stop-opacity=".9"/><stop offset=".6" stop-color="#7d8a99" stop-opacity=".6"/><stop offset="1" stop-color="#7d8a99" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="gBrilho"><stop offset="0" stop-color="' + C.destaque + '" stop-opacity="1"/><stop offset=".6" stop-color="' + C.destaque + '" stop-opacity=".75"/><stop offset="1" stop-color="' + C.destaque + '" stop-opacity="0"/></radialGradient>' +
      // granulado leve de "massinha"
      '<filter id="massinha" x="-5%" y="-5%" width="110%" height="110%">' +
      '<feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="3" result="r"/>' +
      '<feColorMatrix in="r" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .06 0" result="g"/>' +
      '<feComposite in="g" in2="SourceGraphic" operator="in" result="gg"/>' +
      '<feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="gg"/></feMerge></filter>' +
      '</defs>';
  }
  function grad(id, a, b, c) {
    return '<linearGradient id="' + id + '" x1="0" y1="0" x2=".35" y2="1"><stop offset="0" stop-color="' + a + '"/><stop offset=".45" stop-color="' + b + '"/><stop offset="1" stop-color="' + c + '"/></linearGradient>';
  }

  function braco(id, B, espelho) {
    var s = espelho ? -1 : 1; // polegar sempre para "frente"
    return '<g id="' + id + '" filter="url(#massinha)">' +
      '<g class="seg-u">' +
        '<path d="' + capsula(B.u, 100, 80) + '" fill="url(#gPele)"/>' +
        '<ellipse class="triceps" cx="' + (B.u * .55) + '" cy="0" rx="' + (B.u * .42) + '" ry="42" fill="url(#gBrilho)" opacity="0" style="mix-blend-mode:multiply"/>' +
        '<g class="seg-f" transform="translate(' + B.u + ',0)">' +
          '<circle r="40" fill="' + C.pele + '"/>' +
          '<path d="' + capsula(B.f, 78, 60) + '" fill="url(#gPele)"/>' +
          '<path d="M-6,-30 Q4,0 -6,30" fill="none" stroke="' + C.peleSombra + '" stroke-width="5" stroke-linecap="round" opacity=".55"/>' +
          '<g class="seg-m" transform="translate(' + B.f + ',0)">' +
            '<ellipse cx="50" cy="0" rx="60" ry="44" fill="url(#gPele)"/>' +
            '<ellipse cx="34" cy="' + (-40 * s) + '" rx="30" ry="15" transform="rotate(' + (-25 * s) + ' 34 ' + (-40 * s) + ')" fill="' + C.pele + '"/>' +
            '<path d="M40,' + (-14 * s) + ' Q70,' + (-10 * s) + ' 92,' + (-4 * s) + '" stroke="' + C.peleSombra + '" stroke-width="4" fill="none" opacity=".5" stroke-linecap="round"/>' +
            '<g class="garrafa" opacity="0" transform="translate(48,0) rotate(90)">' +
              '<rect x="-24" y="-80" width="48" height="120" rx="16" fill="#cfe6ef" stroke="#9cc3d3" stroke-width="4"/>' +
              '<rect x="-14" y="-98" width="28" height="22" rx="6" fill="' + C.destaque + '"/>' +
            '</g>' +
          '</g>' +
        '</g>' +
      '</g>' +
    '</g>';
  }

  function corpo() {
    return '' +
      // cabelo de trás + coque
      '<g filter="url(#massinha)">' +
      '<path d="M372,300 C318,230 330,80 470,42 C575,14 672,70 670,200 C668,262 648,305 616,330 L600,250 L420,250 Z" fill="url(#gCab)"/>' +
      '<circle cx="392" cy="320" r="60" fill="url(#gCab)"/>' +
      '<path d="M360,322 Q392,300 430,330" stroke="#48241A" stroke-width="5" fill="none" opacity=".6"/>' +
      '</g>' +
      // pernas
      '<g filter="url(#massinha)">' +
      '<rect x="372" y="1350" width="80" height="60" fill="url(#gPele)"/>' +
      '<rect x="572" y="1350" width="80" height="60" fill="url(#gPele)"/>' +
      '<path d="M372,688 Q512,722 652,686 Q705,790 700,860 Q692,990 652,1075 L656,1366 L572,1366 L546,1084 L514,842 L480,1084 L454,1366 L368,1366 L372,1075 Q326,990 322,860 Q320,780 372,688Z" fill="url(#gLeg)"/>' +
      '<path d="M512,840 L514,720" stroke="' + C.leggingSombra + '" stroke-width="5" opacity=".6"/>' +
      '<path d="M372,1075 Q420,1092 470,1078 M552,1078 Q604,1092 652,1075" stroke="' + C.leggingSombra + '" stroke-width="5" fill="none" opacity=".55"/>' +
      // tênis
      '<path d="M330,1470 Q338,1398 400,1395 Q462,1398 470,1470 Z" fill="url(#gTenis)"/>' +
      '<rect x="328" y="1462" width="146" height="34" rx="16" fill="' + C.sola + '"/>' +
      '<path d="M556,1470 Q564,1398 626,1395 Q688,1398 696,1470 Z" fill="url(#gTenis)"/>' +
      '<rect x="552" y="1462" width="146" height="34" rx="16" fill="' + C.sola + '"/>' +
      '</g>' +
      // tronco
      '<g id="tronco" filter="url(#massinha)">' +
      '<path d="M398,388 Q512,362 628,388 L642,470 L382,470 Z" fill="url(#gPele)"/>' +
      '<path d="M405,384 L446,378 Q512,462 578,378 L620,384 Q644,452 634,520 Q616,580 652,690 Q512,722 370,692 Q406,580 390,520 Q380,452 405,384Z" fill="url(#gTop)"/>' +
      '<path d="M446,378 Q512,462 578,378" fill="none" stroke="' + C.topSombra + '" stroke-width="4" opacity=".6"/>' +
      '</g>';
  }

  function cabeca() {
    return '<g id="cabeca">' +
      '<g filter="url(#massinha)">' +
      // pescoço
      '<path d="M470,318 L470,372 Q512,394 555,372 L555,318 Z" fill="' + C.peleSombra + '"/>' +
      // orelhas
      '<ellipse cx="398" cy="246" rx="24" ry="30" fill="url(#gPele)"/>' +
      '<ellipse cx="628" cy="246" rx="24" ry="30" fill="url(#gPele)"/>' +
      // rosto
      '<ellipse cx="512" cy="228" rx="114" ry="124" fill="url(#gPele)"/>' +
      // franja lateral
      '<path d="M398,232 C392,140 452,84 532,82 C600,82 640,130 634,196 C612,150 572,122 520,124 C474,128 452,168 440,206 C430,226 412,236 398,232Z" fill="url(#gCab)"/>' +
      '<path d="M470,110 C500,96 560,96 598,122" stroke="' + C.cabeloLuz + '" stroke-width="6" fill="none" opacity=".7" stroke-linecap="round"/>' +
      '</g>' +
      // bochechas
      '<ellipse id="boch-d" cx="448" cy="262" rx="22" ry="12" fill="' + C.bochecha + '" opacity=".28"/>' +
      '<ellipse id="boch-e" cx="576" cy="262" rx="22" ry="12" fill="' + C.bochecha + '" opacity=".28"/>' +
      // sobrancelhas
      '<path id="sob-d" d="M440,170 Q466,154 492,168" stroke="' + C.cabelo + '" stroke-width="7" fill="none" stroke-linecap="round"/>' +
      '<path id="sob-e" d="M532,168 Q558,154 584,170" stroke="' + C.cabelo + '" stroke-width="7" fill="none" stroke-linecap="round"/>' +
      // olhos
      '<g id="olho-d"><ellipse cx="467" cy="206" rx="12" ry="14" fill="' + C.olho + '"/><circle cx="471" cy="201" r="3.5" fill="#fff" opacity=".8"/></g>' +
      '<g id="olho-e"><ellipse cx="557" cy="206" rx="12" ry="14" fill="' + C.olho + '"/><circle cx="561" cy="201" r="3.5" fill="#fff" opacity=".8"/></g>' +
      '<path id="olho-e-fechado" d="M543,208 Q557,218 571,208" stroke="' + C.olho + '" stroke-width="6" fill="none" stroke-linecap="round" opacity="0"/>' +
      // vincos e boca
      '<path d="M456,252 Q446,266 458,282 M568,252 Q578,266 566,282" stroke="' + C.vinco + '" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>' +
      '<path id="boca" d="" fill="' + C.boca + '"/>' +
      '</g>';
  }

  var BOCAS = {
    feliz: "M472,270 Q512,304 552,270 Q512,288 472,270Z",
    sorrisao: "M466,264 Q512,326 558,264 Q512,280 466,264Z",
    piscadinha: "M474,272 Q516,302 552,266 Q514,288 474,272Z",
    esforco: "M490,282 Q512,272 534,282 Q512,292 490,282Z",
    orgulho: "M476,272 Q512,296 548,272 Q512,282 476,272Z"
  };
  var SOBR = {
    feliz: ["M440,170 Q466,154 492,168", "M532,168 Q558,154 584,170"],
    sorrisao: ["M440,162 Q466,144 492,160", "M532,160 Q558,144 584,162"],
    piscadinha: ["M440,166 Q466,150 492,164", "M532,176 Q558,168 584,176"],
    esforco: ["M440,160 Q466,166 494,176", "M530,176 Q558,166 584,160"],
    orgulho: ["M440,172 Q466,160 492,172", "M532,172 Q558,160 584,172"]
  };

  /* ---------- Poses (ângulos absolutos do braço; antebraço e mão relativos) ---------- */
  var POSES = {
    repouso: function (t) {
      var r = Math.sin(t * 1.6) * 1.5;
      return { r: [122.3 + r, 2.1, 0], l: [56.3 - r, 1, 0] };
    },
    acenar: function (t) {
      var o = Math.sin(t * 9);
      return { r: [228, 42 + o * 24, o * 12], l: [58, 4, 0] };
    },
    extensao: function (t) { // extensão acima da cabeça com garrafa
      var k = .5 + .5 * Math.cos(t * 2.2); // 1 = dobrado atrás da cabeça
      return { r: [264, 10 + 172 * k, 0], l: [276, -(10 + 172 * k), 0], sobe: 95 };
    },
    coice: function (t) { // braço desce e estende para trás (vista frontal: abre e estica)
      var k = .5 + .5 * Math.cos(t * 3);
      return { r: [150 - 10 * k, -10 + 80 * k, 0], l: [30 + 10 * k, 10 - 80 * k, 0] };
    },
    puxar: function (t) { // rosca/puxar: só o bíceps trabalha
      var k = .5 + .5 * Math.sin(t * 2.6);
      return { r: [100, -20 - 120 * k, -10 * k], l: [80, 20 + 120 * k, 10 * k] };
    },
    pulsinho: function (t) { // pulsinhos pra trás: braços esticados, pulsos curtos
      var o = Math.abs(Math.sin(t * 5.2)) * 7;
      return { r: [104 + o, 0, 6], l: [76 - o, 0, -6] };
    },
    comemorar: function (t) {
      var o = Math.sin(t * 7) * 6;
      return { r: [236 + o, 30, 10], l: [304 - o, -30, -10] };
    }
  };

  function cenario() {
    var M = '#5c6b58';
    return '<g id="sala">' +
      // parede e rodapé
      '<rect x="-40" y="-300" width="1104" height="1560" fill="#DCEBD8"/>' +
      '<rect x="-40" y="1230" width="1104" height="310" fill="#EBE1D2"/>' +
      '<rect x="-40" y="1222" width="1104" height="16" fill="#C9DBC4"/>' +
      // quadro na parede
      '<rect x="640" y="-80" width="200" height="250" rx="10" fill="#F7F1EA" stroke="#B08D57" stroke-width="8"/>' +
      '<path d="M690,110 Q740,10 790,110" fill="none" stroke="#E59AA6" stroke-width="10" stroke-linecap="round"/>' +
      '<circle cx="740" cy="40" r="18" fill="#E59AA6" opacity=".8"/>' +
      // sofá (lado esquerdo, atrás dela)
      '<g>' +
        '<rect x="-30" y="840" width="430" height="200" rx="60" fill="#A9C3A4"/>' +
        '<rect x="-30" y="990" width="460" height="170" rx="40" fill="#97B592"/>' +
        '<rect x="-50" y="900" width="90" height="260" rx="40" fill="#8EAD89"/>' +
        '<rect x="20" y="870" width="150" height="130" rx="34" fill="#F7E3D6" transform="rotate(-8 95 935)"/>' +
        '<rect x="-20" y="1150" width="24" height="70" rx="8" fill="#B08D57"/>' +
        '<rect x="390" y="1150" width="24" height="70" rx="8" fill="#B08D57"/>' +
      '</g>' +
      // estante / mesinha com abajur (lado direito)
      '<g>' +
        '<rect x="770" y="900" width="250" height="330" rx="12" fill="#D8B48A"/>' +
        '<rect x="770" y="900" width="250" height="24" rx="8" fill="#C59C6E"/>' +
        '<rect x="790" y="1050" width="210" height="14" rx="6" fill="#C59C6E"/>' +
        '<rect x="800" y="1000" width="60" height="50" rx="6" fill="#E59AA6"/>' +
        '<rect x="866" y="990" width="40" height="60" rx="6" fill="#F7F1EA"/>' +
        // abajur
        '<ellipse cx="840" cy="560" rx="150" ry="120" fill="#FFF3D6" opacity=".55"/>' +
        '<rect x="828" y="700" width="24" height="200" fill="#B08D57"/>' +
        '<ellipse cx="840" cy="895" rx="56" ry="14" fill="#B08D57"/>' +
        '<path d="M760,710 L920,710 L880,560 L800,560 Z" fill="#FBEFD9" stroke="#E8D6B4" stroke-width="5"/>' +
      '</g>' +
      // gatinho sentado em cima da estante
      '<g id="gato">' +
        '<g class="rabo"><path d="M985,885 C1040,880 1050,820 1020,790" fill="none" stroke="#9A9A9A" stroke-width="16" stroke-linecap="round"/></g>' +
        '<ellipse cx="955" cy="850" rx="52" ry="52" fill="#A8A8A8"/>' +
        '<circle cx="940" cy="782" r="36" fill="#A8A8A8"/>' +
        '<path d="M912,762 L914,730 L936,752 Z M946,750 L966,728 L970,760 Z" fill="#A8A8A8"/>' +
        '<path d="M917,758 L918,742 L929,753 Z M952,752 L963,740 L965,757 Z" fill="#E59AA6"/>' +
        '<path d="M926,780 q4,-5 8,0 M946,780 q4,-5 8,0" stroke="' + M + '" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
        '<path d="M936,792 q4,4 8,0" stroke="' + M + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="930" cy="896" rx="18" ry="10" fill="#BDBDBD"/><ellipse cx="968" cy="898" rx="18" ry="10" fill="#BDBDBD"/>' +
      '</g>' +
      // tapete aos pés dela
      '<ellipse cx="512" cy="1490" rx="360" ry="72" fill="#F3D6D9"/>' +
      '<ellipse cx="512" cy="1490" rx="320" ry="56" fill="none" stroke="#FBEFF0" stroke-width="8" stroke-dasharray="4 18" stroke-linecap="round"/>' +
      '</g>';
  }

  function criar(alvo, opcoes) {
    opcoes = opcoes || {};
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "-40 -300 1104 1840");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "Personagem do Método Feminino");
    svg.innerHTML = defs() + (opcoes.cenario === false ? "" : cenario()) + '<g id="boneca">' + corpo() + braco("braco-d", BR, false) + braco("braco-e", BL, true) + cabeca() + "</g>";
    alvo.appendChild(svg);

    var q = function (s) { return svg.querySelector(s); };
    var seg = function (id) {
      var b = q("#" + id);
      return { u: b.querySelector(".seg-u"), f: b.querySelector(".seg-f"), m: b.querySelector(".seg-m"), tri: b.querySelector(".triceps"), gar: b.querySelector(".garrafa") };
    };
    var D = seg("braco-d"), E = seg("braco-e");
    var cab = q("#cabeca"), tronco = q("#tronco"), rabo = q("#gato .rabo");
    var bD = q("#braco-d"), bE = q("#braco-e");
    function camadas(atras) {
      var ref = atras ? tronco : cab;
      ref.parentNode.insertBefore(bD, ref); ref.parentNode.insertBefore(bE, ref);
    }
    var olhos = [q("#olho-d"), q("#olho-e")], olhoFechado = q("#olho-e-fechado");

    var atual = { r: [122.3, 2.1, 0], l: [56.3, 1, 0] };
    var estado = { pose: "repouso", expr: "feliz", destaque: false, t0: performance.now(), piscaEm: 1500 };

    var sobe = 0;
    function aplica(S, B, a, lado) {
      S.u.setAttribute("transform", "translate(" + B.ombro[0] + "," + (B.ombro[1] - sobe) + ") rotate(" + a[0] + ")");
      S.f.setAttribute("transform", "translate(" + B.u + ",0) rotate(" + a[1] + ")");
      S.m.setAttribute("transform", "translate(" + B.f + ",0) rotate(" + a[2] + ")");
    }
    function expressao(nome) {
      estado.expr = BOCAS[nome] ? nome : "feliz";
      q("#boca").setAttribute("d", BOCAS[estado.expr]);
      q("#sob-d").setAttribute("d", SOBR[estado.expr][0]);
      q("#sob-e").setAttribute("d", SOBR[estado.expr][1]);
      var pisc = estado.expr === "piscadinha";
      olhos[1].style.opacity = pisc ? 0 : 1;
      olhoFechado.style.opacity = pisc ? 1 : 0;
      var cor = estado.expr === "esforco" || estado.expr === "sorrisao" ? .45 : .28;
      q("#boch-d").setAttribute("opacity", cor); q("#boch-e").setAttribute("opacity", cor);
    }

    function quadro(agora) {
      var t = (agora - estado.t0) / 1000;
      var alvoP = POSES[estado.pose](t);
      sobe += ((alvoP.sobe || 0) - sobe) * .14;
      // aproximação suave da pose (efeito "massinha" elástico)
      ["r", "l"].forEach(function (k) {
        for (var i = 0; i < 3; i++) atual[k][i] += (alvoP[k][i] - atual[k][i]) * .14;
      });
      aplica(D, BR, atual.r); aplica(E, BL, atual.l);

      // respiração e balanço da cabeça
      var resp = Math.sin(agora / 700) * 3;
      tronco.setAttribute("transform", "translate(0," + resp * .6 + ")");
      var inclina = estado.pose === "acenar" ? Math.sin(agora / 300) * 3 : Math.sin(agora / 1100) * 1.5;
      cab.setAttribute("transform", "translate(0," + resp + ") rotate(" + inclina + " 512 330)");

      // piscar
      var ciclo = agora % 3800;
      var fecha = ciclo > 3650 ? Math.sin((ciclo - 3650) / 150 * Math.PI) : 0;
      olhos[0].setAttribute("transform", "translate(0," + 206 * fecha * .9 + ") scale(1," + (1 - fecha * .9) + ")");
      if (estado.expr !== "piscadinha") olhos[1].setAttribute("transform", "translate(0," + 206 * fecha * .9 + ") scale(1," + (1 - fecha * .9) + ")");

      // brilho do tríceps
      var br = estado.destaque ? .75 + .25 * Math.sin(agora / 260) : 0;
      D.tri.setAttribute("opacity", br); E.tri.setAttribute("opacity", br);
      if (rabo) rabo.setAttribute("transform", "rotate(" + (Math.sin(agora / 420) * 14) + " 985 885)");
      requestAnimationFrame(quadro);
    }

    expressao("feliz");
    requestAnimationFrame(quadro);

    return {
      svg: svg,
      pose: function (nome) {
        estado.pose = POSES[nome] ? nome : "repouso";
        estado.t0 = performance.now();
        var garrafa = nome === "extensao";
        camadas(garrafa);
        D.gar.setAttribute("opacity", garrafa ? 1 : 0);
      },
      expressao: expressao,
      destacar: function (on, modo) {
        estado.destaque = !!on;
        var f = modo === "dormindo" ? "url(#gCinza)" : "url(#gBrilho)";
        D.tri.setAttribute("fill", f); E.tri.setAttribute("fill", f);
      }
    };
  }

  window.Personagem = { criar: criar, poses: Object.keys(POSES), expressoes: Object.keys(BOCAS) };
})();
