import { supabase } from '../lib/supabase';

type ClassRecord = {
  id: string;
  school_id: string;
  name: string;
  level: string;
  academic_year: string;
  teacher_id: string | null;
  created_at: string;
};

export type ClassRow = {
  id: string;
  schoolId: string;
  name: string;
  level: string;
  academicYear: string;
  teacherId: string | null;
  teacherName: string | null;
  studentCount: number;
  subjectTeacherCount: number;
  createdAt: string;
};

export type SchoolTeacherOption = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string | null;
};

export type ClassSubjectTeacher = {
  id: string;
  teacherId: string;
  teacherName: string;
  subjectId: string;
  subjectName: string;
};

export type SchoolSubject = {
  id: string;
  name: string;
};

const classColumns = 'id, school_id, name, level, academic_year, teacher_id, created_at';

function getSupabase() {
  if (!supabase) throw new Error('Missing Supabase env vars.');
  return supabase;
}

async function getAdminSchoolId(): Promise<string> {
  const client = getSupabase();
  const { data: { user }, error: userError } = await client.auth.getUser();
  if (userError) throw new Error(userError.message);
  if (!user) throw new Error('Sign in to manage classes.');

  const { data, error } = await client
    .from('school_members')
    .select('school_id')
    .eq('user_id', user.id)
    .eq('role', 'admin')
    .is('deactivated_at', null);

  if (error) throw new Error(error.message);
  const schoolIds = [...new Set((data ?? []).map((membership) => membership.school_id))];
  if (schoolIds.length === 0) throw new Error('No active school administrator membership was found.');
  if (schoolIds.length > 1) {
    throw new Error('Multiple active school administrator memberships were found. Select the school you want to manage.');
  }
  return schoolIds[0];
}

async function mapClassRows(records: ClassRecord[]): Promise<ClassRow[]> {
  if (records.length === 0) return [];

  const client = getSupabase();
  const teacherIds = [...new Set(records.flatMap((record) => record.teacher_id ? [record.teacher_id] : []))];
  const classIds = records.map((record) => record.id);
  const [teacherResult, studentResult, subjectTeacherResult] = await Promise.all([
    teacherIds.length
      ? client.from('profiles').select('id, first_name, last_name').in('id', teacherIds)
      : Promise.resolve({ data: [], error: null }),
    client.from('students').select('class_id').in('class_id', classIds),
    client.from('teacher_subjects').select('class_id, teacher_id').in('class_id', classIds),
  ]);

  if (teacherResult.error) throw new Error(teacherResult.error.message);
  if (studentResult.error) throw new Error(studentResult.error.message);
  if (subjectTeacherResult.error) throw new Error(subjectTeacherResult.error.message);

  const teacherNames = new Map(
    (teacherResult.data ?? []).map((teacher) => [
      teacher.id,
      [teacher.first_name, teacher.last_name].filter(Boolean).join(' ').trim(),
    ]),
  );
  const studentCounts = new Map<string, number>();
  for (const student of studentResult.data ?? []) {
    if (student.class_id) studentCounts.set(student.class_id, (studentCounts.get(student.class_id) ?? 0) + 1);
  }
  const subjectTeacherIds = new Map<string, Set<string>>();
  for (const assignment of subjectTeacherResult.data ?? []) {
    if (!assignment.class_id) continue;
    const teachers = subjectTeacherIds.get(assignment.class_id) ?? new Set<string>();
    teachers.add(assignment.teacher_id);
    subjectTeacherIds.set(assignment.class_id, teachers);
  }

  return records.map((record) => ({
    id: record.id,
    schoolId: record.school_id,
    name: record.name,
    level: record.level,
    academicYear: record.academic_year,
    teacherId: record.teacher_id,
    teacherName: record.teacher_id ? teacherNames.get(record.teacher_id) || null : null,
    studentCount: studentCounts.get(record.id) ?? 0,
    subjectTeacherCount: subjectTeacherIds.get(record.id)?.size ?? 0,
    createdAt: record.created_at,
  }));
}

export async function listClasses(): Promise<ClassRow[]> {
  const client = getSupabase();
  const schoolId = await getAdminSchoolId();
  const { data, error } = await client
    .from('classes')
    .select(classColumns)
    .eq('school_id', schoolId)
    .is('deactivated_at', null)
    .order('name');

  if (error) throw new Error(error.message);
  return mapClassRows((data ?? []) as ClassRecord[]);
}

export async function listDeactivatedClasses(): Promise<ClassRow[]> {
  const client = getSupabase();
  const schoolId = await getAdminSchoolId();
  const { data, error } = await client
    .from('classes')
    .select(classColumns)
    .eq('school_id', schoolId)
    .not('deactivated_at', 'is', null)
    .order('name');

  if (error) throw new Error(error.message);
  return mapClassRows((data ?? []) as ClassRecord[]);
}

