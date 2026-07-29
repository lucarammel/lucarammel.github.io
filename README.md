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
  pages/              Home, Projects, CV, Coffee, Music
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
Nominatim (~1 request/second, so it takes about two minutes). It also runs in CI
on every deploy plus a daily cron, same as the Spotify sync, so adding a place in
Google My Maps is enough — no local run or commit required. Use the command
above only to preview changes locally before they land in CI.

The map itself is plain Leaflet with `leaflet.markercluster`, driven imperatively
from `components/CoffeeMap.tsx`. Basemap is CARTO Positron, inverted in CSS for
dark mode.

## Spotify (Music page)

Top artists and top tracks come from the Spotify Web API, fetched **at build
time** into `src/data/spotify.json`. Those endpoints need a user token, which
must never ship in a static bundle — so the credentials live only in GitHub
Secrets and in a local, git-ignored `.env.local`.

One-time setup:

1. Create an app at <https://developer.spotify.com/dashboard>.
2. Add exactly this redirect URI: `http://127.0.0.1:8888/callback`
   (Spotify rejects `localhost` for new apps.)
3. Mint a refresh token:

   ```bash
   SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy npm run spotify:auth
   ```

   Open the printed URL, approve, and copy the token it prints back.

4. Put all three values in `.env.local` (local use) **and** in the repository
   secrets under Settings → Secrets and variables → Actions:

   ```
   SPOTIFY_CLIENT_ID=...
   SPOTIFY_CLIENT_SECRET=...
   SPOTIFY_REFRESH_TOKEN=...
   ```

Then `npm run spotify:sync` refreshes the JSON locally. CI runs the same script
on every deploy and on a daily cron, so the page stays current without commits.

Only public catalogue data (names, cover URLs, links) is written to the JSON. The
refresh token does not expire; re-run `spotify:auth` only if you revoke access or
change scopes. Without credentials the script is a no-op and the page renders an
explicit empty state.

## Deployment

`.github/workflows/deploy.yml` typechecks, builds and publishes `dist/` to the
`gh-pages` branch on every push to `main`.

`dist/404.html` is a copy of `index.html` (see the Vite plugin in
`vite.config.ts`) so that deep links like `/coffee` resolve to the client router
instead of a GitHub Pages 404.
