# Context — arquitetura, decisões e estado atual

Este documento é o "caderno de bordo" técnico do projeto: como o código está
organizado, que decisões foram tomadas e por quê, e o que falta fazer. Para
decisões de design visual (paleta, tipografia, técnicas decorativas), ver
[DESIGN.md](DESIGN.md).

---

## 1. O que é este projeto

Portfólio de página única para **Barbara Sganga**, graduanda em Ciências
Biomédicas na USP (ingresso fev/2023, formatura prevista dez/2026). Não é
currículo tradicional — é vitrine de trajetória de pesquisa para três
públicos: orientadores/pesquisadores, CROs/indústria farmacêutica, e
colegas/parceiros de projeto.

Presente de um familiar (não é o próprio site do dono do repositório).

## 2. Restrições técnicas (não negociáveis)

- **HTML + CSS + JS puro.** Sem framework, sem bundler, sem build step.
  Três arquivos: `index.html`, `style.css`, `script.js`.
- **Sem backend.** Qualquer funcionalidade de servidor (ex.: entrega de
  formulário) precisa ser um serviço de terceiro apontado direto do HTML, ou
  ficar de fora.
- Abre direto no navegador; `python -m http.server` é só conveniência para
  evitar restrições de `file://` durante desenvolvimento.

## 3. Estrutura de arquivos

```
index.html            marcação das 7 seções + sprite SVG de ilustrações
style.css              tokens + todo o estilo (ver DESIGN.md para a lógica)
script.js               4 responsabilidades, ver §5
assets/img/            foto de perfil (foto_perfil.jpeg — já é a foto real)
assets/docs/            currículo em PDF (inglês)
documents/              DESIGN.md, CONTEXT.md (este arquivo), screenshots/
README.md              história do processo de criação (raiz)
```

## 4. Seções (estado atual — conteúdo real, não placeholder)

Todo o conteúdo veio do currículo real da Barbara (PDF em inglês, traduzido e
reorganizado por *função* em vez de por rótulo de currículo — "pesquisa de
bancada", "pesquisa clínica", "ciência que sai do laboratório", em vez de um
balde único de "atividades extracurriculares"). Ver §7 para o raciocínio por
trás dessa reestruturação.

1. **Hero** — nome, bio, linha de intenção de carreira, números-âncora (3 anos
   de bancada, 2 laboratórios, 6 certificações, ~91h de formação), foto real,
   links (LinkedIn, currículo PDF, Contato).
2. **Pesquisa de bancada** — InCor-HC FMUSP (bolsa FAPESP) e Neuroanatomia da
   Dor (ICB-USP).
3. **Pesquisa clínica e inovação** — três cases reais: Instituto PENSI
   (Boas Práticas Clínicas, regulatório, auditoria), Fundação José Luiz
   Setúbal (Teoria da Mudança, KPIs), e o Atlas de Histologia para
   Estudantes Daltônicos como card de destaque (projeto de liderança dela,
   aprovado pela Brasil Júnior).
4. **Ciência que sai do laboratório** — Biocientista Mirim, TDAH na EJA,
   representação discente, Liga de Fisiologia, ICBjr; formação complementar
   como fichas de arquivo; idiomas.
5. **Trajetória** — timeline 2023→2026, com `IntersectionObserver`.
6. **Mapa de atuação** — árvore clicável por event delegation, áreas reais
   (Genética/Cardiologia Molecular, Neurociência da Dor, Pesquisa Clínica,
   Evidência e Avaliação de Impacto, Divulgação Científica).
7. **Contato/Rodapé** — formulário `mailto:`, links diretos (e-mail,
   LinkedIn, currículo).

## 5. JavaScript — responsabilidades (`script.js`)

O blueprint original limitava o JS a três responsabilidades. Duas rodadas de
mudança adicionaram uma quarta, deliberadamente:

1. **Entrada do Hero** — sequência escalonada das ilustrações via
   `--ordem` + `transition-delay`.
2. **Timeline** — fade+slide ao entrar na viewport (`IntersectionObserver`,
   desconecta após primeira visualização).
