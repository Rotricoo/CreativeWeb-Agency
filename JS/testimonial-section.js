(function () {
  "use strict";

  const track = document.querySelector(".testimonials__track");
  if (!track) return;

  const slides = Array.from(track.querySelectorAll(".testimonials__div"));
  if (!slides.length) return;

  let idx = 0;
  let autoplay = null;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const slideCount = slides.length;
  const AUTOPLAY_MS = 3000;

  function updateUI() {
    const active = slides[idx];
    const trackWidth = track.clientWidth;
    const slideRect = active.getBoundingClientRect();
    // offsetLeft is relative to track
    const offsetLeft = active.offsetLeft;
    // center the active slide in the visible track
    let offset = offsetLeft - (trackWidth - slideRect.width) / 2;
    // clamp so we don't translate past content bounds
    const maxTranslate = track.scrollWidth - trackWidth;
    offset = Math.max(0, Math.min(offset, maxTranslate));
    track.style.transform = `translateX(-${offset}px)`;
    slides.forEach((s, i) => {
      s.setAttribute("aria-hidden", i !== idx ? "true" : "false");
      s.classList.toggle("is-active", i === idx);
    });
  }

  function go(n) {
    idx = (n + slideCount) % slideCount;
    updateUI();
  }

  function nextSlide() {
    go(idx + 1);
  }

  function start() {
    if (autoplay || prefersReduced) return;
    autoplay = setInterval(nextSlide, AUTOPLAY_MS);
  }

  function stop() {
    if (!autoplay) return;
    clearInterval(autoplay);
    autoplay = null;
  }

  track.addEventListener("mouseenter", stop);
  track.addEventListener("mouseleave", start);
  track.addEventListener("focusin", stop);
  track.addEventListener("focusout", start);

  window.addEventListener("resize", () => {
    // recalc centering on resize
    updateUI();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") nextSlide();
    if (e.key === "ArrowLeft") go(idx - 1);
  });

  try {
    updateUI();
    start();
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });
    window.addEventListener("beforeunload", stop);
  } catch (err) {
    console.error("testimonial carousel error:", err);
    stop();
  }
})();
