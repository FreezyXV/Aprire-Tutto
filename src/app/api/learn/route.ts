import {
  AppError,
  errorResponse,
  json,
  ownerClient,
  readJson,
} from "@/lib/server";
import { learnRequestSchema } from "@/lib/validation";
import { runLearning } from "@/lib/deepseek";
export const maxDuration = 180;
export async function POST(request: Request) {
  try {
    const { client } = await ownerClient(request);
    const parsed = learnRequestSchema.safeParse(await readJson(request, 25000));
    if (!parsed.success)
      throw new AppError(400, "La demande est trop longue ou incomplète.");
    if (!process.env.DEEPSEEK_API_KEY)
      throw new AppError(
        503,
        "DeepSeek reste à connecter. Ajoute la clé API dans les variables serveur du projet Vercel.",
      );
    const { data, error } = await client.rpc("reserve_ai", {
      request_id: parsed.data.requestId,
      // Grading shares the tutor allowance (same size limits).
      kind: parsed.data.action === "course" ? "course" : "tutor",
    });
    if (error)
      throw new AppError(
        503,
        "Le contrôle du budget IA est indisponible. Aucun appel payant n’a été lancé.",
      );
    if (data === "duplicate")
      throw new AppError(409, "Cette demande a déjà été envoyée.");
    if (data === "wait")
      throw new AppError(
        429,
        "Patiente vingt secondes entre deux demandes à l’IA.",
        20,
      );
    if (data !== "ok")
      throw new AppError(
        429,
        "L’enveloppe IA du jour ou du mois est atteinte. Les parcours enregistrés restent disponibles.",
      );
    const result = await runLearning(
      parsed.data,
      AbortSignal.any([request.signal, AbortSignal.timeout(165000)]),
    );
    return json(result);
  } catch (e) {
    if (
      e instanceof Error &&
      (e.name === "TimeoutError" || e.name === "AbortError")
    )
      return errorResponse(
        new AppError(
          504,
          "La demande a pris trop de temps. Réessaie plus tard avec un sujet plus précis.",
        ),
      );
    return errorResponse(e);
  }
}
