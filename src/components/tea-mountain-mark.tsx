export function TeaMountainMark({ compact }: { compact?: boolean }) {
  return (
    <a
      href="https://www.teamountain.cz/"
      className="inline-flex items-center gap-2.5 text-gold hover:text-ivory"
      rel="noopener noreferrer"
      aria-label="Tea Mountain"
      title="Tea Mountain"
    >
      <svg
        viewBox="0 0 64 64"
        className={compact ? "h-7 w-7" : "h-9 w-9"}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        aria-hidden
      >
        <circle cx="32" cy="32" r="26" />
        <path d="M20 44V22.5L42 36" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M42 36v10" strokeLinecap="round" />
      </svg>
      <span className="font-serif tracking-[0.18em] uppercase">Tea Mountain</span>
    </a>
  );
}
