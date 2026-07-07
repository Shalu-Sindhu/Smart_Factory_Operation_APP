import { useState, useEffect } from "react";
import { 
  fetchKPIs, 
  fetchWorkers, 
  fetchCameras, 
  fetchActivities, 
  fetchAlerts, 
  fetchAnalyticsData,
  resolveAlert,
  createActivity,
  updateActivity,
  registerCamera,
  updateCamera,
  connectWebSocket,
  fetchCurrentUser
} from "./utils/api.ts";
import { FactoryKPIs, WorkerProfile, Camera, ActivityConfig, SystemAlert } from "./types.ts";
import WorkerDashboard from "./components/WorkerDashboard";

// Import modular components
import Sidebar from "./components/Sidebar.tsx";
import Header from "./components/Header.tsx";
import FloorDashboard from "./components/FloorDashboard.tsx";
import LiveMonitoring from "./components/LiveMonitoring.tsx";
import WorkerDirectory from "./components/WorkerDirectory.tsx";
import WorkerDetail from "./components/WorkerDetail.tsx";
import ActivityConfigModule from "./components/ActivityConfigModule.tsx";
import CameraManagementModule from "./components/CameraManagementModule.tsx";
import ActivityAnalytics from "./components/ActivityAnalytics.tsx";
import ReportCenter from "./components/ReportCenter.tsx";

// New modules
import AlertCenter from "./components/AlertCenter.tsx";
import SafetyMonitoring from "./components/SafetyMonitoring.tsx";
import PredictiveAnalytics from "./components/PredictiveAnalytics.tsx";
import MachineHealth from "./components/MachineHealth.tsx";
import CustomReportBuilder from "./components/CustomReportBuilder.tsx";
import AuditTrailView from "./components/AuditTrailView.tsx";
import SettingsModule from "./components/SettingsModule.tsx";

// Auth & Custom user modules
import Login from "./components/Login.tsx";
import AccessDenied from "./components/AccessDenied.tsx";
import PersonalAttendance from "./components/PersonalAttendance.tsx";
import MyTasks from "./components/MyTasks.tsx";
import WorkerNotifications from "./components/WorkerNotifications.tsx";
import WorkerProfileView from "./components/WorkerProfileView.tsx";
import UserManagement from "./components/UserManagement.tsx";

import { AlertTriangle, RefreshCw, Cpu } from "lucide-react";

