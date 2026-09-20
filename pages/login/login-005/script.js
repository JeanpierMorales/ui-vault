/* =========================================================
   ELEMENTS
========================================================= */

const navMenu = document.getElementById("navMenu");

const navIndicator = document.getElementById("navIndicator");

const navItems = [...document.querySelectorAll("[data-nav]")];

const glassNav = document.getElementById("glassNav");

/* =========================================================
   MOVE ACTIVE INDICATOR
========================================================= */

function moveIndicator(target, animate = true) {
  if (!target || !navMenu || !navIndicator) {
    return;
  }

  const menuRect = navMenu.getBoundingClientRect();

  const targetRect = target.getBoundingClientRect();

  const x = targetRect.left - menuRect.left + navMenu.scrollLeft;

  const width = targetRect.width;

  /*
    Para el estado inicial evitamos
    que el indicador viaje desde x = 0.
  */

  if (!animate) {
    navIndicator.style.transition = "none";
  }

  navIndicator.style.width = `${width}px`;

  navIndicator.style.transform = `
      translate(
        ${x}px,
        -50%
      )
    `;

  if (!animate) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        navIndicator.style.transition = "";
      });
    });
  }
}

/* =========================================================
   SET ACTIVE ITEM
========================================================= */

function setActiveItem(target) {
  if (!target) {
    return;
  }

  navItems.forEach((item) => {
    item.classList.remove("active");
  });

  target.classList.add("active");

  moveIndicator(target, true);
}

/* =========================================================
   NAVIGATION CLICK
========================================================= */

navItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    const href = item.getAttribute("href");

    if (!href || !href.startsWith("#")) {
      return;
    }

    const targetSection = document.querySelector(href);

    if (!targetSection) {
      return;
    }

    event.preventDefault();

    setActiveItem(item);

    targetSection.scrollIntoView({
      behavior: "smooth",

      block: "start",
    });
  });
});

/* =========================================================
   BRAND CLICK
========================================================= */

const brandButton = document.querySelector(".brand-button");

if (brandButton) {
  brandButton.addEventListener("click", (event) => {
    const startSection = document.querySelector("#inicio");

    const startLink = document.querySelector('[data-nav][href="#inicio"]');

    if (!startSection || !startLink) {
      return;
    }

    event.preventDefault();

    setActiveItem(startLink);

    startSection.scrollIntoView({
      behavior: "smooth",

      block: "start",
    });
  });
}

/* =========================================================
   CTA SMOOTH SCROLL
========================================================= */

const cta = document.querySelector(".nav-cta");

if (cta) {
  cta.addEventListener("click", (event) => {
    const target = document.querySelector("#contacto");

    const contactLink = document.querySelector('[data-nav][href="#contacto"]');

    if (!target) {
      return;
    }

    event.preventDefault();

    if (contactLink) {
      setActiveItem(contactLink);
    }

    target.scrollIntoView({
      behavior: "smooth",

      block: "start",
    });
  });
}

/* =========================================================
   INITIAL INDICATOR
========================================================= */

function initializeIndicator() {
  const activeItem = document.querySelector(".nav-item.active");

  if (!activeItem) {
    return;
  }

  moveIndicator(activeItem, false);
}

window.addEventListener("load", initializeIndicator);

/* =========================================================
   RESIZE RECALCULATION
========================================================= */

let resizeTimeout;

window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);

  resizeTimeout = setTimeout(() => {
    const activeItem = document.querySelector(".nav-item.active");

    if (activeItem) {
      moveIndicator(activeItem, false);
    }
  }, 80);
});

/* =========================================================
   SCROLL SPY
========================================================= */

const sections = navItems

  .map((item) => {
    const selector = item.getAttribute("href");

    if (!selector || !selector.startsWith("#")) {
      return null;
    }

    return document.querySelector(selector);
  })

  .filter(Boolean);

const observerOptions = {
  root: null,

  /*
    Genera una zona central.

    Cuando una sección entra
    en esa zona pasa a ser activa.
  */

  rootMargin: "-38% 0px -48% 0px",

  threshold: 0,
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    const sectionID = `#${entry.target.id}`;

    const correspondingLink = navItems.find(
      (item) => item.getAttribute("href") === sectionID,
    );

    if (correspondingLink && !correspondingLink.classList.contains("active")) {
      setActiveItem(correspondingLink);
    }
  });
}, observerOptions);

sections.forEach((section) => {
  sectionObserver.observe(section);
});

/* =========================================================
   MOBILE MENU AUTO-SCROLL
========================================================= */

function keepActiveItemVisible(item) {
  if (window.innerWidth > 680) {
    return;
  }

  item.scrollIntoView({
    behavior: "smooth",

    block: "nearest",

    inline: "center",
  });
}

/* =========================================================
   UPDATE ORIGINAL SET ACTIVE
   WITH MOBILE BEHAVIOUR
========================================================= */

const originalSetActiveItem = setActiveItem;

setActiveItem = function (target) {
  if (!target) {
    return;
  }

  navItems.forEach((item) => {
    item.classList.remove("active");
  });

  target.classList.add("active");

  moveIndicator(target, true);

  keepActiveItemVisible(target);
};

/* =========================================================
   SUBTLE NAV STATE ON SCROLL
========================================================= */

function updateNavbarState() {
  if (!glassNav) {
    return;
  }

  if (window.scrollY > 30) {
    glassNav.style.boxShadow = `
      0 20px 48px rgba(0,0,0,.09),
      0 4px 15px rgba(0,0,0,.03),
      inset 0 1px 0 rgba(255,255,255,.7)
    `;
  } else {
    glassNav.style.boxShadow = `
      0 20px 48px rgba(0,0,0,.075),
      0 4px 15px rgba(0,0,0,.025),
      inset 0 1px 0 rgba(255,255,255,.7)
    `;
  }
}

window.addEventListener("scroll", updateNavbarState, {
  passive: true,
});

updateNavbarState();
