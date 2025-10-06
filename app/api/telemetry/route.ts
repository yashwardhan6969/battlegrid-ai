import { NextResponse } from 'next/server';
import { simulateThreats } from '@/lib/sim';

export const dynamic = 'force-dynamic';

export async function GET() {
  const threats = simulateThreats(8 + Math.floor(Math.random()*6));
  return NextResponse.json({ threats, serverTime: Date.now() }, { headers: { 'Cache-Control': 'no-store' } });
}
