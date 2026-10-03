/* =========================================
   RECIPE CARD
   - Checkboxes: count "n of 8 gathered".
   - Stepper: rescales every data-qty (written for
     BASE servings) and formats the result per unit:
     grams round to 5, cups/tbsp to the nearest ¼
     shown as a vulgar fraction, whole items round
     up to at least 1 and pluralise.
   - Save: aria-pressed toggle.
========================================= */

const BASE = 2;
const MIN = 1;
const MAX = 12;

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const card = document.querySelector(".recipe");
const qtyEls = [...card.querySelectorAll(".ing__qty")];
const boxes = [...card.querySelectorAll('.ing input[type="checkbox"]')];
const servingsEl = card.querySelector("[data-servings]");
const servingsChip = card.querySelector("[data-servings-chip]");
const [minusBtn, plusBtn] = card.querySelectorAll(".stepper__btn");
const saveBtn = card.querySelector(".save");

let servings = BASE;

const FRACTIONS = { 0.25: "¼", 0.5: "½", 0.75: "¾" };

function formatFraction(value) {
  const q = Math.max(0.25, Math.round(value * 4) / 4);
  const whole = Math.floor(q);
  const frac = FRACTIONS[q - whole] || "";
  return (whole ? String(whole) : "") + frac;
}

function formatQty(el, forServings = servings) {
  const raw = (Number(el.dataset.qty) * forServings) / BASE;
  const unit = el.dataset.unit;

  if (unit === "g") {
    const g = Math.max(5, Math.round(raw / 5) * 5);
    return g >= 1000 ? `${(g / 1000).toFixed(g % 1000 ? 2 : 0).replace(/0$/, "")} kg` : `${g} g`;
  }
  if (unit === "tbsp" && raw >= 8) {
    // 16 tbsp = 1 cup; switch to cups once the spoon count gets silly
    return formatQty({ dataset: { qty: raw / 16, unit: "cup" } }, BASE);
  }
  if (unit === "cup" || unit === "tbsp") {
    const text = formatFraction(raw);
    const plural = unit === "cup" && Math.round(raw * 4) / 4 > 1 ? "cups" : unit;
    return `${text} ${plural}`;
  }
  // Countable item: bold number, noun in the next span pluralised ("1 cucumber", "3 eggs")
  const n = Math.max(1, Math.round(raw));
  const [one, many] = el.dataset.noun.split("|");
  el.parentElement.querySelector(".ing__noun").textContent = n === 1 ? one : many;
  return String(n);
}

function renderQuantities(animate) {
  qtyEls.forEach((el) => {
    const next = formatQty(el);
    if (el.textContent === next) return;
    el.textContent = next;
    if (animate && !reducedMotion) {
      el.classList.remove("is-bumped");
      void el.offsetWidth; // restart the animation
      el.classList.add("is-bumped");
    }
  });

  servingsEl.textContent = servings;
  servingsChip.textContent = servings;
  minusBtn.disabled = servings <= MIN;
  plusBtn.disabled = servings >= MAX;
}

card.querySelectorAll("[data-step]").forEach((btn) => {
  btn.addEventListener("click", () => {
    servings = Math.min(MAX, Math.max(MIN, servings + Number(btn.dataset.step)));
    renderQuantities(true);
  });
});

/* ---------- Checklist ---------- */

const checkedEl = card.querySelector("[data-checked]");
card.querySelector("[data-total]").textContent = boxes.length;

function renderCount() {
  checkedEl.textContent = boxes.filter((b) => b.checked).length;
}

boxes.forEach((box) => box.addEventListener("change", renderCount));

/* ---------- Save ---------- */

saveBtn.addEventListener("click", () => {
  const saved = saveBtn.getAttribute("aria-pressed") !== "true";
  saveBtn.setAttribute("aria-pressed", saved);
  saveBtn.querySelector(".save__text").textContent = saved ? "Saved" : "Save";
  saveBtn.classList.remove("is-popping");
  void saveBtn.offsetWidth;
  if (saved) saveBtn.classList.add("is-popping");
});

renderQuantities(false);
renderCount();
