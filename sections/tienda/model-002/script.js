/* MUEX — tienda de sillas, sillones y sofás (SPA con hash router) */

/* ================= DATA ================= */
const IMG = {
  tub: "img/chair-a.webp",
  tufted: "img/chair-b.webp",
  shell: "img/chair-c.webp",
  lounge: "img/chair-d.webp",
  wicker: "img/chair-wicker.webp",
  reading: "img/chair-reading.webp",
  curve: "img/sofa-curve.webp",
  leather: "img/sofa-leather.webp",
  grey: "img/sofa-grey.webp",
};
const AMBIENT = {
  [IMG.wicker]: "img/amb-wicker.webp",
  [IMG.reading]: "img/amb-reading.webp",
  [IMG.curve]: "img/amb-curve.webp",
  [IMG.leather]: "img/amb-leather.webp",
  [IMG.grey]: "img/amb-grey.webp",
};

// fotos en una casa real (las demás son de estudio y solo van en la galería)
const IN_ROOM = new Set([IMG.wicker, IMG.reading]);

const COLORS = {
  arena: { name: "Arena", hex: "#d8c8ac" },
  tinta: { name: "Tinta", hex: "#312e2b" },
  salvia: { name: "Salvia", hex: "#61706d" },
  crema: { name: "Crema", hex: "#ead9be" },
  hueso: { name: "Hueso", hex: "#efddc9" },
  carbon: { name: "Carbón", hex: "#292929" },
  pizarra: { name: "Pizarra", hex: "#4d5354" },
  olivo: { name: "Olivo", hex: "#69704d" },
  arcilla: { name: "Arcilla", hex: "#b8a698" },
  cognac: { name: "Cognac", hex: "#9a5a2e" },
  perla: { name: "Perla", hex: "#b9b9b6" },
};

const CATS = {
  todo: { title: "Toda la tienda", intro: "Todo lo que fabricamos, listo para tu casa." },
  sillas: { title: "Sillas", intro: "Para comer, trabajar y quedarse en la sobremesa." },
  sillones: { title: "Sillones", intro: "Un asiento propio para leer, conversar o no hacer nada." },
  sofas: { title: "Sofás", intro: "Hechos a pedido en Lurín, con estructura de pino tornillo y 5 años de garantía." },
  ofertas: { title: "Ofertas", intro: "Muestras del showroom y colores que salen de colección." },
};

// stock: unidades en Lima (0 = fabricación a pedido)
const P = (id, name, cat, sub, material, img, price, colors, dims, desc, extra = {}) => ({
  id, name, cat, sub, material, img, price, colors, dims, desc, stock: 4, was: 0, isNew: false, best: false, ...extra,
});
const products = [
  P("lan", "LAN", "sillas", "Comedor", "Acero", IMG.shell, 390, ["hueso", "carbon"], [47, 53, 81, 46], "Casco moldeado sobre base de alambre cromado. Se apila de a dos y se limpia con un paño húmedo.", { best: true, stock: 12 }),
  P("kio", "KIO", "sillas", "Comedor", "Acero", IMG.shell, 360, ["carbon", "hueso"], [47, 53, 81, 46], "El casco de LAN con base negra mate. Muestra de showroom con detalles mínimos.", { was: 420, stock: 3 }),
  P("noa", "NOA", "sillas", "Comedor", "Acero", IMG.shell, 410, ["salvia", "hueso"], [47, 53, 81, 46], "Casco salvia, patas cromadas y deslizadores de fieltro incluidos.", { stock: 7 }),
  P("pim", "PIM", "sillas", "Comedor", "Acero", IMG.shell, 350, ["arcilla", "carbon"], [44, 50, 79, 45], "Una silla compacta para cocinas pequeñas y mesas de 70 cm.", { stock: 9 }),
  P("strt", "STRT", "sillas", "Comedor", "Cuero", IMG.tufted, 690, ["crema", "tinta"], [58, 56, 84, 47], "Silla con brazos y casco pespunteado, pensada para mesas de 75 cm.", { stock: 5 }),
  P("yun", "YUN", "sillas", "Comedor", "Roble", IMG.tufted, 640, ["olivo", "hueso"], [58, 56, 84, 47], "Estructura de roble macizo con asiento acolchado en cuero.", { best: true, stock: 6 }),
  P("sili", "SILI", "sillas", "Comedor", "Cuero", IMG.tufted, 720, ["hueso", "olivo"], [58, 56, 84, 47], "Cuero pespunteado y patas de roble aceitado. Último color de la temporada.", { was: 820, stock: 2 }),
  P("junco", "JUNCO", "sillas", "Terraza", "Ratán", IMG.wicker, 480, ["arena"], [56, 58, 80, 44], "Ratán tejido a mano en Iquitos sobre patas de acero negro. Para terraza techada o interior.", { stock: 8 }),
  P("totora", "TOTORA", "sillas", "Terraza", "Ratán", IMG.wicker, 520, ["arena", "carbon"], [56, 58, 80, 44], "JUNCO con cojín de asiento en lona impermeable.", { isNew: true, stock: 6 }),

  P("axe", "AXE", "sillones", "Tapizado", "Tela", IMG.tub, 1290, ["perla", "pizarra", "arcilla"], [72, 64, 78, 45], "Asiento envolvente en tejido de lino mezclado sobre patas cónicas de haya.", { best: true, stock: 5 }),
  P("melm", "MELM", "sillones", "Tapizado", "Tela", IMG.tub, 1190, ["salvia", "arena"], [72, 64, 78, 45], "La estructura de AXE en un bouclé más grueso, para salas que se usan.", { stock: 3 }),
  P("tav", "TAV", "sillones", "Tapizado", "Tela", IMG.tub, 1350, ["arcilla", "salvia"], [72, 64, 78, 45], "Nuestro más vendido, ahora en un tejido arcilla cálido.", { best: true, stock: 0 }),
  P("rolf", "ROLF", "sillones", "Tapizado", "Tela", IMG.tub, 1090, ["pizarra", "carbon"], [72, 64, 78, 45], "Tejido pizarra que disimula el uso, sobre haya aceitada.", { was: 1290, stock: 2 }),
  P("tick", "TICK", "sillones", "Tapizado", "Cuero", IMG.tufted, 1480, ["tinta", "hueso"], [60, 58, 84, 46], "Respaldo con canales cosidos y cojín suelto. Suave, pero mantiene su forma.", { stock: 4 }),
  P("halm", "HALM", "sillones", "Tapizado", "Cuero", IMG.tufted, 1590, ["crema", "arcilla"], [60, 58, 84, 46], "Cuero plena flor que se oscurece con el uso.", { stock: 0 }),
  P("tera", "TERA", "sillones", "Lounge", "Roble", IMG.lounge, 1890, ["pizarra", "crema"], [80, 76, 82, 42], "Patas de roble, asiento de lana texturizada y brazos que abrazan.", { best: true, stock: 3 }),
  P("orb", "ORB", "sillones", "Lounge", "Tela", IMG.lounge, 2090, ["hueso", "olivo"], [82, 78, 84, 42], "Sillón redondeado con cojín de asiento removible y lavable.", { stock: 0 }),
  P("vek", "VEK", "sillones", "Lounge", "Roble", IMG.lounge, 1790, ["arena", "pizarra"], [80, 76, 82, 42], "La estructura de TERA en un lino color arena, más ligero.", { stock: 4 }),
  P("mob", "MOB", "sillones", "Lounge", "Tela", IMG.lounge, 1990, ["crema", "arcilla"], [82, 78, 84, 42], "Asiento profundo y brazos altos. En el que la gente se queda dormida.", { isNew: true, stock: 2 }),
  P("leo", "LEO", "sillones", "Lectura", "Roble", IMG.reading, 1690, ["arena", "salvia"], [66, 78, 96, 41], "Respaldo alto, brazos de roble para apoyar la taza y cojín lumbar incluido.", { isNew: true, stock: 4 }),
  P("pausa", "PAUSA", "sillones", "Lectura", "Roble", IMG.reading, 1590, ["crema", "pizarra"], [66, 78, 96, 41], "LEO con asiento en bouclé crema. Muestra de showroom.", { was: 1790, stock: 1 }),

  P("onda", "ONDA", "sofas", "3 cuerpos", "Cuero", IMG.curve, 4890, ["perla", "tinta"], [228, 92, 78, 43], "Respaldo partido en dos curvas y base de nogal. Cuero sintético de alta resistencia.", { isNew: true, stock: 0 }),
  P("brasa", "BRASA", "sofas", "3 cuerpos", "Cuero", IMG.leather, 5690, ["cognac", "tinta"], [214, 94, 84, 44], "Cuero curtido al vegetal en Arequipa, capitoné y cojines de pluma. Mejora con los años.", { best: true, stock: 1 }),
  P("loma", "LOMA", "sofas", "3 cuerpos", "Tela", IMG.grey, 3990, ["pizarra", "arena", "salvia"], [226, 96, 86, 45], "Tres cuerpos, cinco cojines y funda removible. El sofá para todos los días.", { best: true, stock: 2 }),
  P("loma-2", "LOMA 2C", "sofas", "2 cuerpos", "Tela", IMG.grey, 3290, ["pizarra", "arena"], [176, 96, 86, 45], "LOMA en dos cuerpos, para salas de departamento.", { stock: 0 }),
  P("brasa-2", "BRASA 2C", "sofas", "2 cuerpos", "Cuero", IMG.leather, 4690, ["cognac"], [168, 94, 84, 44], "BRASA en dos cuerpos. Unidad de exhibición con 10% menos.", { was: 5190, stock: 1 }),
];

const MATERIAL_CARE = {
  Tela: "Aspira una vez por semana. Manchas: paño húmedo con jabón neutro, sin frotar. Funda lavable en seco.",
  Cuero: "Limpia con paño seco. Hidrata cada 6 meses con crema para cuero. Evita el sol directo.",
  Roble: "Paño seco o apenas húmedo. Aceite de linaza una vez al año en las partes de madera.",
  Acero: "Paño húmedo y seca de inmediato. No uses productos abrasivos.",
  Ratán: "Aspira con cepillo suave. Mantén bajo techo: la lluvia directa lo reseca.",
};

const REVIEW_POOL = [
  ["Carla M.", "Surco", 5, "Llegó antes de la fecha y los chicos lo armaron en diez minutos. La tela es mejor de lo que se ve en fotos."],
  ["Diego R.", "Barranco", 5, "Fui al showroom a probarlo y lo pedí ahí mismo. Firme pero cómodo, justo lo que buscaba."],
  ["Lucía P.", "San Isidro", 4, "Muy bonito y bien hecho. Le pongo cuatro porque el color en persona es un poco más oscuro."],
  ["Andrés V.", "Miraflores", 5, "Tenemos gato y la tela ha aguantado perfecto seis meses. Recomendado."],
  ["Paola G.", "La Molina", 5, "Me ayudaron por WhatsApp a medir la puerta del depa. Entró sin problema."],
  ["Jorge T.", "Jesús María", 4, "Buena relación calidad-precio. El delivery avisó con una hora de anticipación."],
  ["Sofía C.", "Chorrillos", 5, "Tercer mueble que compro en MUEX. Siempre igual de bien terminado."],
];

const ZONE1 = ["Barranco", "Chorrillos", "Jesús María", "La Molina", "Lince", "Magdalena del Mar", "Miraflores", "Pueblo Libre", "San Borja", "San Isidro", "San Miguel", "Santiago de Surco", "Surquillo"];
const ZONE2 = ["Ate", "Breña", "Callao", "Cercado de Lima", "Comas", "La Victoria", "Los Olivos", "Lurín", "Rímac", "San Juan de Lurigancho", "San Juan de Miraflores", "San Martín de Porres", "Villa El Salvador", "Villa María del Triunfo"];
const DISTRICTS = [...ZONE1, ...ZONE2].sort((a, b) => a.localeCompare(b, "es"));
const FREE_FROM = 1500;
const COUPONS = {
  MUEX10: { label: "10% de descuento", calc: (sub) => Math.round(sub * 0.1) },
  BIENVENIDA: { label: "S/ 100 en compras desde S/ 1,000", calc: (sub) => (sub >= 1000 ? 100 : 0), min: 1000 },
};

