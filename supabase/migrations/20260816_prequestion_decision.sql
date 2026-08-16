begin;

-- One user can have only one immutable decision per project.
create unique index if not exists project_participants_project_user_uidx
  on public.project_participants (project_id, user_id);

-- A project must not expose multiple active questions to maybeSingle().
create unique index if not exists project_questions_one_active_uidx
  on public.project_questions (project_id)
  where is_active is true;

create or replace function public.answer_project_question(
  p_project_id uuid,
  p_role_name text,
  p_answer boolean
)
returns table(status text, created boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_creator_id uuid;
  v_closing_date date;
  v_required_answer boolean;
  v_has_question boolean := false;
  v_status text;
  v_created boolean := false;
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  select p.creator_id, p.closing_date
    into v_creator_id, v_closing_date
    from public.projects p
   where p.id = p_project_id;

  if not found then
    raise exception 'Project not found' using errcode = 'P0002';
  end if;
  if v_creator_id = v_user_id then
    raise exception 'Project creators cannot apply to their own project' using errcode = '42501';
  end if;
  if v_closing_date is not null and v_closing_date < current_date then
    raise exception 'Project recruitment is closed' using errcode = '22023';
  end if;

  select true, q.target_answer
    into v_has_question, v_required_answer
    from public.project_questions q
   where q.project_id = p_project_id
     and q.is_active is true
   limit 1;

  if v_has_question and v_required_answer is not null and p_answer is null then
    raise exception 'An answer is required' using errcode = '22004';
  end if;

  v_status := case
    when not v_has_question or v_required_answer is null then 'confirmed'
    when v_required_answer = p_answer then 'confirmed'
    else 'rejected'
  end;

  insert into public.project_participants (project_id, user_id, role_name, status)
  values (p_project_id, v_user_id, p_role_name, v_status)
  on conflict (project_id, user_id) do nothing
  returning project_participants.status into v_status;

  v_created := found;
  if not v_created then
    select coalesce(pp.status, 'confirmed')
      into v_status
      from public.project_participants pp
     where pp.project_id = p_project_id
       and pp.user_id = v_user_id;
  end if;

  return query select v_status, v_created;
end;
$$;

create or replace function public.cancel_project_participation(p_project_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_deleted boolean;
begin
  if auth.uid() is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  delete from public.project_participants pp
   where pp.project_id = p_project_id
     and pp.user_id = auth.uid()
     and coalesce(pp.status, 'confirmed') <> 'rejected';

  v_deleted := found;
  return v_deleted;
end;
$$;

create or replace function public.guard_participation_decision()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if auth.uid() = old.user_id then
    if tg_op = 'DELETE' and old.status = 'rejected' then
      raise exception 'Rejected applications cannot be deleted' using errcode = '42501';
    end if;
    if tg_op = 'UPDATE' and (
      new.status is distinct from old.status
      or new.project_id is distinct from old.project_id
      or new.user_id is distinct from old.user_id
    ) then
      raise exception 'Application decisions cannot be changed by applicants' using errcode = '42501';
    end if;
  end if;
  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

drop trigger if exists guard_participation_decision_trigger
  on public.project_participants;
create trigger guard_participation_decision_trigger
before update or delete on public.project_participants
for each row execute function public.guard_participation_decision();

-- New applications must go through the decision function. Existing confirmed
-- applications can still be cancelled, while the trigger protects rejections.
revoke insert on public.project_participants from anon, authenticated;
revoke all on function public.answer_project_question(uuid, text, boolean) from public;
revoke all on function public.cancel_project_participation(uuid) from public;
grant execute on function public.answer_project_question(uuid, text, boolean) to authenticated;
grant execute on function public.cancel_project_participation(uuid) to authenticated;

commit;
