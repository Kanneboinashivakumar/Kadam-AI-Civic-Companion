export default function Chip({
  children,
  className = "",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`rounded-md border border-border bg-white px-3 py-1.5 text-sm text-ink transition-colors hover:border-accent hover:bg-accent/10 disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
