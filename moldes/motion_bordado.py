"""Gera páginas animáveis (agulha e linha bordando o molde) + wrapper 9:16. Uso: python3 moldes/motion_bordado.py E01 E02 001"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gerador import BUILD
from estilos import page, STYLES
import especiais, fazer_lote

PAL = STYLES["classico"]["pal"]
OVERLAY_JS = r"""
<svg id="ov" viewBox="0 0 105 148" style="position:absolute;left:12mm;top:61mm;width:105mm;height:148mm;z-index:9;overflow:visible">
<defs><linearGradient id="ndl" x1="0" x2="1"><stop offset="0" stop-color="#d9dee3"/><stop offset=".5" stop-color="#5f6870"/><stop offset="1" stop-color="#b8c0c7"/></linearGradient></defs>
<g id="done"></g><path id="thr" fill="none" stroke-width=".8" stroke-linecap="round"/><g id="needle"><line x1="0.4" y1="0.35" x2="24" y2="0.35" stroke="#000" stroke-opacity=".18" stroke-width="1.5" stroke-linecap="round"/><line x1="0" y1="0" x2="24" y2="0" stroke="#4a5259" stroke-width="1.55" stroke-linecap="round"/><line x1="0" y1="0" x2="24" y2="0" stroke="url(#ndl)" stroke-width="1.15" stroke-linecap="round"/><ellipse cx="20.6" cy="0" rx="1.9" ry=".4" fill="#fff" stroke="#4a5259" stroke-width=".2"/></g>
</svg>
<script>
var ST = __DATA__, PAL = __PAL__;
var done = document.getElementById("done"), thr = document.getElementById("thr"), nd = document.getElementById("needle"), drawn = 0;
function seg(s) {
  if (s.k) return '<circle cx="' + s.x + '" cy="' + s.y + '" r="' + s.r + '" fill="' + PAL[s.c] + '"/><circle cx="' + (s.x - s.r * .35) + '" cy="' + (s.y - s.r * .35) + '" r="' + s.r * .32 + '" fill="#fff" fill-opacity=".55"/>';
  return '<line x1="' + s.a[0] + '" y1="' + s.a[1] + '" x2="' + s.b[0] + '" y2="' + s.b[1] + '" stroke="' + PAL[s.c] + '" stroke-width=".85" stroke-linecap="round"/>' +
         '<line x1="' + s.a[0] + '" y1="' + (s.a[1] - .14) + '" x2="' + s.b[0] + '" y2="' + (s.b[1] - .14) + '" stroke="#fff" stroke-opacity=".35" stroke-width=".22" stroke-linecap="round"/>';
}
window.stitchAt = function (p) {           // p: 0..1 do bordado
  var n = Math.min(ST.length, Math.floor(p * ST.length));
  if (n < drawn) { done.innerHTML = ""; drawn = 0; }
  var html = ""; for (var i = drawn; i < n; i++) html += seg(ST[i]); if (html) done.insertAdjacentHTML("beforeend", html); drawn = n;
  if (n >= ST.length || p <= 0) { nd.style.display = "none"; thr.style.display = "none"; return; }
  var s = ST[n], f = p * ST.length - n, x, y, ang;
  if (s.k) { x = s.x; y = s.y; ang = -0.9; } else { x = s.a[0] + (s.b[0] - s.a[0]) * f; y = s.a[1] + (s.b[1] - s.a[1]) * f; ang = Math.atan2(s.b[1] - s.a[1], s.b[0] - s.a[0]); }
  ang += 0.55 + Math.sin(p * 90) * 0.12;   // agulha levemente inclinada, balançando
  nd.style.display = "block"; nd.setAttribute("transform", "translate(" + x + " " + y + ") rotate(" + (ang * 180 / Math.PI + 180) + ")");
  var ex = x - Math.cos(ang) * 20.6, ey = y - Math.sin(ang) * 20.6, px = s.k ? s.x : s.a[0], py = s.k ? s.y : s.a[1];
  thr.style.display = "block"; thr.setAttribute("stroke", PAL[s.c]);
  thr.setAttribute("d", "M" + px + " " + py + " Q" + ((px + ex) / 2 + 6) + " " + ((py + ey) / 2 + 9) + " " + ex + " " + ey);
};
</script>
"""

def order(d):
    """Sequência de pontos: desenho primeiro, nós franceses junto, moldura (perto da borda) por último."""
    border = lambda x, y: x < 9 or x > 96 or y < 9 or y > 139
    body, frame = [], []
    for i, j, c in d.stitches:
        a, b = d.holes[i], d.holes[j]
        item = {"a": [round(a[0], 2), round(a[1], 2)], "b": [round(b[0], 2), round(b[1], 2)], "c": c}
        (frame if border(a[0], a[1]) and border(b[0], b[1]) else body).append(item)
    knots = [{"k": 1, "x": round(x, 2), "y": round(y, 2), "r": round(r, 2), "c": c} for x, y, c, r in d.knots]
    # nós entram depois dos traços da mesma cor (ficam no meio do desenho, não no fim)
    out = body + knots + frame
    return out

def build(code):
    if code.startswith("E"):
        cod, nome, tag, fn, niv = next(e for e in especiais.ESPECIAIS if e[0] == code)
        d = fn(); html = page("classico", d=d, title=nome, tagline=tag, nivel=niv)
    else:
        cat = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "catalogo.json")))
        c = cat[int(code) - 1]; d, tam, niv = fazer_lote.desenhar(c)
        html = page("classico", d=d, title=c["nome"], tagline=f"Molde {c['numero']:03d} · {c['categoria']}", nivel=niv, tamanho=tam)
    ov = OVERLAY_JS.replace("__DATA__", json.dumps(order(d))).replace("__PAL__", json.dumps(PAL))
    html = html.replace('<div class="lbl" style="left:126mm', ov + '<div class="lbl" style="left:126mm', 1)
    open(os.path.join(BUILD, f"bordado-{code}.html"), "w").write(html)

if __name__ == "__main__":
    os.makedirs(BUILD, exist_ok=True)
    codes = sys.argv[1:] or ["E01", "E02", "001"]
    for c in codes: build(c)
    json.dump(codes, open(os.path.join(BUILD, "bordado-lista.json"), "w"))
    print("ok", codes)
