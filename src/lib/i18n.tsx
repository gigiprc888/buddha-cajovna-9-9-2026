import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { COPY, type Locale } from "@/lib/copy";

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
};

const I18nCtx = createContext<Ctx | null>(null);
const KEY = "buddha-lang";

function detect(): Locale {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "en" || saved === "cs") return saved;
  } catch {
    /* ignore */
  }
  const primary = (typeof navigator !== "undefined" ? navigator.language : "cs").toLowerCase();
  return primary.startsWith("en") ? "en" : "cs";
}

function read(dict: Record<string, unknown>, path: string): string {
  const val = path.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in (acc as object)) return (acc as Record<string, unknown>)[part];
    return undefined;
  }, dict);
  return typeof val === "string" ? val : path;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("cs");

  useEffect(() => {
    const next = detect();
    setLocaleState(next);
    document.documentElement.lang = next;
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<Ctx>(() => {
    const dict = COPY[locale] as Record<string, unknown>;
    return {
      locale,
      setLocale: (l) => {
        try {
          localStorage.setItem(KEY, l);
        } catch {
          /* ignore */
        }
        setLocaleState(l);
        document.documentElement.lang = l;
      },
      t: (key) => read(dict, key),
    };
  }, [locale]);

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("i18n");
  return ctx;
}
