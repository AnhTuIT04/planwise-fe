import { useEffect } from "react";

export function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler();
    };

    // Use click so inner element click handlers run first and can prevent the outside click handler if needed.
    document.addEventListener("click", listener);
    return () => document.removeEventListener("click", listener);
  }, [ref, handler]);
}
