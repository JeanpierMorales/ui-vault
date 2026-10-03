/* =========================================
   COURSE / PROGRESS CARDS
   Each card stores data-done / data-total. render()
   derives the percentage and drives:
   - ring: stroke-dashoffset (pathLength = 100)
   - bar:  scaleX(ratio)
   - the % label (counted with rAF)
   "Continue" completes one more lesson (demo) so the
   animation can be replayed; at 100% the card flips
   to the completed state.
========================================= */

document.documentElement.classList.add("js");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const cards = [...document.querySelectorAll(".course")];
const status = document.getElementById("course-status");
const ease = (t) => 1 - Math.pow(1 - t, 4);

function tween(el, from, to, duration = 1200) {
  if (reducedMotion || from === to) {
    el.textContent = to;
    return;
  }
  const start = performance.now();
  function frame(now) {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(from + (to - from) * ease(t));
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function render(card) {
  const done = Number(card.dataset.done);
  const total = Number(card.dataset.total);
  const pct = Math.round((done / total) * 100);
  const complete = done >= total;
  const title = card.querySelector(".course__title").textContent;

  const pctEl = card.querySelector("[data-pct]");
  const prev = Number(pctEl.textContent) || 0;
  tween(pctEl, prev, pct);

  card.querySelector(".ring__fill").style.strokeDashoffset = 100 - pct;
  card.querySelector(".bar__fill").style.transform = `scaleX(${done / total})`;
  card.querySelector("[data-lessons]").textContent = `${done} of ${total}`;

  const bar = card.querySelector(".bar");
  bar.setAttribute("aria-valuenow", pct);
  bar.setAttribute("aria-valuetext", `${pct}% · ${done} of ${total} lessons`);

  card.classList.toggle("is-complete", complete);
  card.querySelector("[data-btn-label]").textContent = complete ? "View certificate" : "Continue";
  card.querySelector(".course__btn").setAttribute(
    "aria-label",
    complete ? `View certificate for ${title}` : `Continue ${title}, lesson ${done + 1} of ${total}`
  );
}

cards.forEach((card) => {
  // HTML carries the real % for no-JS; start from 0 so it can count up
  if (!reducedMotion) card.querySelector("[data-pct]").textContent = "0";

  card.querySelector(".course__btn").addEventListener("click", () => {
    const total = Number(card.dataset.total);
    let done = Number(card.dataset.done);
    if (done >= total) {
      status.textContent = "Opening your certificate…";
      return;
    }
    done += 1;
    card.dataset.done = done;
    render(card);
    status.textContent =
      done >= total ? "Course completed. Certificate unlocked." : `Lesson ${done} of ${total} completed.`;
  });
});

/* Rings fill the first time each card scrolls into view */
function reveal(card) {
  card.classList.add("is-in");
  // small wait so the fill starts after the card has begun rising
  setTimeout(() => render(card), reducedMotion ? 0 : 250 + cards.indexOf(card) * 80);
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
    { threshold: 0.2 }
  );
  cards.forEach((card) => io.observe(card));
} else {
  cards.forEach(reveal);
}
