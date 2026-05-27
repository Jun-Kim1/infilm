# -*- coding: utf-8 -*-
"""Adds data-i18n attributes throughout index.html and removes Plans page."""
import re, os

src = os.path.join(os.path.dirname(os.path.abspath(__file__)), "index.html")
with open(src, encoding="utf-8") as f:
    h = f.read()

# ── 1. REMOVE PLANS NAV BUTTON ─────────────────────────────────
h = h.replace(
    '      <button class="nav-item" data-screen="pricing" data-i18n="nav.plans">Plans</button>\n',
    ''
)

# ── 2. REMOVE PLANS SECTION ────────────────────────────────────
h = re.sub(
    r'\n    <!-- 02 PLANS ──.*?</section>\n',
    '',
    h, flags=re.DOTALL
)

# ── 3. FILTER ROW ──────────────────────────────────────────────
OLD_FILTER = '''      <div class="filter-row">
        <label class="filter-label">
          <span>ROLE</span>
          <select id="roleFilter">
            <option value="all">All roles</option>
            <option>Director</option>
            <option>Screenwriter</option>
            <option>Editor</option>
            <option>Cinematographer</option>
            <option>Actor</option>
            <option>Composer</option>
          </select>
        </label>
        <label class="filter-label">
          <span>REGION</span>
          <select id="regionFilter">
            <option value="all">All regions</option>
            <option>Seoul</option>
            <option>Gyeonggi</option>
            <option>Gangwon</option>
            <option>Nationwide</option>
          </select>
        </label>
        <label class="filter-label">
          <span>RECRUITING UNTIL</span>
          <input type="date" value="2026-07-25" />
        </label>
      </div>'''
NEW_FILTER = '''      <div class="filter-row">
        <label class="filter-label">
          <span data-i18n="filter.role.label">ROLE</span>
          <select id="roleFilter">
            <option value="all" data-i18n="role.all">All roles</option>
            <option value="Director" data-i18n="role.director">Director</option>
            <option value="Screenwriter" data-i18n="role.screenwriter">Screenwriter</option>
            <option value="Editor" data-i18n="role.editor">Editor</option>
            <option value="Cinematographer" data-i18n="role.cinematographer">Cinematographer</option>
            <option value="Actor" data-i18n="role.actor">Actor</option>
            <option value="Composer" data-i18n="role.composer">Composer</option>
          </select>
        </label>
        <label class="filter-label">
          <span data-i18n="filter.region.label">REGION</span>
          <select id="regionFilter">
            <option value="all" data-i18n="region.all">All regions</option>
            <option value="Seoul" data-i18n="region.seoul">Seoul</option>
            <option value="Gyeonggi" data-i18n="region.gyeonggi">Gyeonggi</option>
            <option value="Gangwon" data-i18n="region.gangwon">Gangwon</option>
            <option value="Nationwide" data-i18n="region.nationwide">Nationwide</option>
          </select>
        </label>
        <label class="filter-label">
          <span data-i18n="filter.date.label">RECRUITING UNTIL</span>
          <input type="date" value="2026-07-25" />
        </label>
      </div>'''
h = h.replace(OLD_FILTER, NEW_FILTER)

# ── 4. DISCOVER SCREEN HEADER ──────────────────────────────────
h = h.replace(
    '<span class="screen-label">DISCOVERY</span>',
    '<span class="screen-label" data-i18n="discover.label">DISCOVERY</span>'
)
h = h.replace(
    '<span class="open-count" id="openCount">3 open</span>',
    '<span class="open-count" id="openCount" data-i18n="discover.open">3 open</span>'
)
h = h.replace(
    '<h2 class="display-title">Find the right crew<br>without friction</h2>',
    '<h2 class="display-title"><span data-i18n="discover.title1">Find the right crew</span><br><span data-i18n="discover.title2">without friction</span></h2>'
)
h = h.replace(
    '<p class="display-sub">Filter by role, region, and production window. Joining requires authentication and clearly communicates policy.</p>',
    '<p class="display-sub" data-i18n="discover.sub">Filter by role, region, and production window. Joining requires authentication and clearly communicates policy.</p>'
)
h = h.replace(
    '        More projects loading as crews publish their calls\n      </p>',
    '        <span data-i18n="discover.footer">More projects loading as crews publish their calls</span>\n      </p>'
)

