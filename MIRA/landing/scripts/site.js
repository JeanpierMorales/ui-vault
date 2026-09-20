const navMenu = document.getElementById("navMenu");

const indicator = document.getElementById("navIndicator");

const navItems = [...document.querySelectorAll("[data-nav]")];

const hero = document.getElementById("hero");

function updateNavigationVisibility() {
  if (!hero) return;

  const hasReachedNextSection = window.scrollY >= hero.offsetTop + hero.offsetHeight - 120;
  const wasVisible = glassNav.classList.contains("is-visible");

  glassNav.classList.toggle("is-visible", hasReachedNextSection);

  if (hasReachedNextSection && !wasVisible) {
    moveIndicator(document.querySelector(".nav-item.active"), false);
  }
}

window.addEventListener("scroll", updateNavigationVisibility, { passive: true });

/* =========================================================
   MOVE INDICATOR
========================================================= */

function moveIndicator(target, animate = true) {
  if (!target || !indicator || !navMenu) {
    return;
  }

  const menuRect = navMenu.getBoundingClientRect();

  const targetRect = target.getBoundingClientRect();

  const x = targetRect.left - menuRect.left + navMenu.scrollLeft;

  if (!animate) {
    indicator.style.transition = "none";
  }

  indicator.style.width = `${targetRect.width}px`;

  indicator.style.transform = `translate(${x}px, -50%)`;

  if (!animate) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        indicator.style.transition = "";
      });
    });
  }
}

/* =========================================================
   ACTIVE
========================================================= */

function setActive(target) {
  if (!target) {
    return;
  }

  navItems.forEach((item) => {
    item.classList.remove("active");
  });

  target.classList.add("active");

  moveIndicator(target);

  /*
    En móvil mantiene visible
    la opción activa.
  */

  if (window.innerWidth <= 780) {
    target.scrollIntoView({
      behavior: "smooth",

      block: "nearest",

      inline: "center",
    });
  }
}

/* =========================================================
   CLICKS
========================================================= */

navItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    const selector = item.getAttribute("href");

    const target = document.querySelector(selector);

    if (!target) {
      return;
    }

    event.preventDefault();

    setActive(item);

    target.scrollIntoView({
      behavior: "smooth",

      block: "start",
    });
  });
});

/* =========================================================
   INITIAL STATE
========================================================= */

window.addEventListener("load", () => {
  const active = document.querySelector(".nav-item.active");

  moveIndicator(active, false);
  updateNavigationVisibility();
});

/* =========================================================
   RESIZE
========================================================= */

let resizeTimer;

window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);

  resizeTimer = setTimeout(() => {
    const active = document.querySelector(".nav-item.active");

    moveIndicator(active, false);
  }, 80);
});

/* =========================================================
   MENU SECTIONS
========================================================= */

const menuSections = navItems

  .map((item) => {
    const selector = item.getAttribute("href");

    return document.querySelector(selector);
  })

  .filter(Boolean);

/* =========================================================
   SCROLL SPY
========================================================= */

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const selector = `#${entry.target.id}`;

      const correspondingItem = navItems.find(
        (item) => item.getAttribute("href") === selector,
      );

      if (
        correspondingItem &&
        !correspondingItem.classList.contains("active")
      ) {
        setActive(correspondingItem);
      }
    });
  },
  {
    rootMargin: "-42% 0px -48% 0px",

    threshold: 0,
  },
);

menuSections.forEach((section) => {
  observer.observe(section);
});
