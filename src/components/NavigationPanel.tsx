import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const STEPS = [
  { instruction: "Turn right onto 5th Avenue", distance: "0.3 mi", icon: "TurnRight" },
  { instruction: "Keep left on Broadway", distance: "1.2 mi", icon: "ArrowUp" },
  { instruction: "Turn left onto W 42nd St", distance: "0.5 mi", icon: "TurnLeft" },
  { instruction: "Merge onto I-495 E", distance: "3.1 mi", icon: "ArrowUpRight" },
  { instruction: "Take exit 11 toward Destination", distance: "0.2 mi", icon: "Navigation" },
  { instruction: "You have arrived", distance: "0 mi", icon: "MapPin" },
];

interface Props {
  destination: string;
  onStop: () => void;
}

export default function NavigationPanel({ destination, onStop }: Props) {
  const [stepIdx, setStepIdx] = useState(0);
  const [eta, setEta] = useState(24);
  const [distance, setDistance] = useState(5.3);
  const [speed, setSpeed] = useState(32);

  useEffect(() => {
    const t = setInterval(() => {
      setStepIdx((i) => Math.min(i + 1, STEPS.length - 1));
      setEta((e) => Math.max(0, e - 4));
      setDistance((d) => Math.max(0, +(d - 0.9).toFixed(1)));
      setSpeed(Math.floor(28 + Math.random() * 20));
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const currentStep = STEPS[stepIdx];
  const arrived = stepIdx === STEPS.length - 1;

  return (
    <>
      {/* Top turn instruction */}
      <div className="absolute top-0 left-0 right-0 z-20 px-4 pt-12 animate-slide-up">
        <div className={`glass rounded-2xl p-4 flex items-center gap-4 transition-all ${arrived ? "border border-neon-cyan/40 glow-cyan" : ""}`}>
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
            arrived ? "bg-neon-cyan" : "bg-surface-2"
          }`}>
            <Icon
              name={currentStep.icon as "ArrowUp"}
              size={26}
              className={arrived ? "text-background" : "text-neon-cyan"}
            />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-0.5">
              {arrived ? "Destination reached!" : `In ${currentStep.distance}`}
            </p>
            <p className="font-display font-bold text-base text-foreground leading-tight">
              {currentStep.instruction}
            </p>
          </div>
          {!arrived && (
            <div className="text-right flex-shrink-0">
              <p className="text-2xl font-display font-bold text-neon-cyan">{currentStep.distance.split(" ")[0]}</p>
              <p className="text-xs text-muted-foreground">{currentStep.distance.split(" ")[1]}</p>
            </div>
          )}
        </div>

        {/* Next step hint */}
        {stepIdx < STEPS.length - 2 && (
          <div className="mt-2 px-4 py-2.5 glass rounded-xl flex items-center gap-2 animate-fade-in">
            <span className="text-xs text-muted-foreground">Then:</span>
            <Icon name={STEPS[stepIdx + 1].icon as "ArrowUp"} size={14} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground flex-1 truncate">{STEPS[stepIdx + 1].instruction}</span>
          </div>
        )}
      </div>

      {/* Bottom stats bar */}
      <div className="absolute bottom-24 left-0 right-0 px-4 z-20 animate-slide-up delay-100">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-foreground">{eta}</p>
              <p className="text-xs text-muted-foreground">min</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-foreground">{distance}</p>
              <p className="text-xs text-muted-foreground">miles</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-neon-cyan">{speed}</p>
              <p className="text-xs text-muted-foreground">mph</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-sm font-medium text-foreground truncate max-w-[80px]">{destination}</p>
              <p className="text-xs text-muted-foreground">destination</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
            <div
              className="h-full route-line rounded-full transition-all duration-[4000ms] ease-linear"
              style={{ width: `${(stepIdx / (STEPS.length - 1)) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between mt-3">
            <button
              onClick={onStop}
              className="flex items-center gap-2 px-4 py-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl text-sm font-medium transition-all active:scale-95"
            >
              <Icon name="X" size={14} />
              End Route
            </button>
            <div className="flex gap-2">
              <button className="w-9 h-9 rounded-xl bg-surface-2 flex items-center justify-center transition-all active:scale-90">
                <Icon name="Volume2" size={16} className="text-foreground" />
              </button>
              <button className="w-9 h-9 rounded-xl bg-surface-2 flex items-center justify-center transition-all active:scale-90">
                <Icon name="Layers" size={16} className="text-foreground" />
              </button>
              <button className="w-9 h-9 rounded-xl bg-neon-cyan flex items-center justify-center transition-all active:scale-90">
                <Icon name="Navigation" size={16} className="text-background" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Speed limit badge */}
      <div className="absolute right-4 bottom-44 z-20 animate-fade-in delay-200">
        <div className="w-12 h-12 rounded-full border-4 border-white bg-white flex items-center justify-center shadow-xl">
          <span className="text-sm font-display font-black text-gray-900">35</span>
        </div>
        <p className="text-center text-[9px] text-muted-foreground mt-0.5">MPH</p>
      </div>
    </>
  );
}
