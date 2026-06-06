import { useState } from "react";
import MapView from "@/components/MapView";
import BottomNav from "@/components/BottomNav";
import NavigationPanel from "@/components/NavigationPanel";
import TripPlanner from "@/components/TripPlanner";
import LiveSharePanel from "@/components/LiveSharePanel";
import SearchBar from "@/components/SearchBar";

export type ActiveView = "map" | "trips" | "share";

export default function Index() {
  const [activeView, setActiveView] = useState<ActiveView>("map");
  const [navigating, setNavigating] = useState(false);
  const [destination, setDestination] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background font-sans select-none">
      <MapView navigating={navigating} activeView={activeView} />

      {activeView === "map" && !navigating && (
        <SearchBar
          open={searchOpen}
          onOpenChange={setSearchOpen}
          onNavigate={(dest) => {
            setDestination(dest);
            setNavigating(true);
            setSearchOpen(false);
          }}
        />
      )}

      {activeView === "map" && navigating && (
        <NavigationPanel
          destination={destination}
          onStop={() => setNavigating(false)}
        />
      )}

      {activeView === "trips" && (
        <TripPlanner onClose={() => setActiveView("map")} />
      )}

      {activeView === "share" && (
        <LiveSharePanel onClose={() => setActiveView("map")} />
      )}

      <BottomNav
        active={activeView}
        navigating={navigating}
        onChange={(v) => {
          setActiveView(v);
          if (v !== "map") setNavigating(false);
        }}
      />
    </div>
  );
}
