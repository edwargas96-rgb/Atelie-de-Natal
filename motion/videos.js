/* Roteiros dos motions. Cada cena tem duração (s), um fundo (clipe de vídeo ou foto com zoom) e uma legenda.
   clip: pasta de quadros em frames/ + segundo inicial no clipe original
   img: foto com movimento (de/para: [zoom, x%, y%]) | ilustrativa: mostra o selo "Imagem ilustrativa"
   cap: legenda | capPos: "top" (padrão) ou "bottom" | hook: true deixa a legenda maior */
window.VIDEOS = {
  asmr: {
    cenas: [
      { dur: 3.6, clip: "c2", from: 0.0, cap: "O hobby que me tirou do celular à noite 🕯️", hook: true },
      { dur: 2.6, clip: "c2", from: 3.6, cap: "10 minutinhos só pra mim" },
      { dur: 6.0, clip: "c1", from: 2.0, cap: "Ponto por ponto, a cabeça desacelera…" },
      { dur: 5.0, clip: "c2", from: 10.0, cap: "Sem tecido, sem bastidor. Só papel, agulha e linha 🪡" },
      { dur: 4.5, clip: "c1", from: 13.5, cap: "250 moldes de Natal pra bordar no seu ritmo" },
      { dur: 3.6, img: "src/foto3-arvore-bordada.jpg", de: [1.0, 50, 45], para: [1.12, 50, 40], cap: "E a casa ainda fica linda 🎄", capPos: "bottom" }
    ]
  },
  presepio: {
    cenas: [
      { dur: 4.0, img: "src/presepio.jpg", de: [1.0, 50, 50], para: [1.1, 50, 50], ilustrativa: true, cap: "Esse ano meu presépio foi feito à mão, ponto por ponto 🙏", hook: true },
      { dur: 3.6, img: "src/presepio.jpg", de: [1.3, 6, 48], para: [1.42, 10, 50], ilustrativa: true, cap: "Maria, José e o Menino Jesus", capPos: "bottom" },
      { dur: 3.6, img: "src/presepio.jpg", de: [1.6, 82, 45], para: [1.75, 78, 50], ilustrativa: true, cap: "Os três Reis Magos", capPos: "bottom" },
      { dur: 3.2, img: "src/presepio.jpg", de: [2.2, 38, 64], para: [2.45, 38, 66], ilustrativa: true, cap: "Bordado no papel, com agulha e linha 🪡", capPos: "bottom" },
      { dur: 3.8, img: "src/presepio.jpg", de: [1.25, 50, 50], para: [1.0, 50, 50], ilustrativa: true, cap: "O verdadeiro sentido do Natal, feito com as suas mãos ✨", capPos: "bottom" }
    ]
  }
};
window.CTA = {
  titulo: "Abra o seu presente 🎁",
  sub: "250 moldes de bordado em papel + 5 bônus",
  selo: "Promoção até 24/12",
  botao: "Toque em Saiba mais",
  img: "src/link-preview.webp",
  dur: 3.8
};
