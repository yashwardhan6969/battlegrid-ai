'use client';
import { useEffect, useState } from 'react';
import type { Threat } from '@/lib/types';

type Alert = { id: string; text: string; priority: 1|2|3; ts: number };

export default function AlertToaster({ threats }:{ threats: Threat[] }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const highs = threats.filter(t => t.priority === 1);
    if (highs.length) {
      const newOnes = highs
        .slice(0,2)
        .map(h => ({ id: h.id, text: `High priority ${h.type} detected @ ${h.lat.toFixed(2)}, ${h.lon.toFixed(2)}`, priority: 1 as const, ts: Date.now() }));
      setAlerts(prev => [...newOnes, ...prev].slice(0,5));
      try { new Audio('/beep.mp3').play().catch(()=>{}); } catch {}
    }
  }, [threats]);

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-[100]">
      {alerts.map(a => (
        <div key={a.id} className="card px-4 py-3 border-l-4"
          style={{ borderLeftColor: a.priority===1?'#EF4444':a.priority===2?'#F59E0B':'#2EE59D' }}>
          <div className="text-sm">{a.text}</div>
          <div className="text-[10px] text-white/50">{new Date(a.ts).toLocaleTimeString()}</div>
        </div>
      ))}
    </div>
  );
}
