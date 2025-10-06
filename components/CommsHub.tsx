'use client';
import { useEffect, useRef, useState } from 'react';
import type { Message } from '@/lib/types';
import { load, save } from '@/lib/storage';
import { encrypt, decrypt } from '@/lib/crypto';
import VoiceRecorder from './VoiceRecorder';

export default function CommsHub() {
  const [msgs, setMsgs] = useState<Message[]>(() => load<Message[]>('msgs', []));
  const [draft, setDraft] = useState('');
  const [to, setTo] = useState('Alpha');
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => { save('msgs', msgs); scroller.current?.scrollTo(0, 1e9); }, [msgs]);

  useEffect(() => {
    const onOnline = () => {
      setMsgs(prev => prev.map(m => m.status==='queued'? {...m, status:'sent'} : m));
    };
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, []);

  async function send(text: string) {
    if (!text.trim()) return;
    const { cipherText, iv } = await encrypt(text.trim());
    const msg: Message = {
      id: crypto.randomUUID(),
      cipherText, iv,
      from: 'HQ', to,
      ts: Date.now(),
      status: navigator.onLine ? 'sent' : 'queued'
    };
    setMsgs(m => [...m, msg]);
    setDraft('');
  }

  async function attachFile(file: File) {
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const { cipherText, iv } = await encrypt(`[file:${file.name}] ${dataUrl.slice(0,50)}...`);
      const msg: Message = { id: crypto.randomUUID(), cipherText, iv, from:'HQ', to, ts: Date.now(), status: navigator.onLine ? 'sent':'queued', fileName: file.name, fileDataUrl: dataUrl };
      setMsgs(m => [...m, msg]);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="col-span-2 card p-3">
        <div ref={scroller} className="h-80 overflow-y-auto space-y-2">
          {msgs.map((m) => <Bubble key={m.id} msg={m} />)}
        </div>
        <div className="mt-3 flex gap-2 items-center">
          <input className="input flex-1" placeholder="Type secure message..." value={draft} onChange={e=>setDraft(e.target.value)} />
          <VoiceRecorder onText={setDraft} />
          <button className="btn" onClick={()=>send(draft)}>Send</button>
          <label className="btn cursor-pointer">
            Attach
            <input type="file" className="hidden" onChange={e=>e.target.files && attachFile(e.target.files[0])} />
          </label>
        </div>
        <div className="text-xs text-white/50 mt-2">
          Encryption: AES-GCM (client-side demo). Messages are queued offline and marked sent when connectivity restores.
        </div>
      </div>
      <div className="card p-3">
        <div className="font-semibold mb-2">Recipients</div>
        <div className="flex flex-col gap-2">
          {['Alpha','Bravo','Charlie','Delta'].map(u => (
            <button key={u} onClick={()=>setTo(u)} className={`btn justify-start ${to===u?'ring-2 ring-accent/60':''}`}>{u}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Bubble({ msg }: { msg: Message }) {
  const [plain, setPlain] = useState<string>('…');
  useEffect(() => { (async () => setPlain(await decrypt(msg.cipherText, msg.iv)))(); }, [msg.cipherText, msg.iv]);
  const mine = msg.from === 'HQ';
  return (
    <div className={`max-w-[85%] ${mine?'ml-auto':''}`}>
      <div className="text-[10px] text-white/50 mb-0.5">{mine?'You → '+msg.to: msg.from+' → You'} · {new Date(msg.ts).toLocaleTimeString()} · {msg.status}</div>
      <div className={`rounded-2xl px-3 py-2 ${mine?'bg-accent/20':'bg-black/30'} border border-white/10`}>
        <div className="whitespace-pre-wrap break-words">{plain}</div>
        {msg.fileDataUrl && <a href={msg.fileDataUrl} download={msg.fileName} className="block text-xs mt-1 underline">Download {msg.fileName}</a>}
      </div>
    </div>
  );
}
