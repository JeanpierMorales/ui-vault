const navMenu = document.getElementById("navMenu");
const navIndicator = document.getElementById("navActiveIndicator");
const navLinks = [...document.querySelectorAll("[data-nav]")];

/* =========================================================
   MOVE INDICATOR
========================================================= */
function moveIndicator(target, animate = true) {
  if (!target || !navMenu || !navIndicator) return;

  const menuRect = navMenu.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  const x = targetRect.left - menuRect.left + navMenu.scrollLeft;

  const width = targetRect.width;

  if (!animate) {
    navIndicator.style.transition = "none";
  }

  navIndicator.style.width = `${width}px`;
  navIndicator.style.transform = `translate(${x}px, -50%)`;

  if (!animate) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        navIndicator.style.transition = "";
      });
    });
  }
}

/* =========================================================
   SET ACTIVE LINK
========================================================= */
function setActiveLink(target) {
  if (!target) return;

  navLinks.forEach((link) => {
    link.classList.remove("active");
  });

  target.classList.add("active");
  moveIndicator(target, true);

  if (window.innerWidth <= 1024) {
    target.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }
}

/* =========================================================
   CLICK EVENTS
========================================================= */
navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const selector = link.getAttribute("href");
    const section = document.querySelector(selector);

    if (!section) return;

    event.preventDefault();

    setActiveLink(link);

    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

/* =========================================================
   INITIAL POSITION
========================================================= */
window.addEventListener("load", () => {
  const active = document.querySelector(".nav-link.active");
  moveIndicator(active, false);
});

/* =========================================================
   RESIZE
========================================================= */
let resizeTimer;

window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);

  resizeTimer = setTimeout(() => {
    const active = document.querySelector(".nav-link.active");
    moveIndicator(active, false);
  }, 80);
});

/* =========================================================
   SCROLL SPY
========================================================= */
const sections = navLinks
  .map((link) => {
    const selector = link.getAttribute("href");
    return document.querySelector(selector);
  })
  .filter(Boolean);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const currentId = `#${entry.target.id}`;

      const matchingLink = navLinks.find(
        (link) => link.getAttribute("href") === currentId,
      );

      if (matchingLink && !matchingLink.classList.contains("active")) {
        setActiveLink(matchingLink);
      }
    });
  },
  {
    root: null,
    rootMargin: "-40% 0px -48% 0px",
    threshold: 0,
  },
);

sections.forEach((section) => observer.observe(section));
