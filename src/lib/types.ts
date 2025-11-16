export interface PingData {
  time: string;
  latency: number | null;
}

export interface Node {
  id: string;
  displayName: string; // User-friendly name
  name: string; // IP or domain
  status: 'online' | 'offline' | 'pending';
  latency: number | null;
  pingHistory: PingData[];
  uptime: number; // Uptime percentage
  totalUptimeSeconds: number; // Total time in seconds the node has been online
  lastStatusChange: number; // Timestamp of the last status change
}

export type ViewMode = 'grid' | 'list';

export interface ActivityLog {
  id: string;
  nodeId: string;
  nodeDisplayName: string;
  nodeName: string;
  status: 'online' | 'offline';
  timestamp: number;
  duration: number; // in seconds, how long the previous state lasted
}
