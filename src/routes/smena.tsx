import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import {
  WAVES,
  addWalkIn,
  formatDateCs,
  listReservations,
  setReservationStatus,
  upcomingDates,
  type Reservation,
  type WaveId,
} from "@/lib/reservations";
import { ROOMS, TABLES, tableById } from "@/lib/rooms";
import { SHIFT_PINS, checkPin, endShift, readShift, startShift, type ShiftRole, type ShiftSession } from "@/lib/shift";
import { isShopLive, setShopLive, subscribeFlags } from "@/lib/site-flags";

export const Route = createFileRoute("/smena")({ component: Smena });

const STATUS: { id: Reservation["status"]; label: string }[] = [
  { id: "new", label: "Nová" },
  { id: "confirmed", label: "Potvrzeno" },
  { id: "seated", label: "U stolu" },
  { id: "done", label: "Hotovo" },
  { id: "no_show", label: "Nedorazili" },
];

const TONE: Record<Reservation["status"], string> = {
  new: "border-gold text-gold",
  confirmed: "border-gold/50 bg-gold/10 text-gold",
  seated: "border-ivory/40 bg-ivory/10 text-ivory",
  done: "border-line text-muted",
  no_show: "border-red-400/30 text-red-300",
};

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function guestsOf(rows: Reservation[]) {
  return rows.filter((r) => r.status !== "no_show" && r.status !== "done").reduce((n, r) => n + r.party_size, 0);
}

function Smena() {
  const [session, setSession] = useState<ShiftSession | null>(() => (typeof window === "undefined" ? null : readShift()));
  if (!session) return <ShiftGate onIn={(s) => setSession(s)} />;
  return (
    <ShiftDesk
      session={session}
      onOut={() => {
        endShift();
        setSession(null);
      }}
    />
  );
}

function ShiftGate({ onIn }: { onIn: (s: ShiftSession) => void }) {
  const [role, setRole] = useState<ShiftRole | null>(null);
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);

  function press(d: string) {
    const next = (pin + d).slice(0, 4);
    setPin(next);
    setErr(false);
    if (next.length === 4 && role) {
      if (checkPin(role, next)) onIn(startShift(role));
      else {
        setErr(true);
        setPin("");
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg px-5 py-10 font-sans text-fg">
      <div className="mx-auto w-full max-w-md">
        <BrandLogo />
        <p className="kicker mt-10">Směna</p>
        <h1 className="headline mt-3 text-5xl">Kdo dnes vaří čaj?</h1>
        <span className="hairline" />
        <p className="mt-4 text-sm text-muted">Jen pro majitele a obsluhu. Hosté sem nechodí.</p>
        <div className="mt-8 grid grid-cols-2 gap-3">
          {(["owner", "staff"] as ShiftRole[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                setRole(r);
                setPin("");
                setErr(false);
              }}
              className={`rounded-card border px-4 py-6 text-left ${role === r ? "border-gold bg-surface text-ivory" : "border-gold/25 text-muted hover:border-gold/50"}`}
            >
              <p className="text-[10px] tracking-[0.2em] text-gold uppercase">{r === "owner" ? "Klíč" : "Směna"}</p>
              <p className="mt-2 font-serif text-3xl text-ivory">{SHIFT_PINS[r].label}</p>
              <p className="mt-1 text-xs">{SHIFT_PINS[r].name}</p>
            </button>
          ))}
        </div>
        {role ? (
          <div className="mt-8">
            <p className="text-[11px] tracking-[0.18em] text-gold uppercase">PIN · 4 čísla</p>
            <div className="mt-3 flex gap-2">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className={`h-3 w-3 rounded-full ${pin.length > i ? "bg-gold" : "border border-gold/40"}`} />
              ))}
            </div>
            {err ? <p className="mt-3 text-sm text-red-300">Špatný kód. Zkuste znovu.</p> : null}
            <div className="mt-6 grid grid-cols-3 gap-2">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map((d) =>
                d === "" ? (
                  <span key="x" />
                ) : (
                  <button
                    key={d}
                    type="button"
                    onClick={() => (d === "⌫" ? setPin((p) => p.slice(0, -1)) : press(d))}
                    className="rounded-card border border-gold/25 py-4 font-serif text-2xl text-ivory hover:border-gold hover:bg-surface"
                  >
                    {d}
                  </button>
                ),
              )}
            </div>
          </div>
        ) : null}
        <p className="mt-10 text-xs text-muted">Kód směny má obsluha. V gitu není.</p>
        <Link to="/" className="mt-6 inline-block text-sm text-gold">
          Zpět na web →
        </Link>
      </div>
    </div>
  );
}

