create function public.get_published_invitation(p_slug text)
returns table (
  occasion_type text,
  title text,
  slug text,
  event_date date,
  venue_name text,
  location_url text,
  primary_locale text,
  headline text,
  invitation_text text,
  host_names text,
  experience_key text,
  sections jsonb
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
    event.venue_name,
    event.location_url,
    event.primary_locale,
    content.headline,
    content.invitation_text,
    content.host_names,
    experience.experience_key,
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'section_type', section.section_type,
          'position', section.position,
          'enabled', section.enabled
        ) order by section.position
      ) filter (where section.id is not null),
      '[]'::jsonb
    ) as sections
  from public.events as event
  join public.event_content as content on content.event_id = event.id
  join public.event_experience as experience on experience.event_id = event.id
  left join public.event_sections as section
    on section.event_id = event.id
    and section.enabled = true
  where event.slug = p_slug
    and event.status = 'published'
  group by
    event.occasion_type,
    event.title,
    event.slug,
    event.event_date,
    event.venue_name,
    event.location_url,
    event.primary_locale,
    content.headline,
    content.invitation_text,
    content.host_names,
    experience.experience_key;
$$;

revoke execute on function public.get_published_invitation(text) from public;
revoke execute on function public.get_published_invitation(text) from authenticated;
grant execute on function public.get_published_invitation(text) to anon;
grant execute on function public.get_published_invitation(text) to authenticated;
