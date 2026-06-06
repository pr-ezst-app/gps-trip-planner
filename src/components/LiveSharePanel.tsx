import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const FRIENDS = [
  { name: "Alex Rivera", initial: "A", status: "online", location: "Times Square, NY", eta: "12 min away", sharing: true, color: "from-cyan-400 to-blue-500" },
  { name: "Jordan Park", initial: "J", status: "online", location: "Brooklyn Bridge", eta: "28 min away", sharing: true, color: "from-violet-400 to-purple-600" },
  { name: "Maya Chen", initial: "M", status: "offline", location: "Last seen 2h ago", eta: null, sharing: false, color: "from-amber-400 to-orange-500" },
  { name: "Sam Torres", initial: "S", status: "online", location: "Central Park", eta: "5 min away", sharing: true, color: "from-emerald-400 to-teal-600" },
];

interface Props {
  onClose: () => void;
}

export default function LiveSharePanel({ onClose }: Props) {
  const [shareCode] = useState("WYFR-7X4K");
  const [copied, setCopied] = useState(false);
  const [mySharing, setMySharing] = useState(true);
  const [pingCount, setPingCount] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setPingCount(p => p + 1), 3000);
    return () => clearInterval(t);
  }, []);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="absolute inset-0 z-20 flex flex-col bg-background animate-slide-up">
      {/* Header */}
      <div className="px-4 pt-12 pb-4 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">Live Share</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Real-time location sharing</p>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center transition-all active:scale-90"
        >
          <Icon name="X" size={18} className="text-foreground" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide space-y-4">
        {/* My sharing status */}
        <div className="glass rounded-2xl p-4 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neon-cyan to-accent flex items-center justify-center text-background font-bold text-lg">
                  Y
                </div>
                {mySharing && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-neon-cyan border-2 border-background animate-ping-slow" />
                )}
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">You</p>
                <p className="text-xs text-muted-foreground">
                  {mySharing ? "📍 Sharing live location" : "Location hidden"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setMySharing(!mySharing)}
              className={`relative w-12 h-6 rounded-full transition-colors ${mySharing ? "bg-neon-cyan" : "bg-surface-3"}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-background shadow-md transition-all ${mySharing ? "left-6" : "left-0.5"}`} />
            </button>
          </div>

          {/* Share invite card */}
          {mySharing && (
            <div className="bg-surface-2 rounded-xl p-3 animate-scale-in">
              <p className="text-xs text-muted-foreground mb-2">Share your trip link</p>
              <div className="flex gap-2">
                <div className="flex-1 bg-surface-3 rounded-lg px-3 py-2 flex items-center gap-2">
                  <Icon name="Link" size={13} className="text-neon-cyan" />
                  <span className="text-sm font-mono font-medium text-foreground tracking-widest">{shareCode}</span>
                </div>
                <button
                  onClick={handleCopy}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 ${
                    copied ? "bg-neon-cyan text-background" : "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20"
                  }`}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="flex gap-2 mt-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-surface-3 text-xs text-foreground">
                  <Icon name="MessageCircle" size={12} className="text-neon-cyan" />
                  WhatsApp
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-surface-3 text-xs text-foreground">
                  <Icon name="Send" size={12} className="text-accent" />
                  Telegram
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-surface-3 text-xs text-foreground">
                  <Icon name="Share2" size={12} className="text-neon-amber" />
                  More
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Friends on the road */}
        <div className="animate-fade-in delay-100">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Friends Nearby</p>
            <button className="flex items-center gap-1.5 text-xs text-neon-cyan">
              <Icon name="UserPlus" size={12} />
              Invite
            </button>
          </div>

          <div className="space-y-2">
            {FRIENDS.map((friend, i) => (
              <div
                key={friend.name}
                className="glass rounded-2xl p-3 flex items-center gap-3 animate-fade-in"
                style={{ animationDelay: `${0.1 + i * 0.07}s` }}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${friend.color} flex items-center justify-center text-white font-bold text-base`}>
                    {friend.initial}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${
                    friend.status === "online" ? "bg-neon-cyan" : "bg-surface-3"
                  }`} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-foreground truncate">{friend.name}</p>
                    {friend.sharing && (
                      <span className="text-[9px] bg-neon-cyan/10 text-neon-cyan px-1.5 py-0.5 rounded-full font-medium flex-shrink-0">LIVE</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="MapPin" size={10} className={friend.status === "online" ? "text-neon-cyan" : "text-muted-foreground"} />
                    <p className="text-xs text-muted-foreground truncate">{friend.location}</p>
                  </div>
                  {friend.eta && (
                    <p className="text-xs text-neon-cyan font-medium mt-0.5">{friend.eta}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  {friend.sharing && (
                    <button className="w-8 h-8 rounded-lg bg-neon-cyan/10 flex items-center justify-center transition-all active:scale-90">
                      <Icon name="Navigation" size={13} className="text-neon-cyan" />
                    </button>
                  )}
                  <button className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center transition-all active:scale-90">
                    <Icon name="MessageCircle" size={13} className="text-muted-foreground" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Group session */}
        <div className="glass rounded-2xl p-4 border border-neon-violet/20 animate-fade-in delay-300">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center">
              <Icon name="Users" size={16} className="text-accent" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Group Session</p>
              <p className="text-xs text-muted-foreground">Coordinate with your crew</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-accent animate-ping-slow" />
              <span className="text-xs text-accent font-medium">
                {FRIENDS.filter(f => f.sharing).length} active
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button className="py-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent text-xs font-medium flex items-center justify-center gap-1.5 transition-all active:scale-95">
              <Icon name="Siren" size={13} />
              Send Alert
            </button>
            <button className="py-2.5 rounded-xl bg-surface-2 text-foreground text-xs font-medium flex items-center justify-center gap-1.5 transition-all active:scale-95">
              <Icon name="MapPin" size={13} className="text-neon-cyan" />
              Meet Here
            </button>
            <button className="py-2.5 rounded-xl bg-surface-2 text-foreground text-xs font-medium flex items-center justify-center gap-1.5 transition-all active:scale-95">
              <Icon name="Coffee" size={13} className="text-neon-amber" />
              Find Pit Stop
            </button>
            <button className="py-2.5 rounded-xl bg-surface-2 text-foreground text-xs font-medium flex items-center justify-center gap-1.5 transition-all active:scale-95">
              <Icon name="Route" size={13} className="text-accent" />
              Sync Route
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
