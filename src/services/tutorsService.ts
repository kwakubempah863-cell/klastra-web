import { supabase } from '../lib/supabase';
import { subjects } from '../data/mockData';

export type Tutor = {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  verified: boolean;
  verification_status: string;
  bio: string | null;
  qualifications: string;
  subject_ids: string[];
  subject_names: string[];
  rate: number;
  rating: number;
  reviews_count: number;
  available: boolean;
  location: string | null;
  languages: string[];
};

export type TutorFilters = {
  search?: string;
  subject?: string;
  minRating?: number;
  maxRate?: number;
  onlyAvailable?: boolean;
  sort?: 'rating' | 'rate_asc' | 'rate_desc';
};

function getSupabase() {
  if (!supabase) throw new Error('Missing Supabase env vars. Check .env.local');
  return supabase;
}

export async function listTutors(filters: TutorFilters = {}): Promise<Tutor[]> {
  let query = getSupabase().from('public_tutors').select('*');

  if (filters.search?.trim()) {
    const q = filters.search.trim();
    const matchingSubjects = subjects
      .filter(subject => subject.name.toLowerCase().includes(q.toLowerCase()))
      .map(subject => `subject_names.cs.{${subject.name}}`);

    query = query.or([
      `first_name.ilike.%${q}%`,
      `last_name.ilike.%${q}%`,
      `bio.ilike.%${q}%`,
      `qualifications.ilike.%${q}%`,
      ...matchingSubjects,
    ].join(','));
  }

  if (filters.subject) query = query.contains('subject_names', [filters.subject]);
  if (filters.minRating !== undefined) query = query.gte('rating', filters.minRating);
  if (filters.maxRate !== undefined) query = query.lte('rate', filters.maxRate);
  if (filters.onlyAvailable) query = query.eq('available', true);

  switch (filters.sort) {
    case 'rate_asc':
      query = query.order('rate', { ascending: true });
      break;
    case 'rate_desc':
      query = query.order('rate', { ascending: false });
      break;
    case 'rating':
    default:
      query = query.order('rating', { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as Tutor[];
}

export async function getTutor(id: string): Promise<Tutor | null> {
  const { data, error } = await getSupabase()
    .from('public_tutors')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as Tutor | null) ?? null;
}

export function adaptTutor(tutor: Tutor) {
  return {
    id: tutor.id,
    name: `${tutor.first_name} ${tutor.last_name}`,
    avatar: tutor.avatar_url ?? undefined,
    subjects: tutor.subject_names ?? [],
    qualifications: tutor.qualifications,
    rating: Number(tutor.rating),
    reviews: tutor.reviews_count,
    rate: Number(tutor.rate),
    verified: tutor.verified,
    available: tutor.available,
    bio: tutor.bio ?? 'Bio not provided.',
    location: tutor.location ?? 'Location not provided',
    languages: tutor.languages ?? [],
    totalStudents: null as number | null,
    completedLessons: null as number | null,
    experience: null as number | null,
    responseTime: null as string | null,
    availability: [] as string[],
  };
}