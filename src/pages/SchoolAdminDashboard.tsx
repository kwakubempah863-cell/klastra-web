import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';
import DownloadAppButton from '../components/DownloadAppButton';
import { useAuth } from '../contexts/AuthContext';
import logoMark from '../imports/logo-mark.png';
import { getDocumentSignedUrl } from '../services/superAdmin';
import { getMySchoolRequest } from '../services/schoolRequests';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

type DocumentType = 'registration_certificate' | 'headmaster_id' | 'headmaster_appointment';
type RequestStatus = 'pending' | 'awaiting_review' | 'needs_info' | 'approved' | 'rejected';

type SchoolRequest = {
  id: string;
  status: RequestStatus;
  reviewer_notes: string | null;
  requested_docs: DocumentType[] | null;
  registration_certificate_url: string | null;
  headmaster_id_url: string | null;
  headmaster_appointment_url: string | null;
  created_at: string;
  reviewed_at: string | null;
};

const documents: { type: DocumentType; field: keyof SchoolRequest; label: string }[] = [
  { type: 'registration_certificate', field: 'registration_certificate_url', label: 'School registration certificate' },
  { type: 'headmaster_id', field: 'headmaster_id_url', label: 'Headmaster national ID' },
  { type: 'headmaster_appointment', field: 'headmaster_appointment_url', label: 'Headmaster appointment letter' },
];

