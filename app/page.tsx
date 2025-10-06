'use client';
import { useEffect, useState } from 'react';
import Tabs from '@/components/Tabs';
import MapView from '@/components/MapView';
import ThreatList from '@/components/ThreatList';
import AlertToaster from '@/components/AlertToaster';
import CommsHub from '@/components/CommsHub';
import MissionPlanner from '@/components/MissionPlanner';
import IntelAnalytics from '@/components/IntelAnalytics';
import type { Threat } from '@/lib/types';

export default function Home() {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [serverTime, setServerTime] = useState<number>(Date.now());

  async function fetchData() {
    try {
      const res = await fetch('/api/telemetry', { cache:'no-store' });
      const json = await res.json();
      setThreats(json.threats);
      setServerTime(json.serverTime);
    } catch {}
  }

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 4000);
    return () => clearInterval(id);
  }, []);

  const threatCounts = {
    high: threats.filter(t=>t.priority===1).length,
    med: threats.filter(t=>t.priority===2).length,
    low: threats.filter(t=>t.priority===3).length
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="text-sm text-white/60">Server Time</div>
          <div className="text-xl">{new Date(serverTime).toLocaleString()}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-white/60">Threats</div>
          <div className="text-xl">H:{threatCounts.high} · M:{threatCounts.med} · L:{threatCounts.low}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-white/60">Alerts (auto)</div>
          <div className="text-xl">Priority-1 events trigger toasts</div>
        </div>
      </div>

      <Tabs tabs={[
        { key:'fuse', label:'Sensor Fusion', content: (
          <div className="space-y-4">
            <MapView threats={threats} />
            <ThreatList threats={threats} />
          </div>
        )},
        { key:'ai', label:'Threat Engine', content: (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card p-3">
              <div className="font-semibold mb-2">Object/Activity Detection (simulated)</div>
              <p className="text-sm text-white/70">This demo assigns confidence scores and priorities using rule-based heuristics. Integrate your CV model by replacing <code>app/api/telemetry</code> with detector output.</p>
              <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
                <li>High priority when unknown or drone near sensitive corridor.</li>
                <li>Pattern deviation adds note &quot;Pattern deviation detected&quot;.</li>
                <li>Confidence spans 40–100%.</li>
              </ul>
            </div>
            <div className="card p-3">
              <div className="font-semibold mb-2">Predictive Analytics (demo)</div>
              <p className="text-sm text-white/70">A simple linear model forecasts logistics/trends. See the <em>Intelligence</em> tab for charts. Replace with your ML backend as needed.</p>
            </div>
          </div>
        )},
        { key:'comms', label:'Comms Hub', content: <CommsHub /> },
        { key:'missions', label:'Missions & Resources', content: <MissionPlanner /> },
        { key:'intel', label:'Intelligence', content: <IntelAnalytics /> },
      ]} />

      <AlertToaster threats={threats} />
    </div>
  );
}
