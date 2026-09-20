document.addEventListener("DOMContentLoaded", () => {
  const process = document.querySelector("#process");

  const layerContent = document.querySelector("#layerContent");

  const layerCampaign = document.querySelector("#layerCampaign");

  const layerPublish = document.querySelector("#layerPublish");

  const floatingPiece = document.querySelector("#floatingPiece");

  const copyStep = document.querySelector("#copyStep");

  const copyNumber = copyStep.querySelector(".copy-number");

  const copyTitle = document.querySelector("#copyTitle");

  const copyDescription = document.querySelector("#copyDescription");

  const metaOne = document.querySelector("#metaOne");

  const metaTwo = document.querySelector("#metaTwo");

  const metaThree = document.querySelector("#metaThree");

  const timelineProgress = document.querySelector("#timelineProgress");

  const timelinePoints = document.querySelectorAll(".timeline-point");

  const headerProgress = document.querySelector("#headerProgress");

  const footerProgress = document.querySelector("#footerProgress");

  const progressCurrent = document.querySelector("#progressCurrent");

  const footerText = document.querySelector("#footerText");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* =======================================================
     DATA
  ======================================================== */

  const steps = [
    {
      number: "01",

      title: "Add your content.",

      description:
        "Upload finished posts, write a scene yourself, or pull content directly from a Booketeer-indexed book.",

      meta: ["Upload", "Write", "Import"],

      footer: "Add your content",
    },

    {
      number: "02",

      title: "Build your campaign.",

      description:
        "Choose the content, TikTok accounts, schedule and publishing method from one workspace.",

      meta: ["Content", "Accounts", "Schedule"],

      footer: "Build your campaign",
    },

    {
      number: "03",

      title: "Press play.",

      description:
        "Approve your campaign and let MIRA publish automatically. Pause, edit or stop whenever you need.",

      meta: ["Approve", "Publish", "Track"],

      footer: "Press play",
    },
  ];

  /* =======================================================
     HELPERS
  ======================================================== */

  const clamp = (value, min = 0, max = 1) => {
    return Math.min(Math.max(value, min), max);
  };

  const map = (value, inMin, inMax, outMin, outMax) => {
    const n = clamp((value - inMin) / (inMax - inMin));

    return outMin + (outMax - outMin) * n;
  };

  const lerp = (a, b, t) => {
    return a + (b - a) * t;
  };

  const smoothstep = (t) => {
    t = clamp(t);

    return t * t * (3 - 2 * t);
  };

  /* =======================================================
     ACTIVE STEP
  ======================================================== */

  let activeStep = 0;

  function setStep(index) {
    if (index === activeStep) {
      return;
    }

    activeStep = index;

    const step = steps[index];

    /*
      Tiny blur transition.
    */

    copyStep.animate(
      [
        {
          opacity: 1,
          filter: "blur(0px)",
          transform: "translateY(0px)",
        },

        {
          opacity: 0.15,
          filter: "blur(5px)",
          transform: "translateY(-8px)",
        },

        {
          opacity: 0,
          filter: "blur(7px)",
          transform: "translateY(-12px)",
        },
      ],
      {
        duration: 180,
        fill: "forwards",
        easing: "ease-in",
      },
    ).onfinish = () => {
      copyNumber.textContent = step.number;

      copyTitle.textContent = step.title;

      copyDescription.textContent = step.description;

      metaOne.textContent = step.meta[0];

      metaTwo.textContent = step.meta[1];

      metaThree.textContent = step.meta[2];

      progressCurrent.textContent = step.number;

      footerText.textContent = step.footer;

      copyStep.animate(
        [
          {
            opacity: 0,
            filter: "blur(6px)",
            transform: "translateY(18px)",
          },

          {
            opacity: 1,
            filter: "blur(0px)",
            transform: "translateY(0px)",
          },
        ],
        {
          duration: 420,
          fill: "forwards",
          easing: "cubic-bezier(.16,1,.3,1)",
        },
      );
    };

    timelinePoints.forEach((point, pointIndex) => {
      point.classList.toggle("active", pointIndex === index);
    });
  }

  /* =======================================================
     SCENE ONE
  ======================================================== */

  function renderContent(progress) {
    /*
      0.00 → .38
    */

    const local = map(progress, 0, 0.38, 0, 1);

    const e = smoothstep(local);

    layerContent.style.opacity = `${1 - map(local, 0.62, 1, 0, 1)}`;

    layerContent.style.transform = `
      translate3d(
        ${lerp(0, -8, e)}%,
        ${lerp(0, -3, e)}%,
        0
      )
      scale(
        ${lerp(1, 0.94, e)}
      )
    `;

    /*
      floating piece starts inside visual.
    */

    floatingPiece.style.left = `${lerp(16, 35, e)}%`;

    floatingPiece.style.top = `${lerp(58, 32, e)}%`;

    floatingPiece.style.transform = `
      scale(
        ${lerp(1, 0.8, e)}
      )
    `;
  }

  /* =======================================================
     SCENE TWO
  ======================================================== */

  function renderCampaign(progress) {
    const local = map(progress, 0.3, 0.72, 0, 1);

    const e = smoothstep(local);

    const fadeIn = map(local, 0.08, 0.35, 0, 1);

    const fadeOut = map(local, 0.72, 1, 0, 1);

    layerCampaign.style.opacity = `${fadeIn * (1 - fadeOut)}`;

    layerCampaign.style.transform = `
      translate3d(
        ${lerp(12, 0, e)}%,
        0,
        0
      )
      scale(
        ${lerp(0.94, 1, e)}
      )
    `;

    /*
      Same black dot travels through layout.
      It visually connects scene one → scene two.
    */

    floatingPiece.style.left = `${lerp(35, 81, e)}%`;

    floatingPiece.style.top = `${lerp(32, 72, e)}%`;

    floatingPiece.style.transform = `
      scale(
        ${lerp(0.8, 0.62, e)}
      )
    `;
  }

  /* =======================================================
     SCENE THREE
  ======================================================== */

  function renderPublish(progress) {
    const local = map(progress, 0.64, 1, 0, 1);

    const e = smoothstep(local);

    const show = map(local, 0.13, 0.42, 0, 1);

    layerPublish.style.opacity = `${show}`;

    layerPublish.style.transform = `
      translate3d(
        0,
        ${lerp(7, 0, e)}%,
        0
      )
      scale(
        ${lerp(0.88, 1, e)}
      )
    `;

    /*
      Black dot becomes the play control.

      It shrinks while moving toward
      the large circular UI.
    */

    floatingPiece.style.left = `${lerp(81, 22, e)}%`;

    floatingPiece.style.top = `${lerp(72, 50, e)}%`;

    floatingPiece.style.transform = `
      scale(
        ${lerp(0.62, 0.12, e)}
      )
    `;

    floatingPiece.style.opacity = `${1 - map(local, 0.45, 0.75, 0, 1)}`;
  }

  /* =======================================================
     MAIN PROGRESS
  ======================================================== */

  function getScrollProgress() {
    const rect = process.getBoundingClientRect();

    const scrollDistance = process.offsetHeight - window.innerHeight;

    return clamp(-rect.top / scrollDistance);
  }

  function render(progress) {
    timelineProgress.style.height = `${progress * 100}%`;

    headerProgress.style.width = `${progress * 100}%`;

    footerProgress.style.width = `${progress * 100}%`;

    if (progress < 0.34) {
      setStep(0);
    } else if (progress < 0.68) {
      setStep(1);
    } else {
      setStep(2);
    }

    renderContent(progress);

    renderCampaign(progress);

    renderPublish(progress);
  }

  /* =======================================================
     SMOOTH SCROLL FOLLOW
  ======================================================== */

  let targetProgress = getScrollProgress();

  let currentProgress = targetProgress;

  function onScroll() {
    targetProgress = getScrollProgress();
  }

  function animationLoop() {
    currentProgress += (targetProgress - currentProgress) * 0.085;

    render(currentProgress);

    requestAnimationFrame(animationLoop);
  }

  if (reducedMotion) {
    window.addEventListener(
      "scroll",
      () => {
        render(getScrollProgress());
      },
      {
        passive: true,
      },
    );

    render(getScrollProgress());
  } else {
    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    window.addEventListener("resize", onScroll);

    animationLoop();
  }

  /* =======================================================
     PLAY
  ======================================================== */

  const publishButton = document.querySelector(".publish-button");

  publishButton?.addEventListener("click", () => {
    publishButton.animate(
      [
        {
          transform: "scale(1)",
        },

        {
          transform: "scale(.91)",
        },

        {
          transform: "scale(1.07)",
        },

        {
          transform: "scale(1)",
        },
      ],
      {
        duration: 600,

        easing: "cubic-bezier(.16,1,.3,1)",
      },
    );
  });
});
