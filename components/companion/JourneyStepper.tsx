"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Clock, IndianRupee, FileText, BadgeCheck, Copy, Check } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import type { JourneyResponse } from "@/lib/schema";

// Signature moment: steps reveal one at a time as if the engine is reasoning
// through the journey, not dumping a wall of text.
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.45 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function JourneyStepper({ data }: { data: JourneyResponse }) {
  const [copied, setCopied] = useState(false);
  const stepById = new Map(data.steps.map((s) => [s.id, s]));
  const ordered =
    data.priority_order?.length > 0
      ? data.priority_order.map((id) => stepById.get(id)).filter(Boolean)
      : data.steps;
  const steps = ordered.length > 0 ? ordered : data.steps;

  async function copyJourney() {
    try {
      const formattedSteps = steps
        .map((step, i) => {
          let text = `${i + 1}. ${step.title}\n   ${step.description}`;
          if (step.documents && step.documents.length > 0) {
            text += `\n   Required Documents: ${step.documents.join(", ")}`;
          }
          text += `\n   Estimated Time: ${step.estimated_time} | Cost: ${step.estimated_cost}`;
          if (step.reasoning) {
            text += `\n   Why: ${step.reasoning}`;
          }
          return text;
        })
        .join("\n\n");

      let fullText = `JOURNEY: ${data.event}\nSummary: ${data.summary}\n\nSTEPS:\n${formattedSteps}`;

      if (data.schemes && data.schemes.length > 0) {
        const formattedSchemes = data.schemes
          .map((scheme) => `- ${scheme.name}: ${scheme.benefit_summary}`)
          .join("\n");
        fullText += `\n\nRECOMMENDED SCHEMES:\n${formattedSchemes}`;
      }

      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // non-fatal
    }
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item}>
        <div className="flex items-center justify-between gap-3">
          <Badge tone="accent">Life-Event Journey</Badge>
          <Button variant="ghost" className="px-2.5! py-1! text-xs" onClick={copyJourney}>
            {copied ? (
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-success" aria-hidden /> Copied
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <Copy className="h-3.5 w-3.5" aria-hidden /> Copy
              </span>
            )}
          </Button>
        </div>
        <h2 className="mt-3 font-display text-2xl font-semibold text-ink">
          {data.event}
        </h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink/80">
          {data.summary}
        </p>
      </motion.div>

      <ol className="mt-6 space-y-4">
        {steps.map((step, i) => (
          <motion.li key={step.id ?? i} variants={item}>
            <Card className="relative p-5">
              <div className="flex items-start gap-4">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-ink font-mono text-sm text-bg">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-lg font-semibold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/80">
                    {step.description}
                  </p>

                  {step.documents?.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-ink/50" aria-hidden />
                      {step.documents.map((doc) => (
                        <span
                          key={doc}
                          className="rounded-md border border-border bg-bg px-2 py-0.5 text-xs text-ink/80"
                        >
                          {doc}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-ink/70">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" aria-hidden />
                      {step.estimated_time}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <IndianRupee className="h-3.5 w-3.5" aria-hidden />
                      {step.estimated_cost}
                    </span>
                  </div>

                  {step.reasoning && (
                    <p className="mt-3 rounded-md border-l-2 border-accent bg-accent/5 px-3 py-2 text-[13px] leading-relaxed text-ink/75">
                      <span className="font-medium text-ink">Why this step: </span>
                      {step.reasoning}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </motion.li>
        ))}
      </ol>

      {data.schemes?.length > 0 && (
        <motion.div variants={item} className="mt-8">
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
            <BadgeCheck className="h-5 w-5 text-success" aria-hidden />
            Schemes you may qualify for
          </h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {data.schemes.map((scheme) => (
              <Card key={scheme.name} className="border-success/30 p-4">
                <p className="font-medium text-ink">{scheme.name}</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink/75">
                  {scheme.benefit_summary}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-success">
                  <span className="font-medium">Why you may match: </span>
                  {scheme.eligibility_reasoning}
                </p>
              </Card>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
