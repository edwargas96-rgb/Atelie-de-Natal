"""Biblioteca de formas do Ateliê de Natal (estilo Clássico).
Cada forma é desenhada em coordenadas locais (centro 0,0; ~100 de altura) e depois escalada/posicionada.
"""
import math, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gerador import *
from estilos import holly_leaf


def chaikin(pts, it=2, closed=True):
    p = list(pts)
    for _ in range(it):
        q = []
        n = len(p)
        for i in range(n if closed else n - 1):
            a, b = p[i], p[(i + 1) % n]
            q += [(.75 * a[0] + .25 * b[0], .75 * a[1] + .25 * b[1]), (.25 * a[0] + .75 * b[0], .25 * a[1] + .75 * b[1])]
        p = q
    return p


def circ(cx, cy, r, n=90):
    return [(cx + r * math.cos(2 * math.pi * k / n), cy + r * math.sin(2 * math.pi * k / n)) for k in range(n)]


class L:
    """Atalhos para desenhar em coordenadas locais com espaçamento fixo em mm após a escala."""
    def __init__(self, k):
        self.d = Design(); self.k = k
    def P(self, pts, c, closed=False, corners=False, sp=3.0):
        self.d.path(pts, c, sp / self.k, closed=closed, corners=corners)
    def S(self, a, b, c): self.d.segment(a, b, c)
    def K(self, x, y, c, r=1.5): self.d.knot(x, y, c, r / self.k)
    def X(self, x, y, c="gold", s=2.4):
        self.S((x - s, y), (x + s, y), c); self.S((x, y - s), (x, y + s), c)


def holly(l, x, y, ang, size, c="green"):
    o, rib = holly_leaf((x, y), ang, size, size * .42)
    l.P(o, c, closed=True, sp=2.8); l.P(rib, c, sp=2.8)


# ---------------------------------------------------------------- formas
def m_tree(l, simple=False, **_):
    def scal(xa, xb, y, n):
        pts = []; st = (xb - xa) / n
        for i in range(n):
            a = xa + i * st; c = a + st / 2; r = st / 2
            for t in range(13):
                ang = math.pi * t / 12; pts.append((c - r * math.cos(ang), y + r * .8 * math.sin(ang)))
        return pts
    tiers = [(-33, 3, -11, 15, 3), (-17, 10, 9, 22, 4), (-1, 14, 31, 30, 5)]
    prev = None
    for (yt, wt, yb, wb, n) in tiers:
        ys = yt if prev is None else prev + 5
        wl = wt + (wb - wt) * (ys - yt) / (yb - yt)
        l.P([(-wl, ys), (-wb, yb)] + scal(-wb, wb, yb, n) + [(wb, yb), (wl, ys)], "green")
        prev = yb
    l.P([(-5.5, 33), (-5.5, 44), (5.5, 44), (5.5, 33)], "green")
    l.P(star(0, -44, 8.5, 3.6), "gold", closed=True, corners=True)
    if not simple:
        for y, w, sag in [(-3, 11, 5), (17, 17, 6)]:
            l.P(cubic((-w, y), (-w / 2, y + sag * 1.4), (w / 2, y + sag * 1.4), (w, y), 30), "gold")
        for x, y, c in [(0, -18, "red"), (-7, 5, "red"), (8, 6, "gold"), (-14, 25, "gold"), (15, 26, "red"), (0, 24, "red"), (-3, -7, "gold"), (4, -9, "red")]:
            l.K(x, y, c)
        for x, y in [(-28, -15), (30, -24), (-34, 8), (34, 12)]: l.X(x, y)


def sub(l, name, x, y, size, swap=False, **kw):
    """Desenha uma forma menor dentro de outra, mantendo o espaçamento real dos furos."""
    kr = l.k * size / 100.0
    s = L(kr); MOTIFS[name](s, simple=True, **kw)
    merge(l.d, s.d, x, y, size / 100.0, swap)


def m_star(l, simple=False, **_):
    l.P(star(0, 0, 40, 17), "gold", closed=True, corners=True)
    if not simple:
        l.P(star(0, 0, 22, 9.5), "red", closed=True, corners=True)
        for k in range(5):
            a = -math.pi / 2 + k * 2 * math.pi / 5 + math.pi / 5
            l.K(33 * math.cos(a), 33 * math.sin(a), "green", 1.4)
    l.K(0, 0, "red", 2.0)


