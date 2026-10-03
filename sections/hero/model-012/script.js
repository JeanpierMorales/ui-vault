document.addEventListener("DOMContentLoaded",()=>{

  const body=document.body;
  const hero=document.querySelector(".hero-shell");
  const phone=document.querySelector(".phone-image");
  const skeleton=document.querySelector(".phone-skeleton");
  const heading=document.querySelector(".hero-heading");
  const floating=document.querySelector(".float-card");
  const right=document.querySelector(".right-content");

  /* Entrada inicial */
  requestAnimationFrame(()=>{
    setTimeout(()=>body.classList.add("loaded"),80);
  });


  /* Skeleton */
  if(phone){

    const finishLoading=()=>{
      phone.classList.add("loaded");

      if(skeleton){
        skeleton.animate(
          [
            {opacity:1},
            {opacity:0}
          ],
          {
            duration:400,
            easing:"ease",
            fill:"forwards"
          }
        );

        setTimeout(()=>skeleton.remove(),420);
      }
    };

    if(phone.complete){
      finishLoading();
    }else{
      phone.addEventListener("load",finishLoading,{once:true});
    }

  }


  /* Parallax con mouse */
  if(hero && !window.matchMedia("(prefers-reduced-motion: reduce)").matches){

    hero.addEventListener("mousemove",e=>{

      const rect=hero.getBoundingClientRect();

      const x=(e.clientX-rect.left)/rect.width-.5;
      const y=(e.clientY-rect.top)/rect.height-.5;

      if(phone){
        phone.style.translate=`${x*9}px ${y*7}px`;
      }

      if(floating){
        floating.style.translate=`${x*-13}px ${y*-10}px`;
      }

      if(heading){
        heading.style.translate=`${x*3}px ${y*2}px`;
      }

      if(right){
        right.style.translate=`${x*-2}px ${y*3}px`;
      }

    });

    hero.addEventListener("mouseleave",()=>{

      [phone,floating,heading,right].forEach(el=>{
        if(el) el.style.translate="";
      });

    });

  }


  /* Scroll parallax muy suave */
  let ticking=false;

  window.addEventListener("scroll",()=>{

    if(ticking) return;

    requestAnimationFrame(()=>{

      const rect=hero.getBoundingClientRect();

      if(rect.bottom>0 && rect.top<window.innerHeight){

        const progress=Math.max(
          -1,
          Math.min(1,-rect.top/window.innerHeight)
        );

        document.documentElement.style.setProperty(
          "--scroll-progress",
          progress
        );

      }

      ticking=false;

    });

    ticking=true;

  },{passive:true});

});