import { type MouseEvent } from "react";
import { useI18n } from "@/lib/i18n";
import { Pic } from "@/components/pic";

function IconCup() {
  return (
    <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 20h20c0 8-4.5 14-10 14s-10-6-10-14Z" />
      <path d="M32 22h4.5a5 5 0 0 1 0 10H31" />
      <path d="M14 36h16" />
      <path d="M20 8c0 3 2 4 2 7M25 7c0 3 2 4 2 7" strokeLinecap="round" />
    </svg>
  );
}
function IconHookah() {
  return (
    <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5">
      <ellipse cx="24" cy="14" rx="6" ry="3" />
      <path d="M24 17v8" />
      <path d="M18 33c0-5 3-8 6-8s6 3 6 8v2H18v-2Z" />
      <path d="M20 37h8" />
      <path d="M30 27c6 1 10 4 10 8" strokeLinecap="round" />
    </svg>
  );
}
function IconGatcha() {
  return (
    <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="16" y="28" width="16" height="10" rx="1" />
      <circle cx="24" cy="18" r="10" />
      <circle cx="20" cy="16" r="1.6" />
      <circle cx="26" cy="14" r="1.6" />
      <circle cx="28" cy="20" r="1.6" />
    </svg>
  );
}
function IconDice() {
  return (
    <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="10" y="16" width="18" height="18" rx="2" />
      <path d="M28 18l10-6 4 16-10 6" />
      <circle cx="16" cy="22" r="1.2" fill="currentColor" />
      <circle cx="22" cy="28" r="1.2" fill="currentColor" />
    </svg>
  );
}

function playClip(e: MouseEvent<HTMLElement>) {
  const v = e.currentTarget.querySelector("video");
  if (!v) return;
  v.currentTime = 0;
  const p = v.play();
  if (p) p.catch(() => {});
}
function stopClip(e: MouseEvent<HTMLElement>) {
  const v = e.currentTarget.querySelector("video");
  if (!v) return;
  v.pause();
  v.currentTime = 0;
}

export function OfferMosaic() {
  const { t } = useI18n();
  const tiles = [
    { href: "/menu", src: "/banners/caje-drinky.jpg", video: "/banners/caje-drinky.mp4", title: t("mosaic.offer"), sub: t("mosaic.offerSub"), Icon: IconCup, kind: "tea" },
    { href: "#dymka", src: "/banners/dymky.jpg", video: "/banners/dymky.mp4", title: t("mosaic.pipes"), sub: t("mosaic.pipesSub"), Icon: IconHookah, kind: "pipe" },
    { href: "/gatcha", src: "/banners/gatcha.jpg", video: "/banners/gatcha.mp4", title: t("mosaic.gatcha"), sub: t("mosaic.gatchaSub"), Icon: IconGatcha, kind: "gatcha" },
    { href: "/hry", src: "/banners/hry.jpg", video: null, title: t("mosaic.games"), sub: t("mosaic.gamesSub"), Icon: IconDice, kind: "games" },
  ] as const;
  return (
    <section id="nabidka" className="px-3 py-3 md:px-6 md:py-5">
      <div className="grid gap-2 md:grid-cols-2 md:gap-3">
        {tiles.map((tile, i) => {
          const inner = (
            <>
              <Pic
                src={tile.src}
                alt={tile.title}
                priority={i < 2}
                className="absolute inset-0 h-full w-full object-cover"
              />
              {tile.video ? (
                <video
                  className="offer-clip absolute inset-0 z-[1] h-full w-full object-cover"
                  muted
                  loop
                  playsInline
                  preload="none"
                  poster={tile.src}
                >
                  <source src={tile.video} type="video/mp4" />
                </video>
              ) : null}
              <div className="absolute inset-0 z-[2] bg-gradient-to-r from-bg via-bg/55 to-transparent md:bg-gradient-to-t md:from-bg md:via-bg/40 md:to-transparent" />
              <div className="offer-warm pointer-events-none absolute inset-0 z-[2]" />
              <span className="offer-fx pointer-events-none absolute inset-0 z-[2]" aria-hidden />
              <div className="absolute inset-0 z-[2] ring-1 ring-inset ring-gold/35" />
              <div className="absolute inset-0 z-[3] flex items-center justify-between gap-3 p-4 md:items-end md:p-5">
                <div className="offer-copy flex items-center gap-3 md:flex-col md:items-start">
                  <span className="offer-mark grid size-12 shrink-0 place-items-center rounded-full border border-gold text-gold">
                    <tile.Icon />
                  </span>
                  <div>
                    <h2 className="font-serif text-2xl leading-none tracking-[0.06em] text-ivory uppercase md:text-4xl">{tile.title}</h2>
                    <p className="mt-1 hidden max-w-[16rem] text-sm text-ivory/85 md:block">{tile.sub}</p>
                  </div>
                </div>
                <span className="offer-arrow font-serif text-2xl text-gold">›</span>
              </div>
            </>
          );
          const cls = `neon-frame offer-tile offer-${tile.kind} relative h-28 overflow-hidden rounded-card sm:h-32 md:h-64`;
          const hover = tile.video ? { onMouseEnter: playClip, onMouseLeave: stopClip } : {};
          const href = tile.href.startsWith("#") ? `/${tile.href}` : tile.href;
          return (
            <a key={tile.href} href={href} className={cls} {...hover}>
              {inner}
            </a>
          );
        })}
      </div>
    </section>
  );
}
