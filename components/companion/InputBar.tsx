"use client";

import { useState } from "react";
import { Send, Languages } from "lucide-react";
import Button from "@/components/ui/Button";

export const LANGUAGES = [
  { value: "English", label: "English" },
  { value: "Hindi", label: "Hindi (हिन्दी)" },
  { value: "Telugu", label: "Telugu (తెలుగు)" },
  { value: "Tamil", label: "Tamil (தமிழ்)" },
  { value: "Bengali", label: "Bengali (বাংলা)" },
  { value: "Marathi", label: "Marathi (मराठी)" },
];

const INPUT_STRINGS: Record<string, { placeholder: string; ask: string }> = {
  English: {
    placeholder: "Describe your situation in your own words…",
    ask: "Ask",
  },
  Hindi: {
    placeholder: "अपनी समस्या को अपने शब्दों में बताएं…",
    ask: "पूछें",
  },
  Telugu: {
    placeholder: "మీ సమస్యను మీ స్వంత మాటలలో వివరించండి…",
    ask: "అడగండి",
  },
  Tamil: {
    placeholder: "உங்கள் சூழ்நிலையை உங்கள் சொந்த வார்த்தைகளில் விவரிக்கவும்…",
    ask: "கேள்",
  },
  Bengali: {
    placeholder: "আপনার নিজের ভাষায় সমস্যাটি বর্ণনা করুন…",
    ask: "জিজ্ঞাসা করুন",
  },
  Marathi: {
    placeholder: "तुमची परिस्थिती तुमच्या स्वतःच्या शब्दात सांगा…",
    ask: "विचारा",
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

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const m = message.trim();
    if (!m || loading) return;
    onSubmit(m);
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
