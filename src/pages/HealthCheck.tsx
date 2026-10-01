import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function HealthCheck() {
  const [status, setStatus] = useState<'checking' | 'ok' | 'error'>('checking');
  const [error, setError] = useState<string | null>(null);
  const [profileCount, setProfileCount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    const checkConnection = async () => {
      try {
        if (!supabase) {
          throw new Error('Missing Supabase env vars. Check .env.local');
        }

        const { count, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (error) throw error;
        if (active) {
          setProfileCount(count ?? 0);
          setStatus('ok');
        }
      } catch (e) {
        if (active) {
          const message = e instanceof Error
            ? e.message
            : typeof e === 'object' && e !== null && 'message' in e && typeof e.message === 'string'
              ? e.message
              : 'Unknown error';
          setError(message.trim() || 'Supabase returned an empty error response. Check the project API and profiles table.');
          setStatus('error');
        }
      }
    };

    void checkConnection();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold font-display mb-4">Supabase Connection</h1>

      {status === 'checking' && <p className="text-slate-500">Checking connection...</p>}

      {status === 'ok' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="font-semibold text-green-900">Connected</div>
          <div className="text-sm text-green-700 mt-1">
            Found <strong>{profileCount}</strong> profiles in the database.
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="font-semibold text-red-900">Connection failed</div>
          <div className="text-sm text-red-700 mt-1">{error}</div>
        </div>
      )}
    </div>
  );
}