import { 
  LayoutDashboard, 
  Tv, 
  Users, 
  UserRoundCheck, 
  Settings, 
  Cctv, 
  BarChart3, 
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  ClipboardList,
  History,
  Calendar,
  CheckSquare,
  Bell,
  User,
  LogOut,
  Sliders,
  UserCheck
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unresolvedAlertsCount: number;
  activeWorkersCount: number;
  userRole: string;
  userName: string;
  onLogout: () => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  unresolvedAlertsCount, 
  activeWorkersCount,
  userRole,
  userName,
  onLogout
}: SidebarProps) {
  
  // All navigation items
  const allMenuItems = [
    // Standard supervisor / admin tabs
    { id: "overview", label: "Floor Overview", icon: LayoutDashboard, badge: null, roles: ["Administrator", "Admin", "Supervisor", "Worker"] },
    { id: "live", label: "Live Monitoring", icon: Tv, badge: unresolvedAlertsCount > 0 ? unresolvedAlertsCount : null, badgeColor: "bg-red-500 text-white", roles: ["Administrator", "Admin", "Supervisor"] },
    { id: "alerts", label: "AI Alerts Center", icon: AlertTriangle, badge: unresolvedAlertsCount > 0 ? unresolvedAlertsCount : null, badgeColor: "bg-red-500 text-white", roles: ["Administrator", "Admin", "Supervisor"] },
    { id: "safety", label: "AI Safety Monitor", icon: ShieldAlert, badge: "PPE", badgeColor: "bg-rose-500 text-white font-medium", roles: ["Administrator", "Admin", "Supervisor"] },
    { id: "workers", label: "Worker Directory", icon: Users, badge: activeWorkersCount > 0 ? `${activeWorkersCount} Active` : null, badgeColor: "bg-cyan-500 text-white font-medium", roles: ["Administrator", "Admin", "Supervisor"] },
    { id: "performance", label: "Worker Performance", icon: UserRoundCheck, badge: "AI Insights", badgeColor: "bg-purple-100 text-purple-700 text-[10px]", roles: ["Administrator", "Admin", "Supervisor", "Worker"] },
    
    // Special admin and supervisor tabs
    { id: "predictive", label: "Predictive AI", icon: Sparkles, badge: "94%", badgeColor: "bg-indigo-100 text-indigo-700 text-[10px]", roles: ["Administrator", "Admin", "Supervisor"] },
    { id: "config", label: "Activity Config", icon: Settings, badge: null, roles: ["Administrator", "Admin"] },
    { id: "cameras", label: "Camera Control", icon: Cctv, badge: null, roles: ["Administrator", "Admin"] },
    { id: "analytics", label: "Operations Analytics", icon: BarChart3, badge: null, roles: ["Administrator", "Admin", "Supervisor"] },
    { id: "builder", label: "Report Builder", icon: ClipboardList, badge: null, roles: ["Administrator", "Admin", "Supervisor"] },
    
    // User management (Admin only)
    { id: "user-management", label: "User Accounts", icon: UserCheck, badge: "DB", badgeColor: "bg-cyan-100 text-cyan-700 text-[9px]", roles: ["Administrator", "Admin"] },
    
    // System admin tabs
    { id: "logs", label: "Audit Trail", icon: History, badge: null, roles: ["Administrator", "Admin"] },
    { id: "settings", label: "System Settings", icon: Sliders, badge: null, roles: ["Administrator", "Admin"] }
  ];

  // Filter menu items by user role
  const menuItems = allMenuItems.filter((item) => {
    // If userRole is "Admin" or "Administrator", match either
    const current = (userRole === "Admin" || userRole === "Administrator") ? "Admin" : userRole;
    return item.roles.some(r => {
      const targetRole = (r === "Admin" || r === "Administrator") ? "Admin" : r;
      return targetRole === current;
    });
  });

  const getRoleBadgeColor = () => {
    if (userRole === "Administrator" || userRole === "Admin") return "text-cyan-600 bg-cyan-50";
    if (userRole === "Supervisor") return "text-purple-600 bg-purple-50";
    return "text-emerald-600 bg-emerald-50";
  };

  const getAvatarUrl = () => {
    if (userRole === "Supervisor") {
      return "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80";
    }
    if (userRole === "Administrator" || userRole === "Admin") {
      return "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=100&auto=format&fit=crop&q=80";
    }
    return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80";
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col fixed left-0 top-0 z-20">
      {/* Branding Header */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-200">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl font-display shadow-sm">
          O
        </div>
        <div className="leading-tight">
          <h1 className="text-sm font-bold tracking-tight text-slate-900 font-display">OPTIMA FACTORY</h1>
          <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-widest font-sans">Operations AI</p>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 group ${
                isActive 
                  ? "bg-slate-100 text-cyan-600 border-l-4 border-cyan-500 pl-2 shadow-sm" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4.5 w-4.5 transition-colors ${isActive ? "text-cyan-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== null && (
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor || "bg-slate-100 text-slate-600"}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Dynamic Shift suggestion or alert depending on userRole */}
      <div className="px-4 py-2 mb-2">
        <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
          <p className="text-[10px] font-bold text-purple-600 uppercase mb-1 tracking-wider font-display">AI Engine v2.4</p>
          <p className="text-[11px] text-purple-800 leading-tight font-medium italic">
            {userRole === "Worker" 
              ? `"Wear confirmation active. Stay clear of Robot-02 yellow proximity boundaries."`
              : `"Optimization suggestion: Reassign shift C to station A to reduce bottle-neck."`
            }
          </p>
        </div>
      </div>

      {/* Sidebar Footer / Role Profile Indicator */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 rounded-full overflow-hidden bg-slate-200 border border-slate-100 shrink-0">
              <img 
                src={getAvatarUrl()} 
                alt="User Profile"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-slate-800 truncate leading-tight">{userName}</h4>
              <span className={`text-[9px] font-bold uppercase tracking-wider block px-1 py-0.2 rounded w-max mt-0.5 ${getRoleBadgeColor()}`}>
                {userRole}
              </span>
            </div>
          </div>
          
          <button 
            onClick={onLogout}
            className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer shrink-0"
            title="Disconnect Shift"
          >
            <LogOut className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
