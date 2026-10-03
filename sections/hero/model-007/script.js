const slides=[...document.querySelectorAll(".copy-slide")];
const cards=[...document.querySelectorAll(".destination-card")];
const backgrounds=[...document.querySelectorAll(".background")];
const points=[...document.querySelectorAll(".progress-point")];
const track=document.querySelector(".cards-track");
const nextBtn=document.querySelector(".next");
const prevBtn=document.querySelector(".prev");
const counter=document.querySelector(".progress-index");

let current=0;
let animating=false;
let autoPlay;
const AUTO_DELAY=5200;

function getGap(){
  return parseFloat(getComputedStyle(track).gap)||24;
}

function getTrackX(index){
  let x=0;

  for(let i=0;i<index;i++){
    x+=cards[i].offsetWidth+getGap();
  }

  return -x;
}

function updateClasses(index){
  cards.forEach((card,i)=>card.classList.toggle("active",i===index));
  points.forEach((point,i)=>point.classList.toggle("active",i===index));
  counter.textContent=String(index+1).padStart(2,"0");
}

function goTo(index,direction=1){

  if(animating || index===current)return;

  animating=true;

  const oldIndex=current;
  const oldText=slides[oldIndex];
  const newText=slides[index];
  const oldBg=backgrounds[oldIndex];
  const newBg=backgrounds[index];
  const oldCard=cards[oldIndex];

  newText.style.visibility="visible";
  newBg.style.visibility="visible";

  const textExitY=direction>0?-70:70;
  const textEnterY=direction>0?70:-70;

  const tl=gsap.timeline({
    defaults:{ease:"power3.inOut"},
    onComplete:()=>{
      oldText.classList.remove("active");
      newText.classList.add("active");

      oldBg.classList.remove("active");
      newBg.classList.add("active");

      oldText.style.visibility="hidden";
      animating=false;
      restartAutoplay();
    }
  });

  tl
  .to(oldText,{
    y:textExitY,
    opacity:0,
    duration:.55
  },0)

  .fromTo(newText,{
    y:textEnterY,
    opacity:0
  },{
    y:0,
    opacity:1,
    duration:.7
  },.18)

  .to(oldBg,{
    opacity:0,
    scale:1.1,
    duration:1.15
  },0)

  .fromTo(newBg,{
    opacity:0,
    scale:1.09
  },{
    opacity:1,
    scale:1.03,
    duration:1.15
  },0)

  .to(oldCard,{
    x:direction>0?-90:90,
    opacity:.35,
    scale:.92,
    duration:.48
  },0)

  .add(()=>{
    updateClasses(index);
  },.20)

  .to(track,{
    x:getTrackX(index),
    duration:.9,
    ease:"power4.inOut"
  },.15)

  .fromTo(cards[index],{
    x:direction>0?80:-80,
    opacity:.45,
    scale:.92
  },{
    x:0,
    opacity:1,
    scale:1,
    duration:.8
  },.27)

  .set(oldCard,{
    x:0,
    opacity:1,
    scale:1
  });

  current=index;
}

function next(){
  goTo((current+1)%slides.length,1);
}

function prev(){
  goTo((current-1+slides.length)%slides.length,-1);
}

function startAutoplay(){
  clearInterval(autoPlay);
  autoPlay=setInterval(next,AUTO_DELAY);
}

function restartAutoplay(){
  startAutoplay();
}

nextBtn.addEventListener("click",()=>{
  clearInterval(autoPlay);
  next();
});

prevBtn.addEventListener("click",()=>{
  clearInterval(autoPlay);
  prev();
});

points.forEach((point,index)=>{
  point.addEventListener("click",()=>{
    if(index===current)return;
    clearInterval(autoPlay);
    goTo(index,index>current?1:-1);
  });
});

cards.forEach((card,index)=>{
  card.addEventListener("click",e=>{
    if(e.target.closest(".bookmark"))return;
    if(index===current)return;

    clearInterval(autoPlay);
    goTo(index,index>current?1:-1);
  });
});

let pointerStart=0;
let pointerEnd=0;

track.addEventListener("pointerdown",e=>{
  pointerStart=e.clientX;
  pointerEnd=e.clientX;
  track.setPointerCapture(e.pointerId);
  clearInterval(autoPlay);
});

track.addEventListener("pointermove",e=>{
  pointerEnd=e.clientX;
});

track.addEventListener("pointerup",()=>{
  const delta=pointerEnd-pointerStart;

  if(Math.abs(delta)>50){
    delta<0?next():prev();
  }else{
    restartAutoplay();
  }
});

window.addEventListener("resize",()=>{
  gsap.set(track,{x:getTrackX(current)});
});

gsap.set(track,{x:getTrackX(0)});
gsap.set(slides.slice(1),{y:60,opacity:0});
gsap.set(backgrounds.slice(1),{opacity:0,scale:1.09});

updateClasses(0);
startAutoplay();