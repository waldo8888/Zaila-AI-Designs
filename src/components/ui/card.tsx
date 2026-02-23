export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={[
        "rounded-3xl border border-white/10 bg-white/[0.03] shadow-[0_0_0_1px_rgba(255,255,255,0.02)] transition-all duration-300 hover:border-white/15 hover:bg-white/[0.05]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
