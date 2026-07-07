import { useState, useEffect } from "react";
import { 
  Bell, 
  Settings, 
  Smartphone, 
  Mail, 
  Chrome, 
  Check, 
  Trash2, 
  AlertOctagon, 
  VideoOff, 
  ShieldAlert, 
  Clock, 
  CheckCircle,
  HelpCircle
} from "lucide-react";

interface AppNotification {
  id: string;
  type: "alert" | "camera" | "safety" | "attendance" | "system";
  message: string;
  timestamp: string;
  read: boolean;
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<AppNotification[]>([
    { id: "N-1", type: "safety", message: "PPE Violation: Helmet missing in assembly block Z-1", timestamp: "12:54 PM", read: false },
    { id: "N-2", type: "camera", message: "Network Drop: Camera 11 (Loading Dock A) went offline", timestamp: "12:35 PM", read: false },
    { id: "N-3", type: "attendance", message: "Late Arrival anomaly logged for shift operator Elena R.", timestamp: "11:12 AM", read: true },
    { id: "N-4", type: "system", message: "Database Sync: Daily report backup succeeded", timestamp: "10:00 AM", read: true }
  ]);

  const [channels, setChannels] = useState({
    browser: true,
    email: false,
    sms: true,
    push: false
  });

  const [showInAppOnly, setShowInAppOnly] = useState(false);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const toggleChannel = (ch: "browser" | "email" | "sms" | "push") => {
    setChannels(prev => ({ ...prev, [ch]: !prev[ch] }));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "safety":
        return <ShieldAlert className="h-4.5 w-4.5 text-rose-500 animate-bounce" />;
      case "camera":
        return <VideoOff className="h-4.5 w-4.5 text-amber-500" />;
      case "attendance":
        return <Clock className="h-4.5 w-4.5 text-purple-500" />;
      case "system":
      default:
        return <CheckCircle className="h-4.5 w-4.5 text-emerald-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      {/* Dynamic preferences card (Col span 1) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-5 h-fit">
        <div>
          <h4 className="font-bold text-slate-800 dark:text-slate-100 font-display text-sm">Notification Channels</h4>
          <p className="text-xs text-slate-400">Manage SMS-ready integrations and browser overlays</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <Chrome className="h-4.5 w-4.5 text-slate-500" />
              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">Browser Alerts</span>
                <span className="text-[10px] text-slate-400">Push overlays directly to client screen</span>
              </div>
            </div>
            <button 
              onClick={() => toggleChannel("browser")}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${channels.browser ? "bg-cyan-600 flex justify-end" : "bg-slate-300 dark:bg-slate-700 flex justify-start"}`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <Mail className="h-4.5 w-4.5 text-slate-500" />
              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">Email Reports</span>
                <span className="text-[10px] text-slate-400">Weekly shift & safety digests</span>
              </div>
            </div>
            <button 
              onClick={() => toggleChannel("email")}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${channels.email ? "bg-cyan-600 flex justify-end" : "bg-slate-300 dark:bg-slate-700 flex justify-start"}`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <Smartphone className="h-4.5 w-4.5 text-slate-500" />
              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">SMS Notification</span>
                <span className="text-[10px] text-slate-400">Critical hazard alerts via SMS API</span>
              </div>
            </div>
            <button 
              onClick={() => toggleChannel("sms")}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${channels.sms ? "bg-cyan-600 flex justify-end" : "bg-slate-300 dark:bg-slate-700 flex justify-start"}`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>
        </div>
      </div>

      {/* Live streams feed list (Col span 2) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm lg:col-span-2 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 font-display text-sm">Smart Event Feed</h4>
              <p className="text-xs text-slate-400">Aggregated alerts, camera events, and safety updates</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={markAllRead} 
                className="text-[10px] font-bold text-cyan-600 hover:text-cyan-700 cursor-pointer"
              >
                MARK ALL READ
              </button>
            </div>
          </div>

          <div className="space-y-3.5">
            {notifications.map((notif) => (
              <div 
                key={notif.id}
                className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                  notif.read 
                    ? "bg-slate-50/50 dark:bg-slate-800/20 border-slate-200 dark:border-slate-800" 
                    : "bg-cyan-50/30 dark:bg-cyan-950/10 border-cyan-100 dark:border-cyan-900/40 font-bold"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shrink-0 shadow-sm">
                    {getNotificationIcon(notif.type)}
                  </div>
                  <div>
                    <p className="text-xs text-slate-800 dark:text-slate-200 leading-snug">{notif.message}</p>
                    <span className="text-[9px] font-mono text-slate-400 block mt-1">{notif.timestamp}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button 
                    onClick={() => clearNotification(notif.id)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
                    title="Dismiss"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
