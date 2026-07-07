# VISION.md — Smart Bharat AI Civic Companion

## One-line pitch
A single AI reasoning engine that citizens talk to in plain language. It decides, per message, whether the person needs a life-event journey, a complaint drafted, a scheme match, document guidance, or a follow-up — and renders each as a distinct, labeled structured output, not a chat wall.

## Why this beats the obvious chatbot
500+ teams will build reactive Q&A tools (chatbot, scheme finder, complaint form, translator) as separate, obvious features. We build one reasoning engine with visibly distinct structured outputs per intent — proactive, not reactive, and impossible to mistake for a generic chatbot in a 90-second demo.

## Challenge requirement mapping (do not lose this under scope pressure)
| Brief requirement | How we satisfy it | Component |
|---|---|---|
| Simplify govt information | Plain-language reasoning in every output | ResponseRenderer (all types) |
| Answer citizen questions | Follow-up thread, scoped to context | FollowupThread |
| Recommend schemes/services | `scheme` output type with eligibility reasoning | SchemeList |
| Assist with document requirements | `documents[]` embedded in journey + standalone `document` type | JourneyStepper, doc guidance |
| Report/track civic complaints | `complaint` output type — structured draft (dept, category, severity, description) | ComplaintCard |
| Multilingual communication | Language toggle re-runs same schema with `respond in {{language}}` | InputBar language selector |
| Accessibility/transparency | Every output includes plain-language `reasoning` field explaining *why* | shared schema field |

**Rule: every one of these rows must be visibly demoable in the demo script. If a row has no on-screen moment, it doesn't count for judging — fix that before polishing anything else.**

## Signature moment (what judges remember)
Steps/outputs stream in one at a time as the model reasons, not a single dump after a spinner. This visually proves "AI reasoning happening" rather than just claiming it.

## Non-goals (explicitly out of scope — do not build)
> **Historical note:** the list below was the *hackathon-scope* boundary and is
> preserved as-is. Some items are deliberately revisited in the next phase
> (see below) now that the demo is complete — they were correct constraints
> for a 4-hour build, not permanent product decisions.

- Authentication / login
- Persistent database (session state only)
- Voice input/output
- Real government API integrations
- File upload / OCR
- Multi-user features

## Next phase — from demo prototype toward a credible tool
The hackathon submission is complete. The original vision above stays intact as
historical context. The next phase shifts Kadam from "impressive 90-second demo"
toward "something a citizen could actually trust and rely on." Goals, in priority
order:

1. **Real data grounding.** Replace fully-generated scheme and document details
   with references to a real, curated dataset wherever possible, so answers are
   anchored to verifiable facts rather than model recall. This directly reduces
   hallucination risk — the biggest credibility gap in the demo build.
2. **Voice input (Web Speech API).** Let citizens speak their situation instead
   of typing it, for accessibility and easier regional-language input. Revisits
   the "no voice" hackathon non-goal above.
3. **Confidence / verification indicator.** Visibly distinguish answers grounded
   in the curated dataset from AI-generated best guesses, so users know how much
   to trust each output. Extends the existing transparency principle (the
   plain-language `reasoning` field) into a trust signal.
4. **(Stretch, not yet scheduled)** Optional client-side session save and
   anonymized usage insights — no accounts, no server-side personal data;
   purely local persistence plus aggregate, non-identifying signals.

These build on the same single-reasoning-engine architecture rather than
replacing it — see ARCHITECTURE.md for where they plug in, and TASKS.md for the
tracked work items.
