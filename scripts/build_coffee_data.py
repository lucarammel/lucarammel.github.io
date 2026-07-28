#!/usr/bin/env python3
"""One-shot generator for src/data/coffee.json.

Pulls the public Google My Maps KML export, then reverse-geocodes each spot via
Nominatim to attach a city / country. Rerun only when the My Maps list changes;
the generated JSON is committed and is the source of truth for the app.

Usage: python3 scripts/build_coffee_data.py
"""

import json
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

MAP_ID = "1xVIGlYMClwpJCnYr8KO1CYMkCI-Puys"
KML_URL = f"https://www.google.com/maps/d/kml?mid={MAP_ID}&forcekml=1"
NOMINATIM = "https://nominatim.openstreetmap.org/reverse"
USER_AGENT = "lucarammel-portfolio-coffee-map/1.0 (lucaspereira0497@gmail.com)"
KML_NS = "{http://www.opengis.net/kml/2.2}"

OUT = Path(__file__).resolve().parent.parent / "src" / "data" / "coffee.json"


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read()


def parse_placemarks(kml: bytes):
    root = ET.fromstring(kml)
    spots = []
    for pm in root.iter(f"{KML_NS}Placemark"):
        name = pm.find(f"{KML_NS}name")
        coords = pm.find(f".//{KML_NS}coordinates")
        if name is None or coords is None or not coords.text:
            continue
        lng, lat, *_ = coords.text.strip().split(",")
        spots.append(
            {"name": (name.text or "").strip(), "lat": round(float(lat), 6), "lng": round(float(lng), 6)}
        )
    return spots


def reverse_geocode(lat: float, lng: float):
    """Return (city, country, country_code) for a coordinate, or empty strings."""
    query = urllib.parse.urlencode(
        {"lat": lat, "lon": lng, "format": "jsonv2", "zoom": 14, "accept-language": "en"}
    )
    try:
        payload = json.loads(fetch(f"{NOMINATIM}?{query}"))
    except Exception as exc:  # network hiccup: leave the fields blank
        print(f"  ! reverse geocode failed for {lat},{lng}: {exc}")
        return "", "", ""

    addr = payload.get("address", {})
    city = next(
        (
            addr[key]
            for key in ("city", "town", "village", "municipality", "county", "state")
            if addr.get(key)
        ),
        "",
    )
    return city, addr.get("country", ""), (addr.get("country_code") or "").upper()


def main() -> None:
    print(f"Fetching KML from {KML_URL}")
    spots = parse_placemarks(fetch(KML_URL))
    print(f"Found {len(spots)} spots, reverse-geocoding (~1 req/s, be patient)")

    for i, spot in enumerate(spots, 1):
        city, country, code = reverse_geocode(spot["lat"], spot["lng"])
        spot.update(city=city, country=country, countryCode=code)
        print(f"  [{i}/{len(spots)}] {spot['name'][:48]:50s} -> {city}, {country}")
        time.sleep(1.1)  # Nominatim fair-use policy

    spots.sort(key=lambda s: (s["country"], s["city"], s["name"]))
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(spots, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(spots)} spots to {OUT}")


if __name__ == "__main__":
    main()
