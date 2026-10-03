const cards = document.querySelectorAll(".profile-card");

// Tilt solo con ratón y sin preferencia de movimiento reducido
const canTilt = window.matchMedia(
  "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
);

/* =========================================
   CLIPBOARD (con fallback para iframes)
========================================= */

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // El iframe del vault puede bloquear la API: fallback clásico
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();

    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }

    field.remove();
    return ok;
  }
}

function restartAnimation(element, className) {
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
}

cards.forEach((card) => {

  const surface =
    card.querySelector(".profile-card__surface");

  const saveButton =
    card.querySelector(".profile-card__save");

  const shareButton =
    card.querySelector(".profile-card__share");

  const toast =
    card.querySelector(".profile-card__toast");

  const name =
    card.querySelector(".profile-card__identity h2").textContent.trim();

  /* =========================================
     SUBTLE 3D CURSOR INTERACTION
  ========================================= */

  card.addEventListener("pointermove", (event) => {

    if (!canTilt.matches || event.pointerType !== "mouse") {
      return;
    }

    const rect =
      card.getBoundingClientRect();

    const percentX =
      (event.clientX - rect.left) /
      rect.width;

    const percentY =
      (event.clientY - rect.top) /
      rect.height;

    /*
     * Muy reducido intencionalmente.
     * Evita efecto "gaming card".
     */
    const rotateY =
      (percentX - 0.5) * 3.2;

    const rotateX =
      (0.5 - percentY) * 3.2;

    card.classList.add("is-tilting");

    card.style.transform = `
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-6px)
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

    card.classList.remove("is-tilting");
    card.style.transform = "";

  });


  /* =========================================
     SAVE (toggle con aria-pressed)
  ========================================= */

  saveButton.addEventListener("click", () => {

    const saved =
      saveButton.getAttribute("aria-pressed") !== "true";

    saveButton.setAttribute("aria-pressed", String(saved));

    saveButton.setAttribute(
      "aria-label",
      saved
        ? "Quitar perfil de guardados"
        : "Guardar perfil"
    );

    if (saved) {
      restartAnimation(saveButton, "is-popping");
    }

  });

  saveButton.addEventListener("animationend", () => {
    saveButton.classList.remove("is-popping");
  });


  /* =========================================
     SHARE
     Hoja nativa si existe; si no, copia el
     enlace y muestra un toast breve.
  ========================================= */

  let toastTimer;

  function showToast(message) {
    clearTimeout(toastTimer);

    toast.textContent = message;
    toast.classList.add("is-visible");

    toastTimer = setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 1800);
  }

  shareButton.addEventListener("click", async () => {

    restartAnimation(shareButton, "is-shared");

    const url = `${location.href.split("#")[0]}#${name.toLowerCase().replace(/\s+/g, "-")}`;

    if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
      try {
        await navigator.share({ title: name, url });
        return;
      } catch {
        // Cancelado o bloqueado: seguimos con copiar
      }
    }

    const copied = await copyText(url);

    showToast(copied ? "Link copied" : "Couldn’t copy link");

  });

  shareButton.addEventListener("animationend", () => {
    shareButton.classList.remove("is-shared");
  });

});
