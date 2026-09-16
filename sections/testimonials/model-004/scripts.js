const section =
  document.querySelector(
    ".partners-testimonials"
  );

if (section) {

  const viewport =
    section.querySelector(
      ".partners-carousel__viewport"
    );

  const track =
    section.querySelector(
      ".partners-carousel__track"
    );

  const cards = [
    ...section.querySelectorAll(
      ".partner-card"
    )
  ];

  const previousButton =
    section.querySelector(
      ".partners-carousel__button--prev"
    );

  const nextButton =
    section.querySelector(
      ".partners-carousel__button--next"
    );

  const progressBar =
    section.querySelector(
      ".partners-carousel__progress-bar"
    );


  let currentIndex = 0;

  let startX = 0;
  let currentX = 0;

  let baseTranslate = 0;
  let currentTranslate = 0;

  let isDragging = false;

  const DRAG_THRESHOLD = 60;


  /* =====================================================
     DIMENSIONS
  ===================================================== */

  function getGap() {

    const styles =
      getComputedStyle(track);

    return parseFloat(
      styles.gap
    ) || 0;

  }


  function getStep() {

    if (!cards.length) {
      return 0;
    }

    return (
      cards[0]
        .getBoundingClientRect()
        .width +
      getGap()
    );

  }


  function getMaxIndex() {

    const trackWidth =
      track.scrollWidth;

    const viewportWidth =
      viewport.offsetWidth;

    const maxTranslate =
      Math.max(
        0,
        trackWidth -
        viewportWidth
      );

    return Math.ceil(
      maxTranslate /
      getStep()
    );

  }


  function clampIndex(index) {

    return Math.max(
      0,
      Math.min(
        index,
        getMaxIndex()
      )
    );

  }


  /* =====================================================
     UPDATE
  ===================================================== */

  function updateSlider(
    animate = true
  ) {

    currentIndex =
      clampIndex(
        currentIndex
      );

    const step =
      getStep();

    const maxTranslate =
      Math.max(
        0,
        track.scrollWidth -
        viewport.offsetWidth
      );

    let translate =
      currentIndex *
      step;

    translate =
      Math.min(
        translate,
        maxTranslate
      );

    currentTranslate =
      -translate;

    baseTranslate =
      currentTranslate;


    if (!animate) {
      track.style.transition =
        "none";
    } else {
      track.style.transition = "";
    }


    track.style.transform =
      `translate3d(${currentTranslate}px,0,0)`;


    updateProgress();


    if (!animate) {

      requestAnimationFrame(
        () => {
          track.style.transition = "";
        }
      );

    }

  }


  function updateProgress() {

    const max =
      getMaxIndex();

    if (max === 0) {

      progressBar.style.width =
        "100%";

      return;

    }

    const value =
      (
        (currentIndex + 1) /
        (max + 1)
      ) *
      100;

    progressBar.style.width =
      `${value}%`;

  }


  /* =====================================================
     BUTTONS
  ===================================================== */

  previousButton.addEventListener(
    "click",
    () => {

      currentIndex--;

      updateSlider();

    }
  );


  nextButton.addEventListener(
    "click",
    () => {

      currentIndex++;

      updateSlider();

    }
  );


  /* =====================================================
     DRAG
  ===================================================== */

  viewport.addEventListener(
    "pointerdown",
    event => {

      if (
        event.target.closest(
          "button"
        )
      ) {
        return;
      }

      isDragging = true;

      startX =
        event.clientX;

      currentX =
        startX;

      baseTranslate =
        currentTranslate;

      viewport.classList.add(
        "is-dragging"
      );

      track.style.transition =
        "none";

      viewport.setPointerCapture?.(
        event.pointerId
      );

    }
  );


  viewport.addEventListener(
    "pointermove",
    event => {

      if (!isDragging) {
        return;
      }

      currentX =
        event.clientX;

      const delta =
        currentX -
        startX;

      let resistance = 1;


      if (
        currentIndex === 0 &&
        delta > 0
      ) {
        resistance = 0.2;
      }


      if (
        currentIndex ===
          getMaxIndex() &&
        delta < 0
      ) {
        resistance = 0.2;
      }


      currentTranslate =
        baseTranslate +
        delta *
        resistance;


      track.style.transform =
        `
        translate3d(
          ${currentTranslate}px,
          0,
          0
        )
        `;

    }
  );


  function endDrag() {

    if (!isDragging) {
      return;
    }

    isDragging = false;

    viewport.classList.remove(
      "is-dragging"
    );

    track.style.transition = "";

    const delta =
      currentX -
      startX;


    if (
      Math.abs(delta) >
      DRAG_THRESHOLD
    ) {

      if (delta < 0) {

        currentIndex++;

      } else {

        currentIndex--;

      }

    }


    updateSlider();

  }


  viewport.addEventListener(
    "pointerup",
    endDrag
  );

  viewport.addEventListener(
    "pointercancel",
    endDrag
  );

  viewport.addEventListener(
    "lostpointercapture",
    endDrag
  );


  /* =====================================================
     MOUSE WHEEL
  ===================================================== */

  viewport.addEventListener(
    "wheel",
    event => {

      if (
        Math.abs(event.deltaX) >
        Math.abs(event.deltaY)
      ) {

        event.preventDefault();

        const move =
          event.deltaX;

        if (
          Math.abs(move) >
          20
        ) {

          currentIndex +=
            move > 0
              ? 1
              : -1;

          updateSlider();

        }

      }

    },
    {
      passive: false
    }
  );


  /* =====================================================
     CURSOR LIGHT
  ===================================================== */

  cards.forEach(
    card => {

      card.addEventListener(
        "pointermove",
        event => {

          const rect =
            card.getBoundingClientRect();

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

        }
      );

    }
  );


  /* =====================================================
     VIDEO
  ===================================================== */

  const videoButton =
    section.querySelector(
      ".partner-card__play"
    );

  const modal =
    section.querySelector(
      ".partner-video-modal"
    );

  const modalBackdrop =
    section.querySelector(
      ".partner-video-modal__backdrop"
    );

  const closeButton =
    section.querySelector(
      ".partner-video-modal__close"
    );


  function openVideo() {

    modal.classList.add(
      "is-open"
    );

    modal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.style.overflow =
      "hidden";

  }


  function closeVideo() {

    modal.classList.remove(
      "is-open"
    );

    modal.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.style.overflow =
      "";

  }


  videoButton.addEventListener(
    "click",
    event => {

      event.stopPropagation();

      openVideo();

    }
  );


  closeButton.addEventListener(
    "click",
    closeVideo
  );


  modalBackdrop.addEventListener(
    "click",
    closeVideo
  );


  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key ===
        "Escape"
      ) {
        closeVideo();
      }


      if (
        event.key ===
        "ArrowRight"
      ) {

        currentIndex++;

        updateSlider();

      }


      if (
        event.key ===
        "ArrowLeft"
      ) {

        currentIndex--;

        updateSlider();

      }

    }
  );


  /* =====================================================
     ENTRANCE ANIMATION
  ===================================================== */

  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(
          entry => {

            if (
              !entry.isIntersecting
            ) {
              return;
            }


            cards.forEach(
              (
                card,
                index
              ) => {

                card.animate(
                  [
                    {
                      opacity: 0,
                      transform:
                        "translateY(35px)"
                    },
                    {
                      opacity: 1,
                      transform:
                        "translateY(0)"
                    }
                  ],
                  {
                    duration:
                      850,

                    delay:
                      index *
                      80,

                    easing:
                      "cubic-bezier(.22,1,.36,1)",

                    fill:
                      "both"
                  }
                );

              }
            );


            observer.disconnect();

          }
        );

      },
      {
        threshold:
          0.15
      }
    );


  observer.observe(
    section
  );


  /* =====================================================
     RESIZE
  ===================================================== */

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

            currentIndex =
              clampIndex(
                currentIndex
              );

            updateSlider(
              false
            );

          },
          120
        );

    }
  );


  /* =====================================================
     INIT
  ===================================================== */

  updateSlider(false);

}