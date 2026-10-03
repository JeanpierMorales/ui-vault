/* =========================================
   REAL-ESTATE LISTING CARDS
   Each card has its own small carousel:
   arrows, dots, ←/→ keys and pointer swipe.
========================================= */

const status = document.querySelector("[data-status]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

document.querySelectorAll(".listing").forEach((card) => {
  const media = card.querySelector(".listing__media");
  const viewport = card.querySelector(".listing__viewport");
  const track = card.querySelector(".listing__track");
  const slides = [...track.children];
  const dots = [...card.querySelectorAll(".listing__dot")];
  const prev = card.querySelector(".listing__arrow--prev");
  const next = card.querySelector(".listing__arrow--next");
  const fav = card.querySelector(".listing__fav");
  const street = card.querySelector(".listing__address a").textContent.trim();

  let index = 0;

  function goTo(i) {
    index = Math.max(0, Math.min(slides.length - 1, i));
    track.style.setProperty("--index", index);
    track.style.setProperty("--drag", "0px");

    dots.forEach((dot, d) => {
      if (d === index) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });

    // Only the visible slide is exposed to assistive tech.
    slides.forEach((slide, s) => slide.setAttribute("aria-hidden", String(s !== index)));

    // Disable the arrow at either end; if it had focus, hand focus to the other one.
    const focused = document.activeElement;
    prev.disabled = index === 0;
    next.disabled = index === slides.length - 1;
    if (focused === prev && prev.disabled) next.focus();
    if (focused === next && next.disabled) prev.focus();
  }

  prev.addEventListener("click", () => goTo(index - 1));
  next.addEventListener("click", () => goTo(index + 1));
  dots.forEach((dot, d) => dot.addEventListener("click", () => goTo(d)));

  media.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goTo(index - 1);
    else if (e.key === "ArrowRight") goTo(index + 1);
    else return;
    e.preventDefault();
  });

  /* ---------- Swipe ----------
     Horizontal drags move the track; mostly-vertical
     drags are left to the browser (touch-action: pan-y). */

  let startX = 0;
  let startY = 0;
  let startT = 0;
  let dx = 0;
  let dragging = false;
  let pointerId = null;

  viewport.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    pointerId = e.pointerId;
    startX = e.clientX;
    startY = e.clientY;
    startT = performance.now();
    dx = 0;
    dragging = false;
  });

  viewport.addEventListener("pointermove", (e) => {
    if (e.pointerId !== pointerId) return;
    const mx = e.clientX - startX;
    const my = e.clientY - startY;

    if (!dragging) {
      if (Math.abs(mx) < 6 || Math.abs(mx) < Math.abs(my)) return;
      dragging = true;
      viewport.setPointerCapture(pointerId);
      track.classList.add("is-dragging");
    }

    dx = mx;
    // Rubber-band resistance past the first/last photo
    const atEdge = (index === 0 && dx > 0) || (index === slides.length - 1 && dx < 0);
    track.style.setProperty("--drag", `${atEdge ? dx * 0.3 : dx}px`);
  });

  function endDrag(e) {
    if (e.pointerId !== pointerId) return;
    pointerId = null;
    if (!dragging) return;
    dragging = false;
    track.classList.remove("is-dragging");

    const width = viewport.offsetWidth;
    const velocity = dx / (performance.now() - startT); // px per ms
    const flick = Math.abs(velocity) > 0.45 && Math.abs(dx) > 20;

    if (dx < -width * 0.2 || (flick && dx < 0)) goTo(index + 1);
    else if (dx > width * 0.2 || (flick && dx > 0)) goTo(index - 1);
    else goTo(index);
  }

  viewport.addEventListener("pointerup", endDrag);
  viewport.addEventListener("pointercancel", endDrag);

  /* ---------- Favourite ---------- */

  fav.addEventListener("click", () => {
    const saved = fav.getAttribute("aria-pressed") !== "true";
    fav.setAttribute("aria-pressed", String(saved));
    fav.setAttribute("aria-label", `${saved ? "Remove" : "Save"} ${street}${saved ? " from saved homes" : ""}`);
    status.textContent = saved ? `${street} saved.` : `${street} removed from saved homes.`;

    if (saved && !reducedMotion.matches) {
      fav.classList.remove("is-popping");
      void fav.offsetWidth; // restart the animation
      fav.classList.add("is-popping");
    }
  });

  fav.addEventListener("animationend", () => fav.classList.remove("is-popping"));

  goTo(0);
});
