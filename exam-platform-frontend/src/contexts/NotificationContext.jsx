import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback(
    ({ message, severity = "info", duration = 4000 }) => {
      const id = `${Date.now()}-${Math.random()}`;

      setNotifications((previous) => [
        ...previous,
        { id, message, severity },
      ]);

      if (duration > 0) {
        setTimeout(() => {
          setNotifications((previous) =>
            previous.filter((item) => item.id !== id)
          );
        }, duration);
      }

      return id;
    },
    []
  );

  const removeNotification = useCallback((id) => {
    setNotifications((previous) =>
      previous.filter((item) => item.id !== id)
    );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      addNotification,
      removeNotification,
      clearNotifications,
    }),
    [
      notifications,
      addNotification,
      removeNotification,
      clearNotifications,
    ]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotificationContext must be used inside NotificationProvider"
    );
  }

  return context;
}