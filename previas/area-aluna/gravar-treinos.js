// Grava os vídeos dos dias passados como argumento: node rectreino.js 1 2 3
const { chromium } = require('playwright');
const fs = require('fs');
const { execFileSync } = require('child_process');
(async () => {
  const dias = process.argv.slice(2).map(Number);
  fs.mkdirSync('treinos', { recursive: true });
  const b = await chromium.launch();
  for (const d of dias) {
    const ctx = await b.newContext({ viewport: { width: 720, height: 1280 }, recordVideo: { dir: 'rec_tmp', size: { width: 720, height: 1280 } } });
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', e => errs.push(e.message));
    await p.goto('file://' + process.cwd() + '/area/treino.html?dia=' + d);
    await p.waitForTimeout(400);
    const dur = await p.evaluate(() => window.DURACAO);
    await p.waitForTimeout(dur + 300);
    const v = p.video();
    await ctx.close();
    const raw = await v.path();
    const nome = 'treinos/dia-' + String(d).padStart(2, '0') + '.mp4';
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', '0.7', '-i', raw, '-t', String(dur / 1000), '-c:v', 'libx264', '-preset', 'medium', '-crf', '26', '-pix_fmt', 'yuv420p', '-r', '30', '-movflags', '+faststart', nome]);
    fs.unlinkSync(raw);
    // quadros de conferência: abertura, meio e fim
    const tira = [];
    for (const t of [1.5, dur / 2000, dur / 1000 - 1]) {
      const f = 'chk_' + d + '_' + tira.length + '.png';
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', String(t), '-i', nome, '-frames:v', '1', '-vf', 'scale=180:-1', f]);
      tira.push(f);
    }
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...tira.flatMap(f => ['-i', f]), '-filter_complex', 'hstack=3', 'chk_dia' + d + '.png']);
    tira.forEach(f => fs.unlinkSync(f));
    console.log('dia', d, 'dur', dur, 'errs', errs.length ? errs : 'nenhum');
  }
  await b.close();
})();
