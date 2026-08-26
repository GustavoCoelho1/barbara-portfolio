/* ==========================================================================
   PORTFÓLIO CIENTÍFICO — JavaScript
   --------------------------------------------------------------------------
   O JS faz três coisas, e só três:
     1. sequência de entrada das ilustrações do Hero;
     2. animação de entrada dos marcos da Timeline (IntersectionObserver);
     3. árvore do Mapa de Pesquisa (um único listener, por event delegation).

   Nada de animação decorativa além disso: excesso de movimento é justamente
   o que faz um site parecer genérico.
   ========================================================================== */

(function () {
  "use strict";

  /* Uma única fonte de verdade sobre preferência de movimento. */
  var movimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


  /* ------------------------------------------------------------------------
     1. HERO — entrada escalonada das ilustrações
     Cada ilustração recebe --ordem; o atraso real vem do CSS
     (transition-delay: calc(var(--ordem) * 130ms)).
     ------------------------------------------------------------------------ */
  function iniciarHero() {
    var ilustracoes = document.querySelectorAll("[data-entrada]");
    if (!ilustracoes.length) return;

    ilustracoes.forEach(function (elemento, indice) {
      elemento.style.setProperty("--ordem", indice);
    });

    if (movimentoReduzido) {
      // Sem animação: só garante que estão visíveis (o CSS já cuida disso).
      return;
    }

    // Um frame de folga para o navegador registrar o estado inicial e animar.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        ilustracoes.forEach(function (elemento) {
          elemento.classList.add("is-visivel");
        });
      });
    });
  }


  /* ------------------------------------------------------------------------
     2. TIMELINE — fade + slide ao entrar na viewport
     Cada marco é observado uma vez só e depois liberado.
     ------------------------------------------------------------------------ */
  function iniciarTimeline() {
    var marcos = document.querySelectorAll("[data-anim]");
    if (!marcos.length) return;

    // Sem IntersectionObserver (ou sem movimento): mostra tudo de uma vez.
    if (movimentoReduzido || !("IntersectionObserver" in window)) {
      marcos.forEach(function (marco) { marco.classList.add("is-visivel"); });
      return;
    }

    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add("is-visivel");
        observador.unobserve(entrada.target);
      });
    }, {
      threshold: 0.2,
      rootMargin: "0px 0px -8% 0px"
    });

    marcos.forEach(function (marco) { observador.observe(marco); });
  }


  /* ------------------------------------------------------------------------
     3. MAPA DE PESQUISA — árvore por event delegation
     Um listener no container inteiro. Para adicionar áreas novas basta
     escrever o HTML: qualquer <li class="no"> com um botão [data-no] e um
     .no__ramo passa a funcionar sem tocar neste arquivo.
     ------------------------------------------------------------------------ */
  function iniciarArvore() {
    var arvore = document.querySelector("[data-arvore]");
    if (!arvore) return;

    /* Alterna um nó. O estado vive em dois lugares que precisam concordar:
       a classe .is-aberto (visual) e aria-expanded (leitores de tela). */
    function alternarNo(botao, forcar) {
      var no = botao.closest(".no");
      if (!no) return;

      var aberto = typeof forcar === "boolean" ? forcar : !no.classList.contains("is-aberto");

      no.classList.toggle("is-aberto", aberto);
      botao.setAttribute("aria-expanded", String(aberto));

      // Ramo fechado sai da ordem de tabulação e da árvore de acessibilidade.
      var ramo = document.getElementById(botao.getAttribute("aria-controls"));
      if (ramo) ramo.inert = !aberto;

      // Fechar um nó fecha os filhos: evita reabrir com estado inconsistente.
      if (!aberto) {
        no.querySelectorAll(".no.is-aberto").forEach(function (filho) {
          var botaoFilho = filho.querySelector("[data-no]");
          if (botaoFilho) alternarNo(botaoFilho, false);
        });
      }
    }

    // Estado inicial: tudo recolhido e inerte.
    arvore.querySelectorAll("[data-no]").forEach(function (botao) {
      var ramo = document.getElementById(botao.getAttribute("aria-controls"));
      if (ramo) ramo.inert = true;
    });

    /* O listener único. <button> já responde a Enter e Espaço nativamente,
       então não há teclado tratado à mão aqui — é de propósito. */
    arvore.addEventListener("click", function (evento) {
      var botao = evento.target.closest("[data-no]");
      if (!botao || !arvore.contains(botao)) return;
      alternarNo(botao);
    });

    // Controles de expandir/recolher tudo (mesma lógica, mesmo estado).
    var controles = document.querySelectorAll("[data-arvore-todos]");
    controles.forEach(function (controle) {
      controle.addEventListener("click", function () {
        var abrir = controle.dataset.arvoreTodos === "abrir";
        arvore.querySelectorAll("[data-no]").forEach(function (botao) {
          alternarNo(botao, abrir);
        });
      });
    });
  }


  /* ------------------------------------------------------------------------
     4. MENU SANDUÍCHE (mobile)
     No desktop a navegação fica sempre visível e o botão está escondido via
     CSS; aqui só tratamos o estado aberto/fechado do menu no mobile.
     ------------------------------------------------------------------------ */
  function iniciarMenu() {
    var botao = document.querySelector("[data-menu]");
    var nav = document.getElementById("menu-principal");
    if (!botao || !nav) return;

    function fechar() {
      botao.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-aberto");
    }
    function alternar() {
      var abrir = botao.getAttribute("aria-expanded") !== "true";
      botao.setAttribute("aria-expanded", String(abrir));
      nav.classList.toggle("is-aberto", abrir);
    }

    botao.addEventListener("click", alternar);

    // Escolher um destino fecha o menu; Esc também.
    nav.addEventListener("click", function (evento) {
      if (evento.target.closest("a")) fechar();
    });
    document.addEventListener("keydown", function (evento) {
      if (evento.key === "Escape") fechar();
    });
  }


  /* ------------------------------------------------------------------------
     Inicialização
     ------------------------------------------------------------------------ */
  function iniciar() {
    iniciarHero();
    iniciarTimeline();
    iniciarArvore();
    iniciarMenu();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
