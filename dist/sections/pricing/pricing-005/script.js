const billingToggle =
  document.querySelector("#billingToggle");

const prices =
  document.querySelectorAll(".price-value");

const monthlyLabel =
  document.querySelector('[data-label="monthly"]');

const yearlyLabel =
  document.querySelector('[data-label="yearly"]');

billingToggle.addEventListener("change", () => {
  const yearly = billingToggle.checked;

  monthlyLabel.classList.toggle(
    "is-active",
    !yearly
  );

  yearlyLabel.classList.toggle(
    "is-active",
    yearly
  );

  updatePrices(yearly);
});

function updatePrices(yearly) {
  prices.forEach((price, index) => {
    setTimeout(() => {
      price.classList.add("is-changing");

      setTimeout(() => {
        price.textContent = yearly
          ? price.dataset.yearly
          : price.dataset.monthly;

        requestAnimationFrame(() => {
          price.classList.remove(
            "is-changing"
          );
        });
      }, 160);
    }, index * 45);
  });
}