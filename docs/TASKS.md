# TASKS.md — Living Checklist

Update the status of each item as you go. If you are a fresh AI agent picking this up, find the first `[ ]` unchecked item — that's where to resume.

## Setup
- [x] Scaffold Next.js app (App Router, loose TS)
- [x] Install: `@google/genai`, `framer-motion`, `lucide-react`
- [x] Add Fraunces, IBM Plex Sans, IBM Plex Mono via `next/font`
- [x] Set up `.env.local` with Gemini API key (never commit this) — **placeholder created; paste real key into `.env.local` (`GEMINI_API_KEY=...`)**
- [x] Add design tokens to `styles/globals.css`

## Core engine
- [x] Write `lib/schema.ts` (response types, matches PROMPTS.md exactly)
- [x] Write `lib/prompts.ts` (copy prompt verbatim from PROMPTS.md)
- [x] Write `lib/gemini.ts` (SDK wrapper, structured output mode via `responseJsonSchema` anyOf)
- [x] Write `app/api/generate/route.ts`
- [ ] Test raw JSON output for all 5 types manually before building UI — **blocked on real API key; fallback path verified end-to-end (journey + complaint served correctly on failure)**

## UI
- [x] Build `components/ui/*` primitives (Button, Card, Badge, Chip)
- [x] Build `InputBar.tsx` + `SuggestionChips.tsx`
- [x] Build `ResponseRenderer.tsx` (switches on `type`; renders Document Guidance + Followup Answer inline)
- [x] Build `JourneyStepper.tsx` with Framer Motion staggered reveal (signature moment)
- [x] Build `ComplaintCard.tsx` (with copy-to-clipboard for the ready-to-file draft)
- [x] Build `SchemeList.tsx`
- [x] Build `FollowupThread.tsx`
- [x] Wire language toggle (re-calls same route with `language` param; re-runs last message on change)

## Reliability
- [x] Write `lib/fallbacks.ts` with 2 pre-generated known-good responses (+ a followup fallback so scoped questions degrade coherently too)
- [x] Wire try/catch: live call failure silently swaps to fallback (verified: 403 without key → correct fallback served, HTTP 200)
- [x] Strip markdown fences defensively before JSON.parse, just in case

## Polish (last 30 min — do not skip, do not start early)
- [x] Spacing/typography pass against design tokens (Fraunces display / Plex Sans body / Plex Mono metadata; rounded-md; hairline borders only)
- [x] Mobile responsive check (InputBar stacks below `sm`, chips wrap, scheme grid collapses to one column)
- [x] Remove all placeholder/lorem ipsum content — real Indian civic examples only (PMMVY, Sukanya Samriddhi, JSY, Baal Aadhaar, municipal streetlight complaint)
- [x] Verify every row in VISION.md's requirement-mapping table has an on-screen moment (see README demo script)

## Deploy
- [ ] Push to GitHub, connect Vercel, verify env var is set on Vercel too — **needs your GitHub/Vercel account; `next build` passes clean locally**
- [ ] Final smoke test on deployed URL, not just localhost

## Blocked on you (2 minutes)
1. Paste a real Gemini API key into `.env.local` (`GEMINI_API_KEY=...`), restart dev server, then re-verify live JSON for all 5 types via the suggestion chips.
2. Push + connect Vercel, set `GEMINI_API_KEY` in Vercel project settings.

## Next phase (post-hackathon) — tracked work items
Hackathon submission is complete. These move Kadam from demo prototype toward a
more credible, production-leaning tool. Do in order; see VISION.md for rationale
and ARCHITECTURE.md for where each plugs into the existing single-route design.

- [x] **Real data grounding (first pass)** — curated real-scheme dataset in
      `lib/data/schemes.ts`; `/api/generate` injects the relevant subset into the
      prompt before the Gemini call and annotates returned schemes with
      `grounded`/`source` after, so scheme/journey recommendations come from real
      data instead of pure generation (reduces hallucination risk)
- [ ] **Voice input (Web Speech API)** — client-side mic capture in `InputBar`
      that transcribes into the existing text field; locale follows the language
      selector for regional-language input (accessibility)
- [ ] **Confidence / verification indicator (UI)** — schema markers exist and are
      populated (`grounded`/`source`); build the badge in the scheme UI to show
      dataset-backed vs AI-inferred matches
- [ ] **(Stretch, not yet scheduled)** optional client-side session save
      (`localStorage`, no DB) and anonymized, aggregate usage insights
