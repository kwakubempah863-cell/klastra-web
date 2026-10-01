# Supabase Patterns

## Admin-check policies

NEVER write a policy that queries the same table it's protecting.
This causes infinite recursion (error 42P17).

**Wrong:**
```sql
create policy "Admins can view all X"
  on X for select
  using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );
Right: use the is_admin() helper function (see docs/migrations/001_profiles.sql).

sql
create policy "Admins can view all X"
  on X for select
  using (public.is_admin());
The same pattern applies for is_tutor(), is_verified_tutor(), is_parent_of(child_id), etc.
These are SECURITY DEFINER functions that bypass RLS internally.

Grants for tables created via raw SQL
Tables created via the SQL Editor do NOT automatically get grants for anon and authenticated roles.
Add them explicitly after every CREATE TABLE:

sql
grant usage on schema public to anon, authenticated;
grant select on public.my_table to anon, authenticated;
grant insert, update, delete on public.my_table to authenticated;
Schema cache reload
After every migration that adds or changes tables/policies:

sql
notify pgrst, 'reload schema';