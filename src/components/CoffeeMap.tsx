import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet.markercluster";

import { googleMapsUrl, type CoffeeSpot } from "../data/coffee";

// Carto's Positron basemap is label-light and near-monochrome, so it matches the
// design in light mode and inverts cleanly to dark (see index.css).
const TILES = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

const pinIcon = L.divIcon({
  className: "",
  html: '<span class="coffee-pin block h-3 w-3"></span>',
  iconSize: [12, 12],
  iconAnchor: [6, 6],
  popupAnchor: [0, -8],
});

const clusterIcon = (cluster: L.MarkerCluster) => {
  const count = cluster.getChildCount();
  const size = count < 10 ? 32 : count < 50 ? 38 : 46;
  return L.divIcon({
    className: "",
    html: `<span class="coffee-cluster" style="width:${size}px;height:${size}px;font-size:${size < 38 ? 12 : 13}px">${count}</span>`,
    iconSize: [size, size],
  });
};

const popupHtml = (spot: CoffeeSpot) => `
  <div class="min-w-44 font-sans">
    <p class="text-sm font-semibold leading-snug">${escapeHtml(spot.name)}</p>
    <p class="mt-0.5 text-xs opacity-70">${escapeHtml(spot.city)}, ${escapeHtml(spot.country)}</p>
    <a href="${googleMapsUrl(spot)}" target="_blank" rel="noreferrer"
       class="mt-2 inline-block text-xs font-medium underline underline-offset-2">Open in Maps</a>
  </div>`;

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

type Props = {
  spots: CoffeeSpot[];
  /** Spot the user picked in the list; the map flies to it and opens its popup. */
  focused: CoffeeSpot | null;
};

export function CoffeeMap({ spots, focused }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const markersRef = useRef(new Map<string, L.Marker>());

  // Create the map once; Leaflet owns this DOM node from here on.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [30, 5],
      zoom: 2,
      minZoom: 2,
      zoomControl: true,
      scrollWheelZoom: false, // avoid hijacking page scroll; ctrl/pinch still zooms
      worldCopyJump: true,
      attributionControl: true,
    });

    L.tileLayer(TILES, { attribution: ATTRIBUTION, maxZoom: 20, subdomains: "abcd" }).addTo(map);

    const cluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 45,
      iconCreateFunction: clusterIcon,
    });
    map.addLayer(cluster);

    mapRef.current = map;
    clusterRef.current = cluster;

    return () => {
      map.remove();
      mapRef.current = null;
      clusterRef.current = null;
      markersRef.current.clear();
    };
  }, []);

  // Rebuild markers whenever the filtered set changes, then frame them.
  useEffect(() => {
    const map = mapRef.current;
    const cluster = clusterRef.current;
    if (!map || !cluster) return;

    cluster.clearLayers();
    markersRef.current.clear();

    const markers = spots.map((spot) => {
      const marker = L.marker([spot.lat, spot.lng], { icon: pinIcon, title: spot.name });
      marker.bindPopup(popupHtml(spot), { closeButton: false });
      markersRef.current.set(spot.id, marker);
      return marker;
    });

    cluster.addLayers(markers);

    if (markers.length > 0) {
      map.fitBounds(L.latLngBounds(spots.map((s) => [s.lat, s.lng])), {
        padding: [40, 40],
        maxZoom: 13,
      });
    }
  }, [spots]);

  // Fly to the spot selected in the sidebar and reveal it inside its cluster.
  useEffect(() => {
    const map = mapRef.current;
    const cluster = clusterRef.current;
    if (!map || !cluster || !focused) return;

    const marker = markersRef.current.get(focused.id);
    if (!marker) return;

    map.flyTo([focused.lat, focused.lng], Math.max(map.getZoom(), 15), { duration: 0.8 });
    cluster.zoomToShowLayer(marker, () => marker.openPopup());
  }, [focused]);

  return <div ref={containerRef} className="h-full w-full" aria-label="Map of coffee spots" role="application" />;
}
