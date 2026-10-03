const menuBtn=document.querySelector(".menu-btn");
const menu=document.querySelector(".menu-overlay");
const closeBtn=document.querySelector(".menu-close");

menuBtn.addEventListener("click",()=>{menu.classList.add("active");document.body.style.overflow="hidden"});
closeBtn.addEventListener("click",()=>{menu.classList.remove("active");document.body.style.overflow=""});
menu.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{menu.classList.remove("active");document.body.style.overflow=""}));

const observer=new IntersectionObserver(entries=>{
  entries.forEach((entry,i)=>{
    if(entry.isIntersecting){
      setTimeout(()=>entry.target.classList.add("visible"),i*65);
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12});

document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

const hero=document.querySelector(".hero-image");

window.addEventListener("scroll",()=>{
  if(window.innerWidth>768){
    const y=window.scrollY;
    hero.style.transform=`scale(1.04) translateY(${Math.min(y*.055,18)}px)`;
  }
},{passive:true});