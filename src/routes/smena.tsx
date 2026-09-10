import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { ControlShell, type ControlPage } from "@/components/control-shell";
import { LANES, SEED } from "@/lib/board";
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

function greet() {
  const h = new Date().getHours();
  if (h < 12) return "Dobré ráno";
  if (h < 18) return "Dobré odpoledne";
  return "Dobrý večer";
}

function longDate() {
  return new Date().toLocaleDateString("cs-CZ", { weekday: "long", day: "numeric", month: "long" });
}

function vocative(name: string) {
  if (name === "Aleš") return "Aleši";
  if (name === "Čajovník") return "Čajovníku";
  return name;
}

function Smena() {
  const [session, setSession] = useState<ShiftSession | null>(() => (typeof window === "undefined" ? null : readShift()));
  if (!session) return <ShiftGate onIn={(s) => setSession(s)} />;
  return (
    <ControlApp
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
        <p className="kicker mt-10">Buddha Control</p>
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
        <Link to="/" className="mt-10 inline-block text-sm text-gold">
          Zpět na web →
        </Link>
      </div>
    </div>
  );
}

function ControlApp({ session, onOut }: { session: ShiftSession; onOut: () => void }) {
  const [page, setPage] = useState<ControlPage>(session.role === "owner" ? "overview" : "reservations");
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((n) => n + 1);

  return (
    <ControlShell page={page} onPage={setPage} who={session.name} role={SHIFT_PINS[session.role].label} onOut={onOut}>
      {page === "overview" ? <Overview key={tick} name={session.name} onGo={() => setPage("reservations")} /> : null}
      {page === "reservations" ? <ReservationsPane session={session} onMutate={refresh} /> : null}
      {page === "analytics" ? <Analytics /> : null}
      {page === "board" ? <BoardAdmin /> : null}
      {page === "menu" ? <MenuAdmin /> : null}
      {page === "shop" ? <ShopSoon owner={session.role === "owner"} /> : null}
      {page === "social" ? <SocialSoon /> : null}
      {page === "ops" ? <Ops owner={session.role === "owner"} /> : null}
      {page === "settings" ? <Settings session={session} /> : null}
    </ControlShell>
  );
}

