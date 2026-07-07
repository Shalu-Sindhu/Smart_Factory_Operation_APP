import { useState, useEffect } from "react";
import { 
  Users, 
  Monitor, 
  CircleAlert, 
  CheckCircle2, 
  Timer, 
  Cctv, 
  TrendingUp, 
  Activity,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { FactoryKPIs, WorkerProfile, SystemAlert } from "../types.ts";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar 
} from "recharts";

interface FloorDashboardProps {
  kpis: FactoryKPIs;
  workers: WorkerProfile[];
  alerts: SystemAlert[];
  analyticsData: any;
  onNavigateToTab: (tab: string) => void;
  onNavigateToWorker: (workerId: string) => void;
}

export default function FloorDashboard({ 
  kpis, 
  workers, 
  alerts, 
  analyticsData,
  onNavigateToTab,
  onNavigateToWorker
}: FloorDashboardProps) {
  const activeAlerts = alerts.filter(a => a.status === "Unresolved");

  // Format historical trend data for Recharts
  const trendData = analyticsData?.trends || [
    { hour: "06:00", activeWorkers: 2, efficiency: 85, alertCount: 0, outputCount: 8 },
    { hour: "07:00", activeWorkers: 4, efficiency: 88, alertCount: 1, outputCount: 18 },
    { hour: "08:00", activeWorkers: 4, efficiency: 91, alertCount: 2, outputCount: 26 },
    { hour: "09:00", activeWorkers: 5, efficiency: 90, alertCount: 1, outputCount: 32 },
    { hour: "10:00", activeWorkers: 5, efficiency: 93, alertCount: 0, outputCount: 45 },
    { hour: "11:00", activeWorkers: 5, efficiency: 92, alertCount: 0, outputCount: 40 },
    { hour: "12:00", activeWorkers: 3, efficiency: 86, alertCount: 0, outputCount: 22 }
  ];

  // Helper for KPI styling
  const kpiCards = [
    {
      title: "Active Operators",
      value: `${kpis.activeWorkersCount} / ${workers.length}`,
      detail: "Active on floor",
      icon: Users,
      color: "border-cyan-500",
      bg: "bg-cyan-50/40",
      iconColor: "text-cyan-600",
      tab: "workers"
    },
    {
      title: "Workstation Dials",
      value: `${kpis.activeWorkstationsCount} Stations`,
      detail: "Active assembly units",
      icon: Monitor,
      color: "border-purple-500",
      bg: "bg-purple-50/40",
      iconColor: "text-purple-600",
      tab: "cameras"
    },
    {
      title: "Unresolved Gaps",
      value: `${kpis.alertCount}`,
      detail: `${activeAlerts.filter(a => a.severity === "High").length} high-severity breaches`,
      icon: CircleAlert,
      color: kpis.alertCount > 0 ? "border-red-500 bg-red-50/10" : "border-slate-200",
      bg: kpis.alertCount > 0 ? "bg-red-50" : "bg-slate-50",
      iconColor: kpis.alertCount > 0 ? "text-red-500" : "text-slate-400",
      tab: "live"
    },
    {
      title: "Productivity Index",
      value: `${kpis.overallProductivity}%`,
      detail: "Floor compliance rating",
      icon: CheckCircle2,
      color: "border-emerald-500",
      bg: "bg-emerald-50/40",
      iconColor: "text-emerald-600",
      tab: "analytics"
    },
    {
      title: "Average Cycle Time",
      value: `${kpis.avgCycleTime}s`,
      detail: "Benchmark: 45s - 50s",
      icon: Timer,
      color: "border-amber-500",
      bg: "bg-amber-50/40",
      iconColor: "text-amber-600",
      tab: "performance"
    },
    {
      title: "Vision Nodes",
      value: `${kpis.cameraOnlinePercentage}%`,
      detail: "Active camera feeds",
      icon: Cctv,
      color: "border-indigo-500",
      bg: "bg-indigo-50/40",
      iconColor: "text-indigo-600",
      tab: "cameras"
    }
  ];

  // Capacity calculation
  const totalShiftCapacity = workers.length;
  const currentUtilization = Math.round((kpis.activeWorkersCount / (totalShiftCapacity || 1)) * 100);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-slate-950 tracking-tight">Factory Floor Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time smart monitoring dashboard powered by computer vision telemetry and AI insights.</p>
        </div>
        <div className="flex gap-2.5">
          <button 
            onClick={() => onNavigateToTab("live")}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg text-sm font-semibold shadow-sm shadow-cyan-100 hover:from-cyan-600 hover:to-cyan-700 transition-all cursor-pointer"
          >
            <Activity className="h-4 w-4" />
            Watch Live Vision Feed
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        {kpiCards.map((card, i) => {
          const Icon = card.icon;
          const isGaps = card.title.includes("Gaps");
          return (
            <div 
              key={i}
              onClick={() => onNavigateToTab(card.tab)}
              className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{card.title}</span>
                <div className={`p-1 rounded-md ${card.bg}`}>
                  <Icon className={`h-4 w-4 ${card.iconColor}`} />
                </div>
              </div>
              <div className="flex items-end gap-2 mt-4 justify-between">
                <span className={`text-2xl font-black ${isGaps && kpis.alertCount > 0 ? "text-rose-500" : "text-slate-800"}`}>
                  {card.value}
                </span>
                {isGaps && kpis.alertCount > 0 ? (
                  <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse mb-3" />
                ) : (
                  <span className="text-[9px] text-slate-400 font-bold mb-1 truncate max-w-[80px]" title={card.detail}>{card.detail}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Graph Area / Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Production Trend area chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <div>
              <h3 className="font-bold text-slate-800 font-display">Production Efficiency Trend</h3>
              <p className="text-xs text-slate-400">Comparing Station Alpha vs Station Beta (Real-time)</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-slate-100 text-[10px] font-bold text-slate-600 rounded cursor-pointer hover:bg-slate-200 transition-colors">DAILY</button>
              <button className="px-3 py-1.5 bg-cyan-600 text-white text-[10px] font-bold rounded cursor-pointer hover:bg-cyan-700 transition-colors">WEEKLY</button>
            </div>
          </div>
          
          <div className="absolute top-[210px] left-[40px] flex flex-col gap-1 z-10 hidden xl:flex">
             <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
               <span className="w-3 h-1 bg-cyan-500 rounded-sm"></span> ACTIVE EFFICIENCY
             </div>
             <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
               <span className="w-3 h-1 bg-purple-500 rounded-sm"></span> TARGET THRESHOLD
             </div>
          </div>

          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                  labelStyle={{ fontWeight: "bold", fontSize: "11px", color: "#1e293b" }}
                />
                <Area type="monotone" dataKey="outputCount" name="Completed Units" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#cyanGrad)" />
                <Area type="monotone" dataKey="efficiency" name="Efficiency %" stroke="#a855f7" strokeWidth={2.5} fillOpacity={1} fill="url(#purpleGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Worker Utilization Gauge Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 font-display">Worker Utilization</h3>
            <p className="text-xs text-slate-400">Current shift headcount loading</p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center relative my-4">
            <div className="relative h-40 w-40 flex items-center justify-center">
              <svg viewBox="0 0 36 36" className="w-40 h-40">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E2E8F0" strokeWidth="4" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#06B6D4" strokeWidth="4" strokeDasharray={`${currentUtilization}, 100`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-800">{currentUtilization}%</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Capacity</span>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 w-full gap-2">
              <div className="text-center border-r border-slate-100">
                <p className="text-lg font-bold text-slate-700">{kpis.activeWorkersCount}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Assigned</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-slate-700">{workers.length - kpis.activeWorkersCount}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Standby</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 flex justify-between text-xs border border-slate-100">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400">Active Shifts</span>
              <span className="font-semibold text-slate-700 mt-0.5 block">1st Day Shift</span>
            </div>
            <div className="text-right">
              <span className="text-[9px] uppercase font-bold text-slate-400">Available</span>
              <span className="font-semibold text-cyan-600 mt-0.5 block">{workers.length} Total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Floor Workers and Recent Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Workers Panel (Left 3 columns) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs lg:col-span-3">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display font-semibold text-base text-slate-950">Live Worker Status</h2>
              <span className="text-xs text-slate-500">Current floor status and workstations</span>
            </div>
            <button 
              onClick={() => onNavigateToTab("workers")}
              className="flex items-center gap-1 text-xs font-semibold text-cyan-600 hover:text-cyan-700 transition-colors cursor-pointer"
            >
              Manage Directory <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {workers.map((worker) => (
              <div 
                key={worker.id}
                onClick={() => onNavigateToWorker(worker.id)}
                className="flex items-center justify-between p-3 border border-slate-100 hover:border-cyan-100 rounded-xl hover:bg-cyan-50/10 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                    <img src={worker.avatar} alt={worker.name} className="h-full w-full object-cover" />
                    <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${
                      worker.status === "Active" ? "bg-emerald-500" : worker.status === "Idle" ? "bg-amber-400 animate-pulse" : "bg-slate-300"
                    }`} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-800 group-hover:text-cyan-600 transition-colors">{worker.name}</h4>
                    <span className="text-[10px] text-slate-400 block font-mono mt-0.5">{worker.id} | Workstation: {worker.workstation || "N/A"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Productivity metric */}
                  <div className="text-right hidden sm:block">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-widest">Efficiency</span>
                    <span className="text-xs font-bold text-slate-700 block mt-0.5">{worker.productivityScore}%</span>
                  </div>

                  {/* Tasks completed */}
                  <div className="text-right hidden sm:block">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-widest">Completed</span>
                    <span className="text-xs font-semibold text-slate-700 block mt-0.5">{worker.completedTasks} cycles</span>
                  </div>

                  {/* Quick Action */}
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      worker.status === "Active" ? "bg-emerald-50 text-emerald-600" : worker.status === "Idle" ? "bg-amber-50 text-amber-600" : "bg-slate-50 text-slate-500"
                    }`}>
                      {worker.status}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Ticker Feed (Right 2 columns) */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden lg:col-span-2 flex flex-col h-full justify-between shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
             <h3 className="font-bold text-slate-800 font-display text-sm">Live Activity Stream</h3>
             <button 
               onClick={() => onNavigateToTab("live")} 
               className="text-[10px] font-bold text-cyan-600 hover:text-cyan-700 transition-colors uppercase cursor-pointer"
             >
               VIEW LOGS
             </button>
          </div>

          <div className="p-4 space-y-4 flex-1 overflow-y-auto max-h-80">
            {/* Grab recent actions from workers or alerts */}
            {workers.flatMap(w => w.recentActivities.map(a => ({ ...a, worker: w.name }))).slice(0, 5).map((act, i) => (
              <div key={i} className="flex items-center gap-4 py-1">
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                  act.status === "success" ? "bg-cyan-500" : act.status === "warning" ? "bg-purple-500" : "bg-slate-300"
                }`} />
                <p className="text-xs text-slate-600 flex-1">
                  <span className="font-bold text-slate-900">Worker {act.worker}</span> {act.message}
                </p>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">{act.timestamp}</span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100">
            <div className="bg-cyan-50/50 rounded-xl p-3 border border-cyan-100 flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-cyan-600 shrink-0" />
              <div className="text-[11px] text-cyan-700">
                <span className="font-bold block">Safety Compliance Active</span>
                AI Core monitoring is scanning helmet and safety-vest adherence across all workstations.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
