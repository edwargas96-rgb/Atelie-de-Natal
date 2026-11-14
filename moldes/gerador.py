"""Gerador de moldes de bordado em papel (Ateliê de Natal).

Cada molde é desenhado em milímetros. As linhas viram furos espaçados por igual,
e a mesma geometria gera a prévia "como fica bordado".
Uso: python3 moldes/gerador.py  -> cria moldes/build/*.html (renderizados por render.js)
"""
import math, os, html
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(ROOT, "fonts")
BUILD = os.path.join(ROOT, "build")

# ---------------------------------------------------------------- geometria
def resample(pts, sp, closed=False):
    pts = [tuple(p) for p in pts]
    if closed and pts[0] != pts[-1]:
        pts = pts + [pts[0]]
    seg = [math.dist(pts[i], pts[i + 1]) for i in range(len(pts) - 1)]
    L = sum(seg)
    if L == 0:
        return [pts[0]]
    n = max(1, round(L / sp))
    out, acc, i = [], 0.0, 0
    targets = [L * k / n for k in range(n if closed else n + 1)]
    for t in targets:
        while i < len(seg) - 1 and acc + seg[i] < t:
            acc += seg[i]; i += 1
        f = 0 if seg[i] == 0 else (t - acc) / seg[i]
        f = min(max(f, 0), 1)
        a, b = pts[i], pts[i + 1]
        out.append((a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f))
    return out


def cubic(p0, p1, p2, p3, n=60):
    out = []
    for k in range(n + 1):
        t = k / n; u = 1 - t
        out.append((u**3*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t**3*p3[0],
                    u**3*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t**3*p3[1]))
    return out


def rot(p, ang, origin=(0, 0)):
    c, s = math.cos(ang), math.sin(ang)
    x, y = p[0] - origin[0], p[1] - origin[1]
    return (origin[0] + x*c - y*s, origin[1] + x*s + y*c)


def star(cx, cy, R, r, pts=5, ang=-math.pi/2):
    return [(cx + (R if i % 2 == 0 else r) * math.cos(ang + i*math.pi/pts),
             cy + (R if i % 2 == 0 else r) * math.sin(ang + i*math.pi/pts)) for i in range(pts*2)]


def heart(cx, cy, s):
    out = []
    for k in range(80):
        t = 2*math.pi*k/80
        x = 16*math.sin(t)**3
        y = 13*math.cos(t) - 5*math.cos(2*t) - 2*math.cos(3*t) - math.cos(4*t)
        out.append((cx + x*s/16, cy - y*s/16))
    return out


def holly_leaf(base, ang, L, W):
    up, lo = [], []
    for k in range(41):
        s = k/40
        y = W/2*math.sin(math.pi*s) + 1.25*(abs(math.sin(3.5*math.pi*s)) - .55)*math.sin(math.pi*s)
        up.append((s*L, -y)); lo.append((s*L, y))
    outline = up + lo[::-1][1:-1]
    outline = [rot((base[0]+x, base[1]+y), ang, base) for x, y in outline]
    rib = [rot((base[0]+L*s, base[1]), ang, base) for s in (0.1, 0.85)]
    return outline, rib


