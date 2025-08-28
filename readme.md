# Focus — Sitio con Hugo, Tailwind y GitHub Pages

Este repositorio contiene el código fuente del sitio de Focus construido con [Hugo (extended)](https://gohugo.io/) y [TailwindCSS], usando el tema `hugoplate` y desplegado en **GitHub Pages** con dominio personalizado `focusuy.org`.

> Si trabajas en este repo por primera vez, comienza por Requisitos y Desarrollo local.

---

## Requisitos

- Hugo Extended `>= 0.139.2`
- Go `>= 1.23.x` (para resolver Hugo Modules si no se vendoriza)
- Node `>= 18` (CI usa Node 20)

Comprobaciones rápidas:

```bash
hugo version
go version
node -v
```

---

## Estructura del proyecto

- `hugo.toml`: configuración principal (baseURL, theme, timeout, mounts, outputs)
- `config/_default/`
  - `languages.toml`: idioma activo (`content/english`)
  - `params.toml`: parámetros de tema (branding, SEO, scripts, mermaid, búsqueda)
  - `menus.en.toml`: navegación principal y footer
  - `module.toml`: imports de módulos de Hugo
- `content/english/`: contenido (home, páginas, blog, autores, secciones)
- `data/theme.json`: tokens de diseño (colores, tipografías) consumidos por Tailwind
- `data/social.json`: enlaces a redes sociales
- `assets/`: SCSS/JS/imagenes procesadas por Hugo Pipes
  - `assets/scss/custom.scss`: lugar para estilos propios
- `themes/hugoplate/`: tema (layouts/partials)
- `layouts/`: overrides locales del tema
  - `layouts/partials/essentials/head.html`: override para un head más seguro en CI
- `static/CNAME`: dominio personalizado (`focusuy.org`)
- `.github/workflows/main.yml`: pipeline de GitHub Pages

Sugerencia: no versionar `public/` ni `resources/` (son artefactos de build). Ya están listados en `.gitignore`.

---

## Configuración clave

- Dominio/base URL: `hugo.toml`

```toml
baseURL = "https://focusuy.org"
theme = "hugoplate"
timeZone = "America/New_York" # Recomendado: America/Montevideo
timeout = "120s"              # evita timeouts de render en CI
```

- Idioma: `config/_default/languages.toml`

```toml
[en]
languageName = "En"
languageCode = "en-us"
contentDir = "content/english"
```

- Menús: `config/_default/menus.en.toml`
- Parámetros del tema: `config/_default/params.toml`
  - Branding (`logo`, `favicon`), `theme_switcher`, `contact_form_action`, `metadata` (SEO), etc.
  - Mermaid y búsqueda:

```toml
[mermaid]
enable = false

[search]
enable = false
```

> El partial `layouts/partials/essentials/head.html` solo incluye Mermaid e índice de búsqueda si están habilitados, para evitar timeouts.

- Tailwind: `tailwind.config.js` lee `data/theme.json` y usa `hugo_stats.json` como fuente de clases. Para clases dinámicas añade patrones a `safelist`.

---

## Desarrollo local

Instala dependencias y levanta el servidor de desarrollo:

```bash
npm ci        # o `npm install` si no tienes el lockfile
npm run dev   # http://localhost:1313
```

Otros comandos útiles:

```bash
npm run build     # compila a public/
npm run preview   # servidor con flags de producción
npm run format    # Prettier (Go templates + Tailwind)
npm run update-modules  # limpia/actualiza módulos de Hugo
```

> Si necesitas evitar Go en CI, puedes vendorizar módulos: `hugo mod vendor` (y commitear `vendor/`).

---

## Contenido y multilenguaje

- Home: `content/english/_index.md|html`
- Páginas: `content/english/pages/*.md|html` (p.ej. `servicios.md`)
- Blog: `content/english/blog/*`
- Autores y secciones: subcarpetas correspondientes

Ejemplo de shortcode de slider (usado en `servicios.md`):

```go-html-template
{{< slider dir="images/slider" class="w-full" png="true" >}}
```

Para migrar a español como idioma por defecto:

1) `hugo.toml`: `defaultContentLanguage = 'es'`
2) `config/_default/languages.toml`: usar `[es]` y `contentDir = "content/es"`
3) mover/duplicar contenido y crear `menus.es.toml` si aplica

---

## Estilos

- Personaliza colores, tipografías y escala en `data/theme.json` (se propaga a Tailwind).
- Añade estilos propios en `assets/scss/custom.scss` (se empaqueta por el tema).
- Ten en cuenta que Tailwind purga en base a `hugo_stats.json`; si una clase no aparece en plantillas, usa `safelist` en `tailwind.config.js`.

---

## Despliegue (GitHub Pages)

El workflow en `.github/workflows/main.yml`:

1) Instala Node, Go y Hugo con acciones oficiales
2) `npm ci` (con fallback a `npm install` si no hay lockfile)
3) `npm run build` (Hugo genera `public/`)
4) Sube el artefacto y despliega a Pages

Configuración del repositorio:

1) Settings → Pages → Build and deployment → Source: `GitHub Actions`
2) Settings → Actions → Workflow permissions: `Read and write permissions`
3) Dominio personalizado:
   - `static/CNAME` contiene `focusuy.org`
   - En Pages, especifica `focusuy.org` y activa “Enforce HTTPS” cuando aparezca el certificado
   - DNS del apex a GitHub Pages (A y AAAA), y `www` (CNAME) a `dev-focus.github.io`

---

## Datos y redes

- `data/social.json`: añade/edita redes (usa iconos Font Awesome p.ej. `fab fa-instagram`).
- `contact_form_action`: en `config/_default/params.toml` (Formspree u otro servicio).

---

## Overrides de plantillas

- `layouts/partials/essentials/head.html` (override local) reemplaza al del tema para evitar posibles timeouts en CI.
  - Incluye Mermaid solo si `[mermaid].enable = true`.
  - Genera índice de búsqueda solo si `[search].enable = true`.

Para sobreescribir cualquier vista del tema, copia la ruta desde `themes/hugoplate/...` a `layouts/...` y edita allí.

---

## Solución de problemas

- Timeout en `head.html` o “infinite recursion”: usa el override (ya incluido) y mantén Mermaid/búsqueda desactivados si no se usan.
- Enlaces absolutos rotos: valida `baseURL` en `hugo.toml` y el CNAME.
- Fallos con `npm ci`: asegura que `package-lock.json` esté versionado. El workflow ya hace fallback a `npm install`.
- Fallos con módulos de Hugo: verifica Go instalado o vendoriza con `hugo mod vendor`.

---

## Licencia

Este proyecto incluye el tema `hugoplate` (MIT). Revisa `LICENSE` en la raíz del repositorio.
