(() => {
  document.documentElement.classList.add("js");

  const PATIENTS = {
    renzo: {
      months: 14,
      name: "Renzo Valdivia, 29",
      role: "Contador en Yanahuara",
      chip: "Alineadores · 14 meses",
      milestones: [
        { m: 0, t: "Primera consulta y escaneo 3D", q: "Llevaba diez años sonriendo con la boca cerrada en las fotos del trabajo. La doctora Paredes me mostró en pantalla cómo se iban a mover los dientes antes de cobrarme un sol." },
        { m: 1, t: "Primeros alineadores", q: "Los dos primeros días hablaba como si tuviera un caramelo en la boca. Para el viernes ya nadie en la oficina lo notaba." },
        { m: 5, t: "Cuarto control", q: "El colmillo de la derecha, el que salía hacia afuera, ya estaba casi en su sitio. Ahí dejé de dudar de si valía la pena." },
        { m: 10, t: "Refinamiento", q: "Un incisivo se quedaba atrás y pidieron un escaneo extra. Los seis alineadores nuevos no me los cobraron." },
        { m: 14, t: "Alta y retenedor", q: "En la boda de mi hermana, en la Mansión del Fundador, me tomaron más de trescientas fotos. Sonrío con los dientes en todas." },
      ],
      stats: [["Alineadores", "24"], ["Controles", "9"], ["Apiñamiento", "6,5 → 0,4 mm"]],
    },
    carmen: {
      months: 6,
      name: "Carmen Zúñiga, 58",
      role: "Profesora jubilada, Cerro Colorado",
      chip: "Implante de muela · 6 meses",
      milestones: [
        { m: 0, t: "Tomografía", q: "Perdí la muela hace tres años y comía solo por el lado izquierdo. Con la tomografía me explicaron cuánto hueso tenía, sin asustarme." },
        { m: 1, t: "Colocación del implante", q: "Fueron cuarenta minutos con anestesia local. Esa noche cené chairo tibio y al día siguiente fui a mi clase de tejido." },
        { m: 3, t: "Osteointegración", q: "Tres meses de espera con una pieza provisional. Me llamaron dos veces solo para preguntar cómo iba." },
        { m: 5.5, t: "Corona de zirconio", q: "El domingo pedí chicharrón en Sabandía y mastiqué por los dos lados. Mi nieta dice que ya no pongo cara rara al comer." },
      ],
      stats: [["Piezas", "1 implante"], ["Controles", "5"], ["Masticación", "1 → 2 lados"]],
    },
    lucia: {
      months: 8,
      name: "Lucía Mamani, 23",
      role: "Estudiante de Arquitectura, UNSA",
      chip: "Cierre de diastema · 8 meses",
      milestones: [
        { m: 0, t: "Escaneo", q: "Tenía un espacio de tres milímetros entre las paletas. Me dijeron que eran ocho meses, y fueron ocho meses." },
        { m: 2, t: "Primer control", q: "Me dieron un estuche y me puse una alarma en el celular para cumplir las 22 horas diarias. Sin la alarma no lo lograba." },
        { m: 5, t: "Espacio cerrado", q: "En el quinto mes el espacio ya no estaba. Me quedé mirándome en el espejo del baño de la facultad como tonta." },
        { m: 8, t: "Alta", q: "La foto de mi sustentación de tesis es la primera en años en la que no me tapo la boca con la mano." },
      ],
      stats: [["Alineadores", "14"], ["Controles", "6"], ["Diastema", "3 → 0 mm"]],
    },
  };

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const $ = (id) => document.getElementById(id);
  const tabs = [...document.querySelectorAll(".sd-tab")];
  const photos = [...document.querySelectorAll("#sd-photos img")];
  const panel = $("sd-panel");
  const range = $("sd-range");
  const ticks = $("sd-ticks");
  const quote = $("sd-quote");
  const quoteText = $("sd-quote-text");
  const stage = $("sd-stage");
  const monthN = $("sd-month-n");
  const monthT = $("sd-month-t");
  const chip = $("sd-chip");
  const who = $("sd-who");
  const stats = $("sd-stats");
  if (!range) return;

  let current = "renzo";
  let shown = -1;
  let swapTimer = 0;

  const pad = (n) => String(n).padStart(2, "0");

  function showMilestone(idx, animate) {
    const ms = PATIENTS[current].milestones[idx];
    const write = () => {
      quoteText.textContent = ms.q;
      stage.textContent = ms.t;
      quote.classList.remove("is-out");
    };
    clearTimeout(swapTimer);
    if (animate && !reduce.matches) {
      quote.classList.add("is-out");
      swapTimer = setTimeout(write, 200);
    } else {
      write();
    }
  }

  function update(animate = true) {
    const data = PATIENTS[current];
    const v = parseFloat(range.value);
    range.style.setProperty("--fill", `${((v / data.months) * 100).toFixed(2)}%`);
    monthN.textContent = pad(Math.floor(v + 0.001));

    let idx = 0;
    data.milestones.forEach((ms, i) => { if (v >= ms.m) idx = i; });
    [...ticks.children].forEach((t, i) => t.classList.toggle("is-past", i <= idx));
    range.setAttribute("aria-valuetext", `Mes ${Math.floor(v)} de ${data.months}: ${data.milestones[idx].t}`);

    if (idx !== shown) {
      shown = idx;
      showMilestone(idx, animate);
    }
  }

  function select(id, focus) {
    current = id;
    const data = PATIENTS[id];
    tabs.forEach((t) => {
      const on = t.dataset.id === id;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      if (on) {
        panel.setAttribute("aria-labelledby", t.id);
        if (focus) t.focus();
      }
    });
    photos.forEach((img) => img.classList.toggle("is-on", img.dataset.id === id));
    chip.textContent = data.chip;
    who.innerHTML = `<strong>${data.name}</strong> ${data.role}`;
    monthT.textContent = data.months;
    stats.innerHTML = data.stats.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");

    range.max = data.months;
    range.value = 0;
    ticks.innerHTML = "";
    data.milestones.forEach((ms) => {
      const s = document.createElement("span");
      s.style.left = `${(ms.m / data.months) * 100}%`;
      ticks.append(s);
    });
    shown = -1;
    update(true);
  }

  range.addEventListener("input", () => update(true));

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(tab.dataset.id, false));
    tab.addEventListener("keydown", (e) => {
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      let next = null;
      if (step) next = (i + step + tabs.length) % tabs.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = tabs.length - 1;
      if (next === null) return;
      e.preventDefault();
      select(tabs[next].dataset.id, true);
    });
  });

  select("renzo", false);
})();
