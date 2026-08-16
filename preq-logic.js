(function exposePreQuestionLogic(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.InFilmPreQuestion = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createPreQuestionLogic() {
  function normalizeRequiredAnswer(value) {
    if (value === null || value === undefined || value === "none") return "none";
    if (value === true || value === "true" || value === "yes") return "yes";
    if (value === false || value === "false" || value === "no") return "no";
    throw new Error(`Unsupported target_answer value: ${String(value)}`);
  }

  function evaluatePreQuestion(requiredAnswer, applicantAnswer) {
    const required = normalizeRequiredAnswer(requiredAnswer);
    if (required === "none") return true;
    if (typeof applicantAnswer !== "boolean") {
      throw new Error("Applicant answer must be a boolean.");
    }
    return required === "yes" ? applicantAnswer : !applicantAnswer;
  }

  return { normalizeRequiredAnswer, evaluatePreQuestion };
});
