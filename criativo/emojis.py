"""Copia para criativo/emoji/ as imagens dos emojis usados no roteiro (estilo Google/Noto).
Uso: python3 criativo/emojis.py <pasta img/google/64 do pacote emoji-datasource-google>"""
import os, re, shutil, sys, unicodedata
ROOT = os.path.dirname(os.path.abspath(__file__))
src = sys.argv[1]
texto = open(os.path.join(ROOT, "roteiro.js"), encoding="utf-8").read() + "🙂🎄"
avail = {f[:-4] for f in os.listdir(src) if f.endswith(".png")}
# separa grafemas de emoji (sequências com ZWJ e seletor de variação)
pat = re.compile(r"(?:[\U0001F000-\U0001FAFF☀-➿⬀-⯿](?:️)?(?:‍[\U0001F000-\U0001FAFF☀-➿♀♂](?:️)?)*)")
feitos = set()
for m in pat.finditer(texto):
    g = m.group(0)
    nome = "-".join(f"{ord(c):x}" for c in g)
    cand = [nome, nome.replace("-fe0f", ""), nome + "-fe0f"]
    achou = next((c for c in cand if c in avail), None)
    if not achou:
        print("sem imagem:", g, nome); continue
    shutil.copy(os.path.join(src, achou + ".png"), os.path.join(ROOT, "emoji", nome + ".png")); feitos.add(nome)
print(len(feitos), "emojis:", sorted(feitos))
