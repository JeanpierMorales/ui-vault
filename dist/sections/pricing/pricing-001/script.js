const plans = {

  free: {

    type: "Free Plan",

    price: "$0",

    period: "/month",

    description:
      "Explore the essentials and get started with the core experience.",

    meta:
      "No credit card required.",

    delivery:
      "Instant",

    cta:
      "Get started",

    features: [
      "1 active project",
      "Basic components library",
      "Community access",
      "Basic exports",
      "Personal use"
    ]

  },


  pro: {

    type: "Pro Plan",

    price: "$49",

    period: "/month",

    description:
      "For professionals and growing teams that need greater flexibility, advanced tools and consistent delivery.",

    meta:
      "Cancel or pause anytime.",

    delivery:
      "24 hours",

    cta:
      "Start Pro",

    features: [
      "Unlimited projects",
      "Full component library",
      "Advanced interactions",
      "Premium templates",
      "Priority support",
      "Commercial use",
      "Regular updates"
    ]

  },


  studio: {

    type: "Studio Plan",

    price: "$129",

    period: "/month",

    description:
      "Built for studios and teams managing multiple products, clients and production workflows.",

    meta:
      "Designed for collaborative teams.",

    delivery:
      "12 hours",

    cta:
      "Start Studio",

    features: [
      "Everything in Pro",
      "Unlimited team members",
      "Client workspaces",
      "Shared component systems",
      "Advanced collaboration",
      "Priority releases",
      "Dedicated support"
    ]

  }

};


/* ========================================
   ELEMENTS
======================================== */

const selector =
  document.querySelector(
    ".plan-selector"
  );


const buttons =
  document.querySelectorAll(
    ".plan-selector__button"
  );


const indicator =
  document.querySelector(
    ".plan-selector__indicator"
  );


const pricingCard =
  document.querySelector(
    ".pricing-card"
  );


const planType =
  document.querySelector(
    "[data-plan-type]"
  );


const planPrice =
  document.querySelector(
    "[data-plan-price]"
  );


const planPeriod =
  document.querySelector(
    "[data-plan-period]"
  );


const planDescription =
  document.querySelector(
    "[data-plan-description]"
  );


const planMeta =
  document.querySelector(
    "[data-plan-meta]"
  );


const planDelivery =
  document.querySelector(
    "[data-plan-delivery]"
  );


const planCTA =
  document.querySelector(
    "[data-plan-cta]"
  );


const featureList =
  document.querySelector(
    "[data-feature-list]"
  );


/* ========================================
   RENDER FEATURES
======================================== */

function renderFeatures(
  features
) {

  featureList.innerHTML = "";


  features.forEach(
    (feature) => {

      const li =
        document.createElement(
          "li"
        );


      li.textContent =
        feature;


      featureList.appendChild(
        li
      );

    }
  );

}


/* ========================================
   UPDATE PLAN
======================================== */

function updatePlan(
  planName
) {

  const plan =
    plans[planName];


  if (!plan) return;


  /*
   * Fase 1:
   * ocultamos ligeramente
   * el contenido actual.
   */

  pricingCard.classList.add(
    "plan-content-changing"
  );


  /*
   * Esperamos lo suficiente
   * para que la salida
   * se perciba suave.
   */

  setTimeout(
    () => {

      planType.textContent =
        plan.type;


      planPrice.textContent =
        plan.price;


      planPeriod.textContent =
        plan.period;


      planDescription.textContent =
        plan.description;


      planMeta.textContent =
        plan.meta;


      planDelivery.textContent =
        plan.delivery;


      planCTA.textContent =
        plan.cta;


      renderFeatures(
        plan.features
      );


      /*
       * Fase 2:
       * mostramos nuevo contenido.
       */

      requestAnimationFrame(
        () => {

          pricingCard.classList.remove(
            "plan-content-changing"
          );

        }
      );

    },

    170
  );

}


/* ========================================
   MOVE INDICATOR
======================================== */

function moveIndicator(
  index
) {

  indicator.style.transform =
    `translateX(${index * 100}%)`;

}


/* ========================================
   PLAN BUTTON EVENTS
======================================== */

buttons.forEach(
  (
    button,
    index
  ) => {

    button.addEventListener(
      "click",
      () => {

        /*
         * Evitar ejecutar
         * nuevamente si ya
         * está seleccionado.
         */

        if (
          button.classList.contains(
            "is-active"
          )
        ) {
          return;
        }


        /*
         * Actualizar botones.
         */

        buttons.forEach(
          (item) => {

            item.classList.remove(
              "is-active"
            );


            item.setAttribute(
              "aria-selected",
              "false"
            );

          }
        );


        button.classList.add(
          "is-active"
        );


        button.setAttribute(
          "aria-selected",
          "true"
        );


        /*
         * Mover fondo negro.
         */

        moveIndicator(
          index
        );


        /*
         * Cambiar contenido.
         */

        updatePlan(
          button.dataset.plan
        );

      }
    );

  }
);


/* ========================================
   INITIAL STATE
======================================== */

renderFeatures(
  plans.free.features
);