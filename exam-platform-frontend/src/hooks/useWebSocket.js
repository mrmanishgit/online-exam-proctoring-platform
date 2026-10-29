import { useCallback, useEffect, useRef, useState } from "react";

export default function useWebSocket(url, { protocols, onMessage, shouldReconnect = true, reconnectDelay = 2000 } = {}) {
  const socketRef = useRef(null);
  const reconnectTimer = useRef(null);
  const callbacks = useRef({ onMessage, shouldReconnect, reconnectDelay });
  const [readyState, setReadyState] = useState(WebSocket.CLOSED);
  const [lastMessage, setLastMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => { callbacks.current = { onMessage, shouldReconnect, reconnectDelay }; }, [onMessage, shouldReconnect, reconnectDelay]);

  useEffect(() => {
    if (!url) return undefined;
    let disposed = false;

    const connect = () => {
      if (disposed) return;
      let socket;
      try { socket = new WebSocket(url, protocols); }
      catch (err) { setError(err); return; }
      socketRef.current = socket;
      setReadyState(socket.readyState);
      socket.onopen = () => setReadyState(socket.readyState);
      socket.onmessage = (event) => {
        setLastMessage(event);
        callbacks.current.onMessage?.(event);
      };
      socket.onerror = (event) => setError(event);
      socket.onclose = () => {
        setReadyState(WebSocket.CLOSED);
        if (!disposed && callbacks.current.shouldReconnect) {
          reconnectTimer.current = window.setTimeout(connect, callbacks.current.reconnectDelay);
        }
      };
    };

    connect();
    return () => {
      disposed = true;
      window.clearTimeout(reconnectTimer.current);
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [url, protocols]);

  const sendMessage = useCallback((data) => {
    const socket = socketRef.current;
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(typeof data === "string" ? data : JSON.stringify(data));
      return true;
    }
    return false;
  }, []);

  const disconnect = useCallback(() => {
    window.clearTimeout(reconnectTimer.current);
    socketRef.current?.close();
  }, []);

  return { readyState, lastMessage, error, sendMessage, disconnect, isConnected: readyState === WebSocket.OPEN };
}
