import { useEffect, useRef, useState } from "react";
import type { ActiveView } from "@/pages/Index";
import Icon from "@/components/ui/icon";

const MAP_IMG = "https://cdn.ezst.app/projects/d4b3d371-f277-4a75-b13a-74c82e3db3f7/files/14af1fe3-396e-43a3-b53a-cc0eeff371df.jpg";

const ROUTE_POINTS = [
  { x: 20, y: 70 }, { x: 28, y: 62 }, { x: 35, y: 55 },
  { x: 45, y: 50 }, { x: 55, y: 45 }, { x: 65, y: 38 },
  { x: 72, y: 32 }, { x: 80, y: 25 },
];

interface Props {
  navigating: boolean;
  activeView: ActiveView;
}

export default function MapView({ navigating, activeView }: Props) {
  const [progress, setProgress] = useState(0);
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (navigating) {
      setProgress(0);
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) { clearInterval(intervalRef.current!); return 100; }
          return p + 0.3;
        });
      }, 80);
    } else {
      setProgress(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [navigating]);

  useEffect(() => {
    if (!navigating) {
      const t = setTimeout(() => {
        setMapOffset({
          x: (Math.random() - 0.5) * 20,
          y: (Math.random() - 0.5) * 20,
        });
      }, 200);
      return () => clearTimeout(t);
    }
  }, [navigating]);

  const currentPtIdx = Math.min(
    Math.floor((progress / 100) * (ROUTE_POINTS.length - 1)),
    ROUTE_POINTS.length - 1
  );
  const curPt = ROUTE_POINTS[currentPtIdx];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Map background */}
      <div
        className="absolute inset-0 transition-transform duration-[2s] ease-out"
        style={{ transform: `translate(${mapOffset.x}px, ${mapOffset.y}px) scale(1.05)` }}
      >
        <img
          src={MAP_IMG}
          alt="Map"
          className="w-full h-full object-cover"
          style={{ filter: navigating ? "brightness(0.7) saturate(1.3)" : "brightness(0.6) saturate(1.1)" }}
        />
        {/* Grid overlay */}
        <div className="absolute inset-0 map-grid opacity-30" />
        {/* Vignette */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at center, transparent 30%, hsl(220 20% 6% / 0.8) 100%)"
        }} />
      </div>

      {/* SVG Route overlay */}
      {navigating && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(174 100% 50%)" stopOpacity="0.2" />
              <stop offset={`${progress}%`} stopColor="hsl(174 100% 50%)" stopOpacity="1" />
              <stop offset={`${Math.min(progress + 5, 100)}%`} stopColor="hsl(262 80% 65%)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="hsl(174 100% 50%)" stopOpacity="0.15" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="0.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Route base */}
          <polyline
            points={ROUTE_POINTS.map(p => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="hsl(174 100% 50% / 0.2)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Active route */}
          <polyline
            points={ROUTE_POINTS.slice(0, currentPtIdx + 2).map(p => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="url(#routeGrad)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />

          {/* Destination marker */}
          <circle cx={ROUTE_POINTS[ROUTE_POINTS.length - 1].x} cy={ROUTE_POINTS[ROUTE_POINTS.length - 1].y}
            r="1.5" fill="hsl(262 80% 65%)" opacity="0.9" />
          <circle cx={ROUTE_POINTS[ROUTE_POINTS.length - 1].x} cy={ROUTE_POINTS[ROUTE_POINTS.length - 1].y}
            r="3" fill="none" stroke="hsl(262 80% 65%)" strokeWidth="0.5" opacity="0.5" />

          {/* Current position dot */}
          <circle cx={curPt.x} cy={curPt.y} r="2.5" fill="hsl(174 100% 50%)" filter="url(#glow)" />
          <circle cx={curPt.x} cy={curPt.y} r="4.5" fill="none" stroke="hsl(174 100% 50%)" strokeWidth="0.5" opacity="0.4" />
        </svg>
      )}

      {/* Compass */}
      {activeView === "map" && (
        <div className="absolute top-4 right-4 w-10 h-10 glass rounded-full flex items-center justify-center animate-fade-in">
          <Icon name="Compass" size={18} className="text-neon-cyan" />
        </div>
      )}

      {/* Current location pulse (when not navigating) */}
      {!navigating && activeView === "map" && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-4 h-4 rounded-full bg-neon-cyan glow-cyan animate-ping-slow" />
            <div className="absolute inset-0 w-4 h-4 rounded-full bg-neon-cyan opacity-50" />
          </div>
        </div>
      )}
    </div>
  );
}
