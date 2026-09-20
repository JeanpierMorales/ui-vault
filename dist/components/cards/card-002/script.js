const carousel = document.getElementById("productCarousel");
const track = document.getElementById("productTrack");

const prevButton = document.getElementById("carouselPrev");
const nextButton = document.getElementById("carouselNext");

const originalCards = [...track.children];

const CARD_GAP =
  parseFloat(
    getComputedStyle(track).gap
  ) || 22;

/*
|--------------------------------------------------------------------------
| DUPLICATE ITEMS
|--------------------------------------------------------------------------
|
| Duplicamos el contenido una vez hacia delante
| y una vez hacia atrás.
|
*/

originalCards.forEach((card) => {
  const clone = card.cloneNode(true);
  clone.setAttribute("aria-hidden", "true");
  track.appendChild(clone);
});

[...originalCards]
  .reverse()
  .forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.insertBefore(clone, track.firstChild);
  });

/*
|--------------------------------------------------------------------------
| DIMENSIONS
|--------------------------------------------------------------------------
*/

let cardWidth = 0;
let groupWidth = 0;
let position = 0;

function calculateDimensions() {
  const firstCard = track.querySelector(".product-card");

  if (!firstCard) return;

  cardWidth =
    firstCard.getBoundingClientRect().width +
    CARD_GAP;

  groupWidth =
    cardWidth *
    originalCards.length;
}

/*
|--------------------------------------------------------------------------
| INITIAL POSITION
|--------------------------------------------------------------------------
|
| Empezamos directamente sobre el grupo original.
|
*/

function setInitialPosition() {
  calculateDimensions();

  position = -groupWidth;

  track.style.transition = "none";

  track.style.transform =
    `translate3d(${position}px, 0, 0)`;
}

setInitialPosition();

/*
|--------------------------------------------------------------------------
| INFINITE LOOP
|--------------------------------------------------------------------------
|
| Cuando entramos demasiado en uno de los clones,
| saltamos silenciosamente al grupo equivalente.
|
*/

function normalizeLoop() {

  if (position <= -groupWidth * 2) {

    position += groupWidth;

    track.style.transition = "none";

    track.style.transform =
      `translate3d(${position}px, 0, 0)`;

  }

  else if (position >= 0) {

    position -= groupWidth;

    track.style.transition = "none";

    track.style.transform =
      `translate3d(${position}px, 0, 0)`;

  }
}

/*
|--------------------------------------------------------------------------
| SMOOTH MOVEMENT
|--------------------------------------------------------------------------
*/

function moveCarousel(distance) {

  position += distance;

  track.style.transition =
    "transform 720ms cubic-bezier(.2, .75, .2, 1)";

  track.style.transform =
    `translate3d(${position}px, 0, 0)`;

}

/*
|--------------------------------------------------------------------------
| BUTTONS
|--------------------------------------------------------------------------
*/

nextButton.addEventListener("click", () => {
  moveCarousel(-cardWidth);
});

prevButton.addEventListener("click", () => {
  moveCarousel(cardWidth);
});

/*
|--------------------------------------------------------------------------
| TRANSITION END
|--------------------------------------------------------------------------
*/

track.addEventListener("transitionend", () => {
  normalizeLoop();
});

/*
|--------------------------------------------------------------------------
| DRAG
|--------------------------------------------------------------------------
*/

let isDragging = false;

let dragStartX = 0;
let dragStartPosition = 0;

let previousX = 0;
let previousTime = 0;

let velocity = 0;

let hasMoved = false;

carousel.addEventListener("pointerdown", (event) => {

  isDragging = true;

  hasMoved = false;

  dragStartX = event.clientX;

  previousX = event.clientX;

  previousTime = performance.now();

  dragStartPosition = position;

  velocity = 0;

  carousel.classList.add("is-dragging");

  carousel.setPointerCapture(event.pointerId);

  track.style.transition = "none";
});

carousel.addEventListener("pointermove", (event) => {

  if (!isDragging) return;

  const currentX = event.clientX;

  const currentTime = performance.now();

  const deltaX =
    currentX -
    dragStartX;

  if (Math.abs(deltaX) > 4) {
    hasMoved = true;
  }

  position =
    dragStartPosition +
    deltaX;

  track.style.transform =
    `translate3d(${position}px, 0, 0)`;

  const frameDistance =
    currentX -
    previousX;

  const frameTime =
    currentTime -
    previousTime;

  if (frameTime > 0) {

    velocity =
      frameDistance /
      frameTime;

  }

  previousX = currentX;

  previousTime = currentTime;

  normalizeLoop();
});

function finishDrag() {

  if (!isDragging) return;

  isDragging = false;

  carousel.classList.remove("is-dragging");

  /*
  |--------------------------------------------------------------------------
  | LIGHT INERTIA
  |--------------------------------------------------------------------------
  */

  const inertiaDistance =
    velocity *
    160;

  position += inertiaDistance;

  track.style.transition =
    "transform 650ms cubic-bezier(.18, .75, .25, 1)";

  track.style.transform =
    `translate3d(${position}px, 0, 0)`;
}

carousel.addEventListener("pointerup", finishDrag);

carousel.addEventListener(
  "pointercancel",
  finishDrag
);

carousel.addEventListener(
  "pointerleave",
  () => {

    if (isDragging) {
      finishDrag();
    }

  }
);

/*
|--------------------------------------------------------------------------
| PREVENT LINK CLICK WHILE DRAGGING
|--------------------------------------------------------------------------
*/

carousel.addEventListener(
  "click",
  (event) => {

    if (hasMoved) {

      event.preventDefault();

      event.stopPropagation();

    }

  },
  true
);

/*
|--------------------------------------------------------------------------
| MOUSE WHEEL
|--------------------------------------------------------------------------
|
| Trackpads pueden desplazar el carrusel horizontalmente.
|
*/

carousel.addEventListener(
  "wheel",
  (event) => {

    const horizontalMovement =
      Math.abs(event.deltaX) >
      Math.abs(event.deltaY);

    if (!horizontalMovement) return;

    event.preventDefault();

    position -= event.deltaX;

    track.style.transition = "none";

    track.style.transform =
      `translate3d(${position}px, 0, 0)`;

    normalizeLoop();

  },
  {
    passive: false
  }
);

/*
|--------------------------------------------------------------------------
| RESIZE
|--------------------------------------------------------------------------
*/

window.addEventListener("resize", () => {

  const previousGroupWidth =
    groupWidth;

  calculateDimensions();

  if (!previousGroupWidth) return;

  const relativePosition =
    position /
    previousGroupWidth;

  position =
    relativePosition *
    groupWidth;

  track.style.transition = "none";

  track.style.transform =
    `translate3d(${position}px, 0, 0)`;

});