"""
Writes app.js with correct UTF-8 encoding.
Run: python write_appjs.py
"""
import os

content = """\
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
    "region.all": "All regions", "region.seoul": "Seoul",
    "region.gyeonggi": "Gyeonggi · Incheon", "region.busan": "Busan · Gyeongnam",
    "region.daegu": "Daegu · Gyeongbuk", "region.gwangju": "Gwangju · Jeonra",
    "region.daejeon": "Daejeon · Chungcheong", "region.gangwon": "Gangwon",
    "region.jeju": "Jeju", "region.nationwide": "Nationwide",
    "card.join": "Join",
    "card1.genre": "Thriller Short", "card1.title": "Glass Corridor",
    "card1.location": "Seoul", "card1.date": "Aug 25 \\u2013 Aug 26",
    "card1.tag1": "Editor \\u00d72", "card1.tag2": "Age 21\\u201340",
    "card2.genre": "Drama Pilot", "card2.title": "Warm Static",
    "card2.location": "Gyeonggi", "card2.date": "Sep 03 \\u2013 Sep 06",
    "card2.tag1": "Lead actor \\u00d71", "card2.tag2": "Nationwide",
    "card3.genre": "Mystery Feature", "card3.title": "Noon in Black",
    "card3.location": "Nationwide", "card3.date": "Sep 11 \\u2013 Sep 23",
    "card3.tag1": "Composer \\u00d71", "card3.tag2": "Remote",
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
    "create.f.title": "Project title", "create.f.title.ph": "Ex: Glass Corridor",
    "create.f.region": "Primary region",
    "create.f.desc": "Production summary",
    "create.f.desc.ph": "Brief, tone, objectives, and collaboration expectations.",
    "create.f.roles": "Roles needed", "create.f.roles.ph": "Editor x2, Actor x1, Composer x1",
    "create.f.preq": "Pre-screen question",
    "create.f.preq.ph": "Describe one scene where your edit changed pacing.",
    "create.flag.dislike": "Reject users with high dislike count",
    "create.flag.rating": "Restrict by minimum rating",
    "create.submit": "Publish project",
    "project.label": "PROJECT DETAIL", "project.slots.label": "Open positions",
    "slot.filled": "filled",
    "mypage.label": "MY PAGE", "mypage.title": "Your projects",
    "mypage.created": "Created", "mypage.joined": "Joined",
    "btn.edit": "Edit", "btn.delete": "Delete", "btn.cancel": "Cancel",
    "status.complete": "Completed",
    "hub.label": "COLLAB HUB", "hub.title": "Project workspace",
    "hub.chat": "Chat", "hub.chat.ph": "Write a message\\u2026", "hub.send": "Send",
    "hub.msg1": "Team assembled. Let\\u2019s lock the shot list by Thursday.",
    "hub.msg2": "Shared draft timeline and location notes.",
    "hub.schedule": "Schedule",
    "hub.sched1": "Kickoff meeting", "hub.sched2": "Principal photography", "hub.sched3": "Wrap review",
    "hub.invite": "+ Invite member",
    "hub.reviews": "Reviews", "hub.review.ph": "Concise role feedback\\u2026", "hub.review.submit": "Submit",
    "review.avg.init": "avg 3.0", "review.avg": "Average score: %s / 5",
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
    "discover.label": "작품 탐색", "discover.open": "3개 모집중",
    "discover.title1": "마찰 없이", "discover.title2": "맞는 크루를 찾으세요",
    "discover.sub": "역할, 지역, 촬영 기간으로 필터링하세요. 참여는 로그인 후 가능하며 취소 정책을 명확히 안내합니다.",
    "discover.footer": "크리에이터가 공고를 등록하는 중입니다",
    "filter.role.label": "역할", "filter.region.label": "지역", "filter.date.label": "모집 기간",
    "role.all": "전체 역할", "role.director": "감독", "role.screenwriter": "작가",
    "role.editor": "에디터", "role.cinematographer": "촬영감독",
    "role.actor": "배우", "role.composer": "음악감독", "role.leadactor": "주연 배우",
    "region.all": "전체 지역", "region.seoul": "서울",
    "region.gyeonggi": "경기·인천", "region.busan": "부산·경남",
    "region.daegu": "대구·경북", "region.gwangju": "광주·전라",
    "region.daejeon": "대전·충청", "region.gangwon": "강원",
    "region.jeju": "제주", "region.nationwide": "전국",
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
    "create.f.title": "프로젝트 제목", "create.f.title.ph": "예: Glass Corridor",
    "create.f.region": "주요 촬영 지역",
    "create.f.desc": "작품 소개",
    "create.f.desc.ph": "제작 의도, 톤, 목표, 협업 기대치를 설명해주세요.",
    "create.f.roles": "필요 역할", "create.f.roles.ph": "에디터 ×2, 배우 ×1, 음악감독 ×1",
    "create.f.preq": "사전 질문 설정",
    "create.f.preq.ph": "촬영본 편집이 장면 흐름을 바꾼 사례를 설명하세요.",
    "create.flag.dislike": "비호감 비율이 높은 사용자 제외",
    "create.flag.rating": "최소 평점 기준 제한",
    "create.submit": "프로젝트 공고",
    "project.label": "프로젝트 상세", "project.slots.label": "공석 현황",
    "slot.filled": "완료됨",
    "mypage.label": "마이페이지", "mypage.title": "내 프로젝트",
    "mypage.created": "생성한 프로젝트", "mypage.joined": "참여한 프로젝트",
    "btn.edit": "편집", "btn.delete": "삭제", "btn.cancel": "취소",
    "status.complete": "완료",
    "hub.label": "협업 허브", "hub.title": "프로젝트 워크스페이스",
    "hub.chat": "채팅", "hub.chat.ph": "메시지를 입력하세요…", "hub.send": "전송",
    "hub.msg1": "팀이 구성되었습니다. 목요일까지 촬영 리스트를 확인합시다.",
    "hub.msg2": "초안 타임라인과 로케이션 노트를 공유했습니다.",
    "hub.schedule": "일정",
    "hub.sched1": "킥오프 미팅", "hub.sched2": "주요 촬영", "hub.sched3": "촬영 완료",
    "hub.invite": "+ 멤버 초대",
    "hub.reviews": "리뷰", "hub.review.ph": "간결한 역할 피드백을 입력…", "hub.review.submit": "제출",
    "review.avg.init": "평균 3.0", "review.avg": "평균 점수: %s / 5",
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
    { key: "notif.joined.default" },
    { key: "notif.hub.open" }
  ],
  reviews: [3, 3]
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
const planPickBtns   = [...document.querySelectorAll(".plan-pick")];
const createForm     = document.getElementById("createForm");
const createdList    = document.getElementById("createdList");
const detailTitle    = document.getElementById("detailTitle");
const detailDesc     = document.getElementById("detailDesc");
const detailRegionTx = document.getElementById("detailRegionText");
const confirmDialog  = document.getElementById("confirmDialog");
const confirmTitle   = document.getElementById("confirmTitle");
const confirmBody    = document.getElementById("confirmBody");
const confirmYes     = document.getElementById("confirmYes");
const cancelJoin     = document.getElementById("cancelJoin");
const chatForm       = document.getElementById("chatForm");
const chatInput      = document.getElementById("chatInput");
const chatLog        = document.getElementById("chatLog");
const addMemberBtn   = document.getElementById("addMemberBtn");
const reviewForm     = document.getElementById("reviewForm");
const reviewScore    = document.getElementById("reviewScore");
const roleFilter     = document.getElementById("roleFilter");
const regionFilter   = document.getElementById("regionFilter");
const projects       = [...document.querySelectorAll(".project-card")];

let authMode = "login";
let confirmAction = null;

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
}

/* ── SCREEN NAV ───────────────────────────────────────────── */
function setScreen(id) {
  screens.forEach(s => s.classList.toggle("active", s.id === id));
  navItems.forEach(item => item.classList.toggle("active", item.dataset.screen === id));
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
navItems.forEach(item => item.addEventListener("click", () => setScreen(item.dataset.screen)));

langToggle.addEventListener("click", () => applyLang(lang === "en" ? "ko" : "en"));

notifyBtn.addEventListener("click", () => {
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
    confirmTitle.textContent = t("confirm.join.title");
    confirmBody.textContent  = t("confirm.join.body");
    confirmAction = () => { pushNotification(t("notif.participation.done")); setScreen("mypage"); };
    confirmDialog.showModal();
  });
});

roleJoinBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    if (!state.authed) { authMode = "login"; updateAuthCopy(); authDialog.showModal(); return; }
    const roleKey = "role." + btn.dataset.role.replace("-", "");
    const roleDisplay = t(roleKey);
    confirmTitle.textContent = lang === "ko" ? `${roleDisplay}로 참여` : `Join as ${roleDisplay}`;
    confirmBody.textContent  = t("confirm.join.body");
    confirmAction = () => {
      const msg = lang === "ko"
        ? `${detailTitle.textContent}에 ${roleDisplay}로 참여했습니다.`
        : `You joined ${detailTitle.textContent} as ${roleDisplay}.`;
      pushNotification(msg);
      setScreen("hub");
    };
    confirmDialog.showModal();
  });
});

confirmYes.addEventListener("click", () => {
  if (typeof confirmAction === "function") confirmAction();
  confirmAction = null;
});

planPickBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    state.plan = btn.dataset.plan;
    const planNameKey = "plan." + state.plan.toLowerCase() + ".name";
    const planName = t(planNameKey);
    const msg = t("notif.plan.active").replace("%s", planName);
    pushNotification(msg);
  });
});

createForm.addEventListener("submit", event => {
  event.preventDefault();
  const title  = document.getElementById("projectTitle").value.trim() || "Untitled";
  const desc   = document.getElementById("projectDesc").value.trim()  || "";
  const rKey   = document.getElementById("projectRegion").value;
  const roles  = document.getElementById("projectRoles").value.trim() || "";
  const region = t("region." + rKey);

  const item = document.createElement("li");
  item.className = "list-item";
  item.innerHTML = `<span>${title}</span><span class="item-actions"><button class="micro-btn" data-i18n="btn.edit">${t("btn.edit")}</button><button class="micro-btn danger" data-i18n="btn.delete">${t("btn.delete")}</button></span>`;
  createdList.prepend(item);

  detailTitle.textContent = title;
  detailDesc.textContent  = desc;
  detailRegionTx.textContent = lang === "ko" ? `${region} · 모집 중` : `${region} · Recruiting now`;

  pushNotification(lang === "ko" ? `프로젝트 공고: ${title}` : `Project published: ${title}.`);
  setScreen("project");

  if (document.getElementById("flagDislike").checked || document.getElementById("flagRating").checked) {
    pushNotification(lang === "ko" ? "고급 기능이 활성화되었습니다." : "Advanced restrictions enabled.");
  }
  if (roles.toLowerCase().includes("actor") || roles.includes("배우")) {
    pushNotification(lang === "ko" ? "배우 역할에 사전 질문이 활성화되었습니다." : "Pre-screen enabled for actor role.");
  }
  createForm.reset();
});

cancelJoin.addEventListener("click", () => {
  confirmTitle.textContent = t("confirm.cancel.title");
  confirmBody.textContent  = t("confirm.cancel.body");
  confirmAction = () => { pushNotification(t("notif.participation.cancelled")); setScreen("mypage"); };
  confirmDialog.showModal();
});

chatForm.addEventListener("submit", event => {
  event.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;
  const msgEl = document.createElement("div");
  msgEl.className = "chat-msg";
  msgEl.innerHTML = `<span class="chat-author">${lang === "ko" ? "나" : "You"}</span><p>${text}</p>`;
  chatLog.appendChild(msgEl);
  chatLog.scrollTop = chatLog.scrollHeight;
  chatInput.value = "";
  pushNotification(t("notif.chat"));
});

addMemberBtn.addEventListener("click", () => {
  confirmTitle.textContent = t("confirm.invite.title");
  confirmBody.textContent  = t("confirm.invite.body");
  confirmAction = () => pushNotification(t("notif.invited"));
  confirmDialog.showModal();
});

reviewForm.addEventListener("submit", event => {
  event.preventDefault();
  const rating = Number(document.getElementById("reviewValue").value);
  state.reviews.push(rating);
  const avg = state.reviews.reduce((s, x) => s + x, 0) / state.reviews.length;
  reviewScore.textContent = t("review.avg").replace("%s", avg.toFixed(1));
  pushNotification(t("notif.review"));
  reviewForm.reset();
});

function applyFilters() {
  const role   = roleFilter.value;
  const region = regionFilter.value;
  projects.forEach(p => {
    const rm = role   === "all" || p.dataset.role   === role;
    const rg = region === "all" || p.dataset.region === region;
    p.style.display = rm && rg ? "flex" : "none";
  });
}
roleFilter.addEventListener("change", applyFilters);
regionFilter.addEventListener("change", applyFilters);

/* ── INIT ─────────────────────────────────────────────────── */
applyLang("en");
applyFilters();
"""

out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "app.js")
with open(out_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Written {len(content)} chars to {out_path}")

# Verify Korean
import re
idx = content.find('"nav.discover": "탐색"')
print(f"Korean nav.discover found: {idx > 0}")
print("Done.")
