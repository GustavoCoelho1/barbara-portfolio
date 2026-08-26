# Design — decisões diretivas

Este documento registra as decisões de design que **direcionam** o projeto —
o porquê da paleta, da tipografia, das técnicas decorativas e das regras que
mantêm a "colagem científica" com disciplina de sistema, em vez de virar
scrapbook. Ele é a referência para qualquer ajuste visual futuro: antes de
mudar uma cor, um espaçamento ou adicionar um elemento decorativo, confira se
a mudança respeita o que está aqui.

Para arquitetura de código, convenções e estado atual, ver [CONTEXT.md](CONTEXT.md).

---

## 1. Direção de arte

**Colagem científica de caderno de campo** — recorte, papel envelhecido,
ilustração de linha estilo gravura antiga, fita adesiva, fotos tipo polaroid
— executada com disciplina de design system, não como bagunça.

A frase-teste usada durante todo o projeto: *"caderno de laboratório de uma
pesquisadora que também é boa em design"*, nunca *"scrapbook de Pinterest"*.

Duas decisões protegem essa fronteira:

- **Densidade decorativa nas bordas, texto de conteúdo limpo.** Toda
  ilustração, selo, fita ou nota manuscrita vive na moldura da seção — nunca
  sobre o texto que carrega informação real. Isso foi verificado
  sistematicamente (nenhuma decoração encosta em título, corpo de texto ou
  chip em nenhum breakpoint).
- **Interatividade restrita a dois pontos**: o Hero (entrada das ilustrações)
  e o Mapa de Pesquisa (árvore clicável). Todo o resto é estático ou tem
  animação discreta de entrada (timeline). Excesso de movimento é o que faz
  um site parecer "gerado por IA genérica" — o oposto do que se busca aqui.

## 2. Paleta

Seis cores, sem azul, sem terracota genérico de IA (`#D97757` e vizinhos):

| Token | Hex de origem | Papel |
|---|---|---|
| `--papel` | `#F3ECDD` | fundo base, papel envelhecido |
| `--tinta` | `#2B2A22` | texto principal |
| `--verde-profundo` | `#33402A` | recorte do Hero, seções de destaque, rodapé |
| `--verde-salvia` | `#6E7F58` | ícones, conectores da árvore, accent secundário |
| `--vinho-argila` | `#8C4A3A` | tags, hover, selos — com moderação |
| `--ocre-envelhecido` | `#B8934D` | divisórias, carimbo, bordas de destaque |

A paleta **não existe como hex fixo** — cada cor é H/S/L separados, montados
via `hsl()`, com dois níveis de controle de brilho (geral e por cor). Ver
"Sistema de tokens de cor" no CONTEXT.md para a mecânica técnica; a regra de
design é: mudanças de brilho devem ficar entre `-8%` e `8%` — além disso o
contraste de texto claro sobre `--verde-profundo` sai do WCAG AA.

**Variantes de texto.** Sálvia e ocre, nos valores "de traço" da tabela
acima, não alcançam 4.5:1 em texto pequeno sobre `--papel`. Por isso existem
`--verde-salvia-texto`, `--ocre-texto` e `--ocre-claro` — as mesmas cores,
deslocadas em luminosidade, nunca em matiz ou saturação. Regra: **traço e
borda usam a cor base; texto usa sempre a variante -texto/-claro
correspondente.** Todo texto do site foi auditado e passa AA (a maioria fica
entre 4.5:1 e 9:1; ver tabela de verificação no changelog do CONTEXT.md).

## 3. Tipografia — quatro papéis, nunca mais de dois por seção

- **Display** (`Fraunces`) — títulos, nome no Hero. Pesos altos, itálico no
  sobrenome.
- **Corpo** (`Inter`) — leitura.
- **Dados técnicos** (`IBM Plex Mono`) — anos, siglas, chips de técnica,
  rótulos de seção.
- **Manuscrita** (`Caveat`) — legendas, anotações, citações — uso pontual e
  sempre curto.

Regra: nunca mais de duas famílias visíveis ao mesmo tempo na mesma seção.
Mono e Caveat entram como marcadores, não como corpo de texto.

## 4. Layout

- Grid assimétrico; elementos podem se sobrepor levemente nas bordas entre
  seções (o `.transbordo` cruzando o limite de uma seção para a seguinte).
- Cada seção escura usa um recorte de papel rasgado (`clip-path`) no lugar de
  uma borda reta — exceto na emenda Contato→Rodapé, ver §7.
- Regra de rotação decorativa: nunca além de `-4deg` a `6deg` em fotos, notas,
  cards ou selos. Variar com `:nth-child()`. **Exceção**: o selo/carimbo pode
  ir a `-8deg`, porque um carimbo torto lê como carimbo de verdade — acima
  disso, em qualquer outro elemento, lê como desleixo.

## 5. Biblioteca de técnicas decorativas

Reutilizáveis via classe CSS, cada uma pensada para custo de runtime zero
(nada de imagem externa, nada de blur pesado recalculado):

- **Textura de papel** (`.textura-papel`) — SVG `feTurbulence` embutido como
  data-URI. Opacidade nunca acima de `.08` (definida em `--opacidade-textura:
  .06`) — acima disso o grão compete com a legibilidade.
