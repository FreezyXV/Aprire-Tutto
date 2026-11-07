import { createClient } from "@supabase/supabase-js";
export class AppError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export function publicClient(token?: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
    key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key)
    throw new AppError(503, "La connexion au cloud reste à configurer.");
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : undefined,
  });
}
export async function ownerClient(request: Request) {
  const token = request.headers
    .get("authorization")
    ?.match(/^Bearer (\S+)$/)?.[1];
  if (!token)
    throw new AppError(
      401,
      "Connecte-toi à ton compte dans les réglages pour utiliser le cloud et le tuteur.",
    );
  const client = publicClient(token);
  const {
    data: { user },
    error,
  } = await client.auth.getUser(token);
  if (error || !user)
    throw new AppError(
      401,
      "Ta connexion a expiré. Reconnecte-toi dans les réglages.",
    );
  const { data: owner, error: ownerError } = await client.rpc("is_app_owner");
  if (ownerError)
    throw new AppError(
      503,
      "La configuration de ton espace cloud doit être terminée.",
    );
  if (!owner)
    throw new AppError(
      403,
      "Cet espace personnel est réservé à son propriétaire. Confirme ton adresse e-mail pour y accéder.",
    );
  return { client, user };
}
export async function readJson(request: Request, maxBytes = 1000000) {
  if (!request.headers.get("content-type")?.includes("application/json"))
    throw new AppError(415, "Un contenu JSON est requis.");
  const reader = request.body?.getReader();
  if (!reader) throw new AppError(400, "La requête est vide.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      throw new AppError(
        413,
        "Le contenu est trop volumineux. Exporte ta progression avant de continuer.",
      );
    }
    chunks.push(value);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new AppError(400, "Le contenu reçu est invalide.");
  }
}
export function json(value: unknown, status = 200) {
  return Response.json(value, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}
export function errorResponse(error: unknown) {
  return json(
    {
      error:
        error instanceof AppError
          ? error.message
          : "Le service est momentanément indisponible. Ta progression locale est conservée.",
    },
    error instanceof AppError ? error.status : 500,
  );
}