const documentLabels: Record<DocumentType, string> = {
  registration_certificate: 'School registration certificate',
  headmaster_id: 'Headmaster national ID',
  headmaster_appointment: 'Headmaster appointment letter',
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

const statusDisplay: Record<RequestStatus, { heading: string; body: string; icon: string; colors: string }> = {
  pending: {
    heading: 'Complete your application',
    body: 'Upload your verification documents to submit your school for review.',
    icon: '◷',
    colors: 'bg-amber-100 text-amber-800',
  },
  awaiting_review: {
    heading: 'Application under review',
    body: "We've received your application and will review it within 24 hours.",
    icon: '◷',
    colors: 'bg-blue-100 text-blue-800',
  },
  needs_info: {
    heading: 'More information needed',
    body: 'Please re-upload the following documents:',
    icon: '!',
    colors: 'bg-amber-100 text-amber-800',
  },
  approved: {
    heading: 'Your school is approved!',
    body: 'Welcome to Klastra. Your school account is ready. Use the mobile app to manage your school, teachers, students, and parents.',
    icon: '✓',
    colors: 'bg-emerald-100 text-emerald-800',
  },
  rejected: {
    heading: 'Application not approved',
    body: 'If you believe this was a mistake, please contact support.',
    icon: '×',
    colors: 'bg-red-100 text-red-800',
  },
};

export default function SchoolAdminDashboard() {
  useDocumentTitle('School dashboard — Klastra');
  const navigate = useNavigate();
  const { profile, loading: authLoading, signOut } = useAuth();
  const profileRole: string | undefined = profile?.role;
  const [request, setRequest] = useState<SchoolRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [openingDocument, setOpeningDocument] = useState<DocumentType | null>(null);
  const [documentError, setDocumentError] = useState('');
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!profile) {
      navigate('/login', { replace: true });
    } else if (profileRole !== 'admin') {
      navigate('/', { replace: true });
    }
  }, [authLoading, navigate, profile, profileRole]);

  useEffect(() => {
    if (authLoading || !profile || profileRole !== 'admin') return;

    let cancelled = false;
    setIsLoading(true);
    setLoadError('');
    getMySchoolRequest(profile.id)
      .then((data) => {
        if (!cancelled) setRequest(data as SchoolRequest | null);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : 'Unable to load your application.');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, profile, profileRole, refreshKey]);

  const handleSignOut = useCallback(async () => {
    setIsSigningOut(true);
    setSignOutError('');
    try {
      await signOut();
      navigate('/login', { replace: true });
    } catch (error) {
      setSignOutError(error instanceof Error ? error.message : 'Unable to sign out.');
      setIsSigningOut(false);
    }
  }, [navigate, signOut]);

  const openDocument = async (type: DocumentType, path: string) => {
    const newTab = window.open('about:blank', '_blank');
    if (!newTab) {
      setDocumentError('Allow pop-ups to view this document.');
      return;
    }
    newTab.opener = null;
    setOpeningDocument(type);
    setDocumentError('');
    try {
      const signedUrl = await getDocumentSignedUrl(path);
      newTab.location.href = signedUrl;
    } catch (error) {
      newTab.close();
      setDocumentError(error instanceof Error ? error.message : 'Unable to open this document.');
    } finally {
      setOpeningDocument(null);
    }
  };

  if (authLoading || !profile || profileRole !== 'admin') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        Checking your school account...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoMark} alt="Klastra" className="h-10 w-10" />
            <span className="text-lg font-black text-slate-900">Klastra</span>
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <span className="hidden text-sm text-slate-600 sm:inline">{profile.email}</span>
            <Button variant="outline" size="sm" onClick={() => setRefreshKey((current) => current + 1)} disabled={isLoading}>
              Refresh
            </Button>
            <Button variant="secondary" size="sm" onClick={() => void handleSignOut()} disabled={isSigningOut}>
              {isSigningOut ? 'Signing out...' : 'Sign out'}
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-6 px-5 py-8 sm:px-6 sm:py-10">
        {signOutError && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{signOutError}</p>
        )}

        {isLoading ? (
          <section aria-label="Loading application" className="animate-pulse rounded-3xl border border-slate-200 bg-white p-8 sm:p-10">
            <div className="h-12 w-12 rounded-full bg-slate-200" />
            <div className="mt-6 h-7 w-2/3 rounded bg-slate-200" />
            <div className="mt-4 h-4 w-full rounded bg-slate-100" />
            <div className="mt-2 h-4 w-4/5 rounded bg-slate-100" />
          </section>
        ) : loadError ? (
          <section className="rounded-3xl border border-red-200 bg-white p-8 text-center sm:p-10">
            <h1 className="text-xl font-bold text-slate-900">Unable to load your application</h1>
            <p role="alert" className="mt-3 text-sm text-red-700">{loadError}</p>
            <Button variant="primary" className="mt-6" onClick={() => setRefreshKey((current) => current + 1)}>Try again</Button>
          </section>
        ) : !request ? (
          <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center sm:p-10">
            <h1 className="text-xl font-bold text-slate-900">We couldn&apos;t find your application</h1>
            <p className="mt-3 text-sm text-slate-600">Please register your school to begin the verification process.</p>
            <Link to="/" className="mt-6 inline-block text-sm font-semibold text-[#2563EB] hover:underline">Return to home</Link>
          </section>
        ) : (
          <>
            <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 md:p-10">
              {request.status === 'needs_info' && (
                <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">
                  {request.reviewer_notes || 'Please review and re-upload the requested documents.'}
                </div>
              )}
              {request.status === 'rejected' && (
                <div className="mb-6 rounded-2xl border border-red-300 bg-red-50 p-4 text-sm leading-relaxed text-red-900">
                  {request.reviewer_notes || 'Your application was not approved.'}
                </div>
              )}
              <div className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl font-bold ${statusDisplay[request.status].colors}`} aria-hidden="true">
                {statusDisplay[request.status].icon}
              </div>
              <h1 className="mt-5 text-2xl font-black text-slate-900 sm:text-3xl">{statusDisplay[request.status].heading}</h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{statusDisplay[request.status].body}</p>

              {request.status === 'pending' && (
                <ul className="mt-5 list-disc space-y-2 pl-5 text-sm text-slate-600">
                  {documents
                    .filter(({ field }) => !request[field])
                    .map(({ type, label }) => <li key={type}>{label}</li>)}
                </ul>
              )}

              {request.status === 'needs_info' && (
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
                  {(request.requested_docs ?? [])
                    .filter((type): type is DocumentType => type in documentLabels)
                    .map((type) => <li key={type}>{documentLabels[type]}</li>)}
                </ul>
              )}

              {request.status === 'awaiting_review' && (
                <p className="mt-4 text-xs text-slate-500">Submitted {relativeTime(request.created_at)}</p>
              )}

              {request.status === 'approved' && request.reviewed_at && (
                <p className="mt-4 text-xs text-slate-500">Approved {relativeTime(request.reviewed_at)}</p>
              )}

              {request.status === 'pending' && (
                <Button variant="primary" size="lg" className="mt-7" onClick={() => navigate('/register/documents')}>
                  Upload documents
                </Button>
              )}
              {request.status === 'needs_info' && (
                <Button variant="primary" size="lg" className="mt-7" onClick={() => navigate('/register/documents')}>
                  Re-upload documents
                </Button>
              )}
              {request.status === 'awaiting_review' && (
                <Link to="/register/documents" className="mt-5 inline-block text-sm font-semibold text-[#2563EB] hover:underline">
                  Upload more documents
                </Link>
              )}
              {request.status === 'approved' && (
                <div className="mt-7"><DownloadAppButton size="lg" /></div>
              )}
              {request.status === 'rejected' && (
                <Link to="/contact" className="mt-5 inline-block text-sm font-semibold text-[#2563EB] hover:underline">
                  Contact support
                </Link>
              )}
              <div className="mt-7">
                <Link to="/school-admin/teachers" className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Manage teachers
                </Link>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 md:p-10">
              <h2 className="text-lg font-bold text-slate-900">Documents</h2>
              <div className="mt-4 divide-y divide-slate-100">
                {documents.map(({ type, field, label }) => {
                  const path = request[field] as string | null;
                  return (
                    <div key={type} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
                      <span className="text-sm font-semibold text-slate-700">{label}</span>
                      {path ? (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={openingDocument === type}
                          onClick={() => void openDocument(type, path)}
                        >
                          {openingDocument === type ? 'Opening...' : 'View'}
                        </Button>
                      ) : (
                        <span className="text-sm text-slate-400">Not uploaded</span>
                      )}
                    </div>
                  );
                })}
              </div>
              {documentError && <p role="alert" className="mt-4 text-sm text-red-700">{documentError}</p>}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
