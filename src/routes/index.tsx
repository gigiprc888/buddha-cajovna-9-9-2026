import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Nastenka } from "@/components/nastenka";
import { TeaSteam } from "@/components/tea-steam";
import { LiveStill } from "@/components/live-still";
import { MarkDuo, MarkFriends, MarkParty } from "@/components/reason-marks";
import { OfferMosaic } from "@/components/offer-mosaic";
import { Reviews } from "@/components/reviews";
import { HOURS_CS } from "@/lib/schema";
import { Reveal } from "@/components/reveal";
import { useI18n } from "@/lib/i18n";
import { onPhoneClick } from "@/lib/track";
import { MatchaPromo } from "@/components/matcha-promo";
import { Pic } from "@/components/pic";
import { HappyHours } from "@/components/happy-hours";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { t } = useI18n();
  const reasons = [
    { k: t("reasons.duo"), t: t("reasons.duoT"), Mark: MarkDuo },
    { k: t("reasons.friends"), t: t("reasons.friendsT"), Mark: MarkFriends },
    { k: t("reasons.party"), t: t("reasons.partyT"), Mark: MarkParty },
  ];
  const taste = [
    {
      img: "/shop/sakurac.jpg",
      name: t("taste.sakurac"),
      t: t("taste.sakuracT"),
      to: "/menu",
      ext: null,
      fit: "object-cover",
    },
    {
      img: "/shop/waysa.jpg",
      name: t("taste.waysa"),
      t: t("taste.waysaT"),
      to: "/menu",
      ext: null,
      fit: "object-contain bg-[#efe6d4]",
    },
    {
      img: "/shop/norske-medoviny.jpg",
      name: t("taste.mead"),
      t: t("taste.meadT"),
      to: null,
      ext: "https://www.medovinarna.cz",
      fit: "object-cover",
    },
  ];
  return (
    <div className="min-h-screen bg-bg font-sans text-fg">
      <SiteHeader />

      <section className="relative isolate min-h-screen overflow-hidden">
        <LiveStill
          src="/hero.mp4"
          poster="/hero.jpg"
          alt="Čajovna Buddha — suterén, čaj a světlo"
          priority
          className="absolute inset-0"
          videoClassName="absolute inset-0 h-full w-full origin-[38%_78%] scale-[1.55] object-cover object-[38%_78%]"
        />
        <TeaSteam />
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-bg via-bg/45 to-bg/25" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-bg/50 via-transparent to-bg/20" />
        <div className="relative z-10 flex min-h-screen flex-col justify-end px-5 pb-10 pt-28 md:px-12 md:pb-16">
          <Reveal>
            <p className="kicker text-read">{t("hero.kicker")}</p>
            <h1 className="headline text-read mt-4 whitespace-pre-line text-[14vw] leading-[0.9] uppercase md:text-8xl">
              {t("hero.title")}
            </h1>
            <p className="text-read mt-5 max-w-md font-serif text-xl italic text-gold md:text-2xl">
              {t("hero.italic")}
            </p>
          </Reveal>
          <p className="text-read mt-3 max-w-md text-sm text-ivory/90">{t("hero.lead")}</p>
          <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Link
              to="/rezervace"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-medium tracking-wide text-bg hover:bg-ivory"
            >
              ✦ {t("hero.cta")}
            </Link>
            <a
              href="https://maps.google.com/?q=Mysl%C3%ADkova+174/23,+Praha"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gold/50 bg-bg/55 px-6 py-3.5 text-sm tracking-wide text-gold backdrop-blur-sm hover:border-gold hover:bg-gold hover:text-bg"
            >
              {t("hero.maps")}
            </a>
          </div>
        </div>
      </section>

      <OfferMosaic />
      <HappyHours />
      <MatchaPromo />

      <section id="ochutnej" className="bg-paper px-5 py-7 text-paper-ink md:px-12 md:py-8">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-[10px] tracking-[0.28em] text-[#8a7349] uppercase">{t("taste.kicker")}</p>
            <h2 className="mt-1 font-serif text-3xl leading-none md:text-4xl">{t("taste.title")}</h2>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {taste.map((p) => {
            const body = (
              <>
                <div className="h-[4.75rem] w-[5.5rem] shrink-0 overflow-hidden rounded-md bg-[#efe6d4] sm:h-20 sm:w-24">
                  <Pic src={p.img} alt={p.name} priority className={"h-full w-full " + p.fit} />
                </div>
                <div className="min-w-0 flex-1 py-0.5">
                  <h3 className="font-serif text-xl leading-tight">{p.name}</h3>
                  <p className="mt-0.5 text-[13px] leading-snug text-[#5c4e3a]">{p.t}</p>
                  <span className="mt-1.5 inline-block text-[10px] tracking-[0.16em] text-[#8a7349] uppercase">
                    {t("taste.more")} →
                  </span>
                </div>
              </>
            );
            const cls = "flex items-center gap-3 rounded-xl bg-white/80 px-3 py-2.5";
            if (p.to) {
              return (
                <Link key={p.name} to={p.to} className={cls}>
                  {body}
                </Link>
              );
            }
            return (
              <a
                key={p.name}
                href={p.ext ?? "/menu"}
                className={cls}
                target="_blank"
                rel="noreferrer"
              >
                {body}
              </a>
            );
          })}
        </div>
      </section>

      <section className="neon-frame relative mx-3 overflow-hidden rounded-card md:mx-6">
        <img
          src="/place/hall.jpg"
          alt="Sál čajovny Buddha"
          className="absolute inset-0 h-full w-full object-cover object-[50%_60%] brightness-110 contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/80 to-transparent md:via-bg/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg/50 via-transparent to-bg/20" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            boxShadow: "inset 0 0 80px rgb(212 180 131 / 0.22), inset 0 0 0 1px rgb(232 201 138 / 0.35)",
          }}
        />
        <div className="relative px-6 py-14 md:px-14 md:py-20">
          <p className="kicker text-gold">{t("bookBand.kicker")}</p>
          <h2 className="headline mt-3 text-5xl text-ivory md:text-7xl">{t("bookBand.title")}</h2>
          <span className="hairline" />
          <p className="mt-4 max-w-md text-base text-ivory">{t("bookBand.lead")}</p>
          <Link
            to="/rezervace"
            className="mt-8 inline-flex rounded-full bg-gold px-8 py-4 text-sm font-medium tracking-[0.14em] text-bg uppercase shadow-[0_0_40px_rgb(212_180_131_/_0.45)] hover:bg-ivory"
          >
            {t("bookBand.cta")}
          </Link>
        </div>
      </section>

      <Nastenka />

      <section className="motif px-5 py-16 md:px-12">
        <Reveal>
          <p className="kicker">{t("reasons.kicker")}</p>
          <h2 className="headline mt-3 text-5xl md:text-7xl">{t("reasons.title")}</h2>
          <span className="hairline mb-2" />
        </Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {reasons.map((r) => (
            <article key={r.k} className="rounded-card border border-gold/20 bg-surface p-6">
              <Reveal>
                <div className="text-ivory">
                  <r.Mark />
                </div>
                <h3 className="headline mt-4 text-3xl">{r.k}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{r.t}</p>
              </Reveal>
            </article>
          ))}
        </div>
      </section>

      <section id="dymka" className="grid items-center gap-8 px-5 py-10 md:grid-cols-[minmax(16rem,24rem)_1fr] md:px-12">
        <div className="neon-frame relative mx-auto aspect-[3/4] w-full max-w-[22rem] overflow-hidden rounded-card bg-bg">
          <LiveStill
            src="/promo/s02-dymka.mp4"
            poster="/place/hookah-portrait.jpg"
            alt="Vodní dýmka — žhnoucí kotel"
            className="absolute inset-0"
            videoClassName="absolute inset-0 h-full w-full object-cover object-[center_8%]"
          />
        </div>
        <div className="flex flex-col justify-center">
          <Reveal>
            <p className="kicker">{t("pipeSec.kicker")}</p>
            <h2 className="headline mt-2 text-5xl md:text-7xl">{t("pipeSec.title")}</h2>
            <span className="hairline" />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">{t("pipeSec.body")}</p>
          </Reveal>
        </div>
      </section>

      <section id="hry" className="grid gap-0 md:grid-cols-2">
        <div className="flex flex-col justify-center bg-bg px-6 py-12 md:px-12">
          <Reveal>
            <p className="kicker">{t("gamesSec.kicker")}</p>
            <h2 className="headline mt-2 text-5xl md:text-7xl">{t("gamesSec.title")}</h2>
            <span className="hairline" />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">{t("gamesSec.body")}</p>
            <Link to="/hry" className="mt-6 inline-block text-sm text-gold">
              {t("gamesSec.cta")}
            </Link>
          </Reveal>
        </div>
        <div className="neon-frame relative h-80 md:min-h-[28rem]">
          <LiveStill
            src="/promo/05-hry.mp4"
            poster="/place/library.jpg"
            alt="Sál s hrami a ratanovými židlemi"
            className="absolute inset-0"
            videoClassName="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </section>

      <section id="gatcha" className="grid gap-0 md:grid-cols-2">
        <img
          src="/banners/gatcha.jpg"
          alt="Gatcha — zatoč po účtence"
          className="h-72 w-full border border-gold/35 object-cover md:h-full md:min-h-[22rem]"
        />
        <div className="flex flex-col justify-center bg-surface px-6 py-12 md:px-12">
          <Reveal>
            <p className="kicker">{t("gatchaSec.kicker")}</p>
            <h2 className="headline mt-2 text-5xl md:text-7xl">{t("gatchaSec.title")}</h2>
            <span className="hairline" />
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
              {t("gatchaSec.from")}{" "}
              <span className="mx-0.5 inline-block rounded-full bg-gold px-2.5 py-0.5 font-serif text-[1.05rem] font-semibold tracking-wide text-bg shadow-[0_0_18px_rgb(212_180_131_/_0.45)]">
                {t("gatchaSec.small")}
              </span>{" "}
              {t("gatchaSec.eqS")} {t("gatchaSec.from2")}{" "}
              <span className="mx-0.5 inline-block rounded-full bg-gold px-2.5 py-0.5 font-serif text-[1.05rem] font-semibold tracking-wide text-bg shadow-[0_0_18px_rgb(212_180_131_/_0.45)]">
                {t("gatchaSec.big")}
              </span>{" "}
              {t("gatchaSec.eqL")} {t("gatchaSec.note")}
            </p>
            <Link to="/gatcha" className="mt-6 inline-block text-sm text-gold">
              {t("gatchaSec.cta")}
            </Link>
          </Reveal>
        </div>
      </section>

      <Reviews />

      <section id="o-nas" className="motif px-5 py-16 md:px-12">
        <Reveal>
          <p className="kicker">{t("about.kicker")}</p>
          <h2 className="headline mt-2 text-5xl md:text-7xl">{t("about.title")}</h2>
          <span className="hairline" />
        </Reveal>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">{t("about.body")}</p>
      </section>

      <section id="didgeridoo" className="grid gap-0 md:grid-cols-2">
        <Pic src="/place/didgeridoo.jpg" alt="Didgeridoo na stěně čajovny" className="h-72 w-full object-cover md:h-full md:min-h-[20rem]" />
        <div className="flex flex-col justify-center bg-surface px-6 py-12 md:px-12">
          <Reveal>
            <p className="kicker">{t("didge.kicker")}</p>
            <h2 className="headline mt-2 text-5xl md:text-7xl">{t("didge.title")}</h2>
            <span className="hairline" />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">{t("didge.body")}</p>
            <Link to="/nakup" className="mt-6 inline-block text-sm text-gold">
              {t("didge.cta")}
            </Link>
          </Reveal>
        </div>
      </section>

      <section id="kontakt" className="motif grid gap-10 px-5 py-16 md:grid-cols-2 md:px-12">
        <div>
          <Reveal>
            <p className="kicker">{t("contact.kicker")}</p>
            <h2 className="headline mt-2 text-5xl md:text-7xl">Myslíkova 174/23</h2>
            <span className="hairline" />
          </Reveal>
          <p className="mt-3 text-muted">{t("contact.pass")}</p>
          <p className="mt-1 text-sm text-muted">{t("contact.exafin")}</p>
          <a className="mt-4 inline-block text-gold" href="tel:+420222515616" onClick={onPhoneClick}>
            +420 222 515 616
          </a>
          <p className="mt-8 text-[11px] uppercase tracking-[0.22em] text-gold">{t("contact.how")}</p>
          <ol className="mt-3 space-y-2 text-sm text-muted">
            <li>{t("contact.s1")}</li>
            <li>{t("contact.s2")}</li>
            <li>{t("contact.s3")}</li>
          </ol>
        </div>
        <div>
          <div className="relative mb-6 h-48 overflow-hidden rounded-card border border-gold/25 md:h-56">
            <img
              src="/place/corridor.jpg"
              alt="Pasáž a vchod do suterénu"
              className="h-full w-full object-cover"
            />
            <span className="lamp-glow lamp-glow--tall" aria-hidden />
            <span className="lamp-glow lamp-glow--low" aria-hidden />
          </div>
          <table id="hodiny" className="w-full text-sm">
            <tbody>
              {HOURS_CS.map(([day, hours]) => (
                <tr key={day} className="border-b border-gold/15">
                  <th className="py-2.5 text-left font-normal text-muted">{t(`days.${day}`)}</th>
                  <td className="py-2.5 text-right font-serif text-lg text-gold">{hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
