'use client';
import { useEffect, useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, ResponsiveContainer } from 'recharts';
import { linearRegressionForecast } from '@/lib/forecasting';

type TrendPoint = { t:number, y:number, label:string };

export default function IntelAnalytics() {
  const [data, setData] = useState<TrendPoint[]>([]);

  useEffect(() => {
    // simulate daily threat counts last 14 days
    const now = Math.floor(Date.now()/86400000);
    const points: TrendPoint[] = Array.from({length: 14}, (_,i)=>{
      const t = now - (13 - i);
      const y = Math.max(2, Math.round(8 + Math.sin(i/3)*3 + (Math.random()*2-1)));
      return { t, y, label: new Date(t*86400000).toLocaleDateString() };
    });
    setData(points);
  }, []);

  const forecast = useMemo(() => linearRegressionForecast(data.map(({t,y})=>({t,y})), 7), [data]);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="card p-3">
        <div className="font-semibold mb-2">Threat Trend (14 days)</div>
        <div style={{width:'100%', height:260}}>
          <ResponsiveContainer>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="label" hide />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Area type="monotone" dataKey="y" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="card p-3">
        <div className="font-semibold mb-2">Logistics Forecast (next 7 days)</div>
        <div style={{width:'100%', height:260}}>
          <ResponsiveContainer>
            <LineChart data={forecast.map((f,i)=>({ ...f, label: 'D+'+(i+1) }))}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="y" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="text-xs text-white/60 mt-2">
          Forecast uses simple least-squares trend from recent data (demo). Replace with your model for accuracy.
        </div>
      </div>
    </div>
  );
}
