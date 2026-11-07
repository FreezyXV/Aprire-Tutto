"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clock3,
  Lightbulb,
  MessageCircle,
  Pause,
  RotateCcw,
  Sparkles,
  Target,
} from "lucide-react";
import type {
  AiGrade,
  Course,
  Lesson,
  Question,
  SessionDraft,
} from "@/lib/types";
import { stages } from "@/lib/learning";
import {
  gradeCriteria,
  gradePrompt,
  normalize,
  type PromptGrade,
} from "@/lib/grading";
import { callAi } from "@/lib/ai-client";
import { AnswerFeedback } from "./writing-feedback";
import { Pill } from "./ui";
import { Diagram } from "./diagram";
const labels: Record<string, string> = {
  recall: "Réactiver",
  learn: "Comprendre",
  check: "Pratiquer",
  mission: "À toi de jouer",
  transfer: "Transférer",
  reflection: "Prendre du recul",
  summary: "Faire le point",
};
export function Choice({
  question,
  selected,
  revealed,
  onSelect,
  name,
}: {
  question: Question;
  selected?: number;
  revealed: boolean;
  onSelect: (i: number) => void;
  name: string;
}) {
  return (
    <div className="question">
      <h2>{question.prompt}</h2>
      <div className="choices" role="radiogroup" aria-label={question.prompt}>
        {question.options.map((option, i) => (
          <button
            key={option}
            role="radio"
            aria-checked={selected === i}
            disabled={revealed}
            tabIndex={
              selected === i || (selected === undefined && i === 0) ? 0 : -1
            }
            onKeyDown={(e) => {
              if (
                ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(
                  e.key,
                )
              ) {
                e.preventDefault();
                const n =
                  (i +
                    (e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1) +
                    question.options.length) %
                  question.options.length;
                onSelect(n);
                const group = e.currentTarget.parentElement;
                const next =
                  group?.querySelectorAll<HTMLButtonElement>("button")[n];
                next?.focus();
              }
            }}
            className={`choice ${selected === i ? "selected" : ""} ${revealed && i === question.answer ? "correct" : ""} ${revealed && selected === i && i !== question.answer ? "incorrect" : ""}`}
            onClick={() => onSelect(i)}
          >
            <span className="choice-key">
              {revealed && i === question.answer ? (
                <Check size={16} />
              ) : (
                String.fromCharCode(65 + i)
              )}
            </span>
            <span>{option}</span>
            <span className="choice-radio" />
          </button>
        ))}
      </div>
      {revealed && (
        <div
          className={`feedback ${selected === question.answer ? "positive" : selected === -1 ? "neutral" : "wrong"}`}
          role="status"
        >
          <strong>
            {selected === question.answer
              ? "Bonne réponse."
              : selected === -1
                ? "Voici la réponse."
                : "Pas tout à fait. Voici pourquoi :"}
          </strong>
          <p>{question.explanation}</p>
        </div>
      )}
      <input type="hidden" name={name} value={selected ?? ""} />
    </div>
  );
}
export function LearningSession({
  course,
  lesson,
  draft,
  update,
  pause,
  finish,
  tutor,
}: {
  course: Course;
  lesson: Lesson;
  draft: SessionDraft;
  update: (d: SessionDraft) => void;
  pause: () => void;
  finish: () => void;
  tutor: () => void;
}) {
  const sequence = stages(draft.minutes);
  const step = sequence[draft.step];
  const isQuestion = ["recall", "check", "transfer"].includes(step);
  const question =
    step === "recall"
      ? lesson.recall
      : step === "check"
        ? lesson.check
        : lesson.transfer;
  const answered = draft.answers[step] !== undefined;
  const revealed = draft.revealed.includes(step);
  const [showExample, setShowExample] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    window.scrollTo({ top: 0 });
    heading.current?.focus();
    setShowExample(false);
  }, [draft.step]);
  const change = (patch: Partial<SessionDraft>) =>
    update({ ...draft, ...patch });
  const missionPrompts =
    draft.minutes === 10
      ? lesson.mission.prompts.slice(0, 1)
      : lesson.mission.prompts;
  const missionChecks = lesson.mission.checks;
  // Latest draft, so async AI results never overwrite newer typing.
  const draftRef = useRef(draft);
  draftRef.current = draft;
  const [aiReady, setAiReady] = useState(false);
  const [aiPending, setAiPending] = useState<string | null>(null);
  const [aiNotice, setAiNotice] = useState("");
  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then((b) => setAiReady(!!b.ai))
      .catch(() => setAiReady(false));
  }, []);
  const offlineGrades = (writing: string[]) =>
    missionPrompts.map((_, i) =>
      missionChecks?.[i]
        ? gradePrompt(writing[i] ?? "", missionChecks[i])
        : null,
    );
  /** AI verdict for answer i if it judged exactly this text. */
  const freshAi = (
    key: "mission" | "reflection",
    answers: string[],
    i: number,
    d: SessionDraft = draft,
  ) => {
    const g = d.aiGrades?.[key];
    return g && g.answers[i] === (answers[i] ?? "") ? g.items[i] : undefined;
  };
  /** Official verdicts: AI arbitrates, the offline grid fills in. */
  const officialSolid = (writing: string[], d: SessionDraft = draft) =>
    missionPrompts.flatMap((_, i) => {
      const ai = freshAi("mission", writing, i, d);
      const v = ai?.verdict ?? offlineGrades(writing)[i]?.verdict;
      return v === "solid" ? [i] : [];
    });
  const missionItems = (writing: string[]) =>
    missionPrompts.map((p, i) => ({
      prompt: p,
      answer: (writing[i] ?? "").slice(0, 3000),
      model: (missionChecks?.[i]?.model ?? lesson.mission.example).slice(
        0,
        2000,
      ),
      criteria: (
        missionChecks?.[i]?.criteria.map((c) => c.label) ?? [
          lesson.mission.rubric[i] ?? "",
        ]
      ).filter(Boolean),
      ...(() => {
        const check = missionChecks?.[i];
        const mistake = check?.avoid?.find((a) =>
          a.patterns.some((p) =>
            new RegExp(p, "i").test(normalize(writing[i] ?? "")),
          ),
        );
        return mistake ? { alert: mistake.message.slice(0, 300) } : {};
      })(),
    }));
  const reflectionModel = [lesson.takeaway, ...lesson.cards.map((c) => c.back)]
    .join(" ")
    .slice(0, 2000);
  const reflectionItems = (text: string) => [
    {
      prompt:
        "Explique la notion à quelqu’un qui découvre le sujet, puis donne une situation où l’utiliser.",
      answer: text.slice(0, 3000),
      model: reflectionModel,
      criteria: (lesson.keyIdeas ?? []).map((k) => k.label),
    },
  ];
  const reflectionGrade = (text: string): PromptGrade | null => {
    if (!lesson.keyIdeas) return null;
    const ideas = gradeCriteria(text, lesson.keyIdeas);
    const met = ideas.filter((c) => c.met).length;
    return {
      verdict: !text.trim()
        ? "empty"
        : met === ideas.length
          ? "solid"
          : met === 0
            ? "revise"
            : "partial",
      criteria: ideas,
      warnings: [],
      model: reflectionModel,
    };
  };
  /**
   * Token-saving arbitration: reuse verdicts for unchanged answers, settle
   * empty answers and answers the grid fully validates locally, and send
   * only the remaining (doubtful) answers to the AI.
   */
  async function arbitrate(key: "mission" | "reflection") {
    const d = draftRef.current;
    const answers =
      key === "mission"
        ? missionPrompts.map((_, i) => d.writing[i] ?? "")
        : [d.reflection];
    if (!aiReady) return;
    const previous = d.aiGrades?.[key];
    const offline =
      key === "mission"
        ? offlineGrades(answers)
        : [reflectionGrade(answers[0])];
    const results: (AiGrade | null)[] = answers.map((a, i) => {
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
    const save = (items: AiGrade[]) => {
      const latest = draftRef.current;
      const next = {
        ...latest,
        aiGrades: {
          ...latest.aiGrades,
          [key]: { answers, items, at: new Date().toISOString() },
        },
      };
      update(
        key === "mission"
          ? { ...next, rubric: officialSolid(latest.writing, next) }
          : next,
      );
    };
    const toAsk = results.flatMap((r, i) => (r ? [] : [i]));
    if (toAsk.length === 0) {
      save(results as AiGrade[]);
      return;
    }
    const allItems =
      key === "mission" ? missionItems(answers) : reflectionItems(answers[0]);
    setAiPending(key);
    setAiNotice("");
    try {
      const b = await callAi<{ items: AiGrade[] }>(
        {
          action: "grade",
          title: key === "mission" ? lesson.mission.title : lesson.title,
          context: (key === "mission"
            ? lesson.mission.context
            : lesson.subtitle
          ).slice(0, 3000),
          items: toAsk.map((i) => allItems[i]),
        },
        () =>
          setAiNotice(
            "Une demande vient d’être envoyée : la correction IA part dans 20 secondes.",
          ),
      );
      setAiNotice("");
      toAsk.forEach((i, k) => {
        results[i] = b.items[k];
      });
      save(results as AiGrade[]);
    } catch (e) {
      setAiNotice(
        `${e instanceof Error && e.message ? e.message : "Correction IA indisponible."} ${
          (key === "mission" ? missionChecks : lesson.keyIdeas)
            ? "La correction hors ligne fait foi."
            : "Compare ta réponse à la piste proposée."
        }`,
      );
    } finally {
      setAiPending(null);
    }
  }
  const gradable =
    (step === "mission" && (!!missionChecks || aiReady)) ||
    (step === "reflection" && (!!lesson.keyIdeas || aiReady));
  const toCorrect = (isQuestion || gradable) && !revealed;
  const next = () => {
    if (isQuestion && !revealed) {
      change({ revealed: [...draft.revealed, step] });
      return;
    }
    if (gradable && !revealed) {
      const corrected: SessionDraft = {
        ...draft,
        revealed: [...draft.revealed, step],
        ...(step === "mission" ? { rubric: officialSolid(draft.writing) } : {}),
      };
      // Arbitration may save synchronously (no AI needed): it must build on
      // this corrected draft, not on the previous render's.
      draftRef.current = corrected;
      update(corrected);
      void arbitrate(step as "mission" | "reflection");
      return;
    }
    if (step === "summary") {
      finish();
      return;
    }
    change({ step: draft.step + 1 });
  };
  const canNext = isQuestion
    ? answered || revealed
    : !gradable ||
      revealed ||
      (step === "mission"
        ? draft.writing.some((w) => w?.trim())
        : !!draft.reflection.trim());
  const grades =
    step === "mission" && revealed ? offlineGrades(draft.writing) : [];
  const missionAnswers = missionPrompts.map((_, i) => draft.writing[i] ?? "");
  const staleAi = (key: "mission" | "reflection") => {
    const g = draft.aiGrades?.[key];
    const now = key === "mission" ? missionAnswers : [draft.reflection];
    return !g || now.some((a, i) => g.answers[i] !== a);
  };
  const solidCount = draft.rubric.length;
  const correct = [
    "check",
    ...(draft.minutes >= 20 ? ["transfer"] : []),
  ].filter(
    (k) =>
      draft.answers[k] ===
      (k === "check" ? lesson.check.answer : lesson.transfer.answer),
  ).length;
  return (
    <div className="focus-shell">
      <header className="focus-header">
        <button className="text-button" onClick={pause}>
          <ArrowLeft size={18} />
          <span>Mon espace</span>
        </button>
        <span className="focus-course">{course.title}</span>
        <button className="text-button" onClick={pause}>
          <Pause size={16} />
          <span>Faire une pause</span>
        </button>
      </header>
      <div className="session-progress">
        <div
          style={{ width: `${((draft.step + 1) / sequence.length) * 100}%` }}
        />
      </div>
      <main className="session-main" id="main-content">
        <div className="session-meta">
          <Pill>
            <Clock3 size={13} />
            {draft.minutes} min · à ton rythme
          </Pill>
          <span>
            Étape {draft.step + 1} sur {sequence.length}
          </span>
        </div>
        <div className="step-eyebrow">
          {step === "learn" ? (
            <BookOpen size={16} />
          ) : step === "mission" ? (
            <Target size={16} />
          ) : (
            <Sparkles size={16} />
          )}{" "}
          {labels[step]}
        </div>
        <h1 ref={heading} tabIndex={-1}>
          {step === "learn"
            ? lesson.title
            : step === "mission"
              ? lesson.mission.title
              : step === "summary"
                ? "Un pas de plus."
                : step === "reflection"
                  ? "Ce que tu emportes."
                  : step === "recall"
                    ? "Avant de commencer…"
                    : step === "transfer"
                      ? "Et dans une autre situation ?"
                      : "À toi de faire le lien."}
        </h1>
        {step === "recall" && (
          <p className="session-intro">
            Essaie de retrouver la réponse sans aide. Ne pas savoir fait aussi
            partie du point de départ.
          </p>
        )}
        {isQuestion && (
          <>
            <Choice
              name={step}
              question={question}
              selected={draft.answers[step]}
              revealed={revealed}
              onSelect={(i) =>
                change({ answers: { ...draft.answers, [step]: i } })
              }
            />
            {step === "recall" && !revealed && (
              <button
                className="text-button unsure"
                onClick={() =>
                  change({
                    answers: { ...draft.answers, recall: -1 },
                    revealed: [...draft.revealed, "recall"],
                  })
                }
              >
                Je ne sais pas encore <ArrowRight size={15} />
              </button>
            )}
          </>
        )}
        {step === "learn" && (
          <>
            <div className="lesson-copy">
              {lesson.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="worked-example">
              <span className="eyebrow">Un exemple concret</span>
              <p>{lesson.example.context}</p>
              <div className="example-before">{lesson.example.before}</div>
              <ArrowRight className="example-arrow" size={20} />
              <div className="example-after">{lesson.example.after}</div>
            </div>
            <div className="takeaway">
              <Lightbulb size={23} />
              <p>{lesson.takeaway}</p>
            </div>
            {(() => {
              const d = lesson.chapter?.sections.find(
                (x) => x.diagram,
              )?.diagram;
              return d ? (
                <>
                  <Diagram diagram={d} />
                  <p className="muted small-text">
                    Le chapitre complet, avec ses exemples et ses schémas,
                    t’attend dans l’espace Cours.
                  </p>
                </>
              ) : null;
            })()}
            <details className="sources">
              <summary>Explorer les sources de référence</summary>
              {course.sources.map((s) => (
                <a key={s.url} href={s.url} target="_blank" rel="noreferrer">
                  {s.title} ↗
                </a>
              ))}
            </details>
          </>
        )}
        {step === "mission" && (
          <>
            <p className="session-intro">{lesson.mission.context}</p>
            <div className="scenario-label">
              <span /> Cas fictif · mise en pratique
            </div>
            {missionPrompts.map((p, i) => (
              <label className="writing-field" key={p}>
                <span>
                  <b>0{i + 1}</b>
                  {p}
                </span>
                <textarea
                  maxLength={3000}
                  rows={3}
                  placeholder="Pose ton raisonnement ici…"
                  value={draft.writing[i] ?? ""}
                  onChange={(e) => {
                    const w = [...draft.writing];
                    w[i] = e.target.value;
                    change({
                      writing: w,
                      ...(revealed ? { rubric: officialSolid(w) } : {}),
                    });
                  }}
                />
                {revealed && (
                  <AnswerFeedback
                    ai={freshAi("mission", missionAnswers, i)}
                    offline={grades[i]}
                    model={
                      missionChecks?.[i]?.model ??
                      (i === 0 ? lesson.mission.example : "")
                    }
                    pending={aiPending === "mission"}
                  />
                )}
              </label>
            ))}
            {gradable ? (
              !revealed ? (
                <>
                  <button
                    className="text-button"
                    onClick={() => setShowExample(!showExample)}
                  >
                    <Lightbulb size={16} />
                    {showExample ? "Masquer l’indice" : "Besoin d’un indice ?"}
                  </button>
                  {showExample && (
                    <div className="feedback neutral">
                      <strong>Une bonne réponse contient :</strong>
                      <ul className="hint-list">
                        {missionPrompts.map((p, i) => (
                          <li key={p}>
                            <b>{i + 1}.</b>{" "}
                            {missionChecks?.[i]
                              ? missionChecks[i].criteria
                                  .map((c) => c.label.toLowerCase())
                                  .join(" · ")
                              : lesson.mission.rubric[i]}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <p className="correction-note">
                    Écris tes réponses, puis demande la correction :{" "}
                    {aiReady
                      ? "l’IA juge chaque réponse et explique son verdict."
                      : "chaque réponse reçoit un verdict et une réponse modèle."}
                  </p>
                </>
              ) : (
                <CorrectionSummary
                  hasGrid={!!missionChecks}
                  solid={solidCount}
                  total={missionPrompts.length}
                  aiReady={aiReady}
                  pending={aiPending === "mission"}
                  stale={staleAi("mission")}
                  notice={aiNotice}
                  retry={() => void arbitrate("mission")}
                />
              )
            ) : (
              <>
                <button
                  className="text-button"
                  onClick={() => setShowExample(!showExample)}
                >
                  <Lightbulb size={16} />
                  {showExample
                    ? "Masquer la piste de réponse"
                    : "Voir une piste de réponse"}
                </button>
                {showExample && (
                  <div className="feedback neutral">
                    <strong>Une piste, parmi d’autres</strong>
                    <p>{lesson.mission.example}</p>
                  </div>
                )}
                <div className="self-review">
                  <h3>Relis ton travail avec ces critères</h3>
                  <p>
                    Une autoévaluation pour guider ta réflexion, sans note
                    automatique.
                  </p>
                  {lesson.mission.rubric
                    .slice(0, draft.minutes === 10 ? 1 : 3)
                    .map((r, i) => (
                      <label key={r}>
                        <input
                          type="checkbox"
                          checked={draft.rubric.includes(i)}
                          onChange={() =>
                            change({
                              rubric: draft.rubric.includes(i)
                                ? draft.rubric.filter((x) => x !== i)
                                : [...draft.rubric, i],
                            })
                          }
                        />
                        {r}
                      </label>
                    ))}
                </div>
              </>
            )}
            <button className="text-button" onClick={tutor}>
              <MessageCircle size={16} /> Demander un retour au tuteur
            </button>
          </>
        )}
        {step === "reflection" && (
          <>
            <p className="session-intro">
              Explique la notion à quelqu’un qui découvre le sujet. Puis
              identifie une situation où tu pourrais l’utiliser.
            </p>
            <label className="writing-field">
              <span>Avec tes propres mots</span>
              <textarea
                maxLength={12000}
                rows={6}
                value={draft.reflection}
                onChange={(e) => change({ reflection: e.target.value })}
                placeholder="J’ai compris que… La prochaine fois que…"
              />
            </label>
            {revealed && gradable ? (
              (() => {
                const offline = reflectionGrade(draft.reflection);
                const ideas = offline?.criteria ?? [];
                const met = ideas.filter((c) => c.met).length;
                return (
                  <>
                    {lesson.keyIdeas && (
                      <p className="ideas-count">
                        {met}/{ideas.length} idées clés retrouvées
                      </p>
                    )}
                    <AnswerFeedback
                      ai={freshAi("reflection", [draft.reflection], 0)}
                      offline={offline}
                      model={reflectionModel}
                      pending={aiPending === "reflection"}
                    />
                    <CorrectionSummary
                      hasGrid={!!lesson.keyIdeas}
                      aiReady={aiReady}
                      pending={aiPending === "reflection"}
                      stale={staleAi("reflection")}
                      notice={aiNotice}
                      retry={() => void arbitrate("reflection")}
                    />
                  </>
                );
              })()
            ) : (
              <div className="takeaway">
                <Lightbulb size={22} />
                <p>
                  Reformuler permet de repérer ce que l’on comprend vraiment et
                  ce qui reste à éclaircir.
                </p>
              </div>
            )}
          </>
        )}
        {step === "summary" && (
          <>
            <div className="summary-card">
              <div className="summary-check">
                <CheckCircle2 size={38} strokeWidth={1.3} />
              </div>
              <h2>{lesson.skill}</h2>
              <p>{lesson.takeaway}</p>
              <div className="summary-numbers">
                <div>
                  <strong>
                    {correct}/{draft.minutes >= 20 ? 2 : 1}
                  </strong>
                  <span>questions d’application</span>
                </div>
                {missionChecks && draft.minutes >= 10 && (
                  <div>
                    <strong>
                      {solidCount}/{missionPrompts.length}
                    </strong>
                    <span>réponses écrites solides</span>
                  </div>
                )}
                <div>
                  <strong>{draft.minutes} min</strong>
                  <span>format choisi</span>
                </div>
              </div>
            </div>
            <div className="next-review">
              <RotateCcw size={21} />
              <div>
                <strong>On y revient demain.</strong>
                <p>
                  Une courte révision t’aidera à retrouver cette notion de
                  mémoire. Une séance réussie est un début, pas une preuve de
                  maîtrise durable.
                </p>
              </div>
            </div>
            {draft.writing.some((w) => w.trim()) && (
              <p className="saved-writing">
                <Check size={16} /> Ton travail sera conservé dans ta
                progression.
              </p>
            )}
          </>
        )}
        <footer className="session-footer">
          {draft.step > 0 && step !== "summary" ? (
            <button
              className="text-button"
              onClick={() => change({ step: draft.step - 1 })}
            >
              <ArrowLeft size={16} />
              Retour
            </button>
          ) : (
            <span />
          )}
          <button className="button primary" disabled={!canNext} onClick={next}>
            {step === "summary"
              ? "Terminer ma séance"
              : toCorrect
                ? isQuestion
                  ? "Vérifier ma réponse"
                  : step === "mission"
                    ? "Corriger mes réponses"
                    : "Vérifier ma reformulation"
                : "Continuer"}
            <ArrowRight size={18} />
          </button>
        </footer>
        <p className="session-reassurance">
          {step === "mission"
            ? "Tes brouillons sont enregistrés au fil de l’écriture."
            : "Tu peux faire une pause et reprendre exactement ici."}
        </p>
      </main>
    </div>
  );
}

function CorrectionSummary({
  hasGrid,
  solid,
  total,
  aiReady,
  pending,
  stale,
  notice,
  retry,
}: {
  hasGrid: boolean;
  solid?: number;
  total?: number;
  aiReady: boolean;
  pending: boolean;
  stale: boolean;
  notice: string;
  retry: () => void;
}) {
  return (
    <div className="correction-summary" role="status">
      {total !== undefined && (hasGrid || !stale) && (
        <strong>
          {solid}/{total} · {solid! > 1 ? "réponses solides" : "réponse solide"}
        </strong>
      )}
      <p>
        {pending
          ? hasGrid
            ? "L’IA vérifie tes réponses. Le verdict hors ligne s’affiche en attendant."
            : "L’IA vérifie tes réponses (jusqu’à une minute)."
          : !hasGrid && stale
            ? "Pas de correction hors ligne pour ce sujet : compare ta réponse à la piste, ou demande l’avis de l’IA."
            : !aiReady
              ? "Correction hors ligne : elle repère les idées clés attendues, sans juger le style. La correction par l’IA s’activera dès que DeepSeek sera connecté."
              : stale
                ? "Tu as modifié ta réponse : le verdict hors ligne est affiché. Redemande l’avis de l’IA pour un verdict définitif."
                : "Verdict final : l’IA a tranché les réponses douteuses, la grille a validé les autres. Tu peux encore améliorer ta réponse."}
      </p>
      {notice && <p className="ai-notice">{notice}</p>}
      {aiReady && stale && !pending && (
        <button className="button secondary" onClick={retry}>
          <Sparkles size={16} /> Faire corriger par l’IA
        </button>
      )}
    </div>
  );
}