def m_snowflake(l, simple=False, **_):
    for k in range(6):
        a = k * math.pi / 3; ux, uy = math.cos(a), math.sin(a); nx, ny = -uy, ux
        l.P([(0, 0), (ux * 44, uy * 44)], "red", sp=3.0)
        for t, w in [(.5, 9), (.75, 6)]:
            bx, by = ux * 44 * t, uy * 44 * t
            for s in (-1, 1):
                l.S((bx, by), (bx + ux * w * .7 + nx * s * w, by + uy * w * .7 + ny * s * w), "red")
        if not simple: l.K(ux * 48, uy * 48, "gold", 1.2)
    if not simple: l.P(circ(0, 0, 9, 24), "gold", closed=True, sp=3.0)
    l.K(0, 0, "gold", 1.6)


def m_bell(l, simple=False, **_):
    left = cubic((-7, -22), (-7, -4), (-16, 8), (-28, 22), 50)
    right = [(-x, y) for x, y in left]
    l.P(left + right[::-1], "gold")
    l.P([(-7, -22), (7, -22)], "gold"); l.P([(-30, 28), (30, 28)], "gold")
    l.K(0, 36, "gold", 1.8)
    holly(l, 0, -30, math.radians(205), 17); holly(l, 0, -30, math.radians(-25), 17)
    for x, y in [(-3, -31), (3, -31), (0, -27.5)]: l.K(x, y, "red", 1.4)
    if not simple:
        l.P(cubic((-18, 10), (-8, 17), (8, 17), (18, 10), 30), "red")
        for x in (-12, 0, 12): l.K(x, 21, "green", 1.2)


def m_stocking(l, simple=False, v=0, **_):
    l.P([(-12, -38), (14, -38), (14, 10), (30, 18), (36, 30), (28, 39), (12, 38), (-8, 28), (-12, 20)], "red", closed=True, corners=True)
    l.P([(-12, -24), (14, -24)], "gold")
    if v == 1:
        for y in (-14, -4, 6): l.P([(-12, y + 4), (14, y - 2)], "green")
        l.P([(-4, 24), (24, 24)], "gold")
    elif v == 2:
        sub(l, "floco de neve", 1, -4, 22)
    elif v == 3:
        sub(l, "coração", 1, -6, 20); l.P([(-12, 12), (14, 12)], "green")
    else:
        l.P(star(1, -6, 5.5, 2.3), "gold", closed=True, corners=True)
    if v == 0 and not simple:
        for x, y in [(-6, -31), (1, -31), (8, -31), (-2, 14), (8, 22)]: l.K(x, y, "green", 1.3)
        holly(l, 1, -48, math.radians(200), 14); holly(l, 1, -48, math.radians(-20), 14); l.K(1, -50, "red", 1.4)


def m_gift(l, simple=False, **_):
    l.P([(-24, 0), (25, 0), (25, 38), (-24, 38)], "red", closed=True, corners=True)
    l.P([(-27, -12), (28, -12), (28, 0), (-27, 0)], "red", closed=True, corners=True)
    l.P([(0, -12), (0, 38)], "gold")
    for s in (-1, 1): l.P(cubic((0, -12), (s * 22, -36), (s * 30, -16), (0, -12), 40), "gold", closed=True)
    l.K(0, -11, "gold", 1.8)
    if not simple:
        for x, y in [(-14, 14), (13, 22), (-12, 30)]: l.K(x, y, "green", 1.3)


def m_candle(l, simple=False, **_):
    l.P([(-10, -10), (10, -10), (10, 34), (-10, 34)], "red", closed=True, corners=True)
    l.P([(-18, 34), (18, 34), (14, 42), (-14, 42)], "gold", closed=True, corners=True)
    l.P(chaikin([(0, -42), (6, -28), (5, -16), (0, -11), (-5, -16), (-6, -28)], 2), "gold", closed=True)
    l.K(0, -21, "red", 1.4)
    if not simple:
        l.P(cubic((-10, 4), (-6, 10), (-3, 4), (-2, 12), 20), "gold")
        holly(l, -4, 34, math.radians(190), 14); holly(l, 4, 34, math.radians(-10), 14)
        for x, y in [(-1, 33), (3, 33), (1, 36)]: l.K(x, y, "red", 1.3)