export async function getClass(classId: string): Promise<ClassRow | null> {
  const client = getSupabase();
  const schoolId = await getAdminSchoolId();
  const { data, error } = await client
    .from('classes')
    .select(classColumns)
    .eq('school_id', schoolId)
    .eq('id', classId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  const [row] = await mapClassRows([data as ClassRecord]);
  return row;
}

export async function createClass(input: {
  name: string;
  level: string;
  academicYear: string;
  teacherId?: string | null;
}): Promise<ClassRow> {
  const client = getSupabase();
  const schoolId = await getAdminSchoolId();
  const { data, error } = await client
    .from('classes')
    .insert({
      school_id: schoolId,
      name: input.name.trim(),
      level: input.level.trim(),
      academic_year: input.academicYear.trim(),
      teacher_id: input.teacherId || null,
    })
    .select(classColumns)
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Class creation was blocked — you may not have permission to create this class.');
  const [row] = await mapClassRows([data as ClassRecord]);
  return row;
}

export async function updateClass(classId: string, patch: {
  name?: string;
  level?: string;
  academicYear?: string;
  teacherId?: string | null;
}): Promise<void> {
  const client = getSupabase();
  const schoolId = await getAdminSchoolId();
  const updates = {
    ...(patch.name !== undefined ? { name: patch.name.trim() } : {}),
    ...(patch.level !== undefined ? { level: patch.level.trim() } : {}),
    ...(patch.academicYear !== undefined ? { academic_year: patch.academicYear.trim() } : {}),
    ...(patch.teacherId !== undefined ? { teacher_id: patch.teacherId } : {}),
  };
  const { data, error } = await client
    .from('classes')
    .update(updates)
    .eq('school_id', schoolId)
    .eq('id', classId)
    .select('id')
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Class was not updated. Check your school permissions.');
}

export async function deactivateClass(classId: string): Promise<void> {
  const client = getSupabase();
  const schoolId = await getAdminSchoolId();
  const { data, error } = await client
    .from('classes')
    .update({ deactivated_at: new Date().toISOString() })
    .eq('school_id', schoolId)
    .eq('id', classId)
    .select('id')
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Class was not deactivated. Check your school permissions.');
}

export async function reactivateClass(classId: string): Promise<void> {
  const client = getSupabase();
  const schoolId = await getAdminSchoolId();
  const { data, error } = await client
    .from('classes')
    .update({ deactivated_at: null })
    .eq('school_id', schoolId)
    .eq('id', classId)
    .select('id')
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Class was not reactivated. Check your school permissions.');
}

export async function listSchoolTeachers(): Promise<SchoolTeacherOption[]> {
  const client = getSupabase();
  const schoolId = await getAdminSchoolId();
  const { data, error } = await client
    .from('school_members')
    .select('user_id, profiles:user_id(first_name, last_name, email)')
    .eq('school_id', schoolId)
    .eq('role', 'teacher')
    .is('deactivated_at', null);

  if (error) throw new Error(error.message);

  return ((data ?? []) as Array<{
    user_id: string;
    profiles: { first_name: string | null; last_name: string | null; email: string | null }[] | { first_name: string | null; last_name: string | null; email: string | null } | null;
  }>)
    .map((row) => {
      const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
      return {
        userId: row.user_id,
        firstName: profile?.first_name ?? '',
        lastName: profile?.last_name ?? '',
        email: profile?.email ?? null,
      };
    })
    .sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
}

export async function listClassSubjectTeachers(classId: string): Promise<ClassSubjectTeacher[]> {
  const client = getSupabase();
  const schoolId = await getAdminSchoolId();
  const { data: classData, error: classError } = await client
    .from('classes')
    .select('id')
    .eq('school_id', schoolId)
    .eq('id', classId)
    .maybeSingle();

  if (classError) throw new Error(classError.message);
  if (!classData) throw new Error('Class not found in your school.');

  const { data, error } = await client
    .from('teacher_subjects')
    .select('id, teacher_id, subject_id, profiles:teacher_id(first_name, last_name), subjects:subject_id(name)')
    .eq('class_id', classId);

  if (error) throw new Error(error.message);

  return ((data ?? []) as Array<{
    id: string;
    teacher_id: string;
    subject_id: string;
    profiles: { first_name: string | null; last_name: string | null }[] | { first_name: string | null; last_name: string | null } | null;
    subjects: { name: string }[] | { name: string } | null;
  }>).map((row) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    const subject = Array.isArray(row.subjects) ? row.subjects[0] : row.subjects;
    return {
      id: row.id,
      teacherId: row.teacher_id,
      teacherName: [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'Teacher',
      subjectId: row.subject_id,
      subjectName: subject?.name ?? 'Subject',
    };
  });
}

export async function addClassSubjectTeacher(input: {
  classId: string;
  teacherId: string;
  subjectId: string;
}): Promise<void> {
  const client = getSupabase();
  const { data, error } = await client
    .from('teacher_subjects')
    .insert({
      class_id: input.classId,
      teacher_id: input.teacherId,
      subject_id: input.subjectId,
    })
    .select('id')
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Insert was blocked — you may not have permission to assign this teacher.');
}

export async function removeClassSubjectTeacher(id: string): Promise<void> {
  const client = getSupabase();
  const { data, error } = await client
    .from('teacher_subjects')
    .delete()
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Subject teacher assignment was not removed. Check your permissions.');
}

export async function listSchoolSubjects(): Promise<SchoolSubject[]> {
  const client = getSupabase();
  const schoolId = await getAdminSchoolId();
  const { data, error } = await client
    .from('subjects')
    .select('id, name')
    .eq('school_id', schoolId)
    .order('name');

  if (error) throw new Error(error.message);
  return (data ?? []) as SchoolSubject[];
}

export async function createSubject(input: { name: string }): Promise<SchoolSubject> {
  const client = getSupabase();
  const schoolId = await getAdminSchoolId();
  const { data, error } = await client
    .from('subjects')
    .insert({ school_id: schoolId, name: input.name.trim() })
    .select('id, name')
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Could not create subject.');
  return data as SchoolSubject;
}
