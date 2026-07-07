"use client";

import { motion } from "framer-motion";
import { SUGGESTION_CHIPS } from "@/lib/prompts";

const CHIP_PROMPTS: Record<string, string> = {
  "I just had a baby": "I just had a baby in Karnataka, this is my first child, I'm a salaried employee",
  "I want to report a broken streetlight": "There's a broken streetlight on my street that's been dark for two weeks, it's a safety issue at night",
  "What am I eligible for?": "I'm a farmer in Telangana with a small landholding under 2 acres, what am I eligible for?",
  "I'm starting a small business": "I'm starting a small retail shop in Pune, what government registrations and support do I need?",
  "I lost my job": "I lost my job in Maharashtra last month, what support and next steps am I eligible for?",
};

export default function SuggestionChips({
  onPick,
  disabled,
}: {
  onPick: (message: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {SUGGESTION_CHIPS.map((chip) => (
        <motion.button
          key={chip}
          onClick={() => onPick(CHIP_PROMPTS[chip] || chip)}
          disabled={disabled}
          whileHover={{ y: -2, scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          transition={{ type: "spring", stiffness: 450, damping: 18 }}
          className="rounded-full border border-border bg-white px-4 py-2 text-xs sm:text-sm text-ink/85 transition-colors hover:border-accent hover:text-ink hover:bg-accent/5 disabled:opacity-50 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)] select-none focus:outline-none focus:ring-1 focus:ring-accent"
        >
          {chip}
        </motion.button>
      ))}
    </div>
  );
}
