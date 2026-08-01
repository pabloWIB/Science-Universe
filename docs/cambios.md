# Registro de cambios

Reorganización completa del proyecto. El estado de partida está documentado en
[`auditoria.md`](auditoria.md). Todos los cambios son locales; no se ejecutó ningún
comando de git.

---

## Fase 1 — Auditoría

- Inventario completo de archivos, dependencias, enlaces e imágenes en `docs/auditoria.md`.
- Revisión de credenciales en los cinco archivos de código: **ninguna encontrada**.

## Fase 2 — Estructura

Reorganización de `CSS/` + `JS/` + `IMG/` a `assets/`:

| Antes | Ahora |
|---|---|
| `CSS/normalize.css` + `CSS/styles.css` | `assets/css/base.css`, `assets/css/layout.css`, `assets/css/components.css` |
| `CSS/styles.scss` | eliminado (ver fase 6) |
| `CSS/prepros.config` | eliminado |
| `JS/script.js` | `assets/js/main.js` |
| `IMG/vid1.mp4` | `assets/video/science-universe-loop.mp4` |
| `IMG/icon.png` | `assets/img/content/wib-mark.png` |
| `Science-Universe.png` | origen de `assets/img/logo/{favicon-32,apple-touch-icon}.png` y `og-image.jpg` |
| `IMG/arrow.svg`, `IMG/arrowW.svg`, `IMG/close.svg` | inlineados como SVG en el HTML |
| `IMG/twitter.svg`, `IMG/instagram.svg` | eliminados (ver fase 5) |

Nombres normalizados a minúsculas con guiones. Todas las rutas del HTML actualizadas y
verificadas: cero referencias rotas.

**Decisión — sin carpeta `assets/js/modules/`.** El JavaScript son ~110 líneas con dos
responsabilidades. Partirlo en módulos ES obligaría a `type="module"`, que el navegador
bloquea por CORS al abrir `index.html` con `file://`. Un único punto de entrada con dos
funciones nombradas cumple el objetivo sin romper la apertura directa.

**Decisión — sin `assets/fonts/`.** El proyecto no tiene archivos de fuente propios; la
tipografía viene de Google Fonts. No se crean carpetas vacías.

## Fase 3 — Higiene

- Eliminados `CSS/`, `JS/`, `IMG/` y `Science-Universe.png` tras confirmar por `grep` que
  ningún archivo los referencia. Todos estaban versionados en git, así que son recuperables.
- Eliminado `CSS/prepros.config` (706 líneas): ataba el proyecto a Prepros, una app GUI de pago.
- Eliminado `* { transition: .3s }`, que aplicaba una transición a todos los elementos del DOM.
- Eliminado el manejador de `.sectionBackground` en JS: esa clase no existía en ningún sitio.
- Creado `.gitignore` acorde al stack real (sitio estático, sin Node) más las claves de Prepros.
- Formato normalizado: indentación de 2 espacios, comillas dobles en HTML y JS, punto y coma,
  salto de línea final en todos los archivos.

## Fase 4 — Imágenes y vídeo

| Asset | Antes | Ahora |
|---|---|---|
| Favicon | `Science-Universe.png`, 1024×1024, **933 KB** | `favicon-32.png`, 32×32, **863 B** |
| Icono táctil | no existía | `apple-touch-icon.png`, 180×180, 7 KB |
| Open Graph | no existía | `og-image.jpg`, 1200×630, 37 KB |
| Marca WIB | `icon.png`, 492×492, 42 KB (se muestra a 40 px) | `wib-mark.png`, 128×128, **2,8 KB** |
| Póster del vídeo | no existía | primer fotograma extraído con ffmpeg, 16 KB |

- La `og-image` se compone del logotipo real del proyecto sobre el azul de marca `#072350`.
  No se ha creado ninguna imagen con contenido inventado.
- `width` y `height` explícitos en la única `<img>` de la página, más `loading="lazy"` y
  `decoding="async"` (está bajo el fold).
- `alt` reales: `alt="wib.digital logo"` en lugar de `alt="Icon"`. Las flechas y el aspa,
  ahora SVG inline, van con `aria-hidden` porque son decorativas.
- No se ha añadido ninguna imagen que no existiera ya en el proyecto.

## Fase 5 — HTML, SEO y accesibilidad

### Estructura semántica

- **Añadido el `<h1>`**, que no existía: «Science Universe». Jerarquía resultante
  `h1 → h2 (Explain…) → h2 (Analysis) → h2 (Community)`, sin saltos.
