document.documentElement.classList.add("js");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Durations come from the shared vault tokens (../_shared/tokens.css) */
const rootStyle = getComputedStyle(document.documentElement);
const ms = (name, fallback) => parseFloat(rootStyle.getPropertyValue(name)) || fallback;
const D_BASE = ms("--d-base", 250);
const D_SLOW = ms("--d-slow", 400);
const REVEAL = ms("--reveal", 900); // bespoke first-load count-up (the documented exception)

/* =========================================
   SAMPLE DATA
   delta is % change vs the previous period.
   "invert" marks metrics where lower is better
   (churn), so a drop is shown as good/green.
========================================= */

const METRICS = {
  revenue: {
    format: (v) => "$" + Math.round(v).toLocaleString("en-US"),
    periods: {
      "7d":  { value: 48210,  delta: 8.2 },
      "30d": { value: 182940, delta: 12.4 },
      "90d": { value: 521380, delta: 18.9 },
    },
  },
  users: {
    format: (v) => Math.round(v).toLocaleString("en-US"),
    periods: {
      "7d":  { value: 12480, delta: 3.1 },
      "30d": { value: 28915, delta: 6.7 },
      "90d": { value: 61204, delta: -2.3 },
    },
  },
  conversion: {
    format: (v) => v.toFixed(2) + "%",
    periods: {
      "7d":  { value: 3.84, delta: -1.2 },
      "30d": { value: 4.12, delta: 5.6 },
      "90d": { value: 3.97, delta: 2.1 },
    },
  },
  churn: {
    invert: true,
    format: (v) => v.toFixed(1) + "%",
    periods: {
      "7d":  { value: 1.9, delta: -8.4 },
      "30d": { value: 2.3, delta: 4.5 },
      "90d": { value: 2.1, delta: -11.2 },
    },
  },
};

const PERIOD_LABEL = { "7d": "7 days", "30d": "30 days", "90d": "90 days" };
const POINTS = 24; // every series has the same length so lines can morph

/* Deterministic pseudo-random walk whose overall trend follows the delta */
function makeSeries(seed, delta) {
  let s = seed;
  const rand = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const out = [];
  let v = 50;

  for (let i = 0; i < POINTS; i++) {
    v += delta * 0.35 + (rand() - 0.5) * 9;
    out.push(v);
  }
  return out;
}

Object.entries(METRICS).forEach(([key, metric], m) => {
  Object.entries(metric.periods).forEach(([period, data], p) => {
    data.series = makeSeries(7 + m * 31 + p * 101, data.delta);
  });
});

/* =========================================
   HELPERS
========================================= */

// Close JS match for cubic-bezier(.22,1,.36,1) used in the CSS
const ease = (t) => 1 - Math.pow(1 - t, 4.5);

function tween(duration, onFrame) {
  if (reducedMotion) {
    onFrame(1);
    return () => {};
  }

  const start = performance.now();
  let raf;

  const step = (now) => {
    const t = Math.min(1, (now - start) / duration);
    onFrame(ease(t));
    if (t < 1) raf = requestAnimationFrame(step);
  };

  raf = requestAnimationFrame(step);
  return () => cancelAnimationFrame(raf); // lets a new swap interrupt the old one
}

// Series -> SVG coordinates (viewBox 0 0 200 56; x stops at 194 so the end dot isn't clipped)
function toPoints(series) {
  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = max - min || 1;

  return series.map((v, i) => [
    (i / (series.length - 1)) * 193 + 1,
    50 - ((v - min) / range) * 40,
  ]);
}

// Smooth line through points (Catmull-Rom converted to cubic Béziers)
function linePath(pts) {
  let d = `M${pts[0][0]},${pts[0][1]}`;

  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;

    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;

    d += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
  }
  return d;
}

const ARROW_UP = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M6 10V2M2.5 5.5 6 2l3.5 3.5"/></svg>';
const ARROW_DOWN = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M6 2v8M2.5 6.5 6 10l3.5-3.5"/></svg>';

/* =========================================
   CARD CONTROLLER
========================================= */

