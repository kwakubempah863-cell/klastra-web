import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import {
  getMySchoolRequest,
  updateSchoolRequestDocuments,
  uploadSchoolDocument,
} from '../services/schoolRequests';

type DocumentType = 'registration_certificate' | 'headmaster_id' | 'headmaster_appointment';
type DocumentField = `${DocumentType}_url`;
type DocumentStatus = 'idle' | 'uploading' | 'uploaded' | 'error';

type DocumentState = {
  status: DocumentStatus;
  path?: string;
  fileName?: string;
  error?: string;
};

type SchoolRequestDocuments = Partial<Record<DocumentField, string | null>>;

const documents: {
  type: DocumentType;
  field: DocumentField;
  title: string;
  description: string;
  required: boolean;
}[] = [
  {
    type: 'registration_certificate',
    field: 'registration_certificate_url',
    title: 'School registration certificate',
    description: "Ghana Education Service registration, or your school's official registration document.",
    required: true,
  },
  {
    type: 'headmaster_id',
    field: 'headmaster_id_url',
    title: 'Headmaster national ID',
    description: 'Your Ghana Card or other national ID.',
    required: true,
  },
  {
    type: 'headmaster_appointment',
    field: 'headmaster_appointment_url',
    title: 'Headmaster appointment letter',
    description: 'Official document naming you as head of the school.',
    required: false,
  },
];

const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
const maxFileSize = 10 * 1024 * 1024;
const emptyDocumentState: DocumentState = { status: 'idle' };

function fileNameFromPath(path: string) {
  return path.split('/').pop() || path;
}

function initialDocumentStates(request: SchoolRequestDocuments): Record<DocumentType, DocumentState> {
  return Object.fromEntries(documents.map(({ type, field }) => {
    const path = request[field];
    return [type, path
      ? { status: 'uploaded' as const, path, fileName: fileNameFromPath(path) }
      : emptyDocumentState];
  })) as Record<DocumentType, DocumentState>;
}

export default function RegisterDocuments() {
  const navigate = useNavigate();
  const { profile, loading: authLoading } = useAuth();
  const userId = profile?.id;
  const [loading, setLoading] = useState(true);
  const [documentsState, setDocumentsState] = useState<Record<DocumentType, DocumentState>>({
    registration_certificate: emptyDocumentState,
    headmaster_id: emptyDocumentState,
    headmaster_appointment: emptyDocumentState,
  });
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!userId) {
      navigate('/register', { replace: true });
      return;
    }

    let cancelled = false;
    setLoading(true);
    setLoadError('');
    getMySchoolRequest(userId)
      .then((request) => {
        if (cancelled) return;
        if (!request) {
          setLoadError('No school request was found for your account. Please register your school first.');
          return;
        }
        setDocumentsState(initialDocumentStates(request as SchoolRequestDocuments));
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : 'Unable to load your school documents.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, navigate, userId]);

  const handleUpload = async (type: DocumentType, field: DocumentField, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file || !userId) return;

    if (!allowedTypes.includes(file.type)) {
      setDocumentsState((current) => ({
        ...current,
        [type]: { ...current[type], status: 'error', error: 'Choose a JPG, PNG, or PDF file.' },
      }));
      return;
    }
    if (file.size > maxFileSize) {
      setDocumentsState((current) => ({
        ...current,
        [type]: { ...current[type], status: 'error', error: 'Each document must be 10 MB or smaller.' },
      }));
      return;
    }

    setDocumentsState((current) => ({
      ...current,
      [type]: { ...current[type], status: 'uploading', error: undefined },
    }));

    try {
      const { path } = await uploadSchoolDocument(userId, type, file);
      setDocumentsState((current) => ({
        ...current,
        [type]: { ...current[type], path, fileName: file.name },
      }));
      await updateSchoolRequestDocuments(userId, { [field]: path });
      setDocumentsState((current) => ({
        ...current,
        [type]: { status: 'uploaded', path, fileName: file.name },
      }));
    } catch (error) {
      setDocumentsState((current) => ({
        ...current,
        [type]: {
          ...current[type],
          status: 'error',
          error: error instanceof Error ? error.message : 'Unable to upload this document.',
        },
      }));
    }
  };

  const requiredDocumentsUploaded = documents
    .filter((document) => document.required)
    .every(({ type }) => documentsState[type].status === 'uploaded' && Boolean(documentsState[type].path));

  if (authLoading || loading) {
    return <main className="mesh-bg flex min-h-[60vh] items-center justify-center px-6 py-16 text-sm text-slate-500">Loading your school documents...</main>;
  }

  return (
    <main className="mesh-bg mx-auto max-w-5xl px-6 py-16">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-3xl bg-[#0F172A]">
          <div className="glass-dark h-full rounded-3xl p-8 text-white">
            <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-100">
              School verification
            </div>
            <h1 className="mt-5 text-3xl font-black md:text-4xl">Upload your verification documents</h1>
            <p className="mt-3 text-sm leading-relaxed text-sky-100/80">
              These documents help us verify your school and confirm your role. Upload the two required documents to submit your application for review.
            </p>
          </div>
        </section>

        <section className="glass-medium rounded-3xl border p-6 sm:p-8">
          <div className="space-y-4">
            {documents.map((document) => {
              const state = documentsState[document.type];
              const inputId = `document-${document.type}`;
              const isUploaded = state.status === 'uploaded' && Boolean(state.path);

              return (
                <article key={document.type} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-lg text-[#102A43]" aria-hidden="true">▤</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-bold text-slate-900">{document.title}</h2>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${document.required ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                          {document.required ? 'Required' : 'Optional'}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">{document.description}</p>
                      <p className="mt-2 text-xs text-slate-500">JPG, PNG, or PDF · Up to 10 MB</p>

                      {state.status === 'uploading' && <p className="mt-3 text-sm text-slate-600">Uploading...</p>}
                      {isUploaded && (
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                          <span className="font-semibold text-emerald-700" aria-label="Uploaded">✓</span>
                          <span className="min-w-0 truncate text-slate-700">{state.fileName}</span>
                        </div>
                      )}
                      {state.error && <p role="alert" className="mt-3 text-sm text-red-600">{state.error}</p>}

                      <label
                        htmlFor={inputId}
                        className={`mt-4 inline-flex min-h-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-[#102A43] hover:bg-slate-50 ${state.status === 'uploading' ? 'pointer-events-none opacity-50' : ''}`}
                      >
                        {state.status === 'uploading' ? 'Uploading...' : isUploaded ? 'Replace' : 'Choose file'}
                      </label>
                      <input
                        id={inputId}
                        type="file"
                        accept="image/jpeg,image/png,application/pdf"
                        className="sr-only"
                        disabled={state.status === 'uploading'}
                        onChange={(event) => void handleUpload(document.type, document.field, event)}
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {loadError && <p role="alert" className="mt-5 text-sm text-red-600">{loadError}</p>}

          <div className="mt-6">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={!requiredDocumentsUploaded || Boolean(loadError)}
              onClick={() => navigate('/register/pending')}
            >
              Submit for review
            </Button>
            {!requiredDocumentsUploaded && (
              <p className="mt-3 text-center text-xs text-slate-500">
                Both required documents are needed to submit your application.
              </p>
            )}
            {!requiredDocumentsUploaded && (
              <div className="mt-4 text-center">
                <Link to="/register/pending" className="text-sm font-semibold text-[#2563EB] hover:underline">Skip for now</Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
