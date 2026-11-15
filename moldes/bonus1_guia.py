"""Bônus 1 · Primeiros Pontos: guia completo (8 páginas A4). Imagens de apoio (ChatGPT) opcionais em moldes/bonus/img/."""
import os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bonus1
from bonus1 import panel, icons, RED, GREEN, GOLD, INK
from estilos import STYLES, holly_cluster
from gerador import BUILD

ROOT = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.join(ROOT, "bonus", "img")
DECO = ('<rect x="5" y="5" width="200" height="287" fill="none" stroke="#C9962E" stroke-width=".6"/>'
        '<rect x="6.6" y="6.6" width="196.8" height="283.8" fill="none" stroke="#C9962E" stroke-width=".25"/>'
        + holly_cluster(16, 17, 1.0) + holly_cluster(194, 17, 1.0, -1))
EXTRA = """
.flow{position:absolute;left:18mm;right:18mm;top:30mm}
.flow>*{margin-bottom:6mm}
.card2{background:#fffdf8;border:.3mm solid rgba(0,0,0,.08);border-radius:3mm;padding:4mm}
.two{display:grid;grid-template-columns:1fr 1fr;gap:5mm}
.steps p{margin-bottom:2.4mm}
.slot{height:78mm;border:.5mm dashed #b9a77d;border-radius:3mm;display:grid;place-items:center;text-align:center;color:#8a7a55;font:700 3.4mm Nunito;background:rgba(255,255,255,.5)}
.pic{width:100%;border-radius:3mm;display:block}
table{width:100%;border-collapse:collapse;font-size:3.3mm}
td,th{padding:2.6mm 2mm;border-bottom:.3mm solid rgba(0,0,0,.1);text-align:left;vertical-align:middle}
th{font:800 2.9mm Nunito;letter-spacing:.4mm;text-transform:uppercase;color:#B3282D}
.lvl{font-weight:800;color:#1F4D3A}
"""


def css():
    html = bonus1.build()
    return re.search(r"<style>(.*?)</style>", html, re.S).group(1) + EXTRA


def svg(w, h, inner): return f'<svg viewBox="0 0 {w} {h}" width="100%">{inner}</svg>'
def ln(x1, y1, x2, y2, c=RED, w=1.6, extra=""): return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{c}" stroke-width="{w}" stroke-linecap="round" {extra}/>'
def dot(x, y, r=1.5, c="#2b2622"): return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{c}"/>'
def txt(x, y, s, size=4, c="#6b6355", w=400, anchor="middle"): return f'<text x="{x}" y="{y}" font-size="{size}" text-anchor="{anchor}" fill="{c}" font-family="Nunito" font-weight="{w}">{s}</text>'
def pan(inner, label, w=70, h=34): return f'<div class="panel">{svg(w, h, inner)}<p>{label}</p></div>'


def page(n, body, kick="", title="", intro=""):
    head = f'<div class="brand" style="top:18mm">Ateliê de Natal · Primeiros Pontos</div>'
    top = f'<p class="kick">{kick}</p><h2>{title}</h2><p>{intro}</p>' if title else ""
    return (f'<div class="pg"><svg class="deco" viewBox="0 0 210 297">{DECO}</svg>{head}<div class="flow">{top}{body}</div>'
            f'<div class="foot">© Ateliê de Natal · Uso pessoal · Não compartilhe nem revenda os arquivos · Página {n}</div></div>')


def tip(t, green=False): return f'<div class="tip" style="{"background:#EAF2EC;border-color:#2E6B4A" if green else ""}">{t}</div>'


def image_or_slot(name, label):
    for ext in ("png", "jpg", "jpeg", "webp"):
        p = os.path.join(IMG, f"{name}.{ext}")
        if os.path.exists(p):
            return f'<img class="pic" src="../bonus/img/{name}.{ext}" alt="{label}">'
    return f'<div class="slot">[ imagem de apoio · {label} ]<br>(gerar no ChatGPT)</div>'


