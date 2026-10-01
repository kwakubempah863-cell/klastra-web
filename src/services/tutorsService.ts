import { supabase } from '../lib/supabase';
import { subjects } from '../data/subjects';

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

export type TutorProfileInput = {
  bio: string;
  qualifications: string;
  subject_ids: string[];
  subject_names: string[];
  rate: number;
};

export type AvailabilityDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export type AvailabilityInput = {
  day: AvailabilityDay;
  enabled: boolean;
  start_time: string | null;
  end_time: string | null;
};

export type TutorDocumentType = 'national_id' | 'academic_certificate' | 'teaching_certificate';

export async function createTutorProfile(input: TutorProfileInput & { location?: string; languages?: string[] }) {
  const { data: { user } } = await getSupabase().auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await getSupabase()
    .from('tutors')
    .insert({
      id: user.id,
      ...input,
      rating: 0,
      reviews_count: 0,
      available: true,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateTutorProfile(input: Partial<TutorProfileInput & { location: string; languages: string[] }>) {
  const { data: { user } } = await getSupabase().auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await getSupabase()
    .from('tutors')
    .update(input)
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function setAvailability(rows: AvailabilityInput[]) {
  const { data: { user } } = await getSupabase().auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const payload = rows.map(row => ({ ...row, tutor_id: user.id }));
  const { error } = await getSupabase()
    .from('tutor_availability')
    .upsert(payload, { onConflict: 'tutor_id,day' });

  if (error) throw new Error(error.message);
}

export async function uploadTutorDocument(documentType: TutorDocumentType, file: File) {
  const { data: { user } } = await getSupabase().auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
  const path = `${user.id}/${documentType}.${ext}`;
  const { error: uploadError } = await getSupabase()
    .storage
    .from('tutor-documents')
    .upload(path, file, { upsert: true });

  if (uploadError) throw new Error(uploadError.message);

  const document = {
    tutor_id: user.id,
    document_type: documentType,
    storage_path: path,
    file_name: file.name,
    status: 'pending',
  };
  const { error: dbError } = await getSupabase()
    .from('tutor_documents')
    .upsert(document, { onConflict: 'tutor_id,document_type' });

  if (!dbError) return;
  if (dbError.code !== '42P10' && !dbError.message.includes('no unique or exclusion constraint matching')) {
    throw new Error(dbError.message);
  }

  const { data: existingDocument, error: lookupError } = await getSupabase()
    .from('tutor_documents')
    .select('id')
    .eq('tutor_id', user.id)
    .eq('document_type', documentType)
    .maybeSingle();

  if (lookupError) throw new Error(lookupError.message);

  const { error: fallbackError } = existingDocument
    ? await getSupabase().from('tutor_documents').update(document).eq('id', existingDocument.id)
    : await getSupabase().from('tutor_documents').insert(document);

  if (fallbackError) throw new Error(fallbackError.message);
}

export async function removeTutorDocument(documentType: TutorDocumentType) {
  const { data: { user } } = await getSupabase().auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: document, error: selectError } = await getSupabase()
    .from('tutor_documents')
    .select('storage_path')
    .eq('tutor_id', user.id)
    .eq('document_type', documentType)
    .maybeSingle();

  if (selectError) throw new Error(selectError.message);

  const { error: deleteError } = await getSupabase()
    .from('tutor_documents')
    .delete()
    .eq('tutor_id', user.id)
    .eq('document_type', documentType);

  if (deleteError) throw new Error(deleteError.message);

  if (document?.storage_path) {
    const { error: storageError } = await getSupabase()
      .storage
      .from('tutor-documents')
      .remove([document.storage_path]);

    if (storageError) throw new Error(storageError.message);
  }
}

export async function submitForVerification() {
  const { data: { user } } = await getSupabase().auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await getSupabase()
    .from('profiles')
    .update({ verification_status: 'pending', onboarding_complete: true })
    .eq('id', user.id);

  if (error) throw new Error(error.message);
}

export async function getMyTutorProfile() {
  const { data: { user } } = await getSupabase().auth.getUser();
  if (!user) return null;

  const { data, error } = await getSupabase()
    .from('tutors')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function getMyAvailability() {
  const { data: { user } } = await getSupabase().auth.getUser();
  if (!user) return [];

  const { data, error } = await getSupabase()
    .from('tutor_availability')
    .select('*')
    .eq('tutor_id', user.id);

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getMyDocuments() {
  const { data: { user } } = await getSupabase().auth.getUser();
  if (!user) return [];

  const { data, error } = await getSupabase()
    .from('tutor_documents')
    .select('*')
    .eq('tutor_id', user.id);

  if (error) throw new Error(error.message);
  return data ?? [];
}