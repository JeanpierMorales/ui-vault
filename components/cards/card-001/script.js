/* =============================================
   PRODUCT CARDS
============================================= */

const cards =
  document.querySelectorAll(
    ".product-card"
  );


cards.forEach(card => {

  /* =========================================
     CLICK / TOUCH MODE
  ========================================= */

  card.addEventListener(
    "click",
    event => {

      /*
        Si pulsamos un control interno,
        no abrimos/cerramos la card.
      */

      if (
        event.target.closest(
          "button"
        )
      ) {
        return;
      }


      /*
        Cerramos las demás.
      */

      cards.forEach(
        otherCard => {

          if (
            otherCard !== card
          ) {

            otherCard.classList.remove(
              "is-active"
            );

          }

        }
      );


      /*
        Activamos la actual.
      */

      card.classList.toggle(
        "is-active"
      );

    }
  );


  /* =========================================
     SIZE SELECTION
  ========================================= */

  const sizes =
    card.querySelectorAll(
      ".size"
    );


  sizes.forEach(size => {

    size.addEventListener(
      "click",
      event => {

        event.stopPropagation();


        sizes.forEach(
          item => {

            item.classList.remove(
              "active"
            );

          }
        );


        size.classList.add(
          "active"
        );

      }
    );

  });


  /* =========================================
     COLOR SELECTION
  ========================================= */

  const colors =
    card.querySelectorAll(
      ".color"
    );


  colors.forEach(color => {

    color.addEventListener(
      "click",
      event => {

        event.stopPropagation();


        colors.forEach(
          item => {

            item.classList.remove(
              "active"
            );

          }
        );


        color.classList.add(
          "active"
        );

      }
    );

  });


  /* =========================================
     ADD TO CART VISUAL FEEDBACK
  ========================================= */

  const cartButton =
    card.querySelector(
      ".cart-button"
    );


  cartButton.addEventListener(
    "click",
    event => {

      event.stopPropagation();


      const text =
        cartButton.querySelector(
          ".cart-text"
        );


      const originalText =
        text.textContent;


      text.textContent =
        "ADDED ✓";


      cartButton.classList.add(
        "added"
      );


      setTimeout(
        () => {

          text.textContent =
            originalText;

          cartButton.classList.remove(
            "added"
          );

        },
        1300
      );

    }
  );

});