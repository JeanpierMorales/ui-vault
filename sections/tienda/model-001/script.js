(() => {
  document.documentElement.classList.add('js');

  /* =========================================================
     Datos
     ========================================================= */
  const IMG = 'https://images.unsplash.com/photo-';
  const img = (id, w = 900) => `${IMG}${id}?auto=format&fit=crop&w=${w}&q=80`;
  // Vistas de galería: la foto completa + recortes con punto focal (detalle de prenda y tela)
  const VIEWS = [
    { fy: 0.5, z: 1 },
    { fy: 0.32, z: 1.7 },
    { fy: 0.6, z: 2.1 },
    { fy: 0.45, z: 3.2 },
  ];
  const view = (id, v, w = 1000) => `${IMG}${id}?auto=format&q=80&w=${w}&h=${Math.round(w * 1.25)}&fit=crop&crop=focalpoint&fp-x=0.5&fp-y=${v.fy}&fp-z=${v.z}`;

  const COLORS = {
    negro: ['Negro', '#171717'], blanco: ['Blanco', '#f5f3ee'], crudo: ['Crudo', '#e4d9c3'],
    gris: ['Gris', '#9b9a96'], azul: ['Azul noche', '#26314a'], celeste: ['Celeste', '#a9c1d9'],
    denim: ['Denim', '#56708f'], rojo: ['Rojo', '#b3322a'], vino: ['Vino', '#6b2233'],
    rosa: ['Rosa', '#e6b8b2'], naranja: ['Naranja', '#e0772e'], verde: ['Verde', '#2f4638'],
    camel: ['Camel', '#a8764b'], morado: ['Morado', '#5b2448'],
  };
  const APPAREL = ['XS', 'S', 'M', 'L', 'XL'];
  const SHOES = ['36', '37', '38', '39', '40', '41'];
  const ONE = ['Única'];

  // g: mujer | hombre | unisex · in: catálogos · was: precio anterior · out: tallas agotadas · fit: -1 pequeña, 0 normal, 1 grande
  const RAW = [
    { id: 'p01', name: 'Abrigo de paño burdeos', cat: 'Abrigos y casacas', line: 'Vincce Studio', g: 'mujer', price: 459, colors: ['vino', 'negro'], img: '1483985988355-763728e1935b', in: ['new'], isNew: true, fast: true, desc: 'Paño 70% lana, solapa ancha y largo a media pierna.' },
    { id: 'p02', name: 'Gabardina celeste larga', cat: 'Abrigos y casacas', line: 'Vincce Studio', g: 'mujer', price: 529, colors: ['celeste', 'crudo'], img: '1539109136881-3be0616acf4b', in: ['new'], isNew: true, out: ['XS'], desc: 'Algodón encerado repelente al agua, cinturón desmontable.' },
    { id: 'p03', name: 'Abrigo rosa palo', cat: 'Abrigos y casacas', line: 'Vincce Studio', g: 'mujer', price: 489, colors: ['rosa'], img: '1485462537746-965f33f7f6a7', in: ['new'], isNew: true, low: true, desc: 'Corte recto con bolsillos de parche y forro de viscosa.' },
    { id: 'p04', name: 'Casaca de cuero camel', cat: 'Abrigos y casacas', line: 'Taller Lima', g: 'hombre', price: 689, was: 899, colors: ['camel', 'negro'], img: '1487222477894-8943e31ef7b2', in: ['outlet'], fast: true, desc: 'Cuero de oveja curtido en Lima, cierre asimétrico.' },
    { id: 'p05', name: 'Casaca biker negra', cat: 'Abrigos y casacas', line: 'Taller Lima', g: 'hombre', price: 749, colors: ['negro'], img: '1520975954732-35dd22299614', in: ['new'], out: ['XL'], fit: -1, desc: 'Cuero napa con cremalleras metálicas y hombros acolchados.' },
    { id: 'p06', name: 'Casaca denim con cuello de pana', cat: 'Abrigos y casacas', line: 'Norte Denim', g: 'unisex', price: 329, colors: ['denim'], img: '1611312449408-fcece27cdbb7', in: ['basics'], fast: true, desc: 'Denim rígido de 14 oz y cuello de pana camel.' },
    { id: 'p07', name: 'Bomber terracota', cat: 'Abrigos y casacas', line: 'Vincce Básicos', g: 'unisex', price: 229, was: 349, colors: ['naranja', 'negro'], img: '1591047139829-d91aecb6caea', in: ['outlet'], out: ['S'], desc: 'Nylon ligero con puños de rib, para las tardes de otoño.' },
    { id: 'p08', name: 'Polo blanco de algodón pima', cat: 'Polos', line: 'Vincce Básicos', g: 'unisex', price: 69, colors: ['blanco', 'negro', 'gris'], img: '1521572163474-6864f9cf17ab', in: ['basics'], fast: true, desc: 'Pima peruano de 180 g, cuello redondo reforzado.' },
    { id: 'p09', name: 'Polo negro con sello', cat: 'Polos', line: 'Vincce Básicos', g: 'unisex', price: 79, colors: ['negro'], img: '1618354691373-d851c5c3a990', in: ['basics'], desc: 'Estampado al agua en el pecho, calce regular.' },
    { id: 'p10', name: 'Polo gris jaspeado', cat: 'Polos', line: 'Vincce Básicos', g: 'unisex', price: 49, was: 65, colors: ['gris', 'blanco'], img: '1564584217132-2271feaeb3c5', in: ['basics', 'outlet'], fast: true, desc: 'Algodón con 10% de lino, caída suelta.' },
    { id: 'p35', name: 'Polo relajado de pima', cat: 'Polos', line: 'Vincce Básicos', g: 'hombre', price: 75, colors: ['blanco', 'gris'], img: '1622445275463-afa2ab738c34', in: ['basics'], fast: true, fit: 1, desc: 'Hombro caído y largo extra; pima peinado de 200 g.' },
    { id: 'p37', name: 'Polo estampado de rock', cat: 'Polos', line: 'Vincce Studio', g: 'mujer', price: 89, colors: ['negro'], img: '1503342217505-b0a15ec3261c', in: ['new'], isNew: true, desc: 'Serigrafía a mano en Gamarra, algodón orgánico.' },
    { id: 'p11', name: 'Polera blanca de felpa', cat: 'Tejidos', line: 'Vincce Básicos', g: 'unisex', price: 149, colors: ['blanco', 'gris'], img: '1620799140408-edc6dcb6d633', in: ['basics'], desc: 'Felpa perchada por dentro, puños y basta con rib.' },
    { id: 'p36', name: 'Polera rosa lavada', cat: 'Tejidos', line: 'Vincce Studio', g: 'hombre', price: 159, colors: ['rosa', 'gris'], img: '1516826957135-700dedea698c', in: ['new'], isNew: true, fit: 1, desc: 'Felpa francesa teñida en prenda, calce holgado.' },
    { id: 'p12', name: 'Chompa naranja de alpaca', cat: 'Tejidos', line: 'Taller Lima', g: 'mujer', price: 189, was: 239, colors: ['naranja'], img: '1578587018452-892bacefd3f2', in: ['outlet'], low: true, desc: 'Baby alpaca de Arequipa, tejido jersey liso.' },
    { id: 'p13', name: 'Poncho tejido a mano', cat: 'Tejidos', line: 'Taller Lima', g: 'unisex', price: 219, colors: ['crudo'], img: '1434389677669-e08b4cac3105', in: ['new'], isNew: true, sizes: ONE, fit: 1, desc: 'Algodón orgánico tejido en Cusco, flecos en la basta.' },
    { id: 'p14', name: 'Chompa bicolor de intarsia', cat: 'Tejidos', line: 'Vincce Studio', g: 'mujer', price: 229, colors: ['crudo', 'naranja'], img: '1475180098004-ca77a66827be', in: ['new'], isNew: true, out: ['L', 'XL'], fit: 1, desc: 'Punto grueso con bloques de color, cuello alto.' },
    { id: 'p15', name: 'Chompa azul noche', cat: 'Tejidos', line: 'Vincce Básicos', g: 'mujer', price: 169, colors: ['azul', 'gris'], img: '1534528741775-53994a69daeb', in: ['basics'], fast: true, desc: 'Merino extrafino, cuello redondo; va con todo.' },
    { id: 'p16', name: 'Camisa blanca de popelina', cat: 'Camisas', line: 'Vincce Sastrería', g: 'hombre', price: 159, colors: ['blanco', 'celeste'], img: '1603252109303-2751441dd157', in: ['tailoring', 'basics'], fast: true, desc: 'Popelina 100% algodón, cuello italiano y botones de nácar.' },
    { id: 'p17', name: 'Camisa Oxford celeste', cat: 'Camisas', line: 'Vincce Sastrería', g: 'hombre', price: 169, colors: ['celeste', 'blanco'], img: '1598032895397-b9472444bf93', in: ['tailoring'], desc: 'Oxford lavado con cuello abotonado.' },
    { id: 'p18', name: 'Camisa vino de gabardina', cat: 'Camisas', line: 'Vincce Sastrería', g: 'hombre', price: 119, was: 179, colors: ['vino', 'azul'], img: '1602810318383-e386cc2a3ccf', in: ['tailoring', 'outlet'], desc: 'Gabardina ligera con puño francés.' },
    { id: 'p19', name: 'Terno azul slim', cat: 'Sacos y ternos', line: 'Vincce Sastrería', g: 'hombre', price: 899, colors: ['azul'], img: '1617137968427-85924c800a22', in: ['tailoring'], fast: true, out: ['XS'], fit: -1, desc: 'Lana fría Super 110, saco de dos botones y pantalón pinzado.' },
    { id: 'p20', name: 'Blazer de cuadros verde', cat: 'Sacos y ternos', line: 'Vincce Sastrería', g: 'mujer', price: 399, colors: ['verde', 'gris'], img: '1485968579580-b6d095142e6e', in: ['tailoring', 'new'], isNew: true, desc: 'Tweed escocés de cuadros, hombros suaves.' },
    { id: 'p21', name: 'Jean recto con rotos', cat: 'Pantalones', line: 'Norte Denim', g: 'mujer', price: 199, colors: ['denim'], img: '1541099649105-f69ad21f3246', in: ['basics'], desc: 'Tiro alto, rotos hechos a mano en la rodilla.' },
    { id: 'p22', name: 'Jean negro recto', cat: 'Pantalones', line: 'Norte Denim', g: 'hombre', price: 189, colors: ['negro', 'denim'], img: '1624378439575-d8705ad7ae80', in: ['basics'], fast: true, desc: 'Denim teñido en negro profundo que no destiñe.' },
    { id: 'p23', name: 'Jogger de seda rosa', cat: 'Pantalones', line: 'Vincce Studio', g: 'mujer', price: 129, was: 189, colors: ['rosa'], img: '1594633312681-425c7b97ccd1', in: ['outlet'], out: ['M'], fit: -1, desc: 'Seda lavada con pretina elástica y bolsillos cargo.' },
    { id: 'p24', name: 'Pantalón ancho a rayas', cat: 'Pantalones', line: 'Vincce Studio', g: 'mujer', price: 219, colors: ['negro', 'blanco'], img: '1509631179647-0177331693ae', in: ['new'], isNew: true, fit: 1, desc: 'Crepe con raya diplomática y pierna amplia.' },
    { id: 'p25', name: 'Vestido largo rojo', cat: 'Vestidos', line: 'Vincce Studio', g: 'mujer', price: 349, colors: ['rojo'], img: '1595777457583-95e059d581b8', in: ['new'], isNew: true, fast: true, desc: 'Gasa con vuelo completo y espalda descubierta.' },
    { id: 'p26', name: 'Vestido de lunares con cinturón', cat: 'Vestidos', line: 'Vincce Studio', g: 'mujer', price: 259, was: 329, colors: ['rojo', 'negro'], img: '1572804013309-59a88b7e92f1', in: ['outlet'], low: true, desc: 'Viscosa estampada, falda midi y cinturón de cuero.' },
    { id: 'p27', name: 'Vestido de hombros descubiertos', cat: 'Vestidos', line: 'Vincce Studio', g: 'mujer', price: 299, colors: ['morado', 'negro'], img: '1566174053879-31528523f8ae', in: ['new'], isNew: true, fit: -1, desc: 'Punto de seda que se ciñe al cuerpo, largo midi.' },
    { id: 'p28', name: 'Vestido cruzado celeste', cat: 'Vestidos', line: 'Vincce Studio', g: 'mujer', price: 279, colors: ['celeste'], img: '1539008835657-9e8e9680c956', in: ['new'], isNew: true, out: ['XS', 'S'], desc: 'Lino ligero con abertura lateral, para el verano.' },
    { id: 'p29', name: 'Vestido blanco de volantes', cat: 'Vestidos', line: 'Vincce Básicos', g: 'mujer', price: 159, was: 229, colors: ['blanco'], img: '1515372039744-b8f02a3ae446', in: ['outlet'], fast: true, desc: 'Algodón bordado con escote bardot.' },
    { id: 'p30', name: 'Zapatillas de suela alta', cat: 'Calzado', line: 'Vincce Studio', g: 'unisex', price: 329, colors: ['blanco', 'rosa'], img: '1560769629-975ec94e6a86', in: ['new'], isNew: true, sizes: SHOES, out: ['36'], desc: 'Cuero y malla con suela de 5 cm.' },
    { id: 'p31', name: 'Stilettos estampados', cat: 'Calzado', line: 'Vincce Studio', g: 'mujer', price: 199, was: 289, colors: ['azul', 'rojo'], img: '1543163521-1bf539c55dd2', in: ['outlet'], sizes: SHOES, out: ['39', '40'], fit: -1, desc: 'Satén estampado con taco de 10 cm.' },
    { id: 'p32', name: 'Cartera roja de cuero', cat: 'Accesorios', line: 'Taller Lima', g: 'mujer', price: 389, colors: ['rojo', 'negro'], img: '1584917865442-de89df76afd3', in: ['new'], isNew: true, sizes: ONE, fast: true, desc: 'Cuero liso con asa rígida y correa larga.' },
    { id: 'p33', name: 'Gorra de algodón lavado', cat: 'Accesorios', line: 'Vincce Básicos', g: 'unisex', price: 59, colors: ['gris', 'negro'], img: '1521369909029-2afed882baee', in: ['basics'], sizes: ONE, fast: true, desc: 'Sarga lavada a la piedra, cierre regulable.' },
    { id: 'p34', name: 'Gorro de lana', cat: 'Accesorios', line: 'Taller Lima', g: 'unisex', price: 39, was: 59, colors: ['rosa', 'negro', 'naranja'], img: '1576871337632-b9aef4c17ab9', in: ['outlet'], sizes: ONE, desc: 'Lana de oveja con doblez y etiqueta tejida.' },
  ];

  const CARE = {
    'Abrigos y casacas': ['Exterior según ficha · forro 100% viscosa', 'Limpieza en seco. No lavar en lavadora. Colgar en gancho ancho.'],
    Polos: ['100% algodón pima peruano', 'Lavar a 30 °C del revés. No usar secadora. Planchar a temperatura media.'],
    Tejidos: ['Fibra natural (alpaca, merino o algodón)', 'Lavar a mano en agua fría. Secar en horizontal, a la sombra.'],
    Camisas: ['100% algodón', 'Lavar a 40 °C. Planchar húmeda para un mejor acabado.'],
    'Sacos y ternos': ['Lana fría con forro de cupro', 'Limpieza en seco. Airear después de usar y guardar en funda.'],
    Pantalones: ['Denim o crepe según ficha', 'Lavar a 30 °C del revés, con colores similares.'],
    Vestidos: ['Fibra según ficha · forro de algodón', 'Lavar a mano o en ciclo delicado a 30 °C. Secar colgado.'],
    Calzado: ['Capellada de cuero · plantilla acolchada', 'Limpiar con paño húmedo. Guardar con horma o papel.'],
    Accesorios: ['Material según ficha', 'Limpiar con paño seco. Evitar la exposición prolongada al sol.'],
  };

  const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  const PRODUCTS = RAW.map((p, i) => {
    const h = hash(p.id);
    const sizes = p.sizes || APPAREL;
    const out = p.out || [];
    const stock = Object.fromEntries(sizes.map((s, k) => [s, out.includes(s) ? 0 : p.low && k % 2 ? 1 + ((h >> k) % 2) : 2 + ((h >> (k * 2)) % 11)]));
    return {
      ...p, order: i, sizes, out, stock, fit: p.fit || 0,
      rating: Math.round((4.1 + ((h % 9) / 10)) * 10) / 10,
      reviews: 6 + (h % 130),
    };
  });
  const byId = (id) => PRODUCTS.find((p) => p.id === id);

  const CATALOGS = [
    { id: 'all', name: 'Todo Vincce', title: 'Toda la tienda', lede: 'Todas las prendas de Miraflores en un solo lugar: temporada, esenciales, sastrería y outlet.', img: '1512436991641-6745cdb1723f', test: () => true },
    { id: 'new', name: 'Primavera 26', title: 'Primavera 26', lede: 'Abrigos ligeros, vestidos con vuelo y lino para las tardes de septiembre en Lima.', img: '1485462537746-965f33f7f6a7', test: (p) => p.in.includes('new') },
    { id: 'basics', name: 'Esenciales', title: 'Esenciales', lede: 'Pima, denim y merino. Lo que usas cuatro veces por semana, siempre en stock.', img: '1562157873-818bc0726f68', test: (p) => p.in.includes('basics') },
    { id: 'tailoring', name: 'Sastrería', title: 'Sastrería', lede: 'Ternos, blazers y camisas con ajuste gratis en tienda. Listos en 48 horas.', img: '1617137968427-85924c800a22', test: (p) => p.in.includes('tailoring') },
    { id: 'outlet', name: 'Outlet', title: 'Outlet', lede: 'Últimas tallas de temporadas pasadas con hasta 40% de descuento.', img: '1445205170230-053b83016050', test: (p) => !!p.was },
  ];
  const catalogById = (id) => CATALOGS.find((c) => c.id === id) || CATALOGS[0];

  const REVIEWS = [
    { name: 'Lucía R.', city: 'Surco', r: 5, fit: 0, h: '1,62 m', t: 'Justo lo que buscaba', x: 'Pedí mi talla de siempre y quedó perfecta. La tela se siente mejor que en las fotos.' },
    { name: 'Diego M.', city: 'San Borja', r: 4, fit: 1, h: '1,78 m', t: 'Buena calidad, algo holgada', x: 'Me gusta cómo cae, pero si prefieres un calce ajustado pide una talla menos.' },
    { name: 'Andrea P.', city: 'Arequipa', r: 5, fit: 0, h: '1,58 m', t: 'Llegó en tres días', x: 'El envío a provincia fue rápido y el empaque, sin plástico. Ya la lavé dos veces y sigue igual.' },
    { name: 'Carla V.', city: 'Miraflores', r: 5, fit: 0, h: '1,70 m', t: 'La probé en tienda', x: 'Reservé dos tallas por la web y me las probé en Calle Berlín. Muy buena atención.' },
    { name: 'José A.', city: 'Lince', r: 4, fit: -1, h: '1,82 m', t: 'Talla un poco justa', x: 'Los hombros me quedaron justos. La cambié por la siguiente talla sin costo y sin problemas.' },
    { name: 'Valeria T.', city: 'Barranco', r: 5, fit: 0, h: '1,65 m', t: 'Mi compra favorita del año', x: 'Combina con todo y el color es exactamente el de la foto. Ya quiero otro color.' },
    { name: 'Renzo Q.', city: 'Trujillo', r: 3, fit: 1, h: '1,74 m', t: 'Bonita pero grande', x: 'La calidad es buena, pero me quedó grande. La guía de tallas lo advertía; debí hacerle caso.' },
    { name: 'Mariana L.', city: 'La Molina', r: 5, fit: 0, h: '1,60 m', t: 'Vale cada sol', x: 'Se nota el acabado: costuras limpias, botones firmes y una tela que no se arruga fácil.' },
    { name: 'Sofía G.', city: 'Cusco', r: 4, fit: -1, h: '1,68 m', t: 'Queda algo ceñida', x: 'Me encanta, pero es de calce ajustado. Si estás entre dos tallas, elige la mayor.' },
    { name: 'Gonzalo F.', city: 'San Isidro', r: 5, fit: 0, h: '1,80 m', t: 'Excelente', x: 'La uso para la oficina y los fines de semana. Llegó al día siguiente con el envío express.' },
  ];
  const reviewsFor = (p) => {
    const h = hash(p.id + 'r');
    const list = [];
    for (let k = 0; k < 5; k += 1) {
      const base = REVIEWS[(h + k * 3) % REVIEWS.length];
      const avail = p.sizes.filter((s) => !p.out.includes(s));
      const fit = p.fit && k % 2 === 0 ? p.fit : base.fit;
      list.push({ ...base, fit, id: `${p.id}-${k}`, size: avail[(h >> k) % avail.length] || p.sizes[0], days: 2 + ((h >> (k + 2)) % 60), useful: (h >> k) % 24 });
    }
    return list;
  };

  const DISTRICTS = [
    ['miraflores', 'Miraflores', 'lima1'], ['san-isidro', 'San Isidro', 'lima1'], ['barranco', 'Barranco', 'lima1'],
    ['surco', 'Santiago de Surco', 'lima1'], ['san-borja', 'San Borja', 'lima1'], ['lince', 'Lince', 'lima1'],
    ['jesus-maria', 'Jesús María', 'lima1'], ['magdalena', 'Magdalena del Mar', 'lima1'], ['pueblo-libre', 'Pueblo Libre', 'lima1'],
    ['la-molina', 'La Molina', 'lima2'], ['chorrillos', 'Chorrillos', 'lima2'], ['san-miguel', 'San Miguel', 'lima2'],
    ['los-olivos', 'Los Olivos', 'lima2'], ['sjl', 'San Juan de Lurigancho', 'lima2'], ['callao', 'Callao', 'lima2'],
    ['arequipa', 'Arequipa', 'prov'], ['cusco', 'Cusco', 'prov'], ['trujillo', 'Trujillo', 'prov'], ['piura', 'Piura', 'prov'],
  ];
  const ZONES = {
    lima1: { label: 'Lima', days: 2, price: 10, free: 299, express: true },
    lima2: { label: 'Lima', days: 3, price: 14, free: 299, express: false },
    prov: { label: 'Provincia', days: 5, price: 22, free: 499, express: false },
  };
  const EXPRESS = 19;
  const COUPONS = {
    VINCCE10: { label: '10% de descuento', calc: (s) => Math.round(s * 0.1) },
    BIENVENIDA: { label: 'S/ 30 en compras desde S/ 199', min: 199, calc: () => 30 },
  };
  const STORE = { name: 'Vincce Miraflores', addr: 'Calle Berlín 342, Miraflores', hours: 'Lun a sáb 10:00–20:00 · Dom 11:00–18:00' };

  /* =========================================================
     Utilidades
     ========================================================= */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = (n) => `S/ ${Number(n).toLocaleString('es-PE', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;
  const off = (p) => (p.was ? Math.round((1 - p.price / p.was) * 100) : 0);
  const icon = (n, cls = '') => `<svg aria-hidden="true"${cls ? ` class="${cls}"` : ''}><use href="#i-${n}"/></svg>`;
  const plural = (n, a, b) => `${n} ${n === 1 ? a : b}`;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 980px)');
  const DAYS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
  const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'set', 'oct', 'nov', 'dic'];
  const addDays = (n) => {
    const d = new Date();
    let left = n;
    while (left > 0) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0) left -= 1; }
    return d;
  };
  const fmtDate = (d) => `${DAYS[d.getDay()]} ${d.getDate()} de ${MONTHS[d.getMonth()]}`;
  const priceHTML = (p) => (p.was ? `<s>${money(p.was)}</s><span class="now-sale">${money(p.price)}</span>` : money(p.price));
  const stars = (r) => `<span class="stars" style="--r:${r}" aria-hidden="true">${icon('star').repeat(5)}<span class="stars-on">${icon('star').repeat(5)}</span></span>`;
  const sizeGroup = (s) => (APPAREL.includes(s) ? 'Ropa' : SHOES.includes(s) ? 'Calzado' : 'Accesorios');

  /* =========================================================
     Estado persistente (solo comodidad del visitante)
     ========================================================= */
  const KEY = 'vincce-demo-v1';
  const saved = (() => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } })();
  const store = {
    bag: (saved.bag || []).filter((i) => byId(i.id)),
    wish: new Set((saved.wish || []).filter(byId)),
    recent: (saved.recent || []).filter(byId),
    searches: saved.searches || [],
    size: saved.size || null,
    coupon: saved.coupon || null,
    district: saved.district || 'miraflores',
    orders: saved.orders || [],
  };
  const persist = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ ...store, wish: [...store.wish] }));
    } catch { /* almacenamiento no disponible */ }
  };

  /* =========================================================
     Carrito
     ========================================================= */
  const lineKey = (i) => `${i.id}|${i.color}|${i.size}`;
  const bagCount = () => store.bag.reduce((n, i) => n + i.qty, 0);
  const subtotal = () => store.bag.reduce((n, i) => n + i.qty * byId(i.id).price, 0);
  const savings = () => store.bag.reduce((n, i) => n + i.qty * ((byId(i.id).was || byId(i.id).price) - byId(i.id).price), 0);
  function discount() {
    const c = COUPONS[store.coupon];
    const s = subtotal();
    if (!c || (c.min && s < c.min)) return 0;
    return Math.min(c.calc(s), s);
  }
  function shipping(method = 'standard', district = store.district) {
    const zone = ZONES[(DISTRICTS.find((d) => d[0] === district) || DISTRICTS[0])[2]];
    if (method === 'pickup') return 0;
    if (method === 'express') return EXPRESS;
    return subtotal() - discount() >= zone.free ? 0 : zone.price;
  }
  const zoneOf = (district) => ZONES[(DISTRICTS.find((d) => d[0] === district) || DISTRICTS[0])[2]];

  function addToBag(p, size, color = p.colors[0], qty = 1, silent = false) {
    if (!p.stock[size]) return false;
    const found = store.bag.find((i) => i.id === p.id && i.size === size && i.color === color);
    if (found) found.qty = Math.min(found.qty + qty, p.stock[size]);
    else store.bag.push({ id: p.id, size, color, qty });
    bagChanged();
    if (!silent) toast(`Añadido: ${p.name}${size !== 'Única' ? ` · talla ${size}` : ''}`, null, { label: 'Ver bolsa', fn: () => openBag() });
    return true;
  }
  function removeLine(key) {
    const idx = store.bag.findIndex((i) => lineKey(i) === key);
    if (idx < 0) return;
    const [line] = store.bag.splice(idx, 1);
    bagChanged();
    toast(`Quitaste ${byId(line.id).name}`, () => { store.bag.splice(idx, 0, line); bagChanged(); });
  }
  const bagHooks = new Set();
  function bagChanged() {
    persist();
    paintCount($('#bagCount'), $('#bagBtn'), bagCount(), 'Bolsa');
    renderBagDrawer();
    bagHooks.forEach((fn) => fn());
  }

  /* =========================================================
     Contadores, favoritos, vistos
     ========================================================= */
  function paintCount(node, btn, n, label, bump = true) {
    node.hidden = !n;
    node.textContent = n;
    btn.setAttribute('aria-label', `${label}, ${plural(n, 'prenda', 'prendas')}`);
    if (!bump) return;
    node.classList.remove('bump');
    void node.offsetWidth;
    node.classList.add('bump');
  }
  function toggleWish(id, btn) {
    const on = !store.wish.has(id);
    if (on) store.wish.add(id); else store.wish.delete(id);
    persist();
    $$(`[data-wish="${id}"]`).forEach((b) => {
      b.setAttribute('aria-pressed', on);
      b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
      const label = b.querySelector('.wish-label');
      if (label) label.textContent = on ? 'Guardado' : 'Guardar';
    });
    paintCount($('#wishCount'), $('#wishBtn'), store.wish.size, 'Favoritos');
    toast(on ? `${byId(id).name} está en tus favoritos` : 'Quitado de favoritos', on ? null : () => toggleWish(id));
    if (route.name === 'favoritos' && !on && !btn?.closest('.rail')) render();
  }
  function markViewed(id) {
    store.recent = [id, ...store.recent.filter((x) => x !== id)].slice(0, 12);
    persist();
  }

  /* =========================================================
     Piezas compartidas: tarjeta y carrusel
     ========================================================= */
  function card(p, i = 0) {
    const tag = p.was ? `<span class="card-tag sale">−${off(p)}%</span>` : p.isNew ? '<span class="card-tag">Nuevo</span>' : '';
    const dots = p.colors.map((c) => `<i style="--c:${COLORS[c][1]}"></i>`).join('');
    const sizes = p.sizes.map((s) => (p.stock[s]
      ? `<button type="button" data-add="${p.id}" data-size="${s}" aria-label="Añadir ${esc(p.name)} talla ${s}">${s}</button>`
      : `<button type="button" disabled aria-label="Talla ${s} agotada">${s}</button>`)).join('');
    const liked = store.wish.has(p.id);
    const soon = Object.values(p.stock).some((n) => n > 0 && n <= 2);
    return `<li class="card" style="--i:${i % 12}">
      <div class="card-media">
        <a href="#/producto/${p.id}" class="card-link" tabindex="-1" aria-hidden="true">
          <img src="${img(p.img, 720)}" alt="" width="720" height="900" loading="lazy" decoding="async">
        </a>
        ${tag}
        <button class="icon-btn wish" type="button" data-wish="${p.id}" aria-pressed="${liked}" aria-label="Guardar ${esc(p.name)} en favoritos">${icon('heart')}</button>
        <div class="quick-add">
          <div class="qa-head"><p>${p.sizes.length > 1 ? 'Añadir talla' : 'Añadir a la bolsa'}</p><button type="button" class="qa-view" data-quick="${p.id}" aria-haspopup="dialog">Vista rápida</button></div>
          <div class="qa-sizes">${sizes}</div>
        </div>
      </div>
      <div class="card-info">
        <div class="card-top"><h3 class="card-name"><a href="#/producto/${p.id}">${esc(p.name)}</a></h3><p class="card-price">${priceHTML(p)}</p></div>
        <p class="card-desc">${esc(p.line)} · ${esc(p.cat)}</p>
        <p class="card-rating">${stars(p.rating)}<span>${p.rating.toFixed(1)}</span><span class="muted">(${p.reviews})</span><span class="sr-only">${p.rating} de 5 estrellas, ${p.reviews} reseñas</span></p>
        <div class="card-colors">${dots}<span>${p.colors.length > 1 ? `${p.colors.length} colores` : COLORS[p.colors[0]][0]}</span></div>
        ${p.low || soon ? '<p class="card-stock">Últimas unidades</p>' : ''}
      </div>
    </li>`;
  }

  function rail(title, list, opts = {}) {
    if (!list.length) return '';
    const id = `rail-${Math.random().toString(36).slice(2, 7)}`;
    return `<section class="rail${opts.cls ? ` ${opts.cls}` : ''}" aria-labelledby="${id}">
      <div class="rail-head">
        <div><h2 id="${id}">${title}</h2>${opts.sub ? `<p>${opts.sub}</p>` : ''}</div>
        <div class="rail-nav">
          ${opts.link ? `<a class="link" href="${opts.link}">${opts.linkLabel || 'Ver todo'}</a>` : ''}
          <button class="icon-btn round" type="button" data-rail="-1" aria-label="Anteriores">${icon('left')}</button>
          <button class="icon-btn round" type="button" data-rail="1" aria-label="Siguientes">${icon('right')}</button>
        </div>
      </div>
      <ul class="rail-track">${list.map(card).join('')}</ul>
    </section>`;
  }
  function mountRails(root) {
    $$('.rail', root).forEach((r) => {
      const track = $('.rail-track', r);
      const [prev, next] = $$('[data-rail]', r);
      const sync = () => {
        prev.disabled = track.scrollLeft < 8;
        next.disabled = track.scrollLeft + track.clientWidth > track.scrollWidth - 8;
      };
      [prev, next].forEach((b) => b.addEventListener('click', () => {
        track.scrollBy({ left: +b.dataset.rail * track.clientWidth * 0.9, behavior: reduce.matches ? 'auto' : 'smooth' });
      }));
      track.addEventListener('scroll', sync, { passive: true });
      requestAnimationFrame(sync);
    });
  }
  const recentRail = (skip) => rail('Vistos recientemente', store.recent.filter((id) => id !== skip).map(byId).slice(0, 10), { cls: 'rail-small' });

  /* =========================================================
     Router
     ========================================================= */
  const app = $('#app');
  let route = { name: '', parts: [], q: new URLSearchParams() };
  let cleanup = [];
  const onLeave = (fn) => cleanup.push(fn);

  function parse() {
    const raw = location.hash.slice(1) || '/';
    const [path, qs] = raw.split('?');
    const parts = path.split('/').filter(Boolean);
    return { raw, parts, q: new URLSearchParams(qs || ''), name: parts[0] || 'inicio' };
  }

  const VIEWS_MAP = {};
  let firstRender = true;
  function render() {
    const next = parse();
    const sameCatalog = next.name === 'catalogo' && route.name === 'catalogo' && next.raw === route.raw;
    cleanup.forEach((fn) => fn());
    cleanup = [];
    bagHooks.clear();
    closeMega();
    document.querySelectorAll('dialog[open]').forEach((d) => d.close());
    route = next;
    const fn = VIEWS_MAP[route.name] || VIEWS_MAP.inicio;
    document.body.dataset.view = VIEWS_MAP[route.name] ? route.name : 'inicio';
    fn(route);
    $$('#navList [data-nav]').forEach((a) => a.toggleAttribute('aria-current', a.dataset.nav === navKey()));
    if (!sameCatalog) {
      scrollTo(0, 0);
      const h = $('h1', app);
      if (h && !firstRender) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    }
    firstRender = false;
  }
  function navKey() {
    if (route.name === 'catalogo') {
      if (route.parts[1] === 'outlet') return 'outlet';
      return route.q.get('g') || (route.parts[1] === 'tailoring' ? 'sastreria' : '');
    }
    if (route.name === 'ayuda' && route.parts[1] === 'tienda') return 'tienda';
    return '';
  }
  addEventListener('hashchange', render);

  /* =========================================================
     Vista: Inicio
     ========================================================= */
  VIEWS_MAP.inicio = () => {
    const newIn = PRODUCTS.filter((p) => p.isNew);
    const best = [...PRODUCTS].sort((a, b) => b.rating * b.reviews - a.rating * a.reviews).slice(0, 10);
    const tiles = ['new', 'tailoring', 'basics', 'outlet'].map(catalogById);
    app.innerHTML = `
      <section class="home-hero">
        <img src="${img('1485462537746-965f33f7f6a7', 2000)}" alt="Mujer con abrigo rosa palo caminando bajo una arcada" width="2000" height="1333" fetchpriority="high">
        <div class="home-hero-copy">
          <p class="eyebrow">Primavera 26 · Hecho en Perú</p>
          <h1>Ropa que se queda contigo más de una temporada.</h1>
          <div class="hero-ctas">
            <a class="btn btn-white" href="#/catalogo/all?g=mujer">Comprar Mujer</a>
            <a class="btn btn-glass" href="#/catalogo/all?g=hombre">Comprar Hombre</a>
          </div>
        </div>
        <a class="hero-tag" href="#/producto/p03"><span>Abrigo rosa palo</span><b>S/ 489</b>${icon('arrow')}</a>
      </section>

      <ul class="perks" aria-label="Beneficios">
        <li>${icon('truck')}<span><b>Envío gratis en Lima</b> desde S/ 299</span></li>
        <li>${icon('return')}<span><b>Cambios gratis</b> por 30 días</span></li>
        <li>${icon('store')}<span><b>Recoge en Miraflores</b> en 2 horas</span></li>
        <li>${icon('lock')}<span><b>Paga con Yape</b>, tarjeta o PagoEfectivo</span></li>
      </ul>

      <section class="tiles" aria-labelledby="tiles-title">
        <div class="section-head"><h2 id="tiles-title">Catálogos</h2><a class="link" href="#/catalogo/all">Ver toda la tienda</a></div>
        <ul class="tiles-grid">
          ${tiles.map((c, i) => `<li class="tile tile-${i}">
            <a href="#/catalogo/${c.id}">
              <img src="${img(c.img, i === 0 ? 1400 : 900)}" alt="" loading="lazy">
              <span class="tile-copy"><b>${c.name}</b><small>${plural(PRODUCTS.filter(c.test).length, 'prenda', 'prendas')}</small></span>
              <span class="tile-go">${icon('arrow')}</span>
            </a></li>`).join('')}
        </ul>
      </section>

      ${rail('Recién llegados', newIn, { link: '#/catalogo/new', linkLabel: 'Ver Primavera 26', sub: 'Llegan a Miraflores cada jueves.' })}

      <section class="story" aria-labelledby="story-title">
        <figure class="story-photo"><img src="${img('1434389677669-e08b4cac3105', 1200)}" alt="Poncho de algodón tejido a mano colgado en un gancho" loading="lazy"></figure>
        <div class="story-copy">
          <p class="eyebrow">Hecho en Perú</p>
          <h2 id="story-title">Pima de Piura, alpaca de Arequipa y doce talleres en Lima.</h2>
          <p>Trabajamos con los mismos talleres desde 2019. Cada prenda dice en su etiqueta quién la cosió y dónde, y la mayoría viaja menos de 20 km antes de llegar a tu casa.</p>
          <dl class="facts">
            <div><dt>12</dt><dd>talleres en Lima y Arequipa</dd></div>
            <div><dt>87%</dt><dd>de fibras de origen peruano</dd></div>
            <div><dt>30 días</dt><dd>para cambiar sin costo</dd></div>
          </dl>
          <a class="btn btn-line" href="#/ayuda/nosotros">Conoce los talleres</a>
        </div>
      </section>

      ${rail('Los más queridos', best, { sub: 'Lo mejor valorado por quienes ya compraron.' })}

      <section class="visit" aria-labelledby="visit-title">
        <div class="visit-copy">
          <p class="eyebrow">Tienda</p>
          <h2 id="visit-title">Pruébatelo en Calle Berlín.</h2>
          <p>Reserva hasta cinco prendas desde la web y te esperan listas en un probador. Ajustes de sastrería gratis en 48 horas.</p>
          <p class="visit-meta">${STORE.addr}<br>${STORE.hours}</p>
          <a class="btn btn-ink" href="#/ayuda/tienda">Cómo llegar y servicios</a>
        </div>
        <figure class="visit-photo"><img src="${img('1441984904996-e0b6ba687e04', 1400)}" alt="Interior de la tienda con percheros y lámparas colgantes" loading="lazy"></figure>
      </section>

      ${recentRail()}
    `;
    mountRails(app);
  };

  /* =========================================================
     Vista: Catálogo
     ========================================================= */
  const PAGE = 12;
  const cstate = {
    key: '', catalog: 'new', q: '', cat: new Set(), size: new Set(), color: new Set(), line: new Set(), g: new Set(),
    min: 0, max: 0, lo: 0, hi: 0, sale: false, fast: false, sort: 'relevance', shown: PAGE, cols: '3', panel: true,
  };

  VIEWS_MAP.catalogo = (r) => {
    const s = cstate;
    const c = catalogById(r.parts[1]);
    if (s.key !== r.raw) {
      s.key = r.raw;
      s.catalog = c.id;
      ['cat', 'size', 'color', 'line', 'g'].forEach((k) => s[k].clear());
      s.q = r.q.get('q') || '';
      if (r.q.get('g')) s.g.add(r.q.get('g'));
      if (r.q.get('cat')) s.cat.add(r.q.get('cat'));
      s.sale = s.fast = false;
      s.sort = 'relevance';
      s.shown = PAGE;
      s.lo = s.hi = null;
    }
    const gLabel = s.g.size === 1 ? ({ mujer: 'Mujer', hombre: 'Hombre' }[[...s.g][0]]) : '';

    app.innerHTML = `
      <div class="wrap">
        <div class="catalogs" role="tablist" aria-label="Catálogos">
          ${CATALOGS.map((x) => {
            const sel = x.id === c.id;
            return `<a class="cat-tab" role="tab" href="#/catalogo/${x.id}${gLabel ? `?g=${[...s.g][0]}` : ''}" aria-selected="${sel}" tabindex="${sel ? 0 : -1}">
              <img src="${img(x.img, 160)}" alt="" width="48" height="56" loading="lazy">
              <span><b>${x.name}</b><small>${plural(PRODUCTS.filter(x.test).length, 'prenda', 'prendas')}</small></span></a>`;
          }).join('')}
        </div>

        <header class="catalog-head">
          <figure class="catalog-photo"><img src="${img(c.img, 1800)}" alt="" width="1800" height="1000"></figure>
          <div class="catalog-copy">
            <p class="crumbs"><a href="#/">Inicio</a><span aria-hidden="true">/</span>${gLabel ? `<a href="#/catalogo/all?g=${[...s.g][0]}">${gLabel}</a><span aria-hidden="true">/</span>` : ''}<span aria-current="page">${c.name}</span></p>
            <h1>${s.q ? `“${esc(s.q)}”` : `${c.title}${gLabel && c.id === 'all' ? ` · ${gLabel}` : ''}`}</h1>
            <p class="catalog-lede">${s.q ? `Resultados de búsqueda en ${c.name}.` : c.lede}</p>
            <p class="catalog-meta" id="catalogMeta"></p>
          </div>
        </header>

        <div class="toolbar" id="toolbar">
          <button class="tool-btn" type="button" id="filtersToggle" aria-controls="filters" aria-expanded="true">
            ${icon('filter')}<span class="ft-label">Filtros</span><span class="ft-count" id="filterCount"></span>
          </button>
          <label class="search">
            <span class="sr-only">Buscar en este catálogo</span>${icon('search')}
            <input id="searchInput" type="search" placeholder="Buscar prenda, tela o color" autocomplete="off" value="${esc(s.q)}">
          </label>
          <p class="result-count" id="resultCount" aria-live="polite"></p>
          <label class="sort">
            <span class="sort-label">Ordenar</span>
            <select id="sortSelect">
              ${[['relevance', 'Relevancia'], ['new', 'Novedades'], ['rating', 'Mejor valorados'], ['price-asc', 'Precio: menor a mayor'], ['price-desc', 'Precio: mayor a menor'], ['discount', 'Mayor descuento']]
                .map(([v, l]) => `<option value="${v}" ${s.sort === v ? 'selected' : ''}>${l}</option>`).join('')}
            </select>${icon('chevron')}
          </label>
          <div class="density" role="group" aria-label="Productos por fila">
            ${['2', '3', '4'].map((n) => `<button type="button" data-cols="${n}" aria-pressed="${s.cols === n}">${n}</button>`).join('')}
          </div>
        </div>

        <div class="quick-cats" id="quickCats" role="group" aria-label="Categoría rápida"></div>
        <div class="active-filters" id="activeFilters" aria-label="Filtros aplicados"></div>

        <div class="catalog${s.panel ? '' : ' no-filters'}" id="catalog">
          <aside class="filters" id="filters" aria-label="Filtros">
            <div class="filters-head">
              <h2>Filtros</h2>
              <button class="icon-btn" type="button" id="filtersClose" aria-label="Cerrar filtros">${icon('x')}</button>
            </div>
            <div class="filters-body">
              <details class="fgroup" open><summary>Para ${icon('chevron')}</summary><div class="fopts" data-facet="g"></div></details>
              <details class="fgroup" open><summary>Categoría ${icon('chevron')}</summary><div class="fopts" data-facet="cat"></div></details>
              <details class="fgroup" open><summary>Talla ${icon('chevron')}</summary><div data-facet="size"></div>
                <button class="link fg-link" type="button" data-sizeguide>¿Cuál es mi talla?</button></details>
              <details class="fgroup" open><summary>Color ${icon('chevron')}</summary><div class="swatches" data-facet="color"></div></details>
              <details class="fgroup" open><summary>Precio ${icon('chevron')}</summary>
                <div class="price">
                  <div class="price-track"><span class="price-fill" id="priceFill"></span>
                    <input type="range" id="priceMin" aria-label="Precio mínimo" step="10">
                    <input type="range" id="priceMax" aria-label="Precio máximo" step="10">
                  </div>
                  <div class="price-values"><span id="priceMinOut"></span><span id="priceMaxOut"></span></div>
                </div>
              </details>
              <details class="fgroup"><summary>Línea ${icon('chevron')}</summary><div class="fopts" data-facet="line"></div></details>
              <details class="fgroup" open><summary>Disponibilidad ${icon('chevron')}</summary>
                <div class="fopts">
                  <label class="switch"><span>Solo en oferta</span><input type="checkbox" id="onlySale" role="switch" ${s.sale ? 'checked' : ''}></label>
                  <label class="switch"><span>Entrega en 24 h en Lima</span><input type="checkbox" id="onlyFast" role="switch" ${s.fast ? 'checked' : ''}></label>
                </div>
              </details>
            </div>
            <div class="filters-foot">
              <button class="btn btn-ghost" type="button" id="clearAllPanel">Limpiar</button>
              <button class="btn btn-ink" type="button" id="applyPanel">Ver prendas</button>
            </div>
          </aside>

          <div class="results">
            <ul class="grid" id="grid" data-cols="${s.cols}"></ul>
            <div class="empty" id="empty" hidden>
              <p class="empty-title">Nada con estos filtros.</p>
              <p class="empty-text">Prueba quitando una talla, ampliando el precio o busca en toda la tienda.</p>
              <div class="empty-actions">
                <button class="btn btn-ink" type="button" id="emptyClear">Limpiar filtros</button>
                ${c.id !== 'all' ? `<a class="btn btn-line" href="#/catalogo/all${s.q ? `?q=${encodeURIComponent(s.q)}` : ''}">Buscar en toda la tienda</a>` : ''}
              </div>
            </div>
            <div class="more" id="more">
              <p class="more-label" id="moreLabel"></p>
              <span class="more-bar" aria-hidden="true"><span id="moreFill"></span></span>
              <button class="btn btn-line" type="button" id="moreBtn">Cargar más</button>
            </div>
          </div>
        </div>

        ${recentRail()}
      </div>`;

    const el = {
      grid: $('#grid'), empty: $('#empty'), more: $('#more'), moreLabel: $('#moreLabel'), moreFill: $('#moreFill'), moreBtn: $('#moreBtn'),
      count: $('#resultCount'), search: $('#searchInput'), sort: $('#sortSelect'), active: $('#activeFilters'), quick: $('#quickCats'),
      filterCount: $('#filterCount'), pMin: $('#priceMin'), pMax: $('#priceMax'), pFill: $('#priceFill'), pMinOut: $('#priceMinOut'), pMaxOut: $('#priceMaxOut'),
      sale: $('#onlySale'), fast: $('#onlyFast'), filters: $('#filters'), catalog: $('#catalog'), toggle: $('#filtersToggle'), apply: $('#applyPanel'), toolbar: $('#toolbar'),
    };

    const base = () => PRODUCTS.filter(c.test);
    const matches = (p, skip) => {
      const q = s.q.trim().toLowerCase();
      if (q) {
        const hay = [p.name, p.cat, p.line, p.desc, p.g, ...p.colors.map((x) => COLORS[x][0])].join(' ').toLowerCase()
          .normalize('NFD').replace(/[̀-ͯ]/g, '');
        if (!q.normalize('NFD').replace(/[̀-ͯ]/g, '').split(/\s+/).every((w) => hay.includes(w))) return false;
      }
      if (skip !== 'g' && s.g.size && !(p.g === 'unisex' || s.g.has(p.g))) return false;
      if (skip !== 'cat' && s.cat.size && !s.cat.has(p.cat)) return false;
      if (skip !== 'line' && s.line.size && !s.line.has(p.line)) return false;
      if (skip !== 'color' && s.color.size && !p.colors.some((x) => s.color.has(x))) return false;
      if (skip !== 'size' && s.size.size && !p.sizes.some((x) => s.size.has(x) && p.stock[x])) return false;
      if (skip !== 'price' && (p.price < s.lo || p.price > s.hi)) return false;
      if (s.sale && !p.was) return false;
      if (s.fast && !p.fast) return false;
      return true;
    };
    const sorted = (list) => [...list].sort({
      relevance: (a, b) => a.order - b.order,
      new: (a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0) || a.order - b.order,
      rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      discount: (a, b) => off(b) - off(a) || a.price - b.price,
    }[s.sort]);
    const facetCount = (facet, test) => base().filter((p) => matches(p, facet) && test(p)).length;
    const toggleIn = (set, v) => (set.has(v) ? set.delete(v) : set.add(v));

    // precio
    const prices = base().map((p) => p.price);
    s.min = Math.floor(Math.min(...prices) / 10) * 10;
    s.max = Math.ceil(Math.max(...prices) / 10) * 10;
    if (s.lo == null) { s.lo = s.min; s.hi = s.max; }
    [el.pMin, el.pMax].forEach((x) => { x.min = s.min; x.max = s.max; });
    el.pMin.value = s.lo;
    el.pMax.value = s.hi;
    const paintPrice = () => {
      const span = s.max - s.min || 1;
      el.pFill.style.left = `${((s.lo - s.min) / span) * 100}%`;
      el.pFill.style.right = `${100 - ((s.hi - s.min) / span) * 100}%`;
      el.pMinOut.textContent = money(s.lo);
      el.pMaxOut.textContent = money(s.hi);
      el.pMin.setAttribute('aria-valuetext', money(s.lo));
      el.pMax.setAttribute('aria-valuetext', money(s.hi));
    };
    let priceTimer;
    const onPrice = (e) => {
      let lo = +el.pMin.value;
      let hi = +el.pMax.value;
      if (lo > hi - 20) {
        if (e.target === el.pMin) lo = hi - 20; else hi = lo + 20;
        el.pMin.value = lo; el.pMax.value = hi;
      }
      s.lo = Math.max(lo, s.min);
      s.hi = Math.min(hi, s.max);
      paintPrice();
      clearTimeout(priceTimer);
      priceTimer = setTimeout(commit, 120);
    };
    el.pMin.addEventListener('input', onPrice);
    el.pMax.addEventListener('input', onPrice);

    const opt = (facet, v, label, n, on) => `<label class="fopt${n || on ? '' : ' zero'}"><input type="checkbox" data-f="${facet}" value="${esc(v)}" ${on ? 'checked' : ''}><span>${esc(label)}</span><small>${n}</small></label>`;

    function renderFacets() {
      const list = base();
      const uniq = (f) => [...new Set(list.flatMap(f))];
      $('[data-facet="g"]').innerHTML = [['mujer', 'Mujer'], ['hombre', 'Hombre']]
        .map(([v, l]) => opt('g', v, l, facetCount('g', (p) => p.g === v || p.g === 'unisex'), s.g.has(v))).join('');
      const cats = uniq((p) => [p.cat]);
      $('[data-facet="cat"]').innerHTML = cats.map((v) => opt('cat', v, v, facetCount('cat', (p) => p.cat === v), s.cat.has(v))).join('');
      $('[data-facet="line"]').innerHTML = uniq((p) => [p.line]).map((v) => opt('line', v, v, facetCount('line', (p) => p.line === v), s.line.has(v))).join('');

      const all = uniq((p) => p.sizes);
      const groups = ['Ropa', 'Calzado', 'Accesorios'].map((g) => [g, [...APPAREL, ...SHOES, ...ONE].filter((x) => all.includes(x) && sizeGroup(x) === g)]).filter(([, v]) => v.length);
      $('[data-facet="size"]').innerHTML = groups.map(([g, list2]) => `
        ${groups.length > 1 ? `<p class="size-group">${g}</p>` : ''}
        <div class="sizes">${list2.map((x) => {
          const n = facetCount('size', (p) => p.sizes.includes(x) && p.stock[x] > 0);
          const on = s.size.has(x);
          return `<button type="button" class="size-opt" data-f="size" value="${x}" aria-pressed="${on}" ${!n && !on ? 'disabled' : ''} aria-label="Talla ${x}, ${plural(n, 'prenda', 'prendas')}">${x}</button>`;
        }).join('')}</div>`).join('');

      const colors = Object.keys(COLORS).filter((x) => list.some((p) => p.colors.includes(x)));
      $('[data-facet="color"]').innerHTML = colors.map((x) => {
        const n = facetCount('color', (p) => p.colors.includes(x));
        const on = s.color.has(x);
        return `<button type="button" class="sw" data-f="color" value="${x}" aria-pressed="${on}" ${!n && !on ? 'disabled' : ''} aria-label="${COLORS[x][0]}, ${plural(n, 'prenda', 'prendas')}" style="--c:${COLORS[x][1]}"><i></i>${COLORS[x][0]}</button>`;
      }).join('');

      el.quick.innerHTML = `<button type="button" class="qc" data-qc="" aria-pressed="${!s.cat.size}">Todo<sup>${facetCount('cat', () => true)}</sup></button>${
        cats.map((v) => `<button type="button" class="qc" data-qc="${esc(v)}" aria-pressed="${s.cat.size === 1 && s.cat.has(v)}">${esc(v)}<sup>${facetCount('cat', (p) => p.cat === v)}</sup></button>`).join('')}`;
    }

    function activeList() {
      const out = [];
      if (s.q.trim()) out.push({ k: 'q', label: `“${s.q.trim()}”` });
      s.g.forEach((v) => out.push({ k: 'g', v, label: v === 'mujer' ? 'Mujer' : 'Hombre' }));
      s.cat.forEach((v) => out.push({ k: 'cat', v, label: v }));
      s.size.forEach((v) => out.push({ k: 'size', v, label: `Talla ${v}` }));
      s.color.forEach((v) => out.push({ k: 'color', v, label: COLORS[v][0] }));
      s.line.forEach((v) => out.push({ k: 'line', v, label: v }));
      if (s.lo > s.min || s.hi < s.max) out.push({ k: 'price', label: `${money(s.lo)} – ${money(s.hi)}` });
      if (s.sale) out.push({ k: 'sale', label: 'En oferta' });
      if (s.fast) out.push({ k: 'fast', label: 'Entrega en 24 h' });
      return out;
    }
    let activeCache = [];
    function renderActive() {
      activeCache = activeList();
      const n = activeCache.filter((f) => f.k !== 'q').length;
      el.filterCount.textContent = n || '';
      el.toggle.setAttribute('aria-label', n ? `Filtros, ${n} aplicados` : 'Filtros');
      el.active.innerHTML = activeCache.length
        ? activeCache.map((f, i) => `<button type="button" class="af" data-i="${i}" aria-label="Quitar filtro ${esc(f.label)}">${esc(f.label)}${icon('x')}</button>`).join('')
          + (activeCache.length > 1 ? '<button type="button" class="af-clear" data-clear>Limpiar todo</button>' : '')
        : '';
    }
    function removeFilter(f) {
      if (f.k === 'q') { s.q = ''; el.search.value = ''; }
      else if (f.k === 'price') { s.lo = s.min; s.hi = s.max; el.pMin.value = s.lo; el.pMax.value = s.hi; paintPrice(); }
      else if (f.k === 'sale') { s.sale = false; el.sale.checked = false; }
      else if (f.k === 'fast') { s.fast = false; el.fast.checked = false; }
      else s[f.k].delete(f.v);
    }
    function resetFilters() {
      ['cat', 'size', 'color', 'line', 'g'].forEach((k) => s[k].clear());
      s.q = ''; el.search.value = '';
      s.sale = s.fast = false; el.sale.checked = el.fast.checked = false;
      s.lo = s.min; s.hi = s.max; el.pMin.value = s.lo; el.pMax.value = s.hi; paintPrice();
      commit();
    }

    const promo = `<li class="promo" style="--i:4">
      <a href="#/ayuda/tienda">
        <img src="${img('1441984904996-e0b6ba687e04', 800)}" alt="" loading="lazy">
        <span class="promo-copy"><small>Tienda Miraflores</small><b>Reserva tus tallas y pruébatelas antes de pagar.</b><span class="promo-cta">Cómo funciona ${icon('arrow')}</span></span>
      </a></li>`;

    function paintGrid(append) {
      const list = sorted(base().filter((p) => matches(p)));
      const visible = list.slice(0, s.shown);
      const showPromo = !activeCache.length && s.sort === 'relevance' && list.length > 6;
      if (append) {
        const have = $$('.card', el.grid).length;
        el.grid.insertAdjacentHTML('beforeend', visible.slice(have).map(card).join(''));
      } else {
        const cards = visible.map(card);
        if (showPromo) cards.splice(4, 0, promo);
        el.grid.innerHTML = cards.join('');
      }
      el.empty.hidden = list.length > 0;
      el.count.innerHTML = `<b>${list.length}</b> ${list.length === 1 ? 'prenda' : 'prendas'}`;
      el.apply.textContent = list.length ? `Ver ${plural(list.length, 'prenda', 'prendas')}` : 'Sin resultados';
      el.more.hidden = !list.length;
      el.moreLabel.textContent = `Mostrando ${visible.length} de ${list.length}`;
      el.moreFill.style.width = `${list.length ? (visible.length / list.length) * 100 : 0}%`;
      el.moreBtn.hidden = visible.length >= list.length;
      const all = base();
      const sale = all.filter((p) => p.was).length;
      $('#catalogMeta').textContent = `${plural(all.length, 'prenda', 'prendas')} · desde ${money(Math.min(...all.map((p) => p.price)))}${sale && c.id !== 'outlet' ? ` · ${sale} en oferta` : ''}`;
    }
    function commit(append) {
      if (!append) s.shown = PAGE;
      renderActive();
      renderFacets();
      paintGrid(append);
    }

    el.filters.addEventListener('change', (e) => { if (e.target.dataset.f) { toggleIn(s[e.target.dataset.f], e.target.value); commit(); } });
    el.filters.addEventListener('click', (e) => { const b = e.target.closest('button[data-f]'); if (b) { toggleIn(s[b.dataset.f], b.value); commit(); } });
    el.quick.addEventListener('click', (e) => {
      const b = e.target.closest('[data-qc]');
      if (!b) return;
      s.cat.clear();
      if (b.dataset.qc) s.cat.add(b.dataset.qc);
      commit();
    });
    el.sale.addEventListener('change', () => { s.sale = el.sale.checked; commit(); });
    el.fast.addEventListener('change', () => { s.fast = el.fast.checked; commit(); });
    el.active.addEventListener('click', (e) => {
      if (e.target.closest('[data-clear]')) { resetFilters(); el.search.focus(); return; }
      const b = e.target.closest('.af');
      if (!b) return;
      removeFilter(activeCache[+b.dataset.i]);
      commit();
      ($('.af', el.active) || el.search).focus();
    });
    $('#emptyClear').addEventListener('click', resetFilters);
    $('#clearAllPanel').addEventListener('click', resetFilters);
    el.moreBtn.addEventListener('click', () => {
      const have = $$('.card', el.grid).length;
      s.shown += PAGE;
      commit(true);
      $$('.card', el.grid)[have]?.querySelector('.card-name a')?.focus({ preventScroll: true });
    });
    let qTimer;
    el.search.addEventListener('input', () => { clearTimeout(qTimer); qTimer = setTimeout(() => { s.q = el.search.value; commit(); }, 140); });
    el.sort.addEventListener('change', () => { s.sort = el.sort.value; commit(); });
    $$('.density button').forEach((b) => b.addEventListener('click', () => {
      $$('.density button').forEach((x) => x.setAttribute('aria-pressed', x === b));
      s.cols = b.dataset.cols;
      el.grid.dataset.cols = s.cols;
    }));

    // catálogos como pestañas: flechas para moverse
    const tablist = $('.catalogs');
    tablist.addEventListener('keydown', (e) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
      e.preventDefault();
      const tabs = $$('.cat-tab', tablist);
      const i = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
      const n = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      tabs[n].focus();
      location.hash = tabs[n].getAttribute('href');
    });
    $('.cat-tab[aria-selected="true"]', tablist)?.scrollIntoView({ block: 'nearest', inline: 'center' });

    // panel de filtros
    let lastFocus = null;
    const openPanel = () => {
      lastFocus = document.activeElement;
      el.filters.classList.add('open');
      el.filters.setAttribute('role', 'dialog');
      el.filters.setAttribute('aria-modal', 'true');
      el.toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('locked');
      $('#filtersClose').focus();
    };
    const closePanel = () => {
      if (!el.filters.classList.contains('open')) return;
      el.filters.classList.remove('open');
      el.filters.removeAttribute('role');
      el.filters.removeAttribute('aria-modal');
      el.toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('locked');
      lastFocus?.focus();
    };
    el.toggle.addEventListener('click', () => {
      if (mobile.matches) return el.filters.classList.contains('open') ? closePanel() : openPanel();
      s.panel = !s.panel;
      el.catalog.classList.toggle('no-filters', !s.panel);
      el.toggle.setAttribute('aria-expanded', String(s.panel));
    });
    $('#filtersClose').addEventListener('click', closePanel);
    el.apply.addEventListener('click', closePanel);
    el.filters.addEventListener('keydown', (e) => {
      if (!el.filters.classList.contains('open')) return;
      if (e.key === 'Escape') { e.stopPropagation(); closePanel(); return; }
      if (e.key !== 'Tab') return;
      const f = $$('button:not([disabled]), input, summary', el.filters).filter((x) => x.offsetParent);
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); }
      else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
    });
    const outside = (e) => { if (el.filters.classList.contains('open') && !el.filters.contains(e.target) && !el.toggle.contains(e.target)) closePanel(); };
    document.addEventListener('click', outside);
    const syncMode = () => {
      if (!mobile.matches) closePanel();
      el.toggle.setAttribute('aria-expanded', String(mobile.matches ? false : s.panel));
    };
    mobile.addEventListener('change', syncMode);
    const onScroll = () => el.toolbar.classList.toggle('stuck', el.toolbar.getBoundingClientRect().top <= $('#nav').offsetHeight + 1);
    addEventListener('scroll', onScroll, { passive: true });
    onLeave(() => {
      document.removeEventListener('click', outside);
      mobile.removeEventListener('change', syncMode);
      removeEventListener('scroll', onScroll);
      document.body.classList.remove('locked');
    });

    paintPrice();
    commit();
    syncMode();
    mountRails(app);
  };

  /* =========================================================
     Vista: Producto
     ========================================================= */
  VIEWS_MAP.producto = (r) => {
    const p = byId(r.parts[1]);
    if (!p) { location.hash = '#/catalogo/all'; return; }
    markViewed(p.id);
    const reviews = reviewsFor(p);
    const avail = p.sizes.filter((x) => p.stock[x]);
    const st = {
      color: p.colors[0],
      size: p.sizes.length === 1 && p.stock[p.sizes[0]] ? p.sizes[0] : (store.size && p.stock[store.size] ? store.size : null),
      qty: 1, rsize: '', rsort: 'recent', useful: new Set(),
    };
    const dist = [5, 4, 3, 2, 1].map((n) => {
      const base = n === 5 ? 0.62 : n === 4 ? 0.24 : n === 3 ? 0.08 : n === 2 ? 0.04 : 0.02;
      const adj = n === 5 ? (p.rating - 4.5) * 0.5 : n === 4 ? -(p.rating - 4.5) * 0.3 : 0;
      return [n, Math.max(0, Math.round(p.reviews * (base + adj)))];
    });
    const fitPct = { '-1': p.fit === -1 ? 38 : 9, 0: p.fit ? 55 : 82, 1: p.fit === 1 ? 37 : 9 };
    const fitLabel = { '-1': 'Talla pequeña: considera una más', 0: 'Talla normal: pide tu talla de siempre', 1: 'Talla grande: considera una menos' }[p.fit];
    const cuota = Math.ceil((p.price / 3) * 100) / 100;
    const catLink = `#/catalogo/all?cat=${encodeURIComponent(p.cat)}`;
    const similar = PRODUCTS.filter((x) => x.id !== p.id && (x.cat === p.cat || x.in.some((c) => p.in.includes(c)))).slice(0, 10);
    const look = PRODUCTS.filter((x) => x.id !== p.id && x.cat !== p.cat && (x.g === p.g || x.g === 'unisex' || p.g === 'unisex'))
      .sort((a, b) => hash(p.id + a.id) - hash(p.id + b.id)).slice(0, 3);
    const model = p.sizes === ONE ? '' : p.sizes === SHOES ? 'Horma estándar. Si tienes pie ancho, elige medio número más.'
      : p.g === 'hombre' ? 'El modelo mide 1,83 m y usa talla M.' : 'La modelo mide 1,74 m y usa talla S.';

    app.innerHTML = `
      <div class="wrap">
        <p class="crumbs dark"><a href="#/">Inicio</a><span aria-hidden="true">/</span><a href="#/catalogo/all?g=${p.g === 'hombre' ? 'hombre' : 'mujer'}">${p.g === 'hombre' ? 'Hombre' : 'Mujer'}</a><span aria-hidden="true">/</span><a href="${catLink}">${esc(p.cat)}</a><span aria-hidden="true">/</span><span aria-current="page">${esc(p.name)}</span></p>

        <div class="pdp">
          <div class="gallery" aria-label="Fotos de ${esc(p.name)}">
            <ul class="gallery-track" id="gTrack">
              ${VIEWS.map((v, i) => `<li><button type="button" class="g-item" data-lb="${i}" aria-label="Ampliar foto ${i + 1} de ${VIEWS.length}">
                <img src="${view(p.img, v, 1000)}" alt="${i === 0 ? esc(p.name) : `Detalle ${i} de ${esc(p.name)}`}" width="1000" height="1250" ${i ? 'loading="lazy"' : 'fetchpriority="high"'}>
                <span class="g-zoom">${icon('zoom')}</span></button></li>`).join('')}
            </ul>
            <p class="g-count" id="gCount" aria-hidden="true">1 / ${VIEWS.length}</p>
          </div>

          <div class="buy" id="buy">
            <p class="buy-line">${esc(p.line)}${p.isNew ? ' · Nuevo' : ''}</p>
            <h1>${esc(p.name)}</h1>
            <a class="buy-rating" href="#reviews" data-scroll="reviews">${stars(p.rating)}<span>${p.rating.toFixed(1)}</span><span class="muted">${p.reviews} reseñas</span></a>
            <p class="buy-price">${priceHTML(p)}${p.was ? `<span class="save">Ahorras ${money(p.was - p.price)}</span>` : ''}</p>
            <p class="buy-cuotas">o 3 cuotas sin intereses de ${money(cuota)} con tarjetas BCP, Interbank y BBVA</p>

            <fieldset class="buy-block">
              <legend>Color: <b id="bColorName">${COLORS[st.color][0]}</b></legend>
              <div class="b-colors" id="bColors">
                ${p.colors.map((c2) => `<button type="button" class="sw big" data-c="${c2}" aria-pressed="${c2 === st.color}" aria-label="${COLORS[c2][0]}" style="--c:${COLORS[c2][1]}"><i></i></button>`).join('')}
              </div>
            </fieldset>

            <fieldset class="buy-block">
              <legend class="legend-row"><span>Talla${p.sizes.length > 1 ? `: <b id="bSizeName">${st.size || 'elige una'}</b>` : ''}</span>
                ${p.sizes.length > 1 ? `<button type="button" class="link" data-sizeguide="${p.sizes === SHOES ? 'calzado' : 'finder'}">${icon('ruler')}Guía de tallas</button>` : ''}</legend>
              <div class="b-sizes${p.sizes.length === 1 ? ' one' : ''}" id="bSizes">
                ${p.sizes.map((x) => (p.stock[x]
                  ? `<button type="button" class="size-opt" data-s="${x}" aria-pressed="${x === st.size}">${x}${p.stock[x] <= 2 ? `<small>Quedan ${p.stock[x]}</small>` : ''}</button>`
                  : `<button type="button" class="size-opt soldout" data-notify="${x}" aria-label="Talla ${x} agotada. Avísame cuando vuelva">${x}<small>Avísame</small></button>`)).join('')}
              </div>
              ${p.sizes.length > 1 ? `<p class="fit-hint">${icon('ruler')}<span><b>${fitLabel}.</b> ${store.size && p.sizes === APPAREL ? `Tu talla guardada es <b>${store.size}</b>.` : '<button type="button" class="link" data-sizeguide="finder">Encuentra tu talla en 30 segundos</button>'}</span></p>` : ''}
            </fieldset>

            <p class="buy-msg" id="buyMsg" aria-live="polite"></p>
            <div class="buy-actions">
              <div class="qty big" aria-label="Cantidad">
                <button type="button" data-q="-1" aria-label="Quitar una">${icon('minus')}</button>
                <output id="bQty">1</output>
                <button type="button" data-q="1" aria-label="Añadir una">${icon('plus')}</button>
              </div>
              <button class="btn btn-ink btn-grow" type="button" id="addBtn">Añadir a la bolsa · ${money(p.price)}</button>
              <button class="icon-btn wish-big" type="button" data-wish="${p.id}" aria-pressed="${store.wish.has(p.id)}" aria-label="Guardar en favoritos">${icon('heart')}</button>
            </div>
            <p class="buy-stock">${avail.length ? `${icon('check')} En stock · ${p.fast ? 'sale hoy desde Miraflores' : 'sale en 24 h'}` : 'Agotado en todas las tallas'}</p>

            <div class="delivery">
              <label class="delivery-row"><span>Entrega en</span>
                <select id="dSelect">${DISTRICTS.map(([v, l, z]) => `<option value="${v}" ${v === store.district ? 'selected' : ''}>${l}${z === 'prov' ? ' (provincia)' : ''}</option>`).join('')}</select>
              </label>
              <ul class="delivery-list" id="dList"></ul>
            </div>

            <div class="acc">
              <details open><summary>Descripción y calce ${icon('chevron')}</summary>
                <div><p>${esc(p.desc)} ${p.fast ? 'Disponible para entrega en 24 horas en Lima.' : ''}</p>${model ? `<p>${model}</p>` : ''}<p>Código ${p.id.toUpperCase()}-26 · Línea ${esc(p.line)}</p></div></details>
              <details><summary>Composición y cuidado ${icon('chevron')}</summary>
                <div><p><b>Composición:</b> ${CARE[p.cat][0]}.</p><p><b>Cuidado:</b> ${CARE[p.cat][1]}</p><p>Confeccionado en ${p.line === 'Taller Lima' ? 'Arequipa' : 'Lima'}, Perú.</p></div></details>
              <details><summary>Envíos, cambios y devoluciones ${icon('chevron')}</summary>
                <div><p>Envío gratis en Lima desde S/ 299 y a provincia desde S/ 499. Recojo gratis en tienda en 2 horas.</p><p>Tienes 30 días para cambiar o devolver sin costo, en tienda o con recojo a domicilio. <a class="link" href="#/ayuda/cambios">Cómo funciona</a></p></div></details>
            </div>
          </div>
        </div>

        ${look.length ? `<section class="look" aria-labelledby="look-title">
          <div class="look-photo"><img src="${img(p.img, 900)}" alt="" loading="lazy"></div>
          <div class="look-body">
            <h2 id="look-title">Completa el look</h2>
            <p class="muted">Elegido por el equipo de Vincce para combinar con ${esc(p.name.toLowerCase())}.</p>
            <ul class="look-list">
              ${look.map((x) => `<li class="look-item">
                <img src="${img(x.img, 200)}" alt="" width="72" height="90" loading="lazy">
                <div><a href="#/producto/${x.id}">${esc(x.name)}</a><p>${priceHTML(x)}</p></div>
                <button class="btn btn-line btn-sm" type="button" data-quick="${x.id}" aria-haspopup="dialog" aria-label="Elegir talla de ${esc(x.name)}">Elegir talla</button>
              </li>`).join('')}
            </ul>
          </div>
        </section>` : ''}

        <section class="reviews" id="reviews" aria-labelledby="rev-title">
          <div class="rev-summary">
            <h2 id="rev-title">Reseñas</h2>
            <p class="rev-score"><b>${p.rating.toFixed(1)}</b>${stars(p.rating)}</p>
            <p class="muted">${p.reviews} reseñas de compradores verificados</p>
            <ul class="rev-dist">
              ${dist.map(([n, count]) => `<li><span>${n}</span>${icon('star')}<span class="bar"><span style="width:${(count / p.reviews) * 100}%"></span></span><span class="muted">${count}</span></li>`).join('')}
            </ul>
            <div class="fitbar" aria-label="Calce según compradores">
              <p><b>¿Cómo queda?</b></p>
              <div class="fit-scale">${[-1, 0, 1].map((f) => `<span class="${f === p.fit ? 'on' : ''}" style="flex:${fitPct[f]}"></span>`).join('')}</div>
              <div class="fit-labels"><span>Pequeña ${fitPct[-1]}%</span><span>Perfecta ${fitPct[0]}%</span><span>Grande ${fitPct[1]}%</span></div>
            </div>
            <button class="btn btn-line btn-wide" type="button" id="writeReview">Escribir una reseña</button>
          </div>
          <div class="rev-list-wrap">
            <div class="rev-tools">
              <div class="chips" role="group" aria-label="Filtrar por talla comprada">
                <button type="button" class="chip" data-rs="" aria-pressed="true">Todas</button>
                ${[...new Set(reviews.map((x) => x.size))].map((x) => `<button type="button" class="chip" data-rs="${x}" aria-pressed="false">Talla ${x}</button>`).join('')}
              </div>
              <label class="sort small"><span class="sr-only">Ordenar reseñas</span>
                <select id="rSort"><option value="recent">Más recientes</option><option value="top">Mejor valoradas</option><option value="low">Más críticas</option><option value="useful">Más útiles</option></select>${icon('chevron')}
              </label>
            </div>
            <ul class="rev-list" id="rList"></ul>
          </div>
        </section>

        ${rail('También te puede gustar', similar)}
        ${recentRail(p.id)}
      </div>

      <div class="buybar" id="buybar" aria-hidden="true">
        <img src="${img(p.img, 120)}" alt="" width="44" height="55">
        <div><b>${esc(p.name)}</b><span>${priceHTML(p)}</span></div>
        <button class="btn btn-ink" type="button" id="barBtn" tabindex="-1">Añadir a la bolsa</button>
      </div>`;

    // galería (móvil: carrusel con contador)
    const track = $('#gTrack');
    const onTrack = () => { $('#gCount').textContent = `${Math.round(track.scrollLeft / track.clientWidth) + 1} / ${VIEWS.length}`; };
    track.addEventListener('scroll', onTrack, { passive: true });
    track.addEventListener('click', (e) => { const b = e.target.closest('[data-lb]'); if (b) openLightbox(VIEWS.map((v) => view(p.img, v, 1600)), +b.dataset.lb, p.name, b); });

    // color y talla
    const paintSizes = () => {
      $$('#bSizes [data-s]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.s === st.size));
      const n = $('#bSizeName');
      if (n) n.textContent = st.size || 'elige una';
    };
    $('#bColors').addEventListener('click', (e) => {
      const b = e.target.closest('[data-c]');
      if (!b) return;
      st.color = b.dataset.c;
      $$('#bColors [data-c]').forEach((x) => x.setAttribute('aria-pressed', x === b));
      $('#bColorName').textContent = COLORS[st.color][0];
    });
    $('#bSizes').addEventListener('click', (e) => {
      const b = e.target.closest('[data-s]');
      if (b) { st.size = b.dataset.s; st.qty = Math.min(st.qty, p.stock[st.size]); $('#bQty').textContent = st.qty; $('#buyMsg').textContent = ''; $('#bSizes').classList.remove('need'); paintSizes(); }
      const n = e.target.closest('[data-notify]');
      if (n) openNotify(p, n.dataset.notify, n);
    });
    $('.buy-actions .qty').addEventListener('click', (e) => {
      const b = e.target.closest('[data-q]');
      if (!b) return;
      const max = st.size ? p.stock[st.size] : 5;
      st.qty = Math.max(1, Math.min(max, st.qty + +b.dataset.q));
      $('#bQty').textContent = st.qty;
      if (st.size && st.qty === max && +b.dataset.q > 0) $('#buyMsg').textContent = `Solo quedan ${max} en talla ${st.size}.`;
    });
    const add = () => {
      if (!st.size) {
        $('#buyMsg').textContent = 'Elige una talla para añadirla a la bolsa.';
        $('#bSizes').classList.remove('need'); void $('#bSizes').offsetWidth; $('#bSizes').classList.add('need');
        $('#bSizes [data-s]')?.focus({ preventScroll: true });
        $('#bSizes').scrollIntoView({ block: 'center', behavior: reduce.matches ? 'auto' : 'smooth' });
        return;
      }
      addToBag(p, st.size, st.color, st.qty);
      $('#buyMsg').textContent = '';
    };
    $('#addBtn').addEventListener('click', add);
    $('#barBtn').addEventListener('click', add);

    // entrega estimada
    const paintDelivery = () => {
      const z = zoneOf(store.district);
      const rows = [
        [icon('truck'), `Envío estándar: llega el <b>${fmtDate(addDays(z.days))}</b>`, p.price >= z.free ? 'Gratis' : `${money(z.price)} · gratis desde ${money(z.free)}`],
      ];
      if (z.express && p.fast) rows.push([icon('clock'), `Express: llega <b>mañana, ${fmtDate(addDays(1))}</b>`, `${money(EXPRESS)} · pide antes de las 14:00`]);
      rows.push([icon('store'), `Recojo en ${STORE.name}: <b>hoy desde las 18:00</b>`, 'Gratis']);
      $('#dList').innerHTML = rows.map(([i, a, b]) => `<li>${i}<span>${a}<small>${b}</small></span></li>`).join('');
    };
    $('#dSelect').addEventListener('change', (e) => { store.district = e.target.value; persist(); paintDelivery(); });
    paintDelivery();

    // reseñas
    const paintReviews = () => {
      let list = reviews.filter((x) => !st.rsize || x.size === st.rsize);
      list = [...list].sort({ recent: (a, b) => a.days - b.days, top: (a, b) => b.r - a.r, low: (a, b) => a.r - b.r, useful: (a, b) => b.useful - a.useful }[st.rsort]);
      const fitTxt = { '-1': 'Queda pequeña', 0: 'Talla perfecta', 1: 'Queda grande' };
      $('#rList').innerHTML = list.map((x) => `<li class="rev">
        <div class="rev-top">${stars(x.r)}<span class="sr-only">${x.r} de 5</span><span class="muted">hace ${x.days} días</span></div>
        <h3>${esc(x.t)}</h3>
        <p>${esc(x.x)}</p>
        <p class="rev-meta"><b>${esc(x.name)}</b> · ${esc(x.city)} · Compró talla <b>${x.size}</b> · Mide ${x.h} · <span class="fit-tag">${fitTxt[x.fit]}</span></p>
        <button type="button" class="rev-useful" data-useful="${x.id}" aria-pressed="${st.useful.has(x.id)}">¿Te fue útil? Sí (${x.useful + (st.useful.has(x.id) ? 1 : 0)})</button>
      </li>`).join('') || '<li class="muted">Aún no hay reseñas para esta talla.</li>';
    };
    $('.rev-tools .chips').addEventListener('click', (e) => {
      const b = e.target.closest('[data-rs]');
      if (!b) return;
      st.rsize = b.dataset.rs;
      $$('.rev-tools [data-rs]').forEach((x) => x.setAttribute('aria-pressed', x === b));
      paintReviews();
    });
    $('#rSort').addEventListener('change', (e) => { st.rsort = e.target.value; paintReviews(); });
    $('#rList').addEventListener('click', (e) => {
      const b = e.target.closest('[data-useful]');
      if (!b) return;
      const id = b.dataset.useful;
      if (st.useful.has(id)) st.useful.delete(id); else st.useful.add(id);
      paintReviews();
      $(`[data-useful="${id}"]`).focus();
    });
    $('#writeReview').addEventListener('click', () => toast('Te enviaremos el enlace para reseñar cuando recibas tu pedido.'));
    paintReviews();

    // barra fija de compra
    const bar = $('#buybar');
    const io = new IntersectionObserver(([en]) => {
      const show = !en.isIntersecting && en.boundingClientRect.top < 0;
      bar.classList.toggle('show', show);
      bar.setAttribute('aria-hidden', String(!show));
      $('#barBtn').tabIndex = show ? 0 : -1;
    });
    io.observe($('#addBtn'));
    onLeave(() => io.disconnect());

    mountRails(app);
  };

  /* =========================================================
     Vista: Bolsa
     ========================================================= */
  function summaryHTML(method = 'standard', compact = false) {
    const sub = subtotal();
    const dsc = discount();
    const ship = shipping(method);
    const total = sub - dsc + ship;
    const c = COUPONS[store.coupon];
    const pending = c && c.min && sub < c.min;
    return `
      <dl class="totals">
        <div><dt>Subtotal (${plural(bagCount(), 'prenda', 'prendas')})</dt><dd>${money(sub)}</dd></div>
        ${savings() ? `<div class="muted"><dt>Ahorro en ofertas</dt><dd>−${money(savings())}</dd></div>` : ''}
        ${dsc ? `<div class="good"><dt>Cupón ${store.coupon}</dt><dd>−${money(dsc)}</dd></div>` : ''}
        <div><dt>${method === 'pickup' ? 'Recojo en tienda' : method === 'express' ? 'Envío express' : `Envío a ${(DISTRICTS.find((d) => d[0] === store.district) || DISTRICTS[0])[1]}`}</dt><dd>${ship ? money(ship) : 'Gratis'}</dd></div>
        <div class="grand"><dt>Total</dt><dd>${money(total)}</dd></div>
      </dl>
      <p class="side-note">Incluye IGV (${money(Math.round((total - total / 1.18) * 100) / 100)}).${pending ? ` El cupón ${store.coupon} se activa desde ${money(c.min)}.` : ''}</p>
      ${compact ? '' : ''}`;
  }
  function couponHTML() {
    return `<form class="coupon" id="couponForm" novalidate>
      ${store.coupon ? `<p class="coupon-on">${icon('check')}<span>Cupón <b>${store.coupon}</b> · ${COUPONS[store.coupon].label}</span><button type="button" class="link" id="couponRemove">Quitar</button></p>`
        : `<details><summary>¿Tienes un cupón? ${icon('chevron')}</summary>
          <div class="coupon-row"><label class="sr-only" for="couponInput">Código de cupón</label><input id="couponInput" placeholder="Ej. VINCCE10" autocomplete="off" autocapitalize="characters"><button class="btn btn-line btn-sm" type="submit">Aplicar</button></div>
          <p class="field-msg" id="couponMsg" aria-live="polite"></p><p class="hint">Prueba VINCCE10 o BIENVENIDA.</p></details>`}
    </form>`;
  }
  function mountCoupon(root, after) {
    const form = $('#couponForm', root);
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = $('#couponInput', form).value.trim().toUpperCase();
      if (!code) { $('#couponMsg', form).textContent = 'Escribe un código.'; return; }
      if (!COUPONS[code]) { $('#couponMsg', form).textContent = `El cupón “${code}” no existe o ya venció.`; $('#couponInput', form).setAttribute('aria-invalid', 'true'); return; }
      store.coupon = code;
      persist();
      toast(`Cupón ${code} aplicado`);
      after();
    });
    $('#couponRemove', form)?.addEventListener('click', () => { store.coupon = null; persist(); after(); });
  }
  function bagLines(editable = true) {
    return store.bag.map((i) => {
      const p = byId(i.id);
      const k = lineKey(i);
      return `<li class="line" data-key="${esc(k)}">
        <a href="#/producto/${p.id}" class="line-img" tabindex="-1" aria-hidden="true"><img src="${img(p.img, 240)}" alt="" width="96" height="120"></a>
        <div class="line-body">
          <div class="line-top"><a href="#/producto/${p.id}"><b>${esc(p.name)}</b></a><strong>${money(p.price * i.qty)}</strong></div>
          <p class="muted">${COLORS[i.color][0]} · ${p.was ? `<s>${money(p.was)}</s> ` : ''}${money(p.price)} c/u</p>
          ${editable ? `<div class="line-edit">
            ${p.sizes.length > 1 ? `<label class="mini-select"><span class="sr-only">Talla</span><select data-resize="${esc(k)}">${p.sizes.map((x) => `<option value="${x}" ${x === i.size ? 'selected' : ''} ${p.stock[x] ? '' : 'disabled'}>Talla ${x}${p.stock[x] ? '' : ' (agotada)'}</option>`).join('')}</select>${icon('chevron')}</label>` : '<span class="muted">Talla única</span>'}
            <div class="qty"><button type="button" data-dec="${esc(k)}" aria-label="Quitar una unidad de ${esc(p.name)}">${icon('minus')}</button><output>${i.qty}</output><button type="button" data-inc="${esc(k)}" aria-label="Añadir una unidad de ${esc(p.name)}" ${i.qty >= p.stock[i.size] ? 'disabled' : ''}>${icon('plus')}</button></div>
          </div>
          <div class="line-links"><button type="button" class="link" data-later="${esc(k)}">Mover a favoritos</button><button type="button" class="link" data-rm="${esc(k)}">Eliminar</button></div>` : `<p class="muted">Talla ${i.size} · Cantidad ${i.qty}</p>`}
        </div>
      </li>`;
    }).join('');
  }
  function handleLineClick(e) {
    const b = e.target.closest('button');
    if (!b) return;
    const key = b.dataset.inc || b.dataset.dec || b.dataset.rm || b.dataset.later;
    const line = store.bag.find((i) => lineKey(i) === key);
    if (!line) return;
    if (b.dataset.inc) { line.qty = Math.min(line.qty + 1, byId(line.id).stock[line.size]); bagChanged(); }
    else if (b.dataset.dec) { if (line.qty > 1) { line.qty -= 1; bagChanged(); } else removeLine(key); }
    else if (b.dataset.rm) removeLine(key);
    else if (b.dataset.later) {
      store.wish.add(line.id);
      paintCount($('#wishCount'), $('#wishBtn'), store.wish.size, 'Favoritos');
      store.bag = store.bag.filter((i) => i !== line);
      bagChanged();
      toast(`${byId(line.id).name} se movió a favoritos`);
    }
  }
  function handleResize(e) {
    const sel = e.target.closest('[data-resize]');
    if (!sel) return;
    const line = store.bag.find((i) => lineKey(i) === sel.dataset.resize);
    const dup = store.bag.find((i) => i !== line && i.id === line.id && i.color === line.color && i.size === sel.value);
    if (dup) { dup.qty += line.qty; store.bag = store.bag.filter((i) => i !== line); } else line.size = sel.value;
    bagChanged();
    toast(`Talla cambiada a ${sel.value}`);
  }

  VIEWS_MAP.bolsa = () => {
    const paint = () => {
      const has = store.bag.length;
      const inBag = new Set(store.bag.map((i) => i.id));
      const zone = zoneOf(store.district);
      const left = zone.free - (subtotal() - discount());
      app.innerHTML = `<div class="wrap page">
        <h1 class="page-title">Tu bolsa${has ? ` <span class="muted">(${bagCount()})</span>` : ''}</h1>
        ${has ? `<div class="cart">
          <div>
            <div class="ship-banner">${left > 0 ? `Te faltan <b>${money(left)}</b> para el envío gratis a ${zone.label === 'Lima' ? 'Lima' : 'provincia'}.` : `<b>Tienes envío gratis</b> a ${zone.label === 'Lima' ? 'todo Lima' : 'provincia'}.`}
              <span class="ship-bar"><span style="width:${Math.min(100, ((subtotal() - discount()) / zone.free) * 100)}%"></span></span></div>
            <ul class="lines" id="lines">${bagLines()}</ul>
            <p class="cart-note">${icon('clock')} Guardamos tu bolsa en este dispositivo. Las prendas no se reservan hasta que pagues.</p>
          </div>
          <aside class="cart-side" aria-label="Resumen del pedido">
            <h2>Resumen</h2>
            <label class="field compact"><span>Calcula tu envío</span>
              <span class="select-wrap"><select id="cartDistrict">${DISTRICTS.map(([v, l, z]) => `<option value="${v}" ${v === store.district ? 'selected' : ''}>${l}${z === 'prov' ? ' (provincia)' : ''}</option>`).join('')}</select>${icon('chevron')}</span></label>
            ${couponHTML()}
            ${summaryHTML()}
            <a class="btn btn-ink btn-wide" href="#/checkout">Continuar como invitado</a>
            <button class="btn btn-ghost btn-wide" type="button" data-account>Ingresar y pagar</button>
            <ul class="assure">
              <li>${icon('lock')}Pago seguro con Visa, Mastercard, Amex, Yape y PagoEfectivo</li>
              <li>${icon('return')}Cambios y devoluciones gratis por 30 días</li>
            </ul>
          </aside>
        </div>` : `<div class="empty-page">
          <p>Tu bolsa está vacía. ${store.wish.size ? `Tienes ${plural(store.wish.size, 'prenda', 'prendas')} en favoritos.` : ''}</p>
          <div class="empty-actions"><a class="btn btn-ink" href="#/catalogo/new">Ver Primavera 26</a>${store.wish.size ? '<a class="btn btn-line" href="#/favoritos">Ir a favoritos</a>' : ''}</div>
        </div>`}
        ${rail(has ? 'Combina con lo que llevas' : 'Recién llegados', PRODUCTS.filter((p) => !inBag.has(p.id) && (has ? true : p.isNew)).sort((a, b) => b.rating - a.rating).slice(0, 10))}
      </div>`;
      $('#lines')?.addEventListener('click', handleLineClick);
      $('#lines')?.addEventListener('change', handleResize);
      $('#cartDistrict')?.addEventListener('change', (e) => { store.district = e.target.value; persist(); paint(); });
      mountCoupon(app, paint);
      mountRails(app);
    };
    paint();
    bagHooks.add(() => {
      const f = document.activeElement;
      const key = f?.dataset?.inc || f?.dataset?.dec || f?.dataset?.resize;
      const kind = f?.dataset?.inc ? 'inc' : f?.dataset?.dec ? 'dec' : f?.dataset?.resize ? 'resize' : '';
      const y = scrollY;
      paint();
      scrollTo(0, y);
      if (kind) ($(`[data-${kind}="${CSS.escape(key)}"]`) || $('#lines button') || $('h1', app))?.focus({ preventScroll: true });
    });
  };

  /* =========================================================
     Vista: Checkout (una sola página)
     ========================================================= */
  VIEWS_MAP.checkout = () => {
    if (!store.bag.length) {
      app.innerHTML = `<div class="wrap page"><h1 class="page-title">Pagar</h1><div class="empty-page"><p>No hay nada que pagar todavía.</p><a class="btn btn-ink" href="#/catalogo/new">Ver Primavera 26</a></div></div>`;
      return;
    }
    const ck = { method: 'standard', pay: 'card', doc: 'boleta' };
    const zoneOpts = DISTRICTS.map(([v, l, z]) => `<option value="${v}" ${v === store.district ? 'selected' : ''}>${l}${z === 'prov' ? ' (provincia)' : ''}</option>`).join('');
    const field = (id, label, attrs = '', hint = '') => `<label class="field" for="${id}"><span>${label}</span><input id="${id}" name="${id}" ${attrs}>${hint ? `<small class="hint">${hint}</small>` : ''}<small class="field-msg" id="${id}-msg"></small></label>`;

    app.innerHTML = `<div class="wrap page checkout">
      <div class="ck-head"><h1 class="page-title">Pagar</h1><p class="muted">${icon('lock')} Pago cifrado · Sin crear cuenta · <button type="button" class="link" data-account>¿Tienes cuenta? Ingresa</button></p></div>
      <form class="ck" id="ckForm" novalidate>
        <div class="ck-main">
          <p class="ck-error" id="ckError" role="alert" hidden></p>

          <section class="ck-step" aria-labelledby="s1"><h2 id="s1"><span>1</span>Contacto</h2>
            <div class="grid-2">
              ${field('email', 'Correo electrónico', 'type="email" autocomplete="email" required', 'Aquí te enviamos la boleta y el seguimiento.')}
              ${field('phone', 'Celular', 'type="tel" inputmode="numeric" autocomplete="tel-national" required maxlength="11" placeholder="987 654 321"')}
            </div>
          </section>

          <section class="ck-step" aria-labelledby="s2"><h2 id="s2"><span>2</span>Entrega</h2>
            <div class="seg" role="radiogroup" aria-label="Forma de entrega">
              <label><input type="radio" name="mode" value="ship" checked><span>${icon('truck')}Envío a domicilio</span></label>
              <label><input type="radio" name="mode" value="pickup"><span>${icon('store')}Recojo en tienda · gratis</span></label>
            </div>
            <div id="shipFields">
              <div class="grid-2">
                ${field('fname', 'Nombres', 'autocomplete="given-name" required')}
                ${field('lname', 'Apellidos', 'autocomplete="family-name" required')}
                ${field('dni', 'DNI o CE', 'inputmode="numeric" required maxlength="12"')}
                <label class="field" for="district"><span>Distrito</span><span class="select-wrap"><select id="district" name="district" autocomplete="address-level2">${zoneOpts}</select>${icon('chevron')}</span></label>
              </div>
              ${field('address', 'Dirección', 'autocomplete="street-address" required placeholder="Av. Larco 1150, dpto. 402"')}
              ${field('ref', 'Referencia (opcional)', 'placeholder="Frente al parque, portón negro"')}
              <fieldset class="methods" id="methods"><legend>Método de envío</legend><div id="methodList"></div></fieldset>
            </div>
            <div id="pickupFields" hidden>
              <div class="store-card">${icon('store')}<div><b>${STORE.name}</b><p>${STORE.addr}<br>${STORE.hours}</p><p class="good">Listo para recoger hoy desde las 18:00. Te avisamos por WhatsApp.</p></div></div>
              <div class="grid-2">
                ${field('pname', 'Quién recoge', 'autocomplete="name" required')}
                ${field('pdni', 'DNI de quien recoge', 'inputmode="numeric" required maxlength="12"')}
              </div>
            </div>
          </section>

          <section class="ck-step" aria-labelledby="s3"><h2 id="s3"><span>3</span>Pago</h2>
            <div class="seg three" role="radiogroup" aria-label="Medio de pago">
              <label><input type="radio" name="pay" value="card" checked><span>Tarjeta</span></label>
              <label><input type="radio" name="pay" value="yape"><span>Yape</span></label>
              <label><input type="radio" name="pay" value="cip"><span>PagoEfectivo</span></label>
            </div>
            <div data-pay="card">
              <label class="field" for="card"><span>Número de tarjeta</span><span class="card-input"><input id="card" name="card" inputmode="numeric" autocomplete="cc-number" required placeholder="1234 5678 9012 3456" maxlength="23"><b id="cardBrand"></b></span>
                <small class="hint">Demo: usa 4111 1111 1111 1111</small><small class="field-msg" id="card-msg"></small></label>
              <div class="grid-3">
                ${field('exp', 'Vence', 'inputmode="numeric" autocomplete="cc-exp" required placeholder="MM/AA" maxlength="5"')}
                ${field('cvv', 'CVV', 'inputmode="numeric" autocomplete="cc-csc" required maxlength="4" placeholder="123"')}
                <label class="field" for="cuotas"><span>Cuotas</span><span class="select-wrap"><select id="cuotas"><option>Sin cuotas</option><option>3 cuotas sin intereses</option><option>6 cuotas</option><option>12 cuotas</option></select>${icon('chevron')}</span></label>
              </div>
              ${field('holder', 'Nombre en la tarjeta', 'autocomplete="cc-name" required')}
            </div>
            <div data-pay="yape" hidden>
              <p class="pay-info">Abre Yape, ve a <b>Código de aprobación</b> y escribe aquí los 6 dígitos. El monto se descuenta al confirmar.</p>
              <div class="grid-2">
                ${field('yphone', 'Celular con Yape', 'inputmode="numeric" required maxlength="11" placeholder="987 654 321"')}
                ${field('ycode', 'Código de aprobación', 'inputmode="numeric" required maxlength="6" placeholder="123456"')}
              </div>
            </div>
            <div data-pay="cip" hidden>
              <p class="pay-info">Te daremos un <b>código CIP</b> para pagar en banca móvil, agentes BCP, BBVA, Interbank o bodegas en las próximas 24 horas. Tu pedido se reserva hasta entonces.</p>
            </div>
          </section>

          <section class="ck-step" aria-labelledby="s4"><h2 id="s4"><span>4</span>Comprobante</h2>
            <div class="seg" role="radiogroup" aria-label="Tipo de comprobante">
              <label><input type="radio" name="doc" value="boleta" checked><span>Boleta</span></label>
              <label><input type="radio" name="doc" value="factura"><span>Factura</span></label>
            </div>
            <div id="facturaFields" hidden class="grid-2">
              ${field('ruc', 'RUC', 'inputmode="numeric" maxlength="11" placeholder="20123456789"')}
              ${field('razon', 'Razón social', 'autocomplete="organization"')}
            </div>
            <label class="check"><input type="checkbox" id="terms" required><span>Acepto los <a href="#" class="link">términos y condiciones</a> y la <a href="#" class="link">política de privacidad</a>.</span></label>
            <small class="field-msg" id="terms-msg"></small>
          </section>
        </div>

        <aside class="ck-side" aria-label="Tu pedido">
          <div class="ck-side-inner">
            <h2>Tu pedido</h2>
            <ul class="ck-items">${store.bag.map((i) => { const p = byId(i.id); return `<li><span class="ck-thumb"><img src="${img(p.img, 160)}" alt="" width="56" height="70"><b>${i.qty}</b></span><span><b>${esc(p.name)}</b><small>${COLORS[i.color][0]} · Talla ${i.size}</small></span><strong>${money(p.price * i.qty)}</strong></li>`; }).join('')}</ul>
            <a class="link" href="#/bolsa">Editar bolsa</a>
            <div id="ckCoupon">${couponHTML()}</div>
            <div id="ckTotals"></div>
            <button class="btn btn-ink btn-wide btn-pay" type="submit" id="payBtn"></button>
            <p class="side-note">${icon('lock')} Tus datos viajan cifrados. No guardamos tu tarjeta.</p>
          </div>
        </aside>
      </form>
    </div>`;

    const form = $('#ckForm');
    const methodsHTML = () => {
      const z = zoneOf(store.district);
      const std = shipping('standard');
      const opts = [['standard', `Estándar · llega el ${fmtDate(addDays(z.days))}`, std ? money(std) : 'Gratis']];
      if (z.express) opts.push(['express', `Express · llega mañana, ${fmtDate(addDays(1))}`, money(EXPRESS)]);
      if (!opts.some(([v]) => v === ck.method)) ck.method = 'standard';
      $('#methodList').innerHTML = opts.map(([v, l, pr]) => `<label class="method"><input type="radio" name="method" value="${v}" ${ck.method === v ? 'checked' : ''}><span>${l}</span><b>${pr}</b></label>`).join('');
    };
    const methodNow = () => (form.mode.value === 'pickup' ? 'pickup' : ck.method);
    const paintTotals = () => {
      $('#ckTotals').innerHTML = summaryHTML(methodNow());
      const total = subtotal() - discount() + shipping(methodNow());
      $('#payBtn').textContent = ck.pay === 'cip' ? `Generar código CIP · ${money(total)}` : `Pagar ${money(total)}`;
    };
    const paintCoupon = () => { $('#ckCoupon').innerHTML = couponHTML(); mountCoupon($('#ckCoupon'), () => { paintCoupon(); methodsHTML(); paintTotals(); }); };

    form.addEventListener('change', (e) => {
      const t = e.target;
      if (t.name === 'mode') { $('#shipFields').hidden = t.value === 'pickup'; $('#pickupFields').hidden = t.value !== 'pickup'; paintTotals(); }
      if (t.name === 'method') { ck.method = t.value; paintTotals(); }
      if (t.id === 'district') { store.district = t.value; persist(); methodsHTML(); paintTotals(); }
      if (t.name === 'pay') { ck.pay = t.value; $$('[data-pay]').forEach((d) => { d.hidden = d.dataset.pay !== t.value; }); paintTotals(); }
      if (t.name === 'doc') { ck.doc = t.value; $('#facturaFields').hidden = t.value !== 'factura'; }
    });

    // formato de campos
    const digits = (v) => v.replace(/\D/g, '');
    const brand = (n) => (/^4/.test(n) ? 'Visa' : /^(5[1-5]|2[2-7])/.test(n) ? 'Mastercard' : /^3[47]/.test(n) ? 'Amex' : '');
    const luhn = (n) => n.split('').reverse().reduce((s, d, i) => { let x = +d; if (i % 2) { x *= 2; if (x > 9) x -= 9; } return s + x; }, 0) % 10 === 0;
    form.addEventListener('input', (e) => {
      const t = e.target;
      if (t.id === 'card') { const d = digits(t.value).slice(0, 19); t.value = d.replace(/(.{4})/g, '$1 ').trim(); $('#cardBrand').textContent = brand(d); }
      if (t.id === 'exp') { const d = digits(t.value).slice(0, 4); t.value = d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d; }
      if (['cvv', 'ycode', 'dni', 'pdni', 'ruc'].includes(t.id)) t.value = digits(t.value);
      if (['phone', 'yphone'].includes(t.id)) { const d = digits(t.value).slice(0, 9); t.value = d.replace(/(\d{3})(?=\d)/g, '$1 ').trim(); }
      if (t.getAttribute('aria-invalid') === 'true') check(t);
    });

    const RULES = {
      email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Escribe un correo válido, por ejemplo nombre@correo.com.'),
      phone: (v) => (/^9\d{8}$/.test(digits(v)) ? '' : 'El celular tiene 9 dígitos y empieza con 9.'),
      fname: (v) => (v.trim().length > 1 ? '' : 'Escribe tus nombres.'),
      lname: (v) => (v.trim().length > 1 ? '' : 'Escribe tus apellidos.'),
      dni: (v) => (/^\d{8,12}$/.test(v) ? '' : 'El DNI tiene 8 dígitos (CE hasta 12).'),
      address: (v) => (v.trim().length > 5 ? '' : 'Escribe la calle, número y, si aplica, el departamento.'),
      pname: (v) => (v.trim().length > 3 ? '' : 'Escribe el nombre de quien recoge.'),
      pdni: (v) => (/^\d{8,12}$/.test(v) ? '' : 'El DNI tiene 8 dígitos.'),
      card: (v) => { const d = digits(v); return d.length >= 13 && luhn(d) ? '' : 'Revisa el número de la tarjeta.'; },
      exp: (v) => {
        const [m, y] = v.split('/').map(Number);
        if (!m || m > 12 || !y) return 'Usa el formato MM/AA.';
        const now = new Date();
        return 2000 + y < now.getFullYear() || (2000 + y === now.getFullYear() && m < now.getMonth() + 1) ? 'Esta tarjeta está vencida.' : '';
      },
      cvv: (v) => (/^\d{3,4}$/.test(v) ? '' : 'Son 3 dígitos al reverso (4 en Amex).'),
      holder: (v) => (v.trim().length > 3 ? '' : 'Escribe el nombre como aparece en la tarjeta.'),
      yphone: (v) => (/^9\d{8}$/.test(digits(v)) ? '' : 'El celular tiene 9 dígitos y empieza con 9.'),
      ycode: (v) => (/^\d{6}$/.test(v) ? '' : 'El código de aprobación tiene 6 dígitos.'),
      ruc: (v) => (/^(10|20)\d{9}$/.test(v) ? '' : 'El RUC tiene 11 dígitos y empieza con 10 o 20.'),
      razon: (v) => (v.trim().length > 2 ? '' : 'Escribe la razón social.'),
    };
    function check(input) {
      const rule = RULES[input.id];
      if (!rule) return true;
      const msg = rule(input.value);
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      input.setAttribute('aria-describedby', `${input.id}-msg`);
      const m = $(`#${input.id}-msg`);
      if (m) m.textContent = msg;
      return !msg;
    }
    form.addEventListener('focusout', (e) => { if (RULES[e.target.id] && e.target.value) check(e.target); });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const pickup = form.mode.value === 'pickup';
      const ids = ['email', 'phone', ...(pickup ? ['pname', 'pdni'] : ['fname', 'lname', 'dni', 'address']),
        ...(ck.pay === 'card' ? ['card', 'exp', 'cvv', 'holder'] : ck.pay === 'yape' ? ['yphone', 'ycode'] : []),
        ...(ck.doc === 'factura' ? ['ruc', 'razon'] : [])];
      const bad = ids.map((id) => $(`#${id}`)).filter((x) => !check(x));
      const terms = $('#terms');
      $('#terms-msg').textContent = terms.checked ? '' : 'Acepta los términos para continuar.';
      if (!terms.checked) bad.push(terms);
      const err = $('#ckError');
      if (bad.length) {
        err.hidden = false;
        err.textContent = `Revisa ${plural(bad.length, 'campo', 'campos')} antes de pagar.`;
        bad[0].focus();
        return;
      }
      err.hidden = true;
      const btn = $('#payBtn');
      btn.disabled = true;
      btn.textContent = ck.pay === 'cip' ? 'Generando código…' : 'Procesando pago…';
      const method = methodNow();
      const total = subtotal() - discount() + shipping(method);
      const z = zoneOf(store.district);
      const order = {
        num: `WK-${String(40000 + Math.floor(Math.random() * 59999))}`,
        date: Date.now(),
        name: pickup ? form.pname.value.trim().split(' ')[0] : form.fname.value.trim().split(' ')[0],
        email: form.email.value.trim(),
        items: store.bag.map((i) => ({ ...i })),
        total, method, pay: ck.pay, doc: ck.doc, coupon: store.coupon,
        address: pickup ? STORE.addr : `${form.address.value.trim()}, ${(DISTRICTS.find((d) => d[0] === store.district) || DISTRICTS[0])[1]}`,
        eta: pickup ? 'Hoy desde las 18:00' : fmtDate(addDays(method === 'express' ? 1 : z.days)),
        cip: ck.pay === 'cip' ? String(Math.floor(10000000 + Math.random() * 89999999)) : null,
      };
      setTimeout(() => {
        store.orders = [order, ...store.orders].slice(0, 5);
        store.bag = [];
        store.coupon = null;
        bagChanged();
        location.hash = `#/pedido/${order.num}`;
      }, reduce.matches ? 200 : 1100);
    });

    methodsHTML();
    paintCoupon();
    paintTotals();
  };

  /* =========================================================
     Vista: Confirmación de pedido
     ========================================================= */
  VIEWS_MAP.pedido = (r) => {
    const o = store.orders.find((x) => x.num === r.parts[1]);
    if (!o) { app.innerHTML = '<div class="wrap page"><h1 class="page-title">No encontramos ese pedido</h1><a class="btn btn-ink" href="#/">Volver al inicio</a></div>'; return; }
    const steps = o.method === 'pickup'
      ? [['Confirmado', 'Ahora'], ['Preparando', 'En 1 hora'], ['Listo para recoger', o.eta]]
      : [['Confirmado', 'Ahora'], ['Preparando', 'Hoy'], ['En camino', 'Te avisamos por WhatsApp'], ['Entregado', o.eta]];
    app.innerHTML = `<div class="wrap page order">
      <div class="order-head">
        <span class="order-check">${icon('check')}</span>
        <p class="eyebrow">Pedido ${o.num}</p>
        <h1>${o.pay === 'cip' ? `Casi listo, ${esc(o.name)}. Solo falta pagar.` : `Gracias, ${esc(o.name)}. Tu pedido está confirmado.`}</h1>
        <p class="muted">Te enviamos el detalle y la boleta a <b>${esc(o.email)}</b>.</p>
      </div>
      ${o.cip ? `<div class="cip"><p>Tu código CIP</p><b>${o.cip}</b><p class="muted">Págalo antes de mañana a esta hora en banca móvil o agentes. Monto: ${money(o.total)}.</p></div>` : ''}
      <ol class="timeline">${steps.map(([t, d], i) => `<li class="${i === 0 ? 'done' : ''}"><span></span><b>${t}</b><small>${d}</small></li>`).join('')}</ol>
      <div class="order-grid">
        <section><h2>${o.method === 'pickup' ? 'Recojo' : 'Entrega'}</h2><p>${esc(o.address)}</p><p class="muted">${o.method === 'pickup' ? STORE.hours : `Llega el ${o.eta}`}</p></section>
        <section><h2>Pago</h2><p>${{ card: 'Tarjeta', yape: 'Yape', cip: 'PagoEfectivo (pendiente)' }[o.pay]} · ${o.doc === 'factura' ? 'Factura' : 'Boleta'}</p><p class="muted">Total ${money(o.total)}${o.coupon ? ` · cupón ${o.coupon}` : ''}</p></section>
      </div>
      <ul class="ck-items order-items">${o.items.map((i) => { const p = byId(i.id); return `<li><span class="ck-thumb"><img src="${img(p.img, 160)}" alt="" width="56" height="70"><b>${i.qty}</b></span><span><b>${esc(p.name)}</b><small>${COLORS[i.color][0]} · Talla ${i.size}</small></span><strong>${money(p.price * i.qty)}</strong></li>`; }).join('')}</ul>
      <div class="empty-actions"><a class="btn btn-ink" href="#/catalogo/new">Seguir comprando</a><button class="btn btn-line" type="button" id="dlBoleta">Descargar boleta</button></div>
    </div>`;
    $('#dlBoleta').addEventListener('click', () => toast('Demo: aquí se descargaría la boleta en PDF.'));
  };

  /* =========================================================
     Vista: Favoritos
     ========================================================= */
  VIEWS_MAP.favoritos = () => {
    const list = [...store.wish].map(byId).filter(Boolean);
    app.innerHTML = `<div class="wrap page">
      <h1 class="page-title">Favoritos${list.length ? ` <span class="muted">(${list.length})</span>` : ''}</h1>
      ${list.length ? `<p class="page-sub">Guardados en este dispositivo. Te avisamos si alguno baja de precio.</p><ul class="grid" data-cols="4">${list.map(card).join('')}</ul>`
        : `<div class="empty-page"><p>Aún no guardas nada. Toca el corazón de cualquier prenda para verla aquí.</p><a class="btn btn-ink" href="#/catalogo/new">Explorar Primavera 26</a></div>`}
      ${recentRail()}
    </div>`;
    mountRails(app);
  };

  /* =========================================================
     Vista: Ayuda
     ========================================================= */
  const HELP = {
    envios: ['Envíos y entregas', () => `
      <p>Despachamos de lunes a sábado desde Miraflores. Los pedidos confirmados antes de las 14:00 salen el mismo día.</p>
      <div class="table-wrap"><table><caption class="sr-only">Tarifas y plazos de envío</caption>
        <thead><tr><th scope="col">Zona</th><th scope="col">Plazo</th><th scope="col">Costo</th><th scope="col">Gratis desde</th></tr></thead>
        <tbody>
          <tr><th scope="row">Lima Moderna</th><td>1–2 días hábiles</td><td>S/ 10</td><td>S/ 299</td></tr>
          <tr><th scope="row">Resto de Lima y Callao</th><td>2–3 días hábiles</td><td>S/ 14</td><td>S/ 299</td></tr>
          <tr><th scope="row">Provincias</th><td>3–5 días hábiles</td><td>S/ 22</td><td>S/ 499</td></tr>
          <tr><th scope="row">Express (Lima Moderna)</th><td>Día siguiente</td><td>S/ 19</td><td>—</td></tr>
          <tr><th scope="row">Recojo en tienda</th><td>2 horas</td><td>Gratis</td><td>—</td></tr>
        </tbody></table></div>
      <p>Recibirás el seguimiento por correo y WhatsApp. Si no hay nadie en casa, el courier intenta una segunda vez al día siguiente.</p>`],
    cambios: ['Cambios y devoluciones', () => `
      <p>Tienes <b>30 días</b> desde que recibes tu pedido para cambiar o devolver, sin costo.</p>
      <ol class="steps"><li><b>Solicítalo</b> desde el correo de tu pedido o por WhatsApp.</li><li><b>Elige cómo:</b> llévalo a Calle Berlín o programa un recojo gratis en Lima.</li><li><b>Recibe tu cambio</b> en 3 días o el reembolso en 5 a 7 días hábiles al mismo medio de pago.</li></ol>
      <p>Las prendas deben tener sus etiquetas. Ropa interior y aretes no tienen cambio por higiene.</p>`],
    pagos: ['Medios de pago', () => `
      <ul class="plain"><li><b>Tarjetas</b> Visa, Mastercard, Amex y Diners. Hasta 3 cuotas sin intereses con BCP, Interbank y BBVA.</li><li><b>Yape y Plin</b> con código de aprobación, sin salir de la web.</li><li><b>PagoEfectivo</b>: pagas con un código CIP en banca móvil o agentes en 24 horas.</li></ul>
      <p>Emitimos boleta o factura electrónica. Todos los precios incluyen IGV.</p>`],
    preguntas: ['Preguntas frecuentes', () => `
      <div class="acc faq">${[
        ['¿Cómo sé cuál es mi talla?', 'Usa el buscador de talla de la guía: con tu altura, peso y calce preferido te recomendamos una. Cada ficha indica si la prenda talla pequeña, normal o grande según las reseñas.'],
        ['¿Puedo probarme antes de comprar?', 'Sí. Reserva hasta cinco prendas y pruébatelas en Calle Berlín 342. Solo pagas lo que te llevas.'],
        ['¿Hacen envíos fuera de Lima?', 'Enviamos a todo el Perú en 3 a 5 días hábiles. El envío es gratis desde S/ 499.'],
        ['¿Qué pasa si la talla no me queda?', 'La cambias gratis dentro de 30 días, en tienda o con recojo a domicilio en Lima.'],
        ['¿Hacen ajustes de sastrería?', 'Basta, largo de manga y cintura gratis en ternos y blazers. Listos en 48 horas.'],
        ['¿Tienen gift cards?', 'Sí, desde S/ 100, en tienda o por WhatsApp. Se usan en la web y en tienda.'],
      ].map(([q, a]) => `<details><summary>${q} ${icon('chevron')}</summary><div><p>${a}</p></div></details>`).join('')}</div>`],
    nosotros: ['Nosotros', () => `
      <figure class="help-photo"><img src="${img('1532453288672-3a27e9be9efd', 1400)}" alt="Perchero con prendas de colores en el taller" loading="lazy"></figure>
      <p>Vincce nació en 2019 en un local de 30 m² en Miraflores. Hoy trabajamos con doce talleres en Lima y Arequipa, y cada etiqueta dice quién cosió la prenda.</p>
      <p>Diseñamos pocas piezas por temporada y las reponemos mientras funcionen. Lo que no se vende pasa al outlet; no quemamos ni destruimos stock.</p>`],
    tienda: ['Tienda Miraflores', () => `
      <figure class="help-photo"><img src="${img('1441984904996-e0b6ba687e04', 1400)}" alt="Interior de la tienda Vincce" loading="lazy"></figure>
      <div class="grid-2 help-cols">
        <div><h3>Dirección</h3><p>${STORE.addr}<br>A dos cuadras del Parque Kennedy.</p><h3>Horario</h3><p>${STORE.hours}</p></div>
        <div><h3>Servicios</h3><ul class="plain"><li>Recojo de pedidos web en 2 horas</li><li>Reserva de probador (hasta 5 prendas)</li><li>Ajustes de sastrería gratis en 48 h</li><li>Cambios de compras web</li></ul></div>
      </div>
      <a class="btn btn-ink" href="#" data-demo="Demo: aquí se abriría el mapa.">Cómo llegar</a>`],
  };
  VIEWS_MAP.ayuda = (r) => {
    const slug = HELP[r.parts[1]] ? r.parts[1] : 'preguntas';
    const [title, body] = HELP[slug];
    app.innerHTML = `<div class="wrap page help">
      <nav class="help-nav" aria-label="Ayuda"><p class="eyebrow">Ayuda</p><ul>${Object.entries(HELP).map(([k, [t]]) => `<li><a href="#/ayuda/${k}" ${k === slug ? 'aria-current="page"' : ''}>${t}</a></li>`).join('')}<li><button type="button" class="link" data-sizeguide>Guía de tallas</button></li></ul></nav>
      <article class="help-body"><h1 class="page-title">${title}</h1>${body()}<p class="help-contact">¿Algo más? Escríbenos por <a class="link" href="#" data-demo="Demo: aquí se abriría WhatsApp.">WhatsApp al 987 654 321</a>, de 9:00 a 20:00.</p></article>
    </div>`;
  };

  /* =========================================================
     Navegación principal y mega menú
     ========================================================= */
  const NAV = [
    { key: 'mujer', label: 'Mujer', g: 'mujer' },
    { key: 'hombre', label: 'Hombre', g: 'hombre' },
    { key: 'sastreria', label: 'Sastrería', href: '#/catalogo/tailoring' },
    { key: 'outlet', label: 'Outlet', href: '#/catalogo/outlet' },
    { key: 'tienda', label: 'Tienda', href: '#/ayuda/tienda' },
  ];
  const catsFor = (g) => [...new Set(PRODUCTS.filter((p) => p.g === g || p.g === 'unisex').map((p) => p.cat))];
  $('#navList').innerHTML = NAV.map((n) => (n.g
    ? `<li><button type="button" class="nav-link" data-mega="${n.g}" data-nav="${n.key}" aria-expanded="false" aria-controls="mega">${n.label}${icon('chevron')}</button></li>`
    : `<li><a class="nav-link" href="${n.href}" data-nav="${n.key}">${n.label}</a></li>`)).join('');

  const mega = $('#mega');
  let megaOpen = '';
  let megaTimer;
  function openMega(g, focus) {
    clearTimeout(megaTimer);
    if (megaOpen === g) return;
    megaOpen = g;
    const cats = catsFor(g);
    const hero = g === 'mujer' ? byId('p25') : byId('p19');
    mega.innerHTML = `<div class="mega-inner">
      <div class="mega-col"><p class="eyebrow">Categorías</p><ul>
        <li><a href="#/catalogo/all?g=${g}"><b>Ver todo ${g === 'mujer' ? 'Mujer' : 'Hombre'}</b></a></li>
        ${cats.map((c) => `<li><a href="#/catalogo/all?g=${g}&cat=${encodeURIComponent(c)}">${c}</a></li>`).join('')}</ul></div>
      <div class="mega-col"><p class="eyebrow">Catálogos</p><ul>
        ${CATALOGS.filter((c) => c.id !== 'all').map((c) => `<li><a href="#/catalogo/${c.id}?g=${g}">${c.name}</a></li>`).join('')}</ul>
        <p class="eyebrow">Ayuda</p><ul><li><button type="button" class="link-plain" data-sizeguide>Guía de tallas</button></li><li><a href="#/ayuda/envios">Envíos</a></li></ul></div>
      <a class="mega-feature" href="#/producto/${hero.id}"><img src="${img(hero.img, 700)}" alt="" loading="lazy"><span><small>Destacado</small><b>${esc(hero.name)}</b>${money(hero.price)}</span></a>
    </div>`;
    mega.hidden = false;
    $$('[data-mega]').forEach((b) => b.setAttribute('aria-expanded', b.dataset.mega === g));
    if (focus) $('a', mega).focus();
  }
  function closeMega() {
    if (!megaOpen) return;
    megaOpen = '';
    mega.hidden = true;
    $$('[data-mega]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
  }
  $('#navList').addEventListener('click', (e) => {
    const b = e.target.closest('[data-mega]');
    if (!b) return;
    if (megaOpen === b.dataset.mega) closeMega(); else openMega(b.dataset.mega, e.detail === 0);
  });
  $('#navList').addEventListener('mouseover', (e) => {
    const b = e.target.closest('[data-mega]');
    if (b && matchMedia('(hover: hover)').matches) { clearTimeout(megaTimer); megaTimer = setTimeout(() => openMega(b.dataset.mega), megaOpen ? 0 : 120); }
  });
  $('#nav').addEventListener('mouseleave', () => { clearTimeout(megaTimer); megaTimer = setTimeout(closeMega, 200); });
  mega.addEventListener('mouseenter', () => clearTimeout(megaTimer));
  $('#nav').addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && megaOpen) { const g = megaOpen; closeMega(); $(`[data-mega="${g}"]`).focus(); }
  });
  document.addEventListener('focusin', (e) => { if (megaOpen && !$('#nav').contains(e.target)) closeMega(); });
  mega.addEventListener('click', (e) => { if (e.target.closest('a')) closeMega(); });

  // menú móvil
  const mm = $('#mobileMenu');
  $('#mmBody').innerHTML = `
    ${['mujer', 'hombre'].map((g) => `<details class="mm-group"><summary>${g === 'mujer' ? 'Mujer' : 'Hombre'} ${icon('chevron')}</summary><ul>
      <li><a href="#/catalogo/all?g=${g}">Ver todo</a></li>${catsFor(g).map((c) => `<li><a href="#/catalogo/all?g=${g}&cat=${encodeURIComponent(c)}">${c}</a></li>`).join('')}</ul></details>`).join('')}
    <ul class="mm-links">
      ${CATALOGS.filter((c) => c.id !== 'all').map((c) => `<li><a href="#/catalogo/${c.id}">${c.name}</a></li>`).join('')}
      <li><a href="#/ayuda/tienda">Tienda Miraflores</a></li>
    </ul>
    <ul class="mm-small">
      <li><a href="#/favoritos">Favoritos</a></li>
      <li><button type="button" class="link-plain" data-account>Mi cuenta</button></li>
      <li><button type="button" class="link-plain" data-sizeguide>Guía de tallas</button></li>
      <li><a href="#/ayuda/preguntas">Ayuda</a></li>
    </ul>`;
  $('#menuBtn').addEventListener('click', () => { mm.showModal(); $('#menuBtn').setAttribute('aria-expanded', 'true'); });
  mm.addEventListener('close', () => $('#menuBtn').setAttribute('aria-expanded', 'false'));
  mm.addEventListener('click', (e) => { if (e.target.closest('a[href^="#/"]')) mm.close(); });

  /* =========================================================
     Búsqueda
     ========================================================= */
  const sdlg = $('#searchDlg');
  const sField = $('#searchField');
  const sRes = $('#searchResults');
  const POPULAR = ['vestido', 'lino', 'alpaca', 'jean', 'camisa blanca', 'casaca'];
  const norm = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const searchList = (q) => {
    const words = norm(q).split(/\s+/).filter(Boolean);
    return PRODUCTS.filter((p) => {
      const hay = norm([p.name, p.cat, p.line, p.desc, p.g, ...p.colors.map((c) => COLORS[c][0])].join(' '));
      return words.every((w) => hay.includes(w));
    });
  };
  const mark = (text, q) => {
    const t = esc(text);
    const w = norm(q).split(/\s+/).filter((x) => x.length > 1);
    if (!w.length) return t;
    return t.replace(new RegExp(`(${w.map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi'), '<mark>$1</mark>');
  };
  function paintSearch() {
    const q = sField.value.trim();
    if (!q) {
      sRes.innerHTML = `<div class="s-cols">
        <div>
          ${store.searches.length ? `<div class="s-block"><div class="s-title"><p class="eyebrow">Tus búsquedas</p><button type="button" class="link" id="sClear">Borrar</button></div><div class="chips">${store.searches.map((x) => `<button type="button" class="chip" data-term="${esc(x)}">${esc(x)}</button>`).join('')}</div></div>` : ''}
          <div class="s-block"><p class="eyebrow">Lo más buscado</p><div class="chips">${POPULAR.map((x) => `<button type="button" class="chip" data-term="${x}">${x}</button>`).join('')}</div></div>
          <div class="s-block"><p class="eyebrow">Categorías</p><ul class="s-links">${[...new Set(PRODUCTS.map((p) => p.cat))].map((c) => `<li><a href="#/catalogo/all?cat=${encodeURIComponent(c)}">${c}</a></li>`).join('')}</ul></div>
        </div>
        <div class="s-block"><p class="eyebrow">Tendencia esta semana</p><ul class="s-products">${[byId('p25'), byId('p02'), byId('p16'), byId('p13')].map((p) => sItem(p, '')).join('')}</ul></div>
      </div>`;
      $('#sClear')?.addEventListener('click', () => { store.searches = []; persist(); paintSearch(); sField.focus(); });
      return;
    }
    const list = searchList(q);
    const cats = [...new Set(list.map((p) => p.cat))].slice(0, 4);
    sRes.innerHTML = list.length ? `<div class="s-cols">
        <div class="s-block"><p class="eyebrow">Categorías</p><ul class="s-links">${cats.map((c) => `<li><a href="#/catalogo/all?cat=${encodeURIComponent(c)}&q=${encodeURIComponent(q)}">${mark(c, q)} <span class="muted">${list.filter((p) => p.cat === c).length}</span></a></li>`).join('')}</ul></div>
        <div class="s-block"><p class="eyebrow">${plural(list.length, 'prenda', 'prendas')}</p><ul class="s-products">${list.slice(0, 6).map((p) => sItem(p, q)).join('')}</ul>
          <a class="btn btn-ink" href="#/catalogo/all?q=${encodeURIComponent(q)}" data-go>Ver ${list.length > 1 ? `los ${list.length} resultados` : 'el resultado'}</a></div>
      </div>`
      : `<div class="s-none"><p>No encontramos “${esc(q)}”.</p><p class="muted">Revisa la ortografía o prueba con:</p><div class="chips">${POPULAR.slice(0, 4).map((x) => `<button type="button" class="chip" data-term="${x}">${x}</button>`).join('')}</div></div>`;
  }
  const sItem = (p, q) => `<li><a href="#/producto/${p.id}"><img src="${img(p.img, 160)}" alt="" width="56" height="70" loading="lazy"><span><b>${mark(p.name, q)}</b><small>${esc(p.cat)}</small></span><strong>${priceHTML(p)}</strong></a></li>`;
  const remember = (q) => { if (!q) return; store.searches = [q, ...store.searches.filter((x) => x !== q)].slice(0, 5); persist(); };
  let sTimer;
  sField.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.preventDefault(); sdlg.close(); } });
  sField.addEventListener('input', () => { clearTimeout(sTimer); sTimer = setTimeout(paintSearch, 90); });
  sRes.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-term]');
    if (chip) { sField.value = chip.dataset.term; paintSearch(); sField.focus(); return; }
    if (e.target.closest('a')) { remember(sField.value.trim()); sdlg.close(); }
  });
  $('#searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = sField.value.trim();
    if (!q) return;
    remember(q);
    sdlg.close();
    location.hash = `#/catalogo/all?q=${encodeURIComponent(q)}`;
  });
  $('#searchOpen').addEventListener('click', () => { sdlg.showModal(); paintSearch(); sField.select(); });
  addEventListener('keydown', (e) => {
    if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !$('dialog[open]')) { e.preventDefault(); $('#searchOpen').click(); }
  });

  /* =========================================================
     Diálogos
     ========================================================= */
  const openers = new WeakMap();
  $$('dialog').forEach((d) => {
    d.addEventListener('click', (e) => { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
    d.addEventListener('close', () => { const o = openers.get(d); if (o && document.contains(o)) o.focus(); document.body.classList.remove('locked'); });
  });
  const show = (d, from = document.activeElement) => { openers.set(d, from); d.showModal(); };

  // bolsa lateral
  const bagDlg = $('#bag');
  function renderBagDrawer() {
    const sub = subtotal();
    const zone = zoneOf(store.district);
    const left = zone.free - sub;
    $('#bagTitle').textContent = store.bag.length ? `Tu bolsa (${bagCount()})` : 'Tu bolsa';
    $('#bagShip').innerHTML = `<p>${left > 0 ? `Te faltan <b>${money(left)}</b> para el envío gratis.` : '<b>Tienes envío gratis</b> en Lima.'}</p><span class="ship-bar"><span style="width:${Math.min(100, (sub / zone.free) * 100)}%"></span></span>`;
    $('#bagShip').hidden = !store.bag.length;
    $('#bagList').innerHTML = bagLines();
    $('#bagEmpty').hidden = !!store.bag.length;
    $('#bagFoot').hidden = !store.bag.length;
    $('#bagTotal').textContent = money(sub);
  }
  function openBag() { if (!bagDlg.open) show(bagDlg); }
  $('#bagList').addEventListener('click', (e) => {
    const k = e.target.closest('button')?.dataset;
    handleLineClick(e);
    if (k && (k.inc || k.dec)) ($(`#bagList [data-${k.inc ? 'inc' : 'dec'}="${CSS.escape(k.inc || k.dec)}"]`) || $('#bag [data-close]')).focus();
  });
  $('#bagList').addEventListener('change', handleResize);
  $('#bagBtn').addEventListener('click', () => (route.name === 'bolsa' ? $('h1', app).focus() : openBag()));

  // vista rápida
  const quick = $('#quickView');
  let qv = null;
  function openQuick(p, from) {
    qv = { p, color: p.colors[0], size: p.sizes.length === 1 && p.stock[p.sizes[0]] ? p.sizes[0] : (store.size && p.stock[store.size] ? store.size : null) };
    $('#qvImg').src = img(p.img, 1100);
    $('#qvImg').alt = p.name;
    $('#qvLine').textContent = `${p.line} · ${p.cat}`;
    $('#qvName').textContent = p.name;
    $('#qvPrice').innerHTML = `${priceHTML(p)}${p.was ? ` · −${off(p)}%` : ''}`;
    $('#qvNote').textContent = '';
    $('#qvMore').href = `#/producto/${p.id}`;
    paintQuick();
    show(quick, from);
  }
  function paintQuick() {
    const { p } = qv;
    $('#qvColorName').textContent = COLORS[qv.color][0];
    $('#qvColors').innerHTML = p.colors.map((c) => `<button type="button" class="sw" data-c="${c}" aria-pressed="${c === qv.color}" aria-label="${COLORS[c][0]}" style="--c:${COLORS[c][1]}"><i></i></button>`).join('');
    $('#qvSizes').innerHTML = p.sizes.map((s) => `<button type="button" class="size-opt" data-s="${s}" aria-pressed="${s === qv.size}" ${p.stock[s] ? '' : 'disabled'}>${s}</button>`).join('');
    $('#qvSizes').classList.toggle('one', p.sizes.length === 1);
  }
  $('#qvColors').addEventListener('click', (e) => { const b = e.target.closest('[data-c]'); if (b) { qv.color = b.dataset.c; paintQuick(); $(`#qvColors [data-c="${qv.color}"]`).focus(); } });
  $('#qvSizes').addEventListener('click', (e) => { const b = e.target.closest('[data-s]'); if (b) { qv.size = b.dataset.s; $('#qvNote').textContent = ''; paintQuick(); $(`#qvSizes [data-s="${qv.size}"]`).focus(); } });
  $('#qvForm').addEventListener('submit', (e) => {
    if (!qv.size) { e.preventDefault(); $('#qvNote').textContent = 'Elige una talla para continuar.'; $('#qvSizes button:not([disabled])')?.focus(); return; }
    addToBag(qv.p, qv.size, qv.color);
  });
  $('#qvMore').addEventListener('click', () => quick.close());

  // guía de tallas
  const sg = $('#sizeGuide');
  const TABLE = [['XS', '34', '2', '6', '80–84', '62–66', '86–90'], ['S', '36', '4', '8', '85–89', '67–71', '91–95'], ['M', '38', '6', '10', '90–94', '72–76', '96–100'], ['L', '40', '8', '12', '95–100', '77–82', '101–106'], ['XL', '42', '10', '14', '101–106', '83–88', '107–112']];
  const SHOE_TABLE = [['36', '23,0', '5,5', '3,5'], ['37', '23,7', '6,5', '4'], ['38', '24,3', '7,5', '5'], ['39', '25,0', '8,5', '6'], ['40', '25,7', '9,5', '6,5'], ['41', '26,3', '10', '7,5']];
  let unit = 'cm';
  function sgPanel(tab) {
    const conv = (r) => (unit === 'cm' ? r : r.split('–').map((n) => (n / 2.54).toFixed(1).replace('.', ',')).join('–'));
    const panels = {
      finder: `<form class="finder" id="finder" novalidate>
        <p>Te recomendamos una talla con tu altura, peso y cómo te gusta que quede. Funciona para abrigos, polos, tejidos, camisas, pantalones y vestidos.</p>
        <div class="grid-2">
          <label class="field"><span>Altura (cm)</span><input id="fH" type="number" inputmode="numeric" min="140" max="210" placeholder="165" required></label>
          <label class="field"><span>Peso (kg)</span><input id="fW" type="number" inputmode="numeric" min="35" max="160" placeholder="60" required></label>
        </div>
        <fieldset class="seg three"><legend class="field-label">Me gusta que quede</legend>
          <label><input type="radio" name="pref" value="-1"><span>Ajustada</span></label>
          <label><input type="radio" name="pref" value="0" checked><span>Normal</span></label>
          <label><input type="radio" name="pref" value="1"><span>Holgada</span></label>
        </fieldset>
        <p class="field-msg" id="fMsg" aria-live="polite"></p>
        <button class="btn btn-ink btn-wide" type="submit">Ver mi talla</button>
        <div class="finder-result" id="fRes" aria-live="polite">${store.size ? `<p>Tu talla guardada: <b>${store.size}</b></p>` : ''}</div>
      </form>`,
      ropa: `<div class="unit" role="group" aria-label="Unidad"><button type="button" data-unit="cm" aria-pressed="${unit === 'cm'}">cm</button><button type="button" data-unit="in" aria-pressed="${unit === 'in'}">pulgadas</button></div>
        <div class="table-wrap"><table><caption class="sr-only">Tallas de ropa</caption><thead><tr><th scope="col">Talla</th><th scope="col">EU</th><th scope="col">US</th><th scope="col">UK</th><th scope="col">Busto</th><th scope="col">Cintura</th><th scope="col">Cadera</th></tr></thead>
        <tbody>${TABLE.map((r) => `<tr${store.size === r[0] ? ' class="mine"' : ''}><th scope="row">${r[0]}</th><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${conv(r[4])}</td><td>${conv(r[5])}</td><td>${conv(r[6])}</td></tr>`).join('')}</tbody></table></div>
        <p class="muted">Medidas del cuerpo, no de la prenda. Si estás entre dos tallas, elige la mayor en prendas ajustadas.</p>`,
      calzado: `<div class="table-wrap"><table><caption class="sr-only">Tallas de calzado</caption><thead><tr><th scope="col">Perú / EU</th><th scope="col">Largo del pie</th><th scope="col">US</th><th scope="col">UK</th></tr></thead>
        <tbody>${SHOE_TABLE.map((r) => `<tr><th scope="row">${r[0]}</th><td>${r[1]} cm</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')}</tbody></table></div>
        <p class="muted">Mide tu pie apoyado en una hoja, del talón a la punta del dedo más largo, al final del día.</p>`,
      medir: `<ol class="steps">
        <li><b>Busto:</b> pasa la cinta por la parte más llena del pecho, sin apretar.</li>
        <li><b>Cintura:</b> mide la parte más angosta, unos 2 cm sobre el ombligo.</li>
        <li><b>Cadera:</b> mide la parte más ancha, con los pies juntos.</li>
        <li><b>Largo de pierna:</b> desde la entrepierna hasta el tobillo, por dentro.</li></ol>
        <p class="muted">¿Sin cinta métrica? Mide una prenda que te quede bien, estirada sobre una mesa, y compárala con la ficha del producto.</p>`,
    };
    $('#sgPanel').innerHTML = panels[tab];
    $('#sgPanel').setAttribute('aria-labelledby', `sgt-${tab}`);
    $$('#sgTabs [data-sg]').forEach((b) => { const on = b.dataset.sg === tab; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; });
    $('#finder')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const h = +$('#fH').value;
      const w = +$('#fW').value;
      if (!(h >= 140 && h <= 210) || !(w >= 35 && w <= 160)) { $('#fMsg').textContent = 'Escribe una altura entre 140 y 210 cm y un peso entre 35 y 160 kg.'; return; }
      $('#fMsg').textContent = '';
      const bmi = w / (h / 100) ** 2;
      let idx = w < 50 ? 0 : w < 58 ? 1 : w < 68 ? 2 : w < 80 ? 3 : 4;
      if (bmi > 27 && idx < 4) idx += 1;
      if (h > 182 && idx < 2) idx += 1;
      idx = Math.max(0, Math.min(4, idx + +$('#finder').pref.value));
      const size = APPAREL[idx];
      $('#fRes').innerHTML = `<p class="finder-size">Tu talla es <b>${size}</b></p><p class="muted">Basado en ${h} cm y ${w} kg. En prendas que tallan pequeño te lo avisamos en la ficha.</p><button type="button" class="btn btn-line btn-wide" id="fSave">Guardar ${size} como mi talla</button>`;
      $('#fSave').addEventListener('click', () => {
        store.size = size;
        persist();
        toast(`Guardamos ${size} como tu talla`);
        sg.close();
        if (route.name === 'producto') render();
      });
    });
  }
  $('#sgTabs').addEventListener('click', (e) => { const b = e.target.closest('[data-sg]'); if (b) sgPanel(b.dataset.sg); });
  $('#sgTabs').addEventListener('keydown', (e) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    e.preventDefault();
    const tabs = $$('#sgTabs [data-sg]');
    const i = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
    const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
    sgPanel(n.dataset.sg);
    n.focus();
  });
  $('#sgPanel').addEventListener('click', (e) => { const b = e.target.closest('[data-unit]'); if (b) { unit = b.dataset.unit; sgPanel('ropa'); $(`[data-unit="${unit}"]`).focus(); } });

  // avísame
  const nd = $('#notifyDlg');
  let notifyFor = null;
  function openNotify(p, size, from) {
    notifyFor = { p, size };
    $('#nText').textContent = `${p.name}, talla ${size}. Te escribimos una sola vez cuando vuelva a estar disponible.`;
    $('#nMsg').textContent = '';
    show(nd, from);
    $('#nEmail').focus();
  }
  $('#notifyForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const v = $('#nEmail').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { $('#nMsg').textContent = 'Escribe un correo válido.'; $('#nEmail').setAttribute('aria-invalid', 'true'); return; }
    nd.close();
    toast(`Listo. Te avisamos a ${v} cuando vuelva la talla ${notifyFor.size}.`);
  });

  // cuenta
  const ad = $('#accountDlg');
  $('#accountBtn').addEventListener('click', () => show(ad));
  $('#accountForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test($('#acEmail').value) && $('#acPass').value.length >= 6;
    $('#acMsg').textContent = ok ? '' : 'Revisa tu correo y una contraseña de al menos 6 caracteres.';
    if (ok) { ad.close(); toast('Demo: sesión iniciada.'); }
  });

  // lightbox
  const lb = $('#lightbox');
  let lbState = { list: [], i: 0 };
  function openLightbox(list, i, name, from) {
    lbState = { list, i, name };
    paintLb();
    show(lb, from);
  }
  function paintLb() {
    $('#lbImg').src = lbState.list[lbState.i];
    $('#lbImg').alt = `${lbState.name}, foto ${lbState.i + 1}`;
    $('#lbCount').textContent = `${lbState.i + 1} / ${lbState.list.length}`;
  }
  const lbGo = (d) => { lbState.i = (lbState.i + d + lbState.list.length) % lbState.list.length; paintLb(); };
  $('#lbPrev').addEventListener('click', () => lbGo(-1));
  $('#lbNext').addEventListener('click', () => lbGo(1));
  lb.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); lbGo(e.key === 'ArrowLeft' ? -1 : 1); } });

  /* =========================================================
     Clics globales
     ========================================================= */
  document.addEventListener('click', (e) => {
    const t = e.target;
    const w = t.closest('[data-wish]');
    if (w) { toggleWish(w.dataset.wish, w); return; }
    const a = t.closest('[data-add]');
    if (a) { addToBag(byId(a.dataset.add), a.dataset.size); return; }
    const q = t.closest('[data-quick]');
    if (q) { openQuick(byId(q.dataset.quick), q); return; }
    const sgb = t.closest('[data-sizeguide]');
    if (sgb) {
      e.preventDefault();
      $$('dialog[open]').forEach((d) => { if (d !== sg) d.close(); });
      sgPanel(sgb.dataset.sizeguide || 'finder');
      show(sg, sgb);
      return;
    }
    const acc = t.closest('[data-account]');
    if (acc) { $$('dialog[open]').forEach((d) => d.close()); show(ad, acc); return; }
    const sc = t.closest('[data-scroll]');
    if (sc) { e.preventDefault(); $(`#${sc.dataset.scroll}`).scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth' }); return; }
    const demo = t.closest('a[href="#"]');
    if (demo) { e.preventDefault(); toast(demo.dataset.demo || 'Página de demostración.'); return; }
    const closeLink = t.closest('dialog a[href^="#/"]');
    if (closeLink) closeLink.closest('dialog').close();
  });
  $('.skip').addEventListener('click', (e) => { e.preventDefault(); app.focus(); });

  // newsletter
  $('#newsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = $('#newsEmail');
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim());
    const msg = $('#newsMsg');
    email.setAttribute('aria-invalid', String(!ok));
    if (!ok) { msg.textContent = 'Escribe un correo válido.'; email.focus(); return; }
    if (!$('#newsConsent').checked) { msg.textContent = 'Marca la casilla para poder escribirte.'; $('#newsConsent').focus(); return; }
    msg.textContent = 'Listo. Revisa tu correo: tu código de 10% es BIENVENIDA.';
    e.target.reset();
  });

  /* =========================================================
     Toast
     ========================================================= */
  let tTimer;
  let undoFn = null;
  function toast(text, undo, action) {
    const t = $('#toast');
    $('#toastText').textContent = text;
    const b = $('#toastUndo');
    undoFn = undo || action?.fn || null;
    b.hidden = !undoFn;
    b.textContent = undo ? 'Deshacer' : action?.label || '';
    t.classList.add('show');
    clearTimeout(tTimer);
    tTimer = setTimeout(() => t.classList.remove('show'), undoFn ? 4500 : 2400);
  }
  $('#toastUndo').addEventListener('click', () => { const fn = undoFn; undoFn = null; $('#toast').classList.remove('show'); fn?.(); });
  $('#toast').addEventListener('mouseenter', () => clearTimeout(tTimer));
  $('#toast').addEventListener('mouseleave', () => { tTimer = setTimeout(() => $('#toast').classList.remove('show'), 1500); });

  /* =========================================================
     Inicio
     ========================================================= */
  paintCount($('#wishCount'), $('#wishBtn'), store.wish.size, 'Favoritos', false);
  paintCount($('#bagCount'), $('#bagBtn'), bagCount(), 'Bolsa', false);
  renderBagDrawer();
  render();
})();
