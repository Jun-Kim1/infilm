/* --- SUPABASE ------------------------------------------- */
const SUPABASE_URL = "https://fexwivtwuxsrjfrkqgam.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_8JpAW0UnLFAGErcJw26Zig_5_30AJ1a";

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
    "discover.title1": "Find the right crew", "discover.title2": "without friction",
    "discover.sub": "Find projects by role, region, and shooting period.",
    "discover.footer": "More projects loading as crews publish their calls",
    "filter.role.label": "ROLE", "filter.region.label": "REGION", "filter.status.label": "STATUS",
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
    "discover.title1": "번거로움 없이", "discover.title2": "딱 맞는 크루를 찾으세요",
    "discover.sub": "역할, 지역, 촬영 기간으로 원하는 프로젝트를 찾으세요.",
    "discover.footer": "새 프로젝트가 계속 추가되고 있습니다",
    "filter.role.label": "역할", "filter.region.label": "지역", "filter.status.label": "모집 상태",
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
const createForm     = document.getElementById("createForm");
const createdList    = document.getElementById("createdList");
const confirmDialog  = document.getElementById("confirmDialog");
const confirmTitle   = document.getElementById("confirmTitle");
const confirmBody    = document.getElementById("confirmBody");
const confirmYes     = document.getElementById("confirmYes");
const editProjectDialog  = document.getElementById("editProjectDialog");
const editProjTitle      = document.getElementById("editProjTitle");
const editProjDesc       = document.getElementById("editProjDesc");
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
let   projects       = [];   // populated by loadDiscoverProjects()

let authMode     = "login";
let confirmAction = null;
let currentUser  = null;
let chatChannel  = null;
let currentPreq  = { text: "", required: "none" };

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

  updateAuthCopy();
  renderIdentity();
  renderNotifications();
  // sync custom select displayed labels after text update
  document.querySelectorAll(".csel").forEach(csel => {
    const sel = csel.querySelector(`.csel-opt[data-value="${csel.dataset.value}"]`);
    if (sel) csel.querySelector(".csel-label").textContent = sel.textContent;
  });
  loadRoleStats();
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

async function showProjectStats() {
  const { data: { session } } = await sbClient.auth.getSession();
  if (!session?.user) {
    authMode = "login"; updateAuthCopy(); authDialog.showModal();
    return;
  }

  // Navigate to screen immediately and show loading state
  const detailModal = document.getElementById("projectDetailModal");
  if (detailModal?.open) detailModal.close();
  document.getElementById("projectStatsPanel").classList.remove("hidden");
  document.getElementById("projectDetailPanel").classList.add("hidden");
  setScreen("project");

  ["statProjects", "statParticipants", "statActive"].forEach(id => {
    document.getElementById(id).textContent = "…";
  });
  document.getElementById("roleStatBars").innerHTML =
    `<p class="card-empty">${lang === "ko" ? "불러오는 중…" : "Loading…"}</p>`;

  // Fetch all projects owned by the current user
  const { data: owned, error: ownedErr } = await sbClient
    .from("projects")
    .select("id, title")
    .eq("creator_id", session.user.id)
    .order("created_at", { ascending: false });

  console.log("User projects:", owned);
  if (ownedErr) console.error("[stats] ownership fetch error:", ownedErr.message);

  if (!owned?.length) {
    showToast(lang === "ko"
      ? "프로젝트를 먼저 생성해야 이 화면에 접근할 수 있습니다."
      : "Create a project first to access this area.");
    ["statProjects", "statParticipants", "statActive"].forEach(id => {
      document.getElementById(id).textContent = "–";
    });
    document.getElementById("roleStatBars").innerHTML = "";
    return;
  }

  // Multi-project picker: only shown when user owns more than one project
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

  // Load stats for the first (or only) project
  const firstId = owned[0].id;
  loadProjectStats(firstId);
  loadRoleStats(firstId);
}


