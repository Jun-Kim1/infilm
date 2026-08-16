-- Profile onboarding survey and privacy-safe host summaries.
-- InFilm stores application profiles in public.profiles; auth.users remains
-- managed by Supabase Auth and is never exposed to the browser.

alter table public.profiles
  add column if not exists is_profile_verified boolean not null default false,
  add column if not exists experience_count varchar(50),
  add column if not exists roles text[] not null default '{}'::text[],
  add column if not exists major_background varchar(50),
  add column if not exists equipments text[] not null default '{}'::text[],
  add column if not exists collaboration_style varchar(100),
  add column if not exists bio text,
  add column if not exists verified_at timestamptz;

alter table public.profiles
  drop constraint if exists profiles_experience_count_check,
  add constraint profiles_experience_count_check check (
    experience_count is null or experience_count in (
      '첫 도전 (0회)', '1~3회', '4~10회', '10회 이상'
    )
  ),
  drop constraint if exists profiles_major_background_check,
  add constraint profiles_major_background_check check (
    major_background is null or major_background in (
      '전공자 (재학/졸업)', '비전공 독학/동아리', '취미/입문'
    )
  ),
  drop constraint if exists profiles_collaboration_style_check,
  add constraint profiles_collaboration_style_check check (
    collaboration_style is null or collaboration_style in (
      '타이트한 단편 영화제 출품용',
      '실험적이고 자유로운 워크숍',
      '친목 기반 가벼운 릴스/숏폼'
    )
  ),
  drop constraint if exists profiles_roles_check,
  add constraint profiles_roles_check check (
    roles <@ array[
      '연출/각본', '촬영/조명', '음향', '미술/소품',
      '편집/후반', '배우', '제작/기획'
    ]::text[]
  ),
  drop constraint if exists profiles_equipments_check,
  add constraint profiles_equipments_check check (
    equipments <@ array[
      '미러리스/시네마 카메라', '마이크/레코더', '조명',
      '프리미어/다빈치', '없음 (몸만 참여)'
    ]::text[]
    and not (
      '없음 (몸만 참여)' = any(equipments)
      and cardinality(equipments) > 1
    )
  ),
  drop constraint if exists profiles_bio_check,
  add constraint profiles_bio_check check (
    bio is null or (
      char_length(btrim(bio)) between 1 and 240
      and cardinality(regexp_split_to_array(btrim(bio), E'\r?\n')) <= 2
    )
  ),
  drop constraint if exists profiles_verified_payload_check,
  add constraint profiles_verified_payload_check check (
    not is_profile_verified or (
      experience_count is not null
      and cardinality(roles) > 0
      and major_background is not null
      and collaboration_style is not null
      and bio is not null
      and char_length(btrim(bio)) > 0
      and verified_at is not null
    )
  );

alter table public.profiles enable row level security;