# ── 5. CARD 1 ──────────────────────────────────────────────────
h = h.replace(
    '<span class="genre-tag thriller">Thriller Short</span>',
    '<span class="genre-tag thriller" data-i18n="card1.genre">Thriller Short</span>'
)
h = h.replace(
    '<h3 class="card-title">Glass Corridor</h3>',
    '<h3 class="card-title" data-i18n="card1.title">Glass Corridor</h3>'
)
# Card 1 meta: wrap text after SVG in span
h = h.replace(
    '</svg> Seoul</span>\n            <span><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect',
    '</svg> <span data-i18n="card1.location">Seoul</span></span>\n            <span><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect'
)
h = h.replace(
    '</svg> Aug 25 \u2013 Aug 26</span>',
    '</svg> <span data-i18n="card1.date">Aug 25 \u2013 Aug 26</span></span>',
    1  # only first occurrence
)
h = h.replace(
    '<span class="tag">Editor \u00d72</span>',
    '<span class="tag" data-i18n="card1.tag1">Editor \u00d72</span>'
)
h = h.replace(
    '<span class="tag">Age 21\u201340</span>',
    '<span class="tag" data-i18n="card1.tag2">Age 21\u201340</span>'
)

# ── 6. CARD 2 ──────────────────────────────────────────────────
h = h.replace(
    '<span class="genre-tag drama">Drama Pilot</span>',
    '<span class="genre-tag drama" data-i18n="card2.genre">Drama Pilot</span>'
)
h = h.replace(
    '<h3 class="card-title">Warm Static</h3>',
    '<h3 class="card-title" data-i18n="card2.title">Warm Static</h3>'
)
h = h.replace(
    '</svg> Gyeonggi</span>\n            <span><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect',
    '</svg> <span data-i18n="card2.location">Gyeonggi</span></span>\n            <span><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect'
)
h = h.replace(
    '</svg> Sep 03 \u2013 Sep 06</span>',
    '</svg> <span data-i18n="card2.date">Sep 03 \u2013 Sep 06</span></span>',
    1
)
h = h.replace(
    '<span class="tag">Lead actor \u00d71</span>',
    '<span class="tag" data-i18n="card2.tag1">Lead actor \u00d71</span>'
)
h = h.replace(
    '<span class="tag">Nationwide</span>',
    '<span class="tag" data-i18n="card2.tag2">Nationwide</span>'
)

# ── 7. CARD 3 ──────────────────────────────────────────────────
h = h.replace(
    '<span class="genre-tag mystery">Mystery Feature</span>',
    '<span class="genre-tag mystery" data-i18n="card3.genre">Mystery Feature</span>'
)
h = h.replace(
    '<h3 class="card-title">Noon in Black</h3>',
    '<h3 class="card-title" data-i18n="card3.title">Noon in Black</h3>'
)
h = h.replace(
    '</svg> Nationwide</span>\n            <span><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect',
    '</svg> <span data-i18n="card3.location">Nationwide</span></span>\n            <span><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect'
)
h = h.replace(
    '</svg> Sep 11 \u2013 Sep 23</span>',
    '</svg> <span data-i18n="card3.date">Sep 11 \u2013 Sep 23</span></span>',
    1
)
h = h.replace(
    '<span class="tag">Composer \u00d71</span>',
    '<span class="tag" data-i18n="card3.tag1">Composer \u00d71</span>'
)
h = h.replace(
    '<span class="tag">Remote</span>',
    '<span class="tag" data-i18n="card3.tag2">Remote</span>'
)

