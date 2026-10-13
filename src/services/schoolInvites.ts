import { supabase } from '../lib/supabase';

export type SchoolInvite = {
  id: string;
  school_id: string;
  code: string;
  role: 'teacher' | 'admin';
  created_by: string;
  created_at: string;
  expires_at: string;
  used_at: string | null;
  used_by: string | null;
  revoked_at: string | null;
};

export type InvitePreview = {
  schoolName: string | null;
  schoolRegion: string | null;
  role: 'teacher' | 'admin' | null;
  valid: boolean;
  reason: string | null;
};

export async function listSchoolInvites(): Promise<SchoolInvite[]> {
  if (!supabase) throw new Error('Missing Supabase env vars.');

  const { data, error } = await supabase
    .from('school_invites')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as SchoolInvite[];
}

export async function generateSchoolInvite(role: 'teacher' | 'admin' = 'teacher'): Promise<{
  id: string;
  code: string;
  expiresAt: string;
}> {
  if (!supabase) throw new Error('Missing Supabase env vars.');

  const { data, error } = await supabase.rpc('generate_school_invite', { target_role: role });

  if (error) throw new Error(error.message);

  const row = Array.isArray(data) ? data[0] : data;
  if (!row) throw new Error('Failed to generate invite.');

  return {
    id: row.invite_id,
    code: row.invite_code,
    expiresAt: row.invite_expires_at,
  };
}

export async function previewSchoolInvite(code: string): Promise<InvitePreview> {
  if (!supabase) throw new Error('Missing Supabase env vars.');

  const { data, error } = await supabase.rpc('preview_school_invite', { invite_code: code });

  if (error) throw new Error(error.message);

  const row = Array.isArray(data) ? data[0] : data;
  if (!row) {
    return {
      schoolName: null,
      schoolRegion: null,
      role: null,
      valid: false,
      reason: 'Unknown error.',
    };
  }

  return {
    schoolName: row.school_name,
    schoolRegion: row.school_region,
    role: row.role,
    valid: row.valid,
    reason: row.reason,
  };
}

export async function redeemSchoolInvite(code: string): Promise<string> {
  if (!supabase) throw new Error('Missing Supabase env vars.');

  const { data, error } = await supabase.rpc('redeem_school_invite', { invite_code: code });

  if (error) throw new Error(error.message);
  return data as string;
}

export async function revokeSchoolInvite(inviteId: string): Promise<void> {
  if (!supabase) throw new Error('Missing Supabase env vars.');

  const { error } = await supabase
    .from('school_invites')
    .update({ revoked_at: new Date().toISOString() })
    .eq('id', inviteId);

  if (error) throw new Error(error.message);
}

export async function listSchoolTeachers(): Promise<{
  userId: string;
  firstName: string;
  lastName: string;
  email: string | null;
  verificationStatus: 'pending' | 'approved' | 'rejected' | null;
}[]> {
  if (!supabase) throw new Error('Missing Supabase env vars.');

  const { data, error } = await supabase
    .from('school_members')
    .select('user_id, profiles:user_id(first_name, last_name, email, verification_status)')
    .eq('role', 'teacher');

  if (error) throw new Error(error.message);

  return (data ?? []).map((row: any) => ({
    userId: row.user_id,
    firstName: row.profiles?.first_name ?? '',
    lastName: row.profiles?.last_name ?? '',
    email: row.profiles?.email ?? null,
    verificationStatus: row.profiles?.verification_status ?? null,
  }));
}
