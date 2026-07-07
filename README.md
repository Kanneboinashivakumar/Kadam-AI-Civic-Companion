<p align="center">
  <img src="https://img.shields.io/badge/Kadam-AI_Civic_Companion-E0932F?style=for-the-badge&labelColor=14213D" alt="Kadam" />
</p>

<h1 align="center">कदम · Kadam</h1>

<p align="center">
  <strong>One AI reasoning engine. Five civic outcomes. Six languages. Zero logins.</strong>
</p>

<p align="center">
  <a href="https://kadam-ai-civic-companion.vercel.app/"><img src="https://img.shields.io/badge/▶_Live_Demo-kadam--ai-E0932F?style=flat-square" alt="Live Demo" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Next.js-16-000?style=flat-square&logo=nextdotjs" alt="Next.js" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Gemini_2.5-Flash-4285F4?style=flat-square&logo=google" alt="Gemini" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript" alt="TypeScript" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-1F6F5C?style=flat-square" alt="MIT License" /></a>
</p>

<p align="center">
  <a href="https://kadam-ai-civic-companion.vercel.app/">🔗 <strong>Live Demo</strong></a> · 
  <a href="#-demo-script">🎬 Demo Script</a> · 
  <a href="#-run-locally">🚀 Run Locally</a> · 
  <a href="#-architecture">🏗️ Architecture</a>
</p>

---

## 🎯 What is Kadam?

**Kadam** (_Hindi: कदम — "a step forward"_) is an AI-powered civic companion built for the **Smart Bharat – AI-Powered Civic Companion** challenge.

Citizens describe their situation in **plain language**, in **their own language**. A single Gemini-powered reasoning engine classifies the intent and generates one of **five distinct structured outputs** — not a generic chatbot wall of text:

| Output Type | What it delivers |
|---|---|
| 🗺️ **Life-Event Journey** | Step-by-step government process with documents, costs, timelines, and reasoning |
| 📝 **Complaint Draft** | Ready-to-file complaint with department routing, severity, and next steps |
| ✅ **Scheme Match** | Personalized government scheme recommendations with eligibility reasoning |
| 📄 **Document Guidance** | What a document is for, how to obtain it, typical cost and time |
| 💬 **Follow-up Answer** | Context-aware answers grounded in the previous response |

---

## 🏆 Why Kadam Wins

Many AI civic solutions focus on **reactive question-answering** — the user asks, the bot replies with a paragraph.

**Kadam takes a fundamentally different approach** by transforming citizen problems into **structured, actionable workflows**:

| Traditional Civic AI | Kadam |
|---|---|
| Generic chatbot responses | 5 distinct, structured output types |
| User must know what to ask | AI classifies intent and decides the output format |
| Text wall replies | Labeled cards with steps, costs, timelines, documents |
| English-only or basic translation | Full 6-language support (UI + AI responses) |
| Spinner → dump | Staggered reveal — steps appear as if AI is reasoning in real-time |
| Requires account/database | Zero login, session-only, nothing stored |

> **The signature moment:** When a citizen types _"I just had a baby"_, Kadam doesn't reply with a paragraph. It generates a **7-step journey** with specific documents, fees, timelines, reasoning for each step, and matching government schemes — all rendered as a distinct, copyable, structured card.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  User types situation in plain language (any of 6 languages)│
└──────────────────────────┬──────────────────────────────────┘
                           │
                    POST /api/generate
                           │
              ┌────────────▼────────────┐
              │   Google Gemini 2.5     │
              │   Flash (Structured     │
              │   JSON Output)          │
              │                         │
              │  1. Classifies intent   │
              │  2. Generates payload   │
              │  3. Returns typed JSON  │
              └────────────┬────────────┘
                           │
              ┌────────────▼────────────┐
              │   ResponseRenderer      │
              │   switches on `type`    │
              │   discriminator         │
              └────────────┬────────────┘
                           │
         ┌─────────┬───────┼───────┬──────────┐
         ▼         ▼       ▼       ▼          ▼
    Journey   Complaint  Scheme  Document  Follow-up
    Stepper    Card      List    Guidance   Answer