-- Restrictive means this ownership guard is AND-ed with any existing
-- permissive UPDATE policy instead of accidentally widening access.
drop policy if exists profile_survey_update_own_guard on public.profiles;
create policy profile_survey_update_own_guard
on public.profiles
as restrictive
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create or replace function public.save_profile_survey(
  p_experience_count text,
  p_roles text[],
  p_major_background text,
  p_equipments text[] default '{}'::text[],
  p_collaboration_style text default null,
  p_bio text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_roles text[] := coalesce(p_roles, '{}'::text[]);
  v_equipments text[] := coalesce(p_equipments, '{}'::text[]);
  v_bio text := btrim(regexp_replace(coalesce(p_bio, ''), E'\r\n?', E'\n', 'g'));
  v_now timestamptz := now();
  v_result jsonb;
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  if p_experience_count is null or p_experience_count not in (
    '첫 도전 (0회)', '1~3회', '4~10회', '10회 이상'
  ) then
    raise exception 'Invalid experience_count' using errcode = '22023';
  end if;

  if cardinality(v_roles) = 0
     or not (v_roles <@ array[
       '연출/각본', '촬영/조명', '음향', '미술/소품',
       '편집/후반', '배우', '제작/기획'
     ]::text[])
     or cardinality(v_roles) <> (
       select count(distinct role_value)::integer from unnest(v_roles) role_value
     ) then
    raise exception 'Invalid roles' using errcode = '22023';
  end if;

  if p_major_background is null or p_major_background not in (
    '전공자 (재학/졸업)', '비전공 독학/동아리', '취미/입문'
  ) then
    raise exception 'Invalid major_background' using errcode = '22023';
  end if;

  if not (v_equipments <@ array[
       '미러리스/시네마 카메라', '마이크/레코더', '조명',
       '프리미어/다빈치', '없음 (몸만 참여)'
     ]::text[])
     or cardinality(v_equipments) <> (
       select count(distinct equipment_value)::integer from unnest(v_equipments) equipment_value
     )
     or (
       '없음 (몸만 참여)' = any(v_equipments)
       and cardinality(v_equipments) > 1
     ) then
    raise exception 'Invalid equipments' using errcode = '22023';
  end if;

  if p_collaboration_style is null or p_collaboration_style not in (
    '타이트한 단편 영화제 출품용',
    '실험적이고 자유로운 워크숍',
    '친목 기반 가벼운 릴스/숏폼'
  ) then
    raise exception 'Invalid collaboration_style' using errcode = '22023';
  end if;

  if char_length(v_bio) < 1
     or char_length(v_bio) > 240
     or cardinality(regexp_split_to_array(v_bio, E'\n')) > 2 then
    raise exception 'Bio must be 1-240 characters and at most 2 lines' using errcode = '22023';
  end if;

  -- Repair legacy auth accounts that do not yet have a public profile row.
  insert into public.profiles (id, user_email, display_name)
  select
    au.id,
    au.email,
    coalesce(
      nullif(btrim(au.raw_user_meta_data ->> 'display_name'), ''),
      nullif(split_part(au.email, '@', 1), ''),
      'InFilm member'
    )
  from auth.users au
  where au.id = v_user_id
  on conflict (id) do nothing;

  update public.profiles
  set experience_count = p_experience_count,
      roles = v_roles,
      major_background = p_major_background,
      equipments = v_equipments,
      collaboration_style = p_collaboration_style,
      bio = v_bio,
      is_profile_verified = true,
      verified_at = coalesce(verified_at, v_now)
  where id = v_user_id
  returning jsonb_build_object(
    'id', id,
    'display_name', display_name,
    'is_profile_verified', is_profile_verified,
    'experience_count', experience_count,
    'roles', roles,
    'major_background', major_background,
    'equipments', equipments,
    'collaboration_style', collaboration_style,
    'bio', bio,
    'verified_at', verified_at
  ) into v_result;

  if v_result is null then
    raise exception 'Profile could not be saved' using errcode = 'P0001';
  end if;

  return v_result;
end;
$$;

create or replace function public.get_my_profile_survey()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (
      select jsonb_build_object(
        'id', pr.id,
        'display_name', pr.display_name,
        'is_profile_verified', pr.is_profile_verified,
        'experience_count', pr.experience_count,
        'roles', pr.roles,
        'major_background', pr.major_background,
        'equipments', pr.equipments,
        'collaboration_style', pr.collaboration_style,
        'bio', pr.bio,
        'verified_at', pr.verified_at
      )
      from public.profiles pr
      where pr.id = auth.uid()
    ),
    jsonb_build_object(
      'id', auth.uid(),
      'display_name', null,
      'is_profile_verified', false,
      'roles', '[]'::jsonb,
      'equipments', '[]'::jsonb
    )
  );
$$;

create or replace function public.get_project_host_profiles(p_project_ids uuid[])
returns table (
  project_id uuid,
  creator_id uuid,
  display_name text,
  is_profile_verified boolean,
  experience_count text,
  roles text[],
  major_background text,
  equipments text[],
  collaboration_style text,
  bio text,
  verified_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    p.id as project_id,
    p.creator_id,
    coalesce(nullif(btrim(pr.display_name), ''), 'InFilm host') as display_name,
    coalesce(pr.is_profile_verified, false) as is_profile_verified,
    case when pr.is_profile_verified then pr.experience_count end,
    case when pr.is_profile_verified then pr.roles else '{}'::text[] end,
    case when pr.is_profile_verified then pr.major_background end,
    case when pr.is_profile_verified then pr.equipments else '{}'::text[] end,
    case when pr.is_profile_verified then pr.collaboration_style end,
    case when pr.is_profile_verified then pr.bio end,
    case when pr.is_profile_verified then pr.verified_at end
  from public.projects p
  left join public.profiles pr on pr.id = p.creator_id
  where p.id = any(coalesce(p_project_ids, '{}'::uuid[]))
    and cardinality(coalesce(p_project_ids, '{}'::uuid[])) <= 100;
$$;

revoke all on function public.save_profile_survey(text, text[], text, text[], text, text) from public;
revoke all on function public.get_my_profile_survey() from public;
revoke all on function public.get_project_host_profiles(uuid[]) from public;

grant execute on function public.save_profile_survey(text, text[], text, text[], text, text) to authenticated;
grant execute on function public.get_my_profile_survey() to authenticated;
grant execute on function public.get_project_host_profiles(uuid[]) to anon, authenticated;

comment on function public.get_project_host_profiles(uuid[]) is
  'Returns only the non-sensitive, user-approved survey summary used by project host badges.';
