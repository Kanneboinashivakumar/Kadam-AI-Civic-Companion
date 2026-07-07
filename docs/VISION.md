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
- Authentication / login
- Persistent database (session state only)
- Voice input/output
- Real government API integrations
- File upload / OCR
- Multi-user features
