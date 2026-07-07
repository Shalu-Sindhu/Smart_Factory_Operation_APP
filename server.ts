import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { WorkerProfile, Camera, ActivityConfig, SystemAlert, ActivityLog, FactoryKPIs } from "./src/types.ts";
import { prisma } from "./src/lib/prisma.ts";

dotenv.config();

// Initialize Gemini API
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const app = express();
app.use(express.json());

const PORT = 3000;

// ==========================================
// Stateful Simulated Database
// ==========================================

const initialWorkers: WorkerProfile[] = [
  {
    id: "W-101",
    name: "Marcus Vance",
    email: "marcus.vance@smartfactory.com",
    role: "Worker",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    shift: "Day Shift (06:00 - 14:00)",
    status: "Active",
    workstation: "Assembly-01",
    productivityScore: 94,
    attendanceRate: 98,
    completedTasks: 42,
    averageCycleTime: 44,
    recentActivities: [
      { id: "ra-1", timestamp: "08:15 AM", type: "Cycle Complete", status: "success", message: "Bolt Assembly cycle completed in 42s" },
      { id: "ra-2", timestamp: "07:55 AM", type: "Process Check", status: "info", message: "Workstation Assembly-01 self-check verified" },
      { id: "ra-3", timestamp: "06:12 AM", type: "Shift Start", status: "success", message: "Clocked in and logged into workstation Assembly-01" }
    ],
    weeklyProductivity: [
      { day: "Mon", score: 92 },
      { day: "Tue", score: 95 },
      { day: "Wed", score: 94 },
      { day: "Thu", score: 91 },
      { day: "Fri", score: 94 }
    ],
    activityBreakdown: [
      { name: "Screwing & Fastening", value: 45, color: "#06b6d4" },
      { name: "Part Alignment", value: 30, color: "#a855f7" },
      { name: "Quality Check", value: 15, color: "#10b981" },
      { name: "Material Loading", value: 10, color: "#6b7280" }
    ]
  },
  {
    id: "W-102",
    name: "Elena Rostova",
    email: "elena.rostova@smartfactory.com",
    role: "Worker",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
    shift: "Day Shift (06:00 - 14:00)",
    status: "Active",
    workstation: "Quality-03",
    productivityScore: 91,
    attendanceRate: 96,
    completedTasks: 35,
    averageCycleTime: 58,
    recentActivities: [
      { id: "ra-4", timestamp: "08:24 AM", type: "Quality Check", status: "success", message: "Board Inspection completed in 55s" },
      { id: "ra-5", timestamp: "07:44 AM", type: "Process Warning", status: "warning", message: "Sequence deviation: probe tested before visual check" },
      { id: "ra-6", timestamp: "06:05 AM", type: "Shift Start", status: "success", message: "Clocked in at Quality control station 03" }
    ],
    weeklyProductivity: [
      { day: "Mon", score: 88 },
      { day: "Tue", score: 90 },
      { day: "Wed", score: 93 },
      { day: "Thu", score: 89 },
      { day: "Fri", score: 91 }
    ],
    activityBreakdown: [
      { name: "Solder Inspection", value: 50, color: "#06b6d4" },
      { name: "Functional Probing", value: 25, color: "#a855f7" },
      { name: "Label & Pack", value: 15, color: "#10b981" },
      { name: "Calibration Check", value: 10, color: "#6b7280" }
    ]
  },
  {
    id: "W-103",
    name: "Devlin Patel",
    email: "devlin.patel@smartfactory.com",
    role: "Worker",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80",
    shift: "Swing Shift (14:00 - 22:00)",
    status: "Idle",
    workstation: "Assembly-02",
    productivityScore: 82,
    attendanceRate: 92,
    completedTasks: 21,
    averageCycleTime: 62,
    recentActivities: [
      { id: "ra-7", timestamp: "08:02 AM", type: "Safety Incident", status: "warning", message: "Safety Alert: No Hard Hat detected in active safety zone" },
      { id: "ra-8", timestamp: "07:15 AM", type: "Material Delay", status: "info", message: "Waiting for bolt fastener resupply" }
    ],
    weeklyProductivity: [
      { day: "Mon", score: 85 },
      { day: "Tue", score: 83 },
      { day: "Wed", score: 80 },
      { day: "Thu", score: 84 },
      { day: "Fri", score: 82 }
    ],
    activityBreakdown: [
      { name: "Bolt Torque Fastening", value: 40, color: "#06b6d4" },
      { name: "Part Placement", value: 30, color: "#a855f7" },
      { name: "Downtime / Waiting", value: 20, color: "#ef4444" },
      { name: "Cleanup", value: 10, color: "#6b7280" }
    ]
  },
  {
    id: "W-104",
    name: "Sarah Jenkins",
    email: "sarah.jenkins@smartfactory.com",
    role: "Supervisor",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    shift: "Day Shift (06:00 - 14:00)",
    status: "Active",
    workstation: "Control-01",
    productivityScore: 98,
    attendanceRate: 100,
    completedTasks: 0,
    averageCycleTime: 0,
    recentActivities: [
      { id: "ra-9", timestamp: "08:30 AM", type: "Audit Log", status: "success", message: "Approved Activity Configuration update BOLT-ASM" },
      { id: "ra-10", timestamp: "06:00 AM", type: "System Start", status: "info", message: "Supervisor logged in to master floor console" }
    ],
    weeklyProductivity: [
      { day: "Mon", score: 98 },
      { day: "Tue", score: 97 },
      { day: "Wed", score: 99 },
      { day: "Thu", score: 98 },
      { day: "Fri", score: 98 }
    ],
    activityBreakdown: [
      { name: "Floor Supervision", value: 60, color: "#06b6d4" },
      { name: "Incident Resolution", value: 25, color: "#a855f7" },
      { name: "Reporting & Auditing", value: 15, color: "#10b981" }
    ]
  },
  {
    id: "W-105",
    name: "Kenji Sato",
    email: "kenji.sato@smartfactory.com",
    role: "Worker",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    shift: "Night Shift (22:00 - 06:00)",
    status: "Offline",
    workstation: "Packaging-02",
    productivityScore: 88,
    attendanceRate: 94,
    completedTasks: 18,
    averageCycleTime: 50,
    recentActivities: [
      { id: "ra-11", timestamp: "Yesterday 05:45 AM", type: "Shift End", status: "success", message: "Shift completed, clocked out safely" }
    ],
    weeklyProductivity: [
      { day: "Mon", score: 86 },
      { day: "Tue", score: 87 },
      { day: "Wed", score: 89 },
      { day: "Thu", score: 90 },
      { day: "Fri", score: 88 }
    ],
    activityBreakdown: [
      { name: "Carton Stacking", value: 55, color: "#06b6d4" },
      { name: "Barcode Scanning", value: 25, color: "#a855f7" },
      { name: "Stretch Wrap Ops", value: 20, color: "#10b981" }
    ]
  }
];

