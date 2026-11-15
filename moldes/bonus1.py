"""Bônus 1 · Primeiros Pontos (guia dos 6 pontos básicos). Gera moldes/build/bonus1.html (2 páginas A4)."""
import math, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from biblioteca import *
from estilos import FONTCSS, STYLES, holly_cluster
from gerador import svg_result, BUILD

PAL = STYLES["classico"]["pal"]
RED, GREEN, GOLD, INK = "#B3282D", "#2E6B4A", "#C9962E", "#1F4D3A"


def star_art():
    d = Design(); motif(d, "estrela", 52.5, 55, 92, False, False)
    return f'<svg viewBox="0 0 105 110" width="100mm" style="display:block;margin:0 auto">{svg_result(d, PAL, "transparent", {"red"}, 0.04).replace(chr(60)+"rect x=" + chr(34)+"0"+chr(34)+" y="+chr(34)+"0"+chr(34)+" width="+chr(34)+"105"+chr(34)+" height="+chr(34)+"148"+chr(34), chr(60)+"rect x="+chr(34)+"0"+chr(34)+" y="+chr(34)+"0"+chr(34)+" width="+chr(34)+"105"+chr(34)+" height="+chr(34)+"110"+chr(34), 1)}</svg>'


def icons():
    """Os 6 pontos em miniatura (14 x 10)."""
    def line(x1, y1, x2, y2, c=RED, w=1.3): return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{c}" stroke-width="{w}" stroke-linecap="round"/>'
    out = []
    out.append(("Ponto atrás", "".join(line(2 + i * 4.1, 5, 5.3 + i * 4.1, 5) for i in range(3))))
    out.append(("Ponto corrido", "".join(line(1 + i * 5.3, 5, 3.6 + i * 5.3, 5) for i in range(3))))
    out.append(("Ponto cheio", "".join(line(3 + i * 1.1, 1.5, 3 + i * 1.1, 8.5, w=1.1) for i in range(9))))
    chain = "".join(f'<ellipse cx="{3.5 + i * 3.4}" cy="5" rx="1.9" ry="1.3" fill="none" stroke="{RED}" stroke-width=".9"/>' for i in range(4))
    out.append(("Ponto corrente", chain))
    out.append(("Ponto em X", line(2, 1.5, 6, 8.5) + line(6, 1.5, 2, 8.5) + line(8, 1.5, 12, 8.5) + line(12, 1.5, 8, 8.5)))
    knots = "".join(f'<circle cx="{x}" cy="{y}" r="1.7" fill="{RED}"/><circle cx="{x - .5}" cy="{y - .5}" r=".5" fill="#fff" fill-opacity=".6"/>' for x, y in [(3, 6.5), (7, 3), (11, 6.5)])
    out.append(("Nó francês", knots))
    cells = "".join(f'<div class="ic"><svg viewBox="0 0 14 10" width="17mm">{svg}</svg><span>{i + 1}. {name}</span></div>' for i, (name, svg) in enumerate(out))
    return f'<div class="icons">{cells}</div>'


def panel(holes, drawn, up, down, label):
    xs = [8 + i * 12 for i in range(holes)]
    g = []
    for a, b in drawn:
        g.append(f'<line x1="{xs[a]}" y1="20" x2="{xs[b]}" y2="20" stroke="{RED}" stroke-width="1.6" stroke-linecap="round"/>')
    for i, x in enumerate(xs):
        col = "#2b2622"
        g.append(f'<circle cx="{x}" cy="20" r="1.5" fill="{col}"/><text x="{x}" y="31" font-size="4.2" text-anchor="middle" fill="#6b6355" font-family="Nunito">{i + 1}</text>')
    if up is not None:
        x = xs[up]; g.append(f'<circle cx="{x}" cy="20" r="3.3" fill="none" stroke="{GREEN}" stroke-width=".9"/><path d="M{x} 9 L{x} 15" stroke="{GREEN}" stroke-width="1" marker-end="url(#ar)"/><text x="{x}" y="7" font-size="3.6" text-anchor="middle" fill="{GREEN}" font-family="Nunito" font-weight="800">SOBE</text>')
    if down is not None:
        x = xs[down]; g.append(f'<circle cx="{x}" cy="20" r="3.3" fill="none" stroke="{GOLD}" stroke-width=".9" stroke-dasharray="1 .8"/><text x="{x}" y="14" font-size="3.6" text-anchor="middle" fill="{GOLD}" font-family="Nunito" font-weight="800">DESCE</text>')
    return f'<div class="panel"><svg viewBox="0 0 {8 + holes * 12} 34" width="100%"><defs><marker id="ar" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto"><path d="M0 0 L4 2 L0 4Z" fill="{GREEN}"/></marker></defs>{"".join(g)}</svg><p>{label}</p></div>'


