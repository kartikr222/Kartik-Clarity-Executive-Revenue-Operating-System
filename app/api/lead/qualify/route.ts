import { NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase/admin';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

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
  const rate = checkRateLimit(`lead-qualify:${getClientIp(request)}`, { limit: 10, windowMs: 60_000 });
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Too many lead submissions. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfterSeconds) } },
    );
  }

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
    if (!supabase) {
      return NextResponse.json({ error: 'Lead persistence is temporarily unavailable.' }, { status: 503 });
    }

    const { error } = await supabase.from('qualified_leads').insert(record);
    if (error) {
      console.error('qualified_leads insert failed', { code: error.code, message: error.message });
      return NextResponse.json({ error: 'Lead persistence failed. Please try again later.' }, { status: 503 });
    }

    return NextResponse.json({
      ok: true,
      lead: { ...record, createdAt: new Date().toISOString() },
      persisted: true,
      persistenceMessage: 'Lead persisted.',
    });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request.' }, { status: 400 });
  }
}
