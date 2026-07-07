import { useState, useEffect } from "react";
import { 
  Cctv, 
  User, 
  CircleAlert, 
  Check, 
  Play, 
  Video, 
  UserCheck, 
  Clock, 
  PlusCircle, 
  Eye,
  AlertTriangle
} from "lucide-react";
import { Camera, WorkerProfile, SystemAlert } from "../types.ts";
import DigitalTwin from "./DigitalTwin.tsx";

interface LiveMonitoringProps {
  cameras: Camera[];
  workers: WorkerProfile[];
  alerts: SystemAlert[];
  onResolveAlert: (id: string) => void;
  onNavigateToWorker: (workerId: string) => void;
}

export default function LiveMonitoring({ 
  cameras, 
  workers, 
  alerts, 
  onResolveAlert,
  onNavigateToWorker
}: LiveMonitoringProps) {
  const [selectedCam, setSelectedCam] = useState<Camera>(cameras[0]);
  const [isLive, setIsLive] = useState(true);
  const [viewMode, setViewMode] = useState<"feed" | "twin">("feed");

  // Auto-sync selection if cameras list updates
  useEffect(() => {
    const updated = cameras.find(c => c.id === selectedCam.id);
    if (updated) setSelectedCam(updated);
  }, [cameras]);

  // Find the worker assigned to the active workstation of this camera
  const activeWorker = workers.find(w => w.workstation === selectedCam.workstation && w.status === "Active");

  // Get active alerts for the selected camera
  const cameraAlerts = alerts.filter(a => a.cameraName === selectedCam.name && a.status === "Unresolved");

  // Simulated visual detection steps based on camera location
  const getCameraMockDetections = (camId: string) => {
    switch (camId) {
      case "CAM-01": // Assembly A
        return [
          { label: "Operator - Marcus Vance", box: "top-[15%] left-[20%] w-[45%] h-[75%]", status: "success", labelText: "Operator (Marcus) | PPE: VERIFIED" },
          { label: "Helmet Detected", box: "top-[18%] left-[38%] w-[12%] h-[15%]", status: "success", labelText: "Hard Hat: ON" },
          { label: "Fixture Workspace", box: "top-[45%] left-[50%] w-[35%] h-[40%]", status: "info", labelText: "Active Assembly (BOLT-ASM)" }
        ];
      case "CAM-02": // QC Control
        return [
          { label: "Operator - Elena Rostova", box: "top-[10%] left-[25%] w-[40%] h-[80%]", status: "success", labelText: "Operator (Elena) | PPE: VERIFIED" },
          { label: "Glasses Detected", box: "top-[15%] left-[42%] w-[10%] h-[10%]", status: "success", labelText: "Safety Glasses: ON" }
        ];
      case "CAM-03": // Assembly B - Alerting!
        return [
          { label: "Operator - Devlin Patel", box: "top-[20%] left-[15%] w-[45%] h-[70%]", status: "danger", labelText: "Operator (Devlin) | PPE BREACH" },
          { label: "PPE Violation - Helmet Missing", box: "top-[22%] left-[32%] w-[15%] h-[18%]", status: "danger", labelText: "MISSING HARD HAT" }
        ];
      case "CAM-04": // Packaging
      default:
        return [
          { label: "Pallet Stack Zone", box: "top-[30%] left-[40%] w-[50%] h-[60%]", status: "success", labelText: "Pallet Stacker Unit" }
        ];
    }
  };

  // Mock activity sequence log for the camera
  const getCameraTimeline = (camId: string) => {
    switch (camId) {
      case "CAM-01":
        return [
          { time: "08:34:12", event: "Step Complete", desc: "Sequence 'Torque Check' matched standard sequence (Duration: 4.5s)", type: "success" },
          { time: "08:33:55", event: "Alignment OK", desc: "Part 'Upper Flange' aligned perfectly with fixture slot", type: "success" },
          { time: "08:33:40", event: "Bolt Fastened", desc: "Pneumatic fastener torque threshold verified at 42 Nm", type: "success" }
        ];
      case "CAM-02":
        return [
          { time: "08:24:55", event: "QC Step Check", desc: "Printed Circuit Board functional probe complete (Pass)", type: "success" },
          { time: "08:24:12", event: "Optical Scan", desc: "Visual solder paste inspection completed. No bridges found.", type: "success" },
          { time: "08:23:40", event: "Part Registered", desc: "QR Code label scanned successfully (ID: PCB-0042183)", type: "info" }
        ];
      case "CAM-03":
        return [
          { time: "08:02:18", event: "AI Telemetry Alert", desc: "Hard Hat Violation: Operator entered workstation boundary without safety helmet", type: "error" },
          { time: "08:00:00", event: "Station Idle", desc: "Workstation logged as inactive (Operator awaiting fasteners resupply)", type: "warning" }
        ];
      default:
        return [
          { time: "08:12:44", event: "Carton Stacked", desc: "Robot stacker aligned carton layer #4 on pallet", type: "success" },
          { time: "08:11:55", event: "Scan Complete", desc: "Outbound shipment code tracked: PLT-94827", type: "info" }
        ];
    }
  };

  const detections = getCameraMockDetections(selectedCam.id);
  const timeline = getCameraTimeline(selectedCam.id);

  return (
    <div className="space-y-8">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-slate-950 tracking-tight">AI Live Monitoring</h1>
          <p className="text-slate-500 text-sm mt-1">Live computer vision pipeline overlaying active PPE, worker boundary checks, and sequential work verification.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button 
              onClick={() => setViewMode("feed")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${viewMode === "feed" ? "bg-cyan-600 text-white shadow-sm" : "text-slate-500"}`}
            >
              CCTV FEEDS
            </button>
            <button 
              onClick={() => setViewMode("twin")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${viewMode === "twin" ? "bg-cyan-600 text-white shadow-sm" : "text-slate-500"}`}
            >
              DIGITAL TWIN
            </button>
          </div>
          {viewMode === "feed" && (
            <button 
              onClick={() => setIsLive(!isLive)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer ${
                isLive 
                  ? "bg-red-50 text-red-600 border-red-200" 
                  : "bg-slate-50 text-slate-600 border-slate-200"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${isLive ? "bg-red-500 animate-ping" : "bg-slate-400"}`} />
              {isLive ? "PAUSE LIVE OVERLAY" : "RESUME OVERLAY"}
            </button>
          )}
        </div>
      </div>

      {viewMode === "twin" ? (
        <DigitalTwin workers={workers} cameras={cameras} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left feeds column (Col span 3) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Main Selected Live Feed Display */}
          <div className="bg-slate-900 rounded-2xl overflow-hidden relative border border-slate-800 shadow-xl group">
            
            {/* Aspect Ratio Screen */}
            <div className="aspect-video w-full bg-slate-950 relative flex items-center justify-center">
              
              {/* Scanline Animation overlay to look realistic */}
              <div className="absolute inset-0 bg-linear-to-b from-transparent via-cyan-500/5 to-transparent h-full w-full opacity-35 pointer-events-none animate-scanline z-10" />

              {/* High Tech Reticle/Grid Overlay */}
              <div className="absolute inset-0 border-[16px] border-transparent border-t-cyan-500/10 border-b-cyan-500/10 pointer-events-none" />

              {/* Simulated Camera Feed Image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-slate-950 opacity-20" />
                <img 
                  src={
                    selectedCam.id === "CAM-01" 
                      ? "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80" // factory worker
                      : selectedCam.id === "CAM-02"
                      ? "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80" // qc inspection
                      : selectedCam.id === "CAM-03"
                      ? "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=800&auto=format&fit=crop&q=80" // heavy assembly line B
                      : "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80" // warehouse/packaging
                  } 
                  alt={selectedCam.name} 
                  className="w-full h-full object-cover select-none filter contrast-115 brightness-95" 
                />
              </div>

              {/* Dynamic CV Detections Bounding Boxes */}
              {isLive && detections.map((det, index) => (
                <div 
                  key={index} 
                  className={`absolute rounded border-2 z-10 flex flex-col justify-start transition-all duration-300 ${det.box} ${
                    det.status === "success" 
                      ? "border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] bg-emerald-500/5" 
                      : det.status === "danger"
                      ? "border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.45)] bg-red-500/5 animate-pulse"
                      : "border-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.2)] bg-cyan-500/5"
                  }`}
                >
                  <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 text-white ${
                    det.status === "success" ? "bg-emerald-500" : det.status === "danger" ? "bg-red-500" : "bg-cyan-500"
                  }`}>
                    {det.labelText}
                  </span>
                </div>
              ))}

              {/* Camera Metadata Overlay */}
              <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-2 text-white font-mono text-[10px] z-10">
                <Cctv className="h-3.5 w-3.5 text-cyan-400" />
                <span>{selectedCam.id}</span>
                <span className="text-slate-500">|</span>
                <span>ZONE: {selectedCam.zone.toUpperCase()}</span>
                <span className="text-slate-500">|</span>
                <span className={selectedCam.status === "Alerting" ? "text-red-400 font-bold" : "text-emerald-400"}>
                  {selectedCam.status.toUpperCase()}
                </span>
              </div>

              {/* Timestamp Overlay */}
              <div className="absolute bottom-4 left-4 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-white font-mono text-[10px] z-10">
                REC ● {selectedCam.resolution} | {selectedCam.fps} FPS | UPTIME: {selectedCam.recordingUptime}%
              </div>

              {/* Recording Dot */}
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 text-white font-bold font-mono text-[9px] px-2.5 py-1 rounded-md shadow-lg animate-pulse z-10">
                <span className="h-2 w-2 rounded-full bg-white" />
                RECORDING
              </div>
            </div>

            {/* Controls Bar */}
            <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between text-slate-300">
              <div className="flex items-center gap-3">
                <button className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
                  <Play className="h-4 w-4" />
                </button>
                <div className="text-xs font-semibold">{selectedCam.name}</div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Video className="h-3.5 w-3.5 text-cyan-500" />
                <span>Stream ID: cv-rtsp-{selectedCam.id.toLowerCase()}</span>
              </div>
            </div>
          </div>

          {/* Quick Mini Cam Swapper Feed Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cameras.map((cam) => {
              const isSelected = selectedCam.id === cam.id;
              const hasAlert = cam.status === "Alerting";
              return (
                <div 
                  key={cam.id}
                  onClick={() => setSelectedCam(cam)}
                  className={`bg-white rounded-xl overflow-hidden border p-2 cursor-pointer transition-all ${
                    isSelected 
                      ? "border-cyan-500 ring-2 ring-cyan-100" 
                      : "border-slate-200 hover:border-slate-300"
                  } ${hasAlert ? "border-red-400 bg-red-50/10" : ""}`}
                >
                  <div className="aspect-video rounded-lg bg-slate-900 relative overflow-hidden flex items-center justify-center">
                    <img 
                      src={
                        cam.id === "CAM-01" 
                          ? "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&auto=format&fit=crop&q=80" 
                          : cam.id === "CAM-02"
                          ? "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200&auto=format&fit=crop&q=80"
                          : cam.id === "CAM-03"
                          ? "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=200&auto=format&fit=crop&q=80"
                          : "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&auto=format&fit=crop&q=80"
                      } 
                      alt={cam.name} 
                      className="w-full h-full object-cover filter brightness-75 grayscale-25" 
                    />
                    {hasAlert && (
                      <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center z-10 animate-pulse">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                      </div>
                    )}
                    <span className="absolute bottom-1 left-1 px-1 bg-slate-900/85 text-white font-mono text-[8px] rounded border border-slate-700">
                      {cam.id}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 px-1">
                    <span className="text-[10px] font-bold text-slate-700 truncate block w-24">{cam.name}</span>
                    <span className={`h-1.5 w-1.5 rounded-full ${cam.status === "Active" ? "bg-emerald-500" : cam.status === "Offline" ? "bg-slate-300" : "bg-red-500 animate-ping"}`} />
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right side panel: Selected worker details and Camera Alerts */}
        <div className="space-y-6">
          
          {/* Active Operator Panel */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h3 className="font-display font-semibold text-sm text-slate-950 flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <UserCheck className="h-4.5 w-4.5 text-cyan-600" />
              Station Operator Info
            </h3>

            {activeWorker ? (
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full overflow-hidden border border-slate-200">
                    <img src={activeWorker.avatar} alt={activeWorker.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{activeWorker.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">ID: {activeWorker.id}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Workstation</span>
                    <span className="font-semibold text-slate-700 mt-0.5 block">{selectedCam.workstation}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Efficiency</span>
                    <span className="font-semibold text-cyan-600 mt-0.5 block">{activeWorker.productivityScore}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Cycle Benchmark</span>
                    <span className="font-semibold text-slate-700 mt-0.5 block">{activeWorker.averageCycleTime}s</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Completed</span>
                    <span className="font-semibold text-slate-700 mt-0.5 block">{activeWorker.completedTasks} units</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Operator Status</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    activeWorker.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                  }`}>
                    ● {activeWorker.status} on production floor
                  </span>
                </div>

                <button 
                  onClick={() => onNavigateToWorker(activeWorker.id)}
                  className="w-full text-center py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  View Performance History
                </button>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                No active operator registered at workstation {selectedCam.workstation} for this camera angle.
              </div>
            )}
          </div>

          {/* Camera Timeline / Event Log */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h3 className="font-display font-semibold text-sm text-slate-950 flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <Clock className="h-4.5 w-4.5 text-purple-600" />
              RTSP Process Log
            </h3>

            <div className="mt-4 space-y-4">
              {timeline.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs pb-3 border-b border-slate-50 last:border-b-0 last:pb-0">
                  <span className={`h-1.5 w-1.5 rounded-full mt-1.5 shrink-0 ${
                    item.type === "success" ? "bg-emerald-500" : item.type === "warning" ? "bg-amber-500" : item.type === "error" ? "bg-red-500" : "bg-cyan-500"
                  }`} />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-700">{item.event}</span>
                      <span className="font-mono text-[9px] text-slate-400">{item.time}</span>
                    </div>
                    <p className="text-slate-500 text-[10px] mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Alerts for this Camera */}
          {cameraAlerts.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4.5">
              <div className="flex items-center gap-2 text-red-700 font-display font-semibold text-xs border-b border-red-100 pb-2.5">
                <CircleAlert className="h-4 w-4 text-red-500 shrink-0" />
                Active Alerts ({cameraAlerts.length})
              </div>
              <div className="mt-3 space-y-3">
                {cameraAlerts.map((alert) => (
                  <div key={alert.id} className="text-xs">
                    <p className="font-semibold text-red-800">{alert.message}</p>
                    <div className="flex items-center justify-between mt-2.5">
                      <span className="text-[10px] font-mono text-red-600">ID: {alert.id}</span>
                      <button 
                        onClick={() => onResolveAlert(alert.id)}
                        className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-[10px] transition-colors cursor-pointer"
                      >
                        Resolve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
      )}
    </div>
  );
}
