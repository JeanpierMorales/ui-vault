// script.js
const projects=[
{name:"Agrolmos",cat:"Software · IoT · Industry",desc:"A telemetry system built to optimize agricultural operations.",img:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=85",url:"work/agrolmos.html"},
{name:"Satori",cat:"Brand · Web · Experience",desc:"A refined digital presence for a contemporary dining experience.",img:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=85",url:"work/satori.html"},
{name:"Lumé",cat:"E-commerce · Brand · Growth",desc:"A premium beauty experience built around clarity and conversion.",img:"https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1400&q=85",url:"work/lume.html"},
{name:"Nexus",cat:"Platform · UI · Technology",desc:"A scalable digital platform focused on speed, systems and usability.",img:"https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=85",url:"work/nexus.html"},
{name:"Atelier",cat:"Web · Architecture · Identity",desc:"An editorial digital experience for a modern architecture studio.",img:"https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1400&q=85",url:"work/atelier.html"},
{name:"Noir",cat:"Commerce · Fashion · Creative",desc:"A bold commerce experience designed around visual storytelling.",img:"https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85",url:"work/noir.html"}
];

const cards=[...document.querySelectorAll(".dynamic")];
let offset=0;

function render(card,index,animate=false){
  const p=projects[(offset+index)%projects.length];
  const bg=card.querySelector(".bg"),title=card.querySelector("h3"),cat=card.querySelector("small"),desc=card.querySelector("p"),link=card.querySelector(".view");
  const apply=()=>{bg.style.backgroundImage=`url("${p.img}")`;title.textContent=p.name;cat.textContent=p.cat;desc.textContent=p.desc;link.href=p.url};
  if(!animate)return apply();
  card.classList.add("is-changing");
  setTimeout(()=>{apply();card.classList.remove("is-changing")},420);
}

cards.forEach((c,i)=>render(c,i));

setInterval(()=>{
  offset=(offset+3)%projects.length;
  cards.forEach((card,i)=>setTimeout(()=>render(card,i,true),i*140));
},5000);