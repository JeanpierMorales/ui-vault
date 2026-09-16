# Sistema visual — UI Vault

## Propósito y superficie

UI Vault es un índice editorial y operativo para descubrir, ejecutar e inspeccionar componentes web independientes. La interfaz del vault funciona como una capa silenciosa alrededor de las piezas: ofrece navegación por categorías, búsqueda global, filtros, cuadrícula o lista, y una vista de detalle con preview y fuente. No rediseña el contenido catalogado.

La superficie se organiza como una aplicación de escritorio: una barra de utilidades fija arriba, una barra lateral numerada por categorías y un área de trabajo clara para el catálogo o el detalle. El catálogo puede presentar previews simultáneos; el detalle amplía una pieza, permite abrirla en otra pestaña, solicitar pantalla completa y copiar su fuente.

## Paleta y tipografía

El modo claro usa un lenguaje de papel cálido e tinta:

- `--paper: #f4f1ea` y `--paper-strong: #ebe6dc` para la navegación y superficies secundarias.
- `--canvas: #fffdf8` para el espacio de trabajo.
- `--ink: #1e211f` para texto y estados activos.
- `--muted: #72736d` para información auxiliar.
- Reglas finas `--rule: #d6d1c6` y `--rule-strong: #b9b3a8` estructuran el plano sin convertirlo en tarjetas pesadas.
- El coral `--accent: #c65d42` y su variante más oscura `--accent-dark: #9f422d` señalan foco, rutas, pestañas y acciones de copia.

El modo oscuro conserva los mismos roles con fondo casi negro verdoso, texto marfil y un coral más luminoso. Se activa manualmente y se guarda en `localStorage`.

La combinación tipográfica distingue contenido, metadatos y títulos: DM Sans para la interfaz, DM Mono para contadores, rutas, IDs, teclas y fuente, y Libre Baskerville para el título editorial principal. Los títulos usan peso regular, interletrado compacto y una escala fluida de hasta 68 px; la información de sistema se mantiene pequeña y monoespaciada.

## Composición

La retícula principal reserva 252 px para la barra lateral y 72 px para la cabecera. El workspace queda limitado a 1640 px y usa rellenos fluidos; esto conserva densidad en pantallas amplias sin llevar el contenido a bordes extremos.

En catálogo, el encabezado combina ruta, título y resultado, seguido de filtros en una línea con subrayado coral para el estado activo. Las piezas aparecen en una cuadrícula `auto-fill` de columnas mínimas de 267 px. Cada tarjeta destina 202 px al preview y una franja inferior compacta a categoría, nombre y acciones. La vista de lista reduce el preview a una columna de 168 px y lleva la tarjeta a 102 px de alto.

En detalle, una cabecera de retorno y acciones precede la ficha de la pieza. El preview toma una etapa amplia de hasta 700 px de alto, seguida por un inspector de fuente con pestañas y un bloque desplazable. La composición prioriza la pieza real y deja los controles en segundo plano.

## Componentes UI

- Barra superior con marca `UV`, búsqueda, atajo visible `⌘ K`, total de componentes, selector cuadrícula/lista, control de tema y menú móvil.
- Navegación lateral con overview, grupos/categorías, cantidades por categoría y una nota sobre la carga aislada.
- Filtros rápidos, tarjetas de componente, estado vacío y contador de resultados.
- Vista de detalle con volver al catálogo, ruta, descripción, ID, preview, abrir preview, pantalla completa, pestañas de fuente y copia de código.
- Toast temporal para confirmar copias o comunicar fallos de lectura.

Los controles se resuelven con texto, reglas y cambios de color; los únicos contenedores redondeados de forma discreta son utilidades compactas como búsqueda, toggles e iconos. Las tarjetas permanecen rectangulares, separadas por líneas de 1 px.

## Motion e interacciones

La respuesta visual es contenida: la búsqueda recibe borde y fondo al enfocarse; la tarjeta se eleva 3 px, ajusta borde y añade sombra al pasar el cursor; los botones de navegación y acción cambian de tinta o subrayan con coral. Esas transiciones duran entre 150 y 180 ms.

El panel lateral móvil entra y sale mediante traslación horizontal de 220 ms. El toast aparece desde 9 px por debajo con opacidad y se oculta tras 2,2 segundos. La búsqueda filtra instantáneamente en el navegador sobre metadatos; cambiar categoría limpia la consulta. `Esc` cierra primero el detalle, o la navegación móvil si no hay detalle abierto.

## Responsive y accesibilidad

El documento mantiene un ancho mínimo de 320 px. Por debajo de 880 px, la retícula pasa a una sola columna, la cabecera baja a 64 px, se ocultan contador y selector de vista, y la barra lateral se vuelve un panel fijo activado por botón con `aria-expanded`. Por debajo de 580 px, se simplifica la marca y el campo de búsqueda, el catálogo usa una sola columna y el detalle apila sus controles; el código puede extenderse a los bordes del viewport.

La estructura usa `header`, `aside`, `nav`, `main`, `section` y `article`. Los botones y campos tienen etiquetas en español, los iconos decorativos están ocultos a lectores de pantalla, y los previews tienen título. Hay foco visible de 2 px en coral, regiones vivas para galería y toast, un grupo con `aria-pressed` para la vista, pestañas con roles ARIA y un estado vacío que permite limpiar filtros. El color del tema se declara con `color-scheme` y la selección usa contraste de tinta/coral.

## Límite del sistema

El vault carga cada componente dentro de un `iframe` con su ruta original, tanto en tarjetas como en la vista de detalle. Esa decisión conserva aislados HTML, CSS, JavaScript, IDs, variables y eventos de cada pieza, evita colisiones con el catálogo y preserva el componente original sin transformarlo. El inspector y las funciones de copia leen los archivos originales; si se abre el vault fuera de un servidor local, estas lecturas pueden fallar y la interfaz lo comunica.
