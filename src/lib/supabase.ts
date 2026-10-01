import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('[ENV] URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('[ENV] KEY length:', import.meta.env.VITE_SUPABASE_ANON_KEY?.length);
console.log('[ENV] KEY prefix:', import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(0, 20));

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;