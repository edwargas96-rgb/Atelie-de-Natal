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
