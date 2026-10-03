/* =========================================================
   DONE FOR YOU — SCROLL STORY
========================================================= */

gsap.registerPlugin(
  ScrollTrigger
);


/* =========================================================
   ELEMENTS
========================================================= */

const section =
  document.querySelector(
    "#dfy"
  );


const authorWorld =
  document.querySelector(
    "#authorWorld"
  );


const meanwhile =
  document.querySelector(
    "#meanwhile"
  );


const operations =
  document.querySelector(
    "#operations"
  );


const finalState =
  document.querySelector(
    "#dfyFinal"
  );


const operationStates =
  [
    ...document.querySelectorAll(
      ".operation"
    )
  ];


/* =========================================================
   CURRENT STATE
========================================================= */

let activeOperation =
  -1;


/* =========================================================
   CHANGE OPERATION
========================================================= */

function showOperation(
  index
) {

  if (
    activeOperation === index
  ) {
    return;
  }


  activeOperation =
    index;


  operationStates.forEach(
    (
      operation,
      operationIndex
    ) => {

      if (
        operationIndex === index
      ) {

        gsap.set(
          operation,
          {
            visibility:
              "visible"
          }
        );


        gsap.fromTo(
          operation,

          {
            opacity: 0,

            y: 28,

            filter:
              "blur(7px)"
          },

          {
            opacity: 1,

            y: 0,

            filter:
              "blur(0px)",

            duration: 0.5,

            ease:
              "power3.out",

            overwrite:
              true
          }
        );

      }

      else {

        gsap.to(
          operation,
          {
            opacity: 0,

            y: -20,

            filter:
              "blur(6px)",

            duration: 0.25,

            overwrite:
              true,

            onComplete() {

              if (
                operationIndex !==
                activeOperation
              ) {

                gsap.set(
                  operation,
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
   DESKTOP STORY
========================================================= */

function buildStory() {

  /* initial state */

  gsap.set(
    meanwhile,
    {
      opacity: 0,

      y: 30,

      filter:
        "blur(8px)"
    }
  );


  gsap.set(
    operations,
    {
      opacity: 0
    }
  );


  gsap.set(
    finalState,
    {
      opacity: 0,

      y: 40,

      filter:
        "blur(10px)"
    }
  );


  gsap.set(
    ".publish-item",
    {
      left: "8%"
    }
  );


  gsap.set(
    ".review-row i",
    {
      width: "0%"
    }
  );


  const timeline =
    gsap.timeline({

      scrollTrigger: {

        trigger:
          section,

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


          if (
            progress >= 0.19 &&
            progress < 0.34
          ) {

            showOperation(
              0
            );

          }

          else if (
            progress >= 0.34 &&
            progress < 0.49
          ) {

            showOperation(
              1
            );

          }

          else if (
            progress >= 0.49 &&
            progress < 0.64
          ) {

            showOperation(
              2
            );

          }

          else if (
            progress >= 0.64 &&
            progress < 0.79
          ) {

            showOperation(
              3
            );

          }

          else if (
            progress >= 0.79
          ) {

            showOperation(
              4
            );

          }

        }

      }

    });


  /* =======================================================
     OPENING
  ======================================================== */

  timeline.to(
    {},
    {
      duration: 0.7
    }
  );


  /* =======================================================
     IMAGE SHRINKS LEFT
  ======================================================== */

  timeline.to(
    authorWorld,
    {
      right: "52%",

      duration: 1.15,

      ease:
        "power3.inOut"
    },

    "split"
  );


  timeline.to(
    meanwhile,
    {
      opacity: 1,

      y: 0,

      filter:
        "blur(0px)",

      duration: 0.75,

      ease:
        "power3.out"
    },

    "split+=0.45"
  );


  timeline.to(
    operations,
    {
      opacity: 1,

      duration: 0.45
    },

    "split+=0.7"
  );


  timeline.call(
    () => {

      showOperation(
        0
      );

    },

    null,

    "split+=0.8"
  );


  timeline.to(
    {},
    {
      duration: 0.7
    }
  );


  /* =======================================================
     CREATE
  ======================================================== */

  timeline.call(
    () => {

      showOperation(
        1
      );

    }
  );


  timeline.fromTo(
    ".create-piece--image",

    {
      y: 20,
      opacity: 0
    },

    {
      y: 0,
      opacity: 1,

      duration: 0.55
    }
  );


  timeline.fromTo(
    [
      ".create-piece--quote",
      ".create-piece--caption"
    ],

    {
      x: 20,
      opacity: 0
    },

    {
      x: 0,
      opacity: 1,

      duration: 0.5,

      stagger: 0.12
    },

    "<"
  );


  timeline.to(
    {},
    {
      duration: 0.6
    }
  );


  /* =======================================================
     SCHEDULE
  ======================================================== */

  timeline.call(
    () => {

      showOperation(
        2
      );

    }
  );


  timeline.fromTo(
    ".schedule-column",

    {
      y: 35,
      opacity: 0
    },

    {
      y: 0,
      opacity: 1,

      stagger: 0.12,

      duration: 0.55,

      ease:
        "power3.out"
    }
  );


  timeline.to(
    {},
    {
      duration: 0.6
    }
  );


  /* =======================================================
     PUBLISH
  ======================================================== */

  timeline.call(
    () => {

      showOperation(
        3
      );

    }
  );


  timeline.to(
    ".publish-track--1 .publish-item",
    {
      left: "72%",

      duration: 0.8,

      ease:
        "none"
    },

    "publishing"
  );


  timeline.to(
    ".publish-track--2 .publish-item",
    {
      left: "72%",

      duration: 0.8,

      ease:
        "none"
    },

    "publishing+=0.2"
  );


  timeline.to(
    ".publish-track--3 .publish-item",
    {
      left: "72%",

      duration: 0.8,

      ease:
        "none"
    },

    "publishing+=0.4"
  );


  timeline.to(
    {},
    {
      duration: 0.45
    }
  );


  /* =======================================================
     REVIEW
  ======================================================== */

  timeline.call(
    () => {

      showOperation(
        4
      );

    }
  );


  document
    .querySelectorAll(
      ".review-row i"
    )
    .forEach(
      (
        bar,
        index
      ) => {

        const width =
          bar.dataset.bar;


        timeline.to(
          bar,
          {
            width:
              `${width}%`,

            duration:
              0.65,

            ease:
              "power3.out"
          },

          `review+=${index * 0.13}`
        );

      }
    );


  timeline.to(
    {},
    {
      duration: 0.65
    }
  );


  /* =======================================================
     EVERYTHING DISAPPEARS
  ======================================================== */

  timeline.to(
    meanwhile,
    {
      opacity: 0,

      y: -20,

      filter:
        "blur(6px)",

      duration: 0.45
    },

    "finish"
  );


  timeline.to(
    operations,
    {
      opacity: 0,

      y: -15,

      filter:
        "blur(7px)",

      duration: 0.55
    },

    "finish"
  );


  /* =======================================================
     AUTHOR IMAGE RETURNS
  ======================================================== */

  timeline.to(
    authorWorld,
    {
      right: "0%",

      opacity: 0.24,

      scale: 1.02,

      duration: 0.9,

      ease:
        "power3.inOut"
    },

    "finish+=0.25"
  );


  /* =======================================================
     FINAL
  ======================================================== */

  timeline.to(
    finalState,
    {
      opacity: 1,

      y: 0,

      filter:
        "blur(0px)",

      duration: 0.85,

      ease:
        "power3.out"
    },

    "finish+=0.65"
  );


  timeline.to(
    {},
    {
      duration: 1
    }
  );


  return timeline;

}


/* =========================================================
   RESPONSIVE
========================================================= */

const media =
  gsap.matchMedia();


media.add(
  "(min-width: 901px)",
  () => {

    const timeline =
      buildStory();


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
   LOAD
========================================================= */

window.addEventListener(
  "load",
  () => {

    ScrollTrigger.refresh();

  }
);