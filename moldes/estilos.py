"""Três estilos de prévia para o mesmo molde: Cartão Feliz Natal."""
import math, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gerador import *

FONTCSS = """
@font-face{font-family:Playfair;font-weight:700;src:url(../../assets/fonts/playfair-display-latin-700-normal.woff2)}
@font-face{font-family:Playfair;font-weight:800;src:url(../../assets/fonts/playfair-display-latin-800-normal.woff2)}
@font-face{font-family:Nunito;font-weight:400;src:url(../../assets/fonts/nunito-sans-latin-400-normal.woff2)}
@font-face{font-family:Nunito;font-weight:400;font-style:italic;src:url(../../assets/fonts/nunito-sans-latin-400-italic.woff2)}
@font-face{font-family:Nunito;font-weight:600;src:url(../../assets/fonts/nunito-sans-latin-600-normal.woff2)}
@font-face{font-family:Nunito;font-weight:700;src:url(../../assets/fonts/nunito-sans-latin-700-normal.woff2)}
@font-face{font-family:Nunito;font-weight:800;src:url(../fonts/nunito-sans-latin-800-normal.woff2)}
@font-face{font-family:Caveat;font-weight:700;src:url(../fonts/caveat-latin-700-normal.woff2)}
"""

# ------------------------------------------------------------------ desenhos
def frame(d, color, inset=7, sp=4.2, jitter=0.0):
    d.path([(inset, inset), (105 - inset, inset), (105 - inset, 148 - inset), (inset, 148 - inset)], color, sp, closed=True, jitter=jitter, seed=11, corners=True)


def classico():
    d = Design()
    frame(d, "gold")
    d.path(star(52.5, 28, 11, 4.4), "gold", 3.0, closed=True, corners=True)
    for cx, cy, s in [(33, 21, 2.2), (72, 23, 2.6), (37, 37, 1.7), (68, 38, 1.9)]:
        d.segment((cx - s, cy), (cx + s, cy), "gold"); d.segment((cx, cy - s), (cx, cy + s), "gold")
    d.lettering(["Feliz", "Natal"], "dancing-script-latin-700-normal.woff", 22, (52.5, 71), "red", sp=2.2, line_h=20)
    for base, ang, L, W in [((50.5, 113), math.radians(198), 24, 11), ((54.5, 113), math.radians(-18), 24, 11), ((52.5, 115), math.radians(95), 15, 8)]:
        o, rib = holly_leaf(base, ang, L, W)
        d.path(o, "green", 3.0, closed=True); d.path(rib, "green", 3.0)
    for x, y in [(50.3, 110.6), (54.9, 110.3), (52.6, 113.4)]:
        d.knot(x, y, "red", 1.6)
    return d


def nordico():
    d = Design()
    frame(d, "ink", sp=4.4)
    c = (52.5, 30); R = 13
    for k in range(6):
        a = -math.pi/2 + k*math.pi/3
        tip = (c[0] + R*math.cos(a), c[1] + R*math.sin(a))
        d.path([c, tip], "red", 3.2)
        m = (c[0] + R*.58*math.cos(a), c[1] + R*.58*math.sin(a))
        for s in (-1, 1):
            b = (m[0] + 4.4*math.cos(a + s*0.75), m[1] + 4.4*math.sin(a + s*0.75))
            d.segment(m, b, "red")
    for x, y in [(30, 22), (75, 20), (27, 40), (78, 41)]:
        d.knot(x, y, "ink", 0.9)
    d.lettering(["FELIZ", "NATAL"], "nunito-sans-latin-800-normal.woff", 15, (52.5, 72), "ink", sp=2.6, line_h=19.5, tracking=2.6)
    for cx, h, w, col in [(30, 17, 14, "red"), (52.5, 24, 19, "ink"), (75, 17, 14, "red")]:
        by = 127
        tri = [(cx, by - h), (cx + w/2, by), (cx - w/2, by)]
        d.path(tri, col, 3.0, closed=True, corners=True)
        d.segment((cx, by), (cx, by + 4), col)
    zig = [(46.5, 116), (57.5, 113), (48.5, 110), (55.5, 107.5)]
    d.path(zig, "red", 2.6)
    d.knot(52.5, 101.6, "red", 1.1)
    return d


