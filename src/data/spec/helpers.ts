import type { Criterion, Question } from "@/lib/types";

/** Multiple-choice question. */
export const q = (
  prompt: string,
  options: string[],
  answer: number,
  explanation: string,
): Question => ({ prompt, options, answer, explanation });

/** Expected idea in a written answer (accent-free regexes, see grading.ts). */
export const c = (
  label: string,
  patterns: string[],
  hint: string,
): Criterion => ({ label, patterns, hint });

export const OPEN_QUESTION =
  "\\b(pourquoi|comment|qu'est-ce qui|que se passe|quels?|quelles?|quand|racontez|decrivez|expliquez|a quel)\\b";

export const LUMEN =
  "Maison Lumen vend des luminaires en ligne (25 salariés, 1 200 commandes par mois).";
