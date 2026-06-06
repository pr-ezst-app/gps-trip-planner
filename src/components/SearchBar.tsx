import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

// Free geocoding: OpenStreetMap Nominatim
async function geocode(query: string): Promise<{ name: string; display: string; coords: [number, number] }[]> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
      { headers: { "Accept-Language": "en" } }
    );
    const data = await res.json();
    return data.map((r: { display_name: string; lat: string; lon: string }) => ({
      name: r.display_name.split(",")[0],
      display: r.display_name.split(",").slice(1, 3).join(",").trim(),
      coords: [parseFloat(r.lat), parseFloat(r.lon)] as [number, number],
    }));
  } catch {
    return [];
  }
}

const QUICK_PLACES = [
  { icon: "Home", label: "Home", query: "Times Square, New York" },
  { icon: "Briefcase", label: "Work", query: "Wall Street, New York" },
  { icon: "Fuel", label: "Gas", query: "Gas station New York" },
  { icon: "Coffee", label: "Café", query: "Starbucks New York" },
];

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  userCoords: [number, number] | null;
  onNavigate: (dest: string, coords: [number, number]) => void;
}

export default function SearchBar({ open, onOpenChange, userCoords, onNavigate }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ name: string; display: string; coords: [number, number] }[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length < 2) { setResults([]); return; }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const found = await geocode(query);
      setResults(found);
      setLoading(false);
    }, 400);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  const handleQuick = async (q: { label: string; query: string }) => {
    const found = await geocode(q.query);
    if (found.length > 0) onNavigate(q.label, found[0].coords);
  };

  if (!open) {
    return (
      <div className="absolute top-10 left-4 right-4 z-20 animate-fade-in" style={{ pointerEvents: "none" }}>
        <button
          onClick={() => onOpenChange(true)}
          style={{ pointerEvents: "auto" }}
          className="w-full glass rounded-xl px-3 py-2.5 flex items-center gap-2 transition-all active:scale-[0.98]"
        >
          <Icon name="Search" size={14} className="text-muted-foreground flex-shrink-0" />
          <span className="text-muted-foreground font-sans text-xs flex-1 text-left">Where to?</span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-ping-slow" />
          </div>
        </button>

        <div className="flex gap-1.5 mt-2 animate-fade-in delay-100" style={{ pointerEvents: "auto" }}>
          {QUICK_PLACES.map((item) => (
            <button
              key={item.label}
              onClick={() => handleQuick(item)}
              className="flex-1 glass rounded-lg py-1.5 px-1 flex items-center justify-center gap-1 transition-all active:scale-95"
            >
              <Icon name={item.icon as "Home"} size={11} className="text-neon-cyan" />
              <span className="text-[10px] font-medium text-foreground">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-30 glass-strong animate-scale-in flex flex-col">
      <div className="px-4 pt-12 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { onOpenChange(false); setQuery(""); setResults([]); }}
            className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center transition-all active:scale-90"
          >
            <Icon name="ArrowLeft" size={18} className="text-foreground" />
          </button>
          <div className="flex-1 relative">
            <Icon name="Search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search any place..."
              className="w-full bg-surface-2 rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-neon-cyan/50 transition-colors"
            />
            {loading && (
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-neon-cyan border-t-transparent animate-spin" />
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide">
        {query.length < 2 && (
          <>
            <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-widest">Quick Access</p>
            <div className="space-y-2">
              {QUICK_PLACES.map((item, i) => (
                <button
                  key={item.label}
                  onClick={() => handleQuick(item)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-surface-2 hover:bg-surface-3 border border-transparent hover:border-neon-cyan/20 transition-all active:scale-[0.98] animate-fade-in"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="w-10 h-10 rounded-xl bg-surface-3 flex items-center justify-center flex-shrink-0">
                    <Icon name={item.icon as "Home"} size={18} className="text-neon-cyan" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.query}</p>
                  </div>
                  <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
                </button>
              ))}
            </div>
          </>
        )}

        {query.length >= 2 && !loading && results.length === 0 && (
          <div className="flex flex-col items-center py-12 gap-3">
            <Icon name="SearchX" size={32} className="text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No places found</p>
          </div>
        )}

        {results.length > 0 && (
          <>
            <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-widest">Results</p>
            <div className="space-y-2">
              {results.map((r, i) => (
                <button
                  key={i}
                  onClick={() => onNavigate(r.name, r.coords)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-surface-2 hover:bg-surface-3 border border-transparent hover:border-neon-cyan/20 transition-all active:scale-[0.98] animate-fade-in"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="w-10 h-10 rounded-xl bg-surface-3 flex items-center justify-center flex-shrink-0">
                    <Icon name="MapPin" size={18} className="text-neon-cyan" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{r.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{r.display}</p>
                  </div>
                  <Icon name="Navigation" size={14} className="text-neon-cyan flex-shrink-0" />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}