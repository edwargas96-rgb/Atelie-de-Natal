"""Lote de teste: 4 moldes novos no estilo Clássico (desenhados direto em código)."""
import math, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gerador import *
from estilos import page, frame, holly_leaf

def mirror(pts): return [(105 - x, y) for x, y in pts]

def arvore():
    d = Design(); frame(d, "gold")
    d.path(star(52.5, 29, 8, 3.3), "gold", 2.8, closed=True, corners=True)
    r = [(52.5, 40), (63, 60), (58, 60), (70, 82), (64, 82), (79, 104), (58, 104), (58, 115), (47, 115), (47, 104)]
    l = mirror([(79, 104), (64, 82), (70, 82), (58, 60), (63, 60)])[::-1][::-1]
    pts = r + [(26, 104), (41, 82), (35, 82), (47, 60), (42, 60)]
    d.path(pts, "green", 3.2, closed=True, corners=True)
    for x, y, c in [(52.5, 66, "red"), (46, 84, "gold"), (59, 86, "red"), (40, 98, "red"), (52.5, 94, "gold"), (65, 99, "gold")]:
        d.knot(x, y, c, 1.5)
    d.lettering(["Natal"], "dancing-script-latin-700-normal.woff", 12.5, (52.5, 128), "red", sp=2.6)
    return d

def sino():
    d = Design(); frame(d, "gold")
    left = cubic((46, 50), (46, 68), (37, 80), (27, 93), 50)
    right = [(105 - x, y) for x, y in left]
    d.path(left + right[::-1], "gold", 3.0)
    d.path([(46, 50), (59, 50)], "gold", 3.0)
    d.path([(25, 98), (80, 98)], "gold", 3.0)
    d.knot(52.5, 104, "gold", 1.7)
    for ang, L, W in [(205, 18, 8), (-25, 18, 8)]:
        o, rib = holly_leaf((52.5, 42), math.radians(ang), L, W)
        d.path(o, "green", 3.0, closed=True); d.path(rib, "green", 3.0)
    for x, y in [(49.5, 41), (55.5, 41), (52.5, 44.5)]:
        d.knot(x, y, "red", 1.5)
    d.lettering(["Noite Feliz"], "dancing-script-latin-700-normal.woff", 12.5, (52.5, 125), "red", sp=2.6)
    return d

def meia():
    d = Design(); frame(d, "gold")
    d.path([(40, 38), (66, 38), (66, 86), (82, 94), (88, 106), (80, 115), (64, 114), (44, 104), (40, 96)], "red", 3.2, closed=True, corners=True)
    d.path([(40, 52), (66, 52)], "gold", 3.0)
    d.path(star(53, 70, 5.5, 2.3), "gold", 2.6, closed=True, corners=True)
    for x, y in [(47, 44), (53, 44), (59, 44), (50, 90), (58, 96)]:
        d.knot(x, y, "green", 1.3)
    for ang, L, W in [(200, 14, 6), (-20, 14, 6)]:
        o, rib = holly_leaf((52.5, 28), math.radians(ang), L, W)
        d.path(o, "green", 3.0, closed=True); d.path(rib, "green", 3.0)
    d.knot(52.5, 26, "red", 1.4)
    d.lettering(["Boas Festas"], "dancing-script-latin-700-normal.woff", 12.5, (52.5, 128), "red", sp=2.6)
    return d

def presente():
    d = Design(); frame(d, "gold")
    d.path([(28, 82), (77, 82), (77, 120), (28, 120)], "red", 3.2, closed=True, corners=True)
    d.path([(25, 70), (80, 70), (80, 82), (25, 82)], "red", 3.2, closed=True, corners=True)
    d.path([(52.5, 70), (52.5, 120)], "gold", 3.0)
    for s in (-1, 1):
        loop = cubic((52.5, 70), (52.5 + s*22, 46), (52.5 + s*30, 66), (52.5, 70), 40)
        d.path(loop, "gold", 3.0, closed=True)
    d.knot(52.5, 71, "gold", 1.8)
    for x, y in [(38, 96), (66, 104), (40, 112)]:
        d.knot(x, y, "green", 1.3)
    d.lettering(["Para você"], "dancing-script-latin-700-normal.woff", 12.5, (52.5, 31), "red", sp=2.6)
    return d

LOTE = [("201", "Árvore de Natal", arvore), ("202", "Sino Noite Feliz", sino), ("203", "Meia da lareira", meia), ("204", "Presente com laço", presente)]
if __name__ == "__main__":
    os.makedirs(BUILD, exist_ok=True)
    for f in os.listdir(BUILD): os.remove(os.path.join(BUILD, f))
    for cod, nome, fn in LOTE:
        open(os.path.join(BUILD, cod + ".html"), "w").write(page("classico", d=fn(), title=nome, tagline=f"Molde {cod} · Teste de lote"))
