"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AppState } from "@/lib/types";
import { initialState, safeReadState, STORAGE_KEY } from "@/lib/learning";
import { authHeaders, getSupabase } from "@/lib/client";
const META_KEY = `${STORAGE_KEY}:sync`;
export function useLearning() {
  const [state, setState] = useState<AppState>(initialState),
    [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(""),
    [cloud, setCloud] = useState("local"),
    [email, setEmail] = useState(""),
    [syncError, setSyncError] = useState("");
  const [conflict, setConflict] = useState<AppState | null>(null);
  const rev = useRef(0),
    canSync = useRef(false),
    lastSaved = useRef(""),
    inFlight = useRef(false),
    loading = useRef(false),
    userId = useRef("");
  const current = useRef(state);
  current.current = state;
  const remember = useCallback((at: string) => {
    lastSaved.current = at;
    try {
      localStorage.setItem(
        META_KEY,
        JSON.stringify({ userId: userId.current, at }),
      );
    } catch {
      setStorageError(
        "La synchronisation fonctionne, mais sa trace locale n’a pas pu être conservée.",
      );
    }
  }, []);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY),
        parsed = safeReadState(raw);
      if (parsed) setState(parsed);
      else if (raw) {
        localStorage.setItem(`${STORAGE_KEY}:recovery`, raw);
        setStorageError(
          "La sauvegarde locale n’a pas pu être lue. Une copie de récupération a été conservée.",
        );
      }
    } catch {
      setStorageError("Le navigateur ne permet pas la sauvegarde locale.");
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      setStorageError(
        "Le stockage est plein ou indisponible. Exporte tes données depuis les réglages.",
      );
    }
  }, [state, ready]);
  const update = useCallback(
    (fn: (s: AppState) => AppState) =>
      setState((s) => ({ ...fn(s), updatedAt: new Date().toISOString() })),
    [],
  );
  const loadCloud = useCallback(async () => {
    const sb = getSupabase();
    if (!sb || loading.current || inFlight.current) return;
    loading.current = true;
    canSync.current = false;
    try {
      const { data } = await sb.auth.getSession();
      setEmail(data.session?.user.email ?? "");
      if (!data.session) {
        setCloud("local");
        setConflict(null);
        return;
      }
      userId.current = data.session.user.id;
      let baseline = "";
      try {
        const meta = JSON.parse(localStorage.getItem(META_KEY) ?? "null");
        if (meta?.userId === userId.current) baseline = meta.at ?? "";
      } catch {}
      setCloud("syncing");
      const r = await fetch("/api/state", {
        headers: { Authorization: `Bearer ${data.session.access_token}` },
      });
      const body = await r.json();
      if (!r.ok) throw new Error(body.error);
      rev.current = body.revision ?? 0;
      if (body.state) {
        const remote = safeReadState(JSON.stringify(body.state));
        if (!remote)
          throw new Error(
            "La sauvegarde distante est invalide. La copie locale est conservée.",
          );
        const local = current.current;
        const meaningful =
          local.completions.length ||
          local.courses.length ||
          local.session ||
          local.exams.length ||
          local.reviews.length;
        const differs = JSON.stringify(local) !== JSON.stringify(remote);
        if (
          differs &&
          ((baseline &&
            local.updatedAt !== baseline &&
            remote.updatedAt !== baseline) ||
            (!baseline && meaningful))
        ) {
          setConflict(remote);
          throw new Error(
            "Deux versions de ta progression existent. Choisis celle à conserver ci-dessous.",
          );
        }
        if (
          baseline &&
          local.updatedAt !== baseline &&
          remote.updatedAt === baseline
        ) {
          remember(baseline);
        } else {
          setState(remote);
          remember(remote.updatedAt);
        }
      } else {
        remember("");
      }
      setConflict(null);
      canSync.current = true;
      setCloud("connected");
      setSyncError("");
    } catch (e) {
      setCloud("error");
      setSyncError(
        e instanceof Error ? e.message : "Synchronisation indisponible.",
      );
    } finally {
      loading.current = false;
    }
  }, [remember]);
  const resolveConflict = useCallback(
    (choice: "local" | "cloud") => {
      if (!conflict) return;
      // Keep the discarded version on this browser before either explicit choice.
      try {
        localStorage.setItem(
          `${STORAGE_KEY}:before-conflict`,
          JSON.stringify(choice === "cloud" ? current.current : conflict),
        );
      } catch {
        setStorageError(
          "Exporte ta progression avant de résoudre ce conflit : la copie de secours ne peut pas être enregistrée.",
        );
        return;
      }
      if (choice === "cloud") {
        setState(conflict);
        remember(conflict.updatedAt);
      } else {
        remember(conflict.updatedAt);
        setState((s) => ({ ...s, updatedAt: new Date().toISOString() }));
      }
      setConflict(null);
      canSync.current = true;
      setCloud("connected");
      setSyncError("");
    },
    [conflict, remember],
  );
  useEffect(() => {
    if (!ready) return;
    const sb = getSupabase();
    if (!sb) return;
    const { data } = sb.auth.onAuthStateChange((event) => {
      if (
        event === "INITIAL_SESSION" ||
        event === "SIGNED_IN" ||
        event === "SIGNED_OUT"
      )
        setTimeout(() => void loadCloud(), 0);
    });
    return () => data.subscription.unsubscribe();
  }, [ready, loadCloud]);
  useEffect(() => {
    if (
      !ready ||
      !canSync.current ||
      state.updatedAt === lastSaved.current ||
      inFlight.current
    )
      return;
    const timer = setTimeout(async () => {
      if (inFlight.current || !canSync.current) return;
      inFlight.current = true;
      setCloud("syncing");
      try {
        const r = await fetch("/api/state", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(await authHeaders()),
          },
          body: JSON.stringify({ state, revision: rev.current }),
        });
        const body = await r.json();
        if (!r.ok) throw new Error(body.error);
        rev.current = body.revision;
        remember(state.updatedAt);
        setCloud("connected");
        setSyncError("");
      } catch (e) {
        canSync.current = false;
        setCloud("error");
        setSyncError(
          e instanceof Error ? e.message : "Synchronisation indisponible.",
        );
      } finally {
        inFlight.current = false;
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [state, ready, cloud, remember]);
  useEffect(() => {
    const onFocus = () => {
      if (canSync.current && current.current.updatedAt === lastSaved.current)
        void loadCloud();
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [loadCloud]);
  return {
    state,
    update,
    ready,
    storageError,
    cloud,
    email,
    syncError,
    loadCloud,
    conflict,
    resolveConflict,
  };
}
