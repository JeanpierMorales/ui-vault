/* Trigal · Insumos de panificación — datos de la demo (marca ficticia, Lima).
   Precios referenciales por bolsa o balde, sin IGV. */

const img = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const CATEGORIES = [
  { id: 'mezclas', name: 'Mezclas panaderas', short: 'Mezclas' },
  { id: 'mejoradores', name: 'Mejoradores y masas madre', short: 'Mejoradores' },
  { id: 'dulces', name: 'Bollería y masas dulces', short: 'Bollería' },
  { id: 'rellenos', name: 'Rellenos y coberturas', short: 'Rellenos' },
];

const TAGS = {
  clean: 'Etiqueta limpia',
  frio: 'Fermentación en frío',
  sinasc: 'Sin ácido ascórbico',
};

const DOSES = {
  25: 'Dosificación 25%',
  50: 'Dosificación 50%',
  100: 'Dosificación 100%',
  otro: 'Otra dosificación',
};

const PRODUCTS = [
  {
    id: 'mezcla-andina', cat: 'mezclas', name: 'Mezcla Andina Quinua & Kiwicha',
    desc: 'Mezcla al 50% para pan integral con quinua, kiwicha y linaza. Miga húmeda y corteza crocante.',
    img: img('1509440159596-0249088772ff'), tags: ['clean', 'frio'], dose: '50',
    pack: 'Bolsa 25 kg', price: 189, life: '9 meses', doseText: '50% sobre el total de harina',
    yield: 'Rinde ~50 kg de masa', featured: true,
  },
  {
    id: 'chia-dorada', cat: 'mezclas', name: 'Mezcla Chía Dorada',
    desc: 'Semillas de chía y ajonjolí listas para pan de molde y pan de semillas.',
    img: img('1559811814-e2c57b5e69df'), tags: ['clean'], dose: '50',
    pack: 'Bolsa 15 kg', price: 142, life: '8 meses', doseText: '50% sobre el total de harina',
    yield: 'Rinde ~30 kg de masa',
  },
  {
    id: 'centeno-pleno', cat: 'mezclas', name: 'Centeno Pleno 100%',
    desc: 'Mezcla completa para pan de centeno integral: solo agregas agua y levadura.',
    img: img('1534620808146-d33bb39128b2'), tags: ['sinasc'], dose: '100',
    pack: 'Bolsa 25 kg', price: 168, life: '6 meses', doseText: '100%: no requiere harina adicional',
    yield: 'Rinde ~40 kg de masa', featured: true,
  },
  {
    id: 'multigrano-7', cat: 'mezclas', name: 'Multigrano 7 Semillas',
    desc: 'Girasol, linaza, avena, centeno, cebada, ajonjolí y soya para panes rústicos.',
    img: img('1589367920969-ab8e050bbb04'), tags: ['frio'], dose: '25',
    pack: 'Bolsa 20 kg', price: 155, life: '9 meses', doseText: '25% sobre el total de harina',
    yield: 'Rinde ~80 kg de masa',
  },
  {
    id: 'molde-suave', cat: 'mezclas', name: 'Base Pan de Molde Suave',
    desc: 'Pan de molde blanco o integral con miga fina que se mantiene suave hasta 7 días.',
    img: img('1598373182133-52452f7691ef'), tags: ['clean'], dose: '100',
    pack: 'Bolsa 25 kg', price: 131, life: '9 meses', doseText: '100%: no requiere harina adicional',
    yield: 'Rinde ~40 kg de masa',
  },
  {
    id: 'mejorador-frio', cat: 'mejoradores', name: 'Mejorador Frío Plus',
    desc: 'Para fermentación controlada o en frío de 12 a 72 horas sin perder volumen.',
    img: img('1768203630938-1e51d2ecca41'), tags: ['frio'], dose: 'otro',
    pack: 'Bolsa 10 kg', price: 96, life: '12 meses', doseText: '1% sobre la harina',
    yield: 'Alcanza para ~1 000 kg de harina', featured: true,
  },
  {
    id: 'masa-madre', cat: 'mejoradores', name: 'Masa Madre Seca de Trigo',
    desc: 'Masa madre deshidratada con acidez estable: sabor de fermentación larga en un día.',
    img: img('1549413468-cd78edb7e75c'), tags: ['clean', 'sinasc'], dose: 'otro',
    pack: 'Bolsa 10 kg', price: 118, life: '12 meses', doseText: '3% a 5% sobre la harina',
    yield: 'Alcanza para ~250 kg de harina',
  },
  {
    id: 'mejorador-frances', cat: 'mejoradores', name: 'Mejorador Pan Francés',
    desc: 'Volumen y costra crocante para pan francés, ciabatta y baguette de producción diaria.',
    img: img('1586444248902-2f64eddc13df'), tags: ['sinasc'], dose: 'otro',
    pack: 'Bolsa 20 kg', price: 104, life: '12 meses', doseText: '0,5% a 1% sobre la harina',
    yield: 'Alcanza para ~2 000 kg de harina',
  },
  {
    id: 'croissant-pro', cat: 'dulces', name: 'Mezcla Croissant Pro',
    desc: 'Masa laminada estable en frío: capas definidas con mantequilla o margarina.',
    img: img('1555507036-ab1f4038808a'), tags: ['frio'], dose: '100',
    pack: 'Bolsa 15 kg', price: 176, life: '8 meses', doseText: '100%: no requiere harina adicional',
    yield: 'Rinde ~300 croissants de 60 g', featured: true,
  },
  {
    id: 'brioche', cat: 'dulces', name: 'Base Brioche',
    desc: 'Brioche, pan de hamburguesa y chancay con miga sedosa y color dorado.',
    img: img('1483695028939-5bb13f8648b0'), tags: ['clean'], dose: '50',
    pack: 'Bolsa 15 kg', price: 158, life: '8 meses', doseText: '50% sobre el total de harina',
    yield: 'Rinde ~30 kg de masa',
  },
  {
    id: 'relleno-manjar', cat: 'rellenos', name: 'Relleno Manjar Horneable',
    desc: 'Manjar blanco que no se derrama en el horno: para alfajores, berlinas y empanadas.',
    img: img('1612240498936-65f5101365d2'), tags: ['clean'], dose: 'otro',
    pack: 'Balde 5 kg', price: 64, life: '6 meses', doseText: 'Listo para usar',
    yield: '~100 berlinas de 50 g',
  },
  {
    id: 'cobertura-cacao', cat: 'rellenos', name: 'Cobertura Sabor Cacao',
    desc: 'Cobertura brillante que no se pega al empaque, para tortas, donas y cupcakes.',
    img: img('1574085733277-851d9d856a3a'), tags: ['sinasc'], dose: 'otro',
    pack: 'Balde 5 kg', price: 72, life: '9 meses', doseText: 'Fundir a 40 °C y aplicar',
    yield: '~150 donas',
  },
];

