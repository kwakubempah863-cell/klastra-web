import { Link, useLocation } from 'react-router-dom';
import DownloadAppButton from '../components/DownloadAppButton';
import { Button } from '../components/ui';

export default function JoinSuccess() {
  const location = useLocation();
  const schoolName = (location.state as { schoolName?: string | null } | null)?.schoolName ?? 'your school';

  return (
    <main className="mesh-bg flex min-h-screen items-center justify-center px-6 py-16">
      <div className="glass-medium w-full max-w-xl rounded-3xl border border-emerald-200 bg-white p-8 text-center md:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">✓</div>
        <h1 className="mt-5 text-3xl font-black text-slate-900">Welcome to {schoolName}!</h1>
        <p className="mt-4 text-base text-slate-600">
          You&apos;ve joined as a teacher. Download the Klastra app to start using your account.
        </p>

        <div className="mt-8">
          <DownloadAppButton size="lg" className="w-full" />
        </div>

        <div className="mt-6 text-center">
          <Link to="/login">
            <Button variant="ghost" size="md">Back to sign in</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
