import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import logoMark from '../imports/logo-mark.png';
import {
  approveSchoolRequest,
  getDocumentSignedUrl,
  getSchoolRequest,
  rejectSchoolRequest,
  requestMoreInfo,
} from '../services/superAdmin';
import type { SchoolRequest } from '../services/superAdmin';

type RequestedDocumentType = 'registration_certificate' | 'headmaster_id' | 'headmaster_appointment';

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

const documentTypes: {
  type: RequestedDocumentType;
  field: 'registration_certificate_url' | 'headmaster_id_url' | 'headmaster_appointment_url';
  label: string;
}[] = [
  { type: 'registration_certificate', field: 'registration_certificate_url', label: 'School registration certificate' },
  { type: 'headmaster_id', field: 'headmaster_id_url', label: 'Headmaster national ID' },
  { type: 'headmaster_appointment', field: 'headmaster_appointment_url', label: 'Headmaster appointment letter' },
];

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

export default function SuperAdminRequestDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { profile, loading: authLoading, signOut } = useAuth();
  const profileRole: string | undefined = profile?.role;
  const [request, setRequest] = useState<SchoolRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [documentError, setDocumentError] = useState('');
  const [openingDocument, setOpeningDocument] = useState<string | null>(null);
  const [showApproveConfirmation, setShowApproveConfirmation] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showRequestInfoModal, setShowRequestInfoModal] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const [selectedDocTypes, setSelectedDocTypes] = useState<RequestedDocumentType[]>([]);
  const [rejectReason, setRejectReason] = useState('');
  const [actionError, setActionError] = useState('');
  const [activeAction, setActiveAction] = useState<'approve' | 'reject' | 'request-info' | null>(null);

  useEffect(() => {
    if (!authLoading && (!profile || profileRole !== 'platform_admin')) {
      navigate('/super-admin/login', { replace: true });
    }
  }, [authLoading, navigate, profile, profileRole]);

  useEffect(() => {
    if (authLoading || !profile || profileRole !== 'platform_admin' || !id) return;

    let cancelled = false;
    setIsLoading(true);
    setError('');
    getSchoolRequest(id)
      .then((data) => {
        if (!cancelled) setRequest(data);
      })
      .catch((loadError: unknown) => {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : 'Unable to load this request.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, id, profile, profileRole]);

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

  const openDocument = async (storagePath: string) => {
    const newTab = window.open('', '_blank');
    if (!newTab) {
      setDocumentError('Allow pop-ups to open the verification document.');
      return;
    }

    newTab.opener = null;
    setOpeningDocument(storagePath);
    setDocumentError('');
    try {
      const signedUrl = await getDocumentSignedUrl(storagePath);
      newTab.location.href = signedUrl;
    } catch (openError) {
      newTab.close();
      setDocumentError(openError instanceof Error ? openError.message : 'Unable to open this document.');
    } finally {
      setOpeningDocument(null);
    }
  };

  const confirmApproval = async () => {
    if (!request) return;
    setActiveAction('approve');
    setActionError('');
    try {
      await approveSchoolRequest(request.id);
      window.alert('School approved');
      navigate('/super-admin', { replace: true });
    } catch (approvalError) {
      setActionError(approvalError instanceof Error ? approvalError.message : 'Unable to approve this school.');
      setActiveAction(null);
    }
  };

  const submitRejection = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!request) return;
    const reason = rejectReason.trim();
    if (reason.length < 10) {
      setActionError('Enter a rejection reason of at least 10 characters.');
      return;
    }

    setActiveAction('reject');
    setActionError('');
    try {
      await rejectSchoolRequest(request.id, reason);
      navigate('/super-admin', { replace: true });
    } catch (rejectionError) {
      setActionError(rejectionError instanceof Error ? rejectionError.message : 'Unable to reject this school.');
      setActiveAction(null);
    }
  };

  const submitInfoRequest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!request) return;
    const message = infoMessage.trim();
    if (message.length < 10) {
      setActionError('Enter a message of at least 10 characters.');
      return;
    }
    if (selectedDocTypes.length === 0) {
      setActionError('Select at least one document to request.');
      return;
    }

    setActiveAction('request-info');
    setActionError('');
    try {
      await requestMoreInfo(request.id, message, selectedDocTypes);
      navigate('/super-admin', { replace: true });
    } catch (requestError) {
      setActionError(requestError instanceof Error ? requestError.message : 'Unable to request more information.');
      setActiveAction(null);
    }
  };

  const toggleRequestedDoc = (docType: RequestedDocumentType) => {
    setSelectedDocTypes((current) => current.includes(docType)
      ? current.filter((selected) => selected !== docType)
      : [...current, docType]);
    setActionError('');
  };

  if (authLoading || !profile || profileRole !== 'platform_admin') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        Checking administrator access...
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white px-6 py-4">
          <div className="mx-auto flex max-w-7xl items-center gap-3">
            <img src={logoMark} alt="" className="h-10 w-10" />
            <span className="text-lg font-black text-slate-900">Super Admin</span>
          </div>
        </header>
        <div className="flex min-h-[60vh] items-center justify-center text-sm text-slate-500">Loading school request...</div>
      </main>
    );
  }

  if (error || !request) {
    return (
      <main className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white px-6 py-4">
          <div className="mx-auto flex max-w-7xl items-center gap-3">
            <img src={logoMark} alt="" className="h-10 w-10" />
            <span className="text-lg font-black text-slate-900">Super Admin</span>
          </div>
        </header>
        <section className="mx-auto max-w-2xl px-6 py-20 text-center">
          <h1 className="text-2xl font-black text-slate-900">{error ? 'Unable to load request' : 'Request not found'}</h1>
          {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
          <Link to="/super-admin" className="mt-6 inline-block text-sm font-semibold text-[#2563EB] hover:underline">
            ← Back to applications
          </Link>
        </section>
      </main>
    );
  }

  const isFinalized = request.status === 'approved' || request.status === 'rejected';

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <img src={logoMark} alt="" className="h-10 w-10" />
            <span className="text-lg font-black text-slate-900">Super Admin</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-slate-600">{profile.email || 'Platform administrator'}</span>
            <Button variant="secondary" size="sm" onClick={() => void handleSignOut()} disabled={isSigningOut}>
              {isSigningOut ? 'Signing out...' : 'Sign out'}
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <Link to="/super-admin" className="text-sm font-semibold text-[#2563EB] hover:underline">
          ← Back to applications
        </Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <h1 className="text-2xl font-black text-slate-900">{request.school_name}</h1>
              <p className="mt-2 text-sm text-slate-500">{request.school_region} · {request.school_city}</p>
              <p className="mt-1 text-sm text-slate-500">
                {request.student_count === null ? 'Student count not provided' : `${request.student_count.toLocaleString()} students`}
              </p>

              <div className="my-6 border-t border-slate-200" />

              <h2 className="font-bold text-slate-900">Applicant</h2>
              <p className="mt-2 font-semibold text-slate-800">{request.full_name}</p>
              <p className="mt-1 text-sm">
                <a href={`mailto:${request.email}`} className="text-[#2563EB] hover:underline">{request.email}</a>
              </p>
              <p className="mt-1 text-sm">
                <a href={`tel:${request.phone}`} className="text-[#2563EB] hover:underline">{request.phone}</a>
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <h2 className="text-lg font-bold text-slate-900">Verification documents</h2>
              <div className="mt-4 divide-y divide-slate-100">
                {documentTypes.map(({ field, label }) => {
                  const storagePath = request[field];
                  return (
                    <div key={field} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600" aria-hidden="true">▤</span>
                        <span className="text-sm font-semibold text-slate-800">{label}</span>
                      </div>
                      {storagePath ? (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={openingDocument === storagePath}
                          onClick={() => void openDocument(storagePath)}
                        >
                          {openingDocument === storagePath ? 'Opening...' : 'View'}
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

            {!isFinalized && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                <h2 className="text-lg font-bold text-slate-900">Review actions</h2>
                {actionError && <p role="alert" className="mt-4 text-sm text-red-700">{actionError}</p>}

                {!showRejectForm ? (
                  <div className="mt-5 space-y-3">
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      disabled={activeAction !== null}
                      onClick={() => {
                        setActionError('');
                        setShowApproveConfirmation(true);
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      fullWidth
                      className="border-slate-300 text-slate-700 hover:bg-slate-50"
                      disabled={activeAction !== null}
                      onClick={() => {
                        setInfoMessage('');
                        setSelectedDocTypes([]);
                        setActionError('');
                        setShowRequestInfoModal(true);
                      }}
                    >
                      Request more info
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      fullWidth
                      className="border-red-200 text-red-700 hover:bg-red-50"
                      disabled={activeAction !== null}
                      onClick={() => {
                        setActionError('');
                        setShowRejectForm(true);
                      }}
                    >
                      Reject
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={submitRejection} className="mt-5 space-y-4">
                    <div>
                      <label htmlFor="rejection-reason" className="mb-1 block text-sm font-semibold text-slate-700">
                        Rejection reason
                      </label>
                      <textarea
                        id="rejection-reason"
                        rows={4}
                        minLength={10}
                        value={rejectReason}
                        onChange={(event) => setRejectReason(event.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#102A43] focus:ring-2 focus:ring-[#102A43]/10"
                        placeholder="Explain why this application is being rejected (at least 10 characters)."
                        required
                      />
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button type="submit" variant="danger" disabled={activeAction !== null || rejectReason.trim().length < 10}>
                        {activeAction === 'reject' ? 'Rejecting...' : 'Submit rejection'}
                      </Button>
                      <Button type="button" variant="outline" disabled={activeAction !== null} onClick={() => setShowRejectForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </section>
            )}
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="font-bold text-slate-900">Application status</h2>
              <span className={`mt-4 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusStyles[request.status]}`}>
                {statusLabels[request.status]}
              </span>
              <div className="mt-5 space-y-3 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-800">Submitted</span>
                  <br />
                  <time dateTime={request.created_at}>{new Date(request.created_at).toLocaleString()}</time>
                </p>
                {request.reviewed_at && (
                  <p>
                    <span className="font-semibold text-slate-800">
                      {request.status === 'approved' ? 'Approved' : request.status === 'rejected' ? 'Rejected' : 'Reviewed'}
                    </span>
                    <br />
                    <time dateTime={request.reviewed_at}>{relativeTime(request.reviewed_at)}</time>
                  </p>
                )}
                {request.reviewer_notes && (
                  <p className="rounded-xl bg-slate-50 p-3 text-slate-700">
                    <span className="font-semibold">Reviewer notes</span>
                    <br />
                    {request.reviewer_notes}
                  </p>
                )}
                {request.status === 'needs_info' && request.requested_docs?.length > 0 && (
                  <p className="text-xs text-slate-500">
                    Requested: {request.requested_docs
                      .map((docType) => documentTypes.find((document) => document.type === docType)?.label)
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="font-bold text-slate-900">Timeline</h2>
              <ol className="mt-4 space-y-4 text-sm">
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" aria-hidden="true" />
                  <span className="text-slate-600">Application submitted {relativeTime(request.created_at)}</span>
                </li>
                {request.reviewed_at && (
                  <li className="flex gap-3">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-600" aria-hidden="true" />
                    <span className="text-slate-600">
                      {request.status === 'approved' ? 'Application approved' : request.status === 'rejected' ? 'Application rejected' : 'Application reviewed'}{' '}
                      {relativeTime(request.reviewed_at)}
                    </span>
                  </li>
                )}
              </ol>
            </section>
          </aside>
        </div>
      </div>

      {showApproveConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-6 py-10" role="presentation">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="approve-title"
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <h2 id="approve-title" className="text-xl font-black text-slate-900">Approve this school?</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              This will create the school, make {request.full_name} the school admin, and link them. They&apos;ll be able to log in on mobile immediately.
            </p>
            {actionError && <p role="alert" className="mt-4 text-sm text-red-700">{actionError}</p>}
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <Button
                variant="outline"
                disabled={activeAction !== null}
                onClick={() => setShowApproveConfirmation(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" disabled={activeAction !== null} onClick={() => void confirmApproval()}>
                {activeAction === 'approve' ? 'Approving...' : 'Approve'}
              </Button>
            </div>
          </section>
        </div>
      )}

      {showRequestInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-6 py-10" role="presentation">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="request-info-title"
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <h2 id="request-info-title" className="text-xl font-black text-slate-900">Request more information</h2>
            <form onSubmit={submitInfoRequest} className="mt-5 space-y-5">
              <div>
                <label htmlFor="info-message" className="mb-1 block text-sm font-semibold text-slate-700">
                  Message to the headmaster
                </label>
                <textarea
                  id="info-message"
                  rows={4}
                  minLength={10}
                  value={infoMessage}
                  onChange={(event) => {
                    setInfoMessage(event.target.value);
                    setActionError('');
                  }}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#102A43] focus:ring-2 focus:ring-[#102A43]/10"
                  placeholder="Explain what needs to be corrected or re-uploaded."
                  required
                />
              </div>

              <fieldset>
                <legend className="mb-2 text-sm font-semibold text-slate-700">Documents to re-upload</legend>
                <div className="space-y-2">
                  {documentTypes.map(({ type, label }) => (
                    <label key={type} className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={selectedDocTypes.includes(type)}
                        onChange={() => toggleRequestedDoc(type)}
                        className="h-4 w-4 accent-[#2563EB]"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </fieldset>

              {actionError && <p role="alert" className="text-sm text-red-700">{actionError}</p>}

              <div className="flex flex-wrap justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={activeAction !== null}
                  onClick={() => setShowRequestInfoModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={activeAction !== null || infoMessage.trim().length < 10 || selectedDocTypes.length === 0}
                >
                  {activeAction === 'request-info' ? 'Sending...' : 'Send request'}
                </Button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
