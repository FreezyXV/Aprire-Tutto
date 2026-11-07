import type { Criterion, PromptCheck } from "@/lib/types";

export type Verdict = "solid" | "partial" | "revise" | "empty";

export type CriterionResult = { label: string; met: boolean; hint: string };

export type PromptGrade = {
  verdict: Verdict;
  criteria: CriterionResult[];
  warnings: string[];
  model: string;
};

export const verdictLabels: Record<Verdict, string> = {
  solid: "Réponse solide",
  partial: "En bonne voie",
  revise: "À retravailler",
  empty: "Pas encore de réponse",
};

/** Lowercase, strip accents and unify apostrophes so patterns stay simple. */
export function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[’‘`]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function matches(text: string, patterns: string[]) {
  return patterns.some((p) => new RegExp(p, "i").test(text));
}

const MIN_LENGTH = 25;

export function gradeCriteria(answer: string, criteria: Criterion[]) {
  const text = normalize(answer);
  return criteria.map((c) => ({
    label: c.label,
    met: matches(text, c.patterns),
    hint: c.hint,
  }));
}

export function gradePrompt(answer: string, check: PromptCheck): PromptGrade {
  const text = normalize(answer);
  if (!text)
    return {
      verdict: "empty",
      criteria: gradeCriteria("", check.criteria),
      warnings: [],
      model: check.model,
    };
  const criteria = gradeCriteria(answer, check.criteria);
  // "avoid" patterns encode the mistake the exercise is about.
  const mistakes = (check.avoid ?? [])
    .filter((a) => matches(text, a.patterns))
    .map((a) => a.message);
  const warnings = [...mistakes];
  if (text.length < MIN_LENGTH)
    warnings.push("Ta réponse est très courte : développe ton raisonnement.");
  const met = criteria.filter((c) => c.met).length;
  const verdict: Verdict =
    mistakes.length > 0 || met === 0
      ? "revise"
      : met === criteria.length && warnings.length === 0
        ? "solid"
        : "partial";
  return { verdict, criteria, warnings, model: check.model };
}
