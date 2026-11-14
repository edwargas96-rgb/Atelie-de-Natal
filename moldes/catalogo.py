"""Catálogo dos 250 moldes. Gera moldes/catalogo.json (número, categoria, tipo, nome, forma, formato, texto...)."""
import json, os
ROOT = os.path.dirname(os.path.abspath(__file__))
F = ["árvore", "estrela", "floco de neve", "sino", "meia", "presente", "vela", "coração", "biscoito de gengibre", "luva",
     "boneco de neve", "bengala doce", "guirlanda", "rosácea", "bolinha", "azevinho", "lua e estrelas"]
FRASES = ["Feliz Natal", "Boas Festas", "Paz e Amor", "Com carinho", "Noite Feliz", "Para você", "Natal em família", "Ho Ho Ho", "Gratidão", "Amor e luz"]
cat = []

def add(categoria, tipo, forma, formato="card", texto="", swap=False, simple=False, extra=None):
    nome = f"{tipo} " + ((extra or {}).get("rotulo") or forma) + (" verde" if swap else "") + (f" · {texto}" if texto and tipo in ("Cartão", "Convite") else "")
    cat.append(dict(categoria=categoria, tipo=tipo, forma=forma, formato=formato, texto=texto, swap=swap, simple=simple, extra=extra or {}, nome=nome))

C1 = "Cartões e presentes"; C2 = "Árvore e casa"; C3 = "Mesa da ceia"; C4 = "Em família e crianças"
# --- Cartões e presentes (70)
for i in range(30):
    f = F[i % 17]
    if f in ("guirlanda", "rosácea"): f = ["bolinha", "azevinho"][i % 2]
    add(C1, "Cartão", f, "card", FRASES[i % 10], swap=(i >= 17))
for i in range(20):
    add(C1, "Etiqueta", F[(i * 3 + 1) % 17] if F[(i * 3 + 1) % 17] not in ("guirlanda",) else "azevinho", "round-s", ["Para você", "Com carinho", "De: ___", "Boas Festas"][i % 4], swap=(i % 2 == 1), simple=True)
INN = ["estrela", "azevinho", "coração", "floco de neve", "bolinha", "sino", "árvore", "presente", "vela", "meia"]
for i in range(6):
    add(C1, "Envelope", "envelope", "card", "", swap=(i % 2 == 1), simple=True, extra={"inner": INN[i], "rotulo": INN[i]})
for i in range(4):
    add(C1, "Embalagem (sacola)", "sacola", "card", "", swap=(i % 2 == 1), simple=True, extra={"inner": INN[6 + i], "rotulo": INN[6 + i]})
for i in range(10):
    add(C1, "Convite", ["vela", "estrela", "azevinho", "sino", "bolinha", "árvore", "lua e estrelas", "presente", "coração", "meia"][i], "card", ["Ceia de Natal", "Venha celebrar", "Você é convidado"][i % 3], swap=(i % 2 == 1), simple=True)
# --- Árvore e casa (70)
for i in range(30):
    f = [x for x in F if x not in ("guirlanda",)][i % 16]
    add(C2, "Enfeite", f, "round", "", swap=(i >= 16))
for i in range(8):
    add(C2, "Guirlanda", ["guirlanda", "rosácea"][i % 2], "round", FRASES[i % 10] if i % 3 == 0 else "", swap=(i % 4 >= 2), extra={"n": 8 + (i % 3) * 2})
VAR = [("estrela", "coração", "bolinha", "sino", "azevinho"), ("árvore", "meia", "presente", "vela", "floco de neve"), ("coração", "estrela", "coração", "estrela", "coração"),
       ("sino", "bolinha", "sino", "bolinha", "sino"), ("floco de neve", "estrela", "floco de neve", "estrela", "floco de neve"), ("azevinho", "bolinha", "azevinho", "bolinha", "azevinho"), ("luva", "meia", "luva", "meia", "luva")]
for i in range(7):
    add(C2, "Varal", "varal", "card", "", swap=(i % 2 == 1), extra={"inners": list(VAR[i]), "rotulo": f"{VAR[i][0]} e {VAR[i][1]}"})
for i in range(5):
    add(C2, "Meia da lareira", "meia", "card", ["Boas Festas", "Feliz Natal", "Natal em família", "Com carinho", "Paz e Amor"][i], swap=(i % 2 == 1), extra={"v": i % 4})
for i in range(5):
    add(C2, "Lareira", "lareira", "card", ["Lar doce lar", "Natal em casa", "Feliz Natal", "Calor de Natal", ""][i], swap=(i % 2 == 1))
PRE = [("presépio", "Noite Feliz"), ("presépio", "Paz na Terra"), ("presépio", "Jesus nasceu"), ("reis magos", "Reis Magos"), ("reis magos", "Guiados pela estrela"), ("anjo", "Glória a Deus"), ("anjo", "Anjo da paz"), ("ovelha", "Pastores")]
for i, (f, t) in enumerate(PRE):
    add(C2, "Presépio", f, "card", t, swap=(i % 2 == 1))
CENA = {"lua e estrelas": "Noite Feliz", "boneco de neve": "Hora de brincar", "árvore": "Feliz Natal", "estrela": "Estrela de Belém", "vela": "Luz do Natal", "sino": "Boas Festas", "azevinho": "Paz e Amor"}
for f in ["lua e estrelas", "boneco de neve", "árvore", "estrela", "vela", "sino", "azevinho"]:
    add(C2, "Cena de Natal", f, "card", CENA[f], swap=False)
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
for i, f in enumerate(["árvore", "estrela", "guirlanda", "boneco de neve", "presente"]):
    add(C4, "Atividade em grupo", f, "grupo", "", swap=(i % 2 == 1), simple=True, extra={"rotulo": f"{f} em 4 pedaços"})
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
