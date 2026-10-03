/* Trigal — plataforma B2B de insumos de panificación (UI Vault, tienda model-003).
   SPA con rutas por hash: inicio, catálogo, ficha, recetas, negocios, pedido,
   zona cliente y contacto. El pedido y la sesión demo viven en localStorage. */

const app = document.querySelector('#app');
const toastEl = document.querySelector('.toast');
const money = (n) => `S/ ${n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const byId = (id) => PRODUCTS.find((p) => p.id === id);
const catName = (id) => CATEGORIES.find((c) => c.id === id)?.name ?? '';

/* ---------- Estado persistente ---------- */

const store = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* modo privado: solo en memoria */ }
  },
};

let order = store.get('trigal-order', {});
let session = store.get('trigal-session', false);
const catalog = { cat: 'todos', tags: new Set(), doses: new Set(), q: '', sort: 'relevancia' };

function saveOrder() {
  store.set('trigal-order', order);
  const count = Object.values(order).reduce((a, b) => a + b, 0);
  document.querySelectorAll('[data-order-count]').forEach((el) => {
    el.textContent = count;
    el.hidden = count === 0;
  });
}

function addToOrder(id, qty = 1) {
  order[id] = (order[id] ?? 0) + qty;
  saveOrder();
  const unit = byId(id).pack.split(' ')[0].toLowerCase();
  toast(`${byId(id).name} · ${qty} ${qty === 1 ? unit : `${unit}s`} al pedido`, '#/pedido', 'Ver pedido');
}

let toastTimer;
function toast(text, href, label) {
  toastEl.innerHTML = `<span>${text}</span>${href ? `<a href="${href}">${label}</a>` : ''}`;
  toastEl.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toastEl.hidden = true; }, 3800);
}

/* ---------- Piezas reutilizables ---------- */

const tagList = (p) => p.tags.map((t) => `<li>${TAGS[t]}</li>`).join('');

const productCard = (p) => `
  <article class="product-card">
    <a class="product-card__link" href="#/producto/${p.id}">
      <img loading="lazy" src="${p.img.replace('w=900', 'w=600')}" alt="${p.name}">
      <div class="product-body">
        <p class="product-cat">${catName(p.cat)}</p>
        <h3>${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
      </div>
    </a>
    <div class="product-meta">
      <span><b>${money(p.price)}</b><small>${p.pack}</small></span>
      <button class="add-btn" type="button" data-add="${p.id}" aria-label="Agregar ${p.name} al pedido">+</button>
    </div>
  </article>`;

const recipeCard = (r) => `
  <a class="recipe-card" href="#/receta/${r.id}">
    <img loading="lazy" src="${r.img.replace('w=1200', 'w=800')}" alt="">
    <span class="recipe-card__shade"></span>
    <span class="recipe-card__text"><small>${r.time} · ${r.units}</small><strong>${r.name}</strong></span>
  </a>`;

const crumbs = (items) => `
  <nav class="breadcrumbs" aria-label="Ruta">
    ${items.map(([label, href], i) => (i === items.length - 1
      ? `<strong aria-current="page">${label}</strong>`
      : `<a href="${href}">${label}</a><span aria-hidden="true">›</span>`)).join('')}
  </nav>`;

const stepper = (id, qty, label) => `
  <div class="stepper" role="group" aria-label="${label}">
    <button type="button" data-step="${id}" data-delta="-1" aria-label="Quitar uno">−</button>
    <output aria-live="polite">${qty}</output>
    <button type="button" data-step="${id}" data-delta="1" aria-label="Agregar uno">+</button>
  </div>`;

/* ---------- Vistas ---------- */

function viewHome() {
  const featured = PRODUCTS.filter((p) => p.featured);
  return `
  <section class="hero">
    <div class="hero-inner">
      <div class="hero-orb" aria-hidden="true"></div>
      <h1><span class="sr-only">Insumos de </span>PANADERÍA</h1>
      <img class="hero-bread" src="${PRODUCTS[0].img.replace('w=900', 'w=1100')}" alt="Panes integrales con semillas recién horneados">
      <div class="hero-copy">
        <strong>Insumos que hacen buen pan</strong>
        <p>Mezclas, mejoradores y masas madre para panaderías, cadenas y hoteles. Despacho en Lima, Arequipa y Trujillo.</p>
        <a class="pill-btn" href="#/productos">Ver catálogo</a>
      </div>
    </div>
    <nav class="category-strip" aria-label="Categorías">
      ${CATEGORIES.map((c) => `<a class="cat" href="#/productos/${c.id}">${c.name}<span aria-hidden="true">→</span></a>`).join('')}
    </nav>
  </section>

  <section class="section container">
    <header class="section-head"><h2>Lo que más piden las panaderías</h2><a href="#/productos">Ver los 12 productos</a></header>
    <div class="product-grid product-grid--four">${featured.map(productCard).join('')}</div>
  </section>

  <section class="section section--cream">
    <div class="container">
      <header class="section-head"><h2>Recetas del centro técnico</h2><a href="#/recetas">Todas las recetas</a></header>
      <div class="recipe-grid">${RECIPES.slice(0, 3).map(recipeCard).join('')}</div>
    </div>
  </section>

  <section class="section container split">
    <div>
      <p class="eyebrow">Para tu negocio</p>
      <h2>Un asesor técnico va a tu panadería y prueba las mezclas con tu equipo.</h2>
      <p class="lead">Sin costo para pedidos desde 10 bolsas al mes. Ajustamos la receta a tu horno y a tu harina.</p>
      <div class="actions"><a class="pill-btn" href="#/contacto">Agendar visita</a><a class="text-btn" href="#/negocios">Cómo trabajamos</a></div>
    </div>
    <img class="split-img" loading="lazy" src="${SEGMENTS[0].img}" alt="Mostrador de una panadería con pan del día">
  </section>`;
}

function viewCatalog(catParam) {
  catalog.cat = catParam && CATEGORIES.some((c) => c.id === catParam) ? catParam : 'todos';
  const title = catalog.cat === 'todos' ? 'Todos los productos' : catName(catalog.cat);
  return `
  <section class="catalog container">
    ${crumbs([['Inicio', '#/'], ['Productos', '#/productos'], ...(catalog.cat === 'todos' ? [] : [[title]])].filter((x) => x.length))}
    <header class="catalog-head">
      <h1>${title}</h1>
      <div class="catalog-tools">
        <label class="field-inline"><span class="sr-only">Buscar en el catálogo</span>
          <input type="search" id="catalogSearch" placeholder="Buscar en el catálogo" value="${catalog.q}">
        </label>
        <label class="field-inline"><span>Ordenar</span>
          <select id="catalogSort">
            ${[['relevancia', 'Relevancia'], ['precio-asc', 'Precio: menor a mayor'], ['precio-desc', 'Precio: mayor a menor'], ['nombre', 'Nombre A–Z']]
              .map(([v, l]) => `<option value="${v}" ${catalog.sort === v ? 'selected' : ''}>${l}</option>`).join('')}
          </select>
        </label>
      </div>
    </header>
    <div class="cat-tabs" role="tablist" aria-label="Categorías">
      ${[['todos', 'Todos'], ...CATEGORIES.map((c) => [c.id, c.short])].map(([id, l]) => `
        <a role="tab" aria-selected="${catalog.cat === id}" class="${catalog.cat === id ? 'active' : ''}" href="#/productos${id === 'todos' ? '' : `/${id}`}">${l}</a>`).join('')}
    </div>
    <div class="catalog-layout">
      <div class="product-grid" id="productGrid" aria-live="polite"></div>
      <aside class="filters" aria-label="Filtros">
        <fieldset class="filter-block"><legend>Características</legend>
          ${Object.entries(TAGS).map(([v, l]) => `<label><input type="checkbox" data-filter="tags" value="${v}" ${catalog.tags.has(v) ? 'checked' : ''}><span class="check" aria-hidden="true"></span>${l}</label>`).join('')}
        </fieldset>
        <fieldset class="filter-block"><legend>Dosificación</legend>
          ${Object.entries(DOSES).map(([v, l]) => `<label><input type="checkbox" data-filter="doses" value="${v}" ${catalog.doses.has(v) ? 'checked' : ''}><span class="check" aria-hidden="true"></span>${l}</label>`).join('')}
        </fieldset>
        <button class="filter-btn" type="button" id="clearFilters"><span>Limpiar filtros</span><b id="resultCount">0</b></button>
      </aside>
    </div>
  </section>`;
}

function filteredProducts() {
  const q = catalog.q.trim().toLowerCase();
  const list = PRODUCTS.filter((p) => (catalog.cat === 'todos' || p.cat === catalog.cat)
    && [...catalog.tags].every((t) => p.tags.includes(t))
    && (!catalog.doses.size || catalog.doses.has(p.dose))
    && (!q || `${p.name} ${p.desc} ${catName(p.cat)}`.toLowerCase().includes(q)));
  const sorters = {
    'precio-asc': (a, b) => a.price - b.price,
    'precio-desc': (a, b) => b.price - a.price,
    nombre: (a, b) => a.name.localeCompare(b.name, 'es'),
  };
  return sorters[catalog.sort] ? [...list].sort(sorters[catalog.sort]) : list;
}

function renderGrid() {
  const grid = document.querySelector('#productGrid');
  if (!grid) return;
  const list = filteredProducts();
  grid.innerHTML = list.length
    ? list.map(productCard).join('')
    : `<div class="empty"><strong>Ningún producto cumple esos filtros.</strong><button class="text-btn" type="button" data-clear>Limpiar filtros</button></div>`;
  document.querySelector('#resultCount').textContent = `${list.length} ${list.length === 1 ? 'producto' : 'productos'}`;
}

function viewProduct(id) {
  const p = byId(id);
  if (!p) return viewNotFound();
  const recipes = RECIPES.filter((r) => r.products.includes(p.id));
  const related = PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 3);
  return `
  <section class="container product-page">
    ${crumbs([['Inicio', '#/'], ['Productos', '#/productos'], [catName(p.cat), `#/productos/${p.cat}`], [p.name]])}
    <div class="product-layout">
      <img class="product-photo" src="${p.img.replace('w=900', 'w=1100')}" alt="${p.name}">
      <div class="product-info">
        <p class="product-cat">${catName(p.cat)}</p>
        <h1>${p.name}</h1>
        <p class="lead">${p.desc}</p>
        <ul class="tag-list">${tagList(p)}</ul>
        <p class="price">${money(p.price)} <small>${p.pack} · sin IGV</small></p>
        <div class="buy-row">
          ${stepper('detail', 1, 'Cantidad a pedir')}
          <button class="pill-btn" type="button" data-add-detail="${p.id}">Agregar al pedido</button>
        </div>
        <dl class="spec">
          <div><dt>Dosificación</dt><dd>${p.doseText}</dd></div>
          <div><dt>Presentación</dt><dd>${p.pack}</dd></div>
          <div><dt>Rendimiento</dt><dd>${p.yield}</dd></div>
          <div><dt>Vida útil</dt><dd>${p.life} sin abrir</dd></div>
          <div><dt>Almacenamiento</dt><dd>Lugar fresco y seco, a menos de 25 °C</dd></div>
        </dl>
        <button class="text-btn" type="button" data-sheet>Descargar ficha técnica (PDF)</button>
      </div>
    </div>
    ${recipes.length ? `<section class="section"><header class="section-head"><h2>Recetas con este producto</h2></header><div class="recipe-grid">${recipes.map(recipeCard).join('')}</div></section>` : ''}
    ${related.length ? `<section class="section"><header class="section-head"><h2>De la misma línea</h2><a href="#/productos/${p.cat}">Ver ${catName(p.cat).toLowerCase()}</a></header><div class="product-grid product-grid--three">${related.map(productCard).join('')}</div></section>` : ''}
  </section>`;
}

function viewRecipes() {
  return `
  <section class="container section">
    ${crumbs([['Inicio', '#/'], ['Recetas']])}
    <header class="page-head"><h1>Recetas del centro técnico</h1><p class="lead">Probadas en nuestro laboratorio de Ate con hornos de piso y rotativos. Cantidades para producción.</p></header>
    <div class="recipe-grid recipe-grid--two">${RECIPES.map(recipeCard).join('')}</div>
  </section>`;
}

function viewRecipe(id) {
  const r = RECIPES.find((x) => x.id === id);
  if (!r) return viewNotFound();
  return `
  <article class="recipe-page">
    <header class="recipe-hero">
      <img src="${r.img}" alt="${r.name}">
      <span class="recipe-card__shade"></span>
      <div class="container recipe-hero__text">
        ${crumbs([['Inicio', '#/'], ['Recetas', '#/recetas'], [r.name]])}
        <h1>${r.name}</h1>
        <dl class="recipe-facts"><div><dt>Tiempo</dt><dd>${r.time}</dd></div><div><dt>Rinde</dt><dd>${r.units}</dd></div><div><dt>Dificultad</dt><dd>${r.level}</dd></div></dl>
      </div>
    </header>
    <div class="container recipe-body">
      <section><h2>Ingredientes</h2><ul class="ingredients">${r.ingredients.map((i) => `<li>${i}</li>`).join('')}</ul>
        <div class="recipe-products"><h3>Productos Trigal en esta receta</h3>
          ${r.products.map((pid) => { const p = byId(pid); return `<div class="mini-product"><img src="${p.img.replace('w=900', 'w=200')}" alt=""><a href="#/producto/${p.id}">${p.name}</a><button class="add-btn" type="button" data-add="${p.id}" aria-label="Agregar ${p.name} al pedido">+</button></div>`; }).join('')}
        </div>
      </section>
      <section><h2>Preparación</h2><ol class="steps">${r.steps.map((s) => `<li>${s}</li>`).join('')}</ol></section>
    </div>
  </article>`;
}

function viewBusiness() {
  return `
  <section class="container section">
    ${crumbs([['Inicio', '#/'], ['Para tu negocio']])}
    <header class="page-head"><h1>Trabajamos con tu producción, no solo con tu pedido.</h1><p class="lead">Más de 1 200 panaderías en el Perú compran con nosotros. Cada cliente tiene un asesor técnico y precios por volumen.</p></header>
    <div class="segments">
      ${SEGMENTS.map((s) => `<article class="segment"><img loading="lazy" src="${s.img}" alt=""><div><h2>${s.name}</h2><p>${s.text}</p></div></article>`).join('')}
    </div>
  </section>
  <section class="section section--cream">
    <div class="container">
      <header class="section-head"><h2>Cómo empezamos</h2></header>
      <ol class="process">
        <li><b>01</b><h3>Visita técnica</h3><p>Un asesor revisa tu horno, tu harina y tu producción del día.</p></li>
        <li><b>02</b><h3>Prueba en tu panadería</h3><p>Horneamos con tu equipo y ajustamos la dosificación.</p></li>
        <li><b>03</b><h3>Pedido y crédito</h3><p>Precios por volumen, despacho semanal y crédito a 30 días.</p></li>
      </ol>
      <div class="actions"><a class="pill-btn" href="#/contacto">Agendar visita técnica</a><a class="text-btn" href="#/cliente">Ya soy cliente</a></div>
    </div>
  </section>`;
}

function orderLines() {
  return Object.entries(order).filter(([, q]) => q > 0).map(([id, qty]) => ({ p: byId(id), qty })).filter((l) => l.p);
}

function totals(lines) {
  const subtotal = lines.reduce((a, l) => a + l.p.price * l.qty, 0);
  const igv = subtotal * 0.18;
  return { subtotal, igv, total: subtotal + igv };
}

function viewOrder() {
  const lines = orderLines();
  if (!lines.length) {
    return `<section class="container section">${crumbs([['Inicio', '#/'], ['Pedido']])}
      <div class="empty empty--page"><strong>Tu pedido está vacío.</strong><p>Agrega bolsas desde el catálogo o desde una receta.</p><a class="pill-btn" href="#/productos">Ir al catálogo</a></div></section>`;
  }
  const t = totals(lines);
  const prefill = session ? CLIENT : {};
  return `
  <section class="container section order-page">
    ${crumbs([['Inicio', '#/'], ['Pedido']])}
    <header class="page-head"><h1>Tu pedido</h1><p class="lead">Te enviamos la cotización y coordinamos el despacho por teléfono el mismo día.</p></header>
    <div class="order-layout">
      <div>
        <ul class="order-lines">
          ${lines.map(({ p, qty }) => `
          <li>
            <img src="${p.img.replace('w=900', 'w=200')}" alt="">
            <div><a href="#/producto/${p.id}">${p.name}</a><small>${p.pack} · ${money(p.price)} c/u</small></div>
            ${stepper(p.id, qty, `Cantidad de ${p.name}`)}
            <b>${money(p.price * qty)}</b>
            <button class="remove" type="button" data-remove="${p.id}" aria-label="Quitar ${p.name}">Quitar</button>
          </li>`).join('')}
        </ul>
        <form class="order-form" id="orderForm" novalidate>
          <h2>Datos de tu negocio</h2>
          <div class="form-grid">
            <label>Razón social<input name="company" required value="${prefill.company ?? ''}" autocomplete="organization"></label>
            <label>RUC<input name="ruc" required inputmode="numeric" pattern="(10|20)[0-9]{9}" maxlength="11" value="${prefill.ruc ?? ''}"></label>
            <label>Persona de contacto<input name="contact" required value="${prefill.contact ?? ''}" autocomplete="name"></label>
            <label>Celular<input name="phone" required inputmode="tel" pattern="9[0-9]{8}" maxlength="9" placeholder="9XX XXX XXX" autocomplete="tel-national"></label>
            <label>Distrito de entrega<input name="district" required value="${prefill.district ?? ''}"></label>
            <label>Fecha preferida<input name="date" type="date" required></label>
            <label class="span-2">Indicaciones (opcional)<textarea name="notes" rows="3" placeholder="Horario de recepción, referencia, etc."></textarea></label>
          </div>
          <p class="form-error" id="formError" role="alert" hidden></p>
        </form>
      </div>
      <aside class="summary">
        <h2>Resumen</h2>
        <dl>
          <div><dt>Subtotal</dt><dd>${money(t.subtotal)}</dd></div>
          <div><dt>IGV (18%)</dt><dd>${money(t.igv)}</dd></div>
          <div><dt>Despacho</dt><dd>${t.subtotal >= 500 ? 'Sin costo' : 'Se cotiza'}</dd></div>
          <div class="total"><dt>Total referencial</dt><dd>${money(t.total)}</dd></div>
        </dl>
        <p class="note">${t.subtotal >= 500 ? 'Tu pedido tiene despacho sin costo en Lima, Arequipa y Trujillo.' : `Te faltan ${money(500 - t.subtotal)} para el despacho sin costo.`}</p>
        <button class="pill-btn pill-btn--full" type="submit" form="orderForm">Solicitar cotización</button>
      </aside>
    </div>
  </section>`;
}

function viewOrderSent(number) {
  return `
  <section class="container section">
    <div class="empty empty--page confirm">
      <p class="eyebrow">Solicitud recibida</p>
      <h1>Pedido ${number}</h1>
      <p>Un asesor te llama hoy para confirmar precios, stock y la fecha de entrega. También te enviamos la cotización a tu correo.</p>
      <div class="actions"><a class="pill-btn" href="#/cliente">Ver mis pedidos</a><a class="text-btn" href="#/productos">Seguir comprando</a></div>
    </div>
  </section>`;
}

function viewClient() {
  if (!session) {
    return `
    <section class="container section client-login">
      ${crumbs([['Inicio', '#/'], ['Zona cliente']])}
      <div class="login-card">
        <h1>Zona cliente</h1>
        <p class="lead">Sigue tus pedidos, descarga facturas y vuelve a pedir en un clic.</p>
        <form id="loginForm" class="form-grid form-grid--one">
          <label>RUC<input name="ruc" required inputmode="numeric" value="20601234567"></label>
          <label>Contraseña<input name="password" type="password" required value="demo1234" autocomplete="current-password"></label>
          <button class="pill-btn pill-btn--full" type="submit">Ingresar</button>
        </form>
        <p class="note">Cuenta demo ya completada. ¿Aún no eres cliente? <a href="#/contacto">Solicita una visita</a>.</p>
      </div>
    </section>`;
  }
  const statusClass = { Preparando: 'prep', 'En camino': 'road', Entregado: 'done' };
  return `
  <section class="container section client">
    ${crumbs([['Inicio', '#/'], ['Zona cliente']])}
    <header class="client-head">
      <div><p class="eyebrow">${CLIENT.ruc}</p><h1>${CLIENT.company}</h1><p class="lead">Hola, ${CLIENT.contact.split(' ')[0]}. ${CLIENT.credit} · entrega en ${CLIENT.district}.</p></div>
      <button class="text-btn" type="button" data-logout>Cerrar sesión</button>
    </header>
    <div class="kpis">
      <div><span>Pedidos este mes</span><b>3</b></div>
      <div><span>En camino</span><b>1</b></div>
      <div><span>Saldo por pagar</span><b>${money(1287.6)}</b></div>
      <div><span>Próximo vencimiento</span><b>18 oct</b></div>
    </div>
    <h2 class="block-title">Pedidos</h2>
    <ul class="orders">
      ${CLIENT.orders.map((o) => {
        const lines = o.items.map(([id, q]) => ({ p: byId(id), qty: q }));
        return `
        <li class="order-card">
          <div class="order-card__head">
            <div><b>${o.id}</b><small>${o.date}</small></div>
            <span class="status status--${statusClass[o.status]}">${o.status}</span>
            <b>${money(totals(lines).total)}</b>
          </div>
          <ul class="order-card__items">${lines.map((l) => `<li>${l.qty} × ${l.p.name}</li>`).join('')}</ul>
          <div class="order-card__actions"><button class="text-btn" type="button" data-reorder="${o.id}">Volver a pedir</button><button class="text-btn" type="button" data-invoice="${o.id}">Factura PDF</button></div>
        </li>`;
      }).join('')}
    </ul>
  </section>`;
}

function viewContact() {
  return `
  <section class="container section">
    ${crumbs([['Inicio', '#/'], ['Contacto']])}
    <header class="page-head"><h1>Sedes y visitas técnicas</h1><p class="lead">Despachamos de lunes a sábado. Para pedidos urgentes llama a la sede más cercana.</p></header>
    <div class="branches">
      ${BRANCHES.map((b) => `<article class="branch"><h2>${b.city}</h2><p>${b.address}</p><p>${b.hours}</p><a href="tel:${b.phone.replace(/\s/g, '')}">${b.phone}</a></article>`).join('')}
    </div>
    <form class="visit-form" id="visitForm">
      <h2>Agenda una visita técnica</h2>
      <div class="form-grid">
        <label>Nombre de tu panadería<input name="company" required></label>
        <label>Celular<input name="phone" required inputmode="tel" pattern="9[0-9]{8}" maxlength="9" placeholder="9XX XXX XXX"></label>
        <label>Distrito<input name="district" required></label>
        <label>¿Qué produces más?<select name="type"><option>Pan francés y del día</option><option>Panes integrales</option><option>Bollería y pastelería</option><option>Producción industrial</option></select></label>
      </div>
      <button class="pill-btn" type="submit">Solicitar visita</button>
      <p class="note" id="visitMsg" aria-live="polite"></p>
    </form>
  </section>`;
}

function viewNotFound() {
  return `<section class="container section"><div class="empty empty--page"><strong>No encontramos esa página.</strong><a class="pill-btn" href="#/">Volver al inicio</a></div></section>`;
}

/* ---------- Router ---------- */

function route() {
  const [, section = '', param] = location.hash.replace(/^#/, '').split('/');
  const views = {
    '': viewHome,
    productos: () => viewCatalog(param),
    producto: () => viewProduct(param),
    recetas: viewRecipes,
    receta: () => viewRecipe(param),
    negocios: viewBusiness,
    pedido: () => (param === 'enviado' ? viewOrderSent(sessionStorage.getItem('trigal-last') ?? 'TR-25001') : viewOrder()),
    cliente: viewClient,
    contacto: viewContact,
  };
  app.innerHTML = (views[section] ?? viewNotFound)();
  renderGrid();
  document.querySelectorAll('[data-nav]').forEach((a) => {
    const active = a.dataset.nav === (section === 'producto' ? 'productos' : section === 'receta' ? 'recetas' : section);
    a.classList.toggle('active', active);
    if (active) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  closeDrawer();
  window.scrollTo({ top: 0 });
  if (section) app.focus({ preventScroll: true });
  const h1 = app.querySelector('h1');
  document.title = `${section && h1 ? `${h1.textContent.trim()} · ` : ''}Trigal — Insumos de panificación`;
}

window.addEventListener('hashchange', route);

/* ---------- Eventos (delegados) ---------- */

app.addEventListener('click', (e) => {
  const t = e.target.closest('button');
  if (!t) return;
  if (t.dataset.add) addToOrder(t.dataset.add);
  if (t.dataset.addDetail) addToOrder(t.dataset.addDetail, Number(app.querySelector('.stepper output').textContent));
  if (t.dataset.step) {
    const out = t.parentElement.querySelector('output');
    const next = Math.max(t.dataset.step === 'detail' ? 1 : 0, Number(out.textContent) + Number(t.dataset.delta));
    if (t.dataset.step === 'detail') { out.textContent = next; return; }
    order[t.dataset.step] = next;
    if (!next) delete order[t.dataset.step];
    saveOrder(); route();
  }
  if (t.dataset.remove) { delete order[t.dataset.remove]; saveOrder(); route(); }
  if (t.id === 'clearFilters' || t.hasAttribute('data-clear')) {
    catalog.tags.clear(); catalog.doses.clear(); catalog.q = '';
    app.querySelectorAll('[data-filter]').forEach((i) => { i.checked = false; });
    const s = app.querySelector('#catalogSearch'); if (s) s.value = '';
    renderGrid();
  }
  if (t.hasAttribute('data-sheet') || t.dataset.invoice) toast('En la demo los PDF no se descargan.');
  if (t.dataset.reorder) {
    CLIENT.orders.find((o) => o.id === t.dataset.reorder).items.forEach(([id, q]) => { order[id] = (order[id] ?? 0) + q; });
    saveOrder();
    toast(`Agregamos el pedido ${t.dataset.reorder} a tu pedido actual.`, '#/pedido', 'Ver pedido');
  }
  if (t.hasAttribute('data-logout')) { session = false; store.set('trigal-session', false); route(); }
});

app.addEventListener('change', (e) => {
  const f = e.target.dataset.filter;
  if (f) { catalog[f][e.target.checked ? 'add' : 'delete'](e.target.value); renderGrid(); }
  if (e.target.id === 'catalogSort') { catalog.sort = e.target.value; renderGrid(); }
});

app.addEventListener('input', (e) => {
  if (e.target.id === 'catalogSearch') { catalog.q = e.target.value; renderGrid(); }
});

app.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  if (form.id === 'loginForm') { session = true; store.set('trigal-session', true); route(); return; }
  if (form.id === 'visitForm') {
    if (!form.reportValidity()) return;
    form.querySelector('#visitMsg').textContent = 'Listo. Un asesor te llama en las próximas 24 horas para coordinar la visita.';
    form.reset();
    return;
  }
  if (form.id === 'orderForm') {
    const error = form.querySelector('#formError');
    const invalid = [...form.elements].find((el) => el.willValidate && !el.checkValidity());
    if (invalid) {
      const label = invalid.closest('label').firstChild.textContent.trim();
      error.textContent = `Revisa el campo «${label}»${invalid.name === 'ruc' ? ': 11 dígitos que empiezan con 10 o 20' : invalid.name === 'phone' ? ': 9 dígitos que empiezan con 9' : ''}.`;
      error.hidden = false;
      invalid.focus();
      return;
    }
    const number = `TR-${25000 + Math.floor(Math.random() * 900)}`;
    try { sessionStorage.setItem('trigal-last', number); } catch { /* sin almacenamiento */ }
    order = {}; saveOrder();
    location.hash = '#/pedido/enviado';
  }
});

/* ---------- Menú móvil ---------- */

const menuBtn = document.querySelector('.menu-btn');
const drawer = document.querySelector('#drawer');

function closeDrawer() {
  drawer.hidden = true;
  menuBtn.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('drawer-open');
}

menuBtn.addEventListener('click', () => {
  const open = drawer.hidden;
  drawer.hidden = !open;
  menuBtn.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('drawer-open', open);
});

/* ---------- Búsqueda ---------- */

const search = document.querySelector('#search');
const searchInput = document.querySelector('#searchInput');
const searchResults = document.querySelector('#searchResults');

function renderSearch() {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) { searchResults.innerHTML = '<li class="hint">Prueba con «quinua», «croissant» o «frío».</li>'; return; }
  const products = PRODUCTS.filter((p) => `${p.name} ${p.desc} ${p.tags.map((t) => TAGS[t]).join(' ')}`.toLowerCase().includes(q));
  const recipes = RECIPES.filter((r) => r.name.toLowerCase().includes(q));
  searchResults.innerHTML = [...products.map((p) => `<li><a href="#/producto/${p.id}"><img src="${p.img.replace('w=900', 'w=120')}" alt=""><span>${p.name}<small>${catName(p.cat)} · ${money(p.price)}</small></span></a></li>`),
    ...recipes.map((r) => `<li><a href="#/receta/${r.id}"><img src="${r.img.replace('w=1200', 'w=120')}" alt=""><span>${r.name}<small>Receta · ${r.time}</small></span></a></li>`)].join('')
    || '<li class="hint">Sin resultados. Revisa la ortografía o mira el catálogo completo.</li>';
}

document.querySelectorAll('[data-open-search]').forEach((b) => b.addEventListener('click', () => {
  search.showModal(); searchInput.value = ''; renderSearch(); searchInput.focus();
}));
searchInput.addEventListener('input', renderSearch);
// Un solo Esc cierra la búsqueda (en Chrome el primero solo borraría el texto).
searchInput.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.preventDefault(); search.close(); } });
searchResults.addEventListener('click', (e) => { if (e.target.closest('a')) search.close(); });
search.addEventListener('click', (e) => { if (e.target === search) search.close(); });

/* ---------- Newsletter ---------- */

document.querySelector('[data-newsletter]').addEventListener('submit', (e) => {
  e.preventDefault();
  e.target.querySelector('[data-news-msg]').textContent = 'Gracias. Te llega la primera receta el próximo lunes.';
  e.target.reset();
});

/* ---------- Inicio ---------- */

saveOrder();
route();
