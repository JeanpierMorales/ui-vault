/* =========================================
   PORCHLIGHT — lamp-lit feature tiles
   1. Lamp: one pointermove on the grid writes --x / --y
      (relative to each tile) in rAF, so the light warms the
      hovered tile and grazes its neighbours' edges.
   2. Live mini-visuals: latency dots drift, the incident
      timer counts, p95 bars scroll. They only run while the
      grid is on screen and the tab is visible, and never
      under prefers-reduced-motion (static snapshot instead).
========================================= */

const grid = document.querySelector(".pl__grid");
const tiles = [...grid.querySelectorAll(".tile")];

const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

/* ---------- 1. Lamp ---------- */

let frame = 0;
let lastEvent = null;

function paint() {
  frame = 0;
  if (!lastEvent) return;
  const { clientX, clientY } = lastEvent;

  tiles.forEach((tile) => {
    const r = tile.getBoundingClientRect();
    tile.style.setProperty("--x", `${clientX - r.left}px`);
    tile.style.setProperty("--y", `${clientY - r.top}px`);
  });
}

grid.addEventListener("pointermove", (event) => {
  if (reduced.matches || !canHover.matches || event.pointerType === "touch") return;
  lastEvent = event;
  grid.classList.add("is-lit");
  if (!frame) frame = requestAnimationFrame(paint);
});

grid.addEventListener("pointerleave", () => {
  grid.classList.remove("is-lit");
});

/* Keyboard: park the lamp over the focused tile's link */
tiles.forEach((tile) => {
  tile.addEventListener("focusin", () => {
    if (reduced.matches) return;
    tile.style.setProperty("--x", "18%");
    tile.style.setProperty("--y", "88%");
  });
});

/* ---------- 2. Live mini-visuals ---------- */

// Latency ruler
const dots = [...grid.querySelectorAll(".ruler__dot")].map((el) => ({
  el,
  base: Number(el.dataset.base),
  label: el.querySelector("[data-ms]"),
}));

// Incident timer + sweep clock
const elapsedEl = grid.querySelector("[data-elapsed]");
const sweepEl = document.querySelector("[data-sweep]");
let elapsed = 3 * 60 + 12;
let sweep = 12;

// p95 bars (deterministic walk so every load looks the same)
const barsEl = grid.querySelector(".p95__bars");
const p95El = grid.querySelector("[data-p95]");
const BAR_COUNT = 24;
let seed = 11;
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const nextSample = () => Math.round(150 + rand() * 70 + (rand() > 0.9 ? 60 : 0));

const samples = Array.from({ length: BAR_COUNT }, nextSample);
const bars = samples.map(() => barsEl.appendChild(document.createElement("span")));

function renderBars() {
  bars.forEach((bar, i) => {
    bar.style.setProperty("--h", Math.min(1, Math.max(0.12, (samples[i] - 120) / 170)).toFixed(3));
    bar.classList.toggle("is-hot", samples[i] > 240);
  });
  // p95 of the visible window: the value 95% of samples stay under
  const sorted = [...samples].sort((a, b) => a - b);
  p95El.textContent = String(sorted[Math.ceil(sorted.length * 0.95) - 1]);
}

function renderClock() {
  elapsedEl.textContent = `${Math.floor(elapsed / 60)}m ${String(elapsed % 60).padStart(2, "0")}s`;
  sweepEl.textContent = `${sweep}s`;
}

function jitterDots() {
  dots.forEach((d) => {
    const ms = Math.max(20, Math.round(d.base + (rand() - 0.5) * d.base * 0.18));
    d.el.style.setProperty("--ms", ms);
    if (d.label) d.label.textContent = String(ms);
  });
}

renderBars();
renderClock();

let secondTimer = 0;
let sampleTimer = 0;
let onScreen = false;

function start() {
  if (secondTimer || reduced.matches || !onScreen || document.hidden) return;

  secondTimer = setInterval(() => {
    elapsed += 1;
    sweep = sweep >= 30 ? 1 : sweep + 1;
    renderClock();
  }, 1000);

  sampleTimer = setInterval(() => {
    samples.shift();
    samples.push(nextSample());
    renderBars();
    jitterDots();
  }, 2000);
}

function stop() {
  clearInterval(secondTimer);
  clearInterval(sampleTimer);
  secondTimer = sampleTimer = 0;
}

new IntersectionObserver(([entry]) => {
  onScreen = entry.isIntersecting;
  onScreen ? start() : stop();
}).observe(grid);

document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));

reduced.addEventListener("change", () => {
  if (reduced.matches) {
    stop();
    grid.classList.remove("is-lit");
    tiles.forEach((t) => {
      t.style.removeProperty("--x");
      t.style.removeProperty("--y");
    });
  } else {
    start();
  }
});
