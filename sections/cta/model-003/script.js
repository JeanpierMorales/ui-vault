(() => {
  const root = document.querySelector(".kz-cta");
  if (!root) return;

  const form = root.querySelector("#kz-form");
  const words = [...root.querySelectorAll(".kz-swap__word")];
  const srTitle = root.querySelector("[data-title-sr]");
  const note = root.querySelector("#kz-note-text");
  const wa = root.querySelector("#kz-send-wa");
  const mail = root.querySelector("#kz-send-mail");
  const typeGroup = form.querySelector('input[name="type"]').closest(".kz-group");
  const typeError = root.querySelector("#kz-type-error");

  const PHONE = root.dataset.whatsapp;
  const EMAIL = root.dataset.email;

  const TYPE_TEXT = {
    website: "a website",
    software: "custom software",
    ai: "an AI product",
    unsure: "something, and I’m not sure yet what shape it should take"
  };
  const TYPE_SUBJECT = {
    website: "Website", software: "Software", ai: "AI product", unsure: "Not sure yet"
  };

  let current = "default";
  let touched = false;

  function showWord(key) {
    if (key === current) return;
    words.forEach((w) => {
      const k = w.dataset.word;
      w.classList.toggle("is-on", k === key);
      w.classList.toggle("is-off", k === current);
    });
    // clear the exit state once it is no longer the outgoing word
    words.forEach((w) => {
      if (w.dataset.word !== current) w.classList.remove("is-off");
    });
    current = key;
    const on = words.find((w) => w.dataset.word === key);
    if (on) srTitle.textContent = on.textContent;
  }

  const val = (name) => {
    const el = form.querySelector(`input[name="${name}"]:checked`);
    return el ? el.value : "";
  };

  function escapeHTML(s) {
    return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function compose() {
    const type = val("type");
    const budget = val("budget");
    const when = val("when");
    const about = form.about.value.trim();

    const plain = [
      `Hi KANZO, I’d like to build ${type ? TYPE_TEXT[type] : "…"}.`,
      budget ? `Budget: ${budget} (USD).` : "",
      when ? `Timing: ${when}.` : "",
      about ? `About it: ${about}` : ""
    ].filter(Boolean).join("\n");

    const blank = (t) => `<span class="is-blank">${t}</span>`;
    const hl = (t) => `<mark>${escapeHTML(t)}</mark>`;
    note.innerHTML = [
      `Hi KANZO, I’d like to build ${type ? hl(TYPE_TEXT[type]) : blank("[pick what we’re building]")}.`,
      budget ? `Budget: ${hl(budget)} (USD).` : blank("Budget: [pick a range]"),
      when ? `Timing: ${hl(when)}.` : blank("Timing: [pick one]"),
      about ? `About it: ${hl(about)}` : ""
    ].filter(Boolean).join("\n");

    const text = encodeURIComponent(plain);
    wa.href = `https://wa.me/${PHONE}?text=${text}`;
    const subject = encodeURIComponent(`New project: ${type ? TYPE_SUBJECT[type] : "hello"}`);
    mail.href = `mailto:${EMAIL}?subject=${subject}&body=${text}`;

    return Boolean(type);
  }

  function setError(on) {
    typeError.hidden = !on;
    typeGroup.classList.toggle("has-error", on);
  }

  form.addEventListener("change", (e) => {
    if (e.target.name === "type") {
      touched = true;
      stopIntro();
      showWord(e.target.value);
      setError(false);
    }
    compose();
  });
  form.addEventListener("input", compose);
  form.addEventListener("submit", (e) => e.preventDefault());

  [wa, mail].forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (!compose()) {
        e.preventDefault();
        setError(true);
        form.querySelector('input[name="type"]').focus();
      }
    });
  });

  /* One short intro pass: it. → website → software → AI product → it.
     Runs once when the section enters view, under five seconds, and stops
     the moment the visitor picks something. Skipped for reduced motion. */
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let timers = [];
  function stopIntro() {
    timers.forEach(clearTimeout);
    timers = [];
  }
  function playIntro() {
    const seq = ["website", "software", "ai", "default"];
    seq.forEach((k, i) => {
      timers.push(setTimeout(() => { if (!touched) showWord(k); }, 700 + i * 1000));
    });
  }

  if (!reduce && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((en) => en.isIntersecting)) {
        io.disconnect();
        playIntro();
      }
    }, { threshold: 0.4 });
    io.observe(root.querySelector(".kz-title"));
  }

  compose();
})();
