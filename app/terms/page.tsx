export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold">Terms of Use</h1>
      <p className="mt-4 text-sm text-gray-500">Last updated: August 16, 2026</p>

      <div className="mt-10 space-y-8 leading-7">
        <section>
          <h2 className="text-2xl font-semibold">Use of the service</h2>
          <p className="mt-2">You may use Kartik Clarity for lawful business evaluation and diagnostic purposes. You are responsible for the accuracy and legality of information you submit.</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold">Diagnostic information</h2>
          <p className="mt-2">Diagnostic outputs are modeled decision-support information, not guarantees of revenue, financial performance, or business outcomes. Validate important decisions against your own CRM, financial, customer, and operational evidence.</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold">Acceptable use</h2>
          <p className="mt-2">Do not abuse, disrupt, reverse engineer, overload, or attempt unauthorized access to the service or its infrastructure.</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold">Availability</h2>
          <p className="mt-2">The service is provided on an availability basis. Features may change, be suspended, or be discontinued as the product evolves.</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold">Contact</h2>
          <p className="mt-2">Questions about these terms should be directed to the service operator through the contact method provided on the website.</p>
        </section>
      </div>
    </main>
  );
}
