-- Backfill profiles table from auth.users raw_user_meta_data
-- Run this in Supabase SQL editor to create profile rows for existing users

insert into public.profiles (id, full_name, email, phone, avatar_url, role, created_at)
select
  u.id,
  u.raw_user_meta_data->>'full_name' as full_name,
  u.email,
  u.raw_user_meta_data->>'phone' as phone,
  u.raw_user_meta_data->>'avatar_url' as avatar_url,
  coalesce(u.raw_user_meta_data->>'role', 'adotante') as role,
  now()
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;