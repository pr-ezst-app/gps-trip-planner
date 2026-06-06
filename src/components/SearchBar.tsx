import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

const SUGGESTIONS = [
  { name: "Times Square", sub: "Manhattan, New York", icon: "Star", time: "24 min" },
  { name: "Central Park", sub: "New York, NY 10024", icon: "Trees", time: "18 min" },
  { name: "Brooklyn Bridge", sub: "Brooklyn, New York", icon: "Landmark", time: "31 min" },
  { name: "Empire State Building", sub: "Midtown Manhattan", icon: "Building2", time: "22 min" },
  { name: "Grand Central Terminal", sub: "East Midtown, NYC", icon: "TrainFront", time: "15 min" },
];

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onNavigate: (dest: string) => void;
}

export default function SearchBar({ open, onOpenChange, onNavigate }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.length > 0
    ? SUGGESTIONS.filter(s => s.name.toLowerCase().includes(query.toLowerCase()))
    : SUGGESTIONS;

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  if (!open) {
    return (
      <div className="absolute top-0 left-0 right-0 pt-safe px-4 pt-12 z-20 animate-fade-in">
        <button
          onClick={() => onOpenChange(true)}
          className="w-full glass rounded-2xl px-5 py-4 flex items-center gap-3 glow-cyan transition-all active:scale-[0.98]"
        >
          <Icon name="Search" size={18} className="text-muted-foreground" />
          <span className="text-muted-foreground font-sans text-sm">Where to?</span>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-xs bg-surface-2 text-muted-foreground px-2 py-0.5 rounded-full">GPS</span>
            <div className="w-2 h-2 rounded-full bg-neon-cyan animate-ping-slow" />
          </div>
        </button>

        {/* Quick actions */}
        <div className="flex gap-2 mt-3 animate-fade-in delay-100">
          {[
            { icon: "Home", label: "Home", time: "12 min" },
            { icon: "Briefcase", label: "Work", time: "8 min" },
            { icon: "Fuel", label: "Gas", time: "3 min" },
            { icon: "Coffee", label: "Café", time: "5 min" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => onNavigate(item.label)}
              className="flex-1 glass rounded-xl py-3 px-2 flex flex-col items-center gap-1.5 transition-all active:scale-95 hover:border-neon-cyan/30"
            >
              <div className="w-8 h-8 rounded-xl bg-surface-2 flex items-center justify-center">
                <Icon name={item.icon as "Home"} size={15} className="text-neon-cyan" />
              </div>
              <span className="text-[10px] font-medium text-foreground">{item.label}</span>
              <span className="text-[9px] text-muted-foreground">{item.time}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-30 glass-strong animate-scale-in flex flex-col">
      {/* Header */}
      <div className="px-4 pt-12 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { onOpenChange(false); setQuery(""); }}
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
              placeholder="Search destination..."
              className="w-full bg-surface-2 rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-neon-cyan/50 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Recent / suggestions */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide">
        <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-widest">
          {query ? "Results" : "Suggestions"}
        </p>
        <div className="space-y-2">
          {filtered.map((s, i) => (
            <button
              key={s.name}
              onClick={() => onNavigate(s.name)}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-surface-2 hover:bg-surface-3 border border-transparent hover:border-neon-cyan/20 transition-all active:scale-[0.98] animate-fade-in"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="w-10 h-10 rounded-xl bg-surface-3 flex items-center justify-center flex-shrink-0">
                <Icon name={s.icon as "Star"} size={18} className="text-neon-cyan" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-foreground">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.sub}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Icon name="Clock" size={12} className="text-neon-cyan" />
                <span className="text-xs text-neon-cyan font-medium">{s.time}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
