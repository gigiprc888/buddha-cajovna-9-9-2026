import type { ImgHTMLAttributes } from "react";

type Props = ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean };

export function Pic({ priority, alt = "", className, ...rest }: Props) {
  return (
    <img
      {...rest}
      alt={alt}
      className={className}
      decoding="async"
      loading="eager"
      fetchPriority={priority ? "high" : "auto"}
    />
  );
}
