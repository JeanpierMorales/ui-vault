document.addEventListener("DOMContentLoaded", () => {
  /* =========================================================
     CURRENT YEAR
  ========================================================= */

  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  /* =========================================================
     PLACEHOLDER LINKS
  ========================================================= */

  document.querySelectorAll('a[href="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
    });
  });

  /* =========================================================
     STACK
  ========================================================= */

  const stack = document.getElementById("mira-card-stack");

  if (!stack) return;

  const cards = Array.from(stack.querySelectorAll(".feature-card"));

  const progressFill = document.getElementById("stack-progress-fill");

  const currentCounter = document.getElementById("stack-current");

  const total = cards.length;

  const AUTOPLAY_TIME = 5000;

  let currentIndex = 0;

  let autoplayTimer = null;

  let isAnimating = false;

  let isPaused = false;

  /* =========================================================
     HELPERS
  ========================================================= */

  function formatNumber(number) {
    return String(number).padStart(2, "0");
  }

  function getCircularIndex(offset) {
    return (currentIndex + offset) % total;
  }

  /* =========================================================
     UPDATE STACK POSITIONS
  ========================================================= */

  function updateStack() {
    cards.forEach((card) => {
      card.classList.remove(
        "is-active",
        "is-next",
        "is-third",
        "is-hidden",
        "is-leaving",
      );
    });

    const active = getCircularIndex(0);

    const next = getCircularIndex(1);

    const third = getCircularIndex(2);

    cards[active].classList.add("is-active");

    cards[next].classList.add("is-next");

    cards[third].classList.add("is-third");

    cards.forEach((card, index) => {
      if (index !== active && index !== next && index !== third) {
        card.classList.add("is-hidden");
      }
    });

    if (currentCounter) {
      currentCounter.textContent = formatNumber(currentIndex + 1);
    }
  }

  /* =========================================================
     PROGRESS
  ========================================================= */

  function restartProgress() {
    if (!progressFill) return;

    progressFill.classList.remove("is-running");

    void progressFill.offsetWidth;

    if (!isPaused) {
      progressFill.classList.add("is-running");
    }
  }

  function pauseProgress() {
    if (!progressFill) return;

    const computedStyle = window.getComputedStyle(progressFill);

    const width = computedStyle.width;

    progressFill.style.width = width;

    progressFill.classList.remove("is-running");
  }

  function resetProgressStyles() {
    if (!progressFill) return;

    progressFill.style.width = "";
  }

  /* =========================================================
     AUTOPLAY
  ========================================================= */

  function clearAutoplay() {
    if (autoplayTimer) {
      clearTimeout(autoplayTimer);

      autoplayTimer = null;
    }
  }

  function startAutoplay() {
    clearAutoplay();

    if (isPaused) return;

    resetProgressStyles();

    restartProgress();

    autoplayTimer = setTimeout(() => {
      goToNextCard();
    }, AUTOPLAY_TIME);
  }

  /* =========================================================
     NEXT CARD
  ========================================================= */

  function goToNextCard() {
    if (isAnimating) return;

    isAnimating = true;

    const outgoing = cards[currentIndex];

    outgoing.classList.remove("is-active");

    outgoing.classList.add("is-leaving");

    setTimeout(() => {
      currentIndex = (currentIndex + 1) % total;

      updateStack();

      isAnimating = false;

      if (!isPaused) {
        startAutoplay();
      }
    }, 620);
  }

  /* =========================================================
     CLICK / KEYBOARD
  ========================================================= */

  cards.forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        return;
      }

      if (!card.classList.contains("is-active")) {
        return;
      }

      clearAutoplay();

      goToNextCard();
    });

    card.addEventListener("keydown", (event) => {
      if (!card.classList.contains("is-active")) {
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();

        clearAutoplay();

        goToNextCard();
      }
    });
  });

  /* =========================================================
     PAUSE ON HOVER
  ========================================================= */

  stack.addEventListener("mouseenter", () => {
    isPaused = true;

    clearAutoplay();

    pauseProgress();
  });

  stack.addEventListener("mouseleave", () => {
    isPaused = false;

    resetProgressStyles();

    startAutoplay();
  });

  /* =========================================================
     PAUSE WHEN TAB IS NOT VISIBLE
  ========================================================= */

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      isPaused = true;

      clearAutoplay();

      pauseProgress();
    } else {
      isPaused = false;

      resetProgressStyles();

      startAutoplay();
    }
  });

  /* =========================================================
     INITIALIZATION
  ========================================================= */

  updateStack();

  startAutoplay();
});
