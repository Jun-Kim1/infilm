begin;

create or replace function public.get_workspace_overview(p_project_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_target_count integer := 1;
  v_members jsonb := '[]'::jsonb;
begin
  if not public.can_access_workspace(p_project_id) then
    raise exception 'Workspace access denied' using errcode = '42501';
  end if;

  select 1 + coalesce(sum(rd.headcount), 0)::integer
    into v_target_count
    from public.recruitment_details rd
   where rd.project_id = p_project_id;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'user_id', member_rows.user_id,
        'display_name', member_rows.display_name,
        'role_name', member_rows.role_name
      ) order by member_rows.sort_order, member_rows.joined_at
    ),
    '[]'::jsonb
  )
    into v_members
    from (
      select
        p.creator_id as user_id,
        coalesce(pr.display_name, 'Crew member') as display_name,
        'project_creator'::text as role_name,
        0 as sort_order,
        p.created_at as joined_at
      from public.projects p
      left join public.profiles pr on pr.id = p.creator_id
      where p.id = p_project_id

      union all

      select
        pp.user_id,
        coalesce(pr.display_name, 'Crew member') as display_name,
        pp.role_name,
        1 as sort_order,
        pp.created_at as joined_at
      from public.project_participants pp
      join public.projects p on p.id = pp.project_id
      left join public.profiles pr on pr.id = pp.user_id
      where pp.project_id = p_project_id
        and coalesce(pp.status, 'confirmed') = 'confirmed'
        and pp.user_id <> p.creator_id
    ) member_rows;

  return jsonb_build_object(
    'target_count', v_target_count,
    'joined_count', jsonb_array_length(v_members),
    'members', v_members
  );
end;
$$;

revoke all on function public.get_workspace_overview(uuid) from public;
grant execute on function public.get_workspace_overview(uuid) to authenticated;

commit;
