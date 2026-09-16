const reviewSection =
  document.querySelector(".reviews");

if (reviewSection) {

  const cards = [
    ...reviewSection.querySelectorAll(
      ".review-card"
    )
  ];

  const dots = [
    ...reviewSection.querySelectorAll(
      ".reviews__dot"
    )
  ];

  const previousButton =
    reviewSection.querySelector(
      ".reviews__nav--prev"
    );

  const nextButton =
    reviewSection.querySelector(
      ".reviews__nav--next"
    );


  let activeIndex = 1;

  let autoPlayTimer = null;

  const AUTO_PLAY_DELAY = 6000;


  /* =====================================================
     SET ACTIVE CARD
  ===================================================== */

  function setActiveCard(index) {

    if (index < 0) {
      index = cards.length - 1;
    }

    if (index >= cards.length) {
      index = 0;
    }

    activeIndex = index;


    cards.forEach(
      (card, cardIndex) => {

        const isActive =
          cardIndex === activeIndex;

        card.classList.toggle(
          "is-active",
          isActive
        );

        card.setAttribute(
          "aria-current",
          isActive
            ? "true"
            : "false"
        );

      }
    );


    dots.forEach(
      (dot, dotIndex) => {

        dot.classList.toggle(
          "is-active",
          dotIndex === activeIndex
        );

      }
    );

  }


  /* =====================================================
     NEXT / PREVIOUS
  ===================================================== */

  function nextReview() {
    setActiveCard(
      activeIndex + 1
    );
  }


  function previousReview() {
    setActiveCard(
      activeIndex - 1
    );
  }


  previousButton.addEventListener(
    "click",
    () => {

      previousReview();

      restartAutoPlay();

    }
  );


  nextButton.addEventListener(
    "click",
    () => {

      nextReview();

      restartAutoPlay();

    }
  );


  /* =====================================================
     CLICK CARD
  ===================================================== */

  cards.forEach(
    (card, index) => {

      card.addEventListener(
        "click",
        () => {

          setActiveCard(index);

          restartAutoPlay();

        }
      );


      card.addEventListener(
        "keydown",
        event => {

          if (
            event.key === "Enter" ||
            event.key === " "
          ) {

            event.preventDefault();

            setActiveCard(index);

            restartAutoPlay();

          }

        }
      );

    }
  );


  /* =====================================================
     DOTS
  ===================================================== */

  dots.forEach(
    (dot, index) => {

      dot.addEventListener(
        "click",
        () => {

          setActiveCard(index);

          restartAutoPlay();

        }
      );

    }
  );


  /* =====================================================
     KEYBOARD
  ===================================================== */

  reviewSection.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "ArrowRight"
      ) {

        nextReview();

        restartAutoPlay();

      }

      if (
        event.key === "ArrowLeft"
      ) {

        previousReview();

        restartAutoPlay();

      }

    }
  );


  /* =====================================================
     CURSOR LIGHT
  ===================================================== */

  cards.forEach(card => {

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

  });


  /* =====================================================
     SUBTLE AVATAR PARALLAX
  ===================================================== */

  cards.forEach(card => {

    const avatar =
      card.querySelector(
        ".review-card__avatar-ring"
      );


    card.addEventListener(
      "pointermove",
      event => {

        if (
          window.innerWidth < 900
        ) {
          return;
        }

        const rect =
          card.getBoundingClientRect();

        const x =
          (
            event.clientX -
            rect.left
          ) / rect.width;

        const y =
          (
            event.clientY -
            rect.top
          ) / rect.height;

        const rotateY =
          (x - 0.5) * 4;

        const rotateX =
          (0.5 - y) * 4;


        avatar.style.transform =
          `
            translateY(-5px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
          `;

      }
    );


    card.addEventListener(
      "pointerleave",
      () => {

        avatar.style.transform = "";

      }
    );

  });


  /* =====================================================
     AUTOPLAY
  ===================================================== */

  function startAutoPlay() {

    stopAutoPlay();


    autoPlayTimer =
      setInterval(
        () => {

          if (
            document.hidden ||
            reviewSection.matches(":hover")
          ) {
            return;
          }

          nextReview();

        },
        AUTO_PLAY_DELAY
      );

  }


  function stopAutoPlay() {

    if (autoPlayTimer) {

      clearInterval(
        autoPlayTimer
      );

      autoPlayTimer = null;

    }

  }


  function restartAutoPlay() {

    stopAutoPlay();

    setTimeout(
      startAutoPlay,
      1500
    );

  }


  document.addEventListener(
    "visibilitychange",
    () => {

      if (document.hidden) {

        stopAutoPlay();

      } else {

        startAutoPlay();

      }

    }
  );


  /* =====================================================
     INITIAL STATE
  ===================================================== */

  setActiveCard(
    activeIndex
  );

  startAutoPlay();

}