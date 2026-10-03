/* =========================================================
   DONE FOR YOU — PASS THE WORK FORWARD
========================================================= */

gsap.registerPlugin(ScrollTrigger);

/* =========================================================
   REFERENCES
========================================================= */

const section = document.querySelector("#dfyFlow");

const book = document.querySelector("#bookSource");

const content = document.querySelector("#contentOutput");

const schedule = document.querySelector("#scheduleField");

const publish = document.querySelector("#publishField");

const review = document.querySelector("#reviewField");

const final = document.querySelector("#dfyFinal");

const copies = [...document.querySelectorAll(".story-copy__state")];

const flowLabels = [...document.querySelectorAll("[data-flow-label]")];

let currentState = 0;

/* =========================================================
   UPDATE COPY + BOTTOM LANGUAGE
========================================================= */

function setState(index) {
  if (currentState === index) {
    return;
  }

  currentState = index;

  copies.forEach((copy, copyIndex) => {
    if (copyIndex === index) {
      gsap.set(copy, {
        visibility: "visible",
      });

      gsap.fromTo(
        copy,

        {
          opacity: 0,

          y: 24,

          filter: "blur(7px)",
        },

        {
          opacity: 1,

          y: 0,

          filter: "blur(0px)",

          duration: 0.45,

          ease: "power3.out",
        },
      );
    } else {
      gsap.to(copy, {
        opacity: 0,

        y: -18,

        filter: "blur(5px)",

        duration: 0.25,

        onComplete() {
          if (currentState !== copyIndex) {
            gsap.set(copy, {
              visibility: "hidden",
            });
          }
        },
      });
    }
  });

  flowLabels.forEach((label, labelIndex) => {
    label.classList.toggle("is-active", labelIndex === index);
  });
}

/* =========================================================
   DESKTOP STORY
========================================================= */

