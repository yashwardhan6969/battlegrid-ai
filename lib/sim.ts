// Simple pseudo-random generator for deterministic mock data
let seed = 1337;
function rand() {
  seed ^= seed << 13; seed ^= seed >> 17; seed ^= seed << 5;
  // Convert to [0,1)
  return ((seed >>> 0) / 0xFFFFFFFF);
}

export function simulateThreats(n: number) {
  const out = [];
  const now = Date.now();
  for (let i=0;i<n;i++) {
    const pri = (rand() < 0.15 ? 1 : (rand() < 0.35 ? 2 : 3)) as 1|2|3;
    const type = (['vehicle','personnel','drone','unknown'] as const)[Math.floor(rand()*4)];
    // somewhere broadly over India
    const lat = 20 + rand()*10;   // 20-30
    const lon = 72 + rand()*10;   // 72-82
    out.push({
      id: `${now}-${i}-${Math.floor(rand()*1e6)}`,
      type,
      lat,
      lon,
      heading: Math.floor(rand()*360),
      speedKts: Math.round(rand()*80),
      confidence: Math.round((0.4 + rand()*0.6)*100)/100,
      priority: pri,
      timestamp: now - Math.floor(rand()*60000),
      note: rand() < 0.2 ? 'Pattern deviation detected' : undefined
    });
  }
  return out;
}
