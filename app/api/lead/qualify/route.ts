import { NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

type Lead = {
  founderName?: unknown;
  workEmail?: unknown;
  companyName?: unknown;
  currentARRUSD?: unknown;
  targetARRUSD?: unknown;
  primaryRevenueBottleneck?: unknown;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json() as Lead;
    const workEmail = typeof body.workEmail === 'string' ? body.workEmail.trim().toLowerCase() : '';
    const companyName = typeof body.companyName === 'string' ? body.companyName.trim() : '';

    if (!workEmail || !emailPattern.test(workEmail) || workEmail.length > 254 || !companyName || companyName.length > 200) {
      return NextResponse.json({ error: 'A valid work email and company name are required.' }, { status: 400 });
    }

    const arr = typeof body.currentARRUSD === 'number' && Number.isFinite(body.currentARRUSD) ? Math.max(0, body.currentARRUSD) : 0;
    const targetArr = typeof body.targetARRUSD === 'number' && Number.isFinite(body.targetARRUSD) ? Math.max(0, body.targetARRUSD) : 0;
    const bottleneck = typeof body.primaryRevenueBottleneck === 'string' ? body.primaryRevenueBottleneck.trim().slice(0, 500) : '';
    const founderName = typeof body.founderName === 'string' ? body.founderName.trim().slice(0, 200) : '';
    const inIcpRange = arr >= 5_000_000 && arr <= 50_000_000;
    const qualificationScore = Math.min(100, Math.round((inIcpRange ? 70 : 30) + (bottleneck ? 20 : 0) + (targetArr > arr ? 10 : 0)));

    const record = {
      founder_name: founderName || null,
      work_email: workEmail,
      company_name: companyName,
      current_arr_usd: arr || null,
      target_arr_usd: targetArr || null,
      primary_revenue_bottleneck: bottleneck || null,
      qualification_score: qualificationScore,
      icp_fit: inIcpRange,
    };

    const supabase = getAdminSupabase();
    let persisted = false;
    if (supabase) {
      const { error } = await supabase.from('qualified_leads').insert(record);
      persisted = !error;
    }

    return NextResponse.json({
      ok: true,
      lead: { ...record, createdAt: new Date().toISOString() },
      persisted,
      persistenceMessage: persisted ? 'Lead persisted.' : 'Lead qualified; persistence is not currently available.',
    });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request.' }, { status: 400 });
  }
}
