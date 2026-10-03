(() => {
  const form = document.getElementById("planner");
  if (!form) return;

  const STUDIO_EMAIL = "hello@poco.studio";
  const MAX_NEEDS = 3;

  const ROOMS = {
    living:  { word: "living room", ratio: 1.35 },
    bedroom: { word: "bedroom",     ratio: 1.2 },
    kitchen: { word: "kitchen",     ratio: 1.7 },
    studio:  { word: "studio",      ratio: 1.3 }
  };
  const NEEDS = {
    calm: "calm",
    storage: "lots of storage",
    work: "a place to work",
    guests: "room for guests",
    light: "more daylight",
    pet: "space for a pet"
  };

  const size = document.getElementById("size");
  const sizeNum = document.getElementById("size-num");
  const district = document.getElementById("district");
  const nameInput = document.getElementById("name");
  const email = document.getElementById("email");
  const notes = document.getElementById("notes");
  const roomBlock = document.getElementById("room-block");
  const roomError = document.getElementById("room-error");
  const briefText = document.getElementById("brief-text");
  const briefLive = document.getElementById("brief-live");
  const rect = document.getElementById("room-rect");
  const dims = document.getElementById("plan-dims");
  const alertBox = document.getElementById("form-alert");
  const done = document.getElementById("done");
  const copyBtn = document.getElementById("copy");
  const needBoxes = [...form.querySelectorAll('input[name="needs"]')];

  let previous = {};
  let liveTimer;

  const state = () => ({
    room: form.querySelector('input[name="room"]:checked')?.value || "",
    size: Number(size.value),
    where: district.value.trim(),
    needs: needBoxes.filter(b => b.checked).map(b => b.value)
  });

  // "an 8", "an 11", "an 18", "an 80–89"; "a" otherwise
  const article = n => (/^8/.test(String(n)) || n === 11 || n === 18) ? "An" : "A";

  const listJoin = items =>
    items.length < 2 ? items.join("") :
    items.slice(0, -1).join(", ") + " and " + items[items.length - 1];

  const briefPlain = s => {
    const room = s.room ? ROOMS[s.room].word : "room";
    let out = `${article(s.size)} ${s.size} m² ${room}`;
    if (s.where) out += ` in ${s.where}`;
    if (s.needs.length) out += ` that needs ${listJoin(s.needs.map(n => NEEDS[n]))}`;
    return out + ".";
  };

  const esc = t => t.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const slot = (key, value, placeholder, changed) => {
    if (!value) return `<span class="slot empty">${placeholder}</span>`;
    return `<span class="slot filled${changed ? " fresh" : ""}" data-k="${key}">${esc(value)}</span>`;
  };

  function renderBrief() {
    const s = state();
    const roomWord = s.room ? ROOMS[s.room].word : "";
    const needsTxt = listJoin(s.needs.map(n => NEEDS[n]));

    const html =
      `${article(s.size)} <span class="num">${s.size}&nbsp;m²</span> ` +
      slot("room", roomWord, "which room", previous.room !== s.room) +
      ` in ` + slot("where", s.where, "your district", previous.where !== s.where && !!s.where) +
      ` that needs ` + slot("needs", needsTxt, "what matters most", previous.needs !== needsTxt) + `.`;

    briefText.innerHTML = html;
    previous = { room: s.room, where: s.where, needs: needsTxt };

    // announce calmly, not on every slider tick
    clearTimeout(liveTimer);
    liveTimer = setTimeout(() => { briefLive.textContent = "Brief: " + briefPlain(s); }, 900);

    drawPlan(s);
  }

  // Floor plan: 12 m × 10 m grid, 10 units per metre, centred at (66, 52)
  function drawPlan(s) {
    const ratio = s.room ? ROOMS[s.room].ratio : 1.3;
    let w = Math.sqrt(s.size * ratio);
    let h = s.size / w;
    if (w > 11.6) { w = 11.6; h = s.size / w; }
    if (h > 9.6)  { h = 9.6;  w = s.size / h; }
    const W = w * 10, H = h * 10;
    const x = 66 - W / 2, y = 52 - H / 2;
    rect.style.x = x + "px"; rect.style.y = y + "px";
    rect.style.width = W + "px"; rect.style.height = H + "px";
    rect.setAttribute("x", x); rect.setAttribute("y", y);
    rect.setAttribute("width", W); rect.setAttribute("height", H);
    dims.textContent = `${w.toFixed(1)} × ${h.toFixed(1)} m`;
  }

  function syncSlider() {
    sizeNum.textContent = size.value;
    const pct = (size.value - size.min) / (size.max - size.min) * 100;
    size.style.setProperty("--fill", pct + "%");
    size.setAttribute("aria-valuetext", `${size.value} square metres`);
  }

  function limitNeeds() {
    const full = needBoxes.filter(b => b.checked).length >= MAX_NEEDS;
    needBoxes.forEach(b => { b.disabled = full && !b.checked; });
  }

  /* ---------- validation ---------- */
  const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  function setFieldError(input, errorEl, bad) {
    input.setAttribute("aria-invalid", bad ? "true" : "false");
    errorEl.hidden = !bad;
  }

  function checkRoom() {
    const bad = !state().room;
    roomBlock.classList.toggle("invalid", bad);
    roomError.hidden = !bad;
    return !bad;
  }
  function checkName() {
    const bad = nameInput.value.trim().length < 2;
    setFieldError(nameInput, document.getElementById("name-error"), bad);
    return !bad;
  }
  function checkEmail() {
    const v = email.value.trim();
    const errEl = document.getElementById("email-error");
    errEl.textContent = v ? "That email looks incomplete. Check the part after the @." : "We need an email to send the layout to.";
    const bad = !emailOk(v);
    setFieldError(email, errEl, bad);
    return !bad;
  }

  let attempted = false;

  /* ---------- events ---------- */
  size.addEventListener("input", () => { syncSlider(); renderBrief(); });
  district.addEventListener("input", renderBrief);
  form.addEventListener("change", e => {
    if (e.target.name === "needs") limitNeeds();
    if (e.target.name === "room" && attempted) checkRoom();
    renderBrief();
  });
  nameInput.addEventListener("blur", () => { if (attempted || nameInput.value) checkName(); });
  email.addEventListener("blur", () => { if (attempted || email.value) checkEmail(); });
  nameInput.addEventListener("input", () => { if (nameInput.getAttribute("aria-invalid") === "true") checkName(); });
  email.addEventListener("input", () => { if (email.getAttribute("aria-invalid") === "true") checkEmail(); });

  form.addEventListener("submit", e => {
    e.preventDefault();
    attempted = true;
    done.hidden = true;

    const results = [
      [checkRoom(), form.querySelector('input[name="room"]')],
      [checkName(), nameInput],
      [checkEmail(), email]
    ];
    const failed = results.filter(r => !r[0]);

    if (failed.length) {
      const n = failed.length;
      alertBox.textContent = n === 1
        ? "One thing is missing before we can read your brief. It's marked in the form."
        : `${n} things are missing before we can read your brief. They're marked in the form.`;
      failed[0][1].focus({ preventScroll: false });
      return;
    }

    alertBox.textContent = "";
    const s = state();
    const brief = briefPlain(s);
    const body = [
      "Hello POCO,",
      "",
      brief,
      "",
      notes.value.trim() ? "A few more things:\n" + notes.value.trim() + "\n" : "",
      nameInput.value.trim(),
      email.value.trim()
    ].filter((l, i, a) => !(l === "" && a[i - 1] === "")).join("\n");

    const subject = `Room brief: ${s.size} m² ${ROOMS[s.room].word}${s.where ? ", " + s.where : ""}`;
    const href = `mailto:${STUDIO_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    copyBtn.dataset.text = body;
    done.hidden = false;
    done.focus({ preventScroll: true });
    window.location.href = href;
  });

  copyBtn.addEventListener("click", async () => {
    const text = copyBtn.dataset.text || briefPlain(state());
    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = "Copied. Paste it into an email";
    } catch {
      copyBtn.textContent = "Copy failed. Select the brief above instead";
    }
  });

  syncSlider();
  renderBrief();
})();
