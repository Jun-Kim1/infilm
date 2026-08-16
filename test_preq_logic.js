const assert = require("assert/strict");
const { normalizeRequiredAnswer, evaluatePreQuestion } = require("./preq-logic");

assert.equal(normalizeRequiredAnswer(null), "none");
assert.equal(normalizeRequiredAnswer(true), "yes");
assert.equal(normalizeRequiredAnswer(false), "no");
assert.equal(normalizeRequiredAnswer("yes"), "yes");
assert.equal(normalizeRequiredAnswer("no"), "no");

const cases = [
  [null, true, true],
  [null, false, true],
  [true, true, true],
  [true, false, false],
  [false, true, false],
  [false, false, true],
  ["yes", true, true],
  ["yes", false, false],
  ["no", true, false],
  ["no", false, true]
];

for (const [required, answer, expected] of cases) {
  assert.equal(
    evaluatePreQuestion(required, answer),
    expected,
    `required=${String(required)}, answer=${String(answer)}`
  );
}

assert.throws(() => normalizeRequiredAnswer("maybe"), /Unsupported target_answer/);
assert.throws(() => evaluatePreQuestion("yes", null), /must be a boolean/);

console.log(`pre-question logic passed: ${cases.length} decision cases.`);
