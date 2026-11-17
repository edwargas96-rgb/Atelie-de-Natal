/* Roteiro do criativo "grupo das amigas". Edite textos aqui; os tempos são calculados sozinhos.
   who: "ana" (quem grava a tela e digita no teclado) | "bianca" | "carla" | "dani"
   text: mensagem | img: foto (pasta fotos/) | sticker: figurinha | link: card do link no fim
   pausa: segundos extras depois da mensagem (para a reação "bater") */
window.ROTEIRO = {
  duracaoTotal: 0,               // 0 = automático (termina quando a conversa e o CTA acabam)
  grupo: "Natal das Amigas 🎄",
  hora: "20:41",
  hook: "Todo grupo de amigas tem aquela que monta a árvore mais linda. Esse ano vai ser você?",
  hookAte: 4.2,                  // segundos com o texto do topo na tela
  pessoas: {
    ana:    { nome: "Ana" },
    bianca: { nome: "Bianca", cor: "#d6336c" },
    carla:  { nome: "Carla",  cor: "#1c9e58" },
    dani:   { nome: "Dani",   cor: "#7b52c4" }
  },
  mensagens: [
    { who: "ana",    text: "Meninas, bora ver as árvores de vocês esse ano 🎄📸" },
    { who: "carla",  img: "fotos/foto1-arvore-comum.jpg" },
    { who: "carla",  text: "Montei igualzinha à do ano passado 😅 mesmas bolinhas, mesmo pisca-pisca" },
    { who: "dani",   img: "fotos/foto2-arvore-antiga.jpg" },
    { who: "dani",   text: "A minha é a mesma desde 2015 kkkk tenho até vergonha 🙈" },
    { who: "dani",   sticker: "fotos/fig-cachorro-triste.png" },
    { who: "ana",    text: "Kkkk a minha também, nem tiro mais foto 😩" },
    { who: "ana",    sticker: "fotos/fig-gato-triste.png" },
    { who: "bianca", text: "Esse ano eu resolvi mudar… 👀" },
    { who: "bianca", img: "fotos/foto3-arvore-bordada.jpg", pausa: 0.8 },
    { who: "carla",  text: "BIANCAAA 😱" },
    { who: "carla",  sticker: "fotos/fig-gato-surpreso.png" },
    { who: "dani",   text: "Gente, parece árvore de revista 😍" },
    { who: "ana",    text: "Para tudo. Isso é bordado??" },
    { who: "bianca", text: "É sim! Bordei cada enfeite no papel 🥹 e eu nunca tinha bordado na vida" },
    { who: "bianca", text: "Todo mundo que entra em casa pergunta onde eu comprei 😂" },
    { who: "carla",  text: "Ano que vem eu quero ser você kkkk" },
    { who: "bianca", text: "Nem precisa esperar! Fiz com os moldes do Ateliê de Natal, são 250" },
    { who: "bianca", text: "Vem guia dos pontos, lista de materiais e até um plano pra ficar pronto antes da ceia" },
    { who: "dani",   text: "E foi caro?" },
    { who: "bianca", text: "Que nada! Abri um presente no site e ganhei uma condição especial de Natal 🎁 Abre o seu lá!" },
    { who: "ana",    text: "Manda o link AGORA que esse ano a árvore mais linda do grupo vai ser a minha 😏" },
    { who: "bianca", link: { url: "ateliebordado.vercel.app", titulo: "Ateliê de Natal · 250 moldes de bordado em papel", desc: "Imprima, borde e presenteie. Abra o seu presente de Natal 🎁", img: "fotos/link-preview.webp" } }
  ],
  cta: {
    titulo: "Esse ano, a árvore mais linda do grupo pode ser a sua 🎄",
    sub: "Abra o seu presente 🎁 250 moldes de bordado em papel + 5 bônus",
    selo: "Promoção até 24/12",
    botao: "Toque em Saiba mais",
    img: "fotos/link-preview.webp",
    duracao: 3.8
  }
};
