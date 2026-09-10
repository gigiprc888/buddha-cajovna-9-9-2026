import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

const TIPS = {
  cs: [
    { k: "Happy Hours", t: "Po–Čt 13–15: dvě dýmky za cenu jedné." },
    { k: "Matcha menu", t: "Float od 120 Kč. Sezóna brzy končí." },
    { k: "Wayusa", t: "Přírodní energie z Amazonie. 15 min. 119 Kč." },
    { k: "Dýmka", t: "Adalya od 229 Kč. Pouze k nápoji, od 18 let." },
    { k: "Čajové mojito", t: "Zelený čaj, rum, máta. 159 Kč." },
    { k: "Medovina", t: "Podáváme i v rohu. Od Medovinárny." },
    { k: "Gatcha", t: "1 500 Kč na účtence = menší zatočení." },
  ],
  en: [
    { k: "Happy Hours", t: "Mon–Thu 13–15: two hookahs for the price of one." },
    { k: "Matcha menu", t: "Float from 120 Kč. Season ending soon." },
    { k: "Wayusa", t: "Natural energy from the Amazon. 15 min. 119 Kč." },
    { k: "Hookah", t: "Adalya from 229 Kč. With a drink, 18+." },
    { k: "Tea mojito", t: "Green tea, rum, mint. 159 Kč." },
    { k: "Mead", t: "In a horn, as the Celts drank it. From Medovinárna." },
    { k: "Gatcha", t: "1,500 Kč on the bill = a small spin." },
  ],
};

export function TipsStrip() {
  const { locale } = useI18n();
  const tips = TIPS[locale];
  const [i, setI] = useState(0);
  const [on, setOn] = useState(true);

  useEffect(() => {
    const id = window.setInterval(() => setI((n) => (n + 1) % tips.length), 5200);
    return () => window.clearInterval(id);
  }, [tips.length]);

  if (!on) return null;
  const tip = tips[i % tips.length];

  return (
    <div className="tips-strip fixed inset-x-0 bottom-[4.4rem] z-40 md:bottom-0">
      <div className="relative overflow-hidden border-t border-[#f3e6cc]/35 bg-gold px-3 py-2.5 shadow-[0_-6px_16px_rgb(12_11_10_/_0.18)]">
        <span className="tips-shine pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto flex max-w-5xl items-center gap-3">
          <span className="hidden shrink-0 rounded-full bg-bg px-2.5 py-1 text-[10px] tracking-[0.22em] text-gold uppercase sm:inline">
            {locale === "en" ? "Tonight" : "Dnes"}
          </span>
          <p key={i} className="tips-swap min-w-0 flex-1 truncate text-[#1c1610]">
            <span className="font-serif text-lg tracking-tight md:text-xl">{tip.k}</span>
            <span className="ml-2 text-sm font-medium md:text-[0.95rem]">{tip.t}</span>
          </p>
          <div className="hidden gap-1 sm:flex">
            {tips.map((_, n) => (
              <button
                key={n}
                type="button"
                onClick={() => setI(n)}
                className={`h-1.5 rounded-full transition-all ${n === i % tips.length ? "w-4 bg-bg" : "w-1.5 bg-bg/35"}`}
                aria-label={`Tip ${n + 1}`}
              />
            ))}
          </div>
          <Link
            to="/menu"
            className="shrink-0 rounded-full bg-bg px-3.5 py-1.5 text-[10px] tracking-[0.18em] text-gold uppercase hover:bg-[#1c1610]"
          >
            {locale === "en" ? "Menu →" : "Lístek →"}
          </Link>
          <button
            type="button"
            onClick={() => setOn(false)}
            className="grid size-8 shrink-0 place-items-center text-[#1c1610]/55 hover:text-[#1c1610]"
            aria-label={locale === "en" ? "Close tips" : "Zavřít tipy"}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
