const steps = document.querySelectorAll(".timeline-step");
const timelineFill = document.getElementById("timelineFill");

const progressPercent = document.getElementById("progressPercent");

const detailIndex = document.getElementById("detailIndex");
const detailStatus = document.getElementById("detailStatus");
const detailTitle = document.getElementById("detailTitle");
const detailDescription = document.getElementById("detailDescription");
const detailList = document.getElementById("detailList");
const detailContent = document.getElementById("detailContent");
const nextPhase = document.getElementById("nextPhase");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const processData = [
  {
    index: "01",
    title: "Recepción",
    subtitle: "Tu solicitud fue registrada",
    status: "En progreso",
    description:
      "Hemos recibido tu solicitud y quedó registrada correctamente en el sistema. Este es el punto inicial del proceso.",
    bullets: [
      "Registro inicial validado",
      "Datos básicos almacenados",
      "Inicio del flujo operativo"
    ]
  },
  {
    index: "02",
    title: "Validación",
    subtitle: "Verificación de información",
    status: "En progreso",
    description:
      "En esta etapa se revisa la consistencia de la información ingresada y se confirman los datos necesarios para continuar.",
    bullets: [
      "Validación de datos clave",
      "Revisión de consistencia",
      "Confirmación para continuar"
    ]
  },
  {
    index: "03",
    title: "Procesamiento",
    subtitle: "Gestión operativa en curso",
    status: "En progreso",
    description:
      "El proceso se encuentra siendo gestionado internamente. Aquí se ejecutan las acciones necesarias para avanzar al cierre.",
    bullets: [
      "Ejecución del flujo interno",
      "Gestión operativa activa",
      "Preparación de resultados"
    ]
  },
  {
    index: "04",
    title: "Revisión final",
    subtitle: "Control de calidad y confirmación",
    status: "En progreso",
    description:
      "Antes de finalizar, se realiza una verificación final para asegurar que todo esté correcto y listo para entregarse.",
    bullets: [
      "Control de calidad",
      "Revisión integral del resultado",
      "Confirmación previa al cierre"
    ]
  },
  {
    index: "05",
    title: "Completado",
    subtitle: "Proceso terminado correctamente",
    status: "Finalizado",
    description:
      "El flujo ha concluido de forma satisfactoria. Toda la información y las acciones asociadas al proceso fueron completadas.",
    bullets: [
      "Proceso cerrado",
      "Resultado confirmado",
      "Seguimiento finalizado"
    ]
  }
];

let currentStep = 0;
let isAnimating = false;

/* -----------------------------
   HELPERS
----------------------------- */

function getProgressPercent(stepIndex) {
  return Math.round(((stepIndex + 1) / processData.length) * 100);
}

function getFillHeight(stepIndex) {
  if (steps.length <= 1) return 0;
  return (stepIndex / (steps.length - 1)) * 100;
}

function animateValue(element, value) {
  element.style.opacity = "0";
  element.style.transform = "translateY(5px)";

  setTimeout(() => {
    element.textContent = value;
    element.style.opacity = "1";
    element.style.transform = "translateY(0)";
  }, 120);
}

function setListItems(items) {
  detailList.innerHTML = items
    .map(item => `<li>${item}</li>`)
    .join("");
}

/* -----------------------------
   UPDATE TIMELINE
----------------------------- */

function updateTimeline() {
  steps.forEach((step, index) => {
    step.classList.remove("completed", "active", "pending");

    if (index < currentStep) {
      step.classList.add("completed");
    } else if (index === currentStep) {
      step.classList.add("active");
    } else {
      step.classList.add("pending");
    }
  });

  const fillHeight = getFillHeight(currentStep);
  timelineFill.style.height = `${fillHeight}%`;
}

/* -----------------------------
   UPDATE DETAIL PANEL
----------------------------- */

function updateDetailPanel(direction = "forward") {
  const data = processData[currentStep];

  const hideClass =
    direction === "forward" ? "hide-forward" : "hide-back";

  const showClass =
    direction === "forward" ? "show-forward" : "show-back";

  detailContent.classList.remove(
    "hide-forward",
    "hide-back",
    "show-forward",
    "show-back"
  );

  detailContent.classList.add(hideClass);

  setTimeout(() => {
    detailIndex.textContent = data.index;
    detailTitle.textContent = data.title;
    detailDescription.textContent = data.description;
    detailStatus.textContent = data.status;
    setListItems(data.bullets);

    if (currentStep < processData.length - 1) {
      nextPhase.textContent = processData[currentStep + 1].title;
    } else {
      nextPhase.textContent = "—";
    }

    detailContent.classList.remove(hideClass);
    void detailContent.offsetWidth;
    detailContent.classList.add(showClass);

    setTimeout(() => {
      detailContent.classList.remove(showClass);
      isAnimating = false;
    }, 460);
  }, 200);
}

/* -----------------------------
   UPDATE META
----------------------------- */

function updateMeta() {
  animateValue(progressPercent, `${getProgressPercent(currentStep)}%`);
  animateValue(detailStatus, processData[currentStep].status);

  prevBtn.disabled = currentStep === 0;

  if (currentStep === processData.length - 1) {
    nextBtn.textContent = "Finalizado";
    nextBtn.disabled = true;
  } else {
    nextBtn.textContent = "Continuar";
    nextBtn.disabled = false;
  }
}

/* -----------------------------
   MAIN UPDATE
----------------------------- */

function render(previousStep = currentStep) {
  const direction = currentStep >= previousStep ? "forward" : "back";

  updateTimeline();
  updateDetailPanel(direction);
  updateMeta();
}

/* -----------------------------
   CONTROLS
----------------------------- */

nextBtn.addEventListener("click", () => {
  if (isAnimating) return;
  if (currentStep >= processData.length - 1) return;

  isAnimating = true;
  const previousStep = currentStep;
  currentStep++;
  render(previousStep);
});

prevBtn.addEventListener("click", () => {
  if (isAnimating) return;
  if (currentStep <= 0) return;

  isAnimating = true;
  const previousStep = currentStep;
  currentStep--;
  render(previousStep);
});

steps.forEach((step, index) => {
  step.addEventListener("click", () => {
    if (isAnimating) return;
    if (index === currentStep) return;

    isAnimating = true;
    const previousStep = currentStep;
    currentStep = index;
    render(previousStep);
  });
});

/* -----------------------------
   INIT
----------------------------- */

render();