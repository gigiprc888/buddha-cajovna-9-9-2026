import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const Route = createFileRoute("/promo")({ component: Promo });

const CLIPS = [
  { src: "/promo/s01-caj.mp4", t: "Čaj", k: "Konvice · pára nahoru" },
  { src: "/promo/s02-dymka.mp4", t: "Dýmka", k: "Od 229 Kč k nápoji" },
  { src: "/promo/05-hry.mp4", t: "Sál", k: "Hry · lampy · večer" },
  { src: "/promo/s04-drink.mp4", t: "Drink", k: "To, co sál živí" },
  { src: "/promo/s03-pasaz.mp4", t: "Pasáž", k: "Vchod · Exafin" },
  { src: "/promo/07-gatcha.mp4", t: "Gatcha", k: "Zatočení po účtence" },
  { src: "/promo/08-wookah.mp4", t: "Wookah", k: "Dvě dýmky · Bacilli" },
];

function Promo() {
  return (
    <div className="min-h-screen bg-bg font-sans text-fg">
      <SiteHeader />
      <main className="px-5 pb-20 pt-28 md:px-12">
        <p className="kicker">Promo série</p>
        <h1 className="headline mt-3 text-5xl md:text-7xl">Osm klipů. Jedna nálada.</h1>
        <span className="hairline mb-6" />
        <p className="max-w-lg text-sm text-muted">
          Reels 9:16 a jeden wide 16:9. Pomalý kouř, svíčky, žádný lounge. Stačí stáhnout a dát na Instagram / FB.
        </p>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {CLIPS.map((c) => (
            <article key={c.src}>
              <video
                src={c.src}
                className="w-full rounded-card border border-line bg-black object-cover"
                controls
                muted
                loop
                playsInline
                preload="metadata"
              />
              <h2 className="headline mt-3 text-2xl">{c.t}</h2>
              <p className="text-xs uppercase tracking-[0.18em] text-gold">{c.k}</p>
              <a href={c.src} download className="mt-2 inline-block text-xs text-muted hover:text-gold">
                Stáhnout →
              </a>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
