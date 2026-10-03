/* =========================================================
   MIRA — PUBLISHING FLOW
========================================================= */

gsap.registerPlugin(
  ScrollTrigger
);


/* =========================================================
   ELEMENTS
========================================================= */

const story =
  document.querySelector(
    "#miraFlow"
  );

const stage =
  document.querySelector(
    "#flowStage"
  );


const introCopy =
  document.querySelector(
    "#introCopy"
  );


const assets = {

  video:
    document.querySelector(
      "#assetVideo"
    ),

  image:
    document.querySelector(
      "#assetImage"
    ),

  scene:
    document.querySelector(
      "#assetScene"
    ),

  caption:
    document.querySelector(
      "#assetCaption"
    )

};


const contextStates =
  [
    ...document.querySelectorAll(
      ".context-state"
    )
  ];


const actionScenes =
  [
    ...document.querySelectorAll(
      ".action-scene"
    )
  ];


const nodes =
  [
    ...document.querySelectorAll(
      ".rail-node"
    )
  ];


const railSystem =
  document.querySelector(
    "#railSystem"
  );


const railProgress =
  document.querySelector(
    "#railProgress"
  );


const railOrb =
  document.querySelector(
    "#railOrb"
  );


const scheduleGeometry =
  document.querySelector(
    "#scheduleGeometry"
  );


const accountGeometry =
  document.querySelector(
    "#accountGeometry"
  );


const finalState =
  document.querySelector(
    "#finalState"
  );


const desktop =
  window.matchMedia(
    "(min-width: 901px)"
  );


/* =========================================================
   UI STATE
========================================================= */

let currentStage = -1;


/* =========================================================
   CHANGE ACTIVE STAGE
========================================================= */

function updateInterface(
  index
) {

  if (
    currentStage === index
  ) {
    return;
  }


  currentStage = index;


  /* =======================================================
     CONTEXT COPY
  ======================================================== */

  contextStates.forEach(
    (item, i) => {

      if (i === index) {

        gsap.set(
          item,
          {
            visibility:
              "visible"
          }
        );


        gsap.to(
          item,
          {
            opacity: 1,

            y: 0,

            filter:
              "blur(0px)",

            duration: 0.55,

            ease:
              "power3.out",

            overwrite:
              true
          }
        );

      }

      else {

        gsap.to(
          item,
          {
            opacity: 0,

            y: -18,

            filter:
              "blur(6px)",

            duration: 0.3,

            ease:
              "power2.out",

            overwrite:
              true,

            onComplete() {

              if (
                currentStage !== i
              ) {

                gsap.set(
                  item,
                  {
                    visibility:
                      "hidden",

                    y: 24
                  }
                );

              }

            }

          }
        );

      }

    }
  );


  /* =======================================================
     ACTION VISUAL
  ======================================================== */

  actionScenes.forEach(
    (item, i) => {

      if (i === index) {

        gsap.set(
          item,
          {
            visibility:
              "visible"
          }
        );


        gsap.to(
          item,
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
          item,
          {
            opacity: 0,

            y: -12,

            filter:
              "blur(5px)",

            duration: 0.25,

            overwrite:
              true,

            onComplete() {

              if (
                currentStage !== i
              ) {

                gsap.set(
                  item,
                  {
                    visibility:
                      "hidden",

                    y: 16
                  }
                );

              }

            }

          }
        );

      }

    }
  );


  /* =======================================================
     NODES
  ======================================================== */

  nodes.forEach(
    (node, i) => {

      node.classList.toggle(
        "active",
        i === index
      );


      node.classList.toggle(
        "complete",
        i < index
      );

    }
  );

}


/* =========================================================
   MASTER STORY
========================================================= */