# ── 8. JOIN BUTTONS ────────────────────────────────────────────
h = h.replace(
    '<button class="join-btn">Join</button>',
    '<button class="join-btn" data-i18n="card.join">Join</button>'
)

# ── 9. CREATE SCREEN ───────────────────────────────────────────
h = h.replace(
    '<span class="screen-label">CREATE PROJECT</span>',
    '<span class="screen-label" data-i18n="create.label">CREATE PROJECT</span>'
)
h = h.replace(
    '<h2 class="display-title">Build your production<br>brief</h2>',
    '<h2 class="display-title"><span data-i18n="create.title1">Build your production</span><br><span data-i18n="create.title2">brief</span></h2>'
)
h = h.replace(
    '<p class="display-sub">Define roles, region, and pre-screening. Advanced restrictions on Premium.</p>',
    '<p class="display-sub" data-i18n="create.sub">Define roles, region, and pre-screening. Advanced restrictions on Premium.</p>'
)
h = h.replace(
    '            <span>Project title</span>\n            <input id="projectTitle" required placeholder="Ex: Glass Corridor" maxlength="80" />',
    '            <span data-i18n="create.f.title">Project title</span>\n            <input id="projectTitle" required placeholder="Ex: Glass Corridor" maxlength="80" data-i18n-ph="create.f.title.ph" />'
)
h = h.replace(
    '            <span>Primary region</span>\n            <select id="projectRegion">\n              <option>Seoul</option>\n              <option>Gyeonggi</option>\n              <option>Gangwon</option>\n              <option>Nationwide</option>\n            </select>',
    '            <span data-i18n="create.f.region">Primary region</span>\n            <select id="projectRegion">\n              <option value="seoul" data-i18n="region.seoul">Seoul</option>\n              <option value="gyeonggi" data-i18n="region.gyeonggi">Gyeonggi</option>\n              <option value="gangwon" data-i18n="region.gangwon">Gangwon</option>\n              <option value="nationwide" data-i18n="region.nationwide">Nationwide</option>\n            </select>'
)
h = h.replace(
    '          <span>Production summary</span>\n          <textarea id="projectDesc" maxlength="1000" placeholder="Brief, tone, objectives, and collaboration expectations."></textarea>',
    '          <span data-i18n="create.f.desc">Production summary</span>\n          <textarea id="projectDesc" maxlength="1000" placeholder="Brief, tone, objectives, and collaboration expectations." data-i18n-ph="create.f.desc.ph"></textarea>'
)
h = h.replace(
    '          <span>Roles needed</span>\n          <input id="projectRoles" placeholder="Editor \u00d72, Actor \u00d71, Composer \u00d71" />',
    '          <span data-i18n="create.f.roles">Roles needed</span>\n          <input id="projectRoles" placeholder="Editor \u00d72, Actor \u00d71, Composer \u00d71" data-i18n-ph="create.f.roles.ph" />'
)
h = h.replace(
    '          <span>Pre-screen question</span>\n          <input id="preQuestion" placeholder="Describe one scene where your edit changed pacing." maxlength="100" />',
    '          <span data-i18n="create.f.preq">Pre-screen question</span>\n          <input id="preQuestion" placeholder="Describe one scene where your edit changed pacing." maxlength="100" data-i18n-ph="create.f.preq.ph" />'
)
h = h.replace(
    '<label class="toggle-row"><input type="checkbox" id="flagDislike" /> Reject users with high dislike count</label>',
    '<label class="toggle-row"><input type="checkbox" id="flagDislike" /> <span data-i18n="create.flag.dislike">Reject users with high dislike count</span></label>'
)
h = h.replace(
    '<label class="toggle-row"><input type="checkbox" id="flagRating" /> Restrict by minimum rating</label>',
    '<label class="toggle-row"><input type="checkbox" id="flagRating" /> <span data-i18n="create.flag.rating">Restrict by minimum rating</span></label>'
)
h = h.replace(
    '<button class="cta-btn submit-btn" type="submit">Publish project</button>',
    '<button class="cta-btn submit-btn" type="submit" data-i18n="create.submit">Publish project</button>'
)

