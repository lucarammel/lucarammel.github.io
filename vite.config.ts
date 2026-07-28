import { copyFileSync } from "node:fs";
import { resolve } from "node:path";

import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * GitHub Pages serves 404.html for unknown paths. Shipping a copy of the app
 * shell there makes deep links like /coffee resolve to the client router
 * instead of a "page not found".
 */
function githubPagesSpaFallback(): Plugin {
  return {
    name: "gh-pages-spa-fallback",
    apply: "build",
    closeBundle() {
      const dist = resolve(import.meta.dirname, "dist");
      copyFileSync(resolve(dist, "index.html"), resolve(dist, "404.html"));
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), githubPagesSpaFallback()],
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        // Leaflet only matters on /coffee, keep it out of the initial bundle.
        manualChunks: {
          map: ["leaflet", "leaflet.markercluster"],
        },
      },
    },
  },
});