- El `<nav>` que envolvía las tres tarjetas pasa a ser un `<div class="pillars">` con tres
  `<article>`. `<nav>` queda solo para navegación real.
- El `<footer>` sale de dentro de `<main>` y pasa a ser hermano suyo.
- Los ítems del menú, que eran `<div><span>`, son ahora `<a>` dentro de `<ul>`: reciben foco,
  navegan y se anuncian como enlaces.
- Añadido enlace «Skip to content».

### `<head>`

- `<title>3D</title>` → `Science Universe — How science explains natural phenomena` (57 caracteres).
- `<meta name="description">` nueva, 157 caracteres.
- Open Graph completo (`og:type`, `og:title`, `og:description`, `og:url`, `og:image` con
  dimensiones y `og:image:alt`) más `twitter:card`.
- `<link rel="canonical">` y `theme-color`.

**Decisión — dominio.** `DOMINIO_PUBLICACION` venía vacío en la configuración, pero el README
del propio repositorio ya declaraba `scienceuniverse.wib.digital` como URL de producción. Se
ha usado ese valor, que es un dato real del proyecto, no inventado, para `canonical`, `og:url`,
`og:image`, `robots.txt` y `sitemap.xml`. Si el dominio cambia, el README indica los cuatro
sitios donde tocarlo.

### Accesibilidad

- Menú overlay: `aria-expanded` y `aria-controls` en el disparador, foco al botón de cierre al
  abrir y devuelto al disparador al cerrar, cierre con `Escape`, cierre al pulsar un enlace, e
  `inert` sobre el fondo mientras está abierto (el contenido de detrás sale del orden de tabulación).
- El aspa de cierre pasa de `<div>` a `<button>` con `aria-label`.
- Foco visible en todos los elementos interactivos (`:focus-visible`, contorno de 2 px).
- Áreas táctiles: todos los enlaces del menú, los chips de cabecera, el botón de cierre y el
  enlace de salto miden **44×44 px** o más. Los dos enlaces del crédito del pie quedan por debajo
  porque van dentro de una frase, caso que WCAG 2.5.8 exime expresamente.
- Contraste verificado midiendo píxeles del render, no valores teóricos. El peor punto de la
  barra del hero pasó de **4,46:1** a **6,02:1** reforzando el degradado de `rgba(7,35,80,.45)`
  a `rgba(7,35,80,.6)` en su extremo derecho. El resto del sitio va de 6,49:1 a 21:1.
- Añadido un velo (`rgba(204,204,204,.6)`) entre el vídeo y los enlaces del menú overlay, que
  antes quedaban sobre un fondo en movimiento de luminancia impredecible.
- Bloque `prefers-reduced-motion`: se anulan las animaciones, se detiene la marquesina y el JS
  pausa el vídeo.

### Textos de relleno eliminados

| Antes | Ahora |
|---|---|
| `Communty` | `Community` |
| `SCIENTIST MAKE OBSERVATIONS` | `SCIENTISTS MAKE OBSERVATIONS` |
| `SCIENTIS ANALYSE` | `SCIENTISTS ANALYSE` |
| `THE FORMULATIONS OF THEORIES` | `THE FORMULATION OF THEORIES` |
| `21.8M+` | eliminado |
| `· Formulario` | eliminado |
| `Home page`, `Our services`, `Possibilities`, `Dashboard panel` | sustituidos por `Overview`, `Analysis`, `Community` |

### `robots.txt` y `sitemap.xml`

Creados con la URL real del sitio. Una sola entrada: el sitio tiene una sola página indexable.
`404.html` lleva `noindex` y no aparece en el sitemap.

## Fase 6 — CSS y sistema de diseño

**Decisión — se abandona Sass.** El `.scss` era la fuente real, pero se compilaba con Prepros y
el CSS resultante colgaba de cadenas `>:nth-child()` de hasta diez niveles. Las dos cosas que
Sass aportaba aquí eran variables y anidamiento; las custom properties cubren lo primero y una
nomenclatura por clases hace innecesario lo segundo. El resultado es CSS que se edita
directamente, sin paso de compilación y sin herramienta de pago. El `.scss` sigue en el
historial de git si hiciera falta consultarlo.

- **Tokens en `:root`**: 8 colores, escala de espaciado 4/8/16/24/32/40/48/64/96, 5 radios,
  escala tipográfica de 8 pasos, 4 pesos, 3 duraciones y una curva de easing.
