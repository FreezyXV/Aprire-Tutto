import test from "node:test";
import assert from "node:assert/strict";
import { baCourse } from "../src/data/ba";
import { chapterSchema, courseSchema } from "../src/lib/validation";
import { diagramToText } from "../src/lib/diagram-text";
import type { Diagram } from "../src/lib/types";

const diagrams = (): { lesson: string; d: Diagram }[] =>
  baCourse.lessons.flatMap((l) =>
    (l.chapter?.sections ?? []).flatMap((s) =>
      s.diagram ? [{ lesson: l.id, d: s.diagram }] : [],
    ),
  );

test("Every BA lesson has a valid reference chapter and case step", () => {
  assert.equal(courseSchema.safeParse(baCourse).success, true);
  for (const l of baCourse.lessons) {
    assert.ok(l.chapter, `${l.id} sans chapitre`);
    const parsed = chapterSchema.safeParse(l.chapter);
    assert.ok(
      parsed.success,
      `${l.id}: ${JSON.stringify(parsed.error?.issues.slice(0, 3))}`,
    );
    assert.ok(l.caseStep, `${l.id} sans étape fil rouge`);
    assert.equal(l.caseStep.criteria.length, l.caseStep.prompts.length, l.id);
    assert.equal(l.caseStep.models.length, l.caseStep.prompts.length, l.id);
  }
  assert.ok(baCourse.caseStudy?.name);
});

test("Every diagram is coherent and has a text equivalent", () => {
  const all = diagrams();
  assert.ok(all.length >= 16, `seulement ${all.length} schémas`);
  for (const { lesson, d } of all) {
    const where = `${lesson} / ${d.title}`;
    if (d.kind === "table")
      for (const r of d.rows) assert.equal(r.length, d.columns.length, where);
    if (d.kind === "lanes")
      for (const s of d.steps) assert.ok(s.lane < d.lanes.length, where);
    if (d.kind === "flow" && d.loop) {
      assert.ok(d.loop.from < d.steps.length, where);
      assert.ok(d.loop.to < d.steps.length, where);
    }
    if (d.kind === "quadrant") assert.equal(d.cells.length, 4, where);
    const text = diagramToText(d);
    assert.ok(text.length >= 2, where);
    assert.ok(
      text.every((t) => t.trim().length > 3),
      where,
    );
  }
});

test("Chapters cover each lesson with examples, pitfalls and glossary", () => {
  for (const l of baCourse.lessons) {
    const c = l.chapter!;
    assert.ok(c.sections.length >= 4, `${l.id}: sections`);
    assert.ok(c.workedExample.steps.length >= 4, `${l.id}: exemple`);
    assert.ok(c.pitfalls.length >= 2, `${l.id}: pièges`);
    assert.ok(c.glossary.length >= 4, `${l.id}: glossaire`);
  }
});

test("Arbitration only sends doubtful, changed answers to the AI", async () => {
  const { planArbitration } = await import("../src/lib/arbitration");
  const { gradePrompt } = await import("../src/lib/grading");
  const checks = baCourse.lessons[0].mission.checks!;
  const answers = [
    "Pour quelles raisons vos clients appellent-ils, et à quel moment de leur commande ?",
    "",
    "Refaire l’application.",
  ];
  const offline = answers.map((a, i) => gradePrompt(a, checks[i]));
  const first = planArbitration(answers, offline);
  assert.deepEqual(first.toAsk, [2]);
  assert.equal(first.results[0]?.by, "grid");
  assert.equal(first.results[1]?.verdict, "revise");
  const previous = {
    answers,
    items: first.results.map(
      (r) => r ?? { verdict: "revise" as const, feedback: "IA", improved: "" },
    ),
  };
  assert.deepEqual(planArbitration(answers, offline, previous).toAsk, []);
  const edited = [...answers];
  edited[2] = "Permettre aux clients d’être informés plus vite.";
  const offline2 = edited.map((a, i) => gradePrompt(a, checks[i]));
  const again = planArbitration(edited, offline2, previous);
  assert.ok(again.toAsk.length <= 1);
});

test("A generated chapter keeps its content when one diagram is malformed", async () => {
  const { salvageChapter } = await import("../src/lib/deepseek");
  const raw = structuredClone(baCourse.lessons[0].chapter!) as unknown as {
    sections: { diagram?: unknown }[];
  };
  raw.sections[1].diagram = { kind: "flow", title: "x", steps: [] };
  const chapter = salvageChapter(raw);
  assert.ok(chapter);
  assert.equal(chapter.sections.length, raw.sections.length);
  assert.equal(chapter.sections[1].diagram, undefined);
  assert.equal(salvageChapter({ sections: "nope" }), null);
});

test("Saved progress accepts reading marks and practice results", async () => {
  const { initialState } = await import("../src/lib/learning");
  const state = {
    ...initialState(),
    reading: [
      { courseId: baCourse.id, lessonId: "ba-besoin", section: 3 },
      {
        courseId: baCourse.id,
        lessonId: "ba-acteurs",
        section: 8,
        finishedAt: new Date().toISOString(),
      },
    ],
    practice: [
      {
        courseId: baCourse.id,
        lessonId: "ba-besoin",
        level: 3,
        solid: 2,
        total: 2,
        at: new Date().toISOString(),
      },
    ],
  };
  const { stateSchema } = await import("../src/lib/validation");
  assert.equal(stateSchema.safeParse(state).success, true);
  assert.equal(
    stateSchema.safeParse({
      ...state,
      practice: [{ ...state.practice[0], level: 4 }],
    }).success,
    false,
  );
});
