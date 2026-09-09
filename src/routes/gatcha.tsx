import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/gatcha")({ component: GatchaPage });

function GatchaPage() {
  return (
    <div className="min-h-screen bg-bg font-sans text-fg">
      <div className="relative h-56 overflow-hidden md:h-72">
        <img src="/banners/gatcha.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/30" />
        <SiteHeader />
        <div className="relative mx-auto flex h-full max-w-3xl items-end px-5 pb-8 md:px-10">
          <div>
            <p className="kicker">Gatcha</p>
            <h1 className="headline mt-1 text-4xl md:text-6xl">Zatočení po účtence.</h1>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-5 py-12 md:px-10">
        <Reveal>
          <p className="text-sm leading-relaxed text-muted">
            Gacha je japonský způsob, jak získat malé figurky, hračky a překvapení. Výsledek
            předem neznáte — právě v tom spočívá kouzlo.
          </p>
        </Reveal>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Buddha není jen čaj, dýmka a společnost. Do sálu patří i náhoda a sbírání.
          V automatech najdete anime figurky, Pokémon hračky, sběratelské předměty
          nebo funkční mini game box s 23 hrami.
        </p>

        <h2 className="headline mt-12 text-3xl">Chcete si zatočit?</h2>
        <span className="hairline" />
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Gachu můžete hrát kdykoli za mince: vyberete automat, vhodíte platidlo a jednou otočíte
          páčkou. Při vyšší útratě je zatočení zdarma.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <article className="rounded-card border border-gold/30 bg-surface p-6">
            <p className="font-serif text-4xl text-gold">1 500 Kč</p>
            <p className="mt-2 text-sm text-ivory">na jedné účtence</p>
            <p className="mt-3 text-sm text-muted">1× zatočení zdarma v jednom z menších automatů.</p>
          </article>
          <article className="rounded-card border border-gold/30 bg-surface p-6">
            <p className="font-serif text-4xl text-gold">2 000 Kč</p>
            <p className="mt-2 text-sm text-ivory">na jedné účtence</p>
            <p className="mt-3 text-sm text-muted">1× zatočení zdarma ve velkém automatu.</p>
          </article>
        </div>

        <p className="mt-8 text-sm text-muted">
          Platí pouze účtenka daného dne. Předložte ji obsluze.
        </p>
        <p className="mt-3 text-sm text-muted">
          Automat bere mince 5, 10, 20 a 50 Kč a nevrací. O rozměnění požádejte obsluhu.
        </p>

        <Link to="/rezervace" className="mt-10 inline-block text-sm text-gold">
          Rezervovat stůl →
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
