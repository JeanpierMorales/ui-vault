(() => {
  document.documentElement.classList.add("js");

  const OPEN = 12 * 60;
  const CLOSE = 16 * 60;

  const clock = document.getElementById("clock");
  const boardStatus = document.getElementById("boardStatus");
  const navStatus = document.getElementById("navStatus");
  const navStatusText = document.getElementById("navStatusText");
  const scrub = document.getElementById("scrub");
  const nowBtn = document.getElementById("nowBtn");
  const rows = [...document.querySelectorAll("#catch li")].map((li) => ({
    li,
    state: li.querySelector(".state"),
    last: toMin(li.dataset.last),
    out: toMin(li.dataset.out),
  }));

  let live = true;

  function toMin(hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  }

  function fmt(min) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
  }

  function limaNow() {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "America/Lima",
      hour: "2-digit",
      minute: "2-digit",
      weekday: "short",
      hour12: false,
    }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t)?.value;
    return {
      min: (Number(get("hour")) % 24) * 60 + Number(get("minute")),
      day: get("weekday"),
    };
  }

  function setText(el, text) {
    if (el.textContent !== text) el.textContent = text;
  }

  function render(min, day) {
    const closedDay = live && day === "Mon";

    setText(clock, fmt(min));
    clock.setAttribute("datetime", fmt(min));

    let gone = 0;
    rows.forEach((r) => {
      let label = "Fresh";
      let isLast = false;
      let isOut = false;

      if (closedDay) {
        label = "Tuesday";
      } else if (min < OPEN) {
        label = "At noon";
      } else if (min >= r.out) {
        label = "Sold out";
        isOut = true;
        gone += 1;
      } else if (min >= r.last) {
        label = "Last plates";
        isLast = true;
      }

      r.li.classList.toggle("is-out", isOut);
      r.li.classList.toggle("is-last", isLast);
      setText(r.state, label);
    });

    let status;
    if (closedDay) {
      status = "Closed on Mondays. Back Tuesday at noon.";
    } else if (min < OPEN) {
      const wait = OPEN - min;
      const h = Math.floor(wait / 60);
      const m = wait % 60;
      status = live
        ? "Counter opens at 12:00, in " + [h ? h + " h" : "", m ? m + " min" : ""].filter(Boolean).join(" ") + "."
        : "Boxes are in. Counter opens at 12:00.";
    } else if (min >= CLOSE) {
      status = live && day === "Sun"
        ? "Sold through. Back Tuesday at noon."
        : "Sold through. Back tomorrow at noon.";
    } else if (gone === 0) {
      status = "Counter open. Kitchen closes at 16:00.";
    } else {
      status = "Counter open. " + gone + " of " + rows.length + " dishes gone for today.";
    }
    setText(boardStatus, status);

    if (live) {
      const open = !closedDay && min >= OPEN && min < CLOSE;
      navStatus.classList.toggle("is-open", open);
      setText(
        navStatusText,
        closedDay ? "Closed today" : open ? "Open now, until 16:00" : "Lunch only, 12:00 to 16:00"
      );
    }

    scrub.setAttribute("aria-valuetext", fmt(min));
  }

  function clampToScale(min) {
    return Math.min(Number(scrub.max), Math.max(Number(scrub.min), min));
  }

  function goLive() {
    live = true;
    nowBtn.hidden = true;
    const { min, day } = limaNow();
    scrub.value = clampToScale(min);
    render(min, day);
  }

  scrub.addEventListener("input", () => {
    if (live) {
      live = false;
      nowBtn.hidden = false;
    }
    render(Number(scrub.value));
  });

  nowBtn.addEventListener("click", () => {
    goLive();
    scrub.focus();
  });

  setInterval(() => {
    if (live) goLive();
  }, 20000);

  goLive();

  /* mobile menu */
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  const label = toggle.querySelector(".sr-only");

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    links.classList.toggle("is-open", open);
    label.textContent = open ? "Close menu" : "Open menu";
  }

  toggle.addEventListener("click", () => {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      toggle.focus();
    }
  });
})();
