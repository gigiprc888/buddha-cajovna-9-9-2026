# Buddha čajovna

Phase 1 web for Buddha čajovna — Myslíkova 174/23, Praha 1.

**Scope:** homepage Hybrid 2+1 + Reservations Lite. No e-shop checkout, Comgate, SMS, or CRM in this delivery.

## Stack

TanStack Start · React · Vite · Tailwind v4

## Run

```bash
npm install
npm run dev
```

Preview: `0.0.0.0:8080`

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

Staff desk: `/smena`
