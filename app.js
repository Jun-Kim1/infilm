/* --- SUPABASE ------------------------------------------- */
const SUPABASE_URL = "https://fexwivtwuxsrjfrkqgam.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_8JpAW0UnLFAGErcJw26Zig_5_30AJ1a";
const INTERNAL_API_BASE = "https://cinetmi.onrender.com";

const { normalizeRequiredAnswer, evaluatePreQuestion } = window.InFilmPreQuestion;

const sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession:   true,
    storage:          window.localStorage,
    autoRefreshToken: true
  }
});
console.log("[Supabase] Client initialized →", SUPABASE_URL);

async function signUpUser(email, password, displayName) {
  const { data, error } = await sbClient.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } }
  });
  if (error || !data.user) {
    return { user: null, session: null, error };
  }
  // Insert profile row so user_email is never NULL
  const { error: profileError } = await sbClient.from("profiles").insert({
    id:           data.user.id,
    user_email:   email,
    display_name: displayName || null
  });
  if (profileError) {
    console.error("[profiles] insert failed:", profileError.message);
    // Non-fatal — auth succeeded; profile can be repaired later
  }
  return { user: data.user, session: data.session ?? null, error: null };
}

async function signInUser(email, password) {
  const { data, error } = await sbClient.auth.signInWithPassword({ email, password });
  return { user: data?.user ?? null, session: data?.session ?? null, error };
}

/* ── I18N DICTIONARY ─────────────────────────────────────── */
const i18n = {
  en: {
    "nav.discover": "Discover", "nav.plans": "Plans", "nav.create": "Create",
    "nav.project": "Project", "nav.mypage": "My Page", "nav.hub": "Collab Hub",
    "auth.login": "Log in", "auth.logout": "Log out",
    "drawer.title": "Notifications",
    "discover.label": "DISCOVERY", "discover.open": "0 open",
    "discover.title1": "Find the right crew", "discover.title2": "or join the right project",
    "discover.sub": "Discover the set that fits you best by role, region, and shooting period.",
    "discover.banner.title1": "Find the right set by role, region, and shooting period.",
    "discover.banner.title2": "Discover the project that fits you.",
    "discover.banner.sub": "Choose your preferences and quickly find the right project.",
    "discover.footer": "More projects loading as crews publish their calls",
    "global.label": "01 - GLOBAL",
    "global.title": "Regional recruiting activity",
    "global.sub": "See where active projects are running across Korea.",
    "global.empty": "No active projects to show yet.",
    "global.viewMap": "View map",
    "global.modalTitle": "Regional recruiting activity",
    "filter.role.label": "ROLE", "filter.region.label": "REGION", "filter.status.label": "STATUS",
    "filter.period.label": "PERIOD", "filter.period.all": "All periods",
    "filter.period.thisWeek": "This week", "filter.period.nextWeek": "Next week",
    "filter.period.thisMonth": "This month", "filter.period.nextMonth": "Next month",
    "a11y.serviceMenu": "Toggle service menu", "a11y.mainNavigation": "Main navigation",
    "a11y.toggleLanguage": "Toggle language", "a11y.notifications": "Notifications",
    "a11y.discoverBanner": "Discover hero banner", "a11y.discoverFilters": "Discover filters",
    "a11y.search": "Search", "a11y.serviceSwitcher": "Service switcher",
    "status.all": "All", "status.open": "Recruiting", "status.closed": "Closed",
    "create.f.deadline": "Recruitment deadline",
    "role.all": "All roles", "role.director": "Director", "role.screenwriter": "Screenwriter",
    "role.editor": "Editor", "role.cinematographer": "Cinematographer",
    "role.actor": "Actor", "role.composer": "Composer", "role.leadactor": "Lead Actor",
    "role.assdirector": "Asst. Director",
    "role.maleactor": "Male Actor", "role.femaleactor": "Female Actor",
    "role.filming": "Filming", "role.music": "Music",
    "role.editing": "Editing", "role.script": "Script",
    "region.all": "All regions", "region.seoul": "Seoul",
    "region.gyeonggi": "Gyeonggi", "region.incheon": "Incheon",
    "region.gangwon": "Gangwon",
    "region.chungbuk": "Chungbuk", "region.chungnam": "Chungnam",
    "region.daejeon": "Daejeon", "region.sejong": "Sejong",
    "region.jeonbuk": "Jeonbuk", "region.jeonnam": "Jeonnam",
    "region.gwangju": "Gwangju",
    "region.gyeongbuk": "Gyeongbuk", "region.gyeongnam": "Gyeongnam",
    "region.daegu": "Daegu", "region.busan": "Busan",
    "region.ulsan": "Ulsan", "region.jeju": "Jeju",
    "region.nationwide": "Nationwide",
    "card.join": "Join",
    "card1.genre": "Thriller Short", "card1.title": "Glass Corridor",
    "card1.location": "Seoul", "card1.date": "Aug 25 \u2013 Aug 26",
    "card1.tag1": "Editor \u00d72", "card1.tag2": "Age 21\u201340",
    "card2.genre": "Drama Pilot", "card2.title": "Warm Static",
    "card2.location": "Gyeonggi", "card2.date": "Sep 03 \u2013 Sep 06",
    "card2.tag1": "Lead actor \u00d71", "card2.tag2": "Nationwide",
    "card3.genre": "Mystery Feature", "card3.title": "Noon in Black",
    "card3.location": "Nationwide", "card3.date": "Sep 11 \u2013 Sep 23",
    "card3.tag1": "Composer \u00d71", "card3.tag2": "Remote",
    "plans.label": "PLANS",
    "plans.title1": "Transparent limits,", "plans.title2": "clear upgrade path",
    "plans.sub": "Choose the plan that fits your production cadence.",
    "plan.popular": "Popular", "plan.period": "/ month",
    "plan.basic.name": "Basic", "plan.basic.btn": "Use Basic",
    "plan.basic.li1": "1 project creation per month",
    "plan.basic.li2": "Up to 3 join requests per month",
    "plan.basic.li3": "1 pre-screen question per role",
    "plan.basic.li4": "View one review per member",
    "plan.basic.li5": "Chat unlocks after full team assembly",
    "plan.premium.name": "Premium", "plan.premium.btn": "Upgrade",
    "plan.premium.li1": "5 project creations per month",
    "plan.premium.li2": "Up to 10 join requests per month",
    "plan.premium.li3": "Unlimited pre-screen questions",
    "plan.premium.li4": "Advanced review & rating restrictions",
    "plan.premium.li5": "Calendar, invites, file attachments",
    "create.label": "CREATE PROJECT",
    "create.title1": "Build your production", "create.title2": "brief",
    "create.sub": "Define roles, region, and pre-screening.",
    "create.f.ownrole": "Your role", "create.f.ownrole.ph": "Select a role",
    "create.f.title": "Project title", "create.f.title.ph": "Ex: Glass Corridor",
    "create.f.desc": "Project content",
    "create.f.desc.ph": "Brief, tone, objectives, and collaboration expectations.",
    "create.f.region": "Region", "create.f.region.hint": "(max 5)",
    "create.f.fields": "Recruiting fields",
    "create.f.headcount": "Headcount", "create.f.age": "Age",
    "create.f.career": "Career", "create.f.career.any": "Any",
    "create.f.career.1y": "1yr+", "create.f.career.3y": "3yr+", "create.f.career.5y": "5yr+",
    "create.f.actorrole": "Actor role",
    "create.f.actorrole.lead": "Lead",
    "create.f.actorrole.support": "Supporting",
    "create.f.actorrole.bit": "Bit part",
    "create.f.slot": "Slot",
    "create.f.preq": "Pre-screen question",
    "create.f.preq.opt": "(optional)",
    "preq.none": "No question set",
    "preq.set": "Set question",
    "preq.change": "Edit",
    "preq.title": "Pre-screening question",
    "preq.ph": "Enter a Yes/No question (e.g. Do you have 1+ year of on-set experience?)",
    "preq.opt.none": "Accept all applicants",
    "preq.opt.yes": "Accept ‘Yes’ answers only",
    "preq.opt.no": "Accept ‘No’ answers only",
    "preq.answer.yes": "Yes",
    "preq.answer.no": "No",
    "preq.answer.title": "Pre-screening question",
    "preq.answer.autojoin": "You are automatically approved.",
    "preq.answer.waiting": "Your application is pending manual review.",
    "preq.answer.cancelled": "Application cancelled.",
    "preq.answer.loadError": "Unable to verify the pre-screening question. Please try again.",
    "preq.answer.saveError": "Unable to save your application. Please try again.",
    "preq.answer.rejected": "Your answer does not match the project requirements. You cannot apply again.",
    "preq.answer.approved": "You have successfully joined the project!",
    "preq.answer.alreadyRejected": "You cannot reapply because your previous answer did not meet the requirements.",
    "preq.answer.alreadyApplied": "You have already applied to this project.",
    "preq.done": "Done",
    "create.submit": "Publish project",
    "project.label": "PROJECTS",
    "project.stats.title1": "Platform", "project.stats.title2": "at a glance",
    "project.stats.sub": "Cumulative activity across all InFilm productions.",
    "stat.projects": "Projects", "stat.participants": "Participants", "stat.active": "Recruiting",
    "stat.by.role": "By recruitment field",
    "project.slots.label": "Open positions",
    "slot.filled": "filled",
    "mypage.label": "MY PAGE", "mypage.title": "Your projects",
    "mypage.created": "Created", "mypage.joined": "Joined",
    "btn.edit": "Edit", "btn.delete": "Delete", "btn.cancel": "Cancel", "btn.save": "Save",
    "edit.project.title": "Edit project", "notif.project.deleted": "Project deleted.",
    "status.complete": "Completed",
    "ws.label": "WORKSPACE", "ws.back": "My Page",
    "ws.tab.chat": "Chat", "ws.tab.calendar": "Calendar",
    "ws.chat.ph": "Write a message\u2026", "ws.chat.send": "Send",
    "ws.event.ph": "Event title", "ws.event.add": "Add",
    "ws.status.active": "Active", "ws.open": "Workspace",
    "modal.login.title": "Log in", "modal.signup.title": "Create account",
    "modal.email": "Email", "modal.pass": "Password", "modal.name": "Display name",
    "taste.title": "Register your film taste",
    "taste.step1.copy": "Select one movie before completing sign-up.",
    "taste.step2.copy": "Share your TMI or recommendation for the movie you picked.",
    "taste.search.ph": "Search movie title",
    "taste.search.btn": "Search",
    "taste.search.empty": "No movie results found.",
    "taste.search.needKey": "Movie search API is not configured.",
    "taste.search.error": "Failed to search movies.",
    "taste.next": "Next",
    "taste.back": "Back",
    "taste.submit": "Finish sign-up",
    "taste.category.label": "Category",
    "taste.category.ph": "Select category",
    "taste.category.story": "Story",
    "taste.category.directing": "Directing",
    "taste.category.acting": "Acting",
    "taste.category.miseen": "Mise-en-scene",
    "taste.category.behind": "Behind",
    "taste.category.chat": "Chat",
    "taste.category.homage": "Homage",
    "taste.comment.label": "Reason",
    "taste.comment.ph": "Tell us why you recommend this movie.",
    "taste.selected": "Selected movie",
    "taste.validation.movie": "Please select a movie.",
    "taste.validation.category": "Please choose a category.",
    "taste.validation.content": "Please write your reason.",
    "taste.partial": "Sign-up succeeded, but CineTMI save failed.",
    "taste.saved": "Taste registration saved.",
    "modal.cancel": "Cancel", "modal.continue": "Continue",
    "modal.toSignup": "Need an account? Sign up", "modal.toLogin": "Already have an account? Log in",
    "modal.no": "No", "modal.yes": "Yes, continue",
    "confirm.join.title": "Confirm participation",
    "confirm.join.body": "If you cancel after joining, a 1.5 USD penalty may apply. Continue?",
    "confirm.cancel.title": "Cancel participation",
    "confirm.cancel.body": "Cancelling triggers a 1.5 USD penalty and removes collaboration access.",
    "confirm.invite.title": "Invite team member",
    "confirm.invite.body": "Send an invite by email to add a member to this project hub.",
    "notif.created": "Project created successfully.",
    "notif.hub.open": "Team assembly complete. Collaboration hub is open.",
    "notif.login": "Logged in successfully.",
    "notif.signup": "Account created. Welcome to InFilm.",
    "notif.logout": "You logged out.",
    "notif.chat": "New chat message posted.",
    "notif.invited": "Member invitation sent.",
    "notif.review": "Review submitted.",
    "notif.participation.cancelled": "Participation cancelled. Penalty payment queued.",
    "notif.participation.done": "Participation complete. Check My Page for active joins.",
    "notif.plan.active": "%s plan is now active."
  },
  ko: {
    "nav.discover": "탐색", "nav.plans": "플랜", "nav.create": "만들기",
    "nav.project": "프로젝트", "nav.mypage": "마이페이지", "nav.hub": "협업 허브",
    "auth.login": "로그인", "auth.logout": "로그아웃",
    "drawer.title": "알림",
    "discover.label": "작품 탐색", "discover.open": "0개 모집 중",
    "discover.title1": "번거로움 없이 딱 맞는 크루를 찾거나,",
    "discover.title2": "프로젝트에 참여하세요",
    "discover.sub": "역할, 지역, 촬영 기간으로 당신에게 딱 맞는 현장을 발견하세요.",
    "discover.banner.title1": "역할, 지역, 촬영 기간으로",
    "discover.banner.title2": "당신에게 딱 맞는 현장을 발견하세요.",
    "discover.banner.sub": "지금 바로 조건을 선택하고 원하는 프로젝트를 빠르게 찾아보세요.",
    "discover.footer": "새 프로젝트가 계속 추가되고 있습니다",
    "global.label": "01 - GLOBAL",
    "global.title": "지역별 모집 현황",
    "global.sub": "한국 각 지역에서 활발히 진행 중인 프로젝트를 한눈에 확인하세요.",
    "global.empty": "표시할 활성 프로젝트가 아직 없습니다.",
    "global.viewMap": "맵으로 보기",
    "global.modalTitle": "지역별 모집 현황",
    "filter.role.label": "역할", "filter.region.label": "지역", "filter.status.label": "모집 상태",
    "filter.period.label": "기간", "filter.period.all": "전체 기간",
    "filter.period.thisWeek": "이번 주", "filter.period.nextWeek": "다음 주",
    "filter.period.thisMonth": "이번 달", "filter.period.nextMonth": "다음 달",
    "a11y.serviceMenu": "서비스 메뉴 열기/닫기", "a11y.mainNavigation": "주요 탐색 메뉴",
    "a11y.toggleLanguage": "언어 전환", "a11y.notifications": "알림",
    "a11y.discoverBanner": "프로젝트 탐색 배너", "a11y.discoverFilters": "프로젝트 탐색 필터",
    "a11y.search": "검색", "a11y.serviceSwitcher": "서비스 전환 메뉴",
    "status.all": "전체", "status.open": "모집 중", "status.closed": "종료",
    "create.f.deadline": "모집 마감일",
    "role.all": "전체 역할", "role.director": "감독", "role.screenwriter": "작가",
    "role.editor": "에디터", "role.cinematographer": "촬영감독",
    "role.actor": "배우", "role.composer": "음악감독", "role.leadactor": "주연 배우",
    "role.assdirector": "조연출",
    "role.maleactor": "남배우", "role.femaleactor": "여배우",
    "role.filming": "촬영", "role.music": "음악",
    "role.editing": "편집", "role.script": "각본",
    "region.all": "전체 지역", "region.seoul": "서울",
    "region.gyeonggi": "경기", "region.incheon": "인천",
    "region.gangwon": "강원",
    "region.chungbuk": "충북", "region.chungnam": "충남",
    "region.daejeon": "대전", "region.sejong": "세종",
    "region.jeonbuk": "전북", "region.jeonnam": "전남",
    "region.gwangju": "광주",
    "region.gyeongbuk": "경북", "region.gyeongnam": "경남",
    "region.daegu": "대구", "region.busan": "부산",
    "region.ulsan": "울산", "region.jeju": "제주",
    "region.nationwide": "전국",
    "card.join": "참여하기",
    "card1.genre": "스릴러 단편", "card1.title": "Glass Corridor",
    "card1.location": "서울", "card1.date": "8월 25일 – 26일",
    "card1.tag1": "에디터 ×2", "card1.tag2": "21–40세",
    "card2.genre": "드라마 파일럿", "card2.title": "Warm Static",
    "card2.location": "경기", "card2.date": "9월 3일 – 6일",
    "card2.tag1": "주연 배우 ×1", "card2.tag2": "전국",
    "card3.genre": "미스터리 장편", "card3.title": "Noon in Black",
    "card3.location": "전국", "card3.date": "9월 11일 – 23일",
    "card3.tag1": "음악감독 ×1", "card3.tag2": "원격",
    "plans.label": "플랜",
    "plans.title1": "명확한 한도,", "plans.title2": "쉬운 업그레이드 경로",
    "plans.sub": "제작 빈도에 맞는 플랜을 선택하세요.",
    "plan.popular": "인기", "plan.period": "/ 월",
    "plan.basic.name": "기본형", "plan.basic.btn": "기본형 사용",
    "plan.basic.li1": "월 1개 프로젝트 생성",
    "plan.basic.li2": "월 최대 3회 참여 요청",
    "plan.basic.li3": "역할당 사전질문 1개",
    "plan.basic.li4": "멤버당 리뷰 1개 열람",
    "plan.basic.li5": "팀 완성 후 채팅 활성화",
    "plan.premium.name": "프리미엄", "plan.premium.btn": "업그레이드",
    "plan.premium.li1": "월 5개 프로젝트 생성",
    "plan.premium.li2": "월 최대 10회 참여 요청",
    "plan.premium.li3": "사전질문 무제한",
    "plan.premium.li4": "고급 리뷰 및 평점 제한",
    "plan.premium.li5": "캘린더, 초대, 파일 첨부",
    "create.label": "프로젝트 만들기",
    "create.title1": "프로덕션 브리핑을", "create.title2": "작성하세요",
    "create.sub": "역할, 지역, 사전 질문을 정의하세요.",
    "create.f.ownrole": "본인 역할", "create.f.ownrole.ph": "역할 선택",
    "create.f.title": "프로젝트 이름", "create.f.title.ph": "예: Glass Corridor",
    "create.f.desc": "프로젝트 내용",
    "create.f.desc.ph": "제작 의도, 톤, 목표, 협업 기대치를 설명해주세요.",
    "create.f.region": "지역", "create.f.region.hint": "(최대 5개)",
    "create.f.fields": "모집 분야",
    "create.f.headcount": "모집인원", "create.f.age": "나이",
    "create.f.career": "경력", "create.f.career.any": "경력 무관",
    "create.f.career.1y": "1년 이상", "create.f.career.3y": "3년 이상", "create.f.career.5y": "5년 이상",
    "create.f.actorrole": "배우 역할",
    "create.f.actorrole.lead": "주연",
    "create.f.actorrole.support": "조연",
    "create.f.actorrole.bit": "단역",
    "create.f.slot": "지원자",
    "create.f.preq": "사전 질문",
    "create.f.preq.opt": "(선택사항)",
    "preq.none": "설정된 질문이 없습니다",
    "preq.set": "질문 설정",
    "preq.change": "수정",
    "preq.title": "사전 질문 설정",
    "preq.ph": "Yes/No로 답할 수 있는 질문을 입력하세요",
    "preq.opt.none": "모든 지원자 받기",
    "preq.opt.yes": "‘네’로 답변한 지원자만 받기",
    "preq.opt.no": "‘아니오’로 답변한 지원자만 받기",
    "preq.answer.yes": "네",
    "preq.answer.no": "아니오",
    "preq.answer.title": "사전 질문",
    "preq.answer.autojoin": "자동으로 참여 승인되었습니다.",
    "preq.answer.waiting": "관리자 수동 승인 대기 중입니다.",
    "preq.answer.cancelled": "지원을 취소했습니다.",
    "preq.answer.loadError": "사전 질문을 확인하지 못했습니다. 다시 시도해 주세요.",
    "preq.answer.saveError": "지원 결과를 저장하지 못했습니다. 다시 시도해 주세요.",
    "preq.answer.rejected": "프로젝트 성격과 맞지 않아 지원할 수 없습니다. 이 프로젝트에는 다시 지원할 수 없습니다.",
    "preq.answer.approved": "프로젝트에 참여하게 되었습니다!",
    "preq.answer.alreadyRejected": "이전 답변이 지원 조건과 맞지 않아 다시 지원할 수 없습니다.",
    "preq.answer.alreadyApplied": "이미 참여 이력이 있는 프로젝트입니다.",
    "preq.done": "완료",
    "create.submit": "프로젝트 공고",
    "project.label": "프로젝트",
    "project.stats.title1": "분야별", "project.stats.title2": "참여 현황",
    "project.stats.sub": "인필름 전체 프로젝트 누적 통계입니다.",
    "stat.projects": "프로젝트", "stat.participants": "누적 참여자", "stat.active": "모집 중",
    "stat.by.role": "모집 분야별 참여 현황",
    "project.slots.label": "공석 현황",
    "slot.filled": "완료됨",
    "mypage.label": "마이페이지", "mypage.title": "내 프로젝트",
    "mypage.created": "생성한 프로젝트", "mypage.joined": "참여한 프로젝트",
    "btn.edit": "편집", "btn.delete": "삭제", "btn.cancel": "취소", "btn.save": "저장",
    "edit.project.title": "프로젝트 편집", "notif.project.deleted": "프로젝트가 삭제되었습니다.",
    "status.complete": "완료",
    "ws.label": "워크스페이스", "ws.back": "마이페이지",
    "ws.tab.chat": "채팅", "ws.tab.calendar": "캘린더",
    "ws.chat.ph": "메시지를 입력하세요…", "ws.chat.send": "전송",
    "ws.event.ph": "일정 제목", "ws.event.add": "추가",
    "ws.status.active": "참여 중", "ws.open": "워크스페이스",
    "modal.login.title": "로그인", "modal.signup.title": "계정 만들기",
    "modal.email": "이메일", "modal.pass": "비밀번호", "modal.name": "표시 이름",
    "taste.title": "영화 취향 등록",
    "taste.step1.copy": "당신이 가장 좋아하는 영화 한 편을 선택해 주세요.",
    "taste.step2.copy": "당신이 선택한 영화에 대해 당신만 아는 TMI 혹은 추천하고 싶은 이유를 들려주세요.",
    "taste.search.ph": "영화 제목 검색",
    "taste.search.btn": "검색",
    "taste.search.empty": "검색 결과가 없습니다.",
    "taste.search.needKey": "영화 검색 API가 설정되지 않았습니다.",
    "taste.search.error": "영화 검색에 실패했습니다.",
    "taste.next": "다음",
    "taste.back": "이전",
    "taste.submit": "가입 완료",
    "taste.category.label": "카테고리",
    "taste.category.ph": "카테고리 선택",
    "taste.category.story": "스토리",
    "taste.category.directing": "감독",
    "taste.category.acting": "배우",
    "taste.category.miseen": "미장센",
    "taste.category.behind": "비하인드",
    "taste.category.chat": "잡담",
    "taste.category.homage": "오마주",
    "taste.comment.label": "추천 이유",
    "taste.comment.ph": "이 영화를 추천하는 이유를 작성해 주세요.",
    "taste.selected": "선택한 영화",
    "taste.validation.movie": "영화를 선택해 주세요.",
    "taste.validation.category": "카테고리를 선택해 주세요.",
    "taste.validation.content": "추천 이유를 입력해 주세요.",
    "taste.partial": "회원가입은 완료됐지만 CineTMI 저장에 실패했습니다.",
    "taste.saved": "영화 취향 정보가 저장되었습니다.",
    "modal.cancel": "취소", "modal.continue": "계속",
    "modal.toSignup": "계정이 없으신가요? 회원가입", "modal.toLogin": "이미 계정이 있으신가요? 로그인",
    "modal.no": "아니요", "modal.yes": "네, 계속하기",
    "confirm.join.title": "참여 확인",
    "confirm.join.body": "참여 후 취소 시 최대 $1.5의 패널티가 부과될 수 있습니다. 계속하시겠습니까?",
    "confirm.cancel.title": "참여 취소",
    "confirm.cancel.body": "취소하면 $1.5 패널티가 부과되고 협업 채널 접근이 제한됩니다.",
    "confirm.invite.title": "멤버 초대",
    "confirm.invite.body": "이메일 초대를 통해 이 프로젝트 허브에 멤버를 추가합니다.",
    "notif.created": "프로젝트가 성공적으로 게시되었습니다.",
    "notif.hub.open": "팀 구성이 완료되었습니다. 협업 허브가 열렸습니다.",
    "notif.login": "로그인되었습니다.",
    "notif.signup": "계정이 생성되었습니다. InFilm에 오신 것을 환영합니다.",
    "notif.logout": "로그아웃되었습니다.",
    "notif.chat": "새 채팅 메시지가 입력되었습니다.",
    "notif.invited": "멤버 초대가 발송되었습니다.",
    "notif.review": "리뷰가 제출되었습니다.",
    "notif.participation.cancelled": "참여가 취소되었습니다. 패널티 결제가 예약되었습니다.",
    "notif.participation.done": "참여가 완료되었습니다. 마이페이지에서 확인하세요.",
    "notif.plan.active": "%s 플랜이 활성화되었습니다."
  }
};

