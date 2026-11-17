"""Junta os 250 PDFs em 4 arquivos (um por categoria), com página de índice e marcadores.
Uso: python3 moldes/juntar.py   ->  moldes/entrega/1 - Cartões e presentes (70 moldes).pdf ..."""
import json, os, subprocess, sys
from pypdf import PdfReader, PdfWriter

ROOT = os.path.dirname(os.path.abspath(__file__))
SAIDA = os.path.join(ROOT, "saida")
OUT = os.path.join(ROOT, "entrega")
TMP = os.path.join(ROOT, "build")
CATS = [("Cartões e presentes", 70), ("Árvore e casa", 70), ("Mesa da ceia", 50), ("Em família e crianças", 60)]
FONTS = "../../assets/fonts"


def indice_html(titulo, n, grupos, inicio):
    linhas = ""
    pag = inicio
    for tipo, itens in grupos:
        linhas += f'<section class="g"><h3>{tipo} <small>{len(itens)} moldes</small></h3><ul>'
        for m in itens:
            linhas += f'<li><span class="n">{m["numero"]:03d}</span><span class="t">{m["nome"]}</span><i></i><span class="p">pág. {pag}</span></li>'
            pag += 1
        linhas += "</ul></section>"
    return f"""<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>
@font-face{{font-family:P;font-weight:800;src:url({FONTS}/playfair-display-latin-800-normal.woff2)}}
@font-face{{font-family:N;font-weight:400;src:url({FONTS}/nunito-sans-latin-400-normal.woff2)}}
@font-face{{font-family:N;font-weight:700;src:url({FONTS}/nunito-sans-latin-700-normal.woff2)}}
@page{{size:A4;margin:0}}*{{box-sizing:border-box}}body{{margin:0;background:#FFF8EC;font-family:N;color:#1F4D3A}}
.pg{{width:210mm;padding:22mm 20mm 16mm;margin:0}}@page{{size:A4;margin:0}}
.k{{font:700 3mm N;letter-spacing:.9mm;text-transform:uppercase;color:#B3282D;text-align:center;margin:0 0 3mm}}
h1{{font:800 12mm/1.05 P;text-align:center;margin:0 0 2mm}}.s{{text-align:center;font-size:4.2mm;color:#6b6355;margin:0 0 7mm}}
section.g{{break-inside:avoid}}h3{{font:800 4.4mm N;color:#B3282D;margin:5mm 0 1.5mm;border-bottom:.3mm solid #C9962E;padding-bottom:1mm}}h3 small{{font:400 3mm N;color:#6b6355;margin-left:2mm}}
ul{{list-style:none;margin:0;padding:0;columns:2;column-gap:8mm}}li{{display:flex;gap:2mm;align-items:baseline;font-size:3mm;line-height:1.55;break-inside:avoid}}
.n{{font-weight:700;color:#B3282D;width:7mm}}.t{{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:50mm}}li i{{flex:1;border-bottom:.2mm dotted #bba}}.p{{color:#6b6355;font-size:2.7mm}}
.fr{{position:fixed;inset:4mm;border:1.4mm double #C9962E}}</style></head><body><div class="fr"></div><div class="pg"><p class="k">Ateliê de Natal · Moldes de bordado em papel</p><h1>{titulo}</h1><p class="s">{n} moldes · imprima em A4, tamanho real (100%)</p>{linhas}</div></body></html>"""


def main():
    cat = json.load(open(os.path.join(ROOT, "catalogo.json")))
    os.makedirs(OUT, exist_ok=True); os.makedirs(TMP, exist_ok=True)
    faltam = [m["numero"] for m in cat if not os.path.exists(os.path.join(SAIDA, f'{m["numero"]:03d}.pdf'))]
    if faltam:
        sys.exit(f"faltam PDFs: {faltam[:10]}")
    for k, (nome, qtd) in enumerate(CATS, 1):
        itens = [m for m in cat if m["categoria"] == nome]
        assert len(itens) == qtd, (nome, len(itens))
        grupos = []
        for m in itens:
            if not grupos or grupos[-1][0] != m["tipo"]:
                grupos.append((m["tipo"], []))
            grupos[-1][1].append(m)
        # índice (1 ou 2 páginas): primeiro mede quantas páginas ele ocupa
        htmlp = os.path.join(TMP, f"indice-{k}.html"); pdfp = os.path.join(TMP, f"indice-{k}.pdf")
        n_ind = 1
        for _ in range(2):
            open(htmlp, "w").write(indice_html(nome, qtd, grupos, n_ind + 1))
            subprocess.run(["node", os.path.join(ROOT, "pdf_html.js"), htmlp, pdfp], check=True, env={**os.environ, "NODE_PATH": subprocess.check_output(["npm", "root", "-g"]).decode().strip()})
            n_ind = len(PdfReader(pdfp).pages)
        w = PdfWriter()
        for pg in PdfReader(pdfp).pages:
            w.add_page(pg)
        w.add_outline_item("Índice", 0)
        pai = {}
        for m in itens:
            r = PdfReader(os.path.join(SAIDA, f'{m["numero"]:03d}.pdf'))
            ini = len(w.pages)
            for pg in r.pages:
                w.add_page(pg)
            if m["tipo"] not in pai:
                pai[m["tipo"]] = w.add_outline_item(m["tipo"], ini)
            w.add_outline_item(f'{m["numero"]:03d} · {m["nome"]}', ini, parent=pai[m["tipo"]])
        w.add_metadata({"/Title": f"Ateliê de Natal · {nome} ({qtd} moldes)", "/Author": "Ateliê de Natal"})
        w.compress_identical_objects(remove_duplicates=True, remove_unreferenced=True)
        destino = os.path.join(OUT, f"{k} - {nome} ({qtd} moldes).pdf")
        with open(destino, "wb") as f:
            w.write(f)
        print(os.path.basename(destino), len(w.pages), "páginas", os.path.getsize(destino) // 1024 // 1024, "MB")


if __name__ == "__main__":
    main()