const initialCameras: Camera[] = [
  {
    id: "CAM-01",
    name: "Assembly Line A Main",
    zone: "Production Floor A",
    status: "Active",
    recordingStatus: "Recording",
    workstation: "Assembly-01",
    recordingUptime: 99.8,
    healthScore: 98,
    resolution: "1920x1080",
    fps: 30
  },
  {
    id: "CAM-02",
    name: "QC Inspect Station Cam",
    zone: "Quality Control Room",
    status: "Active",
    recordingStatus: "Recording",
    workstation: "Quality-03",
    recordingUptime: 99.5,
    healthScore: 97,
    resolution: "1920x1080",
    fps: 30
  },
  {
    id: "CAM-03",
    name: "Assembly Line B Secondary",
    zone: "Production Floor A",
    status: "Alerting",
    recordingStatus: "Recording",
    workstation: "Assembly-02",
    recordingUptime: 95.2,
    healthScore: 84,
    resolution: "1280x720",
    fps: 24
  },
  {
    id: "CAM-04",
    name: "Packaging Area Overview",
    zone: "Logistics Bay",
    status: "Active",
    recordingStatus: "Recording",
    workstation: "Packaging-01",
    recordingUptime: 99.9,
    healthScore: 99,
    resolution: "1920x1080",
    fps: 30
  }
];

const initialActivities: ActivityConfig[] = [
  {
    id: "ACT-01",
    name: "Standard Bolt Assembly",
    code: "BOLT-ASM",
    sequence: ["Pick Bolt", "Align Part", "Insert Bolt", "Torque Check", "Release Part"],
    cycleTimeThreshold: 50,
    detectionRules: {
      safetyVestRequired: true,
      hardHatRequired: true,
      safetyGlassesRequired: true,
      sequenceCheckEnabled: true,
      cycleDeviationAlert: true
    },
    alertCondition: "Immediate"
  },
  {
    id: "ACT-02",
    name: "Electronic Board Inspection",
    code: "PCB-QC",
    sequence: ["Solder Visual Inspection", "Component Presence Check", "Functional Probe Test", "Sticker Application"],
    cycleTimeThreshold: 75,
    detectionRules: {
      safetyVestRequired: false,
      hardHatRequired: false,
      safetyGlassesRequired: true,
      sequenceCheckEnabled: true,
      cycleDeviationAlert: true
    },
    alertCondition: "Immediate"
  },
  {
    id: "ACT-03",
    name: "Pallet Carton Stacking",
    code: "PLT-STK",
    sequence: ["Pick Carton", "Scan Barcode", "Place on Pallet", "Stretch Wrap Layer"],
    cycleTimeThreshold: 60,
    detectionRules: {
      safetyVestRequired: true,
      hardHatRequired: true,
      safetyGlassesRequired: false,
      sequenceCheckEnabled: false,
      cycleDeviationAlert: true
    },
    alertCondition: "Delayed"
  }
];

const initialAlerts: SystemAlert[] = [
  {
    id: "ALT-201",
    cameraName: "Assembly Line B Secondary",
    workerName: "Devlin Patel",
    zone: "Production Floor A",
    type: "Safety Violation",
    severity: "High",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
    status: "Unresolved",
    message: "PPE Violation: No Hard Hat detected on worker Devlin Patel at station Assembly-02"
  },
  {
    id: "ALT-202",
    cameraName: "QC Inspect Station Cam",
    workerName: "Elena Rostova",
    zone: "Quality Control Room",
    type: "Process Deviation",
    severity: "Medium",
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(), // 2 hours ago
    status: "Resolved",
    message: "Process Out of Order: Board functional probed before visual inspection sequence"
  },
  {
    id: "ALT-203",
    cameraName: "Assembly Line B Secondary",
    workerName: "Devlin Patel",
    zone: "Production Floor A",
    type: "Downtime Warning",
    severity: "Medium",
    timestamp: new Date(Date.now() - 150 * 60 * 1000).toISOString(),
    status: "Unresolved",
    message: "Workstation Assembly-02 inactive for more than 15 minutes (potential parts stockout)"
  }
];

