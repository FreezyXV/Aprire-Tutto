export type Minutes = 5 | 10 | 20 | 30;
export type View =
  | "today"
  | "subjects"
  | "course"
  | "chapter"
  | "practice"
  | "reviews"
  | "progress"
  | "settings";
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
export type DiagramTone = "neutral" | "apricot" | "marker" | "sky" | "blush";
/** Diagrams are data, rendered in HTML/CSS: responsive, selectable, offline. */
export type Diagram =
  | {
      kind: "flow";
      title: string;
      steps: { label: string; note?: string; tone?: DiagramTone }[];
      /** Arrow back from step `from` to step `to` (0-based), e.g. a reopen loop. */
      loop?: { from: number; to: number; label: string };
      caption: string;
    }
  | {
      kind: "quadrant";
      title: string;
      xAxis: string;
      yAxis: string;
      /** Exactly 4 cells: top-left, top-right, bottom-left, bottom-right. */
      cells: { title: string; text: string; tone?: DiagramTone }[];
      caption: string;
    }
  | {
      kind: "table";
      title: string;
      columns: string[];
      rows: string[][];
      caption: string;
    }
  | {
      kind: "lanes";
      title: string;
      lanes: string[];
      steps: { lane: number; label: string; issue?: boolean }[];
      caption: string;
    }
  | {
      kind: "bridge";
      title: string;
      left: { title: string; lines: string[] };
      center: { title: string; lines: string[] };
      right: { title: string; lines: string[] };
      forward: [string, string];
      backward: [string, string];
      caption: string;
    };
export type Chapter = {
  objective: string;
  prerequisites: string[];
  sections: {
    heading: string;
    paragraphs: string[];
    diagram?: Diagram;
    keyPoint?: string;
  }[];
  workedExample: {
    title: string;
    situation: string;
    steps: { label: string; detail: string }[];
    outcome: string;
  };
  pitfalls: { confusion: string; correction: string; counterExample: string }[];
  summary: string[];
  glossary: { term: string; definition: string }[];
};
/** One step of the running case study (practice level 3). */
export type CaseStep = {
  title: string;
  context: string;
  prompts: string[];
  criteria: string[][];
  models: string[];
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
  /** Reference course for the "Cours" space. */
  chapter?: Chapter;
  caseStep?: CaseStep;
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
  caseStudy?: { name: string; pitch: string };
};
export type AiGrade = {
  verdict: "solid" | "partial" | "revise";
  feedback: string;
  improved: string;
  /** Settled locally (empty, or every expected idea present): no AI call. */
  by?: "grid";
};
/** AI arbitration kept with the answers it judged (stale once they change). */
export type AiGrades = Partial<
  Record<
    "mission" | "reflection",
    { answers: string[]; items: AiGrade[]; at: string }
  >
>;
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
  aiGrades?: AiGrades;
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
  /** Reading progress: last section reached, and when the end was reached. */
  reading?: ReadingMark[];
  practice?: PracticeResult[];
};
export type ReadingMark = {
  courseId: string;
  lessonId: string;
  section: number;
  finishedAt?: string;
};
export type PracticeResult = {
  courseId: string;
  lessonId: string;
  level: 1 | 2 | 3;
  solid: number;
  total: number;
  at: string;
};
