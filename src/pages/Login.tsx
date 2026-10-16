import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logoMark from '../imports/logo-mark.png';
import { supabase } from '../lib/supabase';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { roleRedirectPath, type UserRole } from '../lib/authRedirect';

export default function Login() {
  useDocumentTitle('Sign in — Klastra', 'Sign in to your Klastra account.');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { profile, loading: authLoading, refresh } = useAuth();
  const profileRole: string | undefined = profile?.role;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(() => (
    searchParams.get('error') === 'oauth_failed'
      ? 'Google sign-in failed. Please try again or use your email and password.'
      : ''
  ));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !profile) return;
    navigate(roleRedirectPath(profileRole as UserRole), { replace: true });
  }, [authLoading, navigate, profile, profileRole]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setNotice(null);
    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }
    if (!supabase) {
      setError('Missing Supabase env vars. Check .env.local');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) throw new Error(signInError.message);

      const refreshedProfile = await refresh();
      navigate(roleRedirectPath((refreshedProfile?.role as UserRole) ?? null), { replace: true });
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    if (!supabase) {
      setError('Missing Supabase env vars. Check .env.local');
      return;
    }

    setIsGoogleSubmitting(true);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (oauthError) throw new Error(oauthError.message);
    } catch (oauthError) {
      setError(oauthError instanceof Error ? oauthError.message : 'Unable to start Google sign-in.');
      setIsGoogleSubmitting(false);
    }
  };

  if (authLoading || profile) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center text-sm text-slate-500">
        Checking your account...
      </main>
    );
  }

  return (
    <main className="mesh-bg mx-auto flex max-w-4xl items-center justify-center px-5 py-10 sm:px-6 sm:py-12">
      <div className="glass-medium w-full max-w-xl rounded-3xl border p-5 sm:p-8 md:p-10">
        <div className="text-center">
          <img src={logoMark} alt="Klastra" className="mx-auto h-14 w-14" />
          <h1 className="mt-6 text-3xl font-black text-slate-900 md:text-4xl">Sign in to Klastra</h1>
          <p className="mt-3 text-slate-600">School administrators can access their dashboard here.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
          <div>
            <label htmlFor="login-email" className="mb-1 block text-sm font-semibold text-slate-700">Email</label>
            <input
              id="login-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#102A43] focus:ring-2 focus:ring-[#102A43]/10"
              aria-describedby={error ? 'login-error' : undefined}
              aria-invalid={Boolean(error)}
              required
            />
          </div>
          <div>
            <label htmlFor="login-password" className="mb-1 block text-sm font-semibold text-slate-700">Password</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#102A43] focus:ring-2 focus:ring-[#102A43]/10"
              aria-describedby={error ? 'login-error' : undefined}
              aria-invalid={Boolean(error)}
              required
            />
          </div>
          {error && <p id="login-error" role="alert" className="text-sm text-red-600">{error}</p>}
          <Button type="submit" variant="primary" size="lg" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => void handleGoogleSignIn()}
          disabled={isSubmitting || isGoogleSubmitting}
          className="relative mt-4 flex min-h-11 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <GoogleLogo />
          <span>{isGoogleSubmitting ? 'Redirecting...' : 'Continue with Google'}</span>
        </button>

        <div className="mt-8 border-t border-slate-200 pt-6">
          <h2 className="text-sm font-bold text-slate-800">Use the mobile app</h2>
          <p className="mt-2 text-sm text-slate-600">Students, parents, and tutors use the Klastra app to sign in.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Button variant="outline" size="lg" onClick={() => setNotice('Open Klastra on Google Play to install the app.')}>Google Play</Button>
            <Button variant="outline" size="lg" onClick={() => setNotice('Open Klastra on the App Store to install the app.')}>App Store</Button>
          </div>
        </div>

        {notice && (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
            {notice}
          </div>
        )}

        <div className="mt-8 text-center text-sm text-slate-600">
          Are you a school interested in a pilot?{' '}
          <Link to="/contact" className="font-semibold text-[#102A43] underline-offset-4 hover:underline">Request a demo</Link>
        </div>
      </div>
    </main>
  );
}

function GoogleLogo() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className="absolute left-4 h-5 w-5">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.93c-.58 2.96-2.25 5.48-4.72 7.18l7.62 5.9c4.45-4.12 7.15-10.2 7.15-17.55z" />
      <path fill="#34A853" d="M10.54 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.75-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.53 2.56 10.78l7.98-6.19z" />
      <path fill="#FBBC05" d="M24 48c6.48 0 11.93-2.13 15.9-5.9l-7.62-5.9c-2.12 1.42-4.84 2.3-8.28 2.3-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}
