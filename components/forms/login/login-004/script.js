const authContainer =
  document.getElementById("authContainer");

const signUpButton =
  document.getElementById("signUpButton");

const signInButton =
  document.getElementById("signInButton");

const loginSubmit =
  document.getElementById("loginSubmit");

const registerSubmit =
  document.getElementById("registerSubmit");


/* ================================
   PANEL TRANSITION
================================ */

signUpButton.addEventListener(
  "click",
  () => {

    authContainer.classList.add(
      "register-active"
    );

  }
);


signInButton.addEventListener(
  "click",
  () => {

    authContainer.classList.remove(
      "register-active"
    );

  }
);


/* ================================
   VISUAL FIELD VALIDATION
================================ */

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


/* ================================
   LOGIN VISUAL VALIDATION
================================ */

loginSubmit.addEventListener(
  "click",
  () => {

    validateFields([
      "loginEmail",
      "loginPassword"
    ]);

  }
);


/* ================================
   REGISTER VISUAL VALIDATION
================================ */

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


/* ================================
   REMOVE ERROR WHILE TYPING
================================ */

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