const cards = [...document.querySelectorAll(".kpi")].map((el) => {
  const metric = METRICS[el.dataset.metric];
  const valueEl = el.querySelector("[data-value]");

  // Animated digits are hidden from AT; a sr-only copy holds the final value
  valueEl.innerHTML = '<span aria-hidden="true" class="kpi__num"></span><span class="sr-only"></span>';

  return {
    el,
    metric,
    num: valueEl.querySelector(".kpi__num"),
    srValue: valueEl.querySelector(".sr-only"),
    chip: el.querySelector("[data-chip]"),
    compare: el.querySelector("[data-compare]"),
    line: el.querySelector(".spark__line"),
    area: el.querySelector(".spark__area"),
    dot: el.querySelector(".spark__dot"),
    shown: 0,      // number currently on screen
    pts: null,     // sparkline points currently on screen
    visible: false,
    stopNum: () => {},
    stopLine: () => {},
  };
});

function drawLine(card, pts) {
  const d = linePath(pts);
  const last = pts[pts.length - 1];

  card.line.setAttribute("d", d);
  // Area continues flat to the card edge, then closes along the bottom
  card.area.setAttribute("d", `${d} L200,${last[1]} L200,56 L0,56 L0,${pts[0][1]} Z`);
  card.dot.setAttribute("cx", last[0]);
  card.dot.setAttribute("cy", last[1]);
  card.pts = pts;
}

function renderChip(card, data, period) {
  const up = data.delta >= 0;
  const good = card.metric.invert ? !up : up;
  const pct = Math.abs(data.delta).toFixed(1) + "%";

  card.chip.className = `chip chip--${good ? "good" : "bad"}`;
  card.el.dataset.trend = good ? "good" : "bad";
  card.chip.innerHTML =
    (up ? ARROW_UP : ARROW_DOWN) +
    `<span aria-hidden="true">${up ? "+" : "−"}${pct}</span>` +
    `<span class="sr-only">${up ? "Up" : "Down"} ${pct} vs previous ${PERIOD_LABEL[period]}</span>`;
  card.compare.textContent = `vs previous ${PERIOD_LABEL[period]}`;
}

function update(card, period, { fromZero = false } = {}) {
  const data = card.metric.periods[period];

  card.srValue.textContent = card.metric.format(data.value);
  renderChip(card, data, period);

  if (!card.visible) {
    // Not on screen yet: just store the line; the count-up runs on reveal
    drawLine(card, toPoints(data.series));
    card.num.textContent = card.metric.format(0);
    return;
  }

  // Count the number from what is shown to the new value
  card.stopNum();
  const from = fromZero ? 0 : card.shown;
  card.stopNum = tween(fromZero ? REVEAL : D_SLOW, (k) => {
    card.shown = from + (data.value - from) * k;
    card.num.textContent = card.metric.format(card.shown);
  });

  // Morph the sparkline point-by-point (same length series)
  if (!fromZero) {
    card.stopLine();
    const start = card.pts;
    const end = toPoints(data.series);
    card.stopLine = tween(D_SLOW, (k) => {
      drawLine(card, start.map((p, i) => [p[0], p[1] + (end[i][1] - p[1]) * k]));
    });

    // Small lift-in on the chip so the change registers
    if (!reducedMotion) {
      card.chip.animate(
        [{ opacity: 0, transform: "translateY(4px)" }, { opacity: 1, transform: "none" }],
        { duration: D_BASE, easing: "cubic-bezier(.22,1,.36,1)" }
      );
    }
  }
}

/* =========================================
   PERIOD SELECTOR
========================================= */

const periodGroup = document.querySelector(".period");
const periodButtons = [...periodGroup.querySelectorAll(".period__btn")];
const status = document.getElementById("period-status");
let period = "30d";

periodButtons.forEach((btn, i) => {
  btn.addEventListener("click", () => {
    if (btn.dataset.period === period) return;

    period = btn.dataset.period;
    periodButtons.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    periodGroup.style.setProperty("--index", i);
    status.textContent = `Showing the last ${PERIOD_LABEL[period]}`;

    cards.forEach((card) => update(card, period));
  });
});

/* =========================================
   REVEAL ON SCROLL (IntersectionObserver)
========================================= */

cards.forEach((card) => update(card, period));

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const card = cards.find((c) => c.el === entry.target);
      const index = cards.indexOf(card);

      io.unobserve(entry.target);

      // Stagger neighbours slightly so the row doesn't pop all at once
      setTimeout(() => {
        card.visible = true;
        card.el.classList.add("is-visible");
        update(card, period, { fromZero: true });
      }, reducedMotion ? 0 : index * 90);
    });
  },
  { threshold: 0.35 }
);

cards.forEach((card) => io.observe(card.el));
