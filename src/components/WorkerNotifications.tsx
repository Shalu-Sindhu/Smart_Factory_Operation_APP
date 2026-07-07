import { useState } from "react";
import { Bell, Radio, MessageSquare, AlertTriangle, Check } from "lucide-react";

interface NotificationMsg {
  id: string;
  sender: string;
  category: "Safety" | "System" | "Supervisor";
  message: string;
  time: string;
  unread: boolean;
}

export default function WorkerNotifications() {
  const [msgs, setMsgs] = useState<NotificationMsg[]>([
    {
      id: "msg-1",
      sender: "AI Computer Vision Core",
      category: "Safety",
      message: "Safety Compliance Check passed. Wear verification: hard hat, safety vest, and laser-eye goggles detected.",
      time: "10 mins ago",
      unread: true
    },
    {
      id: "msg-2",
      sender: "Sarah Jenkins (Supervisor)",
      category: "Supervisor",
      message: "Great speed on assembly batch #440 Marcus. Keep up the high precision rate.",
      time: "1 hr ago",
      unread: true
    },
    {
      id: "msg-3",
      sender: "Plant Manager Broadcast",
      category: "System",
      message: "Scheduled preventive maintenance on Robot Torque Arm Assembly-02 will begin at 14:15 PM today. Ensure all floor clearances are maintained.",
      time: "3 hrs ago",
      unread: false
    },
    {
      id: "msg-4",
      sender: "AI Alert Dispatch",
      category: "Safety",
      message: "Safety warning resolved: Proximity hazard detected and cleared on station Quality-03.",
      time: "Yesterday",
      unread: false
    }
  ]);

  const markAllRead = () => {
    setMsgs(prev => prev.map(m => ({ ...m, unread: false })));
  };

  const toggleRead = (id: string) => {
    setMsgs(prev => prev.map(m => m.id === id ? { ...m, unread: !m.unread } : m));
  };

  const unreadCount = msgs.filter(m => m.unread).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">Operator Notifications</h1>
          <p className="text-xs text-slate-500 font-mono">Live plant communications, broadcasts, and feedback</p>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <Check className="h-4 w-4" />
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
        {msgs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No active notification alerts. All streams normal.
          </div>
        ) : (
          msgs.map((msg) => (
            <div 
              key={msg.id} 
              onClick={() => toggleRead(msg.id)}
              className={`p-4 flex gap-4 hover:bg-slate-50/40 transition-colors duration-150 cursor-pointer relative ${
                msg.unread ? "bg-cyan-50/10" : ""
              }`}
            >
              {/* Unread indicator dot */}
              {msg.unread && (
                <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-cyan-500 rounded-full" />
              )}

              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                msg.category === "Safety" 
                  ? "bg-rose-50 text-rose-600" 
                  : msg.category === "Supervisor" 
                  ? "bg-purple-50 text-purple-600" 
                  : "bg-amber-50 text-amber-600"
              }`}>
                {msg.category === "Safety" ? (
                  <AlertTriangle className="h-4.5 w-4.5" />
                ) : msg.category === "Supervisor" ? (
                  <MessageSquare className="h-4.5 w-4.5" />
                ) : (
                  <Radio className="h-4.5 w-4.5" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{msg.sender}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                      msg.category === "Safety" 
                        ? "bg-rose-100 text-rose-700" 
                        : msg.category === "Supervisor"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {msg.category}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">{msg.time}</span>
                </div>
                <p className={`text-xs text-slate-600 mt-1.5 leading-relaxed ${msg.unread ? "font-medium" : ""}`}>
                  {msg.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
