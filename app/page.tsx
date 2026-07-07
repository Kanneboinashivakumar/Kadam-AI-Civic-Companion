"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Sparkles, Milestone, FileText, BookOpen, MessageSquare,
  ShieldCheck, Eye, HardDrive,
} from "lucide-react";
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

/* ── animation variants ─────────────────────────────────── */

/* hero beats use explicit delays so each element visibly finishes
   before the next begins — like a movie title card. */
const heroBeat = (delay: number, duration: number) => ({
  initial: { opacity: 0, y: 10 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration, delay, ease: "easeOut" as const },
});

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.15 },
  },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

/* ── translation strings ────────────────────────────────── */

interface UIStrings {
  headline: string;
  subheadline: string;
  tryOne: string;
  features: [string, string, string, string, string];
  chips: [string, string, string, string, string];
  footer: string;
  footerLabels: [string, string, string];
}

const UI_STRINGS: Record<string, UIStrings> = {
  English: {
    headline: "One companion for every civic situation",
    subheadline:
      "Tell it what's happening in your life — in plain words, in your language. It works out whether you need a step-by-step journey, a complaint filed, a scheme match, or a document explained.",
    tryOne: "Try one of these",
    features: [
      "Life event journeys",
      "Complaint drafting",
      "Scheme matching",
      "Document guidance",
      "Follow-up answers",
    ],
    chips: [
      "I just had a baby",
      "I want to report a broken streetlight",
      "What am I eligible for?",
      "I'm starting a small business",
      "I lost my job",
    ],
    footer:
      "Guidance is AI-generated and may be incomplete — verify fees and deadlines with your local office. No login, nothing stored.",
    footerLabels: ["AI-generated guidance", "Verify with officials", "Nothing stored"],
  },
  Hindi: {
    headline: "हर नागरिक समस्या के लिए एक साथी",
    subheadline:
      "अपने जीवन की परिस्थिति को सरल भाषा में बताएं। यह तय करेगा कि आपको चरण-दर-चरण प्रक्रिया, शिकायत ड्राफ्ट, योजना मिलान या दस्तावेज़ मार्गदर्शन की आवश्यकता है।",
    tryOne: "इनमें से कोई एक आज़माएं",
    features: [
      "जीवन घटना यात्रा",
      "शिकायत ड्राफ्टिंग",
      "योजना मिलान",
      "दस्तावेज़ मार्गदर्शन",
      "अनुवर्ती उत्तर",
    ],
    chips: [
      "मेरा बच्चा हुआ है",
      "टूटी स्ट्रीटलाइट की शिकायत करनी है",
      "मैं किसके लिए पात्र हूँ?",
      "मैं छोटा व्यापार शुरू कर रहा हूँ",
      "मेरी नौकरी गई",
    ],
    footer:
      "यह मार्गदर्शन AI-जनित है और अधूरा हो सकता है — शुल्क और समय-सीमा अपने स्थानीय कार्यालय से सत्यापित करें। कोई लॉगिन नहीं, कुछ भी संग्रहित नहीं।",
    footerLabels: ["AI-जनित मार्गदर्शन", "अधिकारियों से सत्यापित करें", "कुछ भी संग्रहित नहीं"],
  },
  Telugu: {
    headline: "ప్రతి పౌర సమస్యకు ఒకే తోడు",
    subheadline:
      "మీ జీవితంలో ఏమి జరుగుతుందో మీ సొంత మాటల్లో చెప్పండి. మీకు ఒక పద్ధతి ప్రకారం అడుగుల ప్రయాణం కావాలా, ఫిర్యాదు ముసాయిదా కావాలా, పథకం సరిపోలిక కావాలా లేదా పత్రం గురించి వివరణ కావాలా అనేది ఇది నిర్ణయిస్తుంది.",
    tryOne: "వీటిలో ఒకటి ప్రయత్నించండి",
    features: [
      "జీవిత ఘటన ప్రయాణాలు",
      "ఫిర్యాదు ముసాయిదా",
      "పథకం సరిపోలిక",
      "పత్రం మార్గదర్శనం",
      "ఫాలో-అప్ సమాధానాలు",
    ],
    chips: [
      "నాకు బిడ్డ పుట్టింది",
      "విరిగిన వీధి దీపం ఫిర్యాదు",
      "నేను దేనికి అర్హుడిని?",
      "చిన్న వ్యాపారం మొదలుపెడుతున్నాను",
      "నా ఉద్యోగం పోయింది",
    ],
    footer:
      "ఈ మార్గదర్శనం AI ద్వారా రూపొందించబడింది — రుసుములు మరియు గడువులను మీ స్థానిక కార్యాలయంతో ధృవీకరించండి. లాగిన్ లేదు, ఏమీ నిల్వ చేయబడదు.",
    footerLabels: ["AI మార్గదర్శనం", "అధికారికంగా ధృవీకరించండి", "ఏమీ నిల్వ చేయబడదు"],
  },
  Tamil: {
    headline: "ஒவ்வொரு குடிமைச் சூழலுக்கும் ஒரு துணை",
    subheadline:
      "உங்கள் வாழ்க்கையில் என்ன நடக்கிறது என்பதை உங்கள் சொந்த மொழியில் எளிய சொற்களில் கூறுங்கள். உங்களுக்கு ஒரு படிநிலை வழிகாட்டி, புகார் வரைவு, திட்டப் பொருத்தம் அல்லது ஆவண விளக்கம் தேவையா என்பதை இதுவே கண்டறியும்.",
    tryOne: "இவற்றில் ஒன்றை முயற்சிக்கவும்",
    features: [
      "வாழ்க்கை நிகழ்வுப் பயணம்",
      "புகார் வரைவு",
      "திட்டப் பொருத்தம்",
      "ஆவண வழிகாட்டி",
      "தொடர் பதில்கள்",
    ],
    chips: [
      "எனக்கு குழந்தை பிறந்தது",
      "உடைந்த தெரு விளக்கு புகார்",
      "நான் எதற்கு தகுதியானவன்?",
      "சிறு தொழில் தொடங்குகிறேன்",
      "நான் வேலை இழந்தேன்",
    ],
    footer:
      "இந்த வழிகாட்டுதல் AI மூலம் உருவாக்கப்பட்டது — கட்டணங்களையும் கால அவகாசங்களையும் உங்கள் உள்ளூர் அலுவலகத்தில் சரிபார்க்கவும். உள்நுழைவு இல்லை, எதுவும் சேமிக்கப்படவில்லை.",
    footerLabels: ["AI வழிகாட்டுதல்", "அதிகாரிகளிடம் சரிபார்க்கவும்", "எதுவும் சேமிக்கப்படவில்லை"],
  },
  Bengali: {
    headline: "প্রতিটি নাগরিক সমস্যার জন্য একটি সঙ্গী",
    subheadline:
      "আপনার জীবনে কী ঘটছে তা আপনার নিজের ভাষায় সহজ কথায় বলুন। আপনি ধাপে ধাপে নির্দেশিকা, একটি অভিযোগের খসড়া, সরকারি প্রকল্প নাকি নথিপত্রের নির্দেশ চান তা এটি নিজেই নির্ধারণ করবে।",
    tryOne: "এগুলির একটি চেষ্টা করুন",
    features: [
      "জীবন ঘটনা যাত্রা",
      "অভিযোগ খসড়া",
      "প্রকল্প মিলান",
      "নথি নির্দেশিকা",
      "ফলো-আপ উত্তর",
    ],
    chips: [
      "আমার সদ্য সন্তান হয়েছে",
      "ভাঙা রাস্তার বাতির অভিযোগ",
      "আমি কিসের জন্য যোগ্য?",
      "ছোট ব্যবসা শুরু করছি",
      "আমার চাকরি গেছে",
    ],
    footer:
      "এই নির্দেশিকা AI-দ্বারা তৈরি — ফি এবং সময়সীমা আপনার স্থানীয় অফিসে যাচাই করুন। কোনো লগইন নেই, কিছু সংরক্ষিত হয় না।",
    footerLabels: ["AI নির্দেশিকা", "অফিসে যাচাই করুন", "কিছু সংরক্ষিত হয় না"],
  },
  Marathi: {
    headline: "प्रत्येक नागरी समस्येसाठी एक सोबती",
    subheadline:
      "तुमच्या आयुष्यात काय घडत आहे ते तुमच्या स्वतःच्या भाषेत, सोप्या शब्दात सांगा. तुम्हाला टप्प्याटप्प्याने मार्गदर्शक, तक्रारीचा मसुदा, सरकारी योजना किंवा कागदपत्रांची माहिती हवी आहे का, हे हे स्वतः ठरवेल.",
    tryOne: "यापैकी एक प्रयत्न करा",
    features: [
      "जीवन घटना मार्गदर्शक",
      "तक्रार मसुदा",
      "योजना जुळणी",
      "कागदपत्र मार्गदर्शन",
      "पाठपुरावा उत्तरे",
    ],
    chips: [
      "मला बाळ झाले",
      "तुटलेल्या पथदिव्याची तक्रार",
      "मी कशासाठी पात्र आहे?",
      "छोटा व्यवसाय सुरू करत आहे",
      "माझी नोकरी गेली",
    ],
    footer:
      "हे मार्गदर्शन AI-निर्मित आहे — शुल्क आणि मुदती तुमच्या स्थानिक कार्यालयात तपासा. कोणतेही लॉगिन नाही, काहीही साठवले जात नाही.",
    footerLabels: ["AI मार्गदर्शन", "अधिकाऱ्यांकडे तपासा", "काहीही साठवले जात नाही"],
  },
};

