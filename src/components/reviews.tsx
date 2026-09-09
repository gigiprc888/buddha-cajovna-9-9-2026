import { useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { Reveal } from "@/components/reveal";

const FIRMY = "https://www.firmy.cz/detail/13290920-buddha-cajovna-praha-nove-mesto.html";
const TRIP = "https://www.tripadvisor.com/Restaurant_Review-g274707-d7599091-Reviews-Buddha_Cajovna-Prague_Bohemia.html";

const REVIEWS = [
  {
    q: "Příjemný prostor, obsluha skvěle dovede poradit i zákazníkům, kteří si dělají čaj maximálně z pytlíku. Výběr velký a ceny příznivé.",
    who: "Simona Zíchová",
    src: "Firmy.cz",
    href: FIRMY,
  },
  {
    q: "Hezká klasická čajovna. Obsluha se snažila a čaj chutnal skvěle.",
    who: "Klára Sněhotová",
    src: "Firmy.cz",
    href: FIRMY,
  },
  {
    q: "Best old-school tea house. Really good hookah. You can chill, play DnD and board games. Nice service in the middle of Prague.",
    who: "Wanderer",
    src: "Tripadvisor",
    href: TRIP,
  },
  {
    q: "Vše bylo skvělé! Děkuji!!!!",
    who: "Mark Vesely",
    src: "Firmy.cz",
    href: FIRMY,
  },
  {
    q: "Příjemné prostředí, kde je klid. Obsluha vždy přátelská. Čaje připravují výborně a směsi do dýmky sedí.",
    who: "Jasmína M.",
    src: "Tripadvisor",
    href: TRIP,
  },
  {
    q: "The best shisha I ever had. Huge variety of tobaccos, especially dark, and a reasonable price in the center of Prague.",
    who: "Róbert J.",
    src: "Tripadvisor",
    href: TRIP,
  },
  {
    q: "Go-to spot with friends or a partner. They really know their stuff when it comes to shisha.",
    who: "Hanka S.",
    src: "Tripadvisor",
    href: TRIP,
  },
  {
    q: "Whenever I need to chill, sit with friends, or have some alone time with a book. I like hookah here — they make it so it suits you.",
    who: "Tomas T.",
    src: "Tripadvisor",
    href: TRIP,
  },
];

export function Reviews() {
  const scroller = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  function step(dir: -1 | 1) {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector("a");
    const w = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * w, behavior: "smooth" });
  }

  return (
    <section id="recenze" className="py-16">
      <div className="px-5 md:px-12">
        <Reveal>
          <p className="kicker">{t("reviews.kicker")}</p>
          <div className="mt-3 flex items-end justify-between gap-4">
            <h2 className="headline text-4xl md:text-6xl">{t("reviews.title")}</h2>
            <div className="mb-1 flex gap-2">
              <button
                type="button"
                onClick={() => step(-1)}
                className="grid size-10 place-items-center rounded-full border border-gold/50 text-gold hover:bg-gold hover:text-bg"
                aria-label={t("reviews.prev")}
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                className="grid size-10 place-items-center rounded-full border border-gold/50 text-gold hover:bg-gold hover:text-bg"
                aria-label={t("reviews.next")}
              >
                ›
              </button>
            </div>
          </div>
          <span className="hairline mb-2" />
        </Reveal>
      </div>
      <div
        ref={scroller}
        className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:px-12"
        style={{ scrollbarWidth: "none" }}
      >
        {REVIEWS.map((r) => (
          <a
            key={r.who}
            href={r.href}
            target="_blank"
            rel="noreferrer"
            className="w-[min(84vw,22rem)] shrink-0 snap-start rounded-card border border-gold/25 bg-surface p-6 transition hover:border-gold hover:bg-gold/5"
          >
            <p className="font-serif text-5xl leading-none text-gold">“</p>
            <p className="mt-2 min-h-[6.5rem] text-sm leading-relaxed text-ivory">{r.q}</p>
            <footer className="mt-5 text-[11px] tracking-[0.16em] text-gold uppercase">
              {r.who}
              <span className="mt-1 block text-muted">
                {r.src} →
              </span>
            </footer>
          </a>
        ))}
      </div>
    </section>
  );
}
