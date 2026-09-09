import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Reveal } from "@/components/reveal";
import { GameMark } from "@/components/game-mark";
import { GAMES, GAMES_INTRO, type Game } from "@/lib/games";

export const Route = createFileRoute("/hry")({ component: HryPage });

type Filter = "all" | "duo" | "four" | "party" | "fast" | "long" | "easy" | "hard";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Vše" },
  { id: "duo", label: "2 hráči" },
  { id: "four", label: "do 4" },
  { id: "party", label: "5+" },
  { id: "fast", label: "do 30 min" },
  { id: "long", label: "nad 90 min" },
  { id: "easy", label: "nenáročné" },
  { id: "hard", label: "náročné" },
];

function match(g: Game, f: Filter) {
  if (f === "all") return true;
  if (f === "duo") return g.max === 2;
  if (f === "four") return g.max <= 4 && g.max > 2;
  if (f === "party") return g.max >= 5;
  if (f === "fast") return g.minutes <= 30;
  if (f === "long") return g.minutes >= 90;
  if (f === "easy") return g.difficulty <= 2;
  if (f === "hard") return g.difficulty >= 2.8;
  return true;
}

function HryPage() {
  const [f, setF] = useState<Filter>("all");
  const [open, setOpen] = useState<string | null>(null);
  const list = useMemo(() => GAMES.filter((g) => match(g, f)), [f]);

  return (
    <div className="relative min-h-screen font-sans text-fg">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <img src="/place/library.jpg" alt="" className="h-full w-full object-cover object-[50%_40%]" />
        <div className="absolute inset-0 bg-bg/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg/90" />
        <div className="absolute inset-0 opacity-[0.22]" style={{ backgroundImage: "url(/ornament.svg?v=alch)", backgroundSize: "320px 320px" }} />
      </div>
      <div className="relative h-56 overflow-hidden md:h-72">
        <SiteHeader />
        <div className="relative mx-auto flex h-full max-w-6xl items-end px-5 pb-8 md:px-10">
          <div>
            <p className="kicker">Vitrína čajovny</p>
            <h1 className="headline mt-1 text-4xl md:text-6xl">Půjčte si a hrajte.</h1>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-5 py-10 md:px-10">
        <Reveal>
          <p className="max-w-2xl text-sm leading-relaxed text-muted">{GAMES_INTRO.body}</p>
        </Reveal>

        <div className="mt-8 flex flex-wrap gap-2">
          {FILTERS.map((x) => (
            <button
              key={x.id}
              type="button"
              onClick={() => setF(x.id)}
              className={
                "rounded-full px-3 py-1.5 text-[11px] tracking-[0.14em] uppercase " +
                (f === x.id ? "bg-gold text-bg" : "border border-line text-muted hover:border-gold hover:text-gold")
              }
            >
              {x.label}
            </button>
          ))}
        </div>

        <p className="mt-4 text-xs tracking-[0.16em] text-gold uppercase">{list.length} her ve vitríně</p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {list.map((g) => {
            const shown = open === g.id;
            return (
              <article key={g.id} className="rounded-card border border-gold/20 bg-surface p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <GameMark id={g.id} name={g.name} />
                    <div>
                      {g.expansion && (
                        <p className="text-[10px] tracking-[0.18em] text-gold uppercase">Rozšíření</p>
                      )}
                      <h2 className="font-serif text-2xl text-ivory">{g.name}</h2>
                      <p className="mt-1 text-xs text-muted">{g.type}</p>
                    </div>
                  </div>
                  <p className="shrink-0 font-serif text-lg text-gold">{g.bgg.toFixed(1)}</p>
                </div>
                <p className={"mt-3 text-sm leading-relaxed text-ivory/90 " + (shown ? "" : "line-clamp-3")}>
                  {g.blurb}
                </p>
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted sm:grid-cols-4">
                  <div>
                    <dt className="uppercase tracking-wider">Hráči</dt>
                    <dd className="text-ivory">
                      {g.min}–{g.max}
                    </dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-wider">Čas</dt>
                    <dd className="text-ivory">{g.time}</dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-wider">Náročnost</dt>
                    <dd className="text-ivory">{g.difficulty}/5</dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-wider">BGG</dt>
                    <dd className="text-ivory">{g.bgg.toFixed(1)}</dd>
                  </div>
                </dl>
                <button
                  type="button"
                  onClick={() => setOpen(shown ? null : g.id)}
                  className="mt-4 text-[10px] tracking-[0.16em] text-gold uppercase"
                >
                  {shown ? "Méně" : "Celý popis"}
                </button>
              </article>
            );
          })}
        </div>

        <p className="mt-12 text-sm text-muted">
          Nevíte, co hrát? Řekněte obsluze, kolik vás je a kolik máte času.
        </p>
        <Link to="/rezervace" className="mt-4 inline-block text-sm text-gold">
          Rezervovat stůl k hře →
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
