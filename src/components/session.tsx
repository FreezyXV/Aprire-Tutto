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
import type { Course, Lesson, Question, SessionDraft } from "@/lib/types";
import { stages } from "@/lib/learning";
import { gradeCriteria, gradePrompt } from "@/lib/grading";
import {
  AiCorrection,
  CriteriaList,
  PromptFeedback,
  VerdictBadge,
} from "./writing-feedback";
import { Pill } from "./ui";
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
  const gradeAll = (writing: string[]) =>
    missionPrompts.map((_, i) =>
      missionChecks?.[i]
        ? gradePrompt(writing[i] ?? "", missionChecks[i])
        : null,
    );
  const solidIndexes = (writing: string[]) =>
    gradeAll(writing).flatMap((g, i) => (g?.verdict === "solid" ? [i] : []));
  const gradable =
    (step === "mission" && !!missionChecks) ||
    (step === "reflection" && !!lesson.keyIdeas);
  const toCorrect = (isQuestion || gradable) && !revealed;
  const next = () => {
    if (isQuestion && !revealed) {
      change({ revealed: [...draft.revealed, step] });
      return;
    }
    if (gradable && !revealed) {
      change({
        revealed: [...draft.revealed, step],
        ...(step === "mission" ? { rubric: solidIndexes(draft.writing) } : {}),
      });
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
  const grades = step === "mission" && revealed ? gradeAll(draft.writing) : [];
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
                      ...(revealed && missionChecks
                        ? { rubric: solidIndexes(w) }
                        : {}),
                    });
                  }}
                />
                {grades[i] && <PromptFeedback grade={grades[i]} />}
              </label>
            ))}
            {missionChecks ? (
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
                            {missionChecks[i]?.criteria
                              .map((c) => c.label.toLowerCase())
                              .join(" · ")}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <p className="correction-note">
                    Écris tes réponses, puis demande la correction : chaque
                    réponse reçoit un verdict et une réponse modèle.
                  </p>
                </>
              ) : (
                <>
                  <div className="correction-summary" role="status">
                    <strong>
                      {solidCount}/{missionPrompts.length} ·{" "}
                      {solidCount > 1 ? "réponses solides" : "réponse solide"}
                    </strong>
                    <p>
                      Corrige tes réponses : le verdict se met à jour pendant
                      que tu écris. La correction automatique repère les idées
                      clés attendues ; elle ne juge pas le style.
                    </p>
                  </div>
                  <AiCorrection
                    title={lesson.mission.title}
                    context={lesson.mission.context}
                    items={missionPrompts.map((p, i) => ({
                      prompt: p,
                      answer: draft.writing[i] ?? "",
                      model: missionChecks[i]?.model ?? "",
                      criteria:
                        missionChecks[i]?.criteria.map((c) => c.label) ?? [],
                    }))}
                  />
                </>
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
            {revealed && lesson.keyIdeas ? (
              (() => {
                const ideas = gradeCriteria(draft.reflection, lesson.keyIdeas);
                const met = ideas.filter((c) => c.met).length;
                return (
                  <div
                    className={`writing-feedback verdict-box-${met === ideas.length ? "solid" : met === 0 ? "revise" : "partial"}`}
                    role="status"
                  >
                    <VerdictBadge
                      verdict={
                        met === ideas.length
                          ? "solid"
                          : met === 0
                            ? "revise"
                            : "partial"
                      }
                    />
                    <p className="ideas-count">
                      {met}/{ideas.length} idées clés retrouvées
                    </p>
                    <CriteriaList criteria={ideas} />
                    <div className="model-answer">
                      <span>L’essentiel à retenir</span>
                      <p>{lesson.takeaway}</p>
                      {lesson.cards.map((c) => (
                        <p key={c.front}>{c.back}</p>
                      ))}
                    </div>
                  </div>
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
