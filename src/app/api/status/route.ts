import { json } from "@/lib/server";
export async function GET() {
  return json({
    ai: !!process.env.DEEPSEEK_API_KEY,
    cloud: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    model: "DeepSeek V4.1 Flash",
  });
}
