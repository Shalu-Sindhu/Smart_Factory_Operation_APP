import { useState, FormEvent } from "react";
import { 
  Settings, 
  PlusCircle, 
  Check, 
  Sliders, 
  ShieldAlert, 
  Timer, 
  ListOrdered,
  Layers,
  CircleAlert,
  ChevronRight
} from "lucide-react";
import { ActivityConfig } from "../types.ts";

interface ActivityConfigModuleProps {
  activities: ActivityConfig[];
  onCreateActivity: (newAct: Partial<ActivityConfig>) => void;
  onUpdateActivity: (id: string, updated: Partial<ActivityConfig>) => void;
  userRole: string;
}

export default function ActivityConfigModule({ 
  activities, 
  onCreateActivity, 
  onUpdateActivity,
  userRole
}: ActivityConfigModuleProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [stepsInput, setStepsInput] = useState("");
  const [cycleTime, setCycleTime] = useState("60");
  const [safetyVest, setSafetyVest] = useState(true);
  const [hardHat, setHardHat] = useState(true);
  const [safetyGlasses, setSafetyGlasses] = useState(true);
  const [sequenceCheck, setSequenceCheck] = useState(true);
  const [cycleDeviation, setCycleDeviation] = useState(true);
  const [alertCondition, setAlertCondition] = useState<'Immediate' | 'Delayed' | 'Manual'>("Immediate");

  const handleSaveConfig = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    const steps = stepsInput ? stepsInput.split(",").map(s => s.trim()) : ["Initiate Check", "Verify Output"];
    
    onCreateActivity({
      name,
      code,
      sequence: steps,
      cycleTimeThreshold: Number(cycleTime),
      detectionRules: {
        safetyVestRequired: safetyVest,
        hardHatRequired: hardHat,
        safetyGlassesRequired: safetyGlasses,
        sequenceCheckEnabled: sequenceCheck,
        cycleDeviationAlert: cycleDeviation
      },
      alertCondition
    });

    // Reset Form
    setName("");
    setCode("");
    setStepsInput("");
    setCycleTime("60");
    setShowCreateForm(false);
  };

  const handleToggleRule = (actId: string, ruleName: string, currentValue: boolean) => {
    const act = activities.find(a => a.id === actId);
    if (!act) return;

    onUpdateActivity(actId, {
      detectionRules: {
        ...act.detectionRules,
        [ruleName]: !currentValue
      }
    });
  };

  const isSupervisorOrAdmin = userRole === "Supervisor" || userRole === "Admin";

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-slate-950 tracking-tight">Activity Configuration</h1>
          <p className="text-slate-500 text-sm mt-1">Configure computer vision safety parameters, benchmark cycles, and standard work instructions.</p>
        </div>
        {isSupervisorOrAdmin && (
          <button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg text-sm font-semibold shadow-sm hover:from-cyan-600 hover:to-cyan-700 transition-all cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            {showCreateForm ? "Cancel Creation" : "Create Activity Rule"}
          </button>
        )}
      </div>

      {/* Creation Form Overlay/Drawer */}
      {showCreateForm && (
        <form onSubmit={handleSaveConfig} className="bg-white border-2 border-cyan-100 rounded-xl p-6 shadow-lg space-y-6 animate-fade-in">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-1.5">
              <Settings className="h-5 w-5 text-cyan-600" />
              Configure New Assembly Line Activity Check
            </h3>
            <span className="text-xs text-slate-400">Set computer vision compliance rules for this workstation</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Left side inputs */}
            <div className="space-y-4">
              <div>
                <label className="font-semibold text-slate-600 block mb-1.5">Activity/Operation Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Pneumatic Torque Bolt Fastening" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-1.5">Operation Reference Code</label>
                <input 
                  type="text" 
                  placeholder="e.g., BOLT-TRQ" 
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-1.5">Benchmark Target Cycle Time (seconds)</label>
                <input 
                  type="number" 
                  placeholder="e.g., 55" 
                  value={cycleTime}
                  onChange={(e) => setCycleTime(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Step sequence input */}
            <div className="space-y-4">
              <div>
                <label className="font-semibold text-slate-600 block mb-1.5">Standard Work Instructions Sequence Steps (comma-separated)</label>
                <textarea 
                  rows={4}
                  placeholder="e.g., Pick Bolt, Align Upper Core, Fasten Clamp, Torque Audit, Inspect Visual" 
                  value={stepsInput}
                  onChange={(e) => setStepsInput(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
                <span className="text-[10px] text-slate-400 block mt-1">Separate each sequential stage with a comma.</span>
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-1.5">Alert Response Mode</label>
                <select
                  value={alertCondition}
                  onChange={(e) => setAlertCondition(e.target.value as any)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="Immediate">Immediate Supervisor Notification</option>
                  <option value="Delayed">Buffer 3-Minute Warning</option>
                  <option value="Manual">Log Only (Supervisor Review Needed)</option>
                </select>
              </div>
            </div>

            {/* Safety & Compliance CV Rules Toggles */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3.5">
              <h4 className="font-bold text-slate-700 block text-[10px] uppercase tracking-widest border-b border-slate-200 pb-1.5">
                AI Vision Detection Triggers
              </h4>
              
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600">
                <input type="checkbox" checked={safetyVest} onChange={(e) => setSafetyVest(e.target.checked)} className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500" />
                <span>Verify High-Vis Safety Vest</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600">
                <input type="checkbox" checked={hardHat} onChange={(e) => setHardHat(e.target.checked)} className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500" />
                <span>Verify Safety Helmet / Hard Hat</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600">
                <input type="checkbox" checked={safetyGlasses} onChange={(e) => setSafetyGlasses(e.target.checked)} className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500" />
                <span>Verify Lasers/Goggles Protection</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600">
                <input type="checkbox" checked={sequenceCheck} onChange={(e) => setSequenceCheck(e.target.checked)} className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500" />
                <span>Check Out-Of-Order Work Sequence</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600">
                <input type="checkbox" checked={cycleDeviation} onChange={(e) => setCycleDeviation(e.target.checked)} className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500" />
                <span>Alert on Timing Deviations &gt; 25%</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3.5 pt-4 border-t border-slate-100">
            <button 
              type="button" 
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              Save Configuration
            </button>
          </div>
        </form>
      )}

      {/* Grid of Current Configurations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((act) => (
          <div key={act.id} className="bg-white border border-slate-200 hover:border-cyan-200 rounded-xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div>
              {/* Header block with ref code */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900">{act.name}</h3>
                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{act.id} | CODE: {act.code}</span>
                </div>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                  {act.alertCondition}
                </span>
              </div>

              {/* Steps/Sequence timeline visualization */}
              <div className="my-5 bg-slate-50 border border-slate-100 rounded-xl p-3">
                <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 block mb-2">Work Step Sequence</span>
                <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                  {act.sequence.map((step, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <span className="bg-cyan-50 text-cyan-700 font-bold px-1.5 py-0.5 rounded-md">
                        {index + 1}. {step}
                      </span>
                      {index < act.sequence.length - 1 && <ChevronRight className="h-3 w-3 text-slate-300" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Threshold info */}
              <div className="flex items-center gap-2 mb-4.5 text-xs text-slate-500">
                <Timer className="h-4 w-4 text-slate-400" />
                <span>Benchmarked Threshold Speed: <strong>{act.cycleTimeThreshold} seconds</strong></span>
              </div>

              {/* Active Rules and Toggles */}
              <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
                <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 block mb-2.5">Camera Compliance Checks</span>
                
                {/* Rule list with toggles (disabled if Worker) */}
                <div className="space-y-1.5">
                  {[
                    { label: "High-Vis Safety Vest", key: "safetyVestRequired", val: act.detectionRules.safetyVestRequired },
                    { label: "Hard Hat / Safety Helmet", key: "hardHatRequired", val: act.detectionRules.hardHatRequired },
                    { label: "Safety Lasers/Goggles", key: "safetyGlassesRequired", val: act.detectionRules.safetyGlassesRequired },
                    { label: "Sequence Execution Audit", key: "sequenceCheckEnabled", val: act.detectionRules.sequenceCheckEnabled },
                    { label: "Cycle Deviation Alarm", key: "cycleDeviationAlert", val: act.detectionRules.cycleDeviationAlert }
                  ].map((rule, idx) => (
                    <div key={idx} className="flex items-center justify-between text-slate-600 py-0.5">
                      <span className="text-[11px] font-medium">{rule.label}</span>
                      <button
                        onClick={() => handleToggleRule(act.id, rule.key, rule.val)}
                        disabled={!isSupervisorOrAdmin}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          rule.val 
                            ? "bg-cyan-50 text-cyan-600 hover:bg-cyan-100/50" 
                            : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                        } transition-colors disabled:pointer-events-none`}
                      >
                        {rule.val ? "ON" : "OFF"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 mt-4.5 pt-3 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldAlert className="h-3.5 w-3.5 text-cyan-500" />
                AI core validation active
              </span>
              <span>Updated 1d ago</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
