import { generate } from "@/lib/gemini";
import { RESPONSE_JSON_SCHEMA } from "@/lib/schema";
import { buildSystemPrompt } from "@/lib/prompts";
import { getFallback } from "@/lib/fallbacks";
import { selectSchemesForMessage, groundSchemeMatches } from "@/lib/data/schemes";

// Simple IP-based rate limiting (in-memory)
// Allows up to 10 requests per minute per IP address
const ipCache = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): { allowed: boolean; limit: number; remaining: number } {
  const now = Date.now();
  const limit = 10;
  const windowMs = 60 * 1000; // 1 minute

  const record = ipCache.get(ip);
  if (!record || now > record.resetTime) {
    const nextRecord = { count: 1, resetTime: now + windowMs };
    ipCache.set(ip, nextRecord);
    return { allowed: true, limit, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { allowed: false, limit, remaining: 0 };
  }

  record.count += 1;
  return { allowed: true, limit, remaining: limit - record.count };
}

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
  
  // Resolve client IP from headers
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1";
  const rateLimitResult = checkRateLimit(ip);

  if (!rateLimitResult.allowed) {
    return Response.json(
      { error: "Too many requests. Please try again in a minute." },
      {
        status: 429,
        headers: {
          "Retry-After": "60",
          "X-RateLimit-Limit": rateLimitResult.limit.toString(),
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
        },
      }
    );
  }

  const rateLimitHeaders = {
    "X-RateLimit-Limit": rateLimitResult.limit.toString(),
    "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
  };

  try {
    const body = await request.json();
    message = body.message ?? "";
    const language = body.language ?? "English";
    const context = body.context;
    hasContext = Boolean(context);

    if (!message.trim()) {
      return Response.json({ error: "Empty message" }, { status: 400 });
    }

    if (message.length > 3000) {
      return Response.json({ error: "Message too long (max 3000 characters)" }, { status: 400 });
    }

    // Ground scheme recommendations in the curated real-scheme dataset.
    const grounding = selectSchemesForMessage(message);
    const system = buildSystemPrompt(language, context, grounding);
    const raw = await generate(message, RESPONSE_JSON_SCHEMA, system);
    const data = JSON.parse(stripFences(raw));

    if (!data || typeof data.type !== "string") {
      throw new Error("Response missing type discriminator");
    }

    // Authoritatively mark which recommendations are dataset-grounded vs
    // AI-inferred (additive fields; never trust the model to self-report).
    if (data.type === "scheme" && Array.isArray(data.matches)) {
      data.matches = groundSchemeMatches(data.matches);
    } else if (data.type === "journey" && Array.isArray(data.schemes)) {
      data.schemes = groundSchemeMatches(data.schemes);
    }

    return Response.json(data, {
      headers: {
        "X-Kadam-Engine": "gemini",
        ...rateLimitHeaders,
      },
    });
  } catch (err) {
    console.error("generate route falling back:", err);
    return Response.json(getFallback(message, hasContext), {
      headers: {
        "X-Kadam-Engine": "fallback",
        ...rateLimitHeaders,
      },
    });
  }
}
