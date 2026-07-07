import { useState, useEffect } from "react";
import { 
  Cpu, 
  Settings, 
  Activity, 
  Flame, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  Wrench,
  TrendingUp,
  RotateCcw
} from "lucide-react";

interface MachineState {
  id: string;
  name: string;
  type: string;
  status: "Running" | "Idle" | "Maintenance" | "Failure";
  temperature: number; // °C
  runningHours: number;
  healthScore: number; // %
  failurePrediction: string;
  maintenanceSchedule: string;
}

export default function MachineHealth() {
  const [machines, setMachines] = useState<MachineState[]>([
    {
      id: "M-101",
      name: "Robotic Assembly Arm FA-01",
      type: "Precision Robot",
      status: "Running",
      temperature: 64.2,
      runningHours: 2450,
      healthScore: 94,
      failurePrediction: "Low risk (12% in 30 days)",
      maintenanceSchedule: "2026-07-02"
    },
    {
      id: "M-102",
      name: "Conveyor Belt Motor MC-03",
      type: "Asynchronous Motor",
      status: "Running",
      temperature: 88.5,
      runningHours: 4120,
      healthScore: 72,
      failurePrediction: "High risk (84% in 7 days - Bearing worn)",
      maintenanceSchedule: "2026-06-28"
    },
    {
      id: "M-103",
      name: "Hydraulic Forging Press HP-12",
      type: "Heavy Press",
      status: "Idle",
      temperature: 32.1,
      runningHours: 1840,
      healthScore: 98,
      failurePrediction: "Low risk (<5%)",
      maintenanceSchedule: "2026-07-15"
    },
    {
      id: "M-104",
      name: "Pneumatic Clamping Grid PC-05",
      type: "Solenoid Valve Array",
      status: "Maintenance",
      temperature: 24.5,
      runningHours: 940,
      healthScore: 88,
      failurePrediction: "Scheduled service in progress",
      maintenanceSchedule: "In Progress"
    }
  ]);

  // Simulate real-time temperature fluctuations
  useEffect(() => {
    const timer = setInterval(() => {
      setMachines(prev => prev.map(m => {
        if (m.status === "Running") {
          // Fluctuating slightly
          const change = (Math.random() - 0.5) * 1.5;
          return { ...m, temperature: Math.min(120, Math.max(40, m.temperature + change)) };
        }
        return m;
      }));
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const toggleMaintenance = (id: string) => {
    setMachines(prev => prev.map(m => {
      if (m.id === id) {
        const isMaint = m.status === "Maintenance";
        return {
          ...m,
          status: isMaint ? "Running" : "Maintenance",
          healthScore: isMaint ? 95 : m.healthScore,
          temperature: isMaint ? 45.0 : 25.0
        };
      }
      return m;
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Running":
        return "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30";
      case "Idle":
        return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
      case "Maintenance":
        return "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/30";
      case "Failure":
      default:
        return "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics Banner Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Maintained Nodes</span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{machines.length} Units</span>
          </div>
          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <Cpu className="h-5 w-5 text-slate-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Currently Running</span>
            <span className="text-2xl font-black text-emerald-500">
              {machines.filter(m => m.status === "Running").length} Units
            </span>
          </div>
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
            <Activity className="h-5 w-5 text-emerald-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Average Health Rating</span>
            <span className="text-2xl font-black text-cyan-500">
              {Math.round(machines.reduce((acc, m) => acc + m.healthScore, 0) / machines.length)}%
            </span>
          </div>
          <div className="p-2 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg">
            <TrendingUp className="h-5 w-5 text-cyan-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Undergoing Service</span>
            <span className="text-2xl font-black text-purple-600">
              {machines.filter(m => m.status === "Maintenance").length} Nodes
            </span>
          </div>
          <div className="p-2 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
            <Wrench className="h-5 w-5 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Main Grid of interactive Machine Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {machines.map((m) => {
          const isHot = m.temperature > 85;
          const isFailing = m.healthScore < 80;

          return (
            <div 
              key={m.id}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm transition-all flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 ${
                isFailing ? "border-l-4 border-l-rose-500" : m.status === "Maintenance" ? "border-l-4 border-l-purple-500" : "border-slate-200 dark:border-slate-800"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{m.id} • {m.type}</span>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-display mt-0.5">{m.name}</h4>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${getStatusBadge(m.status)}`}>
                    {m.status.toUpperCase()}
                  </span>
                </div>

                {/* Machine Telemetry Grid */}
                <div className="grid grid-cols-3 gap-4 py-3 border-y border-slate-50 dark:border-slate-800">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 font-bold block">OPERATING TEMP</span>
                    <span className={`text-sm font-black mt-1 block font-mono ${isHot ? "text-rose-500" : "text-slate-700 dark:text-slate-200"}`}>
                      {m.temperature.toFixed(1)}°C
                    </span>
                  </div>
                  <div className="text-center border-x border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold block">RUNNING HOURS</span>
                    <span className="text-sm font-black text-slate-700 dark:text-slate-200 mt-1 block font-mono">
                      {m.runningHours} hrs
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 font-bold block">HEALTH SCORE</span>
                    <span className={`text-sm font-black mt-1 block font-mono ${isFailing ? "text-rose-500" : "text-emerald-500"}`}>
                      {m.healthScore}%
                    </span>
                  </div>
                </div>

                {/* Maintenance details */}
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <p className="flex justify-between">
                    <span>Next Maintenance Target:</span>
                    <strong className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {m.maintenanceSchedule}
                    </strong>
                  </p>
                  <p className="flex justify-between">
                    <span>Failure Risk Estimation:</span>
                    <strong className={`flex items-center gap-1 ${isFailing ? "text-rose-500" : "text-slate-700 dark:text-slate-300"}`}>
                      {isFailing && <AlertTriangle className="h-3.5 w-3.5 animate-bounce text-rose-500" />}
                      {m.failurePrediction}
                    </strong>
                  </p>
                </div>
              </div>

              {/* Functional Toggles */}
              <div className="flex gap-2 mt-5 pt-4 border-t border-slate-50 dark:border-slate-800">
                <button 
                  onClick={() => toggleMaintenance(m.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    m.status === "Maintenance" 
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm" 
                      : "bg-slate-50 hover:bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <Wrench className="h-3.5 w-3.5" />
                  {m.status === "Maintenance" ? "Complete Maintenance" : "Request Maintenance"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