function Overview({ name, onGo }: { name: string; onGo: () => void }) {
  const date = todayIso();
  const all = listReservations(date);
  const live = all.filter((r) => r.status !== "done" && r.status !== "no_show");
  const seated = all.filter((r) => r.status === "seated");
  const waiting = all.filter((r) => r.status === "new");
  const confirmed = all.filter((r) => r.status === "confirmed");
  const next = [...all]
    .filter((r) => r.status === "new" || r.status === "confirmed")
    .sort((a, b) => a.wave.localeCompare(b.wave))
    .slice(0, 3);
  const activity = [...all].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 6);
  const nowWave = WAVES.find((w) => w.id === "19:30")?.id ?? WAVES[0].id;
  const takenNow = new Set(
    all.filter((r) => r.wave === nowWave && r.status !== "done" && r.status !== "no_show").map((r) => r.table_id),
  );

  return (
    <div>
      <p className="text-[10px] tracking-[0.22em] text-gold uppercase">Přehled</p>
      <h1 className="mt-2 font-serif text-4xl text-ivory md:text-5xl">
        {greet()}, {vocative(name)}.
      </h1>
      <p className="mt-2 text-sm capitalize text-muted">{longDate()}</p>
      <p className="mt-2 text-[10px] tracking-[0.16em] text-muted uppercase">Lokální provozní data</p>

      <div className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-4">
        <Kpi n={guestsOf(live)} l="Hosté v plánu" />
        <Kpi n={seated.reduce((a, r) => a + r.party_size, 0)} l="Dnes u stolu" />
        <Kpi n={waiting.length} l="Čeká na potvrzení" />
        <Kpi n={TABLES.length - takenNow.size} l="Volné stoly · 19:30" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-card border border-gold/20 bg-surface p-5">
          <p className="text-[10px] tracking-[0.18em] text-gold uppercase">Rezervace dnes</p>
          <p className="mt-2 font-serif text-3xl text-ivory">{all.length}</p>
          <p className="mt-1 text-sm text-muted">
            {all.reduce((n, r) => n + r.party_size, 0)} hostů · {confirmed.length} potvrzeno · {waiting.length} nových · {seated.length} u stolu
          </p>
          <button type="button" onClick={onGo} className="mt-4 text-[11px] tracking-[0.16em] text-gold uppercase">
            Otevřít rezervace →
          </button>
        </section>

        <section className="rounded-card border border-gold/20 bg-surface p-5">
          <p className="text-[10px] tracking-[0.18em] text-gold uppercase">Další příchody</p>
          {next.length === 0 ? (
            <p className="mt-4 text-sm text-muted">Nikdo další nečeká. Walk-in z rezervací.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {next.map((r) => (
                <li key={r.id} className="flex justify-between gap-3 text-sm">
                  <span className="text-ivory">
                    {r.wave} · {r.name}
                  </span>
                  <span className="text-muted">
                    {r.party_size} · {r.table_id}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="mt-4 rounded-card border border-gold/20 bg-surface p-5">
        <p className="text-[10px] tracking-[0.18em] text-gold uppercase">Vytížení vln</p>
        <div className="mt-4 space-y-3">
          {WAVES.map((w) => {
            const rows = all.filter((r) => r.wave === w.id && r.status !== "done" && r.status !== "no_show");
            const g = guestsOf(rows);
            const max = 40;
            const pct = Math.min(100, Math.round((g / max) * 100));
            return (
              <div key={w.id}>
                <div className="flex justify-between text-xs">
                  <span className="text-ivory">
                    {w.id} · {w.label}
                  </span>
                  <span className="text-muted">
                    {rows.length} stolů · {g} hostů
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gold/10">
                  <div className="h-full rounded-full bg-gold/70" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-[10px] text-muted">Pruh ukazuje počet hostů, ne procento obsazenosti sálu.</p>
      </section>

      <section className="mt-4 rounded-card border border-gold/20 bg-surface p-5">
        <p className="text-[10px] tracking-[0.18em] text-gold uppercase">Aktivita</p>
        {activity.length === 0 ? (
          <p className="mt-4 text-sm text-muted">Zatím žádná aktivita dnes.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {activity.map((r) => (
              <li key={r.id} className="flex gap-3 text-muted">
                <span className="tabular-nums text-gold/80">{r.created_at.slice(11, 16)}</span>
                <span className="text-ivory">
                  {r.email === "walkin@buddha.local" ? "Walk-in" : "Nová rezervace"} · {r.name} · {r.party_size}{" "}
                  {r.party_size === 1 ? "host" : "hosté"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function ReservationsPane({ session, onMutate }: { session: ShiftSession; onMutate: () => void }) {
  const dates = upcomingDates(5);
  const [date, setDate] = useState(todayIso);
  const [wave, setWave] = useState<WaveId>("19:30");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<string | null>(null);
  const [walk, setWalk] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setTick((n) => n + 1);
  }, [date]);

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
    onMutate();
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] tracking-[0.22em] text-gold uppercase">Rezervace</p>
          <h1 className="mt-1 font-serif text-4xl text-ivory">{formatDateCs(date)}</h1>
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
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
        <Kpi n={guestsOf(live)} l="Hosté v plánu" />
        <Kpi n={seatedNow.reduce((a, r) => a + r.party_size, 0)} l="Teď u stolu" />
        <Kpi n={waiting.length} l="Čeká potvrzení / příchod" />
        <Kpi n={freeCount} l={`Volné stoly · ${wave}`} />
      </div>

      <nav className="mt-5 flex gap-2 overflow-x-auto pb-1">
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

      {walk ? (
        <WalkIn
          date={date}
          wave={wave}
          taken={taken}
          onDone={() => {
            setWalk(false);
            setTick((n) => n + 1);
            onMutate();
          }}
          onClose={() => setWalk(false)}
        />
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
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
                  <article key={r.id} className={`rounded-card border bg-surface p-4 ${active ? "border-gold" : "border-gold/20"}`}>
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
                            className={`min-w-[3.4rem] rounded-md border px-2 py-2 text-center ${guest ? TONE[guest.status] : "border-gold/15 text-muted"}`}
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
        </aside>
      </div>
    </div>
  );
}

function Analytics() {
  const [range, setRange] = useState<"1" | "7" | "30">("7");
  const all = listReservations();
  const from = new Date();
  from.setHours(0, 0, 0, 0);
  from.setDate(from.getDate() - (range === "1" ? 0 : range === "7" ? 6 : 29));
  const fromIso = from.toISOString().slice(0, 10);
  const rows = all.filter((r) => r.date >= fromIso);
  const guests = rows.reduce((n, r) => n + r.party_size, 0);
  const avg = rows.length ? guests / rows.length : 0;
  const byStatus = (s: Reservation["status"]) => rows.filter((r) => r.status === s).length;
  const walkins = rows.filter((r) => r.email === "walkin@buddha.local").length;
  const days = new Set(rows.map((r) => r.date));

  return (
    <div>
      <p className="text-[10px] tracking-[0.22em] text-gold uppercase">Analytika</p>
      <h1 className="mt-2 font-serif text-4xl text-ivory">Provoz</h1>
      <p className="mt-2 text-[10px] tracking-[0.16em] text-muted uppercase">Lokální provozní data · ne cloud</p>
      <div className="mt-4 flex gap-2">
        {(
          [
            ["1", "Dnes"],
            ["7", "7 dní"],
            ["30", "30 dní"],
          ] as const
        ).map(([id, l]) => (
          <button
            key={id}
            type="button"
            onClick={() => setRange(id)}
            className={`rounded-full px-4 py-1.5 text-[10px] tracking-[0.14em] uppercase ${range === id ? "bg-gold text-bg" : "border border-gold/30 text-gold"}`}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-4">
        <Kpi n={rows.length} l="Rezervace" />
        <Kpi n={guests} l="Hosté" />
        <Kpi n={Number(avg.toFixed(1))} l="Průměrná skupina" />
        <Kpi n={walkins} l="Walk-in" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
        <Kpi n={byStatus("confirmed")} l="Potvrzeno" />
        <Kpi n={byStatus("seated")} l="U stolu" />
        <Kpi n={byStatus("no_show")} l="Nedorazili" />
        <Kpi n={byStatus("new")} l="Nové" />
      </div>
      <section className="mt-6 rounded-card border border-gold/20 bg-surface p-5">
        <p className="text-[10px] tracking-[0.18em] text-gold uppercase">Podle vlny</p>
        <ul className="mt-3 space-y-2 text-sm">
          {WAVES.map((w) => {
            const n = rows.filter((r) => r.wave === w.id).length;
            const g = rows.filter((r) => r.wave === w.id).reduce((a, r) => a + r.party_size, 0);
            return (
              <li key={w.id} className="flex justify-between text-muted">
                <span className="text-ivory">
                  {w.id} · {w.label}
                </span>
                <span>
                  {n} rez. · {g} hostů
                </span>
              </li>
            );
          })}
        </ul>
      </section>
      {days.size > 1 ? (
        <section className="mt-4 rounded-card border border-gold/20 bg-surface p-5">
          <p className="text-[10px] tracking-[0.18em] text-gold uppercase">Podle dne</p>
          <ul className="mt-3 space-y-1 text-sm text-muted">
            {[...days].sort().map((d) => {
              const n = rows.filter((r) => r.date === d).length;
              return (
                <li key={d} className="flex justify-between">
                  <span className="text-ivory">{formatDateCs(d)}</span>
                  <span>{n}</span>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <SoonCard title="Web návštěvnost" state="Připojení GA4 připravujeme." />
        <SoonCard title="Google profil" state="Planned" />
        <SoonCard title="TeaHUB acquisition" state="Planned" />
      </div>
    </div>
  );
}

function BoardAdmin() {
  return (
    <div>
      <p className="text-[10px] tracking-[0.22em] text-gold uppercase">Nástěnka</p>
      <h1 className="mt-2 font-serif text-4xl text-ivory">Veřejné zápisníky</h1>
      <p className="mt-2 text-sm text-muted">RSS běží na /rss.xml. Úpravy zápisů zatím na webu.</p>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {LANES.map((l) => (
          <div key={l.id} className="rounded-card border border-gold/20 bg-surface p-4">
            <p className="text-[10px] tracking-[0.16em] text-gold uppercase">{l.label}</p>
            <p className="mt-2 font-serif text-2xl text-ivory">{SEED.filter((p) => p.lane === l.id).length}</p>
            <p className="mt-1 text-xs text-muted">{l.kicker}</p>
          </div>
        ))}
      </div>
      <ul className="mt-6 space-y-2">
        {SEED.slice(0, 8).map((p) => (
          <li key={p.id} className="rounded-card border border-gold/15 bg-surface px-4 py-3">
            <p className="text-[10px] tracking-[0.14em] text-gold uppercase">{p.lane}</p>
            <p className="mt-1 text-sm text-ivory">{p.title}</p>
          </li>
        ))}
      </ul>
      <Link to="/" hash="nastenka" className="mt-6 inline-block text-sm text-gold">
        Náhled na webu →
      </Link>
    </div>
  );
}

function MenuAdmin() {
  return (
    <div>
      <p className="text-[10px] tracking-[0.22em] text-gold uppercase">Menu</p>
      <h1 className="mt-2 font-serif text-4xl text-ivory">Lístek</h1>
      <p className="mt-3 max-w-lg text-sm text-muted">Veřejný nápojový lístek a deskovky. Správa položek přijde později — teď odkaz na to, co vidí host.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/menu" className="rounded-full bg-gold px-5 py-2 text-[11px] tracking-[0.14em] text-bg uppercase">
          Otevřít lístek
        </Link>
        <Link to="/hry" className="rounded-full border border-gold/40 px-5 py-2 text-[11px] tracking-[0.14em] text-gold uppercase">
          Hry
        </Link>
      </div>
    </div>
  );
}

function ShopSoon({ owner }: { owner: boolean }) {
  const [live, setLive] = useState(false);
  useEffect(() => {
    const sync = () => setLive(isShopLive());
    sync();
    return subscribeFlags(sync);
  }, []);
  return (
    <div>
      <p className="text-[10px] tracking-[0.22em] text-gold uppercase">E-shop</p>
      <h1 className="mt-2 font-serif text-4xl text-ivory">Připravujeme správu prodeje.</h1>
      <p className="mt-3 max-w-lg text-sm text-muted">Produkty, objednávky, platby a sklad sem patří později. Teď jen viditelnost obchodu na webu.</p>
      {owner ? (
        <div className="mt-6 flex items-center justify-between rounded-card border border-gold/25 bg-surface px-4 py-3">
          <div>
            <p className="text-[10px] tracking-[0.18em] text-gold uppercase">Viditelnost na webu</p>
            <p className="mt-1 text-sm text-ivory">{live ? "Hosté vidí obchod." : "Na webu je nápis Připravujeme."}</p>
          </div>
          <button
            type="button"
            onClick={() => setShopLive(!live)}
            className={`rounded-full px-5 py-2 text-[11px] tracking-[0.16em] uppercase ${live ? "bg-gold text-bg" : "border border-gold/40 text-gold"}`}
          >
            {live ? "Zapnuto" : "Vypnuto"}
          </button>
        </div>
      ) : null}
      <div className="mt-6 grid gap-3 md:grid-cols-4">
        {["Produkty", "Objednávky", "Platby", "Sklad"].map((x) => (
          <SoonCard key={x} title={x} state="Připravujeme" />
        ))}
      </div>
    </div>
  );
}

function SocialSoon() {
  return (
    <div>
      <p className="text-[10px] tracking-[0.22em] text-gold uppercase">Sociální sítě</p>
      <h1 className="mt-2 font-serif text-4xl text-ivory">Kanály</h1>
      <p className="mt-3 text-sm text-muted">Bez OAuth, bez čísel sledujících. Připojení přijde v péči.</p>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {["Instagram", "Facebook", "Google Business Profile"].map((x) => (
          <SoonCard key={x} title={x} state="Nepřipojeno · připravujeme" />
        ))}
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        {["Příspěvky", "Kalendář", "Akce", "Výkon"].map((x) => (
          <SoonCard key={x} title={x} state="Připravujeme" />
        ))}
      </div>
    </div>
  );
}

function Ops({ owner }: { owner: boolean }) {
  const date = todayIso();
  const all = listReservations(date);
  const [live, setLive] = useState(false);
  useEffect(() => {
    const sync = () => setLive(isShopLive());
    sync();
    return subscribeFlags(sync);
  }, []);
  return (
    <div>
      <p className="text-[10px] tracking-[0.22em] text-gold uppercase">Provoz</p>
      <h1 className="mt-2 font-serif text-4xl text-ivory">{formatDateCs(date)}</h1>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <div className="rounded-card border border-gold/20 bg-surface p-5">
          <p className="text-[10px] tracking-[0.16em] text-gold uppercase">Web</p>
          <p className="mt-2 font-serif text-2xl text-ivory">Online</p>
          <p className="mt-1 text-sm text-muted">Veřejná stránka běží.</p>
        </div>
        <div className="rounded-card border border-gold/20 bg-surface p-5">
          <p className="text-[10px] tracking-[0.16em] text-gold uppercase">Rezervace dnes</p>
          <p className="mt-2 font-serif text-2xl text-ivory">{all.length}</p>
          <p className="mt-1 text-sm text-muted">{all.reduce((n, r) => n + r.party_size, 0)} hostů v záznamech</p>
        </div>
      </div>
      <section className="mt-4 rounded-card border border-gold/20 bg-surface p-5">
        <p className="text-[10px] tracking-[0.16em] text-gold uppercase">Vlny</p>
        <ul className="mt-3 space-y-1 text-sm text-ivory">
          {WAVES.map((w) => (
            <li key={w.id}>
              {w.id} · {w.label}
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-4 rounded-card border border-gold/20 bg-surface p-5">
        <p className="text-[10px] tracking-[0.16em] text-gold uppercase">Místnosti</p>
        <ul className="mt-3 space-y-1 text-sm text-muted">
          {ROOMS.map((r) => (
            <li key={r.id} className="text-ivory">
              {r.name}
              <span className="text-muted"> · {r.note}</span>
            </li>
          ))}
        </ul>
      </section>
      {owner ? (
        <div className="mt-4 flex items-center justify-between rounded-card border border-gold/25 bg-surface px-4 py-3">
          <div>
            <p className="text-[10px] tracking-[0.18em] text-gold uppercase">E-shop na webu</p>
            <p className="mt-1 text-sm text-ivory">{live ? "Viditelný" : "Připravujeme"}</p>
          </div>
          <button
            type="button"
            onClick={() => setShopLive(!live)}
            className={`rounded-full px-5 py-2 text-[11px] tracking-[0.16em] uppercase ${live ? "bg-gold text-bg" : "border border-gold/40 text-gold"}`}
          >
            {live ? "Zapnuto" : "Vypnuto"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function Settings({ session }: { session: ShiftSession }) {
  return (
    <div>
      <p className="text-[10px] tracking-[0.22em] text-gold uppercase">Nastavení</p>
      <h1 className="mt-2 font-serif text-4xl text-ivory">Základ</h1>
      <dl className="mt-6 max-w-lg space-y-3 text-sm">
        <div className="flex justify-between border-b border-gold/10 py-2">
          <dt className="text-muted">Role</dt>
          <dd className="text-ivory">{SHIFT_PINS[session.role].label}</dd>
        </div>
        <div className="flex justify-between border-b border-gold/10 py-2">
          <dt className="text-muted">Jméno</dt>
          <dd className="text-ivory">{session.name}</dd>
        </div>
        <div className="flex justify-between border-b border-gold/10 py-2">
          <dt className="text-muted">Data</dt>
          <dd className="text-ivory">Lokální, tento prohlížeč</dd>
        </div>
      </dl>
      <p className="mt-6 max-w-lg text-sm text-muted">Účty, cloud a ONYX sem patří později. Teď stačí směna a PIN.</p>
    </div>
  );
}

function SoonCard({ title, state }: { title: string; state: string }) {
  return (
    <div className="rounded-card border border-gold/15 bg-surface p-4 opacity-80">
      <p className="font-serif text-xl text-ivory">{title}</p>
      <p className="mt-2 text-[10px] tracking-[0.14em] text-gold uppercase">{state}</p>
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
    <form onSubmit={submit} className="mt-4 rounded-card border border-gold bg-surface p-4">
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
        <select value={table} onChange={(e) => setTable(e.target.value)} className="rounded-md border border-gold/25 bg-bg px-3 py-2 text-sm text-ivory">
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
