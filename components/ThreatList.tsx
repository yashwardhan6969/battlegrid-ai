'use client';
import type { Threat } from '@/lib/types';

export default function ThreatList({ threats }:{ threats: Threat[] }) {
  const sorted = [...threats].sort((a,b)=>a.priority-b.priority || b.confidence-a.confidence);
  return (
    <div className="overflow-x-auto">
      <table className="table-auto">
        <thead>
          <tr>
            <th>ID</th><th>Type</th><th>Priority</th><th>Confidence</th><th>Speed</th><th>Heading</th><th>When</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(t => (
            <tr key={t.id} className="border-t border-white/5">
              <td>#{t.id.slice(-6)}</td>
              <td className="capitalize">{t.type}</td>
              <td>
                <span className="badge" style={{background:t.priority===1?'rgba(239,68,68,.15)':t.priority===2?'rgba(245,158,11,.15)':'rgba(46,229,157,.15)', borderColor:t.priority===1?'rgba(239,68,68,.4)':t.priority===2?'rgba(245,158,11,.4)':'rgba(46,229,157,.4)'}}>
                  {t.priority===1?'High':t.priority===2?'Medium':'Low'}
                </span>
              </td>
              <td>{(t.confidence*100).toFixed(0)}%</td>
              <td>{t.speedKts} kts</td>
              <td>{t.heading}°</td>
              <td>{new Date(t.timestamp).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
