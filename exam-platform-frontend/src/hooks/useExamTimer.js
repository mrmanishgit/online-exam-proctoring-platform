import { useEffect, useRef, useState } from "react";

/**
 * Countdown timer. Pass duration in seconds.
 * onExpire is called once when the timer reaches zero.
 */
export default function useExamTimer(durationSeconds = 0, { autoStart = false, onExpire } = {}) {
  const [remainingSeconds, setRemainingSeconds] = useState(Math.max(0, Number(durationSeconds) || 0));
  const [isRunning, setIsRunning] = useState(autoStart);
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);

  useEffect(() => { onExpireRef.current = onExpire; }, [onExpire]);

  useEffect(() => {
    setRemainingSeconds(Math.max(0, Number(durationSeconds) || 0));
    expiredRef.current = false;
  }, [durationSeconds]);

  useEffect(() => {
    if (!isRunning) return undefined;
    if (remainingSeconds <= 0) {
      if (!expiredRef.current) {
        expiredRef.current = true;
        onExpireRef.current?.();
      }
      setIsRunning(false);
      return undefined;
    }
    const timerId = window.setTimeout(() => {
      setRemainingSeconds((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearTimeout(timerId);
  }, [isRunning, remainingSeconds]);

  const start = () => {
    if (remainingSeconds > 0) {
      expiredRef.current = false;
      setIsRunning(true);
    }
  };
  const pause = () => setIsRunning(false);
  const reset = (seconds = durationSeconds) => {
    setRemainingSeconds(Math.max(0, Number(seconds) || 0));
    expiredRef.current = false;
    setIsRunning(false);
  };

  return { remainingSeconds, isRunning, start, pause, reset, setRemainingSeconds };
}
