import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import fs from "node:fs";
function harness() {
  const origin = "https://aprire.example";
  const files = new Map([
    [
      "/",
      new Response(
        '<link rel="stylesheet" href="/_next/static/app.css"><script src="/_next/static/app.js"></script>',
        { headers: { "content-type": "text/html" } },
      ),
    ],
    [
      "/_next/static/app.css",
      new Response("@font-face{src:url(./font.woff2)}"),
    ],
    ["/_next/static/app.js", new Response("app()")],
    ["/_next/static/font.woff2", new Response("font")],
  ]);
  const handlers: Record<string, (event: any) => void> = {};
  const stores = new Map<string, Map<string, Response>>([
    ["another-app", new Map()],
    ["aprire-v3", new Map()],
  ]);
  let offline = false;
  const key = (r: any) =>
    new URL(typeof r === "string" ? r : r.url, origin).pathname;
  const fetcher = async (r: any) => {
    if (offline) throw new Error("offline");
    return (files.get(key(r)) ?? new Response("static")).clone();
  };
  const caches = {
    keys: async () => [...stores.keys()],
    delete: async (k: string) => stores.delete(k),
    open: async (name: string) => {
      if (!stores.has(name)) stores.set(name, new Map());
      const data = stores.get(name)!;
      return {
        match: async (r: any) => data.get(key(r))?.clone(),
        put: async (r: any, response: Response) => {
          data.set(key(r), response);
        },
        addAll: async (list: any[]) => {
          for (const r of list) data.set(key(r), await fetcher(r));
        },
      };
    },
  };
  vm.runInNewContext(fs.readFileSync("public/sw.js", "utf8"), {
    self: {
      location: { origin },
      addEventListener: (type: string, fn: any) => {
        handlers[type] = fn;
      },
      skipWaiting: async () => {},
      clients: { claim: async () => {} },
    },
    caches,
    fetch: fetcher,
    URL,
    Response,
    Request,
    Set,
    Promise,
  });
  return {
    handlers,
    stores,
    offline: () => {
      offline = true;
    },
  };
}
test("First installation precaches scripts, CSS, and fonts before offline use", async () => {
  const h = harness();
  let installing: Promise<unknown> = Promise.resolve();
  h.handlers.install({
    waitUntil: (p: Promise<unknown>) => {
      installing = p;
    },
  });
  await installing;
  const cache = h.stores.get("aprire-v4")!;
  for (const file of [
    "/",
    "/_next/static/app.css",
    "/_next/static/app.js",
    "/_next/static/font.woff2",
  ])
    assert.ok(cache.has(file), file);
  h.offline();
  let response: Promise<Response> | undefined;
  h.handlers.fetch({
    request: {
      method: "GET",
      url: "https://aprire.example/",
      mode: "navigate",
    },
    respondWith: (p: Promise<Response>) => {
      response = p;
    },
  });
  assert.ok((await (await response!).text()).includes("app.js"));
  h.handlers.fetch({
    request: new Request("https://aprire.example/_next/static/app.js"),
    respondWith: (p: Promise<Response>) => {
      response = p;
    },
  });
  assert.equal(await (await response!).text(), "app()");
});
test("Service worker leaves private API requests and unrelated origin caches alone", async () => {
  const h = harness();
  let intercepted = false;
  for (const path of [
    "/api/state",
    "/api/learn",
    "/auth/confirm",
    "/?_rsc=abc",
  ])
    h.handlers.fetch({
      request: new Request("https://aprire.example" + path),
      respondWith: () => {
        intercepted = true;
      },
    });
  assert.equal(intercepted, false);
  let activation = Promise.resolve();
  h.handlers.activate({
    waitUntil: (p: Promise<void>) => {
      activation = p;
    },
  });
  await activation;
  assert.ok(h.stores.has("another-app"));
  assert.ok(!h.stores.has("aprire-v3"));
});
