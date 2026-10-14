import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import logoMark from '../imports/logo-mark.png';
import { listSchoolRequests } from '../services/superAdmin';
import type { SchoolRequest } from '../services/superAdmin';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

type FilterStatus = SchoolRequest['status'] | 'all';

const filters: { label: string; value: FilterStatus }[] = [
  { label: 'Awaiting review', value: 'awaiting_review' },
  { label: 'Pending', value: 'pending' },
  { label: 'Needs info', value: 'needs_info' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'All', value: 'all' },
];

const statusLabels: Record<SchoolRequest['status'], string> = {
  pending: 'Pending',
  awaiting_review: 'Awaiting review',
  needs_info: 'Needs info',
  approved: 'Approved',
  rejected: 'Rejected',
};

const statusStyles: Record<SchoolRequest['status'], string> = {
  pending: 'bg-amber-50 text-amber-800',
  awaiting_review: 'bg-blue-50 text-blue-800',
  needs_info: 'bg-orange-50 text-orange-800',
  approved: 'bg-emerald-50 text-emerald-800',
  rejected: 'bg-red-50 text-red-800',
};

function relativeTime(timestamp: string) {
  const elapsedSeconds = Math.round((new Date(timestamp).getTime() - Date.now()) / 1000);
  if (!Number.isFinite(elapsedSeconds)) return 'Unknown date';

  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 60 * 60 * 24 * 365],
    ['month', 60 * 60 * 24 * 30],
    ['week', 60 * 60 * 24 * 7],
    ['day', 60 * 60 * 24],
    ['hour', 60 * 60],
    ['minute', 60],
  ];
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  for (const [unit, secondsPerUnit] of units) {
    if (Math.abs(elapsedSeconds) >= secondsPerUnit) {
      return formatter.format(Math.round(elapsedSeconds / secondsPerUnit), unit);
    }
  }
  return formatter.format(elapsedSeconds, 'second');
}

export default function SuperAdminDashboard() {
  useDocumentTitle('Super Admin — Klastra');
  const navigate = useNavigate();
  const { profile, loading: authLoading, signOut } = useAuth();
  const profileRole: string | undefined = profile?.role;
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('awaiting_review');
  const [requests, setRequests] = useState<SchoolRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    if (!authLoading && (!profile || profileRole !== 'platform_admin')) {
      navigate('/super-admin/login', { replace: true });
    }
  }, [authLoading, navigate, profile, profileRole]);

  useEffect(() => {
    if (authLoading || !profile || profileRole !== 'platform_admin') return;

    let cancelled = false;
    setIsLoading(true);
    setError('');
    listSchoolRequests(activeFilter === 'all' ? undefined : activeFilter)
      .then((data) => {
        if (!cancelled) setRequests(data);
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load school requests.');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeFilter, authLoading, profile, profileRole, refreshKey]);

  const handleSignOut = useCallback(async () => {
    setIsSigningOut(true);
    setError('');
    try {
      await signOut();
      navigate('/super-admin/login', { replace: true });
    } catch (signOutError) {
      setError(signOutError instanceof Error ? signOutError.message : 'Unable to sign out.');
      setIsSigningOut(false);
    }
  }, [navigate, signOut]);

  if (authLoading || !profile || profileRole !== 'platform_admin') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        Checking administrator access...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <img src={logoMark} alt="Klastra" className="h-10 w-10" />
            <span className="text-lg font-black text-slate-900">Super Admin</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="hidden max-w-52 truncate text-sm text-slate-600 sm:inline">{profile.email || 'Platform administrator'}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRefreshKey((current) => current + 1)}
              disabled={isLoading}
            >
              Refresh
            </Button>
            <Button variant="secondary" size="sm" onClick={() => void handleSignOut()} disabled={isSigningOut}>
              {isSigningOut ? 'Signing out...' : 'Sign out'}
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-10">
        <div>
          <h1 className="text-2xl font-black text-slate-900">School applications</h1>
          <p className="mt-2 text-sm text-slate-600">Review submitted school registration requests.</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2" aria-label="Filter school requests">
          {filters.map((filter) => {
            const active = activeFilter === filter.value;
            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                aria-pressed={active}
                className={`min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? 'border-[#102A43] bg-[#102A43] text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        {error && (
          <div role="alert" className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
            {error}
          </div>
        )}

        <section className="mt-6 space-y-3" aria-live="polite">
          {isLoading ? (
            Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6">
                <div className="h-5 w-1/3 rounded bg-slate-200" />
                <div className="mt-3 h-4 w-2/3 rounded bg-slate-100" />
              </div>
            ))
          ) : error ? null : requests.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
              <div className="text-3xl text-slate-300" aria-hidden="true">▤</div>
              <p className="mt-3 font-semibold text-slate-700">No requests in this category</p>
              <p className="mt-1 text-sm text-slate-500">Try another status filter.</p>
            </div>
          ) : (
            requests.map((request) => (
              <Link
                key={request.id}
                to={`/super-admin/requests/${request.id}`}
                className="block rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300 sm:p-6"
              >
                <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr_auto] lg:items-center">
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-bold text-slate-900">{request.school_name}</h2>
                    <p className="mt-1 text-sm text-slate-500">{request.school_region} · {request.school_city}</p>
                    {request.student_count !== null && (
                      <p className="mt-1 text-xs text-slate-400">{request.student_count.toLocaleString()} students</p>
                    )}
                  </div>

                  <div className="min-w-0 text-sm text-slate-600">
                    <p className="truncate font-semibold text-slate-800">{request.full_name}</p>
                    <p className="mt-1 truncate">{request.email}</p>
                    <p className="mt-1">{request.phone}</p>
                  </div>

                  <div className="flex items-center justify-between gap-4 lg:flex-col lg:items-end">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[request.status]}`}>
                      {statusLabels[request.status]}
                    </span>
                    <time dateTime={request.created_at} className="text-xs text-slate-500">
                      {relativeTime(request.created_at)}
                    </time>
                  </div>
                </div>
              </Link>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
