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
      className="to-top fixed right-3 z-[60] inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold px-3.5 py-2.5 font-serif text-sm text-bg shadow-[0_8px_24px_rgb(12_11_10_/_0.45)] hover:bg-ivory md:right-8"
      style={{ bottom: "calc(6.4rem + env(safe-area-inset-bottom))" }}
      aria-label={label}
    >
      <span aria-hidden className="text-base leading-none">
        ↑
      </span>
      {label}
    </button>
  );
}
