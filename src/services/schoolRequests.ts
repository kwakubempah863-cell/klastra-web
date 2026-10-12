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
