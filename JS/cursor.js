(() => {
  const cursor = document.querySelector(".custom-cursor");
  if (!cursor) return;

  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  if (isTouch) {
    cursor.style.display = "none";
    return;
  }

  const SMOOTH = 0.22;
  const MAGNET_RADIUS = 20;
  const MAGNET_STRENGTH = 0.45;

  const INTERACTIVE_SELECTOR =
    'a, button, [role="button"], input, textarea, select, label, .btn, .solutions__card, .solutions__bt, .team__btn, .site-header__toggle, .modal__employee--close, .modal__portfolio--close, .modal__solutions--close';

  function parseCssColorToRgb(color) {
    const m = color?.match(/rgba?\(([^)]+)\)/i);
    if (m) {
      const p = m[1].split(",").map((v) => parseFloat(v.trim()));
      return { r: p[0], g: p[1], b: p[2] };
    }
    const hex = color?.trim();
    if (/^#([0-9a-f]{3})$/i.test(hex)) {
      const h = hex.slice(1);
      return { r: parseInt(h[0] + h[0], 16), g: parseInt(h[1] + h[1], 16), b: parseInt(h[2] + h[2], 16) };
    }
    if (/^#([0-9a-f]{6})$/i.test(hex)) {
      const h = hex.slice(1);
      return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
    }
    return null;
  }

  const mixWithWhite = (rgb, amount) => {
    const a = Math.max(0, Math.min(1, amount));
    const r = Math.round(rgb.r + (255 - rgb.r) * a);
    const g = Math.round(rgb.g + (255 - rgb.g) * a);
    const b = Math.round(rgb.b + (255 - rgb.b) * a);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const syncCursorColor = () => {
    const root = getComputedStyle(document.documentElement);
    const base =
      root.getPropertyValue("--gooey-color").trim() ||
      root.getPropertyValue("--purple-medium").trim() ||
      "rgb(131, 81, 242)";
    // Use a cor base sem clarear tanto:
    cursor.style.backgroundColor = base;
    cursor.style.boxShadow = `0 0 28px ${base}`;
  };

  syncCursorColor();

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let targetX = mouseX;
  let targetY = mouseY;
  let currentX = mouseX;
  let currentY = mouseY;

  cursor.style.opacity = "0";
  let hasMoved = false;

  let interactiveEls = [];
  let refreshScheduled = false;
  const refreshInteractiveEls = () => {
    interactiveEls = Array.from(document.querySelectorAll(INTERACTIVE_SELECTOR));
  };
  const scheduleRefresh = () => {
    if (refreshScheduled) return;
    refreshScheduled = true;
    requestAnimationFrame(() => {
      refreshInteractiveEls();
      refreshScheduled = false;
    });
  };

  refreshInteractiveEls();

  const observer = new MutationObserver(scheduleRefresh);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "style"],
  });

  window.addEventListener("resize", scheduleRefresh);

  const distanceToRect = (x, y, rect) => {
    const dx = Math.max(rect.left - x, 0, x - rect.right);
    const dy = Math.max(rect.top - y, 0, y - rect.bottom);
    return Math.hypot(dx, dy);
  };

  const findNearestInteractive = (x, y) => {
    let best = null;
    let bestDist = Infinity;
    for (const el of interactiveEls) {
      if (!el?.getBoundingClientRect) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      const d = distanceToRect(x, y, rect);
      if (d < bestDist) {
        bestDist = d;
        best = el;
      }
    }
    return bestDist <= MAGNET_RADIUS ? best : null;
  };

  let activeEl = null;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    targetX = mouseX;
    targetY = mouseY;

    if (!hasMoved) {
      hasMoved = true;
      cursor.style.opacity = "1";
      currentX = mouseX;
      currentY = mouseY;
    }

    activeEl = findNearestInteractive(mouseX, mouseY);
    cursor.classList.toggle("custom-cursor--hover", !!activeEl);
  });

  window.addEventListener("pointerenter", () => {
    if (hasMoved) cursor.style.opacity = "1";
  });

  window.addEventListener("pointerleave", () => {
    cursor.style.opacity = "0";
    activeEl = null;
    cursor.classList.remove("custom-cursor--hover", "custom-cursor--down");
  });

  window.addEventListener("mousedown", () => cursor.classList.add("custom-cursor--down"));
  window.addEventListener("mouseup", () => cursor.classList.remove("custom-cursor--down"));

  const applyMagnet = () => {
    if (!activeEl) return;
    const rect = activeEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = cx - mouseX;
    const dy = cy - mouseY;
    const d = Math.hypot(dx, dy);
    if (d > MAGNET_RADIUS) return;
    const t = 1 - d / MAGNET_RADIUS;
    const pull = MAGNET_STRENGTH * t;
    targetX = mouseX + dx * pull;
    targetY = mouseY + dy * pull;
  };

  const animate = () => {
    applyMagnet();
    currentX += (targetX - currentX) * SMOOTH;
    currentY += (targetY - currentY) * SMOOTH;
    cursor.style.left = `${currentX}px`;
    cursor.style.top = `${currentY}px`;
    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
})();
