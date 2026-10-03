/* =========================================================
   MIRA — ORGANIZE & PUBLISH
   Scroll choreography + magnetic pointer interaction
========================================================= */


/* =========================================================
   GSAP SETUP
========================================================= */

gsap.registerPlugin(ScrollTrigger);


/* =========================================================
   ELEMENTS
========================================================= */

const story =
  document.querySelector(
    "#publishStory"
  );

const stage =
  document.querySelector(
    "#publishStage"
  );

const progressFill =
  document.querySelector(
    "#stageProgressFill"
  );


const pieces = {
  video:
    document.querySelector(
      "#pieceVideo"
    ),

  image:
    document.querySelector(
      "#pieceImage"
    ),

  scene:
    document.querySelector(
      "#pieceScene"
    ),

  caption:
    document.querySelector(
      "#pieceCaption"
    ),

  hashtags:
    document.querySelector(
      "#pieceHashtags"
    )
};


const scatteredCopy =
  document.querySelector(
    "#phaseScattered"
  );

const organizedCopy =
  document.querySelector(
    "#phaseOrganized"
  );

const organizationField =
  document.querySelector(
    "#organizationField"
  );

const grid =
  document.querySelector(
    ".stage-grid"
  );

const schedule =
  document.querySelector(
    "#schedule"
  );

const timelineProgress =
  document.querySelector(
    "#timelineProgress"
  );

const scheduledOne =
  document.querySelector(
    "#scheduledOne"
  );

const scheduledTwo =
  document.querySelector(
    "#scheduledTwo"
  );

const scheduledThree =
  document.querySelector(
    "#scheduledThree"
  );

const publishingCopy =
  document.querySelector(
    "#publishingCopy"
  );

const publishSignal =
  document.querySelector(
    "#publishSignal"
  );

const finalWords =
  document.querySelector(
    "#finalWords"
  );

const stageProgress =
  document.querySelector(
    "#stageProgress"
  );


/* =========================================================
   DESKTOP MEDIA QUERY
========================================================= */

const desktop =
  window.matchMedia(
    "(min-width: 901px)"
  );


/* =========================================================
   BUILD SCROLL ANIMATION
========================================================= */