def m_heart(l, simple=False, **_):
    l.P(heart(0, 0, 40), "red", closed=True)
    if not simple:
        l.P(heart(0, 1, 23), "gold", closed=True)
        for x, y in [(-30, -28), (30, -28), (0, 36)]: l.K(x, y, "green", 1.3)
    l.K(0, -4, "gold", 1.6)


def m_ginger(l, simple=False, **_):
    p = [(-9, -40), (9, -40), (14, -32), (14, -23), (9, -19), (26, -24), (33, -18), (33, -10), (26, -8), (14, -6), (14, 6), (24, 26), (24, 38), (14, 40), (5, 22), (0, 18), (-5, 22), (-14, 40), (-24, 38), (-24, 26), (-14, 6), (-14, -6), (-26, -8), (-33, -10), (-33, -18), (-26, -24), (-9, -19), (-14, -23), (-14, -32)]
    l.P(chaikin(p, 2), "gold", closed=True)
    l.K(-5, -31, "red", 1.3); l.K(5, -31, "red", 1.3)
    l.P(cubic((-6, -25), (-3, -21), (3, -21), (6, -25), 14), "red", sp=2.4)
    for y in (-8, 3, 14): l.K(0, y, "green" if y != 3 else "red", 1.5)
    if not simple:
        for s in (-1, 1): l.P([(s * 27, -22), (s * 30, -12)], "red", sp=2.6)
        for s in (-1, 1): l.P([(s * 19, 32), (s * 20, 37)], "red", sp=2.6)


def m_mitten(l, simple=False, **_):
    l.P(chaikin([(-16, -32), (14, -32), (20, -8), (20, 26), (-20, 26), (-20, -4), (-34, -12), (-38, -2), (-20, 14)][:0] or [(-15, -34), (15, -34), (20, -6), (20, 28), (-20, 28), (-20, 6), (-36, -2), (-32, -14), (-20, -6)], 2), "red", closed=True)
    l.P([(-20, 16), (20, 16)], "gold")
    l.P([(-20, 22), (20, 22)], "gold")
    if not simple:
        l.P(star(0, -12, 7, 3), "gold", closed=True, corners=True)
        for x, y in [(-8, -22), (8, -22), (-9, -2), (9, -2)]: l.K(x, y, "green", 1.2)


def m_snowman(l, simple=False, **_):
    l.P(circ(0, 24, 20), "gold", closed=True); l.P(circ(0, -6, 14), "gold", closed=True); l.P(circ(0, -28, 10), "gold", closed=True)
    l.P([(-9, -36), (9, -36), (7, -48), (-7, -48)], "red", closed=True, corners=True); l.P([(-13, -36), (13, -36)], "red")
    l.P([(0, -28), (11, -26), (0, -25)], "red", closed=True, corners=True)
    l.K(-4, -31, "green", 1.0); l.K(4, -31, "green", 1.0)
    for y in (-8, 2, 14, 26): l.K(0, y, "green", 1.4)
    if not simple:
        l.P([(-13, -14), (-34, -22)], "green"); l.P([(13, -14), (34, -22)], "green")
        l.P(cubic((-9, -17), (-4, -12), (4, -12), (9, -17), 14), "red", sp=2.6)


def m_cane(l, simple=False, **_):
    hook = cubic((-14, 10), (-14, -34), (22, -34), (22, -10), 60)
    stem = [(-14, 10), (-14, 46)]
    w = 5
    def off(pts, s):
        out = []
        for i, (x, y) in enumerate(pts):
            a, b = pts[max(0, i - 1)], pts[min(len(pts) - 1, i + 1)]
            tx, ty = b[0] - a[0], b[1] - a[1]; n = math.hypot(tx, ty) or 1
            out.append((x - ty / n * w * s, y + tx / n * w * s))
        return out
    path = stem[::-1] + hook[1:]
    l.P(off(path, 1), "red"); l.P(off(path, -1), "red")
    l.P([off(path, 1)[0], off(path, -1)[0]], "red"); l.P([off(path, 1)[-1], off(path, -1)[-1]], "red")
    n = len(path); a, b = off(path, 1), off(path, -1)
    for i in range(6, n, 9):
        l.S(a[i], b[min(n - 1, i + 3)], "green" if i % 2 else "red")
    if not simple:
        l.P(cubic((-14, 46), (-26, 48), (-30, 40), (-24, 34), 20), "gold", sp=2.6)


