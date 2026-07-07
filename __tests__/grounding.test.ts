import { expect, test } from "vitest";
import {
  CURATED_SCHEME_NAMES,
  CURATED_SCHEMES,
  selectSchemesForMessage,
  groundSchemeMatches,
} from "@/lib/data/schemes";
import { FALLBACK_SCHEME } from "@/lib/fallbacks";
import { buildSystemPrompt } from "@/lib/prompts";

// A scheme response must only ever recommend schemes drawn from the curated
// real-scheme dataset — no AI-invented scheme names slip through. Exercised via
// the offline fallback path that CI actually hits (no live Gemini call).
test("scheme response only contains schemes from the curated dataset", () => {
  expect(FALLBACK_SCHEME.type).toBe("scheme");
  expect(FALLBACK_SCHEME.matches.length).toBeGreaterThan(0);

  for (const match of FALLBACK_SCHEME.matches) {
    expect(CURATED_SCHEME_NAMES.has(match.name)).toBe(true);
    expect(match.grounded).toBe(true);
    expect(typeof match.source).toBe("string");
    expect((match.source ?? "").length).toBeGreaterThan(0);
  }
});

test("selectSchemesForMessage matching keywords to tags and fallback", () => {
  // 1. Tag matching: "baby" should match "childbirth" tags
  const babyMatches = selectSchemesForMessage("I just had a baby in Karnataka");
  expect(babyMatches.length).toBeGreaterThan(0);
  expect(babyMatches.some(s => s.name === "Pradhan Mantri Matru Vandana Yojana (PMMVY)")).toBe(true);
  expect(babyMatches.some(s => s.name === "Janani Suraksha Yojana (JSY)")).toBe(true);

  // 2. Fallback matching: unrelated query should return all curated schemes
  const fallbackMatches = selectSchemesForMessage("random query about nothing");
  expect(fallbackMatches.length).toBe(CURATED_SCHEMES.length);
});

test("groundSchemeMatches authoritatively grounds matches", () => {
  const matches = [
    {
      name: "Sukanya Samriddhi Yojana",
      eligibility_reasoning: "Reasoning",
      benefit_summary: "Benefit",
    },
    {
      name: "Fake Scheme That Does Not Exist",
      eligibility_reasoning: "Reasoning",
      benefit_summary: "Benefit",
    }
  ];

  const grounded = groundSchemeMatches(matches);
  expect(grounded[0].grounded).toBe(true);
  expect(grounded[0].source).toContain("Ministry of Finance");
  expect(grounded[1].grounded).toBe(false);
  expect(grounded[1].source).toBeUndefined();
});

test("buildSystemPrompt contains language directive for non-English request", () => {
  const prompt = buildSystemPrompt("Hindi");
  expect(prompt).toContain("CRITICAL DIRECTIVE: Respond entirely in Hindi");

  const teluguPrompt = buildSystemPrompt("Telugu");
  expect(teluguPrompt).toContain("CRITICAL DIRECTIVE: Respond entirely in Telugu");
});
