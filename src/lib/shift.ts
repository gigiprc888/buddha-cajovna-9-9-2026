export type ShiftRole = "owner" | "staff";

export type ShiftSession = {
  role: ShiftRole;
  name: string;
  at: string;
};

const KEY = "buddha-shift";

export const SHIFT_PINS: Record<ShiftRole, { pin: string; name: string; label: string }> = {
  owner: { pin: "1742", name: "Aleš", label: "Majitel" },
  staff: { pin: "2225", name: "Čajovník", label: "Čajovník" },
};

export function readShift(): ShiftSession | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ShiftSession) : null;
  } catch {
    return null;
  }
}

export function startShift(role: ShiftRole): ShiftSession {
  const meta = SHIFT_PINS[role];
  const session: ShiftSession = { role, name: meta.name, at: new Date().toISOString() };
  localStorage.setItem(KEY, JSON.stringify(session));
  return session;
}

export function endShift() {
  localStorage.removeItem(KEY);
}

export function checkPin(role: ShiftRole, pin: string) {
  return pin === SHIFT_PINS[role].pin;
}
