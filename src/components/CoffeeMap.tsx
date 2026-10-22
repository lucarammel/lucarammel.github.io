import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet.markercluster";

import { googleMapsUrl, type CoffeeSpot } from "../data/coffee";

const TILES =
  "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png";

const ATTRIBUTION =
  '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, ' +
  '&copy; <a href="https://openmaptiles.org/">OpenMapTiles</a>, ' +
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const pinIcon = L.divIcon({
  className: "",
  html: `
    <span style="
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: #fff8ee;
      border: 1px solid #d6b894;
      box-shadow: 0 2px 5px rgba(0,0,0,.2);
    ">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#6f4228"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M10 2v2"/>
        <path d="M14 2v2"/>
        <path d="M4 7h14v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V7Z"/>
        <path d="M18 9h1a3 3 0 0 1 0 6h-2"/>
        <path d="M8 2v2"/>
      </svg>
    </span>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -17],
});


const clusterIcon = (cluster: L.MarkerCluster) => {
  const count = cluster.getChildCount();
  const size = count < 10 ? 42 : count < 50 ? 48 : 56;
  const fontSize = count < 10 ? 11 : 12;

  return L.divIcon({
    className: "",
    html: `
      <span style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1px;
        width: ${size}px;
        height: ${size}px;
        box-sizing: border-box;
        border-radius: 50%;
        background: #fff8ee;
        border: 1.5px solid #d6b894;
        box-shadow: 0 2px 6px rgba(0,0,0,.2);
        color: #6f4228;
        font-family: sans-serif;
      ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="${size * 0.42}px"
          height="${size * 0.42}px"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M4 7h14v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V7Z"/>
          <path d="M18 9h1a3 3 0 0 1 0 6h-2"/>
          <path d="M8 3v2"/>
          <path d="M12 3v2"/>
        </svg>
        <span style="
          font-size: ${fontSize}px;
          font-weight: 700;
          line-height: 1;
        ">${count}</span>
      </span>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
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
      maxClusterRadius: 30,
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
