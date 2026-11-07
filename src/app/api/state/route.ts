import {
  AppError,
  errorResponse,
  json,
  ownerClient,
  readJson,
} from "@/lib/server";
import { stateSchema } from "@/lib/validation";
import { z } from "zod";
export async function GET(request: Request) {
  try {
    const { client, user } = await ownerClient(request);
    const { data, error } = await client
      .from("learning_state")
      .select("state,revision")
      .eq("user_id", user.id)
      .maybeSingle();
    if (error)
      throw new AppError(
        503,
        "La sauvegarde cloud est temporairement indisponible.",
      );
    return json(data ?? { state: null, revision: 0 });
  } catch (e) {
    return errorResponse(e);
  }
}
export async function PUT(request: Request) {
  try {
    const { client } = await ownerClient(request);
    const parsed = z
      .object({ state: stateSchema, revision: z.number().int().min(0) })
      .safeParse(await readJson(request, 4000000));
    if (!parsed.success)
      throw new AppError(
        400,
        "La progression ne respecte pas le format attendu.",
      );
    const { data, error } = await client.rpc("save_learning_state", {
      new_state: parsed.data.state,
      expected_revision: parsed.data.revision,
    });
    if (error)
      throw new AppError(
        503,
        "L’enregistrement cloud n’a pas abouti. La copie locale est conservée.",
      );
    if (data === null)
      throw new AppError(
        409,
        "Une autre version a été enregistrée. Choisis la version à conserver dans les réglages.",
      );
    return json({ revision: data });
  } catch (e) {
    return errorResponse(e);
  }
}
