import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

export function ToTop() {
  const { locale } = useI18n();
  const [on, setOn] = useState(false);
  const label = locale === "en" ? "Back to top" : "Zpět nahoru";

  useEffect(() => {
    const tick = () => setOn((window.scrollY || document.documentElement.scrollTop) > 160);
    tick();
    window.addEventListener("scroll", tick, { passive: true });
    return () => window.removeEventListener("scroll", tick);
  }, []);

  if (!on) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="to-top teapot-top fixed right-2 z-[60] md:right-6"
      style={{ bottom: "calc(6.4rem + env(safe-area-inset-bottom))" }}
      aria-label={label}
      title={label}
    >
      <svg viewBox="0 0 88 86" className="h-[4.6rem] w-[4.7rem]" aria-hidden>
        <g className="teapot-steam" fill="none" stroke="#8fbf8a" strokeLinecap="round">
          <path d="M40 28c0-8 2-11 1-18" strokeWidth="1.5" />
          <path d="M44 26c1-8 3-11 2-18" strokeWidth="1.35" />
          <path d="M48 28c2-7 3-10 2-16" strokeWidth="1.2" />
        </g>
        <ellipse cx="44" cy="74" rx="18" ry="3.2" fill="#0c0b0a" opacity=".35" />
        <path
          d="M16 44c2 18 12 28 28 30 16-2 26-12 28-30"
          fill="#efe6d4"
          stroke="#d4b483"
          strokeWidth="1.3"
        />
        <path d="M20 48c3 14 10 22 24 23 14-1 21-9 24-23" fill="#e4d8c0" />
        <ellipse cx="44" cy="44" rx="28" ry="9" fill="#f6efe2" stroke="#d4b483" strokeWidth="1.4" />
        <ellipse cx="44" cy="45.5" rx="22" ry="6.2" fill="#6a9a62" />
        <ellipse cx="40" cy="43.8" rx="10" ry="2.6" fill="#c5e0b8" opacity=".45" />
      </svg>
      <span className="tea-tag">{label}</span>
    </button>
  );
}
