import { useState, useEffect } from "react";
import { 
  Users, 
  UserPlus, 
  Shield, 
  Mail, 
  Lock, 
  CheckCircle2, 
  UserCheck, 
  AlertCircle,
  XCircle,
  Award,
  Clock,
  Briefcase,
  Phone
} from "lucide-react";

interface UserRecord {
  id: string;
  email: string;
  mobile: string;
  name: string;
  role: string;
  status: string;
  createdAt: string;
}

interface PendingWorker {
  id: string;
  email: string;
  mobile: string;
  name: string;
  role: string;
  status: string;
  workerId: string;
  department: string;
  factoryUnit: string;
  createdAt: string;
}

interface SupervisorRequest {
  id: string;
  workerId: string;
  name: string;
  department: string;
  experience: string;
  reason: string;
  idProof: string | null;
  status: string;
  createdAt: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [pendingWorkers, setPendingWorkers] = useState<PendingWorker[]>([]);
  const [supervisorRequests, setSupervisorRequests] = useState<SupervisorRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New user form state
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("Worker");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem("optima_token");

  const fetchUsersList = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/users", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to load user management listing.");
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch registered personnel.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingWorkers = async () => {
    try {
      const res = await fetch("/api/admin/pending-workers", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPendingWorkers(data);
      }
    } catch (err) {
      console.error("Failed to load pending workers", err);
    }
  };

  const fetchSupervisorRequests = async () => {
    try {
      const res = await fetch("/api/admin/supervisor-requests", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSupervisorRequests(data);
      }
    } catch (err) {
      console.error("Failed to load supervisor requests", err);
    }
  };

  const loadAllData = async () => {
    await Promise.all([
      fetchUsersList(),
      fetchPendingWorkers(),
      fetchSupervisorRequests()
    ]);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      setError("Please fill in the staff full name.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ email, mobile, password, name, role })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to register operator.");
      }

      setSuccessMsg(`Successfully registered ${name} as a ${role}!`);
      setEmail("");
      setMobile("");
      setPassword("");
      setName("");
      setRole("Worker");
      loadAllData(); // Reload all lists
    } catch (err: any) {
      setError(err.message || "Failed to register employee.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Approve or Reject Worker
  const handleApproveWorker = async (userId: string, approve: boolean) => {
    try {
      const res = await fetch("/api/admin/approve-worker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ userId, approve })
      });
      if (res.ok) {
        setSuccessMsg(`Worker registration was ${approve ? "approved" : "rejected"} successfully!`);
        loadAllData();
      } else {
        const err = await res.json();
        setError(err.error || "Failed to update worker approval status.");
      }
    } catch (err) {
      console.error(err);
      setError("Error updating approval status.");
    }
  };

  // Approve or Reject Supervisor request
  const handleApproveSupervisor = async (requestId: string, approve: boolean) => {
    try {
      const res = await fetch("/api/admin/approve-supervisor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ requestId, approve })
      });
      if (res.ok) {
        setSuccessMsg(`Supervisor access request was ${approve ? "approved" : "rejected"} successfully!`);
        loadAllData();
      } else {
        const err = await res.json();
        setError(err.error || "Failed to update supervisor request status.");
      }
    } catch (err) {
      console.error(err);
      setError("Error updating supervisor request.");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-slate-900 font-display">Personnel & Account Credentials</h1>
        <p className="text-xs text-slate-500 font-mono">Manage authorized plant operators, pending approvals, and promotions in PostgreSQL</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Form: Register New User */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-max">
          <h3 className="font-display font-bold text-sm text-slate-800 mb-4 flex items-center gap-2">
            <UserPlus className="h-4.5 w-4.5 text-cyan-500" />
            Register New Personnel
          </h3>

          {error && (
            <div className="mb-4 bg-rose-50 border border-rose-100 rounded-xl p-3 flex items-start gap-2 text-rose-700 text-xs">
              <AlertCircle className="h-4.5 w-4.5 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-start gap-2 text-emerald-700 text-xs">
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleCreateUser}>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Staff Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Liam Parker"
                className="block w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Operator Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Mail className="h-3.5 w-3.5" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@optimafactory.com"
                  className="block w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Operator Mobile Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Phone className="h-3.5 w-3.5" />
                </span>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="block w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Access Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Lock className="h-3.5 w-3.5" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="block w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Security Scope Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white cursor-pointer"
              >
                <option value="Worker">Worker (Operator)</option>
                <option value="Supervisor">Supervisor (Shift Lead)</option>
                <option value="Administrator">Administrator (System Admin)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Registering..." : "REGISTER NEW ACCOUNT"}
            </button>
          </form>
        </div>

        {/* Right Panel: Staff Directory */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-display font-semibold text-xs uppercase tracking-wider text-slate-600 flex items-center gap-2">
                <Users className="h-4 w-4 text-cyan-500" />
                Active System Users ({users.length})
              </h3>
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Database Online</span>
            </div>

            <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 font-mono text-[10px] text-slate-400 uppercase font-semibold">
                    <th className="px-5 py-3">User Details</th>
                    <th className="px-5 py-3">Security Role</th>
                    <th className="px-5 py-3">Mobile Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="px-5 py-10 text-center text-slate-400">
                        <span className="h-4 w-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin inline-block mr-2" />
                        Loading system accounts...
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 border border-slate-200 shrink-0">
                              {u.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <span className="font-semibold text-slate-800 block truncate">{u.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono block truncate">{u.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 font-semibold">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            u.role === "Administrator" || u.role === "Admin"
                              ? "bg-cyan-50 text-cyan-700"
                              : u.role === "Supervisor"
                              ? "bg-purple-50 text-purple-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-5 py-3 font-mono text-slate-500">
                          {u.mobile || "N/A"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* Upgraded Approvals Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-4">
        
        {/* Pending Worker Registrations List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-amber-50/30">
            <h3 className="font-display font-semibold text-xs uppercase tracking-wider text-amber-800 flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              Pending Worker Approvals ({pendingWorkers.length})
            </h3>
            <span className="text-[10px] text-amber-600 font-mono font-bold uppercase">Needs Review</span>
          </div>

          <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
            {pendingWorkers.length === 0 ? (
              <div className="px-5 py-10 text-center text-slate-400 text-xs">
                No pending worker registrations in queue.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 font-mono text-[9px] text-slate-400 uppercase font-semibold">
                    <th className="px-5 py-2.5">Worker Name</th>
                    <th className="px-5 py-2.5">Mobile</th>
                    <th className="px-5 py-2.5">Deployment Unit</th>
                    <th className="px-5 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-750">
                  {pendingWorkers.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-5 py-3">
                        <span className="font-semibold text-slate-800 block">{w.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono block">ID: {w.workerId} | {w.email}</span>
                      </td>
                      <td className="px-5 py-3 font-mono text-slate-600">{w.mobile}</td>
                      <td className="px-5 py-3 text-slate-600">
                        <span className="block font-medium">{w.department}</span>
                        <span className="text-[10px] text-slate-400">{w.factoryUnit}</span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleApproveWorker(w.id, true)}
                            className="p-1 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleApproveWorker(w.id, false)}
                            className="p-1 px-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Supervisor Access Request List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-purple-50/30">
            <h3 className="font-display font-semibold text-xs uppercase tracking-wider text-purple-800 flex items-center gap-2">
              <Award className="h-4 w-4 text-purple-500" />
              Supervisor Promotion Requests ({supervisorRequests.filter(r => r.status === "Pending").length})
            </h3>
            <span className="text-[10px] text-purple-600 font-mono font-bold uppercase">Privilege Upgrade</span>
          </div>

          <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
            {supervisorRequests.length === 0 ? (
              <div className="px-5 py-10 text-center text-slate-400 text-xs">
                No supervisor promotion requests submitted.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 font-mono text-[9px] text-slate-400 uppercase font-semibold">
                    <th className="px-5 py-2.5">Applicant Details</th>
                    <th className="px-5 py-2.5">Dept / Exp</th>
                    <th className="px-5 py-2.5">Justification Reason</th>
                    <th className="px-5 py-2.5 text-right">Status / Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-750">
                  {supervisorRequests.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-5 py-3">
                        <span className="font-semibold text-slate-800 block">{r.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono block">Worker ID: {r.workerId}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="block font-semibold text-purple-700">{r.department}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{r.experience} Years Exp</span>
                      </td>
                      <td className="px-5 py-3 max-w-[200px] truncate text-slate-500" title={r.reason}>
                        {r.reason}
                      </td>
                      <td className="px-5 py-3 text-right">
                        {r.status !== "Pending" ? (
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            r.status === "Approved"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-rose-50 text-rose-700 border border-rose-100"
                          }`}>
                            {r.status}
                          </span>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleApproveSupervisor(r.id, true)}
                              className="p-1 px-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleApproveSupervisor(r.id, false)}
                              className="p-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-300 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
