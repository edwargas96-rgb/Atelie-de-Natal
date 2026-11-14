// node moldes/render_lote.js <lote>  -> PDFs em moldes/saida/ e folha de revisão em moldes/lotes/lote-NN.png
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
(async () => {
  const lote = process.argv[2]; const build = path.join(__dirname, 'build'), out = path.join(__dirname, 'saida'), lotes = path.join(__dirname, 'lotes');
  fs.mkdirSync(out, { recursive: true }); fs.mkdirSync(lotes, { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 1 });
  const files = fs.readdirSync(build).filter(f => f.endsWith('.html')).sort(); const shots = [];
  for (const f of files) {
    await p.goto('file://' + path.join(build, f)); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(150);
    const n = f.replace('.html', '');
    await p.pdf({ path: path.join(out, n + '.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
    const clip = { x: 44, y: 230, width: 400, height: 565 };
    shots.push(`data:image/png;base64,` + (await p.screenshot({ clip })).toString('base64'));
  }
  const html = `<body style="margin:0;background:#eee;width:2050px;display:flex;flex-wrap:wrap;gap:6px;padding:6px">` +
    shots.map((s, i) => `<div style="position:relative"><img src="${s}" width="400"><b style="position:absolute;left:6px;top:4px;font:700 18px sans-serif;background:#fff;padding:1px 6px">${files[i].replace('.html', '')}</b></div>`).join('') + `</body>`;
  const q = await b.newPage({ viewport: { width: 2050, height: 900 } }); await q.setContent(html); await q.waitForTimeout(400);
  await q.screenshot({ path: path.join(lotes, `lote-${String(lote).padStart(2, '0')}.png`), fullPage: true });
  await b.close(); console.log('ok', files.length);
})();
