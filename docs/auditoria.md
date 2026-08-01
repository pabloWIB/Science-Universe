# Auditoría inicial — Science Universe

Estado del proyecto **antes** de la reorganización. Documento de trabajo interno.

## 1. Qué es el proyecto

Landing page de una sola pantalla para una publicación de divulgación científica ficticia
llamada *Science Universe*. Composición fija a `100vh`: barra de navegación arriba, bloque
de tres tarjetas abajo, vídeo de una esfera iridiscente de fondo, marquesina de texto y un
menú overlay a pantalla completa. Sin backend, sin formularios, sin build automatizado más
allá de la compilación Sass manual.

## 2. Inventario de archivos

### 2.1 HTML

| Archivo | `<title>` | `<h1>` | Propósito real |
|---|---|---|---|
| `index.html` | `3D` | **no existe** | Única página. Hero + 3 tarjetas + marquesina + menú overlay |

No existía `404.html`, `robots.txt` ni `sitemap.xml`.

### 2.2 CSS

| Archivo | Líneas | Cargado | Observaciones |
|---|---|---|---|
| `CSS/normalize.css` | 8 | Sí | No es normalize.css real: es una versión minificada a una línea + un `* { transition: .3s }` global añadido al final |
| `CSS/styles.css` | 1303 | Sí | Compilado por Prepros desde el `.scss`, con prefijos `-webkit-`/`-ms-` para Flexbox 2009 |
| `CSS/styles.scss` | 1239 | No (fuente) | Fuente real de los estilos |
| `CSS/prepros.config` | 706 | No | Configuración de Prepros (app GUI de pago). Ataba el proyecto a esa herramienta |

### 2.3 JavaScript

| Archivo | Líneas | Cargado | Observaciones |
|---|---|---|---|
| `JS/script.js` | 41 | Sí | 6 bloques `$(function(){...})` independientes. Todo el archivo depende de jQuery |
| jQuery 3.6.0 | — | Sí (CDN) | `code.jquery.com`, sin `defer`, sin SRI. ~89 KB solo para `addClass` / `toggleClass` / `click` / `hover` |

### 2.4 Imágenes y vídeo

| Archivo | Formato | Dimensiones | Peso | Uso real |
|---|---|---|---|---|
| `Science-Universe.png` | PNG | 1024×1024 | 933 KB | Favicon. **933 KB descargados en cada visita para un icono de 16 px** |
| `IMG/icon.png` | PNG | 492×492 | 42 KB | Logotipo de wib.digital dentro de la tarjeta «Research». Se muestra a 45 px máximo |
| `IMG/vid1.mp4` | H.264 | 720×720, 6 s, 30 fps | 223 KB | Fondo animado. Insertado **dos veces** (fondo + overlay) |
| `IMG/arrow.svg` | SVG | 40×40 | 202 B | Flecha negra del hero |
| `IMG/arrowW.svg` | SVG | 24×24 | 190 B | Flecha blanca de la tarjeta 1 |
| `IMG/close.svg` | SVG | 60×60 | 898 B | Aspa de cierre del menú overlay |
| `IMG/instagram.svg` | SVG | — | 1.1 KB | Icono de cabecera, enlaza a `instagram.com` |
| `IMG/twitter.svg` | SVG | — | 1.5 KB | Icono de cabecera, enlaza a `twitter.com` |

Ninguna imagen tenía `width`/`height`, `loading` ni `alt` descriptivo.

### 2.5 Dependencias externas

| Dependencia | Origen | Bloquea render |
|---|---|---|
| jQuery 3.6.0 | `code.jquery.com` | Sí (`<script>` sin `defer` en `<head>`) |
| Plus Jakarta Sans | `fonts.googleapis.com` vía `@import` dentro del CSS | Sí (cascada de peticiones: CSS → @import → fuentes) |

Sin `preconnect`. Sin `font-display` controlado desde el HTML.

### 2.6 Archivos basura

No había `.bak`, `node_modules`, `.DS_Store` ni `Thumbs.db`. Tampoco existía `.gitignore`.

## 3. Problemas detectados

### 3.1 Bloqueantes

| # | Problema | Ubicación |
|---|---|---|
| 1 | Clase CSS/JS llamada `pene` (vulgarismo en español) publicada en producción | `styles.scss:710`, `styles.css:771`, `script.js:37` |
| 2 | `<title>3D</title>` — título de trabajo visible en pestaña y en resultados de búsqueda | `index.html:10` |
| 3 | Favicon de 933 KB descargado en cada visita | `index.html:8` |
| 4 | La página **no tiene ningún `<h1>`**. El texto principal es un `<h2>` | `index.html:65` |
| 5 | 6 enlaces del menú overlay con `href=""`, que recargan la página en lugar de navegar | `index.html:189-205` |

### 3.2 Enlaces e imágenes

- **Enlaces rotos:** 6 (`href=""` en el overlay: Our services, Possibilities, Dashboard panel, Formulario, y los dos sociales duplicados del overlay).
- **Enlaces a ninguna parte:** los iconos de Twitter e Instagram apuntaban a la portada de las plataformas, no a cuentas reales. «Dashboard panel», «Our services» y «Possibilities» eran `<div><span>` sin `href`: no navegaban, no recibían foco y no eran alcanzables por teclado.
- **Imágenes rotas:** ninguna. Todas las rutas `src` apuntaban a archivos existentes.
- **CSS/JS referenciados inexistentes:** ninguno.

