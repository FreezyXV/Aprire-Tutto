import test from "node:test";
import assert from "node:assert/strict";
import { baCourse } from "../src/data/ba";
import { gradeCriteria, gradePrompt, normalize } from "../src/lib/grading";
import { runLearning } from "../src/lib/deepseek";

const uuid = "67e55d37-a297-46b5-a036-e914b55b8fc5";
const lesson = (id: string) => baCourse.lessons.find((l) => l.id === id)!;

test("Every BA lesson has one correction grid per prompt and key ideas", () => {
  for (const l of baCourse.lessons) {
    assert.equal(l.mission.checks?.length, l.mission.prompts.length, l.id);
    assert.ok(l.keyIdeas && l.keyIdeas.length >= 3, l.id);
    const all = [
      ...l.mission.checks!.flatMap((c) => [
        ...c.criteria.flatMap((x) => x.patterns),
        ...(c.avoid ?? []).flatMap((a) => a.patterns),
      ]),
      ...l.keyIdeas!.flatMap((k) => k.patterns),
    ];
    for (const p of all) assert.doesNotThrow(() => new RegExp(p, "i"), p);
  }
});

test("Each model answer is graded as solid by its own grid", () => {
  for (const l of baCourse.lessons)
    l.mission.checks!.forEach((check, i) => {
      const g = gradePrompt(check.model, check);
      assert.equal(
        g.verdict,
        "solid",
        `${l.id} #${i + 1}: ${JSON.stringify(g.criteria.filter((c) => !c.met))} ${g.warnings}`,
      );
    });
});

test("Typical mistakes are flagged instead of being accepted", () => {
  const besoin = lesson("ba-besoin").mission.checks!;
  assert.notEqual(
    gradePrompt("Est-ce que vous voulez une nouvelle application ?", besoin[0])
      .verdict,
    "solid",
  );
  const solution = gradePrompt(
    "Il faut refaire l’application pour que les clients appellent moins.",
    besoin[2],
  );
  assert.notEqual(solution.verdict, "solid");
  assert.ok(solution.warnings.some((w) => w.includes("solution")));
  assert.equal(gradePrompt("ok", besoin[1]).verdict, "revise");
  assert.equal(gradePrompt("   ", besoin[1]).verdict, "empty");

  const exigence = lesson("ba-exigences").mission.checks![1];
  const vague = gradePrompt(
    "Hypothèse : si la livraison est en retard, alors le client est averti suffisamment tôt.",
    exigence,
  );
  assert.notEqual(vague.verdict, "solid");

  const prio = lesson("ba-prioriser").mission.checks![0];
  assert.notEqual(
    gradePrompt("Les avatars en premier, c’est plus visible.", prio).verdict,
    "solid",
  );
});

test("A correct answer in the learner's own words is accepted", () => {
  const [q1, q2, q3] = lesson("ba-besoin").mission.checks!;
  assert.equal(
    gradePrompt(
      "Pourquoi vos clients vous appellent-ils, et à quel moment ?",
      q1,
    ).verdict,
    "solid",
  );
  assert.equal(
    gradePrompt(
      "Combien d’appels par jour concernent le suivi de livraison ?",
      q2,
    ).verdict,
    "solid",
  );
  assert.equal(
    gradePrompt(
      "Permettre aux clients de savoir où en est leur commande sans appeler.",
      q3,
    ).verdict,
    "solid",
  );
});

test("Reflection key ideas are detected without accents or case", () => {
  assert.equal(normalize("Éviter LA Solution’"), "eviter la solution'");
  const ideas = gradeCriteria(
    "Le besoin n'est pas la SOLUTION : je demande pourquoi, puis je mesure le résultat.",
    lesson("ba-besoin").keyIdeas!,
  );
  assert.ok(ideas.every((i) => i.met));
});

test("AI grading returns one verdict per answer and rejects incomplete output", async () => {
  const items = [
    {
      prompt: "Quelle question poses-tu ?",
      answer: "Pourquoi appellent-ils ?",
      model: "« Pour quelles raisons… »",
      criteria: ["Question ouverte"],
    },
  ];
  const reply =
    (content: unknown): typeof fetch =>
    async (_url, init) => {
      const body = JSON.parse(String(init?.body));
      assert.equal(body.response_format.type, "json_object");
      assert.equal(body.max_tokens, 4000);
      return Response.json({
        choices: [
          {
            finish_reason: "stop",
            message: { content: JSON.stringify(content) },
          },
        ],
      });
    };
  const input = {
    action: "grade" as const,
    title: "Mission",
    context: "Contexte",
    items,
    requestId: uuid,
  };
  const ok = await runLearning(
    input,
    new AbortController().signal,
    reply({
      items: [
        {
          verdict: "solid",
          feedback: "Question ouverte et factuelle.",
          improved: "",
        },
      ],
    }),
  );
  assert.ok("items" in ok);
  assert.equal(ok.items[0].verdict, "solid");
  await assert.rejects(
    runLearning(input, new AbortController().signal, reply({ items: [] })),
  );
  await assert.rejects(
    runLearning(
      input,
      new AbortController().signal,
      reply({ items: [{ verdict: "bravo", feedback: "x" }] }),
    ),
  );
});

test("Saved progress keeps AI verdicts and rejects unknown ones", async () => {
  const { initialState } = await import("../src/lib/learning");
  const { stateSchema } = await import("../src/lib/validation");
  const base = initialState();
  const session = {
    id: uuid,
    courseId: baCourse.id,
    lessonId: "ba-besoin",
    minutes: 30 as const,
    step: 3,
    answers: {},
    revealed: ["mission"],
    writing: ["Pourquoi ?"],
    rubric: [0],
    reflection: "",
    startedAt: new Date().toISOString(),
    aiGrades: {
      mission: {
        answers: ["Pourquoi ?"],
        items: [{ verdict: "solid", feedback: "Juste.", improved: "" }],
        at: new Date().toISOString(),
      },
    },
  };
  const ok = stateSchema.safeParse({ ...base, session });
  assert.equal(ok.success, true);
  assert.equal(ok.data?.session?.aiGrades?.mission?.items[0].verdict, "solid");
  const bad = structuredClone(session);
  (bad.aiGrades.mission.items[0] as { verdict: string }).verdict = "bravo";
  assert.equal(stateSchema.safeParse({ ...base, session: bad }).success, false);
});
