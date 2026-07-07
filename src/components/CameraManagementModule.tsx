import { useState, FormEvent } from "react";
import { 
  Cctv, 
  PlusCircle, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Cpu, 
  Disc,
  Activity,
  Heart,
  Video
} from "lucide-react";
import { Camera } from "../types.ts";

interface CameraManagementModuleProps {
  cameras: Camera[];
  onRegisterCamera: (newCam: Partial<Camera>) => void;
  onUpdateCamera: (id: string, updated: Partial<Camera>) => void;
  userRole: string;
}

export default function CameraManagementModule({ 
  cameras, 
  onRegisterCamera, 
  onUpdateCamera,
  userRole
}: CameraManagementModuleProps) {
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [zone, setZone] = useState("Production Floor A");
  const [workstation, setWorkstation] = useState("");
  const [resolution, setResolution] = useState("1920x1080");
  const [fps, setFps] = useState("30");

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !workstation) return;

    onRegisterCamera({
      name,
      zone,
      workstation,
      resolution,
      fps: Number(fps)
    });

    // Reset Form
    setName("");
    setWorkstation("");
    setShowRegisterForm(false);
  };

  const handleToggleRecording = (camId: string, currentStatus: 'Recording' | 'Paused' | 'Stopped') => {
    const nextStatus = currentStatus === "Recording" ? "Paused" : "Recording";
    onUpdateCamera(camId, { recordingStatus: nextStatus });
  };

  const handleToggleMuteStatus = (camId: string, currentStatus: 'Active' | 'Offline' | 'Alerting') => {
    const nextStatus = currentStatus === "Offline" ? "Active" : "Offline";
    onUpdateCamera(camId, { status: nextStatus });
  };

  const isSupervisorOrAdmin = userRole === "Supervisor" || userRole === "Admin";

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-slate-950 tracking-tight">Camera Management</h1>
          <p className="text-slate-500 text-sm mt-1">Register camera nodes, track optical stream FPS metrics, map floor zones, and configure storage retention.</p>
        </div>
        {isSupervisorOrAdmin && (
          <button 
            onClick={() => setShowRegisterForm(!showRegisterForm)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg text-sm font-semibold shadow-sm hover:from-cyan-600 hover:to-cyan-700 transition-all cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            {showRegisterForm ? "Cancel Registration" : "Register Camera Node"}
          </button>
        )}
      </div>

      {/* Registration Form Overlay */}
      {showRegisterForm && (
        <form onSubmit={handleRegister} className="bg-white border-2 border-cyan-100 rounded-xl p-6 shadow-lg space-y-6 animate-fade-in">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-1.5">
              <Cctv className="h-5 w-5 text-cyan-600" />
              Register New Smart Vision Camera Feed
            </h3>
            <span className="text-xs text-slate-400">Map a new RTSP hardware stream into the AI monitoring grid</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 text-xs">
            {/* Camera inputs */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <label className="font-semibold text-slate-600 block mb-1.5">Camera Display Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Assembly Line B Secondary View" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-1.5">Floor Zone Designation</label>
                <select
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="Production Floor A">Production Floor A</option>
                  <option value="Quality Control Room">Quality Control Room</option>
                  <option value="Logistics Bay">Logistics Bay</option>
                  <option value="Materials Storage">Materials Storage</option>
                </select>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div>
                <label className="font-semibold text-slate-600 block mb-1.5">Assigned Workstation Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Assembly-02" 
                  value={workstation}
                  onChange={(e) => setWorkstation(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-600 block mb-1.5">Stream Resolution</label>
                  <select
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  >
                    <option value="1920x1080">1080p (1920x1080)</option>
                    <option value="1280x720">720p (1280x720)</option>
                    <option value="3840x2160">4K UHD (3840x2160)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1.5">Target FPS Speed</label>
                  <select
                    value={fps}
                    onChange={(e) => setFps(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  >
                    <option value="30">30 Frames/sec</option>
                    <option value="24">24 Frames/sec</option>
                    <option value="60">60 Frames/sec</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-center items-center text-center">
              <Video className="h-8 w-8 text-cyan-600 mb-2 animate-pulse" />
              <p className="font-semibold text-slate-700 text-[11px]">Stream Handshake</p>
              <p className="text-[10px] text-slate-400 mt-1">Camera registers immediately in a suspended state for validation check.</p>
            </div>
          </div>

          <div className="flex justify-end gap-3.5 pt-4 border-t border-slate-100">
            <button 
              type="button" 
              onClick={() => setShowRegisterForm(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              Register Handshake
            </button>
          </div>
        </form>
      )}

      {/* Grid List of Registered Cameras */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cameras.map((cam) => {
          const isAlerting = cam.status === "Alerting";
          const isOffline = cam.status === "Offline";
          return (
            <div 
              key={cam.id} 
              className={`bg-white border hover:shadow-md transition-all rounded-xl p-5 shadow-sm flex flex-col justify-between ${
                isAlerting 
                  ? "border-red-300" 
                  : isOffline 
                  ? "border-slate-200 opacity-80" 
                  : "border-slate-200"
              }`}
            >
              <div>
                {/* Header Information */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${
                      isAlerting ? "bg-red-50 text-red-600 animate-pulse" : isOffline ? "bg-slate-100 text-slate-400" : "bg-cyan-50 text-cyan-600"
                    }`}>
                      <Cctv className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-sm text-slate-900">{cam.name}</h3>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{cam.id} | ZONE: {cam.zone.toUpperCase()}</span>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                    isAlerting 
                      ? "bg-red-50 text-red-600" 
                      : isOffline 
                      ? "bg-slate-100 text-slate-500" 
                      : "bg-emerald-50 text-emerald-600"
                  }`}>
                    ● {cam.status}
                  </span>
                </div>

                {/* Video feed mock placeholder preview image */}
                <div className="my-4 aspect-video bg-slate-900 rounded-xl overflow-hidden relative border border-slate-800 flex items-center justify-center">
                  <div className="absolute inset-0 bg-slate-950 opacity-15 pointer-events-none" />
                  <img 
                    src={
                      cam.id === "CAM-01" 
                        ? "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&auto=format&fit=crop&q=80" 
                        : cam.id === "CAM-02"
                        ? "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80"
                        : cam.id === "CAM-03"
                        ? "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=300&auto=format&fit=crop&q=80"
                        : "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300&auto=format&fit=crop&q=80"
                    } 
                    alt={cam.name} 
                    className="w-full h-full object-cover filter contrast-110 brightness-90 saturate-50" 
                  />
                  {/* Status Overlay */}
                  {isOffline && (
                    <div className="absolute inset-0 bg-slate-950/70 flex flex-col items-center justify-center text-center p-4">
                      <AlertTriangle className="h-7 w-7 text-slate-400 mb-1" />
                      <span className="text-[11px] font-bold text-white font-mono uppercase tracking-wider">Feed Handshake Lost</span>
                      <span className="text-[9px] text-slate-400 mt-0.5">Stream connection disabled or offline</span>
                    </div>
                  )}
                  {isAlerting && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1 animate-pulse shadow">
                      <span className="h-1.5 w-1.5 bg-white rounded-full" />
                      AI EVENT TRIGGERED
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded border border-slate-700 text-white font-mono text-[8px]">
                    {cam.resolution} | {cam.fps} FPS
                  </div>
                </div>

                {/* Performance Metrics Block */}
                <div className="grid grid-cols-3 gap-3 text-center py-2 text-xs">
                  <div className="bg-slate-50 border border-slate-100 p-2 rounded-xl">
                    <span className="text-slate-400 text-[9px] font-bold uppercase tracking-wider block">Health Score</span>
                    <span className="font-semibold text-slate-700 mt-0.5 block flex items-center justify-center gap-1">
                      <Heart className="h-3 w-3 text-red-500 shrink-0" />
                      {cam.healthScore}%
                    </span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-2 rounded-xl">
                    <span className="text-slate-400 text-[9px] font-bold uppercase tracking-wider block">Recording Uptime</span>
                    <span className="font-semibold text-slate-700 mt-0.5 block flex items-center justify-center gap-1">
                      <Activity className="h-3 w-3 text-cyan-500 shrink-0" />
                      {cam.recordingUptime}%
                    </span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-2 rounded-xl">
                    <span className="text-slate-400 text-[9px] font-bold uppercase tracking-wider block">Mapped Station</span>
                    <span className="font-semibold text-slate-700 mt-0.5 block font-mono text-[10px] truncate">{cam.workstation}</span>
                  </div>
                </div>
              </div>

              {/* Controller buttons (for Supervisors/Admins) */}
              {isSupervisorOrAdmin && (
                <div className="flex items-center gap-2.5 mt-4.5 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleToggleRecording(cam.id, cam.recordingStatus)}
                    disabled={isOffline}
                    className={`flex-1 text-center py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      cam.recordingStatus === "Recording"
                        ? "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                        : "bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                    } disabled:opacity-50`}
                  >
                    {cam.recordingStatus === "Recording" ? "Pause DVR Recording" : "Resume Recording"}
                  </button>
                  <button
                    onClick={() => handleToggleMuteStatus(cam.id, cam.status)}
                    className={`px-3 py-2 border rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isOffline 
                        ? "bg-cyan-600 hover:bg-cyan-700 text-white border-cyan-600" 
                        : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                    title={isOffline ? "Enable Camera Handshake" : "Mute Camera Handshake"}
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
