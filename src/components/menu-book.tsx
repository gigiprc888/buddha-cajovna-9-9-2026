import { MENU_CATS } from "@/lib/menu-data";

export function MenuBook() {
  return (
    <div>
      <nav className="mb-6 flex flex-wrap gap-2">
        {MENU_CATS.map((c) => (
          <a
            key={c.id}
            href={`#m-${c.id}`}
            className="rounded-full border border-gold/25 px-3 py-1.5 text-[11px] tracking-[0.08em] text-ivory uppercase hover:border-gold hover:bg-gold hover:text-bg"
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
            className="scroll-mt-32 overflow-hidden rounded-card border bg-surface md:scroll-mt-36"
            style={{ borderColor: `${c.tone}66` }}
          >
            <header
              className="flex items-center gap-3 border-b px-5 py-4"
              style={{ borderColor: `${c.tone}44`, background: `${c.tone}14` }}
            >
              <span className="text-3xl leading-none">{c.emoji}</span>
              <div>
                <h2 className="font-serif text-2xl tracking-wide text-ivory uppercase">{c.title}</h2>
                {c.hint ? <p className="mt-0.5 text-xs text-muted">{c.hint}</p> : null}
              </div>
            </header>
            <ul>
              {c.items.map((x) => (
                <li
                  key={x.n}
                  className="flex items-center justify-between gap-4 border-b border-line/70 px-5 py-3.5 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="font-serif text-xl text-ivory">{x.n}</p>
                    {x.t ? <p className="mt-0.5 text-xs leading-relaxed text-muted">{x.t}</p> : null}
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
