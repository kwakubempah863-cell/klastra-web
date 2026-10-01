-- ============================================================
-- Seed 3 test tutors for development
-- REPLACE the three UUIDs below with actual user IDs from
-- Authentication → Users in the Supabase dashboard
-- ============================================================

-- Substitute these:
-- AMA_UID   = the UUID for ama@tutorkonnect.test
-- KOFI_UID  = the UUID for kofi@tutorkonnect.test
-- ABENA_UID = the UUID for abena@tutorkonnect.test

-- Update profiles to tutor role with real data
update public.profiles set
  role = 'tutor',
  first_name = 'Ama',
  last_name = 'Owusu',
  avatar_url = 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop',
  verified = true,
  verification_status = 'approved',
  onboarding_complete = true
where id = 'AMA_UID_HERE';

update public.profiles set
  role = 'tutor',
  first_name = 'Kofi',
  last_name = 'Mensah',
  avatar_url = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  verified = true,
  verification_status = 'approved',
  onboarding_complete = true
where id = 'KOFI_UID_HERE';

update public.profiles set
  role = 'tutor',
  first_name = 'Abena',
  last_name = 'Boateng',
  avatar_url = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
  verified = true,
  verification_status = 'approved',
  onboarding_complete = true
where id = 'ABENA_UID_HERE';

-- Insert tutor rows
insert into public.tutors (id, bio, qualifications, subject_ids, subject_names, rate, rating, reviews_count, available, location, languages) values
  ('AMA_UID_HERE',
   'Specialist in WASSCE and university-level mathematics. Passionate about making complex concepts accessible to every student.',
   'PhD Mathematics, KNUST',
   array['mathematics', 'further-maths'],
   array['Mathematics', 'Further Maths'],
   80, 4.9, 127, true, 'Kumasi, Ghana',
   array['English', 'Twi']),
  ('KOFI_UID_HERE',
   'Former lecturer at KNUST. I make science practical and exciting through real-world applications and experiments.',
   'MSc Physics, University of Ghana',
   array['physics', 'chemistry'],
   array['Physics', 'Chemistry'],
   70, 4.8, 94, true, 'Kumasi, Ghana',
   array['English', 'Twi']),
  ('ABENA_UID_HERE',
   'Experienced English tutor specializing in comprehension, essay writing, and WASSCE preparation.',
   'BA English, University of Cape Coast',
   array['english', 'literature'],
   array['English', 'Literature'],
   60, 4.7, 73, false, 'Kumasi, Ghana',
   array['English']);

-- Add availability for each tutor
insert into public.tutor_availability (tutor_id, day, enabled, start_time, end_time) values
  ('AMA_UID_HERE', 'Mon', true, '16:00', '20:00'),
  ('AMA_UID_HERE', 'Wed', true, '16:00', '20:00'),
  ('AMA_UID_HERE', 'Fri', true, '16:00', '20:00'),
  ('AMA_UID_HERE', 'Sat', true, '09:00', '17:00'),
  ('KOFI_UID_HERE', 'Tue', true, '16:00', '20:00'),
  ('KOFI_UID_HERE', 'Thu', true, '16:00', '20:00'),
  ('KOFI_UID_HERE', 'Sat', true, '09:00', '17:00'),
  ('KOFI_UID_HERE', 'Sun', true, '09:00', '17:00'),
  ('ABENA_UID_HERE', 'Mon', true, '15:00', '19:00'),
  ('ABENA_UID_HERE', 'Tue', true, '15:00', '19:00'),
  ('ABENA_UID_HERE', 'Wed', true, '15:00', '19:00'),
  ('ABENA_UID_HERE', 'Thu', true, '15:00', '19:00');