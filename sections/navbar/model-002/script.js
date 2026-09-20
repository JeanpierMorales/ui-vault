const menu = document.getElementById("navMenu");
const indicator = document.getElementById("navIndicator");

const navItems = [
  ...document.querySelectorAll("[data-nav]")
];


/* =========================================================
   MOVER EL INDICADOR
========================================================= */

function moveIndicator(target, animate = true) {

  if (!target || !indicator || !menu) {
    return;
  }

  const menuRect =
    menu.getBoundingClientRect();

  const targetRect =
    target.getBoundingClientRect();


  const x =
    targetRect.left -
    menuRect.left;


  const width =
    targetRect.width;


  if (!animate) {
    indicator.style.transition =
      "none";
  }


  indicator.style.width =
    `${width}px`;

  indicator.style.transform =
    `translate(${x}px, -50%)`;


  if (!animate) {

    requestAnimationFrame(() => {
      indicator.style.transition = "";
    });

  }

}


/* =========================================================
   CAMBIAR ITEM ACTIVO
========================================================= */

function setActiveItem(target) {

  navItems.forEach(item => {
    item.classList.remove("active");
  });

  target.classList.add("active");

  moveIndicator(target);

}


/* =========================================================
   CLICK
========================================================= */

navItems.forEach(item => {

  item.addEventListener("click", event => {

    const href =
      item.getAttribute("href");


    if (
      !href ||
      !href.startsWith("#")
    ) {
      return;
    }


    const section =
      document.querySelector(href);


    if (!section) {
      return;
    }


    event.preventDefault();


    setActiveItem(item);


    section.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  });

});


/* =========================================================
   INDICADOR INICIAL
========================================================= */

window.addEventListener("load", () => {

  const active =
    document.querySelector(
      ".nav-item.active"
    );

  moveIndicator(
    active,
    false
  );

});


/* =========================================================
   RESPONSIVE RECALCULATION
========================================================= */

let resizeTimer;

window.addEventListener("resize", () => {

  clearTimeout(resizeTimer);

  resizeTimer =
    setTimeout(() => {

      const active =
        document.querySelector(
          ".nav-item.active"
        );

      moveIndicator(
        active,
        false
      );

    }, 80);

});


/* =========================================================
   SCROLL SPY
   CAMBIA AUTOMÁTICAMENTE EL MENÚ SEGÚN LA SECCIÓN
========================================================= */

const sections =
  navItems
    .map(item => {

      const id =
        item.getAttribute("href");

      return document.querySelector(id);

    })
    .filter(Boolean);


const observerOptions = {
  root: null,

  rootMargin:
    "-38% 0px -48% 0px",

  threshold: 0
};


const observer =
  new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (!entry.isIntersecting) {
          return;
        }


        const id =
          `#${entry.target.id}`;


        const correspondingLink =
          navItems.find(
            item =>
              item.getAttribute("href") === id
          );


        if (correspondingLink) {
          setActiveItem(
            correspondingLink
          );
        }

      });

    },
    observerOptions
  );


sections.forEach(section => {
  observer.observe(section);
});