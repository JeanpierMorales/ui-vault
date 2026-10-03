const hero=document.querySelector(".hero"),img=document.querySelector(".hero-bg");
hero.addEventListener("mousemove",e=>{if(innerWidth<900)return;const r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;img.style.transform=`scale(1.035) translate(${x*-10}px,${y*-8}px)`});
hero.addEventListener("mouseleave",()=>img.style.transform="scale(1.02)");

const sections=[...document.querySelectorAll("section[id]")],links=[...document.querySelectorAll(".nav nav a")];
addEventListener("scroll",()=>{let id=sections[0].id;sections.forEach(s=>{if(scrollY>=s.offsetTop-180)id=s.id});links.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+id))});