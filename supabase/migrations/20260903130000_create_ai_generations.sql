create table public.ai_generations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  event_id uuid not null references public.events (id) on delete cascade,
  feature text not null check (feature = 'invitation-creator'),
  status text not null check (status in ('pending', 'succeeded', 'failed', 'rejected')),
  model text not null check (char_length(model) between 1 and 128),
  input_characters integer not null check (input_characters between 0 and 1200),
  input_tokens integer check (input_tokens >= 0),
  output_tokens integer check (output_tokens >= 0),
  total_tokens integer check (total_tokens >= 0),
  latency_ms integer check (latency_ms >= 0),
  created_at timestamptz not null default now()
);

alter table public.ai_generations enable row level security;
grant select on public.ai_generations to authenticated;
create policy "Users can read their own AI generation usage" on public.ai_generations for select to authenticated using ((select auth.uid()) = owner_id);

create index ai_generations_owner_id_created_at_idx on public.ai_generations (owner_id, created_at);

create function public.reserve_ai_invitation_generation(p_event_id uuid, p_model text, p_input_characters integer)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_user_id uuid := auth.uid();
  generation_id uuid;
  generation_limit integer := greatest(coalesce(nullif(current_setting('app.ai_daily_generation_limit', true), '')::integer, 10), 1);
begin
  if v_user_id is null then raise exception 'not authorized'; end if;
  if p_model is null or char_length(btrim(p_model)) = 0 or char_length(p_model) > 128 then raise exception 'invalid model'; end if;
  if p_input_characters is null or p_input_characters < 0 or p_input_characters > 1200 then raise exception 'invalid input characters'; end if;

  perform pg_advisory_xact_lock(hashtextextended(v_user_id::text, 0));

  if not exists (select 1 from public.events where id = p_event_id and owner_id = v_user_id and status <> 'archived') then raise exception 'not authorized'; end if;
  if p_model <> 'mock' and (select count(*) from public.ai_generations where owner_id = v_user_id and model <> 'mock' and created_at >= (date_trunc('day', now() at time zone 'utc') at time zone 'utc')) >= generation_limit then raise exception 'daily generation limit reached'; end if;
  insert into public.ai_generations (owner_id, event_id, feature, status, model, input_characters) values (v_user_id, p_event_id, 'invitation-creator', 'pending', btrim(p_model), p_input_characters) returning id into generation_id;
  return generation_id;
end;
$$;

create function public.complete_ai_invitation_generation(p_generation_id uuid, p_status text, p_input_tokens integer, p_output_tokens integer, p_total_tokens integer, p_latency_ms integer)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then raise exception 'not authorized'; end if;
  if p_status not in ('succeeded', 'failed', 'rejected') then raise exception 'invalid status'; end if;
  if (p_input_tokens is not null and p_input_tokens < 0) or (p_output_tokens is not null and p_output_tokens < 0) or (p_total_tokens is not null and p_total_tokens < 0) or (p_latency_ms is not null and p_latency_ms < 0) then raise exception 'invalid usage values'; end if;

  update public.ai_generations
  set status = p_status, input_tokens = p_input_tokens, output_tokens = p_output_tokens, total_tokens = p_total_tokens, latency_ms = p_latency_ms
  where id = p_generation_id and owner_id = v_user_id and status = 'pending';

  if not found then raise exception 'generation is not pending or not authorized'; end if;
end;
$$;

revoke all on function public.reserve_ai_invitation_generation(uuid, text, integer) from public;
revoke all on function public.complete_ai_invitation_generation(uuid, text, integer, integer, integer, integer) from public;
revoke all on function public.reserve_ai_invitation_generation(uuid, text, integer) from anon;
revoke all on function public.complete_ai_invitation_generation(uuid, text, integer, integer, integer, integer) from anon;
grant execute on function public.reserve_ai_invitation_generation(uuid, text, integer) to authenticated;
grant execute on function public.complete_ai_invitation_generation(uuid, text, integer, integer, integer, integer) to authenticated;
