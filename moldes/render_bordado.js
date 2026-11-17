// node moldes/render_bordado.js [E01,E02,001]  ->  motion/out/bordando.mp4 (1080x1920, 30 fps, sem áudio)
const { chromium } = require('playwright'); const { spawn } = require('child_process'); const path = require('path');
(async () => {
  const codes = JSON.stringify((process.argv[2] || 'E01,E02,001').split(','));
  const OUT = path.join(__dirname, '..', 'motion', 'out', 'bordando.mp4'), FPS = 30;
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 405, height: 720 }, deviceScaleFactor: 1080 / 405 });
  await p.goto('http://localhost:' + (process.env.PORT || 8123) + '/moldes/bordado.html?p=' + encodeURIComponent(codes)); // precisa de um servidor local na raiz do projeto
  await p.evaluate(() => window.ready()); await p.waitForTimeout(500);
  const total = await p.evaluate(() => TIMELINE.total), n = Math.round(total * FPS);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', OUT], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = 0; f < n; f++) {
    await p.evaluate(t => renderAt(t), f / FPS);
    const img = await p.screenshot({ type: 'jpeg', quality: 93 });
    if (!ff.stdin.write(img)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close(); console.log('pronto:', OUT, total + ' s');
})();