async function loadProjectDetail(projectId) {
  console.log("[join] Step 1: loadProjectDetail called — projectId:", projectId);
  try {
    const { data: proj, error } = await sbClient
      .from("projects")
      .select("id, title, description, regions, closing_date, creator_id, recruitment_details(role_name, headcount, min_age, max_age, career_required)")
      .eq("id", projectId)
      .single();

    if (error || !proj) {
      console.error("[join] Project fetch failed:", error?.message);
      return;
    }
    console.log("[join] Step 2: Project fetched →", proj.title);

    document.getElementById("modalDetailTitle").textContent = proj.title || "";
    const descEl = document.getElementById("modalDetailDesc");
    if (descEl) descEl.textContent = proj.description || "";

    const statusEl = document.getElementById("modalDetailStatus");
    if (statusEl) statusEl.innerHTML = statusBadgeHtml(proj.closing_date);

    const regionText = (proj.regions || [])
      .map(r => t("region." + r) || r)
      .join(" · ") || (lang === "ko" ? "전국" : "Nationwide");
    const regionEl = document.getElementById("modalDetailRegion");
    if (regionEl) {
      regionEl.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> ${escapeHtml(regionText)}`;
    }

    const slotsEl = document.getElementById("modalDetailSlots");
    if (slotsEl) {
      const roles = proj.recruitment_details || [];
      const slotsLabel = lang === "ko" ? "모집 분야" : "Open positions";

      const { data: { session: ownSess } } = await sbClient.auth.getSession();
      const isOwner = ownSess?.user?.id === proj.creator_id;
      const manageBtnHtml = isOwner
        ? `<button class="manage-project-btn" onclick="showProjectStats()">${lang === "ko" ? "프로젝트 관리 →" : "Manage project →"}</button>`
        : "";

      const slotsHtml = roles.length
        ? roles.map(r => {
            const roleName  = t("role." + r.role_name) || r.role_name;
            const agePart   = (r.min_age && r.max_age)
              ? ` · ${r.min_age}–${r.max_age}${lang === "ko" ? "세" : "y.o."}`
              : "";
            const countPart = lang === "ko" ? `×${r.headcount}명 모집` : `×${r.headcount} wanted`;
            return `<button class="slot-row role-join" data-role="${escapeHtml(r.role_name)}" data-project-id="${escapeHtml(proj.id)}">
              <span>${escapeHtml(roleName)}${agePart}</span>
              <span class="slot-count">${countPart}</span>
            </button>`;
          }).join("")
        : `<p class="card-empty">${lang === "ko" ? "모집 분야 없음" : "No open positions"}</p>`;
      slotsEl.innerHTML = `<p class="slots-label">${slotsLabel}</p>${slotsHtml}${manageBtnHtml}`;
    }

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

/* ── EVENT LISTENERS ──────────────────────────────────────── */
navItems.forEach(item => item.addEventListener("click", () => {
  if (item.dataset.screen === "project") { showProjectStats(); return; }
  if (item.dataset.screen === "mypage")  { loadMyPage(); }
  setScreen(item.dataset.screen);
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
closeNotify.addEventListener("click", closeDrawer);
drawerOverlay.addEventListener("click", closeDrawer);

authBtn.addEventListener("click", async () => {
  if (state.authed) {
    const msg = t("notif.logout");
    clearUserState();
    await sbClient.auth.signOut();
    showToast(msg);
    setScreen("discover");
    return;
  }
  authMode = "login";
  updateAuthCopy();
  authDialog.showModal();
});

authCancel.addEventListener("click", () => authDialog.close());

authSwitch.addEventListener("click", () => {
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

  const result = authMode === "signup"
    ? await signUpUser(email, password, name)
    : await signInUser(email, password);

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

  setTimeout(() => {
    authDialog.close();
    authMessage.textContent = "";
    authMessage.className   = "auth-message";
    authForm.reset();
  }, 1400);
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
  if (!state.authed) { authMode = "login"; updateAuthCopy(); authDialog.showModal(); return; }
  const joinCard = btn.closest(".project-card");
  const projId   = joinCard?.dataset.projectId || "";
  if (projId) joinProject(projId, null);
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
    editProjDesc.value  = data?.description || "";
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
  const newTitle = editProjTitle.value.trim();
  const newDesc  = editProjDesc.value.trim();
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
  const desc      = document.getElementById("projectDesc").value.trim();
  const regionCbs = [...document.querySelectorAll('[name="proj-region"]:checked')];
  const regions   = regionCbs.length ? regionCbs.map(cb => cb.value) : ["nationwide"];

  const roles = [...document.querySelectorAll("#roleDetails .role-dp")].map(dp => {
    const hcVal = dp.querySelector(".dp-headcount")?.dataset.value ?? "1";
    const minVal = dp.querySelector(".dp-age-min")?.dataset.value;
    const maxVal = dp.querySelector(".dp-age-max")?.dataset.value;
    return {
      role:      dp.dataset.role,
      headcount: hcVal === "6+" ? 6 : (parseInt(hcVal) || 1),
      minAge:    (minVal && minVal !== "") ? parseInt(minVal) : null,
      maxAge:    (maxVal && maxVal !== "") ? parseInt(maxVal) : null,
      career:    (dp.querySelector(".dp-career")?.dataset.value || "any") !== "any"
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
    const { error: rolesError } = await sbClient
      .from("recruitment_details")
      .insert(
        formData.roles.map(r => ({
          project_id:      projectId,
          role_name:       r.role,
          headcount:       r.headcount,
          min_age:         r.minAge,
          max_age:         r.maxAge,
          career_required: r.career
        }))
      );
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
        target_answer: formData.preq.required === "none" ? null : formData.preq.required,
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
// textarea char counter
document.getElementById("projectDesc").addEventListener("input", function () {
  document.getElementById("descCount").textContent = `(${this.value.length}/1000)`;
});

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
    const csel   = trigger.closest(".csel");
    const wasOpen = csel.classList.contains("csel-open");
    document.querySelectorAll(".csel.csel-open").forEach(s => s.classList.remove("csel-open"));
    if (!wasOpen) csel.classList.add("csel-open");
    e.stopPropagation();
    return;
  }
  if (opt) {
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
    hg.appendChild(buildCsel(headcountOpts(), "dp-headcount"));
    fields.appendChild(hg);
    // age
    const ag = document.createElement("div"); ag.className = "role-dp-group";
    ag.innerHTML = `<span>${t("create.f.age")}</span>`;
    ag.appendChild(buildCsel(ageOpts(), "dp-age-min"));
    const tilde = document.createElement("span"); tilde.textContent = "\u007e"; tilde.className = "dp-tilde";
    ag.appendChild(tilde);
    ag.appendChild(buildCsel(ageOpts(), "dp-age-max"));
    fields.appendChild(ag);
    // career
    const cg = document.createElement("div"); cg.className = "role-dp-group";
    cg.innerHTML = `<span>${t("create.f.career")}</span>`;
    cg.appendChild(buildCsel(careerOpts(), "dp-career"));
    fields.appendChild(cg);
    dp.appendChild(nameEl);
    dp.appendChild(fields);
    const next = [...wrap.querySelectorAll(".role-dp")].find(p => ROLE_ORDER.indexOf(p.dataset.role) > ROLE_ORDER.indexOf(role));
    next ? wrap.insertBefore(dp, next) : wrap.appendChild(dp);
  });
}

document.querySelectorAll(".role-cb").forEach(cb => cb.addEventListener("change", syncRolePanels));

chatForm.addEventListener("submit", async event => {
  event.preventDefault();
  const text = chatInput.value.trim();
  if (!text || !activeProjectId) return;
  chatInput.value = "";
  chatInput.disabled = true;

  const senderId = currentUser?.id ?? null;
  const payload = { project_id: activeProjectId, sender_id: senderId, message: text };
  console.log("[chat] inserting:", payload);

  const { data: insertData, error } = await sbClient.from("chat_messages").insert(payload).select();
  console.log("[chat] insert result → data:", insertData, "error:", error);

  chatInput.disabled = false;
  chatInput.focus();
  if (error) {
    console.error("[chat] insert failed:", error.message);
    // Fallback: show message locally so the user isn't left wondering
    appendChatMsg(currentUser?.email || "나", text);
  }
  // On success the realtime subscription will append the message
  pushNotification(t("notif.chat"));
});

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
roleFilter.addEventListener("change", applyFilters);
regionFilter.addEventListener("change", applyFilters);
document.getElementById("statusFilter")?.addEventListener("change", applyFilters);

/* ── DISCOVER: load projects from Supabase ───────────────── */
async function loadDiscoverProjects() {
  projectList.innerHTML = `<p class="card-loading">${lang === "ko" ? "프로젝트 불러오는 중…" : "Loading projects…"}</p>`;

  const { data, error } = await sbClient
    .from("projects")
    .select("id, title, regions, closing_date, recruitment_details(role_name, headcount, min_age, max_age)")
    .order("created_at", { ascending: false })
    .limit(30);

  projectList.innerHTML = "";

  if (error || !data || data.length === 0) {
    projectList.innerHTML = `<p class="card-empty">${lang === "ko" ? "등록된 프로젝트가 없습니다." : "No projects yet."}</p>`;
    document.getElementById("openCount").textContent = lang === "ko" ? "0개 모집 중" : "0 open";
    applyFilters();
    return;
  }

  const openCount = data.filter(p => getProjectStatus(p.closing_date) === "open").length;
  document.getElementById("openCount").textContent =
    lang === "ko" ? `${openCount}개 모집 중` : `${openCount} open`;

  data.forEach((proj, idx) => {
    const roles         = proj.recruitment_details || [];
    const primaryRegion = (proj.regions && proj.regions[0]) || "nationwide";
    const isNation      = (proj.regions || []).includes("nationwide");
    const dataRole      = roles[0]?.role_name || "all";

    const tagHtml = roles.slice(0, 3).map(r => {
      const roleName = t("role." + r.role_name) || r.role_name;
      let label = `${roleName} ×${r.headcount}`;
      if (r.min_age && r.max_age) label += ` / ${r.min_age}–${r.max_age}`;
      return `<span class="tag">${escapeHtml(label)}</span>`;
    }).join("");

    const card = document.createElement("article");
    card.className = "project-card";
    card.dataset.role      = dataRole;
    card.dataset.region    = isNation ? "nationwide" : primaryRegion;
    card.dataset.projectId = proj.id;
    card.dataset.status    = getProjectStatus(proj.closing_date);
    card.innerHTML = `
      <div class="card-top">
        <span class="card-num">${String(idx + 1).padStart(2, "0")}</span>
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
      <button class="join-btn" data-i18n="card.join">${lang === "ko" ? "참여" : "Join"}</button>
    `;
    projectList.appendChild(card);
  });

  applyFilters();
}

/* ── INIT ─────────────────────────────────────────────────── */
applyLang("ko");
loadDiscoverProjects();

// Restore session on page load and keep state in sync on every auth event
sbClient.auth.onAuthStateChange((event, session) => {
  if (session && (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION")) {
    state.authed = true;
    currentUser  = session.user;
    renderIdentity();
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
        const { error } = await sbClient.from("project_participants")
          .delete()
          .eq("project_id", cancelProjectId)
          .eq("user_id", currentUser.id);
        if (error) console.error("[cancel-join]", error.message);
      }
      card.remove();
      pushNotification(t("notif.participation.cancelled"));
    };
    confirmDialog.showModal();
  }
});

/* ── PRE-QUESTION LOGIC ─────────────────────────────────────── */

async function joinProject(projId, roleName) {
  console.log("[join] joinProject called — projId:", projId, "| roleName:", roleName);
  if (!projId) { console.warn("[join] No projId, aborting."); return; }

  const { data: { session } } = await sbClient.auth.getSession();
  if (!session?.user) {
    console.log("[join] Not logged in — showing auth modal");
    authMode = "login"; updateAuthCopy(); authDialog.showModal();
    return;
  }
  const userId = session.user.id;
  console.log("[join] Auth OK — userId:", userId);

  // Guard: check for any existing participation record
  const { data: existing, error: existErr } = await sbClient
    .from("project_participants")
    .select("id, status")
    .eq("project_id", projId)
    .eq("user_id", userId)
    .maybeSingle();
  if (existErr) console.error("[join] Existing-check error:", existErr.message);

  if (existing) {
    console.log("[join] Duplicate found — status:", existing.status);
    showToast(lang === "ko" ? "이미 참여 이력이 있는 프로젝트입니다." : "You have already applied to this project.");
    return;
  }
  console.log("[join] No existing record — proceeding to pre-screening");

  initiateJoin(
    projId,
    async () => {
      console.log("[join] Criteria check: PASSED — inserting confirmed record");
      const full = { project_id: projId, user_id: userId, status: "confirmed" };
      if (roleName) full.role_name = roleName;
      const { error } = await sbClient.from("project_participants").insert(full);
      if (error) {
        console.warn("[join] Primary insert failed (code:", error.code, "):", error.message);
        if (error.code !== "23505") {
          const { error: fe } = await sbClient.from("project_participants")
            .insert({ project_id: projId, user_id: userId });
          if (fe) console.error("[join] Fallback insert also failed:", fe.message);
          else    console.log("[join] Fallback insert OK");
        }
      } else {
        console.log("[join] Inserting to DB: SUCCESS");
      }
      showToast(lang === "ko" ? "프로젝트에 참여하게 되었습니다!" : "You have successfully joined the project!");
      pushNotification(t("notif.participation.done"));
      await loadMyPage();
    },
    async () => {
      console.log("[join] Criteria check: FAILED — recording rejection");
      const { error: re } = await sbClient.from("project_participants")
        .insert({ project_id: projId, user_id: userId, status: "rejected" });
      if (re) console.warn("[join] Rejection insert failed:", re.message);
      showToast(lang === "ko" ? "아쉽게도 성격이 달라 참여하지 못했습니다." : "Sorry, you cannot join due to conflicting characteristics.");
    }
  );
}

async function initiateJoin(projId, onApproved, onWaiting) {
  console.log("[join] Questionnaire triggered — fetching pre-screening question for projId:", projId);
  const { data, error } = await sbClient
    .from("project_questions")
    .select("question_text, target_answer")
    .eq("project_id", projId)
    .eq("is_active", true)
    .maybeSingle();
  if (error) console.error("[join] project_questions fetch error:", error.message);
  if (!data || !data.question_text) {
    console.log("[join] No pre-screening question found — auto-approving");
    onApproved();
    return;
  }
  console.log("[join] Pre-screening question:", data.question_text, "| required answer:", data.target_answer);
  preqAnswerQ.textContent = data.question_text;
  const required = data.target_answer || "none";
  const cleanup = () => {
    preqAnswerYes.onclick = null;
    preqAnswerNo.onclick  = null;
    const closeBtn = document.getElementById("preqAnswerClose");
    if (closeBtn) closeBtn.onclick = null;
  };
  preqAnswerYes.onclick = () => {
    console.log("[join] User answered: YES | required:", required);
    cleanup(); preqAnswerDialog.close();
    (required === "none" || required === "yes") ? onApproved() : onWaiting();
  };
  preqAnswerNo.onclick = () => {
    console.log("[join] User answered: NO | required:", required);
    cleanup(); preqAnswerDialog.close();
    (required === "none" || required === "no") ? onApproved() : onWaiting();
  };
  const closeBtn = document.getElementById("preqAnswerClose");
  if (closeBtn) closeBtn.onclick = () => {
    console.log("[join] Pre-screening dialog dismissed by user");
    cleanup(); preqAnswerDialog.close();
  };
  preqAnswerDialog.showModal();
}

function openPreqDialog() {
  console.log("[preq] openPreqDialog called");
  try {
    document.getElementById("preqText").value = currentPreq.text;
    setCselValue("preqRequired", currentPreq.required);
    document.getElementById("preqCount").textContent = currentPreq.text.length;
    preqDialog.showModal();
    console.log("[preq] dialog opened");
  } catch (err) {
    console.error("[preq] openPreqDialog error:", err);
  }
}

function savePreq() {
  const q = document.getElementById("preqText").value.trim();
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
document.getElementById("preqText").addEventListener("input", function () {
  document.getElementById("preqCount").textContent = this.value.length;
});

/* ── DATE PICKER — click anywhere opens native picker ───────── */
const closingDateInput = document.getElementById("closingDate");
if (closingDateInput) {
  closingDateInput.addEventListener("click", function () {
    try { this.showPicker(); } catch (_) {}
  });
}
