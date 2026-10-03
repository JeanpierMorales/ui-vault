const cards = document.querySelectorAll(".travel-card");

cards.forEach((card) => {
  // Hay dos corazones por card (foto y panel): se mantienen sincronizados
  const favoriteButtons = card.querySelectorAll(".travel-card__favorite");

  favoriteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const willBeActive = button.getAttribute("aria-pressed") !== "true";

      favoriteButtons.forEach((item) => {
        item.setAttribute("aria-pressed", String(willBeActive));
        item.setAttribute(
          "aria-label",
          willBeActive ? "Quitar destino de guardados" : "Guardar destino"
        );
      });

      // Reinicia la animación "pop" solo al marcar
      if (willBeActive) {
        favoriteButtons.forEach((item) => {
          item.classList.remove("is-popping");
          void item.offsetWidth;
          item.classList.add("is-popping");
        });
      }
    });

    button.addEventListener("animationend", () => {
      button.classList.remove("is-popping");
    });
  });
});
