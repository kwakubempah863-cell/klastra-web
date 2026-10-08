export default function About() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
        <h1 className="text-3xl font-black text-slate-900 md:text-5xl">Why we built Tutor Konnect</h1>
        <div className="mt-8 space-y-5 text-lg leading-relaxed text-slate-700">
          <p>
            We built Tutor Konnect for private schools in Ghana that are doing important work with too little structure.
            Many schools still rely on paper class registers, handwritten test scores, and WhatsApp messages to keep parents informed.
            That creates gaps, slows down communication, and makes it harder for school leaders to see what is really happening every day.
          </p>
          <p>
            We saw the problem firsthand: class teachers spend valuable time on attendance and score recording, but the information never reaches families in a useful format.
            Parents are left in the dark, while school staff continue to juggle note books and group chats to keep up with updates.
          </p>
          <p>
            Tutor Konnect gives schools a simple system for attendance, scores, parent communication, and school updates — all in one mobile-first workflow designed for Ghanaian classrooms.
            We want schools to spend less time on admin and more time on teaching.
          </p>
        </div>
      </div>
    </main>
  );
}
