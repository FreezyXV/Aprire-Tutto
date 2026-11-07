import test from "node:test";
import assert from "node:assert/strict";
import { callAi } from "../src/lib/ai-client";

const realFetch = globalThis.fetch;
const respond = (queue: (() => Response | Promise<Response>)[]) => {
  const bodies: Record<string, unknown>[] = [];
  globalThis.fetch = (async (_u: unknown, init?: RequestInit) => {
    bodies.push(JSON.parse(String(init?.body)));
    return queue.shift()!();
  }) as typeof fetch;
  return bodies;
};

test("Waits and retries once when the server asks to wait, with a new request id", async () => {
  const bodies = respond([
    () =>
      Response.json(
        { error: "Patiente" },
        { status: 429, headers: { "Retry-After": "1" } },
      ),
    () => Response.json({ answer: "ok" }),
  ]);
  let waited = 0;
  const r = await callAi<{ answer: string }>({ action: "tutor" }, (s) => {
    waited = s;
  });
  assert.equal(r.answer, "ok");
  assert.equal(waited, 1);
  assert.equal(bodies.length, 2);
  assert.notEqual(bodies[0].requestId, bodies[1].requestId);
  globalThis.fetch = realFetch;
});

test("Budget refusals are not retried and keep the server message", async () => {
  const bodies = respond([
    () =>
      Response.json(
        { error: "L’enveloppe IA du jour est atteinte." },
        { status: 429 },
      ),
  ]);
  await assert.rejects(callAi({ action: "grade" }), /enveloppe IA/);
  assert.equal(bodies.length, 1);
  globalThis.fetch = realFetch;
});

test("Network cuts and gateway timeouts give a clear French message", async () => {
  respond([
    () => {
      throw new TypeError("Load failed");
    },
  ]);
  await assert.rejects(
    callAi({ action: "course" }),
    /connexion a été interrompue/,
  );
  respond([
    () => new Response("<html>An error occurred</html>", { status: 504 }),
  ]);
  await assert.rejects(callAi({ action: "course" }), /trop de temps/);
  globalThis.fetch = realFetch;
});

test("The server tells the app how long to wait before retrying", async () => {
  const { AppError, errorResponse } = await import("../src/lib/server");
  const wait = errorResponse(new AppError(429, "Patiente", 20));
  assert.equal(wait.headers.get("Retry-After"), "20");
  const budget = errorResponse(new AppError(429, "Enveloppe atteinte"));
  assert.equal(budget.headers.get("Retry-After"), null);
});
