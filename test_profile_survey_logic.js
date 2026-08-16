const assert = require("assert/strict");
const {
  OPTIONS,
  normalizeProfileSurvey,
  validateProfileSurvey,
  optionLabel
} = require("./profile-survey-logic");

const complete = {
  experience_count: "4~10회",
  roles: ["연출/각본", "촬영/조명"],
  major_background: "전공자 (재학/졸업)",
  equipments: ["미러리스/시네마 카메라", "프리미어/다빈치"],
  collaboration_style: "타이트한 단편 영화제 출품용",
  bio: "좋은 장면을 끝까지 함께 완성하겠습니다."
};

assert.equal(validateProfileSurvey(complete).valid, true);
assert.equal(validateProfileSurvey({ ...complete, roles: [] }).errors.roles, "required");
assert.equal(validateProfileSurvey({ ...complete, experience_count: "100회" }).errors.experience_count, "required");
assert.equal(validateProfileSurvey({
  ...complete,
  equipments: ["없음 (몸만 참여)", "조명"]
}).errors.equipments, "none_exclusive");
assert.equal(validateProfileSurvey({ ...complete, bio: "1\n2\n3" }).errors.bio, "required");
assert.deepEqual(normalizeProfileSurvey({ ...complete, roles: ["배우", "배우"] }).roles, ["배우"]);
assert.equal(optionLabel("촬영/조명", "en"), "Camera / Lighting");
assert.equal(OPTIONS.roles.length, 7);

console.log("profile survey logic passed.");