const RECIPES = [
  {
    id: 'pan-quinua', name: 'Pan de quinua y kiwicha', img: img('1509440159596-0249088772ff', 1200),
    time: '3 h 20 min', units: '20 panes de 500 g', level: 'Media',
    products: ['mezcla-andina', 'mejorador-frio'],
    ingredients: ['5 kg de harina de trigo', '5 kg de Mezcla Andina Quinua & Kiwicha', '100 g de Mejorador Frío Plus', '250 g de levadura fresca', '6,2 L de agua fría'],
    steps: ['Mezcla los secos 2 minutos en velocidad lenta.', 'Agrega el agua y amasa 8 minutos hasta obtener una masa lisa a 26 °C.', 'Reposa 15 minutos, divide en piezas de 560 g y bolea.', 'Fermenta 60 minutos a 32 °C y 80% de humedad.', 'Hornea 35 minutos a 220 °C con vapor al inicio.'],
  },
  {
    id: 'croissant', name: 'Croissant de mantequilla', img: img('1555507036-ab1f4038808a', 1200),
    time: '14 h (con reposo en frío)', units: '80 croissants de 60 g', level: 'Alta',
    products: ['croissant-pro'],
    ingredients: ['3 kg de Mezcla Croissant Pro', '150 g de levadura fresca', '1,6 L de agua fría', '1,5 kg de mantequilla para laminar'],
    steps: ['Amasa 6 minutos y deja la masa en frío toda la noche.', 'Lamina con la mantequilla: un pliegue doble y uno simple.', 'Estira a 4 mm, corta triángulos y enrolla.', 'Fermenta 2 horas a 26 °C.', 'Pinta con huevo y hornea 16 minutos a 190 °C.'],
  },
  {
    id: 'pan-centeno', name: 'Pan de centeno en molde', img: img('1534620808146-d33bb39128b2', 1200),
    time: '2 h 40 min', units: '12 moldes de 900 g', level: 'Baja',
    products: ['centeno-pleno', 'masa-madre'],
    ingredients: ['10 kg de Centeno Pleno 100%', '300 g de Masa Madre Seca de Trigo', '200 g de levadura fresca', '7,5 L de agua tibia'],
    steps: ['Mezcla todo 10 minutos en velocidad lenta: la masa queda pegajosa.', 'Reposa 20 minutos tapada.', 'Divide en piezas de 950 g y pásalas a moldes engrasados.', 'Fermenta 50 minutos hasta que la superficie se agriete.', 'Hornea 60 minutos a 200 °C bajando a 180 °C.'],
  },
  {
    id: 'molde-semillas', name: 'Pan de molde con semillas', img: img('1598373182133-52452f7691ef', 1200),
    time: '2 h 30 min', units: '16 moldes de 700 g', level: 'Baja',
    products: ['molde-suave', 'chia-dorada'],
    ingredients: ['8 kg de Base Pan de Molde Suave', '1 kg de Mezcla Chía Dorada', '250 g de levadura fresca', '5 L de agua'],
    steps: ['Amasa 10 minutos hasta desarrollar el gluten.', 'Divide en piezas de 720 g, bolea y reposa 10 minutos.', 'Forma, coloca en moldes y fermenta 70 minutos.', 'Hornea 30 minutos a 190 °C.', 'Enfría sobre rejilla antes de rebanar.'],
  },
];