# ── 10. PROJECT SCREEN ─────────────────────────────────────────
h = h.replace(
    '<span class="screen-label">PROJECT DETAIL</span>',
    '<span class="screen-label" data-i18n="project.label">PROJECT DETAIL</span>'
)
h = h.replace(
    '          <p class="slots-label">Open positions</p>',
    '          <p class="slots-label" data-i18n="project.slots.label">Open positions</p>'
)

# ── 11. MY PAGE SCREEN ─────────────────────────────────────────
h = h.replace(
    '<span class="screen-label">MY PAGE</span>',
    '<span class="screen-label" data-i18n="mypage.label">MY PAGE</span>'
)
h = h.replace(
    '      <h2 class="display-title">Your projects</h2>',
    '      <h2 class="display-title" data-i18n="mypage.title">Your projects</h2>'
)
h = h.replace(
    '          <p class="list-label">Created</p>',
    '          <p class="list-label" data-i18n="mypage.created">Created</p>'
)
h = h.replace(
    '          <p class="list-label">Joined</p>',
    '          <p class="list-label" data-i18n="mypage.joined">Joined</p>'
)
h = h.replace(
    '<button class="micro-btn">Edit</button>',
    '<button class="micro-btn" data-i18n="btn.edit">Edit</button>'
)
h = h.replace(
    '<button class="micro-btn danger">Delete</button>',
    '<button class="micro-btn danger" data-i18n="btn.delete">Delete</button>'
)
h = h.replace(
    '<span class="status-pill complete">Completed</span>',
    '<span class="status-pill complete" data-i18n="status.complete">Completed</span>'
)
h = h.replace(
    '<button class="micro-btn danger" id="cancelJoin">Cancel</button>',
    '<button class="micro-btn danger" id="cancelJoin" data-i18n="btn.cancel">Cancel</button>'
)

# ── 12. HUB SCREEN ─────────────────────────────────────────────
h = h.replace(
    '<span class="screen-label">COLLAB HUB</span>',
    '<span class="screen-label" data-i18n="hub.label">COLLAB HUB</span>'
)
h = h.replace(
    '      <h2 class="display-title">Project workspace</h2>',
    '      <h2 class="display-title" data-i18n="hub.title">Project workspace</h2>'
)
h = h.replace(
    '          <p class="hub-section-label">Chat</p>',
    '          <p class="hub-section-label" data-i18n="hub.chat">Chat</p>'
)
h = h.replace(
    '<input id="chatInput" placeholder="Write a message\u2026" />',
    '<input id="chatInput" placeholder="Write a message\u2026" data-i18n-ph="hub.chat.ph" />'
)
h = h.replace(
    '<button class="cta-btn" type="submit">Send</button>',
    '<button class="cta-btn" type="submit" data-i18n="hub.send">Send</button>'
)
# Initial chat messages
h = h.replace(
    "<div class=\"chat-msg\"><span class=\"chat-author\">Director</span><p>Team assembled. Let's lock the shot list by Thursday.</p></div>",
    '<div class="chat-msg"><span class="chat-author">Director</span><p data-i18n="hub.msg1">Team assembled. Let\u2019s lock the shot list by Thursday.</p></div>'
)
h = h.replace(
    '<div class="chat-msg"><span class="chat-author">AD</span><p>Shared draft timeline and location notes.</p></div>',
    '<div class="chat-msg"><span class="chat-author">AD</span><p data-i18n="hub.msg2">Shared draft timeline and location notes.</p></div>'
)
h = h.replace(
    '            <p class="hub-section-label">Schedule</p>',
    '            <p class="hub-section-label" data-i18n="hub.schedule">Schedule</p>'
)
h = h.replace(
    '<span>Kickoff meeting</span>',
    '<span data-i18n="hub.sched1">Kickoff meeting</span>'
)
h = h.replace(
    '<span>Principal photography</span>',
    '<span data-i18n="hub.sched2">Principal photography</span>'
)
h = h.replace(
    '<span>Wrap review</span>',
    '<span data-i18n="hub.sched3">Wrap review</span>'
)
h = h.replace(
    '<button class="ghost-btn" id="addMemberBtn">+ Invite member</button>',
    '<button class="ghost-btn" id="addMemberBtn" data-i18n="hub.invite">+ Invite member</button>'
)
h = h.replace(
    '            <p class="hub-section-label">Reviews <span class="review-avg" id="reviewScore">avg 3.0</span></p>',
    '            <p class="hub-section-label"><span data-i18n="hub.reviews">Reviews</span> <span class="review-avg" id="reviewScore" data-i18n="review.avg.init">avg 3.0</span></p>'
)
h = h.replace(
    '<textarea id="reviewText" placeholder="Concise role feedback\u2026"></textarea>',
    '<textarea id="reviewText" placeholder="Concise role feedback\u2026" data-i18n-ph="hub.review.ph"></textarea>'
)
h = h.replace(
    '<button class="ghost-btn" type="submit">Submit</button>',
    '<button class="ghost-btn" type="submit" data-i18n="hub.review.submit">Submit</button>'
)