### 3.3 CSS

- **Selectores de hasta 10 niveles** encadenando `>:nth-child(n)`. Ejemplo real:
  `.content .intContent main nav > :nth-child(2) > div > div .cajaNum3 > :nth-child(1) > :nth-child(1) > :nth-child(2) > div img`.
  Cualquier `<div>` insertado o movido rompía el diseño en silencio.
- **`* { transition: .3s }`** en `normalize.css`: aplica una transición a *todas* las propiedades de *todos* los elementos del documento.
- **CSS muerto:** la clase `.sectionBackground` se referenciaba en `script.js` pero no existía ni en el HTML ni en el CSS. La regla `.cicle` del HTML (línea 130) estaba mal escrita y nunca se estilaba.
- **Sintaxis inválida:** `text-decoration: 2px solid underline` (orden incorrecto, la regla se descartaba), `background-color: none` en `::selection` (valor inválido), `rgb(rgb(18,87,140), .8)` en el Sass.
- **Sin variables:** los colores estaban como variables Sass, pero espaciados, radios, tamaños y duraciones estaban duplicados literal a literal en 1300 líneas. Valores fuera de escala: `17.5px`, `22.5px`, `4.5px`, `2.5px`, `16.5px`, `12.5px`, `0.75px`.
- **`all: unset`** aplicado a `h2`, `h3`, `p` y `a`, lo que también elimina el indicador de foco de los enlaces.
- **Duplicación:** el bloque `@media (max-width: 500px)` de `nav` aparecía dos veces con contenido casi idéntico. Existían dos bloques `@media (max-width: 500px)` separados por el bloque de `body`.
- **Media queries `max-width`** en un proyecto sin estilos base móviles: desktop-first con tres saltos (500/800/resto).

### 3.4 Accesibilidad

- Sin `<h1>`; salto de jerarquía `h2 → h3` sin nivel intermedio coherente.
- `<nav>` usado para envolver las tres tarjetas de contenido, que no son navegación.
- `<footer>` anidado dentro de `<main>`.
- Menú overlay: se abría y cerraba con `.Menu` pero no cerraba con `Escape`, no cerraba al pulsar un enlace, no gestionaba el foco y no exponía `aria-expanded` ni `aria-controls`. El aspa de cierre era un `<div>`, no un `<button>`.
- `alt` genéricos: `alt="Arrow"`, `alt="Icon"`, `alt="Burger"` (en el aspa de cerrar), `alt="twitter"`.
- Contraste: el `<h1>` del hero (blanco) sobre `linear-gradient(rgba(7,35,80,.5) → rgba(203,203,203,.5))` encima de un vídeo claro da **4.48:1** en su punto más favorable y baja según avanza el degradado. Por debajo del mínimo de 4.5:1.
- Sin `prefers-reduced-motion`: marquesina infinita, vídeo en bucle y animaciones de entrada sin alternativa.
- Áreas táctiles del menú overlay y del aspa de cierre por debajo de 44×44 px.

### 3.5 Contenido de relleno heredado

| Texto | Problema |
|---|---|
| `21.8M+` | Cifra sin unidad, sin referente y sin fuente. Relleno de plantilla |
| `Communty` | Errata de *Community* |
| `SCIENTIST MAKE OBSERVATIONS` | Concordancia incorrecta (*scientists make*) |
| `SCIENTIS ANALYSE` | Errata de *scientists* |
| `· Formulario` | Etiqueta en español dentro de una web en inglés, apuntando a `href=""` |
| `Our services`, `Possibilities`, `Dashboard panel` | Secciones que no existen en el sitio |

### 3.6 Rendimiento

- Peso de primera carga: **≈1,29 MB** (favicon 933 KB + vídeo 223 KB + jQuery 89 KB + CSS 26 KB + icon.png 42 KB).
- 2 elementos `<video>` decodificando el mismo archivo simultáneamente.
- `<script>` de jQuery en `<head>` sin `defer`.
- Fuente cargada por `@import` dentro del CSS: cadena de peticiones en serie.
- Sin `playsinline` en los vídeos: en iOS el vídeo abre a pantalla completa en lugar de reproducirse en línea.

## 4. Credenciales

Revisado `index.html`, `script.js`, `styles.css`, `styles.scss` y `prepros.config`.
**No se encontraron claves de API, tokens ni credenciales.** El bloque `uploader` de
`prepros.config` tenía `remotePath` y `history` vacíos.

## 5. Resumen

1. Es una landing de una pantalla para una publicación científica ficticia, con vídeo de fondo, tres tarjetas y menú overlay. Buen trabajo visual, mala base técnica.
2. El estado era **funcional pero no publicable**: cargaba y se veía bien, pero arrastraba errores que se ven desde fuera.
3. Lo más grave: una clase CSS llamada `pene` desplegada en producción, y un favicon de 933 KB que multiplica por seis el peso real de la página.
4. Lo más grave a nivel estructural: 1300 líneas de CSS colgando de cadenas `>:nth-child()` de hasta 10 niveles, imposibles de mantener sin romper el diseño.
5. Lo más grave a nivel de contenido: sin `<h1>`, título `3D`, y seis enlaces que recargan la página en vez de navegar.
