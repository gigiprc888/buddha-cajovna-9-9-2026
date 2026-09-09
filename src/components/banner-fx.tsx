import { useEffect, useRef } from "react";

type Kind = "tea" | "pipe";

type Puff = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  a: number;
};

function cover(nx: number, ny: number, boxW: number, boxH: number, imgW: number, imgH: number) {
  const ir = imgW / imgH;
  const br = boxW / boxH;
  let w: number;
  let h: number;
  if (br > ir) {
    w = boxW;
    h = boxW / ir;
  } else {
    h = boxH;
    w = boxH * ir;
  }
  const ox = (boxW - w) / 2;
  const oy = (boxH - h) / 2;
  return { x: ox + nx * w, y: oy + ny * h };
}

export function BannerFx({ kind }: { kind: Kind }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const IMG = kind === "tea" ? { w: 1600, h: 900 } : { w: 1600, h: 900 };
    let w = 1;
    let h = 1;
    let hover = false;
    let raf = 0;
    let last = performance.now();
    const puffs: Puff[] = [];
    let drip = 0;

    function resize() {
      const r = parent!.getBoundingClientRect();
      w = Math.max(1, Math.floor(r.width));
      h = Math.max(1, Math.floor(r.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawnSteam(nx: number, ny: number, n: number) {
      const o = cover(nx, ny, w, h, IMG.w, IMG.h);
      for (let i = 0; i < n; i++) {
        puffs.push({
          x: o.x + (Math.random() - 0.5) * 10,
          y: o.y + (Math.random() - 0.5) * 6,
          r: 6 + Math.random() * 10,
          vx: (Math.random() - 0.5) * 8,
          vy: -(18 + Math.random() * 22),
          life: 0,
          max: 0.9 + Math.random() * 0.8,
          a: 0.12 + Math.random() * 0.1,
        });
      }
    }

    function spawnSmoke() {
      const o = cover(0.8, 0.14, w, h, IMG.w, IMG.h);
      puffs.push({
        x: o.x + (Math.random() - 0.5) * 14,
        y: o.y + Math.random() * 8,
        r: 8 + Math.random() * 16,
        vx: (Math.random() - 0.35) * 6,
        vy: -(22 + Math.random() * 28),
        life: 0,
        max: 1.4 + Math.random() * 1.1,
        a: 0.16 + Math.random() * 0.1,
      });
    }

    function drawPour(now: number) {
      const a = cover(0.205, 0.36, w, h, IMG.w, IMG.h);
      const b = cover(0.255, 0.52, w, h, IMG.w, IMG.h);
      const c = cover(0.3, 0.7, w, h, IMG.w, IMG.h);
      ctx!.save();
      ctx!.lineCap = "round";
      const pulse = 1.6 + Math.sin(now / 180) * 0.5;
      const g = ctx!.createLinearGradient(a.x, a.y, c.x, c.y);
      g.addColorStop(0, "rgba(90, 160, 70, 0.95)");
      g.addColorStop(0.55, "rgba(140, 190, 80, 0.88)");
      g.addColorStop(1, "rgba(70, 120, 50, 0.2)");
      ctx!.strokeStyle = g;
      ctx!.lineWidth = pulse;
      ctx!.beginPath();
      ctx!.moveTo(a.x, a.y);
      ctx!.quadraticCurveTo(b.x + 4, b.y, c.x, c.y);
      ctx!.stroke();
      ctx!.strokeStyle = "rgba(210, 230, 160, 0.45)";
      ctx!.lineWidth = pulse * 0.35;
      ctx!.beginPath();
      ctx!.moveTo(a.x - 1, a.y);
      ctx!.quadraticCurveTo(b.x + 2, b.y, c.x - 1, c.y);
      ctx!.stroke();
      ctx!.restore();
    }

    function tick(now: number) {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      ctx!.clearRect(0, 0, w, h);

      if (kind === "tea" && hover) {
        drip += dt;
        if (drip > 0.05) {
          drip = 0;
          spawnSteam(0.32, 0.58, 1);
          spawnSteam(0.55, 0.52, 1);
          if (Math.random() > 0.4) spawnSteam(0.73, 0.5, 1);
        }
        drawPour(now);
      }
      if (kind === "pipe" && hover) {
        drip += dt;
        if (drip > 0.04) {
          drip = 0;
          spawnSmoke();
          if (Math.random() > 0.5) spawnSmoke();
        }
      }

      for (let i = puffs.length - 1; i >= 0; i--) {
        const p = puffs[i];
        p.life += dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.r += 14 * dt;
        p.vx *= 0.99;
        p.vy *= 0.995;
        if (p.life >= p.max) {
          puffs.splice(i, 1);
          continue;
        }
        const t = p.life / p.max;
        const fade = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85;
        ctx!.beginPath();
        ctx!.fillStyle = `rgba(243,236,226,${p.a * fade})`;
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      if (hover || puffs.length) raf = requestAnimationFrame(tick);
      else raf = 0;
    }

    function onEnter() {
      hover = true;
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    }
    function onLeave() {
      hover = false;
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    parent.addEventListener("pointerenter", onEnter);
    parent.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      parent.removeEventListener("pointerenter", onEnter);
      parent.removeEventListener("pointerleave", onLeave);
    };
  }, [kind]);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 z-[3] h-full w-full"
      aria-hidden
    />
  );
}
