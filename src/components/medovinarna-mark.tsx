export function MedovinarnaMark({ compact, className }: { compact?: boolean; className?: string }) {
  return (
    <a
      href="https://www.medovinarna.cz/"
      className={`inline-flex items-center gap-2 ${className ?? "text-gold hover:text-ivory"}`}
      rel="noopener noreferrer"
      aria-label="Medovinárna"
      title="Medovinárna"
    >
      <svg viewBox="0 0 48 48" className={compact ? "h-7 w-7" : "h-9 w-9"} fill="none" aria-hidden>
        <path
          d="M24 3.5 42.2 14v20L24 44.5 5.8 34V14Z"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          d="M18 16c4 6 8 6 12 0"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M24 16v6c0 4-3 7-6 8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path d="M21 22h6" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <span className="font-serif tracking-[0.18em] uppercase">Medovinárna</span>
    </a>
  );
}
