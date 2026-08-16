-- Open project discovery must behave the same before and after login.
-- The project catalogue and recruitment requirements are already public to
-- anonymous visitors; include authenticated users in the same read policy.

alter table public.projects enable row level security;
alter table public.recruitment_details enable row level security;

drop policy if exists projects_discovery_select on public.projects;
create policy projects_discovery_select
on public.projects
as permissive
for select
to anon, authenticated
using (true);

drop policy if exists recruitment_details_discovery_select on public.recruitment_details;
create policy recruitment_details_discovery_select
on public.recruitment_details
as permissive
for select
to anon, authenticated
using (true);

comment on policy projects_discovery_select on public.projects is
  'Open recruiting projects are readable in discovery both before and after login.';

comment on policy recruitment_details_discovery_select on public.recruitment_details is
  'Public role and headcount requirements used by project discovery cards.';
