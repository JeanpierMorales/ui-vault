const steps = document.querySelectorAll(".step");

const progressLine = document.getElementById("progressLine");

const currentStepText = document.getElementById("currentStepText");
const percentageText = document.getElementById("percentageText");

const cardContent = document.getElementById("cardContent");
const cardStepNumber = document.getElementById("cardStepNumber");
const cardTitle = document.getElementById("cardTitle");
const cardDescription = document.getElementById("cardDescription");

const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const nextButtonText = document.getElementById("nextButtonText");


/* =========================================================
   DATA
========================================================= */

const processData = [
  {
    number: "01",
    title: "Datos básicos",
    description:
      "Completa la información principal necesaria para continuar con el proceso."
  },

  {
    number: "02",
    title: "Configuración",
    description:
      "Selecciona tus preferencias y define cómo quieres utilizar el servicio."
  },

  {
    number: "03",
    title: "Revisión",
    description:
      "Comprueba cuidadosamente la información antes de confirmar. Puedes regresar y modificar cualquier dato."
  },

  {
    number: "04",
    title: "Proceso completado",
    description:
      "La configuración ha finalizado correctamente. Toda la información ha sido registrada."
  }
];


let currentStep = 0;
let isAnimating = false;


/* =========================================================
   UPDATE
========================================================= */

function updateProcess(previousStep = currentStep) {

  const direction =
    currentStep >= previousStep
      ? "forward"
      : "back";


  /* STEPS */

  steps.forEach((step, index) => {

    step.classList.remove(
      "active",
      "completed"
    );

    step.removeAttribute("aria-current");


    if (index < currentStep) {
      step.classList.add("completed");
    }

    if (index === currentStep) {
      step.classList.add("active");
      step.setAttribute("aria-current", "step");
    }

  });


  /* =====================================================
     PROGRESS LINE
  ===================================================== */

  const progress =
    currentStep / (steps.length - 1);

  const mobile =
    window.innerWidth <= 760;


  if (mobile) {

    progressLine.style.width = "2px";

    progressLine.style.height =
      `${progress * 100}%`;

  } else {

    progressLine.style.height = "2px";

    progressLine.style.width =
      `${progress * 100}%`;

  }


  /* =====================================================
     HEADER INFO
  ===================================================== */

  const percentage =
    Math.round(
      ((currentStep + 1) / steps.length) * 100
    );


  animateNumber(
    percentageText,
    `${percentage}%`
  );


  currentStepText.textContent =
    `Paso ${currentStep + 1} de ${steps.length}`;


  /* =====================================================
     CARD TRANSITION
  ===================================================== */

  animateCard(direction);


  /* =====================================================
     BUTTONS
  ===================================================== */

  prevButton.disabled =
    currentStep === 0;


  if (currentStep === steps.length - 1) {

    nextButtonText.textContent =
      "Finalizar";

  } else {

    nextButtonText.textContent =
      "Continuar";

  }

}


/* =========================================================
   CARD ANIMATION
========================================================= */

function animateCard(direction) {

  const data =
    processData[currentStep];


  const hideClass =
    direction === "forward"
      ? "hide-forward"
      : "hide-back";


  const showClass =
    direction === "forward"
      ? "show-forward"
      : "show-back";


  cardContent.classList.remove(
    "hide-forward",
    "hide-back",
    "show-forward",
    "show-back"
  );


  cardContent.classList.add(hideClass);


  setTimeout(() => {

    cardStepNumber.textContent =
      data.number;

    cardTitle.textContent =
      data.title;

    cardDescription.textContent =
      data.description;


    cardContent.classList.remove(hideClass);

    void cardContent.offsetWidth;

    cardContent.classList.add(showClass);


    setTimeout(() => {

      cardContent.classList.remove(showClass);

      isAnimating = false;

    }, 500);

  }, 230);

}


/* =========================================================
   NUMBER ANIMATION
========================================================= */

function animateNumber(element, value) {

  element.style.opacity = "0";
  element.style.transform =
    "translateY(5px)";


  setTimeout(() => {

    element.textContent = value;

    element.style.opacity = "1";

    element.style.transform =
      "translateY(0)";

  }, 130);

}


/* =========================================================
   NEXT
========================================================= */

nextButton.addEventListener(
  "click",
  () => {

    if (isAnimating) return;


    if (currentStep <
        steps.length - 1) {

      isAnimating = true;

      const previousStep =
        currentStep;

      currentStep++;

      updateProcess(previousStep);

    } else {

      /* Ejemplo de acción final */

      nextButtonText.textContent =
        "Completado";

      nextButton.disabled = true;

      console.log(
        "Proceso completado correctamente."
      );

    }

  }
);


/* =========================================================
   PREVIOUS
========================================================= */

prevButton.addEventListener(
  "click",
  () => {

    if (
      isAnimating ||
      currentStep === 0
    ) return;


    isAnimating = true;

    const previousStep =
      currentStep;

    currentStep--;

    updateProcess(previousStep);

  }
);


/* =========================================================
   CLICK DIRECTLY ON STEP
========================================================= */

steps.forEach((step, index) => {

  step.addEventListener(
    "click",
    () => {

      if (
        isAnimating ||
        index === currentStep
      ) return;


      isAnimating = true;

      const previousStep =
        currentStep;

      currentStep = index;

      updateProcess(previousStep);

    }
  );

});


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
  "resize",
  () => {

    const progress =
      currentStep / (steps.length - 1);

    if (window.innerWidth <= 760) {

      progressLine.style.width =
        "2px";

      progressLine.style.height =
        `${progress * 100}%`;

    } else {

      progressLine.style.height =
        "2px";

      progressLine.style.width =
        `${progress * 100}%`;

    }

  }
);


/* =========================================================
   INITIAL
========================================================= */

updateProcess();