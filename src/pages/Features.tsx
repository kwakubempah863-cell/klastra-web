const featureSections = [
  {
    title: 'Attendance that takes seconds, not minutes',
    description: 'Teachers can mark attendance for the whole class from one screen. Attendance is updated in real time and stays searchable for later review.',
    bullets: ['One tap per student', 'Late / present / absent tracking', 'Daily summaries for school leaders'],
    accent: 'bg-[#eef2fb]',
    emoji: '🧾',
  },
  {
    title: 'Scores that reach parents without extra admin',
    description: 'Enter scores once and keep the class record in one place. When parents log in, they can see the latest performance update without the teacher needing to retype everything elsewhere.',
    bullets: ['Maths and subject score entry', 'Automatic BECE grade calculations', 'Quick class performance snapshot'],
    accent: 'bg-[#edfdf5]',
    emoji: '📈',
  },
  {
    title: 'Class remarks that every parent sees',
    description: 'Post one class message and keep it visible to everyone linked to the class. That keeps communication consistent and helps schools share updates without scattered WhatsApp chats.',
    bullets: ['One remark for the whole class', 'Shared school updates', 'Parents see the same message in-app'],
    accent: 'bg-[#fff8ec]',
    emoji: '📝',
  },
  {
    title: 'Private notes for specific students',
    description: 'Teachers can send private notes to a parent about a child without exposing information about other students. These notes stay with the child record and are easy to trace later.',
    bullets: ['Private child-specific communication', 'Parent-specific notes', 'Safe and searchable records'],
    accent: 'bg-[#f5f3ff]',
    emoji: '💬',
  },
  {
    title: 'Parent linking with controls in place',
    description: 'Parents link to children using a student ID. Teachers approve the connection and role-based access keeps each family in the correct part of the system.',
    bullets: ['Student ID linking flow', 'Teacher approval step', 'RLS-based data limits'],
    accent: 'bg-[#eefdf7]',
    emoji: '👨‍👩‍👧‍👦',
  },
  {
    title: 'Message parents without sharing phone numbers',
    description: 'Keep communication inside the school system. Teachers and parents can message each other safely without exposing personal contact information outside the app.',
    bullets: ['Private in-app communication', 'No number sharing', 'Saved message history'],
    accent: 'bg-[#fdf2f8]',
    emoji: '📲',
  },
];

export default function Features() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex rounded-full bg-[#eef2fb] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#1b3d7e]">Features</div>
        <h1 className="mt-4 text-3xl font-black text-slate-900 md:text-5xl">School operations, simplified for everyday teaching</h1>
      </div>

      <div className="mt-12 space-y-8">
        {featureSections.map((section, index) => {
          const isReversed = index % 2 === 1;

          return (
            <section key={section.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className={`grid items-center gap-8 md:grid-cols-2 ${isReversed ? 'md:[&>*:first-child]:order-2' : ''}`}>
                <div className={`${section.accent} rounded-3xl p-6`}>
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">{section.emoji}</div>
                  <div className="h-48 rounded-2xl bg-white/80 p-4 shadow-inner">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="h-3 w-20 rounded-full bg-slate-200" />
                      <div className="h-3 w-10 rounded-full bg-[#0fb568]" />
                    </div>
                    <div className="space-y-3">
                      {[1, 2, 3].map((item) => (
                        <div key={item} className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-[#dfe9ff]" />
                          <div className="flex-1 space-y-2">
                            <div className="h-2.5 w-2/3 rounded-full bg-slate-200" />
                            <div className="h-2.5 w-1/2 rounded-full bg-slate-200" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-black text-slate-900 md:text-3xl">{section.title}</h2>
                  <p className="mt-4 text-base leading-relaxed text-slate-700">{section.description}</p>
                  <ul className="mt-5 space-y-3 text-sm text-slate-700">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#edfdf5] text-[#0a7244]">✓</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
