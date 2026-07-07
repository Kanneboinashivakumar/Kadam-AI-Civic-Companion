"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CornerDownRight, Send } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export type FollowupItem = { question: string; answer: string };

export default function FollowupThread({
  items,
  onAsk,
  loading,
}: {
  items: FollowupItem[];
  onAsk: (question: string) => void;
  loading: boolean;
}) {
  const [question, setQuestion] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = question.trim();
    if (!q || loading) return;
    onAsk(q);
    setQuestion("");
  }

  return (
    <section className="mt-8 border-t border-border pt-6">
      <h3 className="font-display text-lg font-semibold text-ink">
        Questions about this?
      </h3>
      <p className="mt-1 text-sm text-ink/70">
        Ask a follow-up — the answer stays grounded in the response above.
      </p>

      {items.length > 0 && (
        <div className="mt-4 space-y-4">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <p className="inline-flex items-start gap-2 text-sm font-medium text-ink">
                <CornerDownRight className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                {item.question}
              </p>
              <Card className="mt-2 p-5">
                <Badge tone="neutral">Follow-up Answer</Badge>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink/85">
                  {item.answer}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <form onSubmit={submit} className="mt-4 flex items-center gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder='e.g. "What if I missed the 21-day deadline?"'
          className="min-w-0 flex-1 rounded-md border border-border bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/40 focus:border-accent focus:outline-none"
          disabled={loading}
        />
        <Button type="submit" variant="ghost" disabled={loading || !question.trim()}>
          <span className="inline-flex items-center gap-1.5">
            <Send className="h-3.5 w-3.5" aria-hidden />
            Ask
          </span>
        </Button>
      </form>
    </section>
  );
}
