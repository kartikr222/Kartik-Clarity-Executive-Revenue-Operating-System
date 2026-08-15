import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Kartik Clarity™',
  description: 'Founder Revenue Intelligence and revenue leakage diagnostics for scaling B2B SaaS teams.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-obsidian-bg px-6 py-20 text-gray-100">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-clarity-gold">Revenue Architecture Practice</div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">Founder Revenue Intelligence™</h1>
        <p className="mt-6 text-lg leading-8 text-gray-400">A precision diagnostic approach to finding hidden revenue friction across the B2B SaaS revenue system.</p>
        <div className="mt-12 space-y-8 rounded-2xl border border-white/[0.06] bg-obsidian-surface p-8 sm:p-12">
          <section>
            <h2 className="text-2xl font-bold">The architectural problem</h2>
            <p className="mt-4 leading-8 text-gray-400">As revenue organizations scale, growth can be constrained by friction inside the system: stalled opportunities, weak economic cases, excessive discounting, long sales cycles, and preventable expansion or retention leakage.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold">The operating principle</h2>
            <p className="mt-4 leading-8 text-gray-400">Kartik Clarity™ turns revenue questions into structured diagnostics so leadership can prioritize measurable problems before investing in additional activity or headcount.</p>
          </section>
        </div>
        <a href="/tools" className="mt-8 inline-block rounded-lg bg-clarity-gold px-6 py-3 font-bold text-black">Explore diagnostic engines →</a>
      </div>
    </main>
  );
}
