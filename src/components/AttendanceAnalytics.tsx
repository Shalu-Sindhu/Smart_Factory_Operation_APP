import { useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Calendar, 
  Clock, 
  Download, 
  FileSpreadsheet, 
  FileCheck, 
  UserCheck, 
  TrendingUp, 
  ChevronRight,
  Filter
} from "lucide-react";

export default function AttendanceAnalytics() {
  const [selectedMonth, setSelectedMonth] = useState("June");
  
  const monthlyData = [
    { name: "Mon", Present: 22, Late: 1, Absent: 1, OvertimeHours: 12 },
    { name: "Tue", Present: 24, Late: 0, Absent: 0, OvertimeHours: 8 },
    { name: "Wed", Present: 23, Late: 2, Absent: 1, OvertimeHours: 14 },
    { name: "Thu", Present: 21, Late: 3, Absent: 2, OvertimeHours: 15 },
    { name: "Fri", Present: 24, Late: 1, Absent: 0, OvertimeHours: 10 },
    { name: "Sat", Present: 18, Late: 0, Absent: 6, OvertimeHours: 4 },
  ];

  const pieData = [
    { name: "On Time", value: 85, color: "#06b6d4" },
    { name: "Late Arrivals", value: 10, color: "#f59e0b" },
    { name: "Excused Absence", value: 5, color: "#10b981" }
  ];

  const attendanceLog = [
    { id: "A-121", name: "Marcus Ross", date: "2026-06-25", checkIn: "07:55 AM", status: "On-Time", overtime: "1.5 hrs" },
    { id: "A-122", name: "Elena Rostova", date: "2026-06-25", checkIn: "08:12 AM", status: "Late", overtime: "0.0 hrs" },
    { id: "A-123", name: "David Kim", date: "2026-06-25", checkIn: "07:48 AM", status: "On-Time", overtime: "2.0 hrs" },
    { id: "A-124", name: "Sarah Connor", date: "2026-06-25", checkIn: "08:05 AM", status: "Late", overtime: "0.5 hrs" },
    { id: "A-125", name: "James Vance", date: "2026-06-25", checkIn: "07:50 AM", status: "On-Time", overtime: "1.0 hrs" }
  ];

  const triggerCSVDownload = () => {
    // Generate simple csv file of attendanceLog
    const headers = "ID,Name,Date,CheckIn,Status,Overtime\n";
    const rows = attendanceLog.map(l => `${l.id},${l.name},${l.date},${l.checkIn},${l.status},${l.overtime}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `optima_attendance_report_${selectedMonth}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Attendance summary highlights cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Average Headcount</span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">96.8%</span>
          </div>
          <div className="p-2 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg">
            <UserCheck className="h-5 w-5 text-cyan-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Late Arrivals</span>
            <span className="text-2xl font-black text-amber-500">12 Days</span>
          </div>
          <div className="p-2 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
            <Clock className="h-5 w-5 text-amber-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Overtime Logged</span>
            <span className="text-2xl font-black text-purple-600">53.5 hrs</span>
          </div>
          <div className="p-2 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Shift Competency</span>
            <span className="text-2xl font-black text-emerald-500">99.1%</span>
          </div>
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
            <FileCheck className="h-5 w-5 text-emerald-500" />
          </div>
        </div>
      </div>

      {/* Analytics charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly headcount bar chart (Col span 2) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 font-display text-sm">Operator Presence Distribution</h4>
              <p className="text-xs text-slate-400">Headcounts grouped by standard attendance criteria</p>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={triggerCSVDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" /> EXPORT REPORT
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800/40" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <RechartsTooltip contentStyle={{ fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="Present" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Late" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Punctuality breakdown (Col span 1) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-100 font-display text-sm">Combined Punctuality Matrix</h4>
            <p className="text-xs text-slate-400">Ratio breakdown of operator check-in metrics</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center my-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-xs border-b border-slate-50 dark:border-slate-800 pb-1 last:border-b-0">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                  <span className="text-slate-600 dark:text-slate-300 font-medium">{d.name}</span>
                </div>
                <strong className="text-slate-800 dark:text-slate-100">{d.value}%</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attendance Detail Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-100 font-display text-sm">Shift Attendance Register</h4>
            <p className="text-xs text-slate-400">Log of current day check-in entries</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold">
                <th className="py-3">Log ID</th>
                <th className="py-3">Operator Name</th>
                <th className="py-3">Record Date</th>
                <th className="py-3">Clock In</th>
                <th className="py-3">Classification</th>
                <th className="py-3 text-right">Overtime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40 font-medium text-slate-700 dark:text-slate-300">
              {attendanceLog.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                  <td className="py-3 font-mono text-slate-400">{log.id}</td>
                  <td className="py-3 text-slate-900 dark:text-slate-100 font-bold">{log.name}</td>
                  <td className="py-3">{log.date}</td>
                  <td className="py-3 font-mono">{log.checkIn}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.status === "On-Time" 
                        ? "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/20 dark:text-cyan-400" 
                        : "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 text-right font-mono">{log.overtime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
