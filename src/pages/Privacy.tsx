export default function Privacy() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-black text-slate-900 md:text-4xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-slate-500">Last updated: October 8, 2026</p>
        <div className="mt-8 space-y-5 text-slate-700">
          <p><strong className="text-slate-900">Information we collect.</strong> Klastra may collect school and staff contact details, student records needed for attendance and score tracking, parent access information, and support messages.</p>
          <p><strong className="text-slate-900">How information is used.</strong> Information is used to operate the school management platform, track attendance and scores, communicate with parents, and maintain system security.</p>
          <p><strong className="text-slate-900">Access control.</strong> Access is limited by role. Teachers, parents, and admins only see the data required for their responsibilities. Private data is not shared beyond approved school roles.</p>
          <p><strong className="text-slate-900">Retention and sharing.</strong> Information is kept only as long as needed to deliver the service and fulfill legal or operational obligations. We do not sell student data.</p>
          <p><strong className="text-slate-900">Your choices.</strong> Schools and parents may request access to or correction of their personal information, subject to the applicable requirements and school records policies.</p>
          <p><strong className="text-slate-900">Questions.</strong> Contact support@klastra.app if you have concerns about privacy or data access.</p>
        </div>
      </div>
    </main>
  );
}
