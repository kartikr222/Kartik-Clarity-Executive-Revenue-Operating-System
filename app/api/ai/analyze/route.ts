import { NextResponse } from 'next/server';
import { diagnose, type DiagnosticInput } from '@/lib/diagnostics';

export const runtime = 'nodejs';

const required = ['annualRevenue', 'monthlyExpenses', 'cac', 'ltv', 'monthlyChurnRate', 'averageDealSize', 'salesCycleDays'] as const;

export async function POST(request: Request) {
  try {
    const body = await request.json() as Partial<DiagnosticInput>;
    const invalid = required.find((key) => typeof body[key] !== 'number' || !Number.isFinite(body[key] as number) || (body[key] as number) < 0);
    if (invalid) {
      return NextResponse.json({ error: `${invalid} must be a finite non-negative number.` }, { status: 400 });
    }
    if ((body.monthlyChurnRate as number) > 100) {
      return NextResponse.json({ error: 'monthlyChurnRate must be between 0 and 100.' }, { status: 400 });
    }
    const result = diagnose(body as DiagnosticInput);
    return NextResponse.json({ ok: true, engine: 'deterministic-revenue-diagnostic-v1', result });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request.' }, { status: 400 });
  }
}