/* ── STATE ────────────────────────────────────────────────── */
let lang = "en";

const state = {
  authed: false,
  plan: "Basic",
  notifications: []
};

/* ── DOM REFERENCES ───────────────────────────────────────── */
const screens        = [...document.querySelectorAll(".screen")];
const navItems       = [...document.querySelectorAll(".nav-item")];
const projectList    = document.getElementById("projectList");
const roleJoinBtns   = [...document.querySelectorAll(".role-join")];
const notifyDrawer   = document.getElementById("notifyDrawer");
const drawerOverlay  = document.getElementById("drawerOverlay");
const serviceSidebar = document.getElementById("serviceSidebar");
const serviceSidebarBackdrop = document.getElementById("serviceSidebarBackdrop");
const svcToggleBtn   = document.getElementById("svcToggleBtn");
const notifyBtn      = document.getElementById("notifyBtn");
const notifyDot      = document.getElementById("notifyDot");
const closeNotify    = document.getElementById("closeNotify");
const notifyList     = document.getElementById("notifyList");
const langToggle     = document.getElementById("langToggle");
const authBtn        = document.getElementById("authBtn");
const authBtnText    = document.getElementById("authBtnText");
const authDialog     = document.getElementById("authDialog");
const authTitle      = document.getElementById("authTitle");
const authSwitch     = document.getElementById("authSwitch");
const authCancel     = document.getElementById("authCancel");
const signupNameWrap = document.getElementById("signupNameWrap");
const authForm       = document.getElementById("authForm");
const authMessage    = document.getElementById("authMessage");
const authStepAccount = document.getElementById("authStepAccount");
const authStepTaste   = document.getElementById("authStepTaste");
const tasteStepMovie     = document.getElementById("tasteStepMovie");
const tasteStepTmi       = document.getElementById("tasteStepTmi");
const tasteMovieQuery    = document.getElementById("tasteMovieQuery");
const tasteMovieSearchBtn = document.getElementById("tasteMovieSearchBtn");
const tasteMovieResults  = document.getElementById("tasteMovieResults");
const tasteMovieSelected = document.getElementById("tasteMovieSelected");
const tasteStepNextBtn   = document.getElementById("tasteStepNextBtn");
const tasteStepBackBtn   = document.getElementById("tasteStepBackBtn");
const tasteCategory      = document.getElementById("tasteCategory");
const tasteStep2Copy     = document.getElementById("tasteStep2Copy");
const tasteContent       = document.getElementById("tasteContent");
const tasteSubmitBtn     = document.getElementById("tasteSubmitBtn");
const tasteSignupCancel  = document.getElementById("tasteSignupCancel");
const tasteSignupMessage = document.getElementById("tasteSignupMessage");
const createForm     = document.getElementById("createForm");
const createdList    = document.getElementById("createdList");
const confirmDialog  = document.getElementById("confirmDialog");
const confirmTitle   = document.getElementById("confirmTitle");
const confirmBody    = document.getElementById("confirmBody");
const confirmYes     = document.getElementById("confirmYes");
const editProjectDialog  = document.getElementById("editProjectDialog");
const editProjTitle      = document.getElementById("editProjTitle");
// editProjDesc is now a Quill editor — see quillEditDesc init below
const editProjectSaveBtn = document.getElementById("editProjectSaveBtn");
const editProjectCancelBtn = document.getElementById("editProjectCancelBtn");
const preqDialog       = document.getElementById("preqDialog");
const preqAnswerDialog = document.getElementById("preqAnswerDialog");
const preqAnswerQ      = document.getElementById("preqAnswerQ");
const preqAnswerYes    = document.getElementById("preqAnswerYes");
const preqAnswerNo     = document.getElementById("preqAnswerNo");
const chatForm       = document.getElementById("chatForm");
const chatInput      = document.getElementById("chatInput");
const chatLog        = document.getElementById("chatLog");
const roleFilter     = document.getElementById("roleFilter");
const regionFilter   = document.getElementById("regionFilter");
const globalMapSummary = document.getElementById("globalMapSummary");
let   projects       = [];   // populated by loadDiscoverProjects()

