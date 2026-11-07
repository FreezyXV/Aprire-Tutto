"use client";
import { authHeaders } from "@/lib/client";

type WakeLock = { release: () => Promise<void> };

/** Keep the iPhone screen on during long AI calls (a locked screen kills the request). */
async function keepAwake(): Promise<WakeLock | null> {
  try {
    const nav = navigator as Navigator & {
      wakeLock?: { request: (t: "screen") => Promise<WakeLock> };
    };
    return (await nav.wakeLock?.request("screen")) ?? null;
  } catch {
    return null;
  }
}

const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * POST /api/learn with the session token. One automatic retry when the server
 * asks to wait between two requests (429 + Retry-After): that refusal reserves
 * nothing, so retrying costs nothing extra.
 */
export async function callAi<T>(
  payload: Record<string, unknown>,
  onWait?: (seconds: number) => void,
): Promise<T> {
  if (typeof navigator !== "undefined" && navigator.onLine === false)
    throw new Error("Tu es hors connexion. Réessaie une fois connecté.");
  const lock = await keepAwake();
  try {
    for (let attempt = 0; ; attempt++) {
      let r: Response;
      try {
        r = await fetch("/api/learn", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(await authHeaders()),
          },
          body: JSON.stringify({ ...payload, requestId: crypto.randomUUID() }),
        });
      } catch {
        throw new Error(
          "La connexion a été interrompue. Garde l’app ouverte pendant la demande, puis réessaie.",
        );
      }
      const retryAfter = Number(r.headers.get("Retry-After"));
      if (r.status === 429 && retryAfter > 0 && attempt === 0) {
        onWait?.(retryAfter);
        await pause((retryAfter + 1) * 1000);
        continue;
      }
      let body: { error?: string } & Record<string, unknown>;
      try {
        body = await r.json();
      } catch {
        throw new Error(
          r.status === 504 || r.status === 502
            ? "L’IA a mis trop de temps à répondre. Réessaie dans un instant."
            : "Réponse inattendue du serveur. Réessaie dans un instant.",
        );
      }
      if (!r.ok) throw new Error(body.error ?? "L’IA est indisponible.");
      return body as T;
    }
  } finally {
    await lock?.release().catch(() => undefined);
  }
}
