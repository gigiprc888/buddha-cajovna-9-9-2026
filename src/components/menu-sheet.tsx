import { useEffect, useState } from "react";

export function MenuSheet() {
  const [html, setHtml] = useState("");
  const [err, setErr] = useState(false);

  useEffect(() => {
    fetch("/menu/current.html")
      .then((r) => {
        if (!r.ok) throw new Error("menu");
        return r.text();
      })
      .then((raw) => {
        const body = raw.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        setHtml(body ? body[1] : raw);
      })
      .catch(() => setErr(true));
  }, []);

  if (err) {
    return (
      <a href="/menu/current.html" className="block rounded-card border border-gold/30 bg-ivory p-8 text-center text-bg">
        Otevřít lístek
      </a>
    );
  }

  return (
    <div className="overflow-hidden rounded-card border border-gold/30 bg-[#f6f1e8] text-[#1a1612]">
      {html ? (
        <div className="menu-sheet px-5 py-8 md:px-10" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <p className="p-10 text-center text-sm text-[#5a4e40]">Načítám lístek…</p>
      )}
      <p className="border-t border-[#e4d8c4] px-5 py-3 text-center text-[11px] text-[#5a4e40]">
        <a href="/menu/current.html" className="underline">
          Otevřít celý dokument
        </a>
      </p>
    </div>
  );
}
