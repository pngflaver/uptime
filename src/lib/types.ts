export interface PingData {
  time: string;
  latency: number | null;
}

export interface Node {
  id: string;
  name: string; // IP or domain
  status: 'online' | 'offline' | 'pending';
  latency: number | null;
  pingHistory: PingData[];
}
