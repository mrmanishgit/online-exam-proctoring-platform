import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import authService from "../services/authService";
import { ROLES } from "../utils/constants";

const AuthContext = createContext(null);
const USER_KEY = "exampilot_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch {
      localStorage.removeItem(USER_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    const response = await authService.login(credentials);
    const loggedInUser = response.user;

    if (!loggedInUser) {
      throw new Error("Login response did not include a user.");
    }

    setUser(loggedInUser);

    try {
      localStorage.setItem(USER_KEY, JSON.stringify(loggedInUser));
    } catch {
      // The current session remains usable if storage is unavailable.
    }

    return loggedInUser;
  }, []);

  const register = useCallback(async (details) => {
    return authService.register(details);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      try {
        localStorage.removeItem(USER_KEY);
      } catch {
        // Ignore unavailable local storage.
      }
    }
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((current) => {
      if (!current) return current;

      const updated = { ...current, ...updates };

      try {
        localStorage.setItem(USER_KEY, JSON.stringify(updated));
      } catch {
        // Ignore unavailable local storage.
      }

      return updated;
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      role: user?.role ?? null,
      login,
      register,
      logout,
      updateUser,
      roles: ROLES,
    }),
    [user, isLoading, login, register, logout, updateUser]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }

  return context;
}