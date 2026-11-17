// node moldes/pdf_html.js <entrada.html> <saida.pdf>: converte um HTML em PDF A4
const { chromium } = require('playwright');
(async () => {
  const [src, out] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto('file://' + require('path').resolve(src));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(200);
  await p.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true });
  await b.close();
})();
