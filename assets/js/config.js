/**
 * Configuração central do Ateliê de Natal.
 * Edite SOMENTE este arquivo para ajustar datas, preços e links.
 */
window.ATELIE_CONFIG = {
  // Fim da promoção, igual para todos os visitantes (formato ISO com fuso de Brasília).
  // Depois dessa data a página mostra só o preço cheio e a árvore some.
  promoEnd: "2026-12-24T23:59:00-03:00",
  promoEndLabel: "24/12 às 23:59",

  // Preços (em reais). O valor cheio só deve aparecer se o preço realmente voltar a ele após a data.
  fullPrice: 167,
  promoPrice: 37.9,

  // Links dos checkouts externos (Cakto, Hotmart ou Kiwify). Order bump é configurado na plataforma.
  checkoutFullUrl: "", // checkout com preço cheio (R$ 167)
  checkoutPromoUrl: "", // checkout com preço promo (R$ 37,90)

  // Order bump (Ceia sem Estresse). Deixe null para esconder o preço na página.
  bumpPrice: 9.9,

  // Meta Pixel (ID numérico). Vazio = nenhum rastreamento é carregado.
  pixelId: "",
  // Endpoint da API de Conversões (função em /api/capi). Vazio = só Pixel no navegador.
  capiEndpoint: "/api/capi"
};
