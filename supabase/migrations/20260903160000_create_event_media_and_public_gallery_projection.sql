insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'invitation-media',
  'invitation-media',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create table public.event_media (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  media_type text not null check (media_type = 'image'),
  storage_path text not null unique check (char_length(storage_path) between 1 and 512),
  alt_text text check (char_length(alt_text) <= 240),
  position integer not null check (position > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, position)
);

create index event_media_event_id_position_idx on public.event_media (event_id, position);

alter table public.event_media enable row level security;
grant select, insert, update, delete on public.event_media to authenticated;

create policy "Owners can manage their event media"
  on public.event_media for all
  to authenticated
  using (
    exists (
      select 1 from public.events
      where public.events.id = event_id
        and public.events.owner_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.events
      where public.events.id = event_id
        and public.events.owner_id = (select auth.uid())
    )
  );

create function public.validate_event_media_insert()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_owner_id uuid;
begin
  select owner_id into v_owner_id from public.events where id = new.event_id;
  if v_owner_id is null or new.storage_path !~ ('^' || v_owner_id::text || '/' || new.event_id::text || '/[0-9a-f-]{36}[.](jpg|png|webp)$') then
    raise exception 'invalid media storage path';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(new.event_id::text, 0));
  if (select count(*) from public.event_media where event_id = new.event_id) >= 15 then
    raise exception 'gallery image limit reached';
  end if;

  return new;
end;
$$;

revoke execute on function public.validate_event_media_insert() from public;
revoke execute on function public.validate_event_media_insert() from anon;
revoke execute on function public.validate_event_media_insert() from authenticated;

create trigger validate_event_media_insert
  before insert on public.event_media
  for each row execute procedure public.validate_event_media_insert();

insert into public.event_sections (event_id, section_type, position, enabled)
select
  event.id,
  'gallery',
  coalesce((select max(section.position) from public.event_sections as section where section.event_id = event.id), 0) + 1,
  false
from public.events as event
where not exists (
  select 1 from public.event_sections as section
  where section.event_id = event.id and section.section_type = 'gallery'
);

create function public.set_event_media_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke execute on function public.set_event_media_updated_at() from public;
revoke execute on function public.set_event_media_updated_at() from anon;
revoke execute on function public.set_event_media_updated_at() from authenticated;

create trigger set_event_media_updated_at
  before update on public.event_media
  for each row execute procedure public.set_event_media_updated_at();

create policy "Owners can read invitation media objects"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'invitation-media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and exists (
      select 1 from public.events
      where public.events.id::text = (storage.foldername(name))[2]
        and public.events.owner_id = (select auth.uid())
    )
  );

create policy "Owners can upload invitation media objects"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'invitation-media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and name ~ ('^' || (select auth.uid())::text || '/[0-9a-f-]{36}/[0-9a-f-]{36}[.](jpg|png|webp)$')
    and exists (
      select 1 from public.events
      where public.events.id::text = (storage.foldername(name))[2]
        and public.events.owner_id = (select auth.uid())
    )
  );

create policy "Owners can update invitation media objects"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'invitation-media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and name ~ ('^' || (select auth.uid())::text || '/[0-9a-f-]{36}/[0-9a-f-]{36}[.](jpg|png|webp)$')
    and exists (
      select 1 from public.events
      where public.events.id::text = (storage.foldername(name))[2]
        and public.events.owner_id = (select auth.uid())
    )
  )
  with check (
    bucket_id = 'invitation-media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and name ~ ('^' || (select auth.uid())::text || '/[0-9a-f-]{36}/[0-9a-f-]{36}[.](jpg|png|webp)$')
    and exists (
      select 1 from public.events
      where public.events.id::text = (storage.foldername(name))[2]
        and public.events.owner_id = (select auth.uid())
    )
  );

create policy "Owners can delete invitation media objects"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'invitation-media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and exists (
      select 1 from public.events
      where public.events.id::text = (storage.foldername(name))[2]
        and public.events.owner_id = (select auth.uid())
    )
  );