def m_wreath(l, simple=False, n=10, **_):
    l.P(circ(0, 0, 21), "gold", closed=True)
    for k in range(n):
        a = -math.pi / 2 + 2 * math.pi * k / n
        bx, by = 29 * math.cos(a), 29 * math.sin(a)
        holly(l, bx, by, a + math.pi / 2, 18)
        if k % 2 and not simple:
            for dx in (-1.6, 1.6, 0):
                l.K(33 * math.cos(a + dx * .04) if dx == 0 else 27 * math.cos(a + dx * .05), 33 * math.sin(a + dx * .04) if dx == 0 else 27 * math.sin(a + dx * .05), "red", 1.3)
    for s in (-1, 1):
        l.P(cubic((0, -29), (s * 16, -46), (s * 20, -28), (0, -29), 40), "red", closed=True, sp=2.8)
    l.K(0, -29, "red", 1.7)


def m_rosette(l, simple=False, n=8, **_):
    l.P(circ(0, 0, 44), "gold", closed=True); l.P(circ(0, 0, 38), "green", closed=True)
    for k in range(n):
        a = -math.pi / 2 + 2 * math.pi * k / n
        b = (6 * math.cos(a), 6 * math.sin(a)); t = (29 * math.cos(a), 29 * math.sin(a)); nx, ny = -math.sin(a), math.cos(a)
        c1 = (b[0] + (t[0] - b[0]) * .3 + nx * 8, b[1] + (t[1] - b[1]) * .3 + ny * 8); c2 = (b[0] + (t[0] - b[0]) * .75 + nx * 7, b[1] + (t[1] - b[1]) * .75 + ny * 7)
        c3 = (b[0] + (t[0] - b[0]) * .75 - nx * 7, b[1] + (t[1] - b[1]) * .75 - ny * 7); c4 = (b[0] + (t[0] - b[0]) * .3 - nx * 8, b[1] + (t[1] - b[1]) * .3 - ny * 8)
        l.P(cubic(b, c1, c2, t, 20) + cubic(t, c3, c4, b, 20)[1:], "red" if k % 2 == 0 else "green", closed=True)
    for k in range(n):
        l.K(24 * math.cos(-math.pi / 2 + math.pi / n + 2 * math.pi * k / n), 24 * math.sin(-math.pi / 2 + math.pi / n + 2 * math.pi * k / n), "gold", 1.2)
    l.P(star(0, 0, 5.5, 2.3, 8), "gold", closed=True, corners=True)


def m_ornament(l, simple=False, **_):
    l.P(circ(0, 8, 30), "red", closed=True)
    l.P([(-6, -24), (6, -24), (6, -16), (-6, -16)], "gold", closed=True, corners=True)
    l.P(cubic((0, -24), (-9, -40), (9, -40), (0, -24), 24), "gold", closed=True, sp=2.8)
    for y, w in [(-6, 26), (8, 30), (22, 26)]:
        l.P(cubic((-w, y), (-w / 2, y + 5), (w / 2, y + 5), (w, y), 24), "gold" if y == 8 else "green")
    if not simple:
        for x, y in [(-12, 0), (0, 2), (12, 0), (-16, 15), (-4, 16), (8, 15), (18, 16)]: l.K(x, y, "gold" if y < 10 else "green", 1.1)


def m_holly(l, simple=False, **_):
    for ang, sz in [(200, 28), (-20, 28), (100, 20)]: holly(l, 0, 0, math.radians(ang), sz)
    for x, y in [(-3, -3), (3, -3), (0, 3)]: l.K(x, y, "red", 1.9)
    if not simple:
        for x, y in [(-30, -22), (30, -22), (0, 36)]: l.X(x, y)


