"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Send, Languages, Mic } from "lucide-react";
import Button from "@/components/ui/Button";

// Minimal Web Speech API typings — this API is not in the standard TS DOM lib.
// Kept local to this component so no shared types/config need to change.
interface SpeechAlternative {
  transcript: string;
}
interface SpeechResult {
  [index: number]: SpeechAlternative;
}
interface SpeechRecognitionEventLike {
  results: { length: number; [index: number]: SpeechResult };
}
interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition;
}

export const LANGUAGES = [
  { value: "English", label: "English" },
  { value: "Hindi", label: "Hindi (हिन्दी)" },
  { value: "Telugu", label: "Telugu (తెలుగు)" },
  { value: "Tamil", label: "Tamil (தமிழ்)" },
  { value: "Bengali", label: "Bengali (বাংলা)" },
  { value: "Marathi", label: "Marathi (मराठी)" },
];

// Maps the selected response language to a SpeechRecognition locale so voice
// input is transcribed in the same language the user is working in.
const SPEECH_LOCALES: Record<string, string> = {
  English: "en-IN",
  Hindi: "hi-IN",
  Telugu: "te-IN",
  Tamil: "ta-IN",
  Bengali: "bn-IN",
  Marathi: "mr-IN",
};

const INPUT_STRINGS: Record<
  string,
  { placeholder: string; ask: string; listen: string; listening: string }
> = {
  English: {
    placeholder: "Describe your situation in your own words…",
    ask: "Ask",
    listen: "Speak",
    listening: "Listening…",
  },
  Hindi: {
    placeholder: "अपनी समस्या को अपने शब्दों में बताएं…",
    ask: "पूछें",
    listen: "बोलें",
    listening: "सुन रहे हैं…",
  },
  Telugu: {
    placeholder: "మీ సమస్యను మీ స్వంత మాటలలో వివరించండి…",
    ask: "అడగండి",
    listen: "మాట్లాడండి",
    listening: "వింటోంది…",
  },
  Tamil: {
    placeholder: "உங்கள் சூழ்நிலையை உங்கள் சொந்த வார்த்தைகளில் விவரிக்கவும்…",
    ask: "கேள்",
    listen: "பேசு",
    listening: "கேட்கிறது…",
  },
  Bengali: {
    placeholder: "আপনার নিজের ভাষায় সমস্যাটি বর্ণনা করুন…",
    ask: "জিজ্ঞাসা করুন",
    listen: "বলুন",
    listening: "শুনছে…",
  },
  Marathi: {
    placeholder: "तुमची परिस्थिती तुमच्या स्वतःच्या शब्दात सांगा…",
    ask: "विचारा",
    listen: "बोला",
    listening: "ऐकत आहे…",
  },
};

export default function InputBar({
  onSubmit,
  language,
  onLanguageChange,
  loading,
}: {
  onSubmit: (message: string) => void;
  language: string;
  onLanguageChange: (language: string) => void;
  loading: boolean;
}) {
  const [message, setMessage] = useState("");
  const strings = INPUT_STRINGS[language] || INPUT_STRINGS.English;

  // Voice input (Web Speech API) — purely optional and client-side. Detected
  // via useSyncExternalStore so the server snapshot is always `false` (no mic
  // during SSR/first paint), avoiding any hydration mismatch, then resolves to
  // real browser support on the client. No effect / setState needed.
  const voiceSupported = useSyncExternalStore(
    () => () => {},
    () => Boolean(getSpeechRecognitionCtor()),
    () => false
  );
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  // Abort any in-flight recognition if the component unmounts mid-listen.
  useEffect(() => {
    return () => {
      const r = recognitionRef.current;
      if (r) {
        try {
          r.abort();
        } catch {
          /* no-op */
        }
      }
    };
  }, []);

  function startListening() {
    if (loading) return;
    const SR = getSpeechRecognitionCtor();
    if (!SR) return;

    const recognition = new SR();
    recognition.lang = SPEECH_LOCALES[language] || "en-IN";
    recognition.interimResults = true;
    recognition.continuous = false;

    // Preserve whatever the user has already typed and append the transcript,
    // so voice text lands in the exact same field as typed text.
    const base = message.trim() ? message.trim() + " " : "";

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setMessage(base + transcript);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  }

  function stopListening() {
    const r = recognitionRef.current;
    if (r) {
      try {
        r.stop();
      } catch {
        /* no-op */
      }
    }
    setListening(false);
  }

  function toggleListening() {
    if (listening) stopListening();
    else startListening();
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // Validate client-side: trim and reject empty or whitespace-only submissions
    const trimmed = message.trim();
    if (!trimmed || loading) return;
    onSubmit(trimmed);
    setMessage("");
  }

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-2 rounded-md border border-border bg-white p-2 sm:flex-row sm:items-center"
    >
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={strings.placeholder}
        className="min-w-0 flex-1 bg-transparent px-2 py-2 text-[15px] text-ink placeholder:text-ink/40 focus:outline-none"
        disabled={loading}
        aria-label="Describe your civic situation"
      />
      <div className="flex items-center gap-2">
        {voiceSupported && (
          <button
            type="button"
            onClick={toggleListening}
            disabled={loading}
            aria-pressed={listening}
            aria-label={listening ? strings.listening : strings.listen}
            title={listening ? strings.listening : strings.listen}
            className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1.5 text-sm transition-colors disabled:opacity-50 ${
              listening
                ? "border-accent text-accent animate-pulse"
                : "border-border text-ink/70 hover:text-ink"
            }`}
          >
            <Mic className="h-4 w-4" aria-hidden />
            {listening && <span className="text-xs">{strings.listening}</span>}
          </button>
        )}
        <label className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1.5 text-sm text-ink/80">
          <Languages className="h-4 w-4 text-ink/50" aria-hidden />
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="bg-transparent text-sm focus:outline-none"
            aria-label="Response language"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </label>
        <Button type="submit" variant="primary" disabled={loading || !message.trim()}>
          <span className="inline-flex items-center gap-1.5">
            <Send className="h-4 w-4" aria-hidden />
            {strings.ask}
          </span>
        </Button>
      </div>
    </form>
  );
}