let authMode     = "login";
let confirmAction = null;
let currentUser  = null;
let chatChannel  = null;
let currentPreq  = { text: "", required: "none" };
let discoverProjectsLoadId = 0;
let pendingSignupDraft = null;
let selectedTasteMovie = null;
let signupFlowState = "account";
let selectedRegionCard = null;
let tasteSearchDebounceTimer = null;
let tasteSearchRequestSeq = 0;

const REGION_CITY_LOOKUP = Object.freeze({
  seoul:      { labels: { ko: "서울", en: "Seoul" } },
  gyeonggi:   { labels: { ko: "경기", en: "Gyeonggi" } },
  incheon:    { labels: { ko: "인천", en: "Incheon" } },
  gangwon:    { labels: { ko: "강원", en: "Gangwon" } },
  chungbuk:   { labels: { ko: "충북", en: "Chungbuk" } },
  chungnam:   { labels: { ko: "충남", en: "Chungnam" } },
  daejeon:    { labels: { ko: "대전", en: "Daejeon" } },
  sejong:     { labels: { ko: "세종", en: "Sejong" } },
  jeonbuk:    { labels: { ko: "전북", en: "Jeonbuk" } },
  jeonnam:    { labels: { ko: "전남", en: "Jeonnam" } },
  gwangju:    { labels: { ko: "광주", en: "Gwangju" } },
  gyeongbuk:  { labels: { ko: "경북", en: "Gyeongbuk" } },
  gyeongnam:  { labels: { ko: "경남", en: "Gyeongnam" } },
  daegu:      { labels: { ko: "대구", en: "Daegu" } },
  busan:      { labels: { ko: "부산", en: "Busan" } },
  ulsan:      { labels: { ko: "울산", en: "Ulsan" } },
  jeju:       { labels: { ko: "제주", en: "Jeju" } }
});

/* ── I18N APPLY ───────────────────────────────────────────── */
function t(key) {
  return i18n[lang][key] || key;
}

function applyLang(l) {
  lang = l;
  document.documentElement.lang = l === "ko" ? "ko" : "en";
  langToggle.innerHTML = l === "en"
    ? '<span class="lang-curr">EN</span> / <span class="lang-alt">KO</span>'
    : '<span class="lang-alt">EN</span> / <span class="lang-curr">KO</span>';

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const val = i18n[l][el.dataset.i18n];
    if (val !== undefined) el.textContent = val;
  });
  document.querySelectorAll("[data-i18n-ph]").forEach(el => {
    const val = i18n[l][el.dataset.i18nPh];
    if (val !== undefined) el.placeholder = val;
  });
  document.querySelectorAll("[data-i18n-aria]").forEach(el => {
    const val = i18n[l][el.dataset.i18nAria];
    if (val !== undefined) el.setAttribute("aria-label", val);
  });

  updateAuthCopy();
  renderIdentity();
  renderNotifications();
  // sync custom select displayed labels after text update
  document.querySelectorAll(".csel").forEach(csel => {
    const sel = csel.querySelector(`.csel-opt[data-value="${csel.dataset.value}"]`);
    if (sel) csel.querySelector(".csel-label").textContent = sel.textContent;
  });
  updateTasteStep2Copy();
  loadRoleStats();
  loadDiscoverProjects();   // re-render cards with translated role/region labels
}

function getTasteCategoryValue() {
  if (!tasteCategory) return "";
  if (typeof tasteCategory.value === "string") return tasteCategory.value;
  return tasteCategory.dataset.value || "";
}

function setTasteCategoryValue(value) {
  if (!tasteCategory) return;
  if (typeof tasteCategory.value === "string") {
    tasteCategory.value = value;
    return;
  }
  setCselValue(tasteCategory, value);
}

function updateTasteStep2Copy() {
  if (!tasteStep2Copy) return;
  const selectedMovieTitle = selectedTasteMovie?.title || (lang === "ko" ? "영화" : "movie");
  if (lang === "ko") {
    tasteStep2Copy.textContent = `당신이 선택한 ${selectedMovieTitle}! 이 영화에 대해 당신만 아는 TMI 혹은 추천하고 싶은 이유를 들려주세요.`;
    return;
  }
  tasteStep2Copy.textContent = `You picked ${selectedMovieTitle}! Tell us your TMI or why you want to recommend this film.`;
}

/* ── SCREEN NAV ───────────────────────────────────────────── */
function setScreen(id) {
  screens.forEach(s => s.classList.toggle("active", s.id === id));
  navItems.forEach(item => item.classList.toggle("active", item.dataset.screen === id));
}

/* ── PROJECT STATS ────────────────────────────────────────── */
async function loadProjectStats(projectId) {
  const [
    { count: partCount, error: pcErr },
    { data:  recData,  error: rcErr  },
    { data:  projRow,  error: prErr  }
  ] = await Promise.all([
    sbClient.from("project_participants")
      .select("*", { count: "exact", head: true })
      .eq("project_id", projectId),
    sbClient.from("recruitment_details")
      .select("headcount")
      .eq("project_id", projectId),
    sbClient.from("projects")
      .select("closing_date")
      .eq("id", projectId)
      .single()
  ]);

  if (pcErr) console.error("[stats] participants count error:", pcErr.message);
  if (rcErr) console.error("[stats] recruitment details error:", rcErr.message);
  if (prErr) console.error("[stats] project fetch error:", prErr.message);

  const totalSlots = (recData || []).reduce((sum, r) => sum + (r.headcount || 0), 0);
  const isActive   = projRow?.closing_date ? new Date(projRow.closing_date) > new Date() : true;

  document.getElementById("statProjects").textContent     = totalSlots > 0 ? totalSlots : "–";
  document.getElementById("statParticipants").textContent = partCount ?? 0;
  document.getElementById("statActive").textContent       = isActive
    ? (lang === "ko" ? "모집 중" : "Open")
    : (lang === "ko" ? "마감"   : "Closed");

  const kpiSlots  = document.getElementById("kpiLabelSlots");
  const kpiStatus = document.getElementById("kpiLabelStatus");
  if (kpiSlots)  kpiSlots.textContent  = lang === "ko" ? "모집 인원" : "Open Slots";
  if (kpiStatus) kpiStatus.textContent = lang === "ko" ? "모집 상태" : "Status";
}

async function loadRoleStats(projectId) {
  const el = document.getElementById("roleStatBars");
  if (!el) return;
  let query = sbClient.from("recruitment_details").select("role_name, headcount");
  if (projectId) query = query.eq("project_id", projectId);
  const { data, error } = await query;
  if (error || !data || data.length === 0) {
    el.innerHTML = `<p class="card-empty">${lang === "ko" ? "역할 데이터가 없습니다." : "No role data yet."}</p>`;
    return;
  }
  const counts = {};
  data.forEach(r => { counts[r.role_name] = (counts[r.role_name] || 0) + (r.headcount || 1); });
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const max  = entries[0][1];
  const unit = lang === "ko" ? "명" : "";
  el.innerHTML = entries.map(([role, count]) => {
    const pct      = Math.round(count / max * 100);
    const roleLabel = t("role." + role) || role;
    return `<div class="stat-bar-row">
      <span class="stat-bar-role">${escapeHtml(roleLabel)}</span>
      <div class="stat-bar-track"><div class="stat-bar-fill" style="width:${pct}%"></div></div>
      <span class="stat-bar-count">${count}${unit}</span>
    </div>`;
  }).join("");
}

async function loadMyPage() {
  const createdEl    = document.getElementById("createdList");
  const joinedEl     = document.getElementById("joinedList");
  const emptyCreated = `<li class="empty-item">${lang === "ko" ? "생성한 프로젝트가 없습니다." : "No projects created."}</li>`;
  const emptyJoined  = `<li class="empty-item">${lang === "ko" ? "참여 중인 프로젝트가 없습니다." : "No projects joined."}</li>`;
  // Live session check — never rely on potentially stale global
  const { data: { session } } = await sbClient.auth.getSession();
  const userId = session?.user?.id;
  if (!userId) {
    createdEl.innerHTML = emptyCreated;
    joinedEl.innerHTML  = emptyJoined;
    return;
  }
  // Keep global in sync with the live session
  currentUser = session.user;

  // Step 1: fetch created projects + raw participation rows in parallel
  // Note: plain select avoids embedded-FK-join and status-column issues pre-migration
  const [{ data: created, error: ce }, { data: participations, error: pe }] = await Promise.all([
    sbClient.from("projects")
      .select("id, title")
      .eq("creator_id", userId)
      .order("created_at", { ascending: false }),
    sbClient.from("project_participants")
      .select("project_id")
      .eq("user_id", userId)
      .or("status.eq.confirmed,status.is.null")
      .order("created_at", { ascending: false })
  ]);

  if (ce) console.error("[mypage] created query error:", ce.message);
  if (pe) console.error("[mypage] participations query error:", pe.message);
  console.log("[mypage] participation rows:", participations);

  // Step 2: look up project titles for each participation row
  let joined = [];
  if (!pe && participations?.length) {
    const ids = participations.map(p => p.project_id).filter(Boolean);
    if (ids.length) {
      const { data: joinedProjects, error: je } = await sbClient
        .from("projects").select("id, title").in("id", ids);
      if (je) console.error("[mypage] joined-projects lookup error:", je.message);
      joined = joinedProjects || [];
    }
  }
  console.log("[mypage] joined projects resolved:", joined);

  createdEl.innerHTML = (!ce && created?.length)
    ? created.map(p => `<li class="list-item" data-project-id="${p.id}">
        <span>${escapeHtml(p.title)}</span>
        <div class="item-actions">
          <button class="micro-btn ws-open-btn">${t("ws.open")}</button>
          <button class="micro-btn edit-project-btn">${t("btn.edit")}</button>
          <button class="micro-btn danger delete-project-btn">${t("btn.delete")}</button>
        </div>
      </li>`).join("")
    : emptyCreated;
  joinedEl.innerHTML = (!pe && joined.length)
    ? joined.map(p => `<li class="list-item joined-card" data-project-id="${p.id}">
        <div class="joined-info">
          <span class="joined-title">${escapeHtml(p.title)}</span>
          <span class="status-pill active">${t("ws.status.active")}</span>
        </div>
        <div class="item-actions">
          <button class="micro-btn ws-open-btn">${t("ws.open")}</button>
          <button class="micro-btn danger cancel-join-btn">${t("btn.cancel")}</button>
        </div>
      </li>`).join("")
    : emptyJoined;
}

let statsIsLoading = false;

async function showProjectStats() {
  if (statsIsLoading) return;            // prevent double-tap / re-entrant calls
  statsIsLoading = true;

  const { data: { session } } = await sbClient.auth.getSession();
  if (!session?.user) {
    statsIsLoading = false;
    authMode = "login"; updateAuthCopy(); authDialog.showModal();
    return;
  }

  // ── 1. Navigate immediately and enter loading state ──────────────
  const detailModal = document.getElementById("projectDetailModal");
  if (detailModal?.open) detailModal.close();
  document.getElementById("projectStatsPanel").classList.remove("hidden");
  document.getElementById("projectDetailPanel").classList.add("hidden");
  setScreen("project");

  const kpiIds = ["statProjects", "statParticipants", "statActive"];
  kpiIds.forEach(id => { document.getElementById(id).textContent = "…"; });
  document.getElementById("roleStatBars").innerHTML =
    `<p class="card-empty">${lang === "ko" ? "불러오는 중…" : "Loading…"}</p>`;

  // ── 2. Fetch all projects owned by current user ───────────────────
  console.log("[stats] session.user.id:", session.user.id);
  const { data: owned, error: ownedErr } = await sbClient
    .from("projects")
    .select("id, title")
    .eq("creator_id", session.user.id)
    .order("created_at", { ascending: false });

  console.log("Fetched Projects:", owned);
  if (ownedErr) console.error("[stats] fetch error (check RLS SELECT policy on 'projects'):", ownedErr);

  // ── 3a. Query error — show diagnostic message, NOT "create project" ─
  if (ownedErr) {
    kpiIds.forEach(id => { document.getElementById(id).textContent = "!"; });
    document.getElementById("roleStatBars").innerHTML =
      `<p class="card-empty" style="color:var(--cta)">
         ${lang === "ko" ? "데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요." : "Failed to load data. Please try again."}
         <br><small style="opacity:.5">${ownedErr.message}</small>
       </p>`;
    statsIsLoading = false;
    return;
  }

  // ── 3b. Genuine empty — user really has no projects yet ───────────
  if (!owned.length) {
    showToast(lang === "ko"
      ? "프로젝트를 먼저 생성해야 이 화면에 접근할 수 있습니다."
      : "Create a project first to access this area.");
    kpiIds.forEach(id => { document.getElementById(id).textContent = "–"; });
    document.getElementById("roleStatBars").innerHTML = "";
    statsIsLoading = false;
    return;
  }

  // ── 4. Success — populate project picker if needed ────────────────
  const selectorWrap = document.getElementById("projectSelectorWrap");
  const selector     = document.getElementById("projectSelector");
  if (owned.length > 1) {
    selector.innerHTML = owned
      .map(p => `<option value="${escapeHtml(p.id)}">${escapeHtml(p.title)}</option>`)
      .join("");
    selectorWrap.classList.remove("hidden");
    selector.onchange = () => {
      loadProjectStats(selector.value);
      loadRoleStats(selector.value);
    };
  } else {
    selectorWrap.classList.add("hidden");
  }

  statsIsLoading = false;
  const firstId = owned[0].id;
  loadProjectStats(firstId);
  loadRoleStats(firstId);
}


