const intro = document.querySelector("#intro");
const introGrid = document.querySelector("#introGrid");

const isMobile = window.innerWidth <= 900;
const columns = isMobile ? 8 : 14;
const rows = isMobile ? 10 : 8;

const tiles = [];

/* =========================
   CREATE GRID
========================= */
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < columns; col++) {
    const tile = document.createElement("div");
    tile.classList.add("intro-tile");

    tile.dataset.col = col;
    tile.dataset.row = row;

    introGrid.appendChild(tile);
    tiles.push(tile);
  }
}

/* =========================
   REVEAL ANIMATION
========================= */
function revealIntro() {
  intro.classList.add("revealing");
  document.body.classList.add("loaded");

  tiles.forEach((tile) => {
    const col = Number(tile.dataset.col);
    const row = Number(tile.dataset.row);

    // izquierda -> derecha
    // cada columna tarda un poco más
    // cada fila tiene una pequeña variación
    const delay = col * 85 + row * 14 + Math.random() * 70;

    setTimeout(() => {
      tile.classList.add("fade");
    }, delay);
  });

  // quitar overlay al final
  const totalDuration = columns * 85 + rows * 14 + 1200;

  setTimeout(() => {
    intro.remove();
  }, totalDuration);
}

/* =========================
   START
========================= */
window.addEventListener("load", () => {
  setTimeout(() => {
    revealIntro();
  }, 900);
});
