# Kadam — AI Civic Companion

> **Kadam is an AI-powered civic companion that understands a citizen's situation in natural language and instantly generates personalized government journeys, complaint drafts, scheme recommendations, and document guidance—all through a single intelligent reasoning engine.**

*Built for the **Smart Bharat – AI-Powered Civic Companion** challenge.*

---

## Why Kadam?

Most civic AI solutions are reactive—they answer questions one at a time.

**Kadam is proactive.** Instead of sending citizens through multiple chatbots, forms, and government portals, a single Gemini-powered reasoning engine understands the user's situation, determines what assistance they actually need, and generates one structured, actionable response.

Rather than producing another AI chat conversation, Kadam delivers clear civic guidance that people can immediately act on.

---

## Features

### 🛤️ Life-Event Journeys

Generates personalized step-by-step government processes for major life events such as:

- Relocation
- Childbirth
- Starting a business
- Job loss
- And more

Each journey includes:

- Ordered action steps
- Required documents
- Estimated time and cost
- Applicable government schemes
- Plain-language reasoning for every recommendation

---

### 📝 Complaint Drafting

Transforms a simple description of a public issue into a structured, ready-to-file complaint including:

- Responsible department
- Complaint category
- Severity assessment
- Professional complaint draft
- Suggested next steps

---

### 🎯 Scheme Matching

Recommends relevant government schemes while explaining:

- Why the citizen qualifies
- Expected benefits
- How to apply

---

### 📄 Document Guidance

Explains government documents in simple language, including:

- Purpose
- How to obtain them
- Typical cost
- Estimated processing time

---

### 💬 Context-Aware Follow-up

Supports natural follow-up questions while staying grounded in the previously generated response instead of starting a new conversation every time.

---

### 🌐 Multilingual Support

Every response can be regenerated in the user's preferred language using the same AI reasoning engine.

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **AI:** Google Gemini 2.5 Flash (Structured JSON Output)
- **Deployment:** Vercel

---

## Challenge Requirement Coverage

| Challenge Requirement | How Kadam Addresses It |
|----------------------|------------------------|
| Simplify government information | Plain-language explanations and reasoning in every response |
| Answer citizen queries | Context-aware follow-up conversations |
| Recommend government services and schemes | AI-powered eligibility-based scheme matching |
| Assist with document requirements | Dedicated document guidance plus per-step document lists |
| Report public issues | Structured complaint drafting |
| Track complaints | Complaint workflow with actionable next steps |
| Multilingual support | Full-response language regeneration |
| Transparency | Every response includes reasoning and a reminder to verify official information |

---

## 90-Second Demo

### 1. Generate a Life Event Journey

Click **"I just had a baby"**

Kadam generates:

- Step-by-step civic journey
- Required documents
- Estimated timelines
- Applicable government schemes
- AI reasoning for every recommendation

---

### 2. Ask a Follow-up Question

Example:

> *"What if I missed the registration deadline?"*

Kadam answers while remaining grounded in the previously generated journey.

---

### 3. Draft a Civic Complaint

Click:

> **"I want to report a broken streetlight."**

Kadam produces:

- Responsible department
- Complaint severity
- Structured complaint draft
- Recommended next steps

---

### 4. Find Government Schemes

Click:

> **"What am I eligible for?"**

Kadam recommends suitable schemes and explains why each one matches the user's situation.

---

### 5. Switch Language

Change the language selector to **हिन्दी** (or another supported language).

The entire structured response is regenerated in the selected language.

---

## Architecture

```text
User Message + Language (+ Optional Context)

            │

            ▼

POST /api/generate
(Single API Route)

            │

            ▼

Gemini 2.5 Flash
Structured JSON Output

            │

            ▼

{
  type:
  journey |
  complaint |
  scheme |
  document |
  followup
}

            │

            ▼

ResponseRenderer

            │

            ▼

Distinct Structured UI Components
```

### Core Design Principles

- One AI reasoning engine
- One API route
- Structured JSON responses
- Distinct UI for every response type
- No generic chatbot interface
- Graceful fallback responses if the AI service is unavailable

---

## Run Locally

```bash
npm install

# Create .env.local
GEMINI_API_KEY=your_api_key_here

npm run dev
```

If no API key is provided—or if the Gemini API is temporarily unavailable—the application automatically serves verified fallback responses to ensure the experience remains fully functional.

---

## AI Accuracy Disclaimer

Kadam provides **AI-generated civic guidance** intended to simplify government processes.

While every response is generated using structured reasoning, official government websites and local authorities should always be considered the final source of truth for eligibility, fees, documentation requirements, and legal procedures.