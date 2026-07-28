import { useMemo, useState } from "react";
import { Maximize2, Minimize2, Search, X } from "lucide-react";

import { CoffeeMap } from "../components/CoffeeMap";
import { coffeeSpots, countries, flag, googleMapsUrl, type CoffeeSpot } from "../data/coffee";

/** Strips accents so "cafe" matches "café". */
const normalise = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="font-mono text-2xl font-semibold">{value}</p>
      <p className="text-xs text-ink-muted dark:text-night-muted">{label}</p>
    </div>
  );
}

export default function Coffee() {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("All");
  const [focused, setFocused] = useState<CoffeeSpot | null>(null);
  const [expanded, setExpanded] = useState(false);

  const filtered = useMemo(() => {
    const needle = normalise(query.trim());
    return coffeeSpots.filter((spot) => {
      if (country !== "All" && spot.country !== country) return false;
      if (!needle) return true;
      return normalise(`${spot.name} ${spot.city} ${spot.country}`).includes(needle);
    });
  }, [query, country]);

  const cityCount = useMemo(() => new Set(filtered.map((s) => s.city)).size, [filtered]);
  const countryCount = useMemo(() => new Set(filtered.map((s) => s.country)).size, [filtered]);

  // Grouped by city, densest first, so the places I go most often lead the list.
  const grouped = useMemo(() => {
    const byCity = new Map<string, CoffeeSpot[]>();
    for (const spot of filtered) {
      const key = `${spot.city}, ${spot.country}`;
      const bucket = byCity.get(key);
      if (bucket) bucket.push(spot);
      else byCity.set(key, [spot]);
    }
    return [...byCity.entries()].sort(
      (a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]),
    );
  }, [filtered]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Coffee</h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-muted dark:text-night-muted">
        Every specialty coffee spot I've genuinely enjoyed, collected while travelling and in daily
        life. Feel free to reach out if you have recommendations for places I should try.
      </p>

      <div className="mt-8 flex gap-10 border-y border-black/10 py-5 dark:border-white/10">
        <Stat value={filtered.length} label="coffee spots" />
        <Stat value={cityCount} label="cities" />
        <Stat value={countryCount} label="countries" />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-muted dark:text-night-muted"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a café, city or country…"
            aria-label="Search coffee spots"
            className="w-full rounded-lg border border-black/15 bg-transparent py-2 pr-9 pl-9 text-sm transition placeholder:text-ink-muted focus:border-ink focus:outline-none dark:border-white/15 dark:placeholder:text-night-muted dark:focus:border-white"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1 text-ink-muted transition hover:bg-black/5 dark:text-night-muted dark:hover:bg-white/10"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          aria-label="Filter by country"
          className="rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm transition focus:border-ink focus:outline-none dark:border-white/15 dark:focus:border-white [&>option]:bg-paper dark:[&>option]:bg-night"
        >
          <option value="All">All countries</option>
          {countries.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div
        className={[
          "mt-6 grid gap-4",
          expanded ? "grid-cols-1" : "lg:grid-cols-[1fr_320px]",
        ].join(" ")}
      >
        <div className="relative h-[460px] overflow-hidden rounded-2xl border border-black/10 sm:h-[560px] dark:border-white/10">
          <CoffeeMap spots={filtered} focused={focused} />

          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            aria-label={expanded ? "Show the list" : "Expand the map"}
            title={expanded ? "Show the list" : "Expand the map"}
            className="absolute top-3 right-3 z-[1000] hidden rounded-lg border border-black/10 bg-paper/90 p-2 shadow-sm backdrop-blur transition hover:bg-paper lg:block dark:border-white/15 dark:bg-night/90 dark:hover:bg-night"
          >
            {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          {filtered.length === 0 && (
            <div className="pointer-events-none absolute inset-0 z-[900] flex items-center justify-center bg-paper/70 text-sm text-ink-muted backdrop-blur-sm dark:bg-night/70 dark:text-night-muted">
              No spot matches this search.
            </div>
          )}
        </div>

        {!expanded && (
          <aside className="max-h-[560px] overflow-y-auto rounded-2xl border border-black/10 dark:border-white/10">
            {grouped.map(([city, spots]) => (
              <section key={city}>
                <h2 className="sticky top-0 z-10 border-b border-black/10 bg-paper/95 px-4 py-2 text-xs font-semibold tracking-wide uppercase backdrop-blur dark:border-white/10 dark:bg-night/95">
                  {flag(spots[0].countryCode)} {city}
                  <span className="ml-1.5 font-normal text-ink-muted dark:text-night-muted">
                    ({spots.length})
                  </span>
                </h2>

                <ul>
                  {spots.map((spot) => (
                    <li key={spot.id}>
                      <button
                        type="button"
                        onClick={() => setFocused(spot)}
                        className={[
                          "w-full px-4 py-2.5 text-left text-sm transition",
                          focused?.id === spot.id
                            ? "bg-paper-alt font-medium dark:bg-white/10"
                            : "hover:bg-paper-alt dark:hover:bg-white/5",
                        ].join(" ")}
                      >
                        {spot.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            {grouped.length === 0 && (
              <p className="p-4 text-sm text-ink-muted dark:text-night-muted">Nothing here yet.</p>
            )}
          </aside>
        )}
      </div>

      {focused && (
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-black/10 p-4 dark:border-white/10">
          <span className="text-sm font-semibold">{focused.name}</span>
          <span className="text-sm text-ink-muted dark:text-night-muted">
            {flag(focused.countryCode)} {focused.city}, {focused.country}
          </span>
          <a
            href={googleMapsUrl(focused)}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium underline underline-offset-4"
          >
            Open in Maps
          </a>
        </div>
      )}
    </div>
  );
}
