'use client';
import { useState, ReactNode } from 'react';

export default function Tabs({ tabs }:{ tabs: {key:string, label:string, content:ReactNode}[] }) {
  const [active, setActive] = useState(tabs[0]?.key ?? '');
  return (
    <div>
      <div className="flex gap-2 mb-4">
        {tabs.map(t => (
          <button key={t.key}
            onClick={()=>setActive(t.key)}
            className={`btn ${active===t.key ? 'ring-2 ring-accent/60' : ''}`}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="card p-4">
        {tabs.find(t=>t.key===active)?.content}
      </div>
    </div>
  );
}
