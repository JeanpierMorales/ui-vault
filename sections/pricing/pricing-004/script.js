const billingSwitch = document.querySelector("#billingSwitch");
const priceValues = document.querySelectorAll(".price-value");
const monthlyLabel = document.querySelector('[data-billing-label="monthly"]');
const yearlyLabel = document.querySelector('[data-billing-label="yearly"]');

billingSwitch.addEventListener("change", () => {
  const yearly = billingSwitch.checked;

  monthlyLabel.classList.toggle("is-active", !yearly);
  yearlyLabel.classList.toggle("is-active", yearly);

  updatePrices(yearly);
});

function updatePrices(yearly) {
  priceValues.forEach((price, index) => {
    setTimeout(() => {
      price.classList.add("is-changing");

      setTimeout(() => {
        price.textContent = yearly
          ? price.dataset.yearly
          : price.dataset.monthly;

        requestAnimationFrame(() => {
          price.classList.remove("is-changing");
        });
      }, 160);
    }, index * 40);
  });
}