gsap.registerPlugin(ScrollTrigger);

const track=document.querySelector(".why-track"),
texts=[...document.querySelectorAll(".why-text")],
layers=[...document.querySelectorAll(".media-layer")],
bar=document.querySelector(".progress i"),
counter=document.querySelector(".counter b"),
imageCounter=document.querySelector(".media-index b"),
label=document.querySelector(".info-label"),
title=document.querySelector(".info-title"),
small=document.querySelector(".info-small");

const info=[
 {l:"OUR PRINCIPLE",t:"Less noise.<br>More clarity.",s:"Built with purpose."},
 {l:"OUR APPROACH",t:"Intent in<br>every detail.",s:"Designed around people."},
 {l:"OUR SYSTEM",t:"Right tools.<br>Right reason.",s:"Technology that fits."},
 {l:"OUR FUTURE",t:"Made to<br>evolve.",s:"Built beyond launch."}
];

let current=0,z=2;

function changeScene(next){
 if(next===current)return;

 const prev=current;
 current=next;

 /* TEXT */
 gsap.killTweensOf([texts[prev],texts[next]]);
 gsap.to(texts[prev],{
   autoAlpha:0,y:-28,duration:.35,ease:"power2.in"
 });

 texts[next].classList.add("active");

 gsap.fromTo(texts[next],
   {autoAlpha:0,y:38},
   {autoAlpha:1,y:0,duration:.72,delay:.18,ease:"power3.out"}
 );

 /* IMAGE WIPE */
 z++;
 gsap.set(layers[next],{
   zIndex:z,
   clipPath:"inset(0 0 0 100%)"
 });

 gsap.set(layers[next].querySelector("img"),{
   scale:1.08,
   xPercent:2
 });

 gsap.to(layers[next],{
   clipPath:"inset(0 0 0 0%)",
   duration:1,
   ease:"power3.inOut"
 });

 gsap.to(layers[next].querySelector("img"),{
   scale:1,
   xPercent:0,
   duration:1.35,
   ease:"power3.out"
 });

 /* FLOATING CARD */
 const cardEls=[label,title,small];

 gsap.to(cardEls,{
   y:-8,
   opacity:0,
   duration:.2,
   stagger:.025,
   onComplete:()=>{
     label.textContent=info[next].l;
     title.innerHTML=info[next].t;
     small.textContent=info[next].s;

     gsap.fromTo(cardEls,
       {y:10,opacity:0},
       {y:0,opacity:1,duration:.4,stagger:.045,ease:"power2.out"}
     );
   }
 });

 /* UI */
 gsap.to(bar,{
   scaleX:(next+1)/4,
   duration:.65,
   ease:"power3.inOut"
 });

 counter.textContent=`0${next+1}`;
 imageCounter.textContent=`0${next+1}`;
}

if(innerWidth>760){

 ScrollTrigger.create({
   trigger:track,
   start:"top top",
   end:"bottom bottom",
   onUpdate:self=>{
     const next=Math.min(3,Math.floor(self.progress*4));
     changeScene(next);
   }
 });

 /* MOVIMIENTO INTERNO MUY SUAVE */
 layers.forEach(layer=>{
   gsap.fromTo(layer.querySelector("img"),
     {yPercent:-2},
     {
       yPercent:2,
       ease:"none",
       scrollTrigger:{
         trigger:track,
         start:"top top",
         end:"bottom bottom",
         scrub:true
       }
     }
   );
 });

}

/* PRELOAD */
layers.forEach(layer=>{
 const img=layer.querySelector("img");
 if(img.complete)img.classList.add("loaded");
 else img.addEventListener("load",()=>img.classList.add("loaded"));
});