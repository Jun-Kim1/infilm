/* --- SUPABASE ------------------------------------------- */
const SUPABASE_URL = "https://fexwivtwuxsrjfrkqgam.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_8JpAW0UnLFAGErcJw26Zig_5_30AJ1a";

const sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function signUpUser(email, password, displayName) {
  const { data, error } = await sbClient.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } }
  });
  return { user: data?.user ?? null, session: data?.session ?? null, error };
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
    "discover.label": "DISCOVERY", "discover.open": "3 open",
    "discover.title1": "Find the right crew", "discover.title2": "without friction",
    "discover.sub": "Filter by role, region, and production window. Joining requires authentication and clearly communicates policy.",
    "discover.footer": "More projects loading as crews publish their calls",
    "filter.role.label": "ROLE", "filter.region.label": "REGION", "filter.date.label": "RECRUITING UNTIL",
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
    "create.sub": "Define roles, region, and pre-screening. Advanced restrictions on Premium.",
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
    "btn.edit": "Edit", "btn.delete": "Delete", "btn.cancel": "Cancel",
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
    "notif.joined.default": "You joined Glass Corridor as Editor.",
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
    "discover.label": "작품 탐색", "discover.open": "3개 모집 중",
    "discover.title1": "번거로움 없이", "discover.title2": "딱 맞는 크루를 찾으세요",
    "discover.sub": "역할, 지역, 촬영 기간으로 원하는 프로젝트를 찾으세요. 참여 신청은 로그인 후 가능하며 취소 패널티 정책을 명확히 안내합니다.",
    "discover.footer": "새 프로젝트가 계속 추가되고 있습니다",
    "filter.role.label": "역할", "filter.region.label": "지역", "filter.date.label": "모집 기간",
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
    "create.sub": "역할, 지역, 사전 질문을 정의하세요. 고급 기능은 프리미엄 전용입니다.",
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
    "btn.edit": "편집", "btn.delete": "삭제", "btn.cancel": "취소",
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
    "notif.joined.default": "Glass Corridor에 에디터로 참여했습니다.",
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
  notifications: [
    { key: "notif.created" },
    { key: "notif.joined.default" }
  ]
};

/* ── DOM REFERENCES ───────────────────────────────────────── */
const screens        = [...document.querySelectorAll(".screen")];
const navItems       = [...document.querySelectorAll(".nav-item")];
const joinButtons    = [...document.querySelectorAll(".join-btn")];
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
const detailTitle    = document.getElementById("detailTitle");
const detailDesc     = document.getElementById("detailDesc");
const confirmDialog  = document.getElementById("confirmDialog");
const confirmTitle   = document.getElementById("confirmTitle");
const confirmBody    = document.getElementById("confirmBody");
const confirmYes     = document.getElementById("confirmYes");
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
const projects       = [...document.querySelectorAll(".project-card")];

let authMode = "login";
let confirmAction = null;
let currentUser = null;
let chatChannel = null;

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
  renderRoleStats();
}

/* ── SCREEN NAV ───────────────────────────────────────────── */
function setScreen(id) {
  screens.forEach(s => s.classList.toggle("active", s.id === id));
  navItems.forEach(item => item.classList.toggle("active", item.dataset.screen === id));
}

/* ── PROJECT STATS ────────────────────────────────────────── */
const ROLE_STATS = [
  { role: "director",    count: 14 },
  { role: "assdirector", count: 9  },
  { role: "maleactor",   count: 31 },
  { role: "femaleactor", count: 28 },
  { role: "filming",     count: 22 },
  { role: "music",       count: 11 },
  { role: "editing",     count: 18 },
  { role: "script",      count: 7  }
];

