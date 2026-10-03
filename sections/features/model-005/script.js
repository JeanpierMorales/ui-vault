document.body.classList.add("loading");

const CONFIG={
  direction:"bottom-left",
  cellSize:72,
  introDuration:950,
  transitionDuration:1150
};

/*
DIRECCIONES DISPONIBLES:

left
right
top
bottom

top-left
top-right
bottom-left
bottom-right

center
edges
random
*/

const preloader=document.getElementById("preloader");
const grid=document.getElementById("grid");
const brand=document.querySelector(".brand-mark");
const subtitle=document.querySelector(".brand-subtitle");

let rows,cols,cells=[];

function createGrid(){
  grid.innerHTML="";
  cells=[];

  cols=Math.ceil(window.innerWidth/CONFIG.cellSize);
  rows=Math.ceil(window.innerHeight/CONFIG.cellSize);

  grid.style.gridTemplateColumns=`repeat(${cols},1fr)`;
  grid.style.gridTemplateRows=`repeat(${rows},1fr)`;

  const total=rows*cols;

  for(let i=0;i<total;i++){
    const cell=document.createElement("div");
    cell.className="preloader-cell";

    const row=Math.floor(i/cols);
    const col=i%cols;

    cell.dataset.row=row;
    cell.dataset.col=col;

    grid.appendChild(cell);
    cells.push(cell);
  }
}

function easeInOutCubic(t){
  return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
}

function getDelay(row,col){
  const maxRow=rows-1;
  const maxCol=cols-1;

  const cx=maxCol/2;
  const cy=maxRow/2;

  let distance=0;
  let maxDistance=1;

  switch(CONFIG.direction){

    case "left":
      distance=col;
      maxDistance=maxCol;
      break;

    case "right":
      distance=maxCol-col;
      maxDistance=maxCol;
      break;

    case "top":
      distance=row;
      maxDistance=maxRow;
      break;

    case "bottom":
      distance=maxRow-row;
      maxDistance=maxRow;
      break;

    case "top-left":
      distance=row+col;
      maxDistance=maxRow+maxCol;
      break;

    case "top-right":
      distance=row+(maxCol-col);
      maxDistance=maxRow+maxCol;
      break;

    case "bottom-left":
      distance=(maxRow-row)+col;
      maxDistance=maxRow+maxCol;
      break;

    case "bottom-right":
      distance=(maxRow-row)+(maxCol-col);
      maxDistance=maxRow+maxCol;
      break;

    case "center":
      distance=Math.hypot(col-cx,row-cy);
      maxDistance=Math.hypot(cx,cy);
      break;

    case "edges":
      distance=-Math.min(
        row,
        col,
        maxRow-row,
        maxCol-col
      );

      maxDistance=Math.max(rows,cols)/2;
      distance+=maxDistance;
      break;

    case "random":
      return Math.random();

    default:
      distance=col;
      maxDistance=maxCol;
  }

  return distance/(maxDistance||1);
}

function animateBrand(){
  brand.animate(
    [
      {opacity:0,transform:"translateY(20px)"},
      {opacity:1,transform:"translateY(0)"}
    ],
    {
      duration:700,
      easing:"cubic-bezier(.16,1,.3,1)",
      fill:"forwards"
    }
  );

  subtitle.animate(
    [
      {opacity:0,transform:"translateY(10px)"},
      {opacity:1,transform:"translateY(0)"}
    ],
    {
      duration:700,
      delay:120,
      easing:"cubic-bezier(.16,1,.3,1)",
      fill:"forwards"
    }
  );
}

function hideBrand(){
  brand.animate(
    [
      {opacity:1,transform:"translateY(0)"},
      {opacity:0,transform:"translateY(-12px)"}
    ],
    {
      duration:350,
      easing:"ease",
      fill:"forwards"
    }
  );

  subtitle.animate(
    [
      {opacity:1},
      {opacity:0}
    ],
    {
      duration:250,
      fill:"forwards"
    }
  );
}

function revealHero(){
  const content=document.querySelector(".hero-content");
  const visual=document.querySelector(".hero-visual");

  content.animate(
    [
      {opacity:0,transform:"translateY(40px)"},
      {opacity:1,transform:"translateY(0)"}
    ],
    {
      duration:1000,
      easing:"cubic-bezier(.16,1,.3,1)",
      fill:"forwards"
    }
  );

  visual.animate(
    [
      {opacity:0,transform:"translateY(50px) scale(.97)"},
      {opacity:1,transform:"translateY(0) scale(1)"}
    ],
    {
      duration:1200,
      delay:100,
      easing:"cubic-bezier(.16,1,.3,1)",
      fill:"forwards"
    }
  );
}

function breakGrid(){

  hideBrand();

  const transitionDuration=CONFIG.transitionDuration;
  const cellDuration=420;

  cells.forEach(cell=>{

    const row=Number(cell.dataset.row);
    const col=Number(cell.dataset.col);

    let progress=getDelay(row,col);

    progress=Math.max(0,Math.min(1,progress));
    progress=easeInOutCubic(progress);

    const delay=progress*(transitionDuration-cellDuration);

    cell.animate(
      [
        {
          opacity:1,
          transform:"scale(1.02)"
        },
        {
          opacity:0,
          transform:"scale(.86)"
        }
      ],
      {
        duration:cellDuration,
        delay,
        easing:"cubic-bezier(.65,0,.35,1)",
        fill:"forwards"
      }
    );
  });

  setTimeout(()=>{
    revealHero();
  },200);

  setTimeout(()=>{
    preloader.remove();
    document.body.classList.remove("loading");
  },transitionDuration+120);
}

function init(){
  createGrid();
  animateBrand();

  setTimeout(()=>{
    breakGrid();
  },CONFIG.introDuration);
}

window.addEventListener("load",init);