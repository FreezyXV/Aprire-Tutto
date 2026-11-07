// Public app shell only. Personal data and authenticated API calls are never cached.
const VERSION = "aprire-v4";
const PREFIX = "aprire-";
const SHELL = [
  "/",
  "/manifest.webmanifest",
  "/icon.svg",
  "/apple-icon.png",
  "/icon-192.png",
  "/icon-512.png",
];
const origin = self.location.origin;
function staticAsset(value, base = origin) {
  const url = new URL(value.replaceAll("&amp;", "&"), base);
  return url.origin === origin && url.pathname.startsWith("/_next/static/")
    ? url.href
    : null;
}
async function prepareShell() {
  const cache = await caches.open(VERSION);
  await cache.addAll(SHELL);
  const page = await cache.match("/");
  if (
    !page ||
    page.redirected ||
    !page.headers.get("content-type")?.includes("text/html")
  )
    throw new Error("App shell unavailable");
  // The first page's scripts load before the service worker takes control.
  // Explicitly warm those assets so the very next visit can be offline.
  const html = await page.text();
  const assets = [
    ...new Set(
      [...html.matchAll(/(?:src|href)=["']([^"']+)["']/g)].flatMap((match) => {
        const url = staticAsset(match[1]);
        return url ? [url] : [];
      }),
    ),
  ].slice(0, 64);
  await cache.addAll(assets);
  const fonts = new Set();
  for (const asset of assets.filter((url) =>
    new URL(url).pathname.endsWith(".css"),
  )) {
    const css = await cache.match(asset);
    for (const match of (await css.text()).matchAll(
      /url\(\s*["']?([^\s"')]+)["']?\s*\)/g,
    )) {
      const url = staticAsset(match[1], asset);
      if (url) fonts.add(url);
    }
  }
  await cache.addAll([...fonts].slice(0, 64));
}
self.addEventListener("install", (event) => {
  event.waitUntil(prepareShell().then(() => self.skipWaiting()));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(PREFIX) && key !== VERSION)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (
    request.method !== "GET" ||
    url.origin !== origin ||
    url.pathname.startsWith("/api/")
  )
    return;
  if (request.mode === "navigate" && url.pathname === "/") {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          if (
            response.ok &&
            !response.redirected &&
            response.headers.get("content-type")?.includes("text/html")
          ) {
            const cache = await caches.open(VERSION);
            await cache.put("/", response.clone());
          }
          return response;
        })
        .catch(
          async () =>
            (await (await caches.open(VERSION)).match("/")) || Response.error(),
        ),
    );
    return;
  }
  // Only known static files, never RSC payloads, auth redirects, or arbitrary URLs.
  if (
    !url.pathname.startsWith("/_next/static/") &&
    !SHELL.slice(1).includes(url.pathname)
  )
    return;
  event.respondWith(
    caches.open(VERSION).then(async (cache) => {
      const saved = await cache.match(request);
      if (saved) return saved;
      const response = await fetch(request);
      if (response.ok && !response.redirected)
        await cache.put(request, response.clone());
      return response;
    }),
  );
});
