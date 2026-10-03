const accordionItems =
  document.querySelectorAll(".accordion-item");


accordionItems.forEach((item) => {

  const trigger =
    item.querySelector(".accordion-trigger");


  trigger.addEventListener("click", () => {

    const isOpen =
      item.classList.contains("active");


    /*
      Close all items
    */

    accordionItems.forEach((otherItem) => {

      otherItem.classList.remove("active");

      const otherTrigger =
        otherItem.querySelector(".accordion-trigger");

      otherTrigger.setAttribute(
        "aria-expanded",
        "false"
      );

    });


    /*
      Open clicked item
      unless it was already open
    */

    if (!isOpen) {

      item.classList.add("active");

      trigger.setAttribute(
        "aria-expanded",
        "true"
      );

    }

  });

});