const stage = document.querySelector(".stage");
const card = document.querySelector(".card");

const MAX_TILT = 14; // degrees

const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

/* =========================================
   FLIP (click, Enter or Space — native button)
========================================= */

card.addEventListener("click", () => {
  const flipped = card.getAttribute("aria-pressed") === "true";

  card.setAttribute("aria-pressed", String(!flipped));
  card.setAttribute(
    "aria-label",
    flipped ? "Flip card to show the back" : "Flip card to show the front"
  );
});

/* =========================================
   3D TILT + GLARE
   Pointer position sets a target; a rAF loop
   eases the current values toward it so the
   motion stays smooth and interruptible.
========================================= */

const target = { rx: 0, ry: 0, gx: 50, gy: 50, glare: 0 };
const current = { ...target };
let frame = null;

function tiltEnabled() {
  return finePointer.matches && !reducedMotion.matches;
}

function render() {
  let moving = false;

  for (const key in target) {
    const diff = target[key] - current[key];
    current[key] += diff * 0.14;
    if (Math.abs(diff) > 0.01) moving = true;
  }

  card.style.setProperty("--rx", `${current.rx.toFixed(2)}deg`);
  card.style.setProperty("--ry", `${current.ry.toFixed(2)}deg`);
  card.style.setProperty("--gx", `${current.gx.toFixed(1)}%`);
  card.style.setProperty("--gy", `${current.gy.toFixed(1)}%`);
  card.style.setProperty("--glare", current.glare.toFixed(3));

  frame = moving ? requestAnimationFrame(render) : null;
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(render);
}

stage.addEventListener("pointermove", (event) => {
  if (event.pointerType !== "mouse" || !tiltEnabled()) return;

  const rect = card.getBoundingClientRect();

  // -1…1 relative to the card centre, clamped so far-away pointers don't over-rotate
  const nx = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
  const ny = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));

  const over =
    event.clientX >= rect.left && event.clientX <= rect.right &&
    event.clientY >= rect.top && event.clientY <= rect.bottom;

  // The card face turns toward the pointer
  target.ry = nx * MAX_TILT;
  target.rx = -ny * MAX_TILT;
  target.gx = 50 + nx * 50;
  target.gy = 50 + ny * 50;
  target.glare = over ? 1 : 0.35;

  schedule();
});

stage.addEventListener("pointerleave", () => {
  Object.assign(target, { rx: 0, ry: 0, gx: 50, gy: 50, glare: 0 });
  schedule();
});
