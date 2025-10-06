'use client';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import type { Threat } from '@/lib/types';

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const icon = (color: string) => L.divIcon({
  className: '',
  html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};box-shadow:0 0 12px ${color};border:2px solid white"></div>`,
  iconSize: [16, 16]
});

export default function MapView({ threats }: { threats: Threat[] }) {
  const center = useMemo(()=>[23.5, 77.5] as [number,number], []);
  return (
    <div className="h-[420px] rounded-2xl overflow-hidden">
      <MapContainer center={center} zoom={5} scrollWheelZoom className="h-[420px]">
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {threats.map(t => {
          const color = t.priority === 1 ? '#EF4444' : t.priority === 2 ? '#F59E0B' : '#2EE59D';
          return (
            <Marker key={t.id} position={[t.lat, t.lon]} icon={icon(color)}>
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold mb-1">Threat #{t.id.slice(-6)}</div>
                  <div>Type: {t.type}</div>
                  <div>Priority: {t.priority}</div>
                  <div>Confidence: {(t.confidence*100).toFixed(0)}%</div>
                  <div>Speed: {t.speedKts} kts, Heading: {t.heading}°</div>
                  <div>Lat/Lon: {t.lat.toFixed(4)}, {t.lon.toFixed(4)}</div>
                  {t.note ? <div className="mt-1 opacity-75">{t.note}</div> : null}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
