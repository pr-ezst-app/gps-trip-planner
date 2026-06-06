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
  const [destinationCoords, setDestinationCoords] = useState<[number, number] | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background font-sans select-none">
      <MapView
        navigating={navigating}
        activeView={activeView}
        onLocationUpdate={(lat, lng) => setUserCoords([lat, lng])}
        destinationCoords={destinationCoords}
      />

      {activeView === "map" && !navigating && (
        <SearchBar
          open={searchOpen}
          onOpenChange={setSearchOpen}
          userCoords={userCoords}
          onNavigate={(dest, coords) => {
            setDestination(dest);
            setDestinationCoords(coords);
            setNavigating(true);
            setSearchOpen(false);
          }}
        />
      )}

      {activeView === "map" && navigating && (
        <NavigationPanel
          destination={destination}
          onStop={() => {
            setNavigating(false);
            setDestinationCoords(null);
          }}
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