function buildScrollStory() {

  if (!desktop.matches) {
    return;
  }


  /* =======================================================
     INITIAL STATES
  ======================================================== */

  gsap.set(
    [
      organizedCopy,
      organizationField,
      grid,
      schedule,
      publishingCopy,
      publishSignal,
      finalWords
    ],
    {
      opacity: 0
    }
  );


  gsap.set(
    schedule,
    {
      y: 45
    }
  );


  gsap.set(
    publishingCopy,
    {
      y: 40
    }
  );


  gsap.set(
    finalWords,
    {
      y: 20
    }
  );


  gsap.set(
    [
      scheduledOne,
      scheduledTwo,
      scheduledThree
    ],
    {
      opacity: 0,
      y: 18
    }
  );


  gsap.set(
    timelineProgress,
    {
      width: "0%"
    }
  );


  /* =======================================================
     MASTER TIMELINE
  ======================================================== */

  const timeline =
    gsap.timeline({

      defaults: {
        ease:
          "power2.inOut"
      },

      scrollTrigger: {

        trigger:
          story,

        start:
          "top top",

        end:
          "bottom bottom",

        scrub:
          1.15,

        invalidateOnRefresh:
          true,

        onUpdate:
          (self) => {

            /*
              Main progress indicator.
            */

            gsap.set(
              progressFill,
              {
                width:
                  `${self.progress * 100}%`
              }
            );


            /*
              Disable magnetic movement once
              organization starts.

              This avoids pointer movement fighting
              against the scroll choreography.
            */

            story.dataset.phase =
              self.progress < 0.23
                ? "free"
                : "organized";

          }

      }

    });


  /* =======================================================
     PHASE A
     0 → 20%
     SCATTERED CONTENT

     We intentionally give the visitor a small period
     where almost nothing happens. It lets them read
     and understand the initial composition.
  ======================================================== */

  timeline.to(
    {},
    {
      duration: 0.8
    }
  );


  /* =======================================================
     PHASE B
     SCATTERED → ORGANIZED
  ======================================================== */

  timeline.to(
    scatteredCopy,
    {
      opacity: 0,

      y: -30,

      filter:
        "blur(8px)",

      duration: 0.55
    },
    "organize"
  );


  /*
    Reveal the almost-invisible alignment system.
  */

  timeline.to(
    grid,
    {
      opacity: 1,

      duration: 0.6
    },
    "organize+=0.1"
  );


  timeline.to(
    organizationField,
    {
      opacity: 1,

      duration: 0.6
    },
    "organize+=0.15"
  );


  /* =======================================================
     PIECES CONVERGE

     Each piece moves independently.
     The asymmetry is deliberate.
  ======================================================== */

  timeline.to(
    pieces.video,
    {
      top: "39%",
      left: "22%",

      width: 170,
      height: 205,

      rotation: 0,

      duration: 1.15
    },
    "organize"
  );


  timeline.to(
    pieces.image,
    {
      top: "39%",
      right: "22%",

      width: 170,
      height: 205,

      rotation: 0,

      duration: 1.15
    },
    "organize+=0.05"
  );


  timeline.to(
    pieces.scene,
    {
      top: "39%",
      left: "50%",

      xPercent: -50,

      width: 250,

      rotation: 0,

      duration: 1.1
    },
    "organize+=0.08"
  );


  timeline.to(
    pieces.caption,
    {
      right: "16%",
      bottom: "8%",

      rotation: 0,

      opacity: 0,

      y: 40,

      duration: 0.75
    },
    "organize+=0.15"
  );


  timeline.to(
    pieces.hashtags,
    {
      left: "17%",
      bottom: "8%",

      rotation: 0,

      opacity: 0,

      y: 40,

      duration: 0.75
    },
    "organize+=0.15"
  );


  /* =======================================================
     ORGANIZED MESSAGE
  ======================================================== */

  timeline.fromTo(
    organizedCopy,

    {
      opacity: 0,
      y: 30,
      filter:
        "blur(7px)"
    },

    {
      opacity: 1,
      y: 0,
      filter:
        "blur(0px)",

      duration: 0.65
    },

    "organize+=0.65"
  );


  /*
    Hold the organized composition.
  */

  timeline.to(
    {},
    {
      duration: 0.65
    }
  );


  /* =======================================================
     PHASE C
     ORGANIZED → SCHEDULE
  ======================================================== */

  timeline.to(
    organizedCopy,
    {
      opacity: 0,
      y: -30,

      duration: 0.45
    },
    "scheduleStart"
  );


  timeline.to(
    organizationField,
    {
      opacity: 0,

      duration: 0.4
    },
    "scheduleStart"
  );


  timeline.to(
    grid,
    {
      opacity: 0,

      duration: 0.5
    },
    "scheduleStart"
  );


  /*
    Existing pieces travel toward the horizontal
    publishing line and disappear into it.
  */

  timeline.to(
    pieces.video,
    {
      left: "12%",
      top: "58%",

      width: 110,
      height: 135,

      opacity: 0,

      scale: 0.8,

      duration: 0.8
    },
    "scheduleStart"
  );


  timeline.to(
    pieces.scene,
    {
      left: "50%",
      top: "58%",

      opacity: 0,

      scale: 0.8,

      duration: 0.8
    },
    "scheduleStart+=0.05"
  );


  timeline.to(
    pieces.image,
    {
      right: "12%",
      top: "58%",

      width: 110,
      height: 135,

      opacity: 0,

      scale: 0.8,

      duration: 0.8
    },
    "scheduleStart+=0.1"
  );


  /* =======================================================
     SCHEDULE ENTERS
  ======================================================== */

  timeline.to(
    schedule,
    {
      opacity: 1,
      y: 0,

      duration: 0.8
    },
    "scheduleStart+=0.35"
  );


  /*
    Timeline grows instead of simply appearing.
  */

  timeline.to(
    timelineProgress,
    {
      width: "100%",

      ease: "none",

      duration: 1.5
    },
    "timelineRun"
  );


  /* =======================================================
     CONTENT LANDS ON SCHEDULE
  ======================================================== */

  timeline.to(
    scheduledOne,
    {
      opacity: 1,
      y: 0,

      duration: 0.35
    },
    "timelineRun+=0.18"
  );


  timeline.to(
    ".day-mon .day-node",
    {
      backgroundColor:
        "#1d1d1b",

      borderColor:
        "#1d1d1b",

      scale: 1.25,

      duration: 0.25
    },
    "timelineRun+=0.18"
  );


  timeline.to(
    scheduledTwo,
    {
      opacity: 1,
      y: 0,

      duration: 0.35
    },
    "timelineRun+=0.62"
  );


  timeline.to(
    ".day-wed .day-node",
    {
      backgroundColor:
        "#1d1d1b",

      borderColor:
        "#1d1d1b",

      scale: 1.25,

      duration: 0.25
    },
    "timelineRun+=0.62"
  );


  timeline.to(
    scheduledThree,
    {
      opacity: 1,
      y: 0,

      duration: 0.35
    },
    "timelineRun+=1.02"
  );


  timeline.to(
    ".day-fri .day-node",
    {
      backgroundColor:
        "#1d1d1b",

      borderColor:
        "#1d1d1b",

      scale: 1.25,

      duration: 0.25
    },
    "timelineRun+=1.02"
  );


  timeline.to(
    ".day-sun .day-node",
    {
      backgroundColor:
        "#1d1d1b",

      borderColor:
        "#1d1d1b",

      scale: 1.25,

      duration: 0.25
    },
    "timelineRun+=1.42"
  );


  /*
    Hold completed schedule briefly.
  */

  timeline.to(
    {},
    {
      duration: 0.6
    }
  );


  /* =======================================================
     PHASE D
     SCHEDULE → PUBLISH
  ======================================================== */

  timeline.to(
    schedule,
    {
      opacity: 0,

      scale: 0.94,

      filter:
        "blur(7px)",

      duration: 0.7
    },
    "publish"
  );


  timeline.to(
    stageProgress,
    {
      opacity: 0,

      duration: 0.35
    },
    "publish"
  );


  /* =======================================================
     SIGNAL
  ======================================================== */

  timeline.fromTo(
    publishSignal,

    {
      opacity: 0,
      scale: 0.65
    },

    {
      opacity: 1,
      scale: 1,

      duration: 0.8
    },

    "publish+=0.25"
  );


  /*
    Rings expand progressively.
  */

  timeline.fromTo(
    ".ring-one",

    {
      scale: 0.3,
      opacity: 0
    },

    {
      scale: 1,
      opacity: 1,

      duration: 0.65
    },

    "publish+=0.3"
  );


  timeline.fromTo(
    ".ring-two",

    {
      scale: 0.25,
      opacity: 0
    },

    {
      scale: 1,
      opacity: 1,

      duration: 0.8
    },

    "publish+=0.42"
  );


  timeline.fromTo(
    ".ring-three",

    {
      scale: 0.2,
      opacity: 0
    },

    {
      scale: 1,
      opacity: 1,

      duration: 1
    },

    "publish+=0.55"
  );


  /*
    Signal then fades behind the final statement.
  */

  timeline.to(
    publishSignal,
    {
      opacity: 0.12,
      scale: 1.4,

      duration: 0.75
    },
    "publish+=1.1"
  );


  /* =======================================================
     FINAL MESSAGE
  ======================================================== */

  timeline.fromTo(
    publishingCopy,

    {
      opacity: 0,
      y: 45,

      filter:
        "blur(10px)"
    },

    {
      opacity: 1,
      y: 0,

      filter:
        "blur(0px)",

      duration: 0.85
    },

    "publish+=1"
  );


  timeline.fromTo(
    finalWords,

    {
      opacity: 0,
      y: 22
    },

    {
      opacity: 1,
      y: 0,

      duration: 0.65
    },

    "publish+=1.5"
  );


  /*
    Final hold.
    Important so the next section does not
    immediately replace the final composition.
  */

  timeline.to(
    {},
    {
      duration: 1
    }
  );

}