function ShiftDesk({ session, onOut }: { session: ShiftSession; onOut: () => void }) {
  const dates = upcomingDates(5);
  const [date, setDate] = useState(todayIso);
  const [wave, setWave] = useState<WaveId>("19:30");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<string | null>(null);
  const [walk, setWalk] = useState(false);
  const [tick, setTick] = useState(0);
  const [shopLive, setShop] = useState(false);

  useEffect(() => {
    setTick((n) => n + 1);
  }, [date]);

  useEffect(() => {
    const sync = () => setShop(isShopLive());
    sync();
    return subscribeFlags(sync);
  }, []);

  const all = listReservations(date);
  void tick;
  const live = all.filter((r) => r.status !== "done" && r.status !== "no_show");
  const waveRows = all.filter((r) => r.wave === wave);
  const shown = waveRows.filter((r) => {
    if (!q.trim()) return true;
    const s = q.toLowerCase();
    return r.name.toLowerCase().includes(s) || r.phone.includes(s) || r.table_id.toLowerCase().includes(s);
  });
  const seatedNow = all.filter((r) => r.status === "seated");
  const waiting = all.filter((r) => r.status === "new" || r.status === "confirmed");
  const taken = new Set(waveRows.filter((r) => r.status !== "done" && r.status !== "no_show").map((r) => r.table_id));
  const freeCount = TABLES.length - taken.size;
  const covers = guestsOf(waveRows);
  const selected = all.find((r) => r.id === sel) ?? shown[0];

  function bump(id: string, status: Reservation["status"]) {
    setReservationStatus(id, status);
    setSel(id);
    setTick((n) => n + 1);
  }

  return (
    <div className="min-h-screen bg-bg font-sans text-fg">
      <header className="border-b border-gold/20 px-4 py-3 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] tracking-[0.2em] text-gold uppercase">{SHIFT_PINS[session.role].label} · směna</p>
            <p className="font-serif text-2xl md:text-3xl">
              {session.name}
              <span className="text-muted"> · {formatDateCs(date)}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {session.role === "owner" ? (
              <select
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-full border border-gold/30 bg-bg px-3 py-1.5 text-xs text-ivory"
              >
                {dates.map((d) => (
                  <option key={d} value={d}>
                    {formatDateCs(d)}
                  </option>
                ))}
              </select>
            ) : null}
            <button type="button" onClick={() => setWalk((v) => !v)} className="rounded-full bg-gold px-4 py-1.5 text-[10px] tracking-[0.14em] text-bg uppercase">
              Walk-in
            </button>
            <button type="button" onClick={onOut} className="px-2 text-[11px] tracking-[0.16em] text-muted uppercase hover:text-gold">
              Odhlásit
            </button>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
          <Kpi n={guestsOf(live)} l="Hosté v plánu" />
          <Kpi n={seatedNow.reduce((a, r) => a + r.party_size, 0)} l="Teď u stolu" />
          <Kpi n={waiting.length} l="Čeká potvrzení / příchod" />
          <Kpi n={freeCount} l={`Volné stoly · ${wave}`} />
        </div>
        {session.role === "owner" ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-card border border-gold/25 bg-surface px-4 py-3">
            <div>
              <p className="text-[10px] tracking-[0.18em] text-gold uppercase">E-shop na webu</p>
              <p className="mt-1 text-sm text-ivory">
                {shopLive ? "Hosté vidí obchod a košík." : "Na produkci je nápis Připravujeme e-shop."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShopLive(!shopLive)}
              className={`rounded-full px-5 py-2 text-[11px] tracking-[0.16em] uppercase ${
                shopLive ? "bg-gold text-bg" : "border border-gold/40 text-gold"
              }`}
            >
              {shopLive ? "Zapnuto" : "Vypnuto"}
            </button>
          </div>
        ) : null}
      </header>

      <nav className="flex gap-2 overflow-x-auto border-b border-gold/10 px-4 py-3 md:px-6">
        {WAVES.map((w) => {
          const n = guestsOf(all.filter((r) => r.wave === w.id));
          const c = all.filter((r) => r.wave === w.id && r.status !== "done" && r.status !== "no_show").length;
          return (
            <button
              key={w.id}
              type="button"
              onClick={() => setWave(w.id)}
              className={`min-w-[9.5rem] rounded-card border px-4 py-3 text-left ${wave === w.id ? "border-gold bg-surface" : "border-gold/20 hover:border-gold/40"}`}
            >
              <p className="text-[10px] tracking-[0.16em] text-gold uppercase">{w.id}</p>
              <p className="mt-1 font-serif text-lg text-ivory">{w.label}</p>
              <p className="mt-1 text-xs text-muted">
                {c} stolů · {n} hostů
              </p>
            </button>
          );
        })}
      </nav>

      {walk ? <WalkIn date={date} wave={wave} taken={taken} onDone={() => { setWalk(false); setTick((n) => n + 1); }} onClose={() => setWalk(false)} /> : null}

      <div className="grid gap-6 px-4 py-6 lg:grid-cols-[1.15fr_0.85fr] md:px-6">
        <section>
          <div className="mb-3 flex items-center gap-3">
            <p className="text-[11px] tracking-[0.18em] text-gold uppercase">Rezervace vlny</p>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="jméno, telefon, stůl"
              className="flex-1 rounded-full border border-gold/25 bg-surface px-4 py-2 text-sm text-ivory outline-none placeholder:text-muted"
            />
          </div>
          <div className="space-y-2">
            {shown.length === 0 ? (
              <p className="rounded-card border border-gold/20 p-8 text-center text-sm text-muted">V této vlně nikdo. Přidejte walk-in.</p>
            ) : (
              shown.map((r) => {
                const active = selected?.id === r.id;
                return (
                  <article
                    key={r.id}
                    className={`rounded-card border bg-surface p-4 ${active ? "border-gold" : "border-gold/20"}`}
                  >
                    <button type="button" className="w-full text-left" onClick={() => setSel(r.id)}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-serif text-2xl text-ivory">{r.name}</p>
                          <p className="mt-1 text-sm text-muted">
                            {r.party_size} {r.party_size === 1 ? "host" : "hosté"} · {r.table_id}
                            {tableById(r.table_id)?.hint ? ` · ${tableById(r.table_id)?.hint}` : ""}
                          </p>
                          {r.phone !== "+420000000000" ? (
                            <a href={`tel:${r.phone}`} className="mt-1 inline-block text-sm text-gold">
                              {r.phone}
                            </a>
                          ) : (
                            <p className="mt-1 text-xs text-muted">Walk-in</p>
                          )}
                          {r.note ? <p className="mt-2 text-sm text-ivory/80">{r.note}</p> : null}
                        </div>
                        <span className={`rounded-full border px-2 py-1 text-[10px] tracking-[0.14em] uppercase ${TONE[r.status]}`}>
                          {STATUS.find((s) => s.id === r.status)?.label}
                        </span>
                      </div>
                    </button>
                    {active ? (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {STATUS.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => bump(r.id, s.id)}
                            className={`rounded-full px-3 py-1.5 text-[10px] tracking-[0.12em] uppercase ${r.status === s.id ? "bg-gold text-bg" : "border border-gold/30 text-muted hover:text-gold"}`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </article>
                );
              })
            )}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-card border border-gold/20 bg-surface p-4">
            <p className="text-[11px] tracking-[0.18em] text-gold uppercase">Sál · {wave}</p>
            <p className="mt-1 font-serif text-2xl text-ivory">
              {covers} hostů · {freeCount} volných stolů
            </p>
            <div className="mt-4 space-y-4">
              {ROOMS.map((room) => {
                const tables = TABLES.filter((t) => t.room === room.id);
                if (tables.length === 0) {
                  return (
                    <div key={room.id}>
                      <p className="text-[10px] tracking-[0.16em] text-muted uppercase">{room.name}</p>
                      <p className="mt-1 text-xs text-gold/80">Záložní · po domluvě, když je plno</p>
                    </div>
                  );
                }
                return (
                  <div key={room.id}>
                    <p className="text-[10px] tracking-[0.16em] text-muted uppercase">{room.name}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {tables.map((t) => {
                        const guest = waveRows.find((r) => r.table_id === t.id && r.status !== "done" && r.status !== "no_show");
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => guest && setSel(guest.id)}
                            className={`min-w-[3.4rem] rounded-md border px-2 py-2 text-center ${
                              guest ? TONE[guest.status] : "border-gold/15 text-muted"
                            }`}
                            title={guest ? `${guest.name} · ${guest.party_size}` : `volno · max ${t.max}`}
                          >
                            <p className="font-serif text-sm">{t.id}</p>
                            <p className="text-[9px] tracking-wide uppercase">{guest ? `${guest.party_size}p` : `m${t.max}`}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <p className="text-xs leading-relaxed text-muted">
            {session.role === "owner"
              ? "Majitel vidí dny dopředu, stoly i walk-in. Platby a účty sem zatím nepatří."
              : "Potvrď, usaď, odškrtni. Walk-in usedne hned."}
          </p>
        </aside>
      </div>
    </div>
  );
}

function Kpi({ n, l }: { n: number; l: string }) {
  return (
    <div className="rounded-card border border-gold/20 bg-surface px-4 py-3">
      <p className="font-serif text-3xl text-gold">{n}</p>
      <p className="mt-1 text-[10px] tracking-[0.14em] text-muted uppercase">{l}</p>
    </div>
  );
}

function WalkIn({
  date,
  wave,
  taken,
  onDone,
  onClose,
}: {
  date: string;
  wave: WaveId;
  taken: Set<string>;
  onDone: () => void;
  onClose: () => void;
}) {
  const free = useMemo(() => TABLES.filter((t) => !taken.has(t.id)), [taken]);
  const [name, setName] = useState("");
  const [party, setParty] = useState(2);
  const [table, setTable] = useState(free[0]?.id ?? "");
  const [note, setNote] = useState("");
  const [err, setErr] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = addWalkIn({ date, wave, table_id: table, party_size: party, name, note });
    if (!res.ok) {
      setErr(res.code);
      return;
    }
    onDone();
  }

  return (
    <form onSubmit={submit} className="mx-4 mt-4 rounded-card border border-gold bg-surface p-4 md:mx-6">
      <div className="flex items-center justify-between">
        <p className="text-[11px] tracking-[0.18em] text-gold uppercase">Walk-in · {wave}</p>
        <button type="button" onClick={onClose} className="text-muted hover:text-gold">
          ×
        </button>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-4">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jméno"
          className="rounded-md border border-gold/25 bg-bg px-3 py-2 text-sm text-ivory outline-none"
        />
        <input
          type="number"
          min={1}
          max={8}
          value={party}
          onChange={(e) => setParty(Number(e.target.value))}
          className="rounded-md border border-gold/25 bg-bg px-3 py-2 text-sm text-ivory outline-none"
        />
        <select
          value={table}
          onChange={(e) => setTable(e.target.value)}
          className="rounded-md border border-gold/25 bg-bg px-3 py-2 text-sm text-ivory"
        >
          {free
            .filter((t) => t.max >= party)
            .map((t) => (
              <option key={t.id} value={t.id}>
                {t.id} · max {t.max}
              </option>
            ))}
        </select>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Poznámka"
          className="rounded-md border border-gold/25 bg-bg px-3 py-2 text-sm text-ivory outline-none"
        />
      </div>
      {err ? <p className="mt-2 text-xs text-red-300">{err}</p> : null}
      <button type="submit" className="mt-3 rounded-full bg-gold px-5 py-2 text-[11px] tracking-[0.14em] text-bg uppercase">
        Usaď ke stolu
      </button>
    </form>
  );
}
