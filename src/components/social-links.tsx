import { FB, IG, IG_HANDLE } from "@/lib/social";

function IconIg() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" />
    </svg>
  );
}
function IconFb() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v3H6v4h3v8h4v-8h3.2l.8-4H13V9c0-.6.4-1 1-1Z" />
    </svg>
  );
}

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={"flex items-center gap-2 " + className}>
      <a
        href={IG}
        className="inline-flex items-center gap-2 rounded-full border border-gold px-3 py-1.5 text-[10px] tracking-[0.16em] text-ivory uppercase hover:bg-gold hover:text-bg"
        rel="noopener noreferrer"
      >
        <IconIg />
        {IG_HANDLE}
      </a>
      <a
        href={FB}
        className="inline-flex items-center gap-2 rounded-full border border-gold px-3 py-1.5 text-[10px] tracking-[0.16em] text-ivory uppercase hover:bg-gold hover:text-bg"
        rel="noopener noreferrer"
      >
        <IconFb />
        Facebook
      </a>
    </div>
  );
}
