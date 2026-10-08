create table if not exists public.demo_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  school_name text not null,
  role text not null,
  email text not null,
  phone text not null,
  student_count integer,
  message text,
  status text not null default 'new' check (status in ('new', 'contacted', 'converted', 'declined')),
  created_at timestamptz not null default now()
);

alter table public.demo_requests enable row level security;

create policy "Anyone can submit demo request"
on public.demo_requests for insert
with check (true);

create policy "Admins can read demo requests"
on public.demo_requests for select
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
);

grant insert on public.demo_requests to anon, authenticated;
grant select on public.demo_requests to authenticated;

notify pgrst, 'reload schema';
