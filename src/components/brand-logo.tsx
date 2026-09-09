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
        <img src="/logo.svg?v=gold" alt="" className="relative z-[1] size-full contrast-125" />
      </span>
      <span className="leading-[1.02]">
        <span className="block font-serif text-[1.45rem] font-semibold tracking-[0.06em] text-ivory uppercase md:text-[1.95rem]">
          Buddha
        </span>
        <span className="block font-serif text-[0.78rem] font-semibold tracking-[0.08em] text-gold uppercase md:text-[0.92rem]">
          Čajovna · Praha
        </span>
        <span
          className={
            compact
              ? "mt-1 flex items-baseline gap-1.5 text-[9px] tracking-[0.08em] text-ivory/80 uppercase"
              : "mt-1 flex items-baseline gap-1.5 text-[10px] tracking-[0.08em] text-ivory/85 uppercase sm:text-[11px]"
          }
        >
          <span>Tea House</span>
          <span className="font-serif text-[0.95em] font-semibold tracking-normal text-gold lowercase" aria-hidden>
            &
          </span>
          <span>Shisha Lounge</span>
        </span>
      </span>
    </Link>
  );
}
