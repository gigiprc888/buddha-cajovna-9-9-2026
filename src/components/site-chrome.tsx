import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { cartCount, subscribeCart } from "@/lib/shop";
import { isShopLive, subscribeFlags } from "@/lib/site-flags";
import { TipsStrip } from "@/components/tips-strip";
import { useI18n } from "@/lib/i18n";
import { SocialLinks } from "@/components/social-links";
import { onPhoneClick, track } from "@/lib/track";
import { MedovinarnaMark } from "@/components/medovinarna-mark";
import { TeaMountainMark } from "@/components/tea-mountain-mark";
import { Pic } from "@/components/pic";
import { ToTop } from "@/components/to-top";

function CartMark() {
  const { t } = useI18n();
  const [n, setN] = useState(0);
  const [live, setLive] = useState(false);
  useEffect(() => {
    const sync = () => {
      setN(cartCount());
      setLive(isShopLive());
    };
    sync();
    const a = subscribeCart(sync);
    const b = subscribeFlags(sync);
    return () => {
      a();
      b();
    };
  }, []);
  if (!live) {
    return (
      <Link
        to="/nakup"
        className="shrink-0 px-1 py-2 text-[10px] font-medium tracking-[0.14em] text-ivory uppercase hover:text-gold sm:text-[11px] md:rounded-full md:border md:border-gold/45 md:px-4 md:hover:border-gold md:hover:text-gold"
      >
        {t("nav.shop")}
      </Link>
    );
  }
  return (
    <Link
      to="/nakup"
      className="shrink-0 px-1 py-2 text-[10px] font-medium tracking-[0.14em] text-ivory uppercase hover:text-gold sm:text-[11px] md:rounded-full md:border md:border-gold/45 md:px-4 md:hover:border-gold md:hover:text-gold"
    >
      {t("nav.shop")}
      {n > 0 ? ` · ${n}` : ""}
    </Link>
  );
}

function MobileDock() {
  const { t } = useI18n();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t border-neon/50 bg-bg/92 px-1 pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_28px_rgb(196_92_255_/_0.08)] backdrop-blur-md md:hidden"
      aria-label={t("dock.where")}
    >
      <a href="/#kontakt" className="flex flex-col items-center gap-1 py-1 text-center">
        <span className="font-serif text-lg leading-none text-gold">⌖</span>
        <span className="text-[9px] uppercase tracking-wider text-ivory">{t("dock.where")}</span>
      </a>
      <a href="/#hodiny" className="flex flex-col items-center gap-1 py-1 text-center">
        <span className="font-serif text-lg leading-none text-gold">◷</span>
        <span className="text-[9px] uppercase tracking-wider text-ivory">{t("dock.hours")}</span>
      </a>
      <a href="tel:+420222515616" onClick={onPhoneClick} className="flex flex-col items-center gap-1 py-1 text-center">
        <span className="font-serif text-lg leading-none text-gold">☎</span>
        <span className="text-[9px] uppercase tracking-wider text-ivory">{t("dock.call")}</span>
      </a>
      <a
        href="https://maps.google.com/?q=Mysl%C3%ADkova+174/23,+Praha"
        className="flex flex-col items-center gap-1 py-1 text-center"
      >
        <span className="font-serif text-lg leading-none text-gold">➤</span>
        <span className="text-[9px] uppercase tracking-wider text-ivory">{t("dock.nav")}</span>
      </a>
    </nav>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { t, locale, setLocale } = useI18n();
  const links = [
    { href: "/#nabidka", label: t("nav.tea") },
    { href: "/#dymka", label: t("nav.pipes") },
    { href: "/hry", label: t("nav.games") },
    { href: "/menu", label: t("nav.fare") },
    { href: "/#nastenka", label: t("nav.board"), pin: true },
    { href: "/#kontakt", label: t("nav.contact") },
  ];
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[200] border-b border-gold/20 bg-bg">
        <div>
        <div className="relative z-[1] flex items-center justify-between gap-2 px-3 py-2.5 md:gap-4 md:px-8 md:py-3">
          <BrandLogo />
          <nav className="hidden items-center gap-4 uppercase text-ivory xl:gap-6 lg:flex">
            {links.map((l) => (
              <a key={l.href} href={l.href} className={l.pin ? "nav-link nav-pin" : "nav-link"}>
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-1 sm:gap-3">
            <button
              type="button"
              onClick={() => setLocale(locale === "cs" ? "en" : "cs")}
              className="hidden text-[11px] tracking-[0.16em] text-gold uppercase sm:inline"
              aria-label="Language"
            >
              {locale === "cs" ? "EN" : "CZ"}
            </button>
            <CartMark />
            <Link
              to="/rezervace"
              className="shrink-0 rounded-full bg-gold px-3 py-1.5 text-[10px] font-medium tracking-[0.12em] text-bg uppercase hover:bg-ivory sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[0.14em]"
            >
              {t("nav.book")}
            </Link>
            <button
              type="button"
              className="grid size-9 place-items-center rounded-full border border-gold/40 text-gold lg:hidden"
              aria-label={t("nav.menu")}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="font-serif text-lg leading-none">{open ? "×" : "☰"}</span>
            </button>
          </div>
        </div>
        {open && (
          <nav className="relative z-[1] grid gap-1 border-t border-gold/15 px-5 py-4 lg:hidden">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={
                  "py-2 font-serif text-2xl " + (l.href === "/#nastenka" ? "text-gold" : "text-ivory")
                }
              >
                {l.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setLocale(locale === "cs" ? "en" : "cs");
                setOpen(false);
              }}
              className="py-2 text-left font-serif text-2xl text-gold"
            >
              {locale === "cs" ? "English" : "Česky"}
            </button>
            <div className="pt-3">
              <SocialLinks />
            </div>
          </nav>
        )}
        </div>
      </header>
      <MobileDock />
      <TipsStrip />
      <ToTop />
    </>
  );
}