# ---------------------------------------------------------------- desenho (furos + pontos)
class Design:
    def __init__(self):
        self.holes, self.stitches, self.knots = [], [], []

    def path(self, pts, color, sp=3.6, closed=False, jitter=0.0, seed=0, corners=False):
        if corners:  # polígono: cada lado separado, para os furos caírem nas pontas
            ring = list(pts) + ([pts[0]] if closed else [])
            p = []
            for k in range(len(ring) - 1):
                p += resample([ring[k], ring[k + 1]], sp)[:-1]
            if not closed:
                p.append(ring[-1])
        else:
            p = resample(pts, sp, closed)
        if jitter:
            rng = np.random.default_rng(seed)
            p = [(x + rng.normal(0, jitter), y + rng.normal(0, jitter)) for x, y in p]
        base = len(self.holes)
        self.holes += [(x, y, color) for x, y in p]
        m = len(p)
        for i in range(m - 1):
            self.stitches.append((base + i, base + i + 1, color))
        if closed and m > 2:
            self.stitches.append((base + m - 1, base, color))

    def segment(self, a, b, color):
        base = len(self.holes)
        self.holes += [(a[0], a[1], color), (b[0], b[1], color)]
        self.stitches.append((base, base + 1, color))

    def knot(self, x, y, color, r=1.35):
        self.knots.append((x, y, color, r))

    def lettering(self, lines, font, size_mm, center, color, sp=2.8, line_h=None, tracking=0.0, ppm=12):
        """Texto -> linha central (esqueleto) -> furos espaçados -> pontos ao longo do traço."""
        line_h = line_h or size_mm * 1.0
        f = ImageFont.truetype(os.path.join(FONTS, font), int(size_mm * ppm))
        Wpx, Hpx = int(160 * ppm), int((line_h * len(lines) + size_mm) * ppm)
        img = Image.new("L", (Wpx, Hpx), 0)
        d = ImageDraw.Draw(img)
        for li, text in enumerate(lines):
            widths = [d.textlength(ch, font=f) for ch in text]
            total = sum(widths) + tracking * ppm * (len(text) - 1)
            x = (Wpx - total) / 2
            y = (li * line_h + size_mm * 0.15) * ppm
            for ch, w in zip(text, widths):
                d.text((x, y), ch, font=f, fill=255)
                x += w + tracking * ppm
        a = np.array(img) > 110
        sk = thin(a)
        ys, xs = np.nonzero(sk)
        if not len(xs):
            return
        bx0, bx1, by0, by1 = xs.min(), xs.max(), ys.min(), ys.max()
        ox = center[0] - (bx0 + bx1) / 2 / ppm
        oy = center[1] - (by0 + by1) / 2 / ppm
        self._trace_text(sk, ppm, ox, oy, color, sp)
        lab = label(a)                       # pingos (i, j, pontuação) viram nó francês
        for k in range(1, lab.max() + 1):
            yy, xx = np.nonzero(lab == k)
            if max(xx.max() - xx.min(), yy.max() - yy.min()) / ppm < 2.4:
                self.knot(xx.mean() / ppm + ox, yy.mean() / ppm + oy, color, 1.0)

    def _trace_text(self, sk, ppm, ox, oy, color, sp):
        """Letras: segue cada traço entre pontas e junções (fica mais suave em letra cursiva)."""
        chains, cid, cent = trace(sk)
        tomm = lambda q: (q[1] / ppm + ox, q[0] / ppm + oy)
        node_hole = {}
        def hole_for(c):
            if c not in node_hole:
                self.holes.append((*tomm(cent[c]), color)); node_hole[c] = len(self.holes) - 1
            return node_hole[c]
        for ch in chains:
            a_c, b_c = cid.get(ch[0]), cid.get(ch[-1])
            poly = [tomm(q) for q in ch]
            if a_c is not None: poly[0] = tomm(cent[a_c])
            if b_c is not None: poly[-1] = tomm(cent[b_c])
            L = sum(math.dist(poly[k], poly[k + 1]) for k in range(len(poly) - 1))
            closed_loop = ch[0] == ch[-1] and a_c is None
            if a_c is not None and a_c == b_c and L < sp * 1.5:
                continue
            if L < sp * 0.6:
                if a_c is not None and b_c is not None and a_c != b_c:
                    self.stitches.append((hole_for(a_c), hole_for(b_c), color))
                elif (a_c is None) != (b_c is None) and L > sp * 0.35:
                    j = hole_for(a_c if a_c is not None else b_c)
                    self.holes.append((*poly[-1 if a_c is not None else 0], color)); self.stitches.append((j, len(self.holes) - 1, color))
                continue
            p = resample(smooth(poly), sp, closed=closed_loop)
            ids = []
            for k, (x, y) in enumerate(p):
                if k == 0 and a_c is not None: ids.append(hole_for(a_c)); continue
                if k == len(p) - 1 and b_c is not None and not closed_loop: ids.append(hole_for(b_c)); continue
                self.holes.append((x, y, color)); ids.append(len(self.holes) - 1)
            if closed_loop and len(ids) > 2: ids.append(ids[0])
            for k in range(len(ids) - 1):
                if ids[k] != ids[k + 1]:
                    self.stitches.append((ids[k], ids[k + 1], color))
        self._merge(sp * 0.4)


    def _skeleton(self, sk, ppm, ox, oy, color, sp):
        """Esqueleto -> furos espaçados -> liga furos vizinhos pelo caminho do próprio traço."""
        from collections import deque
        S = set(zip(*np.nonzero(sk)))
        if not S:
            return
        step = sp * ppm
        pts = pick_holes(sk, step)                      # (x, y) em pixels
        hid = {(y, x): i for i, (x, y) in enumerate(pts)}
        base = len(self.holes)
        self.holes += [(x / ppm + ox, y / ppm + oy, color) for x, y in pts]
        lim = step * 2.2
        edges = set()
        for i, (x, y) in enumerate(pts):
            start = (y, x); seen = {start: 0.0}; q = deque([start])
            while q:
                p = q.popleft(); dp = seen[p]
                for a in (-1, 0, 1):
                    for b in (-1, 0, 1):
                        if not (a or b):
                            continue
                        r = (p[0] + a, p[1] + b)
                        if r not in S or r in seen:
                            continue
                        dr = dp + (1.414 if a and b else 1.0)
                        if dr > lim:
                            continue
                        seen[r] = dr
                        j = hid.get(r)
                        if j is not None and j != i:
                            edges.add((min(i, j), max(i, j)))   # chegou em outro furo: liga e não passa dele
                            continue
                        q.append(r)
        for i, j in edges:
            self.stitches.append((base + i, base + j, color))

    def from_image(self, path, box, palette, sp=2.6, knot_mm=3.2):
        """Arte em linha (PNG do ChatGPT) -> furos. box=(x, y, w, h) em mm dentro do cartão.
        Cada traço vira furos na cor mais próxima da paleta; bolinhas pequenas viram nó francês."""
        im = Image.open(path).convert("RGB")
        im.thumbnail((1400, 1400))
        a = np.asarray(im).astype(int)
        bg = np.median(np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]]), axis=0)
        ink = np.abs(a - bg).sum(2) > 90
        ys, xs = np.nonzero(ink)
        if not len(xs):
            raise ValueError("imagem sem desenho")
        x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
        s = min(box[2] / (x1 - x0 + 1), box[3] / (y1 - y0 + 1))  # mm por pixel
        ppm = 1 / s
        ox = box[0] + (box[2] - (x1 - x0) * s) / 2 - x0 * s
        oy = box[1] + (box[3] - (y1 - y0) * s) / 2 - y0 * s
        names = list(palette)
        ref = np.array([[int(palette[n][i:i + 2], 16) for i in (1, 3, 5)] for n in names])
        # cor de cada pixel pela "direção" a partir do fundo: rosa claro = vermelho misturado com o papel
        v = (a - bg).astype(float); vr = (ref - bg).astype(float)
        v /= np.linalg.norm(v, axis=2, keepdims=True) + 1e-6; vr /= np.linalg.norm(vr, axis=1, keepdims=True) + 1e-6
        cls = (v[:, :, None, :] * vr[None, None]).sum(3).argmax(2)
        # bordas suavizadas herdam a cor do miolo do traço vizinho
        diff = np.abs(a - bg).sum(2)
        strong = ink & (diff > 0.6 * np.percentile(diff[ink], 90))
        lab_c = np.where(strong, cls, -1)
        for _ in range(8):
            todo = ink & (lab_c < 0)
            if not todo.any():
                break
            P = np.pad(lab_c, 1, constant_values=-1)
            nbmax = np.max([P[1 + dy:P.shape[0] - 1 + dy, 1 + dx:P.shape[1] - 1 + dx] for dy in (-1, 0, 1) for dx in (-1, 0, 1)], axis=0)
            lab_c[todo & (nbmax >= 0)] = nbmax[todo & (nbmax >= 0)]
        cls = np.where(lab_c >= 0, lab_c, cls)
        dep_all = depth(ink)
        stroke = float(np.median(dep_all[thin(ink)]))     # meia espessura típica do traço
        Y, X = np.ogrid[:ink.shape[0], :ink.shape[1]]
        for ci, col in enumerate(names):
            m = ink & (cls == ci)
            if m.sum() < 12:
                continue
            dep = depth(m).astype(float)
            # 1) bolinhas cheias -> nó francês (e somem da máscara antes de traçar linhas)
            cand = np.where(dep > stroke * 2.0, dep, 0)
            while cand.max() > 0:
                cy, cx = np.unravel_index(cand.argmax(), cand.shape); r = dep[cy, cx]
                disk = (Y - cy) ** 2 + (X - cx) ** 2 <= (r * 1.3) ** 2
                if r * 2 * s <= 9.5:
                    self.knot(cx * s + ox, cy * s + oy, col, max(1.1, min(1.8, r * s)))
                    m = m & ~disk
                cand[disk] = 0
            # 2) o resto são traços
            lab = label(m)
            for k in range(1, lab.max() + 1):
                comp = lab == k
                yy, xx = np.nonzero(comp)
                big, small = max(xx.max() - xx.min(), yy.max() - yy.min()) * s, min(xx.max() - xx.min(), yy.max() - yy.min()) * s
                if big < 2.6:                     # pingo do "i" vira nó; resto de bolinha é descartado
                    cx, cy = xx.mean() * s + ox, yy.mean() * s + oy
                    if not any(k[2] == col and (k[0] - cx) ** 2 + (k[1] - cy) ** 2 < 25 for k in self.knots):
                        self.knot(cx, cy, col, 1.1)
                    continue
                spc = sp * 0.75 if small < 10 else sp   # peças finas (letras) pedem furos mais próximos
                self._skeleton(thin(comp), ppm, ox, oy, col, spc)
        return self

    def _merge(self, tol):
        keep, remap = [], {}
        for i, (x, y, c) in enumerate(self.holes):
            for j in keep:
                X, Y, C = self.holes[j]
                if C == c and (X - x)**2 + (Y - y)**2 < tol * tol:
                    remap[i] = j; break
            else:
                keep.append(i); remap[i] = i
        order = {old: n for n, old in enumerate(keep)}
        self.holes = [self.holes[i] for i in keep]
        st = set()
        for i, j, c in self.stitches:
            a, b = order[remap[i]], order[remap[j]]
            if a != b: st.add((min(a, b), max(a, b), c))
        self.stitches = sorted(st)
        self.knots = self.knots


