const navLinks =
  [...document.querySelectorAll("[data-nav]")];


/* =========================================================
   ACTIVE STATE
========================================================= */

function setActiveNav(target) {

  navLinks.forEach(link => {
    link.classList.remove("active");
  });

  target.classList.add("active");

}


/* =========================================================
   CLICK + SMOOTH SCROLL
========================================================= */

navLinks.forEach(link => {

  link.addEventListener("click", event => {

    const targetSelector =
      link.getAttribute("href");

    const targetSection =
      document.querySelector(targetSelector);

    if (!targetSection) {
      return;
    }

    event.preventDefault();

    setActiveNav(link);

    targetSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  });

});


/* =========================================================
   SCROLL SPY
========================================================= */

const sections =
  navLinks
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

        const currentId =
          `#${entry.target.id}`;

        const matchingLink =
          navLinks.find(
            link =>
              link.getAttribute("href") === currentId
          );

        if (
          matchingLink &&
          !matchingLink.classList.contains("active")
        ) {

          setActiveNav(matchingLink);

        }

      });

    },
    {
      root: null,

      rootMargin:
        "-42% 0px -48% 0px",

      threshold: 0
    }
  );


sections.forEach(section => {
  observer.observe(section);
});