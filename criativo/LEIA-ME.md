# Criativo "grupo das amigas"

Tela de conversa em iPhone, 1080x1920, 30 fps, cerca de 30 s.

- Textos e ordem das mensagens: `criativo/roteiro.js`
- Fotos: troque `criativo/fotos/carla.jpg`, `dani.jpg` e `bianca.jpg` (verticais, 3:4) pelas suas, com o mesmo nome.
- Se mudar emojis no roteiro: `python3 criativo/emojis.py <pasta img/google/64 do pacote emoji-datasource-google>`
- Gerar o vídeo: `node criativo/render.js` (requer Playwright e ffmpeg) -> `criativo/out/criativo.mp4`
