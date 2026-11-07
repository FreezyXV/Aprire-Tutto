"use client";
import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  Lightbulb,
  LoaderCircle,
  Sparkles,
  X,
} from "lucide-react";
import type {
  AiGrade,
  Course,
  Lesson,
  PracticeResult,
  PromptCheck,
} from "@/lib/types";
import { gradePrompt } from "@/lib/grading";
import { planArbitration } from "@/lib/arbitration";
import { callAi } from "@/lib/ai-client";
import { Choice } from "./session";
import { AnswerFeedback } from "./writing-feedback";

export type Level = 1 | 2 | 3;
export const levels: { level: Level; name: string; help: string }[] = [
  {
    level: 1,
    name: "Accompagné",
    help: "Un exemple résolu pas à pas, puis des questions avec indice.",
  },
  {
    level: 2,
    name: "Moins d’aide",
    help: "Un exercice similaire à rédiger, corrigé après ta réponse.",
  },
  {
    level: 3,
    name: "Autonomie",
    help: "Une situation nouvelle du fil rouge : plusieurs décisions à justifier.",
  },
];

export function bestResult(
  results: PracticeResult[],
  lessonId: string,
  level: Level,
) {
  return results
    .filter((r) => r.lessonId === lessonId && r.level === level)
    .sort((a, b) => b.solid / b.total - a.solid / a.total)[0];
}

/** Levels with at least one fully solid attempt. */
export function practicedLevels(results: PracticeResult[], lessonId: string) {
  return ([1, 2, 3] as Level[]).filter((lv) => {
    const b = bestResult(results, lessonId, lv);
    return b && b.solid === b.total;
  }).length;
}

export function PracticeHub({
  course,
  results,
  open,
  read,
}: {
  course: Course;
  results: PracticeResult[];
  open: (lesson: Lesson, level: Level) => void;
  read: (lesson: Lesson) => void;
}) {
  return (
    <div className="practice-hub">
      {course.caseStudy && (
        <section className="case-banner">
          <strong>Fil rouge · {course.caseStudy.name}</strong>
          <p>{course.caseStudy.pitch}</p>
        </section>
      )}
      {course.lessons.map((l, i) => (
        <article key={l.id} className="practice-card">
          <header>
            <span className="eyebrow">
              Chapitre {i + 1} · {l.skill}
            </span>
            <h3>{l.title}</h3>
            <button className="text-button" onClick={() => read(l)}>
              <BookOpen size={15} /> Revoir le cours
            </button>
          </header>
          <div className="level-row">
            {levels.map(({ level, name, help }) => {
              const b = bestResult(results, l.id, level);
              const disabled = level === 3 && !l.caseStep;
              return (
                <button
                  key={level}
                  className={`level-button ${b ? (b.solid === b.total ? "done" : "tried") : ""}`}
                  disabled={disabled}
                  onClick={() => open(l, level)}
                >
                  <span className="level-number">{level}</span>
                  <strong>{name}</strong>
                  <small>
                    {disabled
                      ? "Pas de fil rouge pour ce sujet"
                      : b
                        ? `Meilleur résultat : ${b.solid}/${b.total}`
                        : help}
                  </small>
                </button>
              );
            })}
          </div>
        </article>
      ))}
    </div>
  );
}

export function PracticeRunner({
  course,
  lesson,
  level,
  aiReady,
  done,
  close,
}: {
  course: Course;
  lesson: Lesson;
  level: Level;
  aiReady: boolean;
  done: (solid: number, total: number) => void;
  close: () => void;
}) {
  const meta = levels[level - 1];
  return (
    <div
      className="practice-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Pratique niveau ${level}`}
    >
      <div className="practice-sheet">
        <header className="practice-head">
          <div>
            <span className="eyebrow">
              Niveau {level} · {meta.name}
            </span>
            <h2>{lesson.title}</h2>
          </div>
          <button className="icon-button" aria-label="Fermer" onClick={close}>
            <X size={20} />
          </button>
        </header>
        {level === 1 && <Guided lesson={lesson} done={done} />}
        {level === 2 && (
          <WritingExercise
            context={lesson.mission.context}
            title={lesson.mission.title}
            prompts={lesson.mission.prompts}
            checks={lesson.mission.checks}
            models={lesson.mission.prompts.map(
              (_, i) =>
                lesson.mission.checks?.[i]?.model ??
                (i === 0 ? lesson.mission.example : ""),
            )}
            criteria={lesson.mission.prompts.map(
              (_, i) =>
                lesson.mission.checks?.[i]?.criteria.map((c) => c.label) ?? [
                  lesson.mission.rubric[i] ?? "",
                ],
            )}
            aiReady={aiReady}
            done={done}
          />
        )}
        {level === 3 && lesson.caseStep && (
          <WritingExercise
            context={lesson.caseStep.context}
            title={`${course.caseStudy?.name ?? "Fil rouge"} · ${lesson.caseStep.title}`}
            prompts={lesson.caseStep.prompts}
            models={lesson.caseStep.models}
            criteria={lesson.caseStep.criteria}
            aiReady={aiReady}
            done={done}
          />
        )}
      </div>
    </div>
  );
}

