document.addEventListener("DOMContentLoaded",()=>{
  const body=document.body;
  const hero=document.querySelector(".hero");
  const visual=document.querySelector(".hero-visual");
  const image=document.querySelector(".hero-image");
  const badge=document.querySelector(".saving-badge");
  const form=document.querySelector(".hero-form");
  const email=document.querySelector("#email");

  /* Entrada inicial */
  requestAnimationFrame(()=>setTimeout(()=>body.classList.add("loaded"),80));

  /* Parallax muy ligero */
  let ticking=false;

  const updateParallax=()=>{
    if(!hero||!visual||window.matchMedia("(prefers-reduced-motion: reduce)").matches){
      ticking=false;
      return;
    }

    const rect=hero.getBoundingClientRect();
    const viewport=window.innerHeight;

    if(rect.bottom>0&&rect.top<viewport){
      const progress=Math.max(0,Math.min(1,-rect.top/rect.height));

      if(image){
        const y=progress*26;
        image.style.translate=`0 ${y}px`;
      }

      if(badge){
        const y=progress*-18;
        badge.style.translate=`0 ${y}px`;
      }
    }

    ticking=false;
  };

  window.addEventListener("scroll",()=>{
    if(!ticking){
      requestAnimationFrame(updateParallax);
      ticking=true;
    }
  },{passive:true});


  /* Botón/formulario */
  form?.addEventListener("submit",e=>{
    e.preventDefault();

    if(!email.value.trim()){
      email.focus();
      return;
    }

    if(!email.validity.valid){
      email.reportValidity();
      return;
    }

    console.log("Submitted:",email.value);

    /*
      Aquí conectas tu formulario real:
      fetch("/api/signup",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email:email.value})
      });
    */
  });
});