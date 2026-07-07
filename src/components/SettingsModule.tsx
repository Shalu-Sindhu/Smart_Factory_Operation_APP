import React, { useState } from "react";
import { 
  Settings, 
  Building, 
  Clock, 
  Bell, 
  ShieldAlert, 
  Cctv, 
  Cpu, 
  Moon, 
  Sun,
  Lock,
  CheckCircle,
  Save
} from "lucide-react";

interface SettingsModuleProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function SettingsModule({ darkMode, onToggleDarkMode }: SettingsModuleProps) {
  const [activeSubTab, setActiveSubTab] = useState<"company" | "shifts" | "alerts" | "ai">("company");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [profile, setProfile] = useState({
    name: "Optima Heavy Industries",
    address: "Manufacturing Hub, Gate 4",
    supervisor: "Sarah Jenkins"
  });

  const [shifts, setShifts] = useState({
    shiftAStart: "08:00",
    shiftAEnd: "16:00",
    shiftBStart: "16:00",
    shiftBEnd: "00:00"
  });

  const [thresholds, setThresholds] = useState({
    cycleDeviation: 15, // percent
    inactivityTime: 10, // minutes
    crowdingLimit: 4 // operators
  });

  const [aiConfidence, setAiConfidence] = useState({
    helmet: 92,
    vest: 90,
    posture: 85
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-4 min-h-[500px]">
      
      {/* Settings Sub-navigation Side rail */}
      <div className="border-r border-slate-100 dark:border-slate-800 p-5 space-y-2 col-span-1 bg-slate-50/50 dark:bg-slate-950/20">
        <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-3">System Categories</h4>
        
        <button 
          onClick={() => setActiveSubTab("company")}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeSubTab === "company" ? "bg-white dark:bg-slate-800 text-cyan-600 shadow-xs border-l-4 border-cyan-500 pl-2" : "text-slate-500 hover:text-slate-800"}`}
        >
          <Building className="h-4 w-4" />
          Company Profile
        </button>

        <button 
          onClick={() => setActiveSubTab("shifts")}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeSubTab === "shifts" ? "bg-white dark:bg-slate-800 text-cyan-600 shadow-xs border-l-4 border-cyan-500 pl-2" : "text-slate-500 hover:text-slate-800"}`}
        >
          <Clock className="h-4 w-4" />
          Shift Timings
        </button>

        <button 
          onClick={() => setActiveSubTab("alerts")}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeSubTab === "alerts" ? "bg-white dark:bg-slate-800 text-cyan-600 shadow-xs border-l-4 border-cyan-500 pl-2" : "text-slate-500 hover:text-slate-800"}`}
        >
          <ShieldAlert className="h-4 w-4" />
          Alert Thresholds
        </button>

        <button 
          onClick={() => setActiveSubTab("ai")}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeSubTab === "ai" ? "bg-white dark:bg-slate-800 text-cyan-600 shadow-xs border-l-4 border-cyan-500 pl-2" : "text-slate-500 hover:text-slate-800"}`}
        >
          <Cpu className="h-4 w-4" />
          AI Object Detection
        </button>

        <div className="h-px bg-slate-200 dark:bg-slate-800 my-4" />

        {/* Global Dark Mode controller */}
        <div className="px-3 pt-2">
          <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">Display Mode</label>
          <button 
            onClick={onToggleDarkMode}
            className="w-full flex items-center justify-between px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              {darkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-cyan-600" />}
              <span>{darkMode ? "Switch Light" : "Switch Dark"}</span>
            </div>
            <span className="text-[9px] uppercase font-bold text-slate-400">{darkMode ? "Dark" : "Light"}</span>
          </button>
        </div>
      </div>

      {/* Main settings settings panels (Col span 3) */}
      <div className="col-span-1 md:col-span-3 p-8">
        <form onSubmit={handleSave} className="space-y-6 max-w-xl">
          
          {/* Company Settings */}
          {activeSubTab === "company" && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 font-display text-sm">Company Profile Information</h3>
                <p className="text-xs text-slate-400">Configure factory site identification and administrative details</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">PLANT NAME</label>
                  <input 
                    type="text" 
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-1 focus:ring-cyan-500 text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">FACILITY SITE ADDRESS</label>
                  <input 
                    type="text" 
                    value={profile.address}
                    onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-1 focus:ring-cyan-500 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Shifts Settings */}
          {activeSubTab === "shifts" && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 font-display text-sm">Shift Timing Schedules</h3>
                <p className="text-xs text-slate-400">Define operational hours for standard attendance compliance</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">SHIFT A START</label>
                  <input 
                    type="text" 
                    value={shifts.shiftAStart}
                    onChange={(e) => setShifts(prev => ({ ...prev, shiftAStart: e.target.value }))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">SHIFT A END</label>
                  <input 
                    type="text" 
                    value={shifts.shiftAEnd}
                    onChange={(e) => setShifts(prev => ({ ...prev, shiftAEnd: e.target.value }))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Thresholds Settings */}
          {activeSubTab === "alerts" && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 font-display text-sm">Alert Trigger Thresholds</h3>
                <p className="text-xs text-slate-400">Specify tolerances for cycle delays and inattentive operators</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <div className="flex justify-between font-bold text-slate-500">
                    <span>MAX CYCLE TIME DEVIATION</span>
                    <span>{thresholds.cycleDeviation}%</span>
                  </div>
                  <input 
                    type="range" 
                    min={5} 
                    max={50}
                    value={thresholds.cycleDeviation}
                    onChange={(e) => setThresholds(prev => ({ ...prev, cycleDeviation: Number(e.target.value) }))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between font-bold text-slate-500">
                    <span>INACTIVITY TIMEOUT ALARMS</span>
                    <span>{thresholds.inactivityTime} mins</span>
                  </div>
                  <input 
                    type="range" 
                    min={2} 
                    max={30}
                    value={thresholds.inactivityTime}
                    onChange={(e) => setThresholds(prev => ({ ...prev, inactivityTime: Number(e.target.value) }))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* AI Settings */}
          {activeSubTab === "ai" && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 font-display text-sm">AI Computer Vision Confidence</h3>
                <p className="text-xs text-slate-400">Adjust probability cutoffs for real-time safety classification</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <div className="flex justify-between font-bold text-slate-500">
                    <span>HARD-HAT / HELMET SENSOR CONFIDENCE</span>
                    <span>{aiConfidence.helmet}%</span>
                  </div>
                  <input 
                    type="range" 
                    min={50} 
                    max={99}
                    value={aiConfidence.helmet}
                    onChange={(e) => setAiConfidence(prev => ({ ...prev, helmet: Number(e.target.value) }))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between font-bold text-slate-500">
                    <span>SAFETY VEST COLOR SPECTRUM MATCH</span>
                    <span>{aiConfidence.vest}%</span>
                  </div>
                  <input 
                    type="range" 
                    min={50} 
                    max={99}
                    value={aiConfidence.vest}
                    onChange={(e) => setAiConfidence(prev => ({ ...prev, vest: Number(e.target.value) }))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Save & Feedback row */}
          <div className="flex items-center gap-4 pt-5 border-t border-slate-50 dark:border-slate-800">
            <button
              type="submit"
              className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              Save Settings Profiles
            </button>

            {saveSuccess && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold animate-pulse">
                <CheckCircle className="h-4 w-4" />
                Settings updated successfully
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
