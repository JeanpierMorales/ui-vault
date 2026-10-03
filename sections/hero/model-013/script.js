document.querySelectorAll(".option-group .choices").forEach(group=>{
group.addEventListener("click",e=>{
const btn=e.target.closest(".choice");if(!btn)return;
group.querySelectorAll(".choice").forEach(b=>b.classList.remove("active"));
btn.classList.add("active");
});
});

const allergyPicker=document.querySelector(".allergy-picker"),count=document.querySelector(".count");

document.querySelectorAll(".tag button").forEach(btn=>{
btn.addEventListener("click",()=>{
btn.closest(".tag").remove();
const total=document.querySelectorAll(".tag").length;
count.textContent=total;
});
});

document.querySelector(".hero").addEventListener("mousemove",e=>{
if(innerWidth<900)return;
const img=document.querySelector(".hero-bg"),r=e.currentTarget.getBoundingClientRect();
const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
img.style.transform=`scale(1.025) translate(${x*-7}px,${y*-5}px)`;
});

document.querySelector(".hero").addEventListener("mouseleave",()=>{
document.querySelector(".hero-bg").style.transform="scale(1.01)";
});