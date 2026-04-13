// Mock data for SalamaNet AI dashboard

export type ThreatLevel = "critical" | "high" | "medium" | "low" | "info";

export interface ThreatEvent {
  id: string;
  timestamp: string;
  type: string;
  source: string;
  target: string;
  severity: ThreatLevel;
  description: string;
  status: "active" | "investigating" | "resolved" | "dismissed";
}

export interface AnomalyEvent {
  id: string;
  timestamp: string;
  metric: string;
  expectedValue: number;
  actualValue: number;
  deviation: number;
  source: string;
  severity: ThreatLevel;
}

export interface NetworkStats {
  totalPackets: number;
  blockedPackets: number;
  activeConnections: number;
  bandwidth: string;
  threatsDetected: number;
  threatsBlocked: number;
  uptime: string;
  lastScan: string;
}

export const networkStats: NetworkStats = {
  totalPackets: 2847291,
  blockedPackets: 1423,
  activeConnections: 847,
  bandwidth: "2.4 Gbps",
  threatsDetected: 47,
  threatsBlocked: 44,
  uptime: "99.97%",
  lastScan: "2 min ago",
};

export const recentThreats: ThreatEvent[] = [
  {
    id: "t-001",
    timestamp: "2026-04-13T04:32:00Z",
    type: "Brute Force",
    source: "41.215.130.12",
    target: "SSH Gateway",
    severity: "critical",
    description: "Multiple failed SSH login attempts from external IP targeting admin credentials",
    status: "active",
  },
  {
    id: "t-002",
    timestamp: "2026-04-13T04:28:00Z",
    type: "Phishing",
    source: "mail-relay.suspicious.net",
    target: "Faculty Email",
    severity: "high",
    description: "Phishing email campaign detected targeting staff with credential harvesting links",
    status: "investigating",
  },
  {
    id: "t-003",
    timestamp: "2026-04-13T04:15:00Z",
    type: "Malware",
    source: "192.168.12.45",
    target: "Lab PC-23",
    severity: "high",
    description: "Suspicious executable detected on student lab machine communicating with C2 server",
    status: "investigating",
  },
  {
    id: "t-004",
    timestamp: "2026-04-13T03:58:00Z",
    type: "DDoS",
    source: "Multiple",
    target: "Web Portal",
    severity: "medium",
    description: "Unusual spike in traffic to student portal suggesting distributed attack",
    status: "resolved",
  },
  {
    id: "t-005",
    timestamp: "2026-04-13T03:40:00Z",
    type: "Data Exfiltration",
    source: "192.168.5.102",
    target: "Database Server",
    severity: "critical",
    description: "Large data transfer to external IP detected from database server",
    status: "active",
  },
  {
    id: "t-006",
    timestamp: "2026-04-13T03:20:00Z",
    type: "Port Scan",
    source: "103.45.67.89",
    target: "Network Edge",
    severity: "low",
    description: "Sequential port scanning detected from external IP address",
    status: "dismissed",
  },
];

export const anomalyData: AnomalyEvent[] = [
  {
    id: "a-001",
    timestamp: "2026-04-13T04:30:00Z",
    metric: "Login Attempts",
    expectedValue: 12,
    actualValue: 247,
    deviation: 19.6,
    source: "Auth Server",
    severity: "critical",
  },
  {
    id: "a-002",
    timestamp: "2026-04-13T04:25:00Z",
    metric: "Outbound Traffic",
    expectedValue: 450,
    actualValue: 2100,
    deviation: 3.67,
    source: "Gateway Router",
    severity: "high",
  },
  {
    id: "a-003",
    timestamp: "2026-04-13T04:18:00Z",
    metric: "CPU Usage",
    expectedValue: 35,
    actualValue: 94,
    deviation: 1.69,
    source: "Web Server 02",
    severity: "medium",
  },
  {
    id: "a-004",
    timestamp: "2026-04-13T04:10:00Z",
    metric: "DNS Queries",
    expectedValue: 800,
    actualValue: 3200,
    deviation: 3.0,
    source: "DNS Resolver",
    severity: "high",
  },
];

export const trafficTimeline = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, "0")}:00`,
  normal: Math.floor(Math.random() * 500 + 200),
  suspicious: Math.floor(Math.random() * (i > 2 && i < 6 ? 80 : 20)),
  blocked: Math.floor(Math.random() * (i > 2 && i < 6 ? 40 : 8)),
}));

export const threatsByCategory = [
  { name: "Phishing", value: 34, fill: "hsl(var(--destructive))" },
  { name: "Malware", value: 22, fill: "hsl(var(--warning))" },
  { name: "Brute Force", value: 18, fill: "hsl(var(--accent))" },
  { name: "DDoS", value: 12, fill: "hsl(var(--primary))" },
  { name: "Data Leak", value: 8, fill: "hsl(var(--muted-foreground))" },
  { name: "Other", value: 6, fill: "hsl(var(--secondary-foreground))" },
];

export const severityDistribution = [
  { name: "Critical", count: 5, color: "hsl(var(--destructive))" },
  { name: "High", count: 12, color: "hsl(var(--warning))" },
  { name: "Medium", count: 18, color: "hsl(var(--accent))" },
  { name: "Low", count: 8, color: "hsl(var(--primary))" },
  { name: "Info", count: 4, color: "hsl(var(--muted-foreground))" },
];

export const organizations = [
  { id: "org-1", name: "University of Nairobi", type: "University", threats: 12, status: "protected" },
  { id: "org-2", name: "Kenya Revenue Authority", type: "Government", threats: 8, status: "protected" },
  { id: "org-3", name: "Kenyatta University", type: "University", threats: 15, status: "alert" },
  { id: "org-4", name: "Ministry of Education", type: "Government", threats: 3, status: "protected" },
  { id: "org-5", name: "TechSavanna Ltd", type: "SME", threats: 6, status: "protected" },
];
