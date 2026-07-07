import { useState, useEffect } from "react";
import { 
  Cpu, 
  Users, 
  Cctv, 
  Eye, 
  ShieldAlert, 
  Play, 
  Pause, 
  Compass,
  Layers,
  MapPin,
  Clock,
  Zap,
  CheckCircle,
  AlertOctagon
} from "lucide-react";
import { WorkerProfile, Camera } from "../types.ts";

interface DigitalTwinProps {
  workers: WorkerProfile[];
  cameras: Camera[];
}

interface FactoryZone {
  id: string;
  name: string;
  type: "active" | "restricted" | "assembly" | "logistics";
  color: string;
  x: number; // grid percentage coordinate
  y: number;
  width: number;
  height: number;
  activity: string;
}

interface LiveNode {
  id: string;
  name: string;
  type: "worker" | "machine" | "camera";
  x: number;
  y: number;
  status: "active" | "idle" | "offline" | "alert";
  currentTask?: string;
  temperature?: number;
}

export default function DigitalTwin({ workers, cameras }: DigitalTwinProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [viewOverlay, setViewOverlay] = useState<"all" | "cameras" | "workers" | "safety">("all");
  const [nodes, setNodes] = useState<LiveNode[]>([]);
  
  const zones: FactoryZone[] = [
    { id: "Z-1", name: "Main Assembly Alpha", type: "assembly", color: "border-cyan-500 bg-cyan-500/5", x: 5, y: 10, width: 42, height: 35, activity: "Mechanical Integration" },
    { id: "Z-2", name: "Heavy Forging Restricted", type: "restricted", color: "border-rose-500 bg-rose-500/5", x: 52, y: 10, width: 42, height: 35, activity: "Thermal Hardening" },
    { id: "Z-3", name: "Quality Check & Packing", type: "active", color: "border-emerald-500 bg-emerald-500/5", x: 5, y: 55, width: 42, height: 35, activity: "Optical AI Sorting" },
    { id: "Z-4", name: "Loading Yard Logistics", type: "logistics", color: "border-purple-500 bg-purple-500/5", x: 52, y: 55, width: 42, height: 35, activity: "Automated Staging" }
  ];

  // Initialize nodes based on workers, cameras and machines
  useEffect(() => {
    const workerNodes: LiveNode[] = workers.map((w, idx) => ({
      id: w.id,
      name: w.name,
      type: "worker",
      // Place them inside their respective zones
      x: idx % 2 === 0 ? 15 + (idx * 6) % 25 : 60 + (idx * 5) % 25,
      y: idx < 3 ? 20 + (idx * 7) % 20 : 65 + (idx * 4) % 20,
      status: w.status === "Active" ? "active" : w.status === "Idle" ? "idle" : "offline",
      currentTask: w.shift
    }));

    const cameraNodes: LiveNode[] = cameras.map((c, idx) => ({
      id: c.id,
      name: c.name,
      type: "camera",
      x: idx === 0 ? 8 : idx === 1 ? 48 : idx === 2 ? 88 : idx === 3 ? 12 : 54,
      y: idx % 2 === 0 ? 8 : 50,
      status: c.status === "Alerting" ? "alert" : c.status === "Offline" ? "offline" : "active"
    }));

    const machineNodes: LiveNode[] = [
      { id: "M-1", name: "Robotic Arm Forge-01", type: "machine", x: 68, y: 22, status: "active", temperature: 74.5 },
      { id: "M-2", name: "Pneumatic Press PP-03", type: "machine", x: 25, y: 25, status: "active", temperature: 48.2 },
      { id: "M-3", name: "Labeling Station LS-12", type: "machine", x: 22, y: 72, status: "idle", temperature: 31.0 },
      { id: "M-4", name: "High-Speed Palletizer HP-09", type: "machine", x: 74, y: 76, status: "alert", temperature: 95.8 }
    ];

    setNodes([...workerNodes, ...cameraNodes, ...machineNodes]);
  }, [workers, cameras]);

  // Simulate real-time worker movement and machine temperature updates
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => {
        if (node.type === "worker" && node.status !== "offline") {
          // Add small random noise to make the twin feel alive
          const dx = (Math.random() - 0.5) * 1.5;
          const dy = (Math.random() - 0.5) * 1.5;
          const nextX = Math.max(5, Math.min(95, node.x + dx));
          const nextY = Math.max(5, Math.min(95, node.y + dy));
          return { ...node, x: nextX, y: nextY };
        }
        if (node.type === "machine") {
          // Jiggle temperatures slightly
          const tempDiff = (Math.random() - 0.5) * 1.2;
          return { ...node, temperature: Math.min(120, Math.max(20, (node.temperature || 40) + tempDiff)) };
        }
        return node;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const filteredNodes = nodes.filter(node => {
    if (viewOverlay === "all") return true;
    if (viewOverlay === "cameras") return node.type === "camera";
    if (viewOverlay === "workers") return node.type === "worker";
    if (viewOverlay === "safety") {
      // Show alerting or restricted nodes
      return node.status === "alert" || (node.type === "worker" && node.x >= 52 && node.y <= 45);
    }
    return true;
  });

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      {/* Floor Twin Visualiser View */}
      <div className="xl:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 font-display flex items-center gap-2">
              <Compass className="h-5 w-5 text-cyan-500 animate-spin" />
              Live 2D Digital Twin View
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Continuous spatial positioning and telemetry overlay</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 border border-slate-200 dark:border-slate-700 transition-colors"
              title={isPlaying ? "Pause simulations" : "Resume simulated feeds"}
            >
              {isPlaying ? <Pause className="h-4 w-4 text-cyan-600" /> : <Play className="h-4 w-4 text-emerald-600" />}
            </button>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800"></div>
            <div className="flex gap-1.5 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button 
                onClick={() => setViewOverlay("all")} 
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${viewOverlay === "all" ? "bg-cyan-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"}`}
              >
                ALL
              </button>
              <button 
                onClick={() => setViewOverlay("workers")} 
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${viewOverlay === "workers" ? "bg-cyan-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"}`}
              >
                OPERATORS
              </button>
              <button 
                onClick={() => setViewOverlay("cameras")} 
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${viewOverlay === "cameras" ? "bg-cyan-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"}`}
              >
                CAMERAS
              </button>
              <button 
                onClick={() => setViewOverlay("safety")} 
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${viewOverlay === "safety" ? "bg-rose-500 text-white shadow-sm" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"}`}
              >
                PPE SAFETY
              </button>
            </div>
          </div>
        </div>

        {/* 2D Grid Representation of Shop Floor */}
        <div className="relative aspect-[16/9] w-full bg-slate-50 dark:bg-slate-950 rounded-2xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden shadow-inner flex items-center justify-center">
          {/* Subtle Grid overlay lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35 dark:opacity-10 dark:bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)]" />

          {/* Zones Outline Overlay */}
          {zones.map(zone => (
            <div
              key={zone.id}
              onClick={() => setSelectedZone(zone.id === selectedZone ? null : zone.id)}
              style={{
                left: `${zone.x}%`,
                top: `${zone.y}%`,
                width: `${zone.width}%`,
                height: `${zone.height}%`
              }}
              className={`absolute border-2 border-dashed rounded-xl cursor-pointer transition-all flex flex-col justify-between p-3 group ${zone.color} ${
                selectedZone === zone.id ? "ring-2 ring-cyan-500 border-solid" : "hover:scale-[1.01]"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 group-hover:text-cyan-500">{zone.id}</span>
                  <h4 className="text-[11px] font-bold text-slate-700 dark:text-slate-300 leading-tight">{zone.name}</h4>
                </div>
                {zone.type === "restricted" && (
                  <span className="p-1 bg-rose-50 dark:bg-rose-950/20 rounded border border-rose-200 dark:border-rose-900/30 text-[9px] font-bold text-rose-500 flex items-center gap-1">
                    <ShieldAlert className="h-3 w-3" /> RESTRICTED
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 italic truncate">{zone.activity}</span>
            </div>
          ))}

          {/* Render Active Nodes (Workers, Machines, Cameras) */}
          {filteredNodes.map(node => {
            const isSelectedZoneNode = selectedZone ? (
              selectedZone === "Z-1" && node.x < 48 && node.y < 48 ||
              selectedZone === "Z-2" && node.x >= 48 && node.y < 48 ||
              selectedZone === "Z-3" && node.x < 48 && node.y >= 48 ||
              selectedZone === "Z-4" && node.x >= 48 && node.y >= 48
            ) : true;

            if (!isSelectedZoneNode) return null;

            return (
              <div
                key={node.id}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`
                }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-10"
              >
                {/* Visual node pin anchor */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border shadow-md transition-all ${
                  node.type === "camera" 
                    ? "bg-indigo-600 text-white border-indigo-500" 
                    : node.type === "machine"
                    ? "bg-slate-800 text-white border-slate-700 dark:bg-slate-700 dark:border-slate-600"
                    : node.status === "active"
                    ? "bg-cyan-500 text-white border-cyan-400"
                    : node.status === "idle"
                    ? "bg-amber-400 text-white border-amber-300"
                    : "bg-slate-400 text-white border-slate-300"
                } ${node.status === "alert" || (node.type === "machine" && (node.temperature || 0) > 90) ? "animate-pulse ring-4 ring-rose-500/50 bg-rose-600 border-rose-500" : ""}`}>
                  {node.type === "camera" ? (
                    <Cctv className="h-4 w-4" />
                  ) : node.type === "machine" ? (
                    <Cpu className="h-4 w-4" />
                  ) : (
                    <Users className="h-4 w-4" />
                  )}
                </div>

                {/* Node Label Popover Hover */}
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-2.5 py-1.5 rounded-lg text-[10px] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-20 shadow-xl space-y-0.5 min-w-[120px]">
                  <p className="font-bold border-b border-slate-800 pb-1 mb-1">{node.name}</p>
                  <p className="text-[9px] text-slate-300 flex justify-between">
                    <span>Type:</span> <strong className="uppercase">{node.type}</strong>
                  </p>
                  <p className="text-[9px] text-slate-300 flex justify-between">
                    <span>Status:</span> <strong className="uppercase">{node.status}</strong>
                  </p>
                  {node.temperature && (
                    <p className="text-[9px] text-slate-300 flex justify-between">
                      <span>Temp:</span> <strong className={node.temperature > 85 ? "text-rose-400 font-bold" : "text-emerald-400"}>{node.temperature.toFixed(1)}°C</strong>
                    </p>
                  )}
                  {node.currentTask && (
                    <p className="text-[9px] text-slate-300 flex justify-between">
                      <span>Activity:</span> <strong>{node.currentTask}</strong>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Twin Legend panel (Col span 1) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-5">
        <div>
          <h4 className="font-bold text-slate-800 dark:text-slate-100 font-display text-sm">Zone Analytics</h4>
          <p className="text-xs text-slate-400">Select any layout zone to view real-time data</p>
        </div>

        {selectedZone ? (
          (() => {
            const currentZone = zones.find(z => z.id === selectedZone);
            return (
              <div className="space-y-4 p-4.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-cyan-600 dark:text-cyan-400">{currentZone?.id}</span>
                  <button onClick={() => setSelectedZone(null)} className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold">CLOSE</button>
                </div>
                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">{currentZone?.name}</h5>
                <div className="space-y-2 border-t border-slate-200 dark:border-slate-700 pt-3 text-[11px] text-slate-600 dark:text-slate-300">
                  <p className="flex justify-between">
                    <span>Assigned Activity:</span> <strong className="text-slate-800 dark:text-slate-100">{currentZone?.activity}</strong>
                  </p>
                  <p className="flex justify-between">
                    <span>Target Speed:</span> <strong className="text-slate-800 dark:text-slate-100">45 cycles/hr</strong>
                  </p>
                  <p className="flex justify-between">
                    <span>Zone Health:</span> <strong className="text-emerald-500 font-bold">98.5%</strong>
                  </p>
                  <p className="flex justify-between">
                    <span>Risk Index:</span> <strong className={currentZone?.type === "restricted" ? "text-rose-500 font-bold" : "text-slate-500"}>{currentZone?.type === "restricted" ? "High" : "Low"}</strong>
                  </p>
                </div>
              </div>
            );
          })()
        ) : (
          <div className="p-4 bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 py-10">
            <MapPin className="h-6 w-6 text-slate-300 mx-auto mb-2" />
            Click on any zone highlighted in the canvas to load spatial telemetry.
          </div>
        )}

        {/* Legend block */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3.5">
          <h5 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Twin Identifiers</h5>
          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-cyan-500 border border-cyan-400"></span>
              <span>Operator (Active)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-amber-400 border border-amber-300"></span>
              <span>Operator (Idle)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
              <span>CCTV Node (Active)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-slate-800"></span>
              <span>Heavy Machinery Node</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 bg-rose-500/10 border-2 border-dashed border-rose-500 rounded"></span>
              <span>Restricted High-Hazard Zone</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