function getRoleColorClass(roleName) {
  const n = (roleName || "").toLowerCase();
  if (["maleactor","femaleactor","actor","leadactor"].includes(n))  return "rc--actor";
  if (["director","assdirector"].includes(n))                       return "rc--director";
  if (["screenwriter","script"].includes(n))                        return "rc--script";
  if (["cinematographer","filming"].includes(n))                    return "rc--camera";
  if (["editor","editing"].includes(n))                             return "rc--edit";
  if (["composer","music"].includes(n))                             return "rc--music";
  return "rc--default";
}

async function loadProjectDetail(projectId) {
  console.log("[join] Step 1: loadProjectDetail called — projectId:", projectId);
  try {
    const { data: proj, error } = await sbClient
      .from("projects")
      .select("id, title, description, regions, closing_date, creator_id, recruitment_details(role_name, headcount, min_age, max_age, career_required, actor_role)")
      .eq("id", projectId)
      .single();

    if (error || !proj) {
      console.error("[join] Project fetch failed:", error?.message);
      return;
    }
    console.log("[join] Step 2: Project fetched →", proj.title);

    // ── Topbar: status (genre stays empty — no genre field in DB yet) ────
    const statusEl = document.getElementById("modalDetailStatus");
    if (statusEl) statusEl.innerHTML = statusBadgeHtml(proj.closing_date);

    // ── Title ─────────────────────────────────────────────────────────────
    document.getElementById("modalDetailTitle").textContent = proj.title || "";

    // ── Meta pills: region + role summary ─────────────────────────────────
    const regionNames = (proj.regions || [])
      .map(r => t("region." + r) || r)
      .join(" · ") || (lang === "ko" ? "전국" : "Nationwide");
    const roles = proj.recruitment_details || [];
    const rolePills = buildRecruitmentChips(roles).slice(0, 4).map(r => {
      return `<span class="pdm-meta-pill">${escapeHtml(r.label)}</span>`;
    }).join("");
    const regionEl = document.getElementById("modalDetailRegion");
    if (regionEl) {
      regionEl.innerHTML =
        `<span class="pdm-meta-pill"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>${escapeHtml(regionNames)}</span>${rolePills}`;
    }

    // ── Content: description + role cards ─────────────────────────────────
    let contentHtml = "";

    // description section
    if (proj.description) {
      const descLabel = lang === "ko" ? "작품 소개" : "About";
      contentHtml += `<div class="pdm-section">
        <p class="pdm-section-label">${descLabel}</p>
        <div class="pdm-desc">${DOMPurify.sanitize(proj.description)}</div>
      </div>`;
    }

    // recruitment section with colour-coded role cards
    const rolesLabel = lang === "ko" ? "모집 부문" : "Open Positions";
    const detailChips = buildRecruitmentChips(roles);
    const roleCardsHtml = detailChips.length
      ? detailChips.map(chip => {
          const roleName   = chip.role_name;
          const colorClass = getRoleColorClass(roleName);
          const fullLabel = chip.label;
          const displayName = fullLabel.replace(/ ×.*$/, "");
          const metaStr = fullLabel.slice(displayName.length).trim();
          return `<div class="role-card ${colorClass}">
            <div class="rc-info">
              <span class="rc-name">${escapeHtml(displayName)}</span>
              <span class="rc-detail">${escapeHtml(metaStr)}</span>
            </div>
            <button class="rc-join role-join" data-role="${escapeHtml(roleName)}" data-project-id="${escapeHtml(proj.id)}">
              ${lang === "ko" ? "참여" : "Join"}
            </button>
          </div>`;
        }).join("")
      : `<p class="card-empty">${lang === "ko" ? "모집 분야 없음" : "No open positions"}</p>`;

    contentHtml += `<div class="pdm-section">
      <p class="pdm-section-label">${rolesLabel}</p>
      <div class="role-cards">${roleCardsHtml}</div>
    </div>`;

    document.getElementById("modalDetailSlots").innerHTML = contentHtml;

    console.log("[join] Step 3: Modal populated — opening dialog");
    document.getElementById("projectDetailModal").showModal();
  } catch (err) {
    console.error("[join] loadProjectDetail error:", err);
  }
}

/* ── NOTIFICATIONS ────────────────────────────────────────── */
function pushNotification(message) {
  state.notifications.unshift(message);
  renderNotifications();
}

let _toastTimer = null;
function showToast(message) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("toast--visible");
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove("toast--visible"), 2800);
}

function renderNotifications() {
  notifyList.innerHTML = "";
  state.notifications.forEach(note => {
    const li = document.createElement("li");
    li.textContent = typeof note === "object" ? t(note.key) : note;
    notifyList.appendChild(li);
  });
  if (notifyDot) notifyDot.classList.toggle("visible", state.notifications.length > 0);
}

/* ── IDENTITY ─────────────────────────────────────────────── */
function renderIdentity() {
  authBtnText.textContent = state.authed ? t("auth.logout") : t("auth.login");
}

/* ── CLEAR USER STATE ─────────────────────────────────────── */
function clearUserState() {
  state.authed        = false;
  currentUser         = null;
  state.notifications = [];
  // Clear My Page lists so previous user's data never bleeds through
  const createdEl = document.getElementById("createdList");
  const joinedEl  = document.getElementById("joinedList");
  const empty     = `<li class="empty-item">${lang === "ko" ? "로그인이 필요합니다." : "Please log in."}</li>`;
  if (createdEl) createdEl.innerHTML = empty;
  if (joinedEl)  joinedEl.innerHTML  = empty;
  renderIdentity();
  renderNotifications();
}

function updateAuthCopy() {
  const isSignup = authMode === "signup";
  authTitle.textContent = isSignup ? t("modal.signup.title") : t("modal.login.title");
  authSwitch.textContent = isSignup ? t("modal.toLogin") : t("modal.toSignup");
  signupNameWrap.classList.toggle("hidden", !isSignup);
}

function setTasteStep(stepName) {
  const showMovie = stepName === "movie";
  tasteStepMovie?.classList.toggle("hidden", !showMovie);
  tasteStepTmi?.classList.toggle("hidden", showMovie);
  if (!showMovie) updateTasteStep2Copy();
}

function setSignupFlowState(nextState) {
  signupFlowState = nextState;
  const legacyTasteDialog = document.getElementById("tasteSignupDialog");

  if (signupFlowState === "account") {
    authStepAccount?.classList.remove("hidden");
    authStepTaste?.classList.add("hidden");
    authSwitch?.classList.remove("hidden");
    if (legacyTasteDialog?.open) legacyTasteDialog.close();
    if (authMode === "signup") updateAuthCopy();
    return;
  }

  if (signupFlowState === "taste") {
    // Fallback for stale/cached HTML that does not include authStepTaste yet.
    if (!authStepTaste || !authStepAccount) {
      console.warn("[signup] Missing single-dialog step DOM. Opening legacy taste dialog fallback.");
      if (authDialog?.open) authDialog.close();
      if (legacyTasteDialog?.showModal) legacyTasteDialog.showModal();
      return;
    }

    authTitle.textContent = t("taste.title");
    authStepAccount?.classList.add("hidden");
    authStepTaste?.classList.remove("hidden");
    authSwitch?.classList.add("hidden");
    setTasteStep("movie");
    if (!authDialog?.open) authDialog?.showModal();
  }
}

function resetTasteSignupFlow() {
  selectedTasteMovie = null;
  clearTimeout(tasteSearchDebounceTimer);
  tasteSearchRequestSeq += 1;
  if (tasteMovieQuery) tasteMovieQuery.value = "";
  if (tasteMovieResults) tasteMovieResults.innerHTML = "";
  setTasteCategoryValue("");
  if (tasteContent) tasteContent.value = "";
  if (tasteMovieSelected) {
    tasteMovieSelected.classList.add("hidden");
    tasteMovieSelected.textContent = "";
  }
  if (tasteSignupMessage) {
    tasteSignupMessage.textContent = "";
    tasteSignupMessage.className = "auth-message";
  }
  setTasteStep("movie");
}

function renderTasteSearchResults(movies) {
  if (!tasteMovieResults) return;
  if (!movies.length) {
    tasteMovieResults.innerHTML = `<div class="taste-movie-empty">${escapeHtml(t("taste.search.empty"))}</div>`;
    return;
  }

  tasteMovieResults.innerHTML = movies.slice(0, 10).map(movie => {
    const title = movie.title || movie.name || "Untitled";
    const year = (movie.release_date || movie.first_air_date || "").slice(0, 4) || "-";
    const mediaType = String(movie.media_type || (movie.first_air_date ? "tv" : "movie")).toUpperCase();
    const posterPath = movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : "";
    const selectedClass = selectedTasteMovie?.id === Number(movie.id) ? " is-selected" : "";
    return `<button type="button" class="taste-movie-item${selectedClass}" data-id="${movie.id}" data-title="${escapeHtml(title)}" data-type="${escapeHtml(mediaType)}">
      ${posterPath
        ? `<img class="taste-movie-poster" src="${escapeHtml(posterPath)}" alt="${escapeHtml(title)} poster" loading="lazy" />`
        : `<span class="taste-movie-poster taste-movie-poster--empty">NO IMAGE</span>`}
      <span class="taste-movie-info">
        <span class="taste-movie-title">${escapeHtml(title)}</span>
        <span class="taste-movie-meta">${escapeHtml(year)} · ${escapeHtml(mediaType)}</span>
      </span>
    </button>`;
  }).join("");
}

async function searchTmdbMovies(query) {
  if (!query || query.length < 2 || query.length > 80) throw new Error("INVALID_QUERY");
  const language = lang === "ko" ? "ko-KR" : "en-US";
  const url = `${INTERNAL_API_BASE}/api/tmdb/search/multi?query=${encodeURIComponent(query)}&language=${encodeURIComponent(language)}&include_adult=false`;
  const response = await fetch(url);
  if (response.status === 404) throw new Error("SEARCH_API_MISSING");
  if (!response.ok) throw new Error("TMDB_SEARCH_FAILED");
  const payload = await response.json();
  return payload?.results || payload?.data || [];
}

async function runTasteMovieSearch(query) {
  if (!tasteMovieResults) return;
  const seq = ++tasteSearchRequestSeq;
  tasteMovieResults.innerHTML = `<div class="taste-movie-empty">${lang === "ko" ? "검색 중…" : "Searching…"}</div>`;

  try {
    const movies = await searchTmdbMovies(query);
    if (seq !== tasteSearchRequestSeq) return;
    renderTasteSearchResults(movies);
  } catch (error) {
    if (seq !== tasteSearchRequestSeq) return;
    tasteMovieResults.innerHTML = `<div class="taste-movie-empty">${escapeHtml(t("taste.search.error"))}</div>`;
  }
}

