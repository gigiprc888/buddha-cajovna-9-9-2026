#!/usr/bin/env node
import { mkdir, readdir, rm, stat } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const ROOT = "/workspace";
const OUT = join(ROOT, "backups");
const KEEP = 7;
const INCLUDE = [
  "src",
  "public",
  "scripts",
  "migrations",
  "server",
  "package.json",
  "package-lock.json",
  "vite.config.ts",
  "tsconfig.json",
  "eslint.config.mjs",
  "startup.sh",
  "AGENTS.md",
];

function stamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}`;
}

async function prune(dir) {
  const names = (await readdir(dir))
    .filter((n) => n.startsWith("buddha-") && n.endsWith(".tar.gz"))
    .sort();
  const extra = names.slice(0, Math.max(0, names.length - KEEP));
  for (const n of extra) await rm(join(dir, n), { force: true });
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const name = `buddha-${stamp()}.tar.gz`;
  const dest = join(OUT, name);
  const args = ["-czf", dest, "-C", ROOT];
  for (const item of INCLUDE) {
    try {
      await stat(join(ROOT, item));
      args.push(item);
    } catch {
      /* skip missing */
    }
  }
  const run = spawnSync("tar", args, { stdio: "inherit" });
  if (run.status !== 0) process.exit(run.status ?? 1);
  await prune(OUT);
  const size = (await stat(dest)).size;
  console.log(`backup ${name} (${Math.round(size / 1024)} KB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
