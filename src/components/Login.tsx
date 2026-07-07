import { useState, useEffect } from "react";
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Phone, 
  Mail, 
  Cpu, 
  AlertCircle, 
  ShieldCheck, 
  CheckCircle2, 
  User, 
  Building, 
  Award, 
  FileText, 
  ChevronLeft,
  Briefcase
} from "lucide-react";

interface LoginProps {
  onLoginSuccess: (user: any, token: string) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  // Screen views: login, register (worker), supervisor (request)
  const [view, setView] = useState<"login" | "register" | "supervisor">("login");
  
  // Login credentials
  const [identifier, setIdentifier] = useState(""); // Mobile or Email
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Worker Registration states
  const [regName, setRegName] = useState("");
  const [regMobile, setRegMobile] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regWorkerId, setRegWorkerId] = useState("");
  const [regDept, setRegDept] = useState("");
  const [regUnit, setRegUnit] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  // Supervisor Access states
  const [supWorkerId, setSupWorkerId] = useState("");
  const [supName, setSupName] = useState("");
  const [supDept, setSupDept] = useState("");
  const [supExperience, setSupExperience] = useState("");
  const [supReason, setSupReason] = useState("");
  const [supIdProof, setSupIdProof] = useState("");

  // Load remembered credentials
  useEffect(() => {
    const remembered = localStorage.getItem("remembered_identifier");
    if (remembered) {
      setIdentifier(remembered);
      setRememberMe(true);
    }
  }, []);

  // Handle standard login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError("Please fill in all credentials.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    // Parse identifier: check if email or mobile
    const isEmail = identifier.includes("@");
    const payload: Record<string, string> = { password };
    if (isEmail) {
      payload.email = identifier.trim();
    } else {
      // Strip any non-digit character for cleaner lookup
      payload.mobile = identifier.replace(/\D/g, "");
    }

    try {
      const BASE_URL = "";
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Authentication failed. Double check credentials.");
      }

      const data = await res.json();
      
      if (rememberMe) {
        localStorage.setItem("remembered_identifier", identifier);
      } else {
        localStorage.removeItem("remembered_identifier");
      }

      onLoginSuccess(data.user, data.token);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Industrial link rejected. Verify security parameters.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle worker registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!regName || !regMobile || !regEmail || !regPassword) {
      setError("Required parameters (Name, Mobile, Email, Password) cannot be empty.");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError("Worker security keys do not match. Re-verify confirm password.");
      return;
    }

    // Basic Indian Mobile validation (10 digits)
    const digitsOnly = regMobile.replace(/\D/g, "");
    if (digitsOnly.length !== 10) {
      setError("Please input a valid 10-digit Indian Mobile Number.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register-worker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          mobile: digitsOnly,
          email: regEmail,
          workerId: regWorkerId,
          department: regDept,
          factoryUnit: regUnit,
          password: regPassword
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to register worker.");
      }

      setSuccessMsg("Worker registration submitted! Pending System Administrator approval before login.");
      // Clear fields
      setRegName("");
      setRegMobile("");
      setRegEmail("");
      setRegWorkerId("");
      setRegDept("");
      setRegUnit("");
      setRegPassword("");
      setRegConfirmPassword("");
      setView("login");
    } catch (err: any) {
      setError(err.message || "Registration connection error.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle supervisor request
  const handleSupervisorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!supWorkerId || !supName || !supDept || !supExperience || !supReason) {
      setError("Please fill out all mandatory request parameters.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/request-supervisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workerId: supWorkerId,
          name: supName,
          department: supDept,
          experience: supExperience,
          reason: supReason,
          idProof: supIdProof || "Submitted Government ID Proof"
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to submit supervisor request.");
      }

      setSuccessMsg("Supervisor Access Request submitted! Pending Admin verification.");
      setSupWorkerId("");
      setSupName("");
      setSupDept("");
      setSupExperience("");
      setSupReason("");
      setSupIdProof("");
      setView("login");
    } catch (err: any) {
      setError(err.message || "Request submission error.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper for fast demo selection
  const handleDemoSelect = (mobileNum: string, pass: string) => {
    setIdentifier(mobileNum);
    setPassword(pass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#090D1A] flex font-sans text-slate-100 relative overflow-hidden">
      
      {/* Decorative dark mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111827_1px,transparent_1px),linear-gradient(to_bottom,#111827_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Grid container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 w-full max-w-7xl mx-auto relative z-10 p-4 sm:p-8 items-center gap-8">
        
        {/* Left column: Enterprise Branding Showcase */}
        <div className="lg:col-span-5 flex flex-col justify-center h-full text-left pr-0 lg:pr-8 py-8">
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl font-display shadow-lg shadow-cyan-500/25">
              O
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white font-display">OPTIMA FACTORY</h1>
              <p className="text-[10px] text-cyan-400 uppercase font-semibold tracking-widest">AI Smart Factory Core</p>
            </div>
          </div>

          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-display leading-tight mb-4">
            AI-Powered Smart Factory Operations Platform
          </h2>
          <p className="text-slate-400 text-xs leading-relaxed mb-6">
            Optima Factory integrates real-time computer vision models, predictive machine metrics, and secure workforce controls to orchestrate heavy operations seamlessly.
          </p>

          {/* Capabilities Checklist */}
          <div className="space-y-3 mb-8">
            {[
              "AI Vision Monitoring",
              "Machine Health & Telemetry",
              "Predictive Maintenance Intelligence",
              "Live Production Analytics",
              "Worker Safety & PPE Enforcement",
              "Real-Time Factory Floor Tracking"
            ].map((cap, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4.5 w-4.5 text-cyan-400 shrink-0" />
                <span className="text-slate-300 text-xs font-medium">{cap}</span>
              </div>
            ))}
          </div>

          {/* Live System Metrics */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-800">
            <div>
              <span className="text-2xl font-bold text-white font-display block">250+</span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Active Workers</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-cyan-400 font-display block">84</span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">AI Cameras</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-purple-400 font-display block">12</span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Lines Connected</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-emerald-400 font-display block">99.98%</span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">System Uptime</span>
            </div>
          </div>
        </div>

        {/* Right column: Form Panels */}
        <div className="lg:col-span-7 bg-[#0E1626] border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl relative">
          
          {/* Back button for child views */}
          {view !== "login" && (
            <button 
              onClick={() => { setView("login"); setError(null); }}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-xs font-semibold mb-6 group"
            >
              <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to System Authentication
            </button>
          )}

          {/* Error and Success notices */}
          {error && (
            <div className="mb-5 bg-red-950/40 border border-red-500/20 text-red-200 text-xs p-3 rounded-xl flex items-start gap-2.5">
              <AlertCircle className="h-4.5 w-4.5 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 bg-emerald-950/40 border border-emerald-500/20 text-emerald-200 text-xs p-3 rounded-xl flex items-start gap-2.5">
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* VIEW 1: Standard Login */}
          {view === "login" && (
            <div>
              <h3 className="text-lg font-bold text-white font-display mb-1">Industrial Control Login</h3>
              <p className="text-slate-400 text-xs mb-6">Enter your registered Mobile Number or Email to authenticate your session.</p>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Mobile Number or Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                      <Phone className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="block w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                      placeholder="e.g. 9876543210 or admin@optimafactory.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Security Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                      <Lock className="h-4 w-4" />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-slate-300 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded bg-slate-900 border-slate-800 text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    Remember Me
                  </label>
                  <button
                    type="button"
                    onClick={() => alert("Please use the Demo accounts for verification. Password resets must be triggered by the System Administrator.")}
                    className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 border border-transparent rounded-xl shadow-lg text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 focus:outline-none transition-all disabled:opacity-50 cursor-pointer font-display uppercase tracking-wider"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Authenticating Operator...
                    </span>
                  ) : (
                    "AUTHENTICATE SECURE SESSION"
                  )}
                </button>
              </form>

              {/* Redirection links for other roles */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <button 
                  onClick={() => { setView("register"); setError(null); setSuccessMsg(null); }}
                  className="text-slate-400 hover:text-white font-medium transition-colors"
                >
                  New Worker? <span className="text-cyan-400 font-semibold underline">Register here</span>
                </button>
                <button 
                  onClick={() => { setView("supervisor"); setError(null); setSuccessMsg(null); }}
                  className="text-slate-400 hover:text-white font-medium transition-colors"
                >
                  Request <span className="text-purple-400 font-semibold underline">Supervisor Access</span>
                </button>
              </div>

              {/* Demo accounts key selectors */}
              <div className="mt-6 pt-5 border-t border-slate-800">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5 justify-center">
                  <ShieldCheck className="h-3.5 w-3.5 text-cyan-500" />
                  Standard Demo Operator Access Keys
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { title: "System Administrator", user: "Admin", mobile: "9876543210", pass: "Admin@123", badgeColor: "bg-cyan-950/40 text-cyan-400 border-cyan-500/20" },
                    { title: "Floor Supervisor (Sarah)", user: "Supervisor", mobile: "9876543211", pass: "Supervisor@123", badgeColor: "bg-purple-950/40 text-purple-400 border-purple-500/20" },
                    { title: "Workstation Operator (Marcus)", user: "Worker", mobile: "9876543212", pass: "Worker@123", badgeColor: "bg-emerald-950/40 text-emerald-400 border-emerald-500/20" }
                  ].map((demo, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleDemoSelect(demo.mobile, demo.pass)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/50 hover:bg-slate-900 border border-slate-850 hover:border-slate-700 transition-all text-left group"
                    >
                      <div className="text-[11px]">
                        <span className="font-semibold text-white block group-hover:text-cyan-300 transition-colors">{demo.title}</span>
                        <span className="text-slate-500 font-mono mt-0.5 block">Mobile: {demo.mobile} | Pass: {demo.pass}</span>
                      </div>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${demo.badgeColor}`}>
                        {demo.user}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: Worker Registration */}
          {view === "register" && (
            <div>
              <h3 className="text-lg font-bold text-white font-display mb-1 flex items-center gap-1.5">
                <User className="h-5 w-5 text-cyan-400" />
                New Worker Registration
              </h3>
              <p className="text-slate-400 text-xs mb-6">Create a new Worker account. Subject to Administrator verification prior to system entry.</p>

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                        <User className="h-3.5 w-3.5" />
                      </span>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="block w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
                        placeholder="e.g. Rajesh Kumar"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Indian Mobile Number *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                        <Phone className="h-3.5 w-3.5" />
                      </span>
                      <input
                        type="tel"
                        required
                        value={regMobile}
                        onChange={(e) => setRegMobile(e.target.value)}
                        className="block w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
                        placeholder="e.g. 9876543210"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                        <Mail className="h-3.5 w-3.5" />
                      </span>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="block w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
                        placeholder="rajesh@optimafactory.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Worker ID</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                        <Cpu className="h-3.5 w-3.5" />
                      </span>
                      <input
                        type="text"
                        value={regWorkerId}
                        onChange={(e) => setRegWorkerId(e.target.value)}
                        className="block w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
                        placeholder="e.g. W-115"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Department</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                        <Briefcase className="h-3.5 w-3.5" />
                      </span>
                      <input
                        type="text"
                        value={regDept}
                        onChange={(e) => setRegDept(e.target.value)}
                        className="block w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
                        placeholder="e.g. Welding, Assembly"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Factory Unit</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                        <Building className="h-3.5 w-3.5" />
                      </span>
                      <input
                        type="text"
                        value={regUnit}
                        onChange={(e) => setRegUnit(e.target.value)}
                        className="block w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
                        placeholder="e.g. Unit 3A"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Security Password *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                        <Lock className="h-3.5 w-3.5" />
                      </span>
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="block w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Confirm Password *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                        <Lock className="h-3.5 w-3.5" />
                      </span>
                      <input
                        type="password"
                        required
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        className="block w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 border border-transparent rounded-xl shadow-lg text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 focus:outline-none transition-all disabled:opacity-50 cursor-pointer font-display uppercase tracking-wider"
                >
                  {isLoading ? "Submitting Registration..." : "SUBMIT REGISTRATION KEYS"}
                </button>
              </form>
            </div>
          )}

          {/* VIEW 3: Request Supervisor Access */}
          {view === "supervisor" && (
            <div>
              <h3 className="text-lg font-bold text-white font-display mb-1 flex items-center gap-1.5">
                <Award className="h-5 w-5 text-purple-400" />
                Supervisor Access Request
              </h3>
              <p className="text-slate-400 text-xs mb-6">Existing workers can apply for upgraded Supervisor privileges. Demands review and formal authorization from Admins.</p>

              <form onSubmit={handleSupervisorSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Worker ID *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                        <Cpu className="h-3.5 w-3.5" />
                      </span>
                      <input
                        type="text"
                        required
                        value={supWorkerId}
                        onChange={(e) => setSupWorkerId(e.target.value)}
                        className="block w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
                        placeholder="e.g. W-101"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                        <User className="h-3.5 w-3.5" />
                      </span>
                      <input
                        type="text"
                        required
                        value={supName}
                        onChange={(e) => setSupName(e.target.value)}
                        className="block w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
                        placeholder="Rajesh Kumar"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Department *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                        <Building className="h-3.5 w-3.5" />
                      </span>
                      <input
                        type="text"
                        required
                        value={supDept}
                        onChange={(e) => setSupDept(e.target.value)}
                        className="block w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
                        placeholder="e.g. Operations, Quality"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Experience (Years) *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                        <Award className="h-3.5 w-3.5" />
                      </span>
                      <input
                        type="number"
                        required
                        value={supExperience}
                        onChange={(e) => setSupExperience(e.target.value)}
                        className="block w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
                        placeholder="e.g. 5"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Reason for Promotion Request *</label>
                  <div className="relative">
                    <span className="absolute top-2.5 left-3 text-slate-500">
                      <FileText className="h-3.5 w-3.5" />
                    </span>
                    <textarea
                      required
                      rows={3}
                      value={supReason}
                      onChange={(e) => setSupReason(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all resize-none"
                      placeholder="Explain your request for supervisory roles and previous experience managing floor shifts..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Upload ID Proof / Badge Copy URL (Optional)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                      <FileText className="h-3.5 w-3.5" />
                    </span>
                    <input
                      type="text"
                      value={supIdProof}
                      onChange={(e) => setSupIdProof(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
                      placeholder="e.g. Link to ID Proof card image"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 border border-transparent rounded-xl shadow-lg text-xs font-bold text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 focus:outline-none transition-all disabled:opacity-50 cursor-pointer font-display uppercase tracking-wider"
                >
                  {isLoading ? "Submitting Request..." : "SUBMIT PROMOTION DOSSIER"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
