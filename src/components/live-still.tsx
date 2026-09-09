import { useEffect, useRef, useState } from "react";
import { Pic } from "@/components/pic";

type Props = {
  src: string;
  poster: string;
  alt: string;
  className?: string;
  videoClassName?: string;
  priority?: boolean;
};

export function LiveStill({ src, poster, alt, className, videoClassName, priority }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const video = ref.current;
    const root = box.current;
    if (!video || !root) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const play = () => {
      if (mq.matches) {
        video.pause();
        return;
      }
      video.preload = "auto";
      const p = video.play();
      if (p) p.then(() => setOn(true)).catch(() => {});
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) play();
        else video.pause();
      },
      { rootMargin: "120px", threshold: 0.12 },
    );
    io.observe(root);
    mq.addEventListener("change", play);
    const vis = () => {
      if (document.hidden) video.pause();
      else if (!mq.matches && !video.paused) play();
    };
    document.addEventListener("visibilitychange", vis);
    return () => {
      io.disconnect();
      mq.removeEventListener("change", play);
      document.removeEventListener("visibilitychange", vis);
    };
  }, [src]);

  const media = videoClassName ?? "h-full w-full object-cover";
  const positioned = /\b(absolute|fixed|relative)\b/.test(className ?? "");

  return (
    <div ref={box} className={`${positioned ? "" : "relative"} overflow-hidden ${className ?? ""}`}>
      <Pic
        src={poster}
        alt=""
        priority={priority}
        className={`${media} absolute inset-0 size-full max-w-none ${on ? "opacity-0" : "opacity-100"}`}
      />
      <video
        ref={ref}
        className={`${media} absolute inset-0 z-[1] size-full max-w-none`}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={alt}
        onPlaying={() => setOn(true)}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
