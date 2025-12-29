const solucoes = [
  {
    nome: "Branding & Identidade Visual",
    descricao:
      "Construímos marcas fortes, memoráveis e consistentes, alinhando identidade visual, linguagem e posicionamento em todos os pontos de contato.",
    icone: "Assets/Icons/branding.svg",
    bullets: [
      "Criação ou renovação completa da identidade.",
      "Definição de cores, tipografia e aplicações.",
      "Guias de uso da marca para manter consistência.",
    ],
  },
  {
    nome: "Design de Interfaces",
    descricao:
      "Desenhamos interfaces modernas e intuitivas, com foco em clareza visual, navegação fluida e experiências digitais que convertem.",
    icone: "Assets/Icons/design.svg",
    bullets: [
      "Interfaces pensadas para web e mobile.",
      "Fluxos claros para navegação intuitiva.",
      "Prioridade na experiência do usuário (UX).",
    ],
  },
  {
    nome: "Desenvolvimento Web",
    descricao:
      "Desenvolvemos sites rápidos, responsivos e otimizados para SEO, preparados para crescer junto com as metas do seu negócio.",
    icone: "Assets/Icons/webdev.svg",
    bullets: [
      "Desenvolvimento com foco em performance.",
      "Responsividade para diferentes dispositivos.",
      "Estrutura pronta para crescer junto com o negócio.",
    ],
  },
  {
    nome: "Estratégia Digital",
    descricao:
      "Unimos dados, pesquisa e visão de negócio para criar estratégias digitais que conectam sua marca às pessoas certas, nos canais certos.",
    icone: "Assets/Icons/estrategiadigital.svg",
    bullets: [
      "Análise de presença atual da marca.",
      "Definição de objetivos e indicadores.",
      "Planejamento de ações digitais integradas.",
    ],
  },
  {
    nome: "Gestão de Redes Sociais",
    descricao:
      "Planejamos e gerimos a presença da sua marca nas redes sociais, garantindo consistência, relevância e relacionamento contínuo com o público.",
    icone: "Assets/Icons/socialmedia.svg",
    bullets: [
      "Planejamento e calendário de conteúdo.",
      "Criação de peças visuais alinhadas à marca.",
      "Acompanhamento de engajamento e ajustes.",
    ],
  },
];

const carrosselContainer = document.querySelector(".solucoes-carrossel");

solucoes.forEach((servico, index) => {
  const card = document.createElement("div");
  card.classList.add("servico-card");

  card.innerHTML = `
        <img src="${servico.icone}" alt="${servico.nome}" class="servico-icone">
        <h3>${servico.nome}</h3>
        `;

  carrosselContainer.appendChild(card);
});

const cards = document.querySelectorAll(".servico-card");
const detalhesTitulo = document.querySelector(".solucoes-detalhes-titulo");
const detalhesTexto = document.querySelector(".solucoes-detalhes-texto");
const detalhesIcone = document.querySelector(".solucoes-detalhes-icone");
const detalhesLista = document.querySelector(".solucoes-detalhes-lista");
const detalhesContainer = document.querySelector(".solucoes-detalhes");
let ativo = 2;

function atualizarCarrossel() {
  cards.forEach((card, index) => {
    card.classList.remove("ativo");

    const distancia = Math.abs(index - ativo);

    if (index === ativo) {
      card.classList.add("ativo");
      card.style.transform = "scale(1)";
      card.style.opacity = "1";
    } else {
      const escala = 1 - distancia * 0.05;
      const opacidadeBase = 1 - distancia * 0.2;
      const opacidadeFinal = Math.max(opacidadeBase, 0.1);

      card.style.transform = `scale(${escala})`;
      card.style.opacity = opacidadeFinal;
    }
  });

  atualizarDetalhes();
}

function atualizarDetalhes() {
  detalhesContainer.classList.add("solucoes-detalhes-animacao");

  setTimeout(() => {
    const servicoAtivo = solucoes[ativo];

    detalhesTitulo.textContent = servicoAtivo.nome;
    detalhesTexto.textContent = servicoAtivo.descricao;
    detalhesIcone.src = servicoAtivo.icone;
    detalhesIcone.alt = servicoAtivo.nome;

    detalhesLista.innerHTML = "";

    if (servicoAtivo.bullets && servicoAtivo.bullets.length > 0) {
      servicoAtivo.bullets.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        detalhesLista.appendChild(li);
      });
    }
    detalhesContainer.classList.remove("solucoes-detalhes-animacao");
  }, 300);
}

cards.forEach((card, index) => {
  card.addEventListener("click", () => {
    ativo = index;
    atualizarCarrossel();
  });
});

atualizarCarrossel();

const modalServico = document.getElementById("modal-servico");
const modalServicoFechar = modalServico?.querySelector(".modal-servico-fechar");
const modalServicoTitulo = modalServico?.querySelector(".modal-servico-titulo");
const modalServicoTexto = modalServico?.querySelector(".modal-servico-texto");
const botaoMaisServico = document.querySelector(".solucoes-bt");

function abrirModalServico() {
  const servicoAtivo = solucoes[ativo];
  if (!modalServico) return;

  if (modalServicoTitulo) modalServicoTitulo.textContent = servicoAtivo.nome;
  if (modalServicoTexto)
    modalServicoTexto.textContent = `Em breve você verá aqui os principais projetos de ${servicoAtivo.nome}.`;

  if (typeof modalServico.showModal === "function") {
    modalServico.showModal();
  } else {
    modalServico.setAttribute("open", "");
  }
}

function fecharModalServico() {
  if (!modalServico) return;
  if (modalServico.open) {
    try {
      modalServico.close();
    } catch (err) {
      modalServico.removeAttribute("open");
    }
  }
}

botaoMaisServico?.addEventListener("click", abrirModalServico);
modalServicoFechar?.addEventListener("click", fecharModalServico);

modalServico?.addEventListener("click", (e) => {
  if (e.target === modalServico) fecharModalServico();
});

modalServico?.addEventListener("cancel", (e) => {
  e.preventDefault();
  fecharModalServico();
});
