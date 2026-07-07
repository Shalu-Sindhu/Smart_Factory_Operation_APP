import { useState, useEffect } from "react";
import { Clock, Calendar, CheckCircle2, AlertTriangle, ArrowRightLeft, Timer } from "lucide-react";

interface AttendanceRecord {
  id: string;
  date: string;
  status: string;
  checkIn: string;
  checkOut: string;
}

export default function PersonalAttendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [clockedIn, setClockedIn] = useState(false);
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);

  useEffect(() => {
    // Generate mock historical attendance for the logged-in worker
    const mockRecords = [
      { id: "att-1", date: "2026-06-25", status: "Present", checkIn: "05:58 AM", checkOut: "02:02 PM" },
      { id: "att-2", date: "2026-06-24", status: "Present", checkIn: "05:55 AM", checkOut: "02:00 PM" },
      { id: "att-3", date: "2026-06-23", status: "Late", checkIn: "06:15 AM", checkOut: "02:05 PM" },
      { id: "att-4", date: "2026-06-22", status: "Present", checkIn: "05:50 AM", checkOut: "02:00 PM" },
      { id: "att-5", date: "2026-06-19", status: "Present", checkIn: "05:57 AM", checkOut: "01:58 PM" },
    ];
    setRecords(mockRecords);
    setLoading(false);
  }, []);

  const handleClockToggle = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];

    if (!clockedIn) {
      // Clocking in
      const newRec: AttendanceRecord = {
        id: `att-${Date.now()}`,
        date: dateStr,
        status: now.getHours() >= 6 && now.getMinutes() > 5 ? "Late" : "Present",
        checkIn: timeStr,
        checkOut: "--"
      };
      setTodayRecord(newRec);
      setRecords(prev => [newRec, ...prev]);
      setClockedIn(true);
    } else {
      // Clocking out
      if (todayRecord) {
        const updatedRec = { ...todayRecord, checkOut: timeStr };
        setRecords(prev => prev.map(r => r.id === todayRecord.id ? updatedRec : r));
        setTodayRecord(null);
      }
      setClockedIn(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">Personal Attendance Portal</h1>
          <p className="text-xs text-slate-500 font-mono">Operator ID: W-104 | Marcus Ross</p>
        </div>
        
        {/* Punch Button */}
        <button
          onClick={handleClockToggle}
          className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold font-display text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer ${
            clockedIn 
              ? "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/10" 
              : "bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white shadow-cyan-500/10"
          }`}
        >
          <Clock className="h-4.5 w-4.5 animate-pulse" />
          {clockedIn ? "CLOCK OUT OF WORKSTATION" : "CLOCK IN FOR SHIFT"}
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Monthly Shift Adherence</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-slate-800">98.2%</div>
          <p className="text-[10px] text-emerald-600 font-medium mt-1">Excellent (Target 95.0%)</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Days Present</span>
            <Calendar className="h-4 w-4 text-cyan-500" />
          </div>
          <div className="text-xl font-bold text-slate-800">18 / 19</div>
          <p className="text-[10px] text-slate-400 mt-1">Current Shift Cycle</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Late Warnings</span>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-slate-800">1</div>
          <p className="text-[10px] text-amber-600 font-medium mt-1">Grace limit remaining: 2</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Weekly Hours</span>
            <Timer className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-xl font-bold text-slate-800">32.1 Hrs</div>
          <p className="text-[10px] text-slate-400 mt-1">Includes 1.5 Hrs Overtime</p>
        </div>
      </div>

      {/* Clock Status Alert */}
      <div className={`p-4 rounded-xl border flex items-center justify-between ${
        clockedIn 
          ? "bg-cyan-50 border-cyan-100 text-cyan-800" 
          : "bg-slate-50 border-slate-200 text-slate-600"
      }`}>
        <div className="flex items-center gap-3">
          <span className={`h-2.5 w-2.5 rounded-full ${clockedIn ? "bg-cyan-500 animate-ping" : "bg-slate-400"}`} />
          <span className="text-xs font-semibold">
            {clockedIn 
              ? `Currently Active & Clocked In at Station Assembly-01 (Started at ${todayRecord?.checkIn})`
              : "Status: Off Duty (Please clock in to register workstation activity logs)"
            }
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider hidden sm:inline">
          {clockedIn ? "Shift Live" : "Offline"}
        </span>
      </div>

      {/* Historical List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-display font-semibold text-xs uppercase tracking-wider text-slate-600">
            Recent Attendance & Telemetry Sync Log
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">Last 30 Days</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 font-mono text-[10px] text-slate-400 uppercase font-semibold">
                <th className="px-6 py-3">Shift Date</th>
                <th className="px-6 py-3">Check-In Time</th>
                <th className="px-6 py-3">Check-Out Time</th>
                <th className="px-6 py-3">Shift Status</th>
                <th className="px-6 py-3">Operational Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {records.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-3.5 font-medium">{rec.date}</td>
                  <td className="px-6 py-3.5 font-mono">{rec.checkIn}</td>
                  <td className="px-6 py-3.5 font-mono">{rec.checkOut}</td>
                  <td className="px-6 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      rec.status === "Present" 
                        ? "bg-emerald-50 text-emerald-700" 
                        : "bg-amber-50 text-amber-700"
                    }`}>
                      {rec.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-slate-400 font-mono">Synced to Admin Log</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
