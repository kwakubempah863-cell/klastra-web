import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { getMySchoolRequest } from '../services/schoolRequests';

type SchoolRequestDocuments = {
  registration_certificate_url: string | null;
  headmaster_id_url: string | null;
};

export default function RegisterPending() {
  const navigate = useNavigate();
  const { profile, loading: authLoading } = useAuth();
  const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ').trim();
  const [hasRequiredDocuments, setHasRequiredDocuments] = useState(false);
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
        const documents = request as SchoolRequestDocuments | null;
        setHasRequiredDocuments(Boolean(
          documents?.registration_certificate_url && documents.headmaster_id_url,
        ));
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

  return (
    <main className="mesh-bg min-h-[60vh] px-6 py-16">
      <section className="glass-medium mx-auto max-w-xl rounded-3xl border p-8 text-center sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#ECFDF5] text-4xl" aria-hidden="true">✓</div>
        <h1 className="mt-6 text-3xl font-black text-slate-900">
          {hasRequiredDocuments ? 'Your application is under review' : 'Application received'}
        </h1>
        {hasRequiredDocuments ? (
          <p className="mt-4 text-base leading-relaxed text-slate-600">We&apos;ll be in touch within 24 hours.</p>
        ) : (
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Thank you{fullName ? `, ${fullName}` : " — we've received your application"}. We&apos;ll review your school within 24 hours. In the meantime, upload your verification documents to speed up the process.
          </p>
        )}
        {requestError && <p role="alert" className="mt-4 text-sm text-red-600">{requestError}</p>}
        <div className="mt-8 space-y-4">
          {!isLoadingRequest && !hasRequiredDocuments && (
            <Button variant="primary" size="lg" fullWidth onClick={() => navigate('/register/documents')}>
              Upload documents
            </Button>
          )}
          <Link to="/" className="inline-block text-sm font-semibold text-[#2563EB] hover:underline">Return to home</Link>
        </div>
      </section>
    </main>
  );
}
