"""Catálogo dos 250 moldes. Gera moldes/catalogo.json (número, categoria, tipo, nome, forma, formato, texto...)."""
import json, os
ROOT = os.path.dirname(os.path.abspath(__file__))
F = ["árvore", "estrela", "floco de neve", "sino", "meia", "presente", "vela", "coração", "biscoito de gengibre", "luva",
     "boneco de neve", "bengala doce", "guirlanda", "rosácea", "bolinha", "azevinho", "lua e estrelas"]
FRASES = ["Feliz Natal", "Boas Festas", "Paz e Amor", "Com carinho", "Noite Feliz", "Para você", "Natal em família", "Ho Ho Ho", "Gratidão", "Amor e luz"]
cat = []

def add(categoria, tipo, forma, formato="card", texto="", swap=False, simple=False, extra=None):
    nome = f"{tipo} {forma}" + (" verde" if swap else "") + (f" · {texto}" if texto and tipo in ("Cartão", "Convite") else "")
    cat.append(dict(categoria=categoria, tipo=tipo, forma=forma, formato=formato, texto=texto, swap=swap, simple=simple, extra=extra or {}, nome=nome))

C1 = "Cartões e presentes"; C2 = "Árvore e casa"; C3 = "Mesa da ceia"; C4 = "Em família e crianças"
# --- Cartões e presentes (70)
for i in range(30):
    f = F[i % 17]
    if f in ("guirlanda", "rosácea"): f = ["bolinha", "azevinho"][i % 2]
    add(C1, "Cartão", f, "card", FRASES[i % 10], swap=(i >= 17))
for i in range(20):
    add(C1, "Etiqueta", F[(i * 3 + 1) % 17] if F[(i * 3 + 1) % 17] not in ("guirlanda",) else "azevinho", "round-s", ["Para você", "Com carinho", "De: ___", "Boas Festas"][i % 4], swap=(i % 2 == 1), simple=True)
for i in range(10):
    add(C1, "Selo de embalagem", ["estrela", "azevinho", "floco de neve", "coração", "bolinha", "presente", "sino", "árvore", "luva", "vela"][i], "round-s", "", swap=(i % 2 == 1), simple=True)
for i in range(10):
    add(C1, "Convite", ["vela", "estrela", "azevinho", "sino", "bolinha", "árvore", "lua e estrelas", "presente", "coração", "meia"][i], "card", ["Ceia de Natal", "Venha celebrar", "Você é convidado"][i % 3], swap=(i % 2 == 1), simple=True)
# --- Árvore e casa (70)
for i in range(30):
    f = [x for x in F if x not in ("guirlanda",)][i % 16]
    add(C2, "Enfeite", f, "round", "", swap=(i >= 16))
for i in range(15):
    add(C2, "Guirlanda" if i < 8 else "Medalhão", ["guirlanda", "rosácea"][i % 2] if i < 8 else ["estrela", "floco de neve", "bolinha", "coração", "azevinho", "lua e estrelas", "sino"][i % 7], "round", FRASES[i % 10] if i % 3 == 0 else "", swap=(i % 4 >= 2), extra={"n": 8 + (i % 3) * 2})
for i in range(10):
    add(C2, "Meia da lareira" if i < 5 else "Cartaz da lareira", "meia" if i < 5 else ["luva", "vela", "bengala doce", "sino", "estrela"][i - 5], "card", ["Boas Festas", "Feliz Natal", "Natal em família", "Com carinho", "Paz e Amor"][i % 5], swap=(i % 2 == 1))
CENA = {"lua e estrelas": "Noite Feliz", "boneco de neve": "Hora de brincar", "árvore": "Feliz Natal", "estrela": "Estrela de Belém", "vela": "Luz do Natal",
        "sino": "Boas Festas", "azevinho": "Paz e Amor", "floco de neve": "Neve de Natal", "presente": "Para você"}
for i in range(15):
    f = ["lua e estrelas", "boneco de neve", "árvore", "estrela", "vela", "sino", "lua e estrelas", "boneco de neve", "árvore", "estrela", "vela", "sino", "azevinho", "floco de neve", "presente"][i]
    add(C2, "Cena de Natal", f, "card", CENA[f], swap=(i >= 8))
# --- Mesa da ceia (50)
for i in range(20):
    add(C3, "Marcador de lugar", F[(i * 2) % 17] if F[(i * 2) % 17] != "guirlanda" else "azevinho", "card", "Nome:", swap=(i % 2 == 1), simple=True, extra={"nome": True})
for i in range(10):
    add(C3, "Porta-guardanapo", ["azevinho", "estrela", "floco de neve", "bolinha", "sino", "vela", "coração", "árvore", "bengala doce", "luva"][i], "card", "", swap=(i % 2 == 1), simple=True)
for i in range(10):
    add(C3, "Descanso de copo", ["rosácea", "guirlanda", "estrela", "floco de neve", "bolinha", "azevinho", "coração", "lua e estrelas", "sino", "árvore"][i], "round", "", swap=(i % 2 == 1), simple=True)
for i in range(10):
    add(C3, "Cardápio", ["vela", "azevinho", "estrela", "sino", "árvore", "bolinha", "meia", "floco de neve", "presente", "lua e estrelas"][i], "card", "Cardápio", swap=(i % 2 == 1), simple=True, extra={"cardapio": True})
# --- Em família e crianças (60)
for i in range(30):
    f = ["árvore", "estrela", "coração", "luva", "boneco de neve", "sino", "presente", "biscoito de gengibre", "meia", "bengala doce", "bolinha", "vela", "azevinho", "floco de neve", "lua e estrelas"][i % 15]
    add(C4, "Molde fácil", f, "card", "", swap=(i >= 15), simple=True)
for i in range(25):
    add(C4, "Calendário do advento", ["estrela", "azevinho", "bolinha", "floco de neve", "coração"][i % 5], "advento", str(i + 1), swap=(i % 2 == 1), simple=True)
for i in range(5):
    add(C4, "Cartaz em grupo", ["árvore", "estrela", "boneco de neve", "presente", "sino"][i], "card", ["Natal em família", "Feliz Natal", "Todos juntos", "Gratidão", "Amor e luz"][i], simple=True)
for n, c in enumerate(cat, 1):
    c["numero"] = n
assert len(cat) == 250, len(cat)
seen = {}
for c in cat:
    seen[c["nome"]] = seen.get(c["nome"], 0) + 1
    if seen[c["nome"]] > 1:
        c["nome"] += f" (versão {seen[c['nome']]})"
json.dump(cat, open(os.path.join(ROOT, "catalogo.json"), "w"), ensure_ascii=False, indent=1)
print(len(cat), "moldes;", len({c["nome"] for c in cat}), "nomes distintos")
