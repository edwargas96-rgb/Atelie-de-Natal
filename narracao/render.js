// node narracao/render.js <cena> [com-audio inicio]  ->  narracao/out/<cena>.mp4 (1080x1920, 30 fps, sem som)
//      node narracao/render.js <cena> --quadros 1,4.2,7  ->  PNGs para conferir
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const fs = require('fs'), path = require('path');
const NAME = process.argv[2] || 'conta', FPS = 30, DIR = __dirname, OUT = path.join(DIR, 'out');
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => console.log('ERRO', e.message));
  await p.goto('file://' + path.join(DIR, 'index.html') + '?c=' + NAME);
  await p.evaluate(() => document.fonts.ready);
  const tl = await p.evaluate(() => window.TIMELINE);
  if (process.argv[3] === '--quadros') {
    for (const t of process.argv[4].split(',').map(Number)) { await p.evaluate(t => renderAt(t), t); await p.screenshot({ path: path.join(OUT, `${NAME}-${t}.png`) }); }
    await b.close(); return;
  }
  const mp4 = path.join(OUT, NAME + '.mp4'), frames = Math.round(tl.total * FPS);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4]);
  for (let f = 0; f < frames; f++) {
    await p.evaluate(t => renderAt(t), f / FPS);
    const img = await p.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(img)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close();
  if (process.argv[3] != null) { // versão de conferência com a narração por cima
    const ini = process.argv[3], prev = path.join(OUT, NAME + '-com-audio.mp4');
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', mp4, '-ss', ini, '-t', String(tl.total), '-i', path.join(DIR, 'narracao.mp3'), '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-shortest', prev]);
  }
  console.log('pronto', mp4, tl.total + ' s');
})();
