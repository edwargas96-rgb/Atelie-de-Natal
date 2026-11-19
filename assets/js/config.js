/**
 * Configuração central do Ateliê de Natal.
 * Edite SOMENTE este arquivo para ajustar datas, preços e links.
 */
window.ATELIE_CONFIG = {
  // Fim da promoção, igual para todos os visitantes (formato ISO com fuso de Brasília).
  // Depois dessa data a página mostra só o preço cheio e a árvore some.
  promoEnd: "2026-12-24T23:59:59-03:00",
  promoEndLabel: "24/12 às 23:59",

  // Contagem regressiva do topo e do botão de compra: até a véspera de Natal (data real e igual para todos).
  countdownEnd: "2026-12-24T23:59:59-03:00", // mesma data do fim da promoção (promoEnd)

  // Árvore: segundos com a seção visível, sem toque, até um presente abrir sozinho (0 desliga).
  autoOpenSeconds: 6,

  // Preços (em reais). O valor cheio só deve aparecer se o preço realmente voltar a ele após a data.
  fullPrice: 97,
  promoPrice: 27.9,

  // Links dos checkouts externos (Cakto, Hotmart ou Kiwify). Qualquer extra de checkout é configurado na plataforma.
  checkoutFullUrl: "", // checkout com preço cheio (R$ 97)
  checkoutPromoUrl: "https://pay.wiapy.com/fUEKRQ6UwOt", // checkout com preço promo (R$ 27,90)


  // Vídeo da mini VSL (vertical 9:16). Para trocar, substitua os arquivos ou aponte para outros. Vazio = seção escondida.
  vslVideo: "assets/video/vsl.mp4",
  vslPoster: "assets/video/vsl-poster.webp",

  // Prova social: só preencha com prints/fotos REAIS, com autorização de quem enviou.
  // Ex.: { img: "assets/prova/1.webp", alt: "Conversa com cliente mostrando o calendário bordado" }
  proofs: [
    { img: "assets/prova/1.webp", alt: "Conversa: Ana Lúcia e o neto montando a decoração da mesa da ceia com os moldes bordados" },
    { img: "assets/prova/2.webp", alt: "Conversa: Maria Helena mostrando o calendário do advento bordado na parede" },
    { img: "assets/prova/3.webp", alt: "Conversa: Renata e Carlos mostrando a decoração da mesa da ceia de Natal" },
    { img: "assets/prova/4.webp", alt: "Conversa: Marcos e Júlia mostrando enfeites de árvore bordados em casa" },
    { img: "assets/prova/5.webp", alt: "Conversa: Marcelo mostrando as etiquetas e o cartão que está bordando" }
  ],

  // Meta Pixel (ID numérico). Vazio = nenhum rastreamento é carregado.
  pixelId: "1014861567617309",
  // Endpoint da API de Conversões (função em /api/capi). Vazio = só Pixel no navegador.
  capiEndpoint: "/api/capi"
};
