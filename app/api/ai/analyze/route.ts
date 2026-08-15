import { NextResponse } from 'next/server';
import { diagnose, type DiagnosticInput } from '@/lib/diagnostics';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json() as Partial<DiagnosticInput>;
    const required = ['annualRevenue', 'monthlyExpenses', 'cac', 'ltv', 'monthlyChurnRate', 'averageDealSize', 'salesCycleDays'] as const;
    if (required.some((key) => typeof body[key] !== 'number' || !Number.isFinite(body[key]))) {
      return NextResponse.json({ error: 'All seven financial inputs must be finite numbers.' }, { status: 400 });
    }
    const result = diagnose(body as DiagnosticInput);
    return NextResponse.json({ ok: true, engine: 'deterministic-revenue-diagnostic-v1', result });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request.' }, { status: 400 });
  }
}
