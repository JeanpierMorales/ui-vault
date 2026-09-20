const playButtons =
  document.querySelectorAll(
    ".play-button"
  );


/* =========================================
   PLAY / PAUSE VISUAL STATE
========================================= */

playButtons.forEach(button => {

  button.addEventListener(
    "click",
    event => {

      event.stopPropagation();


      const card =
        button.closest(
          ".book-card"
        );


      const icon =
        button.querySelector("i");


      const isPlaying =
        button.classList.contains(
          "playing"
        );


      /*
        Stop all other books
      */

      playButtons.forEach(
        otherButton => {

          const otherCard =
            otherButton.closest(
              ".book-card"
            );

          const otherIcon =
            otherButton.querySelector(
              "i"
            );


          otherButton.classList.remove(
            "playing"
          );

          otherCard.classList.remove(
            "is-playing"
          );


          otherIcon.className =
            "fa-solid fa-play";

        }
      );


      /*
        If this one wasn't playing,
        activate it.
      */

      if (!isPlaying) {

        button.classList.add(
          "playing"
        );

        card.classList.add(
          "is-playing"
        );

        icon.className =
          "fa-solid fa-pause";

      }

    }
  );

});