const PER_PAGE = 9;
const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const DAYS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

/* ================= HELPERS ================= */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const byId = (id) => products.find((p) => p.id === id);
const money = (n) => "S/ " + Math.round(n).toLocaleString("en-US");
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const icons = () => window.lucide && lucide.createIcons();
const smooth = () => (matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");
const pct = (p) => (p.was ? Math.round((1 - p.price / p.was) * 100) : 0);
const colorOf = (key) => COLORS[key];
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const fmtDate = (d) => `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
const zoneOf = (district) => (ZONE1.includes(district) ? 1 : ZONE2.includes(district) ? 2 : 0);

function load(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}
function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function rating(p) {
  // valoración estable por producto
  let h = 0;
  for (const c of p.id) h = (h * 31 + c.charCodeAt(0)) % 997;
  const extra = store.reviews[p.id] || [];
  const base = REVIEW_POOL.slice(h % 4, (h % 4) + 3);
  const all = [...extra, ...base];
  const avg = all.reduce((n, r) => n + r[2], 0) / all.length;
  const count = 8 + (h % 40) + extra.length;
  return { avg: Math.min(5, avg + 0.1).toFixed(1), count, list: all };
}
function stars(n) {
  return `<span class="stars" aria-hidden="true">${[1, 2, 3, 4, 5]
    .map((i) => `<i data-lucide="star" class="${i <= Math.round(n) ? "on" : ""}"></i>`)
    .join("")}</span>`;
}
function leadText(p) {
  if (p.stock === 0) return "Fabricación a pedido · entrega en 4 semanas";
  if (p.stock <= 2) return `Quedan ${p.stock} en Lima · entrega en 2–4 días`;
  return "En stock · entrega en 2–4 días";
}
function priceHTML(p) {
  return p.was ? `<span class="now">${money(p.price)}</span> <s>${money(p.was)}</s>` : money(p.price);
}

/* ================= STORE ================= */
const store = {
  fav: new Set(load("muex-fav", []).filter(byId)),
  cart: load("muex-cart", []).filter((l) => byId(l.id) && colorOf(l.color)),
  viewed: load("muex-viewed", []).filter(byId),
  orders: load("muex-orders", {}),
  reviews: load("muex-reviews", {}),
  coupon: load("muex-coupon", ""),
  district: load("muex-district", ""),
};
const persist = () => {
  save("muex-fav", [...store.fav]);
  save("muex-cart", store.cart);
  save("muex-viewed", store.viewed);
  save("muex-orders", store.orders);
  save("muex-reviews", store.reviews);
  save("muex-coupon", store.coupon);
  save("muex-district", store.district);
};

const cartCount = () => store.cart.reduce((n, l) => n + l.qty, 0);
const cartSub = () => store.cart.reduce((n, l) => n + l.qty * byId(l.id).price, 0);
function totals(district = store.district, pickup = false) {
  const sub = cartSub();
  const c = COUPONS[store.coupon];
  const discount = c ? c.calc(sub) : 0;
  const base = sub - discount;
  const zone = zoneOf(district);
  let shipping = null; // null = por calcular
  if (pickup) shipping = 0;
  else if (zone === 1) shipping = base >= FREE_FROM ? 0 : 90;
  else if (zone === 2) shipping = base >= FREE_FROM ? 60 : 150;
  return { sub, discount, shipping, total: base + (shipping || 0) };
}
function addToCart(id, color, qty = 1) {
  const line = store.cart.find((l) => l.id === id && l.color === color);
  line ? (line.qty = Math.min(9, line.qty + qty)) : store.cart.push({ id, color, qty });
  persist();
  updateBadges();
}
function toggleFav(id) {
  const on = !store.fav.has(id);
  on ? store.fav.add(id) : store.fav.delete(id);
  persist();
  $$(`[data-fav="${id}"]`).forEach((b) => {
    b.classList.toggle("active", on);
    b.setAttribute("aria-pressed", String(on));
  });
  if (quickId === id) syncQuickFav();
  updateBadges();
  if (route.name === "favoritos" && !on) render();
  showToast(on ? `${byId(id).name} guardado en favoritos` : `${byId(id).name} quitado de favoritos`, on ? "Ver favoritos" : null, () => go("#/favoritos"));
}
function markViewed(id) {
  store.viewed = [id, ...store.viewed.filter((x) => x !== id)].slice(0, 8);
  persist();
}
function updateBadges() {
  const f = store.fav.size;
  const c = cartCount();
  $("#favCount").textContent = f;
  $("#favCount").hidden = !f;
  $("#cartCount").textContent = c;
  $("#cartCount").hidden = !c;
  $("#favBtn").setAttribute("aria-label", `Favoritos, ${f}`);
  $("#cartBtn").setAttribute("aria-label", `Bolsa, ${c} ${c === 1 ? "producto" : "productos"}`);
}

/* ================= SHARED UI ================= */
function card(p) {
  const fav = store.fav.has(p.id);
  const c = colorOf(p.colors[0]);
  const flag = p.was ? `<span class="tag tag-dark">-${pct(p)}%</span>` : p.isNew ? `<span class="tag tag-dark">Nuevo</span>` : "";
  return `
<article class="product-card" data-id="${p.id}">
  <a class="card-link" href="#/producto/${p.id}" aria-label="${p.name}, ${money(p.price)}"></a>
  <div class="product-top">
    <span class="tags"><span class="tag">${p.sub.toUpperCase()}</span>${flag}</span>
    <span class="swatches" aria-label="${p.colors.length} ${p.colors.length === 1 ? "color" : "colores"}">${p.colors
      .map((k) => `<span class="swatch" style="--swatch:${colorOf(k).hex}" title="${colorOf(k).name}"></span>`)
      .join("")}</span>
  </div>
  <div class="product-image">
    <img src="${p.img}" alt="${p.name}, ${p.sub.toLowerCase()} en ${c.name.toLowerCase()}" loading="lazy">
    <button type="button" class="quick-btn" data-quick="${p.id}">Vista rápida</button>
  </div>
  <div class="product-info">
    <span class="product-name">${p.name}</span>
    <span class="price">${priceHTML(p)}</span>
    <button type="button" class="favorite${fav ? " active" : ""}" data-fav="${p.id}" aria-pressed="${fav}" aria-label="Guardar ${p.name} en favoritos"><i data-lucide="heart"></i></button>
  </div>
</article>`;
}

function rail(title, list, { link, linkLabel, id } = {}) {
  if (!list.length) return "";
  const rid = id || "r" + Math.random().toString(36).slice(2, 7);
  return `
<section class="rail-section" aria-labelledby="${rid}-t">
  <div class="section-head">
    <h2 id="${rid}-t">${title}</h2>
    <div class="section-tools">
      ${link ? `<a class="link" href="${link}">${linkLabel}</a>` : ""}
      <button type="button" class="page-arrow" data-rail="${rid}" data-dir="-1" aria-label="Anteriores"><i data-lucide="arrow-left"></i></button>
      <button type="button" class="page-arrow dark" data-rail="${rid}" data-dir="1" aria-label="Siguientes"><i data-lucide="arrow-right"></i></button>
    </div>
  </div>
  <div class="rail" id="${rid}">${list.map(card).join("")}</div>
</section>`;
}

function crumbs(items) {
  return `<nav class="breadcrumb" aria-label="Ruta">${items
    .map(([label, href], i) =>
      i === items.length - 1 ? `<span aria-current="page">${label}</span>` : `<a href="${href}">${label}</a><span aria-hidden="true">›</span>`,
    )
    .join("")}</nav>`;
}

/* ================= ROUTER ================= */
const app = $("#app");
let route = { name: "", parts: [], q: new URLSearchParams(), raw: "" };
const go = (hash) => (location.hash === hash ? render() : (location.hash = hash));

function parse() {
  const raw = location.hash.replace(/^#\/?/, "");
  const [path, query = ""] = raw.split("?");
  const parts = path.split("/").filter(Boolean).map(decodeURIComponent);
  return { name: parts[0] || "inicio", parts, q: new URLSearchParams(query), raw };
}

const VIEWS = {};
function render() {
  const next = parse();
  const sameShop = next.name === "tienda" && route.name === "tienda" && next.parts[1] === route.parts[1] && next.q.get("q") === route.q.get("q");
  if (next.name === "tienda" && !sameShop) resetFilters();
  const changed = next.raw !== route.raw;
  route = next;
  $$("dialog[open]").forEach((d) => d.id !== "drawer" && d.close());
  if (route.name !== "producto") pdp.id = null;
  const view = VIEWS[route.name] || VIEWS.inicio;
  document.body.dataset.view = VIEWS[route.name] ? route.name : "inicio";
  view();
  syncNav();
  icons();
  if (changed && !sameShop) {
    window.scrollTo({ top: 0, behavior: "auto" });
    app.focus({ preventScroll: true });
  }
}
window.addEventListener("hashchange", render);

function syncNav() {
  let key = route.name === "tienda" ? route.parts[1] || "todo" : route.name === "producto" ? byId(route.parts[1])?.cat : "";
  if (route.name === "ayuda" && route.parts[1] === "showroom") key = "showroom";
  $$(".nav a").forEach((a) => {
    const on = a.dataset.nav === key;
    a.classList.toggle("active", on);
    on ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current");
  });
}
function setTitle(t) {
  document.title = t ? `${t} — MUEX` : "MUEX — Sillas, sillones y sofás · Barranco";
}

/* ================= VIEW: INICIO ================= */
VIEWS.inicio = () => {
  setTitle("");
  const best = products.filter((p) => p.best);
  const fresh = products.filter((p) => p.isNew || p.was).sort((a, b) => b.isNew - a.isNew);
  const from = (cat) => Math.min(...products.filter((p) => p.cat === cat).map((p) => p.price));
  const count = (cat) => products.filter((p) => p.cat === cat).length;
  const viewed = store.viewed.map(byId);

  app.innerHTML = `
<section class="hero">
  <div class="hero-text">
    <h1>Asientos para quedarse.</h1>
    <div class="hero-side">
      <p>Sillas, sillones y sofás hechos en Lima, con telas que aguantan niños, gatos y domingos largos.</p>
      <div class="hero-ctas">
        <a class="btn-dark" href="#/tienda/sofas">Ver sofás</a>
        <a class="btn-line" href="#/ayuda/showroom">Visitar el showroom</a>
      </div>
    </div>
  </div>
  <figure class="hero-media">
    <img src="img/room-hero.webp" alt="Sala luminosa con sofá de tela clara frente a un ventanal" fetchpriority="high">
    <a class="hero-note" href="#/tienda/sofas">
      <span><small>Sofás a pedido</small><b>Desde ${money(from("sofas"))}</b></span>
      <i data-lucide="arrow-up-right"></i>
    </a>
  </figure>
  <ul class="facts">
    <li><b>Envío gratis</b><span>en Lima desde ${money(FREE_FROM)}</span></li>
    <li><b>5 años</b><span>de garantía en estructuras</span></li>
    <li><b>30 días</b><span>para cambiar o devolver</span></li>
    <li><b>Hecho en Lima</b><span>talleres en VES y Lurín</span></li>
  </ul>
</section>

<section class="cats" aria-labelledby="cats-t">
  <div class="section-head"><h2 id="cats-t">Compra por categoría</h2><a class="link" href="#/tienda/todo">Ver toda la tienda</a></div>
  <div class="cat-grid">
    ${[
      ["sillas", "img/show-pedestals.webp", "Tres sillas de madera sobre pedestales blancos"],
      ["sillones", "img/amb-reading.webp", "Sillón de lectura con cojín junto a una pared clara"],
      ["sofas", "img/room-white.webp", "Sala blanca con sofá modular y sillón de madera"],
    ]
      .map(
        ([c, img, alt]) => `
    <a class="cat-tile" href="#/tienda/${c}">
      <img src="${img}" alt="${alt}" loading="lazy">
      <span class="cat-label"><b>${CATS[c].title}</b><small>${count(c)} modelos · desde ${money(from(c))}</small></span>
      <span class="cat-arrow" aria-hidden="true"><i data-lucide="arrow-right"></i></span>
    </a>`,
      )
      .join("")}
  </div>
</section>

${rail("Los más vendidos", best, { link: "#/tienda/todo", linkLabel: "Ver todo", id: "best" })}

<section class="editorial">
  <img src="img/room-dark.webp" alt="Sala con sofá modular de tela gris texturizada y mesa baja de madera" loading="lazy">
  <div class="editorial-text">
    <h2>Telas que aguantan.</h2>
    <p>Probamos cada tela a 50,000 ciclos de roce antes de ofrecerla. Las fundas de LOMA y ORB se retiran y se lavan en seco; los cueros de BRASA vienen de una curtiembre al vegetal en Arequipa.</p>
    <ul>
      <li><b>11 colores</b> en tela, bouclé y cuero</li>
      <li><b>Muestras gratis</b> — te enviamos hasta 4 a casa</li>
      <li><b>Funda de repuesto</b> disponible por 5 años</li>
    </ul>
    <a class="link" href="#/ayuda/cuidados">Cómo cuidar cada material</a>
  </div>
</section>

${rail("Nuevos y en oferta", fresh, { link: "#/tienda/ofertas", linkLabel: "Ver ofertas", id: "fresh" })}

<section class="showroom-band">
  <div>
    <h2>Pruébalos antes de decidir.</h2>
    <p>Todos los modelos están en el showroom de Barranco. Siéntate, toca las telas y mide con nosotros.</p>
    <dl>
      <div><dt>Dirección</dt><dd>Av. San Martín 214, Barranco</dd></div>
      <div><dt>Horario</dt><dd>Mar–Sáb 11:00–20:00 · Dom 11:00–17:00</dd></div>
    </dl>
    <a class="btn-dark" href="#/ayuda/showroom">Agendar una visita</a>
  </div>
  <img src="img/show-chairs.webp" alt="Sillas exhibidas en el showroom" loading="lazy">
</section>

${rail("Vistos recientemente", viewed, { id: "viewed" })}`;
};

/* ================= VIEW: TIENDA ================= */
const filters = { sub: new Set(), material: new Set(), color: new Set(), price: "any", sort: "featured", ready: false, page: 1 };
function resetFilters() {
  filters.sub.clear();
  filters.material.clear();
  filters.color.clear();
  filters.price = "any";
  filters.sort = "featured";
  filters.ready = false;
  filters.page = 1;
}
const PRICES = {
  any: ["Cualquier precio", () => true],
  a: ["Hasta S/ 800", (p) => p < 800],
  b: ["S/ 800 – 2,000", (p) => p >= 800 && p <= 2000],
  c: ["S/ 2,000 – 4,000", (p) => p > 2000 && p <= 4000],
  d: ["Más de S/ 4,000", (p) => p > 4000],
};
const SORTS = {
  featured: ["Destacados", (a, b) => b.best - a.best],
  new: ["Novedades", (a, b) => b.isNew - a.isNew],
  asc: ["Precio: menor a mayor", (a, b) => a.price - b.price],
  desc: ["Precio: mayor a menor", (a, b) => b.price - a.price],
  rating: ["Mejor valorados", (a, b) => rating(b).avg - rating(a).avg],
};

function inCat(cat) {
  if (cat === "ofertas") return products.filter((p) => p.was);
  if (cat === "todo" || !CATS[cat]) return products;
  return products.filter((p) => p.cat === cat);
}
function matchQuery(p, q) {
  if (!q) return true;
  const hay = norm([p.name, p.sub, p.material, CATS[p.cat].title, p.desc, ...p.colors.map((k) => colorOf(k).name)].join(" "));
  return norm(q)
    .split(/\s+/)
    .every((w) => hay.includes(w.replace(/s$/, "")));
}

VIEWS.tienda = () => {
  const cat = CATS[route.parts[1]] ? route.parts[1] : "todo";
  const q = route.q.get("q") || "";
  const base = inCat(cat).filter((p) => matchQuery(p, q));
  const subs = [...new Set(base.map((p) => p.sub))];
  const mats = [...new Set(base.map((p) => p.material))];
  const cols = [...new Set(base.flatMap((p) => p.colors))];
  const title = q ? `“${esc(q)}”` : CATS[cat].title;
  setTitle(q ? `Búsqueda: ${q}` : CATS[cat].title);

  const opt = (group, value, label, extra = "") =>
    `<label class="opt"><input type="checkbox" name="${group}" value="${esc(value)}" ${filters[group].has(value) ? "checked" : ""}>${extra}<span>${label}</span></label>`;
  const radio = (group, value, label) =>
    `<label class="opt"><input type="radio" name="${group}" value="${value}" ${filters[group] === value ? "checked" : ""}><span>${label}</span></label>`;
  const drop = (key, label, body, right = false) => `
    <div class="filter-wrap" data-filter="${key}">
      <button type="button" class="filter" aria-expanded="false"><span>${label}</span> <i data-lucide="chevron-down"></i></button>
      <div class="dropdown${right ? " dropdown-right" : ""}" role="group" aria-label="${label}">${body}</div>
    </div>`;

  app.innerHTML = `
${crumbs([["Inicio", "#/"], ...(q ? [["Búsqueda", ""]] : [[CATS[cat].title, ""]])])}
<section class="catalog-head">
  <h1>${title}</h1>
  <p class="catalog-intro">${q ? `Resultados en ${cat === "todo" ? "toda la tienda" : CATS[cat].title.toLowerCase()}.` : CATS[cat].intro}</p>
  <div class="filters" id="filters">
    ${subs.length > 1 ? drop("sub", "Tipo", subs.map((s) => opt("sub", s, s)).join("")) : ""}
    ${drop("material", "Material", mats.map((m) => opt("material", m, m)).join(""))}
    ${drop("color", "Color", cols.map((k) => opt("color", k, colorOf(k).name, `<i class="dot" style="--swatch:${colorOf(k).hex}"></i>`)).join(""))}
    ${drop("price", "Precio", Object.entries(PRICES).map(([v, [l]]) => radio("price", v, l)).join(""))}
    <button type="button" class="filter toggle" id="readyToggle" aria-pressed="${filters.ready}">Entrega inmediata</button>
    ${drop("sort", "Ordenar", Object.entries(SORTS).map(([v, [l]]) => radio("sort", v, l)).join(""), true)}
  </div>
  <div class="result-bar">
    <p id="resultCount" aria-live="polite"></p>
    <div class="chips" id="chips"></div>
  </div>
</section>
<section class="products" id="productGrid" aria-label="Productos"></section>
<nav class="pagination" id="pagination" aria-label="Páginas"></nav>`;

  renderGrid(base, cat, q);
};

function renderGrid(base, cat, q) {
  base = base || inCat(cat).filter((p) => matchQuery(p, q));
  const list = base
    .filter(
      (p) =>
        (!filters.sub.size || filters.sub.has(p.sub)) &&
        (!filters.material.size || filters.material.has(p.material)) &&
        (!filters.color.size || p.colors.some((c) => filters.color.has(c))) &&
        PRICES[filters.price][1](p.price) &&
        (!filters.ready || p.stock > 0),
    )
    .sort(SORTS[filters.sort][1]);
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  filters.page = Math.min(filters.page, pages);
  const slice = list.slice((filters.page - 1) * PER_PAGE, filters.page * PER_PAGE);

  $("#resultCount").textContent = `${list.length} ${list.length === 1 ? "modelo" : "modelos"}`;
  $("#productGrid").innerHTML = list.length
    ? slice.map(card).join("")
    : `<div class="empty"><h2>${base.length ? "Nada coincide con esos filtros." : "No encontramos eso."}</h2>
       <p>${base.length ? "Quita alguno o empieza de nuevo." : "Prueba con otra palabra, como “roble”, “cuero” o “3 cuerpos”."}</p>
       ${base.length ? `<button type="button" class="btn-dark" data-clear>Quitar filtros</button>` : `<a class="btn-dark" href="#/tienda/todo">Ver toda la tienda</a>`}</div>`;

  // chips
  const chips = [];
  ["sub", "material"].forEach((k) => filters[k].forEach((v) => chips.push([k, v, v])));
  filters.color.forEach((v) => chips.push(["color", v, colorOf(v).name]));
  if (filters.price !== "any") chips.push(["price", filters.price, PRICES[filters.price][0]]);
  if (filters.ready) chips.push(["ready", "1", "Entrega inmediata"]);
  $("#chips").innerHTML = chips.length
    ? chips.map(([k, v, l]) => `<button type="button" class="chip" data-chip="${k}" data-value="${esc(v)}" aria-label="Quitar ${esc(l)}">${esc(l)}<i data-lucide="x"></i></button>`).join("") +
      `<button type="button" class="chip-clear" data-clear>Quitar todo</button>`
    : "";

  // labels
  $$(".filter-wrap").forEach((w) => {
    const k = w.dataset.filter;
    const base = { sub: "Tipo", material: "Material", color: "Color", price: "Precio", sort: "Ordenar" }[k];
    const v = filters[k];
    let label = base;
    let on = false;
    if (v instanceof Set && v.size) (label = `${base} · ${v.size}`), (on = true);
    else if (k === "price" && v !== "any") (label = PRICES[v][0]), (on = true);
    else if (k === "sort" && v !== "featured") (label = SORTS[v][0]), (on = true);
    $(".filter span", w).textContent = label;
    $(".filter", w).classList.toggle("is-set", on);
  });
  const rt = $("#readyToggle");
  if (rt) {
    rt.setAttribute("aria-pressed", String(filters.ready));
    rt.classList.toggle("is-set", filters.ready);
  }

  // pagination
  const nav = $("#pagination");
  if (pages <= 1) nav.innerHTML = "";
  else {
    const nums = Array.from({ length: pages }, (_, i) => i + 1);
    const half = Math.ceil(pages / 2);
    const num = (n) => `<button type="button" class="page-number${n === filters.page ? " current" : ""}" data-page="${n}" ${n === filters.page ? 'aria-current="page"' : ""} aria-label="Página ${n}">${n}</button>`;
    nav.innerHTML = `${nums.slice(0, half).map(num).join("")}
      <button type="button" class="page-arrow" data-page="${filters.page - 1}" aria-label="Página anterior" ${filters.page === 1 ? "disabled" : ""}><i data-lucide="arrow-left"></i></button>
      <button type="button" class="page-arrow dark" data-page="${filters.page + 1}" aria-label="Página siguiente" ${filters.page === pages ? "disabled" : ""}><i data-lucide="arrow-right"></i></button>
      ${nums.slice(half).map(num).join("")}`;
  }
  icons();
}
const regrid = () => {
  const cat = CATS[route.parts[1]] ? route.parts[1] : "todo";
  renderGrid(null, cat, route.q.get("q") || "");
};

function closeDropdowns(except) {
  $$(".filter-wrap.open").forEach((w) => {
    if (w === except) return;
    w.classList.remove("open");
    $(".filter", w).setAttribute("aria-expanded", "false");
  });
}
app.addEventListener("change", (e) => {
  const { name, value, checked, type } = e.target;
  if (!e.target.closest("#filters")) return;
  if (type === "checkbox") checked ? filters[name].add(value) : filters[name].delete(value);
  else filters[name] = value;
  filters.page = 1;
  regrid();
  if (type === "radio") closeDropdowns();
});

/* ================= VIEW: PRODUCTO ================= */
let pdp = { id: null, color: null, qty: 1 };
VIEWS.producto = () => {
  const p = byId(route.parts[1]);
  if (!p) return VIEWS.notfound();
  setTitle(p.name);
  markViewed(p.id);
  if (pdp.id !== p.id) pdp = { id: p.id, color: p.colors[0], qty: 1 };
  const r = rating(p);
  const gallery = [p.img, AMBIENT[p.img]].filter(Boolean);
  const [w, d, h, seat] = p.dims;
  const related = products.filter((x) => x.id !== p.id && (x.cat !== p.cat || x.material === p.material)).sort((a, b) => b.best - a.best).slice(0, 8);
  const viewed = store.viewed.filter((id) => id !== p.id).map(byId);
  const fav = store.fav.has(p.id);

  app.innerHTML = `
${crumbs([["Inicio", "#/"], [CATS[p.cat].title, `#/tienda/${p.cat}`], [p.name, ""]])}
<section class="pdp">
  <div class="gallery">
    <div class="gallery-main" id="galleryMain" style="--tint:${colorOf(pdp.color).hex}">
      <img id="pdpImg" src="${gallery[0]}" alt="${p.name} en ${colorOf(pdp.color).name.toLowerCase()}">
      ${p.was ? `<span class="tag tag-dark">-${pct(p)}%</span>` : p.isNew ? `<span class="tag tag-dark">Nuevo</span>` : ""}
    </div>
    ${
      gallery.length > 1
        ? `<div class="thumbs" role="group" aria-label="Fotos">${gallery
            .map((src, i) => `<button type="button" class="thumb${i === 0 ? " active" : ""}" data-thumb="${i}" aria-label="Foto ${i + 1}" aria-pressed="${i === 0}"><img src="${src}" alt=""></button>`)
            .join("")}</div>`
        : ""
    }
  </div>

  <div class="buy">
    <p class="buy-meta">${p.sub} · ${p.material}</p>
    <h1>${p.name}</h1>
    <a class="rating" href="#reviews" data-scrollto="reviews">${stars(r.avg)}<span>${r.avg} · ${r.count} reseñas</span></a>
    <p class="buy-price">${priceHTML(p)}${p.was ? `<span class="save">Ahorras ${money(p.was - p.price)}</span>` : ""}</p>
    <p class="buy-desc">${p.desc}</p>

    <fieldset class="colors">
      <legend>Color — <span id="pdpColorName">${colorOf(pdp.color).name}</span></legend>
      <div id="pdpColors">${p.colors
        .map((k) => `<label class="color-opt"><input type="radio" name="pdpColor" value="${k}" ${k === pdp.color ? "checked" : ""}><span style="--swatch:${colorOf(k).hex}"></span><em class="sr">${colorOf(k).name}</em></label>`)
        .join("")}</div>
    </fieldset>

    <p class="stock ${p.stock === 0 ? "made" : p.stock <= 2 ? "low" : ""}"><i data-lucide="${p.stock === 0 ? "hammer" : "package-check"}"></i>${leadText(p)}</p>

    <div class="buy-row">
      <div class="qty">
        <button type="button" data-pdpqty="-1" aria-label="Menos" disabled><i data-lucide="minus"></i></button>
        <output id="pdpQty" aria-label="Cantidad">1</output>
        <button type="button" data-pdpqty="1" aria-label="Más"><i data-lucide="plus"></i></button>
      </div>
      <button type="button" class="btn-dark" id="pdpAdd">Agregar a la bolsa · ${money(p.price)}</button>
      <button type="button" class="favorite big${fav ? " active" : ""}" data-fav="${p.id}" aria-pressed="${fav}" aria-label="Guardar en favoritos"><i data-lucide="heart"></i></button>
    </div>

    <div class="buy-tools">
      <button type="button" class="tool" data-fit="${p.id}"><i data-lucide="ruler"></i>¿Entra en tu espacio?</button>
      <label class="tool ship-est"><i data-lucide="truck"></i>
        <select id="shipEst" aria-label="Calcular envío a tu distrito">
          <option value="">Calcular envío a…</option>
          ${DISTRICTS.map((x) => `<option ${x === store.district ? "selected" : ""}>${x}</option>`).join("")}
        </select>
      </label>
    </div>
    <p class="ship-out muted" id="shipOut" aria-live="polite"></p>

    <div class="accordion">
      <details open>
        <summary>Medidas<i data-lucide="plus"></i></summary>
        <dl class="specs">
          <div><dt>Ancho</dt><dd>${w} cm</dd></div>
          <div><dt>Profundidad</dt><dd>${d} cm</dd></div>
          <div><dt>Alto</dt><dd>${h} cm</dd></div>
          <div><dt>Alto de asiento</dt><dd>${seat} cm</dd></div>
          <div><dt>Pasa por puertas desde</dt><dd>${Math.min(d, h) + 2} cm</dd></div>
        </dl>
      </details>
      <details>
        <summary>Materiales y cuidado<i data-lucide="plus"></i></summary>
        <div><p>${p.material === "Tela" ? "Tejido de poliéster y lino con 50,000 ciclos Martindale." : p.material === "Cuero" ? "Cuero de 1.2 mm curtido al vegetal." : p.material === "Roble" ? "Roble macizo con acabado de aceite natural." : p.material === "Ratán" ? "Ratán natural tejido a mano sobre acero con pintura en polvo." : "Acero cromado y polipropileno reciclable."} Estructura interna de pino tornillo secado en horno.</p><p>${MATERIAL_CARE[p.material]}</p></div>
      </details>
      <details>
        <summary>Envío y armado<i data-lucide="plus"></i></summary>
        <div><p>Delivery a Lima Metropolitana de lunes a sábado. Envío gratis desde ${money(FREE_FROM)} en distritos de zona 1. Lo subimos, lo armamos y nos llevamos el embalaje.</p><p>También puedes recogerlo gratis en el showroom de Barranco. <a class="link" href="#/ayuda/envios">Ver zonas y tarifas</a></p></div>
      </details>
      <details>
        <summary>Garantía y devoluciones<i data-lucide="plus"></i></summary>
        <div><p>5 años en estructura y 1 año en tapiz y espumas. Tienes 30 días para devolverlo si no te convence; lo recogemos en tu casa. <a class="link" href="#/ayuda/cambios">Cómo funciona</a></p></div>
      </details>
    </div>
  </div>
</section>

${
  IN_ROOM.has(p.img)
    ? `<section class="in-home"><img src="${AMBIENT[p.img]}" alt="${p.name} en un ambiente real" loading="lazy"><p>${p.name} en casa. Pide hasta 4 muestras de tela gratis antes de decidir.</p></section>`
    : ""
}

<section class="reviews" id="reviews" aria-labelledby="rev-t">
  <div class="reviews-head">
    <div>
      <h2 id="rev-t">Reseñas</h2>
      <p class="rev-score">${stars(r.avg)}<b>${r.avg}</b><span class="muted">de 5 · ${r.count} reseñas</span></p>
    </div>
    <button type="button" class="btn-line" id="revToggle" aria-expanded="false" aria-controls="revForm">Escribir una reseña</button>
  </div>
  <form class="rev-form" id="revForm" hidden novalidate>
    <fieldset class="rev-stars"><legend>Tu valoración</legend>
      ${[5, 4, 3, 2, 1].map((n) => `<label><input type="radio" name="revStars" value="${n}" ${n === 5 ? "checked" : ""}><span>${n} ★</span></label>`).join("")}
    </fieldset>
    <div class="field-row">
      <label class="field"><span>Nombre</span><input name="revName" maxlength="40" autocomplete="given-name"></label>
      <label class="field"><span>Distrito</span><input name="revDistrict" maxlength="30"></label>
    </div>
    <label class="field"><span>Tu reseña</span><textarea name="revText" rows="3" maxlength="400"></textarea></label>
    <p class="form-error" id="revErr" aria-live="polite"></p>
    <button type="submit" class="btn-dark">Publicar reseña</button>
  </form>
  <ul class="rev-list">
    ${r.list
      .slice(0, 5)
      .map(
        ([n, dist, s, t]) => `<li>${stars(s)}<p>${esc(t)}</p><span class="muted">${esc(n)} · ${esc(dist)}</span></li>`,
      )
      .join("")}
  </ul>
</section>

${rail("Combina con", related, { id: "related" })}
${rail("Vistos recientemente", viewed, { id: "viewed" })}`;

  updateShipEst(p);
  syncPdp();
};

function syncPdp() {
  const p = byId(route.parts[1]);
  $("#pdpColorName").textContent = colorOf(pdp.color).name;
  $("#galleryMain").style.setProperty("--tint", colorOf(pdp.color).hex);
  $("#pdpImg").alt = `${p.name} en ${colorOf(pdp.color).name.toLowerCase()}`;
  $("#pdpQty").textContent = pdp.qty;
  $('[data-pdpqty="-1"]').disabled = pdp.qty <= 1;
  $('[data-pdpqty="1"]').disabled = pdp.qty >= 9;
  $("#pdpAdd").textContent = `Agregar a la bolsa · ${money(p.price * pdp.qty)}`;
}
function updateShipEst(p) {
  const out = $("#shipOut");
  const dist = $("#shipEst")?.value;
  if (!out) return;
  if (!dist) {
    out.textContent = "";
    return;
  }
  const z = zoneOf(dist);
  const cost = z === 1 ? (p.price >= FREE_FROM ? 0 : 90) : p.price >= FREE_FROM ? 60 : 150;
  const days = p.stock === 0 ? 28 : z === 1 ? 2 : 4;
  let when = addDays(new Date(), days);
  if (when.getDay() === 0) when = addDays(when, 1);
  out.textContent = `${dist}: ${cost ? money(cost) : "envío gratis"} · llega desde el ${fmtDate(when)}.`;
}

/* ================= VIEW: BOLSA ================= */
VIEWS.bolsa = () => {
  setTitle("Bolsa");
  if (!store.cart.length) {
    app.innerHTML = `${crumbs([["Inicio", "#/"], ["Bolsa", ""]])}
    <section class="page-block"><h1 class="page-title">Tu bolsa está vacía.</h1>
    <p class="muted">Guarda lo que te guste y vuelve cuando quieras: tu bolsa se queda en este navegador.</p>
    <div class="actions"><a class="btn-dark" href="#/tienda/todo">Ver la tienda</a>${store.fav.size ? `<a class="btn-line" href="#/favoritos">Ir a favoritos (${store.fav.size})</a>` : ""}</div></section>
    ${rail("Los más vendidos", products.filter((p) => p.best), { id: "best" })}`;
    return;
  }
  const t = totals();
  app.innerHTML = `${crumbs([["Inicio", "#/"], ["Bolsa", ""]])}
<section class="page-block">
  <h1 class="page-title">Bolsa <span class="muted">(${cartCount()})</span></h1>
  <div class="bag-layout">
    <div class="bag-lines">${store.cart.map((l, i) => lineHTML(l, i, true)).join("")}</div>
    <aside class="summary" aria-label="Resumen">
      ${couponHTML()}
      <label class="field"><span>Distrito de entrega</span>
        <select id="bagDistrict"><option value="">Elige para calcular</option>${DISTRICTS.map((x) => `<option ${x === store.district ? "selected" : ""}>${x}</option>`).join("")}</select>
      </label>
      ${totalsHTML(t)}
      ${freeHint(t)}
      <a class="btn-dark wide" href="#/checkout">Ir a pagar</a>
      <p class="pay-note muted"><i data-lucide="lock"></i>Visa, Mastercard, Amex, Yape y transferencia</p>
    </aside>
  </div>
</section>`;
};

function lineHTML(l, i, full = false) {
  const p = byId(l.id);
  return `
<div class="line">
  <a class="line-img" href="#/producto/${p.id}" tabindex="-1" aria-hidden="true"><img src="${p.img}" alt=""></a>
  <div class="line-info">
    <a href="#/producto/${p.id}"><strong>${p.name}</strong></a>
    <span><i class="dot" style="--swatch:${colorOf(l.color).hex}"></i>${colorOf(l.color).name} · ${p.sub}</span>
    ${full ? `<span class="muted small">${leadText(p)}</span>` : ""}
    <div class="qty small">
      <button type="button" data-qty="${i}" data-step="-1" aria-label="Menos ${p.name}"><i data-lucide="minus"></i></button>
      <output>${l.qty}</output>
      <button type="button" data-qty="${i}" data-step="1" aria-label="Más ${p.name}" ${l.qty >= 9 ? "disabled" : ""}><i data-lucide="plus"></i></button>
    </div>
  </div>
  <div class="line-side">
    <span>${money(p.price * l.qty)}</span>
    <span class="line-links">
      ${full ? `<button type="button" class="link muted" data-later="${i}">Guardar</button>` : ""}
      <button type="button" class="link muted" data-remove="${i}">Quitar</button>
    </span>
  </div>
</div>`;
}
function couponHTML() {
  const c = COUPONS[store.coupon];
  return c
    ? `<div class="coupon-on"><span><b>${store.coupon}</b> · ${c.label}</span><button type="button" class="link muted" data-uncoupon>Quitar</button></div>`
    : `<form class="coupon" data-coupon novalidate><label class="sr" for="couponIn">Código de descuento</label><input id="couponIn" placeholder="Código de descuento" autocomplete="off"><button type="submit" class="btn-line">Aplicar</button><p class="form-error" aria-live="polite"></p></form>`;
}
function totalsHTML(t) {
  return `<dl class="totals">
    <div><dt>Subtotal</dt><dd>${money(t.sub)}</dd></div>
    ${t.discount ? `<div class="disc"><dt>Descuento</dt><dd>− ${money(t.discount)}</dd></div>` : ""}
    <div><dt>Envío</dt><dd>${t.shipping === null ? "Elige distrito" : t.shipping === 0 ? "Gratis" : money(t.shipping)}</dd></div>
    <div class="grand"><dt>Total</dt><dd>${money(t.total)}</dd></div>
  </dl>`;
}
function freeHint(t) {
  const base = t.sub - t.discount;
  if (base >= FREE_FROM) return `<p class="muted note">Tienes envío gratis en zona 1.</p>`;
  return `<p class="muted note">Te faltan ${money(FREE_FROM - base)} para el envío gratis en zona 1.</p>`;
}

/* ================= VIEW: CHECKOUT ================= */
const co = { method: "delivery", pay: "card", slot: null, invoice: false };
VIEWS.checkout = () => {
  setTitle("Pagar");
  if (!store.cart.length) {
    app.innerHTML = `${crumbs([["Inicio", "#/"], ["Pagar", ""]])}<section class="page-block"><h1 class="page-title">No hay nada que pagar todavía.</h1><div class="actions"><a class="btn-dark" href="#/tienda/todo">Ver la tienda</a></div></section>`;
    return;
  }
  app.innerHTML = `${crumbs([["Inicio", "#/"], ["Bolsa", "#/bolsa"], ["Pagar", ""]])}
<section class="page-block">
  <h1 class="page-title">Pagar</h1>
  <form class="checkout" id="checkout" novalidate>
    <div class="co-main">
      <p class="form-error big" id="coErr" tabindex="-1" aria-live="assertive"></p>

      <fieldset class="co-step">
        <legend><span>1</span>Contacto</legend>
        <label class="field"><span>Correo</span><input name="email" type="email" autocomplete="email" required><small class="err"></small></label>
        <div class="field-row">
          <label class="field"><span>Nombre y apellido</span><input name="name" autocomplete="name" required><small class="err"></small></label>
          <label class="field"><span>Celular</span><input name="phone" inputmode="tel" autocomplete="tel" placeholder="9XX XXX XXX" required><small class="err"></small></label>
        </div>
        <div class="field-row">
          <label class="field"><span>DNI o CE</span><input name="doc" inputmode="numeric" maxlength="12" required><small class="err"></small></label>
          <label class="check"><input type="checkbox" name="invoice" ${co.invoice ? "checked" : ""}><span>Necesito factura</span></label>
        </div>
        <div class="field-row" id="invoiceRow" ${co.invoice ? "" : "hidden"}>
          <label class="field"><span>RUC</span><input name="ruc" inputmode="numeric" maxlength="11"><small class="err"></small></label>
          <label class="field"><span>Razón social</span><input name="company"><small class="err"></small></label>
        </div>
      </fieldset>

      <fieldset class="co-step">
        <legend><span>2</span>Entrega</legend>
        <div class="choice-row" role="radiogroup" aria-label="Método de entrega">
          <label class="choice"><input type="radio" name="method" value="delivery" ${co.method === "delivery" ? "checked" : ""}><span><b>Delivery en Lima</b><small>Lo subimos y lo armamos</small></span></label>
          <label class="choice"><input type="radio" name="method" value="pickup" ${co.method === "pickup" ? "checked" : ""}><span><b>Recojo en showroom</b><small>Av. San Martín 214, Barranco · gratis</small></span></label>
        </div>
        <div id="deliveryFields" ${co.method === "pickup" ? "hidden" : ""}>
          <div class="field-row">
            <label class="field"><span>Distrito</span><select name="district"><option value="">Elige tu distrito</option>${DISTRICTS.map((x) => `<option ${x === store.district ? "selected" : ""}>${x}</option>`).join("")}</select><small class="err"></small></label>
            <label class="field"><span>Dirección</span><input name="address" autocomplete="street-address" placeholder="Calle, número, dpto."><small class="err"></small></label>
          </div>
          <label class="field"><span>Referencia <em class="muted">(opcional)</em></span><input name="ref" placeholder="Piso, ascensor, ancho de puerta…"></label>
        </div>
        <div class="slots-wrap">
          <p class="field-label" id="slotLabel">${co.method === "pickup" ? "Día de recojo" : "Día de entrega"}</p>
          <div class="slots" id="slots" role="radiogroup" aria-labelledby="slotLabel"></div>
          <small class="err" id="slotErr"></small>
        </div>
      </fieldset>

      <fieldset class="co-step">
        <legend><span>3</span>Pago</legend>
        <div class="choice-row three" role="radiogroup" aria-label="Método de pago">
          <label class="choice"><input type="radio" name="pay" value="card" ${co.pay === "card" ? "checked" : ""}><span><b>Tarjeta</b><small>Hasta 12 cuotas</small></span></label>
          <label class="choice"><input type="radio" name="pay" value="yape" ${co.pay === "yape" ? "checked" : ""}><span><b>Yape / Plin</b><small>Al instante</small></span></label>
          <label class="choice"><input type="radio" name="pay" value="transfer" ${co.pay === "transfer" ? "checked" : ""}><span><b>Transferencia</b><small>BCP o Interbank</small></span></label>
        </div>
        <div class="pay-panel" data-panel="card" ${co.pay === "card" ? "" : "hidden"}>
          <label class="field"><span>Número de tarjeta</span><input name="card" inputmode="numeric" autocomplete="cc-number" placeholder="1234 5678 9012 3456" maxlength="23"><small class="err"></small></label>
          <div class="field-row three">
            <label class="field"><span>Vence</span><input name="exp" inputmode="numeric" autocomplete="cc-exp" placeholder="MM/AA" maxlength="5"><small class="err"></small></label>
            <label class="field"><span>CVV</span><input name="cvv" inputmode="numeric" autocomplete="cc-csc" maxlength="4"><small class="err"></small></label>
            <label class="field"><span>Cuotas</span><select name="installments">${[1, 3, 6, 12].map((n) => `<option value="${n}">${n === 1 ? "Sin cuotas" : `${n} cuotas`}</option>`).join("")}</select></label>
          </div>
        </div>
        <div class="pay-panel" data-panel="yape" ${co.pay === "yape" ? "" : "hidden"}>
          <p class="muted">Abre Yape, ve a “Código de aprobación” y escríbelo aquí. No compartas tu clave.</p>
          <div class="field-row">
            <label class="field"><span>Celular Yape</span><input name="yapePhone" inputmode="tel" placeholder="9XX XXX XXX"><small class="err"></small></label>
            <label class="field"><span>Código de aprobación</span><input name="yapeCode" inputmode="numeric" maxlength="6" placeholder="6 dígitos"><small class="err"></small></label>
          </div>
        </div>
        <div class="pay-panel" data-panel="transfer" ${co.pay === "transfer" ? "" : "hidden"}>
          <dl class="specs">
            <div><dt>BCP soles</dt><dd>193-2284716-0-51</dd></div>
            <div><dt>CCI</dt><dd>002-193-002284716051-15</dd></div>
            <div><dt>Titular</dt><dd>MUEX S.A.C.</dd></div>
          </dl>
          <p class="muted">Reservamos tu pedido 48 horas. Envía la constancia a pagos@muex.pe con tu número de pedido.</p>
        </div>
        <label class="check terms"><input type="checkbox" name="terms"><span>Acepto los <a class="link" href="#/ayuda/terminos" target="_blank">términos</a> y la <a class="link" href="#/ayuda/privacidad" target="_blank">política de privacidad</a>.</span></label>
        <small class="err" id="termsErr"></small>
      </fieldset>
    </div>

    <aside class="summary co-summary" aria-label="Resumen del pedido">
      <h2>Tu pedido</h2>
      <ul class="mini-lines">${store.cart
        .map((l) => {
          const p = byId(l.id);
          return `<li><span class="line-img"><img src="${p.img}" alt=""><b>${l.qty}</b></span><span><strong>${p.name}</strong><small>${colorOf(l.color).name}</small></span><span>${money(p.price * l.qty)}</span></li>`;
        })
        .join("")}</ul>
      <a class="link muted" href="#/bolsa">Editar bolsa</a>
      <div id="coCoupon">${couponHTML()}</div>
      <div id="coTotals"></div>
      <button type="submit" class="btn-dark wide" id="payBtn">Pagar</button>
      <p class="pay-note muted"><i data-lucide="lock"></i>Pago cifrado. No guardamos tu tarjeta.</p>
    </aside>
  </form>
</section>`;
  renderSlots();
  refreshCheckout();
};

function leadDays() {
  return store.cart.some((l) => byId(l.id).stock === 0) ? 28 : co.method === "pickup" ? 1 : 2;
}
function renderSlots() {
  const wrap = $("#slots");
  if (!wrap) return;
  const out = [];
  let d = addDays(new Date(), leadDays());
  while (out.length < 6) {
    if (d.getDay() !== 0) out.push(new Date(d));
    d = addDays(d, 1);
  }
  const keys = out.map((x) => x.toISOString().slice(0, 10));
  if (!keys.includes(co.slot)) co.slot = null;
  wrap.innerHTML =
    out
      .map((x, i) => `<label class="slot"><input type="radio" name="slot" value="${keys[i]}" ${co.slot === keys[i] ? "checked" : ""}><span><small>${DAYS[x.getDay()]}</small><b>${x.getDate()}</b><small>${MONTHS[x.getMonth()]}</small></span></label>`)
      .join("") + (leadDays() === 28 ? `<p class="muted small slot-note">Tu pedido incluye piezas a pedido: se entrega completo desde esta fecha.</p>` : "");
}
function refreshCheckout() {
  const form = $("#checkout");
  if (!form) return;
  const t = totals(form.district?.value || "", co.method === "pickup");
  $("#coTotals").innerHTML = totalsHTML(t) + (co.method === "delivery" ? freeHint(t) : "");
  $("#payBtn").textContent = co.pay === "transfer" ? `Reservar pedido · ${money(t.total)}` : `Pagar ${money(t.total)}`;
}

const digits = (s) => s.replace(/\D/g, "");
function luhn(num) {
  let sum = 0;
  let dbl = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let n = +num[i];
    if (dbl && (n *= 2) > 9) n -= 9;
    sum += n;
    dbl = !dbl;
  }
  return sum % 10 === 0;
}
function validateCheckout(form) {
  const errs = [];
  const set = (name, msg) => {
    const input = form[name];
    const small = input?.closest(".field")?.querySelector(".err");
    if (input) input.setAttribute("aria-invalid", String(!!msg));
    if (small) small.textContent = msg || "";
    if (msg) errs.push(input);
  };
  const v = (n) => (form[n]?.value || "").trim();

  set("email", /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v("email")) ? "" : "Escribe un correo válido.");
  set("name", v("name").split(/\s+/).length >= 2 ? "" : "Escribe nombre y apellido.");
  set("phone", /^9\d{8}$/.test(digits(v("phone"))) ? "" : "Celular de 9 dígitos que empiece con 9.");
  set("doc", /^\d{8,12}$/.test(digits(v("doc"))) ? "" : "DNI de 8 dígitos o CE de hasta 12.");
  if (co.invoice) {
    set("ruc", /^(10|20)\d{9}$/.test(digits(v("ruc"))) ? "" : "RUC de 11 dígitos (empieza con 10 o 20).");
    set("company", v("company") ? "" : "Escribe la razón social.");
  } else {
    set("ruc", "");
    set("company", "");
  }
  if (co.method === "delivery") {
    set("district", v("district") ? "" : "Elige tu distrito.");
    set("address", v("address").length >= 6 ? "" : "Escribe la dirección completa.");
  } else {
    set("district", "");
    set("address", "");
  }
  $("#slotErr").textContent = co.slot ? "" : "Elige un día.";
  if (!co.slot) errs.push($("#slots input"));

  if (co.pay === "card") {
    const num = digits(v("card"));
    set("card", num.length >= 15 && num.length <= 19 && luhn(num) ? "" : "Revisa el número de la tarjeta.");
    const [mm, yy] = v("exp").split("/").map(Number);
    const now = new Date();
    const okExp = mm >= 1 && mm <= 12 && yy >= 0 && new Date(2000 + yy, mm, 0) >= new Date(now.getFullYear(), now.getMonth(), 1);
    set("exp", okExp ? "" : "Fecha MM/AA vigente.");
    set("cvv", /^\d{3,4}$/.test(v("cvv")) ? "" : "3 o 4 dígitos.");
  } else ["card", "exp", "cvv"].forEach((n) => set(n, ""));
  if (co.pay === "yape") {
    set("yapePhone", /^9\d{8}$/.test(digits(v("yapePhone"))) ? "" : "Celular de 9 dígitos.");
    set("yapeCode", /^\d{6}$/.test(v("yapeCode")) ? "" : "El código tiene 6 dígitos.");
  } else ["yapePhone", "yapeCode"].forEach((n) => set(n, ""));
  $("#termsErr").textContent = form.terms.checked ? "" : "Necesitamos que aceptes los términos.";
  if (!form.terms.checked) errs.push(form.terms);
  return errs;
}

function placeOrder(form) {
  const v = (n) => (form[n]?.value || "").trim();
  const t = totals(v("district"), co.method === "pickup");
  const num = "MX-" + Math.floor(100000 + Math.random() * 899999);
  const order = {
    num,
    date: new Date().toISOString(),
    items: store.cart.map((l) => ({ ...l, name: byId(l.id).name, price: byId(l.id).price, img: byId(l.id).img })),
    ...t,
    coupon: store.coupon,
    name: v("name"),
    email: v("email"),
    phone: digits(v("phone")),
    method: co.method,
    district: v("district"),
    address: v("address"),
    ref: v("ref"),
    slot: co.slot,
    pay: co.pay,
    last4: co.pay === "card" ? digits(v("card")).slice(-4) : "",
    installments: v("installments"),
    invoice: co.invoice ? { ruc: digits(v("ruc")), company: v("company") } : null,
  };
  store.orders[num] = order;
  store.cart = [];
  store.coupon = "";
  if (order.district) store.district = order.district;
  co.slot = null;
  persist();
  updateBadges();
  go(`#/pedido/${num}`);
}

