/* =============================================
   PRODUCT CARDS
============================================= */

const cards = document.querySelectorAll(".product-card");

// El tilt solo tiene sentido con ratón y sin reducir movimiento
const canTilt = window.matchMedia(
  "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
);

const MAX_TILT = 5; // grados: sutil, no "gaming card"


/* =============================================
   SINGLE-CHOICE GROUP (sizes / colors)
============================================= */

function selectInGroup(buttons, selected) {
  buttons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button === selected));
  });
}


cards.forEach((card) => {

  /* =========================================
     TILT
  ========================================= */

  card.addEventListener("pointermove", (event) => {
    if (!canTilt.matches || event.pointerType !== "mouse") return;

    const rect = card.getBoundingClientRect();

    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;

    card.classList.add("is-tilting");
    card.style.setProperty("--ry", `${px * MAX_TILT * 2}deg`);
    card.style.setProperty("--rx", `${-py * MAX_TILT * 2}deg`);
  });

  card.addEventListener("pointerleave", () => {
    card.classList.remove("is-tilting");
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  });


  /* =========================================
     SIZE SELECTION
  ========================================= */

  const sizes = card.querySelectorAll(".size");

  sizes.forEach((size) => {
    size.addEventListener("click", () => selectInGroup(sizes, size));
  });


  /* =========================================
     COLOR SELECTION
     Actualiza el nombre visible y el acento
     de la card (tag, fondo de media, CTA).
  ========================================= */

  const colors = card.querySelectorAll(".color");
  const colorName = card.querySelector(".color-name");

  colors.forEach((color) => {
    color.addEventListener("click", () => {
      selectInGroup(colors, color);

      colorName.textContent = color.dataset.name;

      card.style.setProperty(
        "--accent",
        getComputedStyle(color).getPropertyValue("--swatch").trim()
      );
    });
  });


  /* =========================================
     ADD TO CART VISUAL FEEDBACK
  ========================================= */

  const cartButton = card.querySelector(".cart-button");
  const cartText = cartButton.querySelector(".cart-text");
  const originalText = cartText.textContent;

  let resetTimer;

  cartButton.addEventListener("click", () => {
    clearTimeout(resetTimer);

    cartText.textContent = "Added ✓";
    cartButton.classList.add("is-added");

    resetTimer = setTimeout(() => {
      cartText.textContent = originalText;
      cartButton.classList.remove("is-added");
    }, 1400);
  });

});
