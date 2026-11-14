# Moldes em lote: ChatGPT desenha, o script fura

O ChatGPT faz só o **desenho em linha**. O script transforma cada desenho em molde no estilo Clássico:
furos espaçados por igual, cores das linhas, nós franceses nas bolinhas, prévia "como fica bordado" e página A4 pronta.

## 1. Prompt fixo (cole uma vez no começo da conversa do ChatGPT)

```
Você vai criar desenhos para moldes de bordado em papel com tema de Natal.
Regras para TODOS os desenhos desta conversa:
- Arte em LINHA, estilo contorno, como um livro de colorir. Nada pintado por dentro.
- Fundo branco liso. Sem sombra, sem textura, sem degradê, sem moldura, sem papel.
- Traço contínuo e grosso, todo com a mesma espessura.
- Só 3 cores de traço: vermelho (#B3282D), verde (#2E6B4A) e dourado (#C9962E).
- Bolinhas (frutinhas, enfeites, pontinhos) podem ser círculos cheios pequenos,
  separados das linhas, sem encostar em nenhum traço.
- Desenho simples e reconhecível, com poucos detalhes: entre 3 e 8 elementos.
  Nada de cenas complexas, rostos detalhados ou hachuras.
- SEM TEXTO e sem letras. O texto eu coloco depois.
- Formato vertical (retrato), desenho centralizado ocupando a maior parte da imagem.
- Desenhos originais. Nada de personagens de marca ou de filmes.
Responda só com a imagem.
```

Depois peça um desenho por vez, curto: `Desenho 001: sino com laço e azevinho`.

## 2. Envie o lote para mim

**Opção A (recomendada): aqui no chat.** Anexe até 10 PNGs por mensagem com nome `001.png`, `002.png`...
e mande a lista no formato abaixo. É a forma mais barata, porque não precisa baixar nada.

**Opção B: Google Drive.** Uma pasta por lote, compartilhada como "qualquer pessoa com o link",
com os PNGs e a lista. Para eu baixar de lá, a rede deste ambiente precisa liberar o Drive
(você aprova uma tela quando eu pedir).

## 3. A lista do lote (uma linha por molde)

```
codigo;nome;categoria;nivel;moldura;texto
001;Sino de Natal;Cartões e presentes;Fácil;sim;Feliz Natal
002;Meia da lareira;Árvore e casa;Fácil;sim;
003;Estrela guia;Árvore e casa;Médio;nao;Paz|e Amor
```

- `moldura`: `sim` põe a moldura pontilhada dourada; `nao` deixa o desenho maior.
- `texto`: opcional, bordado embaixo do desenho em letra cursiva. Use `|` para quebrar linha.
- `nivel`: Fácil, Médio ou Avançado.

## 4. O que eu rodo (referência técnica)

```
python3 moldes/lote.py          # lê moldes/lote.csv e moldes/entrada/*.png
node moldes/render.js saida     # gera moldes/saida/<codigo>.pdf e .png
```

O script avisa quando um desenho passa de 900 furos (detalhado demais): peça ao ChatGPT uma versão mais simples.
