import { useCallback, useEffect, useState } from "react";

export default function useFullscreen(targetRef) {
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));
  const [error, setError] = useState(null);

  useEffect(() => {
    const update = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, []);

  const enter = useCallback(async () => {
    const element = targetRef?.current ?? document.documentElement;
    try {
      if (element.requestFullscreen) await element.requestFullscreen();
      else throw new Error("Fullscreen mode is not supported.");
      setError(null);
    } catch (err) { setError(err); }
  }, [targetRef]);

  const exit = useCallback(async () => {
    try {
      if (document.fullscreenElement && document.exitFullscreen) await document.exitFullscreen();
      setError(null);
    } catch (err) { setError(err); }
  }, []);

  const toggle = useCallback(() => isFullscreen ? exit() : enter(), [isFullscreen, enter, exit]);
  return { isFullscreen, error, enter, exit, toggle };
}