function buildDesktopStory() {

  /* =======================================================
     INITIAL STATES
  ======================================================== */

  gsap.set(
    railSystem,
    {
      opacity: 0,
      y: 40
    }
  );


  gsap.set(
    ".ambient-grid",
    {
      opacity: 0
    }
  );


  gsap.set(
    contextStates,
    {
      opacity: 0,

      visibility:
        "hidden",

      y: 25,

      filter:
        "blur(7px)"
    }
  );


  gsap.set(
    actionScenes,
    {
      opacity: 0,

      visibility:
        "hidden",

      y: 16,

      filter:
        "blur(5px)"
    }
  );


  gsap.set(
    scheduleGeometry,
    {
      opacity: 0
    }
  );


  gsap.set(
    accountGeometry,
    {
      opacity: 0
    }
  );


  gsap.set(
    ".schedule-stem",
    {
      height: 0
    }
  );


  gsap.set(
    ".schedule-day",
    {
      opacity: 0,
      y: 10
    }
  );


  gsap.set(
    ".branch-account",
    {
      opacity: 0,
      x: -8
    }
  );


  gsap.set(
    finalState,
    {
      opacity: 0
    }
  );


  gsap.set(
    ".final-copy",
    {
      opacity: 0,
      y: 40,
      filter:
        "blur(10px)"
    }
  );


  gsap.set(
    ".final-status",
    {
      opacity: 0,
      y: 15
    }
  );


  gsap.set(
    ".final-ring",
    {
      opacity: 0,
      scale: 0.45
    }
  );


  /* =======================================================
     TIMELINE
  ======================================================== */

  const tl =
    gsap.timeline({

      scrollTrigger: {

        trigger:
          story,

        start:
          "top top",

        end:
          "bottom bottom",

        scrub:
          1,

        invalidateOnRefresh:
          true,

        onUpdate(self) {

          const progress =
            self.progress;


          /*
            Pointer interaction only belongs
            to the scattered opening state.
          */

          story.dataset.free =
            progress < 0.15
              ? "true"
              : "false";


          /*
            Determine active rail concept.
          */

          if (
            progress >= 0.73
          ) {

            updateInterface(3);

          }

          else if (
            progress >= 0.56
          ) {

            updateInterface(2);

          }

          else if (
            progress >= 0.39
          ) {

            updateInterface(1);

          }

          else if (
            progress >= 0.21
          ) {

            updateInterface(0);

          }

        }

      }

    });


  /* =======================================================
     OPENING HOLD
  ======================================================== */

  tl.to(
    {},
    {
      duration: 0.7
    }
  );


  /* =======================================================
     SCATTERED → CAMPAIGN
  ======================================================== */

  tl.to(
    introCopy,
    {
      opacity: 0,

      y: -35,

      filter:
        "blur(8px)",

      duration: 0.55
    },

    "organize"
  );


  tl.to(
    ".ambient-grid",
    {
      opacity: 1,

      duration: 0.8
    },

    "organize+=0.1"
  );


  /*
    VIDEO
  */

  tl.to(
    assets.video,
    {
      top: "47%",
      left: "31%",

      width: 145,
      height: 175,

      rotation: 0,

      duration: 1.15,

      ease:
        "power3.inOut"
    },

    "organize"
  );


  /*
    IMAGE
  */

  tl.to(
    assets.image,
    {
      top: "47%",
      right: "31%",

      width: 145,
      height: 175,

      rotation: 0,

      duration: 1.15,

      ease:
        "power3.inOut"
    },

    "organize+=0.04"
  );


  /*
    SCENE
  */

  tl.to(
    assets.scene,
    {
      top: "47%",
      left: "50%",

      xPercent: -50,

      width: 225,

      rotation: 0,

      duration: 1.1,

      ease:
        "power3.inOut"
    },

    "organize+=0.08"
  );


  /*
    CAPTION folds into the campaign.
  */

  tl.to(
    assets.caption,
    {
      right: "50%",
      bottom: "18%",

      xPercent: 50,

      opacity: 0,

      scale: 0.7,

      rotation: 0,

      duration: 0.85
    },

    "organize+=0.15"
  );


  /*
    Context copy begins.
  */

  tl.call(
    () => {
      updateInterface(0);
    },
    [],
    "organize+=0.65"
  );


  /*
    Rail appears.
  */

  tl.to(
    railSystem,
    {
      opacity: 1,
      y: 0,

      duration: 0.75,

      ease:
        "power3.out"
    },

    "organize+=0.7"
  );


  /*
    Assets collapse into CONTENT.
  */

  tl.to(
    [
      assets.video,
      assets.image,
      assets.scene
    ],
    {
      opacity: 0,

      scale: 0.65,

      y: 100,

      duration: 0.65,

      stagger: 0.05,

      ease:
        "power2.in"
    },

    "organize+=1.15"
  );


  /* =======================================================
     CONTENT HOLD
  ======================================================== */

  tl.to(
    {},
    {
      duration: 0.45
    }
  );


  /* =======================================================
     CONTENT → SCHEDULE
  ======================================================== */

  tl.call(
    () => {
      updateInterface(1);
    }
  );


  tl.to(
    railProgress,
    {
      width: "35%",

      duration: 1,

      ease:
        "none"
    },

    "schedule"
  );


  tl.to(
    railOrb,
    {
      left: "35%",

      duration: 1,

      ease:
        "none"
    },

    "schedule"
  );


  /*
    Schedule geometry emerges directly
    from the rail.
  */

  tl.to(
    scheduleGeometry,
    {
      opacity: 1,

      duration: 0.25
    },

    "schedule+=0.2"
  );


  tl.to(
    ".schedule-stem",
    {
      height: 48,

      duration: 0.6,

      stagger: 0.09,

      ease:
        "power3.out"
    },

    "schedule+=0.25"
  );


  tl.to(
    ".schedule-day",
    {
      opacity: 1,

      y: 0,

      duration: 0.45,

      stagger: 0.1,

      ease:
        "power3.out"
    },

    "schedule+=0.45"
  );


  tl.to(
    {},
    {
      duration: 0.55
    }
  );


  /* =======================================================
     SCHEDULE → ACCOUNTS
  ======================================================== */

  tl.call(
    () => {
      updateInterface(2);
    }
  );


  tl.to(
    scheduleGeometry,
    {
      opacity: 0,

      y: -15,

      duration: 0.4
    },

    "accounts"
  );


  tl.to(
    railProgress,
    {
      width: "67%",

      duration: 1,

      ease:
        "none"
    },

    "accounts"
  );


  tl.to(
    railOrb,
    {
      left: "67%",

      duration: 1,

      ease:
        "none"
    },

    "accounts"
  );


  /*
    Branch geometry appears.
  */

  tl.to(
    accountGeometry,
    {
      opacity: 1,

      duration: 0.25
    },

    "accounts+=0.3"
  );


  tl.fromTo(
    ".branch",

    {
      scaleY: 0
    },

    {
      scaleY: 1,

      duration: 0.6,

      stagger: 0.08,

      transformOrigin:
        "bottom center",

      ease:
        "power3.out"
    },

    "accounts+=0.35"
  );


  tl.to(
    ".branch-account",
    {
      opacity: 1,

      x: 0,

      duration: 0.45,

      stagger: 0.09,

      ease:
        "power3.out"
    },

    "accounts+=0.55"
  );


  tl.to(
    {},
    {
      duration: 0.55
    }
  );


  /* =======================================================
     ACCOUNTS → PUBLISH
  ======================================================== */

  tl.call(
    () => {
      updateInterface(3);
    }
  );


  tl.to(
    accountGeometry,
    {
      opacity: 0,

      duration: 0.4
    },

    "publish"
  );


  tl.to(
    railProgress,
    {
      width: "100%",

      duration: 1,

      ease:
        "none"
    },

    "publish"
  );


  tl.to(
    railOrb,
    {
      left: "96%",

      duration: 1,

      ease:
        "none"
    },

    "publish"
  );


  /*
    Rail begins to disappear after
    reaching the final point.
  */

  tl.to(
    railSystem,
    {
      opacity: 0,

      scale: 0.97,

      filter:
        "blur(7px)",

      duration: 0.7
    },

    "publish+=1"
  );


  tl.to(
    ".ambient-grid",
    {
      opacity: 0,

      duration: 0.5
    },

    "publish+=1"
  );


  /* =======================================================
     FINAL STATE
  ======================================================== */

  tl.to(
    finalState,
    {
      opacity: 1,

      duration: 0.5
    },

    "final"
  );


  tl.to(
    ".final-ring--1",
    {
      opacity: 1,
      scale: 1,

      duration: 0.65,

      ease:
        "power3.out"
    },

    "final+=0.05"
  );


  tl.to(
    ".final-ring--2",
    {
      opacity: 1,
      scale: 1,

      duration: 0.8,

      ease:
        "power3.out"
    },

    "final+=0.17"
  );


  tl.to(
    ".final-ring--3",
    {
      opacity: 1,
      scale: 1,

      duration: 1,

      ease:
        "power3.out"
    },

    "final+=0.3"
  );


  /*
    Rings become background architecture.
  */

  tl.to(
    ".final-signal",
    {
      opacity: 0.16,

      scale: 1.25,

      duration: 0.8
    },

    "final+=0.75"
  );


  /*
    Final statement.
  */

  tl.to(
    ".final-copy",
    {
      opacity: 1,

      y: 0,

      filter:
        "blur(0px)",

      duration: 0.85,

      ease:
        "power3.out"
    },

    "final+=0.7"
  );


  /*
    Status sequence.
  */

  tl.to(
    ".final-status",
    {
      opacity: 1,

      y: 0,

      duration: 0.65,

      ease:
        "power3.out"
    },

    "final+=1.05"
  );


  /*
    Final breathing room.
  */

  tl.to(
    {},
    {
      duration: 1.1
    }
  );


  return tl;

}


