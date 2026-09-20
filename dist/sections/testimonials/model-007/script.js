const testimonialSection = document.querySelector(".testimonial-section");

if (testimonialSection) {
  const viewport = testimonialSection.querySelector(".testimonial-carousel__viewport");
  const track = testimonialSection.querySelector(".testimonial-carousel__track");
  const cards = [...testimonialSection.querySelectorAll(".testimonial-card")];
  const prevButton = testimonialSection.querySelector(".testimonial-nav-btn--prev");
  const nextButton = testimonialSection.querySelector(".testimonial-nav-btn--next");
  const cardWrappers = [...testimonialSection.querySelectorAll(".testimonial-card__image-wrap")];

  let currentIndex = 0;
  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  let baseTranslate = 0;
  let currentTranslate = 0;
  let hasMoved = false;

  const DRAG_THRESHOLD = 60;

  /* ======================================================
     HELPERS
  ====================================================== */

  function getGap() {
    return parseFloat(getComputedStyle(track).gap) || 0;
  }

  function getStep() {
    if (!cards.length) return 0;
    return cards[0].getBoundingClientRect().width + getGap();
  }

  function getMaxTranslate() {
    return Math.max(0, track.scrollWidth - viewport.clientWidth);
  }

  function getMaxIndex() {
    const step = getStep();
    if (!step) return 0;
    return Math.ceil(getMaxTranslate() / step);
  }

  function clampIndex(index) {
    return Math.max(0, Math.min(index, getMaxIndex()));
  }

  function updateButtons() {
    prevButton.disabled = currentIndex <= 0;
    nextButton.disabled = currentIndex >= getMaxIndex();
  }

  function updateCarousel(animate = true) {
    currentIndex = clampIndex(currentIndex);

    const step = getStep();
    const translate = Math.min(currentIndex * step, getMaxTranslate());

    currentTranslate = -translate;
    baseTranslate = currentTranslate;

    if (!animate) {
      track.style.transition = "none";
    } else {
      track.style.transition = "";
    }

    track.style.transform = `translate3d(${currentTranslate}px, 0, 0)`;
    updateButtons();

    if (!animate) {
      requestAnimationFrame(() => {
        track.style.transition = "";
      });
    }
  }

  /* ======================================================
     BUTTON NAVIGATION
  ====================================================== */

  prevButton.addEventListener("click", () => {
    currentIndex -= 1;
    updateCarousel();
  });

  nextButton.addEventListener("click", () => {
    currentIndex += 1;
    updateCarousel();
  });

  /* ======================================================
     POINTER DRAG
  ====================================================== */

  viewport.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) return;

    isDragging = true;
    hasMoved = false;
    startX = event.clientX;
    currentX = startX;
    baseTranslate = currentTranslate;

    viewport.classList.add("is-dragging");
    track.style.transition = "none";
    viewport.setPointerCapture?.(event.pointerId);
  });

  viewport.addEventListener("pointermove", (event) => {
    if (!isDragging) return;

    currentX = event.clientX;
    const delta = currentX - startX;

    if (Math.abs(delta) > 4) {
      hasMoved = true;
    }

    let resistance = 1;

    if ((currentIndex === 0 && delta > 0) || (currentIndex === getMaxIndex() && delta < 0)) {
      resistance = 0.22;
    }

    currentTranslate = baseTranslate + delta * resistance;
    track.style.transform = `translate3d(${currentTranslate}px, 0, 0)`;
  });

  function endDrag() {
    if (!isDragging) return;

    isDragging = false;
    viewport.classList.remove("is-dragging");
    track.style.transition = "";

    const delta = currentX - startX;

    if (Math.abs(delta) > DRAG_THRESHOLD) {
      if (delta < 0) {
        currentIndex += 1;
      } else {
        currentIndex -= 1;
      }
    }

    updateCarousel();
  }

  viewport.addEventListener("pointerup", endDrag);
  viewport.addEventListener("pointercancel", endDrag);
  viewport.addEventListener("lostpointercapture", endDrag);

  /* ======================================================
     WHEEL SUPPORT
  ====================================================== */

  viewport.addEventListener(
    "wheel",
    (event) => {
      if (Math.abs(event.deltaY) < 12 && Math.abs(event.deltaX) < 12) return;

      event.preventDefault();

      if (event.deltaY > 0 || event.deltaX > 0) {
        currentIndex += 1;
      } else {
        currentIndex -= 1;
      }

      updateCarousel();
    },
    { passive: false }
  );

  /* ======================================================
     KEYBOARD
  ====================================================== */

  testimonialSection.setAttribute("tabindex", "0");

  testimonialSection.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      currentIndex += 1;
      updateCarousel();
    }

    if (event.key === "ArrowLeft") {
      currentIndex -= 1;
      updateCarousel();
    }
  });

  /* ======================================================
     CARD HOVER LIGHT
  ====================================================== */

  cardWrappers.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      card.style.setProperty("--mouse-x", `${x}%`);
      card.style.setProperty("--mouse-y", `${y}%`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--mouse-x", "50%");
      card.style.setProperty("--mouse-y", "50%");
    });
  });

  /* ======================================================
     REVEAL ON SCROLL
  ====================================================== */

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      testimonialSection.classList.add("is-visible");
      observer.disconnect();
    },
    { threshold: 0.18 }
  );

  observer.observe(testimonialSection);

  /* ======================================================
     RESIZE
  ====================================================== */

  let resizeTimer;

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      currentIndex = clampIndex(currentIndex);
      updateCarousel(false);
    }, 100);
  });

  /* ======================================================
     INIT
  ====================================================== */

  updateCarousel(false);
}