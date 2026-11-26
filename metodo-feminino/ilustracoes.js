/* Artes de palitinho que marcam onde entra cada imagem ou vídeo final.
   Troque cada slot pela imagem real depois (ver "img" em perguntas.js). */
(function () {
  var T = 'stroke="#6d5a57" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"';
  var V = 'stroke="#6e2a35" stroke-width="2.5" stroke-linecap="round" fill="none"';
  var O = 'stroke="#b08d57" stroke-width="2" stroke-linecap="round" fill="none"';

  // Corpo base: cabeça, coque, pescoço, vestido e pernas. Braços vêm à parte.
  function corpo(cx, top, s) {
    s = s || 1;
    function p(x, y) { return (cx + x * s) + ',' + (top + y * s); }
    return '<g ' + T + '>' +
      '<circle cx="' + cx + '" cy="' + (top + 14 * s) + '" r="' + (13 * s) + '"/>' +
      '<circle cx="' + (cx + 9 * s) + '" cy="' + (top + 2 * s) + '" r="' + (5 * s) + '"/>' +
      '<path d="M' + p(0, 27) + ' L' + p(0, 36) + '"/>' +
      '<path d="M' + p(-13, 38) + ' L' + p(13, 38) + '"/>' +
      '<path d="M' + p(-9, 38) + ' L' + p(-26, 112) + ' L' + p(26, 112) + ' L' + p(9, 38) + '"/>' +
      '<path d="M' + p(-8, 112) + ' L' + p(-10, 160) + ' M' + p(8, 112) + ' L' + p(10, 160) + '"/>' +
      '</g>';
  }
  function linha(pts) { return '<polyline ' + T + ' points="' + pts + '"/>'; }

  var cenas = {
    // Capa: modelo na passarela, luz de desfile
    passarela: function () {
      return '<svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">' +
        '<path ' + O + ' d="M110 220 L140 120 M190 220 L160 120 M60 220 L130 120 M240 220 L170 120" opacity=".6"/>' +
        '<g ' + O + '><path d="M40 34 l20 26 M150 26 v30 M260 34 l-20 26"/><circle cx="40" cy="30" r="5"/><circle cx="150" cy="22" r="5"/><circle cx="260" cy="30" r="5"/></g>' +
        corpo(150, 56, .95) +
        linha('138,92 126,118 138,140') + linha('162,92 176,116 166,140') +
        '<path ' + V + ' d="M122 104 q-6 8 -2 16" opacity=".9"/>' +
        '</svg>';
    },
    // Dor: aceno com o "tchauzinho" balançando
    tchau: function () {
      return '<svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">' +
        corpo(150, 40) +
        linha('163,78 196,58 210,24') + linha('137,78 124,112 130,140') +
        '<path ' + V + ' d="M172 76 q10 14 26 -4 M176 84 q10 10 20 -6"/>' +
        '<path ' + O + ' d="M222 20 q8 6 0 14 M230 14 q12 10 0 24"/>' +
        '</svg>';
    },
    // Desejo: réveillon, vestido sem manga, taça para cima
    taca: function () {
      return '<svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">' +
        '<g ' + O + '><path d="M50 50 l0 -16 M50 50 l12 -10 M50 50 l14 2 M50 50 l-12 -10 M50 50 l-14 2"/><path d="M250 70 l0 -14 M250 70 l10 -8 M250 70 l-10 -8 M250 70 l12 2 M250 70 l-12 2"/></g>' +
        corpo(150, 44) +
        linha('163,82 186,62 192,34') + linha('137,82 122,114 132,142') +
        '<path ' + O + ' d="M186 34 h14 l-7 12 z M193 46 v10 M188 56 h10"/>' +
        '<path ' + O + ' d="M210 26 l4 -4 M214 34 l6 0" opacity=".8"/>' +
        '</svg>';
    },
    // Promessa: bastidor com espelho de camarim
    bastidor: function () {
      var luzes = '';
      for (var i = 0; i < 5; i++) luzes += '<circle cx="' + (190 + i * 16) + '" cy="40" r="4"/>';
      return '<svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">' +
        '<g ' + O + '><rect x="182" y="30" width="80" height="120" rx="6"/>' + luzes + '</g>' +
        corpo(110, 44) +
        linha('123,82 132,46 116,30') + linha('97,82 84,114 92,142') +
        '<ellipse cx="128" cy="64" rx="7" ry="14" fill="#6e2a35" opacity=".22"/>' +
        '<path d="M60 205 h180" ' + T + ' opacity=".4"/>' +
        '</svg>';
    },
    // Resultado: confiante, braço firme
    confiante: function () {
      return '<svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">' +
        corpo(150, 40) +
        linha('137,78 122,104 140,118') + linha('163,78 178,104 160,118') +
        '<g ' + O + '><path d="M100 60 l6 0 M103 57 l0 6 M200 90 l6 0 M203 87 l0 6 M92 120 l5 0 M94.5 117.5 l0 5"/></g>' +
        '</svg>';
    },
    // Foto de depoimento: busto
    busto: function () {
      return '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g ' + T + ' stroke-width="2.2">' +
        '<circle cx="32" cy="24" r="10"/><circle cx="39" cy="14" r="4"/><path d="M14 58 q4 -18 18 -18 q14 0 18 18"/></g></svg>';
    },
    // Vídeo-aula animada: sentada, pulsinhos pra trás
    aula: function () {
      return '<svg viewBox="0 0 200 360" xmlns="http://www.w3.org/2000/svg">' +
        '<g ' + O + '><path d="M60 180 h70 M66 180 v70 M124 180 v70 M124 180 v-60"/></g>' +
        '<g ' + T + '>' +
        '<circle cx="100" cy="58" r="14"/><circle cx="109" cy="46" r="5"/>' +
        '<path d="M100 72 v12 M86 86 h28 M92 86 L86 176 L120 176 L108 86"/>' +
        '<path d="M92 176 h-28 v60 M112 176 h-20 v60"/>' +
        '</g>' +
        '<g class="braco-anim">' +
        '<ellipse class="destaque" cx="104" cy="120" rx="8" ry="18" fill="#6e2a35"/>' +
        '<polyline ' + T + ' points="100,98 106,140 92,170"/>' +
        '</g>' +
        '</svg>';
    },
    // Vídeo do mecanismo: braço puxando x empurrando
    mecanismo: function () {
      return '<svg viewBox="0 0 200 360" xmlns="http://www.w3.org/2000/svg">' +
        '<g ' + T + '>' +
        '<path d="M60 120 q40 -30 80 0 q10 40 -10 90 q-30 20 -60 0 q-20 -50 -10 -90 z"/>' +
        '</g>' +
        '<path ' + O + ' d="M80 130 q20 -14 40 0" />' +
        '<g class="braco-anim" style="transform-origin:100px 170px">' +
        '<ellipse class="destaque" cx="112" cy="170" rx="14" ry="34" fill="#6e2a35"/>' +
        '</g>' +
        '<text x="100" y="270" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" fill="#6d5a57">tríceps "dormindo"</text>' +
        '<path ' + V + ' d="M140 160 l20 0 M152 152 l8 8 l-8 8"/>' +
        '</svg>';
    }
  };

  window.Ilustra = function (nome) { return (cenas[nome] || cenas.confiante)(); };
})();
