/**
 * UI Vault component registry.
 * To add an item: keep its standalone files untouched, then append one object.
 */
export const components = [
  {
    id: 'button-001',
    name: 'Advanced Button Motion Library',
    category: 'buttons',
    group: 'Components',
    path: './components/buttons/button-001/index.html',
    description: 'Biblioteca de botones con estados, hover, cursor y animaciones.',
    tags: ['button', 'cta', 'hover', 'cursor', 'interaction', 'animation'],
    sources: { html: 'index.html', css: 'style.css', js: 'script.js' },
  },
  ...['001', '002', '003', '004'].map((number) => ({
    id: `book-${number}`,
    name: `Book Card ${number}`,
    category: 'book-cards',
    group: 'Components',
    path: `./components/books/book-${number}/index.html`,
    description: 'Composición editorial para mostrar un libro.',
    tags: ['book', 'card', 'editorial', 'product'],
    sources: { html: 'index.html', css: 'style.css', js: 'script.js' },
  })),
  ...[
    ['001', 'Interactive Product Card', 'style.css'],
    ['002', 'Product Card 002', 'style.css'],
    ['003', 'Product Card 003', 'styles.css'],
    ['004', 'Product Card 004', 'styles.css'],
  ].map(([number, name, css]) => ({
    id: `card-${number}`,
    name,
    category: 'cards',
    group: 'Components',
    path: `./components/cards/card-${number}/index.html`,
    description: 'Tarjeta de producto con interacción y estados visuales.',
    tags: ['card', 'product', 'interaction', 'hover'],
    sources: { html: 'index.html', css, js: 'script.js' },
  })),
  ...['001', '004', '005', '006'].map((number) => ({
    id: `login-${number}`,
    name: `Login ${number}${number === '001' ? ' — Split Screen' : ''}${number === '002' ? ' — Glass' : ''}${number === '003' ? ' — Minimal' : ''}`,
    category: 'forms',
    group: 'Components',
    path: `./pages/login/login-${number}${number === '001' ? '-split-screen' : number === '002' ? '-glass' : number === '003' ? '-minimal' : ''}/index.html`,
    description: 'Interfaz de acceso con estructura y comportamiento independientes.',
    tags: ['login', 'form', 'input', 'authentication'],
    sources: { html: 'index.html', css: 'style.css', js: 'script.js' },
  })),
  ...['001', '002', '003', '004', '005'].map((number) => ({
    id: `pricing-${number}`,
    name: `Pricing ${number}`,
    category: 'pricing',
    group: 'Sections',
    path: `./sections/pricing/pricing-${number}/index.html`,
    description: 'Sección de precios con planes y selección interactiva.',
    tags: ['pricing', 'plans', 'section', 'cards'],
    sources: { html: 'index.html', css: 'styles.css', js: 'script.js' },
  })),
  ...['001', '002', '003', '004', '005', '006', '007'].map((number) => ({
    id: `testimonial-${number}`,
    name: `Testimonial ${number}`,
    category: 'testimonials',
    group: 'Sections',
    path: `./sections/testimonials/model-${number}/index.html`,
    description: 'Sección de testimonios con tratamiento visual independiente.',
    tags: ['testimonial', 'review', 'section', 'social-proof'],
    sources: { html: 'index.html', css: number === '001' ? 'style.css' : 'styles.css', js: number === '004' ? 'scripts.js' : 'script.js' },
  })),
  {
    id: 'icons-catalog',
    name: 'Icon Catalog',
    category: 'icons',
    group: 'Foundations',
    path: './assets/icons/index.html',
    description: 'Catálogo local de iconos y su sistema de estilos.',
    tags: ['icons', 'foundation', 'catalog'],
    sources: { html: 'index.html', css: 'styles.css', js: 'app.js' },
  },
  {
    id: 'font-samples',
    name: 'Font Samples',
    category: 'typography',
    group: 'Foundations',
    path: './assets/fonts/index.html',
    description: 'Muestras tipográficas disponibles dentro del repositorio.',
    tags: ['font', 'typography', 'foundation'],
    sources: { html: 'index.html' },
  },
];

export const categoryGroups = [
  { label: 'Foundations', items: [['typography', 'Typography'], ['icons', 'Icons']] },
  { label: 'Components', items: [['buttons', 'Buttons'], ['cards', 'Cards'], ['book-cards', 'Book Cards'], ['forms', 'Forms']] },
  { label: 'Sections', items: [['pricing', 'Pricing'], ['testimonials', 'Testimonials']] },
  { label: 'Interactions', items: [['animations', 'Animations'], ['cursor-effects', 'Cursor Effects'], ['hover-effects', 'Hover Effects']] },
  { label: 'Layouts', items: [['layouts', 'Layouts'], ['galleries', 'Galleries']] },
];

export const categoryLabel = (category) =>
  categoryGroups.flatMap((group) => group.items).find(([id]) => id === category)?.[1] || category;
