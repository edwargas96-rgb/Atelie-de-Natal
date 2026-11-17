# Motions (ASMR e presépio)

- Roteiros e legendas: `motion/videos.js`
- Clipes originais em `motion/src/` (uso autorizado pelo dono do projeto).
- Extrair quadros (uma vez):
  `ffmpeg -i motion/src/asmr-clipe1.mp4 -vf fps=30,scale=1080:1920 -q:v 3 motion/frames/c1/%05d.jpg`
  `ffmpeg -i motion/src/asmr-clipe2.mp4 -vf fps=30,scale=1080:1920 -q:v 3 motion/frames/c2/%05d.jpg`
- Gerar: `node motion/render.js asmr` e `node motion/render.js presepio` -> `motion/out/`