// Declarative role configurations matching user requirements
const ALLOWED_TABS_BY_ROLE: Record<string, string[]> = {
  Admin: [
    "overview", "live", "alerts", "safety", "workers", "performance", 
    "machines", "predictive", "config", "cameras", "analytics", 
    "builder", "logs", "settings", "user-management"
  ],
  Administrator: [
    "overview", "live", "alerts", "safety", "workers", "performance", 
    "machines", "predictive", "config", "cameras", "analytics", 
    "builder", "logs", "settings", "user-management"
  ],
  Supervisor: [
    "overview", "live", "alerts", "safety", "workers", "performance", 
    "machines", "predictive", "analytics", "builder"
  ],
  Worker: [
    "overview", "performance"
  ]
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [userRole, setUserRole] = useState<string>("Supervisor");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>("W-101");

  // Secure Authentication States
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true";
  });

  const handleToggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      localStorage.setItem("darkMode", next ? "true" : "false");
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Auth session verification on launch
  useEffect(() => {
    async function verifySession() {
      try {
        const data = await fetchCurrentUser();
        if (data && data.user) {
          setCurrentUser(data.user);
          setUserRole(data.user.role);
        }
      } catch (err) {
        console.warn("Operator access token expired or absent. Routing to security gate.");
      } finally {
        setIsAuthChecking(false);
      }
    }
    verifySession();
  }, []);

  // Hash-based routing to capture manual entry of restricted URLs (e.g. #settings)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        setActiveTab(hash);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleSetActiveTabWithHash = (tab: string) => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  const handleLoginSuccess = (user: any, token: string) => {
    localStorage.setItem("optima_token", token);
    setCurrentUser(user);
    setUserRole(user.role);
    // Auto-route to default screen
    handleSetActiveTabWithHash("overview");
  };

  const handleLogout = () => {
    localStorage.removeItem("optima_token");
    setCurrentUser(null);
    handleSetActiveTabWithHash("overview");
  };

  const handleTriggerAlert = (newAlert: Partial<SystemAlert>) => {
    const completeAlert: SystemAlert = {
      id: `AL-${Math.floor(Math.random() * 900) + 100}`,
      cameraName: newAlert.cameraName || "System CV Core",
      workerName: newAlert.workerName,
      zone: newAlert.zone || "Plant Floor",
      type: newAlert.type || "Safety Violation",
      severity: newAlert.severity || "High",
      timestamp: newAlert.timestamp || new Date().toLocaleTimeString(),
      status: "Unresolved",
      message: newAlert.message || "Automatic anomaly trigger"
    };
    setAlerts(prev => [completeAlert, ...prev]);
  };

  // Telemetry States
  const [kpis, setKPIs] = useState<FactoryKPIs | null>(null);
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [activities, setActivities] = useState<ActivityConfig[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Connection & UI state
  const [websocketConnected, setWebsocketConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Core Data Fetcher
  const loadAllData = async () => {
    try {
      setError(null);
      const [kpiRes, workerRes, camRes, actRes, alertRes, analyticRes] = await Promise.all([
        fetchKPIs(),
        fetchWorkers(),
        fetchCameras(),
        fetchActivities(),
        fetchAlerts(),
        fetchAnalyticsData()
      ]);

      setKPIs(kpiRes);
      setWorkers(workerRes);
      setCameras(camRes);
      setActivities(actRes);
      setAlerts(alertRes);
      setAnalyticsData(analyticRes);
    } catch (err: any) {
      console.error("Data synchronization error:", err);
      setError("Failed to link live factory servers. Re-initiating connection.");
    } finally {
      setLoading(false);
    }
  };

  // Sync state ONLY when user session is logged in and verified
  useEffect(() => {
    if (currentUser) {
      loadAllData();
    }
  }, [currentUser]);

  // WebSocket Subscription
  useEffect(() => {
    if (!currentUser) return;

    const handleWsPacket = (packet: any) => {
      console.log("WS Packet broadcast received:", packet);
      setWebsocketConnected(true);

      if (packet.type === "TELEMETRY_UPDATE") {
        if (packet.data.kpis) {
          setKPIs(packet.data.kpis);
        }
        if (packet.data.workers) {
          setWorkers(packet.data.workers);
        }
        if (packet.data.cameras) {
          setCameras(packet.data.cameras);
        }
      } else if (packet.type === "ALERT_TRIGGERED") {
        setAlerts((prev) => {
          if (prev.some(a => a.id === packet.data.id)) return prev;
          return [packet.data, ...prev];
        });
        fetchKPIs().then(setKPIs).catch(console.warn);
      }
    };

    const ws = connectWebSocket(handleWsPacket);
    if (ws) {
      setWebsocketConnected(true);
      ws.onopen = () => setWebsocketConnected(true);
      ws.onclose = () => setWebsocketConnected(false);
    }

    return () => {
      if (ws) ws.close();
    };
  }, [currentUser]);

  // API Call handlers
  const handleResolveAlert = async (id: string) => {
    try {
      await resolveAlert(id);
      setAlerts((prev) => prev.map(a => a.id === id ? { ...a, status: "Resolved" } : a));
      const kpiRes = await fetchKPIs();
      setKPIs(kpiRes);
    } catch (err) {
      console.error("Alert resolution failure:", err);
    }
  };

  const handleCreateActivity = async (newAct: Partial<ActivityConfig>) => {
    try {
      const created = await createActivity(newAct);
      setActivities((prev) => [created, ...prev]);
    } catch (err) {
      console.error("Failed to post activity configuration:", err);
    }
  };

  const handleUpdateActivity = async (id: string, updated: Partial<ActivityConfig>) => {
    try {
      const res = await updateActivity(id, updated);
      setActivities((prev) => prev.map(a => a.id === id ? res : a));
    } catch (err) {
      console.error("Failed to update activity config:", err);
    }
  };

  const handleRegisterCamera = async (newCam: Partial<Camera>) => {
    try {
      const registered = await registerCamera(newCam);
      setCameras((prev) => [...prev, registered]);
    } catch (err) {
      console.error("Failed to register camera node:", err);
    }
  };

  const handleUpdateCamera = async (id: string, updated: Partial<Camera>) => {
    try {
      const res = await updateCamera(id, updated);
      setCameras((prev) => prev.map(c => c.id === id ? res : c));
    } catch (err) {
      console.error("Failed to update camera properties:", err);
    }
  };

  const handleUpdateWorker = (id: string, updatedFields: Partial<WorkerProfile>) => {
    setWorkers((prev) => prev.map(worker => {
      if (worker.id === id) {
        return {
          ...worker,
          ...updatedFields
        };
      }
      return worker;
    }));
  };

  const handleNavigateToWorker = (workerId: string) => {
    setSelectedWorkerId(workerId);
    handleSetActiveTabWithHash("performance");
  };

  // Calculate unresolved counts
  const unresolvedAlerts = alerts.filter(a => a.status === "Unresolved");
  const activeWorkersCount = workers.filter(w => w.status === "Active").length;

  // Active Screen Selector helper with Permission Interceptor
  const renderActiveScreen = () => {
    // Intercept with authorization check
    const allowedTabs = ALLOWED_TABS_BY_ROLE[userRole] || [];
    if (!allowedTabs.includes(activeTab)) {
      return (
        <AccessDenied 
          onRedirect={() => {
            const defaultTab = allowedTabs[0] || "overview";
            handleSetActiveTabWithHash(defaultTab);
          }}
          onLogout={handleLogout}
          currentRole={currentUser?.role}
          requiredRole={
            ["config", "cameras", "predictive", "logs", "settings", "user-management"].includes(activeTab)
              ? "Administrator" 
              : "Supervisor"
          }
        />
      );
    }

    switch (activeTab) {
      case "attendance":
        return <PersonalAttendance />;
      case "tasks":
        return <MyTasks />;
      case "notifications":
        return <WorkerNotifications />;
      case "profile":
        return <WorkerProfileView currentUser={currentUser} onLogout={handleLogout} />;
      case "user-management":
        return <UserManagement />;
      case "live":
        return (
          <LiveMonitoring 
            cameras={cameras}
            workers={workers}
            alerts={alerts}
            onResolveAlert={handleResolveAlert}
            onNavigateToWorker={handleNavigateToWorker}
          />
        );
      case "alerts":
        return (
          <AlertCenter 
            alerts={alerts}
            onResolveAlert={handleResolveAlert}
          />
        );
      case "safety":
        return (
          <SafetyMonitoring 
            onTriggerAlert={handleTriggerAlert}
          />
        );
      case "workers":
        return (
          <WorkerDirectory 
            workers={workers}
            onNavigateToWorker={handleNavigateToWorker}
            onUpdateWorker={handleUpdateWorker}
            userRole={userRole}
          />
        );
      case "performance":
        return (
          <WorkerDetail 
            workers={workers}
            selectedWorkerId={selectedWorkerId}
            onSelectWorkerId={setSelectedWorkerId}
          />
        );
      case "machines":
        return (
          <MachineHealth />
        );
      case "predictive":
        return (
          <PredictiveAnalytics />
        );
      case "config":
        return (
          <ActivityConfigModule 
            activities={activities}
            onCreateActivity={handleCreateActivity}
            onUpdateActivity={handleUpdateActivity}
            userRole={userRole}
          />
        );
      case "cameras":
        return (
          <CameraManagementModule 
            cameras={cameras}
            onRegisterCamera={handleRegisterCamera}
            onUpdateCamera={handleUpdateCamera}
            userRole={userRole}
          />
        );
      case "analytics":
        return (
          <ActivityAnalytics 
            analyticsData={analyticsData}
          />
        );
      case "reports":
        return <ReportCenter />;
      case "builder":
        return (
          <CustomReportBuilder 
            workers={workers}
            cameras={cameras}
          />
        );
      case "logs":
        return (
          <AuditTrailView />
        );
      case "settings":
        return (
          <SettingsModule 
            darkMode={darkMode}
            onToggleDarkMode={handleToggleDarkMode}
          />
        );
      case "overview":
default: {
  if (currentUser?.role === "Worker") {
    const workerProfile =
      workers.find(w => w.email === currentUser.email) ||
      workers.find(w => w.id === currentUser.id);

    return (
      <WorkerDashboard
        currentUser={currentUser}
        worker={workerProfile}
      />
    );
  }

  return (
    <FloorDashboard
      kpis={kpis!}
      workers={workers}
      alerts={alerts}
      analyticsData={analyticsData}
      onNavigateToTab={handleSetActiveTabWithHash}
      onNavigateToWorker={handleNavigateToWorker}
    />
  );
}
  }
};
  // Loading indicator for Session Authorization
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center text-center p-8">
        <div className="relative h-16 w-16 mb-4 flex items-center justify-center">
          <span className="h-12 w-12 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin absolute" />
          <Cpu className="h-6 w-6 text-cyan-400 animate-pulse" />
        </div>
        <h2 className="font-display font-bold text-base text-slate-100">Authorizing Operational Access Token</h2>
        <p className="text-slate-500 text-xs mt-1.5 font-mono">Verifying secure industrial session keys...</p>
      </div>
    );
  }

  // Secure Gateway: If not authenticated, open with the modern Login component
  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Sync loading state for live KPIs
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center p-8">
        <div className="relative h-16 w-16 mb-4 flex items-center justify-center">
          <span className="h-12 w-12 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin absolute" />
          <Cpu className="h-6 w-6 text-cyan-600 animate-pulse" />
        </div>
        <h2 className="font-display font-bold text-lg text-slate-800">Synchronizing Optima Factory Nodes</h2>
        <p className="text-slate-400 text-xs mt-1.5 font-mono">Initializing computer vision pipeline streams...</p>
      </div>
    );
  }

  // Reconnection warning gate
  if (error && !kpis) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center p-8">
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 max-w-sm mb-5">
          <AlertTriangle className="h-10 w-10 mx-auto mb-2 animate-bounce" />
          <p className="text-sm font-semibold">{error}</p>
        </div>
        <button 
          onClick={loadAllData}
          className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          Reconnect Server
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-800">
      
      {/* Sidebar - Fixed Left */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={handleSetActiveTabWithHash}
        unresolvedAlertsCount={unresolvedAlerts.length}
        activeWorkersCount={activeWorkersCount}
        userRole={userRole}
        userName={currentUser?.name || "Marcus Ross"}
        onLogout={handleLogout}
      />

      {/* Main Content Pane - Offset by Sidebar width */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <Header 
          activeTab={activeTab}
          unresolvedAlerts={unresolvedAlerts}
          onResolveAlert={handleResolveAlert}
          websocketConnected={websocketConnected}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          userRole={userRole}
          setUserRole={setUserRole}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Dynamic Screen View Space */}
        <main className="flex-1 p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {renderActiveScreen()}
        </main>
      </div>
    </div>
  );
}
