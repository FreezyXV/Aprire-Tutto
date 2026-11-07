export type Minutes = 5 | 10 | 20 | 30;
export type View =
  "today" | "subjects" | "course" | "reviews" | "progress" | "settings";
export type Question = {
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};
export type Source = { title: string; url: string };
/** An idea expected in a written answer, detected with accent-free regexes. */
export type Criterion = { label: string; patterns: string[]; hint: string };
export type PromptCheck = {
  model: string;
  criteria: Criterion[];
  avoid?: { patterns: string[]; message: string }[];
};
export type Lesson = {
  id: string;
  title: string;
  subtitle: string;
  skill: string;
  recall: Question;
  paragraphs: string[];
  takeaway: string;
  example: { context: string; before: string; after: string };
  check: Question;
  transfer: Question;
  exam: Question;
  mission: {
    title: string;
    context: string;
    prompts: string[];
    rubric: string[];
    example: string;
    /** One automatic correction per prompt (built-in courses). */
    checks?: PromptCheck[];
  };
  /** Ideas a good reformulation of the lesson should contain. */
  keyIdeas?: Criterion[];
  cards: { front: string; back: string }[];
};
export type Course = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  color: string;
  icon: "compass" | "code" | "globe";
  lessons: Lesson[];
  sources: Source[];
  generatedAt?: string;
};
export type SessionDraft = {
  id: string;
  courseId: string;
  lessonId: string;
  minutes: Minutes;
  step: number;
  answers: Record<string, number>;
  revealed: string[];
  writing: string[];
  rubric: number[];
  reflection: string;
  startedAt: string;
};
export type Completion = {
  sessionId: string;
  lessonId: string;
  courseId: string;
  at: string;
  minutes: number;
  correct: number;
  total: number;
  writing: string[];
  rubric: number[];
  reflection: string;
};
export type Review = {
  id: string;
  lessonId: string;
  courseId: string;
  front: string;
  back: string;
  due: string;
  interval: number;
  repetitions: number;
};
export type AppState = {
  version: 1;
  minutes: Minutes;
  minutesDate: string;
  completions: Completion[];
  reviews: Review[];
  courses: Course[];
  session: SessionDraft | null;
  exams: { courseId: string; correct: number; total: number; at: string }[];
  goal: string;
  updatedAt: string;
};
