import { NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

type Lead = { founderName?: string; workEmail?: string; companyName?: string; currentARRUSD?: number; targetARRUSD?: number; primaryRevenueBottleneck?: string };

export async function POST(request: Request) {
  try {
    const body = await request.json() as Lead;
    if (!body.workEmail || !body.companyName) {
      return NextResponse.json({ error: 'workEmail and companyName are required.' }, { status: 400 });
    }
    const arr = typeof body.currentARRUSD === 'number' ? body.currentARRUSD : 0;
    const inIcpRange = arr >= 5_000_000 && arr <= 50_000_000;
    const qualificationScore = Math.round((inIcpRange ? 70 : 30) + (body.primaryRevenueBottleneck ? 20 : 0) + (body.targetARRUSD && body.targetARRUSD > arr ? 10 : 0));
    const record = { ...body, qualificationScore: Math.min(100, qualificationScore), icpFit: inIcpRange, createdAt: new Date().toISOString() };

    const supabase = getAdminSupabase();
    let persisted = false;
    if (supabase) {
      const { error } = await supabase.from('qualified_leads').insert(record);
      persisted = !error;
    }

    return NextResponse.json({ ok: true, lead: record, persisted, persistenceMessage: persisted ? 'Lead persisted.' : 'Lead qualified in-memory; Supabase table is not configured or insert failed.' });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request.' }, { status: 400 });
  }
}
