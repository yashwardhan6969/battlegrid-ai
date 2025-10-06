'use client';
import { useRef, useState } from 'react';

export default function VoiceRecorder({ onText }:{ onText:(text:string)=>void }) {
  const recRef = useRef<any>(null);
  const [active, setActive] = useState(false);

  const toggle = () => {
    if (active) {
      recRef.current?.stop?.();
      setActive(false);
      return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert('SpeechRecognition not supported in this browser.');
      return;
    }
    const rec = new SR();
    rec.lang = 'en-IN';
    rec.interimResults = true;
    rec.continuous = false;
    rec.onresult = (e:any) => {
      const text = Array.from(e.results).map((r:any)=>r[0].transcript).join(' ');
      onText(text);
    };
    rec.onend = () => setActive(false);
    recRef.current = rec;
    rec.start();
    setActive(true);
  };

  return (
    <button onClick={toggle} className={`btn ${active ? 'ring-2 ring-accent/60' : ''}`}>
      {active ? 'Stop mic' : 'Record (Voice→Text)'}
    </button>
  );
}
