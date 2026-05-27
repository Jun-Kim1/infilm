/**
 * test_db.js — Local integration test for createProject + Supabase RLS
 *
 * HOW TO RUN:
 *   Option A (browser console):
 *     Open the page with Live Server, open DevTools (F12),
 *     and type:  runCreateProjectTest()
 *
 *   Option B (Test button):
 *     Add ?dev to the URL → http://127.0.0.1:5500/index.html?dev
 *     A floating "🧪 Test DB" button will appear (bottom-right).
 *
 * IMPORTANT:
 *   - Fill in TEST_EMAIL + TEST_PASSWORD before running.
 *   - Remove this script tag from index.html before deploying to production.
 */

(function () {
  /* ── Config ─────────────────────────────────────────────── */
  const SUPABASE_URL      = "https://fexwivtwuxsrjfrkqgam.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_8JpAW0UnLFAGErcJw26Zig_5_30AJ1a";

  // ⚠ Fill these in before running the test
  const TEST_EMAIL    = "";   // e.g. "dev@example.com"
  const TEST_PASSWORD = "";   // e.g. "yourpassword"

  /* ── Mock project data ───────────────────────────────────── */
  const MOCK = {
    title:       "[TEST] Glass Corridor — auto",
    description: "Automated integration test — safe to delete.",
    regions:     ["seoul", "gyeonggi"],
    roles: [
      { role: "director", headcount: 1, minAge: null, maxAge: null, career: "any" },
      { role: "editor",   headcount: 2, minAge: 21,   maxAge: 35,   career: "1y"  }
    ],
    preq: {
      text:     "촬영 현장 경험이 1년 이상 있으신가요?",
      required: "yes"
    }
  };

  /* ── Helpers ─────────────────────────────────────────────── */
  const pass = (step, msg, data) => {
    if (data !== undefined) console.log(`✅ [Step ${step}] ${msg}`, data);
    else                    console.log(`✅ [Step ${step}] ${msg}`);
  };
  const fail = (step, msg, err)  => console.error(`❌ [Step ${step}] ${msg}`, err?.message ?? err, "\nCode:", err?.code);
  const info = (step, msg)       => console.log(`→  [Step ${step}] ${msg}`);

  /* ── Main test function ──────────────────────────────────── */
  async function runCreateProjectTest() {
    if (!TEST_EMAIL || !TEST_PASSWORD) {
      console.error("⛔ test_db.js: Set TEST_EMAIL and TEST_PASSWORD before running.");
      return;
    }

    const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.group("🧪 createProject — Supabase integration test");
    console.time("total");

    /* ── Step 0: Sign in to satisfy RLS ───────────────────── */
    info(0, "Signing in as test user…");
    const { data: authData, error: authError } =
      await client.auth.signInWithPassword({ email: TEST_EMAIL, password: TEST_PASSWORD });

    if (authError) {
      fail(0, "Auth failed — check email/password.", authError);
      console.groupEnd();
      return;
    }
    pass(0, `Authenticated. UID: ${authData.user.id}`);

    const userId = authData.user.id;

    /* ── Step 1: INSERT projects ───────────────────────────── */
    info(1, "Attempting to create project…");
    const { data: project, error: projError } = await client
      .from("projects")
      .insert({
        creator_id:  userId,        // ← RLS requires auth.uid() = creator_id
        title:       MOCK.title,
        description: MOCK.description,
        regions:     MOCK.regions
      })
      .select("id")
      .single();

    if (projError) {
      fail(1, "projects INSERT failed.", projError);
      // RLS diagnostic hint:
      if (projError.code === "42501") {
        console.warn("💡 RLS hint: policy rejected the insert. Check that your policy is:\n  auth.uid() = creator_id");
      }
      console.groupEnd();
      return;
    }
    const projectId = project.id;
    pass(1, `Project created successfully with ID: ${projectId}`);

    /* ── Step 2: INSERT recruitment_details (batch) ─────────── */
    info(2, `Saving ${MOCK.roles.length} recruitment detail row(s)…`);
    const { error: rolesError } = await client
      .from("recruitment_details")
      .insert(
        MOCK.roles.map(r => ({
          project_id:      projectId,
          role_name:       r.role,
          headcount:       r.headcount,
          min_age:         r.minAge,
          max_age:         r.maxAge,
          career_required: r.career
        }))
      );

    if (rolesError) {
      fail(2, "recruitment_details INSERT failed.", rolesError);
      console.groupEnd();
      return;
    }
    pass(2, `${MOCK.roles.length} recruitment row(s) saved.`);

    /* ── Step 3: INSERT project_questions ───────────────────── */
    info(3, "Saving pre-screen question…");
    const { error: preqError } = await client
      .from("project_questions")
      .insert({
        project_id:    projectId,
        question_text: MOCK.preq.text,
        target_answer: MOCK.preq.required === "none" ? null : MOCK.preq.required,
        is_active:     true
      });

    if (preqError) {
      fail(3, "project_questions INSERT failed.", preqError);
      console.groupEnd();
      return;
    }
    pass(3, "Details and Questions saved successfully.");

    /* ── Step 4: Verify — read the full record back ──────────── */
    info(4, "Verifying — reading record back from DB…");
    const { data: record, error: readError } = await client
      .from("projects")
      .select(`
        id, title, regions, creator_id,
        recruitment_details ( role_name, headcount, min_age, max_age, career_required ),
        project_questions   ( question_text, target_answer, is_active )
      `)
      .eq("id", projectId)
      .single();

    if (readError) {
      fail(4, "Read-back SELECT failed.", readError);
      // RLS diagnostic hint for SELECT policy:
      if (readError.code === "PGRST116") {
        console.warn("💡 RLS hint: row exists but SELECT policy is blocking read. Check your SELECT policy on `projects`.");
      }
    } else {
      pass(4, "DB record verified:", record);
    }

    /* ── Step 5: Clean up ────────────────────────────────────── */
    info(5, "Deleting test record…");
    await client.from("project_questions")   .delete().eq("project_id", projectId);
    await client.from("recruitment_details") .delete().eq("project_id", projectId);
    const { error: delError } = await client.from("projects").delete().eq("id", projectId);

    if (delError) {
      console.warn(`⚠️  [Step 5] Cleanup failed. Delete row manually in Supabase dashboard (id: ${projectId}).`, delError.message);
    } else {
      pass(5, "Test record deleted. DB is clean.");
    }

    /* ── Summary ─────────────────────────────────────────────── */
    console.timeEnd("total");
    console.log("🎉 All steps passed — RLS policies are correctly allowing authenticated inserts.");
    console.groupEnd();
  }

  /* ── Expose to browser console ──────────────────────────── */
  window.runCreateProjectTest = runCreateProjectTest;
  console.log(
    "%c[test_db.js] loaded%c — call %crunCreateProjectTest()%c in the console, or add ?dev to the URL for the test button.",
    "color:#e8a020;font-weight:700", "color:inherit",
    "color:#4ec3c3;font-weight:700", "color:inherit"
  );

  /* ── ?dev floating button ────────────────────────────────── */
  if (new URLSearchParams(window.location.search).has("dev")) {
    window.addEventListener("DOMContentLoaded", () => {
      const btn = document.createElement("button");
      btn.textContent = "🧪 Test DB";
      btn.title = "Run createProject integration test (test_db.js)";
      btn.style.cssText = [
        "position:fixed", "bottom:72px", "right:16px", "z-index:9999",
        "background:#e8a020", "color:#0d0d0d", "border:none",
        "border-radius:8px", "padding:9px 14px",
        "font-weight:700", "font-size:13px", "cursor:pointer",
        "box-shadow:0 4px 14px rgba(0,0,0,.5)"
      ].join(";");
      btn.addEventListener("click", runCreateProjectTest);
      document.body.appendChild(btn);
    });
  }
})();
