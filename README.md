# Portfolio

Personal portfolio. Plain HTML, CSS and JavaScript: no framework, no build step.
Live at `https://kapetanovic.net` (repo `Imperator661.github.io`, GitHub Pages).

```
index.html          English page (the only language for now)
css/style.css       all styles, light/dark tokens at the top
js/main.js          theme toggle, mobile menu, terminal animation, copy email
assets/             favicon and images (dd-header.webp = header strip of dnevnikdijaspore.de only;
                    no press photos from the site, they are not ours to republish)
.nojekyll           tells GitHub Pages to serve files as they are (no Jekyll)
```

Preview locally: open `index.html` in a browser.

## Placeholders still in the page

None left.

## Page layout

Hero, About, "What I do" (three general blocks: Automation, Websites, IT & systems), Contact.
Each block has a `.work-media` box with a drawn visual. To use a photo instead, replace the box's
contents with `<img src="assets/<name>.webp" alt="..." width=".." height=".." loading="lazy">`
(webp, about 1000 px wide, under 200 KB). Expand a block into its own page later if needed.

## Later

- `hr/index.html` and `de/index.html`: translated copies, then switch the HR/DE buttons in the
  header from `<span class="is-soon">` to links.