function createStory() {
  /* -------------------------------------------------------
     INITIAL
  ------------------------------------------------------- */

  gsap.set(content, {
    opacity: 0,
    y: 28,
  });

  gsap.set(schedule, {
    opacity: 0,
    y: 28,
  });

  gsap.set(publish, {
    opacity: 0,
    y: 28,
  });

  gsap.set(review, {
    opacity: 0,
    y: 28,
  });

  gsap.set(final, {
    opacity: 0,

    y: 40,

    filter: "blur(10px)",
  });

  gsap.set(".stream-item", {
    left: "0%",
  });

  gsap.set(".review-metric i", {
    width: "0%",
  });

  /* -------------------------------------------------------
     TIMELINE
  ------------------------------------------------------- */

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,

      start: "top top",

      end: "bottom bottom",

      scrub: 1,

      invalidateOnRefresh: true,

      onUpdate(self) {
        const p = self.progress;

        if (p < 0.2) {
          setState(0);
        } else if (p < 0.39) {
          setState(1);
        } else if (p < 0.58) {
          setState(2);
        } else if (p < 0.77) {
          setState(3);
        } else {
          setState(4);
        }
      },
    },
  });

  /* =======================================================
     BOOK
  ======================================================== */

  timeline.to(
    {},
    {
      duration: 0.7,
    },
  );

  /* book compresses */

  timeline.to(
    book,
    {
      opacity: 0,

      scale: 0.96,

      filter: "blur(5px)",

      duration: 0.65,
    },

    "create",
  );

  /* =======================================================
     CREATE
  ======================================================== */

  timeline.to(
    content,
    {
      opacity: 1,

      y: 0,

      duration: 0.75,

      ease: "power3.out",
    },

    "create+=0.2",
  );

  timeline.fromTo(
    ".output-image",

    {
      x: -25,
    },

    {
      x: 0,

      duration: 0.65,
    },

    "create+=0.3",
  );

  timeline.fromTo(
    [".output-quote", ".output-caption"],

    {
      x: 25,
    },

    {
      x: 0,

      duration: 0.6,

      stagger: 0.1,
    },

    "create+=0.35",
  );

  timeline.to(
    {},
    {
      duration: 0.65,
    },
  );

  /* =======================================================
     CREATE → SCHEDULE
  ======================================================== */

  timeline.to(
    content,
    {
      opacity: 0,

      y: -18,

      filter: "blur(5px)",

      duration: 0.55,
    },

    "schedule",
  );

  timeline.to(
    schedule,
    {
      opacity: 1,

      y: 0,

      duration: 0.7,

      ease: "power3.out",
    },

    "schedule+=0.2",
  );

  timeline.fromTo(
    ".schedule-slot",

    {
      y: 35,
      opacity: 0,
    },

    {
      y: 0,
      opacity: 1,

      duration: 0.5,

      stagger: 0.12,

      ease: "power3.out",
    },

    "schedule+=0.4",
  );

  timeline.to(
    {},
    {
      duration: 0.65,
    },
  );

  /* =======================================================
     SCHEDULE → PUBLISH
  ======================================================== */

  timeline.to(
    schedule,
    {
      opacity: 0,

      y: -18,

      filter: "blur(5px)",

      duration: 0.55,
    },

    "publish",
  );

  timeline.to(
    publish,
    {
      opacity: 1,

      y: 0,

      duration: 0.7,
    },

    "publish+=0.2",
  );

  /* each piece crosses publishing boundary */

  timeline.to(
    ".stream-row--1 .stream-item",
    {
      left: "78%",

      duration: 0.9,

      ease: "none",
    },

    "goLive",
  );

  timeline.to(
    ".stream-row--2 .stream-item",
    {
      left: "78%",

      duration: 0.9,

      ease: "none",
    },

    "goLive+=0.18",
  );

  timeline.to(
    ".stream-row--3 .stream-item",
    {
      left: "78%",

      duration: 0.9,

      ease: "none",
    },

    "goLive+=0.36",
  );

  timeline.to(
    {},
    {
      duration: 0.5,
    },
  );

  /* =======================================================
     PUBLISH → REVIEW
  ======================================================== */

  timeline.to(
    publish,
    {
      opacity: 0,

      y: -18,

      filter: "blur(5px)",

      duration: 0.55,
    },

    "review",
  );

  timeline.to(
    review,
    {
      opacity: 1,

      y: 0,

      duration: 0.7,
    },

    "review+=0.2",
  );

  document.querySelectorAll(".review-metric i").forEach((bar, index) => {
    timeline.to(
      bar,
      {
        width: `${bar.dataset.width}%`,

        duration: 0.65,

        ease: "power3.out",
      },

      `metrics+=${index * 0.12}`,
    );
  });

  timeline.fromTo(
    ".review-result",

    {
      opacity: 0,
      y: 20,
    },

    {
      opacity: 1,
      y: 0,

      duration: 0.6,
    },

    "metrics+=0.45",
  );

  timeline.to(
    {},
    {
      duration: 0.65,
    },
  );

  /* =======================================================
     FINAL
  ======================================================== */

  timeline.to(
    [review, ".story-copy", ".flow-language"],
    {
      opacity: 0,

      filter: "blur(6px)",

      duration: 0.55,
    },

    "final",
  );

  timeline.to(
    final,
    {
      opacity: 1,

      y: 0,

      filter: "blur(0px)",

      duration: 0.85,

      ease: "power3.out",
    },

    "final+=0.4",
  );

  timeline.to(
    {},
    {
      duration: 1,
    },
  );

  return timeline;
}

/* =========================================================
   RESPONSIVE
========================================================= */

const media = gsap.matchMedia();

media.add("(min-width: 901px)", () => {
  setState(0);

  const timeline = createStory();

  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });

  return () => {
    timeline.kill();
  };
});

/* =========================================================
   LOAD
========================================================= */

window.addEventListener("load", () => {
  ScrollTrigger.refresh();
});
