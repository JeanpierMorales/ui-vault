/* =========================================================
   MIRA — SCROLL STORYTELLING
========================================================= */

const section =
  document.querySelector(".how-section");

const steps =
  [...document.querySelectorAll(".step")];

const visuals =
  [...document.querySelectorAll(".visual")];

const progressLines =
  [...document.querySelectorAll(".progress-line")];

const counter =
  document.getElementById("currentStep");


let currentStep = 0;


/* =========================================================
   ACTIVATE STEP
========================================================= */

function activateStep(index) {

  if (
    index === currentStep &&
    steps[index].classList.contains("active")
  ) {
    return;
  }


  const previousStep =
    currentStep;


  currentStep = index;



  /* =========================
     TEXT
  ========================= */

  steps.forEach((step, i) => {

    step.classList.remove(
      "active",
      "exit-up"
    );


    if (i === index) {

      step.classList.add("active");

    }

    else if (i < index) {

      step.classList.add("exit-up");

    }

  });



  /* =========================
     VISUALS
  ========================= */

  visuals.forEach((visual, i) => {

    visual.classList.remove(
      "active",
      "exit-left"
    );


    if (i === index) {

      visual.classList.add("active");

    }

    else if (i < index) {

      visual.classList.add("exit-left");

    }

  });



  /* =========================
     PROGRESS
  ========================= */

  progressLines.forEach((line, i) => {

    line.classList.toggle(
      "active",
      i <= index
    );

  });



  /* =========================
     COUNTER
  ========================= */

  counter.textContent =
    String(index + 1).padStart(2, "0");

}



/* =========================================================
   SCROLL
========================================================= */

function updateScroll() {

  /*
    On mobile we disable the sticky behavior.
  */

  if (window.innerWidth <= 820) {
    return;
  }


  const rect =
    section.getBoundingClientRect();


  const scrollableDistance =
    section.offsetHeight -
    window.innerHeight;


  /*
    Distance travelled inside this section.
  */

  const travelled =
    Math.min(
      Math.max(-rect.top, 0),
      scrollableDistance
    );


  /*
    Normalize between 0 and 1.
  */

  const progress =
    scrollableDistance > 0
      ? travelled / scrollableDistance
      : 0;


  /*
    Divide the experience into 3 stages.

    0.00 → 0.33 = Step 1
    0.33 → 0.66 = Step 2
    0.66 → 1.00 = Step 3
  */

  let index = 0;


  if (progress >= 0.66) {

    index = 2;

  }

  else if (progress >= 0.33) {

    index = 1;

  }


  activateStep(index);

}



/* =========================================================
   OPTIMIZED SCROLL LOOP
========================================================= */

let ticking = false;


window.addEventListener(
  "scroll",
  () => {

    if (!ticking) {

      window.requestAnimationFrame(() => {

        updateScroll();

        ticking = false;

      });


      ticking = true;

    }

  },
  {
    passive: true
  }
);



/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
  "resize",
  updateScroll
);



/* =========================================================
   INITIALIZE
========================================================= */

activateStep(0);

updateScroll();