async function saveTasteToCineTmi({ nickname, password, category, content, movieId }) {
  const response = await fetch(`${INTERNAL_API_BASE}/api/tmi-posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nickname,
      password,
      category,
      content,
      content_id: Number(movieId)
    })
  });

  if (response.status === 404) throw new Error("CINETMI_API_MISSING");
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload?.message || "CINETMI_SAVE_FAILED");
  }
}

async function performIntegratedSignup({ email, password, nickname, category, content, movieId }) {
  let signupResult;
  try {
    signupResult = await signUpUser(email, password, nickname);
    if (signupResult.error) throw signupResult.error;
  } catch (error) {
    return { error, signupResult: null, cineError: null };
  }

  try {
    await saveTasteToCineTmi({ nickname, password, category, content, movieId });
    return { error: null, signupResult, cineError: null };
  } catch (cineError) {
    console.error("[cinetmi] tmi_posts insert failed:", cineError.message || cineError);
    return { error: null, signupResult, cineError };
  }
}

async function handleSignup(payload) {
  return performIntegratedSignup(payload);
}

/* ── EVENT LISTENERS ──────────────────────────────────────── */
navItems.forEach(item => item.addEventListener("click", () => {
  const screenId = item.dataset.screen;
  if ((screenId === "create" || screenId === "mypage") && !state.authed) {
    authMode = "login";
    updateAuthCopy();
    authDialog.showModal();
    return;
  }

  if (screenId === "mypage") { loadMyPage(); }
  setScreen(screenId);
}));

document.querySelector(".wordmark").addEventListener("click", e => {
  e.preventDefault();
  setScreen("discover");
});

langToggle.addEventListener("click", () => applyLang(lang === "en" ? "ko" : "en"));

notifyBtn.addEventListener("click", () => {
  if (!state.authed) { authMode = "login"; updateAuthCopy(); authDialog.showModal(); return; }
  notifyDrawer.classList.add("open");
  drawerOverlay.classList.add("visible");
});

function closeDrawer() {
  notifyDrawer.classList.remove("open");
  drawerOverlay.classList.remove("visible");
}

function closeServiceSidebar() {
  serviceSidebar?.classList.remove("is-open");
  serviceSidebarBackdrop?.classList.remove("visible");
}

closeNotify.addEventListener("click", closeDrawer);
drawerOverlay.addEventListener("click", closeDrawer);
svcToggleBtn?.addEventListener("click", () => {
  serviceSidebar?.classList.toggle("is-open");
  serviceSidebarBackdrop?.classList.toggle("visible", serviceSidebar?.classList.contains("is-open"));
});
serviceSidebarBackdrop?.addEventListener("click", closeServiceSidebar);
window.addEventListener("resize", () => {
  if (window.innerWidth > 900) closeServiceSidebar();
});

authBtn.addEventListener("click", async () => {
  if (state.authed) {
    const msg = t("notif.logout");
    clearUserState();
    await sbClient.auth.signOut();
    showToast(msg);
    setScreen("discover");
    return;
  }
  setSignupFlowState("account");
  authMode = "login";
  updateAuthCopy();
  authDialog.showModal();
});

authCancel.addEventListener("click", () => {
  setSignupFlowState("account");
  authDialog.close();
});

authSwitch.addEventListener("click", () => {
  setSignupFlowState("account");
  authMode = authMode === "login" ? "signup" : "login";
  updateAuthCopy();
});

authForm.addEventListener("submit", async event => {
  event.preventDefault();
  const email    = document.getElementById("authEmail").value.trim();
  const password = document.getElementById("authPass").value;
  const name     = document.getElementById("authName").value.trim();

  authMessage.textContent = "";
  authMessage.className   = "auth-message";

  if (authMode === "signup") {
    if (!name) {
      authMessage.textContent = lang === "ko" ? "표시 이름을 입력해 주세요." : "Please enter display name.";
      authMessage.classList.add("auth-message--error");
      return;
    }

    pendingSignupDraft = { email, password, nickname: name };
    resetTasteSignupFlow();
    setSignupFlowState("taste");
    return;
  }

  const result = await signInUser(email, password);

  if (result.error) {
    authMessage.textContent = result.error.message;
    authMessage.classList.add("auth-message--error");
    console.error("[auth]", result.error.message);
    return;
  }

  authMessage.textContent = authMode === "signup"
    ? (lang === "ko" ? "가입 완료! 이메일을 확인해 주세요." : "Account created! Check your email to confirm.")
    : (lang === "ko" ? "로그인됐습니다." : "Logged in successfully.");
  authMessage.classList.add("auth-message--ok");

  state.authed = true;
  currentUser = result.user;
  renderIdentity();
  pushNotification(t(authMode === "signup" ? "notif.signup" : "notif.login"));
  await loadDiscoverProjects();

  setTimeout(() => {
    authDialog.close();
    authMessage.textContent = "";
    authMessage.className   = "auth-message";
    authForm.reset();
  }, 1400);
});

tasteSignupCancel?.addEventListener("click", () => {
  setSignupFlowState("account");
  resetTasteSignupFlow();
  pendingSignupDraft = null;
  authMode = "signup";
  updateAuthCopy();
});

tasteMovieSearchBtn?.addEventListener("click", async () => {
  const query = tasteMovieQuery?.value.trim() || "";
  if (!query) {
    tasteMovieResults.innerHTML = "";
    return;
  }
  if (query.length < 2) {
    tasteMovieResults.innerHTML = `<div class="taste-movie-empty">${lang === "ko" ? "2글자 이상 입력해 주세요." : "Type at least 2 characters."}</div>`;
    return;
  }
  if (!tasteMovieResults) return;

  await runTasteMovieSearch(query);
});

tasteMovieQuery?.addEventListener("input", () => {
  const query = tasteMovieQuery.value.trim();
  clearTimeout(tasteSearchDebounceTimer);

  if (!query) {
    tasteMovieResults.innerHTML = "";
    return;
  }
  if (query.length < 2) {
    tasteMovieResults.innerHTML = `<div class="taste-movie-empty">${lang === "ko" ? "2글자 이상 입력해 주세요." : "Type at least 2 characters."}</div>`;
    return;
  }

  tasteSearchDebounceTimer = setTimeout(() => {
    runTasteMovieSearch(query);
  }, 280);
});

tasteMovieQuery?.addEventListener("keydown", event => {
  if (event.key !== "Enter") return;
  event.preventDefault();
  tasteMovieSearchBtn?.click();
});

tasteMovieResults?.addEventListener("click", event => {
  const btn = event.target.closest(".taste-movie-item");
  if (!btn) return;
  selectedTasteMovie = {
    id: Number(btn.dataset.id),
    title: btn.dataset.title || "",
    mediaType: btn.dataset.type || "MOVIE"
  };
  tasteMovieResults.innerHTML = "";
  tasteMovieSelected?.classList.remove("hidden");
  tasteMovieSelected.textContent = `${t("taste.selected")}: ${selectedTasteMovie.title} · ${selectedTasteMovie.mediaType} (ID ${selectedTasteMovie.id})`;
  updateTasteStep2Copy();
});

tasteStepNextBtn?.addEventListener("click", () => {
  if (!selectedTasteMovie) {
    showToast(t("taste.validation.movie"));
    return;
  }
  setTasteStep("tmi");
});

tasteStepBackBtn?.addEventListener("click", () => {
  setTasteStep("movie");
});

tasteSubmitBtn?.addEventListener("click", async () => {
  if (!pendingSignupDraft) return;
  const ALLOWED_TASTE_CATEGORIES = new Set(["오마주", "스토리", "감독", "배우", "미장센", "비하인드", "잡담"]);
  const category = getTasteCategoryValue();
  const content = tasteContent?.value.trim() || "";
  const normalizedContent = content.replace(/\s+/g, " ").trim();

  if (!selectedTasteMovie) {
    tasteSignupMessage.textContent = t("taste.validation.movie");
    tasteSignupMessage.className = "auth-message auth-message--error";
    setTasteStep("movie");
    return;
  }
  if (!category || !ALLOWED_TASTE_CATEGORIES.has(category)) {
    tasteSignupMessage.textContent = t("taste.validation.category");
    tasteSignupMessage.className = "auth-message auth-message--error";
    return;
  }
  if (!normalizedContent || normalizedContent.length < 4 || normalizedContent.length > 500) {
    tasteSignupMessage.textContent = t("taste.validation.content");
    tasteSignupMessage.className = "auth-message auth-message--error";
    return;
  }

  tasteSignupMessage.textContent = lang === "ko" ? "가입 처리 중…" : "Creating account…";
  tasteSignupMessage.className = "auth-message";

  const { error, signupResult, cineError } = await handleSignup({
    email: pendingSignupDraft.email,
    password: pendingSignupDraft.password,
    nickname: pendingSignupDraft.nickname,
    category,
    content: normalizedContent,
    movieId: selectedTasteMovie.id
  });

  if (error) {
    tasteSignupMessage.textContent = error.message || (lang === "ko" ? "가입에 실패했습니다." : "Sign-up failed.");
    tasteSignupMessage.className = "auth-message auth-message--error";
    return;
  }

  state.authed = true;
  currentUser = signupResult?.user || null;
  renderIdentity();
  pushNotification(t("notif.signup"));
  if (cineError) {
    showToast(t("taste.partial"));
  } else {
    showToast(t("taste.saved"));
  }

  setSignupFlowState("account");
  pendingSignupDraft = null;
  resetTasteSignupFlow();
  authForm.reset();
  authDialog.close();
});

authDialog?.addEventListener("close", () => {
  setSignupFlowState("account");
  pendingSignupDraft = null;
  resetTasteSignupFlow();
  const authPassEl = document.getElementById("authPass");
  if (authPassEl) authPassEl.value = "";
});

projectList.addEventListener("click", event => {
  const btn  = event.target.closest(".join-btn");
  const card = event.target.closest(".project-card");

  // Card body click (not the join button) → navigate to project detail
  if (card && !btn) {
    const projId = card.dataset.projectId;
    if (projId) loadProjectDetail(projId);
    return;
  }

  if (!btn) return;
  const joinCard = btn.closest(".project-card");
  if (!joinCard || btn.disabled || joinCard.dataset.status === "closed") return;
  const projId = joinCard.dataset.projectId || "";
  if (!projId) return;
  if (btn.classList.contains("workspace-btn")) {
    loadWorkspace(projId);
    return;
  }
  if (!state.authed) { authMode = "login"; updateAuthCopy(); authDialog.showModal(); return; }
  joinProject(projId, null);
});

document.getElementById("projectDetailModal").addEventListener("click", event => {
  const btn = event.target.closest(".role-join");
  if (!btn) return;
  if (!state.authed) { authMode = "login"; updateAuthCopy(); authDialog.showModal(); return; }
  const projId   = btn.dataset.projectId;
  const roleName = btn.dataset.role;
  console.log("[join] Role-join button clicked in modal — projId:", projId, "| role:", roleName);
  if (projId) joinProject(projId, roleName);
});

document.getElementById("projectDetailModalClose").addEventListener("click", () => {
  document.getElementById("projectDetailModal").close();
});

confirmYes.addEventListener("click", async () => {
  if (typeof confirmAction === "function") await confirmAction();
  confirmAction = null;
});

/* ── CREATED LIST — Edit & Delete delegation ──────────────── */
let _editingProjectId = null;

createdList.addEventListener("click", async event => {
  const editBtn   = event.target.closest(".edit-project-btn");
  const deleteBtn = event.target.closest(".delete-project-btn");

  if (editBtn) {
    const li = editBtn.closest(".list-item");
    if (!li) return;
    _editingProjectId = li.dataset.projectId;
    // Fetch current project data
    const { data, error } = await sbClient.from("projects")
      .select("title, description, regions, closing_date").eq("id", _editingProjectId).maybeSingle();
    if (error) { console.error("[edit-project]", error.message); return; }
    editProjTitle.value = data?.title || "";
    quillEditDesc.root.innerHTML = DOMPurify.sanitize(data?.description || "");
    // Pre-check region checkboxes
    const savedRegions = (data?.regions || []).map(r => r.toLowerCase());
    document.querySelectorAll('[name="edit-proj-region"]').forEach(cb => {
      cb.checked = savedRegions.includes(cb.value);
    });
    // Pre-fill closing date
    const editClosingDateEl = document.getElementById("editClosingDate");
    if (editClosingDateEl) editClosingDateEl.value = data?.closing_date || "";
    editProjectDialog.showModal();
  }

  if (deleteBtn) {
    const li = deleteBtn.closest(".list-item");
    if (!li) return;
    const projId = li.dataset.projectId;
    confirmTitle.textContent = lang === "ko" ? "프로젝트 삭제" : "Delete project";
    confirmBody.textContent  = lang === "ko"
      ? "이 프로젝트를 삭제하면 복구할 수 없습니다. 계속하시겠습니까?"
      : "This project will be permanently deleted. Continue?";
    confirmAction = async () => {
      const childDeletes = await Promise.all([
        sbClient.from("project_questions").delete().eq("project_id", projId),
        sbClient.from("recruitment_details").delete().eq("project_id", projId),
        sbClient.from("project_participants").delete().eq("project_id", projId)
      ]);
      const childError = childDeletes.find(result => result.error)?.error;
      if (childError) {
        console.error("[delete-project] child deletion failed:", childError.message);
        return;
      }

      const { error } = await sbClient.from("projects").delete().eq("id", projId);
      if (error) { console.error("[delete-project]", error.message); return; }
      li.remove();
      showToast(lang === "ko" ? "프로젝트가 삭제되었습니다." : "Project deleted.");
      pushNotification(t("notif.project.deleted"));
      await loadDiscoverProjects();
      await loadMyPage();
    };
    confirmDialog.showModal();
  }
});

editProjectSaveBtn.addEventListener("click", async () => {
  if (!_editingProjectId) return;
  const newTitle   = editProjTitle.value.trim();
  const rawEditDesc = quillEditDesc.root.innerHTML;
  const newDesc     = (rawEditDesc === "<p><br></p>" || rawEditDesc === "<p></p>") ? "" : rawEditDesc;
  if (!newTitle) return;
  const regionCbs   = [...document.querySelectorAll('[name="edit-proj-region"]:checked')];
  const newRegions   = regionCbs.length ? regionCbs.map(cb => cb.value) : ["nationwide"];
  const newClosingDate = document.getElementById("editClosingDate")?.value || null;
  const { error } = await sbClient.from("projects")
    .update({ title: newTitle, description: newDesc, regions: newRegions, closing_date: newClosingDate })
    .eq("id", _editingProjectId);
  if (error) { console.error("[edit-project save]", error.message); return; }
  // Update the list item title in DOM
  const li = createdList.querySelector(`[data-project-id="${_editingProjectId}"]`);
  if (li) li.querySelector("span").textContent = newTitle;
  showToast(lang === "ko" ? "저장되었습니다." : "Saved.");
  editProjectDialog.close();
  _editingProjectId = null;
});

editProjectCancelBtn.addEventListener("click", () => {
  editProjectDialog.close();
  _editingProjectId = null;
});



/** Reads the create-form DOM and returns a plain data object. */
function collectFormData() {
  const title     = document.getElementById("projectTitle").value.trim() || "Untitled";
  const rawDesc   = quillDesc.root.innerHTML;
  const desc      = (rawDesc === "<p><br></p>" || rawDesc === "<p></p>") ? "" : rawDesc;
  const regionCbs = [...document.querySelectorAll('[name="proj-region"]:checked')];
  const regions   = regionCbs.length ? regionCbs.map(cb => cb.value) : ["nationwide"];

  const roles = [...document.querySelectorAll("#roleDetails .role-dp")].map(dp => {
    const headcount = parseHeadcountValue(dp.querySelector(".dp-headcount")?.dataset.value ?? "1");
    const slots = [...dp.querySelectorAll(".role-slot-card")].map(slot => {
      const minRaw = slot.querySelector(".dp-age-min")?.dataset.value;
      const maxRaw = slot.querySelector(".dp-age-max")?.dataset.value;
      const careerVal = slot.querySelector(".dp-career")?.dataset.value || "any";
      return {
        minAge: isNaN(parseInt(minRaw, 10)) ? null : parseInt(minRaw, 10),
        maxAge: isNaN(parseInt(maxRaw, 10)) ? null : parseInt(maxRaw, 10),
        career: careerVal,
        actorRole: slot.querySelector(".dp-actor-role")?.dataset.value || null
      };
    });
    return {
      role:      dp.dataset.role,
      headcount,
      minAge:    slots.reduce((current, slot) => slot.minAge !== null ? (current === null ? slot.minAge : Math.min(current, slot.minAge)) : current, null),
      maxAge:    slots.reduce((current, slot) => slot.maxAge !== null ? (current === null ? slot.maxAge : Math.max(current, slot.maxAge)) : current, null),
      career:    slots.some(slot => slot.career !== "any"),
      slots
    };
  });

  return { title, description: desc, regions, roles, preq: { ...currentPreq },
           closingDate: document.getElementById("closingDate")?.value || null };
}

/**
 * Saves a new project to Supabase in three sequential inserts:
 *   1. projects           → returns project id
 *   2. recruitment_details (batch, one row per role)
 *   3. project_questions  (only when a pre-screen question is set)
 *
 * Throws on any error so the caller can handle UI feedback.
 */
async function createProject(formData) {
  // ── Auth check ──────────────────────────────────────────────
  const { data: { session }, error: sessionError } = await sbClient.auth.getSession();
  if (sessionError || !session) throw new Error("not_authenticated");
  const userId = session.user.id;

  // ── Step 1: insert main project row ─────────────────────────
  const { data: project, error: projError } = await sbClient
    .from("projects")
    .insert({
      creator_id:   userId,
      title:        formData.title,
      description:  formData.description,
      regions:      formData.regions,
      closing_date: formData.closingDate || null
    })
    .select("id")
    .single();

  if (projError) throw projError;
  const projectId = project.id;

  // ── Step 2: batch-insert recruitment_details ─────────────────
  if (formData.roles.length > 0) {
    const detailsToInsert = formData.roles.flatMap(r => {
      const slotRows = (Array.isArray(r.slots) && r.slots.length)
        ? r.slots.map(slot => ({
            project_id:      projectId,
            role_name:       r.role,
            headcount:       1,
            min_age:         slot.minAge,
            max_age:         slot.maxAge,
            career_required: slot.career === "any" ? null : slot.career,
            actor_role:      slot.actorRole || null
          }))
        : [{
            project_id:      projectId,
            role_name:       r.role,
            headcount:       r.headcount,
            min_age:         r.minAge,
            max_age:         r.maxAge,
            career_required: r.career === "any" ? null : r.career,
            actor_role:      null
          }];
      return slotRows;
    });

    const { error: rolesError } = await sbClient
      .from("recruitment_details")
      .insert(detailsToInsert);
    if (rolesError) throw rolesError;
  }

  // ── Step 3: insert project_questions (if question was set) ────
  if (formData.preq.text) {
    const { error: preqError } = await sbClient
      .from("project_questions")
      .insert({
        project_id:    projectId,
        question_text: formData.preq.text,
        // "none" means accept all — store null so no filter is applied
        target_answer: formData.preq.required === "none" ? null : formData.preq.required === "yes",
        is_active:     true
      });
    if (preqError) throw preqError;
  }

  return projectId;
}

/** Resets all create-form state after a successful or aborted submit. */
function resetCreateForm() {
  createForm.reset();
  document.getElementById("roleDetails").innerHTML = "";
  document.getElementById("descCount").textContent = "(0/1000)";
  quillDesc.setContents([]);
  currentPreq = { text: "", required: "none" };
  document.getElementById("preqSetupRow").classList.remove("hidden");
  document.getElementById("preqPreview").classList.add("hidden");
}

createForm.addEventListener("submit", async event => {
  event.preventDefault();
  if (!state.authed) { authMode = "login"; updateAuthCopy(); authDialog.showModal(); return; }

  const formData  = collectFormData();
  const submitBtn = createForm.querySelector(".submit-btn");
  const origLabel = submitBtn.textContent;
  submitBtn.disabled    = true;
  submitBtn.textContent = lang === "ko" ? "게시 중…" : "Publishing…";

  let projectId;
  try {
    projectId = await createProject(formData);
  } catch (err) {
    console.error("[createProject]", err.message ?? err);
    submitBtn.disabled    = false;
    submitBtn.textContent = origLabel;
    pushNotification(
      lang === "ko"
        ? "저장 중 오류가 발생했습니다. 다시 시도해주세요."
        : "Failed to save. Please try again."
    );
    return;
  }

  submitBtn.disabled    = false;
  submitBtn.textContent = origLabel;

  showToast(lang === "ko" ? "프로젝트 생성이 완료되었습니다." : "Project published successfully.");
  pushNotification(
    lang === "ko"
      ? `프로젝트 공고: ${formData.title}`
      : `Project published: ${formData.title}.`
  );
  resetCreateForm();
  await loadDiscoverProjects();
  setScreen("discover");
});

/* ── CREATE FORM INTERACTIONS ─────────────────────────────── */
// char counter is now handled by quillDesc text-change event above

// region checkboxes: max 5, 전국 exclusive
document.querySelectorAll('[name="proj-region"]').forEach(cb => {
  cb.addEventListener("change", () => {
    const all        = [...document.querySelectorAll('[name="proj-region"]')];
    const nationwide = document.querySelector('[name="proj-region"][value="nationwide"]');
    if (cb.value === "nationwide" && cb.checked) {
      all.forEach(c => { if (c !== cb) c.checked = false; });
    } else if (cb.checked) {
      if (nationwide) nationwide.checked = false;
      if (all.filter(c => c.checked).length > 5) cb.checked = false;
    }
  });
});

// role checkboxes: build / remove detail panels
const ROLE_ORDER = ["director","assdirector","maleactor","femaleactor","filming","music","editing","script"];

/* ── CUSTOM SELECT COMPONENT ──────────────────────────────── */
function buildCsel(opts, extraClass) {
  const wrap = document.createElement("div");
  wrap.className = "csel" + (extraClass ? " " + extraClass : "");
  wrap.dataset.value = opts[0].value;
  const items = opts.map((o, i) =>
    `<li class="csel-opt${i === 0 ? " csel-selected" : ""}" data-value="${o.value}">${o.label}</li>`
  ).join("");
  wrap.innerHTML =
    `<button type="button" class="csel-trigger">` +
    `<span class="csel-label">${opts[0].label}</span>` +
    `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>` +
    `</button><ul class="csel-panel">${items}</ul>`;
  return wrap;
}

function setCselValue(csel, value) {
  if (typeof csel === "string") csel = document.getElementById(csel);
  if (!csel) return;
  csel.dataset.value = value;
  const opt = csel.querySelector(`.csel-opt[data-value="${value}"]`);
  if (opt) {
    csel.querySelector(".csel-label").textContent = opt.textContent;
    csel.querySelectorAll(".csel-opt").forEach(o => o.classList.toggle("csel-selected", o === opt));
  }
}

document.addEventListener("click", e => {
  const trigger = e.target.closest(".csel-trigger");
  const opt     = e.target.closest(".csel-opt");
  if (trigger) {
    e.preventDefault();
    const csel   = trigger.closest(".csel");
    const wasOpen = csel.classList.contains("csel-open");
    document.querySelectorAll(".csel.csel-open").forEach(s => s.classList.remove("csel-open"));
    if (!wasOpen) csel.classList.add("csel-open");
    e.stopPropagation();
    return;
  }
  if (opt) {
    e.preventDefault();
    const csel = opt.closest(".csel");
    csel.dataset.value = opt.dataset.value;
    csel.querySelector(".csel-label").textContent = opt.textContent;
    csel.querySelectorAll(".csel-opt").forEach(o => o.classList.toggle("csel-selected", o === opt));
    csel.classList.remove("csel-open");
    csel.dispatchEvent(new Event("change", { bubbles: true }));
    e.stopPropagation();
    return;
  }
  document.querySelectorAll(".csel.csel-open").forEach(s => s.classList.remove("csel-open"));
});

function headcountOpts() {
  const o = [];
  for (let i = 1; i <= 5; i++) o.push({ value: String(i), label: `${i}\uba85` });
  o.push({ value: "6+", label: "6\uba85+" });
  return o;
}

function ageOpts() {
  const o = [{ value: "", label: "-" }];
  for (let a = 15; a <= 55; a += 5) o.push({ value: String(a), label: `${a}\uc138` });
  o.push({ value: "60+", label: "60\uc138+" });
  return o;
}

function careerOpts() {
  return [
    { value: "any", label: t("create.f.career.any") },
    { value: "1y",  label: t("create.f.career.1y")  },
    { value: "3y",  label: t("create.f.career.3y")  },
    { value: "5y",  label: t("create.f.career.5y")  }
  ];
}

function actorRoleOpts() {
  return [
    { value: "lead",    label: t("create.f.actorrole.lead") },
    { value: "support", label: t("create.f.actorrole.support") },
    { value: "bit",     label: t("create.f.actorrole.bit") }
  ];
}

function isActorRole(role) {
  return role === "maleactor" || role === "femaleactor";
}

function formatActorRoleLabel(actorRole) {
  if (!actorRole) return "";
  return t("create.f.actorrole." + actorRole) || actorRole;
}

function buildRecruitmentChips(rows) {
  const chips = rows.map(r => {
    const roleName = t("role." + r.role_name) || r.role_name;
    const actorLabel = isActorRole(r.role_name) && r.actor_role
      ? `(${formatActorRoleLabel(r.actor_role)})`
      : "";
    const agePart = (r.min_age && r.max_age)
      ? ` / ${r.min_age}–${r.max_age}`
      : "";
    const careerPart = r.career_required
      ? ` / ${t("create.f.career." + r.career_required) || r.career_required}`
      : "";
    const headcount = parseInt(r.headcount, 10) || 1;
    return {
      key: `${r.role_name}|${r.actor_role || ""}|${r.min_age || ""}|${r.max_age || ""}|${r.career_required || ""}`,
      role_name: r.role_name,
      label: `${roleName}${actorLabel} ×${headcount}${agePart}${careerPart}`,
      headcount
    };
  });

  const grouped = chips.reduce((acc, chip) => {
    if (!acc[chip.key]) acc[chip.key] = { role_name: chip.role_name, label: chip.label, count: 0 };
    acc[chip.key].count += chip.headcount;
    return acc;
  }, {});

  return Object.values(grouped).map(item => {
    const label = item.count > 1
      ? item.label.replace(/×\d+/, `×${item.count}`)
      : item.label;
    return { role_name: item.role_name, label, count: item.count };
  });
}

function parseHeadcountValue(value) {
  return value === "6+" ? 6 : (parseInt(value, 10) || 1);
}

function createRoleSlot(role, index) {
  const slot = document.createElement("div");
  slot.className = "role-slot-card";
  slot.dataset.slotIndex = index;

  const header = document.createElement("div");
  header.className = "role-slot-header";
  header.innerHTML = `<span>${t("create.f.slot")}</span><span class="role-slot-number">${index + 1}</span>`;
  slot.appendChild(header);

  const fields = document.createElement("div");
  fields.className = "role-slot-fields";

  const ageGroup = document.createElement("div");
  ageGroup.className = "role-dp-group";
  ageGroup.innerHTML = `<span>${t("create.f.age")}</span>`;
  ageGroup.appendChild(buildCsel(ageOpts(), "dp-age-min"));
  const tilde = document.createElement("span");
  tilde.textContent = "~";
  tilde.className = "dp-tilde";
  ageGroup.appendChild(tilde);
  ageGroup.appendChild(buildCsel(ageOpts(), "dp-age-max"));
  fields.appendChild(ageGroup);

  const careerGroup = document.createElement("div");
  careerGroup.className = "role-dp-group";
  careerGroup.innerHTML = `<span>${t("create.f.career")}</span>`;
  careerGroup.appendChild(buildCsel(careerOpts(), "dp-career"));
  fields.appendChild(careerGroup);

  if (isActorRole(role)) {
    const actorGroup = document.createElement("div");
    actorGroup.className = "role-dp-group";
    actorGroup.innerHTML = `<span>${t("create.f.actorrole")}</span>`;
    actorGroup.appendChild(buildCsel(actorRoleOpts(), "dp-actor-role"));
    fields.appendChild(actorGroup);
  }

  slot.appendChild(fields);
  return slot;
}

function updateRoleSlots(dp) {
  const headcountCsel = dp.querySelector(".dp-headcount");
  const desiredCount = parseHeadcountValue(headcountCsel?.dataset.value ?? "1");
  let slotWrap = dp.querySelector(".role-slot-wrap");
  if (!slotWrap) {
    slotWrap = document.createElement("div");
    slotWrap.className = "role-slot-wrap";
    dp.appendChild(slotWrap);
  }

  const existingSlots = [...slotWrap.querySelectorAll(".role-slot-card")];
  while (existingSlots.length < desiredCount) {
    const slot = createRoleSlot(dp.dataset.role, existingSlots.length);
    slotWrap.appendChild(slot);
    existingSlots.push(slot);
  }
  while (existingSlots.length > desiredCount) {
    const removed = existingSlots.pop();
    if (removed) removed.remove();
  }

  existingSlots.forEach((slot, index) => {
    slot.dataset.slotIndex = index;
    const label = slot.querySelector(".role-slot-number");
    if (label) label.textContent = String(index + 1);
  });
}

function syncRolePanels() {
  const wrap    = document.getElementById("roleDetails");
  const checked = new Set([...document.querySelectorAll(".role-cb:checked")].map(c => c.value));
  wrap.querySelectorAll(".role-dp").forEach(p => { if (!checked.has(p.dataset.role)) p.remove(); });
  ROLE_ORDER.forEach(role => {
    if (!checked.has(role) || wrap.querySelector(`.role-dp[data-role="${role}"]`)) return;
    const dp = document.createElement("div");
    dp.className = "role-dp"; dp.dataset.role = role;
    const nameEl = document.createElement("span");
    nameEl.className = "role-dp-name";
    nameEl.textContent = t("role." + role);
    const fields = document.createElement("div");
    fields.className = "role-dp-fields";
    // headcount
    const hg = document.createElement("div"); hg.className = "role-dp-group";
    hg.innerHTML = `<span>${t("create.f.headcount")}</span>`;
    const headcountCsel = buildCsel(headcountOpts(), "dp-headcount");
    hg.appendChild(headcountCsel);
    fields.appendChild(hg);
    dp.appendChild(nameEl);
    dp.appendChild(fields);

    if (isActorRole(role)) {
      const slotWrap = document.createElement("div");
      slotWrap.className = "role-slot-wrap";
      dp.appendChild(slotWrap);
      headcountCsel.addEventListener("change", () => updateRoleSlots(dp));
      updateRoleSlots(dp);
    }

    const next = [...wrap.querySelectorAll(".role-dp")].find(p => ROLE_ORDER.indexOf(p.dataset.role) > ROLE_ORDER.indexOf(role));
    next ? wrap.insertBefore(dp, next) : wrap.appendChild(dp);
  });
}

document.querySelectorAll(".role-cb").forEach(cb => cb.addEventListener("change", syncRolePanels));

document.querySelectorAll(".role-cb:checked").forEach(cb => cb.checked && syncRolePanels());

function applyFilters() {
  const role   = roleFilter.value;
  const region = regionFilter.value;
  const status = document.getElementById("statusFilter")?.value || "all";
  projects = [...document.querySelectorAll(".project-card")];
  projects.forEach(p => {
    const rm = role === "all" || p.dataset.role === role;
    const rg = region === "nationwide"
             || p.dataset.region === region
             || p.dataset.region === "nationwide";
    const st = status === "all" || p.dataset.status === status;
    p.style.display = rm && rg && st ? "flex" : "none";
  });
}

function calcBubbleRadius(count, minCount, maxCount) {
  const minR = 14;
  const maxR = 40;
  if (minCount === maxCount) return 26;
  return minR + ((count - minCount) / (maxCount - minCount)) * (maxR - minR);
}

function getRegionBubbleData(projectRows) {
  const counts = new Map();
  (projectRows || [])
    .filter(project => getProjectStatus(project.closing_date) === "open")
    .forEach(project => {
      const regionKeys = Array.isArray(project.regions) && project.regions.length
        ? project.regions
        : ["nationwide"];

      regionKeys.forEach(regionKey => {
        const key = String(regionKey || "nationwide").toLowerCase();
        if (key === "nationwide" || !REGION_CITY_LOOKUP[key]) return;
        counts.set(key, (counts.get(key) || 0) + 1);
      });
    });

  return [...counts.entries()]
    .map(([key, count]) => ({
      key,
      count,
      city: REGION_CITY_LOOKUP[key].labels[lang] || REGION_CITY_LOOKUP[key].labels.en
    }))
    .sort((a, b) => b.count - a.count);
}

function applyWorldRegionFilter(regionKey) {
  if (!regionFilter) return;
  const normalized = regionKey || "nationwide";
  regionFilter.value = normalized;
  selectedRegionCard = normalized === "nationwide" ? null : normalized;
  applyFilters();
  globalMapSummary?.querySelectorAll(".global-summary-card").forEach(card => {
    card.classList.toggle("is-selected", card.dataset.region === selectedRegionCard);
  });
  projectList?.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function renderWorldMapSection(projectRows) {
  if (!globalMapSummary) return;

  const regions = getRegionBubbleData(projectRows);
  if (!regions.length) {
    const emptyHtml = `<div class="global-summary-empty">${escapeHtml(t("global.empty"))}</div>`;
    globalMapSummary.innerHTML = emptyHtml;
    selectedRegionCard = null;
    return;
  }

  globalMapSummary.innerHTML = regions.map(region => {
    const countLabel = lang === "ko" ? `프로젝트 ${region.count}개` : `${region.count} projects`;
    const selectedClass = selectedRegionCard === region.key ? " is-selected" : "";
    return `<button class="global-summary-card${selectedClass}" type="button" data-region="${escapeHtml(region.key)}">
      <strong>${escapeHtml(region.city)}</strong>
      <span>${escapeHtml(countLabel)}</span>
    </button>`;
  }).join("");
}

roleFilter.addEventListener("change", applyFilters);
regionFilter.addEventListener("change", event => {
  applyWorldRegionFilter(event.target.value || "nationwide");
});
document.getElementById("statusFilter")?.addEventListener("change", applyFilters);
document.getElementById("discoverBannerSearch")?.addEventListener("click", applyFilters);
globalMapSummary?.addEventListener("click", event => {
  const card = event.target.closest(".global-summary-card");
  if (!card) return;
  const key = card.dataset.region;
  if (selectedRegionCard === key) {
    applyWorldRegionFilter("nationwide");
    return;
  }
  applyWorldRegionFilter(key);
});

/* ── DISCOVER: load projects from Supabase ───────────────── */
async function loadDiscoverProjects() {
  const loadId = ++discoverProjectsLoadId;
  projectList.innerHTML = `<p class="card-loading">${lang === "ko" ? "프로젝트 불러오는 중…" : "Loading projects…"}</p>`;

  try {
    const { data, error } = await sbClient
      .from("projects")
      .select("id, title, creator_id, regions, closing_date, recruitment_details(role_name, headcount, min_age, max_age, career_required, actor_role)")
      .order("created_at", { ascending: false })
      .limit(30);

    if (loadId !== discoverProjectsLoadId) return;

    if (error || !data || data.length === 0) {
      projectList.innerHTML = `<p class="card-empty">${lang === "ko" ? "등록된 프로젝트가 없습니다." : "No projects yet."}</p>`;
      document.getElementById("openCount").textContent = lang === "ko" ? "0개 모집 중" : "0 open";
      await renderWorldMapSection([]);
      applyFilters();
      return;
    }

    projectList.innerHTML = "";

    const projectMap = new Map();
    data.forEach(proj => {
      if (!proj || !proj.id) return;
      if (!projectMap.has(proj.id)) {
        projectMap.set(proj.id, {
          ...proj,
          recruitment_details: Array.isArray(proj.recruitment_details) ? proj.recruitment_details.slice() : []
        });
      } else {
        const existing = projectMap.get(proj.id);
        const newDetails = Array.isArray(proj.recruitment_details) ? proj.recruitment_details : [];
        existing.recruitment_details = [...existing.recruitment_details, ...newDetails];
      }
    });

    const uniqueProjects = Array.from(projectMap.values());
    const canonicalProjects = Array.from(new Map(uniqueProjects.map(proj => {
      const titleKey = String(proj.title || "").trim().toLowerCase();
      const creatorKey = proj.creator_id || "";
      const projectKey = `${creatorKey}::${titleKey}::${proj.closing_date || ""}`;
      return [projectKey, proj];
    })).values());

    if (loadId !== discoverProjectsLoadId) return;

    const openCount = canonicalProjects.filter(p => getProjectStatus(p.closing_date) === "open").length;
    document.getElementById("openCount").textContent =
      lang === "ko" ? `${openCount}개 모집 중` : `${openCount} open`;

    await renderWorldMapSection(canonicalProjects);

    if (loadId !== discoverProjectsLoadId) return;

    let participantMap = new Map();
    if (state.authed) {
      const { data: { session } } = await sbClient.auth.getSession();
      if (loadId !== discoverProjectsLoadId) return;
      if (session?.user) {
        currentUser = session.user;
        const { data: myParts, error: partErr } = await sbClient.from("project_participants")
          .select("project_id,status")
          .eq("user_id", session.user.id);
        if (loadId !== discoverProjectsLoadId) return;
        if (!partErr && myParts) myParts.forEach(p => participantMap.set(p.project_id, p.status));
      }
    }

    if (loadId !== discoverProjectsLoadId) return;

    canonicalProjects.forEach((proj, idx) => {
      const roles         = proj.recruitment_details || [];
      const primaryRegion = (proj.regions && proj.regions[0]) || "nationwide";
      const isNation      = (proj.regions || []).includes("nationwide");
      const dataRole      = roles[0]?.role_name || "all";
      const isClosed      = getProjectStatus(proj.closing_date) === "closed";
      const isOwner       = currentUser?.id && proj.creator_id === currentUser.id;
      const participation = participantMap.get(proj.id);
      const isRejected    = participation === "rejected";
      const isConfirmed   = participation === "confirmed" || participation == null;

      const chips = buildRecruitmentChips(roles);
      const visibleChips = chips.slice(0, 6);
      const extraCount = Math.max(0, chips.length - visibleChips.length);
      const tagHtml = visibleChips.map(chip => `<span class="tag">${escapeHtml(chip.label)}</span>`).join("")
        + (extraCount > 0 ? `<span class="tag tag-more">+${extraCount} more</span>` : "");

      const ownerBadgeHtml = isOwner
        ? `<span class="project-owner-tag">${lang === "ko" ? "내가 만든 프로젝트" : "My Project"}</span>`
        : "";

      let actionHtml;
      if (isOwner) {
        actionHtml = `<button class="join-btn workspace-btn">${lang === "ko" ? "워크스페이스" : "Workspace"}</button>`;
      } else if (isClosed) {
        actionHtml = `<button class="join-btn join-btn--disabled" disabled>${lang === "ko" ? "프로젝트가 종료되었습니다" : "Project has ended"}</button>`;
      } else if (isRejected) {
        actionHtml = `<button class="join-btn join-btn--disabled" disabled>${lang === "ko" ? "지원 불가" : "Cannot apply"}</button>`;
      } else if (isConfirmed && participation === "confirmed") {
        actionHtml = `<button class="join-btn join-btn--disabled" disabled>${lang === "ko" ? "참여 중" : "Joined"}</button>`;
      } else {
        actionHtml = `<button class="join-btn" data-i18n="card.join">${lang === "ko" ? "참여" : "Join"}</button>`;
      }

      const card = document.createElement("article");
      card.className = "project-card";
      card.dataset.role      = dataRole;
      card.dataset.region    = isNation ? "nationwide" : primaryRegion;
      card.dataset.projectId = proj.id;
      card.dataset.status    = isClosed ? "closed" : "open";
      card.innerHTML = `
        <div class="card-top">
          <div class="card-top-left">
            <span class="card-num">${String(idx + 1).padStart(2, "0")}</span>
            ${ownerBadgeHtml}
          </div>
          ${statusBadgeHtml(proj.closing_date)}
        </div>
        <h3 class="card-title">${escapeHtml(proj.title)}</h3>
        <div class="card-meta">
          <span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${escapeHtml(t("region." + primaryRegion) || primaryRegion)}
          </span>
        </div>
        <div class="card-tags">${tagHtml}</div>
        ${actionHtml}
      `;
      projectList.appendChild(card);
    });

    applyFilters();
  } catch (err) {
    console.error("[discover] load failed:", err);
    if (loadId !== discoverProjectsLoadId) return;
    projectList.innerHTML = `<p class="card-empty">${lang === "ko" ? "프로젝트를 불러오지 못했습니다." : "Unable to load projects."}</p>`;
    document.getElementById("openCount").textContent = lang === "ko" ? "0개 모집 중" : "0 open";
    await renderWorldMapSection([]);
    applyFilters();
  }
}

/* ── INIT ─────────────────────────────────────────────────── */
applyLang("ko");  // also calls loadDiscoverProjects()

// Restore session on page load and keep state in sync on every auth event
sbClient.auth.onAuthStateChange((event, session) => {
  if (session && (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION")) {
    state.authed = true;
    currentUser  = session.user;
    renderIdentity();
    loadDiscoverProjects();
  } else if (event === "SIGNED_OUT") {
    clearUserState();
  }
});

/* ── WORKSPACE ───────────────────────────────────────────────────────── */
let activeProjectId = null;

/* ── CHAT HELPERS ─────────────────────────────────────────── */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Returns "open" if today <= closingDate (still recruiting),
 * or "closed" if the deadline has passed (or no date provided).
 */
function getProjectStatus(closingDate) {
  if (!closingDate) return "open";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today <= new Date(closingDate) ? "open" : "closed";
}

/** Returns an HTML string for the status badge. */
function statusBadgeHtml(closingDate) {
  const status = getProjectStatus(closingDate);
  return status === "open"
    ? `<span class="status-badge status-badge--open">${lang === "ko" ? "모집 중" : "Recruiting"}</span>`
    : `<span class="status-badge status-badge--closed">${lang === "ko" ? "종료" : "Closed"}</span>`;
}

function appendChatMsg(username, content) {
  const div = document.createElement("div");
  div.className = "chat-msg";
  div.innerHTML = `<span class="chat-author">${escapeHtml(username)}</span><p>${escapeHtml(content)}</p>`;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function subscribeChatChannel(projectId) {
  if (chatChannel) {
    sbClient.removeChannel(chatChannel);
    chatChannel = null;
  }
  chatChannel = sbClient
    .channel("chat:" + projectId)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "chat_messages", filter: "project_id=eq." + projectId },
      payload => {
        console.log("[chat] realtime INSERT payload:", payload.new);
        appendChatMsg(payload.new.sender_id || "Guest", payload.new.message);
      }
    )
    .subscribe();
}

function renderWorkspaceChat(msgs) {
  chatLog.innerHTML = "";
  msgs.forEach(msg => {
    const div = document.createElement("div");
    div.className = "chat-msg";
    div.innerHTML = `<span class="chat-author">${msg.author}</span><p>${msg.text}</p>`;
    chatLog.appendChild(div);
  });
  chatLog.scrollTop = chatLog.scrollHeight;
}

async function loadWorkspaceEvents(projectId) {
  const el = document.getElementById("eventList");
  el.innerHTML = "";
  const { data, error } = await sbClient
    .from("calendar_events")
    .select("event_date, title")
    .eq("project_id", projectId)
    .order("event_date", { ascending: true });
  if (error) { console.error("[events]", error.message); return; }
  if (!data || data.length === 0) {
    el.innerHTML = `<li class="empty-item">${lang === "ko" ? "등록된 일정이 없습니다." : "No events yet."}</li>`;
    return;
  }
  data.forEach(ev => {
    const li = document.createElement("li");
    li.className = "event-item";
    li.innerHTML = `<span class="event-date">${escapeHtml(ev.event_date)}</span><span>${escapeHtml(ev.title)}</span>`;
    el.appendChild(li);
  });
}

function switchWsTab(tab) {
  document.querySelectorAll(".ws-tab").forEach(t => t.classList.toggle("active", t.dataset.tab === tab));
  document.getElementById("wsPanelChat").classList.toggle("hidden", tab !== "chat");
  document.getElementById("wsPanelCalendar").classList.toggle("hidden", tab !== "calendar");
}

async function loadWorkspace(projectId) {
  activeProjectId = projectId;
  history.replaceState(null, "", `#workspace/${projectId}`);
  // Fetch project title from Supabase
  const { data: proj } = await sbClient
    .from("projects")
    .select("title")
    .eq("id", projectId)
    .maybeSingle();
  document.getElementById("wsProjectTitle").textContent = proj?.title || projectId;
  chatLog.innerHTML = "";
  switchWsTab("chat");
  setScreen("workspace");
  // Fetch chat history from Supabase
  const { data: msgs, error: msgsError } = await sbClient
    .from("chat_messages")
    .select("sender_id, message, created_at")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true })
    .limit(100);
  console.log("[chat] history fetch → rows:", msgs?.length ?? 0, "error:", msgsError);
  if (!msgsError && msgs && msgs.length > 0) {
    msgs.forEach(m => appendChatMsg(m.sender_id || "Guest", m.message));
  }
  await loadWorkspaceEvents(projectId);
  subscribeChatChannel(projectId);
}