def m_moon(l, simple=False, **_):
    out = [(30 * math.cos(2 * math.pi * k / 120), 30 * math.sin(2 * math.pi * k / 120)) for k in range(120)]
    ox = [p for p in out if math.hypot(p[0] - 14, p[1] + 6) > 25]
    ins = [p for p in [(14 + 25 * math.cos(2 * math.pi * k / 120), -6 + 25 * math.sin(2 * math.pi * k / 120)) for k in range(120)] if math.hypot(*p) < 30]
    ox.sort(key=lambda p: math.atan2(p[1], p[0]) % (2 * math.pi)); ins.sort(key=lambda p: -(math.atan2(p[1], p[0] - 0) % (2 * math.pi)))
    l.P(ox + ins, "gold", closed=True)
    for x, y, s in [(26, -24, 6), (36, 4, 4), (22, 26, 5)]:
        l.P(star(x, y, s, s * .42), "gold", closed=True, corners=True)
    if not simple:
        for x, y in [(-8, -14), (-2, 8), (-12, 12)]: l.K(x, y, "green", 1.1)


def m_envelope(l, inner="estrela", **_):
    l.P([(-40, -24), (40, -24), (40, 30), (-40, 30)], "green", closed=True, corners=True)
    l.P([(-40, -24), (0, 6), (40, -24)], "green")
    l.P([(-40, 30), (-12, 4)], "green"); l.P([(40, 30), (12, 4)], "green")
    l.K(0, 8, "red", 2.2)
    sub(l, inner, 0, -9, 22)
    for x, y in [(-30, 20), (30, 20)]: l.X(x, y)


def m_sacola(l, inner="estrela", **_):
    l.P([(-30, -14), (30, -14), (30, 40), (-30, 40)], "red", closed=True, corners=True)
    l.P([(-30, -4), (30, -4)], "gold")
    l.P(cubic((-15, -14), (-15, -42), (15, -42), (15, -14), 40), "gold")
    sub(l, inner, 0, 18, 32)
    for x in (-22, -11, 0, 11, 22): l.K(x, 33, "green", 1.1)


def m_varal(l, inners=("estrela", "coração", "bolinha", "sino", "azevinho"), **_):
    curve = cubic((-46, -34), (-18, -8), (18, -8), (46, -34), 60)
    l.P(curve, "gold", sp=3.2)
    for i, idx in enumerate((6, 18, 30, 42, 54)):
        x, y = curve[idx]
        col = "red" if i % 2 == 0 else "green"
        l.P([(x - 10, y + 1), (x + 10, y + 1), (x, y + 30)], col, closed=True, corners=True)
        sub(l, inners[i % len(inners)], x, y + 11, 11)
    l.K(-46, -36, "gold", 1.8); l.K(46, -36, "gold", 1.8)
    for x, y in [(-30, 30), (30, 30), (0, 38)]: l.X(x, y)


def _cone(l, x, top, bottom, w, col, crown=False):
    l.P([(x, top), (x - w, bottom), (x + w, bottom)], col, closed=True, corners=True)
    l.P(circ(x, top - 7, 5.5, 22), "gold", closed=True, sp=2.8)
    if crown: l.P([(x - 6, top - 14), (x - 4, top - 20), (x, top - 15), (x + 4, top - 20), (x + 6, top - 14)], "gold", sp=2.4)


def m_presepio(l, simple=False, **_):
    l.P([(-42, -6), (0, -34), (42, -6)], "gold"); l.P([(-36, -4), (-36, 36)], "gold"); l.P([(36, -4), (36, 36)], "gold")
    l.P([(-46, 36), (46, 36)], "green")
    l.P(star(0, -46, 8, 3.4), "gold", closed=True, corners=True)
    _cone(l, -20, 8, 36, 9, "red"); _cone(l, 22, 6, 36, 9, "green")
    l.P([(-8, 26), (8, 26), (5, 36), (-5, 36)], "gold", closed=True, corners=True)
    l.K(0, 22, "red", 1.7)
    if not simple:
        for x, y in [(-30, -44), (32, -40), (-38, -30)]: l.X(x, y)


def m_reis(l, simple=False, **_):
    l.P(star(0, -44, 9, 3.8), "gold", closed=True, corners=True)
    for x, col in ((-28, "red"), (0, "green"), (28, "red")):
        _cone(l, x, -4, 34, 10, col, crown=True)
    for x in (-28, 0, 28): l.K(x, 14, "gold", 1.5)
    l.P([(-46, 36), (46, 36)], "gold")
    if not simple:
        for x, y in [(-40, -30), (40, -28)]: l.X(x, y)


