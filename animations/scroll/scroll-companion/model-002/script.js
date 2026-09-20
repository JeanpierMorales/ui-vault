gsap.registerPlugin(
  ScrollTrigger
);


/* =========================================================
   ELEMENTS
========================================================= */

const experience =
  document.querySelector(
    "#experience"
  );

const card =
  document.querySelector(
    "#morph-card"
  );

const front =
  document.querySelector(
    ".card-front"
  );

const content =
  document.querySelector(
    ".card-content"
  );

const dot =
  document.querySelector(
    ".persistent-dot"
  );

const hole =
  document.querySelector(
    ".frame-hole"
  );

const sideRight =
  document.querySelector(
    ".card-side-right"
  );

const sideBottom =
  document.querySelector(
    ".card-side-bottom"
  );

const progressFill =
  document.querySelector(
    "#progress-fill"
  );

const progressValue =
  document.querySelector(
    "#progress-value"
  );

const progressStep =
  document.querySelector(
    "#progress-step"
  );


/* =========================================================
   HELPERS
========================================================= */

function clamp(
  value,
  min = 0,
  max = 1
) {

  return Math.max(
    min,
    Math.min(
      max,
      value
    )
  );

}


/* =========================================================
   MAP RANGE

   Convierte:

   inputStart → inputEnd

   en:

   0 → 1
========================================================= */

function range(
  value,
  inputStart,
  inputEnd
) {

  return clamp(
    (
      value -
      inputStart
    )
    /
    (
      inputEnd -
      inputStart
    )
  );

}


/* =========================================================
   SMOOTHSTEP

   Misma interpolación al bajar y subir.

   No depende del tiempo.
========================================================= */

function smoothstep(t) {

  t =
    clamp(t);

  return (
    t *
    t *
    (
      3 -
      2 * t
    )
  );

}


/* =========================================================
   LERP
========================================================= */

function lerp(
  start,
  end,
  amount
) {

  return (
    start +
    (
      end -
      start
    )
    *
    amount
  );

}


/* =========================================================
   POINTER
========================================================= */

const pointer = {

  x: 0,

  y: 0,

  targetX: 0,

  targetY: 0

};


window.addEventListener(
  "pointermove",
  event => {

    pointer.targetX =
      (
        event.clientX /
        window.innerWidth
        -
        0.5
      );

    pointer.targetY =
      (
        event.clientY /
        window.innerHeight
        -
        0.5
      );

  }
);


window.addEventListener(
  "pointerleave",
  () => {

    pointer.targetX = 0;

    pointer.targetY = 0;

  }
);


/* =========================================================
   SCROLL PROGRESS
========================================================= */

let progress = 0;


/* =========================================================
   SCROLLTRIGGER

   Solo obtenemos progress 0 → 1.

   Toda la animación se calcula nosotros.
========================================================= */

ScrollTrigger.create({

  trigger:
    ".scroll-space",

  start:
    "top bottom",

  end:
    "bottom bottom",

  onUpdate(self) {

    progress =
      self.progress;

  }

});


/* =========================================================
   STATE LABEL
========================================================= */

function updateStateLabel(
  p
) {

  if (
    p < 0.25
  ) {

    progressStep.textContent =
      "Card";

  }

  else if (
    p < 0.52
  ) {

    progressStep.textContent =
      "Block";

  }

  else if (
    p < 0.76
  ) {

    progressStep.textContent =
      "Frame";

  }

  else {

    progressStep.textContent =
      "Section";

  }

}


/* =========================================================
   MAIN MORPH
========================================================= */

