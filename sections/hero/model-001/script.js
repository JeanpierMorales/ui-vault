const scenes=[...document.querySelectorAll(".scene")];
const progressBar=document.querySelector("#progressBar");
const counter=document.querySelector("#sceneCurrent");
const autoplayStatus=document.querySelector("#autoplayStatus");

let progress=0,target=0,lastInput=Date.now(),auto=false,raf=null;
const INACTIVITY=2000,AUTO_SPEED=.000065,INPUT_SPEED=.00075;
const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));

gsap.set(".scene",{autoAlpha:0});
gsap.set(".scene-intro",{autoAlpha:1});

const tl=gsap.timeline({paused:true,defaults:{ease:"power3.inOut"}});

/* INTRO → WEB */
tl.addLabel("intro",0)
.to(".eyebrow",{y:-25,autoAlpha:0,duration:.08},.04)
.to(".intro-copy h1",{scale:.74,y:-90,autoAlpha:.08,filter:"blur(12px)",duration:.16},.04)
.to(".intro-copy p,.hero-actions",{y:35,autoAlpha:0,duration:.1},.06)
.to(".floating-ui",{scale:1.2,autoAlpha:0,duration:.09},.08)
.set(".scene-web",{autoAlpha:1},.10)
.fromTo(".mockup-browser",{scale:.7,y:120,rotateX:7,autoAlpha:0},{scale:1,y:0,rotateX:0,autoAlpha:1,duration:.17},.10)
.fromTo(".scene-web .scene-copy",{x:-40,autoAlpha:0},{x:0,autoAlpha:1,duration:.12},.16)
.fromTo(".site-art",{scale:1.2},{scale:1,duration:.18},.12)

/* WEB → SOFTWARE */
.addLabel("web",.27)
.to(".scene-web .scene-copy",{x:-40,autoAlpha:0,duration:.08},.31)
.to(".mockup-browser",{scale:.92,y:-35,rotateY:-4,duration:.09},.31)
.to(".mockup-browser",{scale:.72,x:-240,autoAlpha:.15,filter:"blur(9px)",duration:.12},.38)
.set(".scene-software",{autoAlpha:1},.39)
.fromTo(".dashboard",{scale:.72,x:250,y:80,rotateY:6,autoAlpha:0},{scale:1,x:0,y:0,rotateY:0,autoAlpha:1,duration:.16},.39)
.fromTo(".metrics article",{y:40,autoAlpha:0},{y:0,autoAlpha:1,stagger:.015,duration:.08},.45)
.fromTo(".chart-line",{strokeDasharray:1000,strokeDashoffset:1000},{strokeDashoffset:0,duration:.14,ease:"power2.out"},.46)
.fromTo(".software-copy",{x:-40,autoAlpha:0},{x:0,autoAlpha:1,duration:.1},.47)
.to(".scene-web",{autoAlpha:0,duration:.06},.49)

/* SOFTWARE → AI */
.addLabel("software",.53)
.to(".software-copy",{x:-40,autoAlpha:0,duration:.07},.56)
.to(".dashboard",{scale:.82,y:-50,rotateX:5,duration:.09},.57)
.to(".dashboard",{scale:.52,autoAlpha:0,filter:"blur(14px)",duration:.11},.63)
.set(".scene-ai",{autoAlpha:1},.64)
.fromTo(".ai-core",{scale:.2,rotate:-30,autoAlpha:0},{scale:1,rotate:0,autoAlpha:1,duration:.16,ease:"expo.out"},.64)
.fromTo(".connections path",{strokeDasharray:500,strokeDashoffset:500},{strokeDashoffset:0,stagger:.01,duration:.12},.67)
.fromTo(".ai-node",{scale:.6,y:30,autoAlpha:0},{scale:1,y:0,autoAlpha:1,stagger:.018,duration:.1},.69)
.fromTo(".ai-copy",{x:-40,autoAlpha:0},{x:0,autoAlpha:1,duration:.1},.72)
.to(".scene-software",{autoAlpha:0,duration:.04},.70)

/* AI → OUTRO */
.addLabel("ai",.77)
.to(".ai-copy",{autoAlpha:0,y:30,duration:.06},.79)
.to(".ai-node",{scale:.8,x:0,y:0,autoAlpha:0,stagger:.008,duration:.08},.81)
.to(".connections",{scale:.3,autoAlpha:0,duration:.1},.82)
.to(".ai-core",{scale:.68,rotate:40,duration:.08},.82)
.to(".ai-core",{scale:.18,autoAlpha:0,duration:.08},.87)
.set(".scene-outro",{autoAlpha:1},.86)
.fromTo(".outro-symbol",{scale:.2,rotate:-80,autoAlpha:0},{scale:1,rotate:0,autoAlpha:1,duration:.10,ease:"expo.out"},.87)
.fromTo(".outro-copy",{y:50,autoAlpha:0},{y:0,autoAlpha:1,duration:.08},.90)
.to(".scene-ai",{autoAlpha:0,duration:.04},.90)