- **Textura aquarela** (`.textura-aquarela`) — manchas radiais com
  `mix-blend-mode: screen`, reutilizável em qualquer seção escura. Ver §7
  para como ela resolve a transição Contato→Rodapé.
- **Fita washi** (`.fita::before`) — gradiente repetido diagonal, presente em
  quase todo card/nota como se estivesse fisicamente colada no papel.
- **Moldura polaroid** (`.polaroid`) — padding branco assimétrico (mais
  embaixo), sombra, rotação individual.
- **Selo/carimbo** (`.selo-carimbo`, `.selo-brasao`) — borda dupla,
  `mix-blend-mode: multiply` (sobre papel claro) ou `screen` (sobre fundo
  escuro), opacidade de tinta ~0.7–0.8, texto curvo via SVG `<textPath>` no
  brasão.
- **Recortes de papel rasgado** (`--recorte-bloco`, `--recorte-tarja`,
  `--recorte-topo`) — polígonos fixos em variáveis CSS, **nunca recalculados
  em runtime**. Os deslocamentos são em pixels, não em porcentagem — em % o
  dente cresce junto com a altura da seção e a borda vira serra.

## 6. Ilustrações — gravura anatômica/botânica

A biblioteca original (v1) usava traço geométrico simples — círculos e linhas
retas estilizando microscópio, hélice, célula. Foi substituída por completo a
pedido explícito: o traço geométrico lia como "clip-art", não como as
pranchas de livro antigo/gravura anatômica da referência visual do projeto
(colagem botânica com coração anatômico rotulado, neurônio, célula, ilustração
de linha fina e hachura, notas manuscritas).

Convenções da biblioteca atual (`index.html`, `<svg class="sprite-ilustracoes">`):

- `viewBox="0 0 100 100"`, `stroke="currentColor"` (herda a cor do contexto
  via CSS), `fill="none"` na maioria dos traços.
- Espessura de traço fina (`stroke-width` entre 1 e 1.9), com hachuras e
  detalhes em opacidade reduzida (`opacity=".6"` a `.8"`) para sugerir sombra
  de gravura sem pesar o desenho.
- A peça-assinatura é a **prancha anotada do coração** (`fig-coracao-anotado`)
  — reaproveita o `ilu-coracao` via `<use>` e adiciona chamadas com linha +
  ponto + rótulo em `Caveat`, imitando uma anotação manuscrita de caderno.
  É a única ilustração com rótulo de texto embutido; as outras permanecem
  puramente gráficas.
- Cada símbolo é comentado com o que representa (ex.: "Neurônio: soma,
  dendritos ramificados, axônio mielinizado") para facilitar substituição
  futura por artefato final sem precisar decifrar o path.

**Convenção de substituição**: para trocar qualquer ilustração por um
artefato gráfico final, troque o conteúdo do `<symbol>` mantendo `id` e
`viewBox` — nenhum CSS ou HTML fora do sprite precisa mudar.

## 7. Transição Contato → Rodapé

Problema original: a seção Contato e o `<footer>` eram dois blocos verdes
independentes, cada um com sua própria forma de recorte rasgado (inclusive
na base da Contato) — a costura entre os dois aparecia como um "degrau"
visual, reforçado pelo fato de só o rodapé ter o efeito aquarela.

Solução (dois ajustes, não um):

1. **Forma**: nova variável `--recorte-topo` — rasgada só no topo (onde a
   Contato encontra o Mapa, acima), reta na base e nas laterais. A base da
   Contato agora cola sem emenda no topo reto do rodapé.
2. **Textura**: a aquarela deixou de ser exclusiva do rodapé
   (`.rodape__aquarela`) e virou uma classe reutilizável
   (`.textura-aquarela`), aplicada também na Contato. As manchas da Contato
   pendem para a base (`at 24% 78%`, `at 55% 100%`); as do rodapé pendem para
   o topo (`at 20% 8%`, `at 78% 14%`) — o padrão parece **escorrer** de uma
   seção para a outra em vez de recomeçar do zero na emenda.

Cuidado técnico: a aquarela sangra `-20%` nas laterais por design (efeito de
mancha generosa, cortado pelo `overflow-x: clip` que toda seção já tem). Na
Contato, o inset vertical foi reduzido para `-3%` (em vez de `-20%`) porque
essa seção não tem `overflow-y` contido — um inset vertical generoso vazaria
visualmente para dentro do Mapa (fundo claro) logo acima. O rodapé pode
manter `-20%` nos dois eixos porque `.rodape` tem `overflow: hidden` próprio.

## 8. O que evitar (regras herdadas do blueprint original, ainda válidas)

- Decoração competindo com conteúdo real — decoração na moldura, texto limpo.
- Rotação exagerada (acima de `6°`, exceto o selo/carimbo).
- Textura de grão acima de `.08` de opacidade.
- Mais de duas famílias tipográficas visíveis por seção.
- Interatividade ou animação fora do Hero e do Mapa de Pesquisa.
- Dado inventado com aparência de real (revista, DOI, instituição fictícia)
  apresentado sem rótulo — regra que deixou de ter aplicação prática depois
  que o conteúdo passou a vir do currículo real (ver CONTEXT.md, "Enriquecimento
  com dados reais"), mas continua valendo como princípio para qualquer
  conteúdo futuro que ainda não tenha sido confirmado.
