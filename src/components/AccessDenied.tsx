import { ShieldAlert, ArrowLeft, Key } from "lucide-react";

interface AccessDeniedProps {
  onRedirect: () => void;
  onLogout: () => void;
  requiredRole?: string;
  currentRole?: string;
}

export default function AccessDenied({ onRedirect, onLogout, requiredRole, currentRole }: AccessDeniedProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-white border border-slate-200 rounded-3xl max-w-xl mx-auto shadow-sm my-12">
      <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-5 border border-rose-100 animate-pulse">
        <ShieldAlert className="h-8 w-8" />
      </div>

      <h1 className="font-display font-extrabold text-xl text-slate-800 tracking-tight">
        Operational Security Level Failure
      </h1>
      
      <p className="text-slate-400 text-xs mt-1.5 font-mono uppercase tracking-widest flex items-center gap-1 justify-center">
        <Key className="h-3 w-3 text-rose-500 animate-spin" />
        Scope Restriction | Code: 403_FORBIDDEN
      </p>

      <div className="mt-5 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-600 max-w-md">
        Your current session role is <strong className="text-rose-600 uppercase font-mono">{currentRole || "Worker"}</strong>. 
        Access to this operational module requires <strong className="text-cyan-600 uppercase font-mono">{requiredRole || "Administrator"}</strong> security credentials.
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <button
          onClick={onRedirect}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Safe Overview
        </button>
        
        <button
          onClick={onLogout}
          className="flex-1 px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-all border border-rose-100 cursor-pointer"
        >
          Sign Out of Session
        </button>
      </div>
    </div>
  );
}
