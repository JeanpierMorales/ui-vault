const cards = [
  ...document.querySelectorAll(".card")
];

const filters = [
  ...document.querySelectorAll(".filter")
];

const searchInput =
  document.querySelector("#search");

let activeFilter = "all";


// =====================================================
// FILTERS
// =====================================================

function applyFilters() {

  const query =
    searchInput
      .value
      .trim()
      .toLowerCase();

  cards.forEach(card => {

    const categories =
      card.dataset.category
        .split(" ");

    const name =
      card.dataset.name
        .toLowerCase();

    const matchesFilter =
      activeFilter === "all" ||
      categories.includes(activeFilter);

    const matchesSearch =
      !query ||
      name.includes(query);

    card.classList.toggle(
      "hidden",
      !(
        matchesFilter &&
        matchesSearch
      )
    );

  });

}


filters.forEach(button => {

  button.addEventListener(
    "click",
    () => {

      filters.forEach(btn =>
        btn.classList.remove("active")
      );

      button.classList.add("active");

      activeFilter =
        button.dataset.filter;

      applyFilters();

    }
  );

});


searchInput.addEventListener(
  "input",
  applyFilters
);


// =====================================================
// SPOTLIGHT
// =====================================================

document
  .querySelectorAll("[data-spotlight]")
  .forEach(button => {

    button.addEventListener(
      "mousemove",
      event => {

        const rect =
          button.getBoundingClientRect();

        button.style.setProperty(
          "--x",
          `${event.clientX - rect.left}px`
        );

        button.style.setProperty(
          "--y",
          `${event.clientY - rect.top}px`
        );

      }
    );

  });


// =====================================================
// MAGNETIC
// =====================================================

document
  .querySelectorAll("[data-magnetic]")
  .forEach(button => {

    button.addEventListener(
      "mousemove",
      event => {

        const rect =
          button.getBoundingClientRect();

        const x =
          event.clientX -
          rect.left -
          rect.width / 2;

        const y =
          event.clientY -
          rect.top -
          rect.height / 2;

        button.style.transform =
          `translate(
            ${x * .22}px,
            ${y * .22}px
          )`;

      }
    );

    button.addEventListener(
      "mouseleave",
      () => {

        button.style.transform =
          "translate(0,0)";

      }
    );

  });


// =====================================================
// CURSOR FILL
// =====================================================

document
  .querySelectorAll("[data-cursor-fill]")
  .forEach(button => {

    const bubble =
      button.querySelector(
        ".cursor-bubble"
      );

    button.addEventListener(
      "mouseenter",
      event => {

        const rect =
          button.getBoundingClientRect();

        bubble.style.left =
          `${event.clientX - rect.left}px`;

        bubble.style.top =
          `${event.clientY - rect.top}px`;

      }
    );

  });


// =====================================================
// MENU
// =====================================================

document
  .querySelector(".menu-btn")
  .addEventListener(
    "click",
    function () {

      this.classList.toggle(
        "active"
      );

    }
  );


// =====================================================
// HEART
// =====================================================

document
  .querySelector(".heart-btn")
  .addEventListener(
    "click",
    function () {

      this.classList.toggle(
        "active"
      );

    }
  );


// =====================================================
// BOOKMARK
// =====================================================

document
  .querySelector(".bookmark-btn")
  .addEventListener(
    "click",
    function () {

      this.classList.toggle(
        "active"
      );

    }
  );


// =====================================================
// PLUS CHECK
// =====================================================

document
  .querySelector(".plus-check")
  .addEventListener(
    "click",
    function () {

      this.classList.toggle(
        "active"
      );

    }
  );


// =====================================================
// PLAY PAUSE
// =====================================================

document
  .querySelector(".play-pause")
  .addEventListener(
    "click",
    function () {

      this.classList.toggle(
        "active"
      );

    }
  );


// =====================================================
// DOWNLOAD PROGRESS
// =====================================================

document
  .querySelectorAll("[data-download]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        if (
          button.classList.contains(
            "downloading"
          )
        ) {
          return;
        }

        button.classList.add(
          "downloading"
        );

        const bar =
          button.querySelector(
            ".download-progress-bar"
          );

        const percent =
          button.querySelector(
            ".download-percent"
          );

        let progress = 0;

        const interval =
          setInterval(
            () => {

              progress +=
                Math.floor(
                  Math.random() * 12
                ) + 4;

              if (progress >= 100) {
                progress = 100;
              }

              bar.style.width =
                `${progress}%`;

              percent.textContent =
                `${progress}%`;

              if (progress === 100) {

                clearInterval(
                  interval
                );

                percent.textContent =
                  "Done";

                setTimeout(
                  () => {

                    button.classList.remove(
                      "downloading"
                    );

                    bar.style.width =
                      "0";

                    percent.textContent =
                      "0%";

                  },
                  1500
                );

              }

            },
            150
          );

      }
    );

  });


