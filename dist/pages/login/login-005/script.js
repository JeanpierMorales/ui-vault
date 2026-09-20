const authCard =
  document.getElementById("authCard");

const showRegister =
  document.getElementById("showRegister");

const showLogin =
  document.getElementById("showLogin");

const loginSubmit =
  document.getElementById("loginSubmit");

const registerSubmit =
  document.getElementById("registerSubmit");


/* =========================================
   PANEL TRANSITION
========================================= */

showRegister.addEventListener(
  "click",
  () => {

    authCard.classList.add(
      "register-active"
    );

  }
);


showLogin.addEventListener(
  "click",
  () => {

    authCard.classList.remove(
      "register-active"
    );

  }
);


/* =========================================
   VISUAL VALIDATION
========================================= */

function validateFields(ids) {

  ids.forEach(id => {

    const input =
      document.getElementById(id);

    const field =
      input.closest(".field");


    if (!input.value.trim()) {

      field.classList.add(
        "invalid"
      );

    } else {

      field.classList.remove(
        "invalid"
      );

    }

  });

}


/* =========================================
   SIGN IN
========================================= */

loginSubmit.addEventListener(
  "click",
  () => {

    validateFields([
      "loginEmail",
      "loginPassword"
    ]);

  }
);


/* =========================================
   SIGN UP
========================================= */

registerSubmit.addEventListener(
  "click",
  () => {

    validateFields([
      "registerName",
      "registerEmail",
      "registerPassword"
    ]);

  }
);


/* =========================================
   REMOVE ERROR WHILE TYPING
========================================= */

document
  .querySelectorAll(".field input")
  .forEach(input => {

    input.addEventListener(
      "input",
      () => {

        if (
          input.value.trim()
        ) {

          input
            .closest(".field")
            .classList.remove(
              "invalid"
            );

        }

      }
    );

  });