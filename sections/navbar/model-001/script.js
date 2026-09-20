const nav = document.getElementById("liquidNav");

const navLinks = document.querySelectorAll(".nav-link");


/* =========================================================
   LIQUID LIGHT FOLLOW
========================================================= */

nav.addEventListener("mousemove", (event) => {

  const rect = nav.getBoundingClientRect();

  const x =
    event.clientX -
    rect.left;

  const y =
    event.clientY -
    rect.top;

  nav.style.setProperty(
    "--mouse-x",
    `${x}px`
  );

  nav.style.setProperty(
    "--mouse-y",
    `${y}px`
  );

});


/* =========================================================
   VERY SUBTLE NAV TILT
========================================================= */

nav.addEventListener("mousemove", (event) => {

  const rect =
    nav.getBoundingClientRect();

  const centerX =
    rect.width / 2;

  const centerY =
    rect.height / 2;

  const cursorX =
    event.clientX -
    rect.left;

  const cursorY =
    event.clientY -
    rect.top;

  const rotateY =
    ((cursorX - centerX) / centerX) * 0.6;

  const rotateX =
    -((cursorY - centerY) / centerY) * 0.8;

  nav.style.transform = `
    translateY(-2px)
    perspective(900px)
    rotateX(${rotateX}deg)
    rotateY(${rotateY}deg)
  `;

});


nav.addEventListener("mouseleave", () => {

  nav.style.transform = `
    translateY(0)
    perspective(900px)
    rotateX(0deg)
    rotateY(0deg)
  `;

});


/* =========================================================
   ACTIVE MENU ITEM
========================================================= */

navLinks.forEach((link) => {

  link.addEventListener("click", () => {

    navLinks.forEach((item) => {
      item.classList.remove("active");
    });

    link.classList.add("active");

  });

});


/* =========================================================
   MAGNETIC INTERACTION
========================================================= */

const interactiveElements =
  document.querySelectorAll(
    ".nav-logo, .nav-contact"
  );


interactiveElements.forEach((element) => {

  element.addEventListener(
    "mousemove",
    (event) => {

      const rect =
        element.getBoundingClientRect();

      const x =
        event.clientX -
        rect.left -
        rect.width / 2;

      const y =
        event.clientY -
        rect.top -
        rect.height / 2;

      element.style.transform = `
        translate(
          ${x * 0.08}px,
          ${y * 0.08}px
        )
        scale(1.035)
      `;

    }
  );


  element.addEventListener(
    "mouseleave",
    () => {

      element.style.transform =
        "";

    }
  );

});