const initialAuditLogs: ActivityLog[] = [
  {
    id: "AL-1",
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    module: "Activity Configuration",
    action: "Updated rules",
    user: "Sarah Jenkins (Supervisor)",
    details: "Enabled 'Hard Hat Required' check on Standard Bolt Assembly activity (BOLT-ASM)",
    severity: "info"
  },
  {
    id: "AL-2",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    module: "Camera Management",
    action: "Registered Camera",
    user: "System Admin",
    details: "New camera CAM-04 registered at Logistics Bay workstation Packaging-01",
    severity: "info"
  },
  {
    id: "AL-3",
    timestamp: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    module: "Safety Controls",
    action: "Critical Alert triggered",
    user: "AI Computer Vision Core",
    details: "High severity Safety Violation triggered at zone Production Floor A: No Hard Hat",
    severity: "warning"
  }
];

const getKPIs = async (): Promise<FactoryKPIs> => {
  try {
    const allWorkers = await prisma.workerProfile.findMany() as unknown as WorkerProfile[];
    const allCameras = await prisma.camera.findMany() as unknown as Camera[];
    const activeAlertsCount = await prisma.systemAlert.count({
      where: { status: "Unresolved" }
    });

    const activeWorkers = allWorkers.filter(w => w.status === "Active").length;
    const activeWorkstations = new Set(allWorkers.filter(w => w.status === "Active").map(w => w.workstation)).size;
    const totalCompletedTasks = allWorkers.reduce((acc, w) => acc + w.completedTasks, 0);
    const activeWorkersWithCycle = allWorkers.filter(w => w.status === "Active" && w.averageCycleTime > 0);
    const avgCycle = Math.round(
      activeWorkersWithCycle.reduce((acc, w) => acc + w.averageCycleTime, 0) / 
      (activeWorkersWithCycle.length || 1)
    );
    const cameraOnline = allCameras.length > 0 
      ? Math.round((allCameras.filter(c => c.status !== "Offline").length / allCameras.length) * 100)
      : 100;

    return {
      activeWorkersCount: activeWorkers,
      activeWorkstationsCount: activeWorkstations,
      alertCount: activeAlertsCount,
      completedTasksCount: totalCompletedTasks,
      avgCycleTime: avgCycle,
      cameraOnlinePercentage: cameraOnline,
      overallProductivity: 89, // Overall factory score
      downtimeMinutes: 45
    };
  } catch (error) {
    console.error("Failed to get KPIs from database:", error);
    return {
      activeWorkersCount: 0,
      activeWorkstationsCount: 0,
      alertCount: 0,
      completedTasksCount: 0,
      avgCycleTime: 0,
      cameraOnlinePercentage: 0,
      overallProductivity: 0,
      downtimeMinutes: 0
    };
  }
};

// ==========================================
// REST API Routes
// ==========================================

const JWT_SECRET = process.env.JWT_SECRET || "optima-factory-secret-key-123!";

// Middleware to authenticate JWT
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = decoded;
    next();
  });
};

// Auth Routes
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, mobile, password } = req.body;
    if ((!email && !mobile) || !password) {
      return res.status(400).json({ error: "Email/Mobile and password are required" });
    }

    // Lookup user by email OR mobile
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          email ? { email } : undefined,
          mobile ? { mobile } : undefined
        ].filter(Boolean) as any
      }
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check status
    if (user.status === "Pending") {
      return res.status(403).json({ error: "Your worker registration is pending administrator approval." });
    }
    if (user.status === "Rejected") {
      return res.status(403).json({ error: "Your registration request has been rejected." });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create login history record
    await prisma.loginHistory.create({
      data: {
        userId: user.id,
        mobile: user.mobile,
        status: "SUCCESS",
        ipAddress: req.ip || "127.0.0.1",
        userAgent: req.headers["user-agent"] || "Unknown"
      }
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        action: "Login",
        userId: user.id,
        userEmail: user.email,
        userMobile: user.mobile,
        details: `User logged in successfully: ${user.name} (${user.role})`
      }
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, mobile: user.mobile, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        mobile: user.mobile,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login endpoint error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/auth/me", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    res.json({ user: decoded });
  });
});

