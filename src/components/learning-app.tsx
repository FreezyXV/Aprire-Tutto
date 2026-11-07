"use client";
import { useEffect, useState } from "react";
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Cloud,
  Compass,
  GraduationCap,
  Layers3,
  Lightbulb,
  LoaderCircle,
  LockKeyhole,
  LogIn,
  LogOut,
  MessageCircle,
  Plus,
  RotateCcw,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Sprout,
  Sun,
  Target,
  TrendingUp,
  X,
} from "lucide-react";
import { baCourse } from "@/data/ba";
import {
  allowedMinutes,
  completedLessonIds,
  completeSession,
  dayKey,
  scheduleReview,
  scoreSession,
} from "@/lib/learning";
import { authHeaders, getSupabase } from "@/lib/client";
import type { Course, Lesson, Minutes, SessionDraft, View } from "@/lib/types";
import { Brand, CourseArt, Empty, Modal, Pill, Ring } from "./ui";
import { SessionOutline } from "./session-outline";
import { Choice, LearningSession } from "./session";
import { useLearning } from "./use-learning";
const nav = [
  { id: "today", label: "Aujourd’hui", icon: Sun },
  { id: "subjects", label: "Mes sujets", icon: Layers3 },
  { id: "reviews", label: "Révisions", icon: RotateCcw },
  { id: "progress", label: "Ma progression", icon: TrendingUp },
] as const;
const durationLabels: Record<Minutes, string> = {
  5: "Un petit pas",
  10: "L’essentiel",
  20: "Le bon équilibre",
  30: "En profondeur",
};
export default function LearningApp() {
  const {
    state,
    update,
    ready,
    storageError,
    cloud,
    email,
    syncError,
    loadCloud,
    conflict,
    resolveConflict,
  } = useLearning();
  const [view, setView] = useState<View>("today"),
    [courseId, setCourseId] = useState(baCourse.id),
    [inSession, setInSession] = useState(false);
  const [newTopic, setNewTopic] = useState<string | null>(null),
    [tutor, setTutor] = useState(false),
    [toast, setToast] = useState(""),
    [exam, setExam] = useState(false),
    [reviewId, setReviewId] = useState<string | null>(null),
    [showBack, setShowBack] = useState(false);
  const [search, setSearch] = useState(""),
    [loginEmail, setLoginEmail] = useState(""),
    [password, setPassword] = useState(""),
    [loginBusy, setLoginBusy] = useState(false),
    [loginError, setLoginError] = useState(""),
    [register, setRegister] = useState(false),
    [loginNotice, setLoginNotice] = useState("");
  const courses = [baCourse, ...state.courses];
  const course = courses.find((c) => c.id === courseId) ?? baCourse;
  const done = completedLessonIds(state, course.id);
  const nextLesson =
    course.lessons.find((l) => !done.has(l.id)) ?? course.lessons[0];
  const sessionCourse = state.session
    ? courses.find((c) => c.id === state.session?.courseId)
    : undefined;
  const sessionLesson = sessionCourse?.lessons.find(
    (l) => l.id === state.session?.lessonId,
  );
  const due = state.reviews.filter((r) => Date.parse(r.due) <= Date.now());
  const activeReview = state.reviews.find((r) => r.id === reviewId);
  const minutes = state.minutesDate === dayKey() ? state.minutes : 20;
  const totalDone = new Set(state.completions.map((c) => c.lessonId)).size;
  const explorationDays = new Set(
    state.completions.map((c) => dayKey(new Date(c.at))),
  ).size;
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(t);
  }, [toast]);
  function navigate(v: View) {
    setView(v);
    window.scrollTo({ top: 0 });
  }
  function start(lesson = nextLesson, selectedCourse = course) {
    if (state.session && state.session.lessonId === lesson.id) {
      setInSession(true);
      return;
    }
    if (state.session) {
      setToast(
        "Une séance est en cours. Reprends-la ou termine-la avant d’en commencer une autre.",
      );
      setInSession(true);
      return;
    }
    const draft: SessionDraft = {
      id: crypto.randomUUID(),
      courseId: selectedCourse.id,
      lessonId: lesson.id,
      minutes,
      step: 0,
      answers: {},
      revealed: [],
      writing: [],
      rubric: [],
      reflection: "",
      startedAt: new Date().toISOString(),
    };
    update((s) => ({ ...s, session: draft }));
    setInSession(true);
    window.scrollTo({ top: 0 });
  }
  function finish() {
    if (!state.session || !sessionLesson) return;
    const d = state.session;
    const score = scoreSession(d, {
      check: sessionLesson.check.answer,
      transfer: sessionLesson.transfer.answer,
    });
    update((s) =>
      completeSession(
        s,
        {
          sessionId: d.id,
          lessonId: d.lessonId,
          courseId: d.courseId,
          at: new Date().toISOString(),
          minutes: d.minutes,
          ...score,
          writing: d.writing,
          rubric: d.rubric,
          reflection: d.reflection,
        },
        sessionLesson.cards.map((c, i) => ({
          id: `${d.lessonId}-${i}`,
          courseId: d.courseId,
          lessonId: d.lessonId,
          ...c,
          due: new Date(Date.now() + 86400000).toISOString(),
          interval: 1,
          repetitions: 0,
        })),
      ),
    );
    setInSession(false);
    navigate("today");
    setToast("Séance enregistrée. Ta première révision est prévue demain.");
  }
  function exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aprire-tutto-${dayKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToast("Ta copie de progression a été exportée.");
  }
  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoginNotice("");
    const sb = getSupabase();
    if (!sb) {
      setLoginError(
        "Le cloud reste à configurer. Ta progression est conservée sur cet appareil.",
      );
      return;
    }
    setLoginBusy(true);
    try {
      if (register) {
        const r = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: loginEmail, password }),
        });
        const b = await r.json();
        if (!r.ok) throw new Error(b.error);
        setLoginNotice(b.message);
        setRegister(false);
        setPassword("");
      } else {
        const { error } = await sb.auth.signInWithPassword({
          email: loginEmail,
          password,
        });
        if (error)
          throw new Error(
            "Connexion impossible. Vérifie tes identifiants et la confirmation de ton adresse e-mail.",
          );
        setPassword("");
        void loadCloud();
      }
    } catch (e) {
      setLoginError(
        e instanceof Error
          ? e.message
          : "Connexion momentanément indisponible.",
      );
    } finally {
      setLoginBusy(false);
    }
  }

  const openCourse = (c: Course) => {
    setCourseId(c.id);
    navigate("course");
  };
  if (!ready)
    return (
      <div className="boot">
        <Brand />
        <p>Un nouvel horizon t’attend.</p>
      </div>
    );
  return (
    <>
      <a className="skip-link" href="#main-content">
        Aller au contenu
      </a>
      {inSession && state.session && sessionCourse && sessionLesson ? (
        <LearningSession
          course={sessionCourse}
          lesson={sessionLesson}
          draft={state.session}
          update={(d) => update((s) => ({ ...s, session: d }))}
          pause={() => setInSession(false)}
          finish={finish}
          tutor={() => setTutor(true)}
        />
      ) : (
        <div className="app-shell">
          <aside className="sidebar">
            <button
              className="brand-button"
              onClick={() => navigate("today")}
              aria-label="Aprire Tutto, accueil"
            >
              <Brand />
            </button>
            <div className="workspace-label">Mon carnet</div>
            <nav aria-label="Navigation principale">
              {nav.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  className={`nav-item ${view === id || (view === "course" && id === "subjects") ? "active" : ""}`}
                  aria-current={view === id ? "page" : undefined}
                  onClick={() => navigate(id)}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                  {id === "reviews" && due.length > 0 && (
                    <span className="nav-count">{due.length}</span>
                  )}
                </button>
              ))}
            </nav>
            <div className="sidebar-bottom">
              <div className="sidebar-note">
                <BookOpen size={20} />
                <p>
                  Comprendre.
                  <br />
                  Pratiquer. Retenir.
                </p>
              </div>
              <button
                className={`nav-item ${view === "settings" ? "active" : ""}`}
                onClick={() => navigate("settings")}
              >
                <Settings2 size={19} />
                <span>Réglages</span>
              </button>
              <div className="profile">
                <div className="avatar">
                  a<span>✳</span>
                </div>
                <div>
                  <strong>Mon espace personnel</strong>
                  <button
                    onClick={() => navigate("settings")}
                    className="sync-label"
                  >
                    {cloud === "connected" ? (
                      <Cloud size={12} />
                    ) : (
                      <span className="status-dot" />
                    )}
                    {cloud === "connected"
                      ? "Synchronisé"
                      : cloud === "syncing"
                        ? "Synchronisation…"
                        : cloud === "error"
                          ? "Synchronisation à vérifier"
                          : "Sur cet appareil"}
                  </button>
                </div>
              </div>
            </div>
          </aside>
          <div className="main-shell">
            <header className="topbar">
              <span className="breadcrumb">
                Mon espace <ChevronRight size={13} />{" "}
                {view === "today"
                  ? "Aujourd’hui"
                  : view === "course"
                    ? course.title
                    : view === "settings"
                      ? "Réglages"
                      : nav.find((n) => n.id === view)?.label}
              </span>
              <button
                className="mobile-brand brand-button"
                onClick={() => navigate("today")}
              >
                <Brand compact />
                <span>aprire tutto.</span>
              </button>
              <div className="topbar-right">
                <span className="private-label">
                  <LockKeyhole size={13} /> Juste pour toi
                </span>
                <button
                  className="top-avatar"
                  onClick={() => navigate("settings")}
                  aria-label="Mon compte"
                >
                  a.
                </button>
              </div>
            </header>
            <main id="main-content" className="main-content">
              {storageError && (
                <div className="notice" role="alert">
                  {storageError}
                </div>
              )}
              {view === "today" && (
                <>
                  <div className="page-heading">
                    <div>
                      <div
                        className="eyebrow notebook-date"
                        suppressHydrationWarning
                      >
                        {new Date().toLocaleDateString("fr-FR", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}
                      </div>
                      <h1>
                        Une page <em>à la fois.</em>
                      </h1>
                      <p>Un moment pour apprendre, quelque chose à retenir.</p>
                    </div>
                    <button
                      className="button secondary new-subject-top"
                      onClick={() => setNewTopic("")}
                    >
                      <Plus size={17} />
                      Nouveau sujet
                    </button>
                  </div>
                  <section
                    className="time-panel"
                    aria-label="Durée de la séance"
                  >
                    <div>
                      <h2>Combien de temps as-tu aujourd’hui ?</h2>
                      <p>Ton parcours s’adapte. Pas l’inverse.</p>
                    </div>
                    <div
                      className="duration-picker"
                      role="group"
                      aria-label="Temps disponible"
                    >
                      {allowedMinutes.map((m) => (
                        <button
                          key={m}
                          aria-pressed={minutes === m}
                          className={minutes === m ? "selected" : ""}
                          onClick={() =>
                            update((s) => ({
                              ...s,
                              minutes: m,
                              minutesDate: dayKey(),
                            }))
                          }
                        >
                          {m}
                          <span>min</span>
                          {minutes === m && <span className="duration-dot" />}
                        </button>
                      ))}
                    </div>
                  </section>
                  <div className="home-grid">
                    <section className="focus-card">
                      <div className="focus-content">
                        <div className="focus-label">
                          <span className="live-dot" />{" "}
                          {state.session
                            ? "Ta séance t’attend"
                            : "Le petit pas du jour"}
                        </div>
                        <Pill className="course-pill">
                          {state.session ? sessionCourse?.title : course.title}{" "}
                          <span>·</span> Parcours guidé
                        </Pill>
                        <h2>
                          {state.session && sessionLesson
                            ? sessionLesson.title
                            : nextLesson.title}
                        </h2>
                        <p>
                          {state.session
                            ? "Reprends exactement là où tu t’es arrêté. Ton travail est conservé."
                            : nextLesson.subtitle}
                        </p>
                        <div className="lesson-tags">
                          <span>
                            <Clock3 size={15} />
                            {state.session?.minutes ?? minutes} min
                          </span>
                          <span>
                            <Target size={15} />
                            {(state.session?.minutes ?? minutes) >= 10
                              ? "Une mise en pratique"
                              : "Un exercice ciblé"}
                          </span>
                        </div>
                        <button
                          className="button dark start-button"
                          onClick={() =>
                            state.session ? setInSession(true) : start()
                          }
                        >
                          {state.session
                            ? "Reprendre ma séance"
                            : "Commencer ma séance"}
                          <ArrowRight size={18} />
                        </button>
                        <div className="focus-footnote">
                          {durationLabels[minutes]} · aucune course à la
                          performance
                        </div>
                      </div>
                      <SessionOutline
                        minutes={state.session?.minutes ?? minutes}
                      />
                    </section>
                    <section className="rhythm-card">
                      <div className="card-topline">
                        <span className="eyebrow">À TON RYTHME</span>
                        <Sprout size={21} />
                      </div>
                      <h2>
                        Chaque petit pas
                        <br />
                        compte.
                      </h2>
                      <p>
                        {state.completions.length
                          ? "Tu construis tes connaissances, une séance après l’autre."
                          : "Tout commence par une première séance. Même cinq minutes."}
                      </p>
                      <div
                        className="week-row"
                        aria-label="Activité des sept derniers jours"
                      >
                        {Array.from({ length: 7 }, (_, i) => {
                          const d = new Date();
                          d.setDate(d.getDate() - 6 + i);
                          const key = dayKey(d);
                          const active = state.completions.some(
                            (c) => dayKey(new Date(c.at)) === key,
                          );
                          return (
                            <div key={key}>
                              <span>
                                {new Intl.DateTimeFormat("fr-FR", {
                                  weekday: "narrow",
                                }).format(d)}
                              </span>
                              <span
                                className={`day ${active ? "done" : ""} ${i === 6 ? "today" : ""}`}
                              >
                                {active ? (
                                  <Check size={14} />
                                ) : i === 6 ? (
                                  <span />
                                ) : null}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="rhythm-footer">
                        <strong>{explorationDays}</strong>
                        <span>
                          {explorationDays > 1 ? "jours" : "jour"} d’exploration
                          <br />
                          <small>Chaque retour compte aussi.</small>
                        </span>
                      </div>
                    </section>
                  </div>
                  <div className="section-heading">
                    <div>
                      <span className="eyebrow">À explorer</span>
                      <h2>Tes parcours.</h2>
                    </div>
                    <button
                      className="text-button"
                      onClick={() => navigate("subjects")}
                    >
                      Voir mes sujets <ArrowUpRight size={17} />
                    </button>
                  </div>
                  <div className="subjects-grid">
                    {courses.slice(0, 2).map((c) => (
                      <CourseCard
                        key={c.id}
                        course={c}
                        count={completedLessonIds(state, c.id).size}
                        open={() => openCourse(c)}
                      />
                    ))}
                    <button
                      className="add-topic-card"
                      onClick={() => setNewTopic("")}
                    >
                      <span className="add-topic-icon">
                        <Plus size={24} />
                      </span>
                      <strong>
                        Et si tu explorais <br />
                        autre chose ?
                      </strong>
                      <span>Une idée suffit pour commencer.</span>
                      <span className="text-button">
                        Choisir un sujet <ArrowUpRight size={16} />
                      </span>
                    </button>
                  </div>
                  <section className="review-banner">
                    <div className="review-banner-icon">
                      <RotateCcw size={25} />
                    </div>
                    <div>
                      <h3>
                        {due.length
                          ? `${due.length} cartes prêtes à être revisitées.`
                          : "Apprendre, c’est aussi revenir."}
                      </h3>
                      <p>
                        {due.length
                          ? "Quelques minutes pour ancrer ce que tu as appris."
                          : state.reviews.length
                            ? "Tes prochaines révisions arriveront au bon moment."
                            : "Tes premières cartes apparaîtront après ta séance."}
                      </p>
                    </div>
                    <button
                      className="text-button"
                      onClick={() => navigate("reviews")}
                    >
                      {due.length ? "Réviser maintenant" : "Mes révisions"}
                      <ArrowRight size={18} />
                    </button>
                  </section>
                  <div className="home-footer">
                    <span>
                      Comprendre <i /> pratiquer <i /> retenir
                    </span>
                    <span>Le plaisir d’apprendre, tout simplement.</span>
                  </div>
                </>
              )}
              {view === "subjects" && (
                <>
                  <PageTitle
                    eyebrow="Une curiosité, mille possibilités"
                    title={
                      <>
                        Mes <em>sujets.</em>
                      </>
                    }
                    description="Des parcours qui partent de ce que tu veux vraiment apprendre."
                    action={
                      <button
                        className="button primary"
                        onClick={() => setNewTopic("")}
                      >
                        <Plus size={18} />
                        Nouveau sujet
                      </button>
                    }
                  />
                  <label className="search-field">
                    <Search size={19} />
                    <input
                      placeholder="Retrouver un sujet…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      aria-label="Rechercher mes sujets"
                    />
                  </label>
                  <div className="subjects-grid subject-library">
                    {courses
                      .filter((c) =>
                        c.title
                          .toLocaleLowerCase("fr")
                          .includes(search.toLocaleLowerCase("fr")),
                      )
                      .map((c) => (
                        <CourseCard
                          key={c.id}
                          course={c}
                          count={completedLessonIds(state, c.id).size}
                          open={() => openCourse(c)}
                        />
                      ))}
                    {search &&
                      !courses.some((c) =>
                        c.title.toLowerCase().includes(search.toLowerCase()),
                      ) && (
                        <Empty title="Un nouveau terrain à explorer ?">
                          Aucun de tes sujets ne correspond à cette recherche.
                        </Empty>
                      )}
                  </div>
                  <section className="discovery">
                    <span className="eyebrow">SUIVRE UN ÉLAN DE CURIOSITÉ</span>
                    <h2>Qu’aimerais-tu comprendre ?</h2>
                    <div className="suggestion-chips">
                      {[
                        "Parler italien",
                        "Comprendre les API",
                        "L’histoire de l’art",
                        "Mieux communiquer",
                      ].map((t) => (
                        <button onClick={() => setNewTopic(t)} key={t}>
                          {t}
                          <ArrowUpRight size={15} />
                        </button>
                      ))}
                    </div>
                  </section>
                </>
              )}
              {view === "course" && (
                <>
                  <button
                    className="text-button back-link"
                    onClick={() => navigate("subjects")}
                  >
                    <ArrowLeft size={16} />
                    Mes sujets
                  </button>
                  <div className="course-hero">
                    <div>
                      <Pill>
                        <Compass size={13} /> Parcours guidé ·{" "}
                        {course.lessons.length} étapes
                      </Pill>
                      <h1>
                        {course.title}
                        <span className="title-period">.</span>
                      </h1>
                      <p>{course.description}</p>
                      <div className="course-progress">
                        <div className="progress-track">
                          <div
                            style={{
                              width: `${(done.size / course.lessons.length) * 100}%`,
                            }}
                          />
                        </div>
                        <span>
                          {done.size} / {course.lessons.length} étapes explorées
                        </span>
                      </div>
                      <button
                        className="button primary"
                        onClick={() => start()}
                      >
                        {done.size
                          ? "Continuer mon parcours"
                          : "Commencer le parcours"}
                        <ArrowRight size={18} />
                      </button>
                    </div>
                    <CourseArt small />
                  </div>
                  <div className="section-heading">
                    <div>
                      <span className="eyebrow">LE SOCLE ESSENTIEL</span>
                      <h2>Construis tes réflexes.</h2>
                    </div>
                    <span className="muted small-text">
                      Explore dans l’ordre ou suis ta curiosité.
                    </span>
                  </div>
                  <div className="lesson-list">
                    {course.lessons.map((lesson, i) => (
                      <button
                        className={`lesson-row ${done.has(lesson.id) ? "completed" : ""} ${lesson.id === nextLesson.id ? "next" : ""}`}
                        key={lesson.id}
                        onClick={() => start(lesson)}
                      >
                        <span className="lesson-number">
                          {done.has(lesson.id) ? (
                            <Check size={18} />
                          ) : (
                            String(i + 1).padStart(2, "0")
                          )}
                        </span>
                        <div>
                          <span className="lesson-skill">{lesson.skill}</span>
                          <h3>{lesson.title}</h3>
                          <p>{lesson.subtitle}</p>
                        </div>
                        {done.has(lesson.id) ? (
                          <Pill>Exploré</Pill>
                        ) : lesson.id === nextLesson.id ? (
                          <Pill className="next-pill">Prochaine étape</Pill>
                        ) : null}
                        <ArrowUpRight size={20} />
                      </button>
                    ))}
                  </div>
                  <section className="exam-banner">
                    <GraduationCap size={32} />
                    <div>
                      <h3>Fais le point sur tes acquis.</h3>
                      <p>
                        {course.lessons.length} situations inédites pour
                        identifier ce qui est clair et ce qui mérite une
                        révision.
                      </p>
                    </div>
                    <button
                      className="button secondary"
                      onClick={() => setExam(true)}
                    >
                      Tester mes acquis
                      <ArrowRight size={17} />
                    </button>
                  </section>
                  <details className="sources course-sources">
                    <summary>Les références de ce parcours</summary>
                    {course.sources.map((s) => (
                      <a
                        key={s.url}
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {s.title} ↗
                      </a>
                    ))}
                    <p>
                      {course.generatedAt
                        ? `Parcours créé avec l’IA le ${new Date(course.generatedAt).toLocaleDateString("fr-FR")}. Les liens proviennent de la recherche effectuée à cette date. Consulte les références pour vérifier les points sensibles ou évolutifs.`
                        : "Le référentiel BA fourni complète le cadrage. Ce parcours constitue un premier socle, à enrichir par des spécialisations."}
                    </p>
                  </details>
                </>
              )}
              {view === "reviews" && (
                <>
                  <PageTitle
                    eyebrow="Ce qui reste, c’est ce qui revient"
                    title={
                      <>
                        Ancre tes <em>connaissances.</em>
                      </>
                    }
                    description="Retrouve la réponse avant de retourner la carte. Puis évalue ton rappel avec honnêteté."
                  />
                  <div className="review-stats">
                    <div>
                      <strong>{due.length}</strong>
                      <span>à revoir maintenant</span>
                    </div>
                    <div>
                      <strong>{state.reviews.length}</strong>
                      <span>cartes dans ta bibliothèque</span>
                    </div>
                    <div>
                      <strong>
                        {state.reviews.reduce((n, r) => n + r.repetitions, 0)}
                      </strong>
                      <span>rappels effectués</span>
                    </div>
                  </div>
                  {activeReview ? (
                    <div className="review-workspace">
                      <button
                        className="text-button"
                        onClick={() => {
                          setReviewId(null);
                          setShowBack(false);
                        }}
                      >
                        <ArrowLeft size={16} />
                        Ma bibliothèque
                      </button>
                      <div className="flashcard">
                        <span className="eyebrow">
                          {showBack ? "La réponse" : "Essaie de te souvenir"}
                        </span>
                        <h2>{activeReview.front}</h2>
                        {showBack ? (
                          <p>{activeReview.back}</p>
                        ) : (
                          <button
                            className="button secondary"
                            onClick={() => setShowBack(true)}
                          >
                            Retourner la carte
                            <RotateCcw size={17} />
                          </button>
                        )}
                      </div>
                      {showBack && (
                        <div className="review-rating">
                          <p>Comment était ton rappel, avant de lire ?</p>
                          <div>
                            {(
                              [
                                {
                                  id: "again",
                                  title: "À revoir",
                                  sub: "Dans 10 min",
                                },
                                {
                                  id: "hard",
                                  title: "Hésitant",
                                  sub: "Demain",
                                },
                                {
                                  id: "good",
                                  title: "Bien retrouvé",
                                  sub: `Dans ${Math.min(60, Math.max(3, activeReview.interval * 2))} jours`,
                                },
                                {
                                  id: "easy",
                                  title: "Très facilement",
                                  sub: `Dans ${Math.min(90, Math.max(7, activeReview.interval * 3))} jours`,
                                },
                              ] as const
                            ).map((g) => (
                              <button
                                key={g.id}
                                onClick={() => {
                                  update((s) => ({
                                    ...s,
                                    reviews: s.reviews.map((r) =>
                                      r.id === activeReview.id
                                        ? scheduleReview(r, g.id)
                                        : r,
                                    ),
                                  }));
                                  const next = due.find(
                                    (r) => r.id !== activeReview.id,
                                  );
                                  setReviewId(next?.id ?? null);
                                  setShowBack(false);
                                  if (!next)
                                    setToast(
                                      "Révision enregistrée. Tu peux souffler.",
                                    );
                                }}
                              >
                                <strong>{g.title}</strong>
                                <span>{g.sub}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {due.length > 0 ? (
                        <button
                          className="button primary"
                          onClick={() => setReviewId(due[0].id)}
                        >
                          Commencer mes révisions
                          <ArrowRight size={18} />
                        </button>
                      ) : (
                        <Empty
                          title={
                            state.reviews.length
                              ? "Tu es à jour."
                              : "Tes connaissances vont prendre racine."
                          }
                          action={
                            !state.reviews.length ? (
                              <button
                                className="button primary"
                                onClick={() => start()}
                              >
                                Faire ma première séance
                                <ArrowRight size={17} />
                              </button>
                            ) : undefined
                          }
                        >
                          {state.reviews.length
                            ? "Laisse un peu de temps à ta mémoire. Tes prochaines cartes t’attendront ici."
                            : "Après une séance, les notions essentielles deviennent des cartes à revoir au fil du temps."}
                        </Empty>
                      )}
                      {state.reviews.length > 0 && (
                        <div className="review-list">
                          {state.reviews.map((r) => (
                            <button
                              key={r.id}
                              onClick={() => {
                                setReviewId(r.id);
                                setShowBack(false);
                              }}
                            >
                              <span>
                                <RotateCcw size={17} />
                                {r.front}
                              </span>
                              <small>
                                {Date.parse(r.due) <= Date.now()
                                  ? "À revoir"
                                  : `Le ${new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: "Europe/Paris" }).format(new Date(r.due))}`}
                              </small>
                              <ChevronRight size={16} />
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
              {view === "progress" && (
                <>
                  <PageTitle
                    eyebrow="Le chemin que tu construis"
                    title={
                      <>
                        Ta progression, <em>à toi.</em>
                      </>
                    }
                    description="Ce que tu as exploré, pratiqué et retrouvé de mémoire. Sans comparaison avec les autres."
                  />
                  <div className="progress-cards">
                    <Stat
                      icon={<BookOpen size={22} />}
                      value={totalDone}
                      label="étapes explorées"
                    />
                    <Stat
                      icon={<Target size={22} />}
                      value={
                        state.completions.filter((c) =>
                          c.writing.some((w) => w.trim()),
                        ).length
                      }
                      label="missions travaillées"
                    />
                    <Stat
                      icon={<RotateCcw size={22} />}
                      value={state.reviews.reduce(
                        (n, r) => n + r.repetitions,
                        0,
                      )}
                      label="rappels en mémoire"
                    />
                  </div>
                  <div className="section-heading">
                    <h2>Les compétences en construction.</h2>
                  </div>
                  <div className="skills-grid">
                    {baCourse.lessons.map((l) => {
                      const attempts = state.completions.filter(
                        (c) => c.lessonId === l.id,
                      );
                      const reviews = state.reviews.filter(
                        (r) => r.lessonId === l.id && r.repetitions > 0,
                      );
                      return (
                        <div key={l.id} className="skill-row">
                          <span
                            className={
                              attempts.length
                                ? "skill-icon active"
                                : "skill-icon"
                            }
                          >
                            {attempts.length ? (
                              <Check size={17} />
                            ) : (
                              <Sprout size={17} />
                            )}
                          </span>
                          <div>
                            <strong>{l.skill}</strong>
                            <span>
                              {reviews.length
                                ? "Revu de mémoire"
                                : attempts.length
                                  ? "Exploré · à consolider"
                                  : "À découvrir"}
                            </span>
                          </div>
                          <button
                            className="icon-button"
                            aria-label={`Travailler : ${l.skill}`}
                            onClick={() => start(l, baCourse)}
                          >
                            <ArrowUpRight size={18} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <p className="progress-disclaimer">
                    Une étape terminée ne signifie pas encore une compétence
                    maîtrisée. Les missions et les rappels dans le temps
                    apportent des indices complémentaires.
                  </p>
                  <div className="section-heading">
                    <h2>Ton carnet de pratique.</h2>
                  </div>
                  {state.completions.length ? (
                    <div className="practice-list">
                      {state.completions
                        .slice()
                        .reverse()
                        .map((c) => {
                          const l = courses
                            .flatMap((x) => x.lessons)
                            .find((l) => l.id === c.lessonId);
                          return (
                            <details key={c.sessionId}>
                              <summary>
                                <span>
                                  <span className="practice-date">
                                    {new Intl.DateTimeFormat("fr-FR", {
                                      day: "numeric",
                                      month: "long",
                                    }).format(new Date(c.at))}{" "}
                                    · format {c.minutes} min
                                  </span>
                                  <strong>{l?.title ?? "Séance"}</strong>
                                </span>
                                <span className="practice-score">
                                  {c.correct}/{c.total}{" "}
                                  <ChevronRight size={17} />
                                </span>
                              </summary>
                              <div className="practice-details">
                                {c.writing.filter(Boolean).map((w, i) => (
                                  <p key={i}>{w}</p>
                                ))}
                                {c.reflection && <p>{c.reflection}</p>}
                                {!c.writing.some(Boolean) && !c.reflection && (
                                  <p>
                                    Séance de découverte et questions
                                    d’application.
                                  </p>
                                )}
                              </div>
                            </details>
                          );
                        })}
                    </div>
                  ) : (
                    <Empty title="La première page est à écrire.">
                      Tes séances et tes productions seront conservées ici.
                    </Empty>
                  )}
                  {state.exams.length > 0 && (
                    <div className="exam-history">
                      <h2>Bilans de connaissances</h2>
                      {state.exams.map((e, i) => (
                        <p key={`${e.at}-${i}`}>
                          {courses.find((c) => c.id === e.courseId)?.title} ·{" "}
                          {e.correct}/{e.total} ·{" "}
                          {new Date(e.at).toLocaleDateString("fr-FR")}
                        </p>
                      ))}
                    </div>
                  )}
                </>
              )}
              {view === "settings" && (
                <>
                  <PageTitle
                    eyebrow="Un espace qui te ressemble"
                    title={
                      <>
                        Tes <em>réglages.</em>
                      </>
                    }
                    description="Ton objectif, tes données et les services de ton espace personnel."
                  />
                  <div className="settings-grid">
                    <section className="settings-card">
                      <div className="settings-icon">
                        <Target size={22} />
                      </div>
                      <h2>Ton cap</h2>
                      <label className="field-label" htmlFor="goal">
                        Ce que tu veux rendre possible
                      </label>
                      <textarea
                        id="goal"
                        rows={3}
                        value={state.goal}
                        onChange={(e) =>
                          update((s) => ({ ...s, goal: e.target.value }))
                        }
                        maxLength={2000}
                      />
                      <p className="muted small-text">
                        Un objectif concret aide à donner du sens à tes séances.
                      </p>
                    </section>
                    <section className="settings-card">
                      <div className="settings-icon">
                        <Cloud size={22} />
                      </div>
                      <h2>Retrouver ton espace partout</h2>
                      <p>
                        {email
                          ? `Connecté avec ${email}`
                          : "Ta progression est actuellement enregistrée dans ce navigateur. La connexion au cloud permettra de la retrouver sur iPhone et Mac."}
                      </p>
                      {email ? (
                        <>
                          <Pill>
                            {cloud === "connected"
                              ? "Progression synchronisée"
                              : cloud === "syncing"
                                ? "Synchronisation en cours"
                                : "À synchroniser"}
                          </Pill>
                          {syncError && (
                            <p className="form-error" role="alert">
                              {syncError}
                            </p>
                          )}
                          {conflict && (
                            <div className="conflict-choice">
                              <p>
                                Une copie de la version écartée sera gardée sur
                                cet appareil.
                              </p>
                              <button
                                className="button secondary"
                                onClick={() => resolveConflict("local")}
                              >
                                Conserver cet appareil
                              </button>
                              <button
                                className="button secondary"
                                onClick={() => resolveConflict("cloud")}
                              >
                                Utiliser la version cloud
                              </button>
                            </div>
                          )}
                          <div className="button-row">
                            <button
                              className="button secondary"
                              onClick={() => void loadCloud()}
                            >
                              Synchroniser
                            </button>
                            <button
                              className="text-button"
                              onClick={async () => {
                                await getSupabase()?.auth.signOut();
                                setToast(
                                  "Déconnecté. La copie locale reste disponible sur cet appareil.",
                                );
                              }}
                            >
                              <LogOut size={16} />
                              Déconnexion
                            </button>
                          </div>
                        </>
                      ) : (
                        <form onSubmit={login}>
                          <label className="field-label" htmlFor="login-email">
                            Adresse e-mail
                          </label>
                          <input
                            id="login-email"
                            type="email"
                            autoComplete="username"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            required
                            placeholder="toi@exemple.fr"
                          />
                          <label
                            className="field-label"
                            htmlFor="login-password"
                          >
                            Mot de passe
                          </label>
                          <input
                            id="login-password"
                            type="password"
                            autoComplete={
                              register ? "new-password" : "current-password"
                            }
                            minLength={register ? 12 : undefined}
                            maxLength={128}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          {loginNotice && (
                            <p className="form-success" role="status">
                              {loginNotice}
                            </p>
                          )}
                          {loginError && (
                            <p className="form-error" role="alert">
                              {loginError}
                            </p>
                          )}
                          <button
                            className="button primary"
                            disabled={loginBusy}
                          >
                            {loginBusy ? (
                              <LoaderCircle className="spin" size={16} />
                            ) : (
                              <LogIn size={16} />
                            )}
                            {register
                              ? "Créer mon compte personnel"
                              : "Se connecter"}
                          </button>
                          <button
                            type="button"
                            className="text-button auth-toggle"
                            onClick={() => {
                              setRegister(!register);
                              setLoginError("");
                            }}
                          >
                            {register
                              ? "J’ai déjà un compte"
                              : "Première visite ? Créer mon compte"}
                          </button>
                        </form>
                      )}
                    </section>
                    <section className="settings-card">
                      <div className="settings-icon">
                        <Sparkles size={22} />
                      </div>
                      <h2>Ton tuteur DeepSeek</h2>
                      <ServiceStatus />
                      <p>
                        Le tuteur pourra rechercher des sources, créer de
                        nouveaux parcours et commenter tes productions. Les
                        leçons déjà enregistrées restent disponibles sans appel
                        à l’IA.
                      </p>
                      <p className="muted small-text">
                        Enveloppe de sécurité : 1 $ par jour et 5 $ par mois.
                        Chaque demande réserve au maximum 0,15 $ pour un
                        parcours ou 0,08 $ pour le tuteur. Ce plafond prudent
                        peut être atteint avant le coût réellement facturé par
                        DeepSeek.
                      </p>
                    </section>
                    <section className="settings-card">
                      <div className="settings-icon">
                        <ShieldCheck size={22} />
                      </div>
                      <h2>Tes données restent les tiennes.</h2>
                      <p>
                        Exporte tes parcours, tes réponses et ta progression.
                        Cette copie est utile en complément de l’enregistrement
                        dans le cloud.
                      </p>
                      <button className="button secondary" onClick={exportData}>
                        <ArrowDownToLine size={17} />
                        Exporter ma progression
                      </button>
                      <div className="settings-divider" />
                      <h3>Sur ton iPhone</h3>
                      <p>
                        Dans Safari, ouvre le menu de partage, puis « Sur
                        l’écran d’accueil » pour retrouver Aprire Tutto comme
                        une application.
                      </p>
                    </section>
                  </div>
                </>
              )}
            </main>
          </div>
          <nav className="mobile-nav" aria-label="Navigation mobile">
            {nav.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                aria-current={view === id ? "page" : undefined}
                className={
                  view === id || (view === "course" && id === "subjects")
                    ? "active"
                    : ""
                }
                onClick={() => navigate(id)}
              >
                <Icon size={21} />
                <span>{label}</span>
                {id === "reviews" && due.length > 0 && <i />}
              </button>
            ))}
          </nav>
        </div>
      )}
      {newTopic !== null && (
        <NewTopic
          initial={newTopic}
          close={() => setNewTopic(null)}
          created={(c) => {
            update((s) => ({ ...s, courses: [...s.courses, c] }));
            setNewTopic(null);
            openCourse(c);
            setToast("Ton nouveau parcours est prêt.");
          }}
        />
      )}
      {tutor && (
        <Tutor
          lesson={sessionLesson ?? nextLesson}
          writing={state.session?.writing ?? []}
          close={() => setTutor(false)}
        />
      )}
      {exam && (
        <Exam
          course={course}
          close={() => setExam(false)}
          save={(correct, total) =>
            update((s) => ({
              ...s,
              exams: [
                ...s.exams,
                {
                  courseId: course.id,
                  correct,
                  total,
                  at: new Date().toISOString(),
                },
              ],
            }))
          }
        />
      )}
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={17} />
          {toast}
          <button
            onClick={() => setToast("")}
            aria-label="Fermer la notification"
          >
            <X size={15} />
          </button>
        </div>
      )}
    </>
  );
}
function PageTitle({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}
function CourseCard({
  course,
  count,
  open,
}: {
  course: Course;
  count: number;
  open: () => void;
}) {
  return (
    <button className="subject-card" onClick={open}>
      <div className={`subject-art ${course.color}`} aria-hidden="true">
        <BookOpen size={25} strokeWidth={1.4} />
      </div>
      <div className="subject-card-body">
        <span className="eyebrow">
          {course.lessons.length} ÉTAPES · PARCOURS GUIDÉ
        </span>
        <div className="subject-card-title">
          <h3>{course.title}</h3>
          <Ring value={(count / course.lessons.length) * 100} />
        </div>
        <p>{course.description}</p>
        <div className="subject-card-bottom">
          <span>
            {count
              ? `${count} étape${count > 1 ? "s" : ""} explorée${count > 1 ? "s" : ""}`
              : "À découvrir"}
          </span>
          <span>
            Explorer le parcours <ArrowRight size={15} />
          </span>
        </div>
      </div>
    </button>
  );
}
function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="stat-card">
      {icon}
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
function ServiceStatus() {
  const [status, setStatus] = useState<{ ai: boolean; cloud: boolean } | null>(
    null,
  );
  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setStatus({ ai: false, cloud: false }));
  }, []);
  return (
    <Pill>
      <span className={`status-dot ${status?.ai ? "connected" : ""}`} />
      {status === null
        ? "Vérification…"
        : status.ai
          ? "DeepSeek configuré · connexion personnelle requise"
          : "DeepSeek à connecter"}
    </Pill>
  );
}
function NewTopic({
  initial,
  close,
  created,
}: {
  initial: string;
  close: () => void;
  created: (c: Course) => void;
}) {
  const [topic, setTopic] = useState(initial),
    [goal, setGoal] = useState(""),
    [level, setLevel] = useState("Je découvre"),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
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
          action: "course",
          topic,
          goal,
          level,
          requestId: crypto.randomUUID(),
        }),
      });
      const data = await r.json();
      if (!r.ok)
        throw new Error(data.error ?? "Le parcours n’a pas pu être créé.");
      created(data.course);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal title="Qu’est-ce qui t’intrigue ?" close={busy ? () => {} : close}>
      <p className="modal-intro">
        Une idée, une envie, une compétence. Ton prochain parcours commence ici.
      </p>
      <form onSubmit={submit}>
        <label className="field-label" htmlFor="topic">
          Je veux apprendre…
        </label>
        <input
          id="topic"
          autoFocus
          required
          maxLength={140}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Ex. comprendre les API, parler italien…"
        />
        <label className="field-label" htmlFor="topic-goal">
          Pour pouvoir… <span>facultatif</span>
        </label>
        <textarea
          id="topic-goal"
          rows={2}
          maxLength={800}
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Ex. échanger avec les développeurs pendant mes missions BA"
        />
        <fieldset className="level-field">
          <legend>Ton point de départ</legend>
          <div>
            {["Je découvre", "J’ai quelques bases", "Je veux approfondir"].map(
              (l) => (
                <button
                  type="button"
                  aria-pressed={level === l}
                  key={l}
                  className={level === l ? "selected" : ""}
                  onClick={() => setLevel(l)}
                >
                  {l}
                </button>
              ),
            )}
          </div>
        </fieldset>
        <div className="generation-note">
          <Sparkles size={19} />
          <p>
            Un parcours progressif, des sources à explorer et des exercices pour
            passer à la pratique.
          </p>
        </div>
        {error && (
          <div className="form-error" role="alert">
            {error}
          </div>
        )}
        <button
          className="button primary full"
          disabled={busy || !topic.trim()}
        >
          {busy ? (
            <>
              <LoaderCircle className="spin" size={18} />
              Recherche et création en cours…
            </>
          ) : (
            <>
              Créer mon parcours
              <ArrowRight size={18} />
            </>
          )}
        </button>
        {busy && (
          <p className="muted small-text">
            Cela peut prendre jusqu’à trois minutes. Tu peux garder cette
            fenêtre ouverte.
          </p>
        )}
      </form>
    </Modal>
  );
}
function Tutor({
  lesson,
  writing,
  close,
}: {
  lesson: Lesson;
  writing: string[];
  close: () => void;
}) {
  const [message, setMessage] = useState(""),
    [answer, setAnswer] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function ask(e: React.FormEvent) {
    e.preventDefault();
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
          action: "tutor",
          question: message,
          context: {
            title: lesson.title,
            takeaway: lesson.takeaway,
            writing: writing.join("\n"),
            rubric: lesson.mission.rubric,
          },
          requestId: crypto.randomUUID(),
        }),
      });
      const b = await r.json();
      if (!r.ok) throw new Error(b.error);
      setAnswer(b.answer);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Le tuteur est indisponible.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal title="Un coup de pouce ?" close={close}>
      <div className="tutor-reference">
        <Lightbulb size={24} />
        <div>
          <span className="eyebrow">LE REPÈRE DU COURS</span>
          <p>{lesson.takeaway}</p>
        </div>
      </div>
      <p className="modal-intro">
        Demande un indice, un autre exemple ou un retour sur ton raisonnement.
      </p>
      {answer && (
        <div className="tutor-answer">
          <span className="eyebrow">RETOUR DU TUTEUR · IA</span>
          <p>{answer}</p>
          <small>
            Un retour à examiner, pas une certification de compétence.
          </small>
        </div>
      )}
      <form onSubmit={ask}>
        <label className="field-label" htmlFor="tutor-question">
          Ta question
        </label>
        <textarea
          id="tutor-question"
          rows={3}
          maxLength={2000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          placeholder="Comment rendre ma question plus précise ?"
        />
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button
          className="button primary full"
          disabled={busy || !message.trim()}
        >
          {busy ? (
            <LoaderCircle className="spin" size={17} />
          ) : (
            <MessageCircle size={17} />
          )}
          Demander au tuteur
        </button>
      </form>
    </Modal>
  );
}
function Exam({
  course,
  close,
  save,
}: {
  course: Course;
  close: () => void;
  save: (correct: number, total: number) => void;
}) {
  const [index, setIndex] = useState(0),
    [answers, setAnswers] = useState<Record<number, number>>({}),
    [done, setDone] = useState(false);
  const questions = course.lessons.map((l) => l.exam);
  const correct = questions.filter((q, i) => q.answer === answers[i]).length;
  const next = () => {
    if (index < questions.length - 1) setIndex(index + 1);
    else {
      save(correct, questions.length);
      setDone(true);
    }
  };
  return (
    <Modal
      title={
        done ? "Ton bilan de connaissances" : "Fais le point sur tes acquis"
      }
      close={close}
      wide
    >
      {done ? (
        <>
          <div className="exam-result">
            <GraduationCap size={40} />
            <strong>
              {correct}
              <span> / {questions.length}</span>
            </strong>
            <h3>
              {correct === questions.length
                ? "Les notions sont claires."
                : "Voici les pistes à consolider."}
            </h3>
            <p>
              Ce résultat mesure tes réponses aujourd’hui. La mise en pratique
              et les rappels ultérieurs complètent ce bilan.
            </p>
          </div>
          <div className="exam-corrections">
            {questions.map((q, i) => (
              <details key={i}>
                <summary>
                  <span
                    className={
                      answers[i] === q.answer ? "correct-mark" : "review-mark"
                    }
                  >
                    {answers[i] === q.answer ? (
                      <Check size={16} />
                    ) : (
                      <RotateCcw size={16} />
                    )}
                  </span>
                  {q.prompt}
                </summary>
                <p>
                  <strong>{q.options[q.answer]}</strong>
                  <br />
                  {q.explanation}
                </p>
              </details>
            ))}
          </div>
          <button className="button primary full" onClick={close}>
            Retour à mon parcours
            <ArrowRight size={17} />
          </button>
        </>
      ) : (
        <>
          <div className="exam-meta">
            <span>
              Situation {index + 1} / {questions.length}
            </span>
            <span>Sans chronomètre</span>
          </div>
          <div className="progress-track">
            <div
              style={{ width: `${((index + 1) / questions.length) * 100}%` }}
            />
          </div>
          <Choice
            name="exam"
            question={questions[index]}
            selected={answers[index]}
            revealed={false}
            onSelect={(n) => setAnswers({ ...answers, [index]: n })}
          />
          <button
            className="button primary full"
            disabled={answers[index] === undefined}
            onClick={next}
          >
            {index === questions.length - 1
              ? "Découvrir mon bilan"
              : "Situation suivante"}
            <ArrowRight size={17} />
          </button>
        </>
      )}
    </Modal>
  );
}