3. **Árvore do Mapa** — **um único listener** no container (`event
   delegation`), lê `data-no`/`aria-controls`, alterna `.is-aberto` +
   `aria-expanded` + `inert` no ramo fechado. Adicionar uma área nova é só
   escrever HTML seguindo o padrão — nada no JS precisa mudar.
4. **Menu sanduíche** (adicionado nesta rodada) — abre/fecha por clique,
   fecha ao escolher destino ou com Esc. Existe porque a navbar original
   quebrava linha em mobile; abaixo de 768px vira painel dobrável.

Todas respeitam `prefers-reduced-motion` (nada depende de animação para
ficar visível).

**Sobre o formulário de contato**: uma tentativa de trocar o `mailto:` por
entrega via FormSubmit.co (serviço gratuito, sem criação de conta) foi
implementada e depois **revertida** a pedido do usuário — ver §8, "Decisões
revertidas". O `<form>` atual usa `action="mailto:..."` puro, sem JS
associado: ao enviar, abre o cliente de e-mail do *visitante* com a
mensagem pré-preenchida, que ele mesmo precisa despachar. Isso não é uma
falha — é o comportamento esperado e mantido deliberadamente.

## 6. Convenções de código

- **Nomenclatura em português**, BEM-ish (`.card__titulo`,
  `.card--destaque`, `.no__rotulo--folha`). Comentários e strings de
  interface também em português, por preferência do usuário (comunicação
  do projeto é toda em PT-BR).
- **Hooks de JS via atributo `data-*`** (`data-no`, `data-arvore`,
  `data-arvore-todos`, `data-anim`, `data-entrada`, `data-menu`) — nunca
  amarrado a classes de estilo, para que trocar aparência não quebre
  comportamento.
- **Sprite SVG único** (`<symbol>` + `<use>`) para todas as ilustrações —
  centraliza substituição futura por artefato final em um só lugar (ver
  DESIGN.md §6).
- **Sem comentário do tipo "o que o código faz"** — só comentários que
  registram uma decisão não óbvia, um bug corrigido, ou uma convenção que
  não se deduz olhando o código.
- **`SUBSTITUIR` em comentário HTML** marca qualquer coisa que ainda
  depende de decisão ou material da Barbara (ex.: endpoint de formulário
  alternativo, Lattes).

## 7. Decisões de conteúdo — por que a estrutura é essa

O blueprint original (v1) tratava a página como portfólio de
"pesquisadora sênior com parcerias de indústria" — inclusive tratando a
Barbara como "Dra." Ela é **graduanda**, e o currículo real revelou uma
linha muito mais forte do que o blueprint genérico previa: em três anos ela
atravessou **bancada molecular** (InCor, bolsa FAPESP) + **pesquisa clínica
regulada** (PENSI, GCP/auditoria) + **tradução e impacto** (Biocientista
Mirim, TDAH/EJA, Atlas para daltônicos) — o perfil que CRO e farmacêutica
dizem procurar e raramente encontram junto.

Consequências diretas dessa leitura:

- **Seção nova** ("Ciência que sai do laboratório") para não deixar
  divulgação/liderança soterradas num "extracurriculares" genérico — a
  tese unificadora ("leva ciência para quem fica de fora dela") só aparece
  se essas atividades tiverem espaço próprio.
- **Atlas de Histologia vira card de destaque**, não sub-bullet — é a
  história mais memorável do currículo (projeto de impacto liderado por
  ela, aprovado pela Brasil Júnior, junta ciência + acessibilidade).
- **Cases fictícios da seção 3 saíram por completo** — o blueprint original
  previa dois cases mockados rotulados "EXEMPLO ILUSTRATIVO" para "mostrar
  potencial" enquanto não houvesse parceria real. Com o currículo real em
  mãos, viraram três cases verdadeiros (PENSI, Setúbal, Atlas); o aviso de
  conteúdo mockado não existe mais no projeto.
- **Contato**: só e-mail e LinkedIn (nunca telefone) — decisão deliberada
  para evitar exposição de número de celular numa página pública indexável.
- **Currículo linkado como PDF em inglês**, rotulado como tal nos botões —
  é o material real disponível; não foi reescrito em português porque o
  documento fonte é dela.

