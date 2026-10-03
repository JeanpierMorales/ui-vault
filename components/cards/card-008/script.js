/* =========================================
   PRICING — MONTHLY / YEARLY DIGIT ROLL
   Each price is split into digit "windows" over a
   vertical 0–9 strip; changing --n rolls the strip.
   Screen readers get a plain-text price instead.
========================================= */

const radios = document.querySelectorAll('input[name="billing"]');
const prices = document.querySelectorAll(".plan__price");
const notes = document.querySelectorAll(".plan__note");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// Build (or rebuild, if the digit count changes) the digit columns.
function ensureColumns(amountEl, length) {
  if (amountEl.children.length === length) return;

  amountEl.textContent = "";

  for (let i = 0; i < length; i++) {
    const digit = document.createElement("span");
    digit.className = "digit";

    const strip = document.createElement("span");
    strip.className = "digit__strip";

    for (let n = 0; n <= 9; n++) {
      const cell = document.createElement("span");
      cell.textContent = n;
      strip.appendChild(cell);
    }

    digit.appendChild(strip);
    amountEl.appendChild(digit);
  }
}

function setPrice(priceEl, period) {
  const value = priceEl.dataset[period];
  const amountEl = priceEl.querySelector(".plan__amount");

  ensureColumns(amountEl, value.length);

  [...value].forEach((char, i) => {
    const strip = amountEl.children[i].firstElementChild;
    strip.style.setProperty("--n", char);
    // Small stagger: rightmost digits settle last.
    strip.style.setProperty("--delay", `${i * 60}ms`);
  });

  const billing = period === "yearly" ? "per month, billed yearly" : "per month";
  priceEl.querySelector(".plan__sr").textContent = `$${value} ${billing}`;
}

// Fade the "Billed …" note out, swap text, fade back in.
function setNote(noteEl, period) {
  const text = noteEl.dataset[period];

  if (reduceMotion.matches) {
    noteEl.textContent = text;
    return;
  }

  noteEl.classList.add("is-swapping");
  setTimeout(() => {
    noteEl.textContent = text;
    noteEl.classList.remove("is-swapping");
  }, 180);
}

function update(period, animate = true) {
  document.body.classList.toggle("no-anim", !animate);
  prices.forEach((el) => setPrice(el, period));
  if (animate) notes.forEach((el) => setNote(el, period));
}

radios.forEach((radio) => {
  radio.addEventListener("change", () => {
    if (radio.checked) update(radio.value);
  });
});

// Initial render without motion (respects a restored checked state).
const initial = document.querySelector('input[name="billing"]:checked');
update(initial ? initial.value : "monthly", false);
notes.forEach((el) => (el.textContent = el.dataset[initial ? initial.value : "monthly"]));

// Re-enable transitions after the first paint.
requestAnimationFrame(() =>
  requestAnimationFrame(() => document.body.classList.remove("no-anim"))
);
