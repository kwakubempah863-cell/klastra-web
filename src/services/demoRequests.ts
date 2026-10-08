import { supabase } from '../lib/supabase';

export type DemoRequestInput = {
  fullName: string;
  schoolName: string;
  role: string;
  email: string;
  phone: string;
  studentCount?: number;
  message?: string;
};

export async function submitDemoRequest(input: DemoRequestInput): Promise<void> {
  if (!supabase) {
    throw new Error('Missing Supabase env vars. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local before submitting the form.');
  }

  const { error } = await supabase.from('demo_requests').insert({
    full_name: input.fullName,
    school_name: input.schoolName,
    role: input.role,
    email: input.email,
    phone: input.phone,
    student_count: input.studentCount ?? null,
    message: input.message ?? null,
  });

  if (error) {
    throw new Error(error.message);
  }
}
