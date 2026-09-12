# personal

Source for my personal site. Plain HTML, CSS and vanilla JavaScript — no build
step, no dependencies to install, nothing to compile. GitHub Pages serves the
files exactly as they are in this repo.

## Layout

```
index.html          home — bio + timeline
blog/index.html     post list
blog/post.html      single post renderer (reads ?slug= from the URL)
posts/*.md          the posts themselves
posts/manifest.json list of post filenames
css/style.css
js/i18n.js          English/Persian strings + the language toggle
js/render-md.js     frontmatter parser + markdown rendering
js/blog-list.js     builds the post list
```

## Adding a post

1. Create `posts/002-something.md` with frontmatter at the top:

   ```
   ---
   title: "The title"
   date: 2026-10-01
   lang: en
   ---

   Body in markdown.
   ```

   `lang` is `en` or `fa`. A Persian post renders right-to-left on its own,
   whatever language the interface is set to.

2. Add the filename to `posts/manifest.json` — one line:

   ```json
   ["002-something.md", "001-who-i-am.md"]
   ```

   Order in the file doesn't matter; the list is sorted by date, newest first.

3. Commit and push. That's the whole process.

A Persian translation of an existing post is just another file, e.g.
`posts/001-who-i-am-fa.md` with `lang: fa`.

## Language toggle

English is the default. The toggle in the header switches to Persian and the
choice is kept in `localStorage` under the key `lang`.

The English text lives in the HTML, so the pages still read correctly with
JavaScript disabled. `js/i18n.js` holds the Persian translations, keyed by the
`data-i18n` attributes in the HTML — to edit Persian text, edit that file; to
edit English text, edit the HTML.

## Fonts

Latin text uses a system serif stack (Charter / Sitka / Cambria / Georgia), so
nothing is downloaded for it. Persian uses
[Vazirmatn](https://github.com/rastikerdar/vazirmatn) from jsDelivr, falling
back to Tahoma / Iranian Sans / system sans if the CDN is unreachable.
`marked` is loaded from jsDelivr on the post page only; if it fails to load,
the post is shown as plain text rather than blank.

## Running it locally

Any static file server works — `fetch()` needs HTTP, so opening `index.html`
straight off the filesystem will not load posts:

```
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Deploying

Settings → Pages → Source: "Deploy from a branch", branch `main`, folder
`/ (root)`. The `.nojekyll` file tells Pages to serve the files as-is instead
of running them through Jekyll.

A custom domain can be added later by putting it in a `CNAME` file at the root.
