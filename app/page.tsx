"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
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
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M 4 18 C 8 18, 8 12, 12 12 C 16 12, 16 6, 20 6" />
    <circle cx="4" cy="18" r="2" fill="currentColor" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
    <circle cx="20" cy="6" r="2" fill="currentColor" />
  </svg>
);

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

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
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <motion.header
        initial={{ opacity: 0, y: 10, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <p className="flex items-center gap-1 font-mono text-xs uppercase tracking-[0.25em] text-accent font-semibold">
          <LogoMark />
          Kadam
        </p>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-[42px] leading-[1.1] sm:leading-[1.15]">
          {strings.headline}
        </h1>
        <p className="mt-4 max-w-2xl text-[16px] sm:text-[17px] leading-relaxed text-ink/70 font-normal tracking-wide">
          {strings.subheadline}
        </p>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.12 }}
        className="mt-12 sm:mt-16"
      >
        <InputBar
          onSubmit={(m) => ask(m)}
          language={language}
          onLanguageChange={changeLanguage}
          loading={loading}
        />
      </motion.div>

      {!response && !loading && (
        <div className="mt-16 space-y-12">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-wrap items-start justify-center gap-y-8 gap-x-8 sm:flex-nowrap sm:justify-between text-center"
          >
            <motion.div variants={itemVariants} className="flex flex-col items-center gap-1.5 flex-1 min-w-[90px]">
              <Milestone className="h-5 w-5 text-ink/50" aria-hidden />
              <span className="text-xs text-ink/65 leading-relaxed">
                Life event journeys
              </span>
            </motion.div>
            <motion.div variants={itemVariants} className="flex flex-col items-center gap-1.5 flex-1 min-w-[90px]">
              <FileText className="h-5 w-5 text-ink/50" aria-hidden />
              <span className="text-xs text-ink/65 leading-relaxed">
                Complaint drafting
              </span>
            </motion.div>
            <motion.div variants={itemVariants} className="flex flex-col items-center gap-1.5 flex-1 min-w-[90px]">
              <Sparkles className="h-5 w-5 text-ink/50" aria-hidden />
              <span className="text-xs text-ink/65 leading-relaxed">
                Scheme matching
              </span>
            </motion.div>
            <motion.div variants={itemVariants} className="flex flex-col items-center gap-1.5 flex-1 min-w-[90px]">
              <BookOpen className="h-5 w-5 text-ink/50" aria-hidden />
              <span className="text-xs text-ink/65 leading-relaxed">
                Document guidance
              </span>
            </motion.div>
            <motion.div variants={itemVariants} className="flex flex-col items-center gap-1.5 flex-1 min-w-[90px]">
              <MessageSquare className="h-5 w-5 text-ink/50" aria-hidden />
              <span className="text-xs text-ink/65 leading-relaxed">
                Follow-up answers
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.25 }}
            className="mt-8 border-t border-border/40 pt-8"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink/40">
              {strings.tryOne}
            </p>
            <SuggestionChips onPick={(m) => ask(m)} disabled={loading} />
          </motion.div>
        </div>
      )}

      <main className="mt-12">
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

      <footer className="mt-20 border-t border-border pt-6 text-xs text-ink/45">
        Guidance is AI-generated and may be incomplete — verify fees and
        deadlines with your local office. No login, nothing stored.
      </footer>
    </div>
  );
}
