"""Ateliê 2027 · Pacote Fundador: 60 moldes (todos diferentes do Brinde Bordado) + certificado.
Uso: python3 moldes/a2027.py html  -> build/*.html   |  node moldes/render.js saida2027  |  python3 moldes/a2027.py juntar"""
import json, os, sys, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fazer_lote import desenhar
from estilos import page

ROOT = os.path.dirname(os.path.abspath(__file__))
R, D, S, C = "Réveillon", "Dia de Reis", "Simpatias de Ano Novo", "Carnaval"
ITENS = [
    # Réveillon (25)
    (R, "card", "globo", "Que venha|2027"), (R, "card", "balões", "Bem-vindo|2027"), (R, "card", "ampulheta", "Novo ciclo"),
    (R, "card", "ondas", "Sete ondas"), (R, "card", "chapéu de festa", "Alegria"), (R, "card", "globo", "Gratidão|2026"),
    (R, "card", "balões", "Vamos celebrar"), (R, "card", "ampulheta", "Tempo bom"), (R, "card", "ondas", "Mar de paz"),
    (R, "card", "chapéu de festa", "Bora, 2027!"),
    (R, "card", "globo", ""), (R, "card", "balões", ""), (R, "card", "ampulheta", ""), (R, "card", "ondas", ""), (R, "card", "chapéu de festa", ""),
    (R, "round", "globo", "2027"), (R, "round", "balões", "Celebrar"), (R, "round", "ampulheta", "Recomeço"), (R, "round", "ondas", "Renovar"), (R, "round", "chapéu de festa", "Festa"),
    (R, "round-s", "globo", ""), (R, "round-s", "balões", ""), (R, "round-s", "ampulheta", ""), (R, "round-s", "ondas", ""), (R, "round-s", "chapéu de festa", ""),
    # Dia de Reis (10)
    (D, "card", "coroa", "Dia de Reis"), (D, "card", "reis magos", "Santos Reis"), (D, "card", "baú", "Ouro, incenso|e mirra"),
    (D, "card", "estrela", "Siga a estrela"), (D, "card", "coroa", ""), (D, "card", "baú", ""),
    (D, "round", "coroa", "6 de janeiro"), (D, "round", "reis magos", "Bênção"), (D, "round-s", "coroa", ""), (D, "round-s", "baú", ""),
    # Simpatias (15)
    (S, "card", "louro", "Sorte"), (S, "card", "carteira", "Fartura"), (S, "card", "vela", "Fé"), (S, "card", "louro", "Conquistas"),
    (S, "card", "vela", "Sonhos"), (S, "card", "carteira", "Prosperidade"), (S, "card", "coração", "Amor em 2027"),
    (S, "card", "louro", ""), (S, "card", "carteira", ""), (S, "card", "vela", ""),
    (S, "round", "louro", "Sorte"), (S, "round", "carteira", "Fartura"), (S, "round", "vela", "Luz"), (S, "round-s", "louro", ""), (S, "round-s", "carteira", ""),
    # Carnaval (10)
    (C, "card", "máscara", "Carnaval|2027"), (C, "card", "pandeiro", "Folia"), (C, "card", "leque", "Pura alegria"), (C, "card", "chapéu de festa", "Bloco na rua"),
    (C, "card", "máscara", ""), (C, "card", "pandeiro", ""), (C, "card", "leque", ""),
    (C, "round", "máscara", "Folia"), (C, "round", "pandeiro", "Samba"), (C, "round-s", "leque", ""),
]
TIPO = {"card": "Cartão", "round": "Enfeite redondo", "round-s": "Mini enfeite"}


def catalogo():
    cat = []
    for i, (cg, f, forma, txt) in enumerate(ITENS, 1):
        nome = f'{TIPO[f]} {forma}' + (f' · {txt.replace("|", " ")}' if txt else "")
        cat.append(dict(categoria=cg, tipo=TIPO[f], forma=forma, formato=f, texto=txt, swap=i % 2 == 0, simple=False, extra={}, nome=nome, numero=i))
    return cat


def html():
    cat = catalogo(); json.dump(cat, open(os.path.join(ROOT, "catalogo2027.json"), "w"), ensure_ascii=False, indent=1)
    build = os.path.join(ROOT, "build"); os.makedirs(build, exist_ok=True)
    for x in os.listdir(build): os.remove(os.path.join(build, x))
    for c in cat:
        d, tam, nivel = desenhar(c)
        open(os.path.join(build, f"F{c['numero']:02d}.html"), "w").write(page("fundador", d=d, title=c["nome"], tagline=f"Molde F{c['numero']:02d} · {c['categoria']}", nivel=nivel, tamanho=tam))
    print(len(cat), "moldes", {k: sum(1 for c in cat if c["categoria"] == k) for k in (R, D, S, C)})


if __name__ == "__main__":
    {"html": html, "juntar": lambda: None}[sys.argv[1]]()


