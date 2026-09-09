import { useEffect } from "react";

/** Native scroll only. Magnetic snap felt like the page was fighting the user. */
export function useSectionSnap() {
  useEffect(() => {
    document.documentElement.classList.remove("snap-page");
  }, []);
}
