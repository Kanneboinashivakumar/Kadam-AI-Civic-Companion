"use client";

import Chip from "@/components/ui/Chip";
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
    <div className="flex flex-wrap gap-2">
      {SUGGESTION_CHIPS.map((chip) => (
        <Chip
          key={chip}
          onClick={() => onPick(CHIP_PROMPTS[chip] || chip)}
          disabled={disabled}
        >
          {chip}
        </Chip>
      ))}
    </div>
  );
}
