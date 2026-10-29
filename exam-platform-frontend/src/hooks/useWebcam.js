import { useCallback, useEffect, useRef, useState } from "react";

export default function useWebcam({ video = true, audio = false } = {}) {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [isStarting, setIsStarting] = useState(false);
  const videoRef = useRef(null);

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError(new Error("Camera access is not supported by this browser."));
      return null;
    }
    setIsStarting(true);
    setError(null);
    try {
      const media = await navigator.mediaDevices.getUserMedia({ video, audio });
      setStream(media);
      if (videoRef.current) videoRef.current.srcObject = media;
      return media;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setIsStarting(false);
    }
  }, [video, audio]);

  const stop = useCallback(() => {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
    if (videoRef.current) videoRef.current.srcObject = null;
  }, [stream]);

  useEffect(() => () => stream?.getTracks().forEach((track) => track.stop()), [stream]);

  return { stream, videoRef, error, isStarting, isActive: Boolean(stream?.getVideoTracks().some((t) => t.readyState === "live")), start, stop };
}