// =====================================================
// DOWNLOAD SUCCESS
// =====================================================

document
  .querySelectorAll(
    "[data-download-success]"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        button.classList.add(
          "done"
        );

        button.querySelector(
          ".success-label"
        ).textContent =
          "Downloaded";

        setTimeout(
          () => {

            button.classList.remove(
              "done"
            );

            button.querySelector(
              ".success-label"
            ).textContent =
              "Download";

          },
          1800
        );

      }
    );

  });


// =====================================================
// LOADING
// =====================================================

document
  .querySelectorAll("[data-loading]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        if (
          button.classList.contains(
            "loading"
          )
        ) {
          return;
        }

        button.classList.add(
          "loading"
        );

        setTimeout(
          () => {

            button.classList.remove(
              "loading"
            );

            button.classList.add(
              "done"
            );

            setTimeout(
              () => {

                button.classList.remove(
                  "done"
                );

              },
              1400
            );

          },
          1300
        );

      }
    );

  });


// =====================================================
// LOADING DOTS
// =====================================================

document
  .querySelectorAll(
    "[data-loading-dots]"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        button.classList.add(
          "loading"
        );

        setTimeout(
          () => {

            button.classList.remove(
              "loading"
            );

          },
          1800
        );

      }
    );

  });


// =====================================================
// SUCCESS
// =====================================================

document
  .querySelectorAll("[data-success]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        button.classList.add(
          "success"
        );

        button.textContent =
          "✓ Confirmed";

        setTimeout(
          () => {

            button.classList.remove(
              "success"
            );

            button.textContent =
              "Confirm";

          },
          1600
        );

      }
    );

  });


// =====================================================
// RETRY
// =====================================================

document
  .querySelectorAll("[data-retry]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        button.classList.remove(
          "active"
        );

        void button.offsetWidth;

        button.classList.add(
          "active"
        );

      }
    );

  });


// =====================================================
// TOGGLE
// =====================================================

document
  .querySelectorAll(".toggle-btn")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const active =
          button.getAttribute(
            "aria-pressed"
          ) === "true";

        button.setAttribute(
          "aria-pressed",
          String(!active)
        );

        button.querySelector(
          ".toggle-label"
        ).textContent =
          active
            ? "Notifications off"
            : "Notifications on";

      }
    );

  });


// =====================================================
// HOLD DELETE
// =====================================================

document
  .querySelectorAll(
    "[data-hold-delete]"
  )
  .forEach(button => {

    let timer;

    const reset = () => {

      clearTimeout(timer);

      if (
        !button.classList.contains(
          "complete"
        )
      ) {

        button.classList.remove(
          "holding"
        );

      }

    };

    button.addEventListener(
      "pointerdown",
      () => {

        button.classList.add(
          "holding"
        );

        timer =
          setTimeout(
            () => {

              button.classList.add(
                "complete"
              );

              button.querySelector(
                ".hold-label"
              ).textContent =
                "Deleted";

              setTimeout(
                () => {

                  button.classList.remove(
                    "holding",
                    "complete"
                  );

                  button.querySelector(
                    ".hold-label"
                  ).textContent =
                    "Hold to delete";

                },
                1400
              );

            },
            1500
          );

      }
    );

    button.addEventListener(
      "pointerup",
      reset
    );

    button.addEventListener(
      "pointerleave",
      reset
    );

  });


// =====================================================
// UNDO
// =====================================================

document
  .querySelectorAll("[data-undo]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        if (
          button.classList.contains(
            "undo"
          )
        ) {

          button.classList.remove(
            "undo"
          );

          button.textContent =
            "Delete";

        } else {

          button.classList.add(
            "undo"
          );

          button.textContent =
            "Undo";

        }

      }
    );

  });


// =====================================================
// COPY
// =====================================================

document
  .querySelectorAll(
    "[data-copy-button]"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      async () => {

        try {

          await navigator.clipboard.writeText(
            "Copied value"
          );

        } catch {}

        button.querySelector(
          ".copy-symbol"
        ).textContent =
          "✓";

        button.querySelector(
          ".copy-label"
        ).textContent =
          "Copied";

        setTimeout(
          () => {

            button.querySelector(
              ".copy-symbol"
            ).textContent =
              "□";

            button.querySelector(
              ".copy-label"
            ).textContent =
              "Copy";

          },
          1300
        );

      }
    );

  });


// =====================================================
// CART
// =====================================================

document
  .querySelectorAll("[data-cart]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        button.classList.add(
          "added"
        );

        button.querySelector(
          ".cart-label"
        ).textContent =
          "Added";

        setTimeout(
          () => {

            button.classList.remove(
              "added"
            );

            button.querySelector(
              ".cart-label"
            ).textContent =
              "Add to cart";

          },
          1500
        );

      }
    );

  });


