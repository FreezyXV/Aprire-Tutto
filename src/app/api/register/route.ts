import {
  AppError,
  errorResponse,
  json,
  publicClient,
  readJson,
} from "@/lib/server";
import { z } from "zod";
export async function POST(request: Request) {
  try {
    const parsed = z
      .object({ email: z.email(), password: z.string().min(12).max(128) })
      .safeParse(await readJson(request, 4000));
    if (!parsed.success)
      throw new AppError(
        400,
        "Utilise une adresse valide et un mot de passe d’au moins 12 caractères.",
      );
    if (
      !process.env.OWNER_EMAIL ||
      parsed.data.email.toLowerCase() !== process.env.OWNER_EMAIL.toLowerCase()
    )
      throw new AppError(
        403,
        "La création de compte est réservée à l’adresse du propriétaire.",
      );
    const { error } = await publicClient().auth.signUp({
      ...parsed.data,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin,
      },
    });
    if (error)
      throw new AppError(
        400,
        "Création impossible pour le moment. Vérifie si ton compte existe déjà, puis réessaie plus tard.",
      );
    return json({
      message:
        "Consulte ta boîte e-mail pour confirmer ton compte, puis connecte-toi ici.",
    });
  } catch (e) {
    return errorResponse(e);
  }
}
