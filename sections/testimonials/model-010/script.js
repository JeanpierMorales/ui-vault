(() => {
  document.documentElement.classList.add("js");

  const notes = [...document.querySelectorAll(".vn")];
  if (!notes.length) return;

  const BARS = 34;
  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  // Deterministic "speech" envelope per note so every waveform is different but stable.
  function seeded(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
    return () => {
      h = Math.imul(h ^ (h >>> 15), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };
  }

  const players = notes.map((note) => {
    const wave = note.querySelector(".vn-wave");
    const text = note.querySelector(".vn-text");
    const time = note.querySelector(".vn-time");
    const btn = note.querySelector(".vn-play");
    const dur = parseFloat(note.dataset.dur) || 15;
    const rand = seeded(text.textContent);

    const bars = [];
    for (let i = 0; i < BARS; i++) {
      const phrase = 0.5 + 0.5 * Math.abs(Math.sin((i / BARS) * Math.PI * (1.6 + rand())));
      const h = Math.max(18, Math.min(100, (0.3 + rand() * 0.7) * phrase * 100));
      const bar = document.createElement("i");
      bar.style.setProperty("--h", `${h.toFixed(0)}%`);
      wave.append(bar);
      bars.push(bar);
    }

    // Wrap words; each word gets a time slot proportional to its length.
    const words = text.textContent.trim().split(/\s+/);
    text.textContent = "";
    const spans = [];
    let total = 0;
    const weights = words.map((w) => {
      const pause = /[.,:;!?…]$/.test(w) ? 3 : 0;
      const wt = w.length + 2 + pause;
      total += wt;
      return wt;
    });
    let acc = 0;
    const starts = weights.map((w) => {
      const s = acc / total;
      acc += w;
      return s;
    });
    words.forEach((w, i) => {
      const s = document.createElement("span");
      s.className = "w";
      s.textContent = w;
      text.append(s);
      if (i < words.length - 1) text.append(" ");
      spans.push(s);
    });

    const label = btn.getAttribute("aria-label");
    return { note, btn, bars, spans, starts, time, dur, label, t: 0, raf: 0, last: 0, word: -1, bar: -1 };
  });

  let active = null;

  function paint(p) {
    const prog = Math.min(1, p.t / p.dur);
    const bi = Math.min(BARS - 1, Math.floor(prog * BARS));
    if (bi !== p.bar) {
      p.bars.forEach((b, i) => {
        b.classList.toggle("on", i < bi);
        b.classList.toggle("head", i === bi && p.t > 0);
      });
      p.bar = bi;
    }
    let wi = -1;
    for (let i = 0; i < p.starts.length; i++) if (prog >= p.starts[i]) wi = i;
    if (p.t === 0) wi = -1;
    if (wi !== p.word) {
      if (p.word >= 0) p.spans[p.word].classList.remove("now");
      if (wi >= 0) p.spans[wi].classList.add("now");
      p.word = wi;
    }
    p.time.textContent = p.t > 0 ? fmt(p.t) : fmt(p.dur);
  }

  function tick(now) {
    const p = active;
    if (!p) return;
    p.t += Math.min(0.1, (now - p.last) / 1000);
    p.last = now;
    if (p.t >= p.dur) {
      p.t = p.dur;
      paint(p);
      stop(p, true);
      return;
    }
    paint(p);
    p.raf = requestAnimationFrame(tick);
  }

  function play(p) {
    if (active && active !== p) stop(active, false);
    active = p;
    if (p.t >= p.dur) p.t = 0;
    p.note.classList.add("is-playing");
    p.btn.setAttribute("aria-label", p.label.replace("Reproducir", "Pausar"));
    p.last = performance.now();
    p.raf = requestAnimationFrame(tick);
  }

  // finished = true resets the note to its idle look after a short beat.
  function stop(p, finished) {
    cancelAnimationFrame(p.raf);
    p.note.classList.remove("is-playing");
    p.btn.setAttribute("aria-label", p.label);
    p.bars.forEach((b) => b.classList.remove("head"));
    p.bar = -1;
    if (active === p) active = null;
    if (finished) {
      setTimeout(() => {
        if (active === p) return;
        p.t = 0;
        p.bar = -1;
        p.bars.forEach((b) => b.classList.remove("on"));
        paint(p);
      }, 700);
    }
  }

  players.forEach((p) => {
    paint(p);
    p.btn.addEventListener("click", () => {
      if (active === p) stop(p, false);
      else play(p);
    });
  });

  // Pause when the playing note leaves the viewport or the tab is hidden.
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting && active && active.note === e.target) stop(active, false);
    });
  }, { threshold: 0 });
  notes.forEach((n) => io.observe(n));

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && active) stop(active, false);
  });
})();
