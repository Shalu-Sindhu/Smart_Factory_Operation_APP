import { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  ShieldAlert, 
  UserCheck, 
  UserMinus, 
  AlertTriangle, 
  Activity, 
  Flame, 
  Eye, 
  Settings,
  Zap,
  CheckCircle,
  HelpCircle
} from "lucide-react";
import { SystemAlert } from "../types.ts";

interface SafetyMonitoringProps {
  onTriggerAlert: (alert: Partial<SystemAlert>) => void;
}

export default function SafetyMonitoring({ onTriggerAlert }: SafetyMonitoringProps) {
  const [helmetRate, setHelmetRate] = useState(94);
  const [vestRate, setVestRate] = useState(97);
  const [ppeCompliant, setPpeCompliant] = useState(92);
  const [crowdingCount, setCrowdingCount] = useState(0);
  const [recentSafetyEvents, setRecentSafetyEvents] = useState([
    { id: "S-501", event: "Helmet Compliance Drop", zone: "Assembly Zone B", timestamp: "12:54:12", status: "Critical", score: "84%" },
    { id: "S-502", event: "Unauthorized Restricted Zone Entry", zone: "Forging Cell", timestamp: "12:48:00", status: "High Risk", score: "1 Worker" },
    { id: "S-503", event: "Dangerous Posture Detected", zone: "Loading Dock A", timestamp: "11:24:15", status: "Warning", score: "Ergonomic risk" },
    { id: "S-504", event: "Crowding Violation Cleared", zone: "Break Lounge Corner", timestamp: "10:15:30", status: "Clear", score: "Normal" }
  ]);

  // Simulate safety violations occasionally
  useEffect(() => {
    const timer = setInterval(() => {
      // Small jiggle in compliance scores
      setHelmetRate(prev => Math.min(100, Math.max(80, prev + (Math.random() > 0.5 ? 1 : -1))));
      setVestRate(prev => Math.min(100, Math.max(80, prev + (Math.random() > 0.5 ? 1 : -1))));
      setPpeCompliant(prev => Math.min(100, Math.max(80, prev + (Math.random() > 0.5 ? 0.5 : -0.5))));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Simulator Triggers
  const triggerSimulation = (type: "no-helmet" | "no-vest" | "unauthorized" | "fall" | "slip" | "posture") => {
    let message = "";
    let severity: "High" | "Medium" | "Low" = "High";
    let alertType: "Safety Violation" | "Process Deviation" | "Downtime Warning" | "Inactivity" = "Safety Violation";
    let zone = "Assembly Line Alpha";

    switch (type) {
      case "no-helmet":
        message = "No protective hard-hat/helmet detected on active worker";
        zone = "Assembly Zone B";
        severity = "High";
        break;
      case "no-vest":
        message = "Safety vest mismatch or lack of high-visibility vest detected";
        zone = "Packing Yard";
        severity = "Medium";
        break;
      case "unauthorized":
        message = "Intrusion Alert: Worker entered restricted chemical wash corridor";
        zone = "Forging Cell";
        severity = "High";
        break;
      case "fall":
        message = "CRITICAL: Worker fall detected. AI model registered high-speed deceleration signature.";
        zone = "Loading Dock A";
        severity = "High";
        break;
      case "slip":
        message = "AI safety trigger: Slipping incident registered at heavy pressing aisle";
        zone = "Forging Cell";
        severity = "High";
        break;
      case "posture":
        message = "Ergonomic Warning: Repeated bad lifting posture detected at conveyor C";
        zone = "Warehouse Racks";
        severity = "Low";
        alertType = "Safety Violation";
        break;
    }

    // Call callback to add global alert
    onTriggerAlert({
      cameraName: `AI Optima-Safety Lens`,
      zone,
      type: alertType,
      severity,
      message,
      timestamp: new Date().toLocaleTimeString()
    });

    // Update safety events list
    setRecentSafetyEvents(prev => [
      {
        id: `S-${Math.floor(Math.random() * 900) + 600}`,
        event: message,
        zone,
        timestamp: new Date().toLocaleTimeString(),
        status: severity === "High" ? "Critical" : severity === "Medium" ? "Warning" : "Information",
        score: "AI Auto-Detected"
      },
      ...prev.slice(0, 5)
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Simulation triggers & dashboard metrics */}
      <div className="bg-gradient-to-br from-indigo-50/70 via-cyan-50/20 to-white dark:from-slate-900/40 dark:to-slate-950 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 font-display flex items-center gap-2">
              <ShieldCheck className="h-5.5 w-5.5 text-indigo-600 dark:text-indigo-400" />
              AI PPE compliance & Hazard Detection Simulator
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Inject simulated real-time visual safety incidents to trigger immediate warnings and system logs.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={() => triggerSimulation("no-helmet")}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 text-rose-700 dark:text-rose-400 border border-rose-200/50 rounded-xl text-[10px] font-bold cursor-pointer transition-colors"
            >
              No Helmet
            </button>
            <button 
              onClick={() => triggerSimulation("no-vest")}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/20 dark:hover:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200/50 rounded-xl text-[10px] font-bold cursor-pointer transition-colors"
            >
              No Vest
            </button>
            <button 
              onClick={() => triggerSimulation("unauthorized")}
              className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/20 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-200/50 rounded-xl text-[10px] font-bold cursor-pointer transition-colors"
            >
              Intrusion
            </button>
            <button 
              onClick={() => triggerSimulation("fall")}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[10px] font-bold cursor-pointer transition-colors shadow-sm"
            >
              Detect Fall
            </button>
            <button 
              onClick={() => triggerSimulation("slip")}
              className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-[10px] font-bold cursor-pointer transition-colors shadow-sm"
            >
              Detect Slip
            </button>
            <button 
              onClick={() => triggerSimulation("posture")}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-[10px] font-bold cursor-pointer transition-colors shadow-sm"
            >
              Bad Posture
            </button>
          </div>
        </div>

        {/* Real-time compliance gauges row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 border-t border-slate-100 dark:border-slate-800 pt-5">
          <div className="bg-white dark:bg-slate-900 p-4.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Helmet Compliance Rate</span>
            <div className="relative h-24 w-24 flex items-center justify-center">
              <svg viewBox="0 0 36 36" className="w-24 h-24">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#F1F5F9" className="dark:stroke-slate-800" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#4F46E5" strokeWidth="3" strokeDasharray={`${helmetRate}, 100`} strokeLinecap="round" />
              </svg>
              <span className="absolute text-xl font-black text-slate-800 dark:text-slate-100">{helmetRate}%</span>
            </div>
            <span className="text-[10px] text-indigo-600 font-bold uppercase mt-2">Active Laser Scan</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">High-Viz Vest Compliance</span>
            <div className="relative h-24 w-24 flex items-center justify-center">
              <svg viewBox="0 0 36 36" className="w-24 h-24">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#F1F5F9" className="dark:stroke-slate-800" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#06B6D4" strokeWidth="3" strokeDasharray={`${vestRate}, 100`} strokeLinecap="round" />
              </svg>
              <span className="absolute text-xl font-black text-slate-800 dark:text-slate-100">{vestRate}%</span>
            </div>
            <span className="text-[10px] text-cyan-500 font-bold uppercase mt-2">Zone C Camera Grid</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Total Combined Safety Index</span>
            <div className="relative h-24 w-24 flex items-center justify-center">
              <svg viewBox="0 0 36 36" className="w-24 h-24">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#F1F5F9" className="dark:stroke-slate-800" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray={`${ppeCompliant}, 100`} strokeLinecap="round" />
              </svg>
              <span className="absolute text-xl font-black text-slate-800 dark:text-slate-100">{ppeCompliant}%</span>
            </div>
            <span className="text-[10px] text-emerald-500 font-bold uppercase mt-2">Compliant Shield</span>
          </div>
        </div>
      </div>

      {/* Safety Matrix (Helmet, Vest, Posture, Slips & Crowding indicators) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Detection Metrics */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4 lg:col-span-1">
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-100 font-display text-sm">AI Safety Parameters</h4>
            <p className="text-xs text-slate-400">Status of real-time computer vision models</p>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Helmet Detection Model</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded">99.8% ACC</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Hi-Viz Vest Model</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded">99.2% ACC</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
              <div className="flex items-center gap-2.5">
                <Activity className="h-4.5 w-4.5 text-cyan-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Posture Correction Analyzer</span>
              </div>
              <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 dark:bg-cyan-950/20 px-2 py-0.5 rounded">95.4% ACC</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="h-4.5 w-4.5 text-amber-500 animate-bounce" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Fall & Slip Acceleration Sensor</span>
              </div>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded">98.1% ACC</span>
            </div>
          </div>
        </div>

        {/* Live Safety Stream Event Logs */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 font-display text-sm">Recent AI Safety Logs</h4>
              <p className="text-xs text-slate-400">Incidents logged by live video stream analysis</p>
            </div>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-56 pr-1">
            {recentSafetyEvents.map((evt) => (
              <div key={evt.id} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg shrink-0 ${
                    evt.status === "Critical" 
                      ? "bg-rose-50 text-rose-600 dark:bg-rose-950/30" 
                      : evt.status === "Warning" 
                      ? "bg-amber-50 text-amber-600 dark:bg-amber-950/30" 
                      : "bg-slate-100 text-slate-500"
                  }`}>
                    {evt.status === "Critical" ? <ShieldAlert className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight">{evt.event}</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Location: {evt.zone} • {evt.timestamp}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                    evt.status === "Critical" 
                      ? "bg-rose-100 text-rose-700" 
                      : evt.status === "Warning" 
                      ? "bg-amber-100 text-amber-700" 
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}>
                    {evt.status}
                  </span>
                  <span className="text-[9px] font-mono font-semibold text-slate-400 block mt-1">{evt.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
