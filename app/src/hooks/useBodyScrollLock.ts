import { useEffect } from "react";

/* Locks page scroll while `active` (defaults to the component's lifetime). */
export function useBodyScrollLock(active = true) {
  useEffect(() => {
    if (!active) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [active]);
}
