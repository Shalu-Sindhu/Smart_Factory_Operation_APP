export type Role = 'Admin' | 'Supervisor' | 'Worker';

export interface WorkerProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  shift: string;
  status: 'Active' | 'Idle' | 'Offline';
  workstation: string;
  productivityScore: number;
  attendanceRate: number;
  completedTasks: number;
  averageCycleTime: number; // in seconds
  recentActivities: {
    id: string;
    timestamp: string;
    type: string;
    status: 'success' | 'warning' | 'info';
    message: string;
  }[];
  weeklyProductivity: { day: string; score: number }[];
  activityBreakdown: { name: string; value: number; color: string }[];
}

export interface Camera {
  id: string;
  name: string;
  zone: string;
  status: 'Active' | 'Offline' | 'Alerting';
  recordingStatus: 'Recording' | 'Paused' | 'Stopped';
  workstation: string;
  recordingUptime: number; // percentage
  healthScore: number; // percentage
  resolution: string;
  fps: number;
}

export interface ActivityConfig {
  id: string;
  name: string;
  code: string;
  sequence: string[];
  cycleTimeThreshold: number; // in seconds
  detectionRules: {
    safetyVestRequired: boolean;
    hardHatRequired: boolean;
    safetyGlassesRequired: boolean;
    sequenceCheckEnabled: boolean;
    cycleDeviationAlert: boolean;
  };
  alertCondition: 'Immediate' | 'Delayed' | 'Manual';
}

export interface SystemAlert {
  id: string;
  cameraName: string;
  workerName?: string;
  zone: string;
  type: 'Safety Violation' | 'Process Deviation' | 'Downtime Warning' | 'Inactivity';
  severity: 'High' | 'Medium' | 'Low';
  timestamp: string;
  status: 'Unresolved' | 'Resolved';
  message: string;
  cameraSnapshot?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  module: string;
  action: string;
  user: string;
  details: string;
  severity: 'info' | 'warning' | 'error';
}

export interface FactoryKPIs {
  activeWorkersCount: number;
  activeWorkstationsCount: number;
  alertCount: number;
  completedTasksCount: number;
  avgCycleTime: number; // in seconds
  cameraOnlinePercentage: number;
  overallProductivity: number; // percentage
  downtimeMinutes: number;
}
