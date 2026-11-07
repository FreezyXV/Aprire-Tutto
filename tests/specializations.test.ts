import test from "node:test";
import assert from "node:assert/strict";
import { specializations, builtInCourses } from "../src/data/courses";
import { chapterSchema, courseSchema } from "../src/lib/validation";
import { gradePrompt, gradeCriteria } from "../src/lib/grading";
import { diagramToText } from "../src/lib/diagram-text";

test("Built-in courses have unique course and lesson IDs", () => {
  const courseIds = builtInCourses.map((c) => c.id);
  assert.equal(new Set(courseIds).size, courseIds.length);
  const lessonIds = builtInCourses.flatMap((c) => c.lessons.map((l) => l.id));
  assert.equal(new Set(lessonIds).size, lessonIds.length);
});

for (const course of specializations)
  test(`Specialization « ${course.title} » is complete and self-consistent`, () => {
    const parsed = courseSchema.safeParse(course);
    assert.ok(parsed.success, JSON.stringify(parsed.error?.issues.slice(0, 3)));
    assert.ok(course.lessons.length >= 4);
    for (const l of course.lessons) {
      const where = `${course.id}/${l.id}`;
      for (const k of ["recall", "check", "transfer", "exam"] as const)
        assert.ok(l[k].answer < l[k].options.length, `${where} ${k}`);
      const ch = chapterSchema.safeParse(l.chapter);
      assert.ok(
        ch.success,
        `${where}: ${JSON.stringify(ch.error?.issues.slice(0, 3))}`,
      );
      for (const s of l.chapter!.sections)
        if (s.diagram) {
          const d = s.diagram;
          if (d.kind === "table")
            for (const r of d.rows)
              assert.equal(r.length, d.columns.length, `${where} ${d.title}`);
          if (d.kind === "lanes")
            for (const st of d.steps)
              assert.ok(st.lane < d.lanes.length, `${where} ${d.title}`);
          assert.ok(diagramToText(d).length >= 2, `${where} ${d.title}`);
        }
      assert.equal(
        l.mission.checks?.length,
        l.mission.prompts.length,
        `${where} grilles`,
      );
      l.mission.checks!.forEach((check, i) => {
        const g = gradePrompt(check.model, check);
        assert.equal(
          g.verdict,
          "solid",
          `${where} #${i + 1}: ${JSON.stringify(g.criteria.filter((x) => !x.met).map((x) => x.label))} ${g.warnings}`,
        );
        for (const p of [
          ...check.criteria.flatMap((x) => x.patterns),
          ...(check.avoid ?? []).flatMap((a) => a.patterns),
        ])
          assert.doesNotThrow(() => new RegExp(p, "i"), p);
      });
      const ideas = gradeCriteria(
        [l.takeaway, ...l.chapter!.summary, ...l.cards.map((x) => x.back)].join(
          " ",
        ),
        l.keyIdeas!,
      );
      assert.ok(
        ideas.every((x) => x.met),
        `${where} idées clés: ${ideas.filter((x) => !x.met).map((x) => x.label)}`,
      );
      assert.ok(l.caseStep, `${where} fil rouge`);
      assert.equal(
        l.caseStep!.models.length,
        l.caseStep!.prompts.length,
        where,
      );
      assert.equal(
        l.caseStep!.criteria.length,
        l.caseStep!.prompts.length,
        where,
      );
    }
  });

const lesson = (id: string) =>
  specializations.flatMap((c) => c.lessons).find((l) => l.id === id)!;

test("Typical mistakes in the specializations are flagged", () => {
  const star = lesson("ent-star").mission.checks![1];
  assert.notEqual(
    gradePrompt(
      "Nous avons fait des ateliers et nous avons livré à temps, 20 % de gain.",
      star,
    ).verdict,
    "solid",
  );
  const pitch = lesson("ent-pitch").mission.checks![0];
  assert.equal(
    gradePrompt(
      "Je suis très motivé et polyvalent, j’ai 3 ans d’expérience.",
      pitch,
    ).verdict,
    "revise",
  );
  const cas = lesson("ent-cas").mission.checks![1];
  assert.equal(
    gradePrompt(
      "Il faut changer d’outil et acheter un nouveau logiciel de devis.",
      cas,
    ).verdict,
    "revise",
  );
  const gateway = lesson("bpmn-passerelles").mission.checks![0];
  assert.equal(
    gradePrompt(
      "Une passerelle parallèle pour « en stock ? » : oui ou non.",
      gateway,
    ).verdict,
    "revise",
  );
  const sql = lesson("sql-select").mission.checks![1];
  assert.notEqual(
    gradePrompt("Elles restent dans le résultat.", sql).verdict,
    "solid",
  );
});

test("Correct answers in the learner's own words are accepted", () => {
  const sql = lesson("sql-select").mission.checks![0];
  assert.equal(
    gradePrompt(
      "SELECT * FROM commande WHERE date_commande BETWEEN '2026-11-01' AND '2026-11-30' AND statut != 'annulee' ORDER BY montant DESC",
      sql,
    ).verdict,
    "solid",
  );
  const risk = lesson("amoa-pilotage").mission.checks![1];
  assert.equal(
    gradePrompt(
      "On réduit le risque : test de l’interface dès juin, porté par le chef de projet.",
      risk,
    ).verdict,
    "solid",
  );
});
