"""Moldes especiais (mais elaborados) no estilo Clássico: Sagrada Família e Papai Noel."""
import math, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gerador import Design, cubic, star, BUILD
from estilos import page, frame

FONT = "dancing-script-latin-700-normal.woff"


def ellipse(cx, cy, rx, ry, n=80, a0=0, a1=2 * math.pi):
    return [(cx + rx * math.cos(a0 + (a1 - a0) * k / n), cy + ry * math.sin(a0 + (a1 - a0) * k / n)) for k in range(n + 1)]


def sparkle(d, x, y, s=2.2, c="gold"):
    d.segment((x - s, y), (x + s, y), c); d.segment((x, y - s), (x, y + s), c)


def papai_noel():
    d = Design(); frame(d, "gold")
    cx = 52.5
    # gorro
    hat = cubic((29, 50), (33, 30), (47, 17), (61, 16), 40) + cubic((61, 16), (72, 16), (79, 24), (77, 33), 30)[1:] \
        + cubic((77, 33), (73, 28), (69, 28), (68, 32), 16)[1:] + [(76, 50)]
    d.path(hat, "red", 2.6)
    d.path(ellipse(78, 37, 4.2, 4.2, 30), "snow", 2.2, closed=True)
    # aba de pele (arredondada)
    brim = cubic((27, 50), (27, 46), (33, 46), (40, 46.5), 12) + [(66, 46.5)] + cubic((66, 46.5), (73, 46), (79, 46), (79, 50), 12)[1:] \
        + cubic((79, 50), (79, 55), (73, 55), (66, 54.5), 12)[1:] + [(40, 54.5)] + cubic((40, 54.5), (33, 55), (27, 55), (27, 50), 12)[1:]
    d.path(brim, "snow", 2.4, closed=True)
    # rosto: olhos, nariz e bochechas
    d.knot(45.5, 62, "brown", 1.25); d.knot(59.5, 62, "brown", 1.25)
    d.path(cubic((42.5, 58.5), (44, 57.2), (47, 57.2), (48.5, 58.5), 10), "brown", 1.9)
    d.path(cubic((56.5, 58.5), (58, 57.2), (61, 57.2), (62.5, 58.5), 10), "brown", 1.9)
    d.knot(cx, 67, "red", 1.9)
    d.knot(40.5, 66.5, "red", 1.4); d.knot(64.5, 66.5, "red", 1.4)
    # bigode
    for s in (-1, 1):
        d.path(cubic((cx, 70), (cx + s * 5, 67), (cx + s * 11, 70), (cx + s * 13, 67.5), 24)
               + cubic((cx + s * 13, 67.5), (cx + s * 14.5, 66.5), (cx + s * 15.5, 69), (cx + s * 13.5, 70.5), 10)[1:], "snow", 2.2)
    # barba ondulada
    beard = []
    for k in range(121):
        th = math.pi * k / 120
        r = 24 + 2.6 * abs(math.sin(6 * th))
        beard.append((cx - r * math.cos(th), 60 + 1.45 * r * math.sin(th)))
    d.path(beard, "snow", 2.6)
    d.path(cubic((cx - 5, 76), (cx - 2, 78.5), (cx + 2, 78.5), (cx + 5, 76), 12), "red", 1.9)  # boca
    for x, y in [(18, 30), (88, 58), (17, 76), (86, 20), (90, 88)]:
        sparkle(d, x, y)
    d.lettering(["Feliz Natal"], FONT, 13.5, (cx, 124), "red", sp=2.6, tracking=.2)
    return d


