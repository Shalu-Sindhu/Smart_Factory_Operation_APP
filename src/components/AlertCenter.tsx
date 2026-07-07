import { useState } from "react";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Filter, 
  Clock, 
  ShieldAlert, 
  VideoOff, 
  Activity, 
  TrendingDown, 
  UserX,
  Eye,
  Check,
  AlertCircle
} from "lucide-react";
import { SystemAlert } from "../types.ts";

interface AlertCenterProps {
  alerts: SystemAlert[];
  onResolveAlert: (id: string) => void;
}

export default function AlertCenter({ alerts, onResolveAlert }: AlertCenterProps) {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  
  // Local active alerts with interactive mock acknowledgement state
  const [localAlerts, setLocalAlerts] = useState<SystemAlert[]>([
    {
      id: "AL-701",
      cameraName: "Camera 03 (Assembly)",
      workerName: "Marcus Ross",
      zone: "Assembly Zone B",
      type: "Safety Violation",
      severity: "High",
      timestamp: "12:43:55",
      status: "Unresolved",
      message: "No protective helmet detected in restricted zone"
    },
    {
      id: "AL-702",
      cameraName: "Camera 11 (Loading)",
      workerName: "David Kim",
      zone: "Loading Dock A",
      type: "Inactivity",
      severity: "Medium",
      timestamp: "12:35:10",
      status: "Unresolved",
      message: "Operator inactive for more than 15 minutes at workstation 4"
    },
    {
      id: "AL-703",
      cameraName: "Camera 05 (Packing)",
      zone: "Packing Yard",
      type: "Downtime Warning",
      severity: "High",
      timestamp: "12:20:44",
      status: "Unresolved",
      message: "Conveyor speed dropped by 45%. Impending motor failure predicted."
    },
    {
      id: "AL-704",
      cameraName: "Camera 02 (Forging)",
      workerName: "Elena Rostova",
      zone: "Forging Cell",
      type: "Process Deviation",
      severity: "Medium",
      timestamp: "11:58:12",
      status: "Resolved",
      message: "Skipped calibration sequence step #3"
    },
    {
      id: "AL-705",
      cameraName: "Camera 08 (Storage)",
      zone: "Warehouse Racks",
      type: "Inactivity",
      severity: "Low",
      timestamp: "11:15:00",
      status: "Resolved",
      message: "Forklift route congestion detected"
    }
  ]);

  const [acknowledgedIds, setAcknowledgedIds] = useState<Set<string>>(new Set(["AL-704"]));

  // Merge server alerts seamlessly
  const allAlerts = [
    ...alerts.map(a => ({
      ...a,
      id: a.id.startsWith("AL-") ? a.id : `AL-${a.id}`
    })),
    ...localAlerts.filter(la => !alerts.some(sa => sa.id === la.id || `AL-${sa.id}` === la.id))
  ];

  const handleAcknowledge = (id: string) => {
    setAcknowledgedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleResolveLocal = (id: string) => {
    // If it's a server-provided alert, call the handler
    const rawId = id.replace("AL-", "");
    if (alerts.some(sa => sa.id === rawId || sa.id === id)) {
      onResolveAlert(rawId);
    } else {
      setLocalAlerts(prev => prev.map(a => a.id === id ? { ...a, status: "Resolved" } : a));
    }
  };

  const filteredAlerts = allAlerts.filter(alert => {
    const matchesSearch = 
      alert.message.toLowerCase().includes(search.toLowerCase()) ||
      alert.cameraName.toLowerCase().includes(search.toLowerCase()) ||
      (alert.workerName || "").toLowerCase().includes(search.toLowerCase()) ||
      alert.zone.toLowerCase().includes(search.toLowerCase());
      
    const matchesSeverity = severityFilter === "ALL" || alert.severity === severityFilter;
    const matchesType = typeFilter === "ALL" || alert.type === typeFilter;
    const matchesStatus = statusFilter === "ALL" || alert.status === statusFilter;
    
    return matchesSearch && matchesSeverity && matchesType && matchesStatus;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "High":
        return "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-900/30";
      case "Medium":
        return "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30";
      case "Low":
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-800/50";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "Safety Violation":
        return <ShieldAlert className="h-5 w-5 text-rose-500" />;
      case "Inactivity":
        return <UserX className="h-5 w-5 text-amber-500" />;
      case "Downtime Warning":
        return <TrendingDown className="h-5 w-5 text-purple-500" />;
      case "Process Deviation":
      default:
        return <Activity className="h-5 w-5 text-cyan-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview stats header banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Total Triggered Alerts</span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{allAlerts.length}</span>
          </div>
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-slate-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider block">Active Unresolved</span>
            <span className="text-2xl font-black text-rose-500">
              {allAlerts.filter(a => a.status === "Unresolved").length}
            </span>
          </div>
          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/20 rounded-lg">
            <AlertCircle className="h-5 w-5 text-rose-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-cyan-500 font-bold uppercase tracking-wider block">Acknowledged</span>
            <span className="text-2xl font-black text-cyan-500">
              {allAlerts.filter(a => acknowledgedIds.has(a.id)).length}
            </span>
          </div>
          <div className="p-2.5 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg">
            <Clock className="h-5 w-5 text-cyan-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider block">Resolved Today</span>
            <span className="text-2xl font-black text-emerald-500">
              {allAlerts.filter(a => a.status === "Resolved").length}
            </span>
          </div>
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </div>
        </div>
      </div>

      {/* Main filter interface */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search alert messages, workstations, operators, or zones..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-slate-800 dark:text-slate-100"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Severity Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="bg-transparent border-none text-[11px] font-semibold text-slate-600 dark:text-slate-300 outline-none cursor-pointer py-1"
              >
                <option value="ALL">All Severities</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
              <ShieldAlert className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-transparent border-none text-[11px] font-semibold text-slate-600 dark:text-slate-300 outline-none cursor-pointer py-1"
              >
                <option value="ALL">All Alert Types</option>
                <option value="Safety Violation">Safety Violations</option>
                <option value="Inactivity">Operator Inactivity</option>
                <option value="Downtime Warning">Downtime Indicators</option>
                <option value="Process Deviation">Process Deviations</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
              <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent border-none text-[11px] font-semibold text-slate-600 dark:text-slate-300 outline-none cursor-pointer py-1"
              >
                <option value="ALL">All Statuses</option>
                <option value="Unresolved">Unresolved</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Grid & History List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-3 animate-pulse" />
            <h4 className="font-display font-semibold text-sm text-slate-800 dark:text-slate-100">All Factory Nodes Clear</h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto">
              There are no unresolved safety violations, downtime, or operator deviations matching your current filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredAlerts.map((alert) => {
              const isAck = acknowledgedIds.has(alert.id);
              const isResolved = alert.status === "Resolved";
              
              return (
                <div 
                  key={alert.id}
                  className={`bg-white dark:bg-slate-900 border rounded-xl p-5 shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 ${
                    !isResolved && !isAck ? "border-l-4 border-l-rose-500" : isResolved ? "opacity-75" : "border-l-4 border-l-cyan-400"
                  }`}
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="mt-1 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg shrink-0">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-slate-400 dark:text-slate-500">{alert.id}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getSeverityBadge(alert.severity)}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          {alert.type}
                        </span>
                        <span className="text-slate-300 dark:text-slate-700 font-medium">|</span>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1 font-mono">
                          <Clock className="h-3 w-3" />
                          {alert.timestamp}
                        </span>
                      </div>
                      
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        {alert.message}
                      </h4>
                      
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span>Workstation: <strong className="text-slate-700 dark:text-slate-300">{alert.zone}</strong></span>
                        <span className="hidden md:inline text-slate-300 dark:text-slate-700">•</span>
                        <span>Feed Source: <strong className="text-slate-700 dark:text-slate-300">{alert.cameraName}</strong></span>
                        {alert.workerName && (
                          <>
                            <span className="hidden md:inline text-slate-300 dark:text-slate-700">•</span>
                            <span>Assigned: <strong className="text-slate-700 dark:text-slate-300">{alert.workerName}</strong></span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Operational Controls */}
                  <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
                    {!isResolved && (
                      <>
                        <button
                          onClick={() => handleAcknowledge(alert.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            isAck 
                              ? "bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700" 
                              : "bg-cyan-50 text-cyan-700 hover:bg-cyan-100 dark:bg-cyan-950/20 dark:text-cyan-400 border border-cyan-100/50"
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" />
                          {isAck ? "Acknowledged" : "Acknowledge"}
                        </button>
                        <button
                          onClick={() => handleResolveLocal(alert.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold shadow-sm transition-all cursor-pointer"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Resolve Alert
                        </button>
                      </>
                    )}
                    {isResolved && (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100/50 rounded-lg text-[10px] font-bold">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
                        Resolved Case
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