document.getElementById("wsBackBtn").addEventListener("click", () => {
  if (chatChannel) {
    sbClient.removeChannel(chatChannel);
    chatChannel = null;
  }
  history.replaceState(null, "", "#mypage");
  setScreen("mypage");
});

document.querySelectorAll(".ws-tab").forEach(tab => {
  tab.addEventListener("click", () => switchWsTab(tab.dataset.tab));
});

document.getElementById("eventForm").addEventListener("submit", async event => {
  event.preventDefault();
  const dateEl  = document.getElementById("eventDate");
  const titleEl = document.getElementById("eventTitle");
  const date  = dateEl.value || null;
  const title = titleEl.value.trim();
  if (!title || !activeProjectId) return;
  const { error } = await sbClient.from("calendar_events").insert({
    project_id: activeProjectId,
    event_date: date,
    title:      title
  });
  if (error) {
    console.error("[calendar] insert failed:", error.message);
    showToast(lang === "ko" ? "일정 저장 실패" : "Failed to save event");
    return;
  }
  dateEl.value  = "";
  titleEl.value = "";
  await loadWorkspaceEvents(activeProjectId);
});

document.getElementById("joinedList").addEventListener("click", event => {
  const openBtn   = event.target.closest(".ws-open-btn");
  const cancelBtn = event.target.closest(".cancel-join-btn");
  if (openBtn) {
    if (!state.authed) { authMode = "login"; updateAuthCopy(); authDialog.showModal(); return; }
    const card = openBtn.closest(".joined-card");
    if (card) loadWorkspace(card.dataset.projectId);
  }
  if (cancelBtn) {
    const card = cancelBtn.closest(".joined-card");
    if (!card) return;
    const cancelProjectId = card.dataset.projectId;
    confirmTitle.textContent = t("confirm.cancel.title");
    confirmBody.textContent  = t("confirm.cancel.body");
    confirmAction = async () => {
      if (currentUser && cancelProjectId) {
        try {
          await cancelProjectParticipation(cancelProjectId, currentUser.id);
        } catch (error) {
          console.error("[cancel-join]", error.message);
          showToast(lang === "ko" ? "참여 취소에 실패했습니다." : "Failed to cancel participation.");
          return;
        }
      }
      card.remove();
      pushNotification(t("notif.participation.cancelled"));
      await loadDiscoverProjects();
    };
    confirmDialog.showModal();
  }
});

