import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterPending() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ').trim();

  return (
    <main className="mesh-bg min-h-[60vh] px-6 py-16">
      <section className="glass-medium mx-auto max-w-xl rounded-3xl border p-8 text-center sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#ECFDF5] text-4xl" aria-hidden="true">✓</div>
        <h1 className="mt-6 text-3xl font-black text-slate-900">Application received</h1>
        <p className="mt-4 text-base leading-relaxed text-slate-600">
          Thank you{fullName ? `, ${fullName}` : " — we've received your application"}. We&apos;ll review your school within 24 hours. In the meantime, upload your verification documents to speed up the process.
        </p>
        <div className="mt-8 space-y-4">
          <Button variant="primary" size="lg" fullWidth onClick={() => {
            // TODO: Session W2b — document upload
            navigate('/register/documents');
          }}>
            Upload documents
          </Button>
          <Link to="/" className="inline-block text-sm font-semibold text-[#2563EB] hover:underline">Return to home</Link>
        </div>
      </section>
    </main>
  );
}
