import { useState, useEffect } from "react";
import { 
  User, 
  Sparkles, 
  Timer, 
  Calendar, 
  ClipboardCheck, 
  Briefcase, 
  Cpu, 
  FileText,
  TrendingUp,
  BrainCircuit,
  ArrowRight
} from "lucide-react";
import { WorkerProfile } from "../types.ts";
import { generateWorkerInsights } from "../utils/api.ts";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from "recharts";

interface WorkerDetailProps {
  workers: WorkerProfile[];
  selectedWorkerId: string;
  onSelectWorkerId: (id: string) => void;
}

export default function WorkerDetail({ 
  workers, 
  selectedWorkerId, 
  onSelectWorkerId 
}: WorkerDetailProps) {
  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  
  // AI Insights State
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiInsights, setAIInsights] = useState<{
    performanceAnalysis: string;
    safetyCompliance: string;
    recommendations: string[];
  } | null>(null);

  useEffect(() => {
    const active = workers.find(w => w.id === selectedWorkerId) || workers[0];
    if (active) {
      setWorker(active);
      setAIInsights(null); // Reset insights when changing worker to force fresh analysis
    }
  }, [selectedWorkerId, workers]);

  const handleGenerateAIReview = async () => {
    if (!worker) return;
    setLoadingAI(true);
    try {
      const data = await generateWorkerInsights(worker.id);
      setAIInsights(data);
    } catch (err) {
      console.error("AI Insight retrieval error:", err);
    } finally {
      setLoadingAI(false);
    }
  };

  if (!worker) {
    return <div className="text-center py-12 text-slate-400 text-xs">No worker loaded.</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Selector and Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-slate-950 tracking-tight">Worker Performance Analytics</h1>
          <p className="text-slate-500 text-sm mt-1 font-sans">Individual monitoring metrics, assembly duration logs, and Gemini AI floor optimization feedback.</p>
        </div>
        
        {/* Swapper Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-medium">Select Operator:</span>
          <select 
            value={worker.id}
            onChange={(e) => onSelectWorkerId(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
          >
            {workers.map(w => (
              <option key={w.id} value={w.id}>{w.name} ({w.id})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Individual Profile Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4.5">
          <div className="h-16 w-16 rounded-2xl overflow-hidden border border-slate-200 shadow-xs shrink-0">
            <img src={worker.avatar} alt={worker.name} className="h-full w-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-xl text-slate-900">{worker.name}</h2>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                worker.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"
              }`}>
                {worker.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{worker.id} | {worker.role} at station {worker.workstation || "Assembly-01"}</p>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-2.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>Shift: {worker.shift}</span>
            </p>
          </div>
        </div>

        {/* Quick Micro Performance KPI metrics */}
        <div className="grid grid-cols-3 gap-6 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-10 text-center md:text-left">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Productivity</span>
            <span className="text-xl font-bold font-display text-cyan-600 block mt-0.5">{worker.productivityScore}%</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Attendance</span>
            <span className="text-xl font-bold font-display text-slate-700 block mt-0.5">{worker.attendanceRate}%</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Avg Cycle Time</span>
            <span className="text-xl font-bold font-display text-purple-600 block mt-0.5">{worker.averageCycleTime}s</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Weekly Trend Line Chart (Left 3 columns) */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-semibold text-sm text-slate-950">Weekly Efficiency Trend</h3>
              <span className="text-xs text-slate-500">Historical daily productivity indexes</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={worker.weeklyProductivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis domain={[60, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                  labelStyle={{ fontWeight: "bold", fontSize: "11px", color: "#1e293b" }}
                />
                <Line type="monotone" dataKey="score" name="Daily Efficiency %" stroke="#06b6d4" strokeWidth={3} activeDot={{ r: 6 }} dot={{ strokeWidth: 2, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Breakdown Donut Chart (Right 2 columns) */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="font-display font-semibold text-sm text-slate-950">Daily Activity Allotment</h3>
            <span className="text-xs text-slate-500">Breakdown of operational duration ratios</span>
          </div>

          <div className="h-44 my-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={worker.activityBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {worker.activityBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || "#06b6d4"} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom legend */}
          <div className="grid grid-cols-2 gap-2 text-[10px] mt-2">
            {worker.activityBreakdown.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 text-slate-600">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* AI generated Insights card */}
      <div className="bg-gradient-to-br from-cyan-50/70 via-purple-50/20 to-white border border-cyan-100 rounded-xl p-6.5 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-cyan-600 transform translate-x-4 -translate-y-4">
          <BrainCircuit className="h-40 w-40" />
        </div>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-gradient-to-br from-cyan-500 to-purple-500 text-white rounded-lg">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-950">Gemini AI Operational Review</h3>
            </div>
            <p className="text-slate-600 text-xs">
              Generate a high-fidelity continuous improvement analysis and safety verification for <strong>{worker.name}</strong>, dynamically built from active floor cameras and sequence timing telemetry.
            </p>
          </div>

          <button 
            onClick={handleGenerateAIReview}
            disabled={loadingAI}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-100 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Cpu className="h-4 w-4 shrink-0" />
            {loadingAI ? "Analyzing Floor Telemetry..." : "Generate Custom AI Review"}
          </button>
        </div>

        {/* AI Insight Results Display */}
        {loadingAI ? (
          <div className="mt-6 p-10 bg-white/70 backdrop-blur-xs rounded-xl border border-dashed border-cyan-200 flex flex-col items-center justify-center text-center">
            <span className="h-6 w-6 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin block mb-3" />
            <p className="text-xs text-cyan-800 font-semibold">Gemini 3.5 Flash is analyzing safety compliance patterns and bolt assembly timings...</p>
            <span className="text-[10px] text-slate-400 block mt-1">This will take only a second</span>
          </div>
        ) : aiInsights ? (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-white border border-cyan-100/70 p-5 rounded-xl shadow-xs text-xs animate-fade-in">
            {/* Efficiency report */}
            <div className="space-y-1.5 border-b md:border-b-0 md:border-r border-slate-100 pb-4.5 md:pb-0 md:pr-5">
              <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-widest text-cyan-700 flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" />
                Efficiency Assessment
              </h4>
              <p className="text-slate-600 leading-relaxed text-[11px] mt-2">{aiInsights.performanceAnalysis}</p>
            </div>

            {/* Safety report */}
            <div className="space-y-1.5 border-b md:border-b-0 md:border-r border-slate-100 pb-4.5 md:pb-0 md:pr-5">
              <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-widest text-purple-700 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                PPE & Compliance Score
              </h4>
              <p className="text-slate-600 leading-relaxed text-[11px] mt-2">{aiInsights.safetyCompliance}</p>
            </div>

            {/* Recommendations */}
            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-widest text-slate-700 flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" />
                Actionable Floor Tweaks
              </h4>
              <ul className="space-y-2 mt-2.5">
                {aiInsights.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-600 text-[11px] leading-normal">
                    <span className="text-cyan-500 font-bold mt-0.5 shrink-0">→</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </div>

      {/* Task Completion History List */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h3 className="font-display font-semibold text-sm text-slate-950 flex items-center gap-2 mb-4">
          <ClipboardCheck className="h-4.5 w-4.5 text-slate-600" />
          Shift Task Completion History
        </h3>

        <div className="space-y-3">
          {worker.recentActivities.map((act) => (
            <div key={act.id} className="flex items-center justify-between p-3.5 border border-slate-100 rounded-xl bg-slate-50/40">
              <div className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${
                  act.status === "success" ? "bg-emerald-500" : act.status === "warning" ? "bg-red-500" : "bg-cyan-500"
                }`} />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">{act.type}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{act.message}</span>
                </div>
              </div>
              <span className="font-mono text-[10px] text-slate-400 font-semibold">{act.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
