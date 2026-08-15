const engines = [
  'Deal Friction',
  'Pipeline Leakage',
  'Ghosting Risk',
  'Discount Erosion',
  'Champion Risk',
  'ROI Defensibility',
  'Sales Cycle Drag',
  'Expansion Leakage',
  'Churn Exposure',
  'Forecast Risk',
  'Pricing Leakage',
  'Revenue Recovery',
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-obsidian-bg text-gray-100">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-20">
        <div className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-clarity-gold">Founder Revenue Intelligence™</div>
        <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl">
          Find the revenue your operating system is quietly losing.
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-400">
          Kartik Clarity™ is a diagnostic operating system for founders and revenue leaders who need to identify hidden deal friction, quantify leakage, and prioritize recoverable revenue.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a href="/tools" className="rounded-lg bg-clarity-gold px-6 py-3 font-bold text-black transition hover:bg-clarity-goldHover">Explore diagnostic engines →</a>
          <a href="/about" className="rounded-lg border border-white/10 px-6 py-3 font-semibold text-white hover:border-white/20">How it works</a>
        </div>

        <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {engines.map((engine, index) => (
            <div key={engine} className="rounded-xl border border-white/[0.06] bg-obsidian-surface p-5">
              <div className="text-xs font-mono text-clarity-gold">{String(index + 1).padStart(2, '0')}</div>
              <div className="mt-3 font-semibold text-white">{engine}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
