import { useEffect, useRef, useState } from "react";

/**
 * Debounced autosave hook.
 * saveFn receives the latest value. It should return a promise or a value.
 */
export default function useAutoSave(value, saveFn, { delay = 1500, enabled = true } = {}) {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const saveRef = useRef(saveFn);
  const firstRender = useRef(true);

  useEffect(() => { saveRef.current = saveFn; }, [saveFn]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return undefined;
    }
    if (!enabled || typeof saveRef.current !== "function") return undefined;

    let cancelled = false;
    setStatus("pending");
    const timer = window.setTimeout(async () => {
      try {
        await saveRef.current(value);
        if (!cancelled) {
          setStatus("saved");
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setStatus("error");
          setError(err);
        }
      }
    }, delay);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [value, delay, enabled]);

  return { status, error };
}
