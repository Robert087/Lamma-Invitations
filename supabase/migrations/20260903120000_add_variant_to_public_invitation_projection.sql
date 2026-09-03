drop function public.get_published_invitation(text);

create function public.get_published_invitation(p_slug text)
returns table (
  occasion_type text, title text, slug text, event_date date, venue_name text, location_url text, primary_locale text,
  headline text, invitation_text text, host_names text, experience_key text, theme_config jsonb, sections jsonb
)
language sql
security definer
set search_path = ''
as $$
  select event.occasion_type, event.title, event.slug, event.event_date, event.venue_name, event.location_url, event.primary_locale,
    content.headline, content.invitation_text, content.host_names, experience.experience_key,
    jsonb_build_object(
      'version', 1,
      'variant', case when experience.theme_config ->> 'variant' in ('editorial', 'statement', 'split', 'framed', 'soft-organic', 'dark-modern') then experience.theme_config ->> 'variant' else 'editorial' end,
      'cover', jsonb_build_object('style', case when experience.theme_config #>> '{cover,style}' in ('editorial', 'centered', 'statement') then experience.theme_config #>> '{cover,style}' else 'editorial' end),
      'palette', case when experience.theme_config ->> 'palette' in ('warm', 'soft', 'botanical', 'midnight', 'celebration') then experience.theme_config ->> 'palette' else 'warm' end,
      'typography', case when experience.theme_config ->> 'typography' in ('modern', 'elegant', 'classic', 'editorial', 'friendly') then experience.theme_config ->> 'typography' else 'modern' end,
      'textScale', case when experience.theme_config ->> 'textScale' in ('compact', 'balanced', 'expressive') then experience.theme_config ->> 'textScale' else 'balanced' end
    ),
    coalesce(jsonb_agg(jsonb_build_object('section_type', section.section_type, 'position', section.position, 'enabled', section.enabled) order by section.position) filter (where section.id is not null), '[]'::jsonb)
  from public.events as event
  join public.event_content as content on content.event_id = event.id
  join public.event_experience as experience on experience.event_id = event.id
  left join public.event_sections as section on section.event_id = event.id and section.enabled = true
  where event.slug = p_slug and event.status = 'published'
  group by event.occasion_type, event.title, event.slug, event.event_date, event.venue_name, event.location_url, event.primary_locale, content.headline, content.invitation_text, content.host_names, experience.experience_key, experience.theme_config;
$$;

revoke execute on function public.get_published_invitation(text) from public;
revoke execute on function public.get_published_invitation(text) from authenticated;
grant execute on function public.get_published_invitation(text) to anon;
grant execute on function public.get_published_invitation(text) to authenticated;
