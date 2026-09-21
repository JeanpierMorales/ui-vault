const menuTrack =
  document.getElementById("menuTrack");

const menuIndicator =
  document.getElementById("menuIndicator");

const menuLinks =
  [...document.querySelectorAll("[data-nav]")];


/* =========================================================
   MOVE INDICATOR
========================================================= */

function moveIndicator(target, animate = true) {

  if (
    !target ||
    !menuTrack ||
    !menuIndicator
  ) {
    return;
  }


  const menuRect =
    menuTrack.getBoundingClientRect();

  const targetRect =
    target.getBoundingClientRect();


  const x =
    targetRect.left -
    menuRect.left +
    menuTrack.scrollLeft;


  if (!animate) {
    menuIndicator.style.transition =
      "none";
  }


  menuIndicator.style.width =
    `${targetRect.width}px`;

  menuIndicator.style.transform =
    `translate(${x}px, -50%)`;


  if (!animate) {

    requestAnimationFrame(() => {

      requestAnimationFrame(() => {
        menuIndicator.style.transition = "";
      });

    });

  }

}


/* =========================================================
   ACTIVE
========================================================= */

function setActive(target) {

  if (!target) return;


  menuLinks.forEach(link => {
    link.classList.remove("active");
  });


  target.classList.add("active");


  moveIndicator(
    target,
    true
  );


  if (
    window.innerWidth <= 980
  ) {

    target.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center"
    });

  }

}


/* =========================================================
   CLICK
========================================================= */

menuLinks.forEach(link => {

  link.addEventListener("click", event => {

    const selector =
      link.getAttribute("href");

    const target =
      document.querySelector(selector);


    if (!target) return;


    event.preventDefault();


    setActive(link);


    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  });

});


/* =========================================================
   INITIAL
========================================================= */

window.addEventListener("load", () => {

  const active =
    document.querySelector(".menu-link.active");


  moveIndicator(
    active,
    false
  );

});


/* =========================================================
   RESIZE
========================================================= */

let resizeTimer;


window.addEventListener("resize", () => {

  clearTimeout(resizeTimer);


  resizeTimer =
    setTimeout(() => {

      const active =
        document.querySelector(".menu-link.active");


      moveIndicator(
        active,
        false
      );

    }, 80);

});


/* =========================================================
   SCROLL SPY
========================================================= */

const sections =
  menuLinks
    .map(link => {

      const selector =
        link.getAttribute("href");

      return document.querySelector(selector);

    })
    .filter(Boolean);


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
          menuLinks.find(
            link =>
              link.getAttribute("href") === id
          );


        if (
          correspondingLink &&
          !correspondingLink.classList.contains("active")
        ) {

          setActive(
            correspondingLink
          );

        }

      });

    },
    {
      rootMargin:
        "-42% 0px -48% 0px",

      threshold: 0
    }
  );


sections.forEach(section => {
  observer.observe(section);
});