drop function public.get_published_invitation(text);

create function public.get_published_invitation(p_slug text)
returns table (
  occasion_type text,
  title text,
  slug text,
  event_date date,
  timezone text,
  venue_name text,
  location_url text,
  primary_locale text,
  headline text,
  invitation_text text,
  host_names text,
  experience_key text,
  theme_config jsonb,
  sections jsonb,
  story jsonb
)
language sql
security definer
set search_path = ''
as $$
  select
    event.occasion_type,
    event.title,
    event.slug,
    event.event_date,
    event.timezone,
    event.venue_name,
    event.location_url,
    event.primary_locale,
    content.headline,
    content.invitation_text,
    content.host_names,
    experience.experience_key,
    jsonb_build_object(
      'version', 1,
      'variant', case when experience.theme_config ->> 'variant' in ('editorial', 'statement', 'split', 'framed', 'soft-organic', 'dark-modern') then experience.theme_config ->> 'variant' else 'editorial' end,
      'cover', jsonb_build_object('style', case when experience.theme_config #>> '{cover,style}' in ('editorial', 'centered', 'statement') then experience.theme_config #>> '{cover,style}' else 'editorial' end),
      'palette', case when experience.theme_config ->> 'palette' in ('warm', 'soft', 'botanical', 'midnight', 'celebration') then experience.theme_config ->> 'palette' else 'warm' end,
      'typography', case when experience.theme_config ->> 'typography' in ('modern', 'elegant', 'classic', 'editorial', 'friendly') then experience.theme_config ->> 'typography' else 'modern' end,
      'textScale', case when experience.theme_config ->> 'textScale' in ('compact', 'balanced', 'expressive') then experience.theme_config ->> 'textScale' else 'balanced' end
    ),
    coalesce(jsonb_agg(jsonb_build_object('section_type', section.section_type, 'position', section.position, 'enabled', section.enabled) order by section.position) filter (where section.id is not null), '[]'::jsonb),
    coalesce((select jsonb_agg(jsonb_build_object('title', item.title, 'body', item.body, 'date_label', item.date_label, 'position', item.position) order by item.position) from public.event_story_items as item where item.event_id = event.id and exists (select 1 from public.event_sections as story_section where story_section.event_id = event.id and story_section.section_type = 'story' and story_section.enabled = true)), '[]'::jsonb)
  from public.events as event
  join public.event_content as content on content.event_id = event.id
  join public.event_experience as experience on experience.event_id = event.id
  left join public.event_sections as section on section.event_id = event.id and section.enabled = true
  where event.slug = p_slug and event.status = 'published'
  group by event.id, event.occasion_type, event.title, event.slug, event.event_date, event.timezone, event.venue_name, event.location_url, event.primary_locale, content.headline, content.invitation_text, content.host_names, experience.experience_key, experience.theme_config;
$$;

revoke execute on function public.get_published_invitation(text) from public;
revoke execute on function public.get_published_invitation(text) from authenticated;
grant execute on function public.get_published_invitation(text) to anon;
grant execute on function public.get_published_invitation(text) to authenticated;

create function public.get_published_invitation_media(p_slug text)
returns table (
  storage_path text,
  alt_text text,
  media_position integer
)
language sql
security definer
set search_path = ''
as $$
  select
    media.storage_path,
    media.alt_text,
    media.position as media_position
  from public.events as event
  join public.event_sections as gallery_section
    on gallery_section.event_id = event.id
    and gallery_section.section_type = 'gallery'
    and gallery_section.enabled = true
  join public.event_media as media on media.event_id = event.id
  where event.slug = p_slug
    and event.status = 'published'
  order by media.position;
$$;

revoke all on function public.get_published_invitation_media(text) from public;
revoke all on function public.get_published_invitation_media(text) from anon;
revoke all on function public.get_published_invitation_media(text) from authenticated;
grant execute on function public.get_published_invitation_media(text) to service_role;
