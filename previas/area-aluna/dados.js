(function () {
/* Dados do treino (gerado a partir da área da aluna) */
  /* ---------- Biblioteca de exercícios ---------- */
  var EX = {
    pulsinho:  { nome: "Pulsinhos pra trás", pose: "pulsinho", como: "Em pé, braços esticados ao lado do corpo, palmas viradas para trás. Leve os braços um pouco para trás e faça pulsos curtos.", dica: "O movimento é pequeno. Pense em apertar a parte de trás do braço.", leve: "Sentada na beira da cadeira." },
    circulos:  { nome: "Círculos de braço", pose: "circulos", como: "Braços abertos na altura do ombro. Faça círculos pequenos para trás.", dica: "Ombros longe das orelhas, abdômen firme.", leve: "Braços mais baixos e círculos menores." },
    tchauinv:  { nome: "Tchauzinho invertido", pose: "tchauinv", como: "Tronco levemente inclinado, braços esticados para trás e palmas para cima. Suba e desça as mãos como se desse tchau para trás.", dica: "Mantenha os cotovelos esticados o tempo todo.", leve: "Sentada, um braço de cada vez." },
    parede:    { nome: "Flexão na parede", pose: "parede", como: "Mãos na parede na altura do peito e cotovelos colados ao corpo. Desça o peito até a parede e empurre.", dica: "Cotovelos apontando para trás, não para os lados: assim o tríceps trabalha.", leve: "Pés mais perto da parede.", perfil: true },
    cadeira:   { nome: "Tríceps na cadeira", pose: "coice", como: "Mãos na borda de uma cadeira firme e joelhos dobrados. Desça o quadril de 5 a 10 cm dobrando os cotovelos e suba.", dica: "Desça pouco. Se sentir o ombro, pare e troque pelo coice.", leve: "Desça só a metade, com os pés bem perto da cadeira.", perfil: true, ombro: "coice" },
    coice:     { nome: "Coice com garrafa", pose: "coice", garrafa: true, como: "Tronco inclinado à frente e cotovelo colado na cintura. Estenda o antebraço para trás até o braço ficar reto.", dica: "Só o antebraço se mexe. O cotovelo fica parado.", leve: "Sem garrafa, com a outra mão apoiada na mesa." },
    extensao:  { nome: "Extensão acima da cabeça", pose: "extensao", garrafa: true, como: "Garrafa com as duas mãos acima da cabeça e cotovelos apontando para o teto. Desça a garrafa atrás da cabeça e suba.", dica: "Cotovelos perto da cabeça, sem abrir.", leve: "Sentada, sem garrafa, um braço de cada vez.", ombro: "coice" },
    lateral:   { nome: "Elevação lateral", pose: "lateral", garrafa: true, como: "Uma garrafa em cada mão. Suba os braços pelos lados até a altura do ombro.", dica: "Suba devagar e desça mais devagar ainda.", leve: "Sem garrafa, subindo até a metade." },
    desenv:    { nome: "Desenvolvimento", pose: "desenvolvimento", garrafa: true, como: "Garrafas na altura dos ombros. Empurre para cima até esticar e volte.", dica: "Não trave os cotovelos lá em cima.", leve: "Sentada, sem garrafa." },
    rosca:     { nome: "Rosca com garrafa", pose: "puxar", garrafa: true, como: "Cotovelos colados no corpo. Dobre levando a garrafa até o ombro.", dica: "Sem balançar o corpo.", leve: "Sem garrafa." },
    abraco:    { nome: "Abraço deitada", pose: "abraco", garrafa: true, como: "Deitada de barriga para cima, braços abertos com garrafas. Feche os braços como num abraço acima do peito.", dica: "Cotovelos levemente dobrados.", leve: "Sem garrafa.", perfil: true },
    prancha:   { nome: "Prancha com toque no ombro", pose: "comemorar", como: "Em prancha com os braços esticados, toque a mão no ombro oposto, alternando.", dica: "Quadril parado, sem rebolar.", leve: "De joelhos, ou de pé com as mãos na parede.", perfil: true }
  };

  /* ---------- Os 21 dias: [exercício, séries, repetições] ---------- */
  var F = { 1: { nome: "Acordar", min: 10, desc: 30, cor: "f1" }, 2: { nome: "Firmar", min: 15, desc: 40, cor: "f2" }, 3: { nome: "Desenhar", min: 20, desc: 20, cor: "f3" } };
  var DIAS = {
    1: [["pulsinho",2,"15"],["circulos",2,"30s"],["parede",2,"8"],["tchauinv",2,"12"]],
    2: [["pulsinho",2,"15"],["tchauinv",2,"12"],["parede",2,"10"],["coice",2,"10 por braço",1]],
    3: [["circulos",2,"30s"],["coice",2,"12 por braço",1],["extensao",2,"10",1],["pulsinho",2,"20"]],
    4: [["parede",2,"10"],["cadeira",2,"6"],["tchauinv",2,"15"],["circulos",2,"30s"]],
    5: [["pulsinho",3,"15"],["coice",3,"12 por braço",1],["parede",2,"12"],["abraco",2,"12",1]],
    6: [["extensao",3,"10",1],["cadeira",2,"8"],["pulsinho",3,"20"],["circulos",2,"40s"]],
    8: [["coice",3,"10 por braço"],["extensao",3,"10"],["pulsinho",3,"20"],["parede",3,"10"],["lateral",2,"10"]],
    9: [["desenv",3,"10"],["coice",3,"12 por braço"],["cadeira",3,"8"],["tchauinv",3,"15"],["rosca",2,"12"]],
    10: [["extensao",3,"12"],["abraco",3,"12"],["parede",3,"12"],["pulsinho",3,"25"],["lateral",3,"10"]],
    11: [["coice",3,"12 por braço"],["desenv",3,"12"],["cadeira",3,"10"],["rosca",3,"12"],["circulos",2,"40s"]],
    12: [["extensao",3,"12"],["coice",3,"15 por braço"],["lateral",3,"12"],["abraco",3,"15"],["pulsinho",3,"25"]],
    13: [["cadeira",3,"12"],["extensao",3,"15"],["parede",3,"15"],["desenv",3,"12"],["tchauinv",3,"20"]]
  };
  var CIRC = {
    A: [["coice","12 por braço"],["extensao","12"],["prancha","6 por lado"],["lateral","12"],["pulsinho","30s"],["parede","12"]],
    B: [["cadeira","10"],["desenv","12"],["abraco","15"],["rosca","12"],["tchauinv","30s"],["circulos","30s"]],
    C: [["extensao","15"],["coice","15 por braço"],["prancha","8 por lado"],["cadeira","12"],["desenv","12"],["pulsinho","40s"]]
  };
  function mais(lista, n) { return lista.map(function (e) { return [e[0], e[1].replace(/^(\d+)(s?)/, function (m, num, seg) { return (+num + (seg ? 5 : n)) + seg; })]; }); }
  var CIRC_DIA = { 15: ["A", CIRC.A], 16: ["B", CIRC.B], 17: ["A +2", mais(CIRC.A, 2)], 18: ["B +2", mais(CIRC.B, 2)], 19: ["C", CIRC.C], 20: ["C · grande final", CIRC.C] };
  var FRASES = [
    "Hoje é o primeiro passo. O resto vem com constância.",
    "Seu tríceps está acordando. Continue.",
    "Dez minutos por dia mudam o que um mês de pressa não muda.",
    "Feito é melhor que perfeito.",
    "Você está fazendo algo só por você. Isso já é muito.",
    "O braço firme começa na decisão de hoje.",
    "Uma semana! Olhe para trás e veja o quanto já fez.",
    "Agora entra a garrafinha. Você está pronta.",
    "Força não é idade. É hábito.",
    "Cada repetição conta, mesmo as difíceis.",
    "Seu corpo responde a quem cuida dele.",
    "Metade do caminho. Não pare agora.",
    "O espelho vai notar antes de você.",
    "Duas semanas de cuidado. Orgulhe-se.",
    "Fase final: agora a gente desenha o contorno.",
    "Mais rápido, mais firme, mais você.",
    "Você já é outra mulher em relação ao dia 1.",
    "Constância é o segredo que ninguém conta.",
    "Faltam poucos dias. Sinta a diferença.",
    "Grande final! Dê tudo de você hoje.",
    "Você conseguiu. Esse braço é conquista sua."
  ];
  var BONUS = [
    { ic: "👋", nome: "Teste do Tchauzinho", desc: "Gordura ou músculo dormindo? Descubra em 2 minutos." },
    { ic: "🗓️", nome: "Calendário dos 21 dias", desc: "Para imprimir e colar na geladeira." },
    { ic: "🌸", nome: "Firme sem ficar bombada", desc: "Por que a garrafinha não deixa seu braço grande." },
    { ic: "🥗", nome: "Cardápio simples", desc: "Refeições fáceis para um déficit calórico leve." }
  ];


  function fase(d) { return d <= 7 ? 1 : d <= 14 ? 2 : 3; }
  function espelho(d) { return d === 7 || d === 14 || d === 21; }
  function listaDoDia(d) {
    if (CIRC_DIA[d]) return CIRC_DIA[d][1].map(function (e) { return { id: e[0], series: "3 rodadas", reps: e[1], semGarrafa: false }; });
    return (DIAS[d] || []).map(function (e) { return { id: e[0], series: e[1] + " séries", reps: e[2], semGarrafa: !!e[3] || fase(d) === 1 }; });
  }
  window.TREINO = { EX: EX, F: F, DIAS: DIAS, CIRC_DIA: CIRC_DIA, FRASES: FRASES, fase: fase, espelho: espelho, listaDoDia: listaDoDia };
})();
