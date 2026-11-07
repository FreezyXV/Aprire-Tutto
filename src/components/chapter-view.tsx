"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Clock3,
  Lightbulb,
  LoaderCircle,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import type { Course, Lesson, ReadingMark } from "@/lib/types";
import { Diagram } from "./diagram";

/** Reading time from the chapter's words (≈200 words per minute). */
export function readingMinutes(lesson: Lesson) {
  const c = lesson.chapter;
  if (!c) return 0;
  const text = [
    c.objective,
    ...c.sections.flatMap((s) => [
      s.heading,
      ...s.paragraphs,
      s.keyPoint ?? "",
    ]),
    c.workedExample.situation,
    ...c.workedExample.steps.map((s) => s.detail),
    c.workedExample.outcome,
    ...c.pitfalls.flatMap((p) => [p.confusion, p.correction, p.counterExample]),
    ...c.summary,
  ].join(" ");
  return Math.max(3, Math.round(text.split(/\s+/).length / 200) + 2);
}

export function ChapterReader({
  course,
  lesson,
  index,
  mark,
  practiced,
  onProgress,
  onPractice,
  onBack,
  onNext,
  aiReady,
  generate,
}: {
  course: Course;
  lesson: Lesson;
  index: number;
  mark?: ReadingMark;
  practiced: number;
  onProgress: (section: number, finished: boolean) => void;
  onPractice: () => void;
  onBack: () => void;
  onNext?: () => void;
  aiReady: boolean;
  generate: () => Promise<void>;
}) {
  const c = lesson.chapter;
  const root = useRef<HTMLDivElement>(null);
  const reached = useRef(mark?.section ?? 0);
  const [resumed, setResumed] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Resume where the reader stopped, unless the chapter was finished.
  useEffect(() => {
    if (!c) return;
    const target = mark && !mark.finishedAt ? mark.section : 0;
    const el = root.current?.querySelector<HTMLElement>(
      `[data-section="${target}"]`,
    );
    if (target > 0 && el) {
      el.scrollIntoView({ block: "start" });
      setResumed(el.dataset.title ?? "");
    } else window.scrollTo({ top: 0 });
    // Only on opening a chapter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id, !!c]);

  // Track the furthest section reached, and the end of the chapter.
  useEffect(() => {
    if (!c || !root.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          if (el.dataset.end) {
            onProgress(reached.current, true);
            continue;
          }
          const n = Number(el.dataset.section);
          if (n > reached.current) {
            reached.current = n;
            onProgress(n, false);
          }
        }
      },
      { rootMargin: "0px 0px -60% 0px" },
    );
    root.current
      .querySelectorAll("[data-section], [data-end]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id, !!c]);

  if (!c)
    return (
      <div className="chapter">
        <button className="text-button back-link" onClick={onBack}>
          <ArrowLeft size={16} /> {course.title}
        </button>
        <header className="chapter-head">
          <span className="eyebrow">
            Chapitre {index + 1} · {lesson.skill}
          </span>
          <h1>{lesson.title}</h1>
          <p>{lesson.subtitle}</p>
        </header>
        <div className="chapter-empty">
          <BookOpen size={28} />
          <p>
            Le cours détaillé de ce chapitre n’a pas encore été rédigé. Il est
            créé une seule fois, puis conservé et disponible hors connexion.
          </p>
          {error && <p className="form-error">{error}</p>}
          <button
            className="button primary"
            disabled={!aiReady || busy}
            onClick={async () => {
              setBusy(true);
              setError("");
              try {
                await generate();
              } catch (e) {
                setError(
                  e instanceof Error
                    ? e.message
                    : "Le cours n’a pas pu être créé.",
                );
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? (
              <LoaderCircle size={17} className="spin" />
            ) : (
              <Sparkles size={17} />
            )}
            {busy
              ? "Rédaction du cours (environ 30 s)…"
              : aiReady
                ? "Rédiger le cours de ce chapitre"
                : "Disponible quand l’IA est connectée"}
          </button>
          <p className="muted small-text">
            En attendant : {lesson.paragraphs.join(" ")}
          </p>
        </div>
      </div>
    );

  const n = c.sections.length;
  const parts = [
    ...c.sections.map((s) => s.heading),
    "Exemple guidé",
    "Confusions fréquentes",
    "Fiche de synthèse",
    "Glossaire",
  ];
  return (
    <div className="chapter" ref={root}>
      <button className="text-button back-link" onClick={onBack}>
        <ArrowLeft size={16} /> {course.title}
      </button>
      <header className="chapter-head">
        <span className="eyebrow">
          Chapitre {index + 1} · {lesson.skill}
        </span>
        <h1>{lesson.title}</h1>
        <p>{lesson.subtitle}</p>
        <div className="chapter-meta">
          <span>
            <Clock3 size={14} /> {readingMinutes(lesson)} min de lecture
          </span>
          {mark?.finishedAt && (
            <span className="status-chip read">
              <Check size={13} /> Lu
            </span>
          )}
          {practiced > 0 && (
            <span className="status-chip practiced">
              <Target size={13} /> Pratiqué {practiced}/3
            </span>
          )}
        </div>
      </header>
      {resumed && (
        <p className="resume-note" role="status">
          Reprise à « {resumed} ».
          <button aria-label="Fermer" onClick={() => setResumed("")}>
            <X size={14} />
          </button>
        </p>
      )}
      <section className="chapter-goal">
        <div>
          <strong>Objectif</strong>
          <p>{c.objective}</p>
        </div>
        {c.prerequisites.length > 0 && (
          <div>
            <strong>Avant de commencer</strong>
            <ul>
              {c.prerequisites.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        )}
      </section>
      <nav className="chapter-toc" aria-label="Sommaire du chapitre">
        <strong>Sommaire</strong>
        <ol>
          {parts.map((p, i) => (
            <li key={p}>
              <button
                className={i < reached.current ? "seen" : ""}
                onClick={() =>
                  root.current
                    ?.querySelector(`[data-section="${i}"]`)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              >
                {p}
              </button>
            </li>
          ))}
        </ol>
      </nav>
      {c.sections.map((s, i) => (
        <section
          key={s.heading}
          className="chapter-section"
          data-section={i}
          data-title={s.heading}
        >
          <h2>{s.heading}</h2>
          {s.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
          {s.diagram && <Diagram diagram={s.diagram} />}
          {s.keyPoint && (
            <aside className="key-point">
              <Lightbulb size={18} />
              <p>{s.keyPoint}</p>
            </aside>
          )}
        </section>
      ))}
      <section
        className="chapter-section worked"
        data-section={n}
        data-title="Exemple guidé"
      >
        <h2>Exemple guidé : {c.workedExample.title}</h2>
        <p className="worked-situation">{c.workedExample.situation}</p>
        <ol className="worked-steps">
          {c.workedExample.steps.map((s) => (
            <li key={s.label}>
              <strong>{s.label}</strong>
              <p>{s.detail}</p>
            </li>
          ))}
        </ol>
        <p className="worked-outcome">
          <strong>Résultat. </strong>
          {c.workedExample.outcome}
        </p>
      </section>
      <section
        className="chapter-section"
        data-section={n + 1}
        data-title="Confusions fréquentes"
      >
        <h2>Confusions fréquentes</h2>
        {c.pitfalls.map((p) => (
          <div key={p.confusion} className="pitfall">
            <p className="pitfall-wrong">
              <X size={15} /> {p.confusion}
            </p>
            <p className="pitfall-right">
              <Check size={15} /> {p.correction}
            </p>
            <p className="pitfall-example">
              <em>Contre-exemple : </em>
              {p.counterExample}
            </p>
          </div>
        ))}
      </section>
      <section
        className="chapter-section synthesis"
        data-section={n + 2}
        data-title="Fiche de synthèse"
      >
        <h2>Fiche de synthèse</h2>
        <ul>
          {c.summary.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <p className="synthesis-takeaway">{lesson.takeaway}</p>
      </section>
      {c.glossary.length > 0 && (
        <section
          className="chapter-section"
          data-section={n + 3}
          data-title="Glossaire"
        >
          <h2>Glossaire</h2>
          <dl className="glossary">
            {c.glossary.map((g) => (
              <div key={g.term}>
                <dt>{g.term}</dt>
                <dd>{g.definition}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
      <details className="sources">
        <summary>Sources et références</summary>
        {course.sources.map((s) => (
          <a key={s.url} href={s.url} target="_blank" rel="noreferrer">
            {s.title} ↗
          </a>
        ))}
      </details>
      <footer className="chapter-end" data-end="1">
        <p>
          Lire n’est pas encore savoir : passe à la pratique pour vérifier ce
          que tu as compris.
        </p>
        <div>
          <button className="button primary" onClick={onPractice}>
            Mettre en pratique <ArrowRight size={17} />
          </button>
          {onNext && (
            <button className="button secondary" onClick={onNext}>
              Chapitre suivant <ArrowRight size={17} />
            </button>
          )}
        </div>
      </footer>
      <button className="practice-fab" onClick={onPractice}>
        <Target size={17} /> Mettre en pratique
      </button>
    </div>
  );
}
