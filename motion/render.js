// node motion/render.js asmr|presepio  ->  motion/out/<nome>.mp4  (1080x1920, 30 fps)
// Antes: extraia os quadros dos clipes (veja LEIA-ME.md).
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const fs = require('fs'), path = require('path');
const NAME = process.argv[2] || 'asmr', FPS = 30, DIR = __dirname;
const OUT = path.join(DIR, 'out', NAME + '.mp4'), SILENT = path.join(DIR, 'out', NAME + '-video.mp4');
const SRC = { c1: path.join(DIR, 'src', 'asmr-clipe1.mp4'), c2: path.join(DIR, 'src', 'asmr-clipe2.mp4') };

function chime(file, total, at) {
  const sr = 44100, n = Math.ceil(total * sr), b = new Float32Array(n);
  const add = (t0, len, fn) => { const s = Math.floor(t0 * sr); for (let i = 0; i < len * sr && s + i < n; i++) b[s + i] += fn(i / sr); };
  [784, 988, 1175, 1568].forEach((f, k) => add(at + k * 0.08, 1.6, x => Math.sin(2 * Math.PI * f * x) * 0.1 * Math.exp(-x * 3)));
  const o = Buffer.alloc(44 + n * 2);
  o.write('RIFF', 0); o.writeUInt32LE(36 + n * 2, 4); o.write('WAVEfmt ', 8); o.writeUInt32LE(16, 16); o.writeUInt16LE(1, 20); o.writeUInt16LE(1, 22);
  o.writeUInt32LE(sr, 24); o.writeUInt32LE(sr * 2, 28); o.writeUInt16LE(2, 32); o.writeUInt16LE(16, 34); o.write('data', 36); o.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) o.writeInt16LE(Math.max(-1, Math.min(1, b[i])) * 32767 | 0, 44 + i * 2);
  fs.writeFileSync(file, o);
}

(async () => {
  fs.mkdirSync(path.join(DIR, 'out'), { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 405, height: 720 }, deviceScaleFactor: 1080 / 405 });
  await p.goto('file://' + path.join(DIR, 'index.html') + '?v=' + NAME);
  await p.evaluate(() => document.fonts.ready);
  const tl = await p.evaluate(() => window.TIMELINE);
  const frames = Math.round(tl.total * FPS);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', SILENT], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = 0; f < frames; f++) {
    await p.evaluate(t => renderAt(t), f / FPS);
    const img = await p.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(img)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 150 === 0) console.log(`${NAME}: quadro ${f}/${frames}`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close();

  // áudio: som real dos clipes (normalizado) + sino no final
  const ch = path.join(DIR, 'out', NAME + '-sino.wav'); chime(ch, tl.total, tl.ctaAt);
  const args = ['-y', '-loglevel', 'error', '-i', SILENT, '-i', ch]; const filt = []; const mix = ['[1:a]'];
  tl.clips.forEach((c, i) => {
    args.push('-i', SRC[c.clip]);
    const ms = Math.round(c.at * 1000);
    filt.push(`[${i + 2}:a]atrim=${c.from}:${(c.from + c.dur).toFixed(3)},asetpts=PTS-STARTPTS,volume=18dB,afade=t=in:d=0.08,afade=t=out:st=${(c.dur - 0.12).toFixed(3)}:d=0.12,adelay=${ms}|${ms}[a${i}]`);
    mix.push(`[a${i}]`);
  });
  filt.push(`${mix.join('')}amix=inputs=${mix.length}:normalize=0,alimiter=limit=0.9,apad,atrim=0:${tl.total.toFixed(3)}[aout]`);
  args.push('-filter_complex', filt.join(';'), '-map', '0:v', '-map', '[aout]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', OUT);
  execFileSync('ffmpeg', args, { stdio: 'inherit' });
  fs.unlinkSync(SILENT); fs.unlinkSync(ch);
  console.log('pronto:', OUT, `(${tl.total.toFixed(1)} s)`);
})();
