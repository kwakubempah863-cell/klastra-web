import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logoMark from '../imports/logo-mark.png';
import { supabase } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const { profile, loading: authLoading, refresh } = useAuth();
  const profileRole: string | undefined = profile?.role;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !profile) return;
    if (profileRole === 'platform_admin') navigate('/super-admin', { replace: true });
    else if (profileRole === 'admin') navigate('/school-admin', { replace: true });
    else navigate('/', { replace: true });
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
      const role: string | undefined = refreshedProfile?.role;
      if (role === 'platform_admin') navigate('/super-admin', { replace: true });
      else if (role === 'admin') navigate('/school-admin', { replace: true });
      else navigate('/', { replace: true });
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
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
    <main className="mesh-bg mx-auto flex max-w-4xl items-center justify-center px-6 py-16">
      <div className="glass-medium w-full max-w-xl rounded-3xl border p-8 md:p-10">
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
              required
            />
          </div>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <Button type="submit" variant="primary" size="lg" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

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
