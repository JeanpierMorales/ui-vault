const intro = document.querySelector("#intro");
const grid = document.querySelector("#introGrid");


// ========================================
// SETTINGS
// ========================================

const columns = window.innerWidth <= 800
  ? 6
  : 12;

const rows = window.innerWidth <= 800
  ? 10
  : 8;

const totalTiles = columns * rows;


// ========================================
// CREATE GRID
// ========================================

const tiles = [];

for (let i = 0; i < totalTiles; i++) {

  const tile =
    document.createElement("div");

  tile.classList.add("intro-tile");

  grid.appendChild(tile);

  tiles.push(tile);

}


// ========================================
// START REVEAL
// ========================================

function revealWebsite() {

  intro.classList.add("revealing");


  tiles.forEach((tile, index) => {

    const column =
      index % columns;

    const row =
      Math.floor(index / columns);


    /*
      LEFT → RIGHT

      Column controls most of the delay.

      Row adds tiny imperfection so that
      it doesn't look robotic.
    */

    const delay =
      column * 55 +
      row * 12 +
      Math.random() * 50;


    setTimeout(() => {

      tile.classList.add("hide");

    }, delay);

  });


  // Remove overlay after animation

  setTimeout(() => {

    intro.classList.add("finished");

    intro.remove();

  }, 1800);

}


// ========================================
// INTRO TIMING
// ========================================

window.addEventListener(
  "load",
  () => {

    setTimeout(
      revealWebsite,
      900
    );

  }
);