function IconCup() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10 text-gold" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M12 20h20c0 8-4.5 14-10 14s-10-6-10-14Z" />
      <path d="M32 22h4.5a5 5 0 0 1 0 10H31" />
      <path d="M14 36h16" />
      <path d="M20 8c0 3 2 4 2 7M25 7c0 3 2 4 2 7" strokeLinecap="round" />
    </svg>
  );
}
function IconHookah() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10 text-gold" fill="none" stroke="currentColor" strokeWidth="1.4">
      <ellipse cx="24" cy="14" rx="6" ry="3" />
      <path d="M24 17v8" />
      <path d="M18 33c0-5 3-8 6-8s6 3 6 8v2H18v-2Z" />
      <path d="M20 37h8" />
      <path d="M30 27c6 1 10 4 10 8" strokeLinecap="round" />
      <circle cx="40" cy="37" r="2.2" />
    </svg>
  );
}
function IconDice() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10 text-gold" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="10" y="16" width="18" height="18" rx="2" />
      <path d="M28 18l10-6 4 16-10 6" />
      <circle cx="16" cy="22" r="1.2" fill="currentColor" />
      <circle cx="22" cy="28" r="1.2" fill="currentColor" />
      <circle cx="16" cy="28" r="1.2" fill="currentColor" />
    </svg>
  );
}
function IconGatcha() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10 text-gold" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="16" y="28" width="16" height="10" rx="1" />
      <circle cx="24" cy="18" r="10" />
      <circle cx="20" cy="16" r="1.6" />
      <circle cx="26" cy="14" r="1.6" />
      <circle cx="28" cy="20" r="1.6" />
      <circle cx="22" cy="21" r="1.6" />
      <path d="M20 38h8" />
    </svg>
  );
}
function IconDidge() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10 text-gold" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M8 30c8-2 12-10 22-12 6-1 10 1 12 4" strokeLinecap="round" />
      <path d="M8 33c8-2 12-9 22-11" strokeLinecap="round" opacity=".5" />
      <circle cx="8" cy="31.5" r="2.4" />
      <circle cx="42" cy="22" r="2" />
    </svg>
  );
}

