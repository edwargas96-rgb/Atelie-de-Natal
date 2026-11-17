"""Põe ?v=<hash do conteúdo> nos CSS/JS das páginas, para o navegador baixar a versão nova a cada mudança.
Rode antes de publicar: python3 versao.py"""
import hashlib, re
for page in ["index.html", "termos.html", "privacidade.html"]:
    h = open(page, encoding="utf-8").read()
    def stamp(m):
        path = m.group(2)
        v = hashlib.md5(open(path, "rb").read()).hexdigest()[:8]
        return f'{m.group(1)}{path}?v={v}"'
    h = re.sub(r'((?:href|src)=")(assets/(?:css|js)/[\w.-]+\.(?:css|js))(?:\?v=\w+)?"', stamp, h)
    open(page, "w", encoding="utf-8").write(h)
print("ok")
