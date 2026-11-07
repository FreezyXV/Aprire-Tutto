import { z } from "zod";
const text = z.string().min(1).max(8000);
const id = z.string().min(1).max(160);
const date = z.iso.datetime();
export const minutesSchema = z.union([
  z.literal(5),
  z.literal(10),
  z.literal(20),
  z.literal(30),
]);
const question = z
  .object({
    prompt: text,
    options: z.array(text).min(2).max(6),
    answer: z.number().int().min(0),
    explanation: text,
  })
  .refine((q) => q.answer < q.options.length);
export const lessonSchema = z.object({
  id,
  title: text,
  subtitle: text,
  skill: text,
  recall: question,
  paragraphs: z.array(text).min(1).max(6),
  takeaway: text,
  example: z.object({ context: text, before: text, after: text }),
  check: question,
  transfer: question,
  exam: question,
  mission: z.object({
    title: text,
    context: text,
    prompts: z.array(text).min(1).max(3),
    rubric: z.array(text).min(1).max(6),
    example: text,
  }),
  cards: z
    .array(z.object({ front: text, back: text }))
    .min(1)
    .max(5),
});
export const sourceSchema = z.object({
  title: text,
  url: z
    .url()
    .refine((v) => new URL(v).protocol === "https:", "Lien HTTPS requis"),
});
export const courseSchema = z
  .object({
    id,
    title: text,
    eyebrow: text,
    description: text,
    color: z.enum(["olive", "sage", "lavender", "peach"]),
    icon: z.enum(["compass", "code", "globe"]),
    lessons: z.array(lessonSchema).min(1).max(20),
    sources: z.array(sourceSchema).min(1).max(10),
    generatedAt: date.optional(),
  })
  .refine((c) => new Set(c.lessons.map((l) => l.id)).size === c.lessons.length);
const writing = z.array(z.string().max(12000)).max(3);
const rubric = z.array(z.number().int().min(0).max(5)).max(6);
const session = z
  .object({
    id,
    courseId: id,
    lessonId: id,
    minutes: minutesSchema,
    step: z.number().int().min(0).max(6),
    answers: z.record(z.string().max(40), z.number().int().min(-1).max(5)),
    revealed: z.array(z.string().max(40)).max(8),
    writing,
    rubric,
    reflection: z.string().max(12000),
    startedAt: date,
  })
  .refine(
    (s) =>
      s.step <
      (s.minutes === 5 ? 4 : s.minutes === 10 ? 5 : s.minutes === 20 ? 6 : 7),
  );
export const stateSchema = z.object({
  version: z.literal(1),
  minutes: minutesSchema,
  minutesDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  completions: z
    .array(
      z.object({
        sessionId: id,
        lessonId: id,
        courseId: id,
        at: date,
        minutes: minutesSchema,
        correct: z.number().int().min(0).max(2),
        total: z.number().int().min(1).max(2),
        writing,
        rubric,
        reflection: z.string().max(12000),
      }),
    )
    .max(10000),
  reviews: z
    .array(
      z.object({
        id,
        lessonId: id,
        courseId: id,
        front: text,
        back: text,
        due: date,
        interval: z.number().min(0).max(90),
        repetitions: z.number().int().min(0),
      }),
    )
    .max(10000),
  courses: z.array(courseSchema).max(100),
  session: session.nullable(),
  exams: z
    .array(
      z.object({
        courseId: id,
        correct: z.number().int().min(0).max(20),
        total: z.number().int().min(1).max(20),
        at: date,
      }),
    )
    .max(10000),
  goal: z.string().max(2000),
  updatedAt: date,
});
export const learnRequestSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("course"),
    topic: z.string().trim().min(2).max(140),
    goal: z.string().max(800),
    level: z.enum([
      "Je découvre",
      "J’ai quelques bases",
      "Je veux approfondir",
    ]),
    requestId: z.uuid(),
  }),
  z.object({
    action: z.literal("tutor"),
    question: z.string().trim().min(2).max(2000),
    context: z.object({
      title: z.string().max(300),
      takeaway: z.string().max(3000),
      writing: z.string().max(10000),
      rubric: z.array(z.string().max(1000)).max(6),
    }),
    requestId: z.uuid(),
  }),
  z.object({
    action: z.literal("grade"),
    title: z.string().max(300),
    context: z.string().max(3000),
    items: z
      .array(
        z.object({
          prompt: z.string().max(1000),
          answer: z.string().max(3000),
          model: z.string().max(2000),
          criteria: z.array(z.string().max(300)).max(6),
        }),
      )
      .min(1)
      .max(3),
    requestId: z.uuid(),
  }),
]);
export const gradeResultSchema = z.object({
  items: z
    .array(
      z.object({
        verdict: z.enum(["solid", "partial", "revise"]),
        feedback: z.string().min(1).max(2000),
        improved: z.string().max(2000).default(""),
      }),
    )
    .min(1)
    .max(3),
});
