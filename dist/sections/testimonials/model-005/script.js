const trustedSection = document.querySelector(".trusted-section");
const trustedShell = document.querySelector(".trusted-shell");
const portraits = [...document.querySelectorAll(".portrait")];
const ctaButton = document.querySelector(".trusted-button");

if (trustedSection && trustedShell && portraits.length) {
  /* =====================================================
     SECTION PARALLAX
  ===================================================== */
  trustedShell.addEventListener("pointermove", (event) => {
    const rect = trustedShell.getBoundingClientRect();

    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    portraits.forEach((portrait) => {
      const depth = parseFloat(portrait.dataset.depth || "1");

      const moveX = (px - 0.5) * 18 * depth;
      const moveY = (py - 0.5) * 14 * depth;

      portrait.style.setProperty("--parallax-x", `${moveX}px`);
      portrait.style.setProperty("--parallax-y", `${moveY}px`);
    });
  });

  trustedShell.addEventListener("pointerleave", () => {
    portraits.forEach((portrait) => {
      portrait.style.setProperty("--parallax-x", "0px");
      portrait.style.setProperty("--parallax-y", "0px");
      portrait.style.setProperty("--tilt-x", "0deg");
      portrait.style.setProperty("--tilt-y", "0deg");
    });
  });

  /* =====================================================
     INDIVIDUAL CARD TILT + LIGHT
  ===================================================== */
  portraits.forEach((portrait) => {
    portrait.addEventListener("pointermove", (event) => {
      const rect = portrait.getBoundingClientRect();

      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      const rotateY = (x - 0.5) * 8;
      const rotateX = (0.5 - y) * 8;

      portrait.style.setProperty("--tilt-x", `${rotateX}deg`);
      portrait.style.setProperty("--tilt-y", `${rotateY}deg`);
      portrait.style.setProperty("--mouse-x", `${x * 100}%`);
      portrait.style.setProperty("--mouse-y", `${y * 100}%`);
    });

    portrait.addEventListener("pointerleave", () => {
      portrait.style.setProperty("--tilt-x", "0deg");
      portrait.style.setProperty("--tilt-y", "0deg");
      portrait.style.setProperty("--mouse-x", "50%");
      portrait.style.setProperty("--mouse-y", "50%");
    });
  });

  /* =====================================================
     ENTRANCE OBSERVER
  ===================================================== */
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      trustedShell.classList.add("is-visible");
      observer.disconnect();
    },
    {
      threshold: 0.18,
    }
  );

  observer.observe(trustedShell);
}

/* =======================================================
   CTA MICROINTERACTION
======================================================= */
if (ctaButton) {
  ctaButton.addEventListener("pointermove", (event) => {
    const rect = ctaButton.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const move = ((x / rect.width) - 0.5) * 8;

    ctaButton.style.transform = `translateY(-3px) scale(1.015) translateX(${move}px)`;
  });

  ctaButton.addEventListener("pointerleave", () => {
    ctaButton.style.transform = "";
  });
}