function renderRoleStats() {
  const el = document.getElementById("roleStatBars");
  if (!el) return;
  const max = Math.max(...ROLE_STATS.map(r => r.count));
  const unit = lang === "ko" ? "명" : "";
  el.innerHTML = ROLE_STATS.map(r => {
    const pct = Math.round(r.count / max * 100);
    return `<div class="stat-bar-row">
      <span class="stat-bar-role">${t("role." + r.role)}</span>
      <div class="stat-bar-track"><div class="stat-bar-fill" style="width:${pct}%"></div></div>
      <span class="stat-bar-count">${r.count}${unit}</span>
    </div>`;
  }).join("");
}

function showProjectStats() {
  document.getElementById("projectStatsPanel").classList.remove("hidden");
  document.getElementById("projectDetailPanel").classList.add("hidden");
  setScreen("project");
}

function showProjectDetail(title, desc) {
  detailTitle.textContent = title || "";
  detailDesc.textContent  = desc  || "";
  document.getElementById("projectStatsPanel").classList.add("hidden");
  document.getElementById("projectDetailPanel").classList.remove("hidden");
  setScreen("project");
}

/* ── NOTIFICATIONS ────────────────────────────────────────── */
function pushNotification(message) {
  state.notifications.unshift(message);
  renderNotifications();
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

function updateAuthCopy() {
  const isSignup = authMode === "signup";
  authTitle.textContent = isSignup ? t("modal.signup.title") : t("modal.login.title");
  authSwitch.textContent = isSignup ? t("modal.toLogin") : t("modal.toSignup");
  signupNameWrap.classList.toggle("hidden", !isSignup);
}

/* ── EVENT LISTENERS ──────────────────────────────────────── */
navItems.forEach(item => item.addEventListener("click", () => {
  if (item.dataset.screen === "project") { showProjectStats(); return; }
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

authBtn.addEventListener("click", () => {
  if (state.authed) {
    state.authed = false;
    currentUser = null;
    sbClient.auth.signOut();
    renderIdentity();
    pushNotification(t("notif.logout"));
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

joinButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (!state.authed) { authMode = "login"; updateAuthCopy(); authDialog.showModal(); return; }
    const card   = btn.closest(".project-card");
    const projId = card?.dataset.projectId || "";
    initiateJoin(
      projId,
      () => {
        confirmTitle.textContent = t("confirm.join.title");
        confirmBody.textContent  = t("confirm.join.body");
        confirmAction = () => { pushNotification(t("preq.answer.autojoin")); setScreen("mypage"); };
        confirmDialog.showModal();
      },
      () => pushNotification(t("preq.answer.waiting"))
    );
  });
});

roleJoinBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    if (!state.authed) { authMode = "login"; updateAuthCopy(); authDialog.showModal(); return; }
    const roleKey     = "role." + btn.dataset.role.replace("-", "");
    const roleDisplay = t(roleKey);
    const projId      = detailTitle.textContent.toLowerCase().replace(/\s+/g, "-");
    initiateJoin(
      projId,
      () => {
        confirmTitle.textContent = lang === "ko" ? `${roleDisplay}로 참여` : `Join as ${roleDisplay}`;
        confirmBody.textContent  = t("confirm.join.body");
        confirmAction = () => {
          const msg = lang === "ko"
            ? `${detailTitle.textContent}에 ${roleDisplay}로 참여했습니다.`
            : `You joined ${detailTitle.textContent} as ${roleDisplay}.`;
          if (!MOCK_WORKSPACES[projId]) {
            MOCK_WORKSPACES[projId] = { title: detailTitle.textContent, chat: [], events: [] };
          }
          if (!document.querySelector(`.joined-card[data-project-id="${projId}"]`)) {
            const li = document.createElement("li");
            li.className = "list-item joined-card";
            li.dataset.projectId = projId;
            li.innerHTML = `<div class="joined-info"><span class="joined-title">${detailTitle.textContent}</span><span class="status-pill active">${t("ws.status.active")}</span></div><div class="item-actions"><button class="micro-btn ws-open-btn">${t("ws.open")}</button><button class="micro-btn danger cancel-join-btn">${t("btn.cancel")}</button></div>`;
            document.getElementById("joinedList").prepend(li);
          }
          pushNotification(msg);
          loadWorkspace(projId);
        };
        confirmDialog.showModal();
      },
      () => pushNotification(t("preq.answer.waiting"))
    );
  });
});

