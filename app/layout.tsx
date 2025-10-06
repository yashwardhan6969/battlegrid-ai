import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BattleGrid AI – MVP',
  description: 'Indigenous Defense Command Platform – Prototype MVP'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <header className="sticky top-0 z-50 backdrop-blur border-b border-white/10 bg-bg/70">
            <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-4">
              <div className="flex items-center gap-3">
                <img src="/icon-192.png" alt="logo" className="w-8 h-8 rounded-xl" />
                <h1 className="text-lg font-semibold tracking-wide">BattleGrid AI</h1>
              </div>
              <div className="ml-auto flex items-center gap-3">
                <OnlineIndicator />
                <a className="btn" href="/manifest.webmanifest" target="_blank" rel="noreferrer">Install PWA</a>
              </div>
            </div>
          </header>
          <main className="mx-auto max-w-7xl p-4">{children}</main>
          <script dangerouslySetInnerHTML={{__html:`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch(()=>{});
              });
            }
          `}} />
        </div>
      </body>
    </html>
  );
}

function OnlineIndicator() {
  return (
    <span id="online-indicator" className="badge border border-white/10">
      <script dangerouslySetInnerHTML={{__html:`
        (function(){
          const el = document.getElementById('online-indicator');
          function set() {
            if (!el) return;
            const on = navigator.onLine;
            el.textContent = on ? 'ONLINE' : 'OFFLINE';
            el.style.background = on ? 'rgba(46,229,157,.15)' : 'rgba(239,68,68,.15)';
            el.style.borderColor = on ? 'rgba(46,229,157,.4)' : 'rgba(239,68,68,.4)';
          }
          window.addEventListener('online', set);
          window.addEventListener('offline', set);
          set();
        })();
      `}}/>
    </span>
  );
}
