/** The chip from the Zaila logo, drawn inline so the nav needs no image request. */
export function ChipMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="5.5" y="5.5" width="13" height="13" rx="2.6" />
      <path d="M9 2.5v3M12 2.5v3M15 2.5v3M9 18.5v3M12 18.5v3M15 18.5v3M2.5 9h3M2.5 12h3M2.5 15h3M18.5 9h3M18.5 12h3M18.5 15h3" />
      <rect x="9.3" y="9.2" width="2" height="4.4" rx="1" fill="currentColor" stroke="none" />
      <rect x="12.7" y="9.2" width="2" height="4.4" rx="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