/* ── PRE-QUESTION LOGIC ─────────────────────────────────────── */

let participationDecisionRpcAvailable = null;
let cancelParticipationRpcAvailable = null;

function isMissingDecisionRpc(error) {
  return error?.code === "PGRST202" || error?.code === "42883"
    || /answer_project_question/i.test(error?.message || "") && /not find|does not exist/i.test(error?.message || "");
}

function isMissingCancelRpc(error) {
  return error?.code === "PGRST202" || error?.code === "42883"
    || /cancel_project_participation/i.test(error?.message || "") && /not find|does not exist/i.test(error?.message || "");
}

async function cancelProjectParticipation(projId, userId) {
  if (cancelParticipationRpcAvailable !== false) {
    const { error } = await sbClient.rpc("cancel_project_participation", {
      p_project_id: projId
    });
    if (!error) {
      cancelParticipationRpcAvailable = true;
      return;
    }
    if (!isMissingCancelRpc(error)) throw error;
    cancelParticipationRpcAvailable = false;
    console.warn("[cancel-join] cancel_project_participation RPC is not installed; using client fallback.");
  }

  const { error } = await sbClient.from("project_participants")
    .delete()
    .eq("project_id", projId)
    .eq("user_id", userId)
    .or("status.neq.rejected,status.is.null");
  if (error) throw error;
}

