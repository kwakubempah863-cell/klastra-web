import { supabase } from '../lib/supabase';

export type SignupInput = {
  email: string;
  password: string;
  role: 'student' | 'parent' | 'tutor';
  firstName: string;
  lastName: string;
  phone?: string;
};

function getSupabase() {
  if (!supabase) throw new Error('Missing Supabase env vars. Check .env.local');
  return supabase;
}

export async function signUp(input: SignupInput) {
  const digits = input.phone?.replace(/\D/g, '');
  const phone = digits ? `+233${digits.replace(/^0/, '')}` : undefined;
  const { data, error } = await getSupabase().auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        role: input.role,
        first_name: input.firstName,
        last_name: input.lastName,
        ...(phone ? { phone } : {}),
      },
    },
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await getSupabase().auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return data;
}

export async function signOut() {
  const { error } = await getSupabase().auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getCurrentProfile() {
  const { data: { user }, error: userError } = await getSupabase().auth.getUser();
  if (userError) throw new Error(userError.message);
  if (!user) return null;

  const { data, error } = await getSupabase()
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}