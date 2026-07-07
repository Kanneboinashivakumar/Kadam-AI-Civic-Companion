# ARCHITECTURE.md

## Stack
- **Framework**: Next.js 14+ (App Router), JS-first with loose TypeScript (no strict mode)
- **Styling**: Tailwind CSS, hand-written components — no shadcn/ui, no component library
- **Animation**: Framer Motion (staggered reveals for the signature streaming effect)
- **Icons**: lucide-react
- **State**: React state + Context only — no Redux/Zustand
- **AI**: `@google/genai` SDK, single API route, Gemini structured output via `responseSchema` (never hand-parse raw JSON text)
- **Deploy**: Vercel, zero-config

## Data flow
```
User types/selects prompt
   -> POST /api/generate { message, language, contextHistory }
   -> Gemini call with system prompt from lib/prompts.ts
   -> Gemini classifies intent AND generates structured payload in ONE call
   -> Response shape: { type: "journey"|"complaint"|"scheme"|"document"|"followup", ...payload }
   -> ResponseRenderer switches on `type`, renders the matching component
   -> Component streams in via Framer Motion staggered children
```

One route. One schema family. Two calls max in the whole app (main generate call + optional scoped follow-up call using the same route with a `context` field).

## Folder structure
```
/app
  /api/generate/route.ts
  /page.tsx
/components
  /ui                 -> Button.tsx, Card.tsx, Badge.tsx, Chip.tsx (5 files, hand-written)
  /companion
    InputBar.tsx
    SuggestionChips.tsx
    ResponseRenderer.tsx
    JourneyStepper.tsx
    ComplaintCard.tsx
    SchemeList.tsx
    FollowupThread.tsx
/lib
  gemini.ts           -> SDK client wrapper, one exported function: generate(prompt, schema)
  schema.ts           -> shared response types/schema definitions (single source of truth)
  prompts.ts          -> all system prompts live here, nowhere else
/styles/globals.css   -> design tokens as CSS custom properties
/docs                 -> this documentation set
```

## Design tokens (CSS variables in globals.css)
```css
:root {
  --bg: #F7F7F5;
  --ink: #14213D;
  --accent: #E0932F;
  --success: #1F6F5C;
  --border: #E4E2DC;
  --font-display: 'Fraunces', serif;
  --font-body: 'IBM Plex Sans', sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;
}
```
Rounded-md corners only. No gradients. No drop shadows beyond 1px hairline borders. No glassmorphism.

## Reliability rule
Pre-generate and hardcode 2 known-good full responses (one journey, one complaint) as fallback JSON in `lib/fallbacks.ts`. If the live Gemini call fails or times out during demo, silently swap to fallback data — never show a raw error screen during judging.
