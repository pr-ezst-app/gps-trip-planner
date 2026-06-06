import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { ActiveView } from "@/pages/Index";
import Icon from "@/components/ui/icon";

// Dark map tile style (CartoDB dark matter — free, no key needed)
const TILE_URL = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

// Fix Leaflet default marker icon paths broken by Vite bundling
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom cyan pulse marker for user location
const userIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:18px;height:18px;border-radius:50%;
    background:hsl(174,100%,50%);
    border:3px solid white;
    box-shadow:0 0 0 6px hsl(174 100% 50% / 0.25), 0 0 20px hsl(174 100% 50% / 0.5);
  "></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

// Custom violet destination marker
const destIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:22px;height:22px;border-radius:50% 50% 50% 0;
    background:hsl(262,80%,65%);
    border:3px solid white;
    transform:rotate(-45deg);
    box-shadow:0 0 16px hsl(262 80% 65% / 0.6);
  "></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 22],
});

interface Props {
  navigating: boolean;
  activeView: ActiveView;
  onLocationUpdate?: (lat: number, lng: number) => void;
  destinationCoords?: [number, number] | null;
}

export default function MapView({ navigating, activeView, onLocationUpdate, destinationCoords }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const destMarkerRef = useRef<L.Marker | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [gpsStatus, setGpsStatus] = useState<"loading" | "ok" | "denied" | "unsupported">("loading");

  // Init map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [40.7580, -73.9855], // Times Square default
      zoom: 14,
      zoomControl: false,
      attributionControl: true,
    });

    L.tileLayer(TILE_URL, {
      attribution: TILE_ATTR,
      maxZoom: 19,
      subdomains: "abcd",
    }).addTo(map);

    // Style attribution to fit dark theme
    map.attributionControl.setPrefix("");
    const attrEl = map.getContainer().querySelector(".leaflet-control-attribution") as HTMLElement | null;
    if (attrEl) {
      attrEl.style.cssText = "background:hsl(220 18% 9% / 0.7);color:hsl(215 20% 45%);font-size:9px;backdrop-filter:blur(4px);border-radius:6px 0 0 0;border:none;padding:2px 6px;";
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // GPS watch
  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsStatus("unsupported");
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(coords);
        setGpsStatus("ok");
        onLocationUpdate?.(coords[0], coords[1]);

        const map = mapInstanceRef.current;
        if (!map) return;

        // Update or create user marker
        if (userMarkerRef.current) {
          userMarkerRef.current.setLatLng(coords);
        } else {
          userMarkerRef.current = L.marker(coords, { icon: userIcon, zIndexOffset: 1000 }).addTo(map);
        }

        // Pan to user if not navigating
        if (!navigating) {
          map.setView(coords, map.getZoom(), { animate: true });
        }
      },
      (err) => {
        console.warn("GPS error", err.code);
        setGpsStatus("denied");
        // Default to Times Square so map is useful anyway
        setUserPos([40.758, -73.9855]);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );

    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  // Draw route when destinationCoords change and navigating is true
  const drawRoute = useCallback(async (from: [number, number], to: [number, number]) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove old route & dest marker
    routeLayerRef.current?.remove();
    destMarkerRef.current?.remove();

    // Add destination marker
    destMarkerRef.current = L.marker(to, { icon: destIcon }).addTo(map);

    try {
      // OSRM — free, no API key required
      const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.code === "Ok" && data.routes?.length) {
        const coords = (data.routes[0].geometry.coordinates as [number, number][]).map(
          ([lng, lat]) => [lat, lng] as [number, number]
        );

        // Glowing route line — two layers for glow effect
        L.polyline(coords, {
          color: "hsl(174,100%,50%)",
          weight: 8,
          opacity: 0.15,
        }).addTo(map);

        routeLayerRef.current = L.polyline(coords, {
          color: "hsl(174,100%,50%)",
          weight: 4,
          opacity: 0.9,
        }).addTo(map);

        // Fit map to route
        map.fitBounds(routeLayerRef.current.getBounds(), { padding: [80, 80] });
      }
    } catch (e) {
      // Fallback straight line
      routeLayerRef.current = L.polyline([from, to], {
        color: "hsl(174,100%,50%)",
        weight: 4,
        opacity: 0.8,
        dashArray: "10, 8",
      }).addTo(map);
      map.fitBounds(routeLayerRef.current.getBounds(), { padding: [80, 80] });
    }
  }, []);

  useEffect(() => {
    if (navigating && destinationCoords && userPos) {
      drawRoute(userPos, destinationCoords);
    }
    if (!navigating) {
      routeLayerRef.current?.remove();
      routeLayerRef.current = null;
      destMarkerRef.current?.remove();
      destMarkerRef.current = null;
    }
  }, [navigating, destinationCoords, drawRoute]);

  // Center on user button
  const centerOnUser = () => {
    if (userPos && mapInstanceRef.current) {
      mapInstanceRef.current.setView(userPos, 16, { animate: true });
    }
  };

  return (
    <div className="absolute inset-0">
      {/* Leaflet map container */}
      <div ref={mapRef} className="absolute inset-0" style={{ zIndex: 0 }} />

      {/* Vignette overlay for UI depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, hsl(220 20% 6% / 0.5) 100%)",
          zIndex: 1,
        }}
      />

      {/* GPS status badge */}
      {gpsStatus === "loading" && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 glass rounded-full px-3 py-1.5 flex items-center gap-2 animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-neon-amber animate-ping-slow" />
          <span className="text-xs text-muted-foreground">Getting location...</span>
        </div>
      )}
      {gpsStatus === "denied" && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 glass rounded-full px-3 py-1.5 flex items-center gap-2 animate-fade-in">
          <Icon name="MapPinOff" size={12} className="text-destructive" />
          <span className="text-xs text-muted-foreground">Location off — showing NYC</span>
        </div>
      )}

      {/* Controls overlay */}
      {activeView === "map" && (
        <div className="absolute right-4 top-4 z-10 flex flex-col gap-2 animate-fade-in">
          {/* Compass */}
          <div className="w-10 h-10 glass rounded-full flex items-center justify-center">
            <Icon name="Compass" size={18} className="text-neon-cyan" />
          </div>

          {/* Center on me */}
          <button
            onClick={centerOnUser}
            className="w-10 h-10 glass rounded-full flex items-center justify-center transition-all active:scale-90"
          >
            <Icon name="Crosshair" size={17} className={gpsStatus === "ok" ? "text-neon-cyan" : "text-muted-foreground"} />
          </button>

          {/* Zoom in */}
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="w-10 h-10 glass rounded-xl flex items-center justify-center transition-all active:scale-90"
          >
            <Icon name="Plus" size={17} className="text-foreground" />
          </button>

          {/* Zoom out */}
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="w-10 h-10 glass rounded-xl flex items-center justify-center transition-all active:scale-90"
          >
            <Icon name="Minus" size={17} className="text-foreground" />
          </button>
        </div>
      )}
    </div>
  );
}
