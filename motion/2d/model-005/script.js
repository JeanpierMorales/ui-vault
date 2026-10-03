const tl=gsap.timeline({defaults:{ease:"power3.out"}});

gsap.set(".display",{
  y:60,
  rotateX:-16,
  opacity:0,
  transformOrigin:"50% 100%"
});

gsap.set(".base",{
  y:28,
  opacity:0
});

gsap.set(".copy > *",{
  y:20,
  opacity:0
});

gsap.set(".visual",{
  clipPath:"inset(100% 0 0 0)"
});

gsap.set(".key",{
  y:4,
  opacity:0
});

tl
.to(".base",{
  y:0,
  opacity:1,
  duration:1
})

.to(".display",{
  y:0,
  rotateX:0,
  opacity:1,
  duration:1.35,
  ease:"power4.out"
},"-=.55")

.to(".key",{
  y:0,
  opacity:1,
  duration:.32,
  stagger:{
    each:.008,
    from:"center"
  }
},"-=.9")

.to(".visual",{
  clipPath:"inset(0% 0 0 0)",
  duration:1.15,
  ease:"power4.inOut"
},"-=.75")

.to(".copy > *",{
  y:0,
  opacity:1,
  duration:.65,
  stagger:.08
},"-=.75");


/* Screen reflection */

gsap.to(".reflection",{
  xPercent:850,
  duration:5,
  repeat:-1,
  repeatDelay:4,
  ease:"none"
});


/* Trackpad reflection */

gsap.to(".trackpad-light",{
  xPercent:400,
  duration:5,
  repeat:-1,
  repeatDelay:5,
  ease:"none"
});


/* Sun breathing */

gsap.to(".sun",{
  scale:1.035,
  y:-3,
  duration:4,
  repeat:-1,
  yoyo:true,
  ease:"sine.inOut"
});


/* Subtle 3D mouse interaction */

const scene=document.querySelector(".scene");
const laptop=document.querySelector(".laptop");

scene.addEventListener("mousemove",e=>{

  if(innerWidth<900)return;

  const r=scene.getBoundingClientRect();

  const x=(e.clientX-r.left)/r.width-.5;
  const y=(e.clientY-r.top)/r.height-.5;

  gsap.to(laptop,{
    rotateY:x*3.2,
    rotateX:-y*1.7,
    duration:.8,
    ease:"power2.out"
  });

});

scene.addEventListener("mouseleave",()=>{

  gsap.to(laptop,{
    rotateX:0,
    rotateY:0,
    duration:1,
    ease:"power3.out"
  });

});