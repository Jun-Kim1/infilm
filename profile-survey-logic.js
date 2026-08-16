(function profileSurveyModule(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.InFilmProfileSurvey = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createProfileSurveyApi() {
  "use strict";

  const OPTIONS = Object.freeze({
    experience_count: Object.freeze([
      "첫 도전 (0회)", "1~3회", "4~10회", "10회 이상"
    ]),
    roles: Object.freeze([
      "연출/각본", "촬영/조명", "음향", "미술/소품",
      "편집/후반", "배우", "제작/기획"
    ]),
    major_background: Object.freeze([
      "전공자 (재학/졸업)", "비전공 독학/동아리", "취미/입문"
    ]),
    equipments: Object.freeze([
      "미러리스/시네마 카메라", "마이크/레코더", "조명",
      "프리미어/다빈치", "없음 (몸만 참여)"
    ]),
    collaboration_style: Object.freeze([
      "타이트한 단편 영화제 출품용",
      "실험적이고 자유로운 워크숍",
      "친목 기반 가벼운 릴스/숏폼"
    ])
  });

  const EN_LABELS = Object.freeze({
    "첫 도전 (0회)": "First project (0)",
    "1~3회": "1–3 projects",
    "4~10회": "4–10 projects",
    "10회 이상": "10+ projects",
    "연출/각본": "Directing / Writing",
    "촬영/조명": "Camera / Lighting",
    "음향": "Sound",
    "미술/소품": "Art / Props",
    "편집/후반": "Editing / Post",
    "배우": "Acting",
    "제작/기획": "Producing / Planning",
    "전공자 (재학/졸업)": "Film major (current / graduate)",
    "비전공 독학/동아리": "Self-taught / Club",
    "취미/입문": "Hobby / Beginner",
    "미러리스/시네마 카메라": "Mirrorless / Cinema camera",
    "마이크/레코더": "Mic / Recorder",
    "조명": "Lighting",
    "프리미어/다빈치": "Premiere / DaVinci",
    "없음 (몸만 참여)": "None",
    "타이트한 단편 영화제 출품용": "Focused festival short",
    "실험적이고 자유로운 워크숍": "Experimental workshop",
    "친목 기반 가벼운 릴스/숏폼": "Casual social short-form"
  });

  function normalizeArray(value) {
    if (!Array.isArray(value)) return [];
    return [...new Set(value.map(item => String(item).trim()).filter(Boolean))];
  }

  function normalizeProfileSurvey(input) {
    const source = input || {};
    return {
      experience_count: String(source.experience_count || "").trim(),
      roles: normalizeArray(source.roles),
      major_background: String(source.major_background || "").trim(),
      equipments: normalizeArray(source.equipments),
      collaboration_style: String(source.collaboration_style || "").trim(),
      bio: String(source.bio || "").replace(/\r\n?/g, "\n").trim()
    };
  }

  function validateProfileSurvey(input) {
    const value = normalizeProfileSurvey(input);
    const errors = {};

    if (!OPTIONS.experience_count.includes(value.experience_count)) errors.experience_count = "required";
    if (!value.roles.length || value.roles.some(role => !OPTIONS.roles.includes(role))) errors.roles = "required";
    if (!OPTIONS.major_background.includes(value.major_background)) errors.major_background = "required";
    if (value.equipments.some(equipment => !OPTIONS.equipments.includes(equipment))) errors.equipments = "invalid";
    if (value.equipments.includes("없음 (몸만 참여)") && value.equipments.length > 1) errors.equipments = "none_exclusive";
    if (!OPTIONS.collaboration_style.includes(value.collaboration_style)) errors.collaboration_style = "required";
    if (!value.bio || value.bio.length > 240 || value.bio.split("\n").length > 2) errors.bio = "required";

    return { valid: Object.keys(errors).length === 0, errors, value };
  }

  function optionLabel(value, lang) {
    return lang === "en" ? (EN_LABELS[value] || value) : value;
  }

  return Object.freeze({ OPTIONS, normalizeProfileSurvey, validateProfileSurvey, optionLabel });
});
