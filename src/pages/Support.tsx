import { Link } from 'react-router-dom';

const faqs = [
  { question: 'How do I book a tutor?', answer: 'Download the mobile app to browse tutors, choose a time, and book a lesson.' },
  { question: 'How do I reset my password?', answer: 'Use the Forgot Password link on the sign-in screen and follow the instructions sent to your account.' },
  { question: 'How do I contact my tutor?', answer: 'Open the Messages tab in the mobile app to contact your tutor.' },
  { question: 'How do I get a refund?', answer: 'Contact support with your booking ID so the team can review your request.' },
];

export default function Support() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold font-display text-slate-900">Support</h1>
      <p className="text-slate-500 mt-2">Help and troubleshooting</p>
      <div className="space-y-4 mt-8">
        {faqs.map(faq => (
          <section key={faq.question} className="bg-white rounded-xl p-5 card-shadow">
            <h2 className="font-bold font-display text-slate-900">{faq.question}</h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">{faq.answer}</p>
          </section>
        ))}
      </div>
      <Link to="/contact" className="inline-flex items-center justify-center mt-8 px-5 py-2.5 rounded-xl bg-[#1b3d7e] text-white text-sm font-semibold hover:bg-[#152e61] transition-colors">Contact support</Link>
    </main>
  );
}