def rustico():
    d = Design()
    frame(d, "brown", sp=4.6, jitter=0.22)
    d.path(star(52.5, 27.5, 10.5, 4.3, ang=-math.pi/2 + .08), "mustard", 3.0, closed=True, jitter=0.15, seed=4, corners=True)
    d.path(star(70, 19, 3.6, 1.6, ang=-math.pi/2 - .2), "mustard", 2.0, closed=True, corners=True)
    d.path(star(34, 35, 2.8, 1.25), "mustard", 1.8, closed=True, corners=True)
    d.lettering(["Feliz", "Natal"], "caveat-latin-700-normal.woff", 24, (52.5, 70), "brick", sp=2.3, line_h=19)
    stem = cubic((15, 121), (34, 110), (66, 127), (91, 113), 80)
    d.path(stem, "sage", 3.3)
    acc, k = 0, 0
    for i in range(1, len(stem)):
        acc += math.dist(stem[i - 1], stem[i])
        if acc >= 3.3 and 4 < i < len(stem) - 3:
            acc = 0; k += 1
            (x0, y0), (x1, y1) = stem[i - 1], stem[i]
            t = math.atan2(y1 - y0, x1 - x0)
            s = 1 if k % 2 else -1
            a = t + s*math.radians(52)
            d.segment((x1, y1), (x1 + 5.2*math.cos(a), y1 + 5.2*math.sin(a)), "sage")
    for x, y in [(43, 118.5), (46.6, 120.8), (45.4, 115.6)]:
        d.knot(x, y, "brick", 1.5)
    return d


# ------------------------------------------------------------------ deco das páginas
def holly_cluster(x, y, s, flip=1):
    parts = []
    for ang, L, W in [(200, 13, 6), (-20, 13, 6), (100, 9, 5)]:
        o, rib = holly_leaf((x, y), math.radians(ang if flip > 0 else 180 - ang), L*s, W*s)
        parts.append('<path d="M' + " L".join(f"{a:.2f},{b:.2f}" for a, b in o) + 'Z" fill="#2E6B4A"/>')
        parts.append(f'<line x1="{rib[0][0]:.2f}" y1="{rib[0][1]:.2f}" x2="{rib[1][0]:.2f}" y2="{rib[1][1]:.2f}" stroke="#1d4a33" stroke-width=".35"/>')
    for dx, dy in [(-1.4, -1.2), (1.6, -1.4), (0, 1.0)]:
        parts.append(f'<circle cx="{x+dx*s:.2f}" cy="{y+dy*s:.2f}" r="{1.5*s:.2f}" fill="#B3282D"/><circle cx="{x+dx*s-.5*s:.2f}" cy="{y+dy*s-.5*s:.2f}" r="{.45*s:.2f}" fill="#fff" fill-opacity=".6"/>')
    return "".join(parts)


def snowflake_icon(x, y, r, col):
    s = []
    for k in range(6):
        a = k*math.pi/3
        s.append(f'<line x1="{x:.2f}" y1="{y:.2f}" x2="{x+r*math.cos(a):.2f}" y2="{y+r*math.sin(a):.2f}"/>')
    return f'<g stroke="{col}" stroke-width=".45" stroke-linecap="round">' + "".join(s) + "</g>"


