(() => {
  document.documentElement.classList.add("js");

  const RATE = 3.75; // soles por dólar, referencial
  const FREE_SHIP = 120; // soles

  const catalog = [
    { id: "piura", name: "Piura blanco 70\u00a0%", origin: "Alto Piura", pct: 70, pen: 24, img: "img/tableta.webp", tags: "tableta cacao blanco norandino" },
    { id: "chuncho", name: "Chuncho 64\u00a0%", origin: "Quillabamba, Cusco", pct: 64, pen: 22, img: "img/leche.webp", tags: "tableta nativo la convencion" },
    { id: "tarapoto", name: "Lamas 85\u00a0%", origin: "Lamas, San Martín", pct: 85, pen: 22, img: "img/trozos.webp", tags: "tableta intenso tarapoto" },
    { id: "junin", name: "Pangoa 72\u00a0% con sal de Maras", origin: "Pangoa, Junín", pct: 72, pen: 24, img: "img/barra.webp", tags: "tableta sal cusco maras" },
    { id: "ucayali", name: "Aguaytía 60\u00a0% con aguaymanto", origin: "Padre Abad, Ucayali", pct: 60, pen: 26, img: "img/mazorca.webp", tags: "tableta fruta aguaymanto" },
    { id: "amazonas", name: "Bagua 55\u00a0% con leche de coco", origin: "Bagua, Amazonas", pct: 55, pen: 23, img: "img/leche.webp", tags: "tableta vegano coco" },
    { id: "bombones", name: "Bombones de pisco quebranta, caja de 9", origin: "Relleno con pisco de Ica", pct: 66, pen: 48, img: "img/trozos.webp", tags: "bombones regalo pisco ica caja" },
    { id: "caja", name: "Caja de bolaina con tres tabletas", origin: "Piura, Cusco y San Martín", pct: 70, pen: 79, img: "img/barra.webp", tags: "regalo caja madera tarjeta" },
    { id: "nibs", name: "Nibs de cacao tostado, 150 g", origin: "Lamas, San Martín", pct: 100, pen: 18, img: "img/nibs.webp", tags: "nibs granola desayuno" },
  ];
  const byId = Object.fromEntries(catalog.map((p) => [p.id, p]));

  let currency = "PEN";
  const cart = new Map([["piura", 1], ["chuncho", 1]]);

  const $ = (id) => document.getElementById(id);
  const body = document.body;
  const searchBtn = $("searchBtn");
  const palette = $("palette");
  const input = $("paletteInput");
  const list = $("paletteList");
  const empty = $("paletteEmpty");
  const emptyQ = $("emptyQ");
  const status = $("paletteStatus");
  const cartBtn = $("cartBtn");
  const cartEl = $("cart");
  const cartPanel = cartEl.querySelector(".cart-panel");
  const cartList = $("cartList");
  const cartEmpty = $("cartEmpty");
  const cartCount = $("cartCount");
  const cartSr = $("cartSr");
  const cartTotal = $("cartTotal");
  const shipText = $("shipText");
  const shipFill = $("shipFill");
  const fxNote = $("fxNote");
  const menuBtn = $("menuBtn");
  const mobileMenu = $("mobileMenu");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- money ---------- */

  function money(pen) {
    if (currency === "USD") return "US$ " + (pen / RATE).toFixed(2);
    return "S/ " + pen.toFixed(2);
  }

  function setCurrency(cur) {
    currency = cur;
    document.querySelectorAll(".cur-btn").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.cur === cur)));
    document.querySelectorAll(".price[data-pen]").forEach((el) => { el.textContent = money(Number(el.dataset.pen)); });
    fxNote.textContent = cur === "USD"
      ? `Cobramos en soles; los dólares son referenciales (S/ ${RATE.toFixed(2)} por US$ 1).`
      : "Precios en soles. Envío en 48 h a Lima, 3 a 5 días a provincias.";
    renderCart();
    if (!palette.hidden) renderResults();
  }

  document.querySelectorAll(".cur-btn").forEach((b) => b.addEventListener("click", () => setCurrency(b.dataset.cur)));

  /* ---------- cart ---------- */

  function count() { let n = 0; cart.forEach((q) => { n += q; }); return n; }

  function renderCart() {
    const n = count();
    cartCount.textContent = n;
    cartSr.textContent = `, ${n} ${n === 1 ? "producto" : "productos"}`;

    let total = 0;
    cartList.innerHTML = "";
    cart.forEach((q, id) => {
      const p = byId[id];
      total += p.pen * q;
      const li = document.createElement("li");
      li.className = "line";
      li.innerHTML = `
        <img class="thumb" src="${p.img}" alt="" width="56" height="56">
        <div><p class="line-name">${p.name}</p><p class="line-price">${money(p.pen)} c/u</p></div>
        <div class="qty" role="group" aria-label="Cantidad de ${p.name}">
          <button type="button" data-dec="${id}" aria-label="Quitar una">−</button>
          <output aria-live="polite">${q}</output>
          <button type="button" data-inc="${id}" aria-label="Agregar una">+</button>
        </div>`;
      cartList.appendChild(li);
    });
    cartEmpty.hidden = n > 0;
    cartTotal.textContent = money(total);
    const left = Math.max(0, FREE_SHIP - total);
    shipText.textContent = left > 0
      ? `Te faltan ${money(left)} para el envío gratis a Lima`
      : "Tu envío a Lima es gratis";
    shipFill.style.transform = `scaleX(${Math.min(1, total / FREE_SHIP)})`;
  }

  function add(id) {
    cart.set(id, (cart.get(id) || 0) + 1);
    renderCart();
    if (!reduce.matches) {
      cartCount.classList.remove("is-bump");
      void cartCount.offsetWidth;
      cartCount.classList.add("is-bump");
    }
  }

  cartList.addEventListener("click", (e) => {
    const inc = e.target.closest("[data-inc]");
    const dec = e.target.closest("[data-dec]");
    if (inc) add(inc.dataset.inc);
    if (dec) {
      const id = dec.dataset.dec;
      const q = (cart.get(id) || 0) - 1;
      if (q <= 0) cart.delete(id); else cart.set(id, q);
      renderCart();
      // keep focus inside the drawer after a row disappears
      if (q <= 0) cartPanel.querySelector(".cart-close").focus();
      else cartList.querySelector(`[data-dec="${id}"]`).focus();
      return;
    }
    if (inc) cartList.querySelector(`[data-inc="${inc.dataset.inc}"]`).focus();
  });

  document.querySelectorAll("[data-add]").forEach((b) => b.addEventListener("click", () => {
    add(b.dataset.add);
    b.textContent = "Agregado";
    setTimeout(() => { b.innerHTML = `Agregar<span class="sr-only"> ${byId[b.dataset.add].name}</span>`; }, 1400);
  }));

  /* ---------- shared dialog helpers ---------- */

  let lastFocus = null;

  function focusables(root) {
    return [...root.querySelectorAll('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])')]
      .filter((el) => el.offsetParent !== null || el === document.activeElement);
  }

  function trap(e, root) {
    if (e.key !== "Tab") return;
    const f = focusables(root);
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------- palette ---------- */

  let results = [];
  let active = 0;

  function norm(s) { return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }

  function match(q) {
    const nq = norm(q.trim());
    if (!nq) return catalog.slice(0, 6);
    const num = parseInt(nq, 10);
    if (!Number.isNaN(num) && /^\d+/.test(nq)) {
      return catalog.filter((p) => p.pct >= num && p.pct < 100).sort((a, b) => a.pct - b.pct);
    }
    return catalog.filter((p) => norm(`${p.name} ${p.origin} ${p.tags}`).includes(nq));
  }

  function highlight(text, q) {
    const nq = norm(q.trim());
    if (!nq || /^\d/.test(nq)) return text;
    const i = norm(text).indexOf(nq);
    if (i === -1) return text;
    return `${text.slice(0, i)}<mark>${text.slice(i, i + nq.length)}</mark>${text.slice(i + nq.length)}`;
  }

  function renderResults() {
    const q = input.value;
    results = match(q);
    active = Math.min(active, Math.max(0, results.length - 1));
    list.innerHTML = "";
    results.forEach((p, i) => {
      const li = document.createElement("li");
      li.className = "opt";
      li.id = `opt-${p.id}`;
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", String(i === active));
      li.dataset.id = p.id;
      const pctLabel = p.pct === 100 ? "nibs" : `${p.pct} % cacao`;
      li.innerHTML = `
        <img class="thumb" src="${p.img}" alt="" width="56" height="56">
        <span><span class="opt-name">${highlight(p.name, q)}</span>
          <span class="opt-meta"><span>${highlight(p.origin, q)}</span><span class="pct" aria-hidden="true"><span style="transform:scaleX(${p.pct / 100})"></span></span><span class="sr-only">, ${pctLabel}</span></span></span>
        <span class="opt-price">${money(p.pen)}</span>`;
      list.appendChild(li);
    });
    empty.hidden = results.length > 0;
    emptyQ.textContent = q.trim();
    list.hidden = results.length === 0;
    input.setAttribute("aria-activedescendant", results.length ? `opt-${results[active].id}` : "");
    if (!results.length) input.removeAttribute("aria-activedescendant");
    status.textContent = q.trim() ? `${results.length} ${results.length === 1 ? "resultado" : "resultados"}` : "";
  }

  function move(delta) {
    if (!results.length) return;
    active = (active + delta + results.length) % results.length;
    [...list.children].forEach((li, i) => li.setAttribute("aria-selected", String(i === active)));
    input.setAttribute("aria-activedescendant", `opt-${results[active].id}`);
    list.children[active].scrollIntoView({ block: "nearest" });
  }

  function choose(i) {
    const p = results[i];
    if (!p) return;
    add(p.id);
    status.textContent = `${p.name} agregado a la bolsa. Tienes ${count()} productos.`;
    const li = list.children[i];
    if (li) {
      const price = li.querySelector(".opt-price");
      price.textContent = "Agregado";
      setTimeout(() => { if (price.isConnected) price.textContent = money(p.pen); }, 1100);
    }
  }

  function openPalette(prefill = "") {
    closeMenu();
    lastFocus = document.activeElement;
    palette.hidden = false;
    body.classList.add("is-locked");
    input.value = prefill;
    active = 0;
    renderResults();
    input.focus();
  }

  function closePalette() {
    palette.hidden = true;
    body.classList.remove("is-locked");
    (lastFocus && lastFocus.isConnected ? lastFocus : searchBtn).focus();
  }

  searchBtn.addEventListener("click", () => openPalette());
  input.addEventListener("input", () => { active = 0; renderResults(); });
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
    else if (e.key === "Enter") { e.preventDefault(); choose(active); }
  });
  list.addEventListener("click", (e) => {
    const li = e.target.closest(".opt");
    if (!li) return;
    active = [...list.children].indexOf(li);
    move(0);
    choose(active);
    input.focus();
  });
  list.addEventListener("pointermove", (e) => {
    const li = e.target.closest(".opt");
    if (!li) return;
    const i = [...list.children].indexOf(li);
    if (i !== active) { active = i; move(0); }
  });
  palette.querySelectorAll(".palette-chips button").forEach((b) => b.addEventListener("click", () => {
    input.value = b.dataset.q;
    active = 0;
    renderResults();
    input.focus();
  }));
  palette.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", closePalette));
  palette.addEventListener("keydown", (e) => trap(e, palette));

  /* ---------- cart drawer ---------- */

  function openCart() {
    closeMenu();
    lastFocus = document.activeElement;
    renderCart();
    cartEl.hidden = false;
    cartBtn.setAttribute("aria-expanded", "true");
    body.classList.add("is-locked");
    requestAnimationFrame(() => requestAnimationFrame(() => cartEl.classList.add("is-in")));
    cartPanel.querySelector(".cart-close").focus();
  }

  function closeCart() {
    cartEl.classList.remove("is-in");
    cartBtn.setAttribute("aria-expanded", "false");
    body.classList.remove("is-locked");
    const done = () => { cartEl.hidden = true; };
    if (reduce.matches) done(); else setTimeout(done, 420);
    cartBtn.focus();
  }

  cartBtn.addEventListener("click", openCart);
  cartEl.querySelectorAll("[data-close-cart]").forEach((el) => el.addEventListener("click", closeCart));
  cartEl.addEventListener("keydown", (e) => trap(e, cartPanel));
  $("checkout").addEventListener("click", closeCart);

  /* ---------- mobile menu ---------- */

  function closeMenu(focusBack = false) {
    if (mobileMenu.hidden) return;
    mobileMenu.hidden = true;
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Abrir menú");
    if (focusBack) menuBtn.focus();
  }

  menuBtn.addEventListener("click", () => {
    const open = mobileMenu.hidden;
    mobileMenu.hidden = !open;
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  });
  mobileMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => closeMenu()));
  window.matchMedia("(min-width: 961px)").addEventListener("change", () => closeMenu());

  /* ---------- global keys ---------- */

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!palette.hidden) { e.preventDefault(); closePalette(); }
      else if (!cartEl.hidden) { e.preventDefault(); closeCart(); }
      else if (!mobileMenu.hidden) closeMenu(true);
      return;
    }
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
    if (!palette.hidden || !cartEl.hidden) return;
    if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) { e.preventDefault(); openPalette(); }
    else if (e.key === "/" && !typing) { e.preventDefault(); openPalette(); }
  });

  // ⌘ on Apple devices, Ctrl elsewhere — only for the visible hint
  if (!/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) {
    searchBtn.setAttribute("title", "Buscar (/ o Ctrl+K)");
  } else {
    searchBtn.setAttribute("title", "Buscar (/ o ⌘K)");
  }

  /* ---------- soft band behind the pills once past the photo ---------- */

  const bar = document.getElementById("bar");
  const hero = document.querySelector(".hero");
  let ticking = false;
  function onScroll() {
    ticking = false;
    bar.classList.toggle("is-past", hero.getBoundingClientRect().bottom < bar.offsetHeight + 24);
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  setCurrency("PEN");
})();
