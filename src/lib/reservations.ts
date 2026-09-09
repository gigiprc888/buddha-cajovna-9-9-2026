import { tableById } from "@/lib/rooms";

export const WAVES = [
  { id: "15:00", label: "Odpolední čaj" },
  { id: "17:30", label: "Pomalu se stmívá" },
  { id: "19:30", label: "Večer u konvice" },
  { id: "21:30", label: "Tichá poslední" },
] as const;

export type WaveId = (typeof WAVES)[number]["id"];

export type Reservation = {
  id: string;
  date: string;
  wave: WaveId;
  table_id: string;
  party_size: number;
  name: string;
  phone: string;
  email: string;
  note: string;
  status: "new" | "confirmed" | "seated" | "done" | "no_show";
  created_at: string;
};

const KEY = "buddha-reservations-v2";

function load(): Reservation[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Reservation[]) : [];
  } catch {
    return [];
  }
}

function save(rows: Reservation[]) {
  localStorage.setItem(KEY, JSON.stringify(rows));
}

export function takenTables(date: string, wave: string) {
  return new Set(load().filter((r) => r.date === date && r.wave === wave).map((r) => r.table_id));
}

export function isTableFree(date: string, wave: string, tableId: string) {
  return !takenTables(date, wave).has(tableId);
}

export function upcomingDates(n = 7) {
  const out: string[] = [];
  const d = new Date();
  for (let i = 0; i < n; i++) {
    const x = new Date(d);
    x.setDate(d.getDate() + i);
    out.push(x.toISOString().slice(0, 10));
  }
  return out;
}

export function formatDateCs(iso: string) {
  const [y, m, day] = iso.split("-").map(Number);
  return new Date(y, m - 1, day).toLocaleDateString("cs-CZ", {
    weekday: "short",
    day: "numeric",
    month: "numeric",
  });
}

export function isPhoneInputAllowed(input: string) {
  const raw = input.trim().replace(/^tel\.?\s*:?\s*/i, "").replace(/[\u00A0\u202F\u2007]/g, " ");
  return /^[+\d().\-\s]+$/.test(raw);
}

export function normalizePhone(input: string): string | null {
  if (!isPhoneInputAllowed(input)) return null;
  let raw = input.trim().replace(/^tel\.?\s*:?\s*/i, "").replace(/[().\-\s]/g, "");
  if (raw.startsWith("00")) raw = "+" + raw.slice(2);
  const plus = raw.startsWith("+");
  const d = raw.replace(/\D+/g, "");
  if (!d) return null;
  if (!plus && d.length === 9) return "+420" + d;
  if (d.length >= 8 && d.length <= 15) return "+" + d;
  return null;
}

export function createReservation(input: {
  date: string;
  wave: WaveId;
  table_id: string;
  party_size: number;
  name: string;
  phone: string;
  email: string;
  note: string;
}): { ok: true; reservation: Reservation; duplicate?: boolean } | { ok: false; code: string } {
  const phone = normalizePhone(input.phone);
  if (!phone) return { ok: false, code: "PHONE_INVALID" };
  const name = input.name.replace(/\s+/g, " ").trim();
  if (name.length < 2) return { ok: false, code: "NAME_INVALID" };
  const email = input.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, code: "EMAIL_INVALID" };
  if (input.party_size < 1 || input.party_size > 8) return { ok: false, code: "PARTY_SIZE" };
  if (input.party_size >= 9) return { ok: false, code: "CALL" };

  const table = tableById(input.table_id);
  if (!table) return { ok: false, code: "TABLE" };
  if (input.party_size > table.max) return { ok: false, code: "TABLE_SMALL" };

  const rows = load();
  const dup = rows.find(
    (r) => r.date === input.date && r.wave === input.wave && r.phone === phone,
  );
  if (dup) return { ok: true, reservation: dup, duplicate: true };

  if (rows.some((r) => r.date === input.date && r.wave === input.wave && r.table_id === table.id)) {
    return { ok: false, code: "TABLE_TAKEN" };
  }

  const reservation: Reservation = {
    id: crypto.randomUUID(),
    date: input.date,
    wave: input.wave,
    table_id: table.id,
    party_size: input.party_size,
    name,
    phone,
    email,
    note: input.note.slice(0, 280),
    status: input.party_size >= 5 ? "new" : "confirmed",
    created_at: new Date().toISOString(),
  };
  rows.push(reservation);
  save(rows);
  return { ok: true, reservation };
}

export function listReservations(date?: string) {
  const rows = load().sort((a, b) => a.wave.localeCompare(b.wave) || a.created_at.localeCompare(b.created_at));
  return date ? rows.filter((r) => r.date === date) : rows;
}

export function setReservationStatus(id: string, status: Reservation["status"]) {
  const rows = load();
  const row = rows.find((r) => r.id === id);
  if (!row) return null;
  row.status = status;
  save(rows);
  return row;
}

export function addWalkIn(input: {
  date: string;
  wave: WaveId;
  table_id: string;
  party_size: number;
  name: string;
  phone?: string;
  note?: string;
}): { ok: true; reservation: Reservation } | { ok: false; code: string } {
  const name = input.name.replace(/\s+/g, " ").trim();
  if (name.length < 2) return { ok: false, code: "NAME_INVALID" };
  if (input.party_size < 1 || input.party_size > 8) return { ok: false, code: "PARTY_SIZE" };
  const table = tableById(input.table_id);
  if (!table) return { ok: false, code: "TABLE" };
  if (input.party_size > table.max) return { ok: false, code: "TABLE_SMALL" };
  const rows = load();
  if (rows.some((r) => r.date === input.date && r.wave === input.wave && r.table_id === table.id && r.status !== "done" && r.status !== "no_show")) {
    return { ok: false, code: "TABLE_TAKEN" };
  }
  const phone = input.phone ? normalizePhone(input.phone) : "+420000000000";
  if (!phone) return { ok: false, code: "PHONE_INVALID" };
  const reservation: Reservation = {
    id: crypto.randomUUID(),
    date: input.date,
    wave: input.wave,
    table_id: table.id,
    party_size: input.party_size,
    name,
    phone,
    email: "walkin@buddha.local",
    note: (input.note ?? "").slice(0, 280),
    status: "seated",
    created_at: new Date().toISOString(),
  };
  rows.push(reservation);
  save(rows);
  return { ok: true, reservation };
}

export function seedShiftDemo(date: string) {
  const rows = load();
  if (rows.some((r) => r.date === date)) return;
  const demo: Reservation[] = [
    {
      id: "demo-v6",
      date,
      wave: "19:30",
      table_id: "V6",
      party_size: 4,
      name: "Novákovi",
      phone: "+420777111222",
      email: "novak@example.cz",
      note: "Dýmka Adalya",
      status: "confirmed",
      created_at: new Date().toISOString(),
    },
    {
      id: "demo-v3",
      date,
      wave: "19:30",
      table_id: "V3",
      party_size: 2,
      name: "Anna",
      phone: "+420608333444",
      email: "anna@example.cz",
      note: "",
      status: "seated",
      created_at: new Date().toISOString(),
    },
    {
      id: "demo-z1",
      date,
      wave: "17:30",
      table_id: "Z1",
      party_size: 2,
      name: "Kuba",
      phone: "+420777555666",
      email: "kuba@example.cz",
      note: "Carcassonne",
      status: "new",
      created_at: new Date().toISOString(),
    },
  ];
  save([...rows, ...demo]);
}
