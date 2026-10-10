import { Link } from 'react-router-dom';

const faqs = [
  { question: 'How do I sign up my school?', answer: 'Use the request demo form and we will contact your school to arrange a pilot and onboarding call.' },
  { question: 'Do teachers need training?', answer: 'A short 20-minute onboarding session is enough to get teachers comfortable with attendance, scores, and messaging.' },
  { question: 'Is my data safe?', answer: 'Yes. Klastra uses role-based access controls and private-by-default data access, with Row Level Security policies in the database.' },
  { question: 'What if teachers do not have smartphones?', answer: 'The mobile app works on any Android device, and school staff can use the app on standard school-approved phones.' },
  { question: 'How much does it cost?', answer: 'All plans are free during the pilot period. After onboarding, pricing depends on school size and needs.' },
  { question: 'Can parents see other children\'s data?', answer: 'No. Parent access is limited to their own linked child, and database rules enforce that separation.' },
];

export default function Support() {
  return (
    <main className="mesh-bg mx-auto max-w-4xl px-6 py-16">
      <div className="glass-light rounded-3xl border p-8">
        <h1 className="text-3xl font-black text-slate-900 md:text-4xl">Support</h1>
        <p className="mt-3 text-slate-600">Helpful answers for school staff, parents, and administrators.</p>
        <div className="mt-8 space-y-4">
          {faqs.map((faq) => (
            <section key={faq.question} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-bold text-slate-900">{faq.question}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{faq.answer}</p>
            </section>
          ))}
        </div>
        <div className="mt-8">
          <Link to="/contact" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#102A43] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0F172A]">Request a demo</Link>
        </div>
      </div>
    </main>
  );
}
