import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { roleRedirectPath, type UserRole } from '../lib/authRedirect';
import { getSupabase } from '../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function handleCallback() {
      try {
        const client = getSupabase();
        const { data: { session }, error: sessionError } = await client.auth.getSession();
        if (cancelled) return;
        if (sessionError || !session) {
          navigate('/login?error=oauth_failed', { replace: true });
          return;
        }

        const { data: profile, error: profileError } = await client
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .maybeSingle();
        if (cancelled) return;
        if (profileError) {
          setError(profileError.message);
          return;
        }

        const role = (profile?.role as UserRole) ?? null;
        navigate(roleRedirectPath(role), { replace: true });
      } catch (callbackError) {
        if (!cancelled) {
          setError(callbackError instanceof Error ? callbackError.message : 'Unable to complete Google sign-in.');
        }
      }
    }

    void handleCallback();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <main className="flex min-h-[50vh] items-center justify-center px-5 py-10">
      {error ? (
        <div className="text-center">
          <p role="alert" className="text-sm text-red-600">{error}</p>
          <Link to="/login" className="mt-4 inline-block text-sm font-semibold text-[#102A43] underline-offset-4 hover:underline">
            Back to sign in
          </Link>
        </div>
      ) : (
        <div role="status" aria-live="polite" className="flex items-center gap-3 text-sm text-slate-600">
          <span aria-hidden="true" className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-[#102A43]" />
          Signing you in…
        </div>
      )}
    </main>
  );
}
