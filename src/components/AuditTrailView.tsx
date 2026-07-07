import { useState } from "react";
import { 
  History, 
  Search, 
  Filter, 
  Clock, 
  User, 
  FileText, 
  Sliders, 
  ShieldAlert,
  Settings,
  Trash2
} from "lucide-react";
import { ActivityLog } from "../types.ts";

export default function AuditTrailView() {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [moduleFilter, setModuleFilter] = useState("ALL");

  const [logs, setLogs] = useState<ActivityLog[]>([
    {
      id: "LOG-901",
      timestamp: "12:56:44",
      module: "Security",
      action: "Alert Acknowledgement",
      user: "Sarah Jenkins (Supervisor)",
      details: "Acknowledged high-severity PPE warning AL-701 for Marcus Ross",
      severity: "info"
    },
    {
      id: "LOG-902",
      timestamp: "12:48:12",
      module: "Reports",
      action: "Report Generation",
      user: "Sarah Jenkins (Supervisor)",
      details: "Compiled and exported June shift productivity records to CSV",
      severity: "info"
    },
    {
      id: "LOG-903",
      timestamp: "11:35:00",
      module: "Config",
      action: "Activity Threshold Updated",
      user: "System Admin",
      details: "Changed Assembly line cycle threshold from 120s to 110s",
      severity: "warning"
    },
    {
      id: "LOG-904",
      timestamp: "10:15:22",
      module: "Authentication",
      action: "User Login",
      user: "Marcus Ross (Operator)",
      details: "User logged in on Terminal Node 4",
      severity: "info"
    },
    {
      id: "LOG-905",
      timestamp: "09:05:00",
      module: "Cameras",
      action: "Camera Added",
      user: "System Admin",
      details: "Registered new dome camera node Cam-15 inside Buffer yard",
      severity: "info"
    }
  ]);

  const filteredLogs = logs.filter(l => {
    const matchesSearch = 
      l.details.toLowerCase().includes(search.toLowerCase()) ||
      l.user.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase());
      
    const matchesSeverity = severityFilter === "ALL" || l.severity === severityFilter;
    const matchesModule = moduleFilter === "ALL" || l.module === moduleFilter;
    
    return matchesSearch && matchesSeverity && matchesModule;
  });

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case "error":
        return "bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400";
      case "warning":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400";
      case "info":
      default:
        return "bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 font-display text-sm flex items-center gap-1.5">
            <History className="h-4.5 w-4.5 text-cyan-600" />
            System Audit Trail Log
          </h3>
          <p className="text-xs text-slate-400">Verifiable records of supervisor modifications, login events, and alert actions</p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-48">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-transparent border-none text-[11px] font-semibold text-slate-600 dark:text-slate-300 outline-none cursor-pointer"
            >
              <option value="ALL">All Levels</option>
              <option value="info">Information</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="bg-transparent border-none text-[11px] font-semibold text-slate-600 dark:text-slate-300 outline-none cursor-pointer"
            >
              <option value="ALL">All Modules</option>
              <option value="Security">Security</option>
              <option value="Reports">Reports</option>
              <option value="Config">Config</option>
              <option value="Authentication">Auth</option>
              <option value="Cameras">Cameras</option>
            </select>
          </div>
        </div>
      </div>

      {/* Renders list of logs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="space-y-4">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-4 bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/60 rounded-xl flex items-start justify-between gap-5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <div className="flex items-start gap-3.5">
                <div className={`p-2 rounded-lg shrink-0 ${getSeverityStyle(log.severity)}`}>
                  <History className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-400 font-bold">{log.id}</span>
                    <span className="text-slate-300 dark:text-slate-700 font-medium">|</span>
                    <span className="text-[10px] font-bold text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {log.timestamp}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700 font-medium">|</span>
                    <span className="text-[10px] font-bold text-cyan-600 bg-cyan-50 dark:bg-cyan-950/20 px-2 py-0.5 rounded uppercase">
                      {log.module}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {log.action} • <span className="text-slate-500 font-medium">{log.user}</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{log.details}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
