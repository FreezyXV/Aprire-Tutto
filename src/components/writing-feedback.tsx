"use client";
import { useState } from "react";
import { AlertTriangle, Check, LoaderCircle, Sparkles, X } from "lucide-react";
import {
  verdictLabels,
  type CriterionResult,
  type PromptGrade,
  type Verdict,
} from "@/lib/grading";
import { authHeaders } from "@/lib/client";

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  return (
    <span className={`verdict verdict-${verdict}`}>
      {verdict === "solid" ? (
        <Check size={15} />
      ) : verdict === "revise" ? (
        <X size={15} />
      ) : (
        <AlertTriangle size={14} />
      )}
      {verdictLabels[verdict]}
    </span>
  );
}

export function CriteriaList({ criteria }: { criteria: CriterionResult[] }) {
  return (
    <ul className="criteria-list">
      {criteria.map((c) => (
        <li key={c.label} className={c.met ? "met" : "missing"}>
          <span className="criteria-icon" aria-hidden="true">
            {c.met ? <Check size={14} /> : <X size={14} />}
          </span>
          <span>
            <strong>{c.label}</strong>
            <span className="sr-only">
              {c.met ? " : présent" : " : manquant"}
            </span>
            {!c.met && <small>{c.hint}</small>}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function PromptFeedback({ grade }: { grade: PromptGrade }) {
  return (
    <div
      className={`writing-feedback verdict-box-${grade.verdict}`}
      role="status"
    >
      <VerdictBadge verdict={grade.verdict} />
      <CriteriaList criteria={grade.criteria} />
      {grade.warnings.map((w) => (
        <p key={w} className="writing-warning">
          <AlertTriangle size={15} /> {w}
        </p>
      ))}
      <div className="model-answer">
        <span>Exemple de réponse attendue</span>
        <p>{grade.model}</p>
      </div>
    </div>
  );
}

type AiItem = {
  verdict: "solid" | "partial" | "revise";
  feedback: string;
  improved: string;
};

export function AiCorrection({
  title,
  context,
  items,
}: {
  title: string;
  context: string;
  items: {
    prompt: string;
    answer: string;
    model: string;
    criteria: string[];
  }[];
}) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [result, setResult] = useState<AiItem[] | null>(null);
  async function run() {
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/learn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(await authHeaders()),
        },
        body: JSON.stringify({
          action: "grade",
          title,
          context,
          items,
          requestId: crypto.randomUUID(),
        }),
      });
      const b = await r.json();
      if (!r.ok) throw new Error(b.error);
      setResult(b.items);
    } catch (e) {
      setError(
        e instanceof Error && e.message
          ? e.message
          : "La correction IA est indisponible pour le moment.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="ai-correction">
      {!result && (
        <button
          className="button secondary"
          onClick={run}
          disabled={busy || items.every((i) => !i.answer.trim())}
        >
          {busy ? (
            <LoaderCircle size={17} className="spin" />
          ) : (
            <Sparkles size={17} />
          )}
          {busy ? "Correction en cours…" : "Correction détaillée par l’IA"}
        </button>
      )}
      {error && <p className="form-error">{error}</p>}
      {result?.map((item, i) => (
        <div key={i} className={`writing-feedback verdict-box-${item.verdict}`}>
          <span className="ai-label">
            <Sparkles size={14} /> Correction IA · question {i + 1}
          </span>
          <VerdictBadge verdict={item.verdict} />
          <p>{item.feedback}</p>
          {item.improved && (
            <div className="model-answer">
              <span>Ta réponse, améliorée</span>
              <p>{item.improved}</p>
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
