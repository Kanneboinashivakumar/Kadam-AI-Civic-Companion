<!-- Internal reference only — not for GitHub -->
# PROJECT_OVERVIEW.md
*Internal reference only — not for GitHub.*

Welcome to the Kadam project! This document is designed for new developers joining the team. It explains the project's goals, core architecture, features, and file structure in plain, beginner-friendly language.

---

## 1. The Problem Statement
Citizens frequently struggle to navigate complex, fragmented, and bureaucratic government processes in India. Finding the right forms, understanding eligibility requirements for schemes, and writing formal complaints can be incredibly overwhelming, especially when official portals are only available in English or contain dense legal text. Kadam aims to solve this by providing an AI-powered civic companion that answers questions in plain language across multiple regional Indian languages.

---

## 2. Kadam's Core Idea
Instead of building a typical chatbot that returns long walls of text, Kadam uses a single AI reasoning engine to analyze the user's intent and generate one of **five structured outcomes**. The interface displays these outcomes as clean, interactive, and copyable cards. This keeps responses structured, direct, and actionable, with clear steps, costs, timelines, and forms.

---

## 3. Walkthrough of the 5 Response Types
Every response from the engine matches a specific category. Here is what each type does and which React component handles its layout:

1. **Life-Event Journey (`journey`)**
   - *What it does*: Renders a step-by-step government workflow showing what to do, required documents, fees, and processing times.
   - *Component*: [JourneyStepper.tsx](file:///c:/coding/kadam/components/companion/JourneyStepper.tsx)
2. **Complaint Draft (`complaint`)**
   - *What it does*: Generates a pre-written formal complaint letter ready to copy-paste, including the appropriate government department routing and a severity level.
   - *Component*: [ComplaintCard.tsx](file:///c:/coding/kadam/components/companion/ComplaintCard.tsx)
3. **Scheme Match (`scheme`)**
   - *What it does*: Matches the citizen's situation with official government schemes, offering eligibility reasonings and instructions on how to apply.
   - *Component*: [SchemeList.tsx](file:///c:/coding/kadam/components/companion/SchemeList.tsx)
4. **Document Guidance (`document`)**
   - *What it does*: Explains what a specific document is used for, who issues it, the typical cost, processing time, and steps to get it.
   - *Component*: `DocumentGuidance` (defined internally within [ResponseRenderer.tsx](file:///c:/coding/kadam/components/companion/ResponseRenderer.tsx))
5. **Follow-up Answer (`followup`)**
   - *What it does*: Allows context-aware follow-up questions to dig deeper into the previous answer.
   - *Component*: `FollowupAnswer` (defined internally within [ResponseRenderer.tsx](file:///c:/coding/kadam/components/companion/ResponseRenderer.tsx))

---

## 4. Single-API-Route Architecture (Request Flow)
Here is how a request travels through Kadam from typing to rendering:

1. **User types a query**: The user enters their situation into [InputBar.tsx](file:///c:/coding/kadam/components/companion/InputBar.tsx) (e.g., *"I lost my job"*).
2. **State handles submission**: The request triggers the `ask` function in [page.tsx](file:///c:/coding/kadam/app/page.tsx), setting the page to a loading state.
3. **API call**: The app issues a `POST` request to `/api/generate` with the message text, selected language, and any prior context.
4. **AI Reasoning**: The Next.js route handler ([route.ts](file:///c:/coding/kadam/app/api/generate/route.ts)) calls Gemini 2.5 Flash, feeding it a system prompt and a schema matching the `CompanionResponse` type definition. 
5. **Intent and payload**: Gemini decides which of the 5 response types fits best and generates a matching structured JSON payload.
6. **Grounding pass**: Before sending the JSON back, the server checks if any schemes mentioned by Gemini match our verified scheme database. If a match is found, it labels it as officially grounded.
7. **Switching & rendering**: The JSON lands in the client-side [ResponseRenderer.tsx](file:///c:/coding/kadam/components/companion/ResponseRenderer.tsx), which switches on the `type` discriminator (e.g. `"journey"`, `"scheme"`) and mounts the correct card layout.

---

## 5. Feature walkthrough (In Order of Development)

### 1. Real Scheme Data Grounding
- *What it is*: Grounding means verifying the AI's suggestions against an authoritative list. Instead of letting Gemini invent fake government schemes, we match scheme names against a curated list of 16 real Government of India schemes.
- *Where it lives*: The database of schemes and keywords lives in [schemes.ts](file:///c:/coding/kadam/lib/data/schemes.ts).
- *Why it matters*: Prevents hallucinated suggestions and ensures citizens only see real, actionable programs they can actually apply for.

### 2. Voice Input
- *What it is*: Allows citizens to click a microphone button and speak their situation in their native language instead of typing.
- *How it works*: Utilizes the browser's native `SpeechRecognition` API (part of the Web Speech API) to transcribe voice to text client-side.
- *Caveat*: Browser support is limited. It works best in Chrome and Safari; in unsupported browsers, the microphone button is hidden automatically.

### 3. Confidence and Trust Badges
- *What it is*: Displays inline badges next to schemes in the scheme list.
- *Meaning*: 
  - **"Verified" (Green)**: The scheme matches our curated database and lists its official source (e.g., *Ministry of Finance*).
  - **"AI-generated estimate" (Neutral)**: The scheme was generated by the model but could not be mapped to our curated list. It signals to the user that they should take extra care to verify it.

### 4. React Error Boundary
- *What it is*: A safety wrapper around card rendering.
- *Why it matters*: If a bug or bad payload causes one specific response component (e.g., `SchemeList` or `JourneyStepper`) to crash, the Error Boundary catches the error. It renders a clean error card (*"Something went wrong displaying this response."*) instead of crashing the entire page.

### 5. Automated Test Suite
- *What it is*: Offline tests written in Vitest to run automatically on commits/CI.
- *Coverage*:
  - **API Route**: Verifies the endpoint returns valid JSON shapes, handles language requests, empty inputs, and context-aware follow-ups.
  - **Components**: Tests that `InputBar`, `ResponseRenderer`, and `SuggestionChips` render and handle clicks/speech recognition states correctly.
  - **Grounding & Session**: Tests scheme matching, name annotations, and language system prompt constructions. Also mock-tests local storage read/write states.

### 6. Session Persistence & Insights (Stage 4)
- *What it is*: Saves the user's progress and usage history locally.
- *How it works*: 
  - Saves the active response, message, language, and thread items to `localStorage` under `kadam:lastSession`.
  - On page load, it displays a small card offering to restore the previous state or dismiss it.
  - Counts the number of times each response type was generated, showing an understated *"Most requested: X"* line in the footer.
  - Includes a *"Clear my data"* link to erase all session history.

### 7. Location-Aware Postal PIN Code API Parsing
- *What it is*: Automatically parses queries for 6-digit Indian PIN codes and fetches their location details.
- *How it works*: 
  - Extracts 6-digit PIN codes from user queries via regular expressions.
  - Queries the free, public Postal PIN Code API (`https://api.postalpincode.in/pincode/{PIN}`) to resolve the associated District and State.
  - Dynamically injects this location context into the Gemini system prompt, making the model's response (such as department routing or state eligibility) highly location-aware.
  - Employs a 2-second timeout and abort controllers to prevent remote API latency from slowing down user responses.

---

## 6. Quick Start: Files to Read First
If you are new to the project, open these files in the following order to understand how the codebase works:

1. [schema.ts](file:///c:/coding/kadam/lib/schema.ts): Understand the structured JSON formats the AI returns.
2. [route.ts](file:///c:/coding/kadam/app/api/generate/route.ts): Inspect how requests land and call the Gemini API.
3. [page.tsx](file:///c:/coding/kadam/app/page.tsx): Learn the main page's state flow and layout.
4. [ResponseRenderer.tsx](file:///c:/coding/kadam/components/companion/ResponseRenderer.tsx): See how card rendering is split up.
5. [schemes.ts](file:///c:/coding/kadam/lib/data/schemes.ts): Examine how government scheme matching works.

---

## 7. Known Limitations & Gaps
While the application is fully functional, please keep these limitations in mind:
- **Small Curated Dataset**: Grounding is currently restricted to 16 schemes. Real-world scaling would require integrating hundreds of schemes.
- **Web Speech Limits**: Voice recognition does not work offline and works differently across Chrome, Firefox, and Safari.
- **No Backend Database**: All session storage is purely local (`localStorage`). Clearing browser history or switching devices will wipe the user's session.
