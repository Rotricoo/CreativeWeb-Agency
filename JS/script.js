const funcionarios = [
  {
    id: "matheus",
    nome: "Matheus M.",
    cargo: "Diretor Criativo",
    bio: "Matheus é o cérebro por trás das nossas campanhas inovadoras, combinando criatividade com estratégia para entregar resultados excepcionais aos nossos clientes.",
    foto: "Assets/Matheus.jpg",
    bullets: [
      "Liderança criativa em campanhas 360º",
      "Transforma estratégias em conceitos visuais fortes",
      "Projetos com foco em aumento de engajamento e conversão",
    ],
  },
  {
    id: "gleyce",
    nome: "Gleyce M.",
    cargo: "Diretora Executiva",
    bio: "Gleyce lidera nossa equipe com paixão e visão, garantindo que cada projeto seja executado com excelência e alinhado aos objetivos de nossos clientes.",
    foto: "Assets/Gleyce.jpg",
    bullets: [
      "Gestão de equipes multidisciplinares com foco em performance",
      "Condução de projetos complexos com prazos desafiadores",
      "Relacionamento próximo e estratégico com clientes-chave",
    ],
  },
  {
    id: "henrique",
    nome: "Henrique M.",
    cargo: "Diretor Estratégico",
    bio: "Henrique é o estrategista que impulsiona nossas campanhas, utilizando dados e insights para criar soluções que realmente conectam marcas e públicos.",
    foto: "Assets/Henrique.jpg",
    bullets: [
      "Planejamento de campanhas guiado por dados e insights",
      "Especialista em posicionamento e diferenciação de marca",
      "Otimização contínua de performance em canais digitais",
    ],
  },
  {
    id: "paulo",
    nome: "Paulo S.",
    cargo: "Relações Públicas",
    bio: "Paulo é o especialista em comunicação que constrói e mantém a imagem positiva de nossos clientes, cultivando relacionamentos sólidos com a mídia e o público.",
    foto: "Assets/Paulo.jpg",
    bullets: [
      "Gestão de reputação e comunicação em múltiplos canais",
      "Relacionamento com imprensa, influenciadores e stakeholders",
      "Criação de narrativas que fortalecem a imagem da marca",
    ],
  },
  {
    id: "rodrigo",
    nome: "Rodrigo S.",
    cargo: "Designer Criativo",
    bio: "Rodrigo é o talento por trás dos visuais impressionantes que criamos, combinando arte e funcionalidade para dar vida às ideias de nossos clientes.",
    foto: "Assets/Rodrigo.jpg",
    bullets: [
      "Criação de identidades visuais alinhadas à estratégia da marca",
      "Layouts para web e social com foco em clareza e impacto visual",
      "Domínio de ferramentas Adobe e boas práticas de design digital",
    ],
  },
];

const aboutBtFuncionarios = document.querySelectorAll(".about-bt");
const modalMembro = document.getElementById("modal-membro");
const modalMembroFoto = document.querySelector(".modal-membro-foto");
const modalMembroNome = document.querySelector(".modal-membro-nome");
const modalMembroCargo = document.querySelector(".modal-membro-cargo");
const modalMembroBio = document.querySelector(".modal-membro-bio");
const modalMembroLista = document.querySelector(".modal-membro-lista");
const modalMembroFecharBtn = document.querySelector(".modal-membro-fechar");

if (aboutBtFuncionarios.length && modalMembro) {
  aboutBtFuncionarios.forEach((botao) => {
    botao.addEventListener("click", () => {
      const membroId = botao.getAttribute("data-member");
      const funcionario = funcionarios.find((func) => func.id === membroId);

      if (funcionario) {
        if (modalMembroFoto) {
          modalMembroFoto.src = funcionario.foto;
          modalMembroFoto.alt = funcionario.nome;
        }
        if (modalMembroNome) {
          modalMembroNome.textContent = funcionario.nome;
        }
        if (modalMembroCargo) {
          modalMembroCargo.textContent = funcionario.cargo;
        }
        if (modalMembroBio) {
          modalMembroBio.textContent = funcionario.bio;
        }

        if (modalMembroLista) {
          modalMembroLista.innerHTML = "";
          funcionario.bullets.forEach((texto) => {
            const li = document.createElement("li");
            li.textContent = texto;
            modalMembroLista.appendChild(li);
          });
        }

        if (modalMembro.showModal) modalMembro.showModal();
      }
    });
  });
}

function fecharModalMembro() {
  if (modalMembro && modalMembro.open) modalMembro.close();
}

modalMembroFecharBtn?.addEventListener("click", fecharModalMembro);

modalMembro?.addEventListener("cancel", (e) => {
  fecharModalMembro();
});

// Portfolio dialog
const botaoPortfolio = document.querySelector(".bt-porTrasDaMarca");
const modalPortfolio = document.getElementById("modal-portfolio");
const modalPortfolioFecharBtn = modalPortfolio?.querySelector(".modal-portfolio-fechar");

botaoPortfolio?.addEventListener("click", () => {
  modalPortfolio.showModal();
});

function fecharModalPortfolio() {
  if (modalPortfolio && modalPortfolio.open) modalPortfolio.close();
}

modalPortfolioFecharBtn?.addEventListener("click", fecharModalPortfolio);

modalPortfolio?.addEventListener("click", (e) => {
  if (e.target === modalPortfolio) {
    fecharModalPortfolio();
  }
});

modalPortfolio?.addEventListener("cancel", () => fecharModalPortfolio());

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#site-nav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      header.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
});

(function initDepoimentos() {
  const mq = window.matchMedia("(max-width: 900px)");

  const slides = Array.from(document.querySelectorAll(".depoimentos-div"));
  if (!slides.length) return;

  let idx = slides.findIndex((s) => s.classList.contains("active"));
  if (idx < 0) idx = 0;

  function show() {
    slides.forEach((s, i) => {
      s.classList.toggle("active", i === idx);
      s.setAttribute("aria-hidden", i === idx ? "false" : "true");
    });
  }

  const next = document.querySelector(".depo-next");
  const prev = document.querySelector(".depo-prev");

  next?.addEventListener("click", () => {
    idx = (idx + 1) % slides.length;
    show();
  });

  prev?.addEventListener("click", () => {
    idx = (idx - 1 + slides.length) % slides.length;
    show();
  });

  show();
})();
