# Ateliê de Natal — página de vendas

Site estático (HTML + CSS + JS, sem build). Publique em qualquer hospedagem estática; a pasta `api/` é uma função serverless (Vercel) para a API de Conversões.

## Configuração
Tudo em `assets/js/config.js`: data de fim da promo, preços, links dos 2 checkouts, preço do bump, ID do Pixel e amostras.

## Meta Pixel e CAPI
- `PageView`, `ViewContent` (ao ver a oferta), `InitiateCheckout` (clique em comprar) e o evento próprio `PresenteAberto`, com `event_id` igual no navegador e no servidor (deduplicação).
- Servidor: defina `META_PIXEL_ID`, `META_CAPI_TOKEN` (e `META_TEST_EVENT_CODE` para testes) nas variáveis de ambiente.
- `Purchase`: ative a integração de Pixel/CAPI da própria plataforma de checkout (Cakto/Hotmart/Kiwify), que envia a compra com o valor correto.

## Pendências do Eduardo
Links dos checkouts, data real da promo, `bonus-2.webp` e `bump.webp`, amostras (`assets/amostras/amostra-1..6.pdf/.webp`), textos finais de garantia, licença e rodapé (placeholders em `termos.html` e `privacidade.html`), e-mail de contato (`index.html`).

## Comportamento da promo
Depois de `promoEnd` a página recarrega sozinha, a árvore some e só aparece o preço cheio.
