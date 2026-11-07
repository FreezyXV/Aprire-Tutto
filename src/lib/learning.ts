import { stateSchema } from "./validation";
import type {
  AppState,
  Completion,
  Minutes,
  Review,
  SessionDraft,
} from "./types";
export const STORAGE_KEY = "aprire-tutto:v1";
export const allowedMinutes = [5, 10, 20, 30] as const;
export const dayKey = (date = new Date()) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
export function initialState(): AppState {
  return {
    version: 1,
    minutes: 20,
    minutesDate: dayKey(),
    completions: [],
    reviews: [],
    courses: [],
    session: null,
    exams: [],
    goal: "Comprendre le métier et me préparer à une première mission.",
    updatedAt: new Date().toISOString(),
  };
}
export function stages(minutes: Minutes): string[] {
  return [
    "recall",
    "learn",
    "check",
    ...(minutes >= 10 ? ["mission"] : []),
    ...(minutes >= 20 ? ["transfer"] : []),
    ...(minutes >= 30 ? ["reflection"] : []),
    "summary",
  ];
}
export function completeSession(
  state: AppState,
  completion: Completion,
  cards: Review[],
): AppState {
  if (state.completions.some((c) => c.sessionId === completion.sessionId))
    return { ...state, session: null };
  return {
    ...state,
    session: null,
    completions: [...state.completions, completion],
    reviews: [
      ...state.reviews,
      ...cards.filter((card) => !state.reviews.some((r) => r.id === card.id)),
    ],
    updatedAt: new Date().toISOString(),
  };
}
export function scheduleReview(
  review: Review,
  grade: "again" | "hard" | "good" | "easy",
  now = new Date(),
): Review {
  const interval =
    grade === "again"
      ? 0
      : grade === "hard"
        ? 1
        : grade === "good"
          ? Math.min(60, Math.max(3, review.interval * 2))
          : Math.min(90, Math.max(7, review.interval * 3));
  const delay = grade === "again" ? 10 * 60 * 1000 : interval * 86400000;
  return {
    ...review,
    interval,
    due: new Date(now.getTime() + delay).toISOString(),
    repetitions: review.repetitions + 1,
  };
}
export function safeReadState(raw: string | null): AppState | null {
  if (!raw) return null;
  try {
    const parsed = stateSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
export function scoreSession(
  draft: SessionDraft,
  answers: Record<string, number>,
) {
  const keys = ["check", ...(draft.minutes >= 20 ? ["transfer"] : [])];
  return {
    correct: keys.filter((k) => draft.answers[k] === answers[k]).length,
    total: keys.length,
  };
}
export function completedLessonIds(state: AppState, courseId: string) {
  return new Set(
    state.completions
      .filter((c) => c.courseId === courseId)
      .map((c) => c.lessonId),
  );
}
