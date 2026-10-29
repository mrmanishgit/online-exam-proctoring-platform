import { useCallback, useEffect, useRef, useState } from "react";

export default function useProctoring({ enabled = false, onEvent } = {}) {
  const [events, setEvents] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));
  const callbackRef = useRef(onEvent);
  useEffect(() => { callbackRef.current = onEvent; }, [onEvent]);

  const recordEvent = useCallback((type, details = {}) => {
    const event = { id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, type, details, timestamp: new Date().toISOString() };
    setEvents((current) => [...current, event]);
    callbackRef.current?.(event);
    return event;
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;
    const fullscreenHandler = () => {
      const active = Boolean(document.fullscreenElement);
      setIsFullscreen(active);
      if (!active) recordEvent("FULLSCREEN_EXIT");
    };
    const visibilityHandler = () => {
      if (document.hidden) recordEvent("TAB_HIDDEN");
    };
    document.addEventListener("fullscreenchange", fullscreenHandler);
    document.addEventListener("visibilitychange", visibilityHandler);
    return () => {
      document.removeEventListener("fullscreenchange", fullscreenHandler);
      document.removeEventListener("visibilitychange", visibilityHandler);
    };
  }, [enabled, recordEvent]);

  const clearEvents = useCallback(() => setEvents([]), []);
  return { events, isFullscreen, recordEvent, clearEvents };
}
