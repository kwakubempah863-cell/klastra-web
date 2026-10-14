import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AccessibleDialog from '../components/AccessibleDialog';
import { Button } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import {
  createClass,
  listClasses,
  listDeactivatedClasses,
  deactivateClass,
  listSchoolTeachers,
  reactivateClass,
  type ClassRow,
  type SchoolTeacherOption,
} from '../services/classes';

type ClassTab = 'active' | 'deactivated';
type ClassStatusAction = 'deactivate' | 'reactivate';

type ClassForm = {
  name: string;
  level: string;
  academicYear: string;
  teacherId: string;
};

const emptyForm: ClassForm = { name: '', level: '', academicYear: '', teacherId: '' };

function teacherDisplayName(teacher: SchoolTeacherOption) {
  return [teacher.firstName, teacher.lastName].filter(Boolean).join(' ').trim() || teacher.email || 'Teacher';
}

export default function SchoolAdminClasses() {
  useDocumentTitle('Classes — Klastra');
  const navigate = useNavigate();
  const { profile, loading: authLoading } = useAuth();
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [deactivatedClasses, setDeactivatedClasses] = useState<ClassRow[]>([]);
  const [teachers, setTeachers] = useState<SchoolTeacherOption[]>([]);
  const [activeTab, setActiveTab] = useState<ClassTab>('active');
  const [classToChange, setClassToChange] = useState<{ schoolClass: ClassRow; action: ClassStatusAction } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [error, setError] = useState('');
  const [dialogError, setDialogError] = useState('');
  const [form, setForm] = useState<ClassForm>(emptyForm);

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
    const loadClasses = activeTab === 'active' ? listClasses : listDeactivatedClasses;
    void loadClasses()
      .then((data) => {
        if (cancelled) return;
        if (activeTab === 'active') setClasses(data);
        else setDeactivatedClasses(data);
      })
      .catch((loadError: unknown) => {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : 'Unable to load classes.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab, authLoading, navigate, profile]);

  const openCreateDialog = async () => {
    setForm(emptyForm);
    setDialogError('');
    setIsCreateOpen(true);
    setIsLoadingTeachers(true);
    try {
      setTeachers(await listSchoolTeachers());
    } catch (teacherError) {
      setDialogError(teacherError instanceof Error ? teacherError.message : 'Unable to load teachers.');
    } finally {
      setIsLoadingTeachers(false);
    }
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setDialogError('');
    try {
      const created = await createClass({
        name: form.name,
        level: form.level,
        academicYear: form.academicYear,
        teacherId: form.teacherId || null,
      });
      setClasses((current) => [...current, created].sort((a, b) => a.name.localeCompare(b.name)));
      setActiveTab('active');
      setIsCreateOpen(false);
    } catch (createError) {
      setDialogError(createError instanceof Error ? createError.message : 'Unable to create this class.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClassStatusChange = async () => {
    if (!classToChange) return;
    setIsSaving(true);
    setError('');
    try {
      const { schoolClass, action } = classToChange;
      if (action === 'deactivate') {
        await deactivateClass(schoolClass.id);
        setClasses((current) => current.filter((item) => item.id !== schoolClass.id));
        setDeactivatedClasses((current) => [...current, schoolClass].sort((a, b) => a.name.localeCompare(b.name)));
      } else {
        await reactivateClass(schoolClass.id);
        setDeactivatedClasses((current) => current.filter((item) => item.id !== schoolClass.id));
        setClasses((current) => [...current, schoolClass].sort((a, b) => a.name.localeCompare(b.name)));
      }
      setClassToChange(null);
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : 'Unable to update this class.');
      setClassToChange(null);
    } finally {
      setIsSaving(false);
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
          <Link to="/school-admin" className="text-sm font-semibold text-[#2563EB] hover:underline">← Back to school</Link>
          <Button variant="primary" size="sm" onClick={() => void openCreateDialog()} aria-label="Create new class">
            + New class
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5 py-8 sm:px-6 sm:py-10">
        <h1 className="mb-6 text-3xl font-black text-slate-900">Classes</h1>
        {error && <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <div role="tablist" aria-label="Class status" className="mb-5 flex gap-2">
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
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading classes...</div>
        ) : (activeTab === 'active' ? classes : deactivatedClasses).length === 0 ? (
          activeTab === 'active' ? (
            <section className="rounded-3xl border border-slate-200 bg-white px-5 py-10 text-center sm:px-8">
              <h2 className="text-lg font-bold text-slate-900">No classes yet. Create your first class to get started.</h2>
              <Button variant="primary" className="mt-5" onClick={() => void openCreateDialog()} aria-label="Create new class">
                + New class
              </Button>
            </section>
          ) : (
            <section className="rounded-3xl border border-slate-200 bg-white px-5 py-10 text-center sm:px-8">
              <h2 className="text-lg font-bold text-slate-900">No deactivated classes.</h2>
            </section>
          )
        ) : (
          <div role="tabpanel" className="space-y-3">
            {(activeTab === 'active' ? classes : deactivatedClasses).map((schoolClass) => (
              <div key={schoolClass.id} className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <Link
                  to={`/school-admin/classes/${schoolClass.id}`}
                  aria-label={`Open ${schoolClass.name} class details`}
                  className="block min-w-0 flex-1 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="break-words text-lg font-bold text-slate-900">{schoolClass.name}</h2>
                      <p className="mt-1 text-sm text-slate-600">{schoolClass.level} · {schoolClass.academicYear}</p>
                      <p className="mt-3 text-sm text-slate-700">
                        <span className="font-semibold">Class teacher:</span> {schoolClass.teacherName || '(unassigned)'}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {schoolClass.studentCount} students · {schoolClass.subjectTeacherCount} subject {schoolClass.subjectTeacherCount === 1 ? 'teacher' : 'teachers'}
                      </p>
                    </div>
                    <span aria-hidden="true" className="mt-1 shrink-0 text-xl text-slate-400">→</span>
                  </div>
                </Link>
                <Button
                  type="button"
                  variant={activeTab === 'active' ? 'danger' : 'primary'}
                  size="sm"
                  onClick={() => setClassToChange({ schoolClass, action: activeTab === 'active' ? 'deactivate' : 'reactivate' })}
                >
                  {activeTab === 'active' ? 'Deactivate' : 'Reactivate'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {classToChange && (
        <AccessibleDialog
          title={`${classToChange.action === 'deactivate' ? 'Deactivate' : 'Reactivate'} ${classToChange.schoolClass.name}?`}
          titleId="class-status-title"
          onClose={() => setClassToChange(null)}
        >
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            {classToChange.action === 'deactivate'
              ? `Deactivate ${classToChange.schoolClass.name}? Teachers will lose access. Students remain enrolled and the class can be reactivated later.`
              : `Reactivate ${classToChange.schoolClass.name}? Teachers will regain access immediately.`}
          </p>
          {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setClassToChange(null)} disabled={isSaving}>Cancel</Button>
            <Button
              type="button"
              variant={classToChange.action === 'deactivate' ? 'danger' : 'primary'}
              onClick={() => void handleClassStatusChange()}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : classToChange.action === 'deactivate' ? 'Deactivate class' : 'Reactivate class'}
            </Button>
          </div>
        </AccessibleDialog>
      )}

      {isCreateOpen && (
        <AccessibleDialog title="Create new class" titleId="create-class-title" onClose={() => setIsCreateOpen(false)}>
          <form onSubmit={(event) => void handleCreate(event)} className="mt-5 space-y-4">
            <div>
              <label htmlFor="class-name" className="mb-1 block text-sm font-semibold text-slate-700">Class name</label>
              <input id="class-name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required maxLength={80} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]" />
            </div>
            <div>
              <label htmlFor="class-level" className="mb-1 block text-sm font-semibold text-slate-700">Level</label>
              <input id="class-level" value={form.level} onChange={(event) => setForm((current) => ({ ...current, level: event.target.value }))} required maxLength={40} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]" />
            </div>
            <div>
              <label htmlFor="class-academic-year" className="mb-1 block text-sm font-semibold text-slate-700">Academic year</label>
              <input id="class-academic-year" value={form.academicYear} onChange={(event) => setForm((current) => ({ ...current, academicYear: event.target.value }))} required maxLength={30} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]" />
            </div>
            <div>
              <label htmlFor="class-teacher" className="mb-1 block text-sm font-semibold text-slate-700">Class teacher (optional)</label>
              <select id="class-teacher" value={form.teacherId} onChange={(event) => setForm((current) => ({ ...current, teacherId: event.target.value }))} disabled={isLoadingTeachers} className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]">
                <option value="">Unassigned</option>
                {teachers.map((teacher) => <option key={teacher.userId} value={teacher.userId}>{teacherDisplayName(teacher)}</option>)}
              </select>
            </div>
            {dialogError && <p role="alert" className="text-sm text-red-700">{dialogError}</p>}
            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} disabled={isSaving}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={isSaving || isLoadingTeachers}>{isSaving ? 'Creating...' : 'Create class'}</Button>
            </div>
          </form>
        </AccessibleDialog>
      )}
    </main>
  );
}
