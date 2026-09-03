create table public.event_story_items (
  id uuid primary key default gen_random_uuid(), event_id uuid not null references public.events (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 160), body text not null check (char_length(body) between 1 and 2000), date_label text check (char_length(date_label) <= 80),
  position integer not null check (position > 0), created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique (event_id, position)
);
alter table public.event_story_items enable row level security;
grant select, insert, update, delete on public.event_story_items to authenticated;
create policy "Owners manage their event story items" on public.event_story_items for all to authenticated using (exists (select 1 from public.events where public.events.id = event_id and public.events.owner_id = (select auth.uid()))) with check (exists (select 1 from public.events where public.events.id = event_id and public.events.owner_id = (select auth.uid())));
create function public.set_event_story_items_updated_at() returns trigger language plpgsql set search_path = '' as $$ begin new.updated_at = now(); return new; end; $$;
revoke execute on function public.set_event_story_items_updated_at() from public; revoke execute on function public.set_event_story_items_updated_at() from anon; revoke execute on function public.set_event_story_items_updated_at() from authenticated;
create trigger set_event_story_items_updated_at before update on public.event_story_items for each row execute procedure public.set_event_story_items_updated_at();
