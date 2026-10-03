/* =========================================================
   BOOKETEER
   GSAP + SCROLLTRIGGER
========================================================= */

gsap.registerPlugin(
  ScrollTrigger
);


/* =========================================================
   REFERENCES
========================================================= */

const booketeer =
  document.querySelector(
    "#booketeer"
  );


const photo =
  document.querySelector(
    "#bookPhoto"
  );


const documentView =
  document.querySelector(
    "#bookDocument"
  );


const analysis =
  document.querySelector(
    "#bookAnalysis"
  );


const library =
  document.querySelector(
    "#bookLibrary"
  );


const scan =
  document.querySelector(
    "#bookScan"
  );


const progressLine =
  document.querySelector(
    "#progressLine"
  );


const stateCurrent =
  document.querySelector(
    "#stateCurrent"
  );


const selectedParagraph =
  document.querySelector(
    "#selectedParagraph"
  );


const copyStates =
  [
    ...document.querySelectorAll(
      ".booketeer__copy-state"
    )
  ];


/* =========================================================
   LABELS
========================================================= */

const labels = [
  "MANUSCRIPT",
  "INDEXING",
  "STORY CONTEXT",
  "READY IN MIRA"
];


/* =========================================================
   CURRENT COPY STATE
========================================================= */

let currentState =
  0;


/* =========================================================
   UPDATE LEFT COPY
========================================================= */

function changeCopy(
  index
) {

  if (
    currentState === index
  ) {
    return;
  }


  currentState =
    index;


  stateCurrent.textContent =
    labels[index];


  copyStates.forEach(
    (
      element,
      elementIndex
    ) => {

      if (
        elementIndex === index
      ) {

        gsap.set(
          element,
          {
            visibility:
              "visible"
          }
        );


        gsap.fromTo(
          element,

          {
            opacity: 0,

            yPercent:
              -42,

            filter:
              "blur(7px)"
          },

          {
            opacity: 1,

            yPercent:
              -50,

            filter:
              "blur(0px)",

            duration:
              0.5,

            ease:
              "power3.out",

            overwrite:
              true
          }
        );

      }

      else {

        gsap.to(
          element,
          {
            opacity: 0,

            yPercent:
              -58,

            filter:
              "blur(6px)",

            duration:
              0.28,

            overwrite:
              true,

            onComplete() {

              if (
                elementIndex !==
                currentState
              ) {

                gsap.set(
                  element,
                  {
                    visibility:
                      "hidden"
                  }
                );

              }

            }

          }
        );

      }

    }
  );

}


/* =========================================================
   DESKTOP ANIMATION
========================================================= */

