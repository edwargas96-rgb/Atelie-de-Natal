"""Gera um lote de moldes no estilo Clássico a partir das artes do ChatGPT.

1. Coloque os PNGs em moldes/entrada/ (nome do arquivo = código, ex.: 001.png)
2. Descreva cada um em moldes/lote.csv:  codigo;nome;categoria;nivel;moldura
   moldura = sim/nao (moldura pontilhada dourada em volta do cartão)
3. python3 moldes/lote.py  -> moldes/build/*.html ; depois  node moldes/render.js
"""
import csv, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gerador import Design, BUILD
from estilos import page, frame, STYLES

ROOT = os.path.dirname(os.path.abspath(__file__))
PAL = STYLES["classico"]["pal"]


def main(csv_path=os.path.join(ROOT, "lote.csv")):
    os.makedirs(BUILD, exist_ok=True)
    for f in os.listdir(BUILD):
        os.remove(os.path.join(BUILD, f))
    ok, falhas = 0, []
    with open(csv_path, encoding="utf-8") as fh:
        for row in csv.DictReader(fh, delimiter=";"):
            cod = row["codigo"].strip()
            img = next((os.path.join(ROOT, "entrada", cod + ext) for ext in (".png", ".jpg", ".jpeg", ".webp")
                        if os.path.exists(os.path.join(ROOT, "entrada", cod + ext))), None)
            if not img:
                falhas.append(f"{cod}: imagem não encontrada"); continue
            d = Design()
            moldura = row.get("moldura", "sim").strip().lower() != "nao"
            if moldura:
                frame(d, "gold")
            texto = (row.get("texto") or "").strip()
            box = (16, 16, 73, 116) if moldura else (10, 10, 85, 128)
            if texto:   # desenho em cima, texto bordado embaixo (fonte cursiva, sempre legível)
                box = (box[0], box[1], box[2], box[3] * 0.64)
            try:
                d.from_image(img, box, PAL)
                if texto:
                    linhas = texto.split("|")
                    tam = 15 if len(linhas) == 1 and len(texto) <= 12 else 11.5
                    d.lettering(linhas, "dancing-script-latin-700-normal.woff", tam,
                                (52.5, box[1] + box[3] + 7 + 6 * len(linhas)), "red", sp=2.0, line_h=tam * 0.95)
            except Exception as ex:
                falhas.append(f"{cod}: {ex}"); continue
            n = len(d.holes) + len(d.knots)
            if n > 900:
                falhas.append(f"{cod}: {n} furos (desenho detalhado demais, peça uma versão mais simples)")
            html = page("classico", d=d, title=row["nome"].strip(),
                        tagline=f"Molde {cod} · {row['categoria'].strip()}", nivel=row.get("nivel", "Fácil").strip() or "Fácil")
            open(os.path.join(BUILD, f"{cod}.html"), "w").write(html)
            ok += 1
    print(f"{ok} moldes gerados")
    for f in falhas:
        print("ATENÇÃO", f)


if __name__ == "__main__":
    main(*sys.argv[1:])
