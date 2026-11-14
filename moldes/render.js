// Renderiza moldes/build/*.html em PNG (prévia) e PDF (A4 para impressão).
// Uso: node moldes/render.js   (requer playwright)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const build = path.join(__dirname, 'build'), out = path.join(__dirname, 'previas');
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 2 });
  for (const f of fs.readdirSync(build).filter(f => f.endsWith('.html'))) {
    await p.goto('file://' + path.join(build, f));
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(300);
    const name = f.replace('.html', '');
    await p.screenshot({ path: path.join(out, name + '.png') });
    await p.pdf({ path: path.join(out, name + '.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
    console.log('ok', name);
  }
  await b.close();
})();
