import raw from "./coffee.json";

export type CoffeeSpot = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  city: string;
  country: string;
  countryCode: string;
};

/**
 * Spots come from `scripts/build_coffee_data.py`, which mirrors the public
 * Google My Maps list and reverse-geocodes each pin. Rerun `npm run coffee:sync`
 * after adding places there.
 */
export const coffeeSpots: CoffeeSpot[] = (raw as Omit<CoffeeSpot, "id">[]).map((spot) => ({
  ...spot,
  id: `${spot.name}-${spot.lat},${spot.lng}`,
}));

export const countries = [...new Set(coffeeSpots.map((s) => s.country))].sort();

export const cities = [...new Set(coffeeSpots.map((s) => s.city))].sort();

export function googleMapsUrl(spot: CoffeeSpot): string {
  const query = encodeURIComponent(`${spot.name} ${spot.city}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

/** Regional-indicator flag emoji, e.g. "FR" -> 🇫🇷. */
export function flag(countryCode: string): string {
  if (countryCode.length !== 2) return "";
  return String.fromCodePoint(
    ...[...countryCode.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65),
  );
}
