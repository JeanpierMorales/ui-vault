(() => {
  /* ---------- Mobile menu ---------- */
  const menuBtn = document.querySelector(".menu-btn");
  const links = document.getElementById("navLinks");

  const setMenu = (open) => {
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    links.classList.toggle("is-open", open);
  };

  menuBtn.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && links.classList.contains("is-open")) {
      setMenu(false);
      menuBtn.focus();
    }
  });
  links.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });

  /* ---------- Hush: a waveform that goes quiet where you are ----------
     The line is "room noise". Around the pointer it is damped the way a
     felt panel damps reflections. With no pointer, the quiet zone rests
     at 72% of the width. Easing is exponential and frame-rate independent,
     so every new pointer position simply retargets it (interruptible). */

  const canvas = document.getElementById("hushWave");
  const ctx = canvas.getContext("2d");
  const band = canvas.closest(".hush");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  const INK = "#C9D8A6";          // pistachio line
  const PANEL = "rgba(201, 216, 166, 0.08)";
  const BASE = "rgba(244, 241, 234, 0.18)";
  const REST = 0.72;

  let w = 0, h = 0, dpr = 1;
  let qx = -0.2, qTarget = REST;  // quiet zone centre (0..1), starts off-canvas: the load sweep
  let depth = 1, depthTarget = 1; // how strongly the zone damps (0..1)
  let t = 0, last = 0, raf = 0, visible = true;

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  };

  // Deterministic "noise": a few incommensurate sines plus a slow swell.
  const signal = (x, time) =>
    Math.sin(x * 0.021 + time * 1.9) * 0.42 +
    Math.sin(x * 0.053 - time * 3.1) * 0.27 +
    Math.sin(x * 0.117 + time * 5.3) * 0.19 +
    Math.sin(x * 0.29 - time * 8.7) * 0.12;

  const draw = () => {
    if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const mid = h / 2;
    const amp = h * 0.42;
    const cx = qx * w;
    const spread = Math.max(90, w * 0.11);

    // the "panel": a faint felt-coloured field under the quiet zone
    const pw = spread * 1.5;
    ctx.fillStyle = PANEL;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(cx - pw / 2, 4, pw, h - 8, 10) : ctx.rect(cx - pw / 2, 4, pw, h - 8);
    ctx.fill();

    // baseline
    ctx.strokeStyle = BASE;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, mid);
    ctx.lineTo(w, mid);
    ctx.stroke();

    // the wave
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.75;
    ctx.lineJoin = "round";
    ctx.beginPath();
    for (let x = 0; x <= w; x += 2) {
      const d = (x - cx) / spread;
      const damp = 1 - 0.96 * depth * Math.exp(-d * d);
      const edge = Math.min(1, x / 24, (w - x) / 24); // soften the ends
      const y = mid + signal(x, t) * amp * damp * edge;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  const tick = (now) => {
    const dt = Math.min(0.05, (now - (last || now)) / 1000);
    last = now;
    t += dt;
    const k = 1 - Math.exp(-dt * 7);     // ease-out toward target
    qx += (qTarget - qx) * k;
    depth += (depthTarget - depth) * k;
    draw();
    raf = visible && !reduce.matches ? requestAnimationFrame(tick) : 0;
  };

  const start = () => {
    if (reduce.matches) { qx = qTarget; depth = depthTarget; draw(); return; }
    if (!raf && visible) { last = 0; raf = requestAnimationFrame(tick); }
  };

  // Pointer anywhere on the page steers the zone; closeness to the band deepens it.
  const onMove = (e) => {
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    qTarget = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    const dy = Math.max(0, Math.abs(e.clientY - (r.top + r.height / 2)) - r.height / 2);
    depthTarget = Math.max(0.35, 1 - dy / 700);
    start();
  };

  const onLeave = () => { qTarget = REST; depthTarget = 1; start(); };

  window.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerout", (e) => { if (!e.relatedTarget) onLeave(); });
  band.addEventListener("pointerup", (e) => { if (e.pointerType === "touch") onLeave(); });
  band.addEventListener("pointercancel", onLeave);

  new ResizeObserver(resize).observe(canvas);

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting && !document.hidden;
    if (visible) start();
  }).observe(canvas);

  document.addEventListener("visibilitychange", () => {
    visible = !document.hidden;
    if (visible) start();
  });

  reduce.addEventListener("change", () => { cancelAnimationFrame(raf); raf = 0; start(); });

  resize();
  start();
})();
