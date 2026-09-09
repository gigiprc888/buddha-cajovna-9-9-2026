import { Link } from "@tanstack/react-router";

type Props = { compact?: boolean };

export function BrandLogo({ compact }: Props) {
  return (
    <Link
      to="/"
      className="logo-lockup flex items-center gap-3 rounded-full bg-bg py-0.5 pr-3 text-ivory"
      aria-label="Buddha čajovna · Tea House & Shisha Lounge"
    >
      <span
        className={
          compact
            ? "logo-mark relative inline-grid size-10 place-items-center bg-bg"
            : "logo-mark relative inline-grid size-9 shrink-0 place-items-center bg-bg md:size-[3.25rem]"
        }
      >
        <span className="logo-glow" aria-hidden />
        <img src="/logo.svg?v=gold" alt="" className="relative z-[1] size-full" />
      </span>
      <span className="leading-[1.02]">
        <span className="block font-serif text-[1.15rem] font-semibold tracking-[0.16em] text-ivory uppercase md:text-[1.55rem]">
          Buddha
        </span>
        <span className="block font-serif text-[0.82rem] font-semibold tracking-[0.2em] text-gold uppercase md:text-[1rem]">
          Čajovna · Praha
        </span>
        <span
          className={
            compact
              ? "mt-0.5 block text-[8px] tracking-[0.18em] text-muted uppercase"
              : "mt-0.5 block text-[8px] tracking-[0.2em] text-muted uppercase sm:text-[9px] sm:tracking-[0.22em]"
          }
        >
          Tea House & Shisha Lounge
        </span>
      </span>
    </Link>
  );
}
