import test from "node:test";
import assert from "node:assert/strict";
import { baCourse } from "../src/data/ba";
import {
  initialState,
  stages,
  completeSession,
  scheduleReview,
  safeReadState,
  dayKey,
} from "../src/lib/learning";
import { courseSchema } from "../src/lib/validation";
import { readCompletion, runLearning } from "../src/lib/deepseek";
import { GET as readState } from "../src/app/api/state/route";
import { POST as learn } from "../src/app/api/learn/route";
const uuid = "67e55d37-a297-46b5-a036-e914b55b8fc5";
test("The BA curriculum has complete lessons and valid questions", () => {
  assert.equal(baCourse.lessons.length, 8);
  assert.equal(courseSchema.safeParse(baCourse).success, true);
  for (const lesson of baCourse.lessons) {
    assert.equal(
      new Set([
        lesson.recall.prompt,
        lesson.check.prompt,
        lesson.transfer.prompt,
        lesson.exam.prompt,
      ]).size,
      4,
    );
    assert.ok(lesson.mission.prompts.length >= 3);
  }
});
test("Session duration changes the actual learning sequence", () => {
  assert.deepEqual(stages(5), ["recall", "learn", "check", "summary"]);
  assert.ok(stages(10).includes("mission"));
  assert.ok(!stages(10).includes("transfer"));
  assert.ok(stages(20).includes("transfer"));
  assert.ok(stages(30).includes("reflection"));
});
test("Completing a session twice does not duplicate progress or reviews", () => {
  const c = {
    sessionId: uuid,
    lessonId: "ba-besoin",
    courseId: baCourse.id,
    at: new Date().toISOString(),
    minutes: 20,
    correct: 2,
    total: 2,
    writing: [],
    rubric: [],
    reflection: "",
  };
  const a = completeSession(initialState(), c, []),
    b = completeSession(a, c, []);
  assert.equal(b.completions.length, 1);
  assert.equal(b.session, null);
});
test("Spacing reacts to retrieval difficulty and caps long intervals", () => {
  const r = {
    id: "a",
    courseId: "ba",
    lessonId: "a",
    front: "q",
    back: "a",
    due: "2026-11-06T00:00:00.000Z",
    interval: 80,
    repetitions: 1,
  };
  const now = new Date(r.due);
  assert.equal(scheduleReview(r, "again", now).due, "2026-11-06T00:10:00.000Z");
  assert.equal(scheduleReview(r, "hard", now).interval, 1);
  assert.equal(scheduleReview(r, "easy", now).interval, 90);
  assert.equal(scheduleReview(r, "good", now).interval, 60);
});
test("Local storage validation rejects malformed data and unsafe source links", () => {
  assert.ok(safeReadState(JSON.stringify(initialState())));
  assert.equal(safeReadState("{bad"), null);
  assert.equal(
    safeReadState(
      JSON.stringify({ ...initialState(), reviews: [{ id: "bad" }] }),
    ),
    null,
  );
  assert.equal(
    courseSchema.safeParse({
      ...baCourse,
      sources: [{ title: "bad", url: "javascript:alert(1)" }],
    }).success,
    false,
  );
  assert.equal(dayKey(new Date("2026-11-06T23:30:00Z")), "2026-11-07");
});
test("Protected routes reject unauthenticated calls before any database or paid call", async () => {
  assert.equal(
    (await readState(new Request("http://localhost/api/state"))).status,
    401,
  );
  assert.equal(
    (await learn(new Request("http://localhost/api/learn", { method: "POST" })))
      .status,
    401,
  );
});
test("Truncated and blank AI responses cannot become lessons", () => {
  assert.throws(() =>
    readCompletion({
      choices: [{ finish_reason: "length", message: { content: "{}" } }],
    }),
  );
  assert.throws(() =>
    readCompletion({
      choices: [{ finish_reason: "stop", message: { content: "   " } }],
    }),
  );
});

test("The AI cannot be asked to create courses or chapters", async () => {
  const { learnRequestSchema } = await import("../src/lib/validation");
  for (const action of ["course", "chapter"])
    assert.equal(
      learnRequestSchema.safeParse({
        action,
        topic: "SQL",
        goal: "",
        level: "Je découvre",
        requestId: uuid,
      }).success,
      false,
    );
  assert.equal(
    learnRequestSchema.safeParse({
      action: "grade",
      title: "t",
      context: "c",
      items: [{ prompt: "p", answer: "a", model: "m", criteria: [] }],
      requestId: uuid,
    }).success,
    true,
  );
});