/* ================= VIEW: PEDIDO ================= */
VIEWS.pedido = () => {
  const o = store.orders[route.parts[1]];
  if (!o) {
    setTitle("Pedido");
    app.innerHTML = `<section class="page-block"><h1 class="page-title">No encontramos ese pedido.</h1><p class="muted">Los pedidos se guardan en el navegador donde compraste.</p><div class="actions"><a class="btn-dark" href="#/">Volver al inicio</a></div></section>`;
    return;
  }
  setTitle(`Pedido ${o.num}`);
  const slot = new Date(o.slot + "T12:00:00");
  const first = o.name.split(" ")[0];
  const payText = o.pay === "card" ? `Tarjeta terminada en ${o.last4}${o.installments > 1 ? ` · ${o.installments} cuotas` : ""}` : o.pay === "yape" ? "Yape / Plin" : "Transferencia · pendiente de constancia";
  app.innerHTML = `
<section class="page-block order">
  <p class="order-kicker"><i data-lucide="check"></i>Pedido ${o.pay === "transfer" ? "reservado" : "confirmado"}</p>
  <h1 class="page-title">Gracias, ${esc(first)}.</h1>
  <p class="order-lead">Tu pedido <b>${o.num}</b> ${o.method === "pickup" ? `estará listo para recoger el <b>${fmtDate(slot)}</b> en Av. San Martín 214, Barranco.` : `llegará el <b>${fmtDate(slot)}</b> a ${esc(o.district)}. Te escribimos por WhatsApp una hora antes.`} Enviamos el detalle a ${esc(o.email)}.</p>

  <ol class="timeline">
    <li class="done"><b>Confirmado</b><span>${fmtDate(new Date(o.date))}</span></li>
    <li><b>${o.items.some((i) => byId(i.id)?.stock === 0) ? "En taller" : "Preparando"}</b><span>Control de calidad</span></li>
    <li><b>${o.method === "pickup" ? "Listo en showroom" : "En camino"}</b><span>${fmtDate(addDays(slot, 0))}</span></li>
    <li><b>${o.method === "pickup" ? "Recogido" : "Entregado y armado"}</b><span>—</span></li>
  </ol>

  <div class="order-grid">
    <div class="order-lines">
      ${o.items.map((i) => `<div class="line"><span class="line-img"><img src="${i.img}" alt=""></span><div class="line-info"><strong>${i.name}</strong><span><i class="dot" style="--swatch:${colorOf(i.color).hex}"></i>${colorOf(i.color).name} · ${i.qty} ${i.qty === 1 ? "unidad" : "unidades"}</span></div><div class="line-side"><span>${money(i.price * i.qty)}</span></div></div>`).join("")}
      ${totalsHTML(o)}
    </div>
    <dl class="order-info">
      <div><dt>Entrega</dt><dd>${o.method === "pickup" ? "Recojo en showroom Barranco" : `${esc(o.address)}, ${esc(o.district)}${o.ref ? `<br><span class="muted">${esc(o.ref)}</span>` : ""}`}</dd></div>
      <div><dt>Contacto</dt><dd>${esc(o.name)}<br>${esc(o.phone)}</dd></div>
      <div><dt>Pago</dt><dd>${payText}</dd></div>
      <div><dt>Comprobante</dt><dd>${o.invoice ? `Factura · RUC ${o.invoice.ruc}` : "Boleta electrónica"}</dd></div>
    </dl>
  </div>
  <div class="actions"><a class="btn-dark" href="#/tienda/todo">Seguir comprando</a><button type="button" class="btn-line" data-print>Imprimir</button></div>
</section>`;
};