def pages():
    out = []
    # 1 · começar e terminar a linha
    start = (ln(8, 22, 40, 22, "#bdb39a", 4) + ln(8, 22, 40, 22, "#e7ddc4", 3.2) + txt(24, 15, "fita adesiva", 3.6, "#8a7a55")
             + ln(40, 22, 62, 22, RED, 1.6) + dot(62, 22, 1.6))
    end = (ln(6, 14, 20, 14, RED, 1.4) + ln(22, 14, 36, 14, RED, 1.4) + ln(38, 14, 52, 14, RED, 1.4)
           + f'<path d="M52 14 C58 14 58 24 50 24 L16 24" stroke="{RED}" stroke-width="1.4" fill="none" stroke-linecap="round"/>'
           + txt(33, 9, "atrás do papel", 3.6, GREEN, 800))
    out.append(page(1, f'<div class="two">{pan(start, "<b>Começar:</b> deixe um rabinho atrás e cole com um pedacinho de fita. Não precisa de nó.", 70, 38)}{pan(end, "<b>Terminar:</b> passe a agulha por baixo dos últimos pontos, atrás do papel, e corte a sobra.", 70, 38)}</div>'
                    + tip("<b>Antes de tudo:</b> os furos já vêm marcados no molde. Fure sobre um EVA ou isopor, um furo por vez, e só depois comece a bordar.")
                    + tip("<b>Linha:</b> use um ou dois fios da meada. Linha muito grossa deixa o furo apertado e pode rasgar o papel.", True)
                    + tip("<b>Mãos livres:</b> se a linha embolar, solte a agulha e deixe a linha girar pendurada. Ela se desfaz sozinha."),
                    "Antes do primeiro ponto", "Como começar e terminar a linha",
                    "Antes de aprender os pontos, veja como prender e finalizar a linha atrás do papel. É simples e vale para todos os pontos do guia."))
    # 2 · ponto atrás (página já aprovada)
    p1 = re.search(r'<div class="pg">.*</div></div>', bonus1.build(), re.S).group(0).replace("Página 1", "Página 2")
    out.append(p1)
    # 3 · ponto corrido
    res = "".join(ln(10 + i * 24, 22, 22 + i * 24, 22) for i in range(4)) + "".join(dot(10 + i * 12, 22) for i in range(9))
    out.append(page(3, f'<div class="card2">{svg(110, 40, res + txt(55, 10, "Como fica por cima do papel", 4.4, GREEN, 800) + txt(55, 36, "a linha pula um furo sim, um furo não", 3.8))}</div>'
                    + '<p class="kick">Passo a passo</p><div class="panels">'
                    + panel(5, [], 0, None, "Saia pelo furo 1, vindo de trás.") + panel(5, [(0, 1)], None, 1, "Desça no furo 2. Primeiro pedaço de linha pronto.")
                    + panel(5, [(0, 1)], 2, None, "Pule o furo 2 e saia no 3. Repita: desce no 4, sobe no 5.") + '</div>'
                    + tip("<b>Ótimo para começar:</b> é o ponto mais fácil e rápido. Use nas molduras e nas linhas tracejadas dos moldes."),
                    "Ponto 2 de 6", "Ponto corrido", "A linha vai e volta pelo papel, deixando espaços iguais entre os pedaços. Parece uma linha tracejada bordada."))
    # 4 · ponto cheio
    out.append(page(4, image_or_slot("ponto-cheio", "ponto cheio, em 3 etapas")
                    + '<p class="kick">Passo a passo</p><div class="steps"><p><span class="num">1</span>Saia pelo furo da borda da forma.</p>'
                      '<p><span class="num">2</span>Desça no lado oposto, atravessando a forma de ponta a ponta.</p>'
                      '<p><span class="num">3</span>Saia ao lado do primeiro ponto, sem deixar espaço, e repita até cobrir a forma.</p></div>'
                    + tip("<b>Cuidado com o papel:</b> deixe as linhas lado a lado, sem sobrepor. Muita linha no mesmo lugar enfraquece o papel. Use em formas pequenas, como folhas."),
                    "Ponto 3 de 6", "Ponto cheio", "Preenche formas pequenas com linhas bem juntinhas, como uma cobertura de cor."))
    # 5 · ponto corrente
    a = ln(0, 0, 0, 0, "none") + dot(14, 20) + f'<ellipse cx="25" cy="20" rx="10" ry="5.5" fill="none" stroke="{RED}" stroke-width="1.5"/>' + txt(35, 33, "laço frouxo", 3.6)
    b = dot(14, 20) + f'<ellipse cx="25" cy="20" rx="10" ry="5.5" fill="none" stroke="{RED}" stroke-width="1.5"/>' + dot(38, 20) + f'<circle cx="38" cy="20" r="3.4" fill="none" stroke="{GREEN}" stroke-width=".9"/>' + txt(38, 11, "SOBE", 3.6, GREEN, 800)
    c = "".join(f'<ellipse cx="{16 + i * 10}" cy="20" rx="7" ry="5" fill="none" stroke="{RED}" stroke-width="1.5"/>' for i in range(4)) + txt(36, 33, "corrente pronta", 3.6)
    out.append(page(5, '<p class="kick">Passo a passo</p><div class="panels">'
                    + pan(a, "Saia pelo furo e desça no mesmo furo, deixando um laço frouxo.") + pan(b, "Saia mais à frente, dentro do laço, e puxe devagar.") + pan(c, "Repita: cada laço prende o anterior e forma a corrente.") + '</div>'
                    + tip("<b>Pare o último laço:</b> desça com um pontinho pequeno do lado de fora para prender o fim da corrente.")
                    + tip("<b>Quando usar:</b> linhas decorativas e letras grossas. Fica com relevo e dá um acabamento bonito.", True),
                    "Ponto 4 de 6", "Ponto corrente", "Faz uma linha em relevo, formada por laços encadeados, como os elos de uma correntinha."))
    # 6 · ponto em X
    def xs(cross_a=False, cross_b=False, row=False):
        s = "".join(dot(x, y) for x, y in [(22, 8), (42, 8), (22, 28), (42, 28)])
        if cross_a: s += ln(22, 28, 42, 8)
        if cross_b: s += ln(22, 8, 42, 28)
        return s
    row = "".join(ln(8 + i * 20, 24, 18 + i * 20, 10) + ln(8 + i * 20, 10, 18 + i * 20, 24) for i in range(3)) + "".join(dot(x, y) for i in range(3) for x, y in [(8 + i * 20, 10), (18 + i * 20, 10), (8 + i * 20, 24), (18 + i * 20, 24)])
    out.append(page(6, '<p class="kick">Passo a passo</p><div class="panels">'
                    + pan(xs(True), "De baixo à esquerda para cima à direita.") + pan(xs(True, True), "Cruze: de cima à esquerda para baixo à direita.") + pan(row, "Repita lado a lado, sempre com a mesma diagonal por cima.") + '</div>'
                    + tip("<b>Quando usar:</b> bordas, detalhes pequenos e enfeites. Com o X sempre na mesma direção, o acabamento fica uniforme."),
                    "Ponto 5 de 6", "Ponto em X", "Dois pontinhos que se cruzam e formam um X, como na ponto cruz. Ótimo para decorar bordas e cantos."))
    # 7 · nó francês
    out.append(page(7, image_or_slot("no-frances", "nó francês, em 3 etapas")
                    + '<p class="kick">Passo a passo</p><div class="steps"><p><span class="num">1</span>Saia pelo furo e segure a linha esticada com a mão livre.</p>'
                      '<p><span class="num">2</span>Enrole a linha duas vezes em volta da agulha.</p>'
                      '<p><span class="num">3</span>Mantenha a linha esticada e desça pelo mesmo furo, ou ao lado se estiver apertado. Depois puxe com calma.</p></div>'
                    + tip("<b>Nos seus moldes:</b> o nó francês aparece como um furo dentro de um círculo pontilhado. É a bolinha: frutinha, olho, miolo de flor.")
                    + tip("<b>Mais voltas, bolinha maior:</b> duas voltas já dão uma bolinha firme. Mais que isso pode ficar difícil de passar pelo furo.", True),
                    "Ponto 6 de 6", "Nó francês", "Faz uma bolinha em relevo, perfeita para frutinhas, olhos e pontinhos de enfeite."))
    # 8 · resumo
    rows = [("Ponto atrás", "Contornos e letras", "Fácil"), ("Ponto corrido", "Molduras e linhas tracejadas", "Muito fácil"), ("Ponto cheio", "Formas pequenas, como folhas", "Médio"),
            ("Ponto corrente", "Linhas e letras em relevo", "Médio"), ("Ponto em X", "Bordas e detalhes", "Fácil"), ("Nó francês", "Bolinhas e frutinhas", "Médio")]
    tb = "".join(f'<tr><td><b>{i + 1}. {n}</b></td><td>{u}</td><td class="lvl">{l}</td></tr>' for i, (n, u, l) in enumerate(rows))
    out.append(page(8, f'<div class="card2"><table><tr><th>Ponto</th><th>Quando usar</th><th>Nível</th></tr>{tb}</table></div>'
                    + tip("<b>Por onde começar:</b> faça primeiro os moldes <b>fáceis</b>: use ponto atrás nos contornos e nó francês nas bolinhas. Só esses dois já bordam a maior parte do kit.")
                    + tip("<b>Pronta para o primeiro molde?</b> Escolha um dos moldes fáceis do kit, imprima e comece. Errar faz parte de aprender.", True),
                    "Resumo", "Qual ponto usar", "Guarde esta página: ela mostra qual ponto escolher em cada parte do molde."))
    return out


def build():
    return f'<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Primeiros Pontos</title><style>{css()}</style></head><body>{"".join(pages())}</body></html>'


if __name__ == "__main__":
    os.makedirs(BUILD, exist_ok=True); os.makedirs(IMG, exist_ok=True)
    open(os.path.join(BUILD, "guia.html"), "w").write(build()); print("ok")
