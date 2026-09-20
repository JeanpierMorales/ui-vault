const testimonials = document.querySelector(".testimonials");

if (testimonials) {
  const viewport = testimonials.querySelector(".testimonials__viewport");
  const track = testimonials.querySelector(".testimonials__track");

  const cards = [...testimonials.querySelectorAll(".testimonial-card")];

  const previousButton = testimonials.querySelector(
    ".testimonials__button--prev"
  );

  const nextButton = testimonials.querySelector(
    ".testimonials__button--next"
  );

  const progressBar = testimonials.querySelector(
    ".testimonials__progress-bar"
  );

  let currentIndex = 0;

  let pointerStartX = 0;
  let pointerCurrentX = 0;

  let baseTranslate = 0;
  let currentTranslate = 0;

  let isDragging = false;
  let hasMoved = false;

  let autoplayTimer = null;

  const AUTOPLAY_DELAY = 6500;
  const DRAG_THRESHOLD = 60;

  /* =======================================================
     HELPERS
  ======================================================= */

  function getVisibleCards() {
    const viewportWidth = viewport.offsetWidth;
    const cardWidth = cards[0].getBoundingClientRect().width;

    return Math.max(1, Math.floor(viewportWidth / cardWidth));
  }

  function getMaxIndex() {
    return Math.max(0, cards.length - getVisibleCards());
  }

  function getCardStep() {
    if (cards.length < 2) {
      return cards[0]?.offsetWidth || 0;
    }

    const first = cards[0].getBoundingClientRect();
    const second = cards[1].getBoundingClientRect();

    return second.left - first.left;
  }

  function clampIndex(index) {
    return Math.max(0, Math.min(index, getMaxIndex()));
  }

  function translateForIndex(index) {
    return -(index * getCardStep());
  }

  /* =======================================================
     UPDATE SLIDER
  ======================================================= */

  function updateSlider(animate = true) {
    currentIndex = clampIndex(currentIndex);

    currentTranslate = translateForIndex(currentIndex);
    baseTranslate = currentTranslate;

    if (!animate) {
      track.style.transition = "none";
    } else {
      track.style.transition = "";
    }

    track.style.transform = `translate3d(${currentTranslate}px, 0, 0)`;

    updateControls();
    updateProgress();

    if (!animate) {
      requestAnimationFrame(() => {
        track.style.transition = "";
      });
    }
  }

  function updateControls() {
    previousButton.disabled = currentIndex <= 0;
    nextButton.disabled = currentIndex >= getMaxIndex();
  }

  function updateProgress() {
    const maxIndex = getMaxIndex();

    if (maxIndex === 0) {
      progressBar.style.width = "100%";
      return;
    }

    const progress = ((currentIndex + 1) / (maxIndex + 1)) * 100;

    progressBar.style.width = `${progress}%`;
  }

  /* =======================================================
     NAVIGATION
  ======================================================= */

  function nextSlide() {
    const maxIndex = getMaxIndex();

    if (currentIndex >= maxIndex) {
      currentIndex = 0;
    } else {
      currentIndex += 1;
    }

    updateSlider();
  }

  function previousSlide() {
    if (currentIndex <= 0) {
      currentIndex = getMaxIndex();
    } else {
      currentIndex -= 1;
    }

    updateSlider();
  }

  previousButton.addEventListener("click", () => {
    previousSlide();
    restartAutoplay();
  });

  nextButton.addEventListener("click", () => {
    nextSlide();
    restartAutoplay();
  });

  /* =======================================================
     POINTER DRAG
  ======================================================= */

  viewport.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) return;

    isDragging = true;
    hasMoved = false;

    pointerStartX = event.clientX;
    pointerCurrentX = pointerStartX;

    baseTranslate = translateForIndex(currentIndex);

    viewport.classList.add("is-dragging");

    track.style.transition = "none";

    viewport.setPointerCapture?.(event.pointerId);

    stopAutoplay();
  });

  viewport.addEventListener("pointermove", (event) => {
    if (!isDragging) return;

    pointerCurrentX = event.clientX;

    const deltaX = pointerCurrentX - pointerStartX;

    if (Math.abs(deltaX) > 4) {
      hasMoved = true;
    }

    /*
      Resistance when pulling beyond edges.
    */

    let resistance = 1;

    if (
      (currentIndex === 0 && deltaX > 0) ||
      (currentIndex === getMaxIndex() && deltaX < 0)
    ) {
      resistance = 0.22;
    }

    currentTranslate =
      baseTranslate +
      deltaX * resistance;

    track.style.transform =
      `translate3d(${currentTranslate}px, 0, 0)`;
  });

  function releaseDrag() {
    if (!isDragging) return;

    isDragging = false;

    viewport.classList.remove("is-dragging");

    track.style.transition = "";

    const deltaX =
      pointerCurrentX -
      pointerStartX;

    const velocityIntent =
      Math.abs(deltaX) >
      DRAG_THRESHOLD;

    if (velocityIntent) {
      if (deltaX < 0) {
        currentIndex += 1;
      } else {
        currentIndex -= 1;
      }
    }

    currentIndex =
      clampIndex(currentIndex);

    updateSlider();

    setTimeout(startAutoplay, 1200);
  }

  viewport.addEventListener(
    "pointerup",
    releaseDrag
  );

  viewport.addEventListener(
    "pointercancel",
    releaseDrag
  );

  viewport.addEventListener(
    "lostpointercapture",
    releaseDrag
  );

  /* =======================================================
     CARD CURSOR LIGHT
  ======================================================= */

  cards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();

      const x =
        event.clientX -
        rect.left;

      const y =
        event.clientY -
        rect.top;

      card.style.setProperty(
        "--mouse-x",
        `${x}px`
      );

      card.style.setProperty(
        "--mouse-y",
        `${y}px`
      );
    });
  });

  /* =======================================================
     KEYBOARD
  ======================================================= */

  testimonials.setAttribute(
    "tabindex",
    "0"
  );

  testimonials.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "ArrowRight") {
        nextSlide();
        restartAutoplay();
      }

      if (event.key === "ArrowLeft") {
        previousSlide();
        restartAutoplay();
      }
    }
  );

  /* =======================================================
     AUTOPLAY
  ======================================================= */

  function startAutoplay() {
    stopAutoplay();

    autoplayTimer = setInterval(() => {
      if (
        document.hidden ||
        testimonials.matches(":hover")
      ) {
        return;
      }

      nextSlide();
    }, AUTOPLAY_DELAY);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function restartAutoplay() {
    stopAutoplay();

    setTimeout(() => {
      startAutoplay();
    }, 1500);
  }

  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    }
  );

  /* =======================================================
     VIDEO MODAL
  ======================================================= */

  const playButton =
    testimonials.querySelector(
      ".testimonial-card__play"
    );

  const videoModal =
    testimonials.querySelector(
      ".testimonial-video"
    );

  const closeVideo =
    testimonials.querySelector(
      ".testimonial-video__close"
    );

  const backdrop =
    testimonials.querySelector(
      ".testimonial-video__backdrop"
    );

  function openVideoModal() {
    if (hasMoved) return;

    videoModal.classList.add("is-open");

    videoModal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.style.overflow =
      "hidden";

    stopAutoplay();
  }

  function closeVideoModal() {
    videoModal.classList.remove("is-open");

    videoModal.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.style.overflow = "";

    startAutoplay();
  }

  playButton?.addEventListener(
    "click",
    openVideoModal
  );

  closeVideo?.addEventListener(
    "click",
    closeVideoModal
  );

  backdrop?.addEventListener(
    "click",
    closeVideoModal
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key === "Escape" &&
        videoModal.classList.contains("is-open")
      ) {
        closeVideoModal();
      }
    }
  );

  /* =======================================================
     RESIZE
  ======================================================= */

  let resizeTimer;

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      currentIndex =
        clampIndex(currentIndex);

      updateSlider(false);
    }, 100);
  });

  /* =======================================================
     ENTRANCE ANIMATION
  ======================================================= */

  const observer =
    new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        cards.forEach((card, index) => {
          card.animate(
            [
              {
                opacity: 0,
                transform:
                  "translateY(28px) scale(.985)"
              },
              {
                opacity: 1,
                transform:
                  "translateY(0) scale(1)"
              }
            ],
            {
              duration: 850,
              delay: index * 85,
              easing:
                "cubic-bezier(.22,1,.36,1)",
              fill: "both"
            }
          );
        });

        observer.disconnect();
      },
      {
        threshold: 0.18
      }
    );

  observer.observe(testimonials);

  /* =======================================================
     INIT
  ======================================================= */

  updateSlider(false);
  startAutoplay();
}