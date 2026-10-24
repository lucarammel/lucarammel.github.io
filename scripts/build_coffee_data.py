#!/usr/bin/env python3
"""Generator for src/data/coffee.json.

Pulls the public Google My Maps KML export, then reverse-geocodes *new* spots
via Nominatim to attach a city / country. Locations already resolved in the
existing JSON are reused (cache keyed on coordinates), so reruns only hit
Nominatim for spots that were added since the last run.

Safety guarantees (the script is meant to run unattended in CI):
  - the JSON file is never touched if the KML fetch fails or looks empty;
  - the JSON file is never touched if too many geocoding lookups fail;
  - the file is only rewritten when its content actually changes (atomic write).

Usage:
    python3 scripts/build_coffee_data.py            # regenerate
    python3 scripts/build_coffee_data.py --check    # exit 1 if file is outdated

Env:
    NOMINATIM_CONTACT   contact email put in the User-Agent (Nominatim policy)
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

MAP_ID = "1xVIGlYMClwpJCnYr8KO1CYMkCI-Puys"
KML_URL = f"https://www.google.com/maps/d/kml?mid={MAP_ID}&forcekml=1"
NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse"
KML_NS = "{http://www.opengis.net/kml/2.2}"

CONTACT = os.environ.get("NOMINATIM_CONTACT", "lucaspereira0497@gmail.com")
USER_AGENT = f"lucarammel-portfolio-coffee-map/1.0 ({CONTACT})"

MIN_INTERVAL = 1.1  # Nominatim fair use: max 1 request/second
MAX_RETRIES = 4
TIMEOUT = 30
MAX_FAILURE_RATIO = 0.2  # abort if more than 20% of new lookups fail

CITY_KEYS = ("city", "town", "village", "municipality", "county", "state")
OUT = Path(__file__).resolve().parent.parent / "src" / "data" / "coffee.json"

Coord = tuple[float, float]


def log(msg: str) -> None:
    print(msg, flush=True)


def err(msg: str) -> None:
    print(msg, file=sys.stderr, flush=True)


# --------------------------------------------------------------------------- #
# HTTP
# --------------------------------------------------------------------------- #

_last_throttled = 0.0


def fetch(url: str, *, throttle: bool = False) -> bytes:
    """GET with retries and exponential backoff (honours Retry-After).

    `throttle` enforces the Nominatim rate limit between actual requests.
    """
    global _last_throttled
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})

    for attempt in range(MAX_RETRIES):
        if throttle:
            wait = MIN_INTERVAL - (time.monotonic() - _last_throttled)
            if wait > 0:
                time.sleep(wait)
            _last_throttled = time.monotonic()

        delay = 2**attempt  # 1s, 2s, 4s, 8s
        try:
            with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
                return resp.read()
        except urllib.error.HTTPError as exc:
            retryable = exc.code == 429 or exc.code >= 500
            if not retryable or attempt == MAX_RETRIES - 1:
                raise
            retry_after = exc.headers.get("Retry-After", "")
            if retry_after.isdigit():
                delay = max(delay, min(int(retry_after), 60))
        except (urllib.error.URLError, TimeoutError):
            if attempt == MAX_RETRIES - 1:
                raise
        time.sleep(delay)

    raise RuntimeError("unreachable")


# --------------------------------------------------------------------------- #
# KML
# --------------------------------------------------------------------------- #


def coord_key(lat: float, lng: float) -> Coord:
    return (round(lat, 6), round(lng, 6))


def parse_placemarks(kml: bytes) -> list[dict]:
    """Extract unique {name, lat, lng} spots from a KML document."""
    root = ET.fromstring(kml)
    seen: set[tuple[str, Coord]] = set()
    spots: list[dict] = []

    for pm in root.iter(f"{KML_NS}Placemark"):
        name_el = pm.find(f"{KML_NS}name")
        coords_el = pm.find(f".//{KML_NS}coordinates")
        if name_el is None or coords_el is None or not coords_el.text:
            continue
        try:
            # "lng,lat[,alt]" — take the first tuple if there are several
            lng_s, lat_s, *_ = coords_el.text.split()[0].split(",")
            lat, lng = coord_key(float(lat_s), float(lng_s))
        except (ValueError, IndexError):
            continue

        name = (name_el.text or "").strip()
        if not name or (name, (lat, lng)) in seen:
            continue
        seen.add((name, (lat, lng)))
        spots.append({"name": name, "lat": lat, "lng": lng})

    return spots


# --------------------------------------------------------------------------- #
# Geocoding
# --------------------------------------------------------------------------- #


def load_cache() -> dict[Coord, dict]:
    """Previously resolved locations, keyed on coordinates.

    Keying on coordinates (not names) means renaming a spot in My Maps does
    not trigger a new lookup.
    """
    if not OUT.exists():
        return {}
    try:
        existing = json.loads(OUT.read_text(encoding="utf-8"))
        return {
            coord_key(s["lat"], s["lng"]): s
            for s in existing
            if s.get("country") and s.get("countryCode")
        }
    except (json.JSONDecodeError, OSError, KeyError, TypeError):
        return {}


def reverse_geocode(lat: float, lng: float) -> dict | None:
    """Return {city, country, countryCode}, or None if the lookup failed."""
    query = urllib.parse.urlencode(
        {
            "lat": lat,
            "lon": lng,
            "format": "jsonv2",
            "zoom": 14,
            "accept-language": "en",
        }
    )
    try:
        payload = json.loads(fetch(f"{NOMINATIM_URL}?{query}", throttle=True))
    except Exception as exc:
        err(f"  ! reverse geocode failed for {lat},{lng}: {exc}")
        return None

    addr = payload.get("address") or {}
    if not addr.get("country"):
        err(f"  ! no address found for {lat},{lng}")
        return None

    return {
        "city": next((addr[k] for k in CITY_KEYS if addr.get(k)), ""),
        "country": addr["country"],
        "countryCode": (addr.get("country_code") or "").upper(),
    }


# --------------------------------------------------------------------------- #
# Output
# --------------------------------------------------------------------------- #


def render(spots: list[dict]) -> str:
    ordered = sorted(spots, key=lambda s: (s["country"], s["city"], s["name"]))
    return json.dumps(ordered, ensure_ascii=False, indent=2) + "\n"


def write_atomic(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(content, encoding="utf-8")
    tmp.replace(path)


# --------------------------------------------------------------------------- #
# Main
# --------------------------------------------------------------------------- #


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument(
        "--check", action="store_true", help="exit 1 if the JSON is outdated"
    )
    args = parser.parse_args()

    log("Fetching KML…")
    try:
        spots = parse_placemarks(fetch(KML_URL))
    except Exception as exc:
        err(f"Could not fetch/parse the KML: {exc}")
        return 1
    if not spots:
        err("KML contains no spots; refusing to overwrite the existing data")
        return 1

    cache = load_cache()
    todo = [s for s in spots if coord_key(s["lat"], s["lng"]) not in cache]
    log(f"{len(spots)} spots: {len(spots) - len(todo)} cached, {len(todo)} to geocode")

    # In --check mode we never hit Nominatim: any uncached spot means "outdated".
    if args.check and todo:
        err(f"coffee.json is out of date ({len(todo)} new spot(s))")
        return 1

    failures = 0
    done = 0
    for spot in spots:
        loc = cache.get(coord_key(spot["lat"], spot["lng"]))
        if loc is None:
            done += 1
            loc = reverse_geocode(spot["lat"], spot["lng"])
            if loc is None:
                failures += 1
                loc = {"city": "", "country": "", "countryCode": ""}
            else:
                log(
                    f"  [{done}/{len(todo)}] {spot['name'][:48]:50s} -> {loc['city']}, {loc['country']}"
                )
        spot.update(
            city=loc["city"], country=loc["country"], countryCode=loc["countryCode"]
        )

    # Check *before* writing so a flaky run never degrades the committed snapshot.
    if todo and failures / len(todo) > MAX_FAILURE_RATIO:
        err(
            f"Too many geocoding failures ({failures}/{len(todo)}); keeping the existing file"
        )
        return 1

    output = render(spots)
    current = OUT.read_text(encoding="utf-8") if OUT.exists() else ""

    if output == current:
        log("coffee.json is up to date" if args.check else "No changes")
        return 0
    if args.check:
        err("coffee.json is out of date")
        return 1

    write_atomic(OUT, output)
    log(
        f"Wrote {len(spots)} spots to {OUT} ({failures} unresolved, will be retried next run)"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