confirmYes.addEventListener("click", () => {
  if (typeof confirmAction === "function") confirmAction();
  confirmAction = null;
});

/* ── PROJECT CREATION — Supabase integration ──────────────── */

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
      career:    dp.querySelector(".dp-career")?.dataset.value || "any"
    };
  });

  return { title, description: desc, regions, roles, preq: { ...currentPreq } };
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
      creator_id:  userId,
      title:       formData.title,
      description: formData.description,
      regions:     formData.regions          // stored as array (text[])
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

  // ── Update UI on success ──────────────────────────────────────
  const item = document.createElement("li");
  item.className = "list-item";
  item.dataset.projectId = projectId;
  item.innerHTML =
    `<span>${formData.title}</span>` +
    `<span class="item-actions">` +
      `<button class="micro-btn" data-i18n="btn.edit">${t("btn.edit")}</button>` +
      `<button class="micro-btn danger" data-i18n="btn.delete">${t("btn.delete")}</button>` +
    `</span>`;
  createdList.prepend(item);

  detailTitle.textContent = formData.title;
  detailDesc.textContent  = formData.description;

  pushNotification(
    lang === "ko"
      ? `프로젝트 공고: ${formData.title}`
      : `Project published: ${formData.title}.`
  );
  showProjectDetail(formData.title, formData.description);
  resetCreateForm();
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
  const username = currentUser?.user_metadata?.display_name
    || currentUser?.email?.split("@")[0]
    || (lang === "ko" ? "나" : "You");
  const { error } = await sbClient.from("chat_messages").insert({
    project_id: activeProjectId,
    user_id:    currentUser?.id ?? null,
    username:   username,
    content:    text
  });
  chatInput.disabled = false;
  chatInput.focus();
  if (error) {
    console.error("[chat] insert failed:", error.message);
    // Fallback: show message locally so the user isn't left wondering
    appendChatMsg(username, text);
  }
  // On success the realtime subscription will append the message
  pushNotification(t("notif.chat"));
});

function applyFilters() {
  const role   = roleFilter.value;
  const region = regionFilter.value;
  projects.forEach(p => {
    const rm = role   === "all" || p.dataset.role   === role;
    const rg = region === "Nationwide"             // 전국 = show all
             || p.dataset.region === region
             || p.dataset.region === "Nationwide"; // nationwide projects appear in any region
    p.style.display = rm && rg ? "flex" : "none";
  });
}
roleFilter.addEventListener("change", applyFilters);
regionFilter.addEventListener("change", applyFilters);

/* ── INIT ─────────────────────────────────────────────────── */
applyLang("en");
applyFilters();

/* ── WORKSPACE ───────────────────────────────────────────────────────── */
const MOCK_WORKSPACES = {
  "warm-static": {
    title: "Warm Static",
    chat: [
      { author: "Director", text: "팀 구성 완료. 금요일 킵오프 미팅 확인해주세요." },
      { author: "Actor",    text: "네, 확인했습니다. 대본 미리 받을 수 있나요?" }
    ],
    events: [
      { date: "2026-09-03", title: "킵오프 미팅" },
      { date: "2026-09-05", title: "대본 리딩" },
      { date: "2026-09-06", title: "촬영" }
    ]
  },
  "noon-in-black": {
    title: "Noon in Black",
    chat: [
      { author: "Composer", text: "음악 레퍼런스 공유드립니다." }
    ],
    events: [
      { date: "2026-09-11", title: "킵오프 미팅" },
      { date: "2026-09-15", title: "촬영 1일차" },
      { date: "2026-09-23", title: "촬영 완료" }
    ]
  }
};

let activeProjectId = null;

/* ── CHAT HELPERS ─────────────────────────────────────────── */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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
      payload => { appendChatMsg(payload.new.username || "Guest", payload.new.content); }
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

