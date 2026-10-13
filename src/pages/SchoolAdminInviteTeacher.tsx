import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import logoMark from '../imports/logo-mark.png';
import { generateSchoolInvite, listSchoolInvites, revokeSchoolInvite, type SchoolInvite } from '../services/schoolInvites';

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function SchoolAdminInviteTeacher() {
  const { profile, loading: authLoading } = useAuth();
  const [invite, setInvite] = useState<{ id: string; code: string; expiresAt: string } | null>(null);
  const [activeInvites, setActiveInvites] = useState<SchoolInvite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copying, setCopying] = useState<'code' | 'link' | null>(null);
  const [error, setError] = useState('');

  const fetchInvites = async () => {
    const data = await listSchoolInvites();
    setActiveInvites(
      data.filter((item) => item.used_at === null && item.revoked_at === null && new Date(item.expires_at).getTime() > Date.now()),
    );
  };

  useEffect(() => {
    if (authLoading) return;
    if (!profile) {
      return;
    }
    if (profile.role !== 'admin') {
      return;
    }

    let active = true;
    setIsLoading(true);
    void Promise.all([fetchInvites()])
      .catch((loadError: unknown) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load invites.');
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [authLoading, profile]);

  const handleGenerate = async () => {
    if (!profile || profile.role !== 'admin') return;

    setIsGenerating(true);
    setError('');

    try {
      const nextInvite = await generateSchoolInvite('teacher');
      setInvite(nextInvite);
      await fetchInvites();
    } catch (generateError) {
      setError(generateError instanceof Error ? generateError.message : 'Unable to generate an invite.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async (value: string, kind: 'code' | 'link') => {
    try {
      await navigator.clipboard.writeText(value);
      setCopying(kind);
      window.setTimeout(() => setCopying(null), 1500);
    } catch {
      setError('Unable to copy to clipboard.');
    }
  };

  const handleRevoke = async (inviteId: string) => {
    try {
      await revokeSchoolInvite(inviteId);
      await fetchInvites();
      if (invite?.id === inviteId) setInvite(null);
    } catch (revokeError) {
      setError(revokeError instanceof Error ? revokeError.message : 'Unable to revoke the invite.');
    }
  };

  if (authLoading || !profile || profile.role !== 'admin') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        Checking your school account...
      </main>
    );
  }

  const joinLink = invite ? `https://klastra-web.vercel.app/join?code=${invite.code}` : '';

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Link to="/school-admin" className="flex items-center gap-3">
            <img src={logoMark} alt="" className="h-10 w-10" />
            <span className="text-lg font-black text-slate-900">Klastra</span>
          </Link>
          <Link to="/school-admin/teachers" className="text-sm font-semibold text-[#2563EB] hover:underline">
            Back to teachers
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Teacher onboarding</p>
          <h1 className="mt-2 text-3xl font-black text-slate-900">Invite a teacher</h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            Generate an invite code and share it with the teacher via WhatsApp, SMS, or email. When they sign up at /join, they&apos;ll be linked to your school.
          </p>

          <div className="mt-8">
            <Button variant="primary" size="lg" fullWidth onClick={() => void handleGenerate()} disabled={isGenerating}>
              {isGenerating ? 'Generating...' : 'Generate invite code'}
            </Button>
          </div>

          {error && (
            <div role="alert" className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {invite && (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Invite code</p>
                  <p className="mt-2 font-mono text-3xl font-black tracking-[0.18em] text-slate-900">{invite.code}</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" onClick={() => void handleCopy(invite.code, 'code')}>
                    {copying === 'code' ? 'Copied!' : 'Copy code'}
                  </Button>
                </div>
              </div>

              <div className="mt-5 space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Join link</p>
                <p className="break-all text-sm text-slate-700">{joinLink}</p>
                <Button variant="outline" size="sm" onClick={() => void handleCopy(joinLink, 'link')}>
                  {copying === 'link' ? 'Copied!' : 'Copy link'}
                </Button>
              </div>

              <p className="mt-5 text-sm text-slate-600">Expires {formatDate(invite.expiresAt)}</p>
            </div>
          )}
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8">
          <h2 className="text-xl font-black text-slate-900">Your active invites</h2>

          {isLoading ? (
            <p className="mt-4 text-sm text-slate-500">Loading invites...</p>
          ) : activeInvites.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">There are no active invites for this school.</p>
          ) : (
            <div className="mt-5 space-y-3">
              {activeInvites.map((item) => (
                <div key={item.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-mono text-lg font-bold text-slate-900">{item.code}</p>
                    <p className="text-sm text-slate-600">Expires {formatDate(item.expires_at)}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => void handleRevoke(item.id)}>
                    Revoke
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
