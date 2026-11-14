# Progresso dos 250 moldes

Para retomar do zero (se a sessão reiniciar):

```
python3 moldes/catalogo.py            # recria moldes/catalogo.json
python3 moldes/fazer_lote.py N        # lote N = moldes (N-1)*10+1 .. N*10
node moldes/render_lote.js N          # PDFs em moldes/saida/ + folha de revisão em moldes/lotes/lote-NN.png
```

Cada molde é um PDF A4 no estilo Clássico (`moldes/saida/NNN.pdf`).
A folha `moldes/lotes/lote-NN.png` mostra os 10 do lote para conferência visual.

## Estado
(atualizado a cada lote revisado)

- Lotes 1 a 25 (moldes 001-250): **gerados e revisados** (estilo Clássico, PDF A4 em `moldes/saida/`).
- Ajustes feitos na revisão: texto das etiquetas redondas trocado por linha para escrever o nome; textos das cenas casados com a forma;
  marcadores de lugar com linha única.
- Limite conhecido: 17 formas-base com variações de cor, texto e formato (quadrado, redondo Ø 9 cm, redondo Ø 6 cm).
  Nas categorias com muitas peças (meias, marcadores, descansos) há repetição de forma.
- Versão 2: criadas as formas que faltavam para bater com a página: envelopes (6) e sacolas de embalagem (4), varais de bandeirinhas (7),
  lareiras (5), presépio, reis magos, anjo e ovelha (8) e atividades em grupo em 4 pedaços (5). Meias agora têm 4 estampas diferentes.
