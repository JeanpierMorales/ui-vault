const hero=document.querySelector(".hero"),img=document.querySelector(".hero-img"),play=document.querySelector(".play");

hero.addEventListener("mousemove",e=>{
if(innerWidth<900)return;
const r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
img.style.transform=`scale(1.035) translate(${x*-12}px,${y*-8}px)`;
});

hero.addEventListener("mouseleave",()=>img.style.transform="scale(1)");

play.addEventListener("click",()=>{
play.animate([{transform:"translateX(-50%) scale(1)"},{transform:"translateX(-50%) scale(.88)"},{transform:"translateX(-50%) scale(1)"}],{duration:320});
});