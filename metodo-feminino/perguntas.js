/* ROTEIRO DO QUIZ — edite os textos aqui, sem mexer no quiz.js.
   Estrutura 4P's: Picture → Promise → Prove → Push.

   Tipos de tela:
   intro | nome | unica | multipla | info | video | depoimentos | carregando | resultado

   {nome}      = nome que ela digitou (use só nas perguntas mais sentimentais)
   img         = nome da arte de palitinho em ilustracoes.js (slot de imagem a substituir)
   imgDesc     = descrição da imagem final que precisa ser produzida
   fb          = feedback rápido depois da resposta (texto, ou por opção)
   fbSempre    = true → mostra sempre; senão aparece de forma aleatória (~50%)
   chave       = nome da resposta usada no resultado personalizado
*/
window.CONFIG = {
  checkout: "#CHECKOUT-PENDENTE",       // link da Hotmart/Cakto
  precoDe: "R$ 97",
  preco: "37",
  chanceFeedback: 0.5
};

window.ROTEIRO = [
  /* ---------- ABERTURA ---------- */
  {
    tipo: "intro",
    titulo: "Aprenda em <em>21 dias</em>, com aulas guiadas, o método que as <em>modelos escondem</em> para ter braços firmes",
    bullets: [
      "Adaptado para mulheres 35+",
      "Acesso imediato e vitalício",
      "Garantia de 7 dias",
      "4 bônus exclusivos",
      "Só 10 a 20 min por dia",
      "Pagamento 100% seguro"
    ],
    foto: "assets/capa.webp",
    fotoAlt: "Modelo de vestido rosé caminhando na passarela",
    img: "passarela",
    imgDesc: "IMAGEM: modelo de costas na passarela, vestido sem manga, braço firme, luz de desfile. Tom elegante, bege/dourado.",
    botao: "Descobrir se é para mim",
    nota: "Teste gratuito · leva 2 minutos"
  },
  {
    tipo: "nome",
    titulo: "Antes de começar, como posso te chamar?",
    placeholder: "Seu primeiro nome",
    botao: "Continuar"
  },

  /* ---------- P1 · PICTURE (ela se vê na cena) ---------- */
  {
    tipo: "unica", chave: "idade",
    titulo: "Prazer, {nome}. Qual é a sua idade?",
    opcoes: [
      { t: "Menos de 35", v: "-35" },
      { t: "35 a 44", v: "35" },
      { t: "45 a 54", v: "45" },
      { t: "55 ou mais", v: "55" }
    ],
    fb: "Ótimo. O método foi adaptado justamente para essa fase do corpo."
  },
  {
    tipo: "unica", chave: "incomodo",
    titulo: "O que mais te incomoda no seu braço hoje?",
    opcoes: [
      { e: "👋", t: "Ele balança quando eu aceno", v: "tchau" },
      { e: "🫧", t: "A pele parece mole, sobrando", v: "pele" },
      { e: "✨", t: "Falta contorno, parece sem forma", v: "contorno" },
      { e: "💭", t: "Um pouco de tudo isso", v: "tudo" }
    ]
  },
  {
    tipo: "multipla", chave: "esconde",
    titulo: "Em quais momentos você já escondeu o braço?",
    sub: "Pode marcar mais de uma.",
    opcoes: [
      { t: "Em fotos", v: "fotos" },
      { t: "Evitando roupa sem manga", v: "manga" },
      { t: "Na praia ou piscina", v: "praia" },
      { t: "Na hora de dar tchau", v: "tchau" },
      { t: "Em festas e casamentos", v: "festa" }
    ],
    fb: "Você não está sozinha. Esse é o incômodo mais comum entre as mulheres que fazem este teste."
  },
  {
    tipo: "unica", chave: "foto",
    titulo: "Quando você se vê numa foto com o braço de fora, o que sente?",
    foto: "assets/foto-tchau.webp", fotoAlt: "Mulher acenando e segurando o braço num almoço de família",
    img: "tchau",
    imgDesc: "IMAGEM: mulher 40+ acenando, foco na parte de trás do braço (sem expor, tom acolhedor).",
    opcoes: [
      { t: "Apago ou nem posto", v: "apaga" },
      { t: "Peço pra tirarem de novo", v: "refaz" },
      { t: "Fujo da câmera", v: "foge" },
      { t: "Já me acostumei, mas incomoda", v: "acostumou" }
    ],
    fb: "Isso diz muito sobre o quanto você merece se sentir bem de novo.",
    fbSempre: true
  },
  {
    tipo: "info",
    sobre: "Feche os olhos por um segundo",
    titulo: "Agora imagina <em>você</em> na virada do ano…",
    texto: "Vestido sem manga, taça na mão, levantando o braço na contagem regressiva. <strong>Sem pensar no braço. Sem se esconder da foto.</strong>",
    foto: "assets/foto-reveillon.webp", fotoAlt: "Mulher de vestido rosé brindando na virada do ano",
    img: "taca",
    imgDesc: "IMAGEM: mulher 40+ elegante de vestido sem manga brindando no réveillon, fogos ao fundo.",
    botao: "Eu quero isso"
  },
  {
    tipo: "unica", chave: "peca",
    titulo: "Qual peça você mais sente falta de usar?",
    opcoes: [
      { e: "👗", t: "Vestido de alça", v: "vestido" },
      { e: "🎽", t: "Regata", v: "regata" },
      { e: "👙", t: "Biquíni ou maiô", v: "biquini" },
      { e: "👚", t: "Blusa de manga curta mais justa", v: "blusa" }
    ]
  },

  /* ---------- P2 · PROMISE (não é culpa dela) ---------- */
  {
    tipo: "unica", chave: "tentativas",
    titulo: "Quantas vezes você já tentou firmar o braço?",
    opcoes: [
      { t: "Nunca tentei de verdade", v: "0" },
      { t: "Uma ou duas vezes", v: "1" },
      { t: "Várias vezes", v: "2" },
      { t: "Já perdi a conta", v: "3" }
    ]
  },
  {
    tipo: "multipla", chave: "tentou",
    titulo: "O que você já tentou?",
    sub: "Pode marcar mais de uma.",
    opcoes: [
      { t: "Academia", v: "academia" },
      { t: "Vídeos da internet", v: "videos" },
      { t: "Cremes", v: "cremes" },
      { t: "Dieta", v: "dieta" },
      { t: "Procedimento estético", v: "estetica" },
      { t: "Nada ainda", v: "nada" }
    ]
  },
  {
    tipo: "unica", chave: "culpa",
    titulo: "Seja sincera, {nome}: por que você acha que não funcionou?",
    opcoes: [
      { t: "Falta de disciplina", v: "disciplina" },
      { t: "Falta de tempo", v: "tempo" },
      { t: "Não sabia fazer direito", v: "saber" },
      { t: "Cada um fala uma coisa", v: "confusao" }
    ],
    fb: "Guarda essa resposta. A próxima tela vai mudar o jeito que você enxerga isso.",
    fbSempre: true
  },
  {
    tipo: "info",
    sobre: "O que ninguém te contou",
    titulo: "Não foi falta de força de vontade.",
    lista: [
      "Depois dos 35, a queda do estrogênio acelera a perda de músculo, principalmente nos braços.",
      "Você recebeu treinos genéricos, feitos para outro corpo e outra fase.",
      "Cada pessoa falou uma coisa. Ninguém te mostrou o músculo certo."
    ],
    texto: "No dia a dia você só <strong>puxa</strong> (bolsa, porta, celular) e quase nunca <strong>empurra</strong>. O músculo de trás do braço adormece, e a pele sobra.",
    botao: "Entendi, e agora?"
  },
  {
    tipo: "video",
    sobre: "Aula 1 · O músculo dormindo",
    titulo: "Veja o que acontece com a parte de trás do seu braço",
    anim: "mecanismo",
    src: "assets/aula1-musculo-dormindo.mp4", poster: "assets/aula1-capa.jpg",
    rotulo: "VÍDEO: animação do tríceps adormecido acordando (15–30s). Personagem do app.",
    botao: "Continuar"
  },
  {
    tipo: "info",
    sobre: "O segredo de bastidor",
    titulo: "Por que o braço das modelos <em>não balança</em>?",
    texto: "Não é só genética. Nos bastidores, minutos antes de entrar na passarela, elas fazem uma sequência curta que <strong>acorda o tríceps</strong>. É essa sequência que adaptamos para o corpo da mulher depois dos 35.",
    foto: "assets/foto-camarim.webp", fotoAlt: "Modelo no camarim fazendo extensão de braço com garrafinha",
    img: "bastidor",
    imgDesc: "IMAGEM: camarim de desfile, espelho com lâmpadas, modelo fazendo extensão de braço.",
    botao: "Quero conhecer"
  },

  /* ---------- P3 · PROVE (é possível pra ela) ---------- */
  {
    tipo: "unica", chave: "ombro",
    titulo: "Você sente dor ou desconforto no ombro?",
    opcoes: [
      { t: "Não", v: "nao" },
      { t: "Às vezes", v: "asvezes" },
      { t: "Sim, ou tenho tendinite", v: "sim" }
    ],
    fb: {
      nao: "Perfeito, você vai poder seguir a versão completa.",
      asvezes: "Todo exercício tem uma versão leve, sentada ou sem peso. Você vai treinar sem forçar.",
      sim: "Todo exercício tem uma versão leve, sentada ou sem peso. Você vai treinar sem forçar."
    }
  },
  {
    tipo: "unica", chave: "tempo",
    titulo: "Quanto tempo por dia você consegue dedicar a você?",
    opcoes: [
      { t: "10 minutos", v: "10" },
      { t: "15 minutos", v: "15" },
      { t: "20 minutos", v: "20" },
      { t: "Depende do dia", v: "varia" }
    ],
    fb: "O método começa com 10 minutos por dia. Cabe na sua rotina."
  },
  {
    tipo: "unica", chave: "bombada",
    titulo: "Você tem medo de ficar com o braço “bombado”?",
    opcoes: [
      { t: "Sim, muito", v: "muito" },
      { t: "Um pouco", v: "pouco" },
      { t: "Não", v: "nao" }
    ],
    fb: "Sem carga pesada não tem como ficar bombada. O peso aqui é só uma garrafinha d'água."
  },
  {
    tipo: "video",
    sobre: "Dia 1 · Pulsinhos pra trás",
    titulo: "Esse é o primeiro exercício do método",
    sub: "Viu? Dá pra fazer em pé ou sentada, na sala de casa.",
    anim: "aula",
    src: "assets/dia1-pulsinhos.mp4", poster: "assets/dia1-capa.jpg",
    rotulo: "VÍDEO: trecho real da aula do Dia 1 (6s em loop), personagem do app.",
    botao: "Continuar"
  },
  {
    tipo: "depoimentos",
    sobre: "Quem já está na turma",
    titulo: "Mulheres como você",
    itens: [
      { foto: "assets/depo-rosangela.jpg", quem: "Rosângela, 49 anos", data: "12 de novembro", texto: "Hoje completei uma semana! Até separei uma garrafinha só pro treino 😂 Tô feliz de ter conseguido encaixar as aulas na minha rotina." },
      { foto: "assets/depo-patricia.jpg", quem: "Patrícia, 42 anos", data: "19 de novembro", texto: "Vou começar amanhã! Já deixei a garrafinha na mesa pra lembrar. Tô animada pra fazer a primeira aula em casa." },
      { foto: "assets/depo-marcia.jpg", quem: "Márcia, 56 anos", data: "26 de novembro", texto: "Garrafinha pronta por aqui 😊 Amanhã começo o Dia 1. Tô animada pra testar a aula e ver como é." }
    ],
    botao: "Continuar"
  },

  /* ---------- DADOS TÉCNICOS (IMC e rotina) ---------- */
  {
    tipo: "info",
    sobre: "Diagnóstico técnico",
    titulo: "Agora, alguns dados para o seu <em>diagnóstico</em>",
    texto: "Com sua altura, peso e rotina, calculamos o seu <strong>IMC</strong> e ajustamos a intensidade do plano ao seu corpo. Leva 20 segundos.",
    botao: "Vamos lá"
  },
  {
    tipo: "numero", chave: "altura",
    titulo: "Qual é a sua altura?",
    unidade: "cm", min: 130, max: 210, placeholder: "Ex.: 162"
  },
  {
    tipo: "numero", chave: "peso",
    titulo: "E o seu peso atual?",
    sub: "Fica só entre nós. Usamos para calcular seu IMC.",
    unidade: "kg", min: 35, max: 220, placeholder: "Ex.: 70"
  },
  {
    tipo: "unica", chave: "rotina",
    titulo: "Como é o seu esforço físico no dia a dia?",
    opcoes: [
      { e: "🛋️", t: "Passo a maior parte do dia sentada", v: "sedentaria" },
      { e: "🧺", t: "Ando um pouco e faço tarefas de casa", v: "leve" },
      { e: "🚶‍♀️", t: "Caminho ou me exercito 1 a 2x por semana", v: "moderada" },
      { e: "🏃‍♀️", t: "Me exercito 3x ou mais por semana", v: "ativa" }
    ],
    fb: "Anotado. Isso define o ritmo da sua Fase 1."
  },
  {
    tipo: "unica", chave: "sono",
    titulo: "Quantas horas você costuma dormir por noite?",
    opcoes: [
      { t: "Menos de 6 horas", v: "pouco" },
      { t: "De 6 a 7 horas", v: "medio" },
      { t: "8 horas ou mais", v: "bom" }
    ],
    fb: "É no descanso que o músculo se recupera. Vamos considerar isso no seu plano."
  },

  /* ---------- P4 · PUSH (data e decisão) ---------- */
  {
    tipo: "unica", chave: "data",
    titulo: "Para quando você quer o braço mais firme?",
    opcoes: [
      { e: "🥂", t: "Réveillon", v: "reveillon" },
      { e: "🎉", t: "Carnaval", v: "carnaval" },
      { e: "💍", t: "Uma festa ou casamento", v: "festa" },
      { e: "🤍", t: "Só quero me sentir bem", v: "bem" }
    ]
  },
  {
    tipo: "unica", chave: "mudaria",
    titulo: "{nome}, se o seu braço estivesse mais firme nessa data, o que mudaria pra você?",
    opcoes: [
      { t: "Usaria a roupa que eu quisesse", v: "roupa" },
      { t: "Tiraria fotos sem medo", v: "fotos" },
      { t: "Me sentiria mais confiante", v: "confianca" },
      { t: "Tudo isso", v: "tudo" }
    ],
    fb: "Então vamos cuidar disso juntas.",
    fbSempre: true
  },
  {
    tipo: "unica", chave: "pronta",
    titulo: "Você está disposta a se dedicar 21 dias por você?",
    opcoes: [
      { t: "Sim, estou pronta", v: "sim" },
      { t: "Sim, se for algo simples", v: "simples" }
    ]
  },

  /* ---------- CARREGAMENTO E RESULTADO ---------- */
  {
    tipo: "carregando",
    titulo: "{nome}, estamos montando o seu diagnóstico…",
    video: "assets/vsl.mp4", poster: "assets/vsl-capa.jpg",
    ctaEm: 44,                       // segundo do vídeo em que o diagnóstico termina e o botão aparece
    botao: "Quero minha vaga",
    etapas: [
      "Analisando seu perfil e sua idade",
      "Calculando seu IMC",
      "Avaliando sua rotina e seu sono",
      "Medindo o nível do seu tríceps",
      "Adaptando os exercícios ao seu ombro",
      "Montando seu plano de 21 dias"
    ],
    pausa: {
      titulo: "As vagas desta turma são limitadas",
      texto: "Se a turma lotar, você terá que esperar a próxima abertura.",
      botao: "Continuar assistindo"
    }
  },
  { tipo: "resultado" }
];
