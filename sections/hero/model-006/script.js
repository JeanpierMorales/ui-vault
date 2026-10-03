
const visual=document.querySelector(".visual"),img=document.querySelector(".mountain"),prev=document.querySelector(".arrows button:first-child"),next=document.querySelector(".arrows button:last-child"),num=document.querySelector(".count b");

visual.addEventListener("mousemove",e=>{if(innerWidth<800)return;const r=visual.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;img.style.transform=`scale(1.035) translate(${x*-12}px,${y*-8}px)`});
visual.addEventListener("mouseleave",()=>img.style.transform="scale(1)");

let i=1;const update=d=>{i+=d;if(i>4)i=1;if(i<1)i=4;num.textContent=String(i).padStart(2,"0");img.animate([{opacity:.55,transform:"scale(1.05)"},{opacity:1,transform:"scale(1)"}],{duration:500,easing:"ease-out"})};prev.onclick=()=>update(-1);next.onclick=()=>update(1);