def smooth(poly, it=3):
    p = list(poly)
    for _ in range(it):
        if len(p) < 3: break
        p = [p[0]] + [((p[k-1][0] + 2*p[k][0] + p[k+1][0]) / 4, (p[k-1][1] + 2*p[k][1] + p[k+1][1]) / 4) for k in range(1, len(p) - 1)] + [p[-1]]
    return p


def trace(sk):
    """Esqueleto -> cadeias entre pontas/junções. Junções (pixels vizinhos com 3+ ligações) viram um único nó."""
    S = set(zip(*np.nonzero(sk)))
    def nb(p): return [(p[0]+a, p[1]+b) for a in (-1, 0, 1) for b in (-1, 0, 1) if (a or b) and (p[0]+a, p[1]+b) in S]
    J = {p for p in S if len(nb(p)) >= 3}
    cid, cent, k = {}, {}, 0
    for p in sorted(J):
        if p in cid: continue
        stack, members = [p], []
        while stack:
            q = stack.pop()
            if q in cid: continue
            cid[q] = k; members.append(q)
            stack.extend(r for r in nb(q) if r in J and r not in cid)
        cent[k] = (sum(m[0] for m in members) / len(members), sum(m[1] for m in members) / len(members)); k += 1
    ends = {p for p in S if len(nb(p)) <= 1}
    stop = J | ends
    used, chains = set(), []
    for n in sorted(stop):
        for q in nb(n):
            if q in J and n in J and cid[q] == cid[n]:
                continue
            e = frozenset((n, q))
            if e in used: continue
            used.add(e); ch = [n, q]; prev, cur = n, q
            while cur not in stop:
                nxt = [r for r in nb(cur) if r != prev and frozenset((cur, r)) not in used]
                if not nxt: break
                r = nxt[0]; used.add(frozenset((cur, r))); prev, cur = cur, r; ch.append(cur)
            chains.append(ch)
    seen = {p for ch in chains for p in ch} | J
    rest = S - seen
    while rest:
        st = min(rest); ch = [st]; prev = None; cur = st
        while True:
            nxt = [r for r in nb(cur) if r != prev and r in rest and r not in ch]
            if not nxt: break
            prev, cur = cur, nxt[0]; ch.append(cur)
        ch.append(st); chains.append(ch); rest -= set(ch)
    return chains, cid, cent