# ── 13. NOTIFICATION DRAWER ────────────────────────────────────
h = h.replace(
    '      <span>Notifications</span>',
    '      <span data-i18n="drawer.title">Notifications</span>'
)

# ── 14. AUTH MODAL ─────────────────────────────────────────────
h = h.replace(
    '<label class="form-field"><span>Email</span>',
    '<label class="form-field"><span data-i18n="modal.email">Email</span>'
)
h = h.replace(
    '<label class="form-field"><span>Password</span>',
    '<label class="form-field"><span data-i18n="modal.pass">Password</span>'
)
h = h.replace(
    '<label class="form-field hidden" id="signupNameWrap"><span>Display name</span>',
    '<label class="form-field hidden" id="signupNameWrap"><span data-i18n="modal.name">Display name</span>'
)
h = h.replace(
    '<button type="button" class="ghost-btn" id="authCancel">Cancel</button>',
    '<button type="button" class="ghost-btn" id="authCancel" data-i18n="modal.cancel">Cancel</button>'
)
h = h.replace(
    '<button type="submit" class="cta-btn">Continue</button>',
    '<button type="submit" class="cta-btn" data-i18n="modal.continue">Continue</button>'
)

# ── 15. CONFIRM MODAL ──────────────────────────────────────────
h = h.replace(
    '<button value="cancel" class="ghost-btn">No</button>',
    '<button value="cancel" class="ghost-btn" data-i18n="modal.no">No</button>'
)
h = h.replace(
    '<button value="submit" class="cta-btn" id="confirmYes">Yes, continue</button>',
    '<button value="submit" class="cta-btn" id="confirmYes" data-i18n="modal.yes">Yes, continue</button>'
)

with open(src, "w", encoding="utf-8") as f:
    f.write(h)

print("Done. Verifying key changes...")
checks = [
    ('filter.role.label', 'filter.role.label' in h),
    ('region.all value attr', 'value="all" data-i18n="region.all"' in h),
    ('region.gyeonggi value attr', 'value="Gyeonggi" data-i18n="region.gyeonggi"' in h),
    ('discover.label', 'data-i18n="discover.label"' in h),
    ('card1.genre', 'data-i18n="card1.genre"' in h),
    ('card1.location', 'data-i18n="card1.location"' in h),
    ('card.join', 'data-i18n="card.join"' in h),
    ('plans section removed', 'id="pricing"' not in h),
    ('plans nav removed', 'data-screen="pricing"' not in h),
    ('create.label', 'data-i18n="create.label"' in h),
    ('hub.chat', 'data-i18n="hub.chat"' in h),
    ('modal.email', 'data-i18n="modal.email"' in h),
    ('modal.no', 'data-i18n="modal.no"' in h),
]
for name, ok in checks:
    print(f"  {'OK' if ok else 'FAIL'} {name}")
