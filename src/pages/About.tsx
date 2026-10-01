import { Link } from 'react-router-dom';

export default function About() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold font-display text-slate-900">About Tutor Konnect</h1>
      <p className="text-slate-500 mt-2">Connecting students and tutors across Ghana</p>
      <div className="space-y-4 mt-8 text-slate-600 leading-relaxed">
        <p>Tutor Konnect helps students across Ghana access supportive, convenient online tutoring. We connect learners with knowledgeable educators so they can build confidence and make progress in the subjects that matter to them.</p>
        <p>We aim to make it easier to find verified tutors, learn from wherever you are, and arrange lessons around school, work, and family schedules.</p>
        <p>Our mission is to make quality learning support more accessible through trusted tutors and flexible scheduling.</p>
      </div>
      <p className="text-sm text-slate-400 mt-8">More about our story and team is coming soon.</p>
      <Link to="/tutors" className="inline-flex items-center justify-center mt-6 px-5 py-2.5 rounded-xl bg-[#1b3d7e] text-white text-sm font-semibold hover:bg-[#152e61] transition-colors">Find a Tutor</Link>
    </main>
  );
}