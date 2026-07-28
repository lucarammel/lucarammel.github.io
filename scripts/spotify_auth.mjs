#!/usr/bin/env node
/**
 * One-shot helper to mint a Spotify refresh token for `fetch_spotify.mjs`.
 *
 * Setup, once:
 *   1. Create an app at https://developer.spotify.com/dashboard
 *   2. Add exactly this redirect URI: http://127.0.0.1:8888/callback
 *      (Spotify rejects "localhost" for new apps — it must be the IP literal.)
 *   3. SPOTIFY_CLIENT_ID=... SPOTIFY_CLIENT_SECRET=... node scripts/spotify_auth.mjs
 *   4. Open the printed URL, approve, then copy the refresh token it prints into
 *      .env.local and into your GitHub repository secrets.
 *
 * The refresh token does not expire; you only need to run this again if you
 * revoke access or change scopes.
 */

import { createServer } from "node:http";

const PORT = 8888;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = "user-top-read";

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error("Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET first.");
  process.exit(1);
}

const state = Math.random().toString(36).slice(2);

const authUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
  response_type: "code",
  client_id: clientId,
  scope: SCOPES,
  redirect_uri: REDIRECT_URI,
  state,
})}`;

async function exchangeCode(code) {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  if (!response.ok) throw new Error(`${response.status}: ${await response.text()}`);
  return response.json();
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url, REDIRECT_URI);
  if (url.pathname !== "/callback") {
    response.writeHead(404).end();
    return;
  }

  const error = url.searchParams.get("error");
  const code = url.searchParams.get("code");

  if (error || url.searchParams.get("state") !== state || !code) {
    response.writeHead(400, { "Content-Type": "text/plain" });
    response.end(`Authorisation failed: ${error ?? "state mismatch or missing code"}`);
    server.close();
    process.exitCode = 1;
    return;
  }

  try {
    const tokens = await exchangeCode(code);
    response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Done — the refresh token is in your terminal. You can close this tab.");

    console.log("\nAdd this to .env.local and to your GitHub repository secrets:\n");
    console.log(`SPOTIFY_REFRESH_TOKEN=${tokens.refresh_token}\n`);
  } catch (cause) {
    response.writeHead(500, { "Content-Type": "text/plain" });
    response.end(`Token exchange failed: ${cause.message}`);
    console.error(`Token exchange failed: ${cause.message}`);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log("Open this URL in your browser to authorise:\n");
  console.log(`${authUrl}\n`);
  console.log(`Waiting for the redirect on ${REDIRECT_URI} …`);
});
