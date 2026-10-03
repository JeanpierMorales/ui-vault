const swing = document.getElementById("badgeSwing");
const card = document.getElementById("idCard");
const flipButton = document.getElementById("flipButton");
const qr = document.getElementById("idQr");

const front = card.querySelector(".id-card__face--front");
const back = card.querySelector(".id-card__face--back");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

/* =========================================
   SWING (muelle amortiguado)
   El conjunto cinta + card gira desde el anclaje
   superior. Al soltar, oscila y se detiene solo.
========================================= */

const spring = {
  angle: 0,      // grados actuales
  velocity: 0,
  target: 0,
  stiffness: 55, // más alto = vuelve más rápido
  damping: 5.5   // más bajo = más oscilaciones
};

let rafId = null;
let lastTime = 0;

function render() {
  swing.style.transform = `rotate(${spring.angle.toFixed(3)}deg)`;

  // Movimiento secundario: la card se retrasa un poco
  // respecto a la cinta, como un objeto colgado real
  card.style.setProperty("--lag", `${(-spring.velocity * 0.02).toFixed(3)}deg`);
}

function step(time) {
  const dt = Math.min((time - lastTime) / 1000, 1 / 30);
  lastTime = time;

  const force =
    -spring.stiffness * (spring.angle - spring.target) -
    spring.damping * spring.velocity;

  spring.velocity += force * dt;
  spring.angle += spring.velocity * dt;

  render();

  const settled =
    Math.abs(spring.angle - spring.target) < 0.01 &&
    Math.abs(spring.velocity) < 0.01;

  if (settled && !isDragging) {
    spring.angle = spring.target;
    spring.velocity = 0;
    render();
    rafId = null;
    return;
  }

  rafId = requestAnimationFrame(step);
}

function startSpring() {
  if (reducedMotion.matches || rafId) return;

  lastTime = performance.now();
  rafId = requestAnimationFrame(step);
}

/* =========================================
   HOVER: tilt 3D + brillo + ligera inclinación
========================================= */

// Solo sobre la card: pasar por los controles no la inclina
card.addEventListener("pointermove", (event) => {
  if (reducedMotion.matches || !finePointer.matches) return;
  if (event.pointerType !== "mouse" || isDragging) return;

  const rect = card.getBoundingClientRect();

  const px = (event.clientX - rect.left) / rect.width;
  const py = (event.clientY - rect.top) / rect.height;

  const clampedX = Math.min(Math.max(px, 0), 1);
  const clampedY = Math.min(Math.max(py, 0), 1);

  card.classList.add("is-tracking");
  card.style.setProperty("--ry", `${(clampedX - 0.5) * 10}deg`);
  card.style.setProperty("--rx", `${(0.5 - clampedY) * 7}deg`);

  front.style.setProperty("--mx", `${px * 100}%`);
  front.style.setProperty("--my", `${py * 100}%`);

  // La card se inclina suavemente hacia el cursor
  spring.target = (clampedX - 0.5) * 3;
  startSpring();
});

card.addEventListener("pointerleave", () => {
  if (isDragging) return;

  card.classList.remove("is-tracking");
  card.style.setProperty("--rx", "0deg");
  card.style.setProperty("--ry", "0deg");

  spring.target = 0;
  startSpring();
});

/* =========================================
   DRAG: arrastrar lateralmente balancea la card
========================================= */

let isDragging = false;
let dragStartX = 0;
let dragStartAngle = 0;
let dragDistance = 0;

card.addEventListener("pointerdown", (event) => {
  if (reducedMotion.matches || event.button !== 0) return;

  isDragging = true;
  dragDistance = 0;
  dragStartX = event.clientX;
  dragStartAngle = spring.angle;

  card.setPointerCapture(event.pointerId);
  card.classList.add("is-dragging");
});

card.addEventListener("pointermove", (event) => {
  if (!isDragging) return;

  const deltaX = event.clientX - dragStartX;
  dragDistance = Math.max(dragDistance, Math.abs(deltaX));

  // Resistencia progresiva: nunca pasa de ~14°
  const angle = dragStartAngle + 14 * Math.tanh(deltaX / 260);

  spring.target = angle;
  spring.angle = angle;
  spring.velocity = 0;
  render();
});

function endDrag(event) {
  if (!isDragging) return;

  isDragging = false;
  card.classList.remove("is-dragging");

  if (card.hasPointerCapture(event.pointerId)) {
    card.releasePointerCapture(event.pointerId);
  }

  // Soltamos: el muelle la devuelve al centro oscilando
  spring.target = 0;
  startSpring();
}

card.addEventListener("pointerup", endDrag);
card.addEventListener("pointercancel", endDrag);

/* =========================================
   FLIP (control de perfil)
========================================= */

function setFlipped(flipped) {
  card.classList.toggle("is-flipped", flipped);

  flipButton.setAttribute("aria-pressed", String(flipped));
  flipButton.querySelector("span").textContent = flipped ? "Show front" : "Show back";

  // Solo la cara visible queda expuesta a lectores de pantalla
  front.setAttribute("aria-hidden", String(flipped));
  back.setAttribute("aria-hidden", String(!flipped));

  // Pequeño empujón para que el giro se sienta físico
  spring.velocity += flipped ? 40 : -40;
  startSpring();
}

flipButton.addEventListener("click", () => {
  setFlipped(!card.classList.contains("is-flipped"));
});

// Un clic (no un arrastre) sobre la card también la gira
card.addEventListener("click", () => {
  if (dragDistance > 6) return;
  setFlipped(!card.classList.contains("is-flipped"));
});

/* =========================================
   QR DECORATIVO
   Patrón determinista a partir del nº de ID,
   con los tres marcadores de esquina reales.
========================================= */

function drawQr(seedText) {
  const size = 25;
  const svgNS = "http://www.w3.org/2000/svg";

  let seed = [...seedText].reduce((acc, ch) => acc * 31 + ch.charCodeAt(0), 7) >>> 0;

  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  const inFinder = (x, y) =>
    (x < 8 && y < 8) || (x > size - 9 && y < 8) || (x < 8 && y > size - 9);

  const finderCell = (x, y) => {
    const fx = x < 8 ? x : x - (size - 7);
    const fy = y < 8 ? y : y - (size - 7);

    if (fx < 0 || fy < 0 || fx > 6 || fy > 6) return false;

    const ring = fx === 0 || fx === 6 || fy === 0 || fy === 6;
    const core = fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4;

    return ring || core;
  };

  const fragment = document.createDocumentFragment();

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const filled = inFinder(x, y) ? finderCell(x, y) : random() > 0.52;

      if (!filled) continue;

      const rect = document.createElementNS(svgNS, "rect");
      rect.setAttribute("x", x);
      rect.setAttribute("y", y);
      rect.setAttribute("width", 1);
      rect.setAttribute("height", 1);
      fragment.appendChild(rect);
    }
  }

  qr.appendChild(fragment);
}

drawQr("32544585");
