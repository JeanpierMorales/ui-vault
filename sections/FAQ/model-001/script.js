const faqItems = document.querySelectorAll(".faq-item");


faqItems.forEach((item) => {

  const button = item.querySelector(".faq-question");


  button.addEventListener("click", () => {

    const isOpen = item.classList.contains("active");


    /*
    ========================================
    Close every FAQ
    ========================================
    */

    faqItems.forEach((faq) => {

      faq.classList.remove("active");

      const faqButton =
        faq.querySelector(".faq-question");

      faqButton.setAttribute(
        "aria-expanded",
        "false"
      );

    });


    /*
    ========================================
    Open selected FAQ
    ========================================
    */

    if (!isOpen) {

      item.classList.add("active");

      button.setAttribute(
        "aria-expanded",
        "true"
      );

    }

  });

});