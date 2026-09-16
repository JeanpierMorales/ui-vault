const billingToggle =
  document.querySelector(
    ".billing-toggle"
  );


const billingButtons =
  document.querySelectorAll(
    ".billing-toggle__button"
  );


const prices =
  document.querySelectorAll(
    ".price-value"
  );


const periods =
  document.querySelectorAll(
    ".price-period"
  );


let currentPeriod =
  "monthly";


/* =========================================
   CHANGE PRICE
========================================= */

function updatePrices(
  period
) {

  prices.forEach(
    (
      price,
      index
    ) => {

      /*
       * Small stagger.
       *
       * It prevents all values
       * from moving at exactly
       * the same instant.
       */

      setTimeout(
        () => {

          price.classList.add(
            "is-changing"
          );


          setTimeout(
            () => {

              const nextValue =
                period === "yearly"
                  ? price.dataset.yearly
                  : price.dataset.monthly;


              price.textContent =
                nextValue;


              /*
               * Request one frame
               * before returning.
               */

              requestAnimationFrame(
                () => {

                  price.classList.remove(
                    "is-changing"
                  );

                }
              );

            },

            170
          );

        },

        index * 35
      );

    }
  );


  /*
   * The yearly values shown in this
   * example are monthly equivalents
   * when billed annually.
   */

  periods.forEach(
    (periodLabel) => {

      periodLabel.textContent =
        period === "yearly"
          ? "/month"
          : "/month";

    }
  );

}


/* =========================================
   TOGGLE EVENTS
========================================= */

billingButtons.forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        const period =
          button.dataset.period;


        if (
          period === currentPeriod
        ) {
          return;
        }


        currentPeriod =
          period;


        /*
         * Update active button.
         */

        billingButtons.forEach(
          (item) => {

            const active =
              item === button;


            item.classList.toggle(
              "is-active",
              active
            );


            item.setAttribute(
              "aria-selected",
              active
                ? "true"
                : "false"
            );

          }
        );


        /*
         * Move blue selector.
         */

        billingToggle.classList.toggle(
          "is-yearly",
          period === "yearly"
        );


        /*
         * Update prices.
         */

        updatePrices(
          period
        );

      }
    );

  }
);


/* =========================================
   BUTTON MICRO INTERACTION
========================================= */

const buttons =
  document.querySelectorAll(
    ".pricing-button"
  );


buttons.forEach(
  (button) => {

    button.addEventListener(
      "pointerdown",
      () => {

        button.style.transform =
          "scale(0.985)";

      }
    );


    button.addEventListener(
      "pointerup",
      () => {

        button.style.transform =
          "";

      }
    );


    button.addEventListener(
      "pointerleave",
      () => {

        button.style.transform =
          "";

      }
    );

  }
);