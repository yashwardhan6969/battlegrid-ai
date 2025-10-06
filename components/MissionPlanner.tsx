'use client';
import { useEffect, useMemo, useState } from 'react';
import type { Mission } from '@/lib/types';
import { load, save } from '@/lib/storage';
import dayjs from 'dayjs';

const defaultPeople = ['Agarwal','Bhatt','Chowdhury','Desai','Iyer','Khan','Mishra','Singh','Tiwari','Yadav'];
const defaultEquip = ['UAV-Scout','APC-01','Medic Kit','Fuel Truck','Ammo Crate','Comms Van','Radar-Portable'];

export default function MissionPlanner() {
  const [missions, setMissions] = useState<Mission[]>(() => load('missions', []));
  const [form, setForm] = useState({ title:'', objective:'', start:'', end:'', personnel:[] as string[], equipment:[] as string[] });

  useEffect(()=>save('missions', missions), [missions]);

  function addMission() {
    if (!form.title || !form.start || !form.end) return alert('Title, start, end required');
    const m: Mission = { id: crypto.randomUUID(), title: form.title, objective: form.objective, start: form.start, end: form.end, personnel: form.personnel, equipment: form.equipment, status: 'planned' };
    setMissions(prev => [m, ...prev]);
    setForm({ title:'', objective:'', start:'', end:'', personnel:[], equipment:[] });
  }

  function toggle<T extends string>(arr:T[], value:T): T[] {
    return arr.includes(value) ? arr.filter(v=>v!==value) : [...arr, value];
  }

  const days = useMemo(() => {
    const allDates: string[] = [];
    const min = missions.length ? missions.map(m=>m.start).sort()[0] : dayjs().format('YYYY-MM-DD');
    const max = missions.length ? missions.map(m=>m.end).sort().at(-1)! : dayjs().add(6,'day').format('YYYY-MM-DD');
    let d = dayjs(min).startOf('day');
    const end = dayjs(max).endOf('day');
    while (d.isBefore(end)) { allDates.push(d.format('YYYY-MM-DD')); d = d.add(1,'day'); }
    return allDates;
  }, [missions]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-3">
        <input className="input" placeholder="Mission title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
        <input className="input" placeholder="Objective" value={form.objective} onChange={e=>setForm({...form, objective:e.target.value})} />
        <input className="input" type="datetime-local" value={form.start} onChange={e=>setForm({...form, start:e.target.value})} />
        <input className="input" type="datetime-local" value={form.end} onChange={e=>setForm({...form, end:e.target.value})} />
        <div className="md:col-span-2">
          <div className="text-xs mb-1">Assign Personnel</div>
          <div className="flex flex-wrap gap-2">
            {defaultPeople.map(p => (
              <button key={p} onClick={()=>setForm(f=>({...f, personnel: toggle(f.personnel, p)}))}
                className={`btn ${form.personnel.includes(p)?'ring-2 ring-accent/60':''}`}>{p}</button>
            ))}
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="text-xs mb-1">Assign Equipment</div>
          <div className="flex flex-wrap gap-2">
            {defaultEquip.map(e => (
              <button key={e} onClick={()=>setForm(f=>({...f, equipment: toggle(f.equipment, e)}))}
                className={`btn ${form.equipment.includes(e)?'ring-2 ring-accent/60':''}`}>{e}</button>
            ))}
          </div>
        </div>
        <div className="md:col-span-4">
          <button className="btn" onClick={addMission}>Add Mission</button>
        </div>
      </div>

      <div className="card p-3">
        <div className="font-semibold mb-2">Timeline</div>
        <div className="overflow-x-auto">
          <div className="min-w-[720px]">
            <div className="grid" style={{gridTemplateColumns: `200px repeat(${days.length}, 1fr)`}}>
              <div></div>
              {days.map(d => <div key={d} className="text-xs text-center">{d}</div>)}
              {missions.map(m => {
                const s = dayjs(m.start).format('YYYY-MM-DD');
                const e = dayjs(m.end).format('YYYY-MM-DD');
                const startIdx = days.indexOf(s);
                const endIdx = days.indexOf(e);
                const span = Math.max(1, endIdx - startIdx + 1);
                return (
                  <>
                    <div className="p-2 text-sm">{m.title}<div className="text-xs text-white/50">{m.status}</div></div>
                    {days.map((d, i) => (
                      <div key={m.id+'-'+d} className="p-1">
                        {i===startIdx && (
                          <div className="h-8 rounded-xl bg-accent/20 border border-accent/40"
                            style={{ gridColumn: `span ${span} / span ${span}` }}>
                            <div className="text-xs px-2 py-1">{m.objective}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <ResourceOptimizer missions={missions} />
    </div>
  );
}

function ResourceOptimizer({ missions }:{ missions: Mission[] }) {
  const [suggestions, setSuggestions] = useState<{mission:string, suggestion:string}[]>([]);
  const resources = [
    { name: 'UAV-Scout', count: 2 },
    { name: 'APC-01', count: 3 },
    { name: 'Medic Kit', count: 5 },
    { name: 'Fuel Truck', count: 1 },
    { name: 'Ammo Crate', count: 10 },
    { name: 'Comms Van', count: 1 },
    { name: 'Radar-Portable', count: 2 }
  ];

  function optimize() {
    // Greedy assign based on scarcity
    const stock = new Map(resources.map(r=>[r.name, r.count]));
    const out: {mission:string, suggestion:string}[] = [];
    for (const m of missions) {
      const need = m.equipment;
      const assigned: string[] = [];
      for (const item of need) {
        const left = (stock.get(item) ?? 0);
        if (left > 0) { stock.set(item, left-1); assigned.push(item); }
      }
      const unassigned = need.filter(i=>!assigned.includes(i));
      if (unassigned.length) {
        out.push({ mission: m.title, suggestion: `Insufficient: ${unassigned.join(', ')} – consider reallocating from low-priority missions.` });
      } else {
        out.push({ mission: m.title, suggestion: `All requested equipment can be fulfilled.` });
      }
    }
    setSuggestions(out);
  }

  return (
    <div className="card p-3">
      <div className="flex items-center gap-2 mb-3">
        <div className="font-semibold">Resource Optimization</div>
        <button className="btn" onClick={optimize}>Optimize Allocation</button>
      </div>
      <div className="overflow-x-auto">
        <table>
          <thead><tr><th>Mission</th><th>Suggestion</th></tr></thead>
          <tbody>
            {suggestions.map((s,i)=>(
              <tr key={i} className="border-t border-white/5">
                <td>{s.mission}</td>
                <td>{s.suggestion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