STYLES = {
    "classico": dict(
        name="Clássico", design=classico,
        pal={"red": "#B3282D", "green": "#2E6B4A", "gold": "#C9962E", "snow": "#8E9AA6", "brown": "#7A5233"},
        names={"red": "Vermelho cereja", "green": "Verde pinheiro", "gold": "Dourado", "snow": "Cinza neve", "brown": "Marrom"},
        page_bg="#FFF8EC", ink="#1F4D3A", accent="#B3282D", muted="#6b6355",
        title_font="Playfair", title_weight=800, body_font="Nunito",
        card_bg="#FFFDF8", result_bg="#F8EEDB", frame="#c9b48a", twine={"red"}, wobble=0,
        deco=lambda: (
            '<rect x="5" y="5" width="200" height="287" fill="none" stroke="#C9962E" stroke-width=".6"/>'
            '<rect x="6.6" y="6.6" width="196.8" height="283.8" fill="none" stroke="#C9962E" stroke-width=".25"/>'
            + holly_cluster(16, 17, 1.0) + holly_cluster(194, 17, 1.0, -1)
            + '<line x1="60" y1="51" x2="98" y2="51" stroke="#C9962E" stroke-width=".3"/><line x1="112" y1="51" x2="150" y2="51" stroke="#C9962E" stroke-width=".3"/>'
              '<path d="M105 48.8 107.2 51 105 53.2 102.8 51Z" fill="#C9962E"/>'),
        tagline="Molde 01 · Cartões e presentes",
    ),
    "nordico": dict(
        name="Nórdico", design=nordico,
        pal={"red": "#C8102E", "ink": "#33363B"},
        names={"red": "Vermelho", "ink": "Grafite"},
        page_bg="#FBFAF7", ink="#33363B", accent="#C8102E", muted="#7b7e84",
        title_font="Nunito", title_weight=800, body_font="Nunito",
        card_bg="#FFFFFF", result_bg="#F1EFEA", frame="#c9c9c9", twine=None, wobble=0,
        deco=lambda: (
            '<rect x="0" y="0" width="210" height="9" fill="#C8102E"/>'
            + "".join(f'<path d="M{x} 3 l1.6 1.5 l1.6 -1.5 M{x} 6 l1.6 -1.5 l1.6 1.5" stroke="#fff" stroke-width=".45" fill="none"/>' for x in range(6, 206, 8))
            + snowflake_icon(18, 30, 4.2, "#C8102E") + snowflake_icon(192, 30, 4.2, "#C8102E")
            + '<rect x="0" y="291" width="210" height="6" fill="#33363B"/>'),
        tagline="MOLDE 01 · CARTÕES E PRESENTES",
    ),
    "rustico": dict(
        name="Rústico aquarela", design=rustico,
        pal={"brick": "#A8453A", "sage": "#6E8F6A", "mustard": "#C59A2C", "brown": "#8A6240"},
        names={"brick": "Tijolo", "sage": "Sálvia", "mustard": "Mostarda", "brown": "Caramelo"},
        page_bg="#EADBC2", ink="#4A3A2A", accent="#A8453A", muted="#7a6650",
        title_font="Caveat", title_weight=700, body_font="Nunito",
        card_bg="#FFFBF2", result_bg="#F2E3C8", frame="#bfa784", twine=None, wobble=0.06,
        deco=lambda: (
            '<defs><filter id="wc" x="-30%" y="-30%" width="160%" height="160%"><feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="3" seed="5"/>'
            '<feDisplacementMap in="SourceGraphic" scale="9"/><feGaussianBlur stdDeviation=".7"/></filter></defs>'
            '<g filter="url(#wc)">'
            '<ellipse cx="22" cy="20" rx="30" ry="20" fill="#6E8F6A" opacity=".32"/>'
            '<ellipse cx="190" cy="16" rx="26" ry="17" fill="#A8453A" opacity=".26"/>'
            '<ellipse cx="196" cy="282" rx="34" ry="22" fill="#C59A2C" opacity=".28"/>'
            '<ellipse cx="12" cy="286" rx="22" ry="16" fill="#6E8F6A" opacity=".22"/></g>'
            '<path d="M45 47.5 C75 45.5 135 50 165 47" stroke="#8A6240" stroke-width=".5" stroke-dasharray="2.2 1.1" fill="none"/>'),
        tagline="Molde 01 · Cartões e presentes",
    ),
}

def _star(x, y, r, col, op=1):
    pts = []
    for i in range(10):
        a = -math.pi / 2 + i * math.pi / 5; rr = r if i % 2 == 0 else r * .42
        pts.append(f"{x + rr * math.cos(a):.2f},{y + rr * math.sin(a):.2f}")
    return f'<polygon points="{" ".join(pts)}" fill="{col}" opacity="{op}"/>'


