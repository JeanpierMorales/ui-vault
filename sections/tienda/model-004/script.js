/* StandPe — tienda editorial (SPA con hash).
   Transiciones: fundido corto entre páginas (sale hacia arriba, entra desde abajo)
   y revelado lateral en secciones. Sin velos negros ni copias flotantes. */
(() => {
  'use strict';

  /* ---------------- Datos ---------------- */
  const SHIP = 'Lima Metropolitana: 24–48 h, S/ 12. Provincias: 3–5 días hábiles, S/ 18. Gratis desde S/ 250.';
  const RETURNS = 'Tienes 15 días para cambiar talla o modelo con la etiqueta puesta. El primer cambio corre por nuestra cuenta.';
  const TOPS = ['S', 'M', 'L', 'XL'];
  const LEGS = ['28', '30', '32', '34'];

  // h/b: alto y base de la prenda en la ficha (vh). x: ajuste óptico horizontal. hm: alto en móvil (svh).
  const PRODUCTS = [
    { slug: 'casaca-denim-pana', name: 'Casaca Denim Pana', cat: 'casacas', price: 289, color: 'Índigo rinse', kind: 'flat', h: 74, b: 4, hm: 52, drop: true,
      desc: 'Denim de 14 oz con cuello de pana café y forro a cuadros. Lavado rinse: se aclara contigo.', comp: '100% algodón. Cuello de pana 100% algodón.', fit: 'Regular, hombro levemente caído.', origin: 'Cortada y cosida en La Victoria, Lima.', care: 'Lavar al revés en frío. No usar secadora.', out: [] },
    { slug: 'bomber-nylon-cobre', name: 'Bomber Nylon Cobre', cat: 'casacas', price: 259, color: 'Cobre', kind: 'flat', h: 70, b: 8, hm: 50, drop: true,
      desc: 'Nylon mate repelente al agua, puños de rib y bolsillo utilitario en la manga.', comp: '100% poliamida. Forro 100% poliéster.', fit: 'Boxy, corta a la cadera.', origin: 'Confeccionada en Lima.', care: 'Lavar a mano en frío. Secar a la sombra.', out: [] },
    { slug: 'casaca-biker-cuero', name: 'Casaca Biker Cuero', cat: 'casacas', price: 459, color: 'Café tabaco', kind: 'model', h: 84, b: 0, hm: 56, x: 2, drop: true,
      desc: 'Cuero ovino curtido en Arequipa, cierres metálicos asimétricos y hombreras.', comp: '100% cuero ovino. Forro de viscosa.', fit: 'Ajustada. Si la usas sobre polera, pide una talla más.', origin: 'Curtido en Arequipa, armado en Lima.', care: 'Limpieza en seco especializada.', out: ['XL'] },
    { slug: 'polera-naranja-senal', name: 'Polera Naranja Señal', cat: 'poleras', price: 139, color: 'Naranja', kind: 'model', h: 86, b: 0, hm: 58, x: -3, drop: true,
      desc: 'Felpa perchada de 340 g, cuello redondo y puños con rib doble.', comp: '80% algodón, 20% poliéster.', fit: 'Regular, largo a la cadera.', origin: 'Tejida en Ate, confeccionada en La Victoria.', care: 'Lavar al revés en frío.', out: [] },
    { slug: 'polera-crew-hueso', name: 'Polera Crew Hueso', cat: 'poleras', price: 149, color: 'Hueso', kind: 'flat', h: 56, b: 14, hm: 40,
      desc: 'Felpa francesa de 380 g sin perchar. Cae pesado y no se deforma.', comp: '100% algodón peinado.', fit: 'Oversize, hombro caído.', origin: 'Confeccionada en Lima.', care: 'Lavar en frío con colores claros.', out: [] },
    { slug: 'polera-rosa-polvo', name: 'Polera Rosa Polvo', cat: 'poleras', price: 139, color: 'Rosa polvo', kind: 'model', h: 88, b: 0, hm: 58, x: -2,
      desc: 'Felpa perchada con lavado enzimático que le da un tono apagado.', comp: '80% algodón, 20% poliéster.', fit: 'Relajada.', origin: 'Confeccionada en Lima.', care: 'Lavar al revés en frío.', out: ['S'] },
    { slug: 'polo-pesado-negro', name: 'Polo Pesado Negro', cat: 'polos', price: 89, color: 'Negro', kind: 'flat', h: 66, b: 8, hm: 46, drop: true,
      desc: 'Jersey de 240 g con estampado frontal en serigrafía al agua.', comp: '100% algodón pima.', fit: 'Boxy, manga al codo.', origin: 'Algodón pima de Piura, confeccionado en Lima.', care: 'Lavar al revés. No planchar el estampado.', out: [] },
    { slug: 'polo-boxy-blanco', name: 'Polo Boxy Blanco', cat: 'polos', price: 85, color: 'Blanco', kind: 'model', h: 86, b: 0, hm: 58,
      desc: 'Jersey denso de 220 g, cuello de rib angosto que no se abre.', comp: '100% algodón pima.', fit: 'Boxy.', origin: 'Algodón pima de Piura, confeccionado en Lima.', care: 'Lavar en frío con blancos.', out: [] },
    { slug: 'polo-melange-celeste', name: 'Polo Melange Celeste', cat: 'polos', price: 79, color: 'Celeste melange', kind: 'flat', h: 54, b: 16, hm: 40,
      desc: 'Jersey melange liviano para el verano limeño.', comp: '60% algodón, 40% poliéster.', fit: 'Regular.', origin: 'Confeccionado en Lima.', care: 'Lavar en frío.', out: ['S'] },
    { slug: 'jean-recto-indigo', name: 'Jean Recto Índigo', cat: 'pantalones', price: 199, color: 'Índigo oscuro', kind: 'flat', h: 82, b: 2, hm: 56, drop: true, sizes: LEGS,
      desc: 'Denim crudo de 13 oz, tiro medio y pierna recta. Botones remachados.', comp: '100% algodón.', fit: 'Recto, tiro medio.', origin: 'Cortado y lavado en Lima.', care: 'Lavar poco y al revés.', out: ['34'] },
    { slug: 'jogger-sastre-rosa', name: 'Jogger Sastre Rosa', cat: 'pantalones', price: 169, color: 'Rosa', kind: 'model', h: 86, b: 0, hm: 58, sizes: LEGS,
      desc: 'Pantalón de sastre con cintura elástica y basta con puño.', comp: '68% poliéster, 30% viscosa, 2% elastano.', fit: 'Relajado arriba, ajustado al tobillo.', origin: 'Confeccionado en Lima.', care: 'Lavar a mano. Planchar a temperatura baja.', out: [] },
    { slug: 'gorra-lavada-grafito', name: 'Gorra Lavada Grafito', cat: 'accesorios', price: 69, color: 'Grafito', kind: 'flat', h: 28, b: 30, hm: 22, sizes: ['Única'],
      desc: 'Drill lavado de seis paneles con bordado tono sobre tono.', comp: '100% algodón.', fit: 'Ajuste con hebilla metálica.', origin: 'Hecha en Lima.', care: 'Lavar a mano.', out: [] },
    { slug: 'zapatilla-runner-03', name: 'Zapatilla Runner 03', cat: 'accesorios', price: 329, color: 'Arena multicolor', kind: 'flat', h: 46, b: 18, hm: 32, drop: true, sizes: ['39', '40', '41', '42', '43'],
      desc: 'Capellada de malla y gamuza, suela de EVA de doble densidad.', comp: 'Malla, gamuza y EVA.', fit: 'Horma normal.', origin: 'Fabricada en Trujillo.', care: 'Limpiar con paño húmedo.', out: ['39'] }
  ];
  const CATS = [
    { id: 'casacas', name: 'Casacas' },
    { id: 'poleras', name: 'Poleras' },
    { id: 'polos', name: 'Polos' },
    { id: 'pantalones', name: 'Pantalones' },
    { id: 'accesorios', name: 'Accesorios' }
  ];
  const bySlug = Object.fromEntries(PRODUCTS.map((p) => [p.slug, p]));
  const sizesOf = (p) => p.sizes || TOPS;
  const img = (p) => `img/${p.slug}.webp`;
  const money = (n) => 'S/ ' + n.toLocaleString('es-PE');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------------- Utilidades ---------------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const store = {
    get(k, f) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f; } catch { return f; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sin almacenamiento */ } }
  };
  const announce = (t) => { const a = $('#announcer'); a.textContent = ''; setTimeout(() => { a.textContent = t; }, 30); };

  /* ---------------- Transición entre páginas ---------------- */
  const EASE_OUT = 'cubic-bezier(.65,0,.35,1)';
  const EASE_IN = 'cubic-bezier(.16,1,.3,1)';
  const foot = $('#foot');

  function leave() {
    const kf = [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-10px)' }];
    return Promise.all([view, foot].map((el) => el.animate(kf, { duration: 300, easing: EASE_OUT, fill: 'forwards' }).finished));
  }

  function enter() {
    const kf = [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }];
    [view, foot].forEach((el) => {
      el.getAnimations().forEach((a) => a.cancel());
      el.animate(kf, { duration: 700, easing: EASE_IN });
    });
  }

  /* ---------------- Plantillas ---------------- */
  function piece(p, i = 0, eager = false) {
    const left = sizesOf(p).length - p.out.length;
    const note = p.out.length ? `${p.color} · quedan ${left} tallas` : p.color;
    return `
      <a class="piece" href="#/p/${p.slug}" style="--d:${i * 60}ms">
        <div class="piece-stage"><img src="${img(p)}" alt="${esc(p.name)}" data-kind="${p.kind}" loading="${eager ? 'eager' : 'lazy'}" decoding="async" /></div>
        <div class="piece-meta"><span>${esc(p.name)}</span><span>${money(p.price)}</span></div>
        <p class="piece-sub">${esc(note)}</p>
      </a>`;
  }

  const arrow = (d) => `<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="${d === 'l' ? 'M9 2 4 7l5 5' : 'M5 2l5 5-5 5'}"/></svg>`;

  // Fotos del hero: rotan solas (se detienen con el botón, con el foco dentro o con movimiento reducido).
  const HERO = [
    { src: 'img/hero.webp', pos: '62% 50%', alt: 'Dos personas con polera oscura bajo una luz cálida, frente a una reja metálica' },
    { src: 'img/campana-2.webp', pos: '50% 6%', alt: 'Chico con polera rosa polvo y jean apoyado en un contenedor' },
    { src: 'img/orig/casaca-biker-cuero.webp', pos: '50% 12%', alt: 'Hombre con casaca biker de cuero café y lentes oscuros' },
    { src: 'img/orig/polo-boxy-blanco.webp', pos: '50% 8%', alt: 'Chico con polo boxy blanco y gorra en un parque' },
    { src: 'img/orig/casaca-denim-pana.webp', pos: '50% 30%', alt: 'Casaca denim con cuello de pana colgada sobre fondo negro' }
  ];
  const pad2 = (n) => String(n).padStart(2, '0');

  const TOP = ['polo-pesado-negro', 'polera-naranja-senal', 'jean-recto-indigo', 'casaca-denim-pana'];
  const GENTE = [
    { src: 'img/gente/1.webp', alt: 'Chico con casaca de corderito y lentes redondos en la calle' },
    { src: 'img/gente/2.webp', alt: 'Chica con casaca puffer amarilla frente a una pared roja' },
    { src: 'img/gente/3.webp', alt: 'Chico con casaca negra y amarilla frente a afiches' },
    { src: 'img/gente/4.webp', alt: 'Chico con polo blanco y gorra, en blanco y negro' },
    { src: 'img/gente/5.webp', alt: 'Dos amigos caminando con una tabla de skate' },
    { src: 'img/gente/6.webp', alt: 'Persona con polo negro estampado en un pasillo oscuro' }
  ];

  const FACTS = [
    { label: 'Lima Metropolitana', value: '24–48 h', detail: 'Envío S/ 12. Gratis desde S/ 250.',
      icon: '<path d="M2 6h11v9H2zM13 9h4l3 3v3h-7"/><circle cx="6" cy="17" r="1.8"/><circle cx="17" cy="17" r="1.8"/>' },
    { label: 'Provincias', value: '3–5 días', detail: 'Hábiles, a todo el Perú. Envío S/ 18.',
      icon: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>' },
    { label: 'Cambios', value: '15 días', detail: 'El primer cambio de talla va por nuestra cuenta.',
      icon: '<path d="M4 9a8 8 0 0 1 14-3l2 2M20 4v4h-4M20 15a8 8 0 0 1-14 3l-2-2M4 20v-4h4"/>' },
    { label: 'Pagos', value: 'Yape o Plin', detail: 'También Visa y Mastercard.',
      icon: '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M2.5 10h19M6 15h4"/>' }
  ];

  // Tira de la campaña: cada foto lleva a su prenda.
  const CAMPAIGN = [
    { slug: 'casaca-biker-cuero', src: 'img/campana.webp', pos: '50% 30%', alt: 'Chico con casaca de cuero negra apoyado en una pared de ladrillo' },
    { slug: 'polera-naranja-senal', src: 'img/orig/polera-naranja-senal.webp', pos: '50% 20%', alt: 'Chica con polera naranja y jean' },
    { slug: 'jogger-sastre-rosa', src: 'img/orig/jogger-sastre-rosa.webp', pos: '50% 60%', alt: 'Jogger sastre rosa con sandalias' },
    { slug: 'zapatilla-runner-03', src: 'img/orig/zapatilla-runner-03.webp', pos: '50% 50%', alt: 'Par de zapatillas runner arena multicolor' },
    { slug: 'bomber-nylon-cobre', src: 'img/orig/bomber-nylon-cobre.webp', pos: '50% 40%', alt: 'Bomber de nylon cobre colgada en un gancho' }
  ];

  function homeView() {
    const drop = PRODUCTS.filter((p) => p.drop);
    return `
      <section class="hero" aria-label="Drop 07">
        <div class="hero-media" id="hero-media">
          ${HERO.map((h, i) => `<img class="hero-slide${i ? '' : ' is-on'}" src="${h.src}" alt="${esc(h.alt)}" style="object-position:${h.pos}" ${i ? 'loading="lazy" aria-hidden="true"' : 'fetchpriority="high"'} />`).join('')}
        </div>
        <h1 class="hero-mark">StandPe</h1>
        <div class="hero-foot">
          <div class="hero-drop">
            <p class="hero-in" style="--d:150ms">Drop 07 · Otoño en Lima</p>
            <p class="hero-in" style="--d:220ms">Ya disponible, 120 piezas por modelo</p>
            <a class="btn btn--light hero-in" style="--d:300ms" href="#/catalogo">Ver el drop</a>
          </div>
          <div class="hero-side hero-in" style="--d:380ms">
            <p class="hero-note">Envío gratis desde S/ 250<br />a todo el Perú</p>
            <div class="hero-ctrl">
              <span class="hero-count" id="hero-count" aria-hidden="true">01 / ${pad2(HERO.length)}</span>
              <span class="hero-bar" aria-hidden="true"><i id="hero-bar"></i></span>
              <button class="hero-pause" id="hero-pause" type="button" aria-pressed="false" aria-label="Pausar fotos de portada">
                <svg viewBox="0 0 14 14" aria-hidden="true"><path class="i-pause" d="M4 2.5v9M10 2.5v9" stroke="currentColor" stroke-width="1.6" fill="none"/><path class="i-play" d="M4 2.5l8 4.5-8 4.5z" fill="currentColor"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section class="section" aria-labelledby="drop-title">
        <div class="section-head">
          <h2 class="title-xl" id="drop-title" data-reveal>Drop 07</h2>
          <div class="rail-ctrl" data-reveal="right">
            <a class="link-btn" href="#/catalogo">Ver catálogo</a>
            <button class="rail-btn" type="button" data-rail="-1" aria-label="Anterior">${arrow('l')}</button>
            <button class="rail-btn" type="button" data-rail="1" aria-label="Siguiente">${arrow('r')}</button>
          </div>
        </div>
        <div class="rail" id="rail" data-reveal>
          ${drop.map((p) => piece(p, 0, true)).join('')}
        </div>
      </section>

      <section class="section" aria-labelledby="index-title" style="padding-top:0">
        <div class="section-head">
          <h2 class="title-xl" id="index-title" data-reveal>Por prenda</h2>
          <p class="lede" data-reveal="right">Cinco líneas, pocas piezas por línea. Lo que se agota no vuelve igual.</p>
        </div>
        <div class="index" id="index">
          ${CATS.map((c, i) => {
            const items = PRODUCTS.filter((p) => p.cat === c.id);
            return `<a class="index-row" href="#/catalogo?c=${c.id}" data-img="${img(items[0])}" data-from="${money(Math.min(...items.map((p) => p.price)))}" data-reveal style="--d:${i * 70}ms">
              <img class="index-thumb" src="${img(items[0])}" alt="" loading="lazy" />
              <span class="index-name">${c.name}</span>
              <span class="index-count">${items.length} piezas</span>
            </a>`;
          }).join('')}
          <div class="index-preview" id="index-preview" aria-hidden="true">
            <img alt="" /><img alt="" />
            <p class="index-from"></p>
          </div>
        </div>
      </section>

      <section class="section top-list" aria-labelledby="top-title" style="padding-top:0">
        <div class="top-list-head" data-reveal>
          <h2 class="title-xl" id="top-title">Lo más pedido</h2>
          <p class="lede">Las cuatro piezas que más salieron este mes en Lima.</p>
        </div>
        <ol class="rank">
          ${TOP.map((slug, i) => { const p = bySlug[slug]; const left = sizesOf(p).length - p.out.length; return `
          <li data-reveal="right" style="--d:${i * 80}ms">
            <a class="rank-row" href="#/p/${p.slug}">
              <span class="rank-n">${pad2(i + 1)}</span>
              <span class="rank-img"><img src="${img(p)}" alt="" loading="lazy" /></span>
              <span class="rank-name">${esc(p.name)}<small>${esc(p.color)}${p.out.length ? ` · quedan ${left} tallas` : ''}</small></span>
              <span class="rank-price">${money(p.price)}</span>
              <span class="rank-go" aria-hidden="true">${arrow('r')}</span>
            </a>
          </li>`; }).join('')}
        </ol>
      </section>

      <section class="campaign" id="campaign" aria-labelledby="camp-title">
        <div class="campaign-copy">
          <h2 class="title-xl" id="camp-title">Tiradas cortas, hechas a dos cuadras.</h2>
          <p>Cortamos 120 piezas por modelo en nuestro taller de La Victoria. Cuando se acaban, pasamos al siguiente drop.</p>
          <a class="btn btn--light" href="#/catalogo">Ver el drop completo</a>
        </div>
        <div class="campaign-strip" id="camp-strip">
          <div class="campaign-track" id="camp-track">
            ${CAMPAIGN.map((c) => { const p = bySlug[c.slug]; return `
            <a class="camp-card" href="#/p/${p.slug}">
              <img src="${c.src}" alt="${esc(c.alt)}" style="object-position:${c.pos}" loading="lazy" decoding="async" />
              <span class="camp-cap"><span>${esc(p.name)}</span><span>${money(p.price)}</span></span>
            </a>`; }).join('')}
          </div>
        </div>
      </section>

      <section class="section workshop" aria-labelledby="shop-title">
        <figure class="workshop-photo" data-reveal>
          <img src="img/taller.webp" alt="Manos guiando una tela oscura bajo la aguja de una máquina de coser" loading="lazy" />
        </figure>
        <div class="workshop-copy" data-reveal="right">
          <h2 class="title-xl" id="shop-title">Hecho en La Victoria.</h2>
          <p class="lede">Catorce personas cortan, cosen y revisan cada pieza a dos cuadras de Gamarra. Por eso hacemos pocas y no las repetimos.</p>
          <dl class="workshop-data">
            <div><dt>Piezas por modelo</dt><dd>120</dd></div>
            <div><dt>Días del corte a la tienda</dt><dd>6</dd></div>
            <div><dt>Algodón peruano</dt><dd>100%</dd></div>
          </dl>
          <img class="workshop-detail" src="img/taller-2.webp" alt="Pantalón a rayas pasando por una máquina de coser industrial" loading="lazy" />
        </div>
      </section>

      <section class="section" aria-labelledby="facts-title">
        <h2 class="sr-only" id="facts-title">Cómo compras en StandPe</h2>
        <dl class="facts">
          ${FACTS.map((f, i) => `
          <div class="fact" data-reveal style="--d:${i * 80}ms">
            <svg class="fact-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${f.icon}</svg>
            <dt>${f.label}</dt>
            <dd><strong>${f.value}</strong><span>${f.detail}</span></dd>
          </div>`).join('')}
        </dl>
      </section>

      <section class="section gente" aria-labelledby="gente-title" style="padding-top:0">
        <div class="section-head">
          <h2 class="title-xl" id="gente-title" data-reveal>Así lo usan</h2>
          <a class="btn btn--line" href="https://www.instagram.com/" target="_blank" rel="noopener" data-reveal="right">Síguenos en Instagram</a>
        </div>
        <div class="gente-grid">
          ${GENTE.map((g, i) => `<figure data-reveal style="--d:${(i % 3) * 80}ms"><img src="${g.src}" alt="${esc(g.alt)}" loading="lazy" decoding="async" /></figure>`).join('')}
        </div>
      </section>

      <section class="section join" aria-labelledby="join-title" style="padding-top:0">
        <div data-reveal>
          <h2 class="title-xl" id="join-title">Avísame del próximo drop.</h2>
          <p class="join-lede">Cada drop es una tirada corta: 120 piezas por modelo que no se reponen. El <strong>Drop 08</strong> sale el sábado 24 de octubre.</p>
        </div>
        <div data-reveal="right">
          <form class="join-form" id="join-form" novalidate>
            <label for="join-email">Te avisamos 24 h antes de que salga</label>
            <input id="join-email" name="email" type="email" autocomplete="email" placeholder="tu@correo.pe" required />
            <button class="btn" type="submit">Suscribirme</button>
          </form>
          <p class="join-msg" id="join-msg" role="status"></p>
        </div>
      </section>`;
  }

  function catalogView(cat) {
    return `
      <div class="cat-head">
        <h1 class="title-xl" data-reveal>Catálogo</h1>
      </div>
      <div class="cat-bar">
        <div class="filters" role="group" aria-label="Filtrar por prenda">
          <button class="filter" type="button" data-cat="todo" aria-pressed="${cat === 'todo'}">Todo</button>
          ${CATS.map((c) => `<button class="filter" type="button" data-cat="${c.id}" aria-pressed="${cat === c.id}">${c.name}</button>`).join('')}
        </div>
        <label class="sort">Ordenar
          <select id="sort">
            <option value="drop">Drop 07 primero</option>
            <option value="asc">Precio: menor a mayor</option>
            <option value="desc">Precio: mayor a menor</option>
          </select>
        </label>
      </div>
      <div class="grid" id="grid" aria-live="polite"></div>`;
  }

  function productView(p) {
    const sizes = sizesOf(p);
    const single = sizes.length === 1;
    const accs = [
      ['Detalles', `${p.desc} ${p.comp}`],
      ['Envío', SHIP],
      ['Cambios y devoluciones', RETURNS]
    ];
    const related = PRODUCTS.filter((q) => q.cat === p.cat && q.slug !== p.slug)
      .concat(PRODUCTS.filter((q) => q.cat !== p.cat && q.drop))
      .slice(0, 4);
    const seen = store.get('standpe-seen', []).filter((s) => s !== p.slug && bySlug[s]).slice(0, 4);
    return `
      <section class="pdp" aria-labelledby="pdp-title">
        <div class="pdp-stage-m">
          <img class="pdp-visual" id="pdp-visual" src="${img(p)}" alt="${esc(p.name)}, ${esc(p.color)}" style="--h:${p.h}vh;--b:${p.b}vh;--x:${p.x || 0}%;--hm:${p.hm}svh" />
          <div class="lens" id="lens" aria-hidden="true"></div>
          <button class="zoom-btn" id="zoom-open" type="button">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5"/><path d="M12.5 12.5 17 17M8.5 6v5M6 8.5h5"/></svg>
            Ver de cerca
          </button>
        </div>
        <div class="pdp-info">
          <div class="pdp-head">
            <p class="pdp-crumb"><a href="#/catalogo?c=${p.cat}">${CATS.find((c) => c.id === p.cat).name}</a></p>
            <h1 class="pdp-title" id="pdp-title">${esc(p.name)}</h1>
          </div>
          <div class="acc">
            ${accs.map(([t, body], i) => `
              <div class="acc-item">
                <button class="acc-btn" type="button" aria-expanded="false" aria-controls="acc-${i}" id="accb-${i}">${t}<span class="pm" aria-hidden="true"></span></button>
                <div class="acc-panel" id="acc-${i}" role="region" aria-labelledby="accb-${i}"><div><p>${esc(body)}</p></div></div>
              </div>`).join('')}
          </div>
        </div>
        <div class="pdp-actions">
          <p class="buy-price">${money(p.price)}</p>
          <p class="buy-color">${esc(p.color)}${p.out.length ? ` · quedan ${sizesOf(p).length - p.out.length} tallas` : ''}</p>
          <p class="sizes-label" id="sizes-label"><span>Talla</span>${single ? '<span>Talla única</span>' : '<button class="guide-btn" type="button" id="guide-open">Guía de tallas</button>'}</p>
          <div class="sizes" role="radiogroup" aria-labelledby="sizes-label">
            ${sizes.map((s) => {
              const off = p.out.includes(s);
              return `<button class="size" type="button" role="radio" data-size="${s}" aria-checked="${single}" ${off ? 'aria-disabled="true" aria-label="' + s + ', agotada"' : ''}>${s}</button>`;
            }).join('')}
          </div>
          <button class="add" type="button" id="add">Agregar a la bolsa — ${money(p.price)}</button>
          <p class="add-hint" id="add-hint" role="status"></p>
          <ul class="buy-facts">
            <li><svg viewBox="0 0 24 24" aria-hidden="true">${FACTS[0].icon}</svg><span>Lima en 24–48 h · <b>gratis desde S/ 250</b></span></li>
            <li><svg viewBox="0 0 24 24" aria-hidden="true">${FACTS[2].icon}</svg><span>15 días para cambiar talla</span></li>
            <li><svg viewBox="0 0 24 24" aria-hidden="true">${FACTS[3].icon}</svg><span>Yape, Plin, Visa o Mastercard</span></li>
          </ul>
        </div>
        <p class="pdp-scroll" aria-hidden="true">Desliza para ver más</p>
      </section>

      <div class="buybar" id="buybar" aria-hidden="true">
        <img src="${img(p)}" alt="" />
        <p><span>${esc(p.name)}</span><span>${money(p.price)}</span></p>
        <button class="btn" type="button" id="buybar-go" tabindex="-1">Elegir talla</button>
      </div>

      ${single ? '' : `<dialog class="guide" id="guide" aria-labelledby="guide-title">
        <div class="guide-head"><h2 id="guide-title">Guía de tallas</h2><button class="link-btn" type="button" id="guide-close">Cerrar</button></div>
        <p class="guide-tip">${p.cat === 'pantalones' ? 'Mide tu cintura sobre el ombligo y compárala con la de la tabla. Las tallas van en pulgadas.' : 'Extiende un polo que te quede bien y mide de axila a axila: ese es el pecho (ancho).'}</p>
        ${measures(p)}
        <p class="guide-tip">${esc(p.fit)}</p>
      </dialog>`}

      <dialog class="zoom" id="zoom" aria-label="${esc(p.name)} de cerca">
        <button class="zoom-close" type="button" id="zoom-close">Cerrar</button>
        <img src="${img(p)}" alt="${esc(p.name)}, ${esc(p.color)}, ampliada" />
      </dialog>

      <section class="section detail" aria-label="Ficha técnica">
        <div class="detail-photo" data-reveal><img src="img/orig/${p.slug}.webp" alt="${esc(p.name)} fotografiada en uso" loading="lazy" /></div>
        <div data-reveal="right">
          <h2 class="title-xl" style="margin-bottom:32px">Ficha</h2>
          <dl class="spec">
            <div><dt>Composición</dt><dd>${esc(p.comp)}</dd></div>
            <div><dt>Corte</dt><dd>${esc(p.fit)}</dd></div>
            <div><dt>Origen</dt><dd>${esc(p.origin)}</dd></div>
            <div><dt>Cuidado</dt><dd>${esc(p.care)}</dd></div>
          </dl>
          ${measures(p)}
        </div>
      </section>

      <section class="section faq" aria-labelledby="faq-title" style="padding-top:0">
        <h2 class="title-xl" id="faq-title" data-reveal>Preguntas rápidas</h2>
        <div class="faq-list" data-reveal="right">
          ${[
            ['¿Cuándo me llega?', SHIP],
            ['¿Y si no me queda?', RETURNS],
            ['¿Cómo la cuido?', p.care],
            ['¿Puedo verla antes de comprar?', 'Sí. Está en el showroom de Av. Petit Thouars 5240, Miraflores, de lunes a sábado de 11:00 a 20:00. También puedes recoger ahí tu pedido sin costo.']
          ].map(([q, a]) => `<details><summary>${q}<span class="pm" aria-hidden="true"></span></summary><p>${esc(a)}</p></details>`).join('')}
        </div>
      </section>

      <section class="section" aria-labelledby="rel-title" style="padding-top:0">
        <div class="section-head"><h2 class="title-xl" id="rel-title" data-reveal>Combínalo con</h2></div>
        <div class="rail" data-reveal>${related.map((q) => piece(q, 0, true)).join('')}</div>
      </section>
      ${seen.length ? `
      <section class="section" aria-labelledby="seen-title" style="padding-top:0">
        <div class="section-head"><h2 class="title-xl" id="seen-title" data-reveal>Viste hace poco</h2></div>
        <div class="rail" data-reveal>${seen.map((s) => piece(bySlug[s])).join('')}</div>
      </section>` : ''}`;
  }

  function measures(p) {
    if (p.cat === 'accesorios') return '';
    const legs = p.cat === 'pantalones';
    const rowsData = legs
      ? [['28', 72, 102], ['30', 77, 104], ['32', 82, 106], ['34', 87, 108]]
      : [['S', 54, 68], ['M', 57, 70], ['L', 60, 72], ['XL', 63, 74]];
    return `
      <table class="measures">
        <caption>Medidas de la prenda en cm</caption>
        <thead><tr><th scope="col">Talla</th><th scope="col">${legs ? 'Cintura' : 'Pecho (ancho)'}</th><th scope="col">Largo</th></tr></thead>
        <tbody>${rowsData.map((r) => `<tr><th scope="row">${r[0]}</th><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</tbody>
      </table>`;
  }

  function contactView() {
    return `
      <section class="contact" aria-labelledby="contact-title">
        <div>
          <h1 class="title-xl" id="contact-title" data-reveal>Escríbenos o pasa por el showroom.</h1>
          <dl class="contact-list" data-reveal style="--d:120ms">
            <div><dt>Showroom</dt><dd>Av. Petit Thouars 5240, Miraflores</dd></div>
            <div><dt>Horario</dt><dd>Lunes a sábado, 11:00 a 20:00</dd></div>
            <div><dt>WhatsApp</dt><dd><a href="https://wa.me/51987654321" target="_blank" rel="noopener">+51 987 654 321</a></dd></div>
            <div><dt>Correo</dt><dd><a href="mailto:hola@standpe.pe">hola@standpe.pe</a></dd></div>
            <div><dt>Mayoristas</dt><dd>Pedidos desde 24 piezas por modelo</dd></div>
          </dl>
        </div>
        <form class="form" id="contact-form" novalidate data-reveal="right">
          <div class="field"><label for="c-name">Nombre</label><input id="c-name" name="name" autocomplete="name" required /><span class="field-err" id="c-name-err"></span></div>
          <div class="field"><label for="c-mail">Correo o WhatsApp</label><input id="c-mail" name="contact" autocomplete="email" required /><span class="field-err" id="c-mail-err"></span></div>
          <div class="field"><label for="c-msg">Mensaje</label><textarea id="c-msg" name="message" rows="4" required></textarea><span class="field-err" id="c-msg-err"></span></div>
          <div><button class="btn" type="submit">Enviar mensaje</button></div>
          <p class="form-msg" id="form-msg" role="status"></p>
        </form>
      </section>`;
  }

  /* ---------------- Checkout ---------------- */
  const DISTRICTS = ['Barranco', 'Breña', 'Chorrillos', 'Jesús María', 'La Molina', 'La Victoria', 'Lince', 'Los Olivos', 'Magdalena del Mar', 'Miraflores', 'Pueblo Libre', 'San Borja', 'San Isidro', 'San Juan de Lurigancho', 'San Miguel', 'Santiago de Surco', 'Surquillo', 'Cercado de Lima', 'Callao'];
  const REGIONS = ['Amazonas', 'Áncash', 'Apurímac', 'Arequipa', 'Ayacucho', 'Cajamarca', 'Cusco', 'Huancavelica', 'Huánuco', 'Ica', 'Junín', 'La Libertad', 'Lambayeque', 'Loreto', 'Madre de Dios', 'Moquegua', 'Pasco', 'Piura', 'Puno', 'San Martín', 'Tacna', 'Tumbes', 'Ucayali'];
  const SHIPPING = {
    lima: { name: 'Delivery en Lima', when: '24–48 h', cost: 12 },
    prov: { name: 'Envío a provincias', when: '3–5 días hábiles', cost: 18 },
    tienda: { name: 'Recojo en el showroom', when: 'Listo mañana desde las 11:00', cost: 0 }
  };
  const PAYS = {
    yape: { name: 'Yape', note: 'Al confirmar te mostramos el QR y el número. Tienes 30 minutos para pagar.' },
    plin: { name: 'Plin', note: 'Al confirmar te mostramos el QR y el número. Tienes 30 minutos para pagar.' },
    card: { name: 'Tarjeta', note: 'Visa o Mastercard. Pagas en la pasarela segura del banco; aquí no guardamos tu tarjeta.' }
  };
  const ICON = {
    lima: FACTS[0].icon,
    prov: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    tienda: '<path d="M3 9l1.5-5h15L21 9M3 9h18v11H3zM3 9c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3M10 20v-5h4v5"/>',
    yape: '<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
    plin: '<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
    card: FACTS[3].icon
  };
  const ico = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[k]}</svg>`;
  const subtotal = () => bag.reduce((n, l) => n + bySlug[l.slug].price * l.qty, 0);
  const shipCost = (m, sub) => (m === 'tienda' || sub >= FREE ? 0 : SHIPPING[m].cost);
  const field = (id, label, attrs = '', hint = '') => `
    <div class="field">
      <label for="${id}">${label}</label>
      <input id="${id}" name="${id}" ${attrs} aria-describedby="${id}-err${hint ? ` ${id}-hint` : ''}" />
      ${hint ? `<span class="field-hint" id="${id}-hint">${hint}</span>` : ''}
      <span class="field-err" id="${id}-err"></span>
    </div>`;

  function checkoutView() {
    if (!bag.length) {
      return `
      <section class="co co-empty">
        <h1 class="title-xl">Tu bolsa está vacía.</h1>
        <p class="lede">Agrega algo del Drop 07 y vuelve aquí para pagar.</p>
        <a class="btn" href="#/catalogo">Ver catálogo</a>
      </section>`;
    }
    const opt = (group, k, o, extra) => `
      <label class="opt">
        <input type="radio" name="${group}" value="${k}" ${k === Object.keys(group === 'ship' ? SHIPPING : PAYS)[0] ? 'checked' : ''} />
        <span class="opt-ico">${ico(k)}</span>
        <span class="opt-text"><strong>${o.name}</strong><span>${extra}</span></span>
        <span class="opt-side" data-ship-cost="${group === 'ship' ? k : ''}"></span>
      </label>`;
    return `
      <section class="co" aria-labelledby="co-title">
        <div class="co-main">
          <a class="co-back" href="#/catalogo">${arrow('l')} Seguir comprando</a>
          <h1 class="title-xl" id="co-title">Finalizar compra</h1>
          <form id="co-form" novalidate>
            <fieldset class="co-block">
              <legend><span>1</span> Contacto</legend>
              <div class="co-grid">
                ${field('co-name', 'Nombre y apellido', 'autocomplete="name" required')}
                ${field('co-phone', 'Celular (WhatsApp)', 'type="tel" inputmode="tel" autocomplete="tel" placeholder="987 654 321" required', 'Te escribimos por aquí cuando salga tu pedido.')}
                <div class="co-full">${field('co-mail', 'Correo', 'type="email" autocomplete="email" placeholder="tu@correo.pe" required', 'Te mandamos la boleta y el seguimiento.')}</div>
              </div>
            </fieldset>

            <fieldset class="co-block">
              <legend><span>2</span> Entrega</legend>
              <div class="opts">
                ${Object.entries(SHIPPING).map(([k, o]) => opt('ship', k, o, o.when)).join('')}
              </div>
              <div class="co-grid co-addr" data-for="lima">
                <div class="field">
                  <label for="co-district">Distrito</label>
                  <select id="co-district" name="co-district" aria-describedby="co-district-err"><option value="">Elige tu distrito</option>${DISTRICTS.map((d) => `<option>${d}</option>`).join('')}</select>
                  <span class="field-err" id="co-district-err"></span>
                </div>
                ${field('co-street', 'Dirección', 'autocomplete="street-address" placeholder="Av. Arequipa 1234, dpto. 502"')}
                <div class="co-full">${field('co-ref', 'Referencia (opcional)', 'placeholder="Frente al parque, portón negro"')}</div>
              </div>
              <div class="co-grid co-addr" data-for="prov" hidden>
                <div class="field">
                  <label for="co-region">Departamento</label>
                  <select id="co-region" name="co-region" aria-describedby="co-region-err"><option value="">Elige tu departamento</option>${REGIONS.map((d) => `<option>${d}</option>`).join('')}</select>
                  <span class="field-err" id="co-region-err"></span>
                </div>
                ${field('co-city', 'Ciudad', 'autocomplete="address-level2" placeholder="Trujillo"')}
                <div class="co-full">${field('co-pstreet', 'Dirección o agencia de Shalom', 'placeholder="Jr. Pizarro 450 o agencia Shalom Centro"')}</div>
              </div>
              <div class="co-addr co-pickup" data-for="tienda" hidden>
                <p><strong>Showroom StandPe</strong> · Av. Petit Thouars 5240, Miraflores</p>
                <p>Lunes a sábado, 11:00 a 20:00. Trae tu DNI y el número de pedido.</p>
              </div>
            </fieldset>

            <fieldset class="co-block">
              <legend><span>3</span> Pago</legend>
              <div class="opts opts--3">
                ${Object.entries(PAYS).map(([k, o]) => opt('pay', k, o, k === 'card' ? 'Visa · Mastercard' : 'Al instante')).join('')}
              </div>
              <p class="co-paynote" id="co-paynote">${PAYS.yape.note}</p>
              <div class="co-doc">
                <div class="seg" role="radiogroup" aria-label="Comprobante">
                  <label><input type="radio" name="doc" value="boleta" checked /><span>Boleta</span></label>
                  <label><input type="radio" name="doc" value="factura" /><span>Factura</span></label>
                </div>
                <div class="co-grid">
                  <div data-doc="boleta">${field('co-dni', 'DNI', 'inputmode="numeric" maxlength="8" placeholder="8 dígitos"')}</div>
                  <div data-doc="factura" hidden>${field('co-ruc', 'RUC', 'inputmode="numeric" maxlength="11" placeholder="11 dígitos"')}</div>
                  <div data-doc="factura" hidden>${field('co-biz', 'Razón social', 'autocomplete="organization"')}</div>
                </div>
              </div>
              <label class="co-check"><input type="checkbox" id="co-terms" aria-describedby="co-terms-err" /><span>Acepto los <a href="#/contacto">términos</a> y la <a href="#/contacto">política de cambios</a>.</span></label>
              <span class="field-err" id="co-terms-err"></span>
            </fieldset>

            <button class="btn co-submit" type="submit" id="co-submit">Confirmar pedido</button>
            <p class="co-demo">Demo: no se hace ningún cobro.</p>
          </form>
        </div>

        <aside class="co-summary" aria-labelledby="co-sum-title">
          <h2 id="co-sum-title">Tu pedido</h2>
          <div class="co-lines" id="co-lines"></div>
          <form class="co-code" id="co-code" novalidate>
            <label for="co-code-in" class="sr-only">Código de descuento</label>
            <input id="co-code-in" placeholder="Código de descuento" autocomplete="off" aria-describedby="co-code-msg" />
            <button class="btn btn--line" type="submit">Aplicar</button>
          </form>
          <p class="co-code-msg" id="co-code-msg" role="status"></p>
          <div class="co-totals" id="co-totals"></div>
          <ul class="buy-facts">
            <li><svg viewBox="0 0 24 24" aria-hidden="true">${FACTS[2].icon}</svg><span>Cambios gratis por 15 días</span></li>
            <li>${ico('card')}<span>Pago seguro, no guardamos tu tarjeta</span></li>
          </ul>
        </aside>
      </section>`;
  }

  function bindCheckout() {
    const form = $('#co-form');
    if (!form) return;
    let discount = 0;
    const ship = () => form.querySelector('input[name="ship"]:checked').value;
    const draw = () => {
      if (!bag.length) { render(parse('#/checkout')); return; }
      const sub = subtotal();
      const off = Math.round(sub * discount);
      const cost = shipCost(ship(), sub - off);
      const total = sub - off + cost;
      $('#co-lines').innerHTML = bag.map((l, i) => { const p = bySlug[l.slug]; return `
        <div class="co-line">
          <div class="co-line-img"><img src="${img(p)}" alt="" /><span class="co-qty-badge">${l.qty}</span></div>
          <div class="co-line-txt">
            <p>${esc(p.name)}</p>
            <p class="muted">Talla ${esc(l.size)} · ${esc(p.color)} · ${money(p.price)} c/u</p>
            <div class="qty" role="group" aria-label="Cantidad de ${esc(p.name)}">
              <button type="button" data-cq="-1" data-i="${i}" aria-label="Quitar una">−</button><span>${l.qty}</span><button type="button" data-cq="1" data-i="${i}" aria-label="Agregar una">+</button>
            </div>
          </div>
          <p class="co-line-price">${money(p.price * l.qty)}</p>
        </div>`; }).join('');
      const left = Math.max(0, FREE - (sub - off));
      $('#co-totals').innerHTML = `
        <div class="bag-row"><span>Subtotal (${count()} ${count() === 1 ? 'pieza' : 'piezas'})</span><span>${money(sub)}</span></div>
        ${off ? `<div class="bag-row co-off"><span>Descuento STAND10</span><span>− ${money(off)}</span></div>` : ''}
        <div class="bag-row"><span>${SHIPPING[ship()].name}</span><span>${cost ? money(cost) : 'Gratis'}</span></div>
        ${ship() !== 'tienda' && left ? `<p class="bag-ship">Te faltan ${money(left)} para el envío gratis.</p>` : ''}
        <div class="bag-row total"><span>Total</span><span>${money(total)}</span></div>`;
      $$('[data-ship-cost]').forEach((el) => { const k = el.dataset.shipCost; if (k) el.textContent = shipCost(k, sub - off) ? money(shipCost(k, sub - off)) : 'Gratis'; });
      $('#co-submit').textContent = `Confirmar pedido · ${money(total)}`;
      $('#bag-count').textContent = count();
    };
    form.addEventListener('change', (e) => {
      if (e.target.name === 'ship') $$('.co-addr').forEach((el) => { el.hidden = el.dataset.for !== ship(); });
      if (e.target.name === 'pay') $('#co-paynote').textContent = PAYS[e.target.value].note;
      if (e.target.name === 'doc') $$('[data-doc]').forEach((el) => { el.hidden = el.dataset.doc !== e.target.value; });
      draw();
    });
    const clear = (e) => {
      const el = e.target;
      if (el.getAttribute('aria-invalid') !== 'true') return;
      el.setAttribute('aria-invalid', 'false');
      const err = $('#' + el.id + '-err');
      if (err) err.textContent = '';
    };
    form.addEventListener('input', clear);
    form.addEventListener('change', clear);
    $('#co-lines').addEventListener('click', (e) => {
      const b = e.target.closest('[data-cq]');
      if (!b) return;
      const l = bag[Number(b.dataset.i)];
      l.qty += Number(b.dataset.cq);
      if (l.qty < 1) bag.splice(Number(b.dataset.i), 1);
      saveBag(); draw();
    });
    $('#co-code').addEventListener('submit', (e) => {
      e.preventDefault();
      const v = $('#co-code-in').value.trim().toUpperCase();
      discount = v === 'STAND10' ? 0.1 : 0;
      $('#co-code-msg').textContent = !v ? 'Escribe un código.' : discount ? 'Listo: 10% menos en tu pedido.' : 'Ese código no existe o ya venció.';
      draw();
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const m = ship();
      const doc = form.querySelector('input[name="doc"]:checked').value;
      const checks = [
        ['co-name', (v) => v.length > 2, 'Escribe tu nombre y apellido.'],
        ['co-phone', (v) => /^9\d{8}$/.test(v.replace(/\D/g, '').replace(/^51/, '')), 'Escribe un celular de 9 dígitos que empiece con 9.'],
        ['co-mail', (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v), 'Revisa el correo: falta algo antes o después de la @.']
      ];
      if (m === 'lima') checks.push(['co-district', (v) => !!v, 'Elige tu distrito.'], ['co-street', (v) => v.length > 5, 'Escribe la dirección con número.']);
      if (m === 'prov') checks.push(['co-region', (v) => !!v, 'Elige tu departamento.'], ['co-city', (v) => v.length > 2, 'Escribe tu ciudad.'], ['co-pstreet', (v) => v.length > 5, 'Escribe la dirección o la agencia.']);
      if (doc === 'boleta') checks.push(['co-dni', (v) => !v || /^\d{8}$/.test(v), 'El DNI tiene 8 dígitos.']);
      else checks.push(['co-ruc', (v) => /^(10|20)\d{9}$/.test(v), 'El RUC tiene 11 dígitos y empieza con 10 o 20.'], ['co-biz', (v) => v.length > 2, 'Escribe la razón social.']);
      let bad = null;
      checks.forEach(([id, test, msg]) => {
        const el = $('#' + id); const ok = test(el.value.trim());
        el.setAttribute('aria-invalid', String(!ok));
        $('#' + id + '-err').textContent = ok ? '' : msg;
        if (!ok && !bad) bad = el;
      });
      const terms = $('#co-terms');
      $('#co-terms-err').textContent = terms.checked ? '' : 'Acepta los términos para continuar.';
      terms.setAttribute('aria-invalid', String(!terms.checked));
      if (!bad && !terms.checked) bad = terms;
      if (bad) { bad.focus(); return; }
      const sub = subtotal(); const off = Math.round(sub * discount); const total = sub - off + shipCost(m, sub - off);
      const order = { id: 'SP-' + String(Date.now()).slice(-6), total, m, pay: form.querySelector('input[name="pay"]:checked').value, name: $('#co-name').value.trim().split(' ')[0], items: count() };
      bag = []; saveBag(); renderBag();
      view.innerHTML = doneView(order);
      window.scrollTo(0, 0); view.focus({ preventScroll: true });
      announce(`Pedido ${order.id} confirmado.`);
    });
    draw();
  }

  function doneView(o) {
    const s = SHIPPING[o.m];
    return `
      <section class="co co-done" aria-labelledby="done-title">
        <p class="co-done-id">Pedido ${o.id}</p>
        <h1 class="title-xl" id="done-title">Gracias, ${esc(o.name)}. Tu pedido está confirmado.</h1>
        <ol class="co-next">
          <li><strong>${o.pay === 'card' ? 'Pago con tarjeta' : `Paga con ${PAYS[o.pay].name}`}</strong><span>${o.pay === 'card' ? 'Te llevamos a la pasarela del banco para cobrar ' + money(o.total) + '.' : `Envía ${money(o.total)} al 987 654 321 (StandPe) y adjunta el código ${o.id}.`}</span></li>
          <li><strong>Lo preparamos en el taller</strong><span>Revisamos cada pieza antes de empaquetarla.</span></li>
          <li><strong>${s.name}</strong><span>${s.when}. Te avisamos por WhatsApp en cada paso.</span></li>
        </ol>
        <div class="co-done-actions">
          <a class="btn" href="#/catalogo">Seguir comprando</a>
          <a class="btn btn--line" href="#/contacto">¿Dudas? Escríbenos</a>
        </div>
      </section>`;
  }

  /* ---------------- Router ---------------- */
  const view = $('#view');
  const top = $('#top');

  function parse(hash) {
    const h = (hash || '').replace(/^#/, '');
    if (h.startsWith('/catalogo')) {
      const c = new URLSearchParams(h.split('?')[1] || '').get('c');
      return { name: 'catalog', cat: CATS.some((x) => x.id === c) ? c : 'todo' };
    }
    const m = h.match(/^\/p\/([\w-]+)/);
    if (m && bySlug[m[1]]) return { name: 'product', slug: m[1] };
    if (h === '/contacto') return { name: 'contact' };
    if (h === '/checkout') return { name: 'checkout' };
    return { name: 'home' };
  }
  const key = (r) => r.name + (r.slug || '') + (r.cat || '');

  function render(r) {
    clearTimeout(heroTimer);
    heroResume = null;
    document.body.dataset.route = r.name;
    if (r.name === 'home') { view.innerHTML = homeView(); document.title = 'StandPe — Ropa de calle hecha en Lima'; }
    if (r.name === 'catalog') { view.innerHTML = catalogView(r.cat); document.title = 'Catálogo — StandPe'; }
    if (r.name === 'contact') { view.innerHTML = contactView(); document.title = 'Contacto — StandPe'; }
    if (r.name === 'checkout') { view.innerHTML = checkoutView(); document.title = 'Finalizar compra — StandPe'; }
    if (r.name === 'product') {
      const p = bySlug[r.slug];
      view.innerHTML = productView(p);
      document.title = `${p.name} — StandPe`;
      store.set('standpe-seen', [p.slug].concat(store.get('standpe-seen', []).filter((s) => s !== p.slug)).slice(0, 8));
    }
    $$('[data-nav]').forEach((a) => {
      const on = a.dataset.nav === r.name || (r.name === 'product' && a.dataset.nav === 'catalog');
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    bind(r);
    onScroll();
  }

  let current = null;
  let busy = false;

  async function go(next, first = false) {
    busy = true;
    closeBag(true);
    if (first || reduce.matches || !current) {
      render(next);
      window.scrollTo(0, 0);
    } else {
      await leave();
      render(next);
      window.scrollTo(0, 0);
      enter();
    }
    if (!first) view.focus({ preventScroll: true });
    current = next;
    busy = false;
    const latest = parse(location.hash);
    if (key(latest) !== key(current)) go(latest);
  }

  window.addEventListener('hashchange', () => {
    const next = parse(location.hash);
    if (busy || (current && key(next) === key(current))) return;
    go(next);
  });

  /* ---------------- Header y tira de campaña según scroll ---------------- */
  const lateral = window.matchMedia('(min-width: 861px)');
  function moveStrip() {
    const strip = $('#camp-strip');
    if (!strip) return;
    const track = $('#camp-track');
    if (reduce.matches || !lateral.matches) { track.style.transform = ''; return; }
    const r = strip.getBoundingClientRect();
    const vh = window.innerHeight;
    if (r.bottom < 0 || r.top > vh) return;
    const t = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
    const max = Math.max(0, track.scrollWidth - strip.clientWidth);
    track.style.transform = `translate3d(${(-t * max).toFixed(1)}px, 0, 0)`;
  }

  function onScroll() {
    moveStrip();
    const hero = $('.hero');
    const onDark = !!hero && window.scrollY < hero.offsetHeight - top.offsetHeight;
    top.classList.toggle('on-dark', onDark);
    top.classList.toggle('is-solid', !onDark);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', moveStrip);

  /* ---------------- Revelados laterales ---------------- */
  let io;
  function observeReveals() {
    if (io) io.disconnect();
    const els = $$('[data-reveal], .campaign');
    if (reduce.matches || !('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-in')); return; }
    io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach((el) => io.observe(el));
  }

  /* ---------------- Vinculaciones por vista ---------------- */
  function bind(r) {
    observeReveals();

    $$('[data-rail]').forEach((b) => b.addEventListener('click', () => {
      const rail = $('#rail');
      rail.scrollBy({ left: Number(b.dataset.rail) * rail.clientWidth * 0.8, behavior: reduce.matches ? 'auto' : 'smooth' });
    }));

    const idx = $('#index');
    if (idx) bindIndex(idx);

    if ($('#hero-media')) bindHero();

    const join = $('#join-form');
    if (join) join.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = $('#join-email').value.trim();
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
      $('#join-msg').textContent = ok ? 'Listo. Te escribimos un día antes del Drop 08.' : 'Revisa el correo: falta algo antes o después de la @.';
      $('#join-email').setAttribute('aria-invalid', String(!ok));
      if (ok) join.reset();
    });

    if (r.name === 'catalog') bindCatalog(r.cat);
    if (r.name === 'product') bindProduct(bySlug[r.slug]);
    if (r.name === 'contact') bindContact();
    if (r.name === 'checkout') bindCheckout();
  }

  let heroTimer = 0;
  let heroResume = null;
  function bindHero() {
    const slides = $$('.hero-slide');
    const btn = $('#hero-pause');
    const bar = $('#hero-bar');
    const SPAN = 5500;
    let i = 0; let paused = reduce.matches; let hold = false;
    const show = (n) => {
      slides[i].classList.remove('is-on'); slides[i].setAttribute('aria-hidden', 'true');
      i = (n + slides.length) % slides.length;
      slides[i].classList.add('is-on'); slides[i].removeAttribute('aria-hidden');
      $('#hero-count').textContent = `${pad2(i + 1)} / ${pad2(slides.length)}`;
    };
    const restartBar = () => {
      bar.getAnimations().forEach((a) => a.cancel());
      if (!paused && !hold && !reduce.matches) bar.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: SPAN, easing: 'linear' });
    };
    const tick = () => {
      clearTimeout(heroTimer);
      if (paused || hold || document.hidden || !document.body.contains(btn)) return;
      heroTimer = setTimeout(() => { show(i + 1); restartBar(); tick(); }, SPAN);
    };
    const sync = () => {
      btn.setAttribute('aria-pressed', String(paused));
      btn.setAttribute('aria-label', paused ? 'Reanudar fotos de portada' : 'Pausar fotos de portada');
      btn.classList.toggle('is-paused', paused);
      restartBar(); tick();
    };
    btn.addEventListener('click', () => { paused = !paused; sync(); });
    const hero = $('.hero');
    hero.addEventListener('focusin', () => { hold = true; sync(); });
    hero.addEventListener('focusout', () => { hold = false; sync(); });
    heroResume = sync;
    sync();
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) clearTimeout(heroTimer); else if (heroResume && $('#hero-media')) heroResume(); });

  // La foto de la línea activa vive en una columna fija a la derecha y cambia por fundido.
  function bindIndex(idx) {
    const box = $('#index-preview');
    const [a, b] = $$('img', box);
    const from = $('.index-from', box);
    let front = a; let shown = '';
    const activate = (row) => {
      const y = row.offsetTop + row.offsetHeight / 2 - box.offsetHeight / 2;
      const max = idx.offsetHeight - box.offsetHeight;
      box.style.transform = `translateY(${Math.max(0, Math.min(max, y))}px)`;
      from.textContent = `Desde ${row.dataset.from}`;
      if (shown !== row.dataset.img) {
        const back = front === a ? b : a;
        back.src = row.dataset.img;
        back.classList.add('is-on'); front.classList.remove('is-on');
        front = back; shown = row.dataset.img;
      }
      box.classList.add('is-on');
    };
    $$('.index-row', idx).forEach((row) => {
      row.addEventListener('pointerenter', () => activate(row));
      row.addEventListener('focus', () => activate(row));
    });
    idx.addEventListener('pointerleave', () => box.classList.remove('is-on'));
    idx.addEventListener('focusout', (e) => { if (!idx.contains(e.relatedTarget)) box.classList.remove('is-on'); });
  }

  function bindCatalog(cat) {
    let active = cat;
    const grid = $('#grid');
    const sort = $('#sort');
    const draw = () => {
      let list = PRODUCTS.filter((p) => active === 'todo' || p.cat === active);
      if (sort.value === 'asc') list = list.slice().sort((a, b) => a.price - b.price);
      if (sort.value === 'desc') list = list.slice().sort((a, b) => b.price - a.price);
      if (sort.value === 'drop') list = list.slice().sort((a, b) => Number(!!b.drop) - Number(!!a.drop));
      grid.innerHTML = list.length ? list.map((p, i) => piece(p, i)).join('') : '<p class="grid-empty">No hay piezas en esta línea por ahora.</p>';
    };
    $$('.filter').forEach((b) => b.addEventListener('click', () => {
      active = b.dataset.cat;
      $$('.filter').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      const h = active === 'todo' ? '#/catalogo' : `#/catalogo?c=${active}`;
      history.replaceState(null, '', h);
      current = parse(h);
      draw();
    }));
    sort.addEventListener('change', draw);
    draw();
  }

  function bindProduct(p) {
    let size = sizesOf(p).length === 1 ? sizesOf(p)[0] : null;
    const sizeBtns = $$('.size');
    sizeBtns.forEach((b) => b.addEventListener('click', () => {
      if (b.getAttribute('aria-disabled') === 'true') { $('#add-hint').textContent = `La talla ${b.dataset.size} se agotó en este drop.`; return; }
      size = b.dataset.size;
      sizeBtns.forEach((x) => x.setAttribute('aria-checked', String(x === b)));
      $('#add-hint').textContent = '';
    }));
    $('#add').addEventListener('click', () => {
      if (!size) {
        $('#add-hint').textContent = 'Elige una talla.';
        const first = sizeBtns.find((b) => b.getAttribute('aria-disabled') !== 'true');
        if (first) first.focus();
        return;
      }
      addToBag(p.slug, size);
    });
    bindZoom();
    const guide = $('#guide');
    if (guide) {
      $('#guide-open').addEventListener('click', () => guide.showModal());
      $('#guide-close').addEventListener('click', () => guide.close());
      guide.addEventListener('click', (e) => { if (e.target === guide) guide.close(); });
    }
    const bar = $('#buybar');
    const add = $('#add');
    if ('IntersectionObserver' in window) {
      const ob = new IntersectionObserver(([en]) => {
        const show = !en.isIntersecting && en.boundingClientRect.top < 0;
        bar.classList.toggle('is-on', show);
        bar.setAttribute('aria-hidden', String(!show));
        $('#buybar-go').tabIndex = show ? 0 : -1;
      });
      ob.observe(add);
    }
    $('#buybar-go').addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduce.matches ? 'auto' : 'smooth' });
      const first = sizeBtns.find((b) => b.getAttribute('aria-disabled') !== 'true');
      if (first) setTimeout(() => first.focus({ preventScroll: true }), reduce.matches ? 0 : 500);
    });
    $$('.acc-btn').forEach((b) => b.addEventListener('click', () => {
      const open = b.getAttribute('aria-expanded') === 'true';
      b.setAttribute('aria-expanded', String(!open));
      b.closest('.acc-item').classList.toggle('is-open', !open);
    }));
  }

  // Lupa: con mouse sigue al cursor; en táctil (o con el botón) abre la foto ampliada.
  function bindZoom() {
    const im = $('#pdp-visual');
    const lens = $('#lens');
    const dlg = $('#zoom');
    const open = () => { if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', ''); };
    $('#zoom-open').addEventListener('click', open);
    $('#zoom-close').addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!fine.matches) { im.addEventListener('click', open); return; }
    const Z = 2;
    lens.style.backgroundImage = `url("${im.currentSrc || im.src}")`;
    im.addEventListener('pointermove', (e) => {
      const r = im.getBoundingClientRect();
      const host = lens.offsetParent.getBoundingClientRect();
      const x = e.clientX - r.left; const y = e.clientY - r.top;
      lens.style.backgroundSize = `${r.width * Z}px ${r.height * Z}px`;
      lens.style.backgroundPosition = `${-(x * Z - lens.offsetWidth / 2)}px ${-(y * Z - lens.offsetHeight / 2)}px`;
      lens.style.transform = `translate(${e.clientX - host.left - lens.offsetWidth / 2}px, ${e.clientY - host.top - lens.offsetHeight / 2}px)`;
      lens.classList.add('is-on');
    });
    im.addEventListener('pointerleave', () => lens.classList.remove('is-on'));
  }

  function bindContact() {
    const form = $('#contact-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const checks = [
        ['c-name', (v) => v.length > 1, 'Escribe tu nombre.'],
        ['c-mail', (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || /^\+?\d[\d\s]{7,}$/.test(v), 'Escribe un correo o un número de WhatsApp.'],
        ['c-msg', (v) => v.length > 4, 'Cuéntanos en qué te ayudamos.']
      ];
      let firstBad = null;
      checks.forEach(([id, test, msg]) => {
        const el = $('#' + id);
        const ok = test(el.value.trim());
        el.setAttribute('aria-invalid', String(!ok));
        el.setAttribute('aria-describedby', id + '-err');
        $('#' + id + '-err').textContent = ok ? '' : msg;
        if (!ok && !firstBad) firstBad = el;
      });
      if (firstBad) { firstBad.focus(); $('#form-msg').textContent = ''; return; }
      form.reset();
      $('#form-msg').textContent = 'Recibido. Te respondemos hoy antes de las 8 p. m.';
    });
  }

  /* ---------------- Bolsa ---------------- */
  const FREE = 250;
  let bag = store.get('standpe-bag', []).filter((l) => bySlug[l.slug]);
  const bagEl = $('#bag');
  const scrim = $('#bag-scrim');
  let lastFocus = null;

  function saveBag() { store.set('standpe-bag', bag); }
  function count() { return bag.reduce((n, l) => n + l.qty, 0); }

  function renderBag() {
    $('#bag-count').textContent = count();
    const body = $('#bag-body');
    const foot = $('#bag-foot');
    if (!bag.length) {
      body.innerHTML = '<div class="bag-empty"><p>Tu bolsa está vacía.</p><a class="btn" href="#/catalogo">Ver catálogo</a></div>';
      foot.innerHTML = '';
      return;
    }
    const sub = bag.reduce((n, l) => n + bySlug[l.slug].price * l.qty, 0);
    const left = Math.max(0, FREE - sub);
    body.innerHTML = bag.map((l, i) => {
      const p = bySlug[l.slug];
      return `<div class="line">
        <div class="line-img"><img src="${img(p)}" alt="" /></div>
        <div>
          <p class="line-name">${esc(p.name)}</p>
          <p class="line-size">Talla ${esc(l.size)} · ${esc(p.color)}</p>
          <div class="qty" role="group" aria-label="Cantidad de ${esc(p.name)}">
            <button type="button" data-q="-1" data-i="${i}" aria-label="Quitar una">−</button>
            <span>${l.qty}</span>
            <button type="button" data-q="1" data-i="${i}" aria-label="Agregar una">+</button>
          </div>
        </div>
        <div class="line-right"><span>${money(p.price * l.qty)}</span><button class="link-btn" type="button" data-rm="${i}">Quitar</button></div>
      </div>`;
    }).join('');
    foot.innerHTML = `
      <div class="bag-row"><span>Subtotal</span><span>${money(sub)}</span></div>
      <div class="bag-row"><span>Envío</span><span>${left ? 'Desde S/ 12' : 'Gratis'}</span></div>
      <p class="bag-ship">${left ? `Te faltan ${money(left)} para el envío gratis.` : 'Tu envío va gratis a todo el Perú.'}</p>
      <div class="bag-ship-bar" aria-hidden="true"><i style="transform:scaleX(${Math.min(1, sub / FREE)})"></i></div>
      <div class="bag-row total"><span>Total</span><span>${money(sub)}</span></div>
      <a class="btn" href="#/checkout" id="checkout">Finalizar compra</a>
      <p class="bag-note" id="bag-note" role="status"></p>`;
  }

  function addToBag(slug, size) {
    const found = bag.find((l) => l.slug === slug && l.size === size);
    if (found) found.qty += 1; else bag.push({ slug, size, qty: 1 });
    saveBag();
    renderBag();
    const c = $('.top-bag-count');
    c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
    announce(`${bySlug[slug].name}, talla ${size}, agregado a la bolsa.`);
    openBag();
  }

  function openBag() {
    lastFocus = document.activeElement;
    renderBag();
    bagEl.hidden = false; scrim.hidden = false;
    requestAnimationFrame(() => { bagEl.classList.add('is-on'); scrim.classList.add('is-on'); });
    document.body.style.overflow = 'hidden';
    $('#bag-close').focus();
  }

  function closeBag(silent) {
    if (bagEl.hidden) return;
    bagEl.classList.remove('is-on'); scrim.classList.remove('is-on');
    document.body.style.overflow = '';
    const done = () => { bagEl.hidden = true; scrim.hidden = true; };
    if (silent || reduce.matches) done(); else setTimeout(done, 600);
    if (!silent && lastFocus) lastFocus.focus();
  }

  $('#bag-open').addEventListener('click', openBag);
  $('#bag-close').addEventListener('click', () => closeBag());
  scrim.addEventListener('click', () => closeBag());
  bagEl.addEventListener('click', (e) => {
    const q = e.target.closest('[data-q]');
    const rm = e.target.closest('[data-rm]');
    if (q) {
      const l = bag[Number(q.dataset.i)];
      l.qty += Number(q.dataset.q);
      if (l.qty < 1) bag.splice(Number(q.dataset.i), 1);
      saveBag(); renderBag();
      $('#bag-close').focus();
    }
    if (rm) { bag.splice(Number(rm.dataset.rm), 1); saveBag(); renderBag(); $('#bag-close').focus(); }
    if (e.target.closest('#checkout') && current && current.name === 'checkout') closeBag();
  });
  document.addEventListener('keydown', (e) => {
    if (bagEl.hidden) return;
    if (e.key === 'Escape') closeBag();
    if (e.key === 'Tab') {
      const f = $$('a[href], button:not([disabled]), input, select', bagEl);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  /* ---------------- Inicio y preloader ---------------- */
  function start() {
    renderBag();
    const first = parse(location.hash);
    const pre = $('#preloader');
    let seen = false;
    try { seen = sessionStorage.getItem('standpe-intro') === '1'; } catch { /* sin almacenamiento */ }

    go(first, true);

    if (seen || reduce.matches) {
      pre.classList.add('is-done');
      document.body.classList.remove('is-loading');
      return;
    }
    try { sessionStorage.setItem('standpe-intro', '1'); } catch { /* sin almacenamiento */ }
    const mark = $('.preloader-mark');
    mark.animate([{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }], { duration: 700, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' });
    const heroImg = $('.hero-slide');
    const ready = heroImg && !heroImg.complete ? new Promise((r) => { heroImg.onload = r; heroImg.onerror = r; setTimeout(r, 2500); }) : Promise.resolve();
    Promise.all([ready, wait(950)]).then(() => {
      document.body.classList.remove('is-loading');
      mark.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 520, delay: first.name === 'home' ? 380 : 0, easing: 'ease', fill: 'forwards' });
      return pre.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 900, delay: 300, easing: 'ease', fill: 'forwards' }).finished;
    }).then(() => pre.classList.add('is-done'));
  }

  start();
})();
