import { useEffect, useRef } from "react";

/** Image-space origins on hero.jpg. Zoom matches the hero video scale. */
const SOURCES = [
  { x: 0.305, y: 0.695, spread: 8, lift: 28, rate: 0.05, alpha: 0.18 },
  { x: 0.392, y: 0.728, spread: 5, lift: 18, rate: 0.07, alpha: 0.2 },
  { x: 0.448, y: 0.748, spread: 5, lift: 17, rate: 0.07, alpha: 0.2 },
];

const POS = { x: 0.38, y: 0.78 };
const ZOOM = 1.55;

type Src = (typeof SOURCES)[number] & { px: number; py: number; acc: number };

type Puff = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  wobble: number;
  phase: number;
  alpha: number;
};

function coverMap(
  imgW: number,
  imgH: number,
  boxW: number,
  boxH: number,
  nx: number,
  ny: number,
) {
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
  const ox = (boxW - w) * POS.x;
  const oy = (boxH - h) * POS.y;
  const x = ox + nx * w;
  const y = oy + ny * h;
  const cx = boxW * POS.x;
  const cy = boxH * POS.y;
  return { x: cx + (x - cx) * ZOOM, y: cy + (y - cy) * ZOOM };
}

export function TeaSteam() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const IMG_W = 1792;
    const IMG_H = 1008;
    let w = 1;
    let h = 1;
    let origins: Src[] = SOURCES.map((s) => ({ ...s, px: 0, py: 0, acc: 0 }));
    const puffs: Puff[] = [];
    let raf = 0;
    let last = performance.now();

    function resize() {
      const rect = parent!.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      origins = SOURCES.map((s, i) => {
        const p = coverMap(IMG_W, IMG_H, w, h, s.x, s.y);
        return { ...s, px: p.x, py: p.y, acc: origins[i]?.acc ?? 0 };
      });
    }

    function spawn(s: Src): Puff {
      const cup = s.lift < 24;
      return {
        x: s.px + (Math.random() - 0.5) * s.spread,
        y: s.py + (Math.random() - 0.25) * 4,
        r: (cup ? 4 : 6) + Math.random() * (cup ? 6 : 8),
        vx: (Math.random() - 0.5) * 1.4,
        vy: -(s.lift + 8 + Math.random() * (cup ? 14 : 22)),
        life: 0,
        max: (cup ? 2.4 : 3.2) + Math.random() * 1.8,
        wobble: 0.22 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
        alpha: s.alpha,
      };
    }

    function frame(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      for (const s of origins) {
        s.acc += dt;
        while (s.acc > s.rate) {
          s.acc -= s.rate;
          if (puffs.length < 110) puffs.push(spawn(s));
        }
      }

      ctx!.clearRect(0, 0, w, h);
      for (let i = puffs.length - 1; i >= 0; i--) {
        const p = puffs[i];
        p.life += dt;
        p.x += (p.vx + Math.sin(p.life * 1.4 + p.phase) * p.wobble * 4) * dt;
        p.y += Math.min(p.vy, -10) * dt;
        p.r += 8 * dt;
        p.vy *= 0.995;
        const t = p.life / p.max;
        if (t >= 1) {
          puffs.splice(i, 1);
          continue;
        }
        const fade = Math.sin(t * Math.PI);
        const a = fade * p.alpha;
        const g = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, `rgba(243, 236, 226, ${a})`);
        g.addColorStop(0.45, `rgba(212, 180, 131, ${a * 0.3})`);
        g.addColorStop(1, "rgba(243, 236, 226, 0)");
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.ellipse(p.x, p.y, p.r * 0.4, p.r * 1.2, 0, 0, Math.PI * 2);
        ctx!.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    resize();
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 z-[3]"
      aria-hidden
    />
  );
}
