<a name="readme-top"></a>

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)&nbsp;
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)&nbsp;
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)&nbsp;
![Built with Claude Code](https://img.shields.io/badge/Built%20with-Claude%20Code-8A63D2?style=for-the-badge)

<br />
<div align="center">

<h3 align="center">Portfólio — Barbara Sganga</h3>

  <p align="center">
    Portfólio científico de página única para uma graduanda em Ciências Biomédicas.
    <br />
    Zero framework, zero build — HTML, CSS e JS puros, com um design system inteiro construído em tokens.
    <br />
    <a href="https://gustavocoelho1.github.io/barbara-portfolio/" target="_blank">🌐 Ver o site</a>
    ·
    <a href="documents/DESIGN.md">🎨 Decisões de design</a>
    ·
    <a href="documents/CONTEXT.md">🧭 Arquitetura</a>
  </p>
</div>

<p align="center">
  <img src="documents/screenshots/01-hero.jpg" alt="Hero do portfólio" width="100%">
</p>

<details>
  <summary>Sumário da documentação</summary>
  <ol>
    <li><a href="#sobre-o-projeto">Sobre o projeto</a></li>
    <li><a href="#vitrine">Vitrine</a></li>
    <li><a href="#como-foi-construído">Como foi construído</a>
      <ul>
        <li><a href="#1-idealização">Idealização</a></li>
        <li><a href="#2-engenharia-de-prompt-o-blueprint">Engenharia de prompt — o blueprint</a></li>
        <li><a href="#3-engenharia-de-harness-o-agente-em-execução">Engenharia de harness — o agente em execução</a></li>
        <li><a href="#4-enriquecimento-com-contexto-real">Enriquecimento com contexto real</a></li>
      </ul>
    </li>
    <li><a href="#stack">Stack</a></li>
    <li><a href="#design-system-em-3-decisões">Design system em 3 decisões</a></li>
    <li><a href="#estrutura-do-projeto">Estrutura do projeto</a></li>
    <li><a href="#rodando-localmente">Rodando localmente</a></li>
    <li><a href="#contato">Contato</a></li>
  </ol>
</details>

<br />

## Sobre o projeto

Um portfólio não é um currículo — é uma vitrine que precisa convencer três
públicos diferentes (orientador, recrutador de indústria, colega de projeto)
de que existe produção real por trás do nome. Este site foi construído para
a Barbara Sganga, graduanda em Ciências Biomédicas na USP, como presente.

A direção de arte é **colagem científica de caderno de campo** — papel
envelhecido, gravura anatômica de linha fina, fita adesiva, polaroid —
executada com disciplina de design system, não como scrapbook. Todo o
conteúdo (pesquisa no InCor com bolsa FAPESP, pesquisa clínica no Instituto
PENSI, um projeto de acessibilidade premiado) vem do currículo real dela.

<p align="right">(<a href="#readme-top">Voltar ao topo</a>)</p>

## Vitrine

<p align="center">
  <img src="documents/screenshots/02-pesquisa-clinica.jpg" alt="Seção de pesquisa clínica" width="49%">
  <img src="documents/screenshots/03-mapa-pesquisa.jpg" alt="Mapa de pesquisa interativo" width="49%">
</p>

Os dois pontos de destaque interativo do site: um brasão carimbado com
`<textPath>` de SVG marcando os cases de pesquisa clínica, e um mapa de
áreas de atuação navegável como árvore, implementado com um único listener
por *event delegation* — nenhum framework, nenhuma lib de terceiro.

<p align="right">(<a href="#readme-top">Voltar ao topo</a>)</p>

## Como foi construído

Este projeto não nasceu de um prompt único pedindo "faça um portfólio".
Foi um processo em camadas, cada uma resolvendo um problema diferente —
o que separa **engenharia de prompt e de harness** de simplesmente
conversar com um modelo até algo parecer pronto.

#### 1. Idealização

A ideia e a estrutura de seções nasceram fora do editor de código: um
wireframe desenhado à mão definiu a ordem das seções, o layout de cada uma,
e anotou onde a interatividade deveria viver — "árvore interativa, event
delegation" no mapa, "animação on-scroll" na timeline. Essa etapa de
concepção usou um assistente generalista (GPT) para explorar direção antes
de qualquer compromisso técnico.

#### 2. Engenharia de prompt — o blueprint

O wireframe virou um **blueprint** escrito à parte: um documento que fixa
paleta (seis cores, com a razão de cada uma), tipografia (quatro papéis,
nunca mais de dois por seção), a biblioteca de técnicas decorativas
reutilizáveis, e — com a mesma importância — o que **não** fazer:
interatividade fora dos dois pontos de destaque, rotação acima de 6°, dado
fictício sem rótulo. Um blueprint é a diferença entre um prompt e uma
especificação: ele fecha decisões de design *antes* do agente escrever
qualquer CSS, para que a IA execute uma direção definida, não invente uma a
cada resposta.

#### 3. Engenharia de harness — o agente em execução

A execução aconteceu dentro do **Claude Code**, com acesso a navegador para
verificar o próprio trabalho — não só gerar código, mas carregar o site,
inspecionar o DOM, medir colisões entre elementos, e corrigir o que a
primeira implementação errou. Essa etapa pegou bugs reais que leitura de
código sozinha não mostraria: um recorte de papel que virava serrilhado em
seções altas, uma camada de aquarela com o `mix-blend-mode` errado para
fundo escuro, um container de decoração absolutamente posicionado
bloqueando clique em todos os links do Hero. O harness — o conjunto de
ferramentas, contexto e processo de verificação ao redor do modelo — é o
que torna esse tipo de correção possível em vez de acidental.

#### 4. Enriquecimento com contexto real

Depois da primeira versão pronta, dois novos insumos entraram juntos: o
currículo real da Barbara e uma nova referência visual (gravura
anatômica/botânica). Isso disparou duas mudanças simultâneas — conteúdo
reestruturado para contar a trajetória real dela (bancada → pesquisa
clínica regulada → liderança de projeto de impacto), e a biblioteca inteira
de ilustrações refeita do zero no traço da referência. Nenhuma das duas
mudanças teria acontecido bem numa única tentativa: dependeram de trazer
material de contexto concreto para o agente trabalhar em cima, não apenas
pedir "deixe mais bonito".

<p align="right">(<a href="#readme-top">Voltar ao topo</a>)</p>

## Stack

Deliberadamente sem framework — a complexidade do projeto está no design
system, não na engenharia de aplicação.

* ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
* ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
* ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

JS restrito a quatro responsabilidades (entrada do Hero, `IntersectionObserver`
da timeline, árvore do mapa por event delegation, menu mobile) — sem
dependência externa nenhuma.

<p align="right">(<a href="#readme-top">Voltar ao topo</a>)</p>

## Design system em 3 decisões

* **Cor como token, não como hex.** Cada cor é H/S/L separados; um único
  `--brilho-geral` clareia ou escurece o site inteiro sem quebrar a relação
  entre as cores — documentado em detalhe em [DESIGN.md](documents/DESIGN.md).
* **Ilustração própria, não asset de banco de imagem.** Toda a biblioteca
  gráfica é SVG de traço autoral, num único sprite reutilizável.
* **Contraste verificado, não assumido.** Todo texto do site passa WCAG AA
  — inclusive texto claro sobre o verde escuro do Hero (~9:1).

<p align="right">(<a href="#readme-top">Voltar ao topo</a>)</p>

## Estrutura do projeto

```
├── index.html              marcação das 7 seções + sprite SVG de ilustrações
├── style.css                design system completo (tokens, componentes)
├── script.js                 4 responsabilidades, sem dependências
├── assets/
│   ├── docs/                currículo em PDF (português)
│   └── img/                 foto de perfil
└── documents/
    ├── DESIGN.md            decisões diretivas de design
    ├── CONTEXT.md            arquitetura, convenções, decisões e pendências
    └── screenshots/
```

<p align="right">(<a href="#readme-top">Voltar ao topo</a>)</p>

## Rodando localmente

```sh
git clone https://github.com/GustavoCoelho1/barbara-portfolio
cd barbara-portfolio
python -m http.server 5500
```

Ou simplesmente abra `index.html` — não há dependências para instalar.

<p align="right">(<a href="#readme-top">Voltar ao topo</a>)</p>

## Contato

**Gustavo Coelho**

LinkedIn: [linkedin.com/in/gustavo-coelho1](https://www.linkedin.com/in/gustavo-coelho1/)
E-mail: gustavocoelho1412@gmail.com
Repositório: [github.com/GustavoCoelho1/barbara-portfolio](https://github.com/GustavoCoelho1/barbara-portfolio)

🔗 Link do site: [gustavocoelho1.github.io/barbara-portfolio](https://gustavocoelho1.github.io/barbara-portfolio/)

<p align="right">(<a href="#readme-top">Voltar ao topo</a>)</p>
