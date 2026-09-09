type Name = "reservation_started" | "reservation_completed" | "phone_click" | "optimateo_credit_click";

export function track(name: Name, props?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;
  const payload = { event: name, ...props, at: Date.now() };
  try {
    const w = window as Window & { dataLayer?: unknown[] };
    w.dataLayer = w.dataLayer ?? [];
    w.dataLayer.push(payload);
  } catch {
    /* ignore */
  }
}

export function onPhoneClick() {
  track("phone_click");
}
