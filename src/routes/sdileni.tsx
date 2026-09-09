import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const Route = createFileRoute("/sdileni")({ component: Sdileni });

const TITLE = "Buddha čajovna";
const DESC = "Čajovna a dýmka v Praze na Myslíkově. Suterén, vchod z ulice přes pasáž, budova Exafin.";
const HOST = "buddhacajovna.cz";

function Sdileni() {
  return (
    <div className="min-h-screen bg-bg font-sans text-fg">
      <div className="relative h-24 overflow-hidden">
        <img src="/hero.jpg" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-bg/60" />
        <SiteHeader />
      </div>
      <main className="mx-auto max-w-6xl px-5 py-6">
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Kontrola unfurl</p>
        <h1 className="mt-1 font-serif text-3xl md:text-4xl">Náhledy na sociálních sítích</h1>
        <p className="mt-1 max-w-xl text-sm text-muted">
          1200×630 · summary_large_image. Obrázek bez textu — název doplní síť.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <article>
            <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-muted">Facebook / Messenger</p>
            <div className="overflow-hidden rounded-md border border-line bg-[#242526]">
              <img src="/og.jpg" alt="OG karta" className="aspect-[1.91/1] w-full object-cover" />
              <div className="border-t border-white/10 px-3 py-2.5">
                <p className="text-[11px] uppercase tracking-wide text-[#b0b3b8]">{HOST}</p>
                <p className="mt-0.5 text-[15px] font-semibold leading-tight text-white">{TITLE}</p>
                <p className="mt-0.5 line-clamp-2 text-[13px] text-[#b0b3b8]">{DESC}</p>
              </div>
            </div>
          </article>

          <article>
            <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-muted">X / Twitter</p>
            <div className="overflow-hidden rounded-2xl border border-[#2f3336] bg-black">
              <img src="/og.jpg" alt="OG karta" className="aspect-[1.91/1] w-full object-cover" />
              <div className="px-3 py-2">
                <p className="text-[15px] font-semibold text-[#e7e9ea]">{TITLE}</p>
                <p className="text-[13px] text-[#8b98a5]">{DESC}</p>
                <p className="mt-1 text-[13px] text-[#8b98a5]">{HOST}</p>
              </div>
            </div>
          </article>

          <article>
            <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-muted">iMessage / WhatsApp</p>
            <div className="overflow-hidden rounded-2xl bg-surface shadow-lg">
              <img src="/og.jpg" alt="OG karta" className="aspect-[1.91/1] w-full object-cover" />
              <div className="px-3 py-2.5">
                <p className="text-sm font-medium text-ivory">{TITLE}</p>
                <p className="text-xs text-muted">{HOST}</p>
              </div>
            </div>
          </article>
        </div>

        <ul className="mt-10 space-y-2 text-sm text-muted">
          <li>Rozměr karty: 1200 × 630 · JPEG 96 kB — v pořádku.</li>
          <li>Favicon: mosazná miska na černém — čitelná v tabu.</li>
          <li>
            Tag <code className="text-gold">og:image</code> se doplní až na publikované adrese. V
            náhledu tady vidíš stejný soubor.
          </li>
        </ul>
        <Link to="/" className="mt-8 inline-block text-sm text-gold">
          Zpět na Buddha
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
