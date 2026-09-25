-- Migration: Add client_draft_id and claim_guest_draft transactional RPC
-- Timestamp: 20260904100000

alter table public.events
  add column if not exists client_draft_id uuid,
  add column if not exists plan_id text not null default 'essential' check (plan_id in ('essential', 'premium')),
  add column if not exists payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'paid', 'refunded'));

-- Idempotency index: one client_draft_id per owner
create unique index if not exists events_owner_client_draft_id_idx
  on public.events (owner_id, client_draft_id)
  where client_draft_id is not null;

-- Atomic Transactional RPC to claim a guest draft for an authenticated user
create or replace function public.claim_guest_draft(
  p_client_draft_id uuid,
  p_occasion_type text,
  p_title text,
  p_event_date date default null,
  p_venue_name text default null,
  p_location_url text default null,
  p_template_id text default 'cinematic-wedding-story',
  p_headline text default null,
  p_invitation_text text default null,
  p_host_names text default null,
  p_countdown_enabled boolean default true,
  p_story_items jsonb default '[]'::jsonb
)
returns table (
  event_id uuid,
  slug text,
  is_existing boolean
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_owner_id uuid;
  v_existing_id uuid;
  v_existing_slug text;
  v_new_event_id uuid;
  v_base_slug text;
  v_slug text;
  v_item jsonb;
  v_item_position integer;
begin
  -- 1. Derive owner strictly from authenticated session
  v_owner_id := auth.uid();
  if v_owner_id is null then
    raise exception 'Authentication required to claim an invitation.';
  end if;

  if p_client_draft_id is null then
    raise exception 'client_draft_id is required.';
  end if;

  -- 2. Check for existing event with this client_draft_id (Idempotency)
  select e.id, e.slug into v_existing_id, v_existing_slug
  from public.events e
  where e.owner_id = v_owner_id and e.client_draft_id = p_client_draft_id
  limit 1;

  if v_existing_id is not null then
    return query select v_existing_id, v_existing_slug, true;
    return;
  end if;

  -- 3. Validate inputs
  if p_occasion_type not in (
    'wedding', 'engagement', 'katb-ketab', 'birthday', 'baby-shower',
    'graduation', 'party', 'anniversary', 'corporate-event', 'iftar-sohour', 'custom'
  ) then
    p_occasion_type := 'wedding';
  end if;

  if char_length(p_title) < 2 or char_length(p_title) > 120 then
    raise exception 'Title must be between 2 and 120 characters.';
  end if;

  -- Validate template_id against trusted registry
  if p_template_id not in ('cinematic-wedding-story', 'minimal') then
    p_template_id := 'cinematic-wedding-story';
  end if;

  -- 4. Generate unique slug
  v_base_slug := lower(regexp_replace(coalesce(nullif(trim(p_title), ''), 'invitation'), '[^a-zA-Z0-9\u0600-\u06FF]+', '-', 'g'));
  v_base_slug := trim(both '-' from v_base_slug);
  if v_base_slug = '' then
    v_base_slug := 'invitation';
  end if;
  v_slug := v_base_slug || '-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 6);

  -- 5. Insert public.events row
  insert into public.events (
    owner_id,
    occasion_type,
    title,
    slug,
    status,
    event_date,
    timezone,
    venue_name,
    location_url,
    primary_locale,
    client_draft_id,
    plan_id,
    payment_status
  ) values (
    v_owner_id,
    p_occasion_type,
    p_title,
    v_slug,
    'draft',
    p_event_date,
    'Africa/Cairo',
    p_venue_name,
    p_location_url,
    'ar',
    p_client_draft_id,
    'essential',
    'unpaid'
  ) returning id into v_new_event_id;

  -- 6. Insert public.event_content row
  insert into public.event_content (
    event_id,
    headline,
    invitation_text,
    host_names
  ) values (
    v_new_event_id,
    nullif(trim(p_headline), ''),
    nullif(trim(p_invitation_text), ''),
    nullif(trim(p_host_names), '')
  );

  -- 7. Insert public.event_experience row with trusted template_id
  insert into public.event_experience (
    event_id,
    experience_key,
    theme_config
  ) values (
    v_new_event_id,
    p_template_id,
    jsonb_build_object(
      'version', 1,
      'variant', 'editorial',
      'cover', jsonb_build_object('style', 'editorial'),
      'palette', 'warm',
      'typography', 'modern',
      'textScale', 'balanced'
    )
  );

  -- 8. Insert public.event_sections defaults
  insert into public.event_sections (event_id, section_type, position, enabled) values
    (v_new_event_id, 'hero', 1, true),
    (v_new_event_id, 'invitation-text', 2, coalesce(nullif(trim(p_invitation_text), '') is not null, true)),
    (v_new_event_id, 'event-details', 3, coalesce(p_event_date is not null or nullif(trim(p_venue_name), '') is not null, false)),
    (v_new_event_id, 'countdown', 4, coalesce(p_countdown_enabled and p_event_date is not null, false)),
    (v_new_event_id, 'story', 5, coalesce(jsonb_array_length(p_story_items) > 0, false)),
    (v_new_event_id, 'gallery', 6, true),
    (v_new_event_id, 'location', 7, coalesce(nullif(trim(p_location_url), '') is not null or nullif(trim(p_venue_name), '') is not null, false)),
    (v_new_event_id, 'footer', 8, true);

  -- 9. Insert public.event_story_items
  if p_story_items is not null and jsonb_typeof(p_story_items) = 'array' then
    v_item_position := 1;
    for v_item in select * from jsonb_array_elements(p_story_items) loop
      insert into public.event_story_items (
        event_id,
        title,
        body,
        date_label,
        position
      ) values (
        v_new_event_id,
        coalesce(nullif(trim(v_item->>'title'), ''), 'محطة من حكايتنا'),
        coalesce(nullif(trim(v_item->>'body'), ''), 'تفاصيل اللحظة الجميلة'),
        nullif(trim(v_item->>'date_label'), ''),
        coalesce((v_item->>'position')::integer, v_item_position)
      );
      v_item_position := v_item_position + 1;
    end loop;
  end if;

  -- 10. Return result
  return query select v_new_event_id, v_slug, false;
end;
$$;

revoke execute on function public.claim_guest_draft(uuid, text, text, date, text, text, text, text, text, text, boolean, jsonb) from public;
revoke execute on function public.claim_guest_draft(uuid, text, text, date, text, text, text, text, text, text, boolean, jsonb) from anon;
grant execute on function public.claim_guest_draft(uuid, text, text, date, text, text, text, text, text, text, boolean, jsonb) to authenticated;