```

**One route. One Gemini call. Five distinct UIs.** No chatbot. No message history. No database.

---

## 🤖 AI Implementation Details

### Single-Call Structured Output

Kadam uses **Google Gemini 2.5 Flash** with the `responseSchema` parameter to enforce typed JSON output. This means:

1. **Intent classification and content generation happen in a single API call** — no separate classifier + generator pipeline
2. **The response is guaranteed valid JSON** matching our TypeScript types — no parsing, no regex, no retries
3. **A `type` discriminator field** (`journey` | `complaint` | `scheme` | `document` | `followup`) lets the frontend route to the correct UI component

### Prompt Engineering

```
System prompt structure:
├── Role definition (Indian civic expert)
├── Unified JSON schema (all 5 response types)
├── Classification rules (which type for which situation)
├── Quality rules (real documents, real departments, reasoning)
└── Language directive (CRITICAL: respond entirely in {language})
```

The language directive is injected at the **end** of the system prompt as a `CRITICAL DIRECTIVE` to ensure Gemini generates all natural-language content (step titles, descriptions, reasoning) in the selected language — while the JSON structure keys remain in English for type safety.

### Graceful Fallbacks

If Gemini is unavailable (no API key, rate limit, network error), pre-generated hardcoded responses in `lib/fallbacks.ts` are silently served. **Every feature remains demoable without an API key.** No error screens, no spinners, no broken states.

---

## ✨ Key Features

- **Single reasoning engine** — Gemini classifies intent AND generates structured output in one call
- **Multilingual UI + AI responses** — English, Hindi, Telugu, Tamil, Bengali, Marathi
- **Staggered reveal animations** — Steps appear one-by-one as if the AI is reasoning in real-time
- **Copy-to-clipboard** — One-click copy of journey steps or complaint drafts
- **Graceful fallbacks** — Pre-generated responses if Gemini is unavailable; never shows errors
- **Zero infrastructure** — No auth, no database, no login, nothing stored, session-only
- **6 production dependencies** — Intentionally lean; no component libraries, no state management

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) | Server-side API route + client-side UI in one project |
| AI | **Google Gemini 2.5 Flash** | Structured JSON output via `responseSchema` — typed, not parsed |
| Styling | **Tailwind CSS v4** | Design tokens via CSS variables, no config file needed |
| Animation | **Framer Motion** | Staggered step reveals, spring-based chip interactions |
| Icons | **Lucide React** | Consistent, tree-shakeable icon set |
| Language | **TypeScript 6** | End-to-end type safety from schema to UI |
| Deploy | **Vercel** | Zero-config Next.js deployment |

---

## 📋 Challenge Requirements Coverage

| # | Requirement | How Kadam addresses it |
|---|---|---|
| 1 | Natural language understanding | Gemini classifies intent from free-form text in 6 languages |
| 2 | Step-by-step journey | `JourneyStepper` renders ordered steps with docs, cost, time |
| 3 | Complaint drafting | `ComplaintCard` generates ready-to-file text with department routing |
| 4 | Scheme recommendations | `SchemeList` matches schemes with personalized eligibility reasoning |
| 5 | Document guidance | `DocumentGuidance` explains purpose, process, cost, timeline |
| 6 | Follow-up capability | `FollowupThread` keeps answers grounded in previous context |
| 7 | Multilingual support | 6 languages for UI labels AND AI-generated content |
| 8 | Accessibility | Semantic HTML, ARIA labels, keyboard-navigable, high contrast |

---

## 🎬 Demo Script (90 seconds)

| Step | Action | What to show |
|---|---|---|
| **1** | Type _"I just had a baby in Karnataka"_ | → Journey with 5–7 steps, documents, costs, scheme recommendations |
| **2** | Ask follow-up _"What if I don't have an Aadhaar card?"_ | → Grounded answer referencing the journey above |
| **3** | Type _"broken streetlight on my road for 2 weeks"_ | → Complaint draft with department, severity, ready-to-copy text |
| **4** | Click _"What am I eligible for?"_ chip | → Scheme matches with personalized eligibility reasoning |
| **5** | Switch language to **Hindi** or **Telugu** | → Entire UI + AI response regenerates in selected language |

---

## 🚀 Run Locally

```bash
# 1. Clone
git clone https://github.com/Kanneboinashivakumar/Kadam-AI-Civic-Companion.git
cd Kadam-AI-Civic-Companion

# 2. Install dependencies
npm install