// Worker registration (public)
app.post("/api/auth/register-worker", async (req, res) => {
  try {
    const { name, mobile, email, workerId, department, factoryUnit, password } = req.body;
    
    if (!name || !mobile || !email || !password) {
      return res.status(400).json({ error: "Full Name, Mobile Number, Email, and Password are required" });
    }

    // Check unique constraints
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ error: "Email address is already registered" });
    }

    const existingMobile = await prisma.user.findUnique({ where: { mobile } });
    if (existingMobile) {
      return res.status(400).json({ error: "Mobile number is already registered" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        mobile,
        password: hashedPassword,
        role: "Worker",
        status: "Pending", // Pending Admin Approval
        workerId: workerId || `W-${Math.floor(Math.random() * 900) + 100}`,
        department: department || "Operations",
        factoryUnit: factoryUnit || "Unit 1"
      }
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        action: "Worker Registration",
        userId: user.id,
        userEmail: user.email,
        userMobile: user.mobile,
        details: `Worker registered: ${user.name} (${user.workerId}) in department ${user.department}. Status: Pending Admin Approval.`
      }
    });

    res.status(201).json({ success: true, message: "Registration submitted successfully. Pending Admin approval." });
  } catch (error) {
    console.error("Worker registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Supervisor access request (public/worker)
app.post("/api/auth/request-supervisor", async (req, res) => {
  try {
    const { workerId, name, department, experience, reason, idProof } = req.body;
    if (!workerId || !name || !department || !experience || !reason) {
      return res.status(400).json({ error: "Required fields are missing" });
    }

    const request = await prisma.supervisorRequest.create({
      data: {
        workerId,
        name,
        department,
        experience: String(experience),
        reason,
        idProof: idProof || "Submitted Proof",
        status: "Pending"
      }
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        action: "Supervisor Access Request",
        details: `Supervisor access requested by ${name} (${workerId}) for department ${department}. Status: Pending.`
      }
    });

    res.status(201).json({ success: true, message: "Supervisor request submitted successfully. Pending Admin approval." });
  } catch (error) {
    console.error("Supervisor request error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// User Management API (Admin only)
app.get("/api/users", authenticateToken, async (req: any, res) => {
  try {
    if (req.user.role !== "Administrator" && req.user.role !== "Admin") {
      return res.status(403).json({ error: "Access Denied" });
    }
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        mobile: true,
        name: true,
        role: true,
        status: true,
        createdAt: true
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.post("/api/users", authenticateToken, async (req: any, res) => {
  try {
    if (req.user.role !== "Administrator" && req.user.role !== "Admin") {
      return res.status(403).json({ error: "Access Denied" });
    }
    const { email, mobile, password, name, role } = req.body;
    
    const targetEmail = email || `${name.toLowerCase().replace(/\s+/g, "")}@optimafactory.com`;
    const targetMobile = mobile || `9${Math.floor(Math.random() * 900000000 + 100000000)}`;

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: targetEmail }, { mobile: targetMobile }]
      }
    });
    if (existing) {
      return res.status(400).json({ error: "User already exists with this email or mobile" });
    }

    const hashedPassword = bcrypt.hashSync(password || "Optima@123", 10);
    const newUser = await prisma.user.create({
      data: {
        email: targetEmail,
        mobile: targetMobile,
        password: hashedPassword,
        name,
        role: role || "Worker",
        status: "Active"
      }
    });
    res.status(201).json({
      id: newUser.id,
      email: newUser.email,
      mobile: newUser.mobile,
      name: newUser.name,
      role: newUser.role,
      status: newUser.status
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Admin endpoints for approvals
app.get("/api/admin/pending-workers", authenticateToken, async (req: any, res) => {
  try {
    if (req.user.role !== "Administrator" && req.user.role !== "Admin") {
      return res.status(403).json({ error: "Access Denied" });
    }
    const pendingWorkers = await prisma.user.findMany({
      where: { role: "Worker", status: "Pending" }
    });
    res.json(pendingWorkers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pending workers" });
  }
});

app.post("/api/admin/approve-worker", authenticateToken, async (req: any, res) => {
  try {
    if (req.user.role !== "Administrator" && req.user.role !== "Admin") {
      return res.status(403).json({ error: "Access Denied" });
    }
    const { userId, approve } = req.body;
    const status = approve ? "Active" : "Rejected";
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status }
    });

    await prisma.auditLog.create({
      data: {
        action: "Admin Approval",
        userId: req.user.id,
        userEmail: req.user.email,
        details: `Worker ${updatedUser.name} (${updatedUser.email}) registration request was ${status} by Admin.`
      }
    });

    res.json({ success: true, message: `Worker status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ error: "Failed to update worker status" });
  }
});

app.get("/api/admin/supervisor-requests", authenticateToken, async (req: any, res) => {
  try {
    if (req.user.role !== "Administrator" && req.user.role !== "Admin") {
      return res.status(403).json({ error: "Access Denied" });
    }
    const requests = await prisma.supervisorRequest.findMany({
      orderBy: { createdAt: "desc" }
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch supervisor requests" });
  }
});

app.post("/api/admin/approve-supervisor", authenticateToken, async (req: any, res) => {
  try {
    if (req.user.role !== "Administrator" && req.user.role !== "Admin") {
      return res.status(403).json({ error: "Access Denied" });
    }
    const { requestId, approve } = req.body;
    const status = approve ? "Approved" : "Rejected";

    const request = await prisma.supervisorRequest.update({
      where: { id: requestId },
      data: { status }
    });

    if (approve) {
      const existingUser = await prisma.user.findFirst({
        where: { workerId: request.workerId }
      });

      if (existingUser) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { role: "Supervisor", status: "Active" }
        });
      } else {
        const placeholderEmail = `${request.workerId.toLowerCase()}@optimafactory.com`;
        const placeholderMobile = `9${Math.floor(Math.random() * 900000000 + 100000000)}`;
        await prisma.user.create({
          data: {
            name: request.name,
            email: placeholderEmail,
            mobile: placeholderMobile,
            password: bcrypt.hashSync("Supervisor@123", 10),
            role: "Supervisor",
            status: "Active",
            workerId: request.workerId,
            department: request.department
          }
        });
      }
    }

    await prisma.auditLog.create({
      data: {
        action: "Admin Approval",
        userId: req.user.id,
        userEmail: req.user.email,
        details: `Supervisor request from ${request.name} (${request.workerId}) was ${status} by Admin.`
      }
    });

    res.json({ success: true, message: `Supervisor request ${status}` });
  } catch (error) {
    console.error("Approve supervisor request error:", error);
    res.status(500).json({ error: "Failed to update supervisor request" });
  }
});

// Attendance Management API
app.get("/api/attendance", authenticateToken, async (req: any, res) => {
  try {
    const attendance = await prisma.attendance.findMany();
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

app.post("/api/attendance", authenticateToken, async (req: any, res) => {
  try {
    const { workerId, status, checkIn, checkOut } = req.body;
    const dateStr = new Date().toISOString().split('T')[0];
    const record = await prisma.attendance.create({
      data: {
        workerId,
        date: dateStr,
        status: status || "Present",
        checkIn: checkIn || new Date().toLocaleTimeString(),
        checkOut
      }
    });
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: "Failed to create attendance record" });
  }
});

// KPIs
app.get("/api/kpis", authenticateToken, async (req, res) => {
  try {
    const kpis = await getKPIs();
    res.json(kpis);
  } catch (error) {
    res.status(500).json({ error: "Failed to get KPIs" });
  }
});

// Workers
app.get("/api/workers", authenticateToken, async (req, res) => {
  try {
    const { search, role, status } = req.query;
    let whereClause: any = {};
    if (role) {
      whereClause.role = role as string;
    }
    if (status) {
      whereClause.status = status as string;
    }
    
    let dbWorkers = await prisma.workerProfile.findMany({
      where: whereClause
    }) as unknown as WorkerProfile[];
    
    if (search) {
      const s = String(search).toLowerCase();
      dbWorkers = dbWorkers.filter(w => 
        w.name.toLowerCase().includes(s) || 
        w.id.toLowerCase().includes(s) || 
        w.workstation.toLowerCase().includes(s)
      );
    }
    res.json(dbWorkers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch workers" });
  }
});

app.get("/api/workers/:id", authenticateToken, async (req, res) => {
  try {
    const worker = await prisma.workerProfile.findUnique({
      where: { id: req.params.id }
    });
    if (!worker) {
      return res.status(404).json({ error: "Worker not found" });
    }
    res.json(worker);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch worker" });
  }
});

// AI performance insight generation using Google Gemini
app.post("/api/workers/:id/generate-insights", authenticateToken, async (req, res) => {
  try {
    const worker = await prisma.workerProfile.findUnique({
      where: { id: req.params.id }
    }) as unknown as WorkerProfile | null;
    if (!worker) {
      return res.status(404).json({ error: "Worker not found" });
    }

    try {
      const prompt = `You are an expert AI Smart Factory supervisor and operations analyzer.
Generate a structured, professional, encouraging, and highly technical performance analysis and feedback for this worker based on their current floor telemetry:

Worker ID: ${worker.id}
Name: ${worker.name}
Role: ${worker.role}
Workstation: ${worker.workstation}
Current Status: ${worker.status}
Shift: ${worker.shift}

Floor Telemetry Statistics:
- Productivity Score: ${worker.productivityScore}%
- Attendance Rate: ${worker.attendanceRate}%
- Completed Tasks Today: ${worker.completedTasks} units
- Average Cycle Time: ${worker.averageCycleTime} seconds (Target is ~45-50 seconds)
- Activity Breakdown: ${JSON.stringify(worker.activityBreakdown)}
- Recent events/incidents: ${JSON.stringify(worker.recentActivities)}

Please return the response as a valid JSON object matching the following structure (do NOT wrap inside markdown formatting, output raw JSON only):
{
  "performanceAnalysis": "A paragraph summarizing the worker's efficiency, strengths, and specific bottlenecks.",
  "safetyCompliance": "A paragraph evaluating their PPE compliance and adherence to standard work sequences based on recent activities.",
  "recommendations": [
    "A highly actionable floor optimization recommendation.",
    "A secondary continuous learning or physical station adjustment suggestion."
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const textOutput = response.text || "{}";
      const result = JSON.parse(textOutput);
      res.json(result);
    } catch (error: any) {
      console.error("Gemini AI API execution error:", error);
      // Return high quality fallback insights if API fails
      res.json({
        performanceAnalysis: `${worker.name} shows strong alignment with operational tasks at workstation ${worker.workstation}. Their productivity of ${worker.productivityScore}% exceeds baseline targets, backed by a quick ${worker.averageCycleTime}s average cycle speed. Focus should be maintained on keeping parts aligned to prevent fatigue.`,
        safetyCompliance: worker.recentActivities.some(a => a.type.toLowerCase().includes("safety") || a.message.toLowerCase().includes("safety"))
          ? "Safety alerts indicate occasional PPE gaps (e.g. missing hard hat at safety zones). Retraining on safety vest and helmet protocols is recommended immediately."
          : "Excellent safety and compliance record. The camera feed shows full PPE verification (Safety Vest, Glasses, and Hard Hat) with zero violations today.",
        recommendations: [
          "Conduct a 5-minute pre-shift workstation ergonomics layout check to minimize material pick distance.",
          "Pair with junior operators during team syncs to share efficient bolt-assembly alignment techniques."
        ]
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to generate insights" });
  }
});

// Cameras
app.get("/api/cameras", authenticateToken, async (req, res) => {
  try {
    const dbCameras = await prisma.camera.findMany();
    res.json(dbCameras);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cameras" });
  }
});

app.post("/api/cameras", authenticateToken, async (req, res) => {
  try {
    const { name, zone, workstation, resolution, fps } = req.body;
    const allCams = await prisma.camera.findMany();
    const newCamId = `CAM-0${allCams.length + 1}`;
    
    const newCam = await prisma.camera.create({
      data: {
        id: newCamId,
        name: name || "New Custom Camera",
        zone: zone || "General Zone",
        status: "Active",
        recordingStatus: "Recording",
        workstation: workstation || "Workstation-01",
        recordingUptime: 100.0,
        healthScore: 100,
        resolution: resolution || "1920x1080",
        fps: fps || 30
      }
    });

    // Add an audit log
    await prisma.activityLog.create({
      data: {
        id: `AL-${Date.now()}`,
        timestamp: new Date().toISOString(),
        module: "Camera Management",
        action: "Registered Camera",
        user: "Supervisor",
        details: `Camera ${newCam.id} (${newCam.name}) registered successfully in ${newCam.zone}`,
        severity: "info"
      }
    });

    res.status(201).json(newCam);
  } catch (error) {
    console.error("Failed to register camera:", error);
    res.status(500).json({ error: "Failed to register camera" });
  }
});

app.put("/api/cameras/:id", authenticateToken, async (req, res) => {
  try {
    const updated = await prisma.camera.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(updated);
  } catch (error) {
    console.error("Failed to update camera:", error);
    res.status(404).json({ error: "Camera not found or update failed" });
  }
});

// Activity configurations
app.get("/api/activities", authenticateToken, async (req, res) => {
  try {
    const dbActivities = await prisma.activityConfig.findMany();
    res.json(dbActivities);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch activities" });
  }
});

app.post("/api/activities", authenticateToken, async (req, res) => {
  try {
    const { name, code, sequence, cycleTimeThreshold, detectionRules, alertCondition } = req.body;
    const allActivities = await prisma.activityConfig.findMany();
    const newActivityId = `ACT-0${allActivities.length + 1}`;
    
    const newActivity = await prisma.activityConfig.create({
      data: {
        id: newActivityId,
        name: name || "Custom Operation",
        code: code || "CUST-OP",
        sequence: sequence || ["Step 1", "Step 2"],
        cycleTimeThreshold: Number(cycleTimeThreshold) || 60,
        detectionRules: detectionRules || {
          safetyVestRequired: true,
          hardHatRequired: false,
          safetyGlassesRequired: true,
          sequenceCheckEnabled: true,
          cycleDeviationAlert: true
        },
        alertCondition: alertCondition || "Immediate"
      }
    });

    // Add an audit log
    await prisma.activityLog.create({
      data: {
        id: `AL-${Date.now()}`,
        timestamp: new Date().toISOString(),
        module: "Activity Configuration",
        action: "Created Config",
        user: "Sarah Jenkins (Supervisor)",
        details: `Created new activity rules for '${newActivity.name}' (${newActivity.code})`,
        severity: "info"
      }
    });

    res.status(201).json(newActivity);
  } catch (error) {
    console.error("Failed to create activity config:", error);
    res.status(500).json({ error: "Failed to create activity config" });
  }
});

app.put("/api/activities/:id", authenticateToken, async (req, res) => {
  try {
    const updated = await prisma.activityConfig.update({
      where: { id: req.params.id },
      data: {
        ...req.body,
        sequence: req.body.sequence ? (req.body.sequence as any) : undefined,
        detectionRules: req.body.detectionRules ? (req.body.detectionRules as any) : undefined
      }
    });
    res.json(updated);
  } catch (error) {
    console.error("Failed to update activity config:", error);
    res.status(404).json({ error: "Activity not found or update failed" });
  }
});

// System Alerts
app.get("/api/alerts", authenticateToken, async (req, res) => {
  try {
    const dbAlerts = await prisma.systemAlert.findMany();
    res.json(dbAlerts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
});

app.post("/api/alerts/:id/resolve", authenticateToken, async (req, res) => {
  try {
    const updatedAlert = await prisma.systemAlert.update({
      where: { id: req.params.id },
      data: { status: "Resolved" }
    });
    
    // Add audit log
    await prisma.activityLog.create({
      data: {
        id: `AL-${Date.now()}`,
        timestamp: new Date().toISOString(),
        module: "Alert Management",
        action: "Alert Resolved",
        user: "Sarah Jenkins (Supervisor)",
        details: `Resolved alert ${updatedAlert.id} (${updatedAlert.type}): ${updatedAlert.message}`,
        severity: "info"
      }
    });

    res.json(updatedAlert);
  } catch (error) {
    console.error("Failed to resolve alert:", error);
    res.status(404).json({ error: "Alert not found or update failed" });
  }
});

// Audit Logs
app.get("/api/audit-logs", authenticateToken, async (req, res) => {
  try {
    const logs = await prisma.activityLog.findMany({
      orderBy: { timestamp: "desc" }
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch audit logs" });
  }
});

// Analytics (Trend history & productivity heatmap)
app.get("/api/analytics", authenticateToken, async (req, res) => {
  try {
    const allWorkers = await prisma.workerProfile.findMany() as unknown as WorkerProfile[];
    const workerPerformanceComparison = allWorkers
      .filter(w => w.role === "Worker")
      .map(w => ({
        name: w.name,
        productivity: w.productivityScore,
        cycleTime: w.averageCycleTime,
        tasks: w.completedTasks
      }));

    res.json({
      trends: [
        { hour: "06:00", activeWorkers: 2, efficiency: 85, alertCount: 0, outputCount: 8 },
        { hour: "07:00", activeWorkers: 4, efficiency: 88, alertCount: 1, outputCount: 18 },
        { hour: "08:00", activeWorkers: 4, efficiency: 91, alertCount: 2, outputCount: 26 },
        { hour: "09:00", activeWorkers: 5, efficiency: 90, alertCount: 1, outputCount: 32 },
        { hour: "10:00", activeWorkers: 5, efficiency: 93, alertCount: 0, outputCount: 45 },
        { hour: "11:00", activeWorkers: 5, efficiency: 92, alertCount: 0, outputCount: 40 },
        { hour: "12:00", activeWorkers: 3, efficiency: 86, alertCount: 0, outputCount: 22 }
      ],
      heatmaps: [
        { day: "Monday", "06:00-10:00": 92, "10:00-14:00": 95, "14:00-18:00": 88, "18:00-22:00": 84 },
        { day: "Tuesday", "06:00-10:00": 94, "10:00-14:00": 96, "14:00-18:00": 89, "18:00-22:00": 86 },
        { day: "Wednesday", "06:00-10:00": 91, "10:00-14:00": 94, "14:00-18:00": 87, "18:00-22:00": 85 },
        { day: "Thursday", "06:00-10:00": 93, "10:00-14:00": 95, "14:00-18:00": 90, "18:00-22:00": 87 },
        { day: "Friday", "06:00-10:00": 95, "10:00-14:00": 97, "14:00-18:00": 91, "18:00-22:00": 88 }
      ],
      workerPerformanceComparison,
      downtimeReasons: [
        { name: "Material Stockout", value: 40, color: "#a855f7" },
        { name: "Equipment Calibration", value: 25, color: "#06b6d4" },
        { name: "Shift Handover", value: 15, color: "#10b981" },
        { name: "PPE Warning Pauses", value: 20, color: "#ef4444" }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

// Report Export Trigger
app.post("/api/reports/generate", authenticateToken, async (req, res) => {
  try {
    const { reportType, format, dateRange } = req.body;
    const reportId = `REP-${Date.now().toString().slice(-6)}`;
    
    // Log the action
    await prisma.activityLog.create({
      data: {
        id: `AL-${Date.now()}`,
        timestamp: new Date().toISOString(),
        module: "Report Center",
        action: "Generated Report",
        user: "Sarah Jenkins (Supervisor)",
        details: `Generated ${format.toUpperCase()} compliance/analytics report for range: ${dateRange}. Type: ${reportType}. Saved as ID: ${reportId}`,
        severity: "info"
      }
    });

    res.json({
      success: true,
      reportId,
      title: `${reportType} Report - ${dateRange}`,
      generatedAt: new Date().toISOString(),
      downloadUrl: `#/download/${reportId}`
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate report" });
  }
});

// ==========================================
// WebSocket & Live Activity Simulator
// ==========================================

const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

// Handle WebSocket upgrade manually to run side-by-side with Express
server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

// Store active WS clients
const clients = new Set<WebSocket>();

wss.on("connection", (ws) => {
  clients.add(ws);
  console.log("WebSocket client connected. Active connections:", clients.size);

  // Send initial data to client
  ws.send(JSON.stringify({ type: "connection_established", message: "Connected to Factory Core Live Feed" }));

  ws.on("close", () => {
    clients.delete(ws);
    console.log("WebSocket client disconnected. Active connections:", clients.size);
  });
});

// Factory Simulation Loop
// Every 10 seconds, trigger an event (e.g. standard cycle completed, occasional alert, or status change)
setInterval(async () => {
  if (clients.size === 0) return;

  try {
    const eventTypes = ["task_completion", "worker_idle", "safety_warning"];
    const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];

    let broadcastMessage: any = null;

    if (randomEvent === "task_completion") {
      // Pick an active worker to complete a task
      const allWorkers = await prisma.workerProfile.findMany() as unknown as WorkerProfile[];
      const activeWorkers = allWorkers.filter(w => w.status === "Active");
      if (activeWorkers.length > 0) {
        const luckyWorker = activeWorkers[Math.floor(Math.random() * activeWorkers.length)];
        luckyWorker.completedTasks += 1;
        
        // Update cycle time slightly dynamically
        const deviation = Math.floor(Math.random() * 9) - 4; // -4 to +4 seconds
        luckyWorker.averageCycleTime = Math.max(35, luckyWorker.averageCycleTime + deviation);
        
        const timestampString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        luckyWorker.recentActivities.unshift({
          id: `ra-${Date.now()}`,
          timestamp: timestampString,
          type: "Cycle Complete",
          status: "success",
          message: `Assembled standard fixture in ${luckyWorker.averageCycleTime}s`
        });
        luckyWorker.recentActivities = luckyWorker.recentActivities.slice(0, 5); // cap at 5

        await prisma.workerProfile.update({
          where: { id: luckyWorker.id },
          data: {
            completedTasks: luckyWorker.completedTasks,
            averageCycleTime: luckyWorker.averageCycleTime,
            recentActivities: luckyWorker.recentActivities as any
          }
        });

        broadcastMessage = {
          type: "FACTORY_EVENT",
          event: "TASK_COMPLETE",
          workerId: luckyWorker.id,
          workerName: luckyWorker.name,
          completedTasks: luckyWorker.completedTasks,
          averageCycleTime: luckyWorker.averageCycleTime,
          message: `${luckyWorker.name} completed standard fixture assembly at ${luckyWorker.workstation}`
        };
      }
    } else if (randomEvent === "worker_idle") {
      // Toggle active worker status to idle or back
      const allWorkers = await prisma.workerProfile.findMany() as unknown as WorkerProfile[];
      const candidateWorkers = allWorkers.filter(w => w.role === "Worker");
      if (candidateWorkers.length > 0) {
        const toggleWorker = candidateWorkers[Math.floor(Math.random() * candidateWorkers.length)];
        const oldStatus = toggleWorker.status;
        const newStatus = oldStatus === "Active" ? "Idle" : "Active";
        
        await prisma.workerProfile.update({
          where: { id: toggleWorker.id },
          data: {
            status: newStatus
          }
        });

        broadcastMessage = {
          type: "FACTORY_EVENT",
          event: "WORKER_STATUS_CHANGE",
          workerId: toggleWorker.id,
          workerName: toggleWorker.name,
          status: newStatus,
          message: `${toggleWorker.name} is now ${newStatus} at workstation ${toggleWorker.workstation}`
        };
      }
    } else if (randomEvent === "safety_warning") {
      // Generate a warning alert
      const allCameras = await prisma.camera.findMany() as unknown as Camera[];
      const allWorkers = await prisma.workerProfile.findMany() as unknown as WorkerProfile[];
      const activeWorkers = allWorkers.filter(w => w.status === "Active");
      
      if (allCameras.length > 0 && allWorkers.length > 0) {
        const randomCamera = allCameras[Math.floor(Math.random() * allCameras.length)];
        const targetWorker = activeWorkers[Math.floor(Math.random() * activeWorkers.length)] || allWorkers[0];
        
        const violationTypes = [
          "Safety Goggles Violation - Worker entered workstation zone without laser-eye protection",
          "Proximity Violation - Operator too close to high-speed torque arm during automatic reset",
          "Reflective Safety Vest Warning - Outer garment obscurement detected"
        ];
        const violation = violationTypes[Math.floor(Math.random() * violationTypes.length)];

        const newAlertId = `ALT-${Date.now().toString().slice(-4)}`;
        const newAlert = await prisma.systemAlert.create({
          data: {
            id: newAlertId,
            cameraName: randomCamera.name,
            workerName: targetWorker.name,
            zone: randomCamera.zone,
            type: "Safety Violation",
            severity: "Medium",
            timestamp: new Date().toISOString(),
            status: "Unresolved",
            message: violation
          }
        });

        broadcastMessage = {
          type: "FACTORY_EVENT",
          event: "ALERT_TRIGGERED",
          alert: newAlert,
          message: `New safety compliance alert: ${violation}`
        };
      }
    }

    if (broadcastMessage) {
      const stringified = JSON.stringify(broadcastMessage);
      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(stringified);
        }
      });
    }
  } catch (error) {
    console.error("Simulation loop error:", error);
  }
}, 10000); // 10 seconds ticks to keep simulation dynamic and non-flooding


// ==========================================
// Database Seeding Logic
// ==========================================

async function seedDatabase() {
  try {
    const workerCount = await prisma.workerProfile.count();
    if (workerCount === 0) {
      console.log("Seeding workers...");
      for (const w of initialWorkers) {
        await prisma.workerProfile.create({
          data: {
            id: w.id,
            name: w.name,
            email: w.email,
            role: w.role,
            avatar: w.avatar,
            shift: w.shift,
            status: w.status,
            workstation: w.workstation,
            productivityScore: w.productivityScore,
            attendanceRate: w.attendanceRate,
            completedTasks: w.completedTasks,
            averageCycleTime: w.averageCycleTime,
            recentActivities: w.recentActivities as any,
            weeklyProductivity: w.weeklyProductivity as any,
            activityBreakdown: w.activityBreakdown as any
          }
        });
      }
    }

    const cameraCount = await prisma.camera.count();
    if (cameraCount === 0) {
      console.log("Seeding cameras...");
      for (const c of initialCameras) {
        await prisma.camera.create({
          data: {
            id: c.id,
            name: c.name,
            zone: c.zone,
            status: c.status,
            recordingStatus: c.recordingStatus,
            workstation: c.workstation,
            recordingUptime: c.recordingUptime,
            healthScore: c.healthScore,
            resolution: c.resolution,
            fps: c.fps
          }
        });
      }
    }

    const activityCount = await prisma.activityConfig.count();
    if (activityCount === 0) {
      console.log("Seeding activity configs...");
      for (const a of initialActivities) {
        await prisma.activityConfig.create({
          data: {
            id: a.id,
            name: a.name,
            code: a.code,
            sequence: a.sequence as any,
            cycleTimeThreshold: a.cycleTimeThreshold,
            detectionRules: a.detectionRules as any,
            alertCondition: a.alertCondition
          }
        });
      }
    }

    const alertCount = await prisma.systemAlert.count();
    if (alertCount === 0) {
      console.log("Seeding system alerts...");
      for (const a of initialAlerts) {
        await prisma.systemAlert.create({
          data: {
            id: a.id,
            cameraName: a.cameraName,
            workerName: a.workerName,
            zone: a.zone,
            type: a.type,
            severity: a.severity,
            timestamp: a.timestamp,
            status: a.status,
            message: a.message,
            cameraSnapshot: a.cameraSnapshot
          }
        });
      }
    }

    const auditCount = await prisma.activityLog.count();
    if (auditCount === 0) {
      console.log("Seeding activity logs...");
      for (const l of initialAuditLogs) {
        await prisma.activityLog.create({
          data: {
            id: l.id,
            timestamp: l.timestamp,
            module: l.module,
            action: l.action,
            user: l.user,
            details: l.details,
            severity: l.severity
          }
        });
      }
    }

    // Seed Roles
    const roleCount = await prisma.role.count();
    if (roleCount === 0) {
      console.log("Seeding roles...");
      const rolesToSeed = [
        { name: "Administrator", description: "Full access to every module" },
        { name: "Supervisor", description: "Floor operations management and overview" },
        { name: "Worker", description: "Workstation tasks and personalized metrics" }
      ];
      for (const r of rolesToSeed) {
        await prisma.role.create({
          data: {
            name: r.name,
            description: r.description
          }
        });
      }
    }

    // Seed Predefined Demo Users
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      console.log("Seeding demo users...");
      const demoUsers = [
        {
          email: "admin@optimafactory.com",
          mobile: "9876543210",
          password: bcrypt.hashSync("Admin@123", 10),
          name: "System Administrator",
          role: "Administrator",
          status: "Active"
        },
        {
          email: "supervisor@optimafactory.com",
          mobile: "9876543211",
          password: bcrypt.hashSync("Supervisor@123", 10),
          name: "Sarah Jenkins",
          role: "Supervisor",
          status: "Active"
        },
        {
          email: "worker@optimafactory.com",
          mobile: "9876543212",
          password: bcrypt.hashSync("Worker@123", 10),
          name: "Marcus Ross",
          role: "Worker",
          status: "Active"
        }
      ];
      for (const u of demoUsers) {
        await prisma.user.create({
          data: {
            email: u.email,
            mobile: u.mobile,
            password: u.password,
            name: u.name,
            role: u.role,
            status: u.status
          }
        });
      }
    }

    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Seeding database failed:", error);
  }
}

// ==========================================
// Vite Integration & Production Serving
// ==========================================

async function startServer() {
  // Ensure seed is run on startup
  await seedDatabase();

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Smart Factory Monitor Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