/* =========================================================
   MAGNETIC POINTER
========================================================= */

const pointerDevice =
  window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  );


function resetMagnetic(
  element
) {

  element.style.setProperty(
    "--mx",
    "0px"
  );


  element.style.setProperty(
    "--my",
    "0px"
  );

}


/* =========================================================
   MAGNETIC ASSETS
========================================================= */

function initializeMagnetic() {

  if (
    !pointerDevice.matches
  ) {
    return;
  }


  const items =
    document.querySelectorAll(
      ".magnetic"
    );


  items.forEach(
    (item) => {

      item.addEventListener(
        "pointermove",
        (event) => {

          if (
            story.dataset.free !==
            "true"
          ) {

            resetMagnetic(
              item
            );

            return;
          }


          const rect =
            item.getBoundingClientRect();


          const x =
            event.clientX
            -
            (
              rect.left
              +
              rect.width / 2
            );


          const y =
            event.clientY
            -
            (
              rect.top
              +
              rect.height / 2
            );


          const strength =
            Number(
              item.dataset.strength
              ||
              8
            );


          const moveX =
            (
              x
              /
              rect.width
            )
            *
            strength;


          const moveY =
            (
              y
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

          resetMagnetic(
            item
          );

        }
      );

    }
  );

}


/* =========================================================
   STAGE POINTER DEPTH
========================================================= */

function initializeStageDepth() {

  if (
    !pointerDevice.matches
  ) {
    return;
  }


  stage.addEventListener(
    "pointermove",
    (event) => {

      if (
        story.dataset.free !==
        "true"
      ) {
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


      const normalizedX =
        (x - 0.5) * 2;


      const normalizedY =
        (y - 0.5) * 2;


      gsap.to(
        ".ambient-circle--one",
        {
          x:
            normalizedX * 8,

          y:
            normalizedY * 6,

          duration: 1,

          ease:
            "power3.out",

          overwrite:
            "auto"
        }
      );


      gsap.to(
        ".ambient-circle--two",
        {
          x:
            normalizedX * -6,

          y:
            normalizedY * -5,

          duration: 1,

          ease:
            "power3.out",

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

  const clearTargets = [

    introCopy,

    railSystem,

    scheduleGeometry,

    accountGeometry,

    finalState,

    assets.video,

    assets.image,

    assets.scene,

    assets.caption

  ];


  gsap.set(
    clearTargets,
    {
      clearProps:
        "all"
    }
  );


  /*
    Mobile shows the complete rail as
    a vertical editorial sequence.
  */

  nodes.forEach(
    node => {

      node.classList.add(
        "complete"
      );

    }
  );

}


/* =========================================================
   MATCH MEDIA
========================================================= */

const mm =
  gsap.matchMedia();


mm.add(
  "(min-width: 901px)",
  () => {

    const timeline =
      buildDesktopStory();


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


mm.add(
  "(max-width: 900px)",
  () => {

    prepareMobile();

  }
);


/* =========================================================
   POINTER
========================================================= */

initializeMagnetic();

initializeStageDepth();


/* =========================================================
   REFRESH AFTER ASSETS LOAD
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