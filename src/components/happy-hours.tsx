import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/reveal";
import { useI18n } from "@/lib/i18n";

export function HappyHours() {
  const { t } = useI18n();
  return (
    <section id="happy-hours" className="relative z-0 px-3 py-5 md:px-6">
      <div className="overflow-hidden rounded-card border border-gold/25 bg-surface">
        <div className="grid md:grid-cols-[0.9fr_1.2fr]">
          <div className="relative min-h-[16rem] bg-bg">
            <img
              src="/place/hh.jpg"
              alt="Happy Hours — dvě dýmky za cenu jedné"
              width={900}
              height={1125}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-[center_42%] opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface/80 md:to-surface" />
            <p className="absolute left-5 top-5 rounded-full bg-gold px-3 py-1 text-[10px] tracking-[0.2em] text-bg uppercase">
              {t("hh.badge")}
            </p>
          </div>
          <div className="relative p-6 md:p-8">
            <Reveal>
              <p className="kicker">{t("hh.kicker")}</p>
              <h2 className="headline mt-2 text-5xl md:text-6xl">{t("hh.title")}</h2>
              <p className="mt-2 font-serif text-3xl text-gold md:text-4xl">{t("hh.deal")}</p>
              <span className="hairline" />
            </Reveal>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ivory">{t("hh.lead")}</p>
            <ul className="mt-4 space-y-1.5 text-sm text-muted">
              <li>{t("hh.r1")}</li>
              <li>{t("hh.r2")}</li>
              <li>{t("hh.r3")}</li>
            </ul>
            <Link
              to="/rezervace"
              className="mt-6 inline-flex rounded-full bg-gold px-5 py-2.5 text-[11px] tracking-[0.14em] text-bg uppercase hover:bg-ivory"
            >
              {t("hh.cta")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
