<p align="center">
  <img src="https://img.shields.io/badge/Kadam-AI_Civic_Companion-E0932F?style=for-the-badge&labelColor=14213D" alt="Kadam" />
</p>

<h1 align="center">कदम · Kadam</h1>

<p align="center">
  <strong>One AI reasoning engine. Five civic outcomes. Six languages. Zero logins.</strong>
</p>

<p align="center">
  <a href="#-demo-script"><img src="https://img.shields.io/badge/demo-90_seconds-E0932F?style=flat-square" alt="Demo" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Next.js-16-000?style=flat-square&logo=nextdotjs" alt="Next.js" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Gemini_2.5-Flash-4285F4?style=flat-square&logo=google" alt="Gemini" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript" alt="TypeScript" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-1F6F5C?style=flat-square" alt="MIT License" /></a>
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

> **Core differentiator:** 500+ teams build reactive Q&A tools. Kadam is **proactive** — one reasoning engine that _decides_ what the citizen needs and renders each outcome as a labeled, structured, visually distinct card. Not a chatbot. A companion.

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

## ✨ Key Features

- **Single reasoning engine** — Gemini classifies intent AND generates structured output in one call
- **Multilingual UI + AI responses** — English, Hindi, Telugu, Tamil, Bengali, Marathi
- **Staggered reveal animations** — Steps appear one-by-one as if the AI is reasoning in real-time
- **Copy-to-clipboard** — One-click copy of journey steps or complaint drafts
- **Graceful fallbacks** — Pre-generated hardcoded responses if Gemini is unavailable; never shows raw errors
- **Zero infrastructure** — No auth, no database, no login, nothing stored, session-only
- **6 production dependencies** — Intentionally lean; no component libraries, no state management libraries

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

## ⚠️ Disclaimer

Kadam generates AI-powered guidance using Google Gemini. Responses are informational and may be incomplete or inaccurate. **Always verify fees, deadlines, and procedures with your local government office before acting.** No data is stored — the app is session-only with no login or persistence.

---

## 📄 License

[MIT](LICENSE) © 2026 Kadam Team

---

<p align="center">
  <sub>Built with ♥ for the Smart Bharat challenge</sub>
</p>