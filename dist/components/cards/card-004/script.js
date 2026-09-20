const cards = document.querySelectorAll(".profile-card");

cards.forEach((card) => {

  const surface =
    card.querySelector(".profile-card__surface");

  const saveButton =
    card.querySelector(".profile-card__save");

  /* =========================================
     SUBTLE 3D CURSOR INTERACTION
  ========================================= */

  card.addEventListener("pointermove", (event) => {

    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const rect =
      card.getBoundingClientRect();

    const x =
      event.clientX -
      rect.left;

    const y =
      event.clientY -
      rect.top;

    const percentX =
      x /
      rect.width;

    const percentY =
      y /
      rect.height;

    /*
     * Muy reducido intencionalmente.
     * Evita efecto "gaming card".
     */
    const rotateY =
      (percentX - 0.5) * 3.2;

    const rotateX =
      (0.5 - percentY) * 3.2;

    card.style.transform = `
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-4px)
    `;

    surface.style.setProperty(
      "--mouse-x",
      `${percentX * 100}%`
    );

    surface.style.setProperty(
      "--mouse-y",
      `${percentY * 100}%`
    );

  });


  /* =========================================
     RETURN TO REST
  ========================================= */

  card.addEventListener("pointerleave", () => {

    card.style.transform = `
      rotateX(0deg)
      rotateY(0deg)
      translateY(0)
    `;

  });


  /* =========================================
     SAVE
  ========================================= */

  saveButton.addEventListener("click", () => {

    const saved =
      saveButton.classList.toggle("is-saved");

    saveButton.setAttribute(
      "aria-label",
      saved
        ? "Quitar perfil de guardados"
        : "Guardar perfil"
    );

  });

});