/**
 * Configuração central do Ateliê de Natal.
 * Edite SOMENTE este arquivo para ajustar datas, preços e links.
 */
window.ATELIE_CONFIG = {
  // Fim da promoção, igual para todos os visitantes (formato ISO com fuso de Brasília).
  // Depois dessa data a página mostra só o preço cheio e a árvore some.
  promoEnd: "2026-12-26T23:59:00-03:00",
  promoEndLabel: "26/12 às 23:59",

  // Preços (em reais). O valor cheio só deve aparecer se o preço realmente voltar a ele após a data.
  fullPrice: 167,
  promoPrice: 37.9,
  // Valores de referência mostrados na tabela da oferta (a soma deve dar o fullPrice).
  kitValue: 97,
  bonusValue: 70,

  // Natal: a oferta mostra "Faltam X dias para o Natal" até esta data e depois esconde a contagem.
  christmasDate: "2026-12-25T00:00:00-03:00",

  // Links dos checkouts externos (Cakto, Hotmart ou Kiwify). Qualquer extra de checkout é configurado na plataforma.
  checkoutFullUrl: "", // checkout com preço cheio (R$ 167)
  checkoutPromoUrl: "", // checkout com preço promo (R$ 37,90)

  // Árvore: segundos com a seção visível, sem toque, até um presente abrir sozinho (0 desliga).
  autoOpenSeconds: 6,

  // Parâmetros da URL repassados ao checkout (ficam guardados durante a visita).
  trackingParams: ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "src", "sck"],


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

  // Suporte por WhatsApp: número com DDI e DDD, só dígitos (ex.: "5511999999999"). Vazio = botão não aparece.
  whatsappNumber: "",
  whatsappMessage: "Olá! Tenho uma dúvida sobre o Ateliê de Natal.",

  // Meta Pixel (ID numérico). Vazio = nenhum rastreamento é carregado.
  // Eventos: PageView, ViewContent (oferta na tela), InitiateCheckout (clique de compra),
  // e os próprios GiftOpened, VSLPlay, VSL50 e VSLComplete. O mesmo event_id vai para o capiEndpoint.
  pixelId: "",
  // Endpoint da API de Conversões (função em /api/capi). Vazio = só Pixel no navegador.
  capiEndpoint: "/api/capi"
};
