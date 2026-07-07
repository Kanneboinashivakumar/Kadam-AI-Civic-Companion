"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Milestone, FileText, BookOpen, MessageSquare } from "lucide-react";
import InputBar from "@/components/companion/InputBar";
import SuggestionChips from "@/components/companion/SuggestionChips";
import ResponseRenderer from "@/components/companion/ResponseRenderer";
import FollowupThread, { type FollowupItem } from "@/components/companion/FollowupThread";
import type { CompanionResponse } from "@/lib/schema";

async function callGenerate(body: {
  message: string;
  language: string;
  context?: CompanionResponse;
}): Promise<CompanionResponse> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

function ReasoningIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-3 rounded-md border border-border bg-white px-4 py-3"
    >
      <motion.span
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 1.6 }}
      >
        <Sparkles className="h-4 w-4 text-accent" aria-hidden />
      </motion.span>
      <span className="text-sm text-ink/70">
        Reading your situation and deciding what you need — a journey, a
        complaint, a scheme, or a document…
      </span>
    </motion.div>
  );
}

export default function Home() {
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<CompanionResponse | null>(null);
  const [lastMessage, setLastMessage] = useState("");
  const [followups, setFollowups] = useState<FollowupItem[]>([]);
  const [followupLoading, setFollowupLoading] = useState(false);

  async function ask(message: string, lang = language) {
    setLoading(true);
    setResponse(null);
    setFollowups([]);
    setLastMessage(message);
    try {
      const data = await callGenerate({ message, language: lang });
      setResponse(data);
    } catch {
      // The route itself falls back on failure; this only fires if the
      // network is down entirely. Keep the screen calm either way.
      setResponse(null);
    } finally {
      setLoading(false);
    }
  }

  async function askFollowup(question: string) {
    if (!response) return;
    setFollowupLoading(true);
    try {
      const data = await callGenerate({
        message: question,
        language,
        context: response,
      });
      if (data.type === "followup") {
        setFollowups((prev) => [...prev, { question, answer: data.answer }]);
      } else {
        // The engine decided this is really a new situation — honor it.
        setResponse(data);
        setFollowups([]);
        setLastMessage(question);
      }
    } finally {
      setFollowupLoading(false);
    }
  }

  function changeLanguage(lang: string) {
    setLanguage(lang);
    // Same message, same schema — just re-reasoned in the new language.
    if (lastMessage && !loading) ask(lastMessage, lang);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Smart Bharat
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          One companion for every civic situation
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink/70">
          Tell it what&rsquo;s happening in your life — in plain words, in your
          language. It works out whether you need a step-by-step journey, a
          complaint filed, a scheme match, or a document explained.
        </p>
      </header>

      <div className="mt-8">
        <InputBar
          onSubmit={(m) => ask(m)}
          language={language}
          onLanguageChange={changeLanguage}
          loading={loading}
        />
      </div>

      {!response && !loading && (
        <div className="mt-8 space-y-8">
          <div className="flex flex-wrap items-start justify-center gap-y-6 gap-x-8 sm:flex-nowrap sm:justify-between text-center">
            <div className="flex flex-col items-center gap-1.5 flex-1 min-w-[90px]">
              <Milestone className="h-5 w-5 text-ink/50" aria-hidden />
              <span className="text-xs text-ink/65 leading-relaxed">
                Life event journeys
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 flex-1 min-w-[90px]">
              <FileText className="h-5 w-5 text-ink/50" aria-hidden />
              <span className="text-xs text-ink/65 leading-relaxed">
                Complaint drafting
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 flex-1 min-w-[90px]">
              <Sparkles className="h-5 w-5 text-ink/50" aria-hidden />
              <span className="text-xs text-ink/65 leading-relaxed">
                Scheme matching
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 flex-1 min-w-[90px]">
              <BookOpen className="h-5 w-5 text-ink/50" aria-hidden />
              <span className="text-xs text-ink/65 leading-relaxed">
                Document guidance
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 flex-1 min-w-[90px]">
              <MessageSquare className="h-5 w-5 text-ink/50" aria-hidden />
              <span className="text-xs text-ink/65 leading-relaxed">
                Follow-up answers
              </span>
            </div>
          </div>

          <div className="mt-6 border-t border-border/40 pt-6">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-ink/50">
              Try one of these
            </p>
            <SuggestionChips onPick={(m) => ask(m)} disabled={loading} />
          </div>
        </div>
      )}

      <main className="mt-8">
        {loading && <ReasoningIndicator />}
        {!loading && response && (
          <>
            <ResponseRenderer response={response} />
            <FollowupThread
              items={followups}
              onAsk={askFollowup}
              loading={followupLoading}
            />
          </>
        )}
      </main>

      <footer className="mt-14 border-t border-border pt-4 text-xs text-ink/45">
        Guidance is AI-generated and may be incomplete — verify fees and
        deadlines with your local office. No login, nothing stored.
      </footer>
    </div>
  );
}
