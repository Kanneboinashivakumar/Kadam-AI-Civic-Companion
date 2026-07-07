# HANDOFF.md — Read This First

If you are an AI agent picking up this project cold, with no prior conversation history, read in this order:

1. **VISION.md** — what we're building and why, and the requirement-mapping table (do not lose coverage of any row)
2. **ARCHITECTURE.md** — stack, folder structure, data flow, design tokens
3. **PROMPTS.md** — the exact system prompt and schemas in use; do not invent a different prompt, use this one
4. **TASKS.md** — find the first unchecked `[ ]` item, resume there

## Non-negotiable constraints (do not relitigate these mid-build)
- One API route, one Gemini call pattern, five response types via a `type` discriminator
- No auth, no database, no voice, no file upload — session state only
- No shadcn/ui, no Redux/Zustand — hand-written Tailwind components + React state
- Every response type must have a corresponding on-screen, labeled, distinct UI component — never render everything as generic chat bubbles
- Last 30 minutes are reserved for polish only — do not start new features inside that window

## If something is ambiguous
Default to the smaller, faster, more reliable option. This is a 4-hour build. A working simple version beats a half-built ambitious one every time.
