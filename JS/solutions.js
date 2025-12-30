const solutions = [
  {
    name: "Branding & Visual Identity",
    description:
      "We build strong, memorable brands by aligning visual identity, language, and positioning across every touchpoint.",
    icon: "Assets/Icons/branding.svg",
    bullets: [
      "Creation or complete refresh of your brand identity.",
      "Definition of colours, typography, and key applications.",
      "Brand guidelines to keep communication consistent.",
    ],
  },
  {
    name: "Interface Design (UI)",
    description:
      "We design modern, intuitive interfaces focused on clarity, usability, and digital experiences that convert.",
    icon: "Assets/Icons/design.svg",
    bullets: [
      "Interfaces designed for web and mobile.",
      "Clear flows for intuitive navigation.",
      "User experience (UX) as a central priority.",
    ],
  },
  {
    name: "Web Development",
    description: "We develop fast, responsive, SEO-ready websites that grow alongside your business goals.",
    icon: "Assets/Icons/webdev.svg",
    bullets: [
      "Development focused on performance and stability.",
      "Responsive layouts for different devices and screens.",
      "Architecture prepared to scale with your business.",
    ],
  },
  {
    name: "Digital Strategy",
    description:
      "We blend data, research, and business vision to build digital strategies that connect your brand to the right audience.",
    icon: "Assets/Icons/estrategiadigital.svg",
    bullets: [
      "Analysis of your current digital presence.",
      "Clear objectives and KPIs definition.",
      "Integrated planning for digital actions and channels.",
    ],
  },
  {
    name: "Social Media Management",
    description:
      "We plan and manage your brand on social media, ensuring consistency, relevance, and long-term relationships.",
    icon: "Assets/Icons/socialmedia.svg",
    bullets: [
      "Content planning and editorial calendar.",
      "Visual assets aligned with your brand identity.",
      "Monitoring engagement and optimising performance.",
    ],
  },
];

const carouselContainer = document.querySelector(".solutions-carousel");

if (carouselContainer) {
  solutions.forEach((service) => {
    const card = document.createElement("div");
    card.classList.add("solutions-card");
    card.innerHTML = `
      <img src="${service.icon}" alt="${service.name}" class="solutions-card-icon">
      <h3>${service.name}</h3>
    `;
    carouselContainer.appendChild(card);
  });
}

const cards = document.querySelectorAll(".solutions-card");
const detailsTitle = document.querySelector(".solutions-details-title");
const detailsText = document.querySelector(".solutions-details-text");
const detailsIcon = document.querySelector(".solutions-details-icon");
const detailsList = document.querySelector(".solutions-details-list");
const detailsContainer = document.querySelector(".solutions-details");

let activeIndex = 2; // start with Web Development centred

function updateDetails() {
  if (!detailsContainer) return;

  // add animation state
  detailsContainer.classList.add("solutions-details-animation");

  setTimeout(() => {
    const activeService = solutions[activeIndex];

    if (detailsTitle) detailsTitle.textContent = activeService.name;
    if (detailsText) detailsText.textContent = activeService.description;

    if (detailsIcon) {
      detailsIcon.src = activeService.icon;
      detailsIcon.alt = activeService.name;
    }

    if (detailsList) {
      detailsList.innerHTML = "";
      if (activeService.bullets && activeService.bullets.length > 0) {
        activeService.bullets.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item;
          detailsList.appendChild(li);
        });
      }
    }

    // remove animation state after content swap
    detailsContainer.classList.remove("solutions-details-animation");
  }, 300);
}

function updateCarousel() {
  cards.forEach((card, index) => {
    card.classList.remove("active");

    const distance = Math.abs(index - activeIndex);

    if (index === activeIndex) {
      card.classList.add("active");
      card.style.transform = "scale(1)";
      card.style.opacity = "1";
    } else {
      const scale = 1 - distance * 0.05;
      const baseOpacity = 1 - distance * 0.2;
      const finalOpacity = Math.max(baseOpacity, 0.1);

      card.style.transform = `scale(${scale})`;
      card.style.opacity = String(finalOpacity);
    }
  });

  updateDetails();
}

cards.forEach((card, index) => {
  card.addEventListener("click", () => {
    activeIndex = index;
    updateCarousel();
  });
});

// initial render
updateCarousel();

// Solutions modal
const modalSolutions = document.getElementById("modal-solutions");
const modalSolutionsClose = modalSolutions?.querySelector(".modal-solutions-close");
const modalSolutionsTitle = modalSolutions?.querySelector(".modal-solutions-title");
const modalSolutionsText = modalSolutions?.querySelector(".modal-solutions-text");
const solutionsMoreButton = document.querySelector(".solutions-bt");

function openSolutionsModal() {
  if (!modalSolutions) return;

  const activeService = solutions[activeIndex];

  if (modalSolutionsTitle) modalSolutionsTitle.textContent = activeService.name;
  if (modalSolutionsText) {
    modalSolutionsText.textContent = `Soon you'll be able to explore our key ${activeService.name} projects here.`;
  }

  if (typeof modalSolutions.showModal === "function") {
    modalSolutions.showModal();
  } else {
    modalSolutions.setAttribute("open", "");
  }
}

function closeSolutionsModal() {
  if (!modalSolutions) return;

  if (modalSolutions.open) {
    try {
      modalSolutions.close();
    } catch (err) {
      modalSolutions.removeAttribute("open");
    }
  }
}

solutionsMoreButton?.addEventListener("click", openSolutionsModal);
modalSolutionsClose?.addEventListener("click", closeSolutionsModal);

modalSolutions?.addEventListener("click", (event) => {
  if (event.target === modalSolutions) {
    closeSolutionsModal();
  }
});

modalSolutions?.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeSolutionsModal();
});
