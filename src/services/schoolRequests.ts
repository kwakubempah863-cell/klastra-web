import { supabase } from '../lib/supabase';

export type SchoolSignupInput = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  schoolName: string;
  schoolRegion: string;
  schoolCity: string;
  studentCount?: number;
};

export async function registerSchool(input: SchoolSignupInput) {
  if (!supabase) {
    throw new Error('Missing Supabase env vars. Check .env.local');
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        full_name: input.fullName,
        phone: input.phone,
      },
    },
  });

  if (authError) throw new Error(authError.message);
  if (!authData.user) throw new Error('Signup did not return a user.');

  const { error: insertError } = await supabase
    .from('school_requests')
    .insert({
      user_id: authData.user.id,
      full_name: input.fullName,
      email: input.email,
      phone: input.phone,
      school_name: input.schoolName,
      school_region: input.schoolRegion,
      school_city: input.schoolCity,
      student_count: input.studentCount ?? null,
    });

  if (insertError) throw new Error(insertError.message);

  return authData;
}

export type DocumentUploadResult = {
  path: string;
};

export async function uploadSchoolDocument(
  userId: string,
  docType: 'registration_certificate' | 'headmaster_id' | 'headmaster_appointment',
  file: File,
): Promise<DocumentUploadResult> {
  if (!supabase) throw new Error('Missing Supabase env vars. Check .env.local');

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
  const path = `${userId}/${docType}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('school-documents')
    .upload(path, file, { upsert: true });

  if (uploadError) throw new Error(uploadError.message);

  return { path };
}

export async function updateSchoolRequestDocuments(
  userId: string,
  updates: {
    registration_certificate_url?: string;
    headmaster_id_url?: string;
    headmaster_appointment_url?: string;
  },
): Promise<void> {
  if (!supabase) throw new Error('Missing Supabase env vars. Check .env.local');

  const { data: existing, error: fetchError } = await supabase
    .from('school_requests')
    .select('registration_certificate_url, headmaster_id_url, headmaster_appointment_url')
    .eq('user_id', userId)
    .maybeSingle();

  if (fetchError) throw new Error(fetchError.message);
  if (!existing) throw new Error('No school request found for this user.');

  const merged = { ...existing, ...updates };
  const hasRequiredDocs = Boolean(merged.registration_certificate_url && merged.headmaster_id_url);

  const { data: updated, error: updateError } = await supabase
    .from('school_requests')
    .update({
      ...updates,
      status: hasRequiredDocs ? 'awaiting_review' : 'pending',
    })
    .eq('user_id', userId)
    .select('user_id')
    .maybeSingle();

  if (updateError) throw new Error(updateError.message);
  if (!updated) throw new Error('School request was not updated. Check your account permissions.');
}

export async function getMySchoolRequest(userId: string) {
  if (!supabase) throw new Error('Missing Supabase env vars. Check .env.local');

  const { data, error } = await supabase
    .from('school_requests')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}
