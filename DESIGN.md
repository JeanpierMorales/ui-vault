# Sistema visual — UI Vault

## Propósito y superficie

UI Vault es una biblioteca para recorrer componentes web independientes en grande. La interfaz funciona como una capa silenciosa alrededor de las piezas: un índice lateral, un escenario amplio y un paso a paso para pasar de un modelo al siguiente sin entrar y salir de páginas. No rediseña ni simula el contenido catalogado: lo que se ve en el escenario es el documento real del repositorio.

## Paleta y tipografía

El modo claro usa un lenguaje de papel cálido e tinta:

- `--paper: #f4f1ea` para la barra superior, el índice y las barras del escenario.
- `--canvas: #ffffff` para estados de hover y el elemento activo del índice.
- `--preview: #eeeae1` como fondo del escenario detrás de la pieza.
- `--ink: #1e211f` para texto y estados activos.
- `--muted: #7a7568` para información auxiliar.
- Reglas finas `--rule: #d9d3c5` y `--rule-strong: #b8b1a2` estructuran el plano sin convertirlo en tarjetas pesadas.
- El coral `--accent: #c96a3a` y `--accent-dark: #a04d24` señalan la pieza activa, el foco y la ruta.

El modo oscuro conserva los mismos roles con fondo casi negro verdoso, texto marfil y un coral más luminoso. Se activa manualmente y se guarda en `localStorage`.

DM Sans para toda la interfaz y Montserrat ExtraBold para el nombre de la pieza y la marca. La información auxiliar (códigos, contadores, migas) usa DM Sans pequeño en peso 700 y mayúsculas espaciadas.

## Composición

- **Barra superior (60 px):** botón para plegar el índice, marca `UV`, búsqueda con atajo `⌘K`, total de piezas y tema.
- **Índice lateral (280 px):** grupos Foundations, Components, Sections y Motion; cada categoría se despliega y lista sus piezas con código y nombre. Las secciones siguen el orden en que aparecen en una landing (Navbar → Hero → … → Footer), así que avanzar recorre una página de arriba abajo. Arriba aparece "Favoritos" cuando hay piezas marcadas. Se pliega a 0 px para dar todo el ancho al escenario.
- **Escenario:** cabecera con miga (grupo › categoría), código, nombre y descripción, y herramientas: dispositivo (escritorio, tablet 834 px, móvil 390 px), fondo del escenario (papel, oscuro, retícula), favorito, reiniciar, copiar enlace, abrir en pestaña y pantalla completa. Debajo, la pieza ocupa todo el alto disponible.
- **Paso a paso inferior:** anterior y siguiente con el nombre de la pieza vecina y la posición dentro de la categoría ("Hero · 4 / 13"). Al final de una categoría continúa con la siguiente; durante una búsqueda recorre solo los resultados.
- **Pantalla completa:** oculta toda la interfaz; una cápsula flotante con anterior, nombre, posición y salir aparece al mover el ratón.

## Motion e interacciones

- Cada cambio de pieza carga el siguiente documento en un segundo `iframe` detrás del actual y hace un fundido de 220 ms cuando está listo, sin pantallazos vacíos. Si tarda más de 180 ms aparece una línea de carga coral; a los 5 s se muestra lo que haya. El documento anterior se descarga para que canvas y 3D dejen de correr.
- El índice plegable, el cambio de dispositivo y el cajón móvil usan `cubic-bezier(0.23, 1, 0.32, 1)` entre 220 y 280 ms. `prefers-reduced-motion` las reduce a casi cero.
- Teclado: `←/→` o `J/K` anterior/siguiente, `F` pantalla completa, `1/2/3` dispositivo, `B` fondo, `S` favorito, `R` reiniciar, `⌘K` o `/` buscar (Enter abre el primer resultado, `↓` entra al índice), `Esc` sale. Las flechas siguen funcionando después de hacer clic dentro de una pieza, salvo cuando uno de sus propios controles tiene el foco.
- Se recuerdan la última pieza vista, categorías abiertas, favoritos, dispositivo, fondo, tema e índice plegado. Cada pieza tiene enlace directo (`#HER-008`).

## Responsive y accesibilidad

Por debajo de 900 px el índice pasa a ser un cajón fijo con velo, la cabecera del escenario apila título y herramientas, y el paso a paso muestra solo flechas y posición. Por debajo de 560 px se ocultan la descripción y las herramientas secundarias. Sin desplazamiento horizontal a 390 px.

La estructura usa `header`, `aside`, `nav`, `main`, `section` y `footer`. Los botones tienen etiquetas en español, `aria-pressed` en dispositivo y favorito, `aria-expanded` en categorías e índice, `aria-current` en la pieza activa y una región viva para la posición y los avisos. Los iconos decorativos están ocultos a lectores de pantalla y el foco visible es de 2 px en coral.

## Límite del sistema

El vault carga cada componente dentro de un `iframe` con su ruta original. Eso conserva aislados HTML, CSS, JavaScript, IDs, variables y eventos de cada pieza y preserva el componente sin transformarlo. El registro (`app/data/components.js`) es la única fuente de navegación: para añadir una pieza se agrega una entrada y la carpeta de la pieza no se toca. Ábrelo con un servidor local (por ejemplo, Live Server en el puerto 5501); desde `file://` las piezas cargan, pero el atajo de flechas dentro de una pieza no funciona.
