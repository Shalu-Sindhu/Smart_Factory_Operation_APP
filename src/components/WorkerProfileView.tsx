import { User, Award, Shield, Key } from "lucide-react";

interface ProfileProps {
  currentUser: {
    id: string;
    email: string;
    name: string;
    role: string;
  } | null;
  onLogout: () => void;
}

export default function WorkerProfileView({ currentUser, onLogout }: ProfileProps) {
  const defaultUser = {
    name: currentUser?.name || "Marcus Ross",
    email: currentUser?.email || "worker@optimafactory.com",
    role: currentUser?.role || "Worker",
    id: currentUser?.id?.slice(0, 8) || "W-104",
    workstation: "Assembly-01",
    shift: "Day Shift (06:00 - 14:00)",
  };

  const certifications = [
    { name: "Computer Vision Compliance", level: "L3 Verified", date: "June 2026" },
    { name: "Mechanical Assembly Precision", level: "Master Operator", date: "April 2026" },
    { name: "Hazard Zone Safety Awareness", level: "A-Class Certified", date: "Jan 2026" }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-slate-900 font-display">My Operator Profile</h1>
        <p className="text-xs text-slate-500 font-mono">Verified plant personnel & credential token parameters</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Card: Main Avatar and Info */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center shadow-sm">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-cyan-400">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80" 
                alt="Worker Profile"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 p-1.5 bg-cyan-500 rounded-full text-white shadow" title="Verified active operator">
              <Shield className="h-3.5 w-3.5" />
            </div>
          </div>

          <h2 className="text-lg font-bold text-slate-800 font-display">{defaultUser.name}</h2>
          <span className="text-[10px] font-bold text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-full uppercase tracking-wider block w-max mx-auto mt-1.5">
            {defaultUser.role} Operator
          </span>

          <div className="mt-6 space-y-3.5 text-left text-xs border-t border-slate-100 pt-5 text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Employee ID:</span>
              <span className="font-mono font-semibold">{defaultUser.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Email Address:</span>
              <span className="font-mono font-semibold">{defaultUser.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Workstation:</span>
              <span className="font-semibold">{defaultUser.workstation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Shift Assignment:</span>
              <span className="font-semibold">{defaultUser.shift}</span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full mt-6 py-2 bg-rose-50 hover:bg-rose-100/80 text-rose-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            DISCONNECT SECURE SESSION
          </button>
        </div>

        {/* Right Panel: Certifications & Security */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Certifications Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-display font-bold text-sm text-slate-800 mb-4 flex items-center gap-2">
              <Award className="h-4.5 w-4.5 text-cyan-500" />
              Active Floor Certifications
            </h3>
            <div className="space-y-3">
              {certifications.map((cert, index) => (
                <div key={index} className="p-3.5 rounded-xl border border-slate-100 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{cert.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">Issued {cert.date}</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    {cert.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* System Security token properties */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-display font-bold text-sm text-slate-800 mb-4 flex items-center gap-2">
              <Key className="h-4.5 w-4.5 text-purple-500" />
              Security Session Parameters
            </h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-mono text-[11px] text-slate-500 space-y-2">
              <div className="flex justify-between">
                <span>Session Auth Token:</span>
                <span className="text-purple-600 truncate max-w-xs font-semibold">JWT SHA256 Verified</span>
              </div>
              <div className="flex justify-between">
                <span>Scope Permissions:</span>
                <span className="text-slate-700 font-semibold">worker_portal, live_views, tasks_update</span>
              </div>
              <div className="flex justify-between">
                <span>Token Expiry:</span>
                <span className="text-slate-700 font-semibold">24 Hours (Rolling Refresh)</span>
              </div>
              <div className="flex justify-between">
                <span>Client Access Point:</span>
                <span className="text-slate-700 font-semibold">Plant Terminal Node 01</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
