# Kadam Testing Strategy
*Internal reference only — not for GitHub.*

This document outlines the testing strategy, frameworks, mocks, and test organization implemented in the Kadam project. It is designed to help developers understand how to run, write, and maintain tests for the codebase.

---

## 🏛️ Strategy Overview

Our testing philosophy is built on three core pillars:
1. **Offline & Deterministic Execution**: Tests must run without calling live APIs (such as Gemini 2.5) to ensure speed, cost-effectiveness, and reliability during local development and CI runs.
2. **Behavioral Component Isolation**: React components are tested in a mock DOM environment (`jsdom`) to verify rendering, language selection, input validation, and user actions.
3. **Graceful Fallback Assertion**: Since the production system defaults to local offline datasets when Gemini fails or is rate-limited, the tests explicitly verify that these fallbacks compile and behave exactly like real LLM payloads.

---

## 🛠️ Testing Stack

* **Runner & assertion library**: [Vitest](https://vitest.dev/) (fast, out-of-the-box ES Modules & TypeScript support, matching Jest's API).
* **DOM Environment**: `jsdom` (simulates browser APIs like `window`, `document`, and `localStorage` inside Node.js).
* **Mocks**: Integrated Vitest `vi` spies and custom class mocks (for SpeechRecognition and localStorage).

---

## 🗂️ Test Files Walkthrough

All test suites are located in the `__tests__/` directory.

### 1. API Route Coverage (`__tests__/api.test.ts`)
* **Purpose**: Verifies that the `/api/generate` POST endpoint behaves predictably under different request conditions.
* **Covered Scenarios**:
  - Verification of returned JSON format structure against our output schemas.
  - Rejection of empty or whitespace-only queries client-side and server-side.
  - Verification of fallback responses when API credentials are absent.
  - Robust handling of unsupported languages (graceful English fallback).
  - Validation of message size caps (rejects queries larger than 3,000 characters with `400 Bad Request`).
  - IP-based Rate Limiting (asserts that the 11th request from the same IP returns `429 Too Many Requests` and includes correct `Retry-After` headers).
  - Regex-based 6-digit Indian PIN code extraction and mock integration tests calling the free Postal PIN Code API (checking that it resolves location context to pass to Gemini).

### 2. Component Integration Coverage (`__tests__/components.test.tsx`)
* **Purpose**: Exercises UI primitives and input elements.
* **Covered Scenarios**:
  - Renders `InputBar`, `ResponseRenderer`, and `SuggestionChips` without crashing.
  - Asserts speech-to-text integration: clicking the microphone button launches a mocked `SpeechRecognition` instance, applies the correct language locale (e.g., `hi-IN` for Hindi, `te-IN` for Telugu), and safely binds transcripts back into the HTML input box.
  - Asserts that empty/whitespace-only input submissions are blocked client-side.

### 3. Grounding & Prompts Coverage (`__tests__/grounding.test.ts`)
* **Purpose**: Tests our custom GoI scheme database mapping and Gemini grounding logic.
* **Covered Scenarios**:
  - Verifies `selectSchemesForMessage()` keyword matching logic (e.g., `"baby"` maps to childbirth tags) and fallbacks.
  - Verifies `groundSchemeMatches()` authoritatively adds `grounded: true` and official department sources to matching schemes while setting `grounded: false` on invented names.
  - Verifies prompt generation (`buildSystemPrompt`) injects strong critical language directives for Hindi, Telugu, etc.

### 4. Client-side Session Persistence Coverage (`__tests__/session.test.ts`)
* **Purpose**: Tests safe data operations on local cache states.
* **Covered Scenarios**:
  - Verifies round-trip saving and loading of the `SavedSession` structure in local cache.
  - Verifies local usage insights tracking (`incrementInsight` and `getMostCommonType`).
  - Asserts that all functions fail silently and do not crash if the browser blocks storage (private browsing / `SecurityError` simulation).

### 5. Error Isolation Coverage (`__tests__/error-boundary.test.tsx`)
* **Purpose**: Tests our React error boundary rendering.
* **Covered Scenarios**:
  - Forces a crash inside a card element (e.g. mapping invalid data fields inside `JourneyStepper`) and confirms the error is caught, displaying: *"Something went wrong displaying this response."* rather than bringing down the main page.

---

## 🚀 Running the Tests

To execute the test suite, run the following command in your terminal:

```bash
# Run all tests once
npm test

# Run tests in watch mode (interactive development)
npx vitest
```

---

## 🔒 Rate Limiting & Security Details

* **Input Size Cap**: 3,000 characters. Any query larger than this is rejected immediately to protect token usage.
* **IP Rate Limiter**: Curated in-memory cache mapped by client IP. Limits clients to 10 requests per minute. Under load, it outputs:
  - `429 Too Many Requests` status code
  - `Retry-After: 60` header
  - `X-RateLimit-Limit` & `X-RateLimit-Remaining` headers