def build():
    deco = ('<rect x="5" y="5" width="200" height="287" fill="none" stroke="#C9962E" stroke-width=".6"/>'
            '<rect x="6.6" y="6.6" width="196.8" height="283.8" fill="none" stroke="#C9962E" stroke-width=".25"/>'
            + holly_cluster(16, 17, 1.0) + holly_cluster(194, 17, 1.0, -1))
    css = FONTCSS + f"""
@page{{size:A4;margin:0}}*{{box-sizing:border-box}}html,body{{margin:0}}
.pg{{position:relative;width:210mm;height:297mm;overflow:hidden;background:#FFF8EC url(../../assets/img/paper.webp);color:{INK};font-family:Nunito;page-break-after:always}}
.deco{{position:absolute;inset:0;width:210mm;height:297mm}}
.brand{{position:absolute;left:0;right:0;text-align:center;font:700 2.7mm Nunito;letter-spacing:.9mm;text-transform:uppercase;color:{RED}}}
.ttl{{position:absolute;left:0;right:0;text-align:center;font-family:Playfair;font-weight:800;line-height:1.02}}
.sub{{position:absolute;left:0;right:0;text-align:center;font:italic 400 6.4mm Nunito;color:{INK}}}
.rule{{position:absolute;left:55mm;right:55mm;height:0;border-top:.3mm solid {GOLD}}}
.dia{{position:absolute;left:50%;width:3mm;height:3mm;background:{GOLD};transform:translateX(-50%) rotate(45deg)}}
.icons{{position:absolute;left:14mm;right:14mm;display:grid;grid-template-columns:repeat(6,1fr);gap:2mm;text-align:center}}
.ic span{{display:block;font:700 2.7mm Nunito;color:{INK};margin-top:1mm}}
.foot{{position:absolute;left:0;right:0;bottom:11mm;text-align:center;font-size:2.5mm;color:#6b6355;letter-spacing:.2mm}}
.box{{position:absolute;left:18mm;right:18mm}}
h2{{font:800 7.5mm Playfair;margin:0 0 2mm;color:{INK}}}
.kick{{font:700 3mm Nunito;letter-spacing:.6mm;text-transform:uppercase;color:{RED};margin:0 0 1mm}}
p{{margin:0;font-size:3.6mm;line-height:1.5}}
.panels{{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm}}
.panel{{background:rgba(255,255,255,.7);border:.3mm solid rgba(0,0,0,.08);border-radius:3mm;padding:3mm 3mm 2.5mm}}
.panel p{{font-size:3.1mm;margin-top:1mm;color:#4a463c}}
.num{{display:inline-grid;place-items:center;width:6mm;height:6mm;border-radius:50%;background:{RED};color:#fff;font:800 3.2mm Nunito;margin-right:1.6mm}}
.tip{{background:#FBF1D6;border-left:1.2mm solid {GOLD};border-radius:2mm;padding:3.4mm 4mm;font-size:3.4mm}}
"""
    cover = f"""<div class="pg"><svg class="deco" viewBox="0 0 210 297">{deco}</svg>
<div class="brand" style="top:20mm">Ateliê de Natal · Bônus 1</div>
<div class="ttl" style="top:34mm;font-size:23mm;color:{INK}">Primeiros</div>
<div class="ttl" style="top:58mm;font-size:23mm;color:{RED}">Pontos</div>
<div class="rule" style="top:90mm"></div><div class="dia" style="top:88.5mm"></div>
<div class="sub" style="top:96mm">Guia dos 6 pontos básicos</div>
<div style="position:absolute;left:30mm;right:30mm;top:118mm">{star_art()}</div>
<div class="icons" style="top:228mm">{icons()[len('<div class="icons">'):-6]}</div>
<div class="sub" style="top:254mm;font-size:4.2mm;color:#6b6355">Para quem tem vontade de bordar e quer começar sem medo</div>
<div class="foot">© Ateliê de Natal · Uso pessoal · Não compartilhe nem revenda os arquivos</div></div>"""
    p1 = panel(5, [], 1, None, "Saia pelo furo 2, vindo de trás do papel.")
    p2 = panel(5, [(0, 1)], None, 0, "Volte para trás pelo furo 1. Primeiro ponto pronto.")
    p3 = panel(5, [(0, 1)], 2, 1, "Saia no 3 e desça no 2, encostando no ponto anterior.")
    page2 = f"""<div class="pg"><svg class="deco" viewBox="0 0 210 297">{deco}</svg>
<div class="brand" style="top:18mm">Ateliê de Natal · Primeiros Pontos</div>
<div class="box" style="top:30mm"><p class="kick">Ponto 1 de 6</p><h2>Ponto atrás</h2>
<p>É o ponto mais usado para <b>contornos e letras</b>. Fica como uma linha contínua e firme, sem espaços entre os pontos.</p></div>
<div class="box" style="top:64mm"><div class="panel" style="background:#fffdf8"><svg viewBox="0 0 110 40" width="120mm" style="display:block;margin:0 auto"><g>{''.join(f'<line x1="{10 + i * 12}" y1="22" x2="{22 + i * 12}" y2="22" stroke="{RED}" stroke-width="1.8" stroke-linecap="round"/>' for i in range(7))}{''.join(f'<circle cx="{10 + i * 12}" cy="22" r="1.4" fill="#2b2622"/>' for i in range(8))}</g><text x="55" y="10" font-size="4.4" text-anchor="middle" fill="{GREEN}" font-family="Nunito" font-weight="800">Como fica por cima do papel</text><text x="55" y="36" font-size="3.8" text-anchor="middle" fill="#6b6355" font-family="Nunito">a linha cobre todos os furos, ponto a ponto</text></svg></div></div>
<div class="box" style="top:120mm"><p class="kick">Passo a passo</p><div class="panels">{p1}{p2}{p3}</div></div>
<div class="box" style="top:184mm"><p class="kick">Onde usar nos seus moldes</p>
<p><span class="num">✓</span>Letras e frases, como "Feliz Natal"<br><span class="num">✓</span>Contorno de estrelas, árvores e presentes<br><span class="num">✓</span>Molduras e linhas retas</p></div>
<div class="box tip" style="top:224mm"><b>Dica:</b> puxe a linha com calma, só até assentar. Se esticar demais, o papel enruga e o furo rasga.</div>
<div class="box tip" style="top:246mm;background:#EAF2EC;border-color:{GREEN}"><b>Errou o furo?</b> Sem problema: passe a agulha de volta por trás e refaça o ponto. Pequenos desvios somem na hora de bordar o resto.</div>
<div class="foot">© Ateliê de Natal · Uso pessoal · Não compartilhe nem revenda os arquivos · Página 1</div></div>"""
    return f'<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Primeiros Pontos</title><style>{css}</style></head><body>{page2}</body></html>'


if __name__ == "__main__":
    os.makedirs(BUILD, exist_ok=True)
    open(os.path.join(BUILD, "bonus1.html"), "w").write(build())
    print("ok")
