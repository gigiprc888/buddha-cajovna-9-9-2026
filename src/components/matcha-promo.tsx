import { Link } from "@tanstack/react-router";
import { IG } from "@/lib/social";
import { Reveal } from "@/components/reveal";
import { Pic } from "@/components/pic";
import { useI18n } from "@/lib/i18n";

const PRICES = ["120 Kč", "159 Kč", "129 Kč", "139 Kč", "139 Kč", "120 Kč"];

export function MatchaPromo() {
  const { t } = useI18n();
  const items = [1, 2, 3, 4, 5, 6].map((i) => ({
    n: t(`matcha.n${i}`),
    t: t(`matcha.t${i}`),
    p: PRICES[i - 1],
  }));
  return (
    <section id="matcha" className="px-3 py-6 md:px-6">
      <div className="overflow-hidden rounded-card border border-[#8aa56a]/40 bg-surface">
        <div className="grid md:grid-cols-[1.15fr_1fr]">
          <div className="relative min-h-[22rem] bg-[#6f8f55]">
            <Pic
              src="/place/matcha.jpg"
              alt={t("matcha.title")}
              className="absolute inset-0 h-full w-full object-cover object-[center_42%]"
            />
            <p className="absolute left-5 top-5 rounded-full border border-[#c5d9a8] bg-bg/70 px-3 py-1 text-[10px] tracking-[0.18em] text-[#c5d9a8] uppercase">
              {t("matcha.badge")}
            </p>
          </div>
          <div className="carta p-6 text-paper-ink md:p-8">
            <Reveal>
              <p className="text-[0.68rem] tracking-[0.32em] text-paper-mute uppercase">{t("matcha.kicker")}</p>
              <h2 className="mt-2 font-serif text-4xl font-semibold leading-[0.9] tracking-[-0.045em] text-paper-ink md:text-5xl">
                {t("matcha.title")}
              </h2>
              <span className="hairline" />
            </Reveal>
            <ul className="mt-5 space-y-3">
              {items.map((x) => (
                <li key={x.n} className="flex items-baseline justify-between gap-3 border-b border-paper-ink/15 pb-2">
                  <div>
                    <p className="font-serif text-lg text-paper-ink">{x.n}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-paper-ink/80">{x.t}</p>
                  </div>
                  <p className="shrink-0 font-serif text-xl font-semibold text-[#4f7a38]">{x.p}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-paper-ink/70">{t("matcha.note")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/rezervace"
                className="rounded-full bg-gold px-5 py-2.5 text-[11px] tracking-[0.14em] text-bg uppercase hover:bg-paper-ink hover:text-paper"
              >
                {t("matcha.book")}
              </Link>
              <a
                href={IG}
                className="rounded-full border border-paper-ink/35 px-5 py-2.5 text-[11px] tracking-[0.14em] text-paper-ink uppercase hover:border-paper-ink"
                rel="noopener noreferrer"
              >
                {t("matcha.ig")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
