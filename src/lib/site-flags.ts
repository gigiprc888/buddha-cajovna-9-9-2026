const KEY = "buddha.flags.v1";

export type SiteFlags = {
  shopLive: boolean;
};

const DEFAULTS: SiteFlags = { shopLive: false };
const listeners = new Set<() => void>();

function read(): SiteFlags {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

function write(next: SiteFlags) {
  localStorage.setItem(KEY, JSON.stringify(next));
  listeners.forEach((fn) => fn());
}

export function getFlags(): SiteFlags {
  return read();
}

export function isShopLive(): boolean {
  return read().shopLive;
}

export function setShopLive(on: boolean) {
  write({ ...read(), shopLive: on });
}

export function subscribeFlags(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