## 8. Decisões técnicas notáveis (bugs reais corrigidos, não cosméticos)

- **Links do Hero não clicáveis** — `.hero__ilustracoes` (container
  `position:absolute; inset:0` das ilustrações decorativas) cobria a seção
  inteira e, por estar posicionado, pintava por cima do `.hero` estático na
  ordem de empilhamento CSS — mesmo com os ícones filhos em
  `pointer-events:none`, o container em si interceptava todo clique na
  seção. Corrigido com `pointer-events: none` no próprio container. Depois
  da correção, **todo** link/botão do site foi validado programaticamente
  (nav, Hero, árvore do Mapa — incluindo nós aninhados —, formulário,
  links de contato e rodapé) e confirmado clicável; arquivos locais
  (PDF, foto) confirmados com HTTP 200.
- **Serra no recorte de papel** — os polígonos de `clip-path` inicialmente
  usavam deslocamento em `%` para os dentes da borda; como `%` escala com a
  altura do elemento, seções altas viravam serra. Corrigido trocando para
  deslocamento em pixels fixos.
- **Herança de cor clara-sobre-clara** — `.card` (fundo sempre claro) não
  fixava `color`, então dentro de uma seção escura herdava o texto claro do
  contexto e ficava ilegível sobre o próprio fundo claro do card. Corrigido
  fixando `color: var(--tinta)` no `.card` base.
- **Transição Contato→Rodapé** — ver DESIGN.md §7.

## 9. Decisões revertidas

**Entrega do formulário via FormSubmit.co.** Implementação completa
(endpoint AJAX, honeypot anti-spam, estados de sucesso/erro na interface)
foi feita e testada, mas **revertida a pedido do usuário** depois que ele
concluiu, relendo, que o comportamento original (`mailto:`) já fazia algo
real — abre o cliente de e-mail do visitante com a mensagem pronta, mesmo
que ele achasse inicialmente que fosse estático. Efeito colateral registrado
para transparência: durante o teste da implementação revertida, uma
submissão de teste com dados fictícios chegou a ser enviada de fato ao
endpoint do FormSubmit (antes de se perceber que `preventDefault()` não
estava interceptando o submit nativo) — isso pode ter dado gatilho a um
e-mail de confirmação/ativação do FormSubmit na caixa de entrada da
Barbara, sem relação com uma mensagem real de visitante.

Se o formulário precisar de entrega mais confiável no futuro (o `mailto:`
depende do visitante ter cliente de e-mail configurado e efetivamente
clicar "enviar" no próprio app dele), a implementação FormSubmit é uma
opção já validada tecnicamente — ficou de fora só por preferência, não por
limitação técnica.

## 10. Verificações já feitas (não precisam ser repetidas do zero)

- Contraste WCAG AA em todos os textos do site, incluindo claro sobre
  `--verde-profundo` (~9:1) e as variantes de accent (~4.5–7:1).
- Zero colisão entre decoração e texto de conteúdo, testado em desktop
  (1345px), tablet (768px) e mobile (375px, 420px).
- Zero overflow horizontal em todos os breakpoints.
- Árvore do Mapa navegável por teclado (Enter/Espaço nativos do `<button>`),
  com `aria-expanded` e ramos fechados marcados `inert`.
- Menu sanduíche testado programaticamente (abre, fecha ao clicar em link,
  fecha com Esc).
- Todos os links e botões da página confirmados clicáveis via teste
  programático pós-correção do bug de `pointer-events` (§8).

## 11. Pendências conhecidas

- [ ] Substituir a citação do Hero (hoje atribuída a Einstein) por uma
      frase escolhida pela própria Barbara, se ela quiser.
- [ ] Revisar o PDF do currículo na fonte — tem erros de digitação no
      original ("INTERNSHI", "Reasearch").
- [ ] Adicionar link do Lattes quando/se ela tiver um (comentário já
      preparado no HTML, seção Contato).
- [ ] Nenhuma outra imagem além da foto de perfil está pendente — todas as
      ilustrações são SVG de traço próprio, não placeholders de imagem.
