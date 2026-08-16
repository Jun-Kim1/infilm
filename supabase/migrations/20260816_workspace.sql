begin;

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  message text not null check (char_length(btrim(message)) between 1 and 1000),
  created_at timestamptz not null default now()
);

create table if not exists public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  event_date date not null,
  title text not null check (char_length(btrim(title)) between 1 and 80),
  created_by uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists chat_messages_project_created_idx
  on public.chat_messages(project_id, created_at);
create index if not exists calendar_events_project_date_idx
  on public.calendar_events(project_id, event_date);

create or replace function public.can_access_workspace(p_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select auth.uid() is not null and (
    exists (
      select 1 from public.projects p
       where p.id = p_project_id and p.creator_id = auth.uid()
    )
    or exists (
      select 1 from public.project_participants pp
       where pp.project_id = p_project_id
         and pp.user_id = auth.uid()
         and coalesce(pp.status, 'confirmed') = 'confirmed'
    )
  );
$$;

alter table public.chat_messages enable row level security;
alter table public.calendar_events enable row level security;

drop policy if exists workspace_chat_select on public.chat_messages;
create policy workspace_chat_select on public.chat_messages
for select to authenticated
using (public.can_access_workspace(project_id));

drop policy if exists workspace_chat_insert on public.chat_messages;
create policy workspace_chat_insert on public.chat_messages
for insert to authenticated
with check (
  sender_id = auth.uid()
  and public.can_access_workspace(project_id)
);

drop policy if exists workspace_calendar_select on public.calendar_events;
create policy workspace_calendar_select on public.calendar_events
for select to authenticated
using (public.can_access_workspace(project_id));

drop policy if exists workspace_calendar_insert on public.calendar_events;
create policy workspace_calendar_insert on public.calendar_events
for insert to authenticated
with check (
  created_by = auth.uid()
  and public.can_access_workspace(project_id)
);

create or replace function public.get_workspace_overview(p_project_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_target_count integer := 0;
  v_members jsonb := '[]'::jsonb;
begin
  if not public.can_access_workspace(p_project_id) then
    raise exception 'Workspace access denied' using errcode = '42501';
  end if;

  select coalesce(sum(rd.headcount), 0)::integer
    into v_target_count
    from public.recruitment_details rd
   where rd.project_id = p_project_id;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'user_id', pp.user_id,
        'display_name', coalesce(nullif(btrim(pr.display_name), ''), 'Crew ' || left(pp.user_id::text, 6)),
        'role_name', pp.role_name
      ) order by pp.created_at
    ),
    '[]'::jsonb
  )
    into v_members
    from public.project_participants pp
    left join public.profiles pr on pr.id = pp.user_id
   where pp.project_id = p_project_id
     and coalesce(pp.status, 'confirmed') = 'confirmed';

  return jsonb_build_object(
    'target_count', v_target_count,
    'joined_count', jsonb_array_length(v_members),
    'members', v_members
  );
end;
$$;

revoke all on function public.can_access_workspace(uuid) from public;
revoke all on function public.get_workspace_overview(uuid) from public;
grant execute on function public.can_access_workspace(uuid) to authenticated;
grant execute on function public.get_workspace_overview(uuid) to authenticated;
grant select, insert on public.chat_messages to authenticated;
grant select, insert on public.calendar_events to authenticated;

do $$
begin
  if not exists (
    select 1
      from pg_publication_tables
     where pubname = 'supabase_realtime'
       and schemaname = 'public'
       and tablename = 'chat_messages'
  ) then
    alter publication supabase_realtime add table public.chat_messages;
  end if;
end;
$$;

commit;
