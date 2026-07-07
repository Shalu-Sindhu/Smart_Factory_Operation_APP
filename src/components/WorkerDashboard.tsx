import {
  User,
  ClipboardList,
  CalendarCheck,
  TrendingUp,
  Timer,
  Bell,
  ShieldCheck,
  Award,
  ArrowRight,
  Clock,
  Briefcase,
  UserCheck
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

import { WorkerProfile, Role } from "../types";

interface WorkerDashboardProps {
  currentUser: {
    id: string;
    name: string;
    role: Role;
    email: string;
    workerId?: string;
    department?: string;
    factoryUnit?: string;
  };
  worker?: WorkerProfile;
}

export default function WorkerDashboard({
  currentUser,
  worker
}: WorkerDashboardProps) {

  const cards = [
    {
      title: "Attendance Rate",
      value: `${worker?.attendanceRate ?? 0}%`,
      icon: CalendarCheck,
      bg: "bg-cyan-100",
      color: "text-cyan-600"
    },
    {
      title: "Productivity Score",
      value: worker?.productivityScore ?? 0,
      icon: TrendingUp,
      bg: "bg-emerald-100",
      color: "text-emerald-600"
    },
    {
      title: "Completed Tasks",
      value: worker?.completedTasks ?? 0,
      icon: ClipboardList,
      bg: "bg-purple-100",
      color: "text-purple-600"
    },
    {
      title: "Avg Cycle Time",
      value: `${worker?.averageCycleTime ?? 0}s`,
      icon: Timer,
      bg: "bg-amber-100",
      color: "text-amber-600"
    }
  ];

  const weeklyChart =
    worker?.weeklyProductivity?.length
      ? worker.weeklyProductivity.map((item) => ({
          day: item.day,
          productivity: item.score
        }))
      : [
          { day: "Mon", productivity: 0 },
          { day: "Tue", productivity: 0 },
          { day: "Wed", productivity: 0 },
          { day: "Thu", productivity: 0 },
          { day: "Fri", productivity: 0 },
          { day: "Sat", productivity: 0 }
        ];

  const activityBreakdown =
    worker?.activityBreakdown?.length
      ? worker.activityBreakdown
      : [
          {
            name: "No Activity",
            value: 100,
            color: "#CBD5E1"
          }
        ];

  const achievements = [
    {
      title: "Safety Champion",
      icon: "🦺",
      earned: (worker?.attendanceRate ?? 0) >= 95
    },
    {
      title: "High Productivity",
      icon: "🏆",
      earned: (worker?.productivityScore ?? 0) >= 90
    },
    {
      title: "Fast Operator",
      icon: "⚡",
      earned:
        (worker?.averageCycleTime ?? 999) > 0 &&
        (worker?.averageCycleTime ?? 999) <= 45
    },
    {
      title: "Task Master",
      icon: "📋",
      earned: (worker?.completedTasks ?? 0) >= 20
    }
  ];

  const aiScore = Math.round(
    ((worker?.attendanceRate ?? 0) * 0.30) +
    ((worker?.productivityScore ?? 0) * 0.50) +
    (((worker?.completedTasks ?? 0) / 20) * 20)
  );

  return (
  <div className="space-y-8 animate-fade-in">
    {/* New Worker Empty State Banner */}
    {!worker?.weeklyProductivity?.length && (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex gap-3">
          <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900">Welcome to the team!</h3>
            <p className="text-sm text-blue-700">
              Your metrics will appear here after your first shift. Check back soon.
            </p>
          </div>
        </div>
      </div>
    )}

    {/* Header */}
    <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome,
            <span className="text-cyan-600"> {currentUser?.name}</span> 👋
          </h1>
          <p className="text-slate-500 mt-1">
            Track your productivity, attendance and assigned workstations.
          </p>
        </div>
        <div className="bg-cyan-50 px-5 py-3 rounded-xl border">
          <div className="text-xs text-slate-500">Employee ID</div>
          <div className="font-semibold">{currentUser?.workerId}</div>
        </div>
      </div>

      {/* Profile */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-cyan-100 flex items-center justify-center">
            <User className="h-10 w-10 text-cyan-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{currentUser?.name}</h2>
            <p className="text-slate-500">{currentUser?.role}</p>
            <div className="flex gap-3 mt-3 text-sm">
              <span className="bg-slate-100 px-3 py-1 rounded-full">
                🏭 {currentUser?.factoryUnit}
              </span>
              <span className="bg-slate-100 px-3 py-1 rounded-full">
                📍 {currentUser?.department}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI */}
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
  {cards.map((card, index) => {
    const Icon = card.icon;
    return (
      <div
        key={index}
        className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition"
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500 font-medium">
              {card.title}
            </p>
            <h2 className="text-4xl font-bold mt-3 text-slate-900">{card.value}</h2>
          </div>
          <div className={`${card.bg} p-3 rounded-xl`}>
            <Icon className={`h-5 w-5 ${card.color}`} />
          </div>
        </div>
      </div>
    );
  })}
</div>

      {/* Shift + Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-bold text-lg mb-4">Today's Shift</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Shift</span>
              <span className="font-semibold">
                {worker?.shift || "Not Assigned"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Workstation</span>
              <span className="font-semibold">
                {worker?.workstation || "Not Assigned"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Status</span>
              <span
                className={`font-semibold ${
                  worker?.status === "Active"
                    ? "text-emerald-600"
                    : worker?.status === "Idle"
                    ? "text-amber-600"
                    : "text-slate-500"
                }`}
              >
                {worker?.status || "Offline"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-bold text-lg mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="rounded-xl bg-cyan-50 hover:bg-cyan-100 p-4 flex flex-col items-center">
              <CalendarCheck />
              <span className="mt-2 text-sm">Attendance</span>
            </button>
            <button className="rounded-xl bg-purple-50 hover:bg-purple-100 p-4 flex flex-col items-center">
              <ClipboardList />
              <span className="mt-2 text-sm">My Tasks</span>
            </button>
            <button className="rounded-xl bg-amber-50 hover:bg-amber-100 p-4 flex flex-col items-center">
              <ShieldCheck />
              <span className="mt-2 text-sm">Safety</span>
            </button>
            <button className="rounded-xl bg-emerald-50 hover:bg-emerald-100 p-4 flex flex-col items-center">
              <UserCheck />
              <span className="mt-2 text-sm">My Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Performance Analytics */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold">Weekly Productivity</h2>
            <span className="text-sm text-slate-500">Last 6 Days</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="productivity"
                  stroke="#06B6D4"
                  fill="#CFFAFE"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-5">Task Breakdown</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={activityBreakdown}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {activityBreakdown.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold">Recent Activities</h2>
          <span className="text-sm text-cyan-600">Today</span>
        </div>
        <div className="space-y-4">
          {worker?.recentActivities?.length ? (
            worker.recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 border-b pb-3 last:border-none"
              >
                <div
                  className={`w-3 h-3 rounded-full mt-2 ${
                    activity.status === "success"
                      ? "bg-emerald-500"
                      : activity.status === "warning"
                      ? "bg-amber-500"
                      : "bg-cyan-500"
                  }`}
                />
                <div>
                  <p className="font-medium">{activity.message}</p>
                  <p className="text-sm text-slate-500">{activity.timestamp}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-500">
              No recent activities available.
            </div>
          )}
        </div>
      </div>

      {/* AI Performance + Training */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-5">AI Performance Score</h2>
          <div className="flex justify-center">
            <div className="w-40 h-40 rounded-full bg-cyan-50 flex items-center justify-center border-8 border-cyan-500">
              <div>
                <div className="text-4xl font-bold text-cyan-600 text-center">
                  {aiScore}
                </div>
                <div className="text-sm text-slate-500">/100</div>
              </div>
            </div>
          </div>
          <p className="text-center text-slate-500 mt-5">
            Generated using attendance, task completion and productivity.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-5">Training Progress</h2>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between">
                <span>Machine Operation</span>
                <span>90%</span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full mt-2">
                <div className="h-3 rounded-full bg-cyan-500 w-[90%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <span>Safety Procedures</span>
                <span>95%</span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full mt-2">
                <div className="h-3 rounded-full bg-emerald-500 w-[95%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <span>Equipment Inspection</span>
                <span>75%</span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full mt-2">
                <div className="h-3 rounded-full bg-amber-500 w-[75%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Achievement Badges</h2>
          <Award className="text-amber-500" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {achievements.map((badge, index) => (
            <div
              key={index}
              className={`rounded-xl border p-5 text-center transition hover:shadow-md ${
                badge.earned
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-slate-50 border-slate-200 opacity-60"
              }`}
            >
              <div className="text-4xl">{badge.icon}</div>
              <div className="font-semibold mt-3">{badge.title}</div>
              <div className="text-sm text-slate-500 mt-2">
                {badge.earned ? "Unlocked" : "Locked"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}