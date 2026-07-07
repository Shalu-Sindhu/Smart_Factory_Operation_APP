import { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  HelpCircle, 
  Users, 
  FlameKindling,
  Timer
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell, 
  Legend, 
  LineChart, 
  Line 
} from "recharts";

interface ActivityAnalyticsProps {
  analyticsData: any;
}

export default function ActivityAnalytics({ analyticsData }: ActivityAnalyticsProps) {
  const [selectedRange, setSelectedRange] = useState("Last 24 Hours");

  const trendData = analyticsData?.trends || [];
  const workerComparison = analyticsData?.workerPerformanceComparison || [];
  const downtimeReasons = analyticsData?.downtimeReasons || [];
  const heatmaps = analyticsData?.heatmaps || [];

  // Heatmap headers
  const timeSlots = ["06:00-10:00", "10:00-14:00", "14:00-18:00", "18:00-22:00"];

  // Helper to color heatmap slots based on score
  const getHeatmapColor = (score: number) => {
    if (score >= 95) return "bg-cyan-600 text-white";
    if (score >= 90) return "bg-cyan-400 text-white";
    if (score >= 85) return "bg-purple-400 text-white";
    return "bg-purple-600 text-white";
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-slate-950 tracking-tight">Floor Operations Analytics</h1>
          <p className="text-slate-500 text-sm mt-1">Deep operational intelligence audits compiling workstation efficiency ratios, downtime bottlenecks, and throughput comparisons.</p>
        </div>
        
        {/* Date filter dropdown */}
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-400 font-medium">Reporting Range:</span>
          <select 
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 font-semibold text-slate-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
          >
            <option value="Last 24 Hours">Active Shift (24H)</option>
            <option value="Last 7 Days">Weekly Cycle (7D)</option>
            <option value="Last 30 Days">Monthly Cumulative (30D)</option>
          </select>
        </div>
      </div>

      {/* Main Graphs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Hourly Throughput Rate Line Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-semibold text-sm text-slate-950 flex items-center gap-1.5">
                <TrendingUp className="h-4.5 w-4.5 text-cyan-600" />
                Floor Throughput Trend
              </h3>
              <span className="text-xs text-slate-500">Hourly volume of completed units across all stations</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="outputCount" name="Fixture Cycles Completed" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Worker Efficiency Comparison Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-semibold text-sm text-slate-950 flex items-center gap-1.5">
                <Users className="h-4.5 w-4.5 text-purple-600" />
                Operator Productivity Audit
              </h3>
              <span className="text-xs text-slate-500">Comparing individual assembly speeds and quality metrics</span>
            </div>
          </div>

          <div className="h-64 w-full font-sans">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workerComparison} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="productivity" name="Efficiency Score %" fill="#a855f7" radius={[6, 6, 0, 0]} maxBarSize={40} />
                <Bar dataKey="cycleTime" name="Avg Cycle (Seconds)" fill="#06b6d4" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="mb-5">
            <h3 className="font-display font-semibold text-sm text-slate-950 flex items-center gap-1.5">
              <FlameKindling className="h-4.5 w-4.5 text-cyan-600 animate-pulse" />
              Operational Efficiency Heatmap
            </h3>
            <p className="text-xs text-slate-500">Efficiency averages mapped across time windows and working days.</p>
          </div>

          {/* Graphical Heatmap Table */}
          <div className="border border-slate-100 rounded-xl overflow-hidden mt-4 text-xs font-sans">
            <div className="grid grid-cols-5 bg-slate-50/80 border-b border-slate-200 text-slate-400 font-bold p-3 text-center uppercase tracking-wider text-[9px]">
              <div>Shift Day</div>
              {timeSlots.map((slot, i) => (
                <div key={i}>{slot}</div>
              ))}
            </div>
            
            <div className="divide-y divide-slate-100">
              {heatmaps.map((dayMap: any, idx: number) => (
                <div key={idx} className="grid grid-cols-5 p-2 text-center items-center">
                  <div className="font-bold text-slate-700 text-[11px] text-left pl-2">{dayMap.day}</div>
                  {timeSlots.map((slot, slotIdx) => {
                    const score = dayMap[slot] || 90;
                    return (
                      <div key={slotIdx} className="p-1">
                        <div className={`py-2 rounded-lg font-mono font-bold text-[11px] ${getHeatmapColor(score)}`}>
                          {score}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Color Guides */}
          <div className="flex justify-end gap-3 mt-4 text-[10px] text-slate-400 font-semibold">
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded bg-cyan-600 block" /> Peak Performance (&gt;95%)
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded bg-cyan-400 block" /> Optimal (90-95%)
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded bg-purple-400 block" /> Nominal (85-90%)
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded bg-purple-600 block" /> Deviation Warning (&lt;85%)
            </span>
          </div>
        </div>

        {/* Downtime Analysis Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-display font-semibold text-sm text-slate-950 flex items-center gap-1.5">
              <Clock className="h-4.5 w-4.5 text-purple-600" />
              Downtime Bottleneck Breakdown
            </h3>
            <span className="text-xs text-slate-500">Root-cause classification of idle workstation triggers</span>
          </div>

          <div className="h-44 flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={downtimeReasons}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {downtimeReasons.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color || "#06b6d4"} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend Table */}
          <div className="grid grid-cols-2 gap-3 text-xs border-t border-slate-50 pt-4 font-medium">
            {downtimeReasons.map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-2 text-slate-600">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span>{item.name}: <strong>{item.value}% ratio</strong></span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
