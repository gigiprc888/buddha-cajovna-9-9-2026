import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { LiveStill } from "@/components/live-still";
import { Reveal } from "@/components/reveal";
import {
  CATS,
  PRODUCTS,
  addToCart,
  cartLines,
  cartTotal,
  formatKc,
  setQty,
  subscribeCart,
  type Category,
} from "@/lib/shop";
import { isShopLive, subscribeFlags } from "@/lib/site-flags";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/nakup")({ component: Nakup });

function Nakup() {
  const [live, setLive] = useState(false);
  useEffect(() => {
    const sync = () => setLive(isShopLive());
    sync();
    return subscribeFlags(sync);
  }, []);
  if (!live) return <ShopSoon />;
  return <ShopLive />;
}

function ShopSoon() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-bg font-sans text-fg">
      <div className="relative h-52 overflow-hidden md:h-64">
        <LiveStill
          src="/hero.mp4"
          poster="/hero.jpg"
          alt=""
          className="absolute inset-0"
          videoClassName="absolute inset-0 h-full w-full object-cover object-[32%_82%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-bg/30" />
        <SiteHeader />
      </div>
      <main className="mx-auto max-w-2xl px-5 py-16">
        <Reveal>
          <p className="kicker">{t("shop.soonKicker")}</p>
          <h1 className="headline mt-2 text-4xl md:text-6xl">{t("shop.soonTitle")}</h1>
          <span className="hairline" />
        </Reveal>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">{t("shop.soonLead")}</p>
        <Link to="/rezervace" className="mt-8 inline-block rounded-full bg-gold px-6 py-3 text-sm text-bg hover:bg-ivory">
          {t("shop.soonCta")}
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}

function ShopLive() {
  const [cat, setCat] = useState<Category | "all">("all");
  const [lines, setLines] = useState(cartLines);
  const [flash, setFlash] = useState<string | null>(null);
  const { t } = useI18n();

  useEffect(() => subscribeCart(() => setLines(cartLines())), []);

  const items = useMemo(
    () => (cat === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat)),
    [cat],
  );

  return (
    <div className="min-h-screen bg-bg font-sans text-fg">
      <div className="relative h-52 overflow-hidden md:h-64">
        <LiveStill
          src="/hero.mp4"
          poster="/hero.jpg"
          alt=""
          className="absolute inset-0"
          videoClassName="absolute inset-0 h-full w-full object-cover object-[32%_82%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-bg/30" />
        <SiteHeader />
      </div>

      <main className="mx-auto grid max-w-6xl gap-10 px-5 py-10 lg:grid-cols-[1fr_280px]">
        <div>
          <Reveal>
          <p className="kicker">{t("shop.kicker")}</p>
          <h1 className="headline mt-2 text-4xl md:text-6xl">{t("shop.title")}</h1>
          <span className="hairline" />
          </Reveal>
          <p className="mt-2 max-w-lg text-sm text-muted">{t("shop.lead")}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {CATS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCat(c.id)}
                className={
                  "rounded-full px-4 py-2 text-xs uppercase tracking-[0.14em] " +
                  (cat === c.id ? "bg-gold text-bg" : "border border-line text-muted hover:border-gold hover:text-gold")
                }
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {items.map((p) => (
              <article key={p.id} className="overflow-hidden rounded-card border border-line bg-surface">
                <img
                  src={p.image}
                  alt={p.name}
                  width={900}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  className="aspect-square w-full object-cover"
                  style={p.fit ? { objectPosition: p.fit } : undefined}
                />
                <div className="p-5">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-gold">{p.unit}</p>
                  <h2 className="mt-1 font-serif text-3xl">{p.name}</h2>
                  <p className="mt-2 text-sm text-muted">{p.blurb}</p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="font-serif text-2xl text-gold">
                    {p.inquire ? "Na dotaz" : formatKc(p.price)}
                  </p>
                  {p.inquire ? (
                    <a
                      href="tel:+420222515616"
                      className="rounded-full bg-gold px-4 py-2 text-xs uppercase tracking-[0.14em] text-bg hover:bg-ivory"
                    >
                      Zeptat se
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        addToCart(p.id);
                        setFlash(p.name);
                      }}
                      className="rounded-full bg-gold px-4 py-2 text-xs uppercase tracking-[0.14em] text-bg hover:bg-ivory"
                    >
                      Do košíku
                    </button>
                  )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="h-fit rounded-card border border-line bg-surface p-5 lg:sticky lg:top-8">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gold">Košík</p>
          {lines.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Zatím prázdný. Přidejte čaj nebo Wookah.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {lines.map((l) => (
                <li key={l.id} className="flex items-start justify-between gap-2 text-sm">
                  <span>
                    {l.product.name}
                    <span className="block text-xs text-muted">{formatKc(l.product.price)}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <button type="button" onClick={() => setQty(l.id, l.qty - 1)} className="text-gold">
                      −
                    </button>
                    {l.qty}
                    <button type="button" onClick={() => setQty(l.id, l.qty + 1)} className="text-gold">
                      +
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-5 font-serif text-2xl">{formatKc(cartTotal())}</p>
          <p className="mt-1 text-xs text-muted">Vyzvednutí v čajovně · platba na místě.</p>
          <a
            href="tel:+420222515616"
            className="mt-5 block rounded-full bg-gold py-3 text-center text-sm text-bg hover:bg-ivory"
          >
            Objednat telefonem
          </a>
          {flash && <p className="mt-3 text-xs text-gold">V košíku: {flash}</p>}
        </aside>
      </main>
      <SiteFooter />
    </div>
  );
}
