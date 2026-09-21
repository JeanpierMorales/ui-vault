/**
 * UI Vault component registry.
 *
 * Each entry: { code, id, name, category, group, path, description, tags, sources }.
 * `code` is the SKU shown in the UI (e.g., BTN-001). Prefixes per category:
 *   Foundations: TYP (typography), ICN (icons), COL (colors)
 *   Components:  BTN, CRD, BOK, LDR, FRM, DSH
 *   Sections:    NAV, FEA, PRC, PRO, TST, SKL
 *   Motion:      M2D, M3D, EFX
 * To add: keep the piece's files untouched and append one entry here.
 */

const std = { html: 'index.html', css: 'style.css', js: 'script.js' };
const stds = { html: 'index.html', css: 'styles.css', js: 'script.js' };

export const components = [
  // FOUNDATIONS
  { code: 'TYP-001', id: 'typography-001', name: 'Font Samples', category: 'typography', group: 'Foundations', path: './assets/fonts/index.html', description: 'Muestras tipográficas del sistema.', tags: ['font', 'typography', 'foundation'], sources: { html: 'index.html' } },
  { code: 'ICN-001', id: 'icons-001', name: 'Icon Catalog', category: 'icons', group: 'Foundations', path: './assets/icons/index.html', description: 'Catálogo de iconos disponibles.', tags: ['icons', 'foundation', 'catalog'], sources: { html: 'index.html', css: 'styles.css', js: 'app.js' } },
  { code: 'COL-001', id: 'colors-001', name: 'Color System', category: 'colors', group: 'Foundations', path: './components/colors/index.html', description: 'Sistema de tokens y paletas de color.', tags: ['color', 'tokens', 'foundation', 'palette'], sources: { html: 'index.html', css: 'styles.css' } },

  // BUTTONS
  { code: 'BTN-001', id: 'button-001', name: 'Advanced Button Motion Library', category: 'buttons', group: 'Components', path: './components/buttons/button-001/index.html', description: 'Librería de botones con estados, hover y micro-interacciones.', tags: ['button', 'cta', 'hover', 'cursor', 'interaction', 'animation'], sources: std },
  { code: 'BTN-002', id: 'button-002', name: 'Button Variants 002', category: 'buttons', group: 'Components', path: './components/buttons/button-002/index.html', description: 'Variantes de botones (segunda tanda).', tags: ['button', 'variants'], sources: { html: 'index.html', css: 'styles.css' } },

  // CARDS
  { code: 'CRD-001', id: 'card-001', name: 'Interactive Product Card', category: 'cards', group: 'Components', path: './components/cards/card-001/index.html', description: 'Tarjeta de producto con interacción y estados visuales.', tags: ['card', 'product', 'interaction', 'hover'], sources: std },
  { code: 'CRD-002', id: 'card-002', name: 'Product Card 002', category: 'cards', group: 'Components', path: './components/cards/card-002/index.html', description: 'Tarjeta de producto (variante 002).', tags: ['card', 'product'], sources: std },
  { code: 'CRD-003', id: 'card-003', name: 'Product Card 003', category: 'cards', group: 'Components', path: './components/cards/card-003/index.html', description: 'Tarjeta de producto (variante 003).', tags: ['card', 'product'], sources: stds },
  { code: 'CRD-004', id: 'card-004', name: 'Product Card 004', category: 'cards', group: 'Components', path: './components/cards/card-004/index.html', description: 'Tarjeta de producto (variante 004).', tags: ['card', 'product'], sources: stds },
  { code: 'CRD-005', id: 'card-005', name: 'Premium ID Card', category: 'cards', group: 'Components', path: './components/cards/card-005/index.html', description: 'Tarjeta de identidad con controles de perfil.', tags: ['card', 'id', 'profile', 'interaction'], sources: stds },

  // BOOKS
  ...['001', '002', '003', '004'].map((n) => ({
    code: `BOK-${n}`, id: `book-${n}`, name: `Book Card ${n}`, category: 'book-cards', group: 'Components',
    path: `./components/books/book-${n}/index.html`,
    description: 'Composición editorial para presentar un libro.',
    tags: ['book', 'card', 'editorial', 'product'], sources: std,
  })),

  // LOADERS
  ...['001', '002', '003'].map((n) => ({
    code: `LDR-${n}`, id: `loader-${n}`, name: `Progress Loader ${n}`, category: 'loaders', group: 'Components',
    path: `./components/loaders/barraproces-${n}/index.html`,
    description: 'Componente de progreso con estados y avance visible.',
    tags: ['loader', 'progress', 'stepper', 'state'], sources: stds,
  })),

  // FORMS (login variants)
  { code: 'FRM-001', id: 'login-001', name: 'Login — Split Screen', category: 'forms', group: 'Components', path: './components/forms/login/login-001-split-screen/index.html', description: 'Login con layout dividido.', tags: ['login', 'form', 'authentication'], sources: std },
  { code: 'FRM-002', id: 'login-002', name: 'Login — Glass', category: 'forms', group: 'Components', path: './components/forms/login/login-002-glass/index.html', description: 'Login con efecto glassmorphism.', tags: ['login', 'form', 'glass', 'authentication'], sources: std },
  { code: 'FRM-003', id: 'login-003', name: 'Login — Minimal', category: 'forms', group: 'Components', path: './components/forms/login/login-003-minimal/index.html', description: 'Login minimalista.', tags: ['login', 'form', 'minimal', 'authentication'], sources: std },
  { code: 'FRM-004', id: 'login-004', name: 'Login 004', category: 'forms', group: 'Components', path: './components/forms/login/login-004/index.html', description: 'Login (variante 004).', tags: ['login', 'form', 'authentication'], sources: std },
  { code: 'FRM-005', id: 'login-005', name: 'Login 005', category: 'forms', group: 'Components', path: './components/forms/login/login-005/index.html', description: 'Login (variante 005).', tags: ['login', 'form', 'authentication'], sources: std },
  { code: 'FRM-006', id: 'login-006', name: 'Login 006', category: 'forms', group: 'Components', path: './components/forms/login/login-006/index.html', description: 'Login (variante 006).', tags: ['login', 'form', 'authentication'], sources: std },

  // DASHBOARD
  { code: 'DSH-001', id: 'dashboard-line', name: 'Dashboard Line Chart', category: 'dashboard', group: 'Components', path: './components/dashboard/line/index.html', description: 'Gráfico de línea para dashboard.', tags: ['dashboard', 'chart', 'line', 'data'], sources: stds },

  // NAVBAR
  { code: 'NAV-001', id: 'navbar-001', name: 'Navbar 001', category: 'navbar', group: 'Sections', path: './sections/navbar/model-001/index.html', description: 'Navbar (variante 001).', tags: ['navbar', 'navigation', 'header'], sources: std },
  { code: 'NAV-002', id: 'navbar-002', name: 'Navbar 002', category: 'navbar', group: 'Sections', path: './sections/navbar/model-002/index.html', description: 'Navbar (variante 002).', tags: ['navbar', 'navigation', 'header'], sources: std },
  { code: 'NAV-003', id: 'navbar-003', name: 'Navbar 003', category: 'navbar', group: 'Sections', path: './sections/navbar/model-003/index.html', description: 'Navbar (variante 003).', tags: ['navbar', 'navigation', 'header'], sources: { html: 'index.html', css: 'style.css' } },
  { code: 'NAV-004', id: 'navbar-004', name: 'Navbar 004', category: 'navbar', group: 'Sections', path: './sections/navbar/model-004/index.html', description: 'Navbar (variante 004).', tags: ['navbar', 'navigation', 'header'], sources: { html: 'index.html', css: 'style.css' } },
  { code: 'NAV-005', id: 'navbar-005', name: 'Navbar 005', category: 'navbar', group: 'Sections', path: './sections/navbar/model-005/index.html', description: 'Navbar (variante 005).', tags: ['navbar', 'navigation', 'header'], sources: std },
  { code: 'NAV-006', id: 'navbar-006', name: 'Navbar 006', category: 'navbar', group: 'Sections', path: './sections/navbar/model-006/index.html', description: 'Navbar (variante 006).', tags: ['navbar', 'navigation', 'header'], sources: std },

  // FEATURES
  ...['001', '002', '003', '004'].map((n) => ({
    code: `FEA-${n}`, id: `features-${n}`, name: `Features ${n}`, category: 'features', group: 'Sections',
    path: `./sections/features/model-${n}/index.html`,
    description: 'Sección de features con estructura propia.',
    tags: ['features', 'section', 'grid'], sources: std,
  })),

  // PRICING
  ...['001', '002', '003', '004', '005'].map((n) => ({
    code: `PRC-${n}`, id: `pricing-${n}`, name: `Pricing ${n}`, category: 'pricing', group: 'Sections',
    path: `./sections/pricing/pricing-${n}/index.html`,
    description: 'Sección de pricing con planes y selección interactiva.',
    tags: ['pricing', 'plans', 'section', 'cards'], sources: stds,
  })),

  // PROCESS
  ...['001', '002', '003', '004'].map((n) => ({
    code: `PRO-${n}`, id: `process-${n}`, name: `Process ${n}`, category: 'process', group: 'Sections',
    path: `./sections/process/process-${n}/index.html`,
    description: 'Sección de proceso con pasos y progreso.',
    tags: ['process', 'steps', 'section'], sources: std,
  })),

  // TESTIMONIALS
  { code: 'TST-001', id: 'testimonial-001', name: 'Testimonial 001', category: 'testimonials', group: 'Sections', path: './sections/testimonials/model-001/index.html', description: 'Sección de testimoniales con tratamiento visual propio.', tags: ['testimonial', 'review', 'section', 'social-proof'], sources: std },
  { code: 'TST-002', id: 'testimonial-002', name: 'Testimonial 002', category: 'testimonials', group: 'Sections', path: './sections/testimonials/model-002/index.html', description: 'Sección de testimoniales con tratamiento visual propio.', tags: ['testimonial', 'review', 'section', 'social-proof'], sources: stds },
  { code: 'TST-003', id: 'testimonial-003', name: 'Testimonial 003', category: 'testimonials', group: 'Sections', path: './sections/testimonials/model-003/index.html', description: 'Sección de testimoniales con tratamiento visual propio.', tags: ['testimonial', 'review', 'section', 'social-proof'], sources: stds },
  { code: 'TST-004', id: 'testimonial-004', name: 'Testimonial 004', category: 'testimonials', group: 'Sections', path: './sections/testimonials/model-004/index.html', description: 'Sección de testimoniales con tratamiento visual propio.', tags: ['testimonial', 'review', 'section', 'social-proof'], sources: { html: 'index.html', css: 'styles.css', js: 'scripts.js' } },
  { code: 'TST-005', id: 'testimonial-005', name: 'Testimonial 005', category: 'testimonials', group: 'Sections', path: './sections/testimonials/model-005/index.html', description: 'Sección de testimoniales con tratamiento visual propio.', tags: ['testimonial', 'review', 'section', 'social-proof'], sources: stds },
  { code: 'TST-006', id: 'testimonial-006', name: 'Testimonial 006', category: 'testimonials', group: 'Sections', path: './sections/testimonials/model-006/index.html', description: 'Sección de testimoniales con tratamiento visual propio.', tags: ['testimonial', 'review', 'section', 'social-proof'], sources: stds },
  { code: 'TST-007', id: 'testimonial-007', name: 'Testimonial 007', category: 'testimonials', group: 'Sections', path: './sections/testimonials/model-007/index.html', description: 'Sección de testimoniales con tratamiento visual propio.', tags: ['testimonial', 'review', 'section', 'social-proof'], sources: stds },

  // SKELETON
  { code: 'SKL-001', id: 'skeleton-001', name: 'Section Skeleton Template', category: 'skeleton', group: 'Sections', path: './sections/skeleton/index.html', description: 'Plantilla base para armar nuevas secciones.', tags: ['skeleton', 'template', 'starter'], sources: stds },

  // MOTION - 2D
  { code: 'M2D-001', id: 'motion-2d-library', name: '2D Motion Library', category: 'motion-2d', group: 'Motion', path: './motion/2d/index.html', description: 'Galería de animaciones 2D (zorros, cuervos, búhos, libros).', tags: ['2d', 'motion', 'sprites', 'animation'], sources: std },

  // MOTION - 3D
  { code: 'M3D-001', id: 'motion-3d-core', name: 'Interactive 3D Core', category: 'motion-3d', group: 'Motion', path: './motion/3d/models/interactive-core/index.html', description: 'Objeto 3D interactivo que responde a click y touch.', tags: ['3d', 'canvas', 'interactive', 'model'], sources: std },
  { code: 'M3D-002', id: 'motion-3d-animal', name: '3D Animal Model', category: 'motion-3d', group: 'Motion', path: './motion/3d/objects/animals/model-001/index.html', description: 'Modelo 3D de animal.', tags: ['3d', 'object', 'animal'], sources: stds },

  // MOTION - Effects
  { code: 'EFX-001', id: 'effect-scroll-companion-001', name: '3D Scroll Storytelling', category: 'motion-effects', group: 'Motion', path: './motion/effects/scroll/scroll-companion/model-001/index.html', description: 'Experiencia narrativa con canvas 3D persistente al hacer scroll.', tags: ['3d', 'scroll', 'canvas', 'storytelling', 'animation'], sources: std },
  { code: 'EFX-002', id: 'effect-scroll-companion-002', name: 'Scroll Companion 002', category: 'motion-effects', group: 'Motion', path: './motion/effects/scroll/scroll-companion/model-002/index.html', description: 'Experiencia de scroll (variante 002).', tags: ['scroll', 'canvas', 'animation'], sources: std },
];

export const categoryGroups = [
  {
    label: 'Foundations',
    items: [
      ['typography', 'Typography'],
      ['icons', 'Icons'],
      ['colors', 'Colors'],
    ],
  },
  {
    label: 'Components',
    items: [
      ['buttons', 'Buttons'],
      ['cards', 'Cards'],
      ['book-cards', 'Book Cards'],
      ['loaders', 'Loaders'],
      ['forms', 'Forms'],
      ['dashboard', 'Dashboard'],
    ],
  },
  {
    label: 'Sections',
    items: [
      ['navbar', 'Navbar'],
      ['features', 'Features'],
      ['pricing', 'Pricing'],
      ['process', 'Process'],
      ['testimonials', 'Testimonials'],
      ['skeleton', 'Skeleton'],
    ],
  },
  {
    label: 'Motion',
    items: [
      ['motion-2d', '2D'],
      ['motion-3d', '3D'],
      ['motion-effects', 'Effects'],
    ],
  },
];

export const categoryLabel = (category) =>
  categoryGroups.flatMap((group) => group.items).find(([id]) => id === category)?.[1] || category;