- Valores fuera de escala corregidos: `17.5px`, `22.5px`, `4.5px`, `2.5px`, `16.5px`, `12.5px`
  y `0.75px` sustituidos por pasos de la escala.
- **Selectores**: ninguno pasa de 3 niveles. Las cadenas `nth-child` desaparecen salvo dos usos
  legítimos (ocultar enlaces secundarios en móvil y escalonar los retardos del menú).
- Sintaxis inválida corregida: `text-decoration: 2px solid underline` y `background-color: none`.
- Reemplazado `all: unset` en títulos, párrafos y enlaces por un reset acotado, que además
  devuelve el indicador de foco a los enlaces.
- Eliminados los prefijos `-webkit-box` / `-ms-flexbox` de Flexbox 2009 que generaba
  Autoprefixer. Se conserva `-webkit-backdrop-filter`, que Safari sigue necesitando.
- Eliminada la duplicación del bloque `@media (max-width: 500px)` de `nav`, que aparecía dos veces.
- Orden dentro de cada archivo: tokens → reset → base → utilidades → layout → componentes →
  media queries.
- **1.303 líneas de CSS compilado → 3 archivos, 21,1 KB en total**, sin reglas muertas.

**Decisión — tres archivos CSS y no uno.** La fase 10 pide unir CSS fragmentado «sin motivo».
Aquí el motivo es la separación por responsabilidad que pide la fase 2, y las tres peticiones se
sirven en paralelo desde el mismo origen con el HTML ya en caché del parser.

## Fase 7 — Responsive

- Invertido a **mobile-first**: los estilos base son los del móvil y los `@media` usan `min-width`.
- Breakpoints normalizados a **480 / 768 / 1024** (el diseño no necesita nada a 1440; la
  composición es de ancho completo por decisión del diseño original, con tope en 3000 px).
- Las tres tarjetas pasan de tres bloques de flex anidados a **una sola rejilla** que cambia de
  plantilla: `1fr` → `1fr 1fr` (con la tarjeta de enunciado a todo el ancho) → `2fr 1fr 1fr`.
- El clip a `100vh` con `overflow: hidden` en `body` desaparece: la página usa `min-height: 100svh`
  y `main { margin-top: auto }`, que fija el bloque de contenido abajo cuando sobra espacio y lo
  deja fluir cuando no. Antes, en pantallas bajas el contenido quedaba cortado e inalcanzable.
- Verificado sin scroll horizontal en 360, 480, 768, 1024 y 1440 px
  (`document.documentElement.scrollWidth === window.innerWidth` en los cinco).
- Menú móvil: abre, cierra, bloquea el scroll de fondo, se cierra al pulsar un enlace y con `Escape`.

## Fase 8 — UX / UI

- **Elementos interactivos falsos convertidos en lo que son.** El badge de flecha de la tarjeta
  de enunciado no llevaba a ninguna parte: pierde el `cursor: pointer` y el efecto de subrayado
  al hover, y pasa a ser decoración con `aria-hidden`. La flecha del hero sí se convierte en un
  enlace real a `#pillars`.
- Estados completos en cada elemento interactivo: `default`, `:hover`, `:focus-visible`, `:active`.
  Transiciones de 150–250 ms.
- Espaciado consistente entre secciones, tomado de la escala.
- Ancho de línea limitado a `68ch` en párrafos.
- El sitio no tiene formularios, así que no hay ninguno que finja funcionar.
- Sin gradientes decorativos nuevos, sin sombras y sin animaciones añadidas.

## Fase 9 — JavaScript

- **jQuery eliminado.** Se usaba solo para `addClass`, `toggleClass`, `click` y `hover`: 89 KB
  de dependencia externa para cuatro llamadas que el DOM nativo ya resuelve.
- Seis bloques `$(function(){})` sueltos → un IIFE con `"use strict"` y dos funciones nombradas.
- Sin variables globales, sin `var`, todo `const`.
- Delegación de eventos en el contenedor del menú para cerrar al pulsar cualquier enlace.
- Comprobación de existencia antes de operar sobre cualquier elemento.
- Eliminados los `setTimeout` que orquestaban la animación de entrada: ahora son animaciones CSS
  con `animation-delay`, así que la página llega a su estado final aunque el JS no cargue.
- La secuencia de entrada se acorta de **2.700 ms a 900 ms**. Los 2,7 s originales dejaban la
  pantalla vacía durante casi tres segundos.
