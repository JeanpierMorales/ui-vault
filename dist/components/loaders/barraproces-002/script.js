const steps =
  document.querySelectorAll(".progress-step");

const details =
  document.querySelectorAll(".step-detail");

const progressFill =
  document.getElementById("progressFill");

const currentStatus =
  document.getElementById("currentStatus");

const progressPercentage =
  document.getElementById("progressPercentage");

const prevBtn =
  document.getElementById("prevBtn");

const nextBtn =
  document.getElementById("nextBtn");


const processData = [
  {
    title: "Solicitud recibida",
    percentage: 25
  },

  {
    title: "En revisión",
    percentage: 50
  },

  {
    title: "Procesamiento",
    percentage: 75
  },

  {
    title: "Finalizado",
    percentage: 100
  }
];


/*
   Empieza en el segundo paso,
   igual que la referencia.
*/

let currentStep = 1;


/* ======================================================
   UPDATE
====================================================== */

function updateProgress() {

  steps.forEach(
    (step, index) => {

      step.classList.remove(
        "completed",
        "active"
      );

      if (index < currentStep) {
        step.classList.add(
          "completed"
        );
      }

      if (index === currentStep) {
        step.classList.add(
          "active"
        );
      }

    }
  );


  details.forEach(
    (detail, index) => {

      detail.classList.remove(
        "completed",
        "active"
      );

      if (index < currentStep) {
        detail.classList.add(
          "completed"
        );
      }

      if (index === currentStep) {
        detail.classList.add(
          "active"
        );
      }

    }
  );


  /*
     0 = 0%
     1 = 33%
     2 = 66%
     3 = 100%
  */

  const lineProgress =
    currentStep /
    (steps.length - 1);


  const mobile =
    window.innerWidth <= 760;


  if (mobile) {

    progressFill.style.width =
      "4px";

    progressFill.style.height =
      `${lineProgress * 100}%`;

  } else {

    progressFill.style.height =
      "4px";

    progressFill.style.width =
      `${lineProgress * 100}%`;

  }


  /*
     Status
  */

  animateText(
    currentStatus,
    processData[currentStep].title
  );


  animateText(
    progressPercentage,
    `${processData[currentStep].percentage}%`
  );


  /*
     Buttons
  */

  prevBtn.disabled =
    currentStep === 0;


  if (
    currentStep ===
    steps.length - 1
  ) {

    nextBtn.innerHTML = `
      Finalizado
      <i class="fa-solid fa-check"></i>
    `;

  } else {

    nextBtn.innerHTML = `
      Continuar
      <i class="fa-solid fa-arrow-right"></i>
    `;

  }

}


/* ======================================================
   TEXT ANIMATION
====================================================== */

function animateText(
  element,
  text
) {

  element.style.opacity = "0";

  element.style.transform =
    "translateY(5px)";


  setTimeout(() => {

    element.textContent =
      text;

    element.style.opacity =
      "1";

    element.style.transform =
      "translateY(0)";

  }, 150);

}


/* ======================================================
   NEXT
====================================================== */

nextBtn.addEventListener(
  "click",
  () => {

    if (
      currentStep <
      steps.length - 1
    ) {

      currentStep++;

      updateProgress();

    }

  }
);


/* ======================================================
   PREVIOUS
====================================================== */

prevBtn.addEventListener(
  "click",
  () => {

    if (
      currentStep > 0
    ) {

      currentStep--;

      updateProgress();

    }

  }
);


/* ======================================================
   CLICK STEP
====================================================== */

steps.forEach(
  (step, index) => {

    step.addEventListener(
      "click",
      () => {

        currentStep =
          index;

        updateProgress();

      }
    );

  }
);


/* ======================================================
   RESIZE
====================================================== */

window.addEventListener(
  "resize",
  updateProgress
);


/* ======================================================
   INITIAL
====================================================== */

updateProgress();