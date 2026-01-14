// JS/solutions-section.js — carousel de soluções + modal de soluções (mais robusto)
(function () {
  "use strict";

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

  document.addEventListener("DOMContentLoaded", () => {
    const carouselContainer = document.querySelector(".solutions__carousel");
    if (carouselContainer) {
      solutions.forEach((service) => {
        const card = document.createElement("div");
        card.classList.add("solutions__card");
        card.innerHTML = `
          <img src="${service.icon}" alt="${service.name}" class="solutions__card-icon">
          <h3>${service.name}</h3>
        `;
        carouselContainer.appendChild(card);
      });
    }

    // select cards from the container (ensures we get the dynamically created nodes)
    const solutionCards = carouselContainer
      ? carouselContainer.querySelectorAll(".solutions__card")
      : document.querySelectorAll(".solutions__card");

    if (!solutionCards || solutionCards.length === 0) {
      console.warn("solutions-section: no .solutions__card elements found — carousel disabled.");
      return;
    }

    const detailsTitle = document.querySelector(".solutions__details--title");
    const detailsText = document.querySelector(".solutions__details--text");
    const detailsIcon = document.querySelector(".solutions__details--icon");
    const detailsList = document.querySelector(".solutions__details--list");
    const detailsContainer = document.querySelector(".solutions__details");
    let activeIndex = Math.min(2, solutions.length - 1);

    function updateDetails() {
      if (!detailsContainer) return;
      detailsContainer.classList.add("solutions__details--animation");
      setTimeout(() => {
        const activeService = solutions[activeIndex] || solutions[0];
        if (detailsTitle) detailsTitle.textContent = activeService.name;
        if (detailsText) detailsText.textContent = activeService.description;
        if (detailsIcon) {
          detailsIcon.src = activeService.icon;
          detailsIcon.alt = activeService.name;
        }
        if (detailsList) {
          detailsList.innerHTML = "";
          if (activeService.bullets && activeService.bullets.length) {
            activeService.bullets.forEach((b) => {
              const li = document.createElement("li");
              li.textContent = b;
              detailsList.appendChild(li);
            });
          }
        }
        detailsContainer.classList.remove("solutions__details--animation");
      }, 300);
    }

    function updateCarousel() {
      try {
        solutionCards.forEach((card, index) => {
          card.classList.remove("solutions__card--active");
          const distance = Math.abs(index - activeIndex);
          if (index === activeIndex) {
            card.classList.add("solutions__card--active");
            card.style.transform = "scale(1)";
            card.style.opacity = "1";
            card.style.filter = "none";
          } else {
            const scale = 1 - distance * 0.05;
            const dim = Math.max(1 - distance * 0.12, 0.72);
            card.style.transform = `scale(${scale})`;
            card.style.opacity = "1";
            card.style.filter = `brightness(${dim})`;
          }
        });
        updateDetails();
      } catch (err) {
        console.error("updateCarousel error:", err);
      }
    }

    solutionCards.forEach((card, index) => {
      card.addEventListener("click", () => {
        activeIndex = index;
        updateCarousel();
      });
    });

    // initial render
    updateCarousel();

    // Solutions modal (supports many + buttons)
    let lastFocused = null;
    const modalSolutions = document.getElementById("modalSolutions");
    const modalSolutionsClose = modalSolutions?.querySelector(".modal__solutions--close");
    const modalSolutionsTitle = modalSolutions?.querySelector(".modal__solutions--title");
    const modalSolutionsText = modalSolutions?.querySelector(".modal__solutions--text");
    const solutionsMoreButtons = document.querySelectorAll(".solutions__bt");

    function safeFocus(el) {
      try {
        if (el && typeof el.focus === "function") el.focus();
      } catch {}
    }

    if (solutionsMoreButtons && solutionsMoreButtons.length) {
      solutionsMoreButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          lastFocused = btn;
          if (!modalSolutions) return;

          // update modal content using current activeIndex
          const activeService = solutions[activeIndex] || solutions[0];
          if (modalSolutionsTitle) modalSolutionsTitle.textContent = activeService.name;
          if (modalSolutionsText)
            modalSolutionsText.textContent = `Soon you'll be able to explore our ${activeService.name} projects here.`;

          if (typeof modalSolutions.showModal === "function") modalSolutions.showModal();
          else modalSolutions.setAttribute("open", "");

          setTimeout(() => safeFocus(modalSolutionsClose || modalSolutions), 0);
        });
      });
    }

    function closeSolutionsModal() {
      if (!modalSolutions) return;
      try {
        if (modalSolutions.open) modalSolutions.close();
      } catch {
        modalSolutions.removeAttribute("open");
      }
      setTimeout(() => {
        safeFocus(lastFocused);
        lastFocused = null;
      }, 0);
    }

    modalSolutionsClose?.addEventListener("click", closeSolutionsModal);
    modalSolutions?.addEventListener("click", (e) => {
      if (e.target === modalSolutions) closeSolutionsModal();
    });
    modalSolutions?.addEventListener("cancel", (e) => {
      e.preventDefault();
      closeSolutionsModal();
    });
  });
})();
