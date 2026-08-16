begin;

create index if not exists chat_messages_project_cursor_idx
  on public.chat_messages(project_id, created_at desc, id desc);

create or replace function public.get_workspace_chat_page(
  p_project_id uuid,
  p_before_created_at timestamptz default null,
  p_before_id uuid default null,
  p_page_size integer default 50
)
returns table (
  id uuid,
  sender_id uuid,
  message text,
  created_at timestamptz
)
language sql
stable
security invoker
set search_path = public
as $function$
  select m.id, m.sender_id, m.message, m.created_at
    from public.chat_messages m
   where m.project_id = p_project_id
     and (
       p_before_created_at is null
       or p_before_id is null
       or (m.created_at, m.id) < (p_before_created_at, p_before_id)
     )
   order by m.created_at desc, m.id desc
   limit least(greatest(coalesce(p_page_size, 50), 1), 100) + 1;
$function$;

revoke all on function public.get_workspace_chat_page(uuid, timestamptz, uuid, integer) from public;
grant execute on function public.get_workspace_chat_page(uuid, timestamptz, uuid, integer) to authenticated;

commit;
