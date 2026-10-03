gsap.registerPlugin(ScrollTrigger);
const story=document.querySelector(".story"),panels=[...document.querySelectorAll(".panel")],tabs=[...document.querySelectorAll(".nav button")],bar=document.querySelector(".track i"),count=document.querySelector(".count b");let current=-1,lock=false;

function show(i){
 if(i===current)return;
 const old=panels[current],next=panels[i];current=i;
 tabs.forEach((e,n)=>e.classList.toggle("active",n===i));count.textContent=`0${i+1}`;
 gsap.to(bar,{yPercent:i*100,duration:.65,ease:"power3.inOut"});
 if(old)gsap.to(old,{autoAlpha:0,y:-22,duration:.45,ease:"power2.inOut"});
 gsap.set(next,{autoAlpha:1,y:28});gsap.to(next,{y:0,duration:.75,ease:"power3.out"});
 gsap.fromTo(next.querySelector(".copy"),{opacity:0,y:30},{opacity:1,y:0,duration:.7,delay:.1,ease:"power3.out"});
 const visual=next.querySelector(".visual");gsap.fromTo(visual,{clipPath:"inset(0 0 100% 0)"},{clipPath:"inset(0 0 0% 0)",duration:.9,ease:"power3.inOut"});
 gsap.from(next.querySelectorAll(".geo,.node,.stat,.floating-page,.label"),{opacity:0,y:25,stagger:.07,duration:.65,delay:.25,ease:"power3.out"});
 if(i===0)gsap.fromTo(".main-photo",{scale:1.1},{scale:1,duration:1.4,ease:"power2.out"});
 if(i===3)gsap.to(".graph path",{strokeDashoffset:0,duration:1.5,delay:.35,ease:"power2.inOut"});
}

show(0);

if(innerWidth>950){
 ScrollTrigger.create({trigger:story,start:"top top",end:"bottom bottom",scrub:.5,onUpdate:s=>{
   if(lock)return;
   show(Math.min(3,Math.floor(s.progress*4)));
 }});

 tabs.forEach((tab,i)=>tab.onclick=()=>{
   lock=true;show(i);
   const max=story.offsetHeight-innerHeight;
   gsap.to(window,{scrollTo:story.offsetTop+(max*(i/4))+10,duration:1.05,ease:"power3.inOut",onComplete:()=>lock=false});
 });
}

gsap.to(".main-photo",{yPercent:6,ease:"none",scrollTrigger:{trigger:".web",start:"top bottom",end:"bottom top",scrub:true}});
gsap.to(".growth-img",{scale:1.08,ease:"none",scrollTrigger:{trigger:".growth",start:"top bottom",end:"bottom top",scrub:true}});