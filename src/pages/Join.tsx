import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import logoMark from '../imports/logo-mark.png';
import { supabase } from '../lib/supabase';
import { previewSchoolInvite, redeemSchoolInvite, type InvitePreview } from '../services/schoolInvites';

export default function Join() {
  const navigate = useNavigate();
  const { profile, loading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const code = (searchParams.get('code') ?? '').trim().toUpperCase();

  const [preview, setPreview] = useState<InvitePreview | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(Boolean(code));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const nextCode = (searchParams.get('code') ?? '').trim().toUpperCase();
    if (!nextCode) {
      setPreview({
        schoolName: null,
        schoolRegion: null,
        role: null,
        valid: false,
        reason: 'You need an invite code from your school to join. Ask your school admin for the link.',
      });
      setLoadingPreview(false);
      return;
    }

    let cancelled = false;
    setLoadingPreview(true);
    setError('');

    void previewSchoolInvite(nextCode)
      .then((invitePreview) => {
        if (!cancelled) setPreview(invitePreview);
      })
      .catch((previewError: unknown) => {
        if (!cancelled) {
          setPreview({
            schoolName: null,
            schoolRegion: null,
            role: null,
            valid: false,
            reason: previewError instanceof Error ? previewError.message : 'Unable to validate your invite.',
          });
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingPreview(false);
      });

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  const handleRedeem = async () => {
    if (!code) return;

    setIsSubmitting(true);
    setError('');

    try {
      await redeemSchoolInvite(code);
      navigate('/join/success', { state: { schoolName: preview?.schoolName ?? null } });
    } catch (redeemError) {
      setError(redeemError instanceof Error ? redeemError.message : 'Unable to redeem the invite.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }
    if (!supabase) {
      setError('Missing Supabase env vars. Check .env.local');
      return;
    }
    if (!code) {
      setError('No invite code was found.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });
      if (signUpError) throw new Error(signUpError.message);
      await redeemSchoolInvite(code);
      navigate('/join/success', { state: { schoolName: preview?.schoolName ?? null } });
    } catch (signupError) {
      setError(signupError instanceof Error ? signupError.message : 'Unable to sign up and join.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        Checking your account...
      </main>
    );
  }

  const isValidInvite = Boolean(preview?.valid);

  return (
    <main className="mesh-bg mx-auto flex min-h-screen items-center justify-center px-6 py-16">
      <div className="glass-medium w-full max-w-xl rounded-3xl border p-8 md:p-10">
        <div className="text-center">
          <img src={logoMark} alt="Klastra" className="mx-auto h-14 w-14" />
          <h1 className="mt-6 text-3xl font-black text-slate-900 md:text-4xl">Join your school</h1>
        </div>

        {loadingPreview ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-600">
            Checking your invite code...
          </div>
        ) : !code ? (
          <div className="mt-8 space-y-5 text-center">
            <p className="text-base text-slate-600">You need an invite code from your school to join. Ask your school admin for the link.</p>
            <Link to="/" className="inline-block text-sm font-semibold text-[#2563EB] hover:underline">Back to home</Link>
          </div>
        ) : !isValidInvite ? (
          <div className="mt-8 space-y-5 text-center">
            <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {preview?.reason || 'This invite is no longer valid.'}
            </p>
            <Link to="/login" className="inline-block text-sm font-semibold text-[#2563EB] hover:underline">Back to sign in</Link>
          </div>
        ) : profile ? (
          <div className="mt-8 space-y-5">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-900">
              You&apos;re signed in as <span className="font-semibold">{profile.email}</span>.
            </div>
            <p className="text-center text-slate-600">
              Click below to join <span className="font-semibold text-slate-900">{preview?.schoolName}</span> as a teacher.
            </p>
            {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
            <Button variant="primary" size="lg" fullWidth onClick={() => void handleRedeem()} disabled={isSubmitting}>
              {isSubmitting ? 'Joining...' : 'Accept invite'}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSignUp} className="mt-8 space-y-5" noValidate>
            <p className="text-center text-slate-600">
              You&apos;ve been invited to join <span className="font-semibold text-slate-900">{preview?.schoolName}</span> as a teacher.
            </p>
            <div>
              <label htmlFor="join-email" className="mb-1 block text-sm font-semibold text-slate-700">Email</label>
              <input
                id="join-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#102A43] focus:ring-2 focus:ring-[#102A43]/10"
                required
              />
            </div>
            <div>
              <label htmlFor="join-password" className="mb-1 block text-sm font-semibold text-slate-700">Password</label>
              <input
                id="join-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#102A43] focus:ring-2 focus:ring-[#102A43]/10"
                required
              />
            </div>
            {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
            <Button type="submit" variant="primary" size="lg" fullWidth disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Create account and join'}
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
