import { useState } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { 
  BrainCircuit, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  Zap, 
  Sparkles,
  Percent,
  Compass,
  ArrowUpRight
} from "lucide-react";

export default function PredictiveAnalytics() {
  const [selectedScenario, setSelectedScenario] = useState("standard");

  const trendData = [
    { name: "Day 1", Actual: 145, Projected: 145 },
    { name: "Day 2", Actual: 152, Projected: 153 },
    { name: "Day 3", Actual: 138, Projected: 140 },
    { name: "Day 4", Actual: 160, Projected: 158 },
    { name: "Day 5", Actual: 155, Projected: 162 },
    { name: "Day 6", Projected: 168 },
    { name: "Day 7", Projected: 175 },
  ];

  const predictions = [
    { 
      title: "Station Alpha Maintenance", 
      metric: "Bearing Overheating", 
      timeframe: "Within 48 hours", 
      confidence: 89, 
      impact: "High Downtime",
      color: "border-rose-200 bg-rose-50/50 dark:bg-rose-950/10 text-rose-700" 
    },
    { 
      title: "Assembly Line Output", 
      metric: "Defect Surge Predicted", 
      timeframe: "During Shift Change B", 
      confidence: 76, 
      impact: "Minor Quality Drop",
      color: "border-amber-200 bg-amber-50/50 dark:bg-amber-950/10 text-amber-700" 
    },
    { 
      title: "Labor Allocation Optimization", 
      metric: "Station Beta Bottleneck", 
      timeframe: "Next Monday Shift A", 
      confidence: 94, 
      impact: "14% Output Loss",
      color: "border-purple-200 bg-purple-50/50 dark:bg-purple-950/10 text-purple-700" 
    }
  ];

  return (
    <div className="space-y-6">
      {/* Predictive Hero banner */}
      <div className="bg-gradient-to-br from-purple-500/10 via-cyan-500/5 to-white dark:to-slate-950 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 font-display flex items-center gap-2">
              <BrainCircuit className="h-5.5 w-5.5 text-purple-600 animate-pulse" />
              Optima AI Predictive Forecasting Engine
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">ML models projecting production bottlenecks, machine thermal failures, and shift utilization anomalies.</p>
          </div>
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl">
            <span className="text-[10px] font-bold text-purple-600 px-3 py-1 bg-purple-50 dark:bg-purple-950/20 rounded-lg">Continuous Learning active</span>
          </div>
        </div>
      </div>

      {/* Primary Forecast Trends & confidence rates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Output prediction projection chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-100 font-display text-sm">7-Day Combined Production Output Forecast</h4>
            <p className="text-xs text-slate-400">Projected output units compared with historical variance limits</p>
          </div>

          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="projectedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800/40" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="Actual" stroke="#06b6d4" strokeWidth={2.5} fill="transparent" />
                <Area type="monotone" dataKey="Projected" stroke="#a855f7" strokeWidth={2} strokeDasharray="5 5" fill="url(#projectedGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Confidence indicators metrics list */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-5">
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-100 font-display text-sm">Proactive Failure Forecasts</h4>
            <p className="text-xs text-slate-400">Probability triggers by ML sensor analysis</p>
          </div>

          <div className="space-y-4">
            {predictions.map((p, idx) => (
              <div key={idx} className={`p-4 rounded-xl border ${p.color} space-y-2`}>
                <div className="flex justify-between items-start">
                  <h5 className="text-xs font-bold leading-snug">{p.title}</h5>
                  <span className="text-[10px] font-black uppercase tracking-wider">{p.impact}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span>{p.metric}</span>
                  <strong>{p.timeframe}</strong>
                </div>

                <div className="space-y-1 pt-2 border-t border-current/10">
                  <div className="flex justify-between text-[9px] font-bold">
                    <span>AI PROBABILITY CONFIDENCE</span>
                    <span>{p.confidence}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-current/10 rounded-full overflow-hidden">
                    <div style={{ width: `${p.confidence}%` }} className="h-full bg-current" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