const FEATURE_ICONS = [Milestone, FileText, Sparkles, BookOpen, MessageSquare];

export default function Home() {
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<CompanionResponse | null>(null);
  const [lastMessage, setLastMessage] = useState("");
  const [followups, setFollowups] = useState<FollowupItem[]>([]);
  const [followupLoading, setFollowupLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 3400);
    return () => clearTimeout(timer);
  }, []);

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
    <AnimatePresence mode="wait">
      {showIntro ? (
        <motion.div
          key="intro"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeIn" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink"
        >
          {/* animated path logo mark */}
          <div className="text-accent flex items-center justify-center">
            <svg
              className="h-16 w-16 sm:h-20 sm:w-20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <motion.path
                d="M 4 18 C 8 18, 8 12, 12 12 C 16 12, 16 6, 20 6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
              />
              <motion.circle
                cx="4"
                cy="18"
                r="2"
                fill="currentColor"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.25, duration: 0.3, type: "spring", stiffness: 200 }}
              />
              <motion.circle
                cx="12"
                cy="12"
                r="2"
                fill="currentColor"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.55, duration: 0.3, type: "spring", stiffness: 200 }}
              />
              <motion.circle
                cx="20"
                cy="6"
                r="2"
                fill="currentColor"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.85, duration: 0.3, type: "spring", stiffness: 200 }}
              />
            </svg>
          </div>

          {/* wordmark with staggered letter reveal */}
          <motion.h1
            className="mt-6 font-display text-4xl sm:text-5xl font-bold tracking-tight text-bg flex gap-1 justify-center"
          >
            {"Kadam".split("").map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.75 + index * 0.08,
                  duration: 0.45,
                  ease: "easeOut",
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>

          {/* tagline with letter spacing expander */}
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.25em" }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 1.25 }}
            className="mt-4 font-mono text-xs sm:text-sm uppercase text-bg/50 text-center px-4"
          >
            AI Civic Companion
          </motion.p>

          {/* subtle accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 1.75 }}
            className="mt-6 h-px w-24 origin-center bg-accent/60"
          />
        </motion.div>
      ) : (
        <motion.div
          key="main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      {/* ── hero with sequential entrance beats ────────── */}
      <header>
        <motion.span
          {...heroBeat(0, 0.3)}
          className="inline-block text-accent"
        >
          <LogoMark />
        </motion.span>
        <motion.span
          {...heroBeat(0.3, 0.25)}
          className="inline-block font-mono text-xs uppercase tracking-[0.25em] text-accent font-semibold ml-1"
        >
          Kadam
        </motion.span>
        <motion.h1
          {...heroBeat(0.55, 0.35)}
          className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-[42px] leading-[1.1] sm:leading-[1.15]"
        >
          {strings.headline}
        </motion.h1>
        <motion.p
          {...heroBeat(0.9, 0.3)}
          className="mt-4 max-w-2xl text-[16px] sm:text-[17px] leading-relaxed text-ink/70 font-normal tracking-wide"
        >
          {strings.subheadline}
        </motion.p>
      </header>

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
            {FEATURE_ICONS.map((Icon, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="flex flex-col items-center gap-1.5 flex-1 min-w-[90px]"
              >
                <Icon className="h-5 w-5 text-ink/50" aria-hidden />
                <span className="text-xs text-ink/65 leading-relaxed">
                  {strings.features[i]}
                </span>
              </motion.div>
            ))}
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
            <SuggestionChips
              onPick={(m) => ask(m)}
              disabled={loading}
              chipLabels={strings.chips}
            />
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

      {/* ── trust footer ─────────────────────────────────── */}
      <footer className="mt-20 border-t border-border pt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8">
          <div className="flex items-start gap-2 flex-1">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-ink/30" aria-hidden />
            <span className="text-xs leading-relaxed text-ink/45">
              {strings.footerLabels[0]}
            </span>
          </div>
          <div className="flex items-start gap-2 flex-1">
            <Eye className="mt-0.5 h-4 w-4 shrink-0 text-ink/30" aria-hidden />
            <span className="text-xs leading-relaxed text-ink/45">
              {strings.footerLabels[1]}
            </span>
          </div>
          <div className="flex items-start gap-2 flex-1">
            <HardDrive className="mt-0.5 h-4 w-4 shrink-0 text-ink/30" aria-hidden />
            <span className="text-xs leading-relaxed text-ink/45">
              {strings.footerLabels[2]}
            </span>
          </div>
        </div>
        <p className="mt-4 text-[11px] leading-relaxed text-ink/35">
          {strings.footer}
        </p>
      </footer>
    </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
