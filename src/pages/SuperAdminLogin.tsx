import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import logoMark from '../imports/logo-mark.png';
import { signInPlatformAdmin } from '../services/superAdmin';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function SuperAdminLogin() {
  useDocumentTitle('Super Admin sign in — Klastra');
  const navigate = useNavigate();
  const { profile, loading: authLoading, refresh } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const profileRole: string | undefined = profile?.role;

  useEffect(() => {
    if (!authLoading && profileRole === 'platform_admin') {
      navigate('/super-admin', { replace: true });
    }
  }, [authLoading, navigate, profileRole]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signInPlatformAdmin(email.trim(), password);
      await refresh();
      navigate('/super-admin', { replace: true });
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || profileRole === 'platform_admin') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0F172A] px-6 text-sm text-slate-300">
        Checking your session...
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0F172A] px-5 py-10 sm:px-6 sm:py-12">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-5 shadow-2xl sm:p-8 md:p-10">
        <div className="text-center">
          <img src={logoMark} alt="Klastra" className="mx-auto h-14 w-14" />
          <h1 className="mt-6 text-3xl font-black text-slate-900">Klastra Super Admin</h1>
          <p className="mt-3 text-sm text-slate-600">Sign in to review school applications</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
          <div>
            <label htmlFor="admin-email" className="mb-1 block text-sm font-semibold text-slate-700">Email</label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#102A43] focus:ring-2 focus:ring-[#102A43]/10"
              aria-describedby={error ? 'super-admin-login-error' : undefined}
              aria-invalid={Boolean(error)}
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-1 block text-sm font-semibold text-slate-700">Password</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#102A43] focus:ring-2 focus:ring-[#102A43]/10"
              aria-describedby={error ? 'super-admin-login-error' : undefined}
              aria-invalid={Boolean(error)}
            />
          </div>

          {error && <p id="super-admin-login-error" role="alert" className="text-sm text-red-600">{error}</p>}

          <Button type="submit" variant="primary" size="lg" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm font-semibold text-[#102A43] hover:underline">← Back to home</Link>
        </div>
      </section>
    </main>
  );
}