export function SiteFooter() {
  const { t } = useI18n();
  const icons = [
    { href: "/menu", Icon: IconCup, t: t("footer.icons.tea"), d: t("footer.icons.teaD") },
    { href: "/#dymka", Icon: IconHookah, t: t("footer.icons.pipes"), d: t("footer.icons.pipesD") },
    { href: "/hry", Icon: IconDice, t: t("footer.icons.games"), d: t("footer.icons.gamesD") },
    { href: "/gatcha", Icon: IconGatcha, t: t("footer.icons.gatcha"), d: t("footer.icons.gatchaD") },
    { href: "/#didgeridoo", Icon: IconDidge, t: t("footer.icons.didge"), d: t("footer.icons.didgeD") },
  ];
  const stories = [
    {
      href: "/#o-nas",
      src: "/place/hall.jpg",
      t: t("footer.stories.about"),
      d: t("footer.stories.aboutD"),
      cta: t("footer.stories.aboutC"),
    },
    {
      href: "/#didgeridoo",
      src: "/place/didgeridoo.jpg",
      t: t("footer.stories.didge"),
      d: t("footer.stories.didgeD"),
      cta: t("footer.stories.didgeC"),
    },
    {
      href: "/nakup",
      src: "/place/hookah-pair.jpg",
      t: t("footer.stories.pipes"),
      d: t("footer.stories.pipesD"),
      cta: t("footer.stories.pipesC"),
    },
  ];
  return (
    <footer className="border-t border-gold/20 pb-24 md:pb-10">
      <div className="grid grid-cols-2 gap-px bg-gold/15 sm:grid-cols-3 lg:grid-cols-5">
        {icons.map(({ href, Icon, t: title, d }) => (
          <a key={title} href={href} className="bg-bg px-4 py-6 text-center hover:bg-surface">
            <Icon />
            <p className="mt-3 text-[11px] tracking-[0.18em] text-gold uppercase">{title}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted">{d}</p>
          </a>
        ))}
      </div>

      <div className="grid gap-px bg-gold/15 md:grid-cols-3">
        {stories.map((s) => {
          const inner = (
            <div className="relative min-h-[12rem] overflow-hidden border border-gold/20 bg-bg">
              <Pic src={s.src} alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-transparent" />
              <div className="relative flex h-full min-h-[12rem] flex-col justify-end p-5">
                <p className="text-[11px] tracking-[0.2em] text-gold uppercase">{s.t}</p>
                <p className="mt-2 max-w-xs text-sm text-ivory">{s.d}</p>
                <span className="mt-3 text-[10px] tracking-[0.16em] text-gold uppercase">{s.cta} →</span>
              </div>
            </div>
          );
          return s.href.startsWith("/") && !s.href.startsWith("/#") ? (
            <Link key={s.t} to={s.href} className="block">
              {inner}
            </Link>
          ) : (
            <a key={s.t} href={s.href} className="block">
              {inner}
            </a>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-10 px-5 py-10 sm:grid-cols-2 lg:grid-cols-4 md:px-10">
        <div className="min-w-0">
          <BrandLogo compact />
          <p className="mt-3 max-w-[12rem] text-xs tracking-[0.2em] text-gold uppercase">{t("footer.motto")}</p>
          <p className="mt-6 text-[11px] tracking-[0.18em] text-gold uppercase">{t("footer.hours")}</p>
          <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-muted">{t("footer.hoursShort")}</p>
        </div>
        <div className="min-w-0">
          <p className="text-[11px] tracking-[0.18em] text-gold uppercase">{t("footer.contact")}</p>
          <p className="mt-3 text-sm text-muted">Myslíkova 174/23</p>
          <p className="text-sm text-muted">110 00 Praha 1</p>
          <a className="mt-2 block text-sm text-gold" href="tel:+420222515616" onClick={onPhoneClick}>
            +420 222 515 616
          </a>
          <a className="block break-all text-sm text-gold" href="mailto:buddha.provozni@gmail.com">
            buddha.provozni@gmail.com
          </a>
          <SocialLinks className="mt-4 flex-col items-start" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] tracking-[0.18em] text-gold uppercase">{t("footer.how")}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">{t("footer.metro")}</p>
          <p className="text-sm leading-relaxed text-muted">{t("footer.tram")}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{t("footer.door")}</p>
          <a
            href="https://maps.google.com/?q=Mysl%C3%ADkova+174/23,+Praha"
            className="mt-3 inline-block text-[10px] tracking-[0.16em] text-gold uppercase"
          >
            {t("footer.map")}
          </a>
        </div>
        <a
          href="https://maps.google.com/?q=Mysl%C3%ADkova+174/23,+Praha"
          className="relative min-w-0 overflow-hidden rounded-card border border-gold/25"
        >
          <Pic
            src="/place/exafin.jpg"
            alt="Pasáž Exafin, Myslíkova 174/23 — vchod z ulice"
            className="h-48 w-full object-cover object-[center_55%] md:h-full md:min-h-[12rem]"
          />
          <span className="absolute inset-x-0 bottom-0 bg-bg/80 px-3 py-2 text-[10px] tracking-[0.16em] text-gold uppercase">
            Pasáž Exafin · vchod z ulice
          </span>
        </a>
      </div>
      <div className="flex flex-col items-center gap-3 border-t border-gold/15 px-5 py-8">
        <p className="text-[11px] tracking-[0.22em] text-gold uppercase">{t("footer.partners")}</p>
        <div className="flex flex-wrap items-center justify-center gap-8">
          <MedovinarnaMark />
          <TeaMountainMark />
        </div>
        <a href="/smena" className="mt-4 text-[10px] tracking-[0.16em] text-muted/70 uppercase hover:text-gold">
          {t("footer.staff")}
        </a>
      </div>
      <div className="flex flex-col items-center gap-3 border-t border-gold/10 px-5 py-4 md:flex-row md:justify-between md:px-10">
        <p className="hidden text-[11px] tracking-[0.12em] text-muted/60 uppercase md:block">© 2026 Buddha čajovna</p>
        <a
          href="https://www.optimateo.com/onyx-web?utm_source=buddha-cajovna&utm_medium=client_footer&utm_campaign=onyx_web"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="ONYX WEB by OPTIMATEO — tvorba webů"
          className="text-[11px] tracking-[0.12em] uppercase outline-none hover:text-ivory/80 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-gold/70"
          onClick={() =>
            track("optimateo_credit_click", {
              source_site: "buddha-cajovna",
              placement: "footer",
              product: "onyx-web",
            })
          }
        >
          <span className="text-muted/70">ONYX WEB</span>
          <span className="text-muted/50"> by OPTIMATEO</span>
        </a>
      </div>
    </footer>
  );
}
