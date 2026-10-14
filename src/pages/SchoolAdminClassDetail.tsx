import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AccessibleDialog from '../components/AccessibleDialog';
import { Button } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import {
  addClassSubjectTeacher,
  deactivateClass,
  createSubject,
  getClass,
  listClassSubjectTeachers,
  listSchoolSubjects,
  listSchoolTeachers,
  removeClassSubjectTeacher,
  updateClass,
  type ClassRow,
  type ClassSubjectTeacher,
  type SchoolSubject,
  type SchoolTeacherOption,
} from '../services/classes';

type DialogMode = 'class-teacher' | 'subject-teacher' | 'deactivate' | null;

function teacherDisplayName(teacher: SchoolTeacherOption) {
  return [teacher.firstName, teacher.lastName].filter(Boolean).join(' ').trim() || teacher.email || 'Teacher';
}

export default function SchoolAdminClassDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile, loading: authLoading } = useAuth();
  const [schoolClass, setSchoolClass] = useState<ClassRow | null>(null);
  const [teachers, setTeachers] = useState<SchoolTeacherOption[]>([]);
  const [subjects, setSubjects] = useState<SchoolSubject[]>([]);
  const [subjectTeachers, setSubjectTeachers] = useState<ClassSubjectTeacher[]>([]);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [isCreatingSubject, setIsCreatingSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [dialogError, setDialogError] = useState('');

  useDocumentTitle(`${schoolClass?.name ?? 'Class'} — Klastra`);

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
    if (!id) {
      setError('Class not found.');
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    void Promise.all([
      getClass(id),
      listSchoolTeachers(),
      listSchoolSubjects(),
      listClassSubjectTeachers(id),
    ])
      .then(([classData, teacherOptions, subjectOptions, assignments]) => {
        if (cancelled) return;
        if (!classData) {
          setError('Class not found in your school.');
          return;
        }
        setSchoolClass(classData);
        setTeachers(teacherOptions);
        setSubjects(subjectOptions);
        setSubjectTeachers(assignments);
      })
      .catch((loadError: unknown) => {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : 'Unable to load this class.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, id, navigate, profile]);

  const openDialog = (mode: DialogMode) => {
    setDialogError('');
    setSelectedTeacherId(mode === 'class-teacher' ? schoolClass?.teacherId ?? '' : '');
    setSelectedSubjectId('');
    setIsCreatingSubject(false);
    setNewSubjectName('');
    setDialogMode(mode);
  };

  const handleChangeClassTeacher = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!schoolClass) return;
    setSaving(true);
    setDialogError('');
    try {
      const teacherId = selectedTeacherId || null;
      await updateClass(schoolClass.id, { teacherId });
      const teacher = teachers.find((item) => item.userId === teacherId);
      setSchoolClass({
        ...schoolClass,
        teacherId,
        teacherName: teacher ? teacherDisplayName(teacher) : null,
      });
      setDialogMode(null);
    } catch (saveError) {
      setDialogError(saveError instanceof Error ? saveError.message : 'Unable to update the class teacher.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSubjectTeacher = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!schoolClass) return;
    setSaving(true);
    setDialogError('');
    try {
      let subjectId = selectedSubjectId;
      if (isCreatingSubject) {
        const createdSubject = await createSubject({ name: newSubjectName });
        subjectId = createdSubject.id;
        setSubjects((current) => [...current.filter((item) => item.id !== createdSubject.id), createdSubject]
          .sort((a, b) => a.name.localeCompare(b.name)));
        setSelectedSubjectId(createdSubject.id);
        setIsCreatingSubject(false);
        setNewSubjectName('');
      }
      await addClassSubjectTeacher({
        classId: schoolClass.id,
        teacherId: selectedTeacherId,
        subjectId,
      });
      setSubjectTeachers(await listClassSubjectTeachers(schoolClass.id));
      setSchoolClass(await getClass(schoolClass.id));
      setDialogMode(null);
    } catch (saveError) {
      setDialogError(saveError instanceof Error ? saveError.message : 'Unable to add the subject teacher.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveSubjectTeacher = async (assignment: ClassSubjectTeacher) => {
    setRemovingId(assignment.id);
    setError('');
    try {
      await removeClassSubjectTeacher(assignment.id);
      setSubjectTeachers((current) => current.filter((item) => item.id !== assignment.id));
      if (schoolClass) setSchoolClass(await getClass(schoolClass.id));
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : 'Unable to remove this subject teacher.');
    } finally {
      setRemovingId(null);
    }
  };

  const handleDeactivateClass = async () => {
    if (!schoolClass) return;
    setSaving(true);
    setDialogError('');
    try {
      await deactivateClass(schoolClass.id);
      navigate('/school-admin/classes', { replace: true });
    } catch (deactivateError) {
      setDialogError(deactivateError instanceof Error ? deactivateError.message : 'Unable to deactivate this class.');
      setSaving(false);
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
          <Link to="/school-admin/classes" className="text-sm font-semibold text-[#2563EB] hover:underline">← All classes</Link>
          {schoolClass && <span className="break-words text-sm font-semibold text-slate-700">{schoolClass.name}</span>}
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-5 px-5 py-8 sm:px-6 sm:py-10">
        {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading class...</div>
        ) : schoolClass ? (
          <>
            <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
              <h1 className="text-2xl font-black text-slate-900">{schoolClass.name}</h1>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Level</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">{schoolClass.level}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Academic year</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">{schoolClass.academicYear}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Class teacher</p>
                  <div className="mt-1 flex flex-wrap items-center gap-3">
                    <span className="text-sm font-medium text-slate-800">{schoolClass.teacherName || '(unassigned)'}</span>
                    <Button type="button" variant="outline" size="sm" onClick={() => openDialog('class-teacher')}>Change</Button>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Students</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">{schoolClass.studentCount}</p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Subject teachers</h2>
                  <p className="mt-1 text-sm text-slate-500">{subjectTeachers.length} assignments</p>
                </div>
                <Button type="button" variant="primary" size="sm" onClick={() => openDialog('subject-teacher')}>+ Add</Button>
              </div>

              {subjectTeachers.length === 0 ? (
                <p className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">No subject teachers yet.</p>
              ) : (
                <ul className="mt-4 divide-y divide-slate-100">
                  {subjectTeachers.map((assignment) => (
                    <li key={assignment.id} className="flex min-w-0 items-center justify-between gap-3 py-3">
                      <p className="min-w-0 break-words text-sm text-slate-800">
                        <span className="font-semibold">{assignment.teacherName}</span>
                        <span className="text-slate-500"> · {assignment.subjectName}</span>
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={removingId !== null}
                        onClick={() => void handleRemoveSubjectTeacher(assignment)}
                        aria-label={`Remove ${assignment.teacherName} from ${assignment.subjectName}`}
                      >
                        {removingId === assignment.id ? 'Removing...' : '×'}
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-3xl border border-red-200 bg-white p-5 sm:p-6">
              <h2 className="font-bold text-slate-900">Danger zone</h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                Teachers will lose access, but students remain enrolled. You can reactivate this class later.
              </p>
              <Button type="button" variant="danger" className="mt-4" onClick={() => openDialog('deactivate')}>Deactivate class</Button>
            </section>
          </>
        ) : null}
      </div>

      {dialogMode === 'class-teacher' && schoolClass && (
        <AccessibleDialog title="Change class teacher" titleId="change-class-teacher-title" onClose={() => setDialogMode(null)}>
          <form onSubmit={(event) => void handleChangeClassTeacher(event)} className="mt-5 space-y-4">
            <div>
              <label htmlFor="change-class-teacher" className="mb-1 block text-sm font-semibold text-slate-700">Class teacher</label>
              <select id="change-class-teacher" value={selectedTeacherId} onChange={(event) => setSelectedTeacherId(event.target.value)} className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]">
                <option value="">Unassigned</option>
                {teachers.map((teacher) => <option key={teacher.userId} value={teacher.userId}>{teacherDisplayName(teacher)}</option>)}
              </select>
            </div>
            {dialogError && <p role="alert" className="text-sm text-red-700">{dialogError}</p>}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setDialogMode(null)} disabled={saving}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={saving}>{saving ? 'Saving...' : 'Save teacher'}</Button>
            </div>
          </form>
        </AccessibleDialog>
      )}

      {dialogMode === 'subject-teacher' && (
        <AccessibleDialog title="Add subject teacher" titleId="add-subject-teacher-title" onClose={() => setDialogMode(null)}>
          <form onSubmit={(event) => void handleAddSubjectTeacher(event)} className="mt-5 space-y-4">
            <div>
              <label htmlFor="subject-teacher" className="mb-1 block text-sm font-semibold text-slate-700">Teacher</label>
              <select id="subject-teacher" value={selectedTeacherId} onChange={(event) => setSelectedTeacherId(event.target.value)} required className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]">
                <option value="" disabled>Select a teacher</option>
                {teachers.map((teacher) => <option key={teacher.userId} value={teacher.userId}>{teacherDisplayName(teacher)}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="subject-name" className="mb-1 block text-sm font-semibold text-slate-700">Subject</label>
              <select id="subject-name" value={selectedSubjectId} onChange={(event) => setSelectedSubjectId(event.target.value)} required={!isCreatingSubject} disabled={isCreatingSubject} className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]">
                <option value="" disabled>{subjects.length ? 'Select a subject' : 'No subjects are configured'}</option>
                {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
              </select>
              {isCreatingSubject ? (
                <div className="mt-3">
                  <label htmlFor="new-subject-name" className="mb-1 block text-sm font-semibold text-slate-700">Or create a new subject</label>
                  <input
                    id="new-subject-name"
                    value={newSubjectName}
                    onChange={(event) => setNewSubjectName(event.target.value)}
                    required
                    maxLength={80}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                  />
                  <button type="button" onClick={() => { setIsCreatingSubject(false); setNewSubjectName(''); }} className="mt-2 text-sm font-semibold text-[#2563EB] hover:underline">
                    Choose an existing subject
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => { setSelectedSubjectId(''); setIsCreatingSubject(true); }}
                  className="mt-2 text-sm font-semibold text-[#2563EB] hover:underline"
                >
                  Can't find it? Add a new subject
                </button>
              )}
            </div>
            {dialogError && <p role="alert" className="text-sm text-red-700">{dialogError}</p>}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setDialogMode(null)} disabled={saving}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={saving || (isCreatingSubject ? !newSubjectName.trim() : !selectedSubjectId)}>{saving ? 'Adding...' : 'Add assignment'}</Button>
            </div>
          </form>
        </AccessibleDialog>
      )}

      {dialogMode === 'deactivate' && schoolClass && (
        <AccessibleDialog title={`Deactivate ${schoolClass.name}?`} titleId="deactivate-class-title" onClose={() => setDialogMode(null)}>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            Deactivate {schoolClass.name}? Teachers will lose access. Students remain enrolled and the class can be reactivated later.
          </p>
          {dialogError && <p role="alert" className="mt-3 text-sm text-red-700">{dialogError}</p>}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setDialogMode(null)} disabled={saving}>Cancel</Button>
            <Button type="button" variant="danger" onClick={() => void handleDeactivateClass()} disabled={saving}>{saving ? 'Deactivating...' : 'Deactivate class'}</Button>
          </div>
        </AccessibleDialog>
      )}
    </main>
  );
}
