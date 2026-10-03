gsap.registerPlugin(ScrollTrigger);

const track=document.querySelector(".process-track"),
cards=[...document.querySelectorAll(".process-card")],
stepNum=document.querySelector(".step-copy strong"),
stepTitle=document.querySelector(".step-copy span"),
stepText=document.querySelector(".step-copy p"),
dot=document.querySelector(".side-line i");

const steps=[
 {n:"01",t:"DISCOVER",p:"Understand what matters."},
 {n:"02",t:"DEFINE",p:"Turn insights into direction."},
 {n:"03",t:"CREATE",p:"Shape the experience."},
 {n:"04",t:"LAUNCH",p:"Release, learn and evolve."}
];

let active=0;

function setStep(i){
 if(i===active&&cards[i].classList.contains("active"))return;
 active=i;

 cards.forEach((card,n)=>{
   card.classList.toggle("active",n===i);
   gsap.to(card,{width:n===i?"48%":"12%",duration:.75,ease:"power3.inOut"});
   gsap.to(card.querySelector("img"),{scale:n===i?1:1.08,duration:1,ease:"power3.out"});
   gsap.to(card.querySelector(".card-info"),{autoAlpha:n===i?1:0,y:n===i?0:20,duration:.45,ease:"power2.out"});
 });

 gsap.to([stepNum,stepTitle,stepText],{opacity:0,y:10,duration:.2,onComplete:()=>{
   stepNum.textContent=steps[i].n;stepTitle.textContent=steps[i].t;stepText.textContent=steps[i].p;
   gsap.to([stepNum,stepTitle,stepText],{opacity:1,y:0,duration:.4,stagger:.04});
 }});

 gsap.to(dot,{top:`${i*(100/3)}%`,duration:.7,ease:"power3.inOut"});
}

if(innerWidth>760){
 ScrollTrigger.create({
   trigger:track,start:"top top",end:"bottom bottom",scrub:.35,
   onUpdate:self=>setStep(Math.min(3,Math.floor(self.progress*4)))
 });

 cards.forEach((card,i)=>card.addEventListener("click",()=>{
   const max=track.offsetHeight-innerHeight;
   gsap.to(window,{scrollTo:track.offsetTop+(max*(i/4))+5,duration:1,ease:"power3.inOut"});
 }));
}

setStep(0);