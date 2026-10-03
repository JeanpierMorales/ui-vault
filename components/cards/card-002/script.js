const carousel = document.getElementById("productCarousel");
const track = carousel.querySelector(".product-track");

const prevButton = document.getElementById("carouselPrev");
const nextButton = document.getElementById("carouselNext");
const thumb = document.getElementById("carouselThumb");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
|
| El carrusel usa scroll nativo con scroll-snap. Aquí solo
| calculamos cuánto avanzar y el estado de las flechas.
|
*/

function scrollBehavior() {
  return reducedMotion.matches ? "auto" : "smooth";
}

// Distancia de un paso = ancho de card + gap
function stepSize() {
  const card = track.querySelector(".product-card");
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0;

  return card ? card.getBoundingClientRect().width + gap : 300;
}

function maxScroll() {
  return carousel.scrollWidth - carousel.clientWidth;
}

function go(direction) {
  carousel.scrollBy({
    left: direction * stepSize(),
    behavior: scrollBehavior()
  });
}

/*
|--------------------------------------------------------------------------
| ARROWS + PROGRESS
|--------------------------------------------------------------------------
*/

let ticking = false;

function updateUI() {
  ticking = false;

  const max = maxScroll();
  const left = carousel.scrollLeft;

  // 2px de tolerancia por redondeos subpíxel
  prevButton.disabled = left <= 2;
  nextButton.disabled = left >= max - 2;

  const visible = carousel.clientWidth / carousel.scrollWidth;
  const progress = max > 0 ? left / max : 0;

  // El thumb ocupa "visible" del riel y se desplaza con translateX
  const railWidth = thumb.parentElement.clientWidth;
  const thumbWidth = railWidth * visible;

  thumb.style.transform =
    `translateX(${progress * (railWidth - thumbWidth)}px) scaleX(${visible})`;
}

function requestUpdate() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(updateUI);
}

carousel.addEventListener("scroll", requestUpdate, { passive: true });
window.addEventListener("resize", requestUpdate);

prevButton.addEventListener("click", () => go(-1));
nextButton.addEventListener("click", () => go(1));

/*
|--------------------------------------------------------------------------
| KEYBOARD
|--------------------------------------------------------------------------
*/

carousel.addEventListener("keydown", (event) => {
  // Solo cuando el foco está en el propio carrusel,
  // no en un enlace o swatch interior
  if (event.target !== carousel) return;

  const actions = {
    ArrowRight: () => go(1),
    ArrowLeft: () => go(-1),
    Home: () => carousel.scrollTo({ left: 0, behavior: scrollBehavior() }),
    End: () => carousel.scrollTo({ left: maxScroll(), behavior: scrollBehavior() })
  };

  const action = actions[event.key];

  if (action) {
    event.preventDefault();
    action();
  }
});

/*
|--------------------------------------------------------------------------
| MOUSE DRAG
|--------------------------------------------------------------------------
|
| Touch y trackpad ya funcionan de forma nativa. Para ratón
| añadimos arrastre; al soltar, el snap vuelve a encajar.
|
*/

let dragStartX = 0;
let dragStartScroll = 0;
let isPointerDown = false;
let hasMoved = false;

carousel.addEventListener("pointerdown", (event) => {
  if (event.pointerType !== "mouse" || event.button !== 0) return;
  if (event.target.closest("button")) return;

  isPointerDown = true;
  hasMoved = false;

  dragStartX = event.clientX;
  dragStartScroll = carousel.scrollLeft;
});

window.addEventListener("pointermove", (event) => {
  if (!isPointerDown) return;

  const deltaX = event.clientX - dragStartX;

  if (!hasMoved && Math.abs(deltaX) > 5) {
    hasMoved = true;
    carousel.classList.add("is-dragging");
  }

  if (hasMoved) {
    carousel.scrollLeft = dragStartScroll - deltaX;
  }
});

function endDrag() {
  if (!isPointerDown) return;

  isPointerDown = false;

  if (!hasMoved) return;

  // Encajamos en la card más cercana antes de reactivar el snap
  const step = stepSize();
  const target = Math.round(carousel.scrollLeft / step) * step;

  carousel.classList.remove("is-dragging");
  carousel.scrollTo({ left: target, behavior: scrollBehavior() });
}

window.addEventListener("pointerup", endDrag);
window.addEventListener("pointercancel", endDrag);

// Un arrastre no debe navegar al soltar sobre un enlace
carousel.addEventListener(
  "click",
  (event) => {
    if (hasMoved) {
      event.preventDefault();
      event.stopPropagation();
      hasMoved = false;
    }
  },
  true
);

// Demo: los enlaces "#" no deben saltar al inicio de la página
track.querySelectorAll(".product-card__link").forEach((link) => {
  link.addEventListener("click", (event) => event.preventDefault());
});

/*
|--------------------------------------------------------------------------
| COLOR SWATCHES
|--------------------------------------------------------------------------
|
| Cada swatch actualiza el nombre de la variante y tiñe la
| foto. El primer swatch es la foto original (sin tinte).
|
*/

track.querySelectorAll(".product-card").forEach((card) => {
  const swatches = [...card.querySelectorAll(".product-color")];
  const variant = card.querySelector(".product-card__variant");
  const tint = card.querySelector(".product-card__tint");

  swatches.forEach((swatch, index) => {
    swatch.addEventListener("click", () => {
      swatches.forEach((item) => {
        item.setAttribute("aria-pressed", String(item === swatch));
      });

      if (variant) variant.textContent = swatch.dataset.variant;

      if (tint) {
        if (index > 0) {
          tint.style.setProperty(
            "--tint",
            getComputedStyle(swatch).getPropertyValue("--swatch").trim()
          );
        }

        tint.classList.toggle("is-visible", index > 0);
      }
    });
  });
});

updateUI();
