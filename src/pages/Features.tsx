import { useDocumentTitle } from '../hooks/useDocumentTitle';

const featureSections = [
  {
    title: 'Attendance that takes seconds, not minutes',
    description: 'Teachers can mark attendance for the whole class from one screen. Attendance is updated in real time and stays searchable for later review.',
    bullets: ['One tap per student', 'Late / present / absent tracking', 'Daily summaries for school leaders'],
    accent: 'bg-[#EFF6FF]',
    emoji: '🧾',
  },
  {
    title: 'Scores that reach parents without extra admin',
    description: 'Enter scores once and keep the class record in one place. When parents log in, they can see the latest performance update without the teacher needing to retype everything elsewhere.',
    bullets: ['Maths and subject score entry', 'Automatic BECE grade calculations', 'Quick class performance snapshot'],
    accent: 'bg-[#ECFDF5]',
    emoji: '📈',
  },
  {
    title: 'Class remarks that every parent sees',
    description: 'Post one class message and keep it visible to everyone linked to the class. That keeps communication consistent and helps schools share updates without scattered WhatsApp chats.',
    bullets: ['One remark for the whole class', 'Shared school updates', 'Parents see the same message in-app'],
    accent: 'bg-[#EFF6FF]',
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

const mockupCardClass = 'rounded-2xl border border-slate-100 bg-white p-4 shadow-sm';

const attendanceRows = [
  { name: 'Kwame', present: true },
  { name: 'Ama', present: true },
  { name: 'Kofi', present: false },
  { name: 'Akosua', present: true },
  { name: 'Yaa', present: false },
  { name: 'Kwabena', present: true },
];

const scoreRows = [
  { name: 'Kwame Mensah', maths: 78, english: 65, science: 82, grade: 'A2', gradeClass: 'bg-emerald-100 text-emerald-800' },
  { name: 'Ama Owusu', maths: 92, english: 88, science: 95, grade: 'A1', gradeClass: 'bg-green-100 text-green-800', viewed: true },
  { name: 'Kofi Asare', maths: 71, english: 76, science: 68, grade: 'B2', gradeClass: 'bg-teal-100 text-teal-800' },
  { name: 'Akosua Boateng', maths: 64, english: 73, science: 70, grade: 'B3', gradeClass: 'bg-blue-100 text-blue-800' },
];

function MockupFrame({ children, ariaLabel }: { children: React.ReactNode; ariaLabel: string }) {
  return <div role="img" aria-label={ariaLabel} className={mockupCardClass}>{children}</div>;
}

function AttendanceMockup() {
  return (
    <MockupFrame ariaLabel="Attendance roster for JHS 2A showing four of six pupils marked present">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900">JHS 2A</h3>
          <p className="text-[11px] text-slate-500">Mon 14 Oct</p>
        </div>
        <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-semibold text-teal-800">4 / 6 marked</span>
      </div>
      <div className="space-y-1">
        {attendanceRows.map(({ name, present }) => (
          <div key={name} className="flex min-w-0 items-center justify-between gap-1.5 rounded-lg bg-slate-50 px-2 py-1">
            <span className="min-w-0 truncate text-xs font-medium text-slate-700">{name}</span>
            <div className="flex shrink-0 gap-1 text-[11px]">
              <span className={`rounded-md px-1.5 py-1 ${present ? 'bg-teal-600 font-semibold text-white' : 'bg-white text-slate-500'}`}>✓ Present</span>
              <span className={`rounded-md px-1.5 py-1 ${present ? 'bg-white text-slate-500' : 'bg-red-100 font-semibold text-red-700'}`}>✗ Absent</span>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 border-t border-slate-100 pt-2 text-[11px] text-slate-500">Saved automatically</p>
    </MockupFrame>
  );
}

function ScoresMockup() {
  return (
    <MockupFrame ariaLabel="Grade entry table with BECE grade badges for four pupils">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900">JHS 2A · Term 1</h3>
          <p className="text-[11px] text-slate-500">BECE subject scores</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-800">4 learners</span>
      </div>
      <div className="hidden lg:block">
        <table className="w-full table-fixed text-left text-[11px]">
          <thead>
            <tr className="border-b border-slate-100 text-slate-500">
              <th className="w-[34%] pb-2 font-semibold">Student</th>
              <th className="pb-2 text-center font-semibold">Maths</th>
              <th className="pb-2 text-center font-semibold">English</th>
              <th className="pb-2 text-center font-semibold">Science</th>
              <th className="pb-2 text-center font-semibold">Grade</th>
            </tr>
          </thead>
          <tbody>
            {scoreRows.map((row) => (
              <tr key={row.name} className="border-b border-slate-50 last:border-0">
                <td className="truncate py-2 font-medium text-slate-700">
                  <span className="block truncate">{row.name}</span>
                  {row.viewed && <span className="block text-[11px] font-medium text-emerald-700">Parent viewed ✓</span>}
                </td>
                <td className="py-2 text-center text-slate-600">{row.maths}</td>
                <td className="py-2 text-center text-slate-600">{row.english}</td>
                <td className="py-2 text-center text-slate-600">{row.science}</td>
                <td className="py-2 text-center"><span className={`rounded-md px-1.5 py-1 font-bold ${row.gradeClass}`}>{row.grade}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-2 lg:hidden">
        {scoreRows.map((row) => (
          <div key={row.name} className="rounded-lg bg-slate-50 p-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-xs font-semibold text-slate-800">{row.name}</span>
              <span className={`shrink-0 rounded-md px-1.5 py-1 text-[11px] font-bold ${row.gradeClass}`}>{row.grade}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-600">
              <span>Maths <b>{row.maths}</b></span>
              <span>English <b>{row.english}</b></span>
              <span>Science <b>{row.science}</b></span>
            </div>
            {row.viewed && <span className="mt-1.5 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-800">Parent viewed ✓</span>}
          </div>
        ))}
      </div>
    </MockupFrame>
  );
}

function ClassRemarkMockup() {
  const parentInitials = ['KA', 'AO', 'KM', 'YA', 'KB', 'AS', 'KO', 'AB', 'MA', 'EO', 'NA', 'SA'];
  return (
    <MockupFrame ariaLabel="Class announcement seen by twelve parents">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-bold text-blue-700">4B</div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-slate-900">Class 4B announcement</h3>
          <p className="text-[11px] text-slate-500">GCTU Basic · Class remarks</p>
        </div>
      </div>
      <p className="mt-4 rounded-xl bg-blue-50 p-3 text-sm leading-relaxed text-slate-700">
        Reminder: Mufti day this Friday. Pupils may come in mufti.
      </p>
      <p className="mt-3 text-[11px] font-medium text-slate-600">Mrs Owusu · Class teacher</p>
      <div className="mt-4 flex flex-col items-start gap-2 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:gap-3">
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {parentInitials.map((initials, index) => (
            <span key={`${initials}-${index}`} className={`-ml-3 first:ml-0 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-white text-[11px] font-bold text-white ${index % 3 === 0 ? 'bg-blue-600' : index % 3 === 1 ? 'bg-teal-600' : 'bg-violet-600'}`}>
              {initials}
            </span>
          ))}
        </div>
        <span className="text-[11px] font-semibold text-slate-600">Seen by 12 parents</span>
      </div>
    </MockupFrame>
  );
}

function LockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M7 10V7a5 5 0 0 1 10 0v3m-11 0h12a2 2 0 0 1 2 2v8H4v-8a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 14v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function PrivateNoteMockup() {
  return (
    <div role="img" aria-label="Private note visible only to one parent" className={`${mockupCardClass} border-violet-100 bg-violet-50/60`}>
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-violet-700 shadow-sm"><LockIcon /></span>
        <div className="min-w-0">
          <h3 className="text-sm font-bold leading-snug text-slate-900">Private note · visible to Kofi&apos;s parents only</h3>
          <span className="mt-1 inline-block rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-semibold text-violet-800">Private to this family</span>
        </div>
      </div>
      <p className="mt-4 rounded-xl bg-white p-3 text-sm leading-relaxed text-slate-700">
        Kofi did very well in today&apos;s mental maths. Please encourage him at home.
        <span className="mt-2 block text-[11px] font-semibold text-slate-500">— Mr Mensah</span>
      </p>
      <div className="mt-3 flex items-center gap-2 text-[11px] font-medium text-violet-800">
        <LockIcon />
        <span>Not visible to other parents</span>
      </div>
    </div>
  );
}

function ParentIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" className="h-7 w-7">
      <circle cx="16" cy="9" r="5" stroke="currentColor" strokeWidth="2" />
      <path d="M6 27v-3a10 10 0 0 1 20 0v3H6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="25" cy="18" r="3" fill="white" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function TeacherIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" className="h-7 w-7">
      <rect x="4" y="5" width="24" height="17" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M11 27h10m-5-5v5m-7-12 4-4 3 3 5-5m0 0v4m0-4h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon({ vertical = false }: { vertical?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={`h-5 w-5 shrink-0 text-slate-300 ${vertical ? 'rotate-90 lg:rotate-0' : ''}`}>
      <path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ParentLinkMockup() {
  const steps = [
    { title: 'Enters student ID', detail: 'Parent request', icon: <ParentIcon />, color: 'bg-blue-50 text-blue-700' },
    { title: 'Approves request', detail: 'Teacher review', icon: <TeacherIcon />, color: 'bg-teal-50 text-teal-700' },
    { title: 'Linked to child', detail: 'Access granted', icon: <span className="text-2xl font-bold">✓</span>, color: 'bg-emerald-50 text-emerald-700' },
  ];
  return (
    <MockupFrame ariaLabel="Three-step parent linking flow requiring teacher approval">
      <div className="flex flex-col items-stretch gap-2 lg:flex-row lg:items-center lg:gap-2">
        {steps.map((step, index) => (
          <div key={step.title} className="contents">
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm lg:flex-col lg:items-start lg:gap-2">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${step.color}`}>{step.icon}</span>
              <span className="min-w-0">
                <span className="block text-xs font-bold text-slate-800">{step.title}</span>
                <span className="mt-0.5 block text-[11px] text-slate-500">{step.detail}</span>
              </span>
            </div>
            {index < steps.length - 1 && <span className="flex justify-center lg:px-0.5"><ArrowIcon vertical /></span>}
          </div>
        ))}
      </div>
      <p className="mt-4 border-t border-slate-100 pt-3 text-center text-[11px] font-semibold text-slate-600">
        Approval required · RLS-enforced access
      </p>
    </MockupFrame>
  );
}

function PhoneMockup({ title, parentView = false }: { title: string; parentView?: boolean }) {
  return (
    <div className="min-w-0 rounded-[1.4rem] border-[3px] border-slate-800 bg-slate-50 p-2.5 shadow-sm">
      <div className="mx-auto mb-2 h-1 w-9 rounded-full bg-slate-300" />
      <div className="mb-3 flex items-center gap-2 border-b border-slate-200 pb-2">
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${parentView ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'}`}>
          {parentView ? 'AO' : 'MO'}
        </span>
        <span className="truncate text-[11px] font-semibold text-slate-700">{title}</span>
      </div>
      <div className={`max-w-[95%] rounded-2xl p-2.5 text-[11px] leading-relaxed ${parentView ? 'bg-white text-slate-700 shadow-sm' : 'ml-auto bg-blue-600 text-white'}`}>
        Ama was excellent in today&apos;s reading group 📚
      </div>
      <p className={`mt-1.5 text-[11px] text-slate-500 ${parentView ? 'text-left' : 'text-right'}`}>
        {parentView ? 'Received' : 'Delivered'} · 10:42
      </p>
    </div>
  );
}

function MessagingMockup() {
  return (
    <MockupFrame ariaLabel="Two phone views of the same message, teacher and parent, with phone numbers hidden">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-slate-900">One message, safely delivered</h3>
        <span className="rounded-full bg-pink-50 px-2 py-1 text-[11px] font-medium text-pink-800">In-app</span>
      </div>
      <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2">
        <PhoneMockup title="Teacher view" />
        <PhoneMockup title="Parent view" parentView />
      </div>
      <div className="mt-3 flex justify-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 shadow-sm">
          <LockIcon />
          Phone numbers never shared 🔒
        </span>
      </div>
    </MockupFrame>
  );
}

export default function Features() {
  useDocumentTitle(
    'Features — Klastra',
    'Attendance, scores, remarks, parent linking, and messaging for modern schools.',
  );
  return (
    <main className="mesh-bg mx-auto max-w-6xl px-6 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#102A43]">Features</div>
        <h1 className="mt-4 text-3xl font-black text-slate-900 md:text-5xl">School operations, simplified for everyday teaching</h1>
      </div>

      <div className="mt-12 space-y-8">
        {featureSections.map((section, index) => {
          const isReversed = index % 2 === 1;

          return (
            <section key={section.title} className="glass-medium glass-hover-lift rounded-3xl border p-6 md:p-8">
              <div className={`grid items-center gap-8 md:grid-cols-2 ${isReversed ? 'md:[&>*:first-child]:order-2' : ''}`}>
                <div className={`${section.accent} rounded-3xl p-6`}>
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">{section.emoji}</div>
                  {[
                    <AttendanceMockup />,
                    <ScoresMockup />,
                    <ClassRemarkMockup />,
                    <PrivateNoteMockup />,
                    <ParentLinkMockup />,
                    <MessagingMockup />,
                  ][index]}
                </div>

                <div>
                  <h2 className="text-2xl font-black text-slate-900 md:text-3xl">{section.title}</h2>
                  <p className="mt-4 text-base leading-relaxed text-slate-700">{section.description}</p>
                  <ul className="mt-5 space-y-3 text-sm text-slate-700">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#ECFDF5] text-[#22A06B]">✓</span>
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
