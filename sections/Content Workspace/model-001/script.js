/* =========================================================
   MIRA
   SCROLL + POINTER INTERACTION
========================================================= */

const storySection = document.querySelector(".content-story");

const visualShell = document.getElementById("visualShell");

const states = [...document.querySelectorAll(".visual-state")];

const steps = [...document.querySelectorAll(".story-step")];

const scrollFill = document.getElementById("scrollFill");

let currentState = 0;

let lastState = 0;

/* =========================================================
   CHANGE STATE
========================================================= */

function setState(index) {
  index = Math.max(0, Math.min(index, states.length - 1));

  if (index === currentState && states[index].classList.contains("active")) {
    return;
  }

  lastState = currentState;

  currentState = index;

  /* =======================================================
     VISUALS
  ======================================================== */

  states.forEach((state, i) => {
    state.classList.remove("active", "leaving");

    if (i === index) {
      state.classList.add("active");
    } else if (i < index) {
      state.classList.add("leaving");
    }
  });

  /* =======================================================
     NAVIGATION
  ======================================================== */

  steps.forEach((step, i) => {
    step.classList.toggle("active", i === index);
  });
}

/* =========================================================
   STEP CLICK
========================================================= */

steps.forEach((step) => {
  step.addEventListener("click", () => {
    const target = Number(step.dataset.target);

    /*
          On desktop we scroll to the
          corresponding point in the section.

          This means clicking and scrolling
          remain synchronized.
        */

    if (window.innerWidth > 850) {
      const sectionTop =
        storySection.getBoundingClientRect().top + window.scrollY;

      const scrollDistance = storySection.offsetHeight - window.innerHeight;

      const positions = [0.08, 0.5, 0.88];

      window.scrollTo({
        top: sectionTop + scrollDistance * positions[target],

        behavior: "smooth",
      });
    }

    /*
          Change immediately as well,
          so interaction feels responsive.
        */

    setState(target);
  });
});

/* =========================================================
   SCROLL STORY
========================================================= */

function updateScrollStory() {
  if (window.innerWidth <= 850) {
    return;
  }

  const rect = storySection.getBoundingClientRect();

  const totalDistance = storySection.offsetHeight - window.innerHeight;

  const travelled = Math.min(Math.max(-rect.top, 0), totalDistance);

  const progress = totalDistance > 0 ? travelled / totalDistance : 0;

  /* =======================================================
     PROGRESS LINE
  ======================================================== */

  scrollFill.style.width = `${progress * 100}%`;

  /* =======================================================
     STATE BREAKPOINTS
  ======================================================== */

  let index = 0;

  if (progress >= 0.67) {
    index = 2;
  } else if (progress >= 0.34) {
    index = 1;
  }

  setState(index);

  /* =======================================================
     SCROLL MOVEMENT INSIDE CURRENT VISUAL

     This creates subtle movement even
     before the state changes.
  ======================================================== */

  const segmentSize = 1 / 3;

  const localProgress = (progress - index * segmentSize) / segmentSize;

  const normalized = Math.max(0, Math.min(localProgress, 1));

  const activeState = states[index];

  if (activeState) {
    const image = activeState.querySelector(".media-layer img");

    if (image) {
      /*
        Image slowly moves upward
        during its scroll segment.
      */

      const y = (normalized - 0.5) * 18;

      image.style.transform = `
          scale(1.04)
          translateY(${y}px)
        `;
    }
  }
}

/* =========================================================
   OPTIMIZED SCROLL
========================================================= */

let scrollTicking = false;

window.addEventListener(
  "scroll",
  () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        updateScrollStory();

        scrollTicking = false;
      });

      scrollTicking = true;
    }
  },
  {
    passive: true,
  },
);

/* =========================================================
   POINTER PARALLAX
========================================================= */

const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

if (finePointer.matches) {
  visualShell.addEventListener("pointermove", (event) => {
    const rect = visualShell.getBoundingClientRect();

    /*
        Convert pointer to -1 → +1
      */

    const x = (event.clientX - rect.left) / rect.width;

    const y = (event.clientY - rect.top) / rect.height;

    const normalizedX = (x - 0.5) * 2;

    const normalizedY = (y - 0.5) * 2;

    /*
        Only animate elements inside
        the current visual.
      */

    const active = visualShell.querySelector(".visual-state.active");

    if (!active) {
      return;
    }

    const layers = active.querySelectorAll("[data-depth]");

    layers.forEach((layer) => {
      const depth = Number(layer.dataset.depth);

      const moveX = normalizedX * depth * -22;

      const moveY = normalizedY * depth * -18;

      layer.style.setProperty("--mouse-x", `${moveX}px`);

      layer.style.setProperty("--mouse-y", `${moveY}px`);
    });
  });

  /* =======================================================
     POINTER LEAVE
  ======================================================== */

  visualShell.addEventListener("pointerleave", () => {
    const layers = visualShell.querySelectorAll("[data-depth]");

    layers.forEach((layer) => {
      layer.style.setProperty("--mouse-x", "0px");

      layer.style.setProperty("--mouse-y", "0px");
    });
  });
}

/* =========================================================
   RESIZE
========================================================= */

window.addEventListener("resize", () => {
  /*
      Clear transforms when switching
      between desktop and mobile.
    */

  if (window.innerWidth <= 850) {
    document.querySelectorAll("[data-depth]").forEach((layer) => {
      layer.style.setProperty("--mouse-x", "0px");

      layer.style.setProperty("--mouse-y", "0px");
    });
  }

  updateScrollStory();
});

/* =========================================================
   INITIAL STATE
========================================================= */

setState(0);

updateScrollStory();
