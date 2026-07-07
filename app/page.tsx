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

const LogoMark = () => (
  <svg
    className="h-3.5 w-3.5 text-accent inline-block mr-1.5 align-text-bottom"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="4 20 10 20 10 14 16 14 16 8 22 8" />
  </svg>
);

const UI_STRINGS: Record<
  string,
  { headline: string; subheadline: string; tryOne: string }
> = {
  English: {
    headline: "One companion for every civic situation",
    subheadline:
      "Tell it what’s happening in your life — in plain words, in your language. It works out whether you need a step-by-step journey, a complaint filed, a scheme match, or a document explained.",
    tryOne: "Try one of these",
  },
  Hindi: {
    headline: "हर नागरिक समस्या के लिए एक साथी",
    subheadline:
      "अपने जीवन की परिस्थिति को सरल भाषा में बताएं। यह तय करेगा कि आपको चरण-दर-चरण प्रक्रिया, शिकायत ड्राफ्ट, योजना मिलान या दस्तावेज़ मार्गदर्शन की आवश्यकता है।",
    tryOne: "इनमें से कोई एक आज़माएं",
  },
  Telugu: {
    headline: "ప్రతి పౌర సమస్యకు ఒకే తోడు",
    subheadline:
      "మీ జీవితంలో ఏమి జరుగుతుందో మీ సొంత మాటల్లో చెప్పండి. మీకు ఒక పద్ధతి ప్రకారం అడుగుల ప్రయాణం కావాలా, ఫిర్యాదు ముసాయిదా కావాలా, పథకం సరిపోలిక కావాలా లేదా పత్రం గురించి వివరణ కావాలా అనేది ఇది నిర్ణయిస్తుంది.",
    tryOne: "వీటిలో ఒకటి ప్రయత్నించండి",
  },
  Tamil: {
    headline: "ஒவ்வொரு குடிமைச் சூழலுக்கும் ஒரு துணை",
    subheadline:
      "உங்கள் வாழ்க்கையில் என்ன நடக்கிறது என்பதை உங்கள் சொந்த மொழியில் எளிய சொற்களில் கூறுங்கள். உங்களுக்கு ஒரு படிநிலை வழிகாட்டி, புகார் வரைவு, திட்டப் பொருத்தம் அல்லது ஆவண விளக்கம் தேவையா என்பதை இதுவே கண்டறியும்.",
    tryOne: "இவற்றில் ஒன்றை முயற்சிக்கவும்",
  },
  Bengali: {
    headline: "প্রতিটি নাগরিক সমস্যার জন্য একটি সঙ্গী",
    subheadline:
      "আপনার জীবনে কী ঘটছে তা আপনার নিজের ভাষায় সহজ কথায় বলুন। আপনি ধাপে ধাপে নির্দেশিকা, একটি অভিযোগের খসড়া, সরকারি প্রকল্প নাকি নথিপত্রের নির্দেশ চান তা এটি নিজেই নির্ধারণ করবে।",
    tryOne: "এগুলির একটি চেষ্টা করুন",
  },
  Marathi: {
    headline: "प्रत्येक नागरी समस्येसाठी एक सोबती",
    subheadline:
      "तुमच्या आयुष्यात काय घडत आहे ते तुमच्या स्वतःच्या भाषेत, सोप्या शब्दात सांगा. तुम्हाला टप्प्याटप्प्याने मार्गदर्शक, तक्रारीचा मसुदा, सरकारी योजना किंवा कागदपत्रांची माहिती हवी आहे का, हे हे स्वतः ठरवेल.",
    tryOne: "यापैकी एक प्रयत्न करा",
  },
};

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

  const strings = UI_STRINGS[language] || UI_STRINGS.English;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-20">
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <p className="flex items-center gap-1 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          <LogoMark />
          Kadam
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          {strings.headline}
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink/70">
          {strings.subheadline}
        </p>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
        className="mt-10"
      >
        <InputBar
          onSubmit={(m) => ask(m)}
          language={language}
          onLanguageChange={changeLanguage}
          loading={loading}
        />
      </motion.div>

      {!response && !loading && (
        <div className="mt-12 space-y-10">
          <div className="flex flex-wrap items-start justify-center gap-y-8 gap-x-8 sm:flex-nowrap sm:justify-between text-center">
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

          <div className="mt-8 border-t border-border/40 pt-8">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-ink/50">
              {strings.tryOne}
            </p>
            <SuggestionChips onPick={(m) => ask(m)} disabled={loading} />
          </div>
        </div>
      )}

      <main className="mt-10">
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

      <footer className="mt-16 border-t border-border pt-5 text-xs text-ink/45">
        Guidance is AI-generated and may be incomplete — verify fees and
        deadlines with your local office. No login, nothing stored.
      </footer>
    </div>
  );
}