/* OUTRO → INTRO: puente visual para loop */
.addLabel("outro",.94)
.to(".outro-copy",{scale:.9,y:-20,autoAlpha:0,duration:.025},.955)
.to(".outro-symbol",{scale:4,rotate:60,autoAlpha:0,duration:.035,ease:"power2.in"},.955)
.set(".scene-intro",{autoAlpha:1},.975)
.set(".intro-copy h1",{scale:.78,y:60,autoAlpha:0,filter:"blur(14px)"},.975)
.set(".eyebrow,.intro-copy p,.hero-actions",{autoAlpha:0},.975)
.to(".intro-copy h1",{scale:1,y:0,autoAlpha:1,filter:"blur(0px)",duration:.025,ease:"expo.out"},.975)
.to(".eyebrow,.intro-copy p,.hero-actions",{autoAlpha:1,y:0,duration:.02},.985)
.to(".floating-ui",{scale:1,autoAlpha:1,duration:.02},.985)
.to(".scene-outro",{autoAlpha:0,duration:.01},.995);

tl.progress(0);

function updateUI(p){
  progressBar.style.width=`${p*100}%`;
  const n=p<.27?1:p<.53?2:p<.77?3:4;
  counter.textContent=String(n).padStart(2,"0");
}

function registerInput(delta){
  auto=false;
  autoplayStatus.textContent="INTERACTIVE";
  lastInput=Date.now();
  target=clamp(target+delta,0,.999);
}

window.addEventListener("wheel",e=>{
  e.preventDefault();
  registerInput(e.deltaY*INPUT_SPEED);
},{passive:false});

let touchY=null;
window.addEventListener("touchstart",e=>{touchY=e.touches[0].clientY;lastInput=Date.now();auto=false},{passive:true});
window.addEventListener("touchmove",e=>{
  if(touchY===null)return;
  const y=e.touches[0].clientY;
  registerInput((touchY-y)*.0014);
  touchY=y;
},{passive:true});
window.addEventListener("touchend",()=>touchY=null);

window.addEventListener("keydown",e=>{
  if(["ArrowDown","ArrowRight","PageDown"," "].includes(e.key))registerInput(.055);
  if(["ArrowUp","ArrowLeft","PageUp"].includes(e.key))registerInput(-.055);
});

let previous=performance.now();

function loop(now){
  const dt=now-previous;previous=now;

  if(Date.now()-lastInput>INACTIVITY){
    auto=true;
    autoplayStatus.textContent="AUTOPLAY";
  }

  if(auto){
    target+=AUTO_SPEED*dt;

    /* El usuario nunca ve un hard reset.
       El último tramo ya recompone visualmente el primer frame. */
    if(target>=.999){
      target=0;
      progress=0;
      tl.progress(0);
    }
  }

  /* Suavizado físico: el timeline nunca salta directamente al target */
  progress+=(target-progress)*Math.min(.095*dt/16.67,1);

  tl.progress(clamp(progress,0,.999));
  updateUI(progress);

  raf=requestAnimationFrame(loop);
}

raf=requestAnimationFrame(loop);

/* Movimiento ambiental sutil: no controla la narrativa */
gsap.to(".orb-a",{x:"8vw",y:"5vh",duration:9,yoyo:true,repeat:-1,ease:"sine.inOut"});
gsap.to(".orb-b",{x:"5vw",y:"-4vh",duration:11,yoyo:true,repeat:-1,ease:"sine.inOut"});
gsap.to(".ring-1",{rotation:360,duration:18,repeat:-1,ease:"none"});
gsap.to(".ring-2",{rotation:-360,duration:24,repeat:-1,ease:"none"});

/* Parallax mínimo del puntero */
window.addEventListener("pointermove",e=>{
  const x=(e.clientX/window.innerWidth-.5);
  const y=(e.clientY/window.innerHeight-.5);

  gsap.to(".intro-visual",{x:x*18,y:y*12,duration:1,ease:"power3.out"});
  gsap.to(".mockup-browser",{rotateY:x*1.6,rotateX:-y*1.2,duration:1.2,ease:"power3.out"});
});

/* Accesibilidad */
if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){
  cancelAnimationFrame(raf);
  tl.progress(0);
  gsap.set(".scene",{autoAlpha:0});
  gsap.set(".scene-intro",{autoAlpha:1});
  autoplayStatus.textContent="STATIC";
}