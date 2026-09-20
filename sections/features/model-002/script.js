const intro =
  document.querySelector("#intro");


window.addEventListener(
  "load",

  () => {

    /*
      Intro stays visible briefly.
    */

    setTimeout(() => {

      /*
        Start revealing the website.
      */

      document.body.classList.add(
        "loaded"
      );


      /*
        Fade intro.
      */

      intro.classList.add(
        "fade-out"
      );


      /*
        Remove it completely
        after transition.
      */

      setTimeout(() => {

        intro.remove();

      }, 1400);


    }, 850);

  }
);