STYLES["fundador"] = dict(STYLES["classico"], name="Fundador 2027", accent="#9A6B12",
    brand="Ateliê 2027 · Pacote Fundador", owner="Ateliê de Natal · Ateliê 2027", tagline="Ateliê 2027",
    deco=lambda: (
        '<rect x="5" y="5" width="200" height="287" fill="none" stroke="#C9962E" stroke-width=".9"/>'
        '<rect x="7" y="7" width="196" height="283" fill="none" stroke="#C9962E" stroke-width=".25"/>'
        + _star(17, 18, 4.2, "#C9962E") + _star(25, 13, 1.8, "#C9962E", .7) + _star(193, 18, 4.2, "#C9962E") + _star(185, 13, 1.8, "#C9962E", .7)
        + _star(17, 280, 2.6, "#C9962E", .8) + _star(193, 280, 2.6, "#C9962E", .8)
        + '<line x1="60" y1="51" x2="98" y2="51" stroke="#C9962E" stroke-width=".3"/><line x1="112" y1="51" x2="150" y2="51" stroke="#C9962E" stroke-width=".3"/>'
        + _star(105, 51, 2.4, "#C9962E")))


STITCHES = [("Ponto atrás", "nas linhas e nas letras"), ("Nó francês", "nas bolinhas"), ("Ponto corrido", "na moldura")]
STEPS = [("Imprima", "Em papel firme (180 g ou mais), em tamanho real."), ("Fure", "Sobre um EVA ou isopor, fure cada pontinho com a agulha."), ("Borde", "Siga as linhas com a cor indicada, ponto a ponto.")]


