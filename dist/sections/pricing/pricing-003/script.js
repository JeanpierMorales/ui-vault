const pricingCards =
  document.querySelectorAll(
    ".pricing-card"
  );


const priceElements =
  document.querySelectorAll(
    ".price-value"
  );


const billingToggle =
  document.querySelector(
    "#billingToggle"
  );


/* ============================================
   CURSOR LIGHT
============================================ */

pricingCards.forEach(
  (card) => {

    card.addEventListener(
      "pointermove",
      (event) => {

        if (
          window.matchMedia(
            "(pointer: coarse)"
          ).matches
        ) {
          return;
        }


        const rect =
          card.getBoundingClientRect();


        const x =
          event.clientX -
          rect.left;


        const y =
          event.clientY -
          rect.top;


        card.style.setProperty(
          "--mouse-x",
          `${x}px`
        );


        card.style.setProperty(
          "--mouse-y",
          `${y}px`
        );

      }
    );

  }
);


/* ============================================
   BILLING
============================================ */

billingToggle.addEventListener(
  "change",
  () => {

    const yearly =
      billingToggle.checked;


    updatePrices(
      yearly
    );

  }
);


/* ============================================
   UPDATE PRICES
============================================ */

function updatePrices(
  yearly
) {

  priceElements.forEach(
    (
      price,
      index
    ) => {

      /*
       * Very subtle stagger:
       * 0ms, 35ms, 70ms
       */

      setTimeout(
        () => {

          price.classList.add(
            "is-changing"
          );


          setTimeout(
            () => {

              price.textContent =
                yearly
                  ? price.dataset.yearly
                  : price.dataset.monthly;


              requestAnimationFrame(
                () => {

                  price.classList.remove(
                    "is-changing"
                  );

                }
              );

            },

            160
          );

        },

        index * 35
      );

    }
  );

}