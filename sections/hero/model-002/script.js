const $=(s,p=document)=>p.querySelector(s);
const $$=(s,p=document)=>[...p.querySelectorAll(s)];

const hero=$("#hero");
const image=$(".hero-media img");

const reduced=
  window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

const ease="cubic-bezier(.16,1,.3,1)";


function reveal(
  selector,
  delay,
  duration=1000,
  from="translateY(25px)"
){
  const el=$(selector);

  if(!el)return;

  el.animate(
    [
      {
        opacity:0,
        transform:from
      },
      {
        opacity:1,
        transform:"none"
      }
    ],
    {
      duration,
      delay,
      easing:ease,
      fill:"forwards"
    }
  );
}


if(!reduced){

  reveal(
    ".nav",
    150,
    950,
    "translateY(-18px)"
  );

  reveal(
    ".hero-brand",
    260,
    1400,
    "translate(-50%,30px) scale(.96)"
  );

  reveal(
    ".copy-left",
    500,
    900,
    "translateX(-18px)"
  );

  reveal(
    ".copy-right",
    550,
    900,
    "translateX(18px)"
  );

  reveal(
    ".hero-message",
    700,
    1200,
    "translateY(35px)"
  );

  reveal(
    ".services",
    850,
    1100,
    "translateX(30px)"
  );

  reveal(
    ".bottom-copy",
    1000,
    900,
    "translateY(15px)"
  );

  reveal(
    ".main-cta",
    1100,
    900,
    "translate(-50%,20px)"
  );

}else{

  $$(
    ".nav,.hero-brand,.copy,.hero-message,.services,.bottom-copy,.main-cta"
  )
  .forEach(el=>{
    el.style.opacity=1;
  });

}


/* POINTER PARALLAX */

let targetX=0;
let targetY=0;
let currentX=0;
let currentY=0;


hero.addEventListener(
  "pointermove",
  e=>{

    targetX=
      e.clientX /
      window.innerWidth -
      .5;

    targetY=
      e.clientY /
      window.innerHeight -
      .5;

  }
);


hero.addEventListener(
  "pointerleave",
  ()=>{
    targetX=0;
    targetY=0;
  }
);


function render(){

  currentX+=
    (targetX-currentX)*
    .045;

  currentY+=
    (targetY-currentY)*
    .045;


  if(!reduced){

    image.style.transform=
      `
      scale(1.055)
      translate3d(
        ${currentX*-12}px,
        ${currentY*-9}px,
        0
      )
      `;


    $(".hero-brand")
      .style.transform=
      `
      translateX(
        calc(-50% + ${currentX*-7}px)
      )
      translateY(
        ${currentY*-4}px
      )
      `;


    $(".hero-message")
      .style.transform=
      `
      translate3d(
        ${currentX*8}px,
        ${currentY*5}px,
        0
      )
      `;

  }


  requestAnimationFrame(render);

}

render();


/* SERVICES MICROINTERACTION */

$$(".service").forEach(card=>{

  card.addEventListener(
    "pointermove",
    e=>{

      if(reduced)return;

      const r=
        card.getBoundingClientRect();

      const x=
        (
          e.clientX-r.left
        ) /
        r.width -
        .5;

      const y=
        (
          e.clientY-r.top
        ) /
        r.height -
        .5;


      card.style.transform=
        `
        perspective(700px)
        rotateX(${y*-3}deg)
        rotateY(${x*4}deg)
        translateX(-6px)
        `;

    }
  );


  card.addEventListener(
    "pointerleave",
    ()=>{
      card.style.transform="";
    }
  );

});