def depth(m):
    """Quantas erosões cada pixel aguenta (aprox. da distância até a borda)."""
    d = np.zeros(m.shape, np.int32); cur = m.copy(); k = 0
    while cur.any():
        k += 1; d[cur] = k
        P = np.pad(cur, 1)
        cur = cur & P[:-2, 1:-1] & P[2:, 1:-1] & P[1:-1, :-2] & P[1:-1, 2:]
    return d


def label(mask):
    """Componentes conectados (8 vizinhos), sem scipy."""
    H, W = mask.shape
    lab = np.zeros((H, W), np.int32); k = 0
    for y, x in zip(*np.nonzero(mask)):
        if lab[y, x]:
            continue
        k += 1; stack = [(y, x)]; lab[y, x] = k
        while stack:
            cy, cx = stack.pop()
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    ny, nx = cy + dy, cx + dx
                    if 0 <= ny < H and 0 <= nx < W and mask[ny, nx] and not lab[ny, nx]:
                        lab[ny, nx] = k; stack.append((ny, nx))
    return lab


def thin(img):
    img = img.astype(np.uint8).copy()
    while True:
        changed = False
        for step in (0, 1):
            P = np.pad(img, 1)
            p2, p3, p4 = P[:-2, 1:-1], P[:-2, 2:], P[1:-1, 2:]
            p5, p6, p7 = P[2:, 2:], P[2:, 1:-1], P[2:, :-2]
            p8, p9 = P[1:-1, :-2], P[:-2, :-2]
            B = p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9
            seq = [p2, p3, p4, p5, p6, p7, p8, p9, p2]
            A = sum(((seq[k] == 0) & (seq[k + 1] == 1)).astype(np.uint8) for k in range(8))
            if step == 0:
                c = ((p2 * p4 * p6) == 0) & ((p4 * p6 * p8) == 0)
            else:
                c = ((p2 * p4 * p8) == 0) & ((p2 * p6 * p8) == 0)
            m = (img == 1) & (B >= 2) & (B <= 6) & (A == 1) & c
            if m.any():
                img[m] = 0; changed = True
        if not changed:
            return img.astype(bool)


