export default function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-md border border-border bg-white ${className}`}>
      {children}
    </div>
  );
}
