import { useEffect, type RefObject } from "react";

/** Calls `onOutside` on any pointer-down outside `ref`'s element(s), while `active`. */
export function useClickOutside(
  ref: RefObject<HTMLElement | null> | readonly RefObject<HTMLElement | null>[],
  active: boolean,
  onOutside: () => void,
) {
  useEffect(() => {
    if (!active) return;
    const refs = Array.isArray(ref) ? ref : [ref];
    function handle(e: MouseEvent) {
      const target = e.target as Node;
      if (refs.every((r) => !r.current || !r.current.contains(target))) {
        onOutside();
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [active, ref, onOutside]);
}
