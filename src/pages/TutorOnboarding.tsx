import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { subjects } from '../data/subjects';
import {
  createTutorProfile,
  getMyAvailability,
  getMyDocuments,
  getMyTutorProfile,
  removeTutorDocument,
  setAvailability as saveAvailability,
  submitForVerification,
  updateTutorProfile,
  uploadTutorDocument,
} from '../services/tutorsService';
import type { AvailabilityDay, AvailabilityInput, TutorDocumentType } from '../services/tutorsService';

const steps = ['Profile', 'Availability', 'Documents', 'Review & Submit'];
const days: AvailabilityDay[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const languages = ['English', 'Twi', 'Ga', 'Ewe', 'French'];
const documentTypes: { id: TutorDocumentType; label: string; required: boolean }[] = [
  { id: 'national_id', label: 'National ID', required: true },
  { id: 'academic_certificate', label: 'Academic Certificate', required: true },
  { id: 'teaching_certificate', label: 'Teaching Certificate', required: false },
];

type TutorDocument = {
  document_type: TutorDocumentType;
  file_name: string;
  storage_path: string;
  status: string;
};

function initialAvailability(): AvailabilityInput[] {
  return days.map(day => ({ day, enabled: false, start_time: '16:00', end_time: '20:00' }));
}

function documentMap(rows: TutorDocument[]) {
  const documents: Partial<Record<TutorDocumentType, TutorDocument>> = {};
  for (const row of rows) documents[row.document_type] = row;
  return documents;
}

function subjectId(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function TutorOnboarding() {
  const navigate = useNavigate();
  const { profile, loading: authLoading, refresh } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [hasTutorProfile, setHasTutorProfile] = useState(false);
  const [bio, setBio] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [rate, setRate] = useState('80');
  const [location, setLocation] = useState('Kumasi, Ghana');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['English']);
  const [availability, setAvailability] = useState<AvailabilityInput[]>(initialAvailability);
  const [documents, setDocuments] = useState<Partial<Record<TutorDocumentType, TutorDocument>>>({});
  const [uploadingType, setUploadingType] = useState<TutorDocumentType | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (profile?.role !== 'tutor') {
      navigate('/', { replace: true });
      return;
    }

    let cancelled = false;
    setLoading(true);
    Promise.all([getMyTutorProfile(), getMyDocuments(), getMyAvailability()])
      .then(([tutor, tutorDocuments, savedAvailability]) => {
        if (cancelled) return;
        if (tutor) {
          setHasTutorProfile(true);
          setBio(tutor.bio ?? '');
          setQualifications(tutor.qualifications ?? '');
          setSelectedSubjects(tutor.subject_names ?? []);
          setRate(String(tutor.rate ?? 80));
          setLocation(tutor.location ?? 'Kumasi, Ghana');
          setSelectedLanguages(tutor.languages ?? []);
        }
        setDocuments(documentMap(tutorDocuments as TutorDocument[]));
        const byDay = new Map((savedAvailability as AvailabilityInput[]).map(row => [row.day, row]));
        setAvailability(initialAvailability().map(row => ({ ...row, ...byDay.get(row.day) })));
      })
      .catch(loadError => {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : 'Unable to load your tutor profile.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, profile?.role, navigate]);

  const toggleSubject = (name: string) => {
    setSelectedSubjects(current => current.includes(name)
      ? current.filter(subject => subject !== name)
      : current.length < 5 ? [...current, name] : current);
  };

  const toggleLanguage = (language: string) => {
    setSelectedLanguages(current => current.includes(language)
      ? current.filter(item => item !== language)
      : [...current, language]);
  };

  const setDay = (day: AvailabilityDay, patch: Partial<AvailabilityInput>) => {
    setAvailability(current => current.map(row => row.day === day ? { ...row, ...patch } : row));
  };

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (bio.trim().length < 80) {
      setError('Your bio must be at least 80 characters.');
      return;
    }
    if (selectedSubjects.length === 0) {
      setError('Choose at least one subject.');
      return;
    }
    const hourlyRate = Number(rate);
    if (!Number.isFinite(hourlyRate) || hourlyRate < 20 || hourlyRate > 500) {
      setError('Hourly rate must be between GH₵20 and GH₵500.');
      return;
    }

    const input = {
      bio: bio.trim(),
      qualifications: qualifications.trim(),
      subject_ids: selectedSubjects.map(subjectId),
      subject_names: selectedSubjects,
      rate: hourlyRate,
      location: location.trim(),
      languages: selectedLanguages,
    };

    setSaving(true);
    try {
      if (hasTutorProfile) await updateTutorProfile(input);
      else {
        await createTutorProfile(input);
        setHasTutorProfile(true);
      }
      setStep(2);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save your profile.');
    } finally {
      setSaving(false);
    }
  };

  const saveAvailabilityStep = async () => {
    setError(null);
    setSaving(true);
    try {
      await saveAvailability(availability.map(row => ({
        ...row,
        start_time: row.enabled ? row.start_time : null,
        end_time: row.enabled ? row.end_time : null,
      })));
      setStep(3);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save availability.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (type: TutorDocumentType, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
      setError('Choose a JPG, PNG, or PDF file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Each document must be 10 MB or smaller.');
      return;
    }

    setError(null);
    setUploadingType(type);
    try {
      await uploadTutorDocument(type, file);
      setDocuments(documentMap(await getMyDocuments() as TutorDocument[]));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Unable to upload this document.');
    } finally {
      setUploadingType(null);
    }
  };

  const handleRemove = async (type: TutorDocumentType) => {
    setError(null);
    setSaving(true);
    try {
      await removeTutorDocument(type);
      setDocuments(current => ({ ...current, [type]: undefined }));
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : 'Unable to remove this document.');
    } finally {
      setSaving(false);
    }
  };

  const submit = async () => {
    setError(null);
    setSaving(true);
    try {
      await submitForVerification();
      await refresh();
      setSubmitted(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to submit your application.');
    } finally {
      setSaving(false);
    }
  };

  const requiredDocumentsUploaded = Boolean(documents.national_id && documents.academic_certificate);
  const enabledDays = availability.filter(day => day.enabled);

  if (authLoading || loading) {
    return <div className="min-h-full flex items-center justify-center p-8 text-sm text-slate-500">Loading your tutor profile...</div>;
  }
  if (profile?.role !== 'tutor') return null;

  if (submitted) {
    return (
      <div className="fade-in min-h-full flex items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center card-shadow">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-4xl font-bold text-emerald-600">✓</div>
          <h1 className="text-2xl font-bold font-display text-slate-900">Application submitted!</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">We'll review your profile within 24-48 hours. You'll receive an email once approved.</p>
          <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#1b3d7e] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#152e61]">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in min-h-full bg-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold font-display text-slate-900">Tutor onboarding</h1>
          <p className="mt-1 text-sm text-slate-500">Complete your profile to start teaching on TutorKonnect.</p>
        </div>

        <ol className="mb-8 grid grid-cols-4 gap-2" aria-label="Onboarding steps">
          {steps.map((label, index) => {
            const number = index + 1;
            const active = step === number;
            const complete = step > number;
            return (
              <li key={label} className="min-w-0">
                <div className={`mb-2 h-1 rounded-full ${complete || active ? 'bg-[#1b3d7e]' : 'bg-slate-200'}`} />
                <div className={`flex items-center gap-1.5 text-xs sm:text-sm ${active ? 'font-semibold text-[#1b3d7e]' : complete ? 'text-slate-700' : 'text-slate-400'}`}>
                  <span className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs ${complete ? 'bg-[#1b3d7e] text-white' : active ? 'border border-[#1b3d7e] bg-white' : 'bg-slate-100'}`}>{complete ? '✓' : number}</span>
                  <span className="truncate">{label}</span>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="rounded-2xl bg-white p-5 card-shadow sm:p-7">
          {error && <p role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          {step === 1 && (
            <form onSubmit={saveProfile} className="space-y-5">
              <div>
                <label htmlFor="tutor-bio" className="mb-1.5 block text-sm font-semibold text-slate-700">Bio</label>
                <textarea id="tutor-bio" value={bio} onChange={event => setBio(event.target.value.slice(0, 500))} minLength={80} maxLength={500} required rows={5} className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#1b3d7e] focus:ring-2 focus:ring-[#1b3d7e]/20" placeholder="Tell students about your teaching experience and approach..." />
                <p className={`mt-1 text-right text-xs ${bio.length < 80 ? 'text-slate-400' : 'text-slate-500'}`}>{bio.length}/500 (minimum 80)</p>
              </div>

              <fieldset>
                <legend className="mb-2 text-sm font-semibold text-slate-700">Subjects <span className="font-normal text-slate-400">Choose up to 5</span></legend>
                <div className="flex flex-wrap gap-2">
                  {subjects.map(subject => {
                    const selected = selectedSubjects.includes(subject.name);
                    return (
                      <button key={subject.id} type="button" aria-pressed={selected} disabled={!selected && selectedSubjects.length >= 5} onClick={() => toggleSubject(subject.name)} className={`rounded-lg border px-3 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${selected ? 'border-[#1b3d7e] bg-[#eef2fb] font-semibold text-[#1b3d7e]' : 'border-slate-200 text-slate-600 hover:border-slate-400'}`}>
                        {subject.name}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="tutor-qualifications" className="mb-1.5 block text-sm font-semibold text-slate-700">Qualifications</label>
                  <input id="tutor-qualifications" value={qualifications} onChange={event => setQualifications(event.target.value)} required className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#1b3d7e] focus:ring-2 focus:ring-[#1b3d7e]/20" placeholder="e.g. BSc Mathematics, KNUST" />
                </div>
                <div>
                  <label htmlFor="tutor-rate" className="mb-1.5 block text-sm font-semibold text-slate-700">Hourly rate (GH₵)</label>
                  <input id="tutor-rate" type="number" min={20} max={500} step={1} value={rate} onChange={event => setRate(event.target.value)} required className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#1b3d7e] focus:ring-2 focus:ring-[#1b3d7e]/20" />
                </div>
                <div>
                  <label htmlFor="tutor-location" className="mb-1.5 block text-sm font-semibold text-slate-700">Location</label>
                  <input id="tutor-location" value={location} onChange={event => setLocation(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#1b3d7e] focus:ring-2 focus:ring-[#1b3d7e]/20" />
                </div>
              </div>

              <fieldset>
                <legend className="mb-2 text-sm font-semibold text-slate-700">Languages</legend>
                <div className="flex flex-wrap gap-2">
                  {languages.map(language => {
                    const selected = selectedLanguages.includes(language);
                    return <button key={language} type="button" aria-pressed={selected} onClick={() => toggleLanguage(language)} className={`rounded-full border px-3 py-1.5 text-sm ${selected ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-600 hover:border-slate-400'}`}>{language}</button>;
                  })}
                </div>
              </fieldset>

              <div className="flex justify-end border-t border-slate-100 pt-5">
                <button type="submit" disabled={saving} className="rounded-xl bg-[#1b3d7e] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#152e61] disabled:opacity-60">{saving ? 'Saving...' : 'Save & Continue'}</button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div>
              <div className="mb-5 flex flex-wrap gap-2">
                <button type="button" onClick={() => setAvailability(current => current.map(row => ({ ...row, enabled: days.indexOf(row.day) < 5 })))} className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">Weekdays</button>
                <button type="button" onClick={() => setAvailability(current => current.map(row => ({ ...row, enabled: days.indexOf(row.day) >= 5 })))} className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">Weekends</button>
                <button type="button" onClick={() => setAvailability(initialAvailability())} className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">Clear</button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {availability.map(row => (
                  <div key={row.day} className="rounded-xl border border-slate-200 p-4">
                    <label className="mb-3 flex cursor-pointer items-center justify-between">
                      <span className="font-semibold text-slate-800">{row.day}</span>
                      <input type="checkbox" checked={row.enabled} onChange={event => setDay(row.day, { enabled: event.target.checked })} className="h-4 w-4 rounded accent-[#1b3d7e]" aria-label={`${row.day} available`} />
                    </label>
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                      <input type="time" aria-label={`${row.day} start time`} value={row.start_time ?? ''} disabled={!row.enabled} onChange={event => setDay(row.day, { start_time: event.target.value })} className="min-w-0 rounded-lg border border-slate-200 px-2 py-2 text-sm disabled:bg-slate-50 disabled:text-slate-400" />
                      <span className="text-xs text-slate-400">to</span>
                      <input type="time" aria-label={`${row.day} end time`} value={row.end_time ?? ''} disabled={!row.enabled} onChange={event => setDay(row.day, { end_time: event.target.value })} className="min-w-0 rounded-lg border border-slate-200 px-2 py-2 text-sm disabled:bg-slate-50 disabled:text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-between border-t border-slate-100 pt-5">
                <button type="button" onClick={() => setStep(1)} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Back</button>
                <button type="button" disabled={saving} onClick={() => void saveAvailabilityStep()} className="rounded-xl bg-[#1b3d7e] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#152e61] disabled:opacity-60">{saving ? 'Saving...' : 'Save & Continue'}</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="space-y-3">
                {documentTypes.map(documentType => {
                  const uploaded = documents[documentType.id];
                  return (
                    <section key={documentType.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <h2 className="text-sm font-semibold text-slate-900">{documentType.label}{documentType.required && <span className="ml-1 text-red-500">*</span>}</h2>
                        {uploaded ? (
                          <p className="mt-1 truncate text-sm text-emerald-700">✓ {uploaded.file_name}</p>
                        ) : (
                          <p className="mt-1 text-xs text-slate-500">JPG, PNG, or PDF, up to 10 MB</p>
                        )}
                      </div>
                      <div className="flex flex-shrink-0 items-center gap-2">
                        {uploaded && <button type="button" disabled={saving} onClick={() => void handleRemove(documentType.id)} className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60">Remove</button>}
                        <label className="inline-flex cursor-pointer items-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                          {uploadingType === documentType.id ? 'Uploading...' : uploaded ? 'Replace' : 'Upload'}
                          <input type="file" accept="image/jpeg,image/png,application/pdf" className="sr-only" disabled={uploadingType !== null} onChange={event => void handleUpload(documentType.id, event)} />
                        </label>
                      </div>
                    </section>
                  );
                })}
              </div>
              {!requiredDocumentsUploaded && <p className="mt-4 text-xs text-slate-500">National ID and Academic Certificate are required to continue.</p>}
              <div className="mt-6 flex justify-between border-t border-slate-100 pt-5">
                <button type="button" onClick={() => setStep(2)} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Back</button>
                <button type="button" disabled={!requiredDocumentsUploaded} onClick={() => { setError(null); setStep(4); }} className="rounded-xl bg-[#1b3d7e] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#152e61] disabled:cursor-not-allowed disabled:opacity-50">Continue</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <section className="rounded-xl border border-slate-200 p-4">
                <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold text-slate-900">Profile</h2><button type="button" onClick={() => setStep(1)} className="text-sm font-semibold text-[#1b3d7e] hover:underline">Edit</button></div>
                <p className="text-sm font-medium text-slate-800">{profile?.first_name} {profile?.last_name}</p>
                <p className="mt-1 text-sm text-slate-600">{qualifications}</p>
                <p className="mt-1 text-sm text-slate-600">{selectedSubjects.join(', ')} · GH₵{rate}/hr</p>
                <p className="mt-1 text-sm text-slate-600">{location} · {selectedLanguages.join(', ') || 'No languages selected'}</p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-500">{bio}</p>
              </section>

              <section className="rounded-xl border border-slate-200 p-4">
                <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold text-slate-900">Availability</h2><button type="button" onClick={() => setStep(2)} className="text-sm font-semibold text-[#1b3d7e] hover:underline">Edit</button></div>
                {enabledDays.length > 0 ? <ul className="space-y-1 text-sm text-slate-600">{enabledDays.map(day => <li key={day.day}>{day.day}: {day.start_time}–{day.end_time}</li>)}</ul> : <p className="text-sm text-slate-500">No days selected</p>}
              </section>

              <section className="rounded-xl border border-slate-200 p-4">
                <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold text-slate-900">Documents</h2><button type="button" onClick={() => setStep(3)} className="text-sm font-semibold text-[#1b3d7e] hover:underline">Edit</button></div>
                <ul className="space-y-1 text-sm text-slate-600">
                  {documentTypes.map(type => <li key={type.id}>{type.label}: {documents[type.id]?.file_name ?? (type.required ? 'Missing' : 'Not provided')}</li>)}
                </ul>
              </section>

              <div className="flex justify-between border-t border-slate-100 pt-5">
                <button type="button" onClick={() => setStep(3)} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Back</button>
                <button type="button" disabled={saving} onClick={() => void submit()} className="rounded-xl bg-[#1b3d7e] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#152e61] disabled:opacity-60">{saving ? 'Submitting...' : 'Submit for verification'}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}