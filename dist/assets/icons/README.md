# Animated Icon Explorer

Versión ampliada del explorador de iconos del repositorio.

## Estado

- 289 iconos curados.
- Phosphor Icons vía Iconify.
- Motion semántico por icono.
- Hover animation.
- Búsqueda por nombre, categoría, keyword y tipo de movimiento.
- Favoritos persistentes.
- Filtros por categoría.
- Selector de tamaño, peso y motion.
- Modo sin animaciones.
- Respeta `prefers-reduced-motion`.
- Panel de detalle.
- Copia de nombre, Iconify ID, HTML y CSS de motion.

## Motion semántico

La animación intenta reforzar el significado:

- `refresh`, `repeat`, `gear` → rotación.
- `bell`, `warning` → shake/ring.
- `upload` → rise.
- `download` → drop.
- `send` → fly.
- `analytics` → pulse.
- `cloud`, `moon` → float.
- `check`, `play` → pop.

No se recomienda mantener animaciones infinitas en navegación principal.

## Ejecutar

```bash
python3 -m http.server 8080
```

Luego:

```text
http://localhost:8080
```

## Archivos

```text
icon-explorer-animated/
├── index.html
├── styles.css
├── app.js
├── icon-catalog.json
└── README.md
```

## Integración en proyectos

Para producción, instala los iconos como dependencia:

```bash
npm install @phosphor-icons/react
```

o:

```bash
npm install @iconify/react
```

El JSON puede conservarse como catálogo central del repositorio.
