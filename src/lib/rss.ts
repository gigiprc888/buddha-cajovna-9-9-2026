import { SEED, type Pin } from "@/lib/board";

const SITE = "https://www.buddhacajovna.cz";

const PUB: Record<string, string> = {
  n0: "2026-09-01T13:00:00+02:00",
  n0b: "2026-09-08T10:00:00+02:00",
  n0c: "2026-09-08T10:30:00+02:00",
  n1: "2026-09-09T09:00:00+02:00",
  n2: "2026-09-03T17:00:00+02:00",
  n3: "2026-09-07T14:00:00+02:00",
};

function esc(s: string) {
  return s
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, """);
}

function rfc822(iso: string) {
  return new Date(iso).toUTCString();
}

export function newsPins(): Pin[] {
  return SEED.filter((p) => p.lane === "news");
}

export function boardRssXml() {
  const items = newsPins()
    .map((p) => {
      const iso = PUB[p.id] ?? "2026-09-09T12:00:00+02:00";
      const link = `${SITE}/#nastenka`;
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="false">${esc(p.id)}</guid>
      <pubDate>${rfc822(iso)}</pubDate>
      <category>${esc(p.tag ?? "nástěnka")}</category>
      <description>${esc(p.body)}</description>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Buddha čajovna — nástěnka</title>
    <link>${SITE}/#nastenka</link>
    <description>Čaj, akce a provozní lístky z nástěnky čajovny Buddha. Myslíkova 174/23, Praha 1.</description>
    <language>cs</language>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
}