def m_anjo(l, simple=False, **_):
    l.P(circ(0, -38, 9, 28), "gold", closed=True, sp=2.8)
    l.P(circ(0, -28, 7, 22), "red", closed=True, sp=2.8)
    l.P([(-10, -20), (10, -20), (18, 34), (-18, 34)], "red", closed=True, corners=True)
    for s in (-1, 1):
        l.P(cubic((s * 9, -14), (s * 30, -48), (s * 46, -18), (s * 14, 6), 30), "green", closed=True, sp=2.8)
        l.K(s * 22, -16, "gold", 1.2)
    l.P([(-18, 22), (18, 22)], "gold")
    if not simple:
        for x, y in [(-36, -40), (38, -36), (0, 44)]: l.X(x, y)


def m_ovelha(l, simple=False, **_):
    body = [(26 * math.cos(2 * math.pi * k / 120) + 3 * math.cos(2 * math.pi * k / 120 * 9) * math.cos(2 * math.pi * k / 120), 20 * math.sin(2 * math.pi * k / 120) + 3 * math.sin(2 * math.pi * k / 120 * 9)) for k in range(120)]
    l.P(body, "gold", closed=True)
    l.P(chaikin([(-36, -8), (-24, -14), (-20, 2), (-30, 8), (-38, 4)], 2), "green", closed=True)
    l.K(-31, -4, "red", 1.1)
    for x in (-14, -4, 10, 20): l.P([(x, 18), (x, 40)], "green", sp=3.0)
    if not simple:
        l.P(star(0, -40, 7, 3), "gold", closed=True, corners=True)
        for x, y in [(0, -4), (12, 2), (-8, 6)]: l.K(x, y, "green", 1.1)


def m_lareira(l, simple=False, **_):
    l.P([(-46, -26), (46, -26), (46, -16), (-46, -16)], "gold", closed=True, corners=True)
    l.P([(-36, -16), (-36, 42), (36, 42), (36, -16)], "red")
    l.P([(-24, 42), (-24, 4)] + cubic((-24, 4), (-24, -12), (24, -12), (24, 4), 30) + [(24, 42)], "gold")
    l.P(chaikin([(-9, 42), (-13, 28), (-5, 16), (-2, 24), (4, 8), (11, 26), (15, 30), (13, 42)], 2), "red", closed=True, sp=2.8)
    l.P([(-14, 42), (14, 42)], "green")
    sub(l, "vela", -30, -42, 26); sub(l, "vela", 30, -42, 26)
    l.P(star(0, -42, 7, 3), "gold", closed=True, corners=True)
    if not simple:
        for x in (-30, -15, 0, 15, 30): l.K(x, -21, "green", 1.1)


MOTIFS = {
    "envelope": m_envelope, "sacola": m_sacola, "varal": m_varal, "presépio": m_presepio, "reis magos": m_reis,
    "anjo": m_anjo, "ovelha": m_ovelha, "lareira": m_lareira,
    "árvore": m_tree, "estrela": m_star, "floco de neve": m_snowflake, "sino": m_bell, "meia": m_stocking,
    "presente": m_gift, "vela": m_candle, "coração": m_heart, "biscoito de gengibre": m_ginger, "luva": m_mitten,
    "boneco de neve": m_snowman, "bengala doce": m_cane, "guirlanda": m_wreath, "rosácea": m_rosette,
    "bolinha": m_ornament, "azevinho": m_holly, "lua e estrelas": m_moon,
}
SWAP = {"red": "green", "green": "red"}


def merge(dst, src, cx, cy, k, swap=False):
    base = len(dst.holes)
    rc = (lambda c: SWAP.get(c, c)) if swap else (lambda c: c)
    dst.holes += [(cx + x * k, cy + y * k, rc(c)) for x, y, c in src.holes]
    dst.stitches += [(base + i, base + j, rc(c)) for i, j, c in src.stitches]
    dst.knots += [(cx + x * k, cy + y * k, rc(c), r * k) for x, y, c, r in src.knots]


def motif(dst, name, cx, cy, size, swap=False, simple=False, **kw):
    k = size / 100.0
    l = L(k); MOTIFS[name](l, simple=simple, **kw)
    merge(dst, l.d, cx, cy, k, swap)
