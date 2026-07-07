import { useState } from "react";
import { 
  Users, 
  Search, 
  SlidersHorizontal, 
  UserPlus, 
  Timer, 
  Percent, 
  CircleDot, 
  Briefcase,
  Monitor,
  Edit2,
  X,
  Check
} from "lucide-react";
import { WorkerProfile, Role } from "../types.ts";
import AttendanceAnalytics from "./AttendanceAnalytics.tsx";

interface WorkerDirectoryProps {
  workers: WorkerProfile[];
  onNavigateToWorker: (workerId: string) => void;
  onUpdateWorker: (id: string, updatedFields: Partial<WorkerProfile>) => void;
  userRole: string;
}

export default function WorkerDirectory({ 
  workers, 
  onNavigateToWorker, 
  onUpdateWorker,
  userRole
}: WorkerDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"directory" | "attendance">("directory");
  
  // Shift Editor state
  const [editingWorkerId, setEditingWorkerId] = useState<string | null>(null);
  const [editWorkstation, setEditWorkstation] = useState("");
  const [editShift, setEditShift] = useState("");
  const [editStatus, setEditStatus] = useState<'Active' | 'Idle' | 'Offline'>("Active");

  // Filter workers list
  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          worker.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          worker.workstation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "All" || worker.role === roleFilter;
    const matchesStatus = statusFilter === "All" || worker.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleStartEdit = (worker: WorkerProfile) => {
    setEditingWorkerId(worker.id);
    setEditWorkstation(worker.workstation);
    setEditShift(worker.shift);
    setEditStatus(worker.status);
  };

  const handleSaveEdit = (id: string) => {
    onUpdateWorker(id, {
      workstation: editWorkstation,
      shift: editShift,
      status: editStatus
    });
    setEditingWorkerId(null);
  };

  const isSupervisorOrAdmin = userRole === "Supervisor" || userRole === "Admin";

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-slate-950 tracking-tight">Worker Management</h1>
          <p className="text-slate-500 text-sm mt-1">Directory of factory operators, real-time attendance rate tracking, and workstation scheduler.</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button 
            onClick={() => setViewMode("directory")}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${viewMode === "directory" ? "bg-cyan-600 text-white shadow-sm" : "text-slate-500"}`}
          >
            ROSTER DIRECTORY
          </button>
          <button 
            onClick={() => setViewMode("attendance")}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${viewMode === "attendance" ? "bg-cyan-600 text-white shadow-sm" : "text-slate-500"}`}
          >
            ATTENDANCE ANALYTICS
          </button>
        </div>
      </div>

      {viewMode === "attendance" ? (
        <AttendanceAnalytics />
      ) : (
        <>
          {/* Stats Counter Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-cyan-50 rounded-lg">
            <Users className="h-5 w-5 text-cyan-600" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Operators</span>
            <span className="text-2xl font-black text-slate-800">{workers.filter(w => w.role === "Worker").length}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-emerald-50 rounded-lg">
            <CircleDot className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Active Shifts</span>
            <span className="text-2xl font-black text-slate-800">{workers.filter(w => w.status === "Active").length}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-purple-50 rounded-lg">
            <Percent className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Avg Attendance Rate</span>
            <span className="text-2xl font-black text-slate-800">
              {Math.round(workers.reduce((acc, w) => acc + w.attendanceRate, 0) / workers.length)}%
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-amber-50 rounded-lg">
            <Timer className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Completed Cycles</span>
            <span className="text-2xl font-black text-slate-800">
              {workers.reduce((acc, w) => acc + w.completedTasks, 0)} Units
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search operators by name, ID or station..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
            <span>Filter:</span>
          </div>
          
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="All">All Roles</option>
            <option value="Worker">Workers Only</option>
            <option value="Supervisor">Supervisors Only</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Idle">Idle Only</option>
            <option value="Offline">Offline Only</option>
          </select>
        </div>
      </div>

      {/* Workers Directory Table / List */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] uppercase font-bold tracking-widest text-slate-400">
                <th className="py-4.5 px-6">Operator Info</th>
                <th className="py-4.5 px-6">Operational Status</th>
                <th className="py-4.5 px-6">Workstation</th>
                <th className="py-4.5 px-6">Efficiency Rate</th>
                <th className="py-4.5 px-6">Shift Schedule</th>
                <th className="py-4.5 px-6">Attendance</th>
                <th className="py-4.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredWorkers.map((worker) => {
                const isEditing = editingWorkerId === worker.id;
                return (
                  <tr key={worker.id} className="hover:bg-slate-50/50 transition-colors group">
                    {/* Operator avatar and name */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden border border-slate-100 shrink-0">
                          <img src={worker.avatar} alt={worker.name} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">{worker.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{worker.id} | {worker.role}</span>
                        </div>
                      </div>
                    </td>

                    {/* Operational Status */}
                    <td className="py-4 px-6">
                      {isEditing ? (
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value as any)}
                          className="bg-white border border-slate-200 rounded-lg p-1 text-xs text-slate-700"
                        >
                          <option value="Active">Active</option>
                          <option value="Idle">Idle</option>
                          <option value="Offline">Offline</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          worker.status === "Active" 
                            ? "bg-emerald-50 text-emerald-600" 
                            : worker.status === "Idle" 
                            ? "bg-amber-50 text-amber-600 animate-pulse" 
                            : "bg-slate-50 text-slate-500"
                        }`}>
                          {worker.status}
                        </span>
                      )}
                    </td>

                    {/* Workstation */}
                    <td className="py-4 px-6">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editWorkstation}
                          onChange={(e) => setEditWorkstation(e.target.value)}
                          className="w-28 bg-white border border-slate-200 rounded-lg p-1 text-xs text-slate-700 font-mono"
                        />
                      ) : (
                        <span className="text-xs font-mono font-medium text-slate-600 flex items-center gap-1.5">
                          <Monitor className="h-3.5 w-3.5 text-slate-400" />
                          {worker.workstation || "Unassigned"}
                        </span>
                      )}
                    </td>

                    {/* Productivity Score Badge */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                          worker.productivityScore >= 90 
                            ? "bg-cyan-50 text-cyan-700" 
                            : worker.productivityScore >= 80 
                            ? "bg-purple-50 text-purple-700" 
                            : "bg-red-50 text-red-600"
                        }`}>
                          {worker.productivityScore}%
                        </span>
                        <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden hidden sm:block">
                          <div 
                            className={`h-full rounded-full ${
                              worker.productivityScore >= 90 ? "bg-cyan-500" : "bg-purple-500"
                            }`} 
                            style={{ width: `${worker.productivityScore}%` }} 
                          />
                        </div>
                      </div>
                    </td>

                    {/* Shift */}
                    <td className="py-4 px-6">
                      {isEditing ? (
                        <select
                          value={editShift}
                          onChange={(e) => setEditShift(e.target.value)}
                          className="bg-white border border-slate-200 rounded-lg p-1 text-xs text-slate-700"
                        >
                          <option value="Day Shift (06:00 - 14:00)">Day Shift (06:00 - 14:00)</option>
                          <option value="Swing Shift (14:00 - 22:00)">Swing Shift (14:00 - 22:00)</option>
                          <option value="Night Shift (22:00 - 06:00)">Night Shift (22:00 - 06:00)</option>
                        </select>
                      ) : (
                        <span className="text-xs text-slate-600 flex items-center gap-1.5">
                          <Briefcase className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[140px]">{worker.shift}</span>
                        </span>
                      )}
                    </td>

                    {/* Attendance rate */}
                    <td className="py-4 px-6">
                      <span className="text-xs font-semibold text-slate-700">{worker.attendanceRate}%</span>
                    </td>

                    {/* Actions button */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(worker.id)}
                              className="p-1 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors cursor-pointer"
                              title="Save Changes"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingWorkerId(null)}
                              className="p-1 bg-slate-200 text-slate-600 rounded hover:bg-slate-300 transition-colors cursor-pointer"
                              title="Cancel"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </>
                        ) : (
                          <>
                            {isSupervisorOrAdmin && (
                              <button
                                onClick={() => handleStartEdit(worker)}
                                className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
                                title="Reassign Workstation / Edit Shift"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => onNavigateToWorker(worker.id)}
                              className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 border border-slate-150 group-hover:border-cyan-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                            >
                              View Detail
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredWorkers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-sm">
                    No factory operators match your search query or filter settings.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )}
</div>
);
}
