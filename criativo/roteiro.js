/* Roteiro do criativo "grupo das amigas". Edite textos aqui; os tempos são calculados sozinhos.
   who: "ana" (quem grava a tela e digita no teclado) | "bianca" | "carla" | "dani"
   text: mensagem | img: foto (pasta fotos/) | link: card do link no fim */
window.ROTEIRO = {
  duracaoTotal: 30,              // segundos
  grupo: "Natal das Amigas 🎄",
  hora: "20:41",
  hook: "Pedi pras minhas amigas mandarem foto da árvore… a terceira me deixou sem palavras 😱",
  hookAte: 3.4,                  // segundos com o texto do topo na tela
  pessoas: {
    ana:    { nome: "Ana" },
    bianca: { nome: "Bianca", cor: "#d6336c" },
    carla:  { nome: "Carla",  cor: "#1c9e58" },
    dani:   { nome: "Dani",   cor: "#7b52c4" }
  },
  mensagens: [
    { who: "ana",    text: "Meninas, bora ver as árvores desse ano! Manda foto 📸" },
    { who: "carla",  img: "fotos/carla.jpg" },
    { who: "carla",  text: "Montei ontem, a mesma de sempre 😅" },
    { who: "dani",   img: "fotos/dani.jpg" },
    { who: "dani",   text: "A minha tá assim, nem tive tempo esse ano" },
    { who: "bianca", img: "fotos/bianca.jpg" },
    { who: "bianca", text: "A minha esse ano eu mesma fiz 🥹" },
    { who: "ana",    text: "GENTE que lindaaa 😍 isso é bordado??" },
    { who: "carla",  text: "Bordado no PAPEL? Você nem sabe bordar kkkk" },
    { who: "bianca", text: "Nem eu sabia! Vem um guia com os pontos, é só furar e passar a linha" },
    { who: "bianca", text: "São 250 moldes do Ateliê de Natal, e ainda veio recadinhos pros cartões e um plano pra ficar pronto até a ceia" },
    { who: "dani",   text: "Quanto foi isso??" },
    { who: "bianca", text: "Abri um presente no site e saiu R$ 37,90 🎁" },
    { who: "ana",    text: "Manda o link que eu vou fazer a minha 🏃‍♀️" },
    { who: "bianca", link: { url: "ateliebordado.vercel.app", titulo: "Ateliê de Natal · 250 moldes de bordado em papel", desc: "Imprima, borde e presenteie. Abra o seu presente de Natal 🎁", img: "fotos/link-preview.webp" } }
  ],
  cta: {
    titulo: "Abra o seu presente 🎁",
    sub: "250 moldes de bordado em papel + 5 bônus",
    selo: "Promoção até 24/12",
    botao: "Toque em Saiba mais",
    img: "fotos/link-preview.webp",
    duracao: 3
  }
};