- Verificado: cero errores y cero avisos en consola, sobre `http://` y sobre `file://`.

## Fase 10 — Rendimiento

| Métrica | Antes | Ahora |
|---|---|---|
| Peso de primera carga | ≈1,29 MB | **277 KB** |
| Peticiones bloqueantes de render | 3 (jQuery sin `defer`, CSS, `@import` de fuentes) | 3 CSS, no bloqueantes en la práctica |
| Dependencias externas de JS | jQuery 3.6.0 | ninguna |
| Subrecursos locales | 12 | **8** |
| Subrecursos externos | 3 (jQuery + CSS de fuentes + fuente) | 2 (CSS de fuentes + fuente) |

- La fuente pasa de `@import` dentro del CSS (cadena en serie: CSS → import → fuente) a
  `<link>` con `preconnect` a los dos orígenes de Google Fonts y `display=swap`.
- Se cargan 4 pesos concretos en lugar del rango variable completo `200..800` en redonda y cursiva.
- `<script defer>`.
- El vídeo del overlay pasa a `preload="none"` y solo se reproduce al abrir el menú; antes los
  dos elementos `<video>` decodificaban en paralelo desde el primer instante.
- Añadido `playsinline` a ambos vídeos: en iOS, sin él, el vídeo abre a pantalla completa.
- Tres flechas y un aspa SVG inlineadas: 4 peticiones HTTP menos y los iconos heredan `currentColor`.

## Fase 11 — QA

Verificado con Chrome sin interfaz sobre el sitio servido y también abierto con `file://`:

- Enlaces del menú y del pie: 11 en total, todos con destino existente. Cero `href=""` y cero `#`.
- Los 5 anclas internas (`#main`, `#hero`, `#analysis`, `#community`, `#pillars`) resuelven a
  elementos que existen.
- La única `<img>` carga (`naturalWidth > 0`), con `alt`, `width` y `height`.
- Los 3 `<link>` y el `<script>` responden 200. Cero peticiones fallidas.
- Cero errores y cero avisos de consola en `index.html` y en `404.html`.
- Sin scroll horizontal en 360 / 480 / 768 / 1024 / 1440 px.
- Menú: abre, enfoca el cierre, cierra con `Escape` devolviendo el foco, cierra al pulsar enlace.
- Orden de tabulación correcto y contorno de foco visible en los 8 elementos interactivos.
- Sin «Lorem ipsum», «TODO» ni texto de plantilla (comprobado por expresión regular sobre el
  texto renderizado).
- `404.html` existe, se estila igual que el sitio y enlaza al inicio.
- `title` de 57 caracteres y `description` de 157, únicos por página.
- Sin credenciales en el código.

## Fase 12 — Documentación

- `README.md` actualizado en lo que cambió la reorganización: tabla de stack sin Sass ni jQuery,
  comando de arranque, árbol de estructura, sección de despliegue con los cuatro puntos donde
  vive el dominio. Eliminada la sección «Known issues», cuyos dos puntos (el título `3D` y la
  errata `Communty`) están corregidos, y sustituida por limitaciones reales.
- Creados `docs/auditoria.md` y `docs/cambios.md`.

## Fase 13 — Deploy

- Verificado abriendo `index.html` directamente (`file://`) y con servidor local: CSS aplicado,
  JS ejecutándose, menú funcional, vídeo cargado, cero errores en ambos casos.
- Sin rutas absolutas de máquina local en ningún archivo.
- Rutas internas relativas y en minúsculas en `index.html`. **Excepción deliberada:** `404.html`
  usa rutas absolutas de raíz (`/assets/...`), porque el servidor la entrega ante cualquier URL,
  incluidas rutas anidadas, donde una ruta relativa apuntaría a un directorio inexistente.
- **No se creó configuración de hosting**: `DESTINO_DEPLOY` venía vacío. Vercel sirve `404.html`
  para rutas desconocidas en proyectos estáticos sin necesidad de `vercel.json`.
- No se ejecutó ningún despliegue.

## Fase 14 — Promoción

- Badge de Fiverr bajo el título del README y sección «Hire me» al final.
- Firma discreta dentro del `<footer>` existente del sitio, integrada con el CSS del proyecto.
  No se creó un segundo footer.
- Datos estructurados `schema.org/Person` en el `<head>` de `index.html`. Sin cifras de reseñas,
  valoraciones ni nivel de vendedor.