/* ================= VIEW: FAVORITOS ================= */
VIEWS.favoritos = () => {
  setTitle("Favoritos");
  const list = [...store.fav].map(byId);
  app.innerHTML = `${crumbs([["Inicio", "#/"], ["Favoritos", ""]])}
<section class="catalog-head"><h1>Favoritos</h1><p class="catalog-intro">${list.length ? `${list.length} ${list.length === 1 ? "pieza guardada" : "piezas guardadas"} en este navegador.` : "Toca el corazón de cualquier pieza para guardarla aquí."}</p></section>
${list.length ? `<section class="products">${list.map(card).join("")}</section><div class="actions center"><button type="button" class="btn-dark" data-allbag>Agregar todo a la bolsa</button></div>` : `<div class="actions center"><a class="btn-dark" href="#/tienda/todo">Ver la tienda</a></div>`}
<div class="spacer"></div>`;
};

/* ================= VIEW: AYUDA ================= */
const HELP = {
  envios: ["Envíos y armado", `
    <p>Entregamos en Lima Metropolitana de lunes a sábado, de 9:00 a 18:00. Subimos el mueble, lo armamos y nos llevamos el embalaje.</p>
    <table class="table"><thead><tr><th>Zona</th><th>Tarifa</th><th>Desde ${money(FREE_FROM)}</th><th>Plazo</th></tr></thead>
    <tbody><tr><td>Zona 1</td><td>${money(90)}</td><td>Gratis</td><td>2–4 días hábiles</td></tr><tr><td>Zona 2</td><td>${money(150)}</td><td>${money(60)}</td><td>3–5 días hábiles</td></tr><tr><td>Showroom Barranco</td><td>Gratis</td><td>Gratis</td><td>Desde el día siguiente</td></tr></tbody></table>
    <p><b>Zona 1:</b> ${ZONE1.join(", ")}.</p><p><b>Zona 2:</b> ${ZONE2.join(", ")}.</p>
    <p>Las piezas a pedido tardan 4 semanas en taller. Si tu pedido mezcla piezas en stock y a pedido, lo entregamos completo en una sola visita.</p>`],
  cambios: ["Cambios y devoluciones", `
    <p>Tienes <b>30 días</b> desde la entrega para cambiar o devolver cualquier pieza en stock, sin costo. Lo recogemos en tu casa en la misma zona de entrega.</p>
    <ol><li>Escríbenos a hola@muex.pe con tu número de pedido.</li><li>Coordinamos el recojo en 48 horas.</li><li>Revisamos la pieza y devolvemos el dinero al mismo medio de pago en 5 días hábiles.</li></ol>
    <p>Las piezas a pedido en un color distinto al de catálogo no tienen devolución, pero sí garantía completa.</p>`],
  garantia: ["Garantía", `<p><b>5 años</b> en estructura (madera, uniones y patas) y <b>1 año</b> en espumas, resortes y tapiz. Si algo falla, vamos a tu casa a revisarlo y lo reparamos o cambiamos.</p><p>La garantía no cubre cortes, quemaduras, mascotas que muerden ni exposición directa al sol.</p>`],
  cuidados: ["Cuidado de materiales", Object.entries(MATERIAL_CARE).map(([m, t]) => `<h3>${m}</h3><p>${t}</p>`).join("")],
  preguntas: ["Preguntas frecuentes", [
    ["¿Puedo pedir muestras de tela?", "Sí, te enviamos hasta 4 muestras gratis a cualquier distrito de Lima en 48 horas. Escríbenos por WhatsApp."],
    ["¿Hacen medidas especiales?", "Los sofás LOMA y BRASA se pueden fabricar con 20 cm más o menos de ancho. Tarda 5 semanas y cuesta 12% más."],
    ["¿Y si no entra por la puerta?", "Cada ficha indica el ancho mínimo de puerta. Si en la entrega no pasa, no te cobramos el envío y devolvemos el dinero."],
    ["¿Hacen envíos a provincia?", "Por ahora solo Lima Metropolitana y Callao. Para provincias, escríbenos y cotizamos con agencia."],
    ["¿Puedo pagar en cuotas?", "Sí, hasta 12 cuotas con tarjetas de crédito. Las cuotas sin intereses dependen de tu banco."],
  ].map(([q, a]) => `<details><summary>${q}<i data-lucide="plus"></i></summary><div><p>${a}</p></div></details>`).join("")],
  showroom: ["Showroom Barranco", ""],
  terminos: ["Términos y condiciones", `<p>Los precios incluyen IGV y están expresados en soles. MUEX S.A.C. (RUC 20604417829) se reserva el derecho de corregir errores evidentes de precio antes de confirmar un pedido.</p><p>El pedido se considera confirmado al recibir el pago o, en transferencias, la constancia dentro de las 48 horas siguientes.</p>`],
  privacidad: ["Política de privacidad", `<p>Usamos tus datos solo para procesar tu pedido, coordinar la entrega y, si lo aceptas, enviarte la carta mensual. No vendemos ni compartimos tu información. Puedes pedir que la borremos escribiendo a hola@muex.pe.</p>`],
  reclamaciones: ["Libro de reclamaciones", `<p>Conforme al Código de Protección y Defensa del Consumidor, puedes registrar un reclamo o queja. Te responderemos en un plazo máximo de 15 días hábiles.</p><form class="claim" data-claim novalidate><div class="field-row"><label class="field"><span>Nombre completo</span><input name="cName" required><small class="err"></small></label><label class="field"><span>DNI</span><input name="cDoc" inputmode="numeric" maxlength="8" required><small class="err"></small></label></div><label class="field"><span>Detalle</span><textarea name="cText" rows="4" required></textarea><small class="err"></small></label><button type="submit" class="btn-dark">Registrar</button><p class="form-ok" aria-live="polite"></p></form>`],
};
VIEWS.ayuda = () => {
  const slug = HELP[route.parts[1]] ? route.parts[1] : "preguntas";
  const [title, body] = HELP[slug];
  setTitle(title);
  const content =
    slug === "showroom"
      ? `<img class="help-img" src="img/room-minimal.webp" alt="Rincón del showroom con sofá oscuro y mesa baja" loading="lazy">
         <dl class="specs"><div><dt>Dirección</dt><dd>Av. San Martín 214, Barranco</dd></div><div><dt>Horario</dt><dd>Mar–Sáb 11:00–20:00 · Dom 11:00–17:00 · Lun cerrado</dd></div><div><dt>Teléfono</dt><dd><a class="link" href="tel:+5114778210">(01) 477 8210</a></dd></div><div><dt>Estacionamiento</dt><dd>Convenio en Av. Grau 320 (1 hora gratis)</dd></div></dl>
         <p><a class="link" href="https://www.google.com/maps/search/?api=1&query=Av.+San+Mart%C3%ADn+214+Barranco+Lima" target="_blank" rel="noopener">Abrir en Google Maps</a></p>
         <h2>Agenda una visita</h2>
         <p class="muted">Te reservamos 45 minutos con un asesor y, si quieres, tenemos listas las telas que te interesan.</p>
         <form class="visit" data-visit novalidate>
           <div class="field-row"><label class="field"><span>Nombre</span><input name="vName" autocomplete="name" required><small class="err"></small></label><label class="field"><span>Celular</span><input name="vPhone" inputmode="tel" required><small class="err"></small></label></div>
           <div class="field-row"><label class="field"><span>Día</span><input name="vDate" type="date" required><small class="err"></small></label><label class="field"><span>Hora</span><select name="vTime">${["11:00", "12:00", "15:00", "16:00", "17:00", "18:00"].map((h) => `<option>${h}</option>`).join("")}</select></label></div>
           <button type="submit" class="btn-dark">Reservar visita</button>
           <p class="form-ok" aria-live="polite"></p>
         </form>`
      : body;
  app.innerHTML = `${crumbs([["Inicio", "#/"], ["Ayuda", "#/ayuda/preguntas"], [title, ""]])}
<section class="help">
  <nav class="help-nav" aria-label="Ayuda">${Object.entries(HELP)
    .map(([k, [t]]) => `<a href="#/ayuda/${k}" ${k === slug ? 'aria-current="page"' : ""}>${t}</a>`)
    .join("")}</nav>
  <article class="help-body prose"><h1>${title}</h1>${content}</article>
</section>`;
  const date = $('[name="vDate"]', app);
  if (date) {
    let d = addDays(new Date(), 1);
    if (d.getDay() === 1) d = addDays(d, 1);
    date.min = d.toISOString().slice(0, 10);
    date.value = date.min;
  }
};

