import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const ThemeContext = createContext(null);

export function ThemeProviderContext({ children }) {
  const [mode, setMode] = useState(() => {
    try {
      return localStorage.getItem("exampilot_theme") || "light";
    } catch {
      return "light";
    }
  });

  const toggleTheme = useCallback(() => {
    setMode((current) => {
      const next = current === "light" ? "dark" : "light";

      try {
        localStorage.setItem("exampilot_theme", next);
      } catch {
        // Theme switching still works for the current session.
      }

      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ mode, setMode, toggleTheme }),
    [mode, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useCustomTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useCustomTheme must be used inside ThemeProviderContext"
    );
  }

  return context;
}