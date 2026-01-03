const teamMembers = [
  {
    id: "matheus",
    name: "Matheus M.",
    role: "Creative Director",
    bio: "Matheus is the creative mind behind our most innovative campaigns, combining bold ideas and strategy to deliver meaningful results.",
    photo: "Assets/Matheus.jpg",
    bullets: [
      "Creative leadership for 360° campaigns.",
      "Transforms strategy into strong visual concepts.",
      "Projects focused on engagement and conversion.",
    ],
  },
  {
    id: "gleyce",
    name: "Gleyce M.",
    role: "Executive Director",
    bio: "Gleyce leads our team with clarity and vision, ensuring every project is executed with excellence and aligned with our clients' goals.",
    photo: "Assets/Gleyce.jpg",
    bullets: [
      "Leads multidisciplinary teams with a performance mindset.",
      "Drives complex projects with challenging deadlines.",
      "Builds strategic, long-term relationships with key clients.",
    ],
  },
  {
    id: "henrique",
    name: "Henrique M.",
    role: "Strategic Director",
    bio: "Henrique drives our strategic thinking, using data and insights to create solutions that truly connect brands and audiences.",
    photo: "Assets/Henrique.jpg",
    bullets: [
      "Campaign planning driven by data and insights.",
      "Specialist in brand positioning and differentiation.",
      "Ongoing optimisation of performance across channels.",
    ],
  },
  {
    id: "paulo",
    name: "Paulo S.",
    role: "Public Relations Lead",
    bio: "Paulo is our communication specialist, building and protecting our clients’ reputations and managing key relationships.",
    photo: "Assets/Paulo.jpg",
    bullets: [
      "Reputation and communication management across channels.",
      "Strong relationships with press, influencers, and stakeholders.",
      "Creates narratives that strengthen brand perception.",
    ],
  },
  {
    id: "rodrigo",
    name: "Rodrigo S.",
    role: "Creative Designer",
    bio: "Rodrigo is the talent behind many of our visual concepts, combining aesthetics and usability to bring ideas to life.",
    photo: "Assets/Rodrigo.jpg",
    bullets: [
      "Creates visual identities aligned with brand strategy.",
      "Designs layouts for web and social with clarity and impact.",
      "Strong command of Adobe tools and digital design best practices.",
    ],
  },
];

// Employee modal
const teamButtons = document.querySelectorAll(".team__btn");
const employeeModal = document.getElementById("modalEmployee");
const employeePhoto = document.querySelector(".modal__employee--photo");
const employeeName = document.querySelector(".modal__employee--name");
const employeeRole = document.querySelector(".modal__employee--role");
const employeeBio = document.querySelector(".modal__employee--bio");
const employeeList = document.querySelector(".modal__employee--list");
const employeeCloseBtn = document.querySelector(".modal__employee--close");

if (teamButtons.length && employeeModal) {
  teamButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const memberId = button.getAttribute("data-member");
      const member = teamMembers.find((person) => person.id === memberId);

      if (!member) return;

      if (employeePhoto) {
        employeePhoto.src = member.photo;
        employeePhoto.alt = member.name;
      }

      if (employeeName) employeeName.textContent = member.name;
      if (employeeRole) employeeRole.textContent = member.role;
      if (employeeBio) employeeBio.textContent = member.bio;

      if (employeeList) {
        employeeList.innerHTML = "";
        member.bullets.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item;
          employeeList.appendChild(li);
        });
      }

      if (typeof employeeModal.showModal === "function") {
        employeeModal.showModal();
      } else {
        employeeModal.setAttribute("open", "");
      }
    });
  });
}

function closeEmployeeModal() {
  if (!employeeModal) return;

  if (employeeModal.open) {
    try {
      employeeModal.close();
    } catch {
      employeeModal.removeAttribute("open");
    }
  }
}

employeeCloseBtn?.addEventListener("click", closeEmployeeModal);

employeeModal?.addEventListener("click", (event) => {
  if (event.target === employeeModal) {
    closeEmployeeModal();
  }
});

employeeModal?.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeEmployeeModal();
});

// Portfolio modal
const portfolioButton = document.querySelector(".team__cta--btn");
const portfolioModal = document.getElementById("modalPortfolio");
const portfolioCloseBtn = portfolioModal?.querySelector(".modal__portfolio--close");

portfolioButton?.addEventListener("click", () => {
  if (!portfolioModal) return;

  if (typeof portfolioModal.showModal === "function") {
    portfolioModal.showModal();
  } else {
    portfolioModal.setAttribute("open", "");
  }
});

function closePortfolioModal() {
  if (!portfolioModal) return;

  if (portfolioModal.open) {
    try {
      portfolioModal.close();
    } catch {
      portfolioModal.removeAttribute("open");
    }
  }
}

portfolioCloseBtn?.addEventListener("click", closePortfolioModal);

portfolioModal?.addEventListener("click", (event) => {
  if (event.target === portfolioModal) {
    closePortfolioModal();
  }
});

portfolioModal?.addEventListener("cancel", () => closePortfolioModal());

// Header navigation (mobile menu)
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".site-header__toggle");
  const nav = document.querySelector(".site-header__nav");

  if (!header || !toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("site-header--open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("site-header--open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      header.classList.remove("site-header--open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
});

// Testimonials slider
(function initTestimonials() {
  const slides = Array.from(document.querySelectorAll(".testimonials__div"));
  if (!slides.length) return;

  let currentIndex = slides.findIndex((slide) => slide.classList.contains("testimonials__div--active"));
  if (currentIndex < 0) currentIndex = 0;

  function showSlide() {
    slides.forEach((slide, index) => {
      const isActive = index === currentIndex;
      slide.classList.toggle("testimonials__div--active", isActive);
      slide.setAttribute("aria-hidden", isActive ? "false" : "true");
    });
  }

  const nextBtn = document.querySelector(".testimonials__next");
  const prevBtn = document.querySelector(".testimonials__prev");

  nextBtn?.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide();
  });

  prevBtn?.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide();
  });

  showSlide();
})();