VIEWS.notfound = () => {
  setTitle("No encontrado");
  app.innerHTML = `<section class="page-block"><h1 class="page-title">Esta página no existe.</h1><div class="actions"><a class="btn-dark" href="#/">Volver al inicio</a><a class="btn-line" href="#/tienda/todo">Ver la tienda</a></div></section>`;
};

/* ================= DIALOGS ================= */
function openDialog(d) {
  if (d.open) return;
  document.body.classList.add("locked");
  d.showModal();
}
$$("dialog").forEach((d) => {
  d.addEventListener("click", (e) => {
    if (e.target === d || e.target.closest("[data-close]")) d.close();
    if (e.target.closest('a[href^="#/"]')) d.close();
  });
  d.addEventListener("close", () => {
    if (!$("dialog[open]")) document.body.classList.remove("locked");
  });
});
$("#menuBtn").onclick = () => openDialog($("#menu"));

/* quick view */
const quick = $("#quick");
let quickId = null;
let qv = { color: null, qty: 1 };
function openQuick(id) {
  const p = byId(id);
  quickId = id;
  qv = { color: p.colors[0], qty: 1 };
  $("#qvImg").src = p.img;
  $("#qvTag").textContent = `${p.sub} · ${p.material}`.toUpperCase();
  $("#qvName").textContent = p.name;
  $("#qvPrice").innerHTML = priceHTML(p);
  $("#qvDesc").textContent = p.desc;
  $("#qvMore").href = `#/producto/${p.id}`;
  $("#qvColors").innerHTML = p.colors
    .map((k, i) => `<label class="color-opt"><input type="radio" name="qvColor" value="${k}" ${i === 0 ? "checked" : ""}><span style="--swatch:${colorOf(k).hex}"></span><em class="sr">${colorOf(k).name}</em></label>`)
    .join("");
  syncQuick();
  syncQuickFav();
  openDialog(quick);
}
function syncQuick() {
  const p = byId(quickId);
  $("#qvColorName").textContent = colorOf(qv.color).name;
  $("#qvImg").alt = `${p.name} en ${colorOf(qv.color).name.toLowerCase()}`;
  $(".qv-media").style.setProperty("--tint", colorOf(qv.color).hex);
  $("#qvQty").textContent = qv.qty;
  $("#qvMinus").disabled = qv.qty <= 1;
  $("#qvPlus").disabled = qv.qty >= 9;
  $("#qvAdd").textContent = `Agregar · ${money(p.price * qv.qty)}`;
}
function syncQuickFav() {
  const on = store.fav.has(quickId);
  $("#qvFav").classList.toggle("active", on);
  $("#qvFav").setAttribute("aria-pressed", String(on));
}
$("#qvColors").addEventListener("change", (e) => {
  qv.color = e.target.value;
  syncQuick();
});
$("#qvMinus").onclick = () => {
  qv.qty = Math.max(1, qv.qty - 1);
  syncQuick();
};
$("#qvPlus").onclick = () => {
  qv.qty = Math.min(9, qv.qty + 1);
  syncQuick();
};
$("#qvFav").onclick = () => toggleFav(quickId);
$("#qvAdd").onclick = () => {
  addToCart(quickId, qv.color, qv.qty);
  quick.close();
  openDrawer(`${byId(quickId).name} se agregó a tu bolsa`);
};