def sagrada_familia():
    d = Design(); frame(d, "gold")
    # estrela de Belém com raios
    d.path(star(52.5, 19, 6.5, 2.7), "gold", 2.2, closed=True, corners=True)
    for k in range(8):
        a = math.pi * k / 4 + math.pi / 8
        d.segment((52.5 + 8.5 * math.cos(a), 19 + 8.5 * math.sin(a)), (52.5 + 11 * math.cos(a), 19 + 11 * math.sin(a)), "gold")
    # Maria (esquerda, ajoelhada com véu)
    mx = 31
    d.path(ellipse(mx, 41, 7.2, 7.2, 50), "gold", 2.4, closed=True)                     # auréola
    d.path(ellipse(mx, 42, 3.8, 4.6, 30), "brown", 1.8, closed=True)                    # rosto
    veil = cubic((mx - 2, 98), (mx - 13, 80), (mx - 10, 38), (mx, 35.5), 40) + cubic((mx, 35.5), (mx + 10, 38), (mx + 12, 62), (mx + 13, 98), 40)[1:]
    d.path(veil, "green", 2.6)
    d.path(cubic((mx - 5, 49), (mx - 3, 64), (mx - 1, 82), (mx + 1, 98), 30), "green", 2.6)
    d.path([(mx - 1.5, 61), (mx + 1.5, 55), (mx + 4.5, 61)], "brown", 1.8)              # mãos em oração
    d.path([(mx - 2, 98), (mx + 13, 98)], "green", 2.6)
    # José (direita, em pé com cajado)
    jx = 73
    d.path(ellipse(jx, 34, 7.2, 7.2, 50), "gold", 2.4, closed=True)
    d.path(ellipse(jx, 35, 3.8, 4.6, 30), "brown", 1.8, closed=True)
    d.path(cubic((jx - 4, 37), (jx - 4, 44), (jx + 4, 44), (jx + 4, 37), 16), "brown", 1.8)   # barba
    robe = [(jx - 8, 46)] + cubic((jx - 8, 46), (jx - 11, 64), (jx - 12, 84), (jx - 13, 98), 30)[1:] + [(jx + 11, 98)] \
        + cubic((jx + 11, 98), (jx + 10, 82), (jx + 10, 62), (jx + 8, 46), 30)[1:] + [(jx - 8, 46)]
    d.path(robe, "red", 2.6)
    d.path(cubic((jx - 7, 47), (jx - 2, 56), (jx + 2, 56), (jx + 7, 47), 16), "gold", 2.2)    # gola
    d.path([(jx + 15, 98), (jx + 15, 36)] + cubic((jx + 15, 36), (jx + 15, 29), (jx + 21, 29), (jx + 21, 34), 14)[1:], "brown", 2.4)
    # manjedoura com o Menino Jesus
    d.path(cubic((38, 86), (41, 95), (64, 95), (67, 86), 30), "brown", 2.4)
    d.path([(43, 105), (56, 92)], "brown", 2.4); d.path([(62, 105), (49, 92)], "brown", 2.4)
    for x, a in [(42, -1.1), (47, -1.35), (52.5, -1.57), (58, -1.8), (63, -2.05)]:
        d.segment((x, 87.5), (x + 3.2 * math.cos(a), 87.5 + 3.2 * math.sin(a)), "gold")
    d.path(ellipse(54, 83, 9.5, 4.2, 40), "gold", 2.2, closed=True)                     # manta
    d.path(ellipse(44.5, 81.5, 2.8, 2.8, 20), "brown", 1.7, closed=True)                # cabecinha
    d.path(ellipse(44.5, 81.5, 5.2, 5.2, 30, math.pi * 0.95, math.pi * 2.05), "gold", 2.0)   # auréola
    for x, y in [(16, 26), (89, 22), (14, 62), (92, 60)]:
        sparkle(d, x, y, 1.8)
    # o texto usa a área de baixo
    for i, j, c in []: pass
    d.lettering(["Noite Feliz"], FONT, 13.5, (52.5, 124), "red", sp=2.6, tracking=.2)
    return d


ESPECIAIS = [
    ("E01", "Presépio · Sagrada Família", "Molde especial · Árvore e casa", sagrada_familia, "Médio"),
    ("E02", "Cartão Papai Noel · Feliz Natal", "Molde especial · Cartões e presentes", papai_noel, "Médio"),
]

if __name__ == "__main__":
    os.makedirs(BUILD, exist_ok=True)
    for cod, nome, tag, fn, niv in ESPECIAIS:
        open(os.path.join(BUILD, f"{cod}.html"), "w").write(page("classico", d=fn(), title=nome, tagline=tag, nivel=niv))
    print("ok")
