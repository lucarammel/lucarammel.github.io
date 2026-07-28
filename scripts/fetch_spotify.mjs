#!/usr/bin/env node
/**
 * Fetches top artists and top tracks from the Spotify Web API into
 * src/data/spotify.json, so the site can stay fully static.
 *
 * Runs at build time (GitHub Actions) and on demand locally via
 * `npm run spotify:sync`. Credentials come from the environment, never from the
 * bundle — the JSON only ever contains public catalogue data.
 *
 * Required env (see scripts/spotify_auth.mjs to mint the refresh token):
 *   SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN
 *
 * Without those it exits 0 and leaves the committed JSON untouched, so builds
 * and CI forks keep working.
 */

import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(ROOT, "src/data/spotify.json");

const RANGES = /** @type {const} */ (["short_term", "medium_term", "long_term"]);
const ARTIST_LIMIT = 12;
const TRACK_LIMIT = 10;

/** Minimal `.env.local` reader so local runs don't need a dotenv dependency. */
async function loadLocalEnv() {
  const file = resolve(ROOT, ".env.local");
  if (!existsSync(file)) return;

  for (const line of (await readFile(file, "utf8")).split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (!process.env[key]) process.env[key] = rawValue.replace(/^["']|["']$/g, "");
  }
}

async function getAccessToken(clientId, clientSecret, refreshToken) {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
  });

  if (!response.ok) {
    throw new Error(`Token refresh failed (${response.status}): ${await response.text()}`);
  }
  return (await response.json()).access_token;
}

async function api(path, token) {
  const response = await fetch(`https://api.spotify.com/v1${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`GET ${path} failed (${response.status}): ${await response.text()}`);
  }
  return response.json();
}

/** Smallest image at least `min` px wide, falling back to the largest available. */
function pickImage(images, min = 300) {
  if (!images?.length) return null;
  const sorted = [...images].sort((a, b) => (a.width ?? 0) - (b.width ?? 0));
  return (sorted.find((image) => (image.width ?? 0) >= min) ?? sorted.at(-1)).url;
}

// Spotify trimmed the artist object for newer apps: `genres`, `popularity` and
// `followers` are no longer returned, so treat every optional field as absent
// rather than assuming the documented shape.
const mapArtist = (artist) => ({
  id: artist.id,
  name: artist.name,
  image: pickImage(artist.images),
  genres: artist.genres?.slice(0, 3) ?? [],
  url: artist.external_urls?.spotify ?? `https://open.spotify.com/artist/${artist.id}`,
});

const mapTrack = (track) => ({
  id: track.id,
  name: track.name,
  artists: (track.artists ?? []).map((artist) => artist.name),
  album: track.album?.name ?? "",
  image: pickImage(track.album?.images, 160),
  durationMs: track.duration_ms ?? 0,
  url: track.external_urls?.spotify ?? `https://open.spotify.com/track/${track.id}`,
});

async function main() {
  await loadLocalEnv();

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    console.warn("· Spotify credentials missing — keeping the committed snapshot.");
    return;
  }

  const token = await getAccessToken(clientId, clientSecret, refreshToken);
  const me = await api("/me", token);

  const ranges = {};
  for (const range of RANGES) {
    const [artists, tracks] = await Promise.all([
      api(`/me/top/artists?time_range=${range}&limit=${ARTIST_LIMIT}`, token),
      api(`/me/top/tracks?time_range=${range}&limit=${TRACK_LIMIT}`, token),
    ]);

    ranges[range] = {
      artists: artists.items.map(mapArtist),
      tracks: tracks.items.map(mapTrack),
    };
    console.log(
      `· ${range}: ${ranges[range].artists.length} artists, ${ranges[range].tracks.length} tracks`,
    );
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    profile: {
      name: me.display_name,
      url: me.external_urls.spotify,
    },
    ranges,
  };

  await writeFile(OUT, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`Wrote ${OUT}`);
}

main().catch((error) => {
  console.error(`Spotify sync failed: ${error.message}`);
  process.exit(1);
});
