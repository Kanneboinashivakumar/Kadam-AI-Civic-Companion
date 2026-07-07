"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Copy, Check, Landmark, AlertTriangle } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import type { ComplaintResponse } from "@/lib/schema";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.35 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const severityTone = { low: "neutral", medium: "accent", high: "danger" } as const;

export default function ComplaintCard({ data }: { data: ComplaintResponse }) {
  const [copied, setCopied] = useState(false);

  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(data.structured_description);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — non-fatal
    }
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item}>
        <Badge tone="danger">Complaint Draft</Badge>
        <h2 className="mt-3 font-display text-2xl font-semibold text-ink">
          {data.category}
        </h2>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink/80">
          <span className="inline-flex items-center gap-1.5">
            <Landmark className="h-4 w-4 text-ink/50" aria-hidden />
            {data.department}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-ink/50" aria-hidden />
            Severity:{" "}
            <Badge tone={severityTone[data.severity] ?? "neutral"}>
              {data.severity}
            </Badge>
          </span>
        </div>
      </motion.div>

      <motion.div variants={item} className="mt-5">
        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[11px] uppercase tracking-wider text-ink/60">
              Ready-to-file complaint text
            </p>
            <Button variant="ghost" className="px-2.5! py-1! text-xs" onClick={copyDraft}>
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
          <p className="mt-3 whitespace-pre-line rounded-md border border-border bg-bg p-4 text-sm leading-relaxed text-ink">
            {data.structured_description}
          </p>
        </Card>
      </motion.div>

      {data.next_steps?.length > 0 && (
        <motion.div variants={item} className="mt-5">
          <h3 className="font-display text-lg font-semibold text-ink">
            What to do next
          </h3>
          <ol className="mt-2 space-y-2">
            {data.next_steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-ink/85">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-border/60 font-mono text-[11px] text-ink">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </motion.div>
      )}

      {data.reasoning && (
        <motion.p
          variants={item}
          className="mt-5 rounded-md border-l-2 border-accent bg-accent/5 px-3 py-2 text-[13px] leading-relaxed text-ink/75"
        >
          <span className="font-medium text-ink">Why it was classified this way: </span>
          {data.reasoning}
        </motion.p>
      )}
    </motion.div>
  );
}
