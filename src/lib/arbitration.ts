import type { PromptGrade } from "@/lib/grading";
import type { AiGrade } from "@/lib/types";

/**
 * Decide, answer by answer, what needs the AI: unchanged answers reuse their
 * verdict, empty answers and answers the offline grid fully validates are
 * settled locally, everything else is sent. Saves tokens without losing the
 * AI's judgment where there is doubt.
 */
export function planArbitration(
  answers: string[],
  offline: (PromptGrade | null | undefined)[],
  previous?: { answers: string[]; items: AiGrade[] },
): { results: (AiGrade | null)[]; toAsk: number[] } {
  const results = answers.map((a, i): AiGrade | null => {
    if (previous && previous.answers[i] === a && previous.items[i])
      return previous.items[i];
    if (!a.trim())
      return {
        verdict: "revise",
        feedback:
          "Pas encore de réponse : écris-la, puis redemande la correction.",
        improved: "",
        by: "grid",
      };
    if (offline[i]?.verdict === "solid")
      return {
        verdict: "solid",
        feedback:
          "Toutes les idées clés attendues sont présentes : réponse validée sans appel à l’IA.",
        improved: "",
        by: "grid",
      };
    return null;
  });
  return { results, toAsk: results.flatMap((r, i) => (r ? [] : [i])) };
}
