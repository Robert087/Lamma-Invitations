create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  preferred_locale text not null default 'ar' check (preferred_locale in ('ar', 'en')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

grant select, insert, update on public.profiles to authenticated;

create policy "Users can view their own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Users can create their own profile"
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    nullif(coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'), '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

revoke execute on function public.create_profile_for_new_user() from public;
revoke execute on function public.create_profile_for_new_user() from anon;
revoke execute on function public.create_profile_for_new_user() from authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.create_profile_for_new_user();

create function public.set_profiles_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke execute on function public.set_profiles_updated_at() from public;
revoke execute on function public.set_profiles_updated_at() from anon;
revoke execute on function public.set_profiles_updated_at() from authenticated;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_profiles_updated_at();