def dilate(m, r):
    out = m.copy()
    for dy in range(-r, r + 1):
        for dx in range(-r, r + 1):
            out |= np.roll(np.roll(m, dy, 0), dx, 1)
    return out


def pick_holes(sk, sp):
    """Percorre o esqueleto a partir das pontas e escolhe pixels a cada `sp`."""
    S = set(zip(*np.nonzero(sk)))
    nb = lambda p: [(p[0]+a, p[1]+b) for a in (-1, 0, 1) for b in (-1, 0, 1) if (a or b) and (p[0]+a, p[1]+b) in S]
    seen, order = set(), []
    ends = sorted([p for p in S if len(nb(p)) == 1])
    for start in ends + sorted(S):
        if start in seen:
            continue
        stack = [start]
        while stack:
            p = stack.pop()
            if p in seen:
                continue
            seen.add(p); order.append(p)
            stack.extend(q for q in nb(p) if q not in seen)
    cell, grid, out = sp, {}, []
    for y, x in order:
        gx, gy = int(x // cell), int(y // cell)
        ok = True
        for a in (-1, 0, 1):
            for b in (-1, 0, 1):
                for (qx, qy) in grid.get((gx + a, gy + b), []):
                    if (qx - x)**2 + (qy - y)**2 < (sp * 0.92)**2:
                        ok = False; break
                if not ok: break
            if not ok: break
        if ok:
            grid.setdefault((gx, gy), []).append((x, y)); out.append((x, y))
    return out


def link_holes(pts, maxd, near):
    H, W = near.shape
    links = set()
    for i, (x, y) in enumerate(pts):
        cand = []
        for j, (u, v) in enumerate(pts):
            if j == i:
                continue
            dd = math.hypot(u - x, v - y)
            if dd <= maxd:
                ok = all(near[min(H-1, int(y + (v - y)*t)), min(W-1, int(x + (u - x)*t))] for t in (0.2, 0.35, 0.5, 0.65, 0.8))
                if ok:
                    cand.append((dd, j))
        for _, j in sorted(cand)[:3]:
            links.add((min(i, j), max(i, j)))
    return sorted(links)


# ---------------------------------------------------------------- SVG
def svg_template(d, pal, card_bg, frame_color):
    out = [f'<rect x="0" y="0" width="105" height="148" rx="2" fill="{card_bg}"/>']
    for cx, cy, r in getattr(d, "cuts", []):
        out.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#fff" stroke="#8a8a8a" stroke-width=".35" stroke-dasharray="1.6 1.2"/>')
        out.append(f'<text x="{cx}" y="{cy + r + 5}" font-size="2.7" text-anchor="middle" fill="#8a8a8a" font-family="Nunito">✂ recorte na linha tracejada</text>')
    for (x1, y1), (x2, y2) in getattr(d, "guides", []):
        out.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#9a9a9a" stroke-width=".4" stroke-dasharray="1.8 1.2"/>')
    for i, j, c in d.stitches:
        a, b = d.holes[i], d.holes[j]
        out.append(f'<line x1="{a[0]:.2f}" y1="{a[1]:.2f}" x2="{b[0]:.2f}" y2="{b[1]:.2f}" stroke="{pal[c]}" stroke-width=".32" stroke-opacity=".55" stroke-linecap="round"/>')
    for x, y, c, r in d.knots:
        out.append(f'<circle cx="{x:.2f}" cy="{y:.2f}" r="{r:.2f}" fill="none" stroke="{pal[c]}" stroke-width=".35" stroke-dasharray=".6 .45"/>')
        out.append(f'<circle cx="{x:.2f}" cy="{y:.2f}" r=".55" fill="#2b2622"/>')
    for x, y, c in d.holes:
        out.append(f'<circle cx="{x:.2f}" cy="{y:.2f}" r=".5" fill="#2b2622"/>')
    if not getattr(d, "cuts", []):
        out.append(f'<rect x="1.2" y="1.2" width="102.6" height="145.6" rx="2" fill="none" stroke="{frame_color}" stroke-width=".3" stroke-dasharray="1.6 1.2"/>')
    return "\n".join(out)


def svg_result(d, pal, card_bg, twine=None, wobble=0.0):
    rng = np.random.default_rng(3)
    out = [f'<rect x="0" y="0" width="105" height="148" rx="2.5" fill="{card_bg}"/>']
    for cx, cy, r in getattr(d, "cuts", []):
        out[0] = '<rect x="0" y="0" width="105" height="148" rx="2.5" fill="#e6d8bc"/>'
        out.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{card_bg}" stroke="#cdbb95" stroke-width=".4"/>')
    for i, j, c in d.stitches:
        a, b = d.holes[i], d.holes[j]
        L = math.dist(a[:2], b[:2])
        if L == 0:
            continue
        g = min(0.22, L * 0.12)
        ux, uy = (b[0] - a[0]) / L, (b[1] - a[1]) / L
        x1, y1, x2, y2 = a[0] + ux*g, a[1] + uy*g, b[0] - ux*g, b[1] - uy*g
        if wobble:
            x1 += rng.normal(0, wobble); y1 += rng.normal(0, wobble)
        col = pal[c]
        out.append(f'<line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" stroke="rgba(0,0,0,.18)" stroke-width=".95" stroke-linecap="round" transform="translate(.18 .22)"/>')
        out.append(f'<line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" stroke="{col}" stroke-width=".85" stroke-linecap="round"/>')
        if twine and c in twine:
            out.append(f'<line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" stroke="#fffaf2" stroke-width=".5" stroke-dasharray=".32 .34" stroke-linecap="butt"/>')
        else:
            out.append(f'<line x1="{x1 - uy*.17:.2f}" y1="{y1 + ux*.17 - .12:.2f}" x2="{x2 - uy*.17:.2f}" y2="{y2 + ux*.17 - .12:.2f}" stroke="#fff" stroke-opacity=".38" stroke-width=".22" stroke-linecap="round"/>')
    for x, y, c, r in d.knots:
        out.append(f'<circle cx="{x+.2:.2f}" cy="{y+.25:.2f}" r="{r:.2f}" fill="rgba(0,0,0,.2)"/>')
        out.append(f'<circle cx="{x:.2f}" cy="{y:.2f}" r="{r:.2f}" fill="{pal[c]}"/>')
        out.append(f'<circle cx="{x - r*.35:.2f}" cy="{y - r*.35:.2f}" r="{r*.32:.2f}" fill="#fff" fill-opacity=".55"/>')
    return "\n".join(out)