// =====================================================
// QUANTITY
// =====================================================

document
  .querySelectorAll(
    ".quantity-control"
  )
  .forEach(control => {

    const value =
      control.querySelector(
        ".quantity-value"
      );

    let quantity = 1;

    control.querySelector(
      ".plus"
    ).addEventListener(
      "click",
      () => {

        quantity++;

        value.textContent =
          quantity;

      }
    );

    control.querySelector(
      ".minus"
    ).addEventListener(
      "click",
      () => {

        quantity =
          Math.max(
            1,
            quantity - 1
          );

        value.textContent =
          quantity;

      }
    );

  });


// =====================================================
// UPLOAD
// =====================================================

document
  .querySelectorAll("[data-upload]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        button.classList.add(
          "uploading"
        );

        button.querySelector(
          ".upload-label"
        ).textContent =
          "Uploading";

        setTimeout(
          () => {

            button.classList.remove(
              "uploading"
            );

            button.querySelector(
              ".upload-label"
            ).textContent =
              "Uploaded ✓";

            setTimeout(
              () => {

                button.querySelector(
                  ".upload-label"
                ).textContent =
                  "Upload";

              },
              1400
            );

          },
          1600
        );

      }
    );

  });


// =====================================================
// SHARE
// =====================================================

document
  .querySelectorAll("[data-share]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        button.classList.toggle(
          "active"
        );

      }
    );

  });


// =====================================================
// FOLLOW
// =====================================================

document
  .querySelectorAll("[data-follow]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const following =
          button.classList.toggle(
            "following"
          );

        button.textContent =
          following
            ? "Following"
            : "Follow";

      }
    );

  });


// =====================================================
// LIKE
// =====================================================

document
  .querySelectorAll("[data-like]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const active =
          button.classList.toggle(
            "active"
          );

        const icon =
          button.querySelector(
            ".like-icon"
          );

        const count =
          button.querySelector(
            ".like-count"
          );

        let number =
          Number(
            count.textContent
          );

        icon.textContent =
          active
            ? "♥"
            : "♡";

        count.textContent =
          active
            ? number + 1
            : number - 1;

      }
    );

  });


// =====================================================
// 3D TILT
// =====================================================

document
  .querySelectorAll("[data-tilt]")
  .forEach(button => {

    button.addEventListener(
      "mousemove",
      event => {

        const rect =
          button.getBoundingClientRect();

        const x =
          event.clientX -
          rect.left;

        const y =
          event.clientY -
          rect.top;

        const rotateY =
          (
            x /
            rect.width -
            .5
          ) * 14;

        const rotateX =
          -(
            y /
            rect.height -
            .5
          ) * 14;

        button.style.transform =
          `
          perspective(500px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          translateY(-2px)
          `;

      }
    );

    button.addEventListener(
      "mouseleave",
      () => {

        button.style.transform =
          `
          perspective(500px)
          rotateX(0)
          rotateY(0)
          `;

      }
    );

  });


// =====================================================
// RIPPLE
// =====================================================

document
  .querySelectorAll("[data-ripple]")
  .forEach(button => {

    button.addEventListener(
      "click",
      event => {

        const rect =
          button.getBoundingClientRect();

        const size =
          Math.max(
            rect.width,
            rect.height
          );

        const ripple =
          document.createElement(
            "span"
          );

        ripple.className =
          "ripple-wave";

        ripple.style.width =
          `${size}px`;

        ripple.style.height =
          `${size}px`;

        ripple.style.left =
          `${
            event.clientX -
            rect.left -
            size / 2
          }px`;

        ripple.style.top =
          `${
            event.clientY -
            rect.top -
            size / 2
          }px`;

        button.appendChild(
          ripple
        );

        setTimeout(
          () => ripple.remove(),
          600
        );

      }
    );

  });


// =====================================================
// SHOW PASSWORD
// =====================================================

document
  .querySelectorAll("[data-eye]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const active =
          button.classList.toggle(
            "active"
          );

        button.querySelector(
          ".eye-label"
        ).textContent =
          active
            ? "Hide password"
            : "Show password";

      }
    );

  });


// =====================================================
// RECORD
// =====================================================

document
  .querySelectorAll("[data-record]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const recording =
          button.classList.toggle(
            "recording"
          );

        button.querySelector(
          ".record-label"
        ).textContent =
          recording
            ? "Recording..."
            : "Record";

      }
    );

  });


// =====================================================
// SEND
// =====================================================

document
  .querySelectorAll("[data-send]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        button.classList.add(
          "sent"
        );

        button.querySelector(
          ".send-label"
        ).textContent =
          "Sent ✓";

        setTimeout(
          () => {

            button.classList.remove(
              "sent"
            );

            button.querySelector(
              ".send-label"
            ).textContent =
              "Send";

          },
          1500
        );

      }
    );

  });