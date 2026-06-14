// Render Web Service example (Node.js + Express)
// Purpose:
// 1) Proxy TMDB movie search with server-side API key
// 2) Save CineTMI tmi_posts with hashed password using server-side Supabase key

const express = require("express");
const crypto = require("crypto");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(express.json());

const {
  PORT = 3000,
  TMDB_API_KEY,
  INFILM_SUPABASE_URL,
  CINETMI_SUPABASE_URL,
  CINETMI_SUPABASE_SERVICE_ROLE_KEY,
  CORS_ORIGIN = "https://your-infilm-domain.onrender.com"
} = process.env;

if (!TMDB_API_KEY || !CINETMI_SUPABASE_URL || !CINETMI_SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing required env vars.");
}

if (INFILM_SUPABASE_URL && INFILM_SUPABASE_URL === CINETMI_SUPABASE_URL) {
  throw new Error("INFILM_SUPABASE_URL and CINETMI_SUPABASE_URL must be different.");
}

const cineSb = createClient(CINETMI_SUPABASE_URL, CINETMI_SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Access-Control-Allow-Origin", CORS_ORIGIN);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.get("/api/tmdb/search", async (req, res) => {
  try {
    const query = String(req.query.query || "").trim();
    const lang = String(req.query.lang || "ko-KR");
    if (!query) return res.status(400).json({ message: "query is required" });
    if (query.length < 2 || query.length > 80) {
      return res.status(400).json({ message: "query length must be 2-80" });
    }

    const url = `https://api.themoviedb.org/3/search/multi?api_key=${encodeURIComponent(TMDB_API_KEY)}&query=${encodeURIComponent(query)}&language=${encodeURIComponent(lang)}&include_adult=false&page=1`;
    const tmdbRes = await fetch(url);
    if (!tmdbRes.ok) return res.status(502).json({ message: "TMDB request failed" });

    const data = await tmdbRes.json();
    const results = (data.results || [])
      .filter(item => item && (item.media_type === "movie" || item.media_type === "tv"))
      .map(item => ({
        id: item.id,
        media_type: item.media_type,
        title: item.title || item.name || "",
        name: item.name || "",
        release_date: item.release_date || "",
        first_air_date: item.first_air_date || "",
        poster_path: item.poster_path || ""
      }));

    return res.json({ results });
  } catch (error) {
    return res.status(500).json({ message: "search failed" });
  }
});

function hashPassword(password) {
  const iterations = 120000;
  const salt = crypto.randomBytes(16);
  const hash = crypto.pbkdf2Sync(password, salt, iterations, 32, "sha256");
  return `pbkdf2_sha256$${iterations}$${salt.toString("base64")}$${hash.toString("base64")}`;
}

app.post("/api/cinetmi/tmi-posts", async (req, res) => {
  try {
    const { nickname, password, category, content, content_id } = req.body || {};
    const allowedCategories = new Set(["오마주", "스토리", "감독", "배우", "미장센", "비하인드", "잡담"]);

    if (!nickname || !category || !content || !content_id) {
      return res.status(400).json({ message: "nickname, category, content, content_id are required" });
    }
    if (!password || typeof password !== "string" || password.length < 8) {
      return res.status(400).json({ message: "password must be at least 8 chars" });
    }
    if (!allowedCategories.has(String(category))) {
      return res.status(400).json({ message: "invalid category" });
    }

    const cleanNickname = String(nickname).trim();
    const cleanContent = String(content).trim();
    const cleanContentId = Number(content_id);

    if (!cleanNickname || cleanNickname.length > 40) {
      return res.status(400).json({ message: "nickname length must be 1-40" });
    }
    if (!cleanContent || cleanContent.length < 4 || cleanContent.length > 500) {
      return res.status(400).json({ message: "content length must be 4-500" });
    }
    if (!Number.isFinite(cleanContentId) || cleanContentId <= 0) {
      return res.status(400).json({ message: "content_id must be a positive number" });
    }

    const finalPasswordHash = hashPassword(password);

    const { error } = await cineSb.from("tmi_posts").insert({
      nickname: cleanNickname,
      password: finalPasswordHash,
      category,
      content: cleanContent,
      content_id: cleanContentId
    });

    if (error) return res.status(500).json({ message: error.message });
    return res.status(201).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ message: "save failed" });
  }
});

app.listen(PORT, () => {
  console.log(`API server listening on ${PORT}`);
});
