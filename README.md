# BattleGrid AI – MVP (Vercel-ready)

This is a deployable MVP that **mimics** the requested Phase 1 capabilities:

- Real-time **Sensor Fusion** map with simulated multi-sensor threats
- **AI Threat Engine** (rule-based simulation with confidence/priority + alerts)
- **Indigenous Comms Hub** with client-side AES-GCM encryption, file sharing, and **voice→text**
- **Mission Planning & Resource Management** with timeline and basic **resource optimizer**
- **Intelligence Analytics** with trends and a simple **forecast**

## Quick Start (Local)

```bash
npm i
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

1. Push this folder to a new GitHub repo (or import from ZIP in Vercel).
2. In **Vercel** → **New Project**, select the repo.
3. Framework preset: **Next.js** (auto-detected).
4. No env vars needed. Click **Deploy**.
5. After deploy, open the URL. The PWA service worker registers automatically.
6. (Optional) Add a custom domain in Vercel settings.

> **Notes**
> - This prototype uses **client-side storage** for messages/missions (no DB).
> - Telemetry is simulated via `/api/telemetry`. Swap this with a real feed or model output.
> - Leaflet map uses OpenStreetMap tiles. Replace with your preferred basemap if needed.
> - Voice-to-text uses the Web Speech API (best in Chrome-based browsers).

## Project Structure

- `app/` – App Router pages and API routes
- `components/` – UI components
- `lib/` – utils: simulation, crypto, storage, forecasting
- `public/` – PWA assets and service worker

## Security Disclaimer

Encryption shown here is **for demonstration**. For production, implement proper key management, identity, transport security, and server-side storage.
