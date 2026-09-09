import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState, type FormEvent } from "react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { TablePicker } from "@/components/table-picker";
import { Reveal } from "@/components/reveal";
import {
  WAVES,
  type WaveId,
  createReservation,
  formatDateCs,
  takenTables,
  upcomingDates,
} from "@/lib/reservations";
import { ROOMS, TABLES, tableById, type RoomId } from "@/lib/rooms";
import { track } from "@/lib/track";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/rezervace")({ component: Rezervace });

const ERRORS: Record<string, string> = {
  PHONE_INVALID: "České číslo stačí bez předvolby. Slovenské a zahraniční s +.",
  NAME_INVALID: "Název rezervace — pro koho je stůl.",
  EMAIL_INVALID: "E-mail pro potvrzení.",
  PARTY_SIZE: "Online bereme 1–8 lidí. Víc? Zavolejte.",
  CALL: "Na 9 a více zavolejte +420 222 515 616.",
  TABLE: "Vyberte stůl na plánku.",
  TABLE_SMALL: "Ten stůl je na vás malý. Zvolte větší, nebo míň lidí.",
  TABLE_TAKEN: "Ten stůl už v té vlně někdo drží.",
};

function Rezervace() {
  const { t } = useI18n();
  const dates = useMemo(() => upcomingDates(5), []);
  const started = useRef(false);
  const [date, setDate] = useState(dates[0]);
  const [wave, setWave] = useState<WaveId>("19:30");
  const [party, setParty] = useState(2);
  const [room, setRoom] = useState<RoomId | null>(null);
  const [tableId, setTableId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ id: string; status: string; duplicate?: boolean; table?: string } | null>(
    null,
  );

  const freeForWave = TABLES.filter((t) => t.max >= party && !takenTables(date, wave).has(t.id)).length;
  const table = tableId ? tableById(tableId) : null;
  const roomMeta = room ? ROOMS.find((r) => r.id === room) : null;
  const scene = roomMeta?.photo ?? "/place/hall.jpg";

  function start() {
    if (started.current) return;
    started.current = true;
    track("reservation_started");
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    start();
    setError(null);
    if (party >= 9) {
      setError("CALL");
      return;
    }
    if (!tableId) {
      setError("TABLE");
      return;
    }
    const result = createReservation({
      date,
      wave,
      table_id: tableId,
      party_size: party,
      name,
      phone,
      email,
      note,
    });
    if (!result.ok) {
      setError(result.code);
      return;
    }
    setDone({
      id: result.reservation.id,
      status: result.reservation.status,
      duplicate: result.duplicate,
      table: result.reservation.table_id,
    });
    track("reservation_completed", {
      wave,
      party,
      table: result.reservation.table_id,
      status: result.reservation.status,
    });
  }

  const cta = table
    ? `Rezervovat ${table.id} · ${formatDateCs(date)} · ${wave}`
    : "Vyberte stůl na plánku";

  return (
    <div className="min-h-screen bg-bg font-sans text-fg">
      <SiteHeader />

      <div className="relative isolate min-h-[42vh] overflow-hidden pt-16 md:min-h-[48vh]">
        <img src="/place/hall.jpg" alt="" className="absolute inset-0 h-full w-full object-cover object-[50%_60%]" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/70 to-bg/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-bg/40" />
        <div className="book-glow absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-5 py-12 md:px-10 md:py-16">
          <Reveal>
            <p className="kicker">Napište nám, kdy přijdete</p>
            <h1 className="headline mt-2 max-w-xl text-5xl md:text-7xl">Rezervujte si stůl.</h1>
            <span className="hairline" />
          </Reveal>
          <p className="mt-3 max-w-md text-sm text-ivory/85">
            Den, vlna, stůl z plánku. 1–4 potvrdíme ihned, 5–8 obsluha, 9 a více telefonicky.
            Vchod z ulice přes pasáž, budova Exafin.
          </p>
        </div>
      </div>

      <main className="book-glow motif relative mx-auto grid max-w-6xl gap-10 px-5 py-10 lg:grid-cols-[1.05fr_0.95fr] md:px-10">
        <div>
          {done ? (
            <div className="rounded-card border border-gold/40 bg-surface p-6">
              <p className="text-[11px] uppercase tracking-[0.18em] text-gold">
                {done.duplicate ? "Tuto rezervaci už evidujeme" : done.status === "confirmed" ? "Rezervace je potvrzena" : "Čeká na potvrzení obsluhy"}
              </p>
              <p className="mt-3 font-serif text-2xl">
                {formatDateCs(date)} · {wave} · stůl {done.table}
              </p>
              <p className="mt-2 text-sm text-muted">
                {done.status === "confirmed"
                  ? "Vchod z ulice přes pasáž, budova Exafin, do suterénu. Budeme vás čekat."
                  : "Ozveme se. Skupina čeká na potvrzení stolu."}
              </p>
              <Link to="/" className="mt-6 inline-block text-sm text-gold">
                Zpět na Buddha
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-8">
              <fieldset>
                <legend className="text-[11px] uppercase tracking-[0.18em] text-muted">Který den</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {dates.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        setDate(d);
                        setTableId(null);
                      }}
                      className={
                        "rounded-full border px-3 py-2 text-sm " +
                        (date === d ? "border-gold bg-gold text-bg" : "border-line bg-surface/60 text-ivory hover:border-gold")
                      }
                    >
                      {formatDateCs(d)}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-[11px] uppercase tracking-[0.18em] text-muted">Kdy usednete</legend>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {WAVES.map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => {
                        setWave(w.id);
                        setTableId(null);
                      }}
                      className={
                        "rounded-card border px-3 py-3 text-left " +
                        (wave === w.id ? "border-gold bg-surface" : "border-line bg-surface/40 hover:border-gold")
                      }
                    >
                      <div className="font-serif text-xl">{w.id}</div>
                      <div className="text-xs text-muted">{w.label}</div>
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-[11px] uppercase tracking-[0.18em] text-muted">Kolik vás bude</legend>
                <div className="mt-3 flex items-center gap-4">
                  <button
                    type="button"
                    className="size-11 rounded-full border border-line bg-surface text-xl hover:border-gold"
                    onClick={() => {
                      setParty((n) => Math.max(1, n - 1));
                      setTableId(null);
                    }}
                  >
                    −
                  </button>
                  <span className="font-serif text-4xl">{party}</span>
                  <button
                    type="button"
                    className="size-11 rounded-full border border-line bg-surface text-xl hover:border-gold"
                    onClick={() => {
                      setParty((n) => Math.min(8, n + 1));
                      setTableId(null);
                    }}
                  >
                    +
                  </button>
                </div>
                {party >= 7 && party <= 8 && (
                  <p className="mt-2 text-xs text-gold">7–8: stůl M1 v Malé. Jinak dva stoly, nebo volejte.</p>
                )}
                {party >= 5 && party <= 6 && (
                  <p className="mt-2 text-xs text-gold">5–6 potvrdí obsluha. V6, V3, V7 v Přední.</p>
                )}
              </fieldset>

              <div className="lg:hidden">
                <TablePicker
                  date={date}
                  wave={wave}
                  party={party}
                  room={room}
                  tableId={tableId}
                  onRoom={setRoom}
                  onTable={setTableId}
                />
              </div>

              <label className="block">
                <span className="text-[11px] uppercase tracking-[0.18em] text-gold">Název rezervace · pro koho</span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Novákovi · Anna a Petr"
                  className="field"
                />
              </label>
              <label className="block">
                <span className="text-[11px] uppercase tracking-[0.18em] text-gold">Kam zavoláme, kdyby stůl čekal</span>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="777 123 456"
                  className="field"
                />
                <span className="mt-1 block text-[11px] text-muted">České bez předvolby. Slovenské s +421.</span>
              </label>
              <label className="block">
                <span className="text-[11px] uppercase tracking-[0.18em] text-gold">E-mail na potvrzení</span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anna@email.cz"
                  className="field"
                />
              </label>
              <label className="block">
                <span className="text-[11px] uppercase tracking-[0.18em] text-gold">Chcete dýmku, hru, koutek?</span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value.slice(0, 280))}
                  rows={3}
                  placeholder="Např. dýmka Adalya, Carcassonne, klidnější kout"
                  className="field resize-none"
                />
              </label>

              {error && <p className="text-sm text-gold">{ERRORS[error] ?? error}</p>}
              <p className="text-xs text-muted">
                V téhle vlně je volných {freeForWave} stolů na {party} {party === 1 ? "člověka" : "lidi"}
                {table ? ` · držíte ${table.id}` : ""}.
              </p>

              <button
                type="submit"
                className="w-full rounded-full bg-gold py-3.5 text-sm font-medium tracking-wide text-bg hover:bg-ivory"
              >
                {cta}
              </button>
            </form>
          )}
        </div>

        <aside className="hidden space-y-4 lg:sticky lg:top-24 lg:block lg:self-start">
          {roomMeta && (
            <p className="font-serif text-2xl text-gold">{roomMeta.name}</p>
          )}
          <TablePicker
            date={date}
            wave={wave}
            party={party}
            room={room}
            tableId={tableId}
            onRoom={setRoom}
            onTable={setTableId}
          />
        </aside>
      </main>
      <SiteFooter />
    </div>
  );
}
