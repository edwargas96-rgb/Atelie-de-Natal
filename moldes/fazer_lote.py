"""Gera um lote de moldes do catálogo.  Uso: python3 moldes/fazer_lote.py 1   (lote 1 = moldes 001-010)
Cria moldes/build/NNN.html e, com render.js, moldes/saida/NNN.pdf + moldes/lotes/lote-NN.png (folha de revisão)."""
import json, math, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from biblioteca import *
from estilos import page, frame, STYLES

ROOT = os.path.dirname(os.path.abspath(__file__))
FONT = "dancing-script-latin-700-normal.woff"
RING = [("gold", 0.95)]


def ring_knots(d, cx, cy, r, n, swap):
    for k in range(n):
        a = -math.pi / 2 + 2 * math.pi * (k + .5) / n
        d.knot(cx + r * math.cos(a), cy + r * math.sin(a), "gold" if k % 2 else ("green" if swap else "red"), .95)


def desenhar(c):
    d = Design(); f, forma, txt, sw, simple = c["formato"], c["forma"], c["texto"], c["swap"], c["simple"]
    extra = c.get("extra", {})
    kw = {"n": extra["n"]} if "n" in extra and forma == "guirlanda" else {}
    tam, nivel = "A6 · 10,5 × 14,8 cm", "Fácil"
    if f == "card":
        frame(d, "gold")
        if extra.get("cardapio"):
            motif(d, forma, 52.5, 44, 44, sw, True)
            d.lettering([txt], FONT, 15, (52.5, 82), "red", sp=2.4)
            for y in (98, 108, 118, 128):
                d.path([(24, y), (81, y)], "gold", 4.2)
        elif extra.get("nome"):
            motif(d, forma, 52.5, 56, 58, sw, True)
            d.lettering([txt], FONT, 9, (30, 117), "red", sp=2.2)
            d.path([(22, 124), (83, 124)], "gold", 4.2)
        elif txt:
            size = 74 if not simple else 68
            motif(d, forma, 52.5, 58, size, sw, simple, **kw)
            d.lettering(txt.split("|"), FONT, 13.5 if len(txt) < 14 else 11, (52.5, 122), "green" if sw else "red", sp=2.6, tracking=.2)
        else:
            motif(d, forma, 52.5, 72, 84, sw, simple, **kw)
    else:
        tam = "Ø 9 cm · papel redondo" if f in ("round", "advento") else "Ø 6 cm · papel redondo"
        R = 46 if f in ("round", "advento") else 30
        d.cuts = [(52.5, 74, R)]
        if f == "advento":
            ring_knots(d, 52.5, 74, 39, 28, sw)
            motif(d, forma, 52.5, 54, 24, sw, True)
            d.lettering([txt], FONT, 30, (52.5, 86), "green" if sw else "red", sp=2.4)
        elif f == "round":
            ring_knots(d, 52.5, 74, 41 if R == 46 else 26, 32, sw)
            has_t = bool(txt)
            motif(d, forma, 52.5, 68 if has_t else 74, (50 if has_t else 66) if forma not in ("guirlanda", "rosácea") else (52 if has_t else 70), sw, simple, **kw)
            if has_t: d.lettering(txt.split("|"), FONT, 8.5 if len(txt) > 12 else 9.5, (52.5, 107), "green" if sw else "red", sp=2.4)
        else:  # round-s (Ø 6 cm)
            ring_knots(d, 52.5, 74, 27.5, 22, sw)
            motif(d, forma, 52.5, 66 if c["tipo"] == "Etiqueta" else 74, 36 if c["tipo"] == "Etiqueta" else 42, sw, True)
            if c["tipo"] == "Etiqueta": d.path([(40, 90), (65, 90)], "gold", 3.2)   # linha para escrever o nome
    n = len(d.holes) + len(d.knots)
    nivel = "Fácil" if n < 230 else ("Médio" if n < 380 else "Avançado")
    return d, tam, nivel


def main(lote):
    cat = json.load(open(os.path.join(ROOT, "catalogo.json")))
    a, b = (lote - 1) * 10, lote * 10
    build = os.path.join(ROOT, "build"); os.makedirs(build, exist_ok=True)
    for x in os.listdir(build): os.remove(os.path.join(build, x))
    for c in cat[a:b]:
        d, tam, nivel = desenhar(c)
        html = page("classico", d=d, title=c["nome"], tagline=f"Molde {c['numero']:03d} · {c['categoria']}", nivel=nivel, tamanho=tam)
        open(os.path.join(build, f"{c['numero']:03d}.html"), "w").write(html)
    print("lote", lote, [c["numero"] for c in cat[a:b]])


if __name__ == "__main__":
    main(int(sys.argv[1]))