function updateMorph() {

  const p =
    progress;


  /* =====================================================
     01 — CARD

     0 → 25%
  ====================================================== */

  const cardPhase =
    smoothstep(
      range(
        p,
        0,
        0.25
      )
    );


  /*
    Very subtle entrance / stability.
  */

  const cardScale =
    lerp(
      0.96,
      1,
      cardPhase
    );


  /* =====================================================
     02 — CARD → BLOCK

     20% → 48%
  ====================================================== */

  const blockPhase =
    smoothstep(
      range(
        p,
        0.20,
        0.48
      )
    );


  /*
    Content disappears.
  */

  const contentOpacity =
    1 -
    smoothstep(
      range(
        p,
        0.18,
        0.34
      )
    );


  /*
    Fake depth appears.
  */

  const depthOpacity =
    smoothstep(
      range(
        p,
        0.23,
        0.41
      )
    );


  /*
    Rotate card into physical block.
  */

  const rotateX =
    lerp(
      0,
      -8,
      blockPhase
    );


  const rotateY =
    lerp(
      0,
      -19,
      blockPhase
    );


  const rotateZ =
    lerp(
      0,
      -3,
      blockPhase
    );


  /*
    Card becomes shorter / more object-like.
  */

  const scaleYBlock =
    lerp(
      1,
      0.72,
      blockPhase
    );


  const scaleXBlock =
    lerp(
      1,
      0.88,
      blockPhase
    );


  /* =====================================================
     03 — BLOCK → FRAME

     45% → 73%
  ====================================================== */

  const framePhase =
    smoothstep(
      range(
        p,
        0.45,
        0.73
      )
    );


  /*
    Return towards flat plane.
  */

  const finalRotateX =
    lerp(
      rotateX,
      0,
      framePhase
    );


  const finalRotateY =
    lerp(
      rotateY,
      0,
      framePhase
    );


  const finalRotateZ =
    lerp(
      rotateZ,
      0,
      framePhase
    );


  /*
    Expand again horizontally.
  */

  const frameScaleX =
    lerp(
      scaleXBlock,
      1.22,
      framePhase
    );


  const frameScaleY =
    lerp(
      scaleYBlock,
      0.65,
      framePhase
    );


  /*
    Frame center opens.
  */

  const holeWidth =
    lerp(
      0,
      76,
      framePhase
    );


  const holeHeight =
    lerp(
      0,
      67,
      framePhase
    );


  /*
    Fake depth disappears again.
  */

  const finalDepth =
    depthOpacity *
    (
      1 -
      framePhase
    );


  /* =====================================================
     04 — FRAME → SECTION

     70% → 100%
  ====================================================== */

  const sectionPhase =
    smoothstep(
      range(
        p,
        0.70,
        1
      )
    );


  /*
    Expands aggressively toward viewport.
  */

  const sectionScaleX =
    lerp(
      frameScaleX,
      2.35,
      sectionPhase
    );


  const sectionScaleY =
    lerp(
      frameScaleY,
      1.55,
      sectionPhase
    );


  /*
    Bring frame forward.
  */

  const translateY =
    lerp(
      0,
      35,
      sectionPhase
    );


  /*
    Border radius reduces.
  */

  const radius =
    lerp(
      34,
      12,
      sectionPhase
    );


  /*
    Hole expands until almost entire center.
  */

  const finalHoleWidth =
    lerp(
      holeWidth,
      90,
      sectionPhase
    );


  const finalHoleHeight =
    lerp(
      holeHeight,
      84,
      sectionPhase
    );


  /* =====================================================
     POINTER TILT

     Only strong while still a card.
  ====================================================== */

  const pointerStrength =
    1 -
    smoothstep(
      range(
        p,
        0.15,
        0.42
      )
    );


  const pointerRotateX =
    (
      -pointer.y *
      4
    )
    *
    pointerStrength;


  const pointerRotateY =
    (
      pointer.x *
      5
    )
    *
    pointerStrength;


  /* =====================================================
     FINAL TRANSFORM
  ====================================================== */

  gsap.set(
    card,
    {

      scaleX:
        sectionScaleX *
        cardScale,

      scaleY:
        sectionScaleY *
        cardScale,

      rotationX:
        finalRotateX +
        pointerRotateX,

      rotationY:
        finalRotateY +
        pointerRotateY,

      rotationZ:
        finalRotateZ,

      y:
        translateY,

      transformPerspective:
        1500,

      transformOrigin:
        "center center"

    }
  );


  /* =====================================================
     FRONT
  ====================================================== */

  gsap.set(
    front,
    {

      borderRadius:
        `${radius}px`,

      boxShadow:
        `
        0 ${
          lerp(
            70,
            25,
            sectionPhase
          )
        }px
        ${
          lerp(
            150,
            60,
            sectionPhase
          )
        }px
        rgba(
          0,
          0,
          0,
          ${
            lerp(
              0.32,
              0.18,
              sectionPhase
            )
          }
        )
        `

    }
  );


  /* =====================================================
     CONTENT
  ====================================================== */

  gsap.set(
    content,
    {

      opacity:
        contentOpacity,

      y:
        lerp(
          0,
          -20,
          1 -
          contentOpacity
        ),

      scale:
        lerp(
          1,
          0.96,
          1 -
          contentOpacity
        )

    }
  );


  /* =====================================================
     PERSISTENT DOT

     Unlike the other content,
     this never fully disappears.
  ====================================================== */

  const dotPhase =
    smoothstep(
      range(
        p,
        0.25,
        0.75
      )
    );


  gsap.set(
    dot,
    {

      opacity:
        1,

      x:
        lerp(
          0,
          145,
          dotPhase
        ),

      y:
        lerp(
          0,
          -55,
          dotPhase
        ),

      scale:
        lerp(
          1,
          1.45,
          dotPhase
        )

    }
  );


  /* =====================================================
     SIDES
  ====================================================== */

  gsap.set(
    sideRight,
    {

      opacity:
        finalDepth

    }
  );


  gsap.set(
    sideBottom,
    {

      opacity:
        finalDepth

    }
  );


  /* =====================================================
     FRAME HOLE
  ====================================================== */

  gsap.set(
    hole,
    {

      width:
        `${finalHoleWidth}%`,

      height:
        `${finalHoleHeight}%`,

      opacity:
        framePhase,

      borderRadius:
        `${lerp(
          18,
          8,
          sectionPhase
        )}px`

    }
  );


  /* =====================================================
     PROGRESS UI
  ====================================================== */

  progressFill.style.width =
    `${p * 100}%`;


  progressValue.textContent =
    `${Math.round(
      p * 100
    )}%`;


  updateStateLabel(
    p
  );

}


/* =========================================================
   ANIMATION LOOP

   Scroll itself controls progress.

   Pointer gets smoothing separately.
========================================================= */

function animate() {

  pointer.x =
    lerp(
      pointer.x,
      pointer.targetX,
      0.06
    );


  pointer.y =
    lerp(
      pointer.y,
      pointer.targetY,
      0.06
    );


  updateMorph();


  requestAnimationFrame(
    animate
  );

}


/* =========================================================
   RESIZE
========================================================= */

let resizeTimer;


window.addEventListener(
  "resize",
  () => {

    clearTimeout(
      resizeTimer
    );


    resizeTimer =
      setTimeout(
        () => {

          ScrollTrigger.refresh();

        },
        120
      );

  }
);


/* =========================================================
   START
========================================================= */

updateMorph();

animate();