/* mini bag */
const drawer = $("#drawer");
let drawerNote = "";
function openDrawer(note = "") {
  drawerNote = note;
  renderDrawer();
  openDialog(drawer);
}
$("#cartBtn").onclick = () => (route.name === "bolsa" ? app.focus() : openDrawer());
function renderDrawer() {
  $("#drawerTitle").textContent = `Bolsa (${cartCount()})`;
  const body = $("#drawerBody");
  const foot = $("#drawerFoot");
  if (!store.cart.length) {
    body.innerHTML = `<div class="sheet-empty"><p>Tu bolsa está vacía.</p><p class="muted">Abre cualquier pieza y agrégala desde ahí.</p></div>`;
    foot.innerHTML = `<a class="btn-dark wide" href="#/tienda/todo">Ver la tienda</a>`;
    icons();
    return;
  }
  const t = totals();
  body.innerHTML = (drawerNote ? `<p class="sheet-note"><i data-lucide="check"></i>${drawerNote}</p>` : "") + store.cart.map((l, i) => lineHTML(l, i)).join("");
  foot.innerHTML = `${totalsHTML(t)}${freeHint(t)}
    <div class="sheet-actions"><a class="btn-line" href="#/bolsa">Ver bolsa</a><a class="btn-dark" href="#/checkout">Pagar</a></div>`;
  icons();
}

