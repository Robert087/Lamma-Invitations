create table public.event_content (
  event_id uuid primary key references public.events (id) on delete cascade,
  headline_ar text,
  headline_en text,
  invitation_text_ar text,
  invitation_text_en text,
  host_names_ar text,
  host_names_en text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.event_experience (
  event_id uuid primary key references public.events (id) on delete cascade,
  experience_key text not null default 'minimal',
  theme_config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.event_sections (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  section_type text not null check (
    section_type in (
      'hero',
      'invitation-text',
      'event-details',
      'location',
      'countdown',
      'story',
      'gallery',
      'dress-code',
      'poll',
      'guestbook',
      'voice-message',
      'rsvp',
      'footer'
    )
  ),
  position integer not null check (position > 0),
  enabled boolean not null default true,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, position)
);

alter table public.event_content enable row level security;
alter table public.event_experience enable row level security;
alter table public.event_sections enable row level security;

grant select, insert, update, delete on public.event_content to authenticated;
grant select, insert, update, delete on public.event_experience to authenticated;
grant select, insert, update, delete on public.event_sections to authenticated;

create policy "Owners can manage their event content"
  on public.event_content for all
  to authenticated
  using (exists (select 1 from public.events where public.events.id = event_id and public.events.owner_id = (select auth.uid())))
  with check (exists (select 1 from public.events where public.events.id = event_id and public.events.owner_id = (select auth.uid())));

create policy "Owners can manage their event experience"
  on public.event_experience for all
  to authenticated
  using (exists (select 1 from public.events where public.events.id = event_id and public.events.owner_id = (select auth.uid())))
  with check (exists (select 1 from public.events where public.events.id = event_id and public.events.owner_id = (select auth.uid())));

create policy "Owners can manage their event sections"
  on public.event_sections for all
  to authenticated
  using (exists (select 1 from public.events where public.events.id = event_id and public.events.owner_id = (select auth.uid())))
  with check (exists (select 1 from public.events where public.events.id = event_id and public.events.owner_id = (select auth.uid())));

create function public.set_event_content_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke execute on function public.set_event_content_updated_at() from public;
revoke execute on function public.set_event_content_updated_at() from anon;
revoke execute on function public.set_event_content_updated_at() from authenticated;

create trigger set_event_content_updated_at
  before update on public.event_content
  for each row execute procedure public.set_event_content_updated_at();

create function public.set_event_experience_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke execute on function public.set_event_experience_updated_at() from public;
revoke execute on function public.set_event_experience_updated_at() from anon;
revoke execute on function public.set_event_experience_updated_at() from authenticated;

create trigger set_event_experience_updated_at
  before update on public.event_experience
  for each row execute procedure public.set_event_experience_updated_at();

create function public.set_event_sections_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke execute on function public.set_event_sections_updated_at() from public;
revoke execute on function public.set_event_sections_updated_at() from anon;
revoke execute on function public.set_event_sections_updated_at() from authenticated;

create trigger set_event_sections_updated_at
  before update on public.event_sections
  for each row execute procedure public.set_event_sections_updated_at();
