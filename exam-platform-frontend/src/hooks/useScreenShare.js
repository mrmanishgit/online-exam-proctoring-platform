import { useCallback, useEffect, useState } from "react";

export default function useScreenShare() {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);

  const stop = useCallback(() => {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
  }, [stream]);

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      setError(new Error("Screen sharing is not supported by this browser."));
      return null;
    }
    setError(null);
    try {
      const media = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      media.getVideoTracks()[0]?.addEventListener("ended", () => setStream(null), { once: true });
      setStream(media);
      return media;
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  useEffect(() => () => stream?.getTracks().forEach((track) => track.stop()), [stream]);

  return { stream, error, isSharing: Boolean(stream?.getVideoTracks().some((track) => track.readyState === "live")), start, stop };
}
