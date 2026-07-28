import { useState } from "react";
import { ArrowUpRight, Music2 } from "lucide-react";

import {
  formatDuration,
  hasData,
  ranges,
  spotify,
  type Artist,
  type RangeKey,
  type Track,
} from "../data/spotify";

function ArtistCard({ artist, rank }: { artist: Artist; rank: number }) {
  return (
    <a
      href={artist.url}
      target="_blank"
      rel="noreferrer"
      className="group block transition duration-200 hover:-translate-y-1"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-paper-alt dark:bg-white/5">
        {artist.image ? (
          <img
            src={artist.image}
            alt={artist.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-ink-muted dark:text-night-muted">
            <Music2 size={22} />
          </span>
        )}

        <span className="absolute top-2 left-2 rounded-md bg-black/65 px-1.5 py-0.5 font-mono text-[11px] font-medium text-white backdrop-blur-sm">
          {rank}
        </span>
      </div>

      <p className="mt-2 truncate text-sm font-medium" title={artist.name}>
        {artist.name}
      </p>
      {artist.genres.length > 0 && (
        <p className="truncate text-xs text-ink-muted dark:text-night-muted" title={artist.genres.join(", ")}>
          {artist.genres[0]}
        </p>
      )}
    </a>
  );
}

function TrackRow({ track, rank }: { track: Track; rank: number }) {
  return (
    <li>
      <a
        href={track.url}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-paper-alt dark:hover:bg-white/5"
      >
        <span className="w-5 shrink-0 text-right font-mono text-xs text-ink-muted dark:text-night-muted">
          {rank}
        </span>

        {track.image ? (
          <img
            src={track.image}
            alt=""
            loading="lazy"
            className="h-10 w-10 shrink-0 rounded-md object-cover"
          />
        ) : (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-paper-alt dark:bg-white/5">
            <Music2 size={16} />
          </span>
        )}

        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">{track.name}</span>
          <span className="block truncate text-xs text-ink-muted dark:text-night-muted">
            {track.artists.join(", ")}
          </span>
        </span>

        <span className="shrink-0 font-mono text-xs text-ink-muted dark:text-night-muted">
          {formatDuration(track.durationMs)}
        </span>
      </a>
    </li>
  );
}

export default function Music() {
  const [range, setRange] = useState<RangeKey>("short_term");

  const active = ranges.find((r) => r.key === range)!;
  const { artists, tracks } = spotify.ranges[range];

  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Music</h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-muted dark:text-night-muted">
        What I actually listen to while writing code, pulled straight from my Spotify listening
        history. Refreshed automatically every day.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
        <a
          href={spotify.profile.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-white dark:text-black"
        >
          My Spotify profile <ArrowUpRight size={15} />
        </a>

        {spotify.generatedAt && (
          <p className="font-mono text-xs text-ink-muted dark:text-night-muted">
            updated{" "}
            {new Date(spotify.generatedAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        )}
      </div>

      {!hasData ? (
        <p className="mt-10 rounded-2xl border border-dashed border-black/15 p-6 text-sm text-ink-muted dark:border-white/20 dark:text-night-muted">
          No listening data yet — it appears here once the Spotify credentials are configured and
          the site is rebuilt. See the Spotify section of the README.
        </p>
      ) : (
        <>
          <div
            role="tablist"
            aria-label="Time range"
            className="mt-8 inline-flex rounded-lg border border-black/15 p-1 dark:border-white/15"
          >
            {ranges.map((option) => (
              <button
                key={option.key}
                role="tab"
                type="button"
                aria-selected={range === option.key}
                onClick={() => setRange(option.key)}
                className={[
                  "rounded-md px-3 py-1.5 text-sm font-medium transition",
                  range === option.key
                    ? "bg-ink text-paper dark:bg-white dark:text-black"
                    : "text-ink-muted hover:text-ink dark:text-night-muted dark:hover:text-white",
                ].join(" ")}
              >
                {option.label}
              </button>
            ))}
          </div>

          <section className="mt-10">
            <h2 className="border-b-2 border-ink pb-2 text-xl font-semibold dark:border-white">
              Top artists
            </h2>
            <p className="mt-2 text-sm text-ink-muted dark:text-night-muted">
              Most played over {active.caption}.
            </p>

            {artists.length > 0 ? (
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {artists.map((artist, i) => (
                  <ArtistCard key={artist.id} artist={artist} rank={i + 1} />
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-ink-muted dark:text-night-muted">
                Not enough listening history for this period.
              </p>
            )}
          </section>

          <section className="mt-14">
            <h2 className="border-b-2 border-ink pb-2 text-xl font-semibold dark:border-white">
              Top tracks
            </h2>
            <p className="mt-2 text-sm text-ink-muted dark:text-night-muted">
              On repeat over {active.caption}.
            </p>

            {tracks.length > 0 ? (
              <ul className="mt-5 space-y-0.5">
                {tracks.map((track, i) => (
                  <TrackRow key={track.id} track={track} rank={i + 1} />
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-ink-muted dark:text-night-muted">
                Not enough listening history for this period.
              </p>
            )}
          </section>
        </>
      )}
    </div>
  );
}