/* fit checker */
let fitId = null;
function openFit(id) {
  fitId = id;
  const p = byId(id);
  $("#fitIntro").textContent = `${p.name} mide ${p.dims[0]} cm de ancho, ${p.dims[1]} de profundidad y ${p.dims[2]} de alto.`;
  $("#fitResult").innerHTML = "";
  $("#fitForm").reset();
  openDialog($("#fit"));
}
$("#fitForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const p = byId(fitId);
  const [w, d, h] = p.dims;
  const space = +$("#fitSpace").value;
  const door = +$("#fitDoor").value;
  const out = $("#fitResult");
  if (!space && !door) {
    out.innerHTML = `<p class="form-error">Escribe al menos una medida.</p>`;
    return;
  }
  const rows = [];
  if (space) {
    const gap = space - w;
    rows.push(gap >= 10 ? ["ok", `Entra en tu espacio y sobran ${gap} cm.`] : gap >= 0 ? ["warn", `Entra justo: quedan ${gap} cm. Recomendamos al menos 10 cm de aire.`] : ["no", `Le faltan ${-gap} cm de ancho.`]);
  }
  if (door) {
    const need = Math.min(d, h) + 2;
    rows.push(door >= need ? ["ok", `Pasa por la puerta de ${door} cm (necesita ${need} cm, de canto).`] : ["no", `No pasa por una puerta de ${door} cm: necesita ${need} cm.${p.cat === "sofas" ? " Podemos entregarlo con las patas y brazos desmontados; escríbenos." : ""}`]);
  }
  out.innerHTML = rows.map(([k, t]) => `<p class="fit-${k}"><i data-lucide="${k === "ok" ? "check" : k === "warn" ? "alert-triangle" : "x"}"></i>${t}</p>`).join("");
  icons();
});

/* search */
const search = $("#search");
$("#searchBtn").onclick = () => {
  openDialog(search);
  renderSearch("");
  $("#searchInput").value = "";
  $("#searchInput").focus();
};
function renderSearch(q) {
  const body = $("#searchBody");
  if (!q.trim()) {
    body.innerHTML = `<p class="field-label">Búsquedas frecuentes</p>
      <div class="chips">${["sofá 3 cuerpos", "cuero", "roble", "terraza", "lectura", "salvia"].map((s) => `<button type="button" class="chip" data-suggest="${s}">${s}</button>`).join("")}</div>
      <p class="field-label">Categorías</p>
      <div class="search-cats">${["sillas", "sillones", "sofas", "ofertas"].map((c) => `<a href="#/tienda/${c}">${CATS[c].title}<i data-lucide="arrow-right"></i></a>`).join("")}</div>`;
    icons();
    return;
  }
  const list = products.filter((p) => matchQuery(p, q));
  body.innerHTML = list.length
    ? `<ul class="search-list">${list
        .slice(0, 6)
        .map((p) => `<li><a href="#/producto/${p.id}"><span class="line-img"><img src="${p.img}" alt=""></span><span><b>${p.name}</b><small>${p.sub} · ${p.material}</small></span><span>${priceHTML(p)}</span></a></li>`)
        .join("")}</ul>
      <a class="btn-dark wide" href="#/tienda/todo?q=${encodeURIComponent(q)}">Ver ${list.length === 1 ? "el resultado" : `los ${list.length} resultados`}</a>`
    : `<div class="sheet-empty"><p>Sin resultados para “${esc(q)}”.</p><p class="muted">Prueba con “roble”, “cuero” o “3 cuerpos”.</p></div>`;
}
$("#searchInput").addEventListener("input", (e) => renderSearch(e.target.value));
$("#searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const q = $("#searchInput").value.trim();
  if (q) go(`#/tienda/todo?q=${encodeURIComponent(q)}`);
});