CERT = """<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>
@font-face{font-family:P;font-weight:800;src:url(../../assets/fonts/playfair-display-latin-800-normal.woff2)}
@font-face{font-family:N;font-weight:400;src:url(../../assets/fonts/nunito-sans-latin-400-normal.woff2)}
@font-face{font-family:N;font-weight:700;src:url(../../assets/fonts/nunito-sans-latin-700-normal.woff2)}
@font-face{font-family:D;src:url(../fonts/dancing-script-latin-700-normal.woff)}
@page{size:A4 landscape;margin:0}*{box-sizing:border-box}body{margin:0}
.pg{position:relative;width:297mm;height:210mm;background:#FFF8EC url(../../assets/img/paper.webp);font-family:N;color:#1F4D3A;text-align:center;overflow:hidden}
.f1{position:absolute;inset:7mm;border:1.6mm solid #C9962E}.f2{position:absolute;inset:11mm;border:.4mm solid #C9962E}
.k{margin:0;padding-top:28mm;font:700 3.6mm N;letter-spacing:1.6mm;text-transform:uppercase;color:#9A6B12}
h1{margin:4mm 0 0;font:800 17mm/1 P}.st{font-size:9mm;color:#C9962E;letter-spacing:4mm;margin:3mm 0}
p{margin:0;font-size:4.6mm;color:#4b4538}.nm{width:170mm;margin:12mm auto 3mm;border-bottom:.4mm solid #1F4D3A;height:14mm;font:12mm D;color:#B3282D}
.t{max-width:200mm;margin:6mm auto 0;line-height:1.5}
.selo{position:absolute;right:26mm;bottom:22mm;width:38mm;height:38mm;border-radius:50%;background:#C9962E;color:#fff;display:grid;place-items:center;font:800 4mm/1.2 P;box-shadow:inset 0 0 0 1.4mm #FFF8EC,inset 0 0 0 1.8mm #C9962E}
.sig{position:absolute;left:30mm;bottom:28mm;width:70mm;border-top:.3mm solid #1F4D3A;padding-top:2mm;font-size:3.4mm}
</style></head><body><div class="pg"><div class="f1"></div><div class="f2"></div>
<p class="k">Ateliê 2027 · Pacote Fundador</p><h1>Membro Fundador</h1><div class="st">★ ★ ★</div>
<p>Certificamos que</p><div class="nm"></div>
<p class="t">faz parte do grupo de bordadeiras fundadoras do <b>Ateliê 2027</b>: começou o novo ano com agulha, linha e 60 moldes exclusivos de Réveillon, Dia de Reis, Simpatias e Carnaval.</p>
<div class="sig">Ateliê de Natal · Ateliê 2027</div><div class="selo">Fundadora<br>2027</div>
</div></body></html>"""


def juntar():
    from pypdf import PdfReader, PdfWriter
    import juntar as J
    cat = json.load(open(os.path.join(ROOT, "catalogo2027.json")))
    out = os.path.join(ROOT, "entrega2027"); os.makedirs(out, exist_ok=True)
    env = {**os.environ, "NODE_PATH": subprocess.check_output(["npm", "root", "-g"]).decode().strip()}
    pdf = lambda h, p: subprocess.run(["node", os.path.join(ROOT, "pdf_html.js"), h, p], check=True, env=env)
    for k, nome in enumerate((R, D, S, C), 1):
        itens = [m for m in cat if m["categoria"] == nome]
        grupos = []
        for m in itens:
            if not grupos or grupos[-1][0] != m["tipo"]: grupos.append((m["tipo"], []))
            grupos[-1][1].append(m)
        hp, pp = os.path.join(ROOT, "build", f"ind27-{k}.html"), os.path.join(ROOT, "build", f"ind27-{k}.pdf")
        h = J.indice_html(nome, len(itens), grupos, 2).replace("Ateliê de Natal · Moldes de bordado em papel", "Ateliê 2027 · Pacote Fundador")
        h = h.replace('{m["numero"]:03d}', "")
        open(hp, "w").write(h); pdf(hp, pp)
        w = PdfWriter()
        for pg in PdfReader(pp).pages: w.add_page(pg)
        for m in itens:
            ini = len(w.pages)
            for pg in PdfReader(os.path.join(ROOT, "saida2027", f'F{m["numero"]:02d}.pdf')).pages: w.add_page(pg)
            w.add_outline_item(f'F{m["numero"]:02d} · {m["nome"]}', ini)
        w.add_metadata({"/Title": f"Ateliê 2027 · {nome}"})
        w.compress_identical_objects(remove_duplicates=True, remove_unreferenced=True)
        dst = os.path.join(out, f"{k} - {nome} ({len(itens)} moldes).pdf"); w.write(open(dst, "wb")); print(os.path.basename(dst), len(w.pages))
    hp = os.path.join(ROOT, "build", "certificado.html"); open(hp, "w").write(CERT)
    pdf(hp, os.path.join(out, "5 - Certificado Membro Fundador.pdf")); print("certificado ok")


if __name__ == "__main__" and sys.argv[1] == "juntar":
    juntar()
