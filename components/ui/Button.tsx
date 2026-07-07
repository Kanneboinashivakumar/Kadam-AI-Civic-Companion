export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: {
  children: React.ReactNode;
  variant?: "primary" | "accent" | "ghost";
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants = {
    primary:
      "bg-ink text-bg hover:bg-ink/90 disabled:bg-ink/40 border border-ink disabled:border-transparent",
    accent:
      "bg-accent text-ink hover:bg-accent/90 disabled:bg-accent/40 border border-accent disabled:border-transparent",
    ghost:
      "bg-transparent text-ink hover:bg-border/40 border border-border",
  };
  return (
    <button
      className={`rounded-md px-4 py-2 text-sm font-medium font-body transition-colors disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
