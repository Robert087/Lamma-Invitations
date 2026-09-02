alter table public.event_content
  add column headline text,
  add column invitation_text text,
  add column host_names text;

update public.event_content
set
  headline = coalesce(nullif(headline_ar, ''), nullif(headline_en, '')),
  invitation_text = coalesce(nullif(invitation_text_ar, ''), nullif(invitation_text_en, '')),
  host_names = coalesce(nullif(host_names_ar, ''), nullif(host_names_en, ''));

alter table public.event_content
  drop column headline_ar,
  drop column headline_en,
  drop column invitation_text_ar,
  drop column invitation_text_en,
  drop column host_names_ar,
  drop column host_names_en;
