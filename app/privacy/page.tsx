export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold">Privacy Policy</h1>
      <p className="mt-4 text-sm text-gray-500">Last updated: August 16, 2026</p>

      <div className="mt-10 space-y-8 leading-7">
        <section>
          <h2 className="text-2xl font-semibold">Information we collect</h2>
          <p className="mt-2">When you use a diagnostic or submit a lead qualification form, we may collect the business information you provide, such as your name, work email, company name, revenue information, and stated revenue bottleneck.</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold">How we use information</h2>
          <p className="mt-2">We use submitted information to provide diagnostic results, qualify business inquiries, communicate about requested services, maintain security, and improve the service.</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold">Data storage</h2>
          <p className="mt-2">Lead qualification records may be stored in our managed database infrastructure. We do not intentionally expose server-only credentials to browsers or API responses.</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold">Third parties</h2>
          <p className="mt-2">Service providers may process information on our behalf for hosting, database, security, analytics, or communications. We do not sell submitted personal information.</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold">Contact</h2>
          <p className="mt-2">For privacy questions or requests concerning information you submitted, contact the service operator through the contact method provided on the website.</p>
        </section>
      </div>
    </main>
  );
}
