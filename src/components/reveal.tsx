import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [pending, setPending] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOn(true);
      return;
    }
    const visible = () => {
      const r = el.getBoundingClientRect();
      return r.bottom > 24 && r.top < (window.innerHeight || 800) - 24;
    };
    if (visible()) {
      setOn(true);
      return;
    }
    setPending(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setPending(false);
        setOn(true);
        io.disconnect();
      },
      { threshold: 0.01, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal-root ${pending ? "pending" : ""} ${on ? "is-in" : ""} ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
