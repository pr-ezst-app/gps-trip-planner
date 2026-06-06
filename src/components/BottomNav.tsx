import Icon from "@/components/ui/icon";
import type { ActiveView } from "@/pages/Index";

interface Props {
  active: ActiveView;
  navigating: boolean;
  onChange: (v: ActiveView) => void;
}

const TABS: { id: ActiveView; icon: string; label: string }[] = [
  { id: "map", icon: "Map", label: "Navigate" },
  { id: "trips", icon: "Route", label: "Trips" },
  { id: "share", icon: "Users", label: "Live Share" },
];

export default function BottomNav({ active, navigating, onChange }: Props) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-30">
      <div className="mx-4 mb-6 glass-strong rounded-2xl px-2 py-2 flex items-center justify-around">
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          const showPulse = tab.id === "share";
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`relative flex-1 flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all active:scale-95 ${
                isActive ? "bg-neon-cyan/10" : "hover:bg-surface-2"
              }`}
            >
              {/* Navigating indicator on map tab */}
              {tab.id === "map" && navigating && (
                <div className="absolute top-1.5 right-3 w-2 h-2 rounded-full bg-neon-cyan animate-ping-slow" />
              )}

              {/* Live pulse on share tab */}
              {showPulse && (
                <div className="absolute top-1.5 right-3 w-2 h-2 rounded-full bg-accent" />
              )}

              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                isActive
                  ? "bg-neon-cyan glow-cyan"
                  : "bg-surface-2"
              }`}>
                <Icon
                  name={tab.icon as "Map"}
                  size={18}
                  className={isActive ? "text-background" : "text-muted-foreground"}
                />
              </div>
              <span className={`text-[10px] font-medium transition-colors ${
                isActive ? "text-neon-cyan" : "text-muted-foreground"
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
