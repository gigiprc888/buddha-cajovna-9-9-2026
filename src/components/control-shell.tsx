import { useEffect, useState } from "react";

export type ControlPage =
  | "overview"
  | "reservations"
  | "analytics"
  | "board"
  | "menu"
  | "shop"
  | "social"
  | "ops"
  | "settings";

const PRIMARY: { id: ControlPage; label: string }[] = [
  { id: "overview", label: "Přehled" },
  { id: "reservations", label: "Rezervace" },
  { id: "analytics", label: "Analytika" },
];

const CONTENT: { id: ControlPage; label: string }[] = [
  { id: "board", label: "Nástěnka" },
  { id: "menu", label: "Menu" },
];

const SOON: { id: ControlPage; label: string }[] = [
  { id: "shop", label: "E-shop" },
  { id: "social", label: "Sítě" },
];

const OPS: { id: ControlPage; label: string }[] = [
  { id: "ops", label: "Provoz" },
  { id: "settings", label: "Nastavení" },
];

type Props = {
  page: ControlPage;
  onPage: (p: ControlPage) => void;
  who: string;
  role: string;
  onOut: () => void;
  children: React.ReactNode;
};

export function ControlShell({ page, onPage, who, role, onOut, children }: Props) {
  const [open, setOpen] = useState(false);
  const [rail, setRail] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setRail(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [page]);

  const collapsed = !open && !rail;

  return (
    <div className="ctrl min-h-screen bg-bg font-sans text-fg">
      {open ? (
        <button
          type="button"
          aria-label="Zavřít menu"
          className="fixed inset-0 z-30 bg-bg/70 lg:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        className={`ctrl-rail fixed inset-y-0 left-0 z-40 flex flex-col border-r border-gold/20 bg-[#0e0c0a] transition-[width,transform] duration-200 ${
          open ? "w-[15.5rem] translate-x-0" : collapsed ? "w-[4.5rem] -translate-x-full lg:translate-x-0" : "w-[15.5rem]"
        } lg:translate-x-0`}
      >
        <div className={`border-b border-gold/15 px-3 py-4 ${collapsed && !open ? "px-2" : ""}`}>
          <p className="font-serif text-lg tracking-[0.12em] text-ivory uppercase">Buddha</p>
          <p className="text-[10px] tracking-[0.28em] text-gold uppercase">Control</p>
          {!collapsed || open ? <p className="mt-1 text-[10px] tracking-[0.08em] text-muted">Tea house operations</p> : null}
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <RailGroup items={PRIMARY} page={page} onPage={onPage} slim={collapsed && !open} />
          <RailGroup items={CONTENT} page={page} onPage={onPage} slim={collapsed && !open} />
          <RailGroup items={SOON} page={page} onPage={onPage} slim={collapsed && !open} soon />
          <RailGroup items={OPS} page={page} onPage={onPage} slim={collapsed && !open} />
        </nav>

        <div className="border-t border-gold/15 px-3 py-3">
          <p className="flex items-center gap-2 text-[10px] tracking-[0.16em] text-muted uppercase">
            <span className="size-1.5 rounded-full bg-emerald-400/80" />
            {!collapsed || open ? "Web · online" : ""}
          </p>
          {!collapsed || open ? <p className="mt-1 text-[9px] tracking-[0.18em] text-muted/70 uppercase">Onyx web</p> : null}
        </div>
      </aside>

      <div className={`min-h-screen ${collapsed && !open ? "lg:pl-[4.5rem]" : "lg:pl-[15.5rem]"}`}>
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-gold/15 bg-bg/92 px-3 py-3 backdrop-blur-md md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="grid size-9 place-items-center rounded-full border border-gold/30 text-gold lg:hidden"
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
            >
              ☰
            </button>
            <button
              type="button"
              className="hidden size-9 place-items-center rounded-full border border-gold/20 text-[10px] tracking-widest text-muted uppercase hover:border-gold hover:text-gold lg:grid"
              onClick={() => setRail((v) => !v)}
              aria-label="Zúžit panel"
            >
              {rail ? "⟨" : "⟩"}
            </button>
            <div>
              <p className="text-[10px] tracking-[0.2em] text-gold uppercase">{role}</p>
              <p className="font-serif text-xl text-ivory md:text-2xl">{who}</p>
            </div>
          </div>
          <button type="button" onClick={onOut} className="text-[10px] tracking-[0.16em] text-muted uppercase hover:text-gold">
            Odhlásit
          </button>
        </header>
        <div className="px-3 py-5 md:px-6 md:py-7">{children}</div>
      </div>
    </div>
  );
}

function RailGroup({
  items,
  page,
  onPage,
  slim,
  soon,
}: {
  items: { id: ControlPage; label: string }[];
  page: ControlPage;
  onPage: (p: ControlPage) => void;
  slim: boolean;
  soon?: boolean;
}) {
  return (
    <div className="mb-4">
      {items.map((it) => {
        const on = page === it.id;
        return (
          <button
            key={it.id}
            type="button"
            title={it.label}
            onClick={() => onPage(it.id)}
            className={`mb-0.5 flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-[11px] tracking-[0.14em] uppercase ${
              on ? "bg-gold/12 text-gold" : "text-muted hover:bg-gold/5 hover:text-ivory"
            }`}
          >
            <span className={`grid size-6 shrink-0 place-items-center rounded-sm text-[10px] ${on ? "text-gold" : "text-muted"}`}>
              {mark(it.id)}
            </span>
            {!slim ? <span className="flex-1">{it.label}</span> : null}
            {!slim && soon ? <span className="rounded-full border border-gold/25 px-1.5 py-px text-[8px] tracking-[0.12em] text-gold/80">Soon</span> : null}
          </button>
        );
      })}
    </div>
  );
}

function mark(id: ControlPage) {
  switch (id) {
    case "overview":
      return "◉";
    case "reservations":
      return "◷";
    case "analytics":
      return "◫";
    case "board":
      return "✦";
    case "menu":
      return "☰";
    case "shop":
      return "◇";
    case "social":
      return "◎";
    case "ops":
      return "⚙";
    default:
      return "·";
  }
}
