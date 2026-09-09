const PATHS: Record<string, string> = {
  bang: "M8 16c4-6 12-8 16-2 2-4 8-4 10 0 0 4-4 7-10 7H14c-5 0-6-3-6-5Zm4 7h16v3H12v-3Z",
  scrabble: "M7 7h14v14H7V7Zm3 3h8v8h-8V10Z",
  "cajova-zahrada": "M12 20c6-1 10-6 11-13-6 1-11 6-11 13Zm3-9c2-1 5-3 6-6",
  "bily-hrad": "M6 20V10l3-3 3 2 3-4 3 4 3-2 3 3v10H6Zm5-6h4v6h-4v-6Z",
  "bily-hrad-matcha": "M6 20V11l4-3 3 2 3-3 3 3 3-2 2 3v9H6Zm14-2c2-4-1-6-4-6",
  carcassonne: "M12 20c0-5 8-5 8 0H12Zm4-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  "carcassonne-cirkus": "M4 18h20M6 18l8-12 8 12M8 18v3h12v-3",
  cyclades: "M4 16c3-2 6-2 8 0 3-3 7-3 10 0M5 20h18M8 16l4-8 4 3 3-5",
  "kryci-jmena": "M6 7h10v14H6V7Zm6 2h10v14H12V9Z",
  "milostny-dopis": "M5 8h18v12H5V8Zm0 0 9 7 9-7",
  "monumenty-veku": "M10 20V8l4-4 4 4v12H10Zm-4 0h16",
  munchkin: "M8 20V8l6-4 6 4v12H8Zm4-8h4v8h-4v-8Z",
  radlands: "M4 18h20M6 18c3-8 13-8 16 0M12 8l2 3 2-3",
  "sky-team": "M4 13h20l-6 3H10l-6-3Zm8-7 2 7 2-7",
  "vybusna-kotatka": "M8 14c0 5 8 5 8 0 0-4-2-6-4-6s-4 2-4 6Zm2-7 2 2 2-2M9 15h6",
  "maximalni-warp": "M12 4v4M12 16v4M4 12h4M16 12h4M7 7l3 3M14 14l3 3M17 7l-3 3M10 14l-3 3",
  paladinove: "M12 4 6 8v6c0 5 6 8 6 8s6-3 6-8V8l-6-4Z",
  "paladinove-sidla": "M5 20V12l7-6 7 6v8H5Zm5-6h4v6h-4v-6Z",
  dzin: "M10 20h8M12 16c-4-3-3-7 0-8 4 0 5 4 1 6l3 2",
  "galakticke-aliance": "M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm-8 8h16M12 4c3 4 3 12 0 16-3-4-3-12 0-16",
  "dorfromantik-sakura": "M12 13c0-5 8-4 6 1-4 1-6 4-6-1Zm-4-1c-3-3 2-7 4-3-1 2-3 4-4 3Zm8 0c3-3-2-7-4-3 1 2 3 4 4 3ZM12 14v6",
  naisi: "M5 12c4-5 14-5 18 0-4 5-14 5-18 0Zm14 0a2 2 0 1 1-2-2",
  seti: "M6 16c6-8 14-8 16 0M8 16h12M12 4v6m-4 6h8",
  vladci: "M5 10 8 6l4 4 4-4 3 4v2H5v-2Zm1 8h12v2H6v-2Z",
  catan: "M12 4 20 9v8l-8 5-8-5V9l8-5Z",
  "port-royal": "M12 4v16M6 12h12M8 8h8M8 16h8M12 4 7 8M12 4l5 4",
  "tash-kalar": "M12 4 8 12l4 8 4-8-4-8Zm0 4 2 4-2 4-2-4 2-4Z",
  civilization: "M6 20V8h3v12H6Zm9 0V8h3v12h-3ZM4 8h16M8 4h8v4H8V4Z",
};

export function GameMark({ id, name }: { id: string; name: string }) {
  const d = PATHS[id] ?? "M8 8h8v8H8V8Z";
  return (
    <span
      className="grid size-14 shrink-0 place-items-center rounded-lg border border-gold/40 bg-bg text-gold"
      aria-hidden
      title={name}
    >
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d={d} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
