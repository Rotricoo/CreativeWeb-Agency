/**
 * Navigation Sidebar Controller
 * Handles active link highlighting, animated dot indicator, smooth scrolling,
 * and IntersectionObserver-based section detection
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    // Get main elements
    const container = document.querySelector(".snap-container");
    const nav = document.querySelector(".nav-sidebar");
    if (!container || !nav) return;

    // Get all navigation links and snap sections
    const links = Array.from(nav.querySelectorAll(".nav-sidebar__link"));
    const sections = Array.from(document.querySelectorAll(".snap-section"));
    if (!links.length || !sections.length) return;

    // Create map to quickly find link data by section ID
    const linkById = new Map();
    links.forEach((link, index) => {
      const href = link.getAttribute("href") || "";
      const id = href.startsWith("#") ? href.slice(1) : null;
      if (!id) return;
      linkById.set(id, { link, index });

      // Handle smooth scroll navigation on link click
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.getElementById(id);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    /**
     * Set active state for navigation link and update animated dot position
     * @param {string} id - Section ID to activate
     */
    function setActive(id) {
      // Remove active state from all links
      links.forEach((l) => l.removeAttribute("aria-current"));
      const entry = linkById.get(id);
      if (!entry) return;

      // Set aria-current for accessibility
      entry.link.setAttribute("aria-current", "page");

      // Calculate vertical offset for animated dot indicator
      const navRect = nav.getBoundingClientRect();
      const linkRect = entry.link.getBoundingClientRect();
      const offset = linkRect.top - navRect.top + linkRect.height / 2 - navRect.height / 2;

      // Update CSS custom property for ::before pseudo-element animation
      nav.style.setProperty("--active-offset", `${offset}px`);
    }

    // Observe sections to detect which is most visible in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        // Find section with highest intersection ratio
        let best = null;
        let bestRatio = 0;
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
            best = entry;
            bestRatio = entry.intersectionRatio;
          }
        }
        if (best) setActive(best.target.id);
      },
      {
        root: container, // Use snap-container as scroll context
        threshold: [0.5, 0.75, 1], // Trigger at 50%, 75%, and 100% visibility
      }
    );

    // Start observing all sections
    sections.forEach((sec) => observer.observe(sec));

    // Handle initial page load with URL hash
    const initialId = (location.hash || "").slice(1);
    if (initialId && linkById.has(initialId)) {
      setActive(initialId);
      const target = document.getElementById(initialId);
      if (target) {
        // Delay scroll to ensure DOM is fully rendered
        setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    } else {
      // No hash: activate first section by default
      setActive(sections[0].id);
    }
  });
})();
