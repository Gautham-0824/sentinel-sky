export type ThreatLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type AttackType = 'DDoS' | 'Malware' | 'Phishing' | 'Ransomware' | 'Data Breach';
export type AttackStatus = 'Active' | 'Detected' | 'Mitigated';

export interface CyberAttack {
  id: string;
  source: string;
  sourceCoords: { lat: number; lon: number };
  target: string;
  targetCoords: { lat: number; lon: number };
  attackType: AttackType;
  threatLevel: ThreatLevel;
  timestamp: string;
  status: AttackStatus;
}

const CYBER_HUBS = [
  { name: 'Washington D.C.', lat: 38.9072, lon: -77.0369, weight: 15 },
  { name: 'New York', lat: 40.7128, lon: -74.006, weight: 12 },
  { name: 'San Francisco', lat: 37.7749, lon: -122.4194, weight: 10 },
  { name: 'London', lat: 51.5074, lon: -0.1278, weight: 12 },
  { name: 'Berlin', lat: 52.52, lon: 13.405, weight: 8 },
  { name: 'Paris', lat: 48.8566, lon: 2.3522, weight: 8 },
  { name: 'Moscow', lat: 55.7558, lon: 37.6173, weight: 14 },
  { name: 'Beijing', lat: 39.9042, lon: 116.4074, weight: 15 },
  { name: 'Shanghai', lat: 31.2304, lon: 121.4737, weight: 10 },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503, weight: 10 },
  { name: 'Seoul', lat: 37.5665, lon: 126.978, weight: 8 },
  { name: 'Mumbai', lat: 19.076, lon: 72.8777, weight: 10 },
  { name: 'Tel Aviv', lat: 32.0853, lon: 34.7818, weight: 8 },
  { name: 'São Paulo', lat: -23.5505, lon: -46.6333, weight: 6 },
  { name: 'Singapore', lat: 1.3521, lon: 103.8198, weight: 8 },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093, weight: 5 },
  { name: 'Dubai', lat: 25.2048, lon: 55.2708, weight: 5 },
  { name: 'Taipei', lat: 25.033, lon: 121.5654, weight: 7 },
  { name: 'Stockholm', lat: 59.3293, lon: 18.0686, weight: 4 },
  { name: 'Amsterdam', lat: 52.3676, lon: 4.9041, weight: 6 },
];

const ATTACK_TYPES: AttackType[] = ['DDoS', 'Malware', 'Phishing', 'Ransomware', 'Data Breach'];
const THREAT_LEVELS: ThreatLevel[] = ['Low', 'Medium', 'High', 'Critical'];
const THREAT_WEIGHTS = [30, 35, 25, 10];

let counter = 10000;

function weightedRandom<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

function pickCity() {
  return weightedRandom(CYBER_HUBS, CYBER_HUBS.map(c => c.weight));
}

export function generateAttack(): CyberAttack {
  let source = pickCity();
  let target = pickCity();
  while (target.name === source.name) target = pickCity();

  counter++;
  const now = new Date();

  return {
    id: `ATK-${counter}`,
    source: source.name,
    sourceCoords: { lat: source.lat, lon: source.lon },
    target: target.name,
    targetCoords: { lat: target.lat, lon: target.lon },
    attackType: ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)],
    threatLevel: weightedRandom(THREAT_LEVELS, THREAT_WEIGHTS),
    timestamp: now.toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
    status: weightedRandom<AttackStatus>(['Active', 'Detected', 'Mitigated'], [50, 30, 20]),
  };
}

export function getThreatColorHex(level: ThreatLevel): number {
  switch (level) {
    case 'Low': return 0xffaa00;
    case 'Medium': return 0xff4444;
    case 'High': return 0xff0044;
    case 'Critical': return 0xff0022;
  }
}

export function getThreatColor(level: ThreatLevel): string {
  switch (level) {
    case 'Low': return '#ffaa00';
    case 'Medium': return '#ff4444';
    case 'High': return '#ff0044';
    case 'Critical': return '#ff0022';
  }
}

export const GLOBE_RADIUS = 2;

export function latLonToVector3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return {
    x: -radius * Math.sin(phi) * Math.cos(theta),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta),
  };
}
