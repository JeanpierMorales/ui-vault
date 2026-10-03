/**
 * UI Vault component registry.
 *
 * Each entry: { code, id, name, category, group, path, description, tags, sources }.
 * `code` is the SKU shown in the UI (e.g., BTN-001). Prefixes per category:
 *   Foundations: TYP (typography), ICN (icons), COL (colors)
 *   Components:  BTN, CRD, BOK, LDR, FRM, DSH
 *   Sections:    NAV, HER, FEA, HIW, PRO, WRK, WSP, ANL, TST, ABT, PRC, FAQ, BLG, CTA, CNT, FTR, SKL
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
  { code: 'CRD-006', id: 'card-006', name: 'Spotlight Feature Cards', category: 'cards', group: 'Components', path: './components/cards/card-006/index.html', description: 'Tarjetas de servicio con luz que sigue al cursor e ilumina el borde.', tags: ['card', 'dark', 'spotlight', 'hover', 'features', 'services', 'glow'], sources: stds },
  { code: 'CRD-007', id: 'card-007', name: 'Article Cards', category: 'cards', group: 'Components', path: './components/cards/card-007/index.html', description: 'Tarjetas editoriales de blog con imagen, categoría, autor y variante destacada.', tags: ['card', 'blog', 'article', 'editorial', 'image', 'hover', 'featured'], sources: stds },
  { code: 'CRD-008', id: 'card-008', name: 'Pricing Plan Cards', category: 'cards', group: 'Components', path: './components/cards/card-008/index.html', description: 'Planes de precios con cambio mensual/anual y dígitos que ruedan.', tags: ['card', 'pricing', 'plans', 'toggle', 'saas', 'animation', 'numbers'], sources: stds },
  { code: 'CRD-009', id: 'card-009', name: 'Glass Credit Card 3D', category: 'cards', group: 'Components', path: './components/cards/card-009/index.html', description: 'Tarjeta de pago de cristal que se inclina en 3D hacia el cursor y se voltea al hacer clic.', tags: ['card', 'credit-card', 'payment', 'glassmorphism', '3d', 'tilt', 'flip'], sources: stds },
  { code: 'CRD-010', id: 'card-010', name: 'Testimonial Cards', category: 'cards', group: 'Components', path: './components/cards/card-010/index.html', description: 'Reseñas con estrellas, avatar, insignia verificada y "Leer más" expandible.', tags: ['card', 'testimonial', 'review', 'rating', 'quote', 'editorial', 'expand'], sources: stds },
  { code: 'CRD-011', id: 'card-011', name: 'KPI Stat Cards', category: 'cards', group: 'Components', path: './components/cards/card-011/index.html', description: 'Tarjetas de métricas con contador animado, variación y sparkline que cambian por periodo.', tags: ['card', 'kpi', 'stats', 'dashboard', 'analytics', 'sparkline', 'counter'], sources: stds },
  { code: 'CRD-012', id: 'card-012', name: 'Expanding Image Cards', category: 'cards', group: 'Components', path: './components/cards/card-012/index.html', description: 'Fila de tarjetas de imagen que se expanden, con títulos verticales en las plegadas.', tags: ['card', 'accordion', 'expanding', 'gallery', 'image', 'hover', 'keyboard'], sources: stds },
  { code: 'CRD-013', id: 'card-013', name: 'Music Player Card', category: 'cards', group: 'Components', path: './components/cards/card-013/index.html', description: 'Reproductor de música con vinilo giratorio, barra arrastrable y ecualizador animado.', tags: ['card', 'music', 'player', 'media', 'dark', 'slider', 'equalizer'], sources: stds },
  { code: 'CRD-014', id: 'card-014', name: 'Team Flip Cards', category: 'cards', group: 'Components', path: './components/cards/card-014/index.html', description: 'Tarjetas de equipo con retrato que giran en 3D y muestran bio, habilidades y redes.', tags: ['card', 'team', 'profile', 'flip', '3d', 'portrait', 'social'], sources: stds },
  { code: 'CRD-015', id: 'card-015', name: 'Event Ticket Card', category: 'cards', group: 'Components', path: './components/cards/card-015/index.html', description: 'Entrada de concierto con troquel perforado, código tipo QR, descarga .ics y talón que se arranca.', tags: ['card', 'ticket', 'event', 'qr', 'calendar', 'perforated', 'animation'], sources: stds },
  { code: 'CRD-016', id: 'card-016', name: 'Real Estate Listing Cards', category: 'cards', group: 'Components', path: './components/cards/card-016/index.html', description: 'Fichas de inmuebles con carrusel de fotos, precio, datos con iconos, favorito y etiquetas.', tags: ['card', 'real-estate', 'listing', 'carousel', 'swipe', 'favorite', 'badge'], sources: stds },
  { code: 'CRD-017', id: 'card-017', name: 'Notification Stack', category: 'cards', group: 'Components', path: './components/cards/card-017/index.html', description: 'Pila de notificaciones que se despliega, se descarta deslizando y permite deshacer.', tags: ['card', 'notifications', 'stack', 'swipe', 'dismiss', 'flip', 'toast'], sources: stds },
  { code: 'CRD-018', id: 'card-018', name: 'Bento Grid Cards', category: 'cards', group: 'Components', path: './components/cards/card-018/index.html', description: 'Cuadrícula bento monocroma con foto, contador, gráfico SVG, avatares, cita y CTA.', tags: ['card', 'bento', 'grid', 'dashboard', 'monochrome', 'chart', 'stagger'], sources: stds },
  { code: 'CRD-019', id: 'card-019', name: 'Course Progress Cards', category: 'cards', group: 'Components', path: './components/cards/card-019/index.html', description: 'Tarjetas de cursos con anillo y barra de progreso animados e insignia de completado.', tags: ['card', 'course', 'e-learning', 'progress', 'progress-ring', 'badge', 'education'], sources: stds },
  { code: 'CRD-020', id: 'card-020', name: 'Weather Card', category: 'cards', group: 'Components', path: './components/cards/card-020/index.html', description: 'Tarjeta del clima con pestañas de ciudad, icono animado, franja horaria y cambio °C/°F.', tags: ['card', 'weather', 'forecast', 'tabs', 'unit-toggle', 'svg-animation', 'scroll-snap'], sources: stds },
  { code: 'CRD-021', id: 'card-021', name: 'Recipe Card', category: 'cards', group: 'Components', path: './components/cards/card-021/index.html', description: 'Receta con ingredientes marcables, selector de raciones que reescala cantidades y guardar.', tags: ['card', 'recipe', 'food', 'ingredients', 'checklist', 'stepper', 'save'], sources: stds },

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

  // HERO
  { code: 'HER-001', id: 'hero-001', name: 'Hero 001 · KANZO', category: 'hero', group: 'Sections', path: './sections/hero/model-001/index.html', description: 'Hero de estudio digital: webs, software y experiencias inteligentes.', tags: ['hero', 'section', 'studio', 'kanzo'], sources: stds },
  { code: 'HER-002', id: 'hero-002', name: 'Hero 002 · KANZO', category: 'hero', group: 'Sections', path: './sections/hero/model-002/index.html', description: 'Hero de estudio digital (variante 002): web, software y productos con IA.', tags: ['hero', 'section', 'studio', 'kanzo'], sources: stds },
  { code: 'HER-003', id: 'hero-003', name: 'Hero 003 · KANZO', category: 'hero', group: 'Sections', path: './sections/hero/model-003/index.html', description: 'Hero de estudio digital (variante 003).', tags: ['hero', 'section', 'studio', 'kanzo'], sources: stds },
  { code: 'HER-004', id: 'hero-004', name: 'Hero 004 · BC Architecture', category: 'hero', group: 'Sections', path: './sections/hero/model-004/index.html', description: 'Hero de estudio de arquitectura.', tags: ['hero', 'section', 'architecture'], sources: stds },
  { code: 'HER-005', id: 'hero-005', name: 'Hero 005 · POCO', category: 'hero', group: 'Sections', path: './sections/hero/model-005/index.html', description: 'Hero de estudio de interiorismo.', tags: ['hero', 'section', 'interior'], sources: stds },
  { code: 'HER-006', id: 'hero-006', name: 'Hero 006 · TRVL', category: 'hero', group: 'Sections', path: './sections/hero/model-006/index.html', description: 'Hero de viajes de montaña.', tags: ['hero', 'section', 'travel', 'image'], sources: stds },
  { code: 'HER-007', id: 'hero-007', name: 'Hero 007 · Travel Slider', category: 'hero', group: 'Sections', path: './sections/hero/model-007/index.html', description: 'Hero de viajes con slider de destinos.', tags: ['hero', 'section', 'travel', 'slider'], sources: stds },
  { code: 'HER-008', id: 'hero-008', name: 'Hero 008 · Solace', category: 'hero', group: 'Sections', path: './sections/hero/model-008/index.html', description: 'Hero de muebles acústicos: la onda de ruido de la sala se aplana donde pasa el cursor. Syne + Work Sans, pistacho y burdeos.', tags: ['hero', 'section', 'waveform', 'interactive'], sources: stds },
  { code: 'HER-009', id: 'hero-009', name: 'Hero 009 · Nordvik', category: 'hero', group: 'Sections', path: './sections/hero/model-009/index.html', description: 'Hero de ferris: tablero de salidas en vivo con cuenta regresiva y ruta que se dibuja. Archivo + IBM Plex Mono, naranja señal sobre azul hielo.', tags: ['hero', 'section', 'timetable', 'interactive'], sources: stds },
  { code: 'HER-010', id: 'hero-010', name: 'Hero 010 · Marea', category: 'hero', group: 'Sections', path: './sections/hero/model-010/index.html', description: 'Hero de cevichería en Lima: pizarra de la pesca del día que se agota en hora de Lima. Cormorant + Manrope, cobalto y arena.', tags: ['hero', 'section', 'restaurant', 'interactive'], sources: stds },

  { code: 'HER-011', id: 'hero-011', name: 'Hero 011 · Ramp', category: 'hero', group: 'Sections', path: './sections/hero/model-011/index.html', description: 'Hero de software financiero para empresas modernas.', tags: ['hero', 'section', 'fintech', 'saas'], sources: stds },
  { code: 'HER-012', id: 'hero-012', name: 'Hero 012 · Flash', category: 'hero', group: 'Sections', path: './sections/hero/model-012/index.html', description: 'Hero Flash.', tags: ['hero', 'section'], sources: stds },
  { code: 'HER-013', id: 'hero-013', name: 'Hero 013 · CALORI', category: 'hero', group: 'Sections', path: './sections/hero/model-013/index.html', description: 'Hero de plan de comidas personalizado.', tags: ['hero', 'section', 'food', 'health'], sources: stds },
  { code: 'HER-014', id: 'hero-014', name: 'Hero 014 · Ola Norte', category: 'hero', group: 'Sections', path: './sections/hero/model-014/index.html', description: 'Hero de casa de surf en Máncora: acordeón vertical de fotos y titular gigante. Hanken Grotesk, arena y sol.', tags: ['hero', 'section', 'travel', 'surf', 'accordion', 'photography', 'interactive'], sources: stds },
  { code: 'HER-015', id: 'hero-015', name: 'Hero 015 · Estudio Pampa', category: 'hero', group: 'Sections', path: './sections/hero/model-015/index.html', description: 'Hero de arquitectura en Arequipa: la imagen crece con el scroll hasta pantalla completa. Onest y terracota.', tags: ['hero', 'section', 'architecture', 'scroll', 'scroll-expand', 'photography', 'minimal'], sources: stds },
  { code: 'HER-016', id: 'hero-016', name: 'Hero 016 · Barro Lento', category: 'hero', group: 'Sections', path: './sections/hero/model-016/index.html', description: 'Hero de cerámica en Barranco: collage de fotos con profundidad y detalle que se expande. Geist, arcilla y óxido.', tags: ['hero', 'section', 'ceramics', 'collage', 'parallax', 'interactive'], sources: stds },

  // FEATURES (extra)
  { code: 'FEA-005', id: 'features-005', name: 'Features 005 · KANZO', category: 'features', group: 'Sections', path: './sections/features/model-005/index.html', description: 'Features de estudio digital.', tags: ['features', 'section', 'studio', 'kanzo'], sources: stds },

  // PROCESS (extra)
  { code: 'PRO-005', id: 'process-005', name: 'Process 005 · KANZO Services', category: 'process', group: 'Sections', path: './sections/process/process-005/index.html', description: 'Servicios del estudio presentados como pasos.', tags: ['process', 'services', 'section', 'kanzo'], sources: stds },
  { code: 'PRO-006', id: 'process-006', name: 'Process 006 · KANZO', category: 'process', group: 'Sections', path: './sections/process/process-006/index.html', description: 'Proceso de trabajo del estudio.', tags: ['process', 'steps', 'section', 'kanzo'], sources: stds },

  // HOW IT WORKS
  { code: 'HIW-001', id: 'how-it-works-001', name: 'How It Works 001 · MIRA', category: 'how-it-works', group: 'Sections', path: './sections/howitworkd/model-001/index.html', description: 'Cómo funciona MIRA, paso a paso.', tags: ['how-it-works', 'steps', 'section', 'mira'], sources: stds },

  // WORK
  { code: 'WRK-001', id: 'work-001', name: 'Selected Work 001 · KANZO', category: 'work', group: 'Sections', path: './sections/work/model-001/index.html', description: 'Portafolio de trabajos seleccionados.', tags: ['work', 'portfolio', 'section', 'kanzo'], sources: stds },

  // CONTENT WORKSPACE
  { code: 'WSP-001', id: 'workspace-001', name: 'Content Workflow · MIRA', category: 'workspace', group: 'Sections', path: './sections/Content Workspace/model-001/index.html', description: 'Flujo de contenido de MIRA.', tags: ['workspace', 'product', 'section', 'mira'], sources: stds },
  { code: 'WSP-002', id: 'workspace-002', name: 'Organize & Publish · MIRA', category: 'workspace', group: 'Sections', path: './sections/Content Workspace/model-002/index.html', description: 'Organizar y publicar contenido.', tags: ['workspace', 'product', 'section', 'mira'], sources: stds },
  { code: 'WSP-003', id: 'workspace-003', name: 'Publishing Flow · MIRA', category: 'workspace', group: 'Sections', path: './sections/Content Workspace/model-003/index.html', description: 'Flujo de publicación.', tags: ['workspace', 'product', 'section', 'mira'], sources: stds },
  { code: 'WSP-004', id: 'workspace-004', name: 'Booketeer · MIRA', category: 'workspace', group: 'Sections', path: './sections/Content Workspace/model-004/index.html', description: 'Sección Booketeer para MIRA.', tags: ['workspace', 'product', 'section', 'mira'], sources: stds },
  { code: 'WSP-005', id: 'workspace-005', name: 'Done For You 005 · MIRA', category: 'workspace', group: 'Sections', path: './sections/Content Workspace/model-005/index.html', description: 'Servicio "Done For You" (variante 005).', tags: ['workspace', 'service', 'section', 'mira'], sources: stds },
  { code: 'WSP-006', id: 'workspace-006', name: 'Done For You 006 · MIRA', category: 'workspace', group: 'Sections', path: './sections/Content Workspace/model-006/index.html', description: 'Servicio "Done For You" (variante 006).', tags: ['workspace', 'service', 'section', 'mira'], sources: stds },

  // ANALYTICS
  { code: 'ANL-001', id: 'analytics-001', name: 'Analytics 001 · MIRA', category: 'analytics', group: 'Sections', path: './sections/analitycs/model-001/index.html', description: 'Sección de analítica de producto.', tags: ['analytics', 'dashboard', 'section', 'mira'], sources: stds },

  // ABOUT (extra)
  { code: 'ABT-001', id: 'about-001', name: 'About Us 001 · KANZO', category: 'about', group: 'Sections', path: './sections/aboutUs/model-001/index.html', description: 'Enfoque, principios y equipo del estudio.', tags: ['about', 'section', 'team', 'kanzo'], sources: { html: 'index.html', css: 'about.css', js: 'about.js' } },
  { code: 'ABT-002', id: 'about-002', name: 'About Us 002 · Why KANZO', category: 'about', group: 'Sections', path: './sections/aboutUs/model-002/index.html', description: 'Por qué elegir el estudio.', tags: ['about', 'section', 'kanzo'], sources: stds },

  // FAQ
  { code: 'FAQ-001', id: 'faq-001', name: 'FAQ 001 · MIRA', category: 'faq', group: 'Sections', path: './sections/FAQ/model-001/index.html', description: 'Preguntas frecuentes.', tags: ['faq', 'accordion', 'section', 'mira'], sources: stds },
  { code: 'FAQ-002', id: 'faq-002', name: 'FAQ 002 · KANZO', category: 'faq', group: 'Sections', path: './sections/FAQ/model-002/index.html', description: 'Preguntas frecuentes del estudio.', tags: ['faq', 'accordion', 'section', 'kanzo'], sources: stds },

  // BLOG
  { code: 'BLG-001', id: 'blog-001', name: 'Blog & Articles · MIRA', category: 'blog', group: 'Sections', path: './sections/Blog/model-001/index.html', description: 'Listado de blog y artículos.', tags: ['blog', 'articles', 'editorial', 'section', 'mira'], sources: { html: 'index.html', css: 'blog.css', js: 'blog.js' } },

  // CTA
  { code: 'CTA-001', id: 'cta-001', name: "CTA 001 · Let's Grow Together", category: 'cta', group: 'Sections', path: './sections/cta/model-001/index.html', description: 'Llamado a la acción de cierre.', tags: ['cta', 'section'], sources: { html: 'index.html', css: 'styles.css' } },
  { code: 'CTA-002', id: 'cta-002', name: 'CTA 002 · MIRA', category: 'cta', group: 'Sections', path: './sections/cta/model-002/index.html', description: 'Llamado a la acción de MIRA.', tags: ['cta', 'section', 'mira'], sources: { html: 'index.html', css: 'styles.css' } },
  { code: 'CTA-003', id: 'cta-003', name: 'CTA 003 · KANZO', category: 'cta', group: 'Sections', path: './sections/cta/model-003/index.html', description: 'CTA de estudio: el titular cambia según el tipo de proyecto y arma un mensaje para WhatsApp o correo. Barlow Condensed + Manrope, rojo tomate.', tags: ['cta', 'section', 'form', 'whatsapp'], sources: stds },

  // ABOUT
  { code: 'ABT-003', id: 'about-003', name: 'About Us 003 · BC Architecture', category: 'about', group: 'Sections', path: './sections/aboutUs/model-003/index.html', description: 'About de arquitectura: la foto se levanta sobre su plano, línea de tiempo en barra de escala y principios como especificación. Libre Baskerville + Figtree, concreto y musgo.', tags: ['about', 'section', 'timeline', 'architecture'], sources: stds },

  // CONTACT
  { code: 'CNT-001', id: 'contact-001', name: 'Contact 001 · KANZO', category: 'contact', group: 'Sections', path: './sections/contact/model-001/index.html', description: 'Contacto del estudio.', tags: ['contact', 'section', 'form', 'kanzo'], sources: stds },
  { code: 'CNT-002', id: 'contact-002', name: 'Contact 002 · POCO', category: 'contact', group: 'Sections', path: './sections/contact/model-002/index.html', description: 'Contacto de interiorismo: dibuja el cuarto a escala y redacta el brief que se envía por correo. Outfit, mostaza, carbón y lino.', tags: ['contact', 'section', 'form', 'interior'], sources: stds },

  // FOOTER
  { code: 'FTR-001', id: 'footer-001', name: 'Footer 001 · MIRA', category: 'footer', group: 'Sections', path: './sections/footer/model-001/index.html', description: 'Footer claro.', tags: ['footer', 'section', 'mira'], sources: { html: 'index.html', css: 'styles.css' } },
  { code: 'FTR-002', id: 'footer-002', name: 'Footer 002 · MIRA Dark', category: 'footer', group: 'Sections', path: './sections/footer/model-002/index.html', description: 'Footer oscuro.', tags: ['footer', 'section', 'dark', 'mira'], sources: stds },
  { code: 'FTR-003', id: 'footer-003', name: 'Footer 003 · MIRA Editorial', category: 'footer', group: 'Sections', path: './sections/footer/model-003/index.html', description: 'Footer editorial.', tags: ['footer', 'section', 'editorial', 'mira'], sources: stds },
  { code: 'FTR-004', id: 'footer-004', name: 'Footer 004 · MIRA Editorial', category: 'footer', group: 'Sections', path: './sections/footer/model-004/index.html', description: 'Footer editorial (variante 004).', tags: ['footer', 'section', 'editorial', 'mira'], sources: stds },
  { code: 'FTR-005', id: 'footer-005', name: 'Footer 005 · MIRA Interactive', category: 'footer', group: 'Sections', path: './sections/footer/model-005/index.html', description: 'Footer con interacción.', tags: ['footer', 'section', 'interactive', 'mira'], sources: stds },

  // SKELETON
  { code: 'SKL-001', id: 'skeleton-001', name: 'Section Skeleton Template', category: 'skeleton', group: 'Sections', path: './sections/skeleton/index.html', description: 'Plantilla base para armar nuevas secciones.', tags: ['skeleton', 'template', 'starter'], sources: stds },

  // MOTION - 2D
  { code: 'M2D-001', id: 'motion-2d-library', name: '2D Motion Library', category: 'motion-2d', group: 'Motion', path: './motion/2d/index.html', description: 'Galería de animaciones 2D (zorros, cuervos, búhos, libros).', tags: ['2d', 'motion', 'sprites', 'animation'], sources: std },

  { code: 'M2D-002', id: 'motion-2d-laptop', name: '2D Laptop · KANZO', category: 'motion-2d', group: 'Motion', path: './motion/2d/model-005/index.html', description: 'Animación 2D de laptop.', tags: ['2d', 'motion', 'animation', 'kanzo'], sources: stds },

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
      // Ordered as they appear down a page, so "next" walks a landing top to bottom.
      ['navbar', 'Navbar'],
      ['hero', 'Hero'],
      ['features', 'Features'],
      ['how-it-works', 'How It Works'],
      ['process', 'Process'],
      ['work', 'Work'],
      ['workspace', 'Content Workspace'],
      ['analytics', 'Analytics'],
      ['testimonials', 'Testimonials'],
      ['about', 'About Us'],
      ['pricing', 'Pricing'],
      ['faq', 'FAQ'],
      ['blog', 'Blog'],
      ['cta', 'CTA'],
      ['contact', 'Contact'],
      ['footer', 'Footer'],
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
