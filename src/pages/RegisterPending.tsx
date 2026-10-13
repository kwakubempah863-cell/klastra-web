import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { getMySchoolRequest } from '../services/schoolRequests';

type RequestedDocumentType = 'registration_certificate' | 'headmaster_id' | 'headmaster_appointment';
type SchoolRequestStatus = 'pending' | 'awaiting_review' | 'needs_info' | 'approved' | 'rejected';

type SchoolRequestDetails = {
  registration_certificate_url: string | null;
  headmaster_id_url: string | null;
  status: SchoolRequestStatus;
  reviewer_notes: string | null;
  requested_docs: RequestedDocumentType[] | null;
};

const requestedDocumentLabels: Record<RequestedDocumentType, string> = {
  registration_certificate: 'School registration certificate',
  headmaster_id: 'Headmaster national ID',
  headmaster_appointment: 'Headmaster appointment letter',
};

export default function RegisterPending() {
  const navigate = useNavigate();
  const { profile, loading: authLoading } = useAuth();
  const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ').trim();
  const [schoolRequest, setSchoolRequest] = useState<SchoolRequestDetails | null>(null);
  const [isLoadingRequest, setIsLoadingRequest] = useState(true);
  const [requestError, setRequestError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!profile?.id) {
      setIsLoadingRequest(false);
      return;
    }

    let cancelled = false;
    getMySchoolRequest(profile.id)
      .then((request) => {
        if (cancelled) return;
        setSchoolRequest(request as SchoolRequestDetails | null);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setRequestError(error instanceof Error ? error.message : 'Unable to check your application status.');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoadingRequest(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, profile?.id]);

  const needsInfo = schoolRequest?.status === 'needs_info';
  const underReview = schoolRequest?.status === 'awaiting_review' || schoolRequest?.status === 'approved';
  const requestedDocuments = ((schoolRequest?.requested_docs ?? []) as string[])
    .filter((docType): docType is RequestedDocumentType => docType in requestedDocumentLabels);

  return (
    <main className="mesh-bg min-h-[60vh] px-6 py-16">
      <section className="glass-medium mx-auto max-w-xl rounded-3xl border p-8 text-center sm:p-12">
        {needsInfo ? (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-2xl text-amber-800" aria-hidden="true">!</div>
            <h1 className="mt-4 text-2xl font-black text-amber-950">More information needed</h1>
            <p className="mt-3 text-sm leading-relaxed text-amber-900">
              {schoolRequest.reviewer_notes || 'Please re-upload the requested documents below.'}
            </p>
            {requestedDocuments.length > 0 && (
              <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-amber-900">
                {requestedDocuments.map((docType) => <li key={docType}>{requestedDocumentLabels[docType]}</li>)}
              </ul>
            )}
          </div>
        ) : (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#ECFDF5] text-4xl" aria-hidden="true">✓</div>
            <h1 className="mt-6 text-3xl font-black text-slate-900">
              {underReview ? 'Your application is under review' : 'Application received'}
            </h1>
          </>
        )}
        {underReview ? (
          <p className="mt-4 text-base leading-relaxed text-slate-600">We&apos;ll be in touch within 24 hours.</p>
        ) : !needsInfo ? (
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Thank you{fullName ? `, ${fullName}` : " — we've received your application"}. We&apos;ll review your school within 24 hours. In the meantime, upload your verification documents to speed up the process.
          </p>
        ) : null}
        {requestError && <p role="alert" className="mt-4 text-sm text-red-600">{requestError}</p>}
        <div className="mt-8 space-y-4">
          {!isLoadingRequest && !underReview && (
            <Button variant="primary" size="lg" fullWidth onClick={() => navigate('/register/documents')}>
              {needsInfo ? 'Re-upload documents' : 'Upload documents'}
            </Button>
          )}
          {!isLoadingRequest && (
            <Link to="/school-admin" className="block text-sm font-semibold text-[#102A43] hover:underline">
              Go to your dashboard
            </Link>
          )}
          <Link to="/" className="inline-block text-sm font-semibold text-[#2563EB] hover:underline">Return to home</Link>
        </div>
      </section>
    </main>
  );
}
