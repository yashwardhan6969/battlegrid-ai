export type Threat = {
  id: string;
  type: 'vehicle' | 'personnel' | 'drone' | 'unknown';
  lat: number;
  lon: number;
  heading: number;
  speedKts: number;
  confidence: number; // 0-1
  priority: 1 | 2 | 3; // 1 high, 2 medium, 3 low
  timestamp: number;
  note?: string;
};
export type Message = {
  id: string;
  cipherText: string;
  iv: string;
  ts: number;
  from: string;
  to: string;
  fileName?: string;
  fileDataUrl?: string;
  status: 'queued'|'sent'|'delivered';
};
export type Mission = {
  id: string;
  title: string;
  objective: string;
  start: string; // ISO
  end: string;   // ISO
  personnel: string[];
  equipment: string[];
  status: 'planned'|'active'|'complete';
};
