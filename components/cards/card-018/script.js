/* =========================================
   BENTO GRID CARDS
   - Tiles rise in a stagger (delay = --i * 70ms, see CSS)
     the first time the grid scrolls into view.
   - The stat number counts up when its tile appears.
========================================= */

document.documentElement.classList.add("js");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const tiles = [...document.querySelectorAll(".tile")];
const ease = (t) => 1 - Math.pow(1 - t, 4); // close match to cubic-bezier(.22,1,.36,1)

function countUp(el) {
  const target = Number(el.dataset.count);
  if (reducedMotion) {
    el.textContent = target;
    return;
  }

  const duration = 1400;
  const start = performance.now();

  function frame(now) {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(target * ease(t));
    if (t < 1) requestAnimationFrame(frame);
  }

  el.textContent = "0";
  requestAnimationFrame(frame);
}

function reveal(tile) {
  tile.classList.add("is-in");
  const counter = tile.querySelector("[data-count]");
  if (counter && !reducedMotion) counter.textContent = "0";
  // Wait for the tile's own stagger delay before counting
  if (counter) setTimeout(() => countUp(counter), Number(getComputedStyle(tile).getPropertyValue("--i")) * 70);
}

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );
  tiles.forEach((tile) => io.observe(tile));
} else {
  tiles.forEach(reveal);
}
