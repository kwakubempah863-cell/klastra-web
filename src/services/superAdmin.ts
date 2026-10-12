import { supabase } from '../lib/supabase';

export type SchoolRequest = {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  phone: string;
  school_name: string;
  school_region: string;
  school_city: string;
  student_count: number | null;
  registration_certificate_url: string | null;
  headmaster_id_url: string | null;
  headmaster_appointment_url: string | null;
  status: 'pending' | 'awaiting_review' | 'needs_info' | 'approved' | 'rejected';
  reviewer_notes: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  created_at: string;
  updated_at: string;
};

export async function listSchoolRequests(status?: SchoolRequest['status']): Promise<SchoolRequest[]> {
  if (!supabase) throw new Error('Missing Supabase env vars. Check .env.local');

  let query = supabase
    .from('school_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as SchoolRequest[];
}

export async function signInPlatformAdmin(email: string, password: string) {
  if (!supabase) throw new Error('Missing Supabase env vars. Check .env.local');

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  if (!data.user) throw new Error('Sign in did not return a user.');

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .maybeSingle();

  if (profileError) throw new Error(profileError.message);

  if (!profile || profile.role !== 'platform_admin') {
    await supabase.auth.signOut();
    throw new Error('This account is not a platform administrator.');
  }

  return data;
}
