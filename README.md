# Portfolio — Lucas Pereira

Personal portfolio, deployed as a static site at [lucarammel.github.io](https://lucarammel.github.io/).

React + TypeScript + Vite + Tailwind CSS. No backend, no runtime data fetching:
everything ships as static HTML, CSS, JS and JSON.

## Development

```bash
npm install
npm run dev        # dev server with HMR
npm run lint       # typecheck only
npm run build      # production build into dist/
npm run preview    # serve the production build locally
```

## Structure

```
index.html            App shell, meta tags, pre-paint theme script
src/
  App.tsx             Routes (Coffee is lazy-loaded with Leaflet)
  pages/              Home, Projects, CV, Coffee
  components/         Header, Footer, ThemeToggle, RichText, CoffeeMap
  data/               Content as typed modules + coffee.json dataset
public/               Static assets copied verbatim (images, robots, sitemap)
scripts/              Data generation
```

Page content lives in `src/data/*.ts` as plain typed objects — editing a project
or a CV bullet means touching data, not JSX. Those strings support `**bold**`,
rendered by `components/RichText.tsx`.

## Coffee map

`src/data/coffee.json` holds every spot (name, coordinates, city, country). It is
generated from the public Google My Maps list:

```bash
npm run coffee:sync    # python3 scripts/build_coffee_data.py
```

The script pulls the map's KML export and reverse-geocodes each pin through
Nominatim (~1 request/second, so it takes about two minutes). Add places in
Google My Maps, rerun the script, commit the JSON.

The map itself is plain Leaflet with `leaflet.markercluster`, driven imperatively
from `components/CoffeeMap.tsx`. Basemap is CARTO Positron, inverted in CSS for
dark mode.

## Deployment

`.github/workflows/deploy.yml` typechecks, builds and publishes `dist/` to the
`gh-pages` branch on every push to `main`.

`dist/404.html` is a copy of `index.html` (see the Vite plugin in
`vite.config.ts`) so that deep links like `/coffee` resolve to the client router
instead of a GitHub Pages 404.
