'use client';

import { useState } from 'react';

const fields = [
  ['annualRevenue', 'Annual revenue (USD)', '10000000'],
  ['monthlyExpenses', 'Monthly operating expenses (USD)', '500000'],
  ['cac', 'Customer acquisition cost (USD)', '25000'],
  ['ltv', 'Customer lifetime value (USD)', '100000'],
  ['monthlyChurnRate', 'Monthly churn rate (%)', '2'],
  ['averageDealSize', 'Average deal size (USD)', '50000'],
  ['salesCycleDays', 'Average sales cycle (days)', '75'],
] as const;

export default function DiagnosticForm() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setResult(null);
    const payload = Object.fromEntries(fields.map(([key]) => [key, Number(values[key] || 0)]));
    const response = await fetch('/api/ai/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await response.json(); setResult(data); setLoading(false);
  }

  return <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
    <form onSubmit={submit} className="rounded-2xl border border-white/[0.06] bg-obsidian-surface p-6 sm:p-8">
      <h2 className="text-xl font-bold">Run the diagnostic</h2>
      <p className="mt-2 text-sm text-gray-500">Use approximate figures. The output is a deterministic screening model, not a financial forecast.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {fields.map(([key, label, placeholder]) => <label key={key} className="text-sm text-gray-300">{label}<input required type="number" min="0" step="any" placeholder={placeholder} value={values[key] || ''} onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))} className="mt-2 w-full rounded-lg border border-white/10 bg-obsidian-bg px-3 py-3 text-white placeholder:text-gray-700" /></label>)}
      </div>
      <button disabled={loading} className="mt-6 w-full rounded-lg bg-clarity-gold px-5 py-3 font-bold text-black disabled:opacity-50">{loading ? 'Calculating…' : 'Calculate revenue risk →'}</button>
    </form>
    <div className="rounded-2xl border border-white/[0.06] bg-obsidian-surface p-6 sm:p-8">
      {!result && <div className="flex h-full min-h-64 items-center justify-center text-center text-gray-500">Your diagnostic result will appear here.</div>}
      {result?.result && <div><div className="text-sm uppercase tracking-widest text-clarity-gold">Risk score</div><div className="mt-2 text-6xl font-extrabold">{result.result.score}<span className="text-xl text-gray-500">/100</span></div><div className="mt-3 inline-flex rounded-full border border-white/10 px-3 py-1 text-sm capitalize">{result.result.severity}</div><div className="mt-8 text-sm text-gray-500">Primary bottleneck</div><div className="mt-1 text-xl font-bold">{result.result.primaryBottleneck}</div><div className="mt-6 text-sm text-gray-500">Estimated annual leakage range signal</div><div className="mt-1 text-2xl font-bold text-clarity-gold">${result.result.estimatedAnnualLeakage.toLocaleString()}</div><ul className="mt-6 space-y-3 text-sm text-gray-400">{result.result.recommendations.map((r: string) => <li key={r}>• {r}</li>)}</ul></div>}
      {result?.error && <div className="text-sm text-red-400">{result.error}</div>}
    </div>
  </div>;
}
