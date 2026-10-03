# NEVER — lo que nunca se hace en UI Vault

Leer **antes** de diseñar o construir cualquier pieza (hero, navbar, work, analytics, testimonials, lo que sea). Si una idea choca con esta lista, se descarta aunque "quede bonita". Actualizar este archivo cada vez que el usuario rechace algo.

---

## 1. Nunca copiar piezas existentes

- **Nunca** hacer una pieza "estilo HER-006" o "como CALORI + BC". Las piezas favoritas (HER-003, 004, 005, 006, 007, 013) son **nivel de calidad**, no plantillas.
- **Nunca** entregar la misma estructura con otra foto, otra marca y "unos cuantos arreglitos". Cada pieza nueva necesita una **composición y componentes nuevos**.
- Antes de diseñar, revisar la tabla de estructuras ya usadas (sección 8) y elegir una que **no** esté.

## 2. Nunca gimmicks ilustrativos

Rechazados como "horribles":

- Ilustraciones SVG como protagonista (granos de café dibujados, objetos vectoriales).
- Arte en canvas como protagonista: telares procedurales, mapas de estrellas, partículas decorativas.
- Gráficos, curvas o "instrumentos" dentro de un hero (curva de tueste, paneles tipo bitácora u observatorio).
- Interacciones "ingeniosas" que exigen explicación. La interacción debe sentirse natural: expandir, deslizar, abrir, filtrar, hacer scroll.

**La fotografía real es la protagonista.** Si no hay buena foto, no hay pieza.

## 3. Nunca esta tipografía

- **Nada de serifas decorativas**: Fraunces, Instrument Serif, Newsreader, Cormorant, Playfair, DM Serif, EB Garamond, Libre Baskerville, Lora…
- **Nada de mezclar varias familias** en una pieza. Una sola sans limpia (Geist, Hanken Grotesk, Onest, Inter, Manrope, Instrument Sans, Figtree, DM Sans). La versión Mono solo para etiquetas diminutas.
- **Nada de UI "mono-heavy"** con monoespaciada en párrafos, datos o botones.
- **Nada de display "con personalidad"**: Syne, Unbounded, Bricolage Grotesque, Bebas, Big Shoulders, Oswald, Cinzel.
- **Nada de titulares sueltos o blandos.** Van grandes, peso 500–600, tracking de −0.03 a −0.05em y line-height de 0.9 a 1.

## 4. Nunca estas paletas

- Temáticas o artesanales: marrones "tostado", magentas "cochinilla" dominantes, azul noche con naranja "sodio".
- Más de **un** acento. La base son neutros (≈ #f4f3f0 / #ebeae6 / #111) más un acento usado con moderación.
- Gradientes decorativos. Solo se permite un velo oscuro para que el texto se lea sobre una foto.
- Arcoíris en gráficos. Los gráficos van en neutros más el acento.

## 5. Nunca estos componentes o patrones

- Hero SaaS genérico: título centrado, dos botones y captura de producto.
- Grid de 3 cards con icono, título y texto. Grids repetidos de columnas iguales sección tras sección.
- Testimonios en grid de 3 cards con estrellas y avatar. Estética de "libro de visitas" manuscrito. Avatares ilustrados.
- Bordes de 1px por todas partes y cards innecesarias.
- Badges o pills decorativos que no hacen nada.
- **Píldora de estado con punto que brilla** ("muy genérica", MIRA Library 2026-09-28; antes "Still writing" en la landing, 2026-09-23, "se siente muy IA"). Cuenta cualquiera de estas combinaciones:
  - Cápsula `border-radius: 999px` de 24–32px de alto, con fondo en el acento al ~10% y texto en el mismo acento (look "tinted pill").
  - Punto de 6–8px delante del texto, relleno del acento, con halo `box-shadow: 0 0 0 3px` al ~18%, pulse o no.
  - Texto corto de estado: Live, Active, Online, Beta, New, Pro, Unmetered, "Still writing"…
  - Variante compuesta: cápsula exterior con borde 1px que agrupa la píldora, un divisor vertical de 1px y una acción ("Buy +", "Upgrade").

  **En su lugar:** el estado va como texto plano dentro de la jerarquía (label + valor), sin cápsula tintada ni punto, o con una forma propia de la pieza. Las acciones son botones o enlaces de verdad.
- Glassmorphism (blur sobre blur) como estilo.
- Animaciones gratuitas: pulsos o hints que nunca se detienen, loops sin pausa, movimiento sin propósito.
- Copy genérico: "Elevate your experience", "Unlock", "Seamless", "Revolutionize", "Amazing service!", lorem ipsum.

## 6. Nunca en el proceso

- Lanzar lotes grandes en paralelo (20 piezas de golpe) sin enseñar nada. Se trabaja **una categoría a la vez** y se muestran capturas antes de seguir.
- Registrar una pieza sin haber mirado yo mismo su captura dentro del visor.
- Descripciones del registro de más de ~120 caracteres, porque rompen la cabecera del visor.
- Tocar archivos de otras piezas o el shell del vault (`index.html`, `app/`) al crear una pieza.
- Hacer commit o push sin que el usuario lo pida.
- Imágenes rotas. Verificar cada URL (200) antes de usarla.

## 7. Lo que sí (el listón)

Referencia de calidad: HER-003 KANZO, HER-004 BC Architecture, HER-005 POCO, HER-006 TRVL, HER-007 Travel Slider, HER-013 CALORI, y los nuevos HER-014 Ola Norte, HER-015 Estudio Pampa y HER-016 Barro Lento.

- Fotografía real y grande: a sangre o en paneles con radio de 16–32px.
- Una sans limpia, titulares enormes y apretados, mucho aire.
- UI mínima: nav ligera, botones redondos, contadores discretos.
- Movimiento sobrio: fundidos, desplazamientos, crecimiento de imagen, 600–900ms, `cubic-bezier(0.16, 1, 0.3, 1)`.
- Copy real en español: precios en S/, lugares y horarios concretos.
- Accesible: teclado, foco visible, `prefers-reduced-motion` y 320px sin scroll horizontal.

## 8. Estructuras ya usadas (no repetir)

| Categoría | Estructuras existentes |
|---|---|
| Hero | texto izquierda / foto derecha (TRVL, KANZO) · foto a sangre con slider de cards (Travel Slider) · panel de foto redondeado con titular abajo-izq y widget flotante (BC, CALORI) · foto arriba / texto abajo con cards (POCO) · acordeón vertical de fotos + titular a todo el ancho (Ola Norte) · imagen que crece con el scroll (Estudio Pampa) · collage flotante con profundidad + detalle FLIP (Barro Lento) |
| Navbar | revisar model-001…006 antes de proponer |
| Work | revisar model-001 antes de proponer |
| Testimonials | revisar model-001…007 antes de proponer |
| Analytics | revisar model-001 antes de proponer |

Añadir aquí cada estructura nueva al registrarla.
