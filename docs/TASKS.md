# TASKS.md — Living Checklist

Update the status of each item as you go. If you are a fresh AI agent picking this up, find the first `[ ]` unchecked item — that's where to resume.

## Setup
- [ ] Scaffold Next.js app (App Router, loose TS)
- [ ] Install: `@google/genai`, `framer-motion`, `lucide-react`
- [ ] Add Fraunces, IBM Plex Sans, IBM Plex Mono via `next/font`
- [ ] Set up `.env.local` with Gemini API key (never commit this)
- [ ] Add design tokens to `styles/globals.css`

## Core engine
- [ ] Write `lib/schema.ts` (response types, matches PROMPTS.md exactly)
- [ ] Write `lib/prompts.ts` (copy prompt verbatim from PROMPTS.md)
- [ ] Write `lib/gemini.ts` (SDK wrapper, structured output mode)
- [ ] Write `app/api/generate/route.ts`
- [ ] Test raw JSON output for all 5 types manually before building UI

## UI
- [ ] Build `components/ui/*` primitives (Button, Card, Badge, Chip)
- [ ] Build `InputBar.tsx` + `SuggestionChips.tsx`
- [ ] Build `ResponseRenderer.tsx` (switches on `type`)
- [ ] Build `JourneyStepper.tsx` with Framer Motion staggered reveal (signature moment)
- [ ] Build `ComplaintCard.tsx`
- [ ] Build `SchemeList.tsx`
- [ ] Build `FollowupThread.tsx`
- [ ] Wire language toggle (re-calls same route with `language` param)

## Reliability
- [ ] Write `lib/fallbacks.ts` with 2 pre-generated known-good responses
- [ ] Wire try/catch: live call failure silently swaps to fallback
- [ ] Strip markdown fences defensively before JSON.parse, just in case

## Polish (last 30 min — do not skip, do not start early)
- [ ] Spacing/typography pass against design tokens
- [ ] Mobile responsive check
- [ ] Remove all placeholder/lorem ipsum content — real Indian civic examples only
- [ ] Verify every row in VISION.md's requirement-mapping table has an on-screen moment

## Deploy
- [ ] Push to GitHub, connect Vercel, verify env var is set on Vercel too
- [ ] Final smoke test on deployed URL, not just localhost
