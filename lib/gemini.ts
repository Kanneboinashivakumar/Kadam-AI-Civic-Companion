import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!client) {
    client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return client;
}

// One call pattern for the whole app: structured JSON output against a schema.
// `system` carries the reasoning-engine prompt, `prompt` the user's message.
export async function generate(
  prompt: string,
  schema: unknown,
  system?: string
): Promise<string> {
  const ai = getClient();
  const res = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: system,
      responseMimeType: "application/json",
      responseJsonSchema: schema,
      // Fast classification + generation matters more than deep deliberation
      // in a live demo; disable thinking for latency.
      thinkingConfig: { thinkingBudget: 0 },
      abortSignal: AbortSignal.timeout(30_000),
    },
  });
  return res.text ?? "";
}
