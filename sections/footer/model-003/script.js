document.addEventListener("DOMContentLoaded", () => {

  /* ====================================================
     CURRENT YEAR
  ==================================================== */

  const year =
    document.getElementById("year");

  if (year) {
    year.textContent =
      new Date().getFullYear();
  }


  /* ====================================================
     PLACEHOLDER LINKS
  ==================================================== */

  document
    .querySelectorAll('a[href="#"]')
    .forEach((link) => {

      link.addEventListener(
        "click",
        (event) => {

          event.preventDefault();

        }
      );

    });


  /* ====================================================
     GIANT MIRA WORDMARK
     subtle horizontal reaction to pointer
  ==================================================== */

  const footer =
    document.querySelector(".footer-stage");

  const brandTrack =
    document.querySelector(".footer-brand-track");


  if (
    footer &&
    brandTrack &&
    window.matchMedia("(pointer: fine)").matches
  ) {

    footer.addEventListener(
      "mousemove",
      (event) => {

        const rect =
          footer.getBoundingClientRect();

        const progress =
          (
            event.clientX -
            rect.left
          ) /
          rect.width;

        const offset =
          -2 -
          progress * 5;

        brandTrack.style.setProperty(
          "--brand-x",
          `${offset}%`
        );

      }
    );


    footer.addEventListener(
      "mouseleave",
      () => {

        brandTrack.style.setProperty(
          "--brand-x",
          "-2%"
        );

      }
    );

  }


  /* ====================================================
     CTA POINTER REACTION
  ==================================================== */

  const cta =
    document.querySelector(".footer-cta");


  if (
    cta &&
    window.matchMedia("(pointer: fine)").matches
  ) {

    cta.addEventListener(
      "mousemove",
      (event) => {

        const rect =
          cta.getBoundingClientRect();

        const x =
          event.clientX -
          rect.left;

        const y =
          event.clientY -
          rect.top;

        const centerX =
          rect.width / 2;

        const centerY =
          rect.height / 2;

        const moveX =
          (
            x -
            centerX
          ) * 0.025;

        const moveY =
          (
            y -
            centerY
          ) * 0.025;

        cta.style.transform =
          `
            translateY(-5px)
            translate(
              ${moveX}px,
              ${moveY}px
            )
          `;

      }
    );


    cta.addEventListener(
      "mouseleave",
      () => {

        cta.style.transform = "";

      }
    );

  }

});