/* =========================================================
   POINTER INTERACTION
========================================================= */

const pointerDevice =
  window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  );


/* =========================================================
   MAGNETIC OBJECTS
========================================================= */

function initializeMagneticInteraction() {

  if (!pointerDevice.matches) {
    return;
  }


  const magneticItems =
    document.querySelectorAll(
      ".magnetic"
    );


  magneticItems.forEach(
    (item) => {

      item.addEventListener(
        "pointermove",
        (event) => {

          /*
            Pointer interaction is only available
            during the scattered-content phase.
          */

          if (
            story.dataset.phase ===
            "organized"
          ) {
            return;
          }


          const rect =
            item.getBoundingClientRect();


          const centerX =
            rect.left
            +
            rect.width / 2;


          const centerY =
            rect.top
            +
            rect.height / 2;


          const distanceX =
            event.clientX
            -
            centerX;


          const distanceY =
            event.clientY
            -
            centerY;


          const strength =
            Number(
              item.dataset.magnetic
              ||
              8
            );


          const moveX =
            (
              distanceX
              /
              rect.width
            )
            *
            strength;


          const moveY =
            (
              distanceY
              /
              rect.height
            )
            *
            strength;


          item.style.setProperty(
            "--mx",
            `${moveX}px`
          );


          item.style.setProperty(
            "--my",
            `${moveY}px`
          );

        }
      );


      item.addEventListener(
        "pointerleave",
        () => {

          resetMagneticItem(
            item
          );

        }
      );

    }
  );

}


/* =========================================================
   RESET ONE ITEM
========================================================= */

function resetMagneticItem(
  item
) {

  item.style.setProperty(
    "--mx",
    "0px"
  );


  item.style.setProperty(
    "--my",
    "0px"
  );

}


/* =========================================================
   RESET ALL MAGNETIC ITEMS
========================================================= */

function resetAllMagneticItems() {

  document
    .querySelectorAll(
      ".magnetic"
    )
    .forEach(
      resetMagneticItem
    );

}


/* =========================================================
   SUBTLE STAGE POINTER DEPTH
========================================================= */

function initializeStagePointer() {

  if (!pointerDevice.matches) {
    return;
  }


  stage.addEventListener(
    "pointermove",
    (event) => {

      /*
        Again: only before the organization
        phase begins.
      */

      if (
        story.dataset.phase ===
        "organized"
      ) {

        resetAllMagneticItems();

        return;

      }


      const rect =
        stage.getBoundingClientRect();


      const x =
        (
          event.clientX
          -
          rect.left
        )
        /
        rect.width;


      const y =
        (
          event.clientY
          -
          rect.top
        )
        /
        rect.height;


      const nx =
        (x - 0.5) * 2;


      const ny =
        (y - 0.5) * 2;


      /*
        Very subtle image drift.

        This is intentionally small.
        The cursor should make the composition
        feel alive, not difficult to control.
      */

      gsap.to(
        ".piece-video img",
        {
          x:
            nx * -4,

          y:
            ny * -4,

          duration:
            0.7,

          overwrite:
            "auto"
        }
      );


      gsap.to(
        ".piece-image img",
        {
          x:
            nx * 5,

          y:
            ny * 4,

          duration:
            0.7,

          overwrite:
            "auto"
        }
      );

    }
  );


  stage.addEventListener(
    "pointerleave",
    () => {

      resetAllMagneticItems();


      gsap.to(
        [
          ".piece-video img",
          ".piece-image img"
        ],
        {
          x: 0,
          y: 0,

          duration:
            0.7,

          overwrite:
            "auto"
        }
      );

    }
  );

}


/* =========================================================
   MOBILE FALLBACK
========================================================= */

function prepareMobile() {

  if (desktop.matches) {
    return;
  }


  /*
    GSAP inline styles could remain after
    resizing from desktop to mobile.

    clearProps prevents that.
  */

  gsap.set(
    [
      scatteredCopy,
      organizedCopy,
      organizationField,
      grid,
      schedule,
      publishingCopy,
      publishSignal,
      finalWords,

      pieces.video,
      pieces.image,
      pieces.scene,
      pieces.caption,
      pieces.hashtags,

      scheduledOne,
      scheduledTwo,
      scheduledThree
    ],
    {
      clearProps:
        "all"
    }
  );


  timelineProgress.style.width =
    "100%";


  progressFill.style.width =
    "100%";

}


/* =========================================================
   GSAP MATCH MEDIA

   Handles desktop/mobile transitions cleanly.
========================================================= */

const gsapMedia =
  gsap.matchMedia();


gsapMedia.add(
  "(min-width: 901px)",
  () => {

    buildScrollStory();


    /*
      ScrollTrigger refresh after fonts/images
      have had an opportunity to affect layout.
    */

    requestAnimationFrame(
      () => {

        ScrollTrigger.refresh();

      }
    );


    return () => {

      resetAllMagneticItems();

    };

  }
);


gsapMedia.add(
  "(max-width: 900px)",
  () => {

    prepareMobile();

  }
);


/* =========================================================
   INITIALIZE POINTER
========================================================= */

initializeMagneticInteraction();

initializeStagePointer();


/* =========================================================
   IMAGES LOADED → REFRESH
========================================================= */

window.addEventListener(
  "load",
  () => {

    if (
      desktop.matches
    ) {

      ScrollTrigger.refresh();

    }

  }
);