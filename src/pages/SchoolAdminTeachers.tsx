import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import logoMark from '../imports/logo-mark.png';
import {
  deactivateTeacher,
  listDeactivatedTeachers,
  listSchoolTeachers,
  reactivateTeacher,
  type SchoolTeacher,
} from '../services/schoolInvites';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const statusStyles: Record<NonNullable<SchoolTeacher['verificationStatus']>, string> = {
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-700',
};

function statusLabel(verificationStatus: SchoolTeacher['verificationStatus']) {
  if (verificationStatus === 'approved') return 'Approved';
  if (verificationStatus === 'rejected') return 'Rejected';
  if (verificationStatus === 'pending') return 'Pending';
  return 'No verification';
}

export default function SchoolAdminTeachers() {
  useDocumentTitle('Teachers — Klastra');
  const navigate = useNavigate();
  const { profile, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'active' | 'deactivated'>('active');
  const [teachers, setTeachers] = useState<SchoolTeacher[]>([]);
  const [deactivatedTeachers, setDeactivatedTeachers] = useState<SchoolTeacher[]>([]);
  const [teacherToRemove, setTeacherToRemove] = useState<SchoolTeacher | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);
  const [reactivatingUserId, setReactivatingUserId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!profile) {
      navigate('/login', { replace: true });
      return;
    }
    if (profile.role !== 'admin') {
      navigate('/', { replace: true });
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError('');

    const loadTeachers = activeTab === 'active' ? listSchoolTeachers : listDeactivatedTeachers;

    void loadTeachers()
      .then((data) => {
        if (!cancelled) {
          if (activeTab === 'active') setTeachers(data);
          else setDeactivatedTeachers(data);
        }
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load teachers.');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab, authLoading, navigate, profile]);

  const handleRemoveTeacher = async () => {
    if (!teacherToRemove) return;

    setIsRemoving(true);
    setError('');
    try {
      await deactivateTeacher(teacherToRemove.userId);
      const deactivated = { ...teacherToRemove, deactivatedAt: new Date().toISOString() };
      setTeachers((current) => current.filter((teacher) => teacher.userId !== deactivated.userId));
      setDeactivatedTeachers((current) => [deactivated, ...current]);
      setTeacherToRemove(null);
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : 'Unable to remove this teacher.');
    } finally {
      setIsRemoving(false);
    }
  };

  const handleReactivateTeacher = async (teacher: SchoolTeacher) => {
    setReactivatingUserId(teacher.userId);
    setError('');
    try {
      await reactivateTeacher(teacher.userId);
      setDeactivatedTeachers((current) => current.filter((item) => item.userId !== teacher.userId));
      setTeachers((current) => [{ ...teacher, deactivatedAt: null }, ...current]);
    } catch (reactivateError) {
      setError(reactivateError instanceof Error ? reactivateError.message : 'Unable to reactivate this teacher.');
    } finally {
      setReactivatingUserId(null);
    }
  };

  if (authLoading || !profile || profile.role !== 'admin') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        Checking your school account...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6">
          <Link to="/school-admin" className="flex items-center gap-3">
            <img src={logoMark} alt="Klastra" className="h-10 w-10" />
            <span className="text-lg font-black text-slate-900">Klastra</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-600 sm:inline">{profile.email}</span>
            <Link to="/school-admin/teachers/invite">
              <Button variant="primary" size="sm">Invite teacher</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5 py-8 sm:px-6 sm:py-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2563EB]">School admin</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">Teachers</h1>
          </div>
          <Link to="/school-admin/teachers/invite">
            <Button variant="primary" size="lg">Invite teacher</Button>
          </Link>
        </div>

        {error && (
          <div role="alert" className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div role="tablist" aria-label="Teacher status" className="mb-5 flex gap-2">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'active'}
            onClick={() => setActiveTab('active')}
            className={`min-h-11 rounded-xl px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 ${
              activeTab === 'active' ? 'bg-[#102A43] text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            Active
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'deactivated'}
            onClick={() => setActiveTab('deactivated')}
            className={`min-h-11 rounded-xl px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 ${
              activeTab === 'deactivated' ? 'bg-[#102A43] text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            Deactivated
          </button>
        </div>

        {isLoading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-500">
            Loading teachers...
          </div>
        ) : !error && (activeTab === 'active' ? teachers : deactivatedTeachers).length === 0 ? (
          activeTab === 'active' ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 text-center sm:p-8 md:p-10">
              <h2 className="text-lg font-bold text-slate-900">No teachers yet</h2>
              <p className="mt-3 text-sm text-slate-600">Generate an invite to get started.</p>
              <Link to="/school-admin/teachers/invite" className="mt-5 inline-block">
                <Button variant="primary">Invite teacher</Button>
              </Link>
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 text-center sm:p-8 md:p-10">
              <h2 className="text-lg font-bold text-slate-900">No deactivated teachers.</h2>
            </div>
          )
        ) : !error && (
          <div role="tabpanel" className="space-y-4">
            {(activeTab === 'active' ? teachers : deactivatedTeachers).map((teacher) => {
              const fullName = [teacher.firstName, teacher.lastName].filter(Boolean).join(' ').trim() || 'Teacher';
              const badge = teacher.verificationStatus ? statusStyles[teacher.verificationStatus] : 'bg-slate-100 text-slate-700';

              return (
                <div key={teacher.userId} className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#102A43] text-sm font-bold text-white">
                      {fullName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="break-words text-base font-semibold text-slate-900">{fullName}</p>
                      <p className="break-all text-sm text-slate-600">{teacher.email || 'No email on file'}</p>
                      {activeTab === 'deactivated' && (
                        <p className="mt-1 text-xs text-slate-500">
                          Deactivated {teacher.deactivatedAt ? new Date(teacher.deactivatedAt).toLocaleDateString() : ''}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${badge}`}>
                      {statusLabel(teacher.verificationStatus)}
                    </span>
                    {activeTab === 'active' ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setTeacherToRemove(teacher)}
                        aria-label={`Remove ${fullName}`}
                      >
                        Remove
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => void handleReactivateTeacher(teacher)}
                        disabled={reactivatingUserId !== null}
                        aria-label={`Reactivate ${fullName}`}
                      >
                        {reactivatingUserId === teacher.userId ? 'Reactivating...' : 'Reactivate'}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {teacherToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="remove-teacher-title"
            aria-describedby="remove-teacher-description"
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl"
          >
            <h2 id="remove-teacher-title" className="text-xl font-bold text-slate-900">Remove teacher?</h2>
            <p id="remove-teacher-description" className="mt-3 text-sm leading-6 text-slate-600">
              Remove { [teacherToRemove.firstName, teacherToRemove.lastName].filter(Boolean).join(' ').trim() || 'this teacher' } from your school? They will lose access to the mobile app immediately. You can reactivate them later.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button variant="secondary" onClick={() => setTeacherToRemove(null)} disabled={isRemoving}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => void handleRemoveTeacher()} disabled={isRemoving}>
                {isRemoving ? 'Removing...' : 'Remove teacher'}
              </Button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
