"use client";

import { motion, type Variants } from "framer-motion";
import { BadgeCheck, ArrowRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import type { SchemeResponse } from "@/lib/schema";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.35 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function SchemeList({ data }: { data: SchemeResponse }) {
  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item}>
        <Badge tone="success">Scheme Matches</Badge>
        <h2 className="mt-3 font-display text-2xl font-semibold text-ink">
          Benefits you may qualify for
        </h2>
        <p className="mt-2 text-[15px] text-ink/80">
          Each match explains <em>why</em> it applies to your situation — not just a list.
        </p>
      </motion.div>

      <div className="mt-8 space-y-5">
        {data.matches?.map((match) => (
          <motion.div key={match.name} variants={item}>
            <Card className="p-6">
              <div className="flex items-start gap-3">
                <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden />
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-lg font-semibold text-ink">
                    {match.name}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/85">
                    {match.benefit_summary}
                  </p>
                  <p className="mt-2 rounded-md border-l-2 border-success bg-success/5 px-3 py-2 text-[13px] leading-relaxed text-ink/75">
                    <span className="font-medium text-success">Why you may match: </span>
                    {match.eligibility_reasoning}
                  </p>
                  {match.how_to_apply && (
                    <p className="mt-2.5 inline-flex items-start gap-1.5 text-[13px] leading-relaxed text-ink/80">
                      <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
                      <span>
                        <span className="font-medium text-ink">How to apply: </span>
                        {match.how_to_apply}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