const SEGMENTS = [
  { name: 'Panaderías de barrio', text: 'Mezclas que simplifican la producción diaria y bajan la merma.', img: img('1517433670267-08bbd4be890f', 800) },
  { name: 'Cadenas y supermercados', text: 'Fórmulas estables para producir igual en todas tus tiendas.', img: img('1568254183919-78a4f43a2877', 800) },
  { name: 'Hoteles y cafeterías', text: 'Bollería y panes de autor sin un maestro panadero en cada turno.', img: img('1556910103-1c02745aae4d', 800) },
];

const BRANCHES = [
  { city: 'Lima', address: 'Av. Nicolás Ayllón 4521, Ate', hours: 'Lun a sáb · 7:00–17:00', phone: '01 715 4400' },
  { city: 'Arequipa', address: 'Calle Variante de Uchumayo 312, Sachaca', hours: 'Lun a vie · 8:00–17:00', phone: '054 28 3310' },
  { city: 'Trujillo', address: 'Av. Nicolás de Piérola 1180, La Esperanza', hours: 'Lun a vie · 8:00–17:00', phone: '044 60 2215' },
];

const CLIENT = {
  company: 'Panificadora San Martín S.A.C.', ruc: '20601234567', contact: 'Rosa Quispe',
  district: 'San Martín de Porres', credit: 'Crédito a 30 días',
  orders: [
    { id: 'TR-24817', date: '28 sep 2026', status: 'Preparando', items: [['mezcla-andina', 4], ['mejorador-frio', 1]] },
    { id: 'TR-24690', date: '19 sep 2026', status: 'En camino', items: [['croissant-pro', 3], ['relleno-manjar', 2]] },
    { id: 'TR-24402', date: '02 sep 2026', status: 'Entregado', items: [['molde-suave', 6], ['chia-dorada', 2], ['masa-madre', 1]] },
  ],
};
