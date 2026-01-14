(function () {
  "use strict";

  // Header mobile toggle + nav close on link click
  document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".site-header");
    const toggle = document.querySelector(".site-header__toggle");
    const nav = document.querySelector(".site-header__nav");

    if (header && toggle && nav) {
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
    }
  });
})();
