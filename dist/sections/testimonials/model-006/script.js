const testimonialSection =
  document.querySelector(
    ".community-testimonials"
  );

if (testimonialSection) {

  const quote =
    testimonialSection.querySelector(
      ".community-testimonial__quote"
    );

  const author =
    testimonialSection.querySelector(
      ".community-testimonial__author"
    );

  const avatar =
    testimonialSection.querySelector(
      ".community-testimonial__avatar"
    );

  const authorName =
    testimonialSection.querySelector(
      ".community-testimonial__author-info strong"
    );

  const authorRole =
    testimonialSection.querySelector(
      ".community-testimonial__author-info span"
    );

  const previousButton =
    testimonialSection.querySelector(
      ".community-testimonials__button--prev"
    );

  const nextButton =
    testimonialSection.querySelector(
      ".community-testimonials__button--next"
    );

  const progressItems = [
    ...testimonialSection.querySelectorAll(
      ".community-testimonials__progress span"
    )
  ];


  /* =====================================================
     TESTIMONIAL DATA
  ===================================================== */

  const testimonials = [

    {
      quote:
        "Production Online has helped me become a better musician and producer than I ever thought possible.”",

      name:
        "Kyle Weznick",

      role:
        "Media Director, Turn Around Music Group",

      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=90"
    },


    {
      quote:
        "I’ve learned more about production here than I did in years of trying to figure everything out on my own.”",

      name:
        "Emma Carter",

      role:
        "Independent Producer & Songwriter",

      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=90"
    },


    {
      quote:
        "The community pushes you to think differently, improve your workflow and ultimately become more confident in your music.”",

      name:
        "Daniel Rivera",

      role:
        "Producer, North Sound Studio",

      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=90"
    },


    {
      quote:
        "Everything is explained in a way that immediately translates into better decisions when I sit down to produce.”",

      name:
        "Sophia Martin",

      role:
        "Artist & Music Producer",

      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=90"
    }

  ];


  let currentIndex = 0;

  let isAnimating = false;

  let autoplayTimer = null;

  const AUTO_PLAY_DELAY = 7000;


  /* =====================================================
     UPDATE PROGRESS
  ===================================================== */

  function updateProgress() {

    progressItems.forEach(
      (item, index) => {

        item.classList.toggle(
          "is-active",
          index === currentIndex
        );

      }
    );

  }


  /* =====================================================
     CHANGE TESTIMONIAL
  ===================================================== */

  function showTestimonial(
    newIndex
  ) {

    if (isAnimating) {
      return;
    }


    if (newIndex < 0) {

      newIndex =
        testimonials.length - 1;

    }


    if (
      newIndex >=
      testimonials.length
    ) {

      newIndex = 0;

    }


    if (
      newIndex ===
      currentIndex
    ) {
      return;
    }


    isAnimating = true;


    quote.classList.remove(
      "is-entering"
    );

    author.classList.remove(
      "is-entering"
    );


    quote.classList.add(
      "is-leaving"
    );

    author.classList.add(
      "is-leaving"
    );


    setTimeout(
      () => {

        currentIndex =
          newIndex;


        const testimonial =
          testimonials[
            currentIndex
          ];


        quote.textContent =
          testimonial.quote;


        authorName.textContent =
          testimonial.name;


        authorRole.textContent =
          testimonial.role;


        avatar.src =
          testimonial.image;


        avatar.alt =
          testimonial.name;


        updateProgress();


        quote.classList.remove(
          "is-leaving"
        );

        author.classList.remove(
          "is-leaving"
        );


        void quote.offsetWidth;


        quote.classList.add(
          "is-entering"
        );

        author.classList.add(
          "is-entering"
        );


        setTimeout(
          () => {

            quote.classList.remove(
              "is-entering"
            );

            author.classList.remove(
              "is-entering"
            );

            isAnimating =
              false;

          },
          780
        );

      },
      320
    );

  }


  /* =====================================================
     NEXT / PREVIOUS
  ===================================================== */

  function nextTestimonial() {

    showTestimonial(
      currentIndex + 1
    );

  }


  function previousTestimonial() {

    showTestimonial(
      currentIndex - 1
    );

  }


  previousButton.addEventListener(
    "click",
    () => {

      previousTestimonial();

      restartAutoplay();

    }
  );


  nextButton.addEventListener(
    "click",
    () => {

      nextTestimonial();

      restartAutoplay();

    }
  );


  /* =====================================================
     KEYBOARD
  ===================================================== */

  testimonialSection.setAttribute(
    "tabindex",
    "0"
  );


  testimonialSection.addEventListener(
    "keydown",
    event => {

      if (
        event.key ===
        "ArrowRight"
      ) {

        nextTestimonial();

        restartAutoplay();

      }


      if (
        event.key ===
        "ArrowLeft"
      ) {

        previousTestimonial();

        restartAutoplay();

      }

    }
  );


  /* =====================================================
     SWIPE
  ===================================================== */

  let pointerStart = 0;

  let pointerEnd = 0;


  testimonialSection.addEventListener(
    "pointerdown",
    event => {

      pointerStart =
        event.clientX;

    }
  );


  testimonialSection.addEventListener(
    "pointerup",
    event => {

      pointerEnd =
        event.clientX;


      const difference =
        pointerEnd -
        pointerStart;


      if (
        Math.abs(
          difference
        ) <
        70
      ) {
        return;
      }


      if (
        difference < 0
      ) {

        nextTestimonial();

      } else {

        previousTestimonial();

      }


      restartAutoplay();

    }
  );


  /* =====================================================
     AUTOPLAY
  ===================================================== */

  function startAutoplay() {

    stopAutoplay();


    autoplayTimer =
      setInterval(
        () => {

          if (
            document.hidden ||
            testimonialSection.matches(
              ":hover"
            )
          ) {
            return;
          }


          nextTestimonial();

        },
        AUTO_PLAY_DELAY
      );

  }


  function stopAutoplay() {

    if (
      autoplayTimer
    ) {

      clearInterval(
        autoplayTimer
      );

      autoplayTimer =
        null;

    }

  }


  function restartAutoplay() {

    stopAutoplay();


    setTimeout(
      startAutoplay,
      1300
    );

  }


  document.addEventListener(
    "visibilitychange",
    () => {

      if (
        document.hidden
      ) {

        stopAutoplay();

      } else {

        startAutoplay();

      }

    }
  );


  /* =====================================================
     ENTRANCE
  ===================================================== */

  const observer =
    new IntersectionObserver(
      ([entry]) => {

        if (
          !entry.isIntersecting
        ) {
          return;
        }


        testimonialSection
          .classList
          .add(
            "is-visible"
          );


        observer.disconnect();

      },
      {
        threshold:
          0.2
      }
    );


  observer.observe(
    testimonialSection
  );


  /* =====================================================
     INIT
  ===================================================== */

  updateProgress();

  startAutoplay();

}