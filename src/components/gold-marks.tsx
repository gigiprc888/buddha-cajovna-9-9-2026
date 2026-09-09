const MAP: Record<string, { base: string; kind: "acute" | "caron" | "ring" }> = {
  á: { base: "a", kind: "acute" },
  Á: { base: "A", kind: "acute" },
  é: { base: "e", kind: "acute" },
  É: { base: "E", kind: "acute" },
  í: { base: "i", kind: "acute" },
  Í: { base: "I", kind: "acute" },
  ó: { base: "o", kind: "acute" },
  Ó: { base: "O", kind: "acute" },
  ú: { base: "u", kind: "acute" },
  Ú: { base: "U", kind: "acute" },
  ý: { base: "y", kind: "acute" },
  Ý: { base: "Y", kind: "acute" },
  ů: { base: "u", kind: "ring" },
  Ů: { base: "U", kind: "ring" },
  č: { base: "c", kind: "caron" },
  Č: { base: "C", kind: "caron" },
  ď: { base: "d", kind: "caron" },
  Ď: { base: "D", kind: "caron" },
  ě: { base: "e", kind: "caron" },
  Ě: { base: "E", kind: "caron" },
  ň: { base: "n", kind: "caron" },
  Ň: { base: "N", kind: "caron" },
  ř: { base: "r", kind: "caron" },
  Ř: { base: "R", kind: "caron" },
  š: { base: "s", kind: "caron" },
  Š: { base: "S", kind: "caron" },
  ť: { base: "t", kind: "caron" },
  Ť: { base: "T", kind: "caron" },
  ž: { base: "z", kind: "caron" },
  Ž: { base: "Z", kind: "caron" },
};

function Mark({ kind }: { kind: "acute" | "caron" | "ring" }) {
  if (kind === "caron") {
    return (
      <svg className="royal-mark royal-caron" viewBox="0 0 24 12" aria-hidden>
        <path d="M3 10 L12 2.5 L21 10" />
      </svg>
    );
  }
  if (kind === "ring") {
    return (
      <svg className="royal-mark royal-ring" viewBox="0 0 12 12" aria-hidden>
        <circle cx="6" cy="6" r="3.4" />
      </svg>
    );
  }
  return (
    <svg className="royal-mark royal-acute" viewBox="0 0 10 16" aria-hidden>
      <path d="M2.5 14 L7.5 2" />
    </svg>
  );
}

export function GoldMarks({ text }: { text: string }) {
  return (
    <>
      {[...text].map((ch, i) => {
        if (ch === "\n") return <br key={i} />;
        const m = MAP[ch];
        if (!m) return ch;
        return (
          <span key={i} className="royal-letter">
            {m.base}
            <Mark kind={m.kind} />
          </span>
        );
      })}
    </>
  );
}
