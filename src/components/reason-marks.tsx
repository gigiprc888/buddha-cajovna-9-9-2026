const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Two heads, one teapot, one cup stolen. */
export function MarkDuo() {
  return (
    <svg viewBox="0 0 72 56" className="h-14 w-[4.5rem]" aria-hidden>
      <circle cx="22" cy="18" r="7" {...stroke} />
      <path d="M15 34c1-7 5-10 7-10s6 3 7 10" {...stroke} />
      <circle cx="48" cy="17" r="7" {...stroke} />
      <path d="M41 34c1-7 5-10 7-10s6 3 7 10" {...stroke} />
      <path d="M29 22.5c3 4 8 4 12 0" {...stroke} />
      <path d="M30 42h8c.8 4-1 7-4 7s-4.8-3-4-7z" {...stroke} />
      <path d="M38 44h7" {...stroke} />
      <ellipse cx="22" cy="46" rx="6" ry="3" {...stroke} />
      <path d="M16 46c0-4 3-6 6-6s6 2 6 6" {...stroke} />
    </svg>
  );
}

/** Four around a board — the die is also playing. */
export function MarkFriends() {
  return (
    <svg viewBox="0 0 72 56" className="h-14 w-[4.5rem]" aria-hidden>
      <circle cx="18" cy="14" r="5.5" {...stroke} />
      <circle cx="36" cy="12" r="5.5" {...stroke} />
      <circle cx="54" cy="14" r="5.5" {...stroke} />
      <path d="M12 28c1-6 4-8 6-8s5 2 6 8" {...stroke} />
      <path d="M30 26c1-6 4-8 6-8s5 2 6 8" {...stroke} />
      <path d="M48 28c1-6 4-8 6-8s5 2 6 8" {...stroke} />
      <rect x="22" y="34" width="28" height="16" rx="2" {...stroke} />
      <path d="M22 42h28M36 34v16" {...stroke} />
      <rect x="8" y="40" width="9" height="9" rx="1.2" {...stroke} />
      <circle cx="11" cy="43.2" r="0.7" fill="currentColor" />
      <circle cx="14.2" cy="46.5" r="0.7" fill="currentColor" />
    </svg>
  );
}

/** A sofa of heads, one still calling in. */
export function MarkParty() {
  return (
    <svg viewBox="0 0 72 56" className="h-14 w-[4.5rem]" aria-hidden>
      <circle cx="16" cy="16" r="5" {...stroke} />
      <circle cx="28" cy="13" r="5" {...stroke} />
      <circle cx="40" cy="13" r="5" {...stroke} />
      <circle cx="52" cy="16" r="5" {...stroke} />
      <path d="M10 32c1-7 4-9 6-9s5 2 6 9" {...stroke} />
      <path d="M22 30c1-8 4-10 6-10s5 2 6 10" {...stroke} />
      <path d="M34 30c1-8 4-10 6-10s5 2 6 10" {...stroke} />
      <path d="M46 32c1-7 4-9 6-9s5 2 6 9" {...stroke} />
      <path d="M8 36h50c1 8-4 14-25 14S7 44 8 36z" {...stroke} />
      <circle cx="64" cy="22" r="4.2" {...stroke} />
      <path d="M64 26.5v6M61 30h6" {...stroke} />
      <path d="M66.5 18.5c2-1 3.5.5 3 2" {...stroke} />
    </svg>
  );
}
