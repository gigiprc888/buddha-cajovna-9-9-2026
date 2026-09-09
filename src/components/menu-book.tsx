import { MENU_CATS } from "@/lib/menu-data";

export function MenuBook() {
  return (
    <div>
      <nav className="mb-6 flex flex-wrap gap-2">
        {MENU_CATS.map((c) => (
          <a
            key={c.id}
            href={`#m-${c.id}`}
            className="rounded-full border border-paper-ink/20 bg-paper px-3 py-1.5 text-[11px] tracking-[0.08em] text-paper-ink uppercase hover:border-gold hover:bg-gold hover:text-bg"
          >
            <span className="mr-1.5">{c.emoji}</span>
            {c.title}
          </a>
        ))}
      </nav>

      <div className="space-y-5">
        {MENU_CATS.map((c) => (
          <section
            key={c.id}
            id={`m-${c.id}`}
            className="carta scroll-mt-32 overflow-hidden rounded-card border md:scroll-mt-36"
            style={{ borderColor: `${c.tone}66` }}
          >
            <header
              className="flex items-center gap-3 border-b px-5 py-4"
              style={{ borderColor: `${c.tone}44`, background: `${c.tone}14` }}
            >
              <span className="text-3xl leading-none">{c.emoji}</span>
              <div>
                <h2 className="font-serif text-2xl tracking-wide text-paper-ink uppercase">{c.title}</h2>
                {c.hint ? <p className="mt-1 text-sm leading-snug text-paper-ink/80">{c.hint}</p> : null}
              </div>
            </header>
            <ul>
              {c.items.map((x) => (
                <li
                  key={x.n}
                  className="flex items-center justify-between gap-4 border-b border-paper-ink/10 px-5 py-3.5 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="font-serif text-xl text-paper-ink">{x.n}</p>
                    {x.t ? <p className="mt-1 max-w-xl text-sm leading-relaxed text-paper-ink/90">{x.t}</p> : null}
                  </div>
                  <p
                    className="shrink-0 rounded-full px-3 py-1 font-serif text-xl font-semibold tracking-wide"
                    style={{ color: "#0c0b0a", background: c.tone }}
                  >
                    {x.p}
                    {/\d/.test(x.p) && !x.p.includes("dle") ? " Kč" : ""}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