/* ================= GLOBAL EVENTS ================= */
document.addEventListener("click", (e) => {
  const t = e.target;

  // filter dropdowns
  const fbtn = t.closest(".filter-wrap > .filter");
  if (fbtn) {
    const wrap = fbtn.parentElement;
    const open = !wrap.classList.contains("open");
    closeDropdowns(wrap);
    wrap.classList.toggle("open", open);
    fbtn.setAttribute("aria-expanded", String(open));
    if (open) $("input", wrap)?.focus({ preventScroll: true });
    return;
  }
  if (!t.closest(".filter-wrap")) closeDropdowns();

  if (t.closest("#readyToggle")) {
    filters.ready = !filters.ready;
    filters.page = 1;
    return regrid();
  }
  if (t.closest("[data-clear]")) {
    const keepSort = filters.sort;
    resetFilters();
    filters.sort = keepSort;
    return VIEWS.tienda(), icons();
  }
  const chip = t.closest("[data-chip]");
  if (chip) {
    const { chip: k, value } = chip.dataset;
    if (k === "price") filters.price = "any";
    else if (k === "ready") filters.ready = false;
    else filters[k].delete(value);
    filters.page = 1;
    $$(`#filters input[name="${k}"]`).forEach((i) => i.value === value && (i.checked = false));
    if (k === "price") $('#filters input[name="price"][value="any"]').checked = true;
    return regrid();
  }
  const pageBtn = t.closest("[data-page]");
  if (pageBtn && !pageBtn.disabled) {
    filters.page = +pageBtn.dataset.page;
    regrid();
    return $(".catalog-head").scrollIntoView({ behavior: smooth(), block: "start" });
  }

  const railBtn = t.closest("[data-rail]");
  if (railBtn) {
    const r = document.getElementById(railBtn.dataset.rail);
    return r.scrollBy({ left: +railBtn.dataset.dir * r.clientWidth * 0.8, behavior: smooth() });
  }

  const favBtn = t.closest("[data-fav]");
  if (favBtn) return toggleFav(favBtn.dataset.fav);
  const qBtn = t.closest("[data-quick]");
  if (qBtn) return openQuick(qBtn.dataset.quick);
  const fitBtn = t.closest("[data-fit]");
  if (fitBtn) return openFit(fitBtn.dataset.fit);

  // product page
  const thumb = t.closest("[data-thumb]");
  if (thumb) {
    const i = +thumb.dataset.thumb;
    $$(".thumb").forEach((b, j) => {
      b.classList.toggle("active", i === j);
      b.setAttribute("aria-pressed", String(i === j));
    });
    $("#pdpImg").src = $("img", thumb).src;
    $("#galleryMain").classList.toggle("photo", i > 0);
    return;
  }
  const pq = t.closest("[data-pdpqty]");
  if (pq) {
    pdp.qty = Math.min(9, Math.max(1, pdp.qty + +pq.dataset.pdpqty));
    return syncPdp();
  }
  if (t.closest("#pdpAdd")) {
    const p = byId(route.parts[1]);
    addToCart(p.id, pdp.color, pdp.qty);
    return openDrawer(`${p.name} en ${colorOf(pdp.color).name.toLowerCase()} se agregó a tu bolsa`);
  }
  const st = t.closest("[data-scrollto]");
  if (st) {
    e.preventDefault();
    return document.getElementById(st.dataset.scrollto).scrollIntoView({ behavior: smooth() });
  }
  if (t.closest("#revToggle")) {
    const f = $("#revForm");
    f.hidden = !f.hidden;
    $("#revToggle").setAttribute("aria-expanded", String(!f.hidden));
    if (!f.hidden) f.revName.focus();
    return;
  }

  // bag lines (page + drawer)
  const q = t.closest("[data-qty]");
  if (q) {
    const line = store.cart[+q.dataset.qty];
    line.qty = Math.min(9, line.qty + +q.dataset.step);
    store.cart = store.cart.filter((l) => l.qty > 0);
    return afterCart();
  }
  const rm = t.closest("[data-remove]");
  if (rm) {
    const [removed] = store.cart.splice(+rm.dataset.remove, 1);
    afterCart();
    return showToast(`${byId(removed.id).name} quitado`, "Deshacer", () => {
      store.cart.push(removed);
      afterCart();
    });
  }
  const later = t.closest("[data-later]");
  if (later) {
    const [l] = store.cart.splice(+later.dataset.later, 1);
    store.fav.add(l.id);
    afterCart();
    return showToast(`${byId(l.id).name} pasó a favoritos`);
  }
  if (t.closest("[data-uncoupon]")) {
    store.coupon = "";
    persist();
    return afterCart();
  }
  if (t.closest("[data-allbag]")) {
    store.fav.forEach((id) => addToCart(id, byId(id).colors[0]));
    return openDrawer(`${store.fav.size} piezas agregadas a tu bolsa`);
  }
  if (t.closest("[data-print]")) return window.print();

  const sug = t.closest("[data-suggest]");
  if (sug) {
    $("#searchInput").value = sug.dataset.suggest;
    renderSearch(sug.dataset.suggest);
    return;
  }

  // whole card → product page (card-link covers it; this handles clicks on the image area)
  const cardEl = t.closest(".product-card");
  if (cardEl && !t.closest("button, a")) go(`#/producto/${cardEl.dataset.id}`);
});

function afterCart() {
  persist();
  updateBadges();
  if (drawer.open) renderDrawer();
  if (route.name === "bolsa") VIEWS.bolsa(), icons();
  if (route.name === "checkout") {
    if (!store.cart.length) VIEWS.checkout();
    else {
      $("#coCoupon").innerHTML = couponHTML();
      refreshCheckout();
    }
    icons();
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  const open = $(".filter-wrap.open");
  if (open) {
    closeDropdowns();
    $(".filter", open).focus();
  }
});

document.addEventListener("change", (e) => {
  const t = e.target;
  if (t.name === "pdpColor") {
    pdp.color = t.value;
    return syncPdp();
  }
  if (t.id === "shipEst") {
    store.district = t.value;
    persist();
    return updateShipEst(byId(route.parts[1]));
  }
  if (t.id === "bagDistrict") {
    store.district = t.value;
    persist();
    return VIEWS.bolsa(), icons();
  }
  const form = t.closest("#checkout");
  if (form) {
    if (t.name === "method") {
      co.method = t.value;
      $("#deliveryFields").hidden = co.method === "pickup";
      $("#slotLabel").textContent = co.method === "pickup" ? "Día de recojo" : "Día de entrega";
      renderSlots();
    }
    if (t.name === "pay") {
      co.pay = t.value;
      $$(".pay-panel").forEach((p) => (p.hidden = p.dataset.panel !== co.pay));
    }
    if (t.name === "invoice") {
      co.invoice = t.checked;
      $("#invoiceRow").hidden = !co.invoice;
    }
    if (t.name === "slot") {
      co.slot = t.value;
      $("#slotErr").textContent = "";
    }
    refreshCheckout();
  }
});

document.addEventListener("input", (e) => {
  const t = e.target;
  if (t.name === "card") {
    const pos = t.selectionStart;
    const before = t.value.length;
    t.value = digits(t.value).slice(0, 19).replace(/(\d{4})(?=\d)/g, "$1 ");
    t.setSelectionRange(pos + (t.value.length - before), pos + (t.value.length - before));
  }
  if (t.name === "exp") {
    const d = digits(t.value).slice(0, 4);
    t.value = d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  }
  if (["cvv", "yapeCode", "doc", "ruc", "cDoc"].includes(t.name)) t.value = digits(t.value);
  if (t.getAttribute("aria-invalid") === "true") {
    t.removeAttribute("aria-invalid");
    const s = t.closest(".field")?.querySelector(".err");
    if (s) s.textContent = "";
  }
});

document.addEventListener("submit", (e) => {
  const f = e.target;
  if (f.id === "checkout") {
    e.preventDefault();
    const errs = validateCheckout(f);
    const box = $("#coErr");
    if (errs.length) {
      box.textContent = `Revisa ${errs.length === 1 ? "1 campo" : `${errs.length} campos`} marcados en rojo.`;
      errs[0]?.focus();
      return;
    }
    box.textContent = "";
    const btn = $("#payBtn");
    btn.disabled = true;
    btn.textContent = co.pay === "transfer" ? "Reservando…" : "Procesando pago…";
    setTimeout(() => placeOrder(f), 1100);
    return;
  }
  if (f.matches("[data-coupon]")) {
    e.preventDefault();
    const code = f.querySelector("input").value.trim().toUpperCase();
    const err = f.querySelector(".form-error");
    const c = COUPONS[code];
    if (!c) return (err.textContent = "Ese código no existe o ya venció.");
    if (c.min && cartSub() < c.min) return (err.textContent = `Este código aplica desde ${money(c.min)}.`);
    store.coupon = code;
    persist();
    afterCart();
    return showToast(`Código ${code} aplicado`);
  }
  if (f.id === "revForm") {
    e.preventDefault();
    const name = f.revName.value.trim();
    const text = f.revText.value.trim();
    if (!name || text.length < 10) return ($("#revErr").textContent = "Escribe tu nombre y al menos 10 caracteres.");
    const id = route.parts[1];
    store.reviews[id] = [[name, f.revDistrict.value.trim() || "Lima", +f.revStars.value, text], ...(store.reviews[id] || [])];
    persist();
    VIEWS.producto();
    icons();
    document.getElementById("reviews").scrollIntoView({ behavior: "auto" });
    return showToast("Gracias, tu reseña ya está publicada");
  }
  if (f.matches("[data-visit]") || f.matches("[data-claim]")) {
    e.preventDefault();
    let ok = true;
    $$("input[required], textarea[required]", f).forEach((i) => {
      const bad = !i.value.trim() || (i.name === "vPhone" && !/^9\d{8}$/.test(digits(i.value))) || (i.name === "cDoc" && !/^\d{8}$/.test(i.value));
      i.setAttribute("aria-invalid", String(bad));
      const s = i.closest(".field").querySelector(".err");
      if (s) s.textContent = bad ? "Revisa este campo." : "";
      if (bad) ok = false;
    });
    if (!ok) return $('[aria-invalid="true"]', f).focus();
    const msg = f.querySelector(".form-ok");
    msg.textContent = f.matches("[data-visit]")
      ? `Listo, ${f.vName.value.trim().split(" ")[0]}: te esperamos el ${fmtDate(new Date(f.vDate.value + "T12:00:00"))} a las ${f.vTime.value}. Te confirmamos por WhatsApp.`
      : `Reclamo registrado con el código R-${Math.floor(10000 + Math.random() * 89999)}. Te responderemos por correo.`;
    f.querySelectorAll("input, textarea").forEach((i) => i.type !== "date" && (i.value = ""));
    return;
  }
  if (f.id === "newsForm") {
    e.preventDefault();
    const input = $("#newsEmail");
    const msg = $("#newsMsg");
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
    input.setAttribute("aria-invalid", String(!ok));
    msg.classList.toggle("error", !ok);
    if (!ok) {
      msg.textContent = "Ese correo no parece correcto. Revisa si hay un error.";
      input.focus();
      return;
    }
    msg.textContent = `Listo. La primera carta llega a ${input.value.trim()}.`;
    input.value = "";
  }
});

/* ================= TOAST ================= */
const toast = $("#toast");
let toastTimer;
function showToast(text, action, onAction) {
  toast.innerHTML = "";
  toast.append(text);
  if (action) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = action;
    b.onclick = () => {
      toast.classList.remove("show");
      onAction();
    };
    toast.append(b);
  }
  // popover pone el toast en la capa superior, encima de cualquier diálogo
  if (toast.showPopover) {
    if (toast.matches(":popover-open")) toast.hidePopover();
    toast.showPopover();
  }
  requestAnimationFrame(() => toast.classList.add("show"));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), action ? 4000 : 2000);
}
toast.addEventListener("mouseenter", () => clearTimeout(toastTimer));
toast.addEventListener("mouseleave", () => (toastTimer = setTimeout(() => toast.classList.remove("show"), 1500)));

/* ================= INIT ================= */
function init() {
  updateBadges();
  render();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();
