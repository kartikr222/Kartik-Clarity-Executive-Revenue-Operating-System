const engines = [
  'Deal Friction', 'Pipeline Leakage', 'Ghosting Risk', 'Discount Erosion',
  'Champion Risk', 'ROI Defensibility', 'Sales Cycle Drag', 'Expansion Leakage',
  'Churn Exposure', 'Forecast Risk', 'Pricing Leakage', 'Revenue Recovery',
];

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-obsidian-bg px-6 py-16 text-gray-100">
      <div className="mx-auto max-w-6xl">
        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-clarity-gold">Diagnostic system</div>
        <h1 className="mt-3 text-4xl font-extrabold sm:text-6xl">12 Revenue Diagnostic Engines</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-400">A structured starting point for identifying where revenue can be delayed, diluted, or lost.</p>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {engines.map((engine, i) => (
            <article key={engine} className="rounded-xl border border-white/[0.06] bg-obsidian-surface p-6">
              <div className="font-mono text-sm text-clarity-gold">ENGINE {String(i + 1).padStart(2, '0')}</div>
              <h2 className="mt-4 text-xl font-bold">{engine}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-500">Diagnostic module placeholder. The production calculation engine and evidence model must be wired before this module is represented as operational.</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
