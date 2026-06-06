import { useState } from "react";
import Icon from "@/components/ui/icon";

const TRIPS = [
  {
    id: 1,
    name: "Pacific Coast Highway",
    days: 5,
    stops: 8,
    distance: "650 mi",
    collaborators: ["A", "J", "M"],
    color: "from-cyan-500 to-blue-600",
    status: "Planning",
    statusColor: "text-neon-cyan bg-neon-cyan/10",
  },
  {
    id: 2,
    name: "Route 66 Adventure",
    days: 12,
    stops: 15,
    distance: "2,400 mi",
    collaborators: ["K", "T"],
    color: "from-violet-500 to-purple-700",
    status: "Active",
    statusColor: "text-accent bg-accent/10",
  },
  {
    id: 3,
    name: "New England Fall Tour",
    days: 7,
    stops: 10,
    distance: "890 mi",
    collaborators: ["S", "P", "L", "R"],
    color: "from-amber-500 to-orange-600",
    status: "Draft",
    statusColor: "text-muted-foreground bg-surface-3",
  },
];

const WAYPOINTS = [
  { city: "San Francisco, CA", type: "start", done: true },
  { city: "Big Sur, CA", type: "stop", done: true },
  { city: "Santa Barbara, CA", type: "stop", done: false },
  { city: "Malibu, CA", type: "stop", done: false },
  { city: "Los Angeles, CA", type: "end", done: false },
];

interface Props {
  onClose: () => void;
}

export default function TripPlanner({ onClose }: Props) {
  const [tab, setTab] = useState<"trips" | "detail">("trips");
  const [selectedTrip, setSelectedTrip] = useState(TRIPS[0]);
  const [newStop, setNewStop] = useState("");

  return (
    <div className="absolute inset-0 z-20 flex flex-col bg-background animate-slide-up">
      {/* Header */}
      <div className="px-4 pt-12 pb-4 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">Trip Planner</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Plan & share your routes</p>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center transition-all active:scale-90"
        >
          <Icon name="X" size={18} className="text-foreground" />
        </button>
      </div>

      {tab === "trips" && (
        <div className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide">
          {/* Create new trip */}
          <button className="w-full mb-4 p-4 rounded-2xl border-2 border-dashed border-border hover:border-neon-cyan/40 flex items-center gap-3 transition-all group animate-fade-in">
            <div className="w-10 h-10 rounded-xl bg-surface-2 group-hover:bg-neon-cyan/10 flex items-center justify-center transition-colors">
              <Icon name="Plus" size={20} className="text-neon-cyan" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">Create New Trip</p>
              <p className="text-xs text-muted-foreground">Start planning your adventure</p>
            </div>
          </button>

          {/* Trip cards */}
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-3">Your Trips</p>
          <div className="space-y-3">
            {TRIPS.map((trip, i) => (
              <button
                key={trip.id}
                onClick={() => { setSelectedTrip(trip); setTab("detail"); }}
                className="w-full text-left animate-fade-in"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="glass rounded-2xl overflow-hidden border border-border hover:border-neon-cyan/20 transition-all active:scale-[0.98]">
                  {/* Gradient bar */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${trip.color}`} />
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-display font-bold text-base text-foreground">{trip.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{trip.days} days · {trip.stops} stops · {trip.distance}</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${trip.statusColor}`}>
                        {trip.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      {/* Collaborator avatars */}
                      <div className="flex items-center">
                        {trip.collaborators.map((c, idx) => (
                          <div
                            key={idx}
                            className="w-7 h-7 rounded-full bg-gradient-to-br from-neon-cyan to-accent flex items-center justify-center text-xs font-bold text-background border-2 border-background"
                            style={{ marginLeft: idx > 0 ? "-8px" : "0" }}
                          >
                            {c}
                          </div>
                        ))}
                        <span className="text-xs text-muted-foreground ml-2">{trip.collaborators.length} people</span>
                      </div>
                      <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === "detail" && (
        <div className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide">
          <button
            onClick={() => setTab("trips")}
            className="flex items-center gap-2 text-sm text-muted-foreground mb-4 animate-fade-in"
          >
            <Icon name="ArrowLeft" size={14} />
            All trips
          </button>

          {/* Trip header */}
          <div className={`rounded-2xl p-4 mb-4 bg-gradient-to-br ${selectedTrip.color} animate-fade-in`}>
            <h2 className="font-display font-bold text-xl text-white">{selectedTrip.name}</h2>
            <p className="text-white/70 text-sm mt-1">{selectedTrip.days} days · {selectedTrip.stops} stops · {selectedTrip.distance}</p>
            <div className="flex gap-2 mt-3">
              <button className="flex items-center gap-1.5 bg-white/20 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <Icon name="Play" size={12} />
                Start Trip
              </button>
              <button className="flex items-center gap-1.5 bg-white/20 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <Icon name="Share2" size={12} />
                Share
              </button>
              <button className="flex items-center gap-1.5 bg-white/20 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <Icon name="UserPlus" size={12} />
                Invite
              </button>
            </div>
          </div>

          {/* Waypoints */}
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-3 animate-fade-in delay-100">
            Route Stops
          </p>
          <div className="relative space-y-2 mb-4">
            {WAYPOINTS.map((wp, i) => (
              <div
                key={i}
                className="flex items-center gap-3 animate-fade-in"
                style={{ animationDelay: `${0.1 + i * 0.07}s` }}
              >
                {/* Timeline line */}
                <div className="flex flex-col items-center flex-shrink-0 w-8">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    wp.type === "start" ? "border-neon-cyan bg-neon-cyan/10" :
                    wp.type === "end" ? "border-accent bg-accent/10" :
                    wp.done ? "border-neon-cyan/50 bg-neon-cyan/5" :
                    "border-border bg-surface-2"
                  }`}>
                    <Icon
                      name={wp.type === "start" ? "MapPin" : wp.type === "end" ? "Flag" : wp.done ? "Check" : "Circle"}
                      size={14}
                      className={wp.type === "start" ? "text-neon-cyan" : wp.type === "end" ? "text-accent" : wp.done ? "text-neon-cyan" : "text-muted-foreground"}
                    />
                  </div>
                  {i < WAYPOINTS.length - 1 && (
                    <div className={`w-0.5 h-6 mt-1 ${wp.done ? "bg-neon-cyan/30" : "bg-border"}`} />
                  )}
                </div>
                <div className="flex-1 glass rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{wp.city}</p>
                    <p className="text-xs text-muted-foreground capitalize">{wp.type === "start" ? "Starting point" : wp.type === "end" ? "Final destination" : "Waypoint"}</p>
                  </div>
                  <button className="w-7 h-7 rounded-lg bg-surface-2 flex items-center justify-center">
                    <Icon name="MoreHorizontal" size={14} className="text-muted-foreground" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add stop */}
          <div className="flex gap-2 animate-fade-in delay-400">
            <input
              value={newStop}
              onChange={(e) => setNewStop(e.target.value)}
              placeholder="Add a stop..."
              className="flex-1 bg-surface-2 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-neon-cyan/50 transition-colors"
            />
            <button className="w-12 h-12 rounded-xl bg-neon-cyan flex items-center justify-center flex-shrink-0 transition-all active:scale-90">
              <Icon name="Plus" size={18} className="text-background" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
