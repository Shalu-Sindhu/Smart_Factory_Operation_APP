import { useState, useEffect } from "react";
import { Bell, Search, Radio, Check, CircleAlert, Globe, LogOut } from "lucide-react";
import { SystemAlert } from "../types.ts";

interface HeaderProps {
  activeTab: string;
  unresolvedAlerts: SystemAlert[];
  onResolveAlert: (id: string) => void;
  websocketConnected: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  userRole: string;
  setUserRole: (role: string) => void;
  currentUser: { id: string; email: string; name: string; role: string } | null;
  onLogout: () => void;
}

export default function Header({ 
  activeTab,
  unresolvedAlerts, 
  onResolveAlert, 
  websocketConnected, 
  searchQuery, 
  setSearchQuery,
  userRole,
  setUserRole,
  currentUser,
  onLogout
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + " (UTC-7)");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getTabTitle = () => {
    switch (activeTab) {
      case "overview": return "Floor Overview";
      case "live": return "Live Monitoring";
      case "workers": return "Worker Directory";
      case "performance": return "Worker Performance";
      case "config": return "Activity Config";
      case "cameras": return "Camera Control";
      case "analytics": return "Activity Analytics";
      case "reports": return "Report Center";
      case "attendance": return "Personal Attendance";
      case "tasks": return "Workstation Tasks";
      case "notifications": return "Notifications Feed";
      case "profile": return "My Profile";
      case "user-management": return "User Accounts";
      default: return "Floor Overview";
    }
  };

  const getAvatarUrl = () => {
    if (userRole === "Supervisor") {
      return "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80";
    }
    if (userRole === "Admin" || userRole === "Administrator") {
      return "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=100&auto=format&fit=crop&q=80";
    }
    return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80";
  };

  const getRoleBadgeColor = () => {
    if (userRole === "Administrator" || userRole === "Admin") return "text-cyan-600 bg-cyan-50 border-cyan-100";
    if (userRole === "Supervisor") return "text-purple-600 bg-purple-50 border-purple-100";
    return "text-emerald-600 bg-emerald-50 border-emerald-100";
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 w-full">
      {/* Left side: Search & Telemetry Light */}
      <div className="flex items-center gap-6">
        <h2 className="text-lg font-bold text-slate-800 font-display min-w-[140px]">{getTabTitle()}</h2>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search worker or station..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-50 border-none rounded-full py-2 pl-10 pr-4 text-xs w-64 focus:ring-1 ring-cyan-400 transition-all outline-none"
          />
        </div>
      </div>

      {/* Right side: Connection Status, Alerts bell, Profile & Logout, and Time */}
      <div className="flex items-center gap-5">
        {/* Real-time Clock */}
        <div className="hidden lg:flex items-center gap-1.5 text-slate-500 font-mono text-xs border-r border-slate-200 pr-4">
          <Globe className="h-3.5 w-3.5 text-slate-400" />
          <span>{time}</span>
        </div>

        {/* WebSocket Telemetry Status Badge */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-full px-2.5 py-1 text-xs">
          <span className={`h-1.5 w-1.5 rounded-full ${websocketConnected ? "bg-cyan-500 animate-pulse" : "bg-amber-500"}`} />
          <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">
            {websocketConnected ? "Live Telemetry" : "Telemetry Offline"}
          </span>
        </div>

        <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block"></div>

        {/* User Identity Panel */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
            <img 
              src={getAvatarUrl()} 
              alt={userRole}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-800 leading-tight">
              {currentUser?.name || "Marcus Ross"}
            </span>
            <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border w-max mt-0.5 ${getRoleBadgeColor()}`}>
              {userRole}
            </span>
          </div>
        </div>

        {/* Live Alerts Notifications Panel */}
        <div className="relative border-l border-slate-200 pl-4 flex items-center gap-2">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 hover:bg-slate-50 rounded-lg transition-colors relative"
            title="Live Notifications"
          >
            <Bell className="h-5 w-5 text-slate-600" />
            {unresolvedAlerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white animate-bounce" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-2.5">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-display font-semibold text-sm text-slate-800 flex items-center gap-1.5">
                  <CircleAlert className="h-4.5 w-4.5 text-red-500" />
                  Live Operational Alerts ({unresolvedAlerts.length})
                </h3>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Real-time</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                {unresolvedAlerts.length === 0 ? (
                  <div className="px-4 py-6 text-center text-slate-400 text-xs">
                    All operations normal. No safety or process alerts registered.
                  </div>
                ) : (
                  unresolvedAlerts.map((alert) => (
                    <div key={alert.id} className="p-3.5 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                              alert.severity === "High" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                            }`}>
                              {alert.severity} Severity
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-slate-700 mt-1">{alert.message}</p>
                          <span className="text-[10px] text-cyan-600 font-mono block mt-1.5">
                            Camera: {alert.cameraName} | Zone: {alert.zone}
                          </span>
                        </div>
                        <button 
                          onClick={() => {
                            onResolveAlert(alert.id);
                            setShowNotifications(false);
                          }}
                          className="p-1 hover:bg-cyan-100/50 hover:text-cyan-700 text-slate-400 rounded transition-all"
                          title="Resolve Alert"
                        >
                          <Check className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="px-4 py-2 border-t border-slate-100 text-center">
                <span className="text-[10px] font-medium text-slate-400 block">Click checkmark to resolve alert instantly</span>
              </div>
            </div>
          )}

          <button
            onClick={onLogout}
            className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer ml-1"
            title="Log Out Secure Session"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
