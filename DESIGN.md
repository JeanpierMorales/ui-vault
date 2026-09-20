# Sistema visual — UI Vault

## Propósito y superficie

UI Vault es un espacio de composición para descubrir, ejecutar e insertar componentes web independientes. La interfaz funciona como una capa silenciosa alrededor de las piezas: ofrece biblioteca por categorías, búsqueda global, un lienzo de página, una bandeja de variantes y un inspector. No rediseña ni simula el contenido catalogado: la superficie visual principal proviene de los documentos reales del repositorio.

La superficie se organiza como una aplicación de escritorio: una barra de utilidades fija arriba, una biblioteca lateral por categorías, un centro dividido 60/40 entre lienzo y piezas disponibles, y un inspector a la derecha. La bandeja presenta nombres reales de cada variante y mantiene una sola preview ejecutable activa para no cargar decenas de documentos pesados a la vez. Al añadir una variante, el lienzo muestra únicamente esa pieza.

## Paleta y tipografía

El modo claro usa un lenguaje de papel cálido e tinta:

- `--paper: #f4f1ea` y `--paper-strong: #ebe6dc` para la navegación y superficies secundarias.
- `--canvas: #fffdf8` para el espacio de trabajo.
- `--ink: #1e211f` para texto y estados activos.
- `--muted: #72736d` para información auxiliar.
- Reglas finas `--rule: #d6d1c6` y `--rule-strong: #b9b3a8` estructuran el plano sin convertirlo en tarjetas pesadas.
- El coral `--accent: #c65d42` y su variante más oscura `--accent-dark: #9f422d` señalan foco, rutas, pestañas y acciones de copia.

El modo oscuro conserva los mismos roles con fondo casi negro verdoso, texto marfil y un coral más luminoso. Se activa manualmente y se guarda en `localStorage`.

La combinación tipográfica usa DM Sans para toda la interfaz y Montserrat ExtraBold para los títulos de alto impacto. Los títulos mantienen una escala fluida de hasta 68 px, interletrado compacto y peso 800; la información auxiliar usa DM Sans en tamaños pequeños y peso 700 para conservar legibilidad sin introducir otra familia.

## Composición

La retícula principal reserva 252 px para la barra lateral y 72 px para la cabecera. El workspace queda limitado a 1640 px y usa rellenos fluidos; esto conserva densidad en pantallas amplias sin llevar el contenido a bordes extremos.

En catálogo, el encabezado combina ruta, título y resultado, seguido de filtros en una línea con subrayado coral para el estado activo. Las piezas aparecen como un campo de documentos vivos de dos columnas; las bibliotecas más amplias (botones, iconos y tipografía) ocupan toda la retícula. Cada preview recibe entre 390 y 680 px de alto según la naturaleza de la pieza, con una leyenda mínima debajo para categoría, ID, nombre y acciones. No hay tarjetas visuales inventadas alrededor de las muestras. Al filtrar, las piezas pasan a ocupar todo el ancho para que su diseño original sea el foco. La vista de lista usa previews horizontales de 180 px para exploración rápida.

En detalle, una cabecera de retorno y acciones precede la ficha de la pieza. El preview toma una etapa amplia de hasta 700 px de alto, seguida por un inspector de fuente con pestañas y un bloque desplazable. La composición prioriza la pieza real y deja los controles en segundo plano.

## Componentes UI

- Barra superior con marca `UV`, nombre editable del proyecto, deshacer/rehacer, preview publicado, exportación, tema y menú móvil.
- Biblioteca lateral con grupos/categorías, cantidades de piezas atómicas y una nota sobre la carga aislada.
- Lienzo central con selector desktop/tablet/móvil y bloques reordenables; cada bloque tiene controles de subir, bajar y eliminar.
- Bandeja inferior de variantes individuales: botones y cards de documentos fuente se descubren como piezas independientes, mientras login, pricing, testimonios y otras superficies ya unitarias conservan su documento completo.
- Inspector de bloque con altura, fondo, duplicación y eliminación; toast para confirmar inserciones y exportación.

Los controles se resuelven con texto, reglas y cambios de color; los únicos contenedores redondeados de forma discreta son utilidades compactas como búsqueda, toggles e iconos. Las tarjetas permanecen rectangulares, separadas por líneas de 1 px.

## Motion e interacciones

La respuesta visual es contenida: la búsqueda recibe borde y fondo al enfocarse; al pasar sobre una pieza solo se enfatiza el borde de su lienzo real con una sombra suave. Las acciones aplican los tratamientos `Cursor Fill`, `Liquid Rise` y `Diagonal Fill` de la biblioteca de botones existente; los iconos de utilidad retoman sus animaciones lift, expand, slide, spin y undo. El contenido de los documentos registrados sigue aislado y sin modificaciones.

El panel lateral móvil entra y sale mediante traslación horizontal de 220 ms. El toast aparece desde 9 px por debajo con opacidad y se oculta tras 2,2 segundos. La búsqueda filtra instantáneamente en el navegador sobre metadatos; cambiar categoría limpia la consulta. `Esc` cierra primero el detalle, o la navegación móvil si no hay detalle abierto.

## Responsive y accesibilidad

El documento mantiene un ancho mínimo de 320 px. Por debajo de 880 px, la retícula pasa a una sola columna, la cabecera baja a 64 px, se ocultan contador y selector de vista, y la barra lateral se vuelve un panel fijo activado por botón con `aria-expanded`. Por debajo de 580 px, se simplifica la marca y el campo de búsqueda, el catálogo usa una sola columna y el detalle apila sus controles; el código puede extenderse a los bordes del viewport.

La estructura usa `header`, `aside`, `nav`, `main`, `section` y `article`. Los botones y campos tienen etiquetas en español, los iconos decorativos están ocultos a lectores de pantalla, y los previews tienen título. Hay foco visible de 2 px en coral, regiones vivas para galería y toast, un grupo con `aria-pressed` para la vista, pestañas con roles ARIA y un estado vacío que permite limpiar filtros. El color del tema se declara con `color-scheme` y la selección usa contraste de tinta/coral.

## Límite del sistema

El vault carga cada componente dentro de un `iframe` con su ruta original, tanto en el campo de documentos como en la vista de detalle. Esa decisión conserva aislados HTML, CSS, JavaScript, IDs, variables y eventos de cada pieza, evita colisiones con el catálogo y preserva el componente original sin transformarlo. El inspector y las funciones de copia leen los archivos originales; si se abre el vault fuera de un servidor local, estas lecturas pueden fallar y la interfaz lo comunica.