/** Level 1: a worked example revealed step by step, then hinted questions. */
function Guided({
  lesson,
  done,
}: {
  lesson: Lesson;
  done: (solid: number, total: number) => void;
}) {
  const ex = lesson.chapter?.workedExample ?? {
    title: lesson.example.context,
    situation: lesson.example.context,
    steps: [
      { label: "Avant", detail: lesson.example.before },
      { label: "Après", detail: lesson.example.after },
    ],
    outcome: lesson.takeaway,
  };
  const [shown, setShown] = useState(1);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState<string[]>([]);
  const [hint, setHint] = useState<string[]>([]);
  const questions = [
    { key: "check", q: lesson.check },
    { key: "transfer", q: lesson.transfer },
  ];
  const exampleDone = shown > ex.steps.length;
  const allRevealed = questions.every((x) => revealed.includes(x.key));
  return (
    <div className="practice-body">
      <section className="guided-example">
        <h3>Résolvons-le ensemble : {ex.title}</h3>
        <p>{ex.situation}</p>
        <ol>
          {ex.steps.slice(0, shown).map((s) => (
            <li key={s.label}>
              <strong>{s.label}</strong>
              <p>{s.detail}</p>
            </li>
          ))}
        </ol>
        {exampleDone ? (
          <p className="worked-outcome">
            <strong>Résultat. </strong>
            {ex.outcome}
          </p>
        ) : (
          <button
            className="button secondary"
            onClick={() => setShown(shown + 1)}
          >
            {shown === ex.steps.length ? "Voir le résultat" : "Étape suivante"}{" "}
            <ArrowRight size={16} />
          </button>
        )}
      </section>
      {exampleDone && (
        <section className="guided-questions">
          <h3>À toi, avec un indice si besoin</h3>
          {questions.map(({ key, q }) => (
            <div key={key}>
              <Choice
                name={`guided-${key}`}
                question={q}
                selected={answers[key]}
                revealed={revealed.includes(key)}
                onSelect={(i) => setAnswers({ ...answers, [key]: i })}
              />
              {!revealed.includes(key) && (
                <div className="guided-actions">
                  <button
                    className="text-button"
                    onClick={() =>
                      setHint(
                        hint.includes(key)
                          ? hint.filter((h) => h !== key)
                          : [...hint, key],
                      )
                    }
                  >
                    <Lightbulb size={15} /> Indice
                  </button>
                  <button
                    className="button primary"
                    disabled={answers[key] === undefined}
                    onClick={() => setRevealed([...revealed, key])}
                  >
                    Vérifier
                  </button>
                </div>
              )}
              {hint.includes(key) && !revealed.includes(key) && (
                <p className="hint-box">{lesson.takeaway}</p>
              )}
            </div>
          ))}
          {allRevealed && (
            <button
              className="button primary full"
              onClick={() =>
                done(
                  questions.filter(({ key, q }) => answers[key] === q.answer)
                    .length,
                  questions.length,
                )
              }
            >
              Enregistrer et terminer <Check size={17} />
            </button>
          )}
        </section>
      )}
    </div>
  );
}

