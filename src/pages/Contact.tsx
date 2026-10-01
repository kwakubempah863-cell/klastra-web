export default function Contact() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold font-display text-slate-900">Contact Us</h1>
      <p className="text-slate-500 mt-2">We're here to help</p>

      <div className="grid sm:grid-cols-2 gap-4 mt-8">
        <a href="mailto:support@tutorkonnect.com" className="bg-white rounded-xl p-5 card-shadow hover:bg-slate-50 transition-colors">
          <h2 className="font-bold font-display text-slate-900">Email support</h2>
          <p className="text-sm text-[#1b3d7e] mt-2">support@tutorkonnect.com</p>
        </a>
        <a href="https://wa.me/233XXXXXXXXX" target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl p-5 card-shadow hover:bg-slate-50 transition-colors">
          <h2 className="font-bold font-display text-slate-900">WhatsApp</h2>
          <p className="text-sm text-[#1b3d7e] mt-2">+233 XX XXX XXXX</p>
        </a>
      </div>

      <section className="bg-white rounded-xl p-5 card-shadow mt-8">
        <h2 className="font-bold font-display text-slate-900 mb-4">Send us a message</h2>
        <textarea aria-label="Your message" rows={5} placeholder="How can we help?" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1b3d7e]/20 resize-y" />
        <button type="button" onClick={() => alert('Contact form coming soon.')} className="mt-4 px-5 py-2.5 rounded-xl bg-[#1b3d7e] text-white text-sm font-semibold hover:bg-[#152e61] transition-colors">Send</button>
      </section>
      <p className="text-sm text-slate-400 mt-6">The contact form is coming soon. Email support is available in the meantime.</p>
    </main>
  );
}