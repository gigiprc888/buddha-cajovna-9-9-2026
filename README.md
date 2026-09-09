# Buddha čajovna

Phase 1 web for [Buddha čajovna](https://www.buddhacajovna.cz) — Myslíkova 174/23, Praha 1.

**Scope:** homepage Hybrid 2+1 + Reservations Lite. No e-shop checkout, Comgate, SMS, or CRM in this delivery.

## Stack

TanStack Start · React · Vite · Tailwind v4

## Run

```bash
npm install
npm run dev
```

Preview: `0.0.0.0:8080`

Staff desk PINs (not in git):

```
SHIFT_PIN_OWNER
SHIFT_PIN_STAFF
```

## Review map

| Path | What |
|---|---|
| `src/routes/index.tsx` | Homepage |
| `src/routes/rezervace.tsx` | Reservation flow + table picker |
| `src/lib/reservations.ts` | Phone normalize, capacity, duplicates |
| `src/routes/smena.tsx` | Staff desk |
| `src/lib/board.ts` | Noticeboard seed + RSS source |
| `public/rss.xml` | Public RSS of Čaj & akce |
| `src/lib/copy.ts` | CS / EN copy |
| `src/styles.css` | Theme, lamp, gold frames |
| `src/components/` | Chrome, mosaic, nástěnka, matcha, HH |
| `vite.config.ts` | Vite + TanStack Start |

Staff desk: `/smena`

## GitHub export (2026-09-09)

Complete Phase 1 source for review and Railway: `package.json`, lockfile, Vite/TS/ESLint configs, `src/routes`, `src/components`, `src/lib`, `scripts`, `server`, and used `public` assets.

Design is frozen (Hybrid 2+1 + Reservations Lite). This dump does not rewrite UI.

Staff PINs are environment variables, not in git.