function createDesktopAnimation() {

  /* -------------------------------------------------------
     INITIAL STATES
  ------------------------------------------------------- */

  gsap.set(
    photo,
    {
      opacity: 1,

      scale: 1
    }
  );


  gsap.set(
    documentView,
    {
      opacity: 0,

      y: 35,

      scale: 0.97
    }
  );


  gsap.set(
    analysis,
    {
      opacity: 0,

      y: 25
    }
  );


  gsap.set(
    library,
    {
      opacity: 0,

      y: 25
    }
  );


  gsap.set(
    ".analysis__attribute",
    {
      opacity: 0,

      x: 10
    }
  );


  gsap.set(
    ".library__scene",
    {
      opacity: 0,

      y: 10
    }
  );


  gsap.set(
    scan,
    {
      opacity: 0,

      top: "0%"
    }
  );


  selectedParagraph.classList.remove(
    "is-selected"
  );


  /* -------------------------------------------------------
     MASTER TIMELINE
  ------------------------------------------------------- */

  const timeline =
    gsap.timeline({

      scrollTrigger: {

        trigger:
          booketeer,

        start:
          "top top",

        end:
          "bottom bottom",

        scrub:
          1,

        invalidateOnRefresh:
          true,

        onUpdate(
          self
        ) {

          const progress =
            self.progress;


          /* progress line */

          gsap.set(
            progressLine,
            {
              width:
                `${progress * 100}%`
            }
          );


          /* labels + copy */

          if (
            progress <
            0.24
          ) {

            changeCopy(
              0
            );

          }

          else if (
            progress <
            0.49
          ) {

            changeCopy(
              1
            );

          }

          else if (
            progress <
            0.74
          ) {

            changeCopy(
              2
            );

          }

          else {

            changeCopy(
              3
            );

          }

        }

      }

    });


  /* =======================================================
     PHOTO
  ======================================================== */

  timeline.to(
    {},
    {
      duration: 0.6
    }
  );


  timeline.to(
    photo,
    {
      opacity: 0,

      scale: 1.025,

      filter:
        "blur(4px)",

      duration: 0.75,

      ease:
        "power2.inOut"
    },

    "document"
  );


  /* =======================================================
     MANUSCRIPT
  ======================================================== */

  timeline.to(
    documentView,
    {
      opacity: 1,

      y: 0,

      scale: 1,

      duration: 0.9,

      ease:
        "power3.out"
    },

    "document+=0.25"
  );


  /* highlight selected passage */

  timeline.call(
    () => {

      selectedParagraph
        .classList
        .add(
          "is-selected"
        );

    },

    null,

    "document+=0.85"
  );


  /* scanning line */

  timeline.to(
    scan,
    {
      opacity: 0.72,

      top: "12%",

      duration: 0.1
    },

    "scan"
  );


  timeline.to(
    scan,
    {
      top: "86%",

      duration: 1,

      ease:
        "none"
    },

    "scan+=0.1"
  );


  timeline.to(
    scan,
    {
      opacity: 0,

      duration: 0.2
    },

    "scan+=1"
  );


  timeline.to(
    {},
    {
      duration: 0.35
    }
  );


  /* =======================================================
     DOCUMENT → ANALYSIS
  ======================================================== */

  timeline.to(
    documentView,
    {
      opacity: 0,

      y: -20,

      scale: 0.985,

      filter:
        "blur(5px)",

      duration: 0.6
    },

    "analysis"
  );


  timeline.to(
    analysis,
    {
      opacity: 1,

      y: 0,

      duration: 0.75,

      ease:
        "power3.out"
    },

    "analysis+=0.2"
  );


  timeline.to(
    ".analysis__attribute",
    {
      opacity: 1,

      x: 0,

      duration: 0.42,

      stagger: 0.12,

      ease:
        "power3.out"
    },

    "analysis+=0.55"
  );


  timeline.to(
    {},
    {
      duration: 0.75
    }
  );


  /* =======================================================
     ANALYSIS → LIBRARY
  ======================================================== */

  timeline.to(
    analysis,
    {
      opacity: 0,

      y: -18,

      filter:
        "blur(5px)",

      duration: 0.6
    },

    "library"
  );


  timeline.to(
    library,
    {
      opacity: 1,

      y: 0,

      duration: 0.75,

      ease:
        "power3.out"
    },

    "library+=0.2"
  );


  timeline.to(
    ".library__scene",
    {
      opacity: 1,

      y: 0,

      duration: 0.45,

      stagger: 0.1,

      ease:
        "power3.out"
    },

    "library+=0.5"
  );


  /* final hold */

  timeline.to(
    {},
    {
      duration: 1.15
    }
  );


  return timeline;

}


/* =========================================================
   RESPONSIVE GSAP
========================================================= */

const media =
  gsap.matchMedia();


media.add(
  "(min-width: 901px)",
  () => {

    const timeline =
      createDesktopAnimation();


    requestAnimationFrame(
      () => {

        ScrollTrigger.refresh();

      }
    );


    return () => {

      timeline.kill();

    };

  }
);


/* =========================================================
   REFRESH AFTER PAGE LOAD
========================================================= */

window.addEventListener(
  "load",
  () => {

    ScrollTrigger.refresh();

  }
);