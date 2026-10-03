const items=document.querySelectorAll(".faq-item");

items.forEach(item=>{
  const btn=item.querySelector(".faq-question");
  btn.addEventListener("click",()=>{
    const isOpen=item.classList.contains("active");
    items.forEach(i=>i.classList.remove("active"));
    if(!isOpen)item.classList.add("active");
  });
});