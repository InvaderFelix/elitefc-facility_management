import { useEffect } from "react";

/* Runs `handler` when Escape is pressed while mounted. */
export function useEscapeKey(handler: () => void) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handler();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [handler]);
}