function renderWorkspaceEvents(events) {
  const el = document.getElementById("eventList");
  el.innerHTML = "";
  events.forEach(ev => {
    const li = document.createElement("li");
    li.className = "event-item";
    li.innerHTML = `<span class="event-date">${ev.date}</span><span>${ev.title}</span>`;
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
  const mockData = MOCK_WORKSPACES[projectId];
  document.getElementById("wsProjectTitle").textContent = mockData ? mockData.title : projectId;
  if (mockData) renderWorkspaceEvents(mockData.events);
  chatLog.innerHTML = "";
  switchWsTab("chat");
  setScreen("workspace");
  // Fetch chat history from Supabase
  const { data: msgs, error } = await sbClient
    .from("chat_messages")
    .select("username, content, created_at")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true })
    .limit(100);
  if (!error && msgs && msgs.length > 0) {
    msgs.forEach(m => appendChatMsg(m.username || "Guest", m.content));
  } else if (!error && mockData) {
    renderWorkspaceChat(mockData.chat);
  }
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

document.getElementById("eventForm").addEventListener("submit", event => {
  event.preventDefault();
  const dateEl  = document.getElementById("eventDate");
  const titleEl = document.getElementById("eventTitle");
  const date  = dateEl.value || "TBD";
  const title = titleEl.value.trim();
  if (!title) return;
  if (activeProjectId && MOCK_WORKSPACES[activeProjectId]) {
    MOCK_WORKSPACES[activeProjectId].events.push({ date, title });
    renderWorkspaceEvents(MOCK_WORKSPACES[activeProjectId].events);
  }
  dateEl.value = "";
  titleEl.value = "";
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
    confirmTitle.textContent = t("confirm.cancel.title");
    confirmBody.textContent  = t("confirm.cancel.body");
    confirmAction = () => {
      card.remove();
      pushNotification(t("notif.participation.cancelled"));
    };
    confirmDialog.showModal();
  }
});

/* ── MOCK PROJECT DATA (for preq demo) ─────────────────────── */
const MOCK_PROJECTS = {
  "glass-corridor": { preq: "\ucd2c\uc601 \ud604\uc7a5 \uacbd\ud5d8\uc774 1\ub144 \uc774\uc0c1 \uc788\uc73c\uc2e0\uac00\uc694?", required: "yes" },
  "warm-static":    { preq: "", required: "none" },
  "noon-in-black":  { preq: "", required: "none" }
};

/* ── PRE-QUESTION LOGIC ─────────────────────────────────────── */
let currentPreq = { text: "", required: "none" };

function initiateJoin(projId, onApproved, onWaiting) {
  const proj = MOCK_PROJECTS[projId];
  if (!proj || !proj.preq) { onApproved(); return; }
  preqAnswerQ.textContent = proj.preq;
  const cleanup = () => { preqAnswerYes.onclick = null; preqAnswerNo.onclick = null; };
  preqAnswerYes.onclick = () => {
    cleanup(); preqAnswerDialog.close();
    (proj.required === "none" || proj.required === "yes") ? onApproved() : onWaiting();
  };
  preqAnswerNo.onclick = () => {
    cleanup(); preqAnswerDialog.close();
    (proj.required === "none" || proj.required === "no") ? onApproved() : onWaiting();
  };
  preqAnswerDialog.showModal();
}

function openPreqDialog() {
  document.getElementById("preqText").value = currentPreq.text;
  setCselValue("preqRequired", currentPreq.required);
  document.getElementById("preqCount").textContent = currentPreq.text.length;
  preqDialog.showModal();
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

/* ── DATE PICKER — click anywhere opens picker ──────────────── */
const dateFilterInput = document.querySelector('.filter-label input[type="date"]');
if (dateFilterInput) {
  dateFilterInput.addEventListener("click", function () {
    try { this.showPicker(); } catch (_) {}
  });
}