def page(key, d=None, title=None, tagline=None, nivel="Fácil", tamanho="A6 · 10,5 × 14,8 cm"):
    st = STYLES[key]; d = d or st["design"]()
    tf, tw, bf = st["title_font"], st["title_weight"], st["body_font"]
    upper = key == "nordico"
    title = title or ("CARTÃO FELIZ NATAL" if upper else "Cartão Feliz Natal")
    tagline = tagline or st["tagline"]
    tsize = "15mm" if tf == "Caveat" else ("9mm" if upper else "11mm")
    if tf != "Caveat":   # nomes compridos: reduz o título para caber em uma linha
        mm = max(6.2, min(11.0 if not upper else 9.0, 166.0 / (len(title) * 0.6)))
        tsize = f"{mm:.1f}mm"
    used = sorted({c for *_, c in d.holes} | {k[2] for k in d.knots}, key=list(st["pal"]).index)
    sw = "".join(f'<li><i style="background:{st["pal"][c]}"></i>{st["names"][c]}</li>' for c in used)
    pts = "".join(f"<li><b>{a}</b> {b}</li>" for a, b in STITCHES)
    steps = "".join(f'<div class="step"><span>{i+1}</span><b>{a}</b><p>{b}</p></div>' for i, (a, b) in enumerate(STEPS))
    lt = "52.5mm" if tf == "Caveat" else "57mm"
    lab = "font-family:Caveat;font-size:6.2mm;font-weight:700;text-transform:none;letter-spacing:0" if tf == "Caveat" else ""
    return f"""<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>{st['name']}</title><style>{FONTCSS}
@page{{size:A4;margin:0}}
*{{box-sizing:border-box}}html,body{{margin:0}}
.pg{{position:relative;width:210mm;height:297mm;overflow:hidden;background:{st['page_bg']} url(../../assets/img/paper.webp);color:{st['ink']};font-family:{bf};}}
.deco{{position:absolute;inset:0;width:210mm;height:297mm}}
.brand{{position:absolute;top:{'14mm' if upper else '13mm'};left:0;right:0;text-align:center;font:700 2.6mm {bf};letter-spacing:.9mm;text-transform:uppercase;color:{st['accent']}}}
h1{{position:absolute;top:{'18mm' if upper else '17mm'};left:0;right:0;margin:0;text-align:center;font:{tw} {tsize}/1.1 {tf};color:{st['ink']};letter-spacing:{'1.2mm' if upper else '0'}}}
.sub{{position:absolute;top:{'31mm' if upper else '31.5mm'};left:0;right:0;text-align:center;font:600 3mm {bf};color:{st['muted']};letter-spacing:{'.6mm' if upper else '.1mm'}}}
.chips{{position:absolute;top:38.5mm;left:0;right:0;display:flex;gap:2.5mm;justify-content:center}}
.chips span{{font:700 2.5mm {bf};padding:1mm 3mm;border-radius:10mm;border:.3mm solid {st['accent']};color:{st['accent']};background:rgba(255,255,255,.6)}}
.lbl{{position:absolute;font:800 2.6mm {bf};letter-spacing:.5mm;text-transform:uppercase;color:{st['accent']};{lab}}}
.card{{position:absolute;filter:drop-shadow(0 .6mm 1.2mm rgba(60,40,20,.18))}}
.side{{position:absolute;left:126mm;width:72mm}}
.side h3{{margin:0 0 1.6mm;font:800 3.1mm {bf};color:{st['ink']}}}
.side ul{{list-style:none;margin:0 0 4.5mm;padding:0;font-size:2.9mm;line-height:1.5}}
.sw li{{display:flex;align-items:center;gap:2mm}}.sw i{{width:4.2mm;height:4.2mm;border-radius:50%;display:inline-block;box-shadow:inset 0 0 0 .4mm rgba(255,255,255,.5)}}
.lvl{{display:flex;gap:1mm;align-items:center;font-size:2.9mm}}.lvl i{{width:2.6mm;height:2.6mm;border-radius:50%;border:.35mm solid {st['accent']}}}.lvl i.on{{background:{st['accent']}}}
.steps{{position:absolute;left:12mm;right:12mm;top:222mm;display:grid;grid-template-columns:repeat(3,1fr);gap:5mm}}
.step{{background:rgba(255,255,255,.62);border:.3mm solid rgba(0,0,0,.08);border-radius:3mm;padding:3.2mm 3.5mm}}
.step span{{display:inline-grid;place-items:center;width:5.4mm;height:5.4mm;border-radius:50%;background:{st['accent']};color:#fff;font:800 2.8mm {bf};margin-right:1.6mm}}
.step b{{font:800 3.4mm {('Caveat' if tf=='Caveat' else bf)};{'font-size:5mm;' if tf=='Caveat' else ''}}}.step p{{margin:1.4mm 0 0;font-size:2.7mm;line-height:1.4;color:{st['muted']}}}
.ruler{{position:absolute;left:12mm;top:252mm;display:flex;align-items:center;gap:3mm;font-size:2.6mm;color:{st['muted']}}}
.ruler svg{{width:50mm;height:4mm}}
.foot{{position:absolute;left:0;right:0;bottom:{'9mm' if upper else '10mm'};text-align:center;font-size:2.4mm;color:{st['muted']};letter-spacing:.2mm}}
</style></head><body><div class="pg">
<svg class="deco" viewBox="0 0 210 297">{st['deco']()}</svg>
<div class="brand">{st.get("brand","Ateliê de Natal · moldes de bordado em papel")}</div>
<h1>{title}</h1>
<div class="sub">{tagline}</div>
<div class="chips"><span>Nível {nivel.lower()}</span><span>Tamanho {tamanho}</span><span>{len(d.holes) + len(d.knots)} furos</span></div>
<div class="lbl" style="left:12mm;top:{lt}">Molde para furar</div>
<svg class="card" style="left:12mm;top:61mm;width:105mm;height:148mm" viewBox="0 0 105 148">{svg_template(d, st['pal'], st['card_bg'], st['frame'])}</svg>
<div class="lbl" style="left:126mm;top:{lt}">Como fica bordado</div>
<svg class="card" style="left:126mm;top:61mm;width:72mm;height:101.5mm" viewBox="0 0 105 148">{svg_result(d, st['pal'], st['result_bg'], st['twine'], st['wobble'])}</svg>
<div class="side" style="top:168mm">
  <h3>Linhas</h3><ul class="sw">{sw}</ul>
  <h3>Pontos</h3><ul>{pts}</ul>
</div>
<div class="steps">{steps}</div>
<div class="ruler"><svg viewBox="0 0 50 4"><rect x="0" y="1" width="50" height="1.6" fill="{st['ink']}"/>{''.join(f'<rect x="{x}" y="0" width=".3" height="4" fill="{st["ink"]}"/>' for x in range(0, 51, 10))}</svg>Esta barra deve medir 5 cm na impressão. Imprima em 100% (tamanho real).</div>
<div class="foot">© {st.get("owner","Ateliê de Natal")} · Uso pessoal · Não compartilhe nem revenda os arquivos</div>
</div></body></html>"""


if __name__ == "__main__":
    os.makedirs(BUILD, exist_ok=True)
    for k in STYLES:
        p = os.path.join(BUILD, f"{k}.html")
        open(p, "w").write(page(k))
        print("ok", p)
