create table public.events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  occasion_type text not null check (occasion_type in ('wedding', 'engagement', 'katb-ketab', 'birthday', 'baby-shower', 'graduation', 'party', 'anniversary', 'corporate-event', 'iftar-sohour', 'custom')),
  title text not null,
  slug text not null unique,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  event_date date,
  timezone text not null default 'Africa/Cairo',
  venue_name text,
  location_url text,
  primary_locale text not null default 'ar' check (primary_locale in ('ar', 'en')),
  visibility text not null default 'unlisted' check (visibility in ('unlisted', 'public')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.events enable row level security;

grant select, insert, update, delete on public.events to authenticated;

create policy "Users can view their own events"
  on public.events for select
  to authenticated
  using ((select auth.uid()) = owner_id);

create policy "Users can create their own events"
  on public.events for insert
  to authenticated
  with check ((select auth.uid()) = owner_id);

create policy "Users can update their own events"
  on public.events for update
  to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

create policy "Users can delete their own events"
  on public.events for delete
  to authenticated
  using ((select auth.uid()) = owner_id);

create function public.set_events_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke execute on function public.set_events_updated_at() from public;
revoke execute on function public.set_events_updated_at() from anon;
revoke execute on function public.set_events_updated_at() from authenticated;

create trigger set_events_updated_at
  before update on public.events
  for each row execute procedure public.set_events_updated_at();
