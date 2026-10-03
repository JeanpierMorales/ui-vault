const cards = Array.from(document.querySelectorAll(".xp-card"));
const triggers = cards.map((card) => card.querySelector(".xp-card__trigger"));

const mobileQuery = window.matchMedia("(max-width: 760px)");
const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

let activeIndex = -1;

/* =========================================
   OPEN ONE CARD, FOLD THE REST
========================================= */

function setActive(index) {
  if (index === activeIndex || index < 0 || index >= cards.length) return;
  activeIndex = index;

  cards.forEach((card, i) => {
    const open = i === index;
    card.classList.toggle("is-open", open);
    triggers[i].setAttribute("aria-expanded", String(open));

    // Folded panels are hidden visually, so keep their links out of the tab order
    const panel = card.querySelector(".xp-card__panel");
    panel.inert = !open;
    panel.setAttribute("aria-hidden", String(!open));
  });
}

/* =========================================
   POINTER + FOCUS + TAP
========================================= */

cards.forEach((card, i) => {
  // Hover opens only with a real mouse on the horizontal layout
  card.addEventListener("pointerenter", () => {
    if (hoverQuery.matches && !mobileQuery.matches) setActive(i);
  });

  triggers[i].addEventListener("click", () => setActive(i));
  triggers[i].addEventListener("focus", () => setActive(i));
});

/* =========================================
   KEYBOARD: arrows move between cards
========================================= */

document.querySelector(".xp-row").addEventListener("keydown", (event) => {
  const current = triggers.indexOf(document.activeElement);
  if (current === -1) return;

  let next = null;

  switch (event.key) {
    case "ArrowRight":
    case "ArrowDown":
      next = (current + 1) % triggers.length;
      break;
    case "ArrowLeft":
    case "ArrowUp":
      next = (current - 1 + triggers.length) % triggers.length;
      break;
    case "Home":
      next = 0;
      break;
    case "End":
      next = triggers.length - 1;
      break;
    default:
      return;
  }

  event.preventDefault();
  triggers[next].focus();

  // On phones, keep the focused card near the middle of the screen
  if (mobileQuery.matches) {
    cards[next].scrollIntoView({ block: "center", behavior: "smooth" });
  }
});

/* =========================================
   PHONES: the card crossing the middle opens
========================================= */

let observer = null;

function watchScroll() {
  observer?.disconnect();
  observer = null;

  if (!mobileQuery.matches) return;

  // A 2%-tall band in the middle of the viewport acts as the "reading line"
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(cards.indexOf(entry.target));
      });
    },
    { rootMargin: "-49% 0px -49% 0px", threshold: 0 }
  );

  cards.forEach((card) => observer.observe(card));
}

mobileQuery.addEventListener("change", watchScroll);

setActive(mobileQuery.matches ? 0 : 1);
watchScroll();
