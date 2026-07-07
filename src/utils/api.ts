import { FactoryKPIs, WorkerProfile, Camera, ActivityConfig, SystemAlert, ActivityLog } from "../types.ts";

const BASE_URL = ""; // Relative paths since frontend is hosted on the same server

function getAuthHeaders(headers: Record<string, string> = {}): Record<string, string> {
  const token = localStorage.getItem("optima_token");
  const authHeaders: Record<string, string> = { ...headers };
  if (token) {
    authHeaders["Authorization"] = `Bearer ${token}`;
  }
  return authHeaders;
}

export async function login(email: string, password: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Authentication failed");
  }
  return res.json();
}

export async function fetchCurrentUser(): Promise<any> {
  const token = localStorage.getItem("optima_token");
  if (!token) return null;
  const res = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    localStorage.removeItem("optima_token");
    throw new Error("Session expired");
  }
  return res.json();
}

export async function fetchKPIs(): Promise<FactoryKPIs> {
  const res = await fetch(`${BASE_URL}/api/kpis`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error("Failed to fetch KPIs");
  return res.json();
}

export async function fetchWorkers(filters?: { search?: string; role?: string; status?: string }): Promise<WorkerProfile[]> {
  const params = new URLSearchParams();
  if (filters?.search) params.append("search", filters.search);
  if (filters?.role) params.append("role", filters.role);
  if (filters?.status) params.append("status", filters.status);
  
  const res = await fetch(`${BASE_URL}/api/workers?${params.toString()}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error("Failed to fetch workers");
  return res.json();
}

export async function fetchWorkerById(id: string): Promise<WorkerProfile> {
  const res = await fetch(`${BASE_URL}/api/workers/${id}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(`Failed to fetch worker ${id}`);
  return res.json();
}

export async function generateWorkerInsights(id: string): Promise<{ performanceAnalysis: string; safetyCompliance: string; recommendations: string[] }> {
  const res = await fetch(`${BASE_URL}/api/workers/${id}/generate-insights`, {
    method: "POST",
    headers: getAuthHeaders({ "Content-Type": "application/json" })
  });
  if (!res.ok) throw new Error(`Failed to generate insights for worker ${id}`);
  return res.json();
}

export async function fetchCameras(): Promise<Camera[]> {
  const res = await fetch(`${BASE_URL}/api/cameras`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error("Failed to fetch cameras");
  return res.json();
}

export async function registerCamera(data: Partial<Camera>): Promise<Camera> {
  const res = await fetch(`${BASE_URL}/api/cameras`, {
    method: "POST",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to register camera");
  return res.json();
}

export async function updateCamera(id: string, data: Partial<Camera>): Promise<Camera> {
  const res = await fetch(`${BASE_URL}/api/cameras/${id}`, {
    method: "PUT",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to update camera");
  return res.json();
}

export async function fetchActivities(): Promise<ActivityConfig[]> {
  const res = await fetch(`${BASE_URL}/api/activities`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error("Failed to fetch activities");
  return res.json();
}

export async function createActivity(data: Partial<ActivityConfig>): Promise<ActivityConfig> {
  const res = await fetch(`${BASE_URL}/api/activities`, {
    method: "POST",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to create activity configuration");
  return res.json();
}

export async function updateActivity(id: string, data: Partial<ActivityConfig>): Promise<ActivityConfig> {
  const res = await fetch(`${BASE_URL}/api/activities/${id}`, {
    method: "PUT",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to update activity configuration");
  return res.json();
}

export async function fetchAlerts(): Promise<SystemAlert[]> {
  const res = await fetch(`${BASE_URL}/api/alerts`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error("Failed to fetch alerts");
  return res.json();
}

export async function resolveAlert(id: string): Promise<SystemAlert> {
  const res = await fetch(`${BASE_URL}/api/alerts/${id}/resolve`, {
    method: "POST",
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error("Failed to resolve alert");
  return res.json();
}

export async function fetchAuditLogs(): Promise<ActivityLog[]> {
  const res = await fetch(`${BASE_URL}/api/audit-logs`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error("Failed to fetch audit logs");
  return res.json();
}

export async function fetchAnalyticsData(): Promise<any> {
  const res = await fetch(`${BASE_URL}/api/analytics`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error("Failed to fetch analytics");
  return res.json();
}

export async function generateReport(data: { type?: string; reportType?: string; format: string; dateRange: string }): Promise<any> {
  const payload = {
    reportType: data.reportType || data.type || "Shift Summary",
    format: data.format,
    dateRange: data.dateRange
  };
  const res = await fetch(`${BASE_URL}/api/reports/generate`, {
    method: "POST",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Failed to generate report");
  const json = await res.json();
  addReportToArchive({
    reportId: json.reportId,
    title: json.title,
    format: payload.format,
    dateRange: payload.dateRange
  });
  return json;
}

// In-memory local client backup of historical reports
const localReportsArchive = [
  { id: "REP-01", title: "Shift Summary Report - Today", format: "Excel", dateRange: "Today", timestamp: "08:15:30" },
  { id: "REP-02", title: "Safety Compliance Audit - Yesterday", format: "PDF", dateRange: "Yesterday", timestamp: "Yesterday" },
  { id: "REP-03", title: "Productivity Index Report - Last 7 Days", format: "Excel", dateRange: "Last 7 Days", timestamp: "3 days ago" }
];

export async function fetchReports(): Promise<any[]> {
  return localReportsArchive;
}

export function addReportToArchive(report: any) {
  localReportsArchive.unshift({
    id: report.reportId || `REP-${Date.now().toString().slice(-6)}`,
    title: report.title,
    format: report.format || "Excel",
    dateRange: report.dateRange || "Today",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  });
}

// WebSocket Live connection setup helper
export function connectWebSocket(onMessage: (data: any) => void): WebSocket | null {
  try {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host;
    const socket = new WebSocket(`${protocol}//${host}`);

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (err) {
        console.error("Error parsing WS packet:", err);
      }
    };

    socket.onerror = (err) => {
      console.warn("WebSocket connection error (benign in dev or proxy):", err);
    };

    return socket;
  } catch (error) {
    console.warn("Failed to initialize WebSocket:", error);
    return null;
  }
}