async function readExistingParticipation(projId, userId) {
  const { data, error } = await sbClient
    .from("project_participants")
    .select("id, status")
    .eq("project_id", projId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data || null;
}

async function saveParticipationDecision({ projId, userId, roleName, answer, accepted }) {
  if (participationDecisionRpcAvailable !== false) {
    const { data, error } = await sbClient.rpc("answer_project_question", {
      p_project_id: projId,
      p_role_name: roleName || null,
      p_answer: answer
    });

    if (!error) {
      participationDecisionRpcAvailable = true;
      const result = Array.isArray(data) ? data[0] : data;
      const status = typeof result === "string" ? result : result?.status;
      if (status !== "confirmed" && status !== "rejected") {
        throw new Error("Invalid participation status returned by answer_project_question.");
      }
      return { status, existing: result?.created === false };
    }

    if (!isMissingDecisionRpc(error)) throw error;
    participationDecisionRpcAvailable = false;
    console.warn("[join] answer_project_question RPC is not installed; using guarded client fallback.");
  }

  const status = accepted ? "confirmed" : "rejected";
  const payload = { project_id: projId, user_id: userId, status };
  if (roleName) payload.role_name = roleName;

  const { error } = await sbClient.from("project_participants").insert(payload);
  if (!error) return { status, existing: false };

  if (error.code === "23505") {
    const existing = await readExistingParticipation(projId, userId);
    if (existing?.status) return { status: existing.status, existing: true };
  }
  throw error;
}

async function joinProject(projId, roleName) {
  console.log("[join] joinProject called — projId:", projId, "| roleName:", roleName);
  if (!projId) return;

  const { data: project, error: projectErr } = await sbClient
    .from("projects")
    .select("closing_date, creator_id")
    .eq("id", projId)
    .maybeSingle();
  if (projectErr) {
    console.error("[join] Project status fetch error:", projectErr.message);
    showToast(t("preq.answer.loadError"));
    return;
  }
  if (!project || getProjectStatus(project.closing_date) === "closed") {
    showToast(lang === "ko" ? "종료된 프로젝트입니다." : "This project has ended.");
    return;
  }

  const { data: { session }, error: sessionError } = await sbClient.auth.getSession();
  if (sessionError) {
    console.error("[join] Session fetch error:", sessionError.message);
    showToast(t("preq.answer.loadError"));
    return;
  }
  if (!session?.user) {
    authMode = "login"; updateAuthCopy(); authDialog.showModal();
    return;
  }

  const userId = session.user.id;
  if (project.creator_id === userId) {
    showToast(lang === "ko" ? "내가 만든 프로젝트는 워크스페이스에서 관리하세요." : "Manage your own project in Workspace.");
    return;
  }

  let existing;
  try {
    existing = await readExistingParticipation(projId, userId);
  } catch (error) {
    console.error("[join] Existing-check error:", error.message);
    showToast(t("preq.answer.loadError"));
    return;
  }

  if (existing) {
    showToast(t(existing.status === "rejected"
      ? "preq.answer.alreadyRejected"
      : "preq.answer.alreadyApplied"));
    return;
  }

  let decision;
  try {
    decision = await initiateJoin(projId);
  } catch (error) {
    console.error("[join] Pre-screening failed:", error.message);
    showToast(t("preq.answer.loadError"));
    return;
  }

  if (decision.cancelled) {
    showToast(t("preq.answer.cancelled"));
    return;
  }

  let saved;
  try {
    saved = await saveParticipationDecision({
      projId,
      userId,
      roleName,
      answer: decision.answer,
      accepted: decision.accepted
    });
  } catch (error) {
    console.error("[join] Participation save failed:", error.message);
    showToast(t("preq.answer.saveError"));
    return;
  }

  if (saved.status === "rejected") {
    showToast(t(saved.existing ? "preq.answer.alreadyRejected" : "preq.answer.rejected"));
  } else {
    showToast(t(saved.existing ? "preq.answer.alreadyApplied" : "preq.answer.approved"));
    if (!saved.existing) pushNotification(t("notif.participation.done"));
  }

  await Promise.all([loadMyPage(), loadDiscoverProjects()]);
}

async function initiateJoin(projId) {
  const { data, error } = await sbClient
    .from("project_questions")
    .select("question_text, target_answer")
    .eq("project_id", projId)
    .eq("is_active", true)
    .maybeSingle();
  if (error) throw error;

  if (!data?.question_text) {
    return { cancelled: false, accepted: true, answer: null, required: "none" };
  }

  const required = normalizeRequiredAnswer(data.target_answer);
  preqAnswerQ.textContent = data.question_text;

  return new Promise(resolve => {
    const closeBtn = document.getElementById("preqAnswerClose");
    let settled = false;

    const cleanup = () => {
      preqAnswerYes.onclick = null;
      preqAnswerNo.onclick = null;
      if (closeBtn) closeBtn.onclick = null;
      preqAnswerDialog.removeEventListener("cancel", handleCancel);
    };
    const finish = result => {
      if (settled) return;
      settled = true;
      cleanup();
      if (preqAnswerDialog.open) preqAnswerDialog.close();
      resolve(result);
    };
    const answer = value => finish({
      cancelled: false,
      accepted: evaluatePreQuestion(required, value),
      answer: value,
      required
    });
    const handleCancel = event => {
      event.preventDefault();
      finish({ cancelled: true, accepted: false, answer: null, required });
    };

    preqAnswerYes.onclick = () => answer(true);
    preqAnswerNo.onclick = () => answer(false);
    if (closeBtn) closeBtn.onclick = () => finish({ cancelled: true, accepted: false, answer: null, required });
    preqAnswerDialog.addEventListener("cancel", handleCancel);
    preqAnswerDialog.showModal();
  });
}

function openPreqDialog() {
  console.log("[preq] openPreqDialog called");
  try {
    document.getElementById("preqText") && (document.getElementById("preqText").value = currentPreq.text);
    quillPreq.root.innerHTML = DOMPurify.sanitize(currentPreq.text || "");
    setCselValue("preqRequired", currentPreq.required);
    document.getElementById("preqCount").textContent = quillPreq.getText().trim().length;
    preqDialog.showModal();
    console.log("[preq] dialog opened");
  } catch (err) {
    console.error("[preq] openPreqDialog error:", err);
  }
}

function savePreq() {
  const q = quillPreq.getText().trim();
  const r = document.getElementById("preqRequired").dataset.value || "none";
  currentPreq = { text: q, required: r };
  preqDialog.close();
  if (q) {
    document.getElementById("preqPreviewQ").textContent   = q;
    const metaMap = {
      none: t("preq.opt.none"),
      yes:  t("preq.opt.yes"),
      no:   t("preq.opt.no")
    };
    document.getElementById("preqPreviewMeta").textContent = metaMap[r] || "";
    document.getElementById("preqSetupRow").classList.add("hidden");
    document.getElementById("preqPreview").classList.remove("hidden");
  } else {
    document.getElementById("preqSetupRow").classList.remove("hidden");
    document.getElementById("preqPreview").classList.add("hidden");
  }
}

document.getElementById("preqSetBtn").addEventListener("click",  openPreqDialog);
document.getElementById("preqEditBtn").addEventListener("click", openPreqDialog);
document.getElementById("preqOk").addEventListener("click",       savePreq);
document.getElementById("preqClose").addEventListener("click",    () => preqDialog.close());

/* ── QUILL EDITOR INIT ───────────────────────────────────── */
const QUILL_TOOLBAR = [
  ["bold", "italic", "underline"],
  [{ color: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["clean"]
];

// Create project description editor
const quillDesc = new Quill("#projectDescEditor", {
  theme: "snow",
  placeholder: "Brief, tone, objectives, and collaboration expectations.",
  modules: { toolbar: QUILL_TOOLBAR }
});
quillDesc.on("text-change", () => {
  const len = quillDesc.getText().length - 1; // Quill always has a trailing \n
  document.getElementById("descCount").textContent = `(${Math.min(len, 1000)}/1000)`;
});

// Edit project description editor
const quillEditDesc = new Quill("#editProjDescEditor", {
  theme: "snow",
  placeholder: "Brief, tone, objectives, and collaboration expectations.",
  modules: { toolbar: QUILL_TOOLBAR }
});

// Pre-screening question editor
const quillPreq = new Quill("#preqTextEditor", {
  theme: "snow",
  placeholder: "Enter a Yes/No question...",
  modules: {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ color: [] }],
      ["clean"]
    ]
  },
  formats: ["bold", "italic", "underline", "color"]
});
quillPreq.on("text-change", () => {
  const len = Math.min(quillPreq.getText().length - 1, 100);
  document.getElementById("preqCount").textContent = len;
  // enforce 100-char limit
  if (quillPreq.getText().length - 1 > 100) {
    quillPreq.deleteText(100, quillPreq.getText().length);
  }
});

/* ── DATE PICKER — click anywhere opens native picker ───────── */
const closingDateInput = document.getElementById("closingDate");
if (closingDateInput) {
  closingDateInput.addEventListener("click", function () {
    try { this.showPicker(); } catch (_) {}
  });
}
