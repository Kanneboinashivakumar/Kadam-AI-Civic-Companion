import { generate } from "@/lib/gemini";
import { RESPONSE_JSON_SCHEMA } from "@/lib/schema";
import { buildSystemPrompt } from "@/lib/prompts";
import { getFallback } from "@/lib/fallbacks";

// Gemini is told not to emit fences and structured output mode shouldn't
// produce them, but strip defensively — one stray ```json must not kill a demo.
function stripFences(text: string): string {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
}

export async function POST(request: Request) {
  let message = "";
  let hasContext = false;
  try {
    const body = await request.json();
    message = body.message ?? "";
    const language = body.language ?? "English";
    const context = body.context;
    hasContext = Boolean(context);

    if (!message.trim()) {
      return Response.json({ error: "Empty message" }, { status: 400 });
    }

    const system = buildSystemPrompt(language, context);
    const raw = await generate(message, RESPONSE_JSON_SCHEMA, system);
    const data = JSON.parse(stripFences(raw));

    if (!data || typeof data.type !== "string") {
      throw new Error("Response missing type discriminator");
    }
    return Response.json(data);
  } catch (err) {
    console.error("generate route falling back:", err);
    return Response.json(getFallback(message, hasContext));
  }
}
