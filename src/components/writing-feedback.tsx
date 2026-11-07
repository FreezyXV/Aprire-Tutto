"use client";
import {
  AlertTriangle,
  Check,
  LoaderCircle,
  Sparkles,
  WifiOff,
  X,
} from "lucide-react";
import {
  verdictLabels,
  type CriterionResult,
  type PromptGrade,
  type Verdict,
} from "@/lib/grading";
import type { AiGrade } from "@/lib/types";

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

function Source({ ai }: { ai: boolean }) {
  return (
    <span className="grade-source">
      {ai ? <Sparkles size={13} /> : <WifiOff size={13} />}
      {ai ? "Correction IA" : "Correction hors ligne"}
    </span>
  );
}

export function ModelAnswer({ label, text }: { label: string; text: string }) {
  return text ? (
    <div className="model-answer">
      <span>{label}</span>
      <p>{text}</p>
    </div>
  ) : null;
}

/** One answer's correction: the AI verdict when fresh, the offline one otherwise. */
export function AnswerFeedback({
  ai,
  offline,
  model,
  pending,
}: {
  ai?: AiGrade;
  offline?: PromptGrade | null;
  model: string;
  pending: boolean;
}) {
  const verdict = ai?.verdict ?? offline?.verdict;
  if (!verdict)
    // Generated topics have no offline grid: show the hint while the AI works
    // or when it is unavailable.
    return model || pending ? (
      <div className="writing-feedback" role="status">
        {pending && (
          <p className="grade-pending">
            <LoaderCircle size={14} className="spin" /> L’IA vérifie ta réponse…
          </p>
        )}
        <ModelAnswer label="Piste de réponse" text={model} />
      </div>
    ) : null;
  return (
    <div className={`writing-feedback verdict-box-${verdict}`} role="status">
      <div className="grade-head">
        <VerdictBadge verdict={verdict} />
        <Source ai={!!ai} />
      </div>
      {pending && !ai && (
        <p className="grade-pending">
          <LoaderCircle size={14} className="spin" /> L’IA vérifie ta réponse…
        </p>
      )}
      {ai ? (
        <>
          <p>{ai.feedback}</p>
          <ModelAnswer label="Ta réponse, améliorée" text={ai.improved} />
          {offline && (
            <details className="offline-details">
              <summary>Repères attendus</summary>
              <CriteriaList criteria={offline.criteria} />
            </details>
          )}
        </>
      ) : (
        offline && (
          <>
            <CriteriaList criteria={offline.criteria} />
            {offline.warnings.map((w) => (
              <p key={w} className="writing-warning">
                <AlertTriangle size={15} /> {w}
              </p>
            ))}
          </>
        )
      )}
      <ModelAnswer label="Exemple de réponse attendue" text={model} />
    </div>
  );
}
