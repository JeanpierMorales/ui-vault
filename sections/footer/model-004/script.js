document.addEventListener("DOMContentLoaded", () => {

  const year =
    document.getElementById("year");

  if (year) {
    year.textContent =
      new Date().getFullYear();
  }


  const form =
    document.querySelector(".newsletter-form");

  if (form) {

    form.addEventListener("submit", (event) => {

      event.preventDefault();

      const button =
        form.querySelector(".newsletter-button span:first-child");

      if (!button) return;

      const originalText =
        button.textContent;

      button.textContent =
        "Subscribed";

      setTimeout(() => {
        button.textContent =
          originalText;
      }, 2000);

    });

  }


  document
    .querySelectorAll('a[href="#"]')
    .forEach((link) => {

      link.addEventListener("click", (event) => {
        event.preventDefault();
      });

    });

});