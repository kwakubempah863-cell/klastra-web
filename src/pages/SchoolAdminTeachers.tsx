import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import logoMark from '../imports/logo-mark.png';
import { listSchoolTeachers } from '../services/schoolInvites';

type Teacher = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string | null;
  verificationStatus: 'pending' | 'approved' | 'rejected' | null;
};

const statusStyles: Record<NonNullable<Teacher['verificationStatus']>, string> = {
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-700',
};

function statusLabel(verificationStatus: Teacher['verificationStatus']) {
  if (verificationStatus === 'approved') return 'Approved';
  if (verificationStatus === 'rejected') return 'Rejected';
  if (verificationStatus === 'pending') return 'Pending';
  return 'No verification';
}

export default function SchoolAdminTeachers() {
  const navigate = useNavigate();
  const { profile, loading: authLoading } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

    void listSchoolTeachers()
      .then((data) => {
        if (!cancelled) setTeachers(data);
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
  }, [authLoading, navigate, profile]);

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
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Link to="/school-admin" className="flex items-center gap-3">
            <img src={logoMark} alt="" className="h-10 w-10" />
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

      <div className="mx-auto max-w-4xl px-6 py-10">
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

        {isLoading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-500">
            Loading teachers...
          </div>
        ) : teachers.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center sm:p-10">
            <h2 className="text-lg font-bold text-slate-900">No teachers yet</h2>
            <p className="mt-3 text-sm text-slate-600">Generate an invite to get started.</p>
            <Link to="/school-admin/teachers/invite" className="mt-5 inline-block">
              <Button variant="primary">Invite teacher</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {teachers.map((teacher) => {
              const fullName = [teacher.firstName, teacher.lastName].filter(Boolean).join(' ').trim() || 'Teacher';
              const badge = teacher.verificationStatus ? statusStyles[teacher.verificationStatus] : 'bg-slate-100 text-slate-700';

              return (
                <div key={teacher.userId} className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#102A43] text-sm font-bold text-white">
                      {fullName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-slate-900">{fullName}</p>
                      <p className="text-sm text-slate-600">{teacher.email || 'No email on file'}</p>
                    </div>
                  </div>

                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${badge}`}>
                    {statusLabel(teacher.verificationStatus)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
