// Gera o vídeo do criativo: node criativo/render.js [saida.mp4]
// Quadro a quadro (30 fps, 1080x1920) + trilha de efeitos (teclas, envio, recebimento, final).
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path');

const FPS = 30, W = 405, H = 720, SCALE = 1080 / 405;
const OUT = path.resolve(process.argv[2] || path.join(__dirname, 'out', 'criativo.mp4'));
const TMP = path.join(__dirname, 'out');

function wav(events, total, ctaAt, file) {
  const sr = 44100, n = Math.ceil(total * sr), buf = new Float32Array(n);
  let seed = 3; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const add = (t0, len, fn) => { const s = Math.floor(t0 * sr); for (let i = 0; i < len * sr && s + i < n; i++) buf[s + i] += fn(i / sr); };
  for (const e of events) {
    if (e.type === 'key') { let prev = 0; add(e.t, 0.022, x => { const v = (rnd() * 2 - 1); const o = (v - prev) * 0.5; prev = v; return o * 0.22 * Math.exp(-x * 220); }); }
    if (e.type === 'send') add(e.t, 0.2, x => Math.sin(2 * Math.PI * (300 * x + 2400 * x * x)) * 0.16 * Math.sin(Math.PI * x / 0.2));
    if (e.type === 'recv') { add(e.t, 0.09, x => Math.sin(2 * Math.PI * 1046 * x) * 0.22 * Math.exp(-x * 40)); add(e.t + 0.06, 0.12, x => Math.sin(2 * Math.PI * 1568 * x) * 0.2 * Math.exp(-x * 35)); }
  }
  [784, 988, 1175].forEach((f, k) => add(ctaAt + k * 0.07, 1.2, x => Math.sin(2 * Math.PI * f * x) * 0.12 * Math.exp(-x * 3.5)));
  const out = Buffer.alloc(44 + n * 2);
  out.write('RIFF', 0); out.writeUInt32LE(36 + n * 2, 4); out.write('WAVEfmt ', 8); out.writeUInt32LE(16, 16); out.writeUInt16LE(1, 20); out.writeUInt16LE(1, 22);
  out.writeUInt32LE(sr, 24); out.writeUInt32LE(sr * 2, 28); out.writeUInt16LE(2, 32); out.writeUInt16LE(16, 34); out.write('data', 36); out.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) out.writeInt16LE(Math.max(-1, Math.min(1, buf[i])) * 32767 | 0, 44 + i * 2);
  fs.writeFileSync(file, out);
}

(async () => {
  fs.mkdirSync(TMP, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: SCALE });
  await p.goto('file://' + path.join(__dirname, 'index.html'));
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))));
  await p.waitForTimeout(300);
  await p.evaluate(() => measure());
  const tl = await p.evaluate(() => window.TIMELINE);
  const frames = Math.round(tl.total * FPS);
  const audio = path.join(TMP, 'sons.wav'); wav(tl.events, tl.total, tl.ctaAt, audio);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-i', audio,
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS), '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', OUT], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = 0; f < frames; f++) {
    await p.evaluate(t => renderAt(t), f / FPS);
    const img = await p.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(img)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 90 === 0) console.log(`quadro ${f}/${frames}`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await b.close();
  console.log('pronto:', OUT, `(${tl.total.toFixed(1)} s)`);
})();
