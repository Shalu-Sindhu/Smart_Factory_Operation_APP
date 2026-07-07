import { useState } from "react";
import { CheckSquare, Square, ClipboardList, Target, Flame, CheckCircle2 } from "lucide-react";

interface TaskItem {
  id: string;
  title: string;
  description: string;
  station: string;
  timeLimit: string;
  completed: boolean;
  priority: "High" | "Medium" | "Low";
}

export default function MyTasks() {
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: "tsk-1",
      title: "Assembly-01 Pre-Shift Calibration",
      description: "Run diagnostic program and verify mechanical arm torque accuracy.",
      station: "Assembly-01",
      timeLimit: "15 mins",
      completed: true,
      priority: "High"
    },
    {
      id: "tsk-2",
      title: "PPE Verification & Camera Align",
      description: "Step in front of AI detection camera to verify goggles, vest, and helmet.",
      station: "Assembly-01",
      timeLimit: "5 mins",
      completed: true,
      priority: "High"
    },
    {
      id: "tsk-3",
      title: "Bolt Assembly Batch #440",
      description: "Fasten and screw the main structural chassis bolts (42 units completed).",
      station: "Assembly-01",
      timeLimit: "3 hrs",
      completed: false,
      priority: "Medium"
    },
    {
      id: "tsk-4",
      title: "Quality Tolerance Verification",
      description: "Execute a manual depth-sensor probe calibration test on finished assemblies.",
      station: "Quality-03",
      timeLimit: "45 mins",
      completed: false,
      priority: "Low"
    }
  ]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 font-display">My Daily Workstation Tasks</h1>
        <p className="text-xs text-slate-500 font-mono">Assigned shift instructions for Station Assembly-01</p>
      </div>

      {/* Task progress cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center gap-3 text-cyan-600 mb-2">
            <Target className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider font-display">Shift Target</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{progressPercent}% Completed</div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
            <div className="bg-cyan-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center gap-3 text-purple-600 mb-2">
            <ClipboardList className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider font-display">Task Counters</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{completedCount} of {tasks.length} Done</div>
          <p className="text-[10px] text-slate-400 mt-1">2 pending operations left today</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center gap-3 text-amber-500 mb-2">
            <Flame className="h-5 w-5 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider font-display">Operator Streak</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">5 Days Streak</div>
          <p className="text-[10px] text-emerald-600 font-medium mt-1">Daily productivity target met consecutive days</p>
        </div>
      </div>

      {/* Task Checklist list */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="font-display font-semibold text-xs uppercase tracking-wider text-slate-600">
            Assigned checklist items
          </h3>
          <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Shift A Instructions
          </span>
        </div>
        <div className="divide-y divide-slate-100 p-2">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              onClick={() => toggleTask(task.id)}
              className={`p-4 flex items-start gap-4 transition-all duration-150 cursor-pointer hover:bg-slate-50/50 rounded-lg ${
                task.completed ? "opacity-75 bg-slate-50/20" : ""
              }`}
            >
              <button className="text-cyan-600 hover:text-cyan-700 transition-colors mt-0.5 shrink-0">
                {task.completed ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className={`text-sm font-semibold text-slate-800 ${task.completed ? "line-through text-slate-400" : ""}`}>
                    {task.title}
                  </h4>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                    task.priority === "High" ? "bg-rose-50 text-rose-600" : task.priority === "Medium" ? "bg-cyan-50 text-cyan-600" : "bg-slate-100 text-slate-600"
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <p className={`text-xs text-slate-500 mt-1 ${task.completed ? "line-through text-slate-400" : ""}`}>
                  {task.description}
                </p>
                <div className="flex items-center gap-4 mt-2 font-mono text-[10px] text-slate-400">
                  <span>Station: {task.station}</span>
                  <span>Est. Time: {task.timeLimit}</span>
                </div>
              </div>

              {task.completed && (
                <div className="flex items-center gap-1 text-emerald-600 font-semibold text-xs">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Done</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