# 3. Add your Gemini API key
echo "GEMINI_API_KEY=your_key_here" > .env.local

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app works without an API key using built-in fallback responses.

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes (for live AI) | Google Gemini API key from [AI Studio](https://aistudio.google.com/) |

> **Note:** Without `GEMINI_API_KEY`, the app gracefully falls back to pre-generated demo responses — every feature remains demoable.

---

## 🚢 Deployment

Kadam is deployed on **Vercel** with zero configuration:

```bash
# Option 1: Vercel CLI
npm i -g vercel
vercel --prod

# Option 2: GitHub Integration
# 1. Push to GitHub
# 2. Import repo at vercel.com/new
# 3. Add GEMINI_API_KEY in Environment Variables
# 4. Deploy
```

### Vercel Environment Variables

| Variable | Value |
|---|---|
| `GEMINI_API_KEY` | Your Google Gemini API key |

**Live deployment:** [kadam-ai-civic-companion.vercel.app](https://kadam-ai-civic-companion.vercel.app/)

---

## 📁 Project Structure

```
kadam/
├── app/
│   ├── api/generate/route.ts       # Single API route — Gemini call + fallback
│   ├── layout.tsx                   # Root layout with fonts + metadata
│   └── page.tsx                     # Homepage — hero, input, response rendering
├── components/
│   ├── companion/                   # Feature components
│   │   ├── JourneyStepper.tsx       # Step-by-step journey with stagger reveal
│   │   ├── ComplaintCard.tsx        # Complaint draft with copy button
│   │   ├── SchemeList.tsx           # Scheme matches with eligibility reasoning
│   │   ├── ResponseRenderer.tsx     # Router + DocumentGuidance + FollowupAnswer
│   │   ├── FollowupThread.tsx       # Context-aware follow-up Q&A
│   │   ├── InputBar.tsx             # Text input + language selector
│   │   └── SuggestionChips.tsx      # Quick-start suggestion pills
│   └── ui/                          # Primitives (Card, Badge, Button, Chip)
├── lib/
│   ├── gemini.ts                    # Gemini SDK client wrapper
│   ├── prompts.ts                   # System prompt + suggestion chips
│   ├── schema.ts                    # TypeScript types + Gemini responseSchema
│   └── fallbacks.ts                 # Pre-generated fallback responses
├── styles/globals.css               # Design tokens + Tailwind v4 theme
└── docs/                            # Architecture, prompts, vision, tasks
```

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#F7F7F5` | Page background (warm off-white) |
| `--ink` | `#14213D` | Primary text (deep navy) |
| `--accent` | `#E0932F` | Marigold accent — buttons, highlights, logo |
| `--success` | `#1F6F5C` | Scheme matches, confirmations |
| `--border` | `#E4E2DC` | Card borders, dividers |
| Display font | Fraunces | Headlines and section titles |
| Body font | IBM Plex Sans | All body text |
| Mono font | IBM Plex Mono | Badges, metadata, costs |

Design philosophy: **Calm, editorial, government-friendly.** Inspired by Linear, Notion, and Stripe — not a generic chatbot UI.

---

## 🌐 Supported Languages

| Language | UI Labels | AI Responses | Script |
|---|---|---|---|
| English | ✅ | ✅ | Latin |
| Hindi (हिन्दी) | ✅ | ✅ | Devanagari |
| Telugu (తెలుగు) | ✅ | ✅ | Telugu |
| Tamil (தமிழ்) | ✅ | ✅ | Tamil |
| Bengali (বাংলা) | ✅ | ✅ | Bengali |
| Marathi (मराठी) | ✅ | ✅ | Devanagari |

---

## 🔮 Future Scope

- **Voice input** — Allow citizens to speak their situation instead of typing (Web Speech API)
- **Offline mode** — Cache fallback responses via Service Worker for areas with poor connectivity
- **Real government API integration** — Connect to actual e-Governance portals for live data (fees, office hours, application status)
- **Document upload & OCR** — Let users photograph government documents for instant explanation
- **Regional language expansion** — Kannada, Malayalam, Gujarati, Punjabi, Odia, Assamese
- **SMS/WhatsApp interface** — Reach citizens who don't have app/browser access
- **Analytics dashboard** — Anonymized, aggregate insights for civic bodies on common citizen needs
- **Accessibility enhancements** — Screen reader optimizations, high-contrast mode, font scaling

---

## ⚠️ Disclaimer

Kadam generates AI-powered guidance using Google Gemini. Responses are informational and may be incomplete or inaccurate. **Always verify fees, deadlines, and procedures with your local government office before acting.** No data is stored — the app is session-only with no login or persistence.

---

## 📄 License

[MIT](LICENSE) © 2026 Kadam Team

---

<p align="center">
  <sub>Built with ♥ for the Smart Bharat challenge</sub>
</p>