/** Levels 2 and 3: written answers, offline grid + AI arbitration. */
function WritingExercise({
  title,
  context,
  prompts,
  checks,
  models,
  criteria,
  aiReady,
  done,
}: {
  title: string;
  context: string;
  prompts: string[];
  checks?: PromptCheck[];
  models: string[];
  criteria: string[][];
  aiReady: boolean;
  done: (solid: number, total: number) => void;
}) {
  const [writing, setWriting] = useState<string[]>(prompts.map(() => ""));
  const [corrected, setCorrected] = useState(false);
  const [ai, setAi] = useState<{ answers: string[]; items: AiGrade[] }>();
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");
  const [self, setSelf] = useState<Record<number, boolean>>({});
  const offline = prompts.map((_, i) =>
    checks?.[i] ? gradePrompt(writing[i], checks[i]) : null,
  );
  const fresh = (i: number) =>
    ai && ai.answers[i] === writing[i] ? ai.items[i] : undefined;
  const verdictOf = (i: number) =>
    fresh(i)?.verdict ?? offline[i]?.verdict ?? (self[i] ? "solid" : undefined);
  const solid = prompts.filter((_, i) => verdictOf(i) === "solid").length;
  const needsSelf = prompts.some((_, i) => !fresh(i) && !offline[i]);

  async function correct() {
    setCorrected(true);
    if (!aiReady) return;
    const { results, toAsk } = planArbitration(writing, offline, ai);
    if (toAsk.length === 0) {
      setAi({ answers: [...writing], items: results as AiGrade[] });
      return;
    }
    setPending(true);
    setNotice("");
    const sent = [...writing];
    try {
      const b = await callAi<{ items: AiGrade[] }>(
        {
          action: "grade",
          title: title.slice(0, 300),
          context: context.slice(0, 3000),
          items: toAsk.map((i) => ({
            prompt: prompts[i].slice(0, 1000),
            answer: sent[i].slice(0, 3000),
            model: models[i]?.slice(0, 2000) ?? "",
            criteria: (criteria[i] ?? []).filter(Boolean).slice(0, 6),
          })),
        },
        () =>
          setNotice(
            "Une demande vient d’être envoyée : la correction IA part dans 20 secondes.",
          ),
      );
      toAsk.forEach((i, k) => {
        results[i] = b.items[k];
      });
      setAi({ answers: sent, items: results as AiGrade[] });
      setNotice("");
    } catch (e) {
      setNotice(
        `${e instanceof Error ? e.message : "Correction IA indisponible."} Compare ta réponse à la réponse modèle.`,
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="practice-body">
      <h3>{title}</h3>
      <p className="session-intro">{context}</p>
      {prompts.map((p, i) => (
        <label className="writing-field" key={p}>
          <span>
            <b>{i + 1}</b>
            {p}
          </span>
          <textarea
            rows={4}
            maxLength={3000}
            placeholder="Pose ton raisonnement ici…"
            value={writing[i]}
            onChange={(e) => {
              const w = [...writing];
              w[i] = e.target.value;
              setWriting(w);
            }}
          />
          {corrected && (
            <AnswerFeedback
              ai={fresh(i)}
              offline={offline[i]}
              model={models[i] ?? ""}
              pending={pending}
            />
          )}
          {corrected && !fresh(i) && !offline[i] && !pending && (
            <span className="self-check">
              Ta réponse couvre-t-elle l’essentiel de la réponse modèle ?
              <button
                type="button"
                className={self[i] ? "selected" : ""}
                onClick={() => setSelf({ ...self, [i]: true })}
              >
                Oui
              </button>
              <button
                type="button"
                className={self[i] === false ? "selected" : ""}
                onClick={() => setSelf({ ...self, [i]: false })}
              >
                À revoir
              </button>
            </span>
          )}
        </label>
      ))}
      {notice && <p className="ai-notice">{notice}</p>}
      {!corrected ? (
        <button
          className="button primary full"
          disabled={writing.every((w) => !w.trim())}
          onClick={correct}
        >
          Corriger mes réponses <ArrowRight size={17} />
        </button>
      ) : (
        <div className="practice-actions">
          <p className="correction-summary-inline">
            <strong>
              {solid}/{prompts.length} ·{" "}
              {solid > 1 ? "réponses solides" : "réponse solide"}
            </strong>
            {needsSelf && !aiReady
              ? " · compare tes réponses aux réponses modèles."
              : ""}
          </p>
          {aiReady &&
            !pending &&
            ai &&
            writing.some((w, i) => w !== ai.answers[i]) && (
              <button className="button secondary" onClick={correct}>
                {pending ? (
                  <LoaderCircle size={16} className="spin" />
                ) : (
                  <Sparkles size={16} />
                )}
                Recorriger mes modifications
              </button>
            )}
          <button
            className="button primary"
            disabled={pending}
            onClick={() => done(solid, prompts.length)}
          >
            Enregistrer et terminer <Check size={17} />
          </button>
        </div>
      )}
    </div>
  );
}
