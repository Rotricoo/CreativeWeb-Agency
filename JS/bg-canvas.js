(function initBgCanvas() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBgCanvas, { once: true });
    return;
  }

  const canvas = document.getElementById("canvas");
  if (!canvas) {
    console.warn("bg-canvas.js: #canvas element not found. Effect disabled");
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.warn("bg-canvas.js: 2D context not available. Effect disabled");
    return;
  }

  const SETTINGS = {
    // performance / quality
    scale: 0.1,

    // trail
    trail_length: 26,

    // appearance
    radius_px: 14,
    blur_px: 18,
    inner_blur_ratio: 0.75,
    inner_radius_ratio: 0.6,
    fade_alpha: 0.06, // lower = stays longer

    // color
    color_fallback: "rgba(131, 81, 242, 1)",

    // motion (smooth / gravity)
    follow_base: 0.5,
    follow_decay: 0.018,

    // idle motion (alive when not moving)
    idle_wobble_px: 10,
    wobble_speed: 1.25,
    breathe_amount: 0.06,
    breathe_speed: 1.6,

    // shadow trick
    shadow_offset: 3000,
  };

  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  function parseCssColorToRgb(color) {
    if (!color) return null;

    const m = color.match(/rgba?\(([^)]+)\)/i);
    if (m) {
      const parts = m[1].split(",").map((v) => parseFloat(v.trim()));
      return { r: parts[0], g: parts[1], b: parts[2] };
    }

    const hex = color.trim();
    if (/^#([0-9a-f]{3})$/i.test(hex)) {
      const h = hex.slice(1);
      return {
        r: parseInt(h[0] + h[0], 16),
        g: parseInt(h[1] + h[1], 16),
        b: parseInt(h[2] + h[2], 16),
      };
    }
    if (/^#([0-9a-f]{6})$/i.test(hex)) {
      const h = hex.slice(1);
      return {
        r: parseInt(h.slice(0, 2), 16),
        g: parseInt(h.slice(2, 4), 16),
        b: parseInt(h.slice(4, 6), 16),
      };
    }

    return null;
  }

  function mixWithWhite(rgb, amount /* 0..1 */) {
    const a = clamp(amount, 0, 1);
    const r = Math.round(rgb.r + (255 - rgb.r) * a);
    const g = Math.round(rgb.g + (255 - rgb.g) * a);
    const b = Math.round(rgb.b + (255 - rgb.b) * a);
    return `rgb(${r}, ${g}, ${b})`;
  }

  function readColors() {
    const canvasStyles = getComputedStyle(canvas);
    const rootStyles = getComputedStyle(document.documentElement);

    const baseOnCanvas = canvasStyles.getPropertyValue("--gooey-color").trim();
    const baseOnRoot = rootStyles.getPropertyValue("--gooey-color").trim();
    const theme = rootStyles.getPropertyValue("--purple-medium").trim();

    const base = baseOnCanvas || baseOnRoot || theme || SETTINGS.color_fallback;

    const baseRgb = parseCssColorToRgb(base) || parseCssColorToRgb(SETTINGS.color_fallback);
    const highlight = baseRgb ? mixWithWhite(baseRgb, 0.45) : base;

    return { base, highlight };
  }

  // ---- Trail state ----
  let pointer = null;
  const targets = new Array(SETTINGS.trail_length).fill(null);
  const positions = new Array(SETTINGS.trail_length).fill(0).map(() => ({ x: 0, y: 0 }));

  // Render scale = quality (SETTINGS.scale) * screen pixel density (DPR)
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  let renderScale = SETTINGS.scale * DPR;

  let radius = SETTINGS.radius_px * renderScale;
  let blur = SETTINGS.blur_px * renderScale;
  let blobColors = readColors();

  function resizeCanvas() {
    renderScale = SETTINGS.scale * DPR;

    canvas.width = Math.floor(window.innerWidth * renderScale);
    canvas.height = Math.floor(window.innerHeight * renderScale);

    radius = SETTINGS.radius_px * renderScale;
    blur = SETTINGS.blur_px * renderScale;
    blobColors = readColors();
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  function setPointer(clientX, clientY) {
    pointer = {
      x: clientX * renderScale,
      y: clientY * renderScale,
    };

    // init trail on first move
    if (targets[0] === null) {
      for (let i = 0; i < targets.length; i++) {
        targets[i] = { x: pointer.x, y: pointer.y };
        positions[i].x = pointer.x;
        positions[i].y = pointer.y;
      }
    }
  }

  window.addEventListener("mousemove", (e) => setPointer(e.clientX, e.clientY));
  window.addEventListener(
    "touchmove",
    (e) => {
      if (!e.touches || e.touches.length === 0) return;
      setPointer(e.touches[0].clientX, e.touches[0].clientY);
    },
    { passive: true }
  );

  // ---- Slime balls (acumulam no final da PÁGINA e empurram) ----
  const slimeBalls = [];
  const SLIME_MARGIN_PX = 10;

  const SLIME = {
    BASE_R: 28,

    // performance cap (segurança)
    MAX: 220,

    // burst on click
    BURST_MIN: 2,
    BURST_MAX: 5,
    MICRO_R_MIN: 10,
    MICRO_R_MAX: 18,

    // motion
    GRAVITY: 0.085,
    AIR_DAMP: 0.996,
    FLOAT_AMP: 1.8,

    // walls/floor
    WALL_RESTITUTION: 0.55,
    FLOOR_RESTITUTION: 0.28,
    FLOOR_FRICTION: 0.94,

    // viscosity / adhesion
    COLLISION_MIX: 0.16,
    STICKINESS: 0.1,
    COHESION_PX: 10,

    // render
    MAX_STRETCH: 0.36,
    STRETCH_FACTOR: 0.035,
    BREATH: 0.05,
    BREATH_SPEED: 1.35,
  };

  const rand = (min, max) => min + Math.random() * (max - min);
  const randInt = (min, maxInclusive) => Math.floor(rand(min, maxInclusive + 1));
  const clamp01 = (n) => clamp(n, 0, 1);

  function rgbToCss(rgb) {
    return `rgb(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)})`;
  }

  function mixRgb(a, b, t) {
    const tt = clamp01(t);
    return {
      r: a.r + (b.r - a.r) * tt,
      g: a.g + (b.g - a.g) * tt,
      b: a.b + (b.b - a.b) * tt,
    };
  }

  const readSlimeColor = () => {
    const root = getComputedStyle(document.documentElement);
    return (
      root.getPropertyValue("--gooey-color").trim() ||
      root.getPropertyValue("--purple-medium").trim() ||
      SETTINGS.color_fallback
    );
  };

  function readSlimeBaseRgb() {
    const base = readSlimeColor();
    return parseCssColorToRgb(base) || parseCssColorToRgb(SETTINGS.color_fallback) || { r: 131, g: 81, b: 242 };
  }

  function varyFromBaseRgb(baseRgb) {
    const brighten = rand(-0.12, 0.18);
    const mixed =
      brighten >= 0
        ? mixRgb(baseRgb, { r: 255, g: 255, b: 255 }, brighten)
        : mixRgb(baseRgb, { r: 0, g: 0, b: 0 }, -brighten);

    // tiny per-channel jitter (bem sutil)
    const jitter = () => rand(-10, 10);
    return {
      r: clamp(mixed.r + jitter(), 0, 255),
      g: clamp(mixed.g + jitter(), 0, 255),
      b: clamp(mixed.b + jitter(), 0, 255),
    };
  }

  let slimeId = 0;

  function createBall(worldX, worldY, r, baseRgb, vx, vy) {
    const rgb = varyFromBaseRgb(baseRgb);
    const highlightRgb = mixRgb(rgb, { r: 255, g: 255, b: 255 }, 0.28);

    return {
      id: ++slimeId,
      x: worldX,
      y: worldY,
      vx,
      vy,
      r,
      m: r * r, // massa ~ área (simplificado)
      phase: rand(0, Math.PI * 2),
      floatPhase: rand(0, Math.PI * 2),
      color: rgbToCss(rgb),
      highlight: rgbToCss(highlightRgb),
      alpha: rand(0.85, 1.15),
      _cx: 0,
      _cy: 0,
    };
  }

  function mergeOnePairIfPossible() {
    const len = slimeBalls.length;
    if (len < 2) return false;

    let bestI = -1;
    let bestJ = -1;
    let bestScore = Infinity;

    const tries = Math.min(140, len * 2);
    for (let t = 0; t < tries; t++) {
      const i = Math.floor(Math.random() * len);
      let j = Math.floor(Math.random() * len);
      if (j === i) j = (j + 1) % len;

      const a = slimeBalls[i];
      const b = slimeBalls[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.hypot(dx, dy);
      const near = a.r + b.r + 6;

      if (dist > near) continue;

      // prefere juntar bolinhas menores e próximas
      const score = dist + (a.r + b.r) * 0.25;
      if (score < bestScore) {
        bestScore = score;
        bestI = i;
        bestJ = j;
      }
    }

    if (bestI < 0 || bestJ < 0 || bestI === bestJ) return false;

    if (bestJ < bestI) {
      const tmp = bestI;
      bestI = bestJ;
      bestJ = tmp;
    }

    const a = slimeBalls[bestI];
    const b = slimeBalls[bestJ];

    const m = a.m + b.m;
    const x = (a.x * a.m + b.x * b.m) / m;
    const y = (a.y * a.m + b.y * b.m) / m;
    const vx = (a.vx * a.m + b.vx * b.m) / m;
    const vy = (a.vy * a.m + b.vy * b.m) / m;

    const r = Math.sqrt(a.r * a.r + b.r * b.r);

    // recomputa cor por “mistura” via highlight aproximado (mantém vibe)
    const baseRgb = readSlimeBaseRgb();
    const newBall = createBall(x, y, r, baseRgb, vx, vy);
    newBall.alpha = clamp((a.alpha + b.alpha) * 0.5, 0.75, 1.2);
    newBall.phase = a.phase;

    slimeBalls[bestI] = newBall;
    slimeBalls.splice(bestJ, 1);
    return true;
  }

  function enforceSlimeBudget() {
    while (slimeBalls.length > SLIME.MAX) {
      if (!mergeOnePairIfPossible()) {
        // fallback (bem raro): remove a mais antiga
        slimeBalls.shift();
      }
    }
  }

  function addBallWorld(worldX, worldY, r, baseRgb, vx, vy) {
    slimeBalls.push(createBall(worldX, worldY, r, baseRgb, vx, vy));
    enforceSlimeBudget();
  }

  function spawnSlimeBurst(clientX, clientY) {
    const baseRgb = readSlimeBaseRgb();

    const worldX = clientX + window.scrollX;
    const worldY = clientY + window.scrollY;

    // main ball
    const mainR = SLIME.BASE_R + rand(-2, 10);
    addBallWorld(worldX, worldY, mainR, baseRgb, rand(-2, 2), -rand(2.5, 4.5));

    // micro burst
    const n = randInt(SLIME.BURST_MIN, SLIME.BURST_MAX);
    for (let i = 0; i < n; i++) {
      const a = rand(0, Math.PI * 2);
      const speed = rand(1.6, 5.2);
      const r = rand(SLIME.MICRO_R_MIN, SLIME.MICRO_R_MAX);
      const ox = Math.cos(a) * (mainR * 0.35);
      const oy = Math.sin(a) * (mainR * 0.35);

      addBallWorld(worldX + ox, worldY + oy, r, baseRgb, Math.cos(a) * speed, Math.sin(a) * speed - rand(1.2, 3.2));
    }
  }

  window.addEventListener("click", (e) => {
    if (e.target?.closest?.("button, a, input, textarea, select, label, dialog")) return;
    spawnSlimeBurst(e.clientX, e.clientY);
  });

  function updateSlimeBalls() {
    const doc = document.documentElement;

    // chão = final da página (scrollHeight)
    const floorY = Math.max(doc.scrollHeight, document.body?.scrollHeight || 0) - SLIME_MARGIN_PX;

    // paredes = largura da página
    const pageWidth = Math.max(doc.scrollWidth, window.innerWidth);

    // 1) integrate
    for (let i = 0; i < slimeBalls.length; i++) {
      const a = slimeBalls[i];

      a.floatPhase += 0.028;
      const floatY = Math.sin(a.floatPhase) * SLIME.FLOAT_AMP;

      a.vy += SLIME.GRAVITY;
      a.vx *= SLIME.AIR_DAMP;
      a.vy *= SLIME.AIR_DAMP;

      a.x += a.vx;
      a.y += a.vy + floatY;

      // chão
      if (a.y + a.r > floorY) {
        a.y = floorY - a.r;
        a.vy *= -SLIME.FLOOR_RESTITUTION;
        a.vx *= SLIME.FLOOR_FRICTION;
        if (Math.abs(a.vy) < 0.35) a.vy = 0;
      }

      // teto
      if (a.y - a.r < 0) {
        a.y = a.r;
        a.vy *= -0.5;
      }

      // paredes
      if (a.x - a.r < 0) {
        a.x = a.r;
        a.vx *= -SLIME.WALL_RESTITUTION;
      } else if (a.x + a.r > pageWidth) {
        a.x = pageWidth - a.r;
        a.vx *= -SLIME.WALL_RESTITUTION;
      }
    }

    // 2) spatial hash (para não virar pesado)
    const cellSize = 90;
    const grid = new Map();
    const keyOf = (cx, cy) => `${cx},${cy}`;

    for (let i = 0; i < slimeBalls.length; i++) {
      const a = slimeBalls[i];
      a._cx = Math.floor(a.x / cellSize);
      a._cy = Math.floor(a.y / cellSize);
      const k = keyOf(a._cx, a._cy);
      const bucket = grid.get(k);
      if (bucket) bucket.push(i);
      else grid.set(k, [i]);
    }

    // 3) collisions + viscosity + adhesion
    for (let i = 0; i < slimeBalls.length; i++) {
      const a = slimeBalls[i];

      for (let gx = -1; gx <= 1; gx++) {
        for (let gy = -1; gy <= 1; gy++) {
          const bucket = grid.get(keyOf(a._cx + gx, a._cy + gy));
          if (!bucket) continue;

          for (const j of bucket) {
            if (j <= i) continue;
            const b = slimeBalls[j];

            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.hypot(dx, dy);
            const minDist = a.r + b.r - 1;

            // adhesion zone (um “grudinho” sutil)
            const cohesionDist = minDist + SLIME.COHESION_PX;
            if (dist > 0.0001 && dist < cohesionDist) {
              const nx = dx / dist;
              const ny = dy / dist;

              if (dist < minDist) {
                const overlap = minDist - dist;

                const totalMass = a.m + b.m;
                const pushA = b.m / totalMass;
                const pushB = a.m / totalMass;

                a.x -= nx * overlap * pushA;
                a.y -= ny * overlap * pushA;
                b.x += nx * overlap * pushB;
                b.y += ny * overlap * pushB;

                const relSpeed = Math.hypot(a.vx - b.vx, a.vy - b.vy);
                const mix = clamp(SLIME.COLLISION_MIX + SLIME.STICKINESS * clamp(relSpeed / 6, 0, 1), 0.12, 0.45);

                const avx = a.vx;
                const avy = a.vy;
                a.vx = lerp(a.vx, b.vx, mix);
                a.vy = lerp(a.vy, b.vy, mix);
                b.vx = lerp(b.vx, avx, mix);
                b.vy = lerp(b.vy, avy, mix);

                const rvx = b.vx - a.vx;
                const rvy = b.vy - a.vy;
                const sepVel = rvx * nx + rvy * ny;
                if (sepVel < 0) {
                  const impulse = -sepVel * 0.25;
                  a.vx -= nx * impulse * pushA;
                  a.vy -= ny * impulse * pushA;
                  b.vx += nx * impulse * pushB;
                  b.vy += ny * impulse * pushB;
                }
              } else {
                // adhesion (sem encostar): puxa bem de leve
                const t = (cohesionDist - dist) / SLIME.COHESION_PX;
                const pull = t * t * SLIME.STICKINESS * 0.04;

                a.vx += nx * pull;
                a.vy += ny * pull;
                b.vx -= nx * pull;
                b.vy -= ny * pull;
              }
            }
          }
        }
      }
    }
  }

  function drawSlimeBalls(time) {
    if (slimeBalls.length === 0) return;

    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    ctx.save();
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.filter = "blur(1.5px) contrast(1.2) saturate(1.1)";

    const blurCanvasUnits = 24 * renderScale;
    const baseAlpha = 0.22;

    for (const ball of slimeBalls) {
      const sx = (ball.x - scrollX) * renderScale;
      const sy = (ball.y - scrollY) * renderScale;
      const rr = ball.r * renderScale;

      if (sy + rr < 0 || sy - rr > canvas.height) continue;
      if (sx + rr < 0 || sx - rr > canvas.width) continue;

      const speed = Math.hypot(ball.vx, ball.vy);
      const stretch = clamp(speed * SLIME.STRETCH_FACTOR, 0, SLIME.MAX_STRETCH);
      const breathe = 1 + SLIME.BREATH * Math.sin(time * SLIME.BREATH_SPEED + ball.phase);

      const angle = speed > 0.001 ? Math.atan2(ball.vy, ball.vx) : 0;
      const scaleX = breathe * (1 + stretch);
      const scaleY = breathe * (1 / (1 + stretch * 0.9));

      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(angle);
      ctx.scale(scaleX, scaleY);

      // base
      ctx.beginPath();
      ctx.arc(0, 0, rr, 0, Math.PI * 2);
      ctx.fillStyle = ball.color;
      ctx.shadowColor = ball.color;
      ctx.shadowBlur = blurCanvasUnits;
      ctx.globalAlpha = baseAlpha * ball.alpha;
      ctx.fill();

      // highlight (sutil)
      ctx.beginPath();
      ctx.arc(-rr * 0.15, -rr * 0.15, rr * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = ball.highlight;
      ctx.shadowColor = ball.highlight;
      ctx.shadowBlur = blurCanvasUnits * 0.65;
      ctx.globalAlpha = baseAlpha * 0.55 * ball.alpha;
      ctx.fill();

      ctx.restore();
    }

    ctx.restore();
  }

  // ---- Main loop ----
  function drawFrame() {
    if (prefersReducedMotion) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    if (!blobColors) blobColors = readColors();

    // push latest pointer into trail
    if (pointer) {
      for (let i = targets.length - 1; i > 0; i--) {
        targets[i] = targets[i - 1];
      }
      targets[0] = { x: pointer.x, y: pointer.y };
    }

    // fade (linger)
    ctx.fillStyle = `rgba(0,0,0, ${SETTINGS.fade_alpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const time = performance.now() * 0.001;
    const wobble = SETTINGS.idle_wobble_px * renderScale;

    // shadow offset trick (para o trail)
    ctx.shadowOffsetX = SETTINGS.shadow_offset;
    ctx.shadowOffsetY = SETTINGS.shadow_offset;

    for (let i = 0; i < targets.length; i++) {
      const target = targets[i];
      if (!target) continue;

      const t = clamp(SETTINGS.follow_base - SETTINGS.follow_decay * i, 0.2, 0.85);

      positions[i].x = lerp(positions[i].x, target.x, t);
      positions[i].y = lerp(positions[i].y, target.y, t);

      const ox = Math.sin(time * SETTINGS.wobble_speed + i * 0.9) * wobble;
      const oy = Math.cos(time * SETTINGS.wobble_speed + i * 1.15) * wobble;

      const breathe = 1 + SETTINGS.breathe_amount * Math.sin(time * SETTINGS.breathe_speed + i);
      const r = radius * breathe;

      // Pass 1: outer (darker base)
      ctx.beginPath();
      ctx.arc(
        positions[i].x + ox - SETTINGS.shadow_offset,
        positions[i].y + oy - SETTINGS.shadow_offset,
        r,
        0,
        Math.PI * 2
      );
      ctx.shadowColor = blobColors.base;
      ctx.shadowBlur = blur;
      ctx.fillStyle = blobColors.base;
      ctx.fill();

      // Pass 2: inner (brighter highlight)
      ctx.beginPath();
      ctx.arc(
        positions[i].x + ox - SETTINGS.shadow_offset,
        positions[i].y + oy - SETTINGS.shadow_offset,
        r * SETTINGS.inner_radius_ratio,
        0,
        Math.PI * 2
      );
      ctx.shadowColor = blobColors.highlight;
      ctx.shadowBlur = blur * SETTINGS.inner_blur_ratio;
      ctx.fillStyle = blobColors.highlight;
      ctx.fill();
    }

    // Slimes
    updateSlimeBalls();
    drawSlimeBalls(time);

    requestAnimationFrame(drawFrame);
  }

  requestAnimationFrame(drawFrame);
})();
