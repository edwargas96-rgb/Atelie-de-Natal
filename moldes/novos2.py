"""Lote 2: moldes mais elaborados e em papel redondo (estilo Clássico)."""
import math, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gerador import *
from estilos import page, frame, holly_leaf

CX, CY = 52.5, 74

def circle(cx, cy, r, n=90):
    return [(cx + r * math.cos(2 * math.pi * k / n), cy + r * math.sin(2 * math.pi * k / n)) for k in range(n)]

def polar(r, a, cx=CX, cy=CY): return (cx + r * math.cos(a), cy + r * math.sin(a))

def guirlanda():
    d = Design(); d.cuts = [(CX, CY, 46)]
    d.path(circle(CX, CY, 21), "gold", 3.0, closed=True)
    n = 10; R = 29
    for k in range(n):
        a = -math.pi / 2 + 2 * math.pi * k / n
        base = polar(R, a)
        o, rib = holly_leaf(base, a + math.pi / 2, 18, 7.5)
        d.path(o, "green", 2.8, closed=True); d.path(rib, "green", 2.8)
        if k % 2 == 1:
            for dx in (-1.6, 1.6, 0):
                px, py = polar(R + (2.2 if dx == 0 else -0.6), a + dx * 0.045)
                d.knot(px, py, "red", 1.35)
    for k in range(10):
        a = -math.pi / 2 + math.pi / 10 + 2 * math.pi * k / 10
        x, y = polar(38.5, a); d.knot(x, y, "gold", 0.95)
    for s in (-1, 1):  # laço no topo
        loop = cubic((CX, 43.5), (CX + s * 16, 28), (CX + s * 20, 44), (CX, 43.5), 40)
        d.path(loop, "red", 2.6, closed=True)
        d.path([(CX, 44), (CX + s * 8, 56)], "red", 2.6)
    d.knot(CX, 44, "red", 1.7)
    d.lettering(["Feliz", "Natal"], "dancing-script-latin-700-normal.woff", 11.5, (CX, CY + 3), "red", sp=2.5, line_h=12.5)
    return d

def bola():
    d = Design(); d.cuts = [(CX, CY, 46)]
    d.path(circle(CX, CY, 40), "gold", 3.0, closed=True)
    d.path(circle(CX, CY, 35), "green", 3.0, closed=True)
    for k in range(24):
        x, y = polar(37.5, 2 * math.pi * k / 24); d.knot(x, y, "gold" if k % 2 else "red", 0.9)
    for k in range(8):
        a = -math.pi / 2 + 2 * math.pi * k / 8
        col = "red" if k % 2 == 0 else "green"
        b, t = polar(6, a), polar(29, a); nx, ny = -math.sin(a), math.cos(a)
        c1 = (b[0] + (t[0] - b[0]) * .3 + nx * 8, b[1] + (t[1] - b[1]) * .3 + ny * 8)
        c2 = (b[0] + (t[0] - b[0]) * .75 + nx * 7, b[1] + (t[1] - b[1]) * .75 + ny * 7)
        c3 = (b[0] + (t[0] - b[0]) * .75 - nx * 7, b[1] + (t[1] - b[1]) * .75 - ny * 7)
        c4 = (b[0] + (t[0] - b[0]) * .3 - nx * 8, b[1] + (t[1] - b[1]) * .3 - ny * 8)
        d.path(cubic(b, c1, c2, t, 20) + cubic(t, c3, c4, b, 20)[1:], col, 2.9, closed=True)
        x, y = polar(33, a + math.pi / 8)
    for k in range(8):
        x, y = polar(26.5, -math.pi / 2 + math.pi / 8 + 2 * math.pi * k / 8); d.knot(x, y, "gold", 1.15)
    d.path(star(CX, CY, 5.2, 2.2, 8), "gold", 2.4, closed=True, corners=True)
    return d

def arvore2():
    d = Design(); frame(d, "gold")
    cx = 52.5
    def side(y, yt, wt, yb, wb): return wt + (wb - wt) * (y - yt) / (yb - yt)
    def scal(xa, xb, y, n):
        pts = []; st = (xb - xa) / n
        for i in range(n):
            a = xa + i * st; c = a + st / 2; r = st / 2
            for t in range(13):
                ang = math.pi * t / 12; pts.append((c - r * math.cos(ang), y + r * 0.8 * math.sin(ang)))
        return pts
    tiers = [(40, 3, 62, 15, 3), (56, 10, 82, 22, 4), (72, 14, 104, 30, 5)]
    prev = None
    for (yt, wt, yb, wb, n) in tiers:
        ys = yt if prev is None else prev + 5
        wl = side(ys, yt, wt, yb, wb)
        pts = [(cx - wl, ys), (cx - wb, yb)] + scal(cx - wb, cx + wb, yb, n) + [(cx + wb, yb), (cx + wl, ys)]
        d.path(pts, "green", 2.9)
        prev = yb
    d.path([(47, 106), (47, 117), (58, 117), (58, 106)], "green", 2.9)
    d.path(star(cx, 29, 8.5, 3.6), "gold", 2.8, closed=True, corners=True)
    for k in range(8):
        a = -math.pi / 2 + k * math.pi / 4 + math.pi / 8; x1, y1 = cx + 12 * math.cos(a), 29 + 12 * math.sin(a)
        d.segment((x1, y1), (cx + 15 * math.cos(a), 29 + 15 * math.sin(a)), "gold")
    for y, w, sag in [(70, 11, 5), (90, 17, 6)]:
        d.path(cubic((cx - w, y), (cx - w / 2, y + sag * 1.4), (cx + w / 2, y + sag * 1.4), (cx + w, y), 30), "gold", 2.8)
    for x, y, c in [(cx, 55, "red"), (cx - 7, 78, "red"), (cx + 8, 79, "gold"), (cx - 14, 98, "gold"), (cx + 15, 99, "red"), (cx, 97, "red"), (cx - 3, 66, "gold"), (cx + 4, 64, "red")]:
        d.knot(x, y, c, 1.5)
    for k, (x, y) in enumerate([(24, 58), (82, 50), (18, 82), (86, 84), (28, 40), (78, 32), (14, 100), (91, 104)]):
        d.segment((x - 1.8, y), (x + 1.8, y), "gold"); d.segment((x, y - 1.8), (x, y + 1.8), "gold")
    d.lettering(["Feliz Natal"], "dancing-script-latin-700-normal.woff", 13.5, (cx, 130), "red", sp=2.9, tracking=0.3)
    return d

LOTE = [("205", "Guirlanda de azevinho", "Molde 205 · Árvore e casa · papel redondo", guirlanda, "Ø 9 cm · papel redondo"),
        ("206", "Bola de Natal rosácea", "Molde 206 · Árvore e casa · papel redondo", bola, "Ø 9 cm · papel redondo"),
        ("207", "Árvore enfeitada", "Molde 207 · Árvore e casa", arvore2, "A6 · 10,5 × 14,8 cm")]
if __name__ == "__main__":
    os.makedirs(BUILD, exist_ok=True)
    for f in os.listdir(BUILD): os.remove(os.path.join(BUILD, f))
    for cod, nome, tag, fn, tam in LOTE:
        open(os.path.join(BUILD, cod + ".html"), "w").write(page("classico", d=fn(), title=nome, tagline=tag, nivel="Médio", tamanho=tam))
