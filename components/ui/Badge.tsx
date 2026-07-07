export default function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "accent" | "success" | "ink" | "danger";
  className?: string;
}) {
  const tones = {
    neutral: "bg-border/50 text-ink border-border",
    accent: "bg-accent/15 text-[#8A5410] border-accent/40",
    success: "bg-success/10 text-success border-success/30",
    ink: "bg-ink text-bg border-ink",
    danger: "bg-[#B3261E]/10 text-[#B3261E] border-[#B3261E]/30",
  };
  return (
    <span
      className={`inline-block rounded-md border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
