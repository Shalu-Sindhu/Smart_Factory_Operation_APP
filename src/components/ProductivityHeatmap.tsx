import { useState } from "react";
import { 
  Zap, 
  Clock, 
  MapPin, 
  BarChart, 
  Flame, 
  Grid, 
  Maximize2,
  AlertOctagon,
  TrendingDown,
  Circle
} from "lucide-react";

interface HeatZone {
  name: string;
  code: string;
  productivity: number; // percentage
  density: number; // movement score 1-10
  idleCount: number; // count
  utilization: number; // percentage
  congestion: "Low" | "Medium" | "High";
  color: string;
}

export default function ProductivityHeatmap() {
  const [activeMode, setActiveMode] = useState<"productivity" | "density" | "idle" | "utilization">("productivity");

  const zones: HeatZone[] = [
    { name: "Assembly Zone Alpha", code: "Z-1", productivity: 94, density: 9, idleCount: 1, utilization: 88, congestion: "High", color: "from-rose-500/20 to-orange-500/20" },
    { name: "Thermal Forging Cell", code: "Z-2", productivity: 78, density: 4, idleCount: 3, utilization: 65, congestion: "Low", color: "from-amber-500/10 to-amber-600/20" },
    { name: "AI Optical Check Dock", code: "Z-3", productivity: 99, density: 8, idleCount: 0, utilization: 94, congestion: "Medium", color: "from-emerald-500/20 to-teal-500/20" },
    { name: "Logistics Loading Yard", code: "Z-4", productivity: 85, density: 7, idleCount: 2, utilization: 79, congestion: "High", color: "from-purple-500/20 to-indigo-500/20" },
    { name: "Raw Material Buffer", code: "Z-5", productivity: 62, density: 2, idleCount: 5, utilization: 40, congestion: "Low", color: "from-slate-500/10 to-slate-600/10" },
    { name: "Maintenance Aisle B", code: "Z-6", productivity: 70, density: 3, idleCount: 4, utilization: 55, congestion: "Medium", color: "from-blue-500/10 to-cyan-500/10" }
  ];

  const getHeatValue = (zone: HeatZone) => {
    switch (activeMode) {
      case "productivity":
        return { val: `${zone.productivity}%`, label: "Productivity Score", color: zone.productivity > 90 ? "text-emerald-500 border-emerald-500 bg-emerald-500/10" : "text-amber-500 border-amber-500 bg-amber-500/10" };
      case "density":
        return { val: `${zone.density}/10`, label: "Movement Rate", color: "text-purple-500 border-purple-500 bg-purple-500/10" };
      case "idle":
        return { val: `${zone.idleCount} Operators`, label: "Idle Headcount", color: zone.idleCount > 2 ? "text-rose-500 border-rose-500 bg-rose-500/10" : "text-slate-500 border-slate-500 bg-slate-500/10" };
      case "utilization":
        return { val: `${zone.utilization}%`, label: "Machine Load", color: "text-cyan-500 border-cyan-500 bg-cyan-500/10" };
    }
  };

  return (
    <div className="space-y-6">
      {/* Selection layout overlay toggles */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 font-display text-sm flex items-center gap-1.5">
            <Flame className="h-4.5 w-4.5 text-orange-500 animate-pulse" />
            Productive Spatial Thermal Mapping
          </h3>
          <p className="text-xs text-slate-400">Interactive intensity visualizer for manufacturing lines</p>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button 
            onClick={() => setActiveMode("productivity")}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${activeMode === "productivity" ? "bg-orange-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"}`}
          >
            PRODUCTIVE ZONES
          </button>
          <button 
            onClick={() => setActiveMode("density")}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${activeMode === "density" ? "bg-orange-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"}`}
          >
            WORKER MOVEMENT
          </button>
          <button 
            onClick={() => setActiveMode("idle")}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${activeMode === "idle" ? "bg-orange-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"}`}
          >
            IDLE LOCATIONS
          </button>
          <button 
            onClick={() => setActiveMode("utilization")}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${activeMode === "utilization" ? "bg-orange-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"}`}
          >
            MACHINE LOAD
          </button>
        </div>
      </div>

      {/* Grid of thermal blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {zones.map((zone, idx) => {
          const modeData = getHeatValue(zone);
          return (
            <div 
              key={idx}
              className={`bg-gradient-to-br ${zone.color} border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:scale-[1.01] transition-transform relative group`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{zone.code}</span>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-display mt-0.5">{zone.name}</h4>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  zone.congestion === "High" ? "bg-rose-50 text-rose-700" : zone.congestion === "Medium" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-500"
                }`}>
                  {zone.congestion} congestion
                </span>
              </div>

              {/* Dynamic Heat value meter */}
              <div className="my-6">
                <span className="text-3xl font-black text-slate-800 dark:text-slate-100">{modeData.val}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase block mt-1">{modeData.label}</span>
              </div>

              {/* Slider simulation of density or load */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                  <span>THRESHOLD</span>
                  <span>95% TARGET</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${activeMode === "productivity" ? zone.productivity : activeMode === "utilization" ? zone.utilization : zone.density * 10}%` }}
                    className="h-full bg-orange-500 rounded-full"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Heatmap Insights banner */}
      <div className="bg-slate-50 dark:bg-slate-800/30 p-4.5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="flex items-center gap-3">
          <Maximize2 className="h-5 w-5 text-orange-500 animate-pulse shrink-0" />
          <p className="text-xs text-slate-600 dark:text-slate-300">
            <strong>Zone Congestion alert:</strong> Area <strong>Z-1</strong> is at maximum capacity with high operator density (9/10). Consider reallocating standard buffer operators.
          </p>
        </div>
      </div>
    </div>
  );
}
