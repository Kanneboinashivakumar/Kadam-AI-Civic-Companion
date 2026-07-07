"use client";

import { motion } from "framer-motion";
import { ScrollText, Clock, IndianRupee, MessageCircleQuestion } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import JourneyStepper from "./JourneyStepper";
import ComplaintCard from "./ComplaintCard";
import SchemeList from "./SchemeList";
import type { CompanionResponse, DocumentResponse, FollowupResponse } from "@/lib/schema";

function DocumentGuidance({ data }: { data: DocumentResponse }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Badge tone="ink">Document Guidance</Badge>
      <h2 className="mt-3 flex items-center gap-2.5 font-display text-2xl font-semibold text-ink">
        <ScrollText className="h-6 w-6 text-accent" aria-hidden />
        {data.document_name}
      </h2>
      <Card className="mt-4 space-y-5 p-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink/60">
            What it&rsquo;s for
          </p>
          <p className="mt-1 text-sm leading-relaxed text-ink/85">{data.purpose}</p>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink/60">
            How to get it
          </p>
          <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-ink/85">
            {data.how_to_obtain}
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-1 border-t border-border pt-3 font-mono text-xs text-ink/70">
          <span className="inline-flex items-center gap-1.5">
            <IndianRupee className="h-3.5 w-3.5" aria-hidden />
            {data.typical_cost}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {data.typical_time}
          </span>
        </div>
      </Card>
    </motion.div>
  );
}

function FollowupAnswer({ data }: { data: FollowupResponse }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Badge tone="neutral">Follow-up Answer</Badge>
      <Card className="mt-3 p-6">
        <p className="inline-flex items-start gap-2.5 whitespace-pre-line text-[15px] leading-relaxed text-ink/90">
          <MessageCircleQuestion className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
          {data.answer}
        </p>
      </Card>
    </motion.div>
  );
}

export default function ResponseRenderer({ response }: { response: CompanionResponse }) {
  const showTrustFooter = ["journey", "complaint", "scheme", "document"].includes(response.type);

  return (
    <div className="space-y-4">
      {(() => {
        switch (response.type) {
          case "journey":
            return <JourneyStepper data={response} />;
          case "complaint":
            return <ComplaintCard data={response} />;
          case "scheme":
            return <SchemeList data={response} />;
          case "document":
            return <DocumentGuidance data={response} />;
          case "followup":
            return <FollowupAnswer data={response} />;
          default:
            return null;
        }
      })()}
      {showTrustFooter && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-ink/45 mt-3.5 block"
        >
          AI-generated guidance — verify with your local government office before acting.
        </motion.p>
      )}
    </div>
  );
}
