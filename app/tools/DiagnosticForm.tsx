'use client';

import { useState } from 'react';

type Result = {
  ok?: boolean;
  error?: string;
  result?: {
    score: number;
    severity: string;
    primaryBottleneck: string;
    estimatedAnnualLeakage: number;
    recommendations: string[];
  };
};

type LeadState = { status: 'idle' | 'submitting' | 'success' | 'error'; message?: string };

const fields = [
  ['annualRevenue', 'Annual revenue (USD)', '10000000', 0],
  ['monthlyExpenses', 'Monthly operating expenses (USD)', '500000', 0],
  ['cac', 'Customer acquisition cost (USD)', '25000', 0],
  ['ltv', 'Customer lifetime value (USD)', '100000', 0],
  ['monthlyChurnRate', 'Monthly churn rate (%)', '2', 0],
  ['averageDealSize', 'Average deal size (USD)', '50000', 0],
  ['salesCycleDays', 'Average sales cycle (days)', '75', 0],
] as const;

const initialLead = { founderName: '', workEmail: '', companyName: '', targetARRUSD: '' };

export default function DiagnosticForm() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [lead, setLead] = useState(initialLead);
  const [leadState, setLeadState] = useState<LeadState>({ status: 'idle' });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setLeadState({ status: 'idle' });

    try {
      const payload = Object.fromEntries(fields.map(([key]) => [key, Number(values[key])])) as Record<string, number>;
      const invalid = fields.find(([key]) => !Number.isFinite(payload[key]) || payload[key] < 0);
      if (invalid) {
        setResult({ error: `${invalid[1]} must be a valid non-negative number.` });
        return;
      }
      if (payload.monthlyChurnRate > 100) {
        setResult({ error: 'Monthly churn rate must be between 0 and 100%.' });
        return;
      }

      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as Result;
      setResult(response.ok ? data : { error: data.error || 'Diagnostic request failed.' });
    } catch {
      setResult({ error: 'Unable to reach the diagnostic service. Please check your connection and try again.' });
    } finally {
      setLoading(false);
    }
  }

  async function submitLead(e: React.FormEvent) {
    e.preventDefault();
    if (!result?.result) return;
    setLeadState({ status: 'submitting' });

    try {
      const response = await fetch('/api/lead/qualify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          founderName: lead.founderName,
          workEmail: lead.workEmail,
          companyName: lead.companyName,
          currentARRUSD: Number(values.annualRevenue || 0),
          targetARRUSD: Number(lead.targetARRUSD || 0),
          primaryRevenueBottleneck: result.result.primaryBottleneck,
        }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || 'Lead submission failed.');
      setLeadState({ status: 'success', message: 'Saved. We’ll use this diagnosis to prepare the next conversation.' });
    } catch (error) {
      setLeadState({ status: 'error', message: error instanceof Error ? error.message : 'Unable to save your details. Please try again.' });
    }
  }

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
      <form onSubmit={submit} noValidate className="rounded-2xl border border-white/[0.06] bg-obsidian-surface p-6 shadow-2xl shadow-black/20 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Run the diagnostic</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">Use approximate figures. This is a deterministic screening model, not a financial forecast.</p>
          </div>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-gray-500">7 inputs</span>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {fields.map(([key, label, placeholder, min]) => (
            <label key={key} className="text-sm font-medium text-gray-300">
              {label}
              <input
                required
                type="number"
                min={min}
                max={key === 'monthlyChurnRate' ? 100 : undefined}
                step="any"
                inputMode="decimal"
                placeholder={placeholder}
                value={values[key] || ''}
                onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                aria-label={label}
                className="mt-2 w-full rounded-lg border border-white/10 bg-obsidian-bg px-3 py-3 text-white placeholder:text-gray-700 transition focus:border-clarity-gold/60"
              />
            </label>
          ))}
        </div>
        <button type="submit" disabled={loading} className="mt-6 w-full rounded-lg bg-clarity-gold px-5 py-3.5 font-bold text-black transition hover:bg-clarity-goldHover disabled:cursor-not-allowed disabled:opacity-50">
          {loading ? 'Calculating…' : 'Calculate revenue risk →'}
        </button>
        <p className="mt-3 text-center text-xs text-gray-600">No financial data is shared with third parties by this screening step.</p>
      </form>

      <div aria-live="polite" className="rounded-2xl border border-white/[0.06] bg-obsidian-surface p-6 sm:p-8">
        {!result && <div className="flex h-full min-h-64 items-center justify-center text-center text-gray-500">Complete the seven inputs to reveal your modeled revenue-risk signal.</div>}
        {result?.result && (
          <div>
            <div className="text-sm uppercase tracking-widest text-clarity-gold">Risk score</div>
            <div className="mt-2 text-6xl font-extrabold tracking-tight">{result.result.score}<span className="text-xl text-gray-500">/100</span></div>
            <div className="mt-3 inline-flex rounded-full border border-white/10 px-3 py-1 text-sm capitalize">{result.result.severity}</div>
            <div className="mt-8 text-sm text-gray-500">Primary bottleneck</div>
            <div className="mt-1 text-xl font-bold text-white">{result.result.primaryBottleneck}</div>
            <div className="mt-6 text-sm text-gray-500">Estimated annual leakage signal</div>
            <div className="mt-1 text-2xl font-bold text-clarity-gold">${result.result.estimatedAnnualLeakage.toLocaleString()}</div>
            <ul className="mt-6 space-y-3 text-sm leading-6 text-gray-400">{result.result.recommendations.map((r) => <li key={r}>• {r}</li>)}</ul>

            {leadState.status !== 'success' && (
              <form onSubmit={submitLead} className="mt-8 border-t border-white/10 pt-6">
                <h3 className="font-semibold text-white">Get the diagnosis saved</h3>
                <p className="mt-1 text-sm text-gray-500">Give us your work details so this signal can become an actionable revenue conversation.</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <input type="text" maxLength={200} placeholder="Your name" value={lead.founderName} onChange={(e) => setLead((v) => ({ ...v, founderName: e.target.value }))} className="rounded-lg border border-white/10 bg-obsidian-bg px-3 py-3 text-sm text-white placeholder:text-gray-600" />
                  <input required type="email" maxLength={254} placeholder="Work email" value={lead.workEmail} onChange={(e) => setLead((v) => ({ ...v, workEmail: e.target.value }))} className="rounded-lg border border-white/10 bg-obsidian-bg px-3 py-3 text-sm text-white placeholder:text-gray-600" />
                  <input required type="text" maxLength={200} placeholder="Company name" value={lead.companyName} onChange={(e) => setLead((v) => ({ ...v, companyName: e.target.value }))} className="rounded-lg border border-white/10 bg-obsidian-bg px-3 py-3 text-sm text-white placeholder:text-gray-600" />
                  <input type="number" min="0" step="any" inputMode="decimal" placeholder="Target ARR (USD)" value={lead.targetARRUSD} onChange={(e) => setLead((v) => ({ ...v, targetARRUSD: e.target.value }))} className="rounded-lg border border-white/10 bg-obsidian-bg px-3 py-3 text-sm text-white placeholder:text-gray-600" />
                </div>
                <button type="submit" disabled={leadState.status === 'submitting'} className="mt-4 w-full rounded-lg border border-clarity-gold/50 px-4 py-3 font-semibold text-clarity-gold transition hover:bg-clarity-goldDim disabled:opacity-50">
                  {leadState.status === 'submitting' ? 'Saving…' : 'Save my diagnosis →'}
                </button>
                {leadState.status === 'error' && <p role="alert" className="mt-3 text-sm text-red-400">{leadState.message}</p>}
              </form>
            )}
            {leadState.status === 'success' && <div role="status" className="mt-8 rounded-lg border border-clarity-gold/20 bg-clarity-goldDim p-4 text-sm text-clarity-gold">{leadState.message}</div>}
          </div>
        )}
        {result?.error && <div role="alert" className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">{result.error}</div>}
      